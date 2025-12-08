import { useState } from 'react';
import { TOffers } from '../types/types';
import { useAppSelector } from './index';

const emptyArray: TOffers[] = [];

export const useAllState = () => useAppSelector((state) => state);
export const useOffers = () => useAppSelector((state) => {
  emptyArray.length = 0;
  return state.sliceAsync.offersByCities?.[state.slice.city] || emptyArray;
}
);
export const useCity = () => useAppSelector(({ slice }) => slice.city);

export const useOffersСities = () =>
  useAppSelector((state) => state.sliceAsync.offersByCities);

export const useEmail = ():string => useAppSelector(({ slice }) => slice.email);
