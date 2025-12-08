import { createSlice } from '@reduxjs/toolkit';
import { TCity, TData, TPayloadCity, TPayloadString } from '../../types/types';
import { NameReducer } from '../../data/constant';

export interface TInitialStateSlice extends TData {
  email: string;
}

const initialState: TInitialStateSlice = {
  city: 'Paris',
  email: '',
};

 export const slice = createSlice({
  name: NameReducer.slice,
  initialState,
  reducers: {
    setCity: (state, { payload }: TPayloadCity) => {
      state.city = payload;
    },
    setEmail: (state: TInitialStateSlice, { payload }: TPayloadString) => {
      state.email = payload;
    },
  },
});

export const { setCity, setEmail} = slice.actions;
