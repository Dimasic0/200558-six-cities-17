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

export type TReducer<TState extends TObject = TObject> = (
  state: TState | undefined,
  action: TAction,
) => TState;

type TExpectActions<TState extends TObject = TObject> = Array<TAction | TState>;
type TExpectActionsPartial<TState extends TObject = TObject> = TExpectActions<Partial<TState>>;
export const testReducer = <TState extends TObject>(
  text: string,
  initialState: TState | undefined,
  reducer: TReducer<TState>,
  ...lastParams: TExpectActions<TState>
): TState => {
  type TCallback = (state: TState, expectState: TState) => void;
  const lastParamsFor = (callback: TCallback = () => {}) => {
    let state: TState | undefined = initialState;
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

export const testReducerByChange = <TState extends TObject = TObject>(
  text: string,
  initialState: TState | undefined,
  reducer: TReducer<TState>,
  ...lastParams: TExpectActionsPartial<TState>
): TState => {
  //const expect = Object.assign({ ...initialState }, expectState);
  if (typeof initialState === 'object') {
    for (let i = 1; i < lastParams.length; i += 2) {
      lastParams[i] = { ...initialState, ...lastParams[i] };
    }
  }
  return testReducer<TState>(text, initialState, reducer, ...lastParams);
};

export const testReduxUndefined = <TState extends TObject>(
  text: string,
  reducer: TReducer<TState>,
  expectState: TObject,
) =>testReducer<TState>(
  `${text} defoult`,
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

type TTestReducerParam<
  TState extends TObject = TObject,
  TExpect extends TObject = TState,
> = (
  text: string,
  initialState: TState | undefined,
  ...lastProps: TExpectActions<TExpect>
) => TState;
type TTest<TState extends TObject = TObject> = (
  testReducer: TTestReducerParam<TState>,
  testReducerByChange: TTestReducerParam<TState,Partial<TState>>,
) => void;

export const testDescribe = <TState extends TObject = TObject>(
  text: string,
  reducer: TReducer<TState>,
  expectState: Partial<TState>,
  test: TTest<TState>,
): void => {
  type TTestSpecificReducer = (
    text: string,
    initialState: TState | undefined,
    ...lastProps: TExpectActions<TState>
  ) => TState;
  const testSpecificReducer: TTestSpecificReducer = (
    text,
    initialState,
    ...lastProps
  ) => testReducer<TState>(text, initialState, reducer, ...lastProps);

  type TTestSpecificReducerByChange = (
    text,
    initialState: TState | undefined,
    ...lastProp: TExpectActionsPartial<TState>
  ) => TState;

  const testSpecificReducerByChange: TTestSpecificReducerByChange = (
    text,
    initialState,
    ...lastProps
  ): TState =>
    testReducerByChange<TState>(text, initialState, reducer, ...lastProps);
  describe(text, () => {
    testReduxUndefined('', reducer, expectState);
    test(testSpecificReducer, testSpecificReducerByChange);
  });
};