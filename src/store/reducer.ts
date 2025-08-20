import { createReducer, configureStore } from '@reduxjs/toolkit';
import { getOffers, getLoginGet, getLoginPost, setCity } from './action';
import { useSelector } from 'react-redux';
import { TypedUseSelectorHook } from 'react-redux';
import { TInitialState, TOffer } from '../types/types';

export const initialState: TInitialState = {
  city: 'Paris',
  offersByCities: null,
  email: '',
};
type TPayloadOffer = { payload : TOffer[]};
export const reducer = createReducer(initialState, (builder) => {
  builder.addCase(setCity, (state, { payload }) => {
    state.city = payload;
  });
  builder.addCase(getOffers.fulfilled, (state, { payload }: TPayloadOffer) => {
    console.log('offers=', payload);
    state.offersByCities = Object.groupBy(
      payload,
      (el: TOffer) => el.city.name
    ) as Record<string, TOffer[]>;
  });
  builder.addCase(getLoginGet.fulfilled, (state) => {
    //state.authorizationStatus = true;
    console.log('authorization');
  });
  builder.addCase(getLoginPost.fulfilled, (state, { payload }) => {
    console.log('payload=', payload);
    state.email = payload.email;
  });
});

export const store = configureStore({ reducer });

export const useAppSelector: TypedUseSelectorHook<TInitialState> = useSelector;
