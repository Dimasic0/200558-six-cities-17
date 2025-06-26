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

const СITIES = ['Paris', 'Cologne', 'Brussels', 'Amsterdam', 'Hamburg', 'Dusseldorf'] as const;

export { СITIES };

export const URL_MARKER_DEFAULT =
  'https://assets.htmlacademy.ru/content/intensive/javascript-1/demo/interactive-map/pin.svg';

export const URL_MARKER_CURRENT =
  'https://assets.htmlacademy.ru/content/intensive/javascript-1/demo/interactive-map/main-pin.svg';

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const {stringify} = JSON;

const memoize = <t extends Record<string, any>>(com: FC<t>) => memo<t>(com, (prop1, prop2) => stringify(prop1) === stringify(prop2));
export {memoize};
