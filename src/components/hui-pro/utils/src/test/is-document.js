import isNil from '@hui-pro/utils/src/test/is-nil.js';
const isDocument = el => (!isNil(el) ? el.nodeType === 9 : false);

export default isDocument;
