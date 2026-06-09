import getDocument from '@hui-pro/utils/src/dom/get-document.js';
import isDocument from '@hui-pro/utils/src/test/is-document.js';

const getWindow = el => {
  return el && isDocument(el)
    ? el.defaultView || el.parentWindow
    : getWindow(getDocument(el));
};

export default getWindow;
