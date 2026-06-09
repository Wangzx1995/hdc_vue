//import Vue from "vue";
import Vue from "vue/dist/vue.esm.js";
const requireComponent = require.context("./", true, /\.js$/);
requireComponent.keys().forEach(fileName => {
    if (fileName.split("/").length < 4) {
        // 获取组件配置
        const componentConfig = requireComponent(fileName);
        // 全局注册组件
        if (componentConfig && componentConfig.default) {
            Vue.component(componentConfig.default.name, componentConfig.default);
        }
    }
});
