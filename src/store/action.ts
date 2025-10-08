import { createAction } from '@reduxjs/toolkit';
import { TCity, TOffer } from '../types/types';
import axios, { AxiosInstance } from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const setCity = createAction<TCity>('catalog/setCity');
export const setEmail = createAction<string>('email');
export const getOffers = createAsyncThunk<TOffer[], AbortSignal>('axios', async (signal) => {
  const { data } = await axios.get<TOffer[]>('https://16.design.htmlacademy.pro/six-cities/offers',{signal});
  return data;
}
);
type TLoginRequest = { email: string };
export const getLogin = createAsyncThunk<
  string,
  AbortSignal | undefined,
  { extra: AxiosInstance }
>('login', async (_, { extra: api }) => {
  const { data } = await api.get<TLoginRequest>('login');
  return data.email;
});
