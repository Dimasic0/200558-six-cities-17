import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { testUseSelector } from '../library/test/test.ts';
import type { State } from '../types/state';
import { NameReducer } from '../data/constant';
import type { TOffers } from '../types/types';

/** Обычный оффер в Paris — нужен для проверки фильтрации избранного. */
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

/** Избранный оффер в Paris — попадает в результат useFavorites. */
const parisFavoriteOffer: TOffers = {
  ...parisOffer,
  id: 'offer-paris-fav',
  title: 'Favorite in Paris',
  isFavorite: true,
};

/** Избранный оффер во втором городе — проверяем группировку по городам. */
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
let mockState: State;

vi.mock('./index', () => ({
  useAppSelector: (selector: (state: State) => unknown) => selector(mockState),
}));

// Важно: импортируем после `vi.mock`, чтобы `useSelectors.ts` увидел мок.
import {
  useCity,
  useEmail,
  useFavorites,
  useOffers,
  useOffersСities,
  useUser,
} from './useSelectors';

beforeEach(() => {
  mockState = createMockState();
});

describe('store hooks: useSelectors', () => {
  // --- Простые селекторы: читают одно поле из store ---

  testUseSelector(
    [
      'useUser returns user slice (useSelectors.ts:40)',
      () => {},
      useUser,
      {
        toEqual: {
          email: 'test@example.com',
          avatarUrl: 'https://example.com/avatar.jpg',
          name: 'Test User',
          isPro: true,
          token: 'test-token',
        },
      },
    ],
    [
      'useEmail returns user.email',
      () => {
        mockState.user.email = 'a@b.c';
      },
      useEmail,
      { toBe: 'a@b.c' },
    ],
    [
      'useCity returns offers.city',
      () => {
        mockState.offers.city = 'Amsterdam';
      },
      useCity,
      { toBe: 'Amsterdam' },
    ],
    [
      'useOffersСities returns offersByCities from state',
      () => {},
      useOffersСities,
      {
        toEqual: {
          Paris: {
            [parisOffer.id]: parisOffer,
            [parisFavoriteOffer.id]: parisFavoriteOffer,
          },
          Cologne: {
            [cologneFavoriteOffer.id]: cologneFavoriteOffer,
          },
        },
      },
    ],
  );

  // --- useOffers: селектор + Object.values + useMemo ---

  describe('useOffers', () => {
    it('returns offers for the current city as an array', () => {
      const { result } = renderHook(() => useOffers());

      // Paris — текущий город в createMockState, там 2 оффера.
      expect(result.current).toEqual(
        expect.arrayContaining([parisOffer, parisFavoriteOffer]),
      );
      expect(result.current).toHaveLength(2);
    });

    testUseSelector(
      [
        'returns only offers from the selected city',
        () => {
          mockState.offers.city = 'Cologne';
        },
        useOffers,
        { toEqual: [cologneFavoriteOffer] },
      ],
      [
        'returns an empty array when the current city has no offers',
        () => {
          // Amsterdam есть в списке городов, но офферов для него нет.
          mockState.offers.city = 'Amsterdam';
        },
        useOffers,
        { toEqual: [] },
      ],
      [
        'returns an empty array when offersByCities is null',
        () => {
          // Начальное состояние slice до загрузки данных с сервера.
          mockState.offers.offersByCities = null;
        },
        useOffers,
        { toEqual: [] },
      ],
    );
  });

  // --- useOffersСities: прямой доступ к offersByCities ---

  describe('useOffersСities', () => {
    it('reflects updates to offersByCities', () => {
      mockState.offers.offersByCities = {
        Hamburg: {
          'offer-hamburg': {
            ...parisOffer,
            id: 'offer-hamburg',
            city: {
              name: 'Hamburg',
              location: { latitude: 53.5511, longitude: 9.9937, zoom: 13 },
            },
          },
        },
      };

      const { result } = renderHook(() => useOffersСities());

      expect(result.current).toBe(mockState.offers.offersByCities);
      expect(result.current?.Hamburg).toBeDefined();
    });
  });

  // --- useFavorites: фильтрация isFavorite + группировка по городам ---

  describe('useFavorites', () => {
    it('returns favorite offers grouped by city', () => {
      const { result } = renderHook(() => useFavorites());

      // arrayContaining — порядок городов в for...in не гарантирован.
      expect(result.current).toEqual(
        expect.arrayContaining([
          [parisFavoriteOffer],
          [cologneFavoriteOffer],
        ]),
      );
      expect(result.current).toHaveLength(2);
    });

    it('excludes non-favorite offers from groups', () => {
      const { result } = renderHook(() => useFavorites());

      const flatFavorites = result.current.flat();
      expect(flatFavorites).not.toContain(parisOffer);
      expect(flatFavorites.every((offer) => offer.isFavorite)).toBe(true);
    });

    testUseSelector(
      [
        'returns an empty array when there are no favorites',
        () => {
          mockState.offers.offersByCities = {
            Paris: {
              [parisOffer.id]: { ...parisOffer, isFavorite: false },
            },
          };
        },
        useFavorites,
        { toEqual: [] },
      ],
      [
        'skips cities that have only non-favorite offers',
        () => {
          mockState.offers.offersByCities = {
            Paris: {
              [parisOffer.id]: { ...parisOffer, isFavorite: false },
            },
            Cologne: {
              [cologneFavoriteOffer.id]: cologneFavoriteOffer,
            },
          };
        },
        useFavorites,
        // Paris пропускается, остаётся только группа Cologne.
        { toEqual: [[cologneFavoriteOffer]] },
      ],
    );
  });
});
