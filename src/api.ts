import axios from 'axios';
import { Token } from './data/constant';

export const createAPI = () =>
  axios.create({
    baseURL: 'https://16.design.htmlacademy.pro/six-cities/',
    timeout: 5000,
  });
export const api = createAPI();

const token = 'x-token';
api.interceptors.request.use((config) => {
  if (!config.headers[token]) {
    config.headers[token] = Token.value;
  }
  return config;
});
