import once from '@hui-pro/utils/src/event/once.js';
import scrollTop from '@hui-pro/utils/src/dom/scroll-top.js';
import height from '@hui-pro/utils/src/dom/height.js';
import getDocument from '@hui-pro/utils/src/dom/get-document.js';
import isWindow from '@hui-pro/utils/src/test/is-window.js';
import isDocument from '@hui-pro/utils/src/test/is-document.js';

const scrollLoad = (el, fn) => {
  const opts = {
    isTop: true,
    isBottom: false
  };
  const isWin = isWindow(el);
  const isDoc = isDocument(el);
  if (isWin || isDoc) {
    el = getDocument(el).body;
  }
  once(el, 'scroll', e => {
    const scrollHeight = height(el, 'scroll');
    const elHeight = height(el);
    const st = scrollTop(el);
    opts.isTop = st === 0;
    opts.isBottom = st + elHeight >= scrollHeight;
    if (opts.isTop || opts.isBottom) {
      fn(opts, e);
    }
  });
};

export default scrollLoad;
