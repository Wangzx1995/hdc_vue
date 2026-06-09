//import Vue from "vue";
import Vue from "vue/dist/vue.esm.js";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "./assets/index.scss";

import router from "./router";
import store from "./store";
import "./filters";
import i18n from "./i18n/i18n.js";

import "@/utils/storage";
import echarts from "echarts";
import "normalize.css/normalize.css";
import "!style-loader!css-loader!less-loader!./assets/less/app.less";
import "./components/common/index.js";
import "./directives/index.js";
import "./icons/index.js";
import "babel-polyfill";
import "./moudulesConfig/downLoadWatcher";
import "./api";

import "@/utils/log"; // error log
import "@/utils/permission"; // 权限
import "./theme/iconfont/iconfont.css";
import "./iview";
import sub from "./store/sub";
window.sub = sub;
import "@/components/webControlService/webControlClass";

/* 处理时间库 */
import moment from "moment";
Vue.prototype.$moment = moment;
import "@/utils/message";

Vue.use(ElementUI);
import "./moudulesConfig/element";

import { Switch, IpInput } from "hui";
Vue.component("h-switch", Switch);
Vue.component("h-ip-input", IpInput);
Vue.prototype.$deepCopy = (obj) => {
    return JSON.parse(JSON.stringify(obj));
};
window.deepCopy = Vue.prototype.$deepCopy;
window.checkKeys = (Obj) => {
    let res;
    if (
        Obj !== null &&
        typeof Obj === "object" &&
        Object.keys(Obj).length > 0
    ) {
        res = true;
    } else {
        res = false;
    }
    return res;
};
import Viewer from "v-viewer";
import "viewerjs/dist/viewer.css";
Vue.use(Viewer);
Viewer.setDefaults({
    // 需要配置的属性 注意属性并没有引号
    title: false,
    toolbar: {
        zoomIn: 4,
        zoomOut: 4,
        oneToOne: 4,
        reset: 4,
        prev: 0,
        play: {
            show: 0,
            size: "large",
        },
        next: 0,
        rotateLeft: 4,
        rotateRight: 4,
        flipHorizontal: 4,
        flipVertical: 4,
    },
});

Vue.config.productionTip = false;
Vue.prototype.$echarts = echarts;
import App from "./app";
/**
 * 创建App
 */
new Vue({
    el: "#app",
    i18n,
    router,
    store,
    beforeCreate() {
        Vue.prototype.$bas = this;
    },
    template: "<App/>",
    components: { App },
});
