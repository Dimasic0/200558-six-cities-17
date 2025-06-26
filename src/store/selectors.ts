import { TOffer } from '../types/types';
import { useAppSelector } from './reducer';

const arrayNull: TOffer[] = [];

export const useOffers = () => useAppSelector((state) => state?.offersCities?.[state?.city] || arrayNull);
export const useCity = () => useAppSelector(({ city }) => city);

export const useOffersСities = () => useAppSelector((state) => state.offersCities);
