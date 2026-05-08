import { describe, it, expect } from 'vitest';
import { offersSlice } from './offersSlice.tsx';
import { setCity } from '../action.ts';
import { testReducerByChange } from '../const/test.ts';
import { initialStateOffers } from './offersSlice.tsx';
import { TObject } from '../../types/types.ts';

const initialStateOffers = {
  city: 'Paris',
  offersByCitie: null,
};
const testOffersReducerByChange = (initialState, action, expect) => {
  testReducerByChange(
    'offersSlice',
    initialStateOffers,
    action,
    offersSlice.reducer,
    expect,
  );
};
describe('offersSlice', () => {
  // it('offersSlice reducer',() => {
  //   const city = 'london';
  //   const cityAction = setCity(city);
  //   const initialState = {
  //     city: 'Paris',
  //     offersByCitie: null
  //   };
  //   const state = offersSlice.reducer({...initialState}, cityAction);
  //   expect(state).toEqual({ ...initialState, city });
  // });
  const props = 'london';
  testOffersReducerByChange(
    initialState,
    setCity(props),
    { city: props },
  );
});
