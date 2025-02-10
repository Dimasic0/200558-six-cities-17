import { useAppSelector } from './reducer';

export const useOffersByCity = () =>
  useAppSelector((state) =>
    state.offersСities[state.city]
  ) || {};

export const useOffersСities = () =>
  useAppSelector((state) => state.offersСities);
