import hasClass from '@hui-pro/utils/src/test/has-class.js';
import addClass from '@hui-pro/utils/src/dom/add-class.js';
import removeClass from '@hui-pro/utils/src/dom/remove-class.js';

const toggleClass = (el, cls) => {
  if (hasClass(el, cls)) {
    removeClass(el, cls);
  } else {
    addClass(el, cls);
  }
};

export default toggleClass;
