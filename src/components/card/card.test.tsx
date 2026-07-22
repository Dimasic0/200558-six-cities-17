import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureMockStore } from '@jedmao/redux-mock-store';
import Card from './card';
import { offers } from '../../mocks/offers';

const mockStore = configureMockStore();

it('card', () => {
  const offer = offers[0];
  const store = mockStore({});

  render(
    <Provider store={store}>
      <MemoryRouter>
        <Card offer={offer} variant="vertical" />
      </MemoryRouter>
    </Provider>
  );
  screen.getByTestId('premium');
  const card = screen.queryByTestId('card');
  expect(card?.className).toContain('cities__card');
});
