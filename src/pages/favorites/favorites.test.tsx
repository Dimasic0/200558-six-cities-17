import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Favorites from './favorites';
import { offers } from '../../mocks/offers';
import type { TOffers, TOffersByCities } from '../../types/types';
import { store } from '../../store';
import { rqFavoriteGet } from '../../store/action/action';
import {
  useFavorites,
  useOffersСities,
} from '../../store/useSelectors/useSelectors';
import Loading  from '../../components/loading/loading';

const { mockDispatch } = vi.hoisted(() => ({
  mockDispatch: vi.fn(),
}));

vi.mock('../../store', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../store')>();

  return {
    ...actual,
    useAppDispatch: () => mockDispatch,
  };
});

vi.mock('../../store/useSelectors/useSelectors', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('../../store/useSelectors/useSelectors')>();

  return {
    ...actual,
    useOffersСities: vi.fn(),
    useFavorites: vi.fn(),
  };
});

vi.mock('../../store/action/action', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('../../store/action/action')>();
  return {
    ...actual,
    rqFavoriteGet: vi.fn((signal: AbortSignal) => ({
      type: 'offers/favoriteGet',
      payload: signal,
    })),
  };
});

vi.mock('../../components/loading/loading', async () => {
  return { default: vi.fn(() => 'tagLoading') };
});

const parisFavorites: TOffers[] = [
  { ...offers[0], isFavorite: true, city: { ...offers[0].city, name: 'Paris' } },
  { ...offers[1], isFavorite: true, city: { ...offers[1].city, name: 'Paris' } },
];

const cologneFavorites: TOffers[] = [
  {
    ...offers[2],
    isFavorite: true,
    city: { ...offers[2].city, name: 'Cologne' },
  },
];

const favoriteGroups = [parisFavorites, cologneFavorites];

const loadedOffersByCities: TOffersByCities = {
  Paris: Object.fromEntries(parisFavorites.map((offer) => [offer.id, offer])),
  Cologne: Object.fromEntries(
    cologneFavorites.map((offer) => [offer.id, offer]),
  ),
};

const renderFavorites = () =>
  render(
    <Provider store={store}>
      <MemoryRouter>
        <Favorites />
      </MemoryRouter>
    </Provider>
  );
  const getPageMainFavorites = () => document.querySelector('.page__main--favorites');

describe('Favorites', () => {
  beforeEach(() => {
    mockDispatch.mockReset();
    vi.mocked(rqFavoriteGet).mockClear();
    vi.mocked(useOffersСities).mockReturnValue(loadedOffersByCities);
    vi.mocked(useFavorites).mockReturnValue(favoriteGroups);
  });

  // При маунте грузим избранное; AbortSignal — чтобы отменить запрос при размонтировании
  it('dispatches rqFavoriteGet with AbortSignal on mount', () => {
    renderFavorites();

    expect(rqFavoriteGet).toHaveBeenCalledTimes(1);
    expect(rqFavoriteGet.mock.calls[0][0]).toBeInstanceOf(AbortSignal);
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'offers/favoriteGet',
      payload: rqFavoriteGet.mock.calls[0][0],
    });
  });

  // offersByCities ещё нет → спиннер вместо списка
  it('renders Loading while offers are not loaded', () => {
    vi.mocked(useOffersСities).mockReturnValue(
      null as unknown as TOffersByCities,
    );

    renderFavorites();

    expect(Loading).toHaveBeenCalled();
    expect(getPageMainFavorites()).not.toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: 'Saved listing' }),
    ).not.toBeInTheDocument();
  });

  // Данные есть → заголовок и список городов
  it('renders title and a locations item per favorite city group', () => {
    renderFavorites();

    expect(
      screen.getByRole('heading', { name: 'Saved listing' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Paris')).toBeInTheDocument();
    expect(screen.getByText('Cologne')).toBeInTheDocument();
    expect(document.querySelectorAll('.favorites__locations-items')).toHaveLength(
      favoriteGroups.length,
    );
  });

  // В каждый Cards — своя группа офферов, horizontal + class для favorites
  it('passes each favorite group to Cards with horizontal layout props', () => {
    renderFavorites();
    expect(document.querySelectorAll('.favorites__locations-items')).toHaveLength(favoriteGroups.length);
  });

  // Пустое избранное — секция есть, но без групп и Cards
  it('renders empty list when there are no favorites', () => {
    vi.mocked(useFavorites).mockReturnValue([]);

   const {container} =  renderFavorites();

    expect(
      screen.getByRole('heading', { name: 'Saved listing' }),
    ).toBeInTheDocument();
    expect(document.querySelectorAll('.favorites__locations-items')).toHaveLength(
      0,
    );
    expect(container.querySelector('.favorites__locations-items')).not.toBeInTheDocument();
  });
});
