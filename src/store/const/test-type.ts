import { TObject } from '../../types/types';

export type TAction = {
  type: string;
  payload: any;
};
export type TTestSpecificRedux = (
  text: string,
  action: TAction,
  expect: TObject,
) => void;
export type TReducer = (state:TObject, action: TAction) => any;