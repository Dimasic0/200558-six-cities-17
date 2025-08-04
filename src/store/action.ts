import { createAction } from '@reduxjs/toolkit';
import { TCity, TOffer } from '../types/types';
import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

const setCity = createAction<TCity>('catalog/setCity');
const setOffers = createAction<TOffer[]>('catalog/setOffer[]');
const setAxiosAction = createAsyncThunk<TOffer[], { signal: AbortSignal; url:string }>(
  'axios',
  async ({url, signal }) => {
    const { data } = await axios.get<TOffer[]>(url, {
      signal,
    });
    console.log('data=', data);
    return data;
  }
);

export { setCity, setAxiosAction };
