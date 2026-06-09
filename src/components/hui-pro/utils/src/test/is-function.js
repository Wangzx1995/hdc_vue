import type from '@hui-pro/utils/src/test/type.js';
const isFunction = val => type(val) === 'Function';

export default isFunction;
