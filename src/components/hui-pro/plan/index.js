import Plan from './src/plan.vue';
import PlanGroup from './src/plan-group.vue';
import locale from '@hui-pro/locale';
import zhCN from '@hui-pro/plan/lang/zh_CN.js';

const install = function(Vue) {
  locale.use(zhCN);
  Vue.component(Plan.name, Plan);
  Vue.component(PlanGroup.name, PlanGroup);
};

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default {
  install
};
