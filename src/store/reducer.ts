import { createReducer, configureStore } from '@reduxjs/toolkit';
import { setCity } from './action';
import { useSelector } from 'react-redux';
import { TypedUseSelectorHook } from 'react-redux';
import { offers, offersCities } from '../mocks/offers';
import { TInitialState, TOffer, TOffersCities } from '../types/types';

const initialState: TInitialState = {
  offers: offers,
  city: 'Paris',
  offersСities: getOffersCities(offers),
};

// const reducer = createReducer(initialState, (builder) => {
//   builder
//     .addCase('offers', (state, action) => ({...state, offers: offersCities[action.payload]}))
// });

function getOffersCities (offers:TOffer[]):TOffersCities {
  const offersСities: TOffersCities = {};
  offers.forEach((offer) => {
    const city = offer.city.name;
    if (!offersСities[city]) {
      offersСities[city] = [];
    }
    offersСities[city].push(offer);
  });
  return offersСities;
}

const reducer = createReducer(initialState, (builder) => {
  builder.addCase(setCity, (state, { payload }) => {
    state.city = payload;
    return getOffersCities(state.offers);
  });
});

export const store = configureStore({ reducer });

export const useAppSelector: TypedUseSelectorHook<TInitialState> = useSelector;
