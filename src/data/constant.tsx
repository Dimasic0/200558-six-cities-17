import axios from 'axios';
import {memo,FC} from 'react';
import { useNavigate } from 'react-router-dom';

export enum Address {
  main= '/',
  login='/login',
  favorites= '/favorites',
  offer= '/offer/:id'
}

export enum PrivateStatus {
  Auth = 'AUTH',
  Guest = 'GUEST',
  Unknown = 'UNKNOWN'
}

export enum sortingName {
  popular='Popular',
  low ='Price: low to high',
  high= 'Price: high to low',
  rated = 'Top rated first'
}
export type TSortingName = `${sortingName}`;
const СITIES = ['Paris', 'Cologne', 'Brussels', 'Amsterdam', 'Hamburg', 'Dusseldorf'] as const;

export { СITIES };

export const URL_MARKER_DEFAULT =
  'https://assets.htmlacademy.ru/content/intensive/javascript-1/demo/interactive-map/pin.svg';

export const URL_MARKER_CURRENT =
  'https://assets.htmlacademy.ru/content/intensive/javascript-1/demo/interactive-map/main-pin.svg';

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const {stringify} = JSON;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const memoize = <t extends Record<string, any>>(com: FC<t>) => memo<t>(com, (prop1, prop2) => stringify(prop1) === stringify(prop2));
export {memoize};

export const tokenSet = (token:string):void => {
  localStorage.setItem('token',token);
  axios.defaults.headers['x-token'] = token;
};

export const tokenGet = () => localStorage.getItem('token');

export const tokenDelete = (token:string):void => {
  localStorage.removeItem('token');
};