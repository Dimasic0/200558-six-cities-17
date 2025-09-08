import { createReducer, configureStore } from '@reduxjs/toolkit';
import { setCity, setOffers } from './action';
import { useSelector } from 'react-redux';
import { TypedUseSelectorHook } from 'react-redux';
import { TInitialState, TOffer } from '../types/types';

export const initialState: TInitialState = {
  city: 'Paris',
  offersByCities: null,
};

const reducer = createReducer(initialState, (builder) => {
  builder.addCase(setCity, (state, { payload }) => {
    state.city = payload;
  });
  builder.addCase(setOffers, (state: TInitialState, { payload }) => {
    state.city = payload.city;
    state.offersByCities = Object.groupBy(
      payload.offers,
      (el: TOffer) => el.city.name
    ) as Record<string, TOffer[]>;
  });
});

export const store = configureStore({ reducer });

export const useAppSelector: TypedUseSelectorHook<TInitialState> = useSelector;
