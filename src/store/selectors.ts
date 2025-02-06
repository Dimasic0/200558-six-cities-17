import { TInitialState } from '../types/types';
import { useAppSelector } from './reducer';
import { TOffersCities } from '../types/types';

export const useOffersByCity = () =>
  useAppSelector((state) =>
    state.offersСities[state.city]
  ) || {};

export const useOffersСities = () => (state: TInitialState) => state.offersСities;
