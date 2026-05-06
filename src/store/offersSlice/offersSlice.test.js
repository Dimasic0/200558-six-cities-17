import { describe, it, expect } from 'vitest';
import {offersSlice} from './offersSlice.tsx';

const typeOffersSlice = typeof offersSlice;
describe('offersSlice',() => {
  it('offersSlice reducer',() => {
    expect(typeOffersSlice).toBe('object');

  });

});
