import { createReducer, configureStore } from '@reduxjs/toolkit';
import { getOffers, setCity } from './action';
import { useSelector } from 'react-redux';
import { TypedUseSelectorHook } from 'react-redux';
import { TInitialState, TOffer } from '../types/types';

export const initialState: TInitialState = {
  city: 'Paris',
  offersByCities: null,
};
type TPayloadOffer = { payload : TOffer[]};
export const reducer = createReducer(initialState, (builder) => {
  builder.addCase(setCity, (state, { payload }) => {
    state.city = payload;
  });
  builder.addCase(
    getOffers.fulfilled,
    (state: TInitialState, { payload }: TPayloadOffer) => {
      state.offersByCities = Object.groupBy(
        payload,
        (el: TOffer) => el.city.name
      ) as Record<string, TOffer[]>;
    }
  );
});

export const store = configureStore({ reducer });

export const useAppSelector: TypedUseSelectorHook<TInitialState> = useSelector;
