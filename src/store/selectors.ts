import { TOffer } from '../types/types';
import { useAppSelector } from './reducer';

const arrayNull: TOffer[] = [];

export const useOffers = () => useAppSelector((state) => {
  return state?.offersByCities?.[state?.city] || arrayNull;
});
export const useCity = () => useAppSelector(({ city }) => city);

export const useOffersСities = () => useAppSelector((state) => state.offersByCities);
