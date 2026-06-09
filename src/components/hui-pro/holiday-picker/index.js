import HolidayPicker from './src/holiday-picker.vue';
import Ellipsis from '@hui-pro/ellipsis/index.js';

const install = function(Vue) {
  Vue.use(Ellipsis);
  Vue.component(HolidayPicker.name, HolidayPicker);
};

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default {
  install
};
