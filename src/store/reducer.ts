import { createReducer } from '@reduxjs/toolkit';
//import { setEmail, getOffers, setCity } from './action';
import { getOffers, setCity } from './action';
import { useSelector } from 'react-redux';
import { TypedUseSelectorHook } from 'react-redux';
import { TInitialState, TOffers } from '../types/types';
import { createSlice } from '@reduxjs/toolkit';
import { NameReducer } from '../data/constant';

export const initialState: TInitialState = {
  city: 'Paris',
  offersByCities: null,
  email: '',
};
type TPayloadOffer = { payload: TOffers[] };
type TPayloadString = {payload: string};

const slice = createSlice({
  name: NameReducer.slice,
  initialState,
  reducers: {
    setCity: (state, { payload }) => {
      state.city = payload;
    },
    setEmail: (state: TInitialState, { payload }: TPayloadString) => {
      state.email = payload;
    },
  },
});
console.log('slice.actions=', slice.actions);

const sliceAsync = createSlice({
  name: NameReducer.sliceAsync,
  initialState,
  reducers:{},
  extraReducers: (builder) => {
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
  }
});

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
  // builder.addCase(setEmail,(state: TInitialState, { payload }: TPayloadString) => {
  //   state.email = payload;
  // });
});

export const useAppSelector: TypedUseSelectorHook<TInitialState> = useSelector;
