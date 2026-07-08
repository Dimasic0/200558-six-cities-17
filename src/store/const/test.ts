import { it, test, expect } from 'vitest';
import type { Reducer } from '@reduxjs/toolkit';
import { TReducerAction, TReducerActionFromStrict } from './test-type.ts';
import { TObject } from '../../types/types.ts';

const isObject = (value: unknown): value is object =>
  typeof value === 'object' && value !== null;
type TObjs = Array<[object | Array<unknown>, object | Array<unknown>]>;
const copyObjSuperficial = (
  obj1: object,
  obj2: object,
  objs: TObjs,
): void => {
  for (const prop in obj2) {
    const value1 = obj1[prop];
    const value2 = obj2[prop];

    if (!isObject(value1) || !isObject(value2)) {
      obj1[prop] = value2;
      continue;
    }
    if (Array.isArray(value2)) {
      if (Array.isArray(value1)) {
        obj1[prop] = [...value1, ...value2];
      } else {
        obj1[prop] = value2;
      }
      continue;
    } else if (!Array.isArray(value1)) {
      obj1[prop] = { ...value1 };
    }
    objs.push([obj1[prop], obj2[prop]]);
  }
};
const copyObjReducer = <TState extends object>(
  obj1: TState,
  obj2: TState,
): TState => {
  const objs: TObjs = [];
  const copyObjThis = (obj1: object, obj2: object) =>
    copyObjSuperficial(obj1, obj2, objs);
  copyObjThis(obj1, obj2);
  while (objs.length) {
    type TObjsArr = [object, object];
    const [obj1, obj2] = objs.shift() as TObjsArr;
    copyObjThis(obj1, obj2);
  }
  return obj1;
};

// type TTestAction = (
//   text: string,
//   fun: (param: unknown) => TAction,
//   type: string,
//   parameters: Array<unknown>,
// ) => void;
// export const testAction: TTestAction = (text, fun, type, parameters) => {
//   test.each(parameters)(`${text}: %j`, (param) => {
//     const objSetCity = fun(param);
//     expect(objSetCity).toEqual({ type, payload: param });
//   });
// };
// export const testActionLink: TTestAction = (text, fun, type, parameters) => {
//   test.each(parameters)(`${text}: %j`, (param) => {
//     const objSetCity = fun(param);
//     expect(objSetCity).toEqual({ type, payload: param });
//   });
//   test.each(parameters)(`${text} link ===: %j`, (param) => {
//     const objSetCity = fun(param);
//     expect(objSetCity.payload).toBe(param);
//   });
// };

export type TReducer<TState extends object> = Reducer<TState>;

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

type TActionExpects<TState extends object, TAction = TReducerAction> =
  | [string,TAction, TState]
  | [string,TAction, TState, ...Array<TAction | TState | string>];
type TActionExpectsPartial<
  TState extends object,
  TAction = TReducerAction,
> = TActionExpects<Partial<TState>, TAction>;

export const testReducer = <
  TState extends object,
  TParams extends TActionExpectsPartial<TState> = TActionExpectsPartial<TState>,
>(
    initialState: TState | undefined,
    reducer: TReducer<TState>,
    ...lastParams: TActionExpects<TState>
  ): NarrowFromExpect<TState, LastExpectFromParams<TState, TParams>> => {
  type TCallback = (text:string,state: TState, expectState: TState) => void;
  const lastParamsFor = (callback: TCallback = () => {}): TState => {
    let state: TState | undefined = initialState;
    for (let i = 0; i < lastParams.length - 1; i += 3) {
      type TArrActionExpectstate = [string,TReducerAction, TState];
      const [text, action, expectState] = lastParams.slice(
        i,
        i + 3,
      ) as TArrActionExpectstate;
      if (state !== undefined) {
        state = copyObjReducer({ ...state }, state);
      }
      state = reducer(state, action);
      callback(text, state, expectState);
    }
    if (state === undefined) {
      throw new Error(
        `${text}: expected at least one [action, expectState] pair`,
      );
    }
    return state;
  };

  lastParamsFor((text, state, expectState) => {
    it(`${text} reducer`, () => {
      expect(state).toEqual(expectState);
    });
  });
  return lastParamsFor();
};

export const testReducerByChange = <
  TState extends object,
  TParams extends TActionExpectsPartial<TState> = TActionExpectsPartial<TState>,
>(
    initialState: TState | undefined,
    reducer: TReducer<TState>,
    ...lastParams: TParams
  ): NarrowFromExpect<TState, LastExpectFromParams<TState, TParams>> => {
 type TCallback = (text: string, state: TState, expectState: TState) => void;
 const lastParamsFor = (callback: TCallback = () => {}): TState => {
   let state: TState | undefined = initialState;
   for (let i = 0; i < lastParams.length - 1; i += 3) {
     type TArrActionExpectstate = [string, TReducerAction, TState];
     let [text, action, expectState] = lastParams.slice(
       i,
       i + 3,
     ) as TArrActionExpectstate;
     if (state !== undefined) {
       state = copyObjReducer({ ...state }, state);
     }
     expectState = copyObjReducer({ ...state }, expectState);
     state = reducer(state, action);
     callback(text, state, expectState);
   }
   if (state === undefined) {
     throw new Error(
       `${text}: expected at least one [action, expectState] pair`,
     );
   }
   return state;
 };

 lastParamsFor((text, state, expectState) => {
   it(`${text} reducer`, () => {
     expect(state).toEqual(expectState);
   });
 });
 return lastParamsFor();
};

const unknownReducerAction: TReducerAction = { type: '@@TEST/UNKNOWN' };

export const testReduxUndefined = <TState extends object>(
  text: string,
  reducer: TReducer<TState>,
  expectState: TState,
): TState =>
    testReducer(
      undefined,
      reducer,
      `${text} default`,
      unknownReducerAction,
      expectState,
    );

export type TTestSpecificRedux = (
  text: string,
  initialState: object,
  action: TReducerAction,
  expect: object,
) => object;

type TTestReducerParam<TState extends object, TAction = TReducerAction> = (
  initialState: TState | undefined,
  ...lastProps: TActionExpects<TState, TAction>
) => TState;

type TTestReducerByChangeParam<
  TState extends object,
  TAction = TReducerAction,
> = <TParams extends TActionExpectsPartial<TState, TAction>>(
  initialState: TState | undefined,
  ...lastProps: TParams
) => NarrowFromExpect<TState, LastExpectFromParams<TState, TParams>>;

type TTest<TState extends object = TObject, TAction = TReducerAction> = (
  testReducer: TTestReducerParam<TState, TAction>,
  testReducerByChange: TTestReducerByChangeParam<TState, TAction>,
) => void;
export const testDescribe = <
  TState extends object,
  TStrictAction extends boolean = true,
>(
    text: string,
    reducer: TReducer<TState>,
    expectState: TState,
    test: TTest<TState, TReducerActionFromStrict<TStrictAction>>,
  ): void => {
  const testSpecificReducer: TTestReducerParam<
    TState,
    TReducerActionFromStrict<TStrictAction>
  > = (initialState, ...lastProps) =>
    testReducer<TState>(initialState, reducer, ...lastProps);

  const testSpecificReducerByChange: TTestReducerByChangeParam<
    TState,
    TReducerActionFromStrict<TStrictAction>
  > = (initialState, ...lastProps) =>
    testReducerByChange(initialState, reducer, ...lastProps);
  describe(text, () => {
    testReduxUndefined('', reducer, expectState);
    test(testSpecificReducer, testSpecificReducerByChange);
  });
};
