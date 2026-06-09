import includesWith from '@hui-pro/utils/src/array/includes-with.js';
import isUndefined from '@hui-pro/utils/src/test/is-undefined.js';

const uniqWith = (arr, fn) => {
  const uniqLike = Array.from(new Set(arr));
  let result = [];
  if (!isUndefined(fn)) {
    uniqLike.forEach(item => {
      if (!includesWith(result, item, fn)) {
        result.push(item);
      }
    });
  } else {
    result = uniqLike;
  }
  return result;
};

export default uniqWith;
