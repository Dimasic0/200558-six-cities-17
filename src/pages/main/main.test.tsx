import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import MockAdapter from 'axios-mock-adapter';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Main from './main';
import { api } from '../../api';
import { NameReducer } from '../../data/constant';
import { offersSlice } from '../../store/offersSlice/offersSlice';
import { userSlice } from '../../store/userSlice/userSlice';
import { offers } from '../../mocks/offers';

const { mockMap } = vi.hoisted(() => ({
  mockMap: vi.fn(() => <div data-testid="map-mock" />),
}));

vi.mock('../../components/map/map', () => ({
  default: mockMap,
}));

const parisOffers = offers.filter((offer) => offer.city.name === 'Paris');
const cologneOffers = offers.filter((offer) => offer.city.name === 'Cologne');

function createTestStore() {
  return configureStore({
    reducer: combineReducers({
      [NameReducer.user]: userSlice.reducer,
      [NameReducer.offers]: offersSlice.reducer,
    }),
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: {
          extraArgument: api,
        },
      }),
  });
}

function renderMain() {
  const store = createTestStore();

  render(
    <Provider store={store}>
      <MemoryRouter>
        <Main />
      </MemoryRouter>
    </Provider>,
  );

  return store;
}

describe('Main page', () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(api);
    mockMap.mockClear();
  });

  afterEach(() => {
    mock.restore();
  });

  it('renders Spinner while offers are fetching', async () => {
    // Искусственная задержка ответа, чтобы успеть увидеть промежуточное состояние Spinner.
    mock.onGet('offers').reply(
      () =>
        new Promise((resolve) => {
          setTimeout(() => resolve([200, parisOffers]), 100);
        }),
    );

    renderMain();

    const mainPage = screen.getByTestId('main-page');

    // Сразу после mount запрос ещё в полёте — показывается Spinner, контента нет.
    expect(mainPage.querySelector('.spinner')).toBeInTheDocument();
    expect(screen.queryByTestId('main-content')).not.toBeInTheDocument();

    // waitFor повторяет callback, пока expect не пройдёт или не истечёт таймаут (~1 с).
    // Если main-content так и не появится — тест упадёт с ошибкой timeout.
    await waitFor(() => {
      expect(screen.getByTestId('main-content')).toBeInTheDocument();
    });

    // После успешной загрузки Spinner скрывается.
    expect(mainPage.querySelector('.spinner')).not.toBeInTheDocument();
  });

  it('renders main content after offers are loaded', async () => {
    mock.onGet('offers').reply(200, parisOffers);

    renderMain();

    // Ждём завершения thunk и перерисовки после ответа API.
    await waitFor(() => {
      expect(screen.getByTestId('main-content')).toBeInTheDocument();
    });

    // Дальше проверяем уже стабильное состояние — без waitFor, элемент уже в DOM.
    expect(screen.getByText(`${parisOffers.length} places to stay in Amsterdam`)).toBeInTheDocument();
    expect(document.querySelector('.spinner')).not.toBeInTheDocument();
  });

  it('passes hovered offer id to Map selectedPoint', async () => {
    mock.onGet('offers').reply(200, parisOffers);

    renderMain();

    await waitFor(() => {
      expect(screen.getByTestId('main-content')).toBeInTheDocument();
    });

    const targetOffer = parisOffers[0];
    const cards = screen.getAllByTestId('card');
    const targetCard = cards.find((card) => card.textContent?.includes(targetOffer.title));

    expect(targetCard).toBeDefined();

    const user = userEvent.setup();
    await user.hover(targetCard!);

    await waitFor(() => {
      const lastCall = mockMap.mock.calls.at(-1)?.[0];
      expect(lastCall?.selectedPoint).toBe(targetOffer.id);
    });
  });

  it('renders cards for the clicked city', async () => {
    const newCity = 'Cologne';
    mock.onGet('offers').reply(200, [...parisOffers, ...cologneOffers]);

    renderMain();

    await waitFor(() => {
      expect(screen.getByTestId('main-content')).toBeInTheDocument();
    });

    const user = userEvent.setup();
    await user.click(screen.getByText(newCity));

    await waitFor(() => {
      const cards = screen.getAllByTestId('card');
      expect(cards[0].textContent).toContain(cologneOffers[0].title);
    });

    expect(cologneOffers[0].city.name).toBe(newCity);
  });
});
