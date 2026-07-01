import { createAction } from '@reduxjs/toolkit';
import { TCity, TOffers, TOffersOptional } from '../types/types';
import axios, { AxiosInstance } from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { NameReducer } from '../data/constant';
import { setOffers } from './offersSlice/offersSlice';
import { setUser } from './userSlice/userSlice';

export const setCity = createAction<TCity>('catalog/setCity');
//export const setEmail = createAction<string>('email');
export const getOffers = createAsyncThunk<void, AbortSignal, { extra: AxiosInstance }>(
  `${NameReducer.offers}/offers`,
  async (signal, { dispatch, extra: api }) => {
    const { data } = await api.get<TOffers[]>('offers', { signal });
    console.log('setOffers(data)=', setOffers(data));
    dispatch(setOffers(data));
  },
);
type TLoginRequest = { email: string };
export const getLogin = createAsyncThunk<
  void,
  AbortSignal | undefined,
  { extra: AxiosInstance }
>(`${NameReducer.user}/login`, async (_, { extra: api, dispatch }) => {
  try {
  const { data } = await api.get<TLoginRequest>('login');
  console.log('aftores=', data);
  dispatch(setUser(data));
} catch (error) {
  dispatch(setUser({email:''}));
}
});

export const rqFavorite = createAsyncThunk<
  void,
  { id: string; state: boolean | number; signal?: AbortSignal },
  { extra: AxiosInstance }
>(
  `${NameReducer.offers}/favorite`,
  async ({ id, state, signal }, { extra: api, dispatch }) => {
    state = Number(state);
    Math.max(state,0);
    Math.min(state,1);
    const { data } = await api.post<TOffersOptional>(
      `favorite/${id}/${state}`,
      {
        signal,
      },
    );
    dispatch(setOffers(data));
  },
);

export const rqFavoriteGet = createAsyncThunk<
  void,
  AbortSignal,
  { extra: AxiosInstance }
>(
  `${NameReducer.offers}/favoriteGet`,
  async (signal, { extra: api, dispatch }) => {
    const { data } = await api.get<TOffersOptional>(
      'favorite',
      {
        signal
      },
    );
    dispatch(setOffers(data));
  },
);
