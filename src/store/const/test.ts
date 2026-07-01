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

export type TReducer<TState extends TObject> = (
  state: TState | undefined,
  action: TAction,
) => TState;

type TExpectActions<TState extends TObject = TObject> = Array<TAction | TState>;
type TExpectActionsPartial<TState extends TObject = TObject> = TExpectActions<
  Partial<TState>
>;

export type NarrowFromExpect<
  TState extends TObject,
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
  TState extends TObject,
  TParams extends readonly unknown[],
> = TParams extends readonly [...unknown[], infer TLast extends Partial<TState>]
  ? TLast
  : Partial<TState>;
export const testReducer = <TState extends TObject = TObject>(
  text: string,
  initialState: TState | undefined,
  reducer: TReducer<TState>,
  action: TAction,
  expectState: TState,
  ...lastParams: TExpectActions<TState> 
): TState => {
  type TCallback = (state: TState, expectState: TState) => void;
  const lastParamsFor = (callback: TCallback = () => {}) => {
    lastParams.unshift(action, expectState);
    let state: TState;
    for (let i = 0; i < lastParams.length - 1 ; i += 2) {
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
    if (state! === undefined) {
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

let objs: Array<[TObject, TObject]> = [];
const isObject = (value: unknown): value is TObject =>
  Object.prototype.toString.call(value) === '[object Object]';
const copyObjSuperficial = (obj1: TObject, obj2: TObject) => {
  for (let prop in obj2) {
    if (!isObject(obj1[prop]) || !isObject(obj2[prop])) {
      obj1[prop] = obj2[prop];
      continue;
    }
    obj1[prop] = { ...obj1[prop] };
    objs.push([obj1[prop], obj2[prop]]);
  }
};

export const testReducerByChange = <
  TState extends TObject = TObject,
  TParams extends TExpectActionsPartial<TState> = TExpectActionsPartial<TState>,
>(
  text: string,
  initialState: TState | undefined,
  reducer: TReducer<TState>,
  action: TAction,
  expectState: TState,
  ...lastParams: TParams
): NarrowFromExpect<TState, LastExpectFromParams<TState, TParams>> => {
  if (typeof initialState === 'object') {
    for (let i = 1; i < lastParams.length; i += 2) {
      objs = [];
      const initialStateCopy = { ...initialState };
      copyObjSuperficial(initialStateCopy, lastParams[i]);
      while (objs.length > 0) {
        const [obj1, obj2] = objs.shift()!;
        copyObjSuperficial(obj1, obj2);
      }
      lastParams[i] = initialStateCopy;
    }
  }
  const lastParamsFinal = lastParams as TExpectActions<TState>;
  return testReducer<TState>(
    text,
    initialState,
    reducer,
    action,
    expectState,
    ...lastParamsFinal,
  );
};

export const testReduxUndefined = <TState extends TObject>(
  text: string,
  reducer: TReducer<TState>,
  expectState: TObject,
) =>
  testReducer<TState>(
    `${text} defoult`,
    undefined,
    reducer,
    { type: '', payload: { email: '' } },
    expectState as TState,
  );

export type TTestSpecificRedux = (
  text: string,
  initialState: TObject,
  action: TAction,
  expect: TObject,
) => TObject;

type TTestReducerParam<TState extends TObject = TObject> = <
  TParams extends TExpectActions<TState>,
>(
  text: string,
  initialState: TState | undefined,
  action: TAction,
  expect: TObject,
  ...lastProps: TParams
) => NarrowFromExpect<TState, LastExpectFromParams<TState, TParams>>;

type TTestReducerByChangeParam<TState extends TObject = TObject> = <
  TParams extends TExpectActionsPartial<TState>,
>(
  text: string,
  initialState: TState | undefined,
  ...lastProps: TParams
) => NarrowFromExpect<TState, LastExpectFromParams<TState, TParams>>;

type TTest<TState extends TObject = TObject> = (
  testReducer: TTestReducerParam<TState>,
  testReducerByChange: TTestReducerByChangeParam<TState>,
) => void;

export const testDescribe = <TState extends TObject = TObject>(
  text: string,
  reducer: TReducer<TState>,
  expectState: Partial<TState>,
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
    ) as NarrowFromExpect<
      TState,
      LastExpectFromParams<TState, typeof lastProps>
    >;

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
