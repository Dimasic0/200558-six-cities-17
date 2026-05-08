import { describe } from 'vitest';
import { setCity } from './action.ts';
import { testAction } from './const/test.ts';

// const testAction = (text, fun,type ,parameters) => {
//   it(text, () => {
//     for (const param of parameters) {
//       const objSetCity = fun(param);
//       expect(objSetCity).toEqual({ type: type, payload: param });
//     }
//   });
// };
// const testActionLink = (text, fun, type, parameters) => {
//   it(text, () => {
//     for (const param of parameters) {
//       const objSetCity = fun(param);
//       expect(objSetCity).toEqual({ type, payload: param });
//     }
//   });
//   it(`${text} link ===`, () => {
//     for (let param of parameters) {
//       const objSetCity = fun(param);
//       expect(objSetCity.payload).toBe(param);
//     }
//   });
// };

describe('action',()=>{
//   it('setCity',()=>{
//     const cities = ['Paris', 'Cologne'];
//     for(const city of cities) {
//       const objSetCity = setCity(city);
//       expect(objSetCity).toEqual({type:'catalog/setCity', payload:city});
//     }
//   });
  testAction('setCity', setCity, 'catalog/setCity', ['Paris', 'Cologne']);
});
