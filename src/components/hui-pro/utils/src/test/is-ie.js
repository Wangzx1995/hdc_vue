import getBrowserInfo from '@hui-pro/utils/src/function/get-browser-info.js';
import isUndefined from '@hui-pro/utils/src/test/is-undefined.js';

const isIe = v => {
  const browserInfo = getBrowserInfo();
  const isIeVal = browserInfo.name === 'Internet Explorer';
  if (isUndefined(v)) {
    return isIeVal;
  } else {
    return isIeVal && browserInfo.version === v;
  }
};

export default isIe;
