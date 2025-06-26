import { createReducer, configureStore } from '@reduxjs/toolkit';
import { setCity, setOffers } from './action';
import { useSelector } from 'react-redux';
import { TypedUseSelectorHook } from 'react-redux';
import { TData } from '../types/types';
import { TInitialState, TOffer } from '../types/types';

// function getOffersCities (offersParam: TOffer[]):TOffersCities {
//   const offersСities: TOffersCities = {};
//   offersParam.forEach((offer) => {
//     const city = offer.city.name;
//     if (!offersСities[city]) {
//       offersСities[city] = [];
//     }
//     offersСities[city].push(offer);
//   });
//   return offersСities;
// }

export const initialState: TInitialState = {
  offers: [],
  city: 'Paris',
  offersCities: null,
};

const reducer = createReducer(initialState, (builder) => {
  type TAction = { payload: TData };
  builder.addCase(setCity, (state, { payload }) => {
    state.city = payload;
  });
  builder.addCase(setOffers, (state: TInitialState, { payload }: TAction) => {
    //state = { ...state, ...payload };
    // state.city = payload.city;
    // const offersСities: TOffersCities = {};
    // payload.offers.forEach((offer) => {
    //   const city = offer.city.name;
    //   if (!offersСities[city]) {
    //     offersСities[city] = [];
    //   }
    //   offersСities[city].push(offer);
    // });
    // state.offersCities = offersСities;
    //type TProp = 'offers' | 'city';
    // for(const prop in payload) {
    // //state[prop]  as TInitialState[typeof prop] = payload[prop];
    //   let a = state[prop as keyof TInitialState];
    //   const b = payload[prop as keyof TInitialState];
    //   a = b;
    //   state[prop as keyof TInitialState] as TInitialState = payload[prop as keyof TInitialState];
    // }

    Object.assign(state, payload);

    state.offersCities = Object.groupBy(
      payload.offers,
      (el:TOffer) => el.city.name
    ) as Record<string, TOffer[]>;
  });
});

export const store = configureStore({ reducer });

export const useAppSelector: TypedUseSelectorHook<TInitialState> = useSelector;
