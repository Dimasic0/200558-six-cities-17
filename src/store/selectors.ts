import { TOffer } from '../types/types';
import { useAppSelector } from './reducer';

const emptyArray: TOffer[] = [];

export const useOffers = () =>[...
useAppSelector((state) => state?.offersByCities?.[state?.city] || emptyArray)];
export const useCity = () => useAppSelector(({ city }) => city);
export const useEmail = () => useAppSelector((state) => state.email);
export const useOffersСities = () => useAppSelector((state) => state.offersByCities);
export const useEmail = ():string => useAppSelector((state) => state.email);
