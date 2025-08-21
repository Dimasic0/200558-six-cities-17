import { createAction } from '@reduxjs/toolkit';
import { TAuthorizationPost, TCity, TOffer } from '../types/types';
import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { tokenSet } from '../data/constant';

const setCity = createAction<TCity>('catalog/setCity');

axios.defaults.baseURL = 'https://16.design.htmlacademy.pro/six-cities/';

const getOffers = createAsyncThunk<TOffer[], AbortSignal>('offers', async (signal) => {
  const { data } = await axios.get<TOffer[]>('offers',{signal});
  return data;
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

export { setCity, getOffers, getLoginPost };
//export { setCity, setAsyncOffers, setAsyncLoginGet, setAsyncLoginPost };
