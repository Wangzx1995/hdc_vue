import hyphenate from '@hui-pro/utils/src/string/hyphenate.js';

const hyphenateStyle = (string, upperCase) => {
  const prefixReg = /^(ms|webkit)-/;
  string = hyphenate(string, upperCase);
  return prefixReg.test(string) ? `-${string}` : string;
};

export default hyphenateStyle;
