import isNull from '@hui-pro/utils/src/test/is-null.js';
import type from '@hui-pro/utils/src/test/type.js';

const isVNode = node => {
  return (
    !isNull(node) &&
    type(node) === 'Object' &&
    hasOwnProperty.call(node, 'componentOptions')
  );
};

export default isVNode;
