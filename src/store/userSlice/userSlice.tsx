import { createSlice } from '@reduxjs/toolkit';
import { NameReducer } from '../../data/constant';
import { IResLoginOptional, TPayload, TPayloadString } from '../../types/types';

const initialState: IResLoginOptional = {
  email: '',
  avatarUrl: '',
  name:'',
  isPro:false,
  token: ''
};

type TPayloadInitial = TPayload<IResLoginOptional>;

export const userSlice = createSlice({
  name: NameReducer.user,
  initialState,
  reducers: {
    setUser: (state: IResLoginOptional, { payload }: TPayloadInitial) => {
      console.log('setUser=',payload);
      Object.assign(state,payload);
    },
    setEmail: (state: IResLoginOptional, { payload }: TPayloadString) => {
      console.log('setEmail=', payload);
      Object.assign(state, {email: payload});
    }
  },
});

export const { setUser, setEmail } = userSlice.actions;
