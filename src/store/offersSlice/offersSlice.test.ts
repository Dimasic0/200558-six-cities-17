import { offersSlice, setOffers } from './offersSlice.ts';
import { setCity } from '../action.ts';
import { testDescribe } from '../const/test.ts';
import { initialStateOffers } from './offersSlice.ts';
import { TStateOffers } from './offersSlice.ts';

const { reducer } = offersSlice;
// const testOffersReducerByChange: TTestSpecificRedux = (
//   text,
//   initialState,
//   ...lastParams
// ) =>
//   testReducerByChange(text, initialState, reducer, ...lastParams);
testDescribe(
  'offersSlice',
  reducer,
  initialStateOffers,
  (_, testOffersReducerByChange) => {
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
    let offer = {
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
    let state: TStateOffers = testOffersReducerByChange(
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
      'setOffer 2 offers in Paris',
      state,
      setOffers(offer),
      {
        offersByCities: {
          ...state.offersByCities,
          Paris: {
            ...state.offersByCities.Paris,
            'cced6fa8-419a-4fde-9702-2a6c81dda568': offer,
          },
        },
      },
    );

    offer = {
      id: '00720bc9-dd78-4384-9c5b-9f70359e807d',
      title: 'Canal View Prinsengracht',
      type: 'hotel',
      price: 315,
      previewImage: 'https://16.design.htmlacademy.pro/static/hotel/2.jpg',
      city: {
        name: 'Cologne',
        location: {
          latitude: 50.938361,
          longitude: 6.959974,
          zoom: 13,
        },
      },
      location: {
        latitude: 50.950361,
        longitude: 6.961974,
        zoom: 16,
      },
      isFavorite: false,
      isPremium: false,
      rating: 1.6,
    };
    state = testOffersReducerByChange(
      'setOffer Cologne',
      state,
      setOffers(offer),
      {
        offersByCities: {
          ...state?.offersByCities,
          Cologne: {
            '00720bc9-dd78-4384-9c5b-9f70359e807d': offer,
          },
        },
      },
    );

    offer = {
      id: '00720bc9-dd78-4384-9c5b-9f70359e807d',
      title: 'Canal View Prinsengracht',
      type: 'hotel',
      price: 300,
      previewImage: 'https://16.design.htmlacademy.pro/static/hotel/2.jpg',
      city: {
        name: 'Cologne',
        location: {
          latitude: 50.938361,
          longitude: 6.959974,
          zoom: 13,
        },
      },
      location: {
        latitude: 50.950361,
        longitude: 6.961974,
        zoom: 16,
      },
      isFavorite: false,
      isPremium: false,
      rating: 1.6,
    };
    state = testOffersReducerByChange(
      'setOffer Cologne change',
      state,
      setOffers(offer),
      {
        offersByCities: {
          ...state?.offersByCities,
          Cologne: {
            '00720bc9-dd78-4384-9c5b-9f70359e807d': offer,
          },
        },
      },
    );

    // type TTestParams =Array<[string,any,TAction,TObject]>;
    // const testParams: TTestParams = [
    //   [
    //     'setOffer',
    //     initialStateOffers,
    //     setOffers(offer),
    //     {
    //       offersByCities: {
    //         Paris: {
    //           '82fc8d67-a851-4637-964f-88fe508e833c': offer,
    //         },
    //       },
    //     },
    //   ],
    // ];
    // let state;
    // for (let test of testParams) {
    //   const [text, initialState = (state)=>state, Action, expectStatus] = test;
    //   if (typeof initialState  === 'function')
    //   {
    //      initialState = initialState(state);
    //   }
    //     state = testOffersReducerByChange(text, initialState, Action, expectStatus);
    // }
  },
);