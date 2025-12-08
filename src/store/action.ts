import { createAction } from '@reduxjs/toolkit';
import { TCity, TOffers } from '../types/types';
import axios, { AxiosInstance } from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { setEmail } from './slice/slice';
import { NameReducer } from '../data/constant';

export const setCity = createAction<TCity>('catalog/setCity');
//export const setEmail = createAction<string>('email');
export const getOffers = createAsyncThunk<TOffers[], AbortSignal>(
  `${NameReducer.sliceAsync}/offers`,
  async (signal) => {
    const { data } = await axios.get<TOffers[]>(
      'https://16.design.htmlacademy.pro/six-cities/offers',
      { signal }
    );
    return data;
  }
);
type TLoginRequest = { email: string };
export const getLogin = createAsyncThunk<
  void,
  AbortSignal | undefined,
  { extra: AxiosInstance }
>(`${NameReducer.sliceAsync}/login`, async (_, { extra: api, dispatch }) => {
  console.log('login');
  const { data } = await api.get<TLoginRequest>('login').catch(() => {
    console.log('error login');
    dispatch(setEmail(''));
  });
  console.log('data.email=', data.email);
  dispatch(setEmail(data.email));
});
