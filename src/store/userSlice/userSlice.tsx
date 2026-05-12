import { createSlice } from '@reduxjs/toolkit';
import { NameReducer } from '../../data/constant';
import { IResLoginOptional, TPayload, TPayloadString } from '../../types/types';

export const userInitialState: IResLoginOptional = {
  email: '',
  avatarUrl: '',
  name:'',
  isPro:false,
  token: ''
};

type TPayloadInitial = TPayload<IResLoginOptional>;

export const userSlice = createSlice({
  name: NameReducer.user,
  initialState:userInitialState,
  reducers: {
    setUser: (state: IResLoginOptional, { payload: user }: TPayloadInitial) => {
      console.log('setUser=',user);
      Object.assign(state,user);
    },
    setEmail: (state: IResLoginOptional, { payload:email }: TPayloadString) => {
      console.log('setEmail=', email);
      state.email = email;
    }
  },
});

export const { setUser, setEmail } = userSlice.actions;
