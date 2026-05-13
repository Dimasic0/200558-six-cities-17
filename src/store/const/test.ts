import { it, expect } from 'vitest';
import { TAction } from './test type.ts';
import { TObject } from '../../types/types.ts';

type TTestAction=(text:string, fun:() => any, type:string, parameters:Array<any>)=>void;
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
    for (const param of parameters) {
      const objSetCity = fun(param);
      expect(objSetCity.payload).toBe(param);
    }
  });
};

export type TReducer = (state, action: TAction) => any;

type TTestReducer = (
  text: string,
  initialState: TObject,
  action: TAction,
  reducer: TReducer,
  expectState: TObject,
) => any;
export const testReducer: TTestReducer = (
  text,
  initialState,
  action,
  reducer,
  expectState,
) => {
  const state = reducer({ ...initialState }, action);
  it(`${text} reducer`, () => {
    const state = reducer({ ...initialState }, action);
    expect(state).toEqual(expectState);
  });
  return state;
};

export const testReducerByChange: TTestReducer = (
  text,
  initialState,
  action,
  reducer,
  expectState,
) => {
  const expect = Object.assign({...initialState}, expectState);
  return testReducer(text, initialState, action, reducer, {
  ...initialState,
  ...expectState,
});
}

export type TTestSpecificRedux = (text:string,initialState:TObject, action:TAction, expect:TObject)=>any;
