import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import type { State } from '../types/state';
import { NameReducer } from '../data/constant';
import type { TOffers } from '../types/types';

const parisOffer: TOffers = {
  id: 'offer-paris-1',
  title: 'Tile House',
  type: 'hotel',
  price: 417,
  previewImage: 'https://16.design.htmlacademy.pro/static/hotel/12.jpg',
  city: {
    name: 'Paris',
    location: { latitude: 48.85661, longitude: 2.351499, zoom: 13 },
  },
  location: { latitude: 48.86861, longitude: 2.342499, zoom: 16 },
  isFavorite: false,
  isPremium: true,
  rating: 2.9,
};

const parisFavoriteOffer: TOffers = {
  ...parisOffer,
  id: 'offer-paris-fav',
  title: 'Favorite in Paris',
  isFavorite: true,
};

const cologneFavoriteOffer: TOffers = {
  id: 'offer-cologne-fav',
  title: 'Favorite in Cologne',
  type: 'hotel',
  price: 315,
  previewImage: 'https://16.design.htmlacademy.pro/static/hotel/2.jpg',
  city: {
    name: 'Cologne',
    location: { latitude: 50.938361, longitude: 6.959974, zoom: 13 },
  },
  location: { latitude: 50.950361, longitude: 6.961974, zoom: 16 },
  isFavorite: true,
  isPremium: false,
  rating: 1.6,
};

/** Полный мок store для тестов всех хуков из `useSelectors.ts`. */
export const createMockState = (): State => ({
  [NameReducer.user]: {
    email: 'test@example.com',
    avatarUrl: 'https://example.com/avatar.jpg',
    name: 'Test User',
    isPro: true,
    token: 'test-token',
  },
  [NameReducer.offers]: {
    city: 'Paris',
    offersByCities: {
      Paris: {
        [parisOffer.id]: parisOffer,
        [parisFavoriteOffer.id]: parisFavoriteOffer,
      },
      Cologne: {
        [cologneFavoriteOffer.id]: cologneFavoriteOffer,
      },
    },
  },
});

/**
 * Упрощённый мок `useAppSelector` для тестов хуков из `useSelectors.ts`.
 * В каждом тесте задаём `mockState`, а `useAppSelector(selector)` вернёт `selector(mockState)`.
 */
let mockState: State = createMockState();

vi.mock('./index', () => ({
  useAppSelector: (selector: (state: State) => unknown) => selector(mockState),
}));

// Важно: импортируем после `vi.mock`, чтобы `useSelectors.ts` увидел мок.
import { useCity, useEmail, useUser } from './useSelectors';

beforeEach(() => {
  mockState = createMockState();
});

describe('store hooks: useSelectors', () => {
  it('useUser returns user slice (useSelectors.ts:40)', () => {
    const { result } = renderHook(() => useUser());
    expect(result.current).toBe(mockState.user);
  });

  it('useEmail returns user.email', () => {
    mockState.user.email = 'a@b.c';

    const { result } = renderHook(() => useEmail());
    expect(result.current).toBe('a@b.c');
  });

  it('useCity returns offers.city', () => {
    mockState.offers.city = 'Amsterdam';

    const { result } = renderHook(() => useCity());
    expect(result.current).toBe('Amsterdam');
  });
});
