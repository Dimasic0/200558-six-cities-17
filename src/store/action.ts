import { createAction } from '@reduxjs/toolkit';
import { TCity, TOffer } from '../types/types';
import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../api';

const setCity = createAction<TCity>('catalog/setCity');
const setEmail = createAction<string>('email');
const getOffers = createAsyncThunk<TOffer[], AbortSignal>('axios', async (signal) => {
  const { data } = await axios.get<TOffer[]>('https://16.design.htmlacademy.pro/six-cities/offers',{signal});
  return data;
}
);
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

export { setCity, getOffers, setEmail, getLogin };
