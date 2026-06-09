import TreeSelect from './src/tree-select.vue';

const install = function(Vue) {
  Vue.component(TreeSelect.name, TreeSelect);
};

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default {
  install
};
