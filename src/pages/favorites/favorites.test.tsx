import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Favorites from './favorites';
import { offers } from '../../mocks/offers';
import type { TOffers, TOffersByCities } from '../../types/types';
import {
  expectAttribute,
  expectMockProps,
  getMockComponent,
  getMockComponents,
} from '../../library/test/test';
import { rqFavoriteGet } from '../../store/action/action';
import {
  useFavorites,
  useOffersСities,
} from '../../store/useSelectors/useSelectors';

const { mockDispatch } = vi.hoisted(() => ({
  mockDispatch: vi.fn(),
}));

vi.mock('../../store', () => ({
  useAppDispatch: () => mockDispatch,
}));

vi.mock('../../store/useSelectors/useSelectors', () => ({
  useOffersСities: vi.fn(),
  useFavorites: vi.fn(),
}));

vi.mock('../../store/action/action', () => ({
  rqFavoriteGet: vi.fn((signal: AbortSignal) => ({
    type: 'offers/favoriteGet',
    payload: signal,
  })),
}));

vi.mock('../../components/header/header', async () => {
  const { createMockComponent } = await import('../../library/test/test');
  return { Header: createMockComponent('Header') };
});

vi.mock('../../components/cards/cards', async () => {
  const { createMockComponent } = await import('../../library/test/test');
  return { default: createMockComponent('Cards') };
});

vi.mock('../../components/loading/loading', async () => {
  const { createMockComponent } = await import('../../library/test/test');
  return { default: createMockComponent('Loading') };
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
    <MemoryRouter>
      <Favorites />
    </MemoryRouter>,
  );

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

    expect(getMockComponent('Loading')).toBeInTheDocument();
    expect(getMockComponent('Cards')).not.toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: 'Saved listing' }),
    ).not.toBeInTheDocument();
  });

  // Header и футер всегда на странице (и при Loading)
  it('always renders Header and footer logo', () => {
    renderFavorites();

    expect(getMockComponent('Header')).toBeInTheDocument();
    expectAttribute('.footer__logo', {
      src: 'img/logo.svg',
      alt: '6 cities logo',
      width: 64,
      height: 33,
    });
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

    const cards = getMockComponents('Cards');
    expect(cards).toHaveLength(favoriteGroups.length);

    favoriteGroups.forEach((group, index) => {
      expectMockProps(cards[index], {
        offers: group,
        variant: 'horizontal',
        classTextBlock: 'favorites__card-info',
      });
    });
  });

  // Пустое избранное — секция есть, но без групп и Cards
  it('renders empty list when there are no favorites', () => {
    vi.mocked(useFavorites).mockReturnValue([]);

    renderFavorites();

    expect(
      screen.getByRole('heading', { name: 'Saved listing' }),
    ).toBeInTheDocument();
    expect(document.querySelectorAll('.favorites__locations-items')).toHaveLength(
      0,
    );
    expect(getMockComponents('Cards')).toHaveLength(0);
  });
});
