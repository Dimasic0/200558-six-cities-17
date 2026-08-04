import { cleanup, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from './app';
import { Address } from '../data/constant';
import { getLogin } from '../store/action/action';
import { useEmail } from '../store/useSelectors/useSelectors';
import { getMockComponent } from '../library/test/test';

const { mockDispatch } = vi.hoisted(() => ({
  mockDispatch: vi.fn(),
}));

vi.mock('../store', () => ({
  useAppDispatch: () => mockDispatch,
}));

vi.mock('../store/useSelectors/useSelectors', () => ({
  useEmail: vi.fn(() => ''),
}));

vi.mock('../store/action/action', () => ({
  getLogin: vi.fn(() => ({ type: 'user/login' })),
}));

// Страницы — заглушки: App отвечает за маршруты, не за содержимое экранов.
vi.mock('../pages/main/main', async () => {
  const { createMockComponent } = await import('../library/test/test');
  return { default: createMockComponent('Main') };
});

vi.mock('../pages/login/login', async () => {
  const { createMockComponent } = await import('../library/test/test');
  return { default: createMockComponent('Login') };
});

vi.mock('../pages/favorites/favorites', async () => {
  const { createMockComponent } = await import('../library/test/test');
  return { default: createMockComponent('Favorites') };
});

vi.mock('../pages/offer/offer', async () => {
  const { createMockComponent } = await import('../library/test/test');
  return { default: createMockComponent('Offer') };
});

vi.mock('../pages/errorAddressing/errorAddressing', async () => {
  const { createMockComponent } = await import('../library/test/test');
  return { default: createMockComponent('ErrorAddressing') };
});

const renderApp = (path:string = Address.main) => {
  window.history.pushState({}, '', path);
  return render(<App />);
};

describe('App', () => {
  beforeEach(() => {
    mockDispatch.mockReset();
    vi.mocked(getLogin).mockClear();
    vi.mocked(useEmail).mockReturnValue('');
  });

  // При маунте App проверяет авторизацию через getLogin
  it('dispatches getLogin on mount', () => {
    renderApp();

    expect(getLogin).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'user/login' });
  });

  // index → Main
  it('renders Main on index route', () => {
    renderApp(Address.main);

    expect(getMockComponent('Main')).toBeInTheDocument();
    expect(getMockComponent('Login')).not.toBeInTheDocument();
  });

  // /login → Login
  it('renders Login on login route', () => {
    renderApp(Address.login);

    expect(getMockComponent('Login')).toBeInTheDocument();
  });

  // /offer/:offerId → Offer
  it('renders Offer on offer route', () => {
    renderApp('/offer/offer-1');

    expect(getMockComponent('Offer')).toBeInTheDocument();
  });

  // Неизвестный путь → ErrorAddressing
  it('renders ErrorAddressing on unknown route', () => {
    renderApp('/unknown-page');

    expect(getMockComponent('ErrorAddressing')).toBeInTheDocument();
  });

  // email есть → PrivateRoute пускает на Favorites
  it('renders Favorites for authenticated user', () => {
    vi.mocked(useEmail).mockReturnValue('user@example.com');
    renderApp(Address.favorites);

    expect(getMockComponent('Favorites')).toBeInTheDocument();
    expect(getMockComponent('Login')).not.toBeInTheDocument();
  });

  // email пустой → PrivateRoute редиректит на Login
  it('redirects guest from favorites to login', () => {
    vi.mocked(useEmail).mockReturnValue('');
    renderApp(Address.favorites);

    expect(getMockComponent('Favorites')).not.toBeInTheDocument();
    expect(getMockComponent('Login')).toBeInTheDocument();
  });
});
