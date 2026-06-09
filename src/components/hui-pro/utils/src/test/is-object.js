import type from '@hui-pro/utils/src/test/type.js';
import isFunction from '@hui-pro/utils/src/test/is-function.js';
import isNil from '@hui-pro/utils/src/test/is-nil.js';

const isObject = val => {
  if (isNil(val)) {
    return false;
  }
  const ctor = val.constructor;
  if (!isFunction(ctor)) {
    return false;
  }
  const prot = ctor.prototype;
  if (type(prot) !== 'Object') {
    return false;
  }
  if (prot.hasOwnProperty('isPrototypeOf') === false) {
    return false;
  }
  return type(val) === 'Object';
};

export default isObject;
