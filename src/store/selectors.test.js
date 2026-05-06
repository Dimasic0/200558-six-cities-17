import { describe, it,expect } from 'vitest';
// import {useUser} from './selectors.ts';

const useUser=()=>true;
describe('useUser', () => {
  it('useUser === true', () => {
    // eslint-disable-next-line no-undef
    const user = useUser();
    expect(user).toBe(true);
  });
});
