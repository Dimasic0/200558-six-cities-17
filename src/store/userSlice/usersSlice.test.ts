import { describe } from 'vitest';
import { testReducerByChange } from '../const/test.js';
import { setEmail, setUser, userInitialState, userSlice } from './userSlice.js';
import { TObject } from '../../types/types.js';

type TTestUserRedux=(text:string,action:TAction,expect:TObject) => void;
const testUserReducerByChange: TTestUserRedux = (text,action, expect) => {
  testReducerByChange('userSlice ' + text, userInitialState, action, userSlice.reducer, expect);
};
describe('',()=>{
  testUserReducerByChange('setEmail',setEmail('der'), { email: 'der' });
  testUserReducerByChange('setUser', setUser({ email: 'der', token :'fw'}), { email: 'der', token :'fw'});
});
