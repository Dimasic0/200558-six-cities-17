import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Mock } from 'vitest';
import axios, { AxiosInstance } from 'axios';
import MockAdapter from 'axios-mock-adapter';
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

let api: AxiosInstance;
let mock: MockAdapter;
let dispatch: Mock;
let getState: Mock;

beforeEach(() => {
  api = axios.create({ baseURL: API_BASE_URL });
  mock = new MockAdapter(api);
  dispatch = vi.fn();
  getState = vi.fn();
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
    it('dispatches setOffers with fetched data', async () => {
      const signal = new AbortController().signal;
      mock.onGet('offers').reply(200, [parisOffer]);

      await getOffers(signal)(dispatch, getState, api);

      expect(dispatch).toHaveBeenCalledWith(setOffers([parisOffer]));
    });
  });

  describe('getLogin', () => {
    it('dispatches setUser when login request succeeds', async () => {
      mock.onGet('login').reply(200, { email: 'user@example.com' });

      await getLogin(undefined)(dispatch, getState, api);

      expect(dispatch).toHaveBeenCalledWith(
        setUser({ email: 'user@example.com' }),
      );
    });

    it('dispatches setUser with empty email when login request fails', async () => {
      mock.onGet('login').reply(401);

      await getLogin(undefined)(dispatch, getState, api);

      expect(dispatch).toHaveBeenCalledWith(setUser({ email: '' }));
    });
  });

  describe('rqFavorite', () => {
    it('dispatches setOffers after posting favorite state', async () => {
      mock.onPost(`favorite/${parisOffer.id}/1`).reply(200, favoriteOffer);

      await rqFavorite({ id: parisOffer.id, state: true })(
        dispatch,
        getState,
        api,
      );

      expect(dispatch).toHaveBeenCalledWith(setOffers(favoriteOffer));
    });

    it('converts boolean false to 0 in request url', async () => {
      mock.onPost(`favorite/${parisOffer.id}/0`).reply(200, parisOffer);

      await rqFavorite({ id: parisOffer.id, state: false })(
        dispatch,
        getState,
        api,
      );

      expect(dispatch).toHaveBeenCalledWith(setOffers(parisOffer));
    });

    it('accepts numeric state in request url', async () => {
      mock.onPost(`favorite/${parisOffer.id}/1`).reply(200, favoriteOffer);

      await rqFavorite({ id: parisOffer.id, state: 1 })(
        dispatch,
        getState,
        api,
      );

      expect(dispatch).toHaveBeenCalledWith(setOffers(favoriteOffer));
    });
  });

  describe('rqFavoriteGet', () => {
    it('dispatches setOffers with fetched favorites', async () => {
      const signal = new AbortController().signal;
      mock.onGet('favorite').reply(200, [favoriteOffer]);

      await rqFavoriteGet(signal)(dispatch, getState, api);

      expect(dispatch).toHaveBeenCalledWith(setOffers([favoriteOffer]));
    });
  });
});
