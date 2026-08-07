import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Login from './login';
import { Address, Token } from '../../data/constant';
import { setUser } from '../../store/userSlice/userSlice';
import type { IResLogin } from '../../types/types';
import { expectAttribute } from '../../library/test/test';

const { mockDispatch, mockNavigate } = vi.hoisted(() => ({
  mockDispatch: vi.fn(),
  mockNavigate: vi.fn(),
}));

vi.mock('../../store', () => ({
  useAppDispatch: () => mockDispatch,
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>(
    'react-router-dom',
  );
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('axios', () => ({
  default: {
    post: vi.fn(),
  },
}));

const loginResponse: IResLogin = {
  avatarUrl: 'https://example.com/avatar.jpg',
  email: 'dmitri@mail.ru',
  isPro: false,
  name: 'Dmitri',
  token: 'secret-token',
};

const renderLogin = () =>
  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>,
  );

describe('Login', () => {
  beforeEach(() => {
    mockDispatch.mockReset();
    mockNavigate.mockReset();
    vi.mocked(axios.post).mockReset();
    Token.delete();
  });

  // Успешный логин: POST → токен → редирект на main → setUser в store
  it('on submit posts credentials, saves token, navigates and dispatches setUser', async () => {
    const user = userEvent.setup();
    vi.mocked(axios.post).mockResolvedValue({ data: loginResponse });

    renderLogin();

    const email = (screen.getByTestId('input-email') as HTMLInputElement).value;
    const password = (screen.getByTestId('input-password') as HTMLInputElement).value;

    await user.click(screen.getByRole('button', { name: 'Sign in' }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        'https://16.design.htmlacademy.pro/six-cities/login',
        { email, password },
      );
    });

    expect(Token.value).toBe(loginResponse.token);
    expect(mockNavigate).toHaveBeenCalledWith(Address.main);
    expect(mockDispatch).toHaveBeenCalledWith(setUser(loginResponse));
  });

  // Введённые значения уходят в POST, а не только дефолты из HTML
  it('sends typed email and password in login request', async () => {
    const user = userEvent.setup();
    vi.mocked(axios.post).mockResolvedValue({ data: loginResponse });

    renderLogin();

    const email = screen.getByTestId('input-email');
    const password = screen.getByTestId('input-password');

    await user.clear(email);
    await user.clear(password);
    await user.type(email, 'new@mail.ru');
    await user.type(password, 'pass2');
    await user.click(screen.getByRole('button', { name: 'Sign in' }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        'https://16.design.htmlacademy.pro/six-cities/login',
        { email: 'new@mail.ru', password: 'pass2' },
      );
    });
  });
});
