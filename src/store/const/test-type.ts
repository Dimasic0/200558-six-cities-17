import { TObject } from '../../types/types';

export type TAction<TPayload  = unknown> = {
  type: string;
  payload: TPayload;
};