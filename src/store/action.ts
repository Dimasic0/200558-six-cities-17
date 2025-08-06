import { createAction } from '@reduxjs/toolkit';
import { TCity, TOffer } from '../types/types';
import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

const setCity = createAction<TCity>('catalog/setCity');
const setAsyncOffers = createAsyncThunk<TOffer[], AbortSignal>(
  'axios',
  async (signal) => {
    const { data } = await axios.get<TOffer[]>(
      'https://16.design.htmlacademy.pro/six-cities/offers',
      {
        signal,
      }
    );
    return data;
  }
);

export { setCity, setAsyncOffers };
