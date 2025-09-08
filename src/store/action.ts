import { createAction } from '@reduxjs/toolkit';
import { TAuthorizationPost, TCity, TOffer } from '../types/types';
import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { tokenSet } from '../data/constant';
import { api } from '../api';
axios.defaults.baseURL = 'https://16.design.htmlacademy.pro/six-cities/';

const getOffers = createAsyncThunk<TOffer[], AbortSignal>('offers', async (signal) => {
  const { data } = await axios.get<TOffer[]>('offers',{signal});
  return data;
});
const setCity = createAction<TCity>('catalog/setCity');
const setEmail = createAction<string>('email');
type TLoginRequest = { email: string };
const getLogin = createAsyncThunk<string, AbortSignal | undefined>(
  'login',
  async (signal) => {
    console.log('api=', { api });
    const { data } = await api.get<TLoginRequest>('login');
    console.log('getLogin data=', data.email);
    return data.email;
  }
);
const getLoginPost = createAsyncThunk<TAuthorizationPost,{ signal?: AbortSignal; email: string; password: string }>('loginPost', async ({ signal, email, password },api) => {
  const { data } = await axios.post<TAuthorizationPost>(
    'login',
    { email, password },
    { signal }
  );
  tokenSet(data.token);
  return data;
});
export { setCity, getOffers, setEmail,getLoginPost, getLogin };