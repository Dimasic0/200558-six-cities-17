import { it, expect } from 'vitest';
import { TObject,TAction, TReducer } from '../../types/types';

type TTestAction=(text:string, fun:()=> any, type:string, parameters:Array)=>void;
export const testAction: TTestAction = (text, fun = () => ({}), type, parameters) => {
  it(text, () => {
    for (const param of parameters) {
      const objSetCity = fun(param);
      expect(objSetCity).toEqual({ type: type, payload: param });
    }
  });
};
export const testActionLink:TTestAction = (text, fun, type, parameters) => {
  it(text, () => {
    for (const param of parameters) {
      const objSetCity = fun(param);
      expect(objSetCity).toEqual({ type, payload: param });
    }
  });
  it(`${text} link ===`, () => {
    for (let param of parameters) {
      const objSetCity = fun(param);
      expect(objSetCity.payload).toBe(param);
    }
  });
};


type TTestReducer = (
  text: string,
  initialState: TObject,
  action: TAction,
  reducer: TReducer,
  expectState: TObject,
) => void;
export const testReducer: TTestReducer = (
  text,
  initialState,
  action,
  reducer,
  expectState,
) => {
  it(`${text} reducer`, () => {
    const state = reducer({ ...initialState }, action);
    expect(state).toEqual(expectState);
  });
};

export const testReducerByChange: TTestReducer = (
  text,
  initialState,
  action,
  reducer,
  expectState,
) => {
  testReducer(text, initialState, action, reducer, {
    ...initialState,
    ...expectState,
  });
};