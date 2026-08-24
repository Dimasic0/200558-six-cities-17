import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Header } from './header';
import { offers } from '../../mocks/offers';
import { Address, Token } from '../../data/constant';
import { expectAttribute } from '../../library/test/test';
import type { IResLoginOptional } from '../../types/types';
import { useFavorites, useUser } from '../../store/useSelectors/useSelectors';
import { setEmail } from '../../store/userSlice/userSlice';

const { mockDispatch } = vi.hoisted(() => ({
  mockDispatch: vi.fn(),
}));

vi.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
}));

vi.mock('../../store/useSelectors/useSelectors', () => ({
  useFavorites: vi.fn(),
  useUser: vi.fn(),
}));

const renderHeader = () =>
  render(
    <MemoryRouter>
      <Header />
    </MemoryRouter>,
  );

describe('Header', () => {
  beforeEach(() => {
    mockDispatch.mockReset();
    vi.mocked(useUser).mockReset();
    vi.mocked(useFavorites).mockReset();
    Token.delete();
  });

  it('shows signout, user name and favorites count when email exists', () => {
    const user: IResLoginOptional = {
      email: 'user@mail.ru',
      avatarUrl: 'https://example.com/avatar.jpg',
      isPro: false,
      name: 'Dmitri',
      token: 'token',
    };

    vi.mocked(useUser).mockReturnValue(user);

    const favoriteGroups = [
      [offers[0], offers[1]],
      [offers[2]],
    ];
    vi.mocked(useFavorites).mockReturnValue(favoriteGroups as any);

    renderHeader();

    expect(screen.getByText('Sign out')).toBeInTheDocument();
    expect(screen.getByText('Dmitri')).toHaveClass('header__user-name');
    expect(screen.getByText('3')).toHaveClass('header__favorite-count');
    expect(screen.queryByText('Sign in')).not.toBeInTheDocument();
    expect(document.querySelector('.header__avatar-wrapper')).toHaveStyle({
      backgroundImage: `url(${user.avatarUrl})`,
    });

    expectAttribute('.header__nav-link--profile', { href: Address.favorites });
  });

  it('on Sign out click dispatches setEmail and deletes token', async () => {
    const userClick = userEvent.setup();
    const user: IResLoginOptional = {
      email: 'user@mail.ru',
      avatarUrl: 'https://example.com/avatar.jpg',
      isPro: false,
      name: 'Dmitri',
      token: 'secret-token',
    };

    vi.mocked(useUser).mockReturnValue(user);
    vi.mocked(useFavorites).mockReturnValue([] as any);
    Token.value = user.token;

    renderHeader();
    await userClick.click(screen.getByText('Sign out'));

    expect(mockDispatch).toHaveBeenCalledWith(setEmail(''));
    expect(Token.value).toBeNull();
  });

  it('shows login when email is absent', () => {
    const user: IResLoginOptional = {
      email: '',
      avatarUrl: '',
      isPro: false,
      name: 'Dmitri',
      token: '',
    };

    vi.mocked(useUser).mockReturnValue(user);
    vi.mocked(useFavorites).mockReturnValue([] as any);

    renderHeader();

    expect(screen.getByText('Sign in')).toHaveClass('header__login');
    expect(screen.queryByText('Sign out')).not.toBeInTheDocument();
    expect(screen.queryByText('0')).not.toBeInTheDocument();
    expect(document.querySelector('.header__avatar-wrapper')).not.toHaveAttribute(
      'style',
    );

    expectAttribute('.header__nav-link--profile', { href: Address.login });
  });
});

