import isUndefined from '@hui-pro/utils/src/test/is-undefined.js';
import isNull from '@hui-pro/utils/src/test/is-null.js';

const isNil = val => isUndefined(val) || isNull(val);

export default isNil;
