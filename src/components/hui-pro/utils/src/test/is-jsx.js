import isNull from '@hui-pro/utils/src/test/is-null.js';
import isObject from '@hui-pro/utils/src/test/is-object.js';

const isVNode = node => {
  return !isNull(node) && isObject(node) && hasOwnProperty.call(node, 'render');
};

export default isVNode;
