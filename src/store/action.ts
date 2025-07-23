import { createAction } from '@reduxjs/toolkit';
import { TCity } from '../types/types';

const setCity = createAction<TCity>('catalog/setCity');
const setOffers = createAction('catalog/setOffers');

export { setCity, setOffers };
