import { createAction } from '@reduxjs/toolkit';
import { TCity, TData } from '../types/types';

const setCity = createAction<TCity>('catalog/setCity');
const setOffers = createAction<TData>('catalog/setOffers');

export { setCity, setOffers };
