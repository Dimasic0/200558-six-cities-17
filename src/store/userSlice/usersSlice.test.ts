import { describe } from 'vitest';
import { testReducerByChange } from '../const/test.js';
import { setEmail, setUser, userInitialState, userSlice } from './userSlice.js';

const testUserReducerByChange: TTestUserRedux = (text,...lastProps) => {
  testReducerByChange(
    'userSlice ' + text,
    userInitialState,
    userSlice.reducer,
    ...lastProps,
  );
};
describe('',() => {
  testUserReducerByChange('setEmail',setEmail('der'), { email: 'der' });
  testUserReducerByChange('setUser', setUser({ email: 'der', token :'fw'}), { email: 'der', token :'fw'});
});
