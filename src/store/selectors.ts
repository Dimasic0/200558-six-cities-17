import { TOffers } from '../types/types';
import { useAppSelector } from './reducer';

const emptyArray: TOffers[] = [];

export const useOffers = () => useAppSelector((state) => {
  emptyArray.length = 0;
  return state.offersByCities?.[state.city] || emptyArray;
}
);
export const useCity = () => useAppSelector(({ city }) => city);

export const useOffersСities = () => useAppSelector((state) => state.offersByCities);

export const useEmail = ():string => useAppSelector((state) => state.email);
