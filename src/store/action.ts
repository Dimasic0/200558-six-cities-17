import { createAction } from '@reduxjs/toolkit';
import { TCity, TOffer } from '../types/types';
import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

const setCity = createAction<TCity>('catalog/setCity');

axios.defaults.baseURL = 'https://16.design.htmlacademy.pro/six-cities/';

const setAsyncOffers = createAsyncThunk<TOffer[], AbortSignal>(
  'offers',
  async (signal) => {
    const { data } = await axios.get<TOffer[]>(
      'offers',
      {
        signal,
      }
    );
    console.log('data=', data);
    return data;
  }
);
const setAsyncLogin = createAsyncThunk<TOffer[], AbortSignal>(
  'login',
  async (signal) => {
    const { data } = await axios.get<TOffer[]>(
      'login',
      {
        signal,
      }
    );
    return data;
  }
);

export { setCity, setAsyncOffers, setAsyncLogin };
