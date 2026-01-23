import { useMemo, useState } from 'react';
import { TOffers } from '../types/types';
import { useAppSelector } from './index';

const emptyArray: TOffers[] = [];

export const useAllState = () => useAppSelector((state) => state);
export const useOffers = () => {
  const offers = useAppSelector((state) => {
    emptyArray.length = 0;
    return (
      state.offersByCities.offersByCities?.[state.offersByCities.city] ||
      emptyArray
    );
  });
  return useMemo(() => Object.values(offers), [offers]);
};
export const useCity = () =>
  useAppSelector(({ offersByCities }) => offersByCities.city);

export const useOffersСities = () =>
  useAppSelector((state) => state.offersByCities);

export const useEmail = () => useAppSelector(({ user }) => user.email);

export const useFavorites = () => {
  const offersByCities = useAppSelector(
    (state) => state.offersByCities.offersByCities,
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