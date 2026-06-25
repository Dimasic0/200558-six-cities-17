import { it, expect } from 'vitest';
import { TAction } from './test type.ts';
import { TObject } from '../../types/types.ts';

type TTestAction = (
  text: string,
  fun: (param:unknown) => TAction,
  type: string,
  parameters: Array<any>,
) => void;
export const testAction: TTestAction = (
  text,
  fun,
  type,
  parameters,
) => {
  it(text, () => {
    for (const param of parameters) {
      const objSetCity = fun(param);
      expect(objSetCity).toEqual({ type: type, payload: param });
    }
  });
};
export const testActionLink: TTestAction = (text, fun, type, parameters) => {
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

export type TReducer = (state: any, action: TAction) => any;

type TTestReducer= <t = any> (
  text: string,
  initialState:unknown,
  reducer: TReducer,
  ...lastParams: Array<TAction | TObject>
) => t;

export const testReducer: TTestReducer = (
  text,
  initialState,
  reducer,
  ...lastParams
) => {
  type TCallback = (state, expectState) => void;
  const lastParamsFor = (callback: TCallback = () => {}) => {
    for (let i = 0; i < lastParams.length - 1; i += 2) {
      type TArrActionExpectstate = [TAction,TObject];
      const [action, expectState] = lastParams.slice(i,i + 2) as TArrActionExpectstate;
      initialState =
        initialState === undefined ? undefined : { ...initialState };
      if (typeof initialState === 'object') {
        const state = reducer(initialState, action) as typeof initialState;
        callback(state, expectState);
        return state;
      } else {
        const state = reducer(
          initialState,
          action,
        ) as typeof initialState;
        callback(state, expectState);
        return state;
      }
    }
  };
  it(`${text} reducer`, () => {
    lastParamsFor((state, expectState) => {
      expect(state).toEqual(expectState);
    });
  });
  return lastParamsFor();
};

type TTestReducerByChange = (
  text: string,
  initialState: unknown,
  reducer: TReducer,
  ...lastParams: Array<TAction | TObject>
) => TObject;
export const testReducerByChange: TTestReducerByChange = (
  text,
  initialState,
  reducer,
  ...lastParams
) => {
  //const expect = Object.assign({ ...initialState }, expectState);
  if (typeof initialState === 'object') {
    for (let i = 1; i < lastParams.length; i += 2) {
      lastParams[i] = { ...initialState, ...lastParams[i] };
    }
  }
  return testReducer<TObject>(text, initialState, reducer, ...lastParams);
};

type TTestReduxUndefined = (
  text: string,
  reducer: TReducer,
  expectState: TObject,
) => TObject;
export const testReduxUndefined: TTestReduxUndefined = (
  text,
  reducer,
  expectState,
) =>
  testReducer<TObject>(
    text + ' defoult',
    undefined,
    reducer,
    { type: '', payload: { email: '' } },
    expectState,
  );

export type TTestSpecificRedux = (
  text: string,
  initialState: TObject,
  action: TAction,
  expect: TObject,
) => TObject;

type TTestReducerParam = (text: string, initialState: t, ...lastProps: any[]) => t;
type TTestReducerByChangeParam = (
  text: string,
  initialState: unknown,
  ...lastProps: Array<TAction | TObject>
) => TObject;

type TTestDescribe = (
  text: string,
  reducer: TReducer,
  expectState: TObject,
  callback: (
    testReducer: TTestReducerParam,
    testReducerByChange: TTestReducerByChangeParam,
  ) => void,
) => void;
export const testDescribe: TTestDescribe = (text, reducer, expectState, callback) => {
  type TTestSpecificReducer = (text:string,initialState:unknown,...lastProps:Array<TAction | TObject>)=> unknown;
  const testSpecificReducer: TTestSpecificReducer = (
    text,
    initialState,
    ...lastProps
  ) => testReducer(text, initialState, reducer, ...lastProps);

  const testSpecificReducerByChange: TTestReducerByChangeParam = (
    text,
    initialState,
    ...lastProps
  ) => testReducerByChange(text, initialState, reducer, ...lastProps);
  describe(text,()=> {
  testReduxUndefined('', reducer, expectState);
  callback(testSpecificReducer, testSpecificReducerByChange);
  });
};
