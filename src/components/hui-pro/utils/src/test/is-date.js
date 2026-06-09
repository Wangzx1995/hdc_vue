import type from '@hui-pro/utils/src/test/type.js';
const isDate = val => type(val) === 'Date';

export default isDate;
