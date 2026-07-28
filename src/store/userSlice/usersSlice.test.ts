import { describe } from 'vitest';
import {
  // testReducerByChange,
  // testReduxUndefined,
  testDescribe,
} from '../../library/test/test.js';
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
    testReducerByChange(userInitialState, 'setEmail', setEmail('der'), { email: 'der' });
    testReducerByChange(userInitialState,'setUser', setUser({ email: 'der', token: 'fw' }), {
      email: 'der',
      token: 'fw',
    });
  },
);
