import {memo,FC} from 'react';
import { obj } from '../types/types';
import { offers } from '../mocks/offers';

export enum Address {
  main= '/',
  login='/login',
  favorites= '/favorites',
  offer= '/offer/:id'
}

export enum PrivateStatus {
  Auth = 'AUTH',
  Guest = 'GUEST',
  Unknown = 'UNKNOWN'
}

const СITIES = ['Paris', 'Cologne', 'Brussels', 'Amsterdam', 'Hamburg', 'Dusseldorf'] as const;

export { СITIES };

export const URL_MARKER_DEFAULT =
  'https://assets.htmlacademy.ru/content/intensive/javascript-1/demo/interactive-map/pin.svg';

export const URL_MARKER_CURRENT =
  'https://assets.htmlacademy.ru/content/intensive/javascript-1/demo/interactive-map/main-pin.svg';

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const {stringify} = JSON;
// function getEqualityObject(obj1:obj,obj2:obj) {
//   let obj1Length = 0;
//   for(const prop in obj1) {
//     const value1 = obj1[prop];
//     if (!obj2.hasOwnProperty(prop)) return false;
//     const value2 = obj2[prop];
//     const typeValue1 = typeof value1;
//     const typeValue2 = typeof value2;
//     if (typeValue1 === 'object' && typeValue1 === 'object') {
//       if(getEqualityObject(value1, value2)===false) {
//         return false;
//       }
//     }
//     else if (typeValue1 === 'function' && typeValue2 === 'function') {
//       if (value1.name !== value2.name) return false;
//     }
//     else if(value1 !== value2) {
//       return false;
//     }
//     obj1Length++;
//   }
//   let obj2Length = 0;
//   for(const prop in obj2) {
//     obj2Length++;
//   }
//   return obj1Length === obj2Length;

//    //return stringify(obj1) === stringify(obj2);
// }


type tGetEqualityObject = (obj1: obj, obj2: obj) => boolean;

type primitive = number | string | boolean;

type TisEquality = (value1:primitive, value2:primitive) => true | undefined;
const isEquality:TisEquality = (value1,value2) => value1 !== value2;

const setTrue = () => true;

const examination = {
  objectobject: (value1:obj, value2:obj, getEqualityObject) => getEqualityObject(value1, value2) === false,
  functionfunction: (value1, value2) => value1.name !== value2.name,
  objectfunction: setTrue,
  functionobject: setTrue,
  numberobject: setTrue,
  objectnumber: setTrue,
  objectstring: setTrue,
  stringobject: setTrue,
  objectboolean: setTrue,
  booleanobject: setTrue,
  numbernumber:isEquality,
  booleanboolean: isEquality,
  stringstring: isEquality

};

function getEqualityObject(obj1: obj, obj2: obj) {
  let obj1Length = 0;
  for (const prop in obj1) {
    const value1 = obj1[prop] as const;
    const value2 = obj2[prop] as const;
    //console.log('value1=',value1);
    if (value2 === undefined && obj2.hasOwnProperty(prop) === false) {
      return false;
    }

    if (examination[typeof value1 + typeof value2](value1, value2, getEqualityObject)) {
      return false;
    }
    obj1Length++;
  }
  let obj2Length = 0;
  for (const prop in obj2) {
    obj2Length++;
  }
  return obj1Length === obj2Length;
}
const offer = offers[0];
const copyOffers = structuredClone(offer);
copyOffers.location.longitude = 56;

console.time();
for(let i = 0; i <= 1; i++) {
  console.log('getEqualityObject=', getEqualityObject(offer, copyOffers));
}
console.timeEnd();

const funStringify = (key,value) => {
  if(typeof value === 'string') {
    if(value[0] === ']') {
      const valueLength = value.length;
      for(let i = 1; i < valueLength; i++) {
        if(value[i] !== ']') {
          return value;
        }
      }
      value += ']';
      return value;

    }
  } else if(value === undefined) {
    return ']';
  }
  return value;
};
function stringify2(obj1: obj, obj2: obj) {
  return stringify(obj1,funStringify) === stringify(obj2,funStringify);
}
//console.log('offer=,',offers[0]);
console.log('funStringify=', stringify({number: 23, name: undefined, age: ']', tipoc: {age: [23,']'], st: ']weffwff[u][[u][un]undefinedTip', num: '23'}, ti:'egerg'}, funStringify));

console.time();
for(let i = 0; i <= 1; i++) {
  console.log('stringify2=', stringify2(offer, copyOffers));
}
console.timeEnd();

const memoize = <t extends Record<string, any>>(com: FC<t>) => memo<t>(com, (prop1, prop2) => stringify(prop1) === stringify(prop2));
export {memoize};
