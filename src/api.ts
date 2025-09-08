import axios, { AxiosRequestConfig } from 'axios';
import { token } from './data/constant';

export const createAPI = () =>
  axios.create({
    baseURL: 'https://16.design.htmlacademy.pro/six-cities/',
    timeout: 5000,
  });
export const api = createAPI();
api.interceptors.request.use((config) => {
   console.log('use=');
   console.log("config.headers['x-token']=", config.headers['x-token']);
  console.time();
  if (config.headers['x-token'] === undefined) { console.log('zax'); config.headers['x-token'] = token.read();}
  console.timeEnd();
  return config;
});