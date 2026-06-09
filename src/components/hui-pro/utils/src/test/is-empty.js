import isNil from '@hui-pro/utils/src/test/is-nil.js';
import isObject from '@hui-pro/utils/src/test/is-object.js';
import isArray from '@hui-pro/utils/src/test/is-array.js';
import isString from '@hui-pro/utils/src/test/is-string.js';

const isEmpty = val => {
  if (isArray(val) || isString(val)) {
    return val.length === 0;
  } else if (isObject(val)) {
    return Object.keys(val).length === 0;
  } else {
    return isNil(val);
  }
};

export default isEmpty;
