import {memo,FC} from 'react';

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

class dataInLocalStorage {
  address: string;
  constructor (address:string) {
    this.address = address;
  }

  set value(data:string) {
    localStorage.setItem(this.address,data);
  }

  get value() {
    return localStorage.getItem(this.address);
  }

  delete() {
    localStorage.removeItem(this.address);
  }
}

export const Token = new dataInLocalStorage('token');

export {memoize};
