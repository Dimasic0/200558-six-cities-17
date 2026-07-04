import { it, expect } from 'vitest';
import { TAction } from './test type.ts';
import { TObject } from '../../types/types.ts';

type TTestAction = (
  text: string,
  fun: (param: unknown) => TAction,
  type: string,
  parameters: Array<unknown>,
) => void;
export const testAction: TTestAction = (text, fun, type, parameters) => {
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

export type TReducer<TState extends object> = (
  state: TState | undefined,
  action: TAction,
) => TState;

export type NarrowFromExpect<
  TState extends object,
  TExpect extends Partial<TState>,
> = {
  [K in keyof TState]: K extends keyof TExpect
    ? null extends TState[K]
      ? null extends NonNullable<TExpect[K]>
        ? TState[K]
        : NonNullable<TState[K]>
      : TState[K]
    : TState[K];
};

type LastExpectFromParams<
  TState extends object,
  TParams extends readonly unknown[],
> = TParams extends readonly [...unknown[], infer TLast extends Partial<TState>]
  ? TLast
  : Partial<TState>;

  type TActionExpects<TState extends object> = Array<TAction | TState>;
  type TActionExpectsPartial<TState extends object> = TActionExpects<Partial<TState>>;

export const testReducer = <TState extends object = object>(
  text: string,
  initialState: TState | undefined,
  reducer: TReducer<TState>,
  ...lastParams: TActionExpects<TState>
): TState => {
  type TCallback = (state: TState, expectState: TState) => void;
  const lastParamsFor = (callback: TCallback = () => {}) => {
    let state: TState;
    for (let i = 0; i < lastParams.length - 1; i += 2) {
      type TArrActionExpectstate = [TAction, TState];
      const [action, expectState] = lastParams.slice(
        i,
        i + 2,
      ) as TArrActionExpectstate;
      if (initialState !== undefined) {
        initialState = { ...initialState };
      }
      state = reducer(initialState, action);
      callback(state, expectState);
    }
    if (state === undefined) {
      throw new Error(
        `${text}: expected at least one [action, expectState] pair`,
      );
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

let objs: Array<[object, object]> = [];
const isObject = (value: unknown): value is object =>
  Object.prototype.toString.call(value) === '[object Object]';
const copyObjSuperficial = (obj1: object, obj2: object) => {
  for (const prop in obj2) {
    const value1 = obj1[prop];
    const value2 = obj2[prop];
    if (!isObject(value1) || !isObject(value2)) {
      obj1[prop] = value2;
      continue;
    }
    obj1[prop] = { ...value1 };
    objs.push([obj1[prop], obj2[prop]]);
  }
};

export const testReducerByChange = <
  TState extends object = object,
  TParams extends TActionExpectsPartial<TState> = TActionExpectsPartial<TState>,
>(
    text: string,
    initialState: TState | undefined,
    reducer: TReducer<TState>,
    ...lastParams: TParams
  ): NarrowFromExpect<TState, LastExpectFromParams<TState, TParams>> => {
  if (typeof initialState === 'object') {
    for (let i = 1; i < lastParams.length; i += 2) {
      objs = [];
      const initialStateCopy = { ...initialState };
      copyObjSuperficial(initialStateCopy, lastParams[i]);
      while (objs.length > 0) {
        type TObjsArr = [object,object];
        const [obj1, obj2] = objs.shift() as TObjsArr;
        copyObjSuperficial(obj1, obj2);
      }
      lastParams[i] = initialStateCopy;
    }
  }
  const lastParamsFinal = lastParams as TActionExpects<TState>;
  type TStateFinal = NarrowFromExpect<TState, LastExpectFromParams<TState, TParams>>;
  // type TActionExpect = [TAction,TState];
  // const [action, expectState] = lastParamsFinal.splice(0, 1) as TActionExpect;
  return testReducer<TStateFinal>(
    text,
    initialState,
    reducer,
    ...lastParamsFinal,
  );
};

export const testReduxUndefined = <TState extends object>(
  text: string,
  reducer: TReducer<TState>,
  expectState: TState,
): TState =>
    testReducer<TState>(
      `${text} defoult`,
      undefined,
      reducer,
      { type: '', payload: { email: '' } },
      expectState,
    );

export type TTestSpecificRedux = (
  text: string,
  initialState: object,
  action: TAction,
  expect: object,
) => object;

type TTestReducerParam<TState extends object = object> = (
  text: string,
  initialState: TState | undefined,
  ...lastProps: TActionExpects<TState>
) => TState;

type TTestReducerByChangeParam<TState extends object = object> = <
  TParams extends TActionExpectsPartial<TState>,
>(
  text: string,
  initialState: TState | undefined,
  ...lastProps: TParams
) => NarrowFromExpect<TState, LastExpectFromParams<TState, TParams>>;

type TTest<TState extends object = object> = (
  testReducer: TTestReducerParam<TState>,
  testReducerByChange: TTestReducerByChangeParam<TState>,
) => void;

export const testDescribe = <TState extends object = object>(
  text: string,
  reducer: TReducer<TState>,
  expectState: TState,
  test: TTest<TState>,
): void => {
  const testSpecificReducer: TTestReducerParam<TState> = (
    text,
    initialState,
    ...lastProps
  ) =>
    testReducer<TState>(
      text,
      initialState,
      reducer,
      ...lastProps,
    );

  const testSpecificReducerByChange: TTestReducerByChangeParam<TState> = (
    text,
    initialState,
    ...lastProps
  ) => testReducerByChange(text, initialState, reducer, ...lastProps);
  describe(text, () => {
    testReduxUndefined('', reducer, expectState);
    test(testSpecificReducer, testSpecificReducerByChange);
  });
};
