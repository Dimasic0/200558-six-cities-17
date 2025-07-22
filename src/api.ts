import axios from 'axios';

export const createAPI = () =>
  axios({
    baseURL: 'https://16.design.htmlacademy.pro/six-cities',
    timeout: 5000,
  });
