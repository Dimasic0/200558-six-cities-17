import { createSlice } from '@reduxjs/toolkit';
import { NameReducer } from '../../data/constant';
import { TOffer, TOffers, TOffersByCities } from '../../types/types';
import { getOffers } from '../action';

export interface TInitialStateSliceAsync {
    offersByCities: TOffersByCities | null;
};

const initialState: TInitialStateSliceAsync = {
  offersByCities: null
};

type TPayloadOffer = { payload: TOffers[] };

export const sliceAsync = createSlice({
  name: NameReducer.sliceAsync,
  initialState,
  reducers:{},
  extraReducers: (builder) => {
    builder.addCase(
      getOffers.fulfilled,
      (state: TInitialStateSliceAsync, { payload }: TPayloadOffer) => {
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
