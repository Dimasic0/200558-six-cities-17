import { createAction } from '@reduxjs/toolkit';
import { TCity, TOffer } from '../types/types';
import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

const setCity = createAction<TCity>('catalog/setCity');
const setEmail = createAction<string>('email');
const getOffers = createAsyncThunk<TOffer[], AbortSignal>('axios',async (signal) => {
  const { data } = await axios.get<TOffer[]>('https://16.design.htmlacademy.pro/six-cities/offers',{signal});
  return data;
}
);
const getLogin = createAsyncThunk<TOffer[], AbortSignal | undefined>('login', async (signal,api) => {
  const { data } = await api.get('login',{ signal });
  console.log('login=',data);
  return data;
}
);

export { setCity, getOffers, setEmail, getLogin };
