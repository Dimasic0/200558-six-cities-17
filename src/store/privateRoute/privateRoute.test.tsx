import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import PrivateRoute from './privateRoute';
import { Address, PrivateStatus } from '../../data/constant';

const renderPrivateRoute = (status: PrivateStatus) =>
  render(
    <MemoryRouter initialEntries={['/private']}>
      <Routes>
        <Route
          path="/private"
          element={(
            <PrivateRoute status={status}>
              <h1>Private page</h1>
            </PrivateRoute>
          )}
        />
        <Route path={Address.login} element={<h1>Login page</h1>} />
      </Routes>
    </MemoryRouter>,
  );

describe('PrivateRoute', () => {
  it('renders children for authenticated user', () => {
    renderPrivateRoute(PrivateStatus.Auth);

    expect(screen.getByRole('heading', { name: 'Private page' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Login page' })).not.toBeInTheDocument();
  });

  it('redirects guest to login page', () => {
    renderPrivateRoute(PrivateStatus.Guest);

    expect(screen.getByRole('heading', { name: 'Login page' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Private page' })).not.toBeInTheDocument();
  });
});
