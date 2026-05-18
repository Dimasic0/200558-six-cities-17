import { it, expect } from 'vitest';
import { TAction } from './test type.ts';
import { TObject } from '../../types/types.ts';

type TTestAction = (
  text: string,
  fun: () => any,
  type: string,
  parameters: Array<any>,
) => void;
export const testAction: TTestAction = (
  text,
  fun = () => ({}),
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

export type TReducer = (state, action: TAction) => any;

type TTestReducer = (
  text: string,
  initialState: TObject,
  reducer: TReducer,
  ...lastParams: Array<TAction | TObject>
) => any;

export const testReducer: TTestReducer = (
  text,
  initialState,
  reducer,
  ...lastParams
) => {
  const lastParamsFor = (callBack = () => {}) => {
    let state;
    for (let i = 0; i < lastParams.length - 1; i += 2) {
      const [action, expectState] = lastParams.slice(i, i + 2);
      initialState =
        initialState === undefined ? undefined : { ...initialState };
      state = reducer(initialState, action);
      callBack(state, expectState);
    }
    return state;
  };
  it(`${text} reducer`, () => {
    lastParamsFor((state, expectState) => {
      expect(state).toEqual(expectState);
    });
  });
  return lastParamsFor();
};

export const testReducerByChange: TTestReducer = (
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
  return testReducer(text, initialState, reducer, ...lastParams);
};

export type TTestSpecificRedux = (
  text: string,
  initialState: TObject,
  action: TAction,
  expect: TObject,
) => any;
