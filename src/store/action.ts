import { createAction } from '@reduxjs/toolkit';
import { TAuthorizationPost, TCity, TOffer } from '../types/types';
import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

const setCity = createAction<TCity>('catalog/setCity');

axios.defaults.baseURL = 'https://16.design.htmlacademy.pro/six-cities/';

const getOffers = createAsyncThunk<TOffer[], AbortSignal>('offers', async (signal) => {
  const { data } = await axios.get<TOffer[]>('offers',{signal});
  return data;
}
);
const getLoginGet = createAsyncThunk<TOffer[], AbortSignal>('login', async (signal) => {
  const { data } = await axios.get<TOffer[]>('login',{signal});
  return data;
}
);
const getLoginPost = createAsyncThunk<TAuthorizationPost,{ signal?: AbortSignal; email: string; password: string }>('loginPost', async ({ signal, email, password },api) => {
  console.log('getLoginPost api=', api);
  const { data } = await axios.post<TAuthorizationPost>(
    'login',
    { email, password },
    { signal }
  );
  return data;
});

export { setCity, getOffers, getLoginGet, getLoginPost };
//export { setCity, setAsyncOffers, setAsyncLoginGet, setAsyncLoginPost };
