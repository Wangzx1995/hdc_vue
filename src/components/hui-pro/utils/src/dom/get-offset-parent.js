import getDocument from '@hui-pro/utils/src/dom/get-document.js';
import getNodeName from '@hui-pro/utils/src/dom/get-node-name.js';
import style from '@hui-pro/utils/src/dom/style.js';

const getOffsetParent = el => {
  const doc = getDocument(el);
  let offsetParent = el && el.offsetParent;
  while (
    offsetParent &&
    getNodeName(el) !== 'html' &&
    style(offsetParent, 'position') === 'static'
  ) {
    offsetParent = offsetParent.offsetParent;
  }

  return offsetParent || doc.documentElement;
};

export default getOffsetParent;
