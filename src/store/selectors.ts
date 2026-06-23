import { useMemo } from 'react';
import { TOffers } from '../types/types';
import { useAppSelector } from './index';
import { NameReducer } from '../data/constant';

const emptyArray: TOffers[] = [];

export const useOffers = () => {
  const offers = useAppSelector((state) => {
    emptyArray.length = 0;
    return (
      state[NameReducer.offers].offersByCities?.[state[NameReducer.offers].city] ||
      emptyArray
    );
  });
  return useMemo(() => Object.values(offers), [offers]);
};
export const useCity = () => useAppSelector((state) => state[NameReducer.offers].city);

export const useOffersСities = () =>
  useAppSelector((state) => state[NameReducer.offers].offersByCities);

export const useEmail = () => useAppSelector(({ user }) => user.email);

export const useFavorites = () => {
  const offersByCities = useAppSelector(
    (state) => state[NameReducer.offers].offersByCities,
  );
  return useMemo(() => {
    const favorites = [];
    for (const city in offersByCities) {
      let offers = Object.values(offersByCities[city]);
      offers = offers.filter((el) => el.isFavorite);
      if (offers.length) favorites.push(offers);
    }
    return favorites;
  }, [offersByCities]);
};

export const useUser = () => useAppSelector(({user})=> user);