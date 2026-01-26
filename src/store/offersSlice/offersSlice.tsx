import { createSlice } from '@reduxjs/toolkit';
import { cityDefault, NameReducer } from '../../data/constant';
import { TCity, TOffersByCities, TOffersOptional } from '../../types/types';
import { setCity } from '../action';

interface TInitialState {
    offersByCities: TOffersByCities | null;
    city:TCity ;
};

const initialState: TInitialState = {
  offersByCities: null,
  city:cityDefault
};

type TPayloadOffer = { payload: TOffersOptional | TOffersOptional[] };

export const offersSlice = createSlice({
  name: NameReducer.offers,
  initialState,
  reducers:{
    setOffers: (state: TInitialState, { payload: offers }: TPayloadOffer) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (state.offersByCities === null) {
        state.offersByCities = {};
      }

      const { offersByCities } = state;
      if (!Array.isArray(offers)) {
        offers = [offers];
      }
      for (const offer of offers) {
        if (!offersByCities[offer.city.name]) {
          offersByCities[offer.city.name] = {
            [offer.id]: offer
          };
          continue;
        }
        if (offersByCities[offer.city.name][offer.id]){
          const offerLast = offersByCities[offer.city.name][offer.id];
          Object.assign(offerLast, offer);
          continue;
        }
        offersByCities[offer.city.name][offer.id] = offer;
      }
    }
  },
  extraReducers: (builder) => {
    builder.addCase(setCity,(state, {payload:city})=>{
      state.city = city;
    });
    // builder.addCase(
    //   getOffers.fulfilled,
    //   (state: TInitialState, { payload:offers }: TPayloadOffer) => {
    //     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //     // @ts-ignore
    //     console.log('offers=', offers);
    //     if (state.offersByCities === null) {
    //       state.offersByCities = {};
    //     }
    //     const {offersByCities} = state;
    //     if (!Array.isArray(offers)) {
    //       offers = [...offers];
    //     }
    //     for(const offer of offers) {
    //       if (!offersByCities[offer.city.name]) {
    //         offersByCities[offer.city.name] = {
    //         [offer.id]: offer,
    //         };
    //         continue;
    //       }
    //       offersByCities[offer.city.name][offer.id] = offer;
    //     }
    //   }
    // );
  }
});

export const { setOffers } = offersSlice.actions;
