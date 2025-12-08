import { combineReducers, configureStore } from '@reduxjs/toolkit';
// import { reducer } from './reducer';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { AppDispatch, State } from '../types/state.ts';
import { api } from '../api.ts';
import { NameReducer } from '../data/constant.tsx';
import { slice, TInitialStateSlice } from './slice/slice.tsx';
import { TInitialStateSliceAsync } from './sliceAsync/sliceAsync.tsx';
import { sliceAsync } from './sliceAsync/sliceAsync.tsx';

// export const store = configureStore({reducer});
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<State> = useSelector;

const rootReducer = combineReducers({
  [NameReducer.slice]: slice.reducer,
  [NameReducer.sliceAsync]: sliceAsync.reducer,
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

type TInitialState = TInitialStateSliceAsync & TInitialStateSlice;
