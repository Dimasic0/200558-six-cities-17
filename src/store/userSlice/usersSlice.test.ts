import { describe } from 'vitest';
import {
  // testReducerByChange,
  // testReduxUndefined,
  testDescribe,
} from '../const/test.js';
import { setEmail, setUser, userInitialState, userSlice } from './userSlice.js';
import { IResLoginOptional } from '../../types/types.js';

const reducer = userSlice.reducer;
// const testUserReducerByChange: TTestUserRedux = (text,...lastProps) => {
//   testReducerByChange(
//     text,
//     userInitialState,
//     reducer,
//     ...lastProps,
//   );
// };
// describe('userSlice', () => {
//   testReduxUndefined('', reducer, userInitialState);
//   testUserReducerByChange('setEmail', setEmail('der'), { email: 'der' });
//   testUserReducerByChange('setUser', setUser({ email: 'der', token: 'fw' }), {
//     email: 'der',
//     token: 'fw',
//   });
// });

testDescribe<IResLoginOptional>(
  'userSlice',
  reducer,
  userInitialState,
  (_, testReducerByChange) => {
    testReducerByChange('setEmail',userInitialState, setEmail('der'), { email: 'der' });
    testReducerByChange('setUser',userInitialState, setUser({ email: 'der', token: 'fw' }), {
      email: 'der',
      token: 'fw',
    });
  },
);
