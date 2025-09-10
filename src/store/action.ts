import { createAction } from '@reduxjs/toolkit';
import { TAuthorizationPost, TCity, TOffer } from '../types/types';
import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../api';

export const setCity = createAction<TCity>('catalog/setCity');
export const setEmail = createAction<string>('email');
export const getOffers = createAsyncThunk<TOffer[], AbortSignal>('axios', async (signal) => {
  const { data } = await axios.get<TOffer[]>('https://16.design.htmlacademy.pro/six-cities/offers',{signal});
  return data;
}
);
    // interface TResLogin {
    //   avatarUrl: string;
    //   email: string;
    //   isPro: boolean;
    //   name: string;
    //   token: string;
    // }
type TLoginRequest = { email: string };
export const getLogin = createAsyncThunk<string, AbortSignal | undefined>(
  'login',
  async (param, {extra:api}) => {
    // console.log('param=', param);
    const { data } = await api.get<TLoginRequest>('login');
    console.log('getLogin data=', data.email);
    return data.email;
  }
);
// export const getLoginPost = createAsyncThunk<
//   TResLogin,
//   { email: string | null; password: string | null; signal?: AbortSignal }
// >('loginPost', async ({ signal, ...param }) => {
//   const { data } = await api.post<TResLogin>('login', param, {signal});
//   console.log('loginPost=', data);
//   return data;
// });
