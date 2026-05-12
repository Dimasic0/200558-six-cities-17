import { describe, it, expect } from 'vitest';
import { offersSlice, setOffers } from './offersSlice.tsx';
import { setCity } from '../action.ts';
import { testReducerByChange, TTestSpecificRedux } from '../const/test.ts';
import { initialStateOffers } from './offersSlice.tsx';
const testOffersReducerByChange: TTestSpecificRedux = (
  text,
  initialState,
  action,
  expect,
) => {
  testReducerByChange(
    text,
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
  testOffersReducerByChange('setCity', initialStateOffers, setCity(props), {
    city: props,
  });
  const offer = {
    id: '82fc8d67-a851-4637-964f-88fe508e833c',
    title: 'Tile House',
    type: 'hotel',
    price: 417,
    previewImage: 'https://16.design.htmlacademy.pro/static/hotel/12.jpg',
    city: {
      name: 'Paris',
      location: {
        latitude: 48.85661,
        longitude: 2.351499,
        zoom: 13,
      },
    },
    location: {
      latitude: 48.868610000000004,
      longitude: 2.342499,
      zoom: 16,
    },
    isFavorite: false,
    isPremium: true,
    rating: 2.9,
  };
  let state = testOffersReducerByChange(
    'setOffer',
    initialStateOffers,
    setOffers(offer),
    {
      offersByCities: {
        Paris: {
          '82fc8d67-a851-4637-964f-88fe508e833c': offer,
        },
      },
    },
  );
  offer = {
    id: 'cced6fa8-419a-4fde-9702-2a6c81dda568',
    title: 'Nice, cozy, warm big bed apartment',
    type: 'hotel',
    price: 105,
    previewImage: 'https://16.design.htmlacademy.pro/static/hotel/9.jpg',
    city: {
      name: 'Paris',
      location: {
        latitude: 48.85661,
        longitude: 2.351499,
        zoom: 13,
      },
    },
    location: {
      latitude: 48.834610000000005,
      longitude: 2.335499,
      zoom: 16,
    },
    isFavorite: false,
    isPremium: true,
    rating: 4.6,
  };
  state = testOffersReducerByChange(
    'setOffer',
    state,
    setOffers(offer),
    {
      offersByCities: {
        Paris: {
          '82fc8d67-a851-4637-964f-88fe508e833c': offer,
        },
      },
    },
  );
});
