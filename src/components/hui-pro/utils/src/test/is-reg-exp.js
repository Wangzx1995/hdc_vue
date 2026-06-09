import type from '@hui-pro/utils/src/test/type.js';
const isRegexp = val => type(val) === 'RegExp';

export default isRegexp;
