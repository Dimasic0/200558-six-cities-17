import type { Action, AnyAction, PayloadAction } from '@reduxjs/toolkit';

/** Same shape as `createAction<TPayload>(type)()` return value. */
export type TAction<TType extends string = string, TPayload = unknown> =
  PayloadAction<TPayload, TType>;

/** Action without payload — `createAction(type)()` return value. */
export type TActionWithoutPayload<TType extends string = string> = Action<TType>;

/** Any action accepted by RTK slice reducers. */
export type TReducerAction = AnyAction;

/** Action with required `type` and `payload` (RTK `createAction` shape). */
export type TReducerActionStrict = PayloadAction<unknown, string>;

export type TReducerActionFromStrict<TStrict extends boolean = true> =
  TStrict extends true ? TReducerActionStrict : TReducerAction;
