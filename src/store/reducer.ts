import { createReducer, configureStore } from '@reduxjs/toolkit';
import { setEmail, getOffers, setCity, getLoginPost } from './action';
import { useSelector } from 'react-redux';
import { TypedUseSelectorHook } from 'react-redux';
import { TInitialState, TOffer } from '../types/types';

export const initialState: TInitialState = {
  city: 'Paris',
  offersByCities: null,
  email: '',
};
type TPayloadOffer = { payload : TOffer[]};
type TPayloadString = {payload: string};

export const reducer = createReducer(initialState, (builder) => {
  builder.addCase(setCity, (state, { payload }) => {
    state.city = payload;
  });
  builder.addCase(
    getOffers.fulfilled,
    (state: TInitialState, { payload }: TPayloadOffer) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      state.offersByCities = Object.groupBy(
        payload,
        (el: TOffer) => el.city.name
      ) as Record<string, TOffer[]>;
    }
  );
  builder.addCase(setEmail,(state: TInitialState, { payload }: TPayloadString) => {
    state.email = payload;
  });
  builder.addCase(getLoginPost.fulfilled, (state:TInitialState, {payload}) => {
    console.log('getLoginPost payload=', payload);
    state.email = payload.email;
  });
});

export const store = configureStore({ reducer });

export const useAppSelector: TypedUseSelectorHook<TInitialState> = useSelector;
