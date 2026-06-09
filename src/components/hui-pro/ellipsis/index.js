import Ellipsis from './src/ellipsis.vue';
import EllipsisDirective from './src/directive.js';

const install = function(Vue) {
  Vue.component(Ellipsis.name, Ellipsis);
  Vue.use(EllipsisDirective);
};

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default {
  install
};
