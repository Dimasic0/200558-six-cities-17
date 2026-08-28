import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { configureMockStore } from '@jedmao/redux-mock-store';
import { Header } from './header';
import { Address, NameReducer, Token } from '../../data/constant';
import { offersSlice } from '../../store/offersSlice/offersSlice';
import { userSlice } from '../../store/userSlice/userSlice';
import type { TOffers } from '../../types/types';

/**
 * Моки селекторов — через `vi.hoisted`, чтобы их можно было
 * переопределять в каждом тесте до импорта компонента.
 */
const { mockUseUser, mockUseFavorites, useRealSelectors } = vi.hoisted(() => ({
  mockUseUser: vi.fn(),
  mockUseFavorites: vi.fn(),
  useRealSelectors: { user: false, favorites: false },
}));

vi.mock('../../store/useSelectors', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../store/useSelectors')>();

  return {
    useUser: () => (useRealSelectors.user ? actual.useUser() : mockUseUser()),
    useFavorites: () => (useRealSelectors.favorites ? actual.useFavorites() : mockUseFavorites()),
  };
});

/** Пустой store — Header использует только `dispatch` (Sign out). */
const mockStore = configureMockStore();
const store = mockStore({});

/** Рендер с Provider и MemoryRouter — Link требует контекст роутера. */
const renderHeader = () =>
  render(
    <Provider store={store}>
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    </Provider>
  );

/** Ссылка профиля: `to={email ? Address.favorites : Address.login}` (header.tsx:33). */
const getProfileLink = (container: HTMLElement) =>
  container.querySelector('.header__nav-link--profile');

/** Аватар: `style={email ? {backgroundImage: ...} : {}}` (header.tsx:34). */
const getAvatar = (container: HTMLElement) =>
  container.querySelector('.header__avatar-wrapper');

/** Состояние гостя — пустой email, как в `userInitialState`. */
const guestUser = {
  email: '',
  avatarUrl: '',
  name: '',
  isPro: false,
  token: '',
};

function createAuthenticatedStore() {
  return configureStore({
    reducer: combineReducers({
      [NameReducer.user]: userSlice.reducer,
      [NameReducer.offers]: offersSlice.reducer,
    }),
    preloadedState: {
      [NameReducer.user]: {
        email: 'oliver@test.com',
        avatarUrl: 'https://example.com/avatar.jpg',
        name: 'Oliver',
        isPro: true,
        token: 'token',
      },
    },
  });
}

describe('Header', () => {
  beforeEach(() => {
    useRealSelectors.user = false;
    useRealSelectors.favorites = false;
    mockUseUser.mockReset();
    mockUseFavorites.mockReset();
    mockUseFavorites.mockReturnValue([]);
  });

  // --- Маршрут профиля зависит только от наличия email ---

  describe('profile link destination by email', () => {
    it.each<[string, string]>([
      ['', Address.login],
      ['user@test.com', Address.favorites],
      ['another@mail.ru', Address.favorites],
    ])('points to correct route when email is %j', (email, expectedPath) => {
      mockUseUser.mockReturnValue({
        ...guestUser,
        email,
        avatarUrl: email ? 'https://example.com/avatar.jpg' : '',
        name: email ? 'User' : '',
      });

      const { container } = renderHeader();

      expect(getProfileLink(container)).toHaveAttribute('href', expectedPath);
    });
  });

  // --- Гость: Sign in, без аватара, имени и счётчика избранного ---

  describe('when user is guest (no email)', () => {
    beforeEach(() => {
      mockUseUser.mockReturnValue(guestUser);
    });

    it('does not set avatar background image', () => {
      const { container } = renderHeader();
      const avatar = getAvatar(container);

      expect(avatar?.style.backgroundImage).toBe('');
    });

    it('shows Sign in with header__login class', () => {
      renderHeader();

      expect(screen.getByTestId('login')).toBeInTheDocument();
    });

    it('does not show user name or favorites count', () => {
      const { container } = renderHeader();

      expect(container.querySelector('.header__user-name')).not.toBeInTheDocument();
      expect(container.querySelector('.header__favorite-count')).not.toBeInTheDocument();
    });

    it('does not render sign out link with header__nav-link', () => {
      const { container } = renderHeader();

      expect(screen.queryByText('Sign out')).not.toBeInTheDocument();
      // Только ссылка профиля, без Sign out (header.tsx:46–51).
      expect(container.querySelector('.header__nav-link')).toBeInTheDocument();
    });
  });

  // --- Авторизованный: аватар, имя, счётчик, Sign out ---

  describe('when user is authenticated', () => {
    const avatarUrl = 'https://example.com/avatar.jpg';
    const userName = 'Oliver';
    const email = 'oliver@test.com';

    beforeEach(() => {
      mockUseUser.mockReturnValue({
        email,
        avatarUrl,
        name: userName,
        isPro: true,
        token: 'token',
      });
    });

    it('sets avatar background image from user avatarUrl', () => {
      const { container } = renderHeader();
      const avatar = getAvatar(container);

      expect(avatar).toHaveStyle({ backgroundImage: `url(${avatarUrl})` });
    });

    it('shows user name and favorites count', () => {
      // useFavorites возвращает массивы по городам; Header делает flatMap (header.tsx:14).
      const favorites: TOffers[][] = [
        [{ id: '1' } as TOffers],
        [{ id: '2' } as TOffers, { id: '3' } as TOffers],
      ];
      mockUseFavorites.mockReturnValue(favorites);

      renderHeader();

      expect(screen.getByText(userName)).toHaveClass('header__user-name');
      expect(screen.getByText('3')).toHaveClass('header__favorite-count');
    });

    it('renders sign out link with header__nav-link', () => {
      const { container } = renderHeader();

      expect(screen.getByText('Sign out')).toBeInTheDocument();
    });

    it('does not show Sign in', () => {
      const { container } = renderHeader();

      expect(screen.queryByText('Sign in')).not.toBeInTheDocument();
    });

    it('shows Sign in after sign out click', async () => {
      useRealSelectors.user = true;
      useRealSelectors.favorites = true;

      const store = createAuthenticatedStore();
      const deleteTokenSpy = vi.spyOn(Token, 'delete');
      const user = userEvent.setup();

      render(
        <Provider store={store}>
          <MemoryRouter>
            <Header />
          </MemoryRouter>
        </Provider>,
      );

      expect(screen.queryByTestId('login')).not.toBeInTheDocument();
      expect(screen.getByTestId('link-signout')).toBeInTheDocument();

      await user.click(screen.getByTestId('link-signout'));

      expect(screen.getByTestId('login')).toBeInTheDocument();
      expect(screen.queryByTestId('link-signout')).not.toBeInTheDocument();
      expect(deleteTokenSpy).toHaveBeenCalledOnce();

      deleteTokenSpy.mockRestore();
    });
  });
});
