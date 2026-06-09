import isNil from '@hui-pro/utils/src/test/is-nil.js';

const hasOwn = (obj, key) => {
  return !isNil(obj) && Object.prototype.hasOwnProperty.call(obj, key);
};

export default hasOwn;
