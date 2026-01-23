import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { AppDispatch, State } from '../types/state.ts';
import { api } from '../api.ts';
import { NameReducer } from '../data/constant.tsx';
import { offersSlice } from './offersSlice/offersSlice.tsx';
import { userSlice } from './userSlice/userSlice.tsx';

// export const store = configureStore({reducer});
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<State> = useSelector;

const rootReducer = combineReducers({
  [NameReducer.user]: userSlice.reducer,
  [NameReducer.offers]: offersSlice.reducer,
});

export const store = configureStore({
  reducer:rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: api,
      },
    }),
});