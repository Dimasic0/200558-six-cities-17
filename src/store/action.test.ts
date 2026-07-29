import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { configureMockStore, type MockStore } from '@jedmao/redux-mock-store';
import thunk from 'redux-thunk';
import type { TOffers, TOffersOptional } from '../types/types';
import { setOffers } from './offersSlice/offersSlice';
import { setUser } from './userSlice/userSlice';
import {
  getLogin,
  getOffers,
  rqFavorite,
  rqFavoriteGet,
  setCity,
} from './action';
import { createTestAsyncAction } from '../library/test/test.ts';

const API_BASE_URL = 'https://16.design.htmlacademy.pro/six-cities/';

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

const favoriteOffer: TOffersOptional = {
  ...parisOffer,
  id: 'offer-paris-fav',
  isFavorite: true,
};
let mock: MockAdapter;
let store: MockStore<any, any>;

const testAsyncAction = createTestAsyncAction(() => ({
  mock,
  store,
}));

beforeEach(() => {
  const api = axios.create({ baseURL: API_BASE_URL });
  mock = new MockAdapter(api);
  const mockStore = configureMockStore<any, any>([
    thunk.withExtraArgument(api),
  ]);
  store = mockStore({});
});

afterEach(() => {
  mock.restore();
});

describe('store actions', () => {
  describe('setCity', () => {
    it('creates action with city payload', () => {
      const city = 'Amsterdam';

      expect(setCity(city)).toEqual({
        type: 'catalog/setCity',
        payload: city,
      });
    });
  });

  describe('getOffers', () => {
    testAsyncAction(
      'dispatches setOffers with fetched data',
      'get',
      'offers',
      [200, [parisOffer]],
      getOffers(new AbortController().signal),
      setOffers([parisOffer]),
    );
  });

  describe('getLogin', () => {
    testAsyncAction(
      'dispatches setUser when login request succeeds',
      'get',
      'login',
      [200, { email: 'user@example.com' }],
      getLogin(undefined),
      setUser({ email: 'user@example.com' }),
    );

    testAsyncAction(
      'dispatches setUser with empty email when login request fails',
      'get',
      'login',
      [401],
      getLogin(undefined),
      setUser({ email: '' }),
    );
  });

  describe('rqFavorite', () => {
    testAsyncAction(
      'dispatches setOffers after posting favorite state',
      'post',
      `favorite/${parisOffer.id}/1`,
      [200, favoriteOffer],
      rqFavorite({ id: parisOffer.id, state: true }),
      setOffers(favoriteOffer),
    );

    testAsyncAction(
      'converts boolean false to 0 in request url',
      'post',
      `favorite/${parisOffer.id}/0`,
      [200, parisOffer],
      rqFavorite({ id: parisOffer.id, state: false }),
      setOffers(parisOffer),
    );

    testAsyncAction(
      'accepts numeric state in request url',
      'post',
      `favorite/${parisOffer.id}/1`,
      [200, favoriteOffer],
      rqFavorite({ id: parisOffer.id, state: 1 }),
      setOffers(favoriteOffer),
    );
  });

  describe('rqFavoriteGet', () => {
    testAsyncAction(
      'dispatches setOffers with fetched favorites',
      'get',
      'favorite',
      [200, [favoriteOffer]],
      rqFavoriteGet(new AbortController().signal),
      setOffers([favoriteOffer]),
    );
  });
});
