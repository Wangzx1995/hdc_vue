import isNil from '@hui-pro/utils/src/test/is-nil.js';
const isWindow = el => (!isNil(el) ? el === el.window : false);

export default isWindow;
