//import Vue from "vue";
import Vue from "vue/dist/vue.esm.js";
import { Message } from "element-ui";
setTimeout(() => {
    Vue.prototype.$message = function (msg) {
        let msgType = msg.type || "";
        switch (msgType) {
            case "success":
                return Message.success({
                    message: msg.message ? msg.message : msg,
                    duration: 500,
                });
                break;
            case "warning":
                return Message.warning({
                    message: msg.message ? msg.message : msg,
                    duration: 1000,
                });
                break;
            case "error":
                return Message.error({
                    message: msg.message ? msg.message : msg,
                    duration: 2000,
                });
                break;
            default:
                return Message.info({
                    message: msg.message ? msg.message : msg,
                    duration: 1000,
                });
        }
    };
    Vue.prototype.$message.success = function (msg, duration = 500) {
        return Message.success({
            message: msg,
            duration: duration,
        });
    };
    Vue.prototype.$message.warning = function (msg, duration = 1000) {
        return Message.warning({
            message: msg,
            duration: duration,
        });
    };
    Vue.prototype.$message.error = function (msg, duration = 2000) {
        return Message.error({
            message: msg,
            duration: duration,
        });
    };
    Vue.prototype.$message.info = function (msg, duration = 1000) {
        return Message.info({
            message: msg,
            duration: duration,
        });
    };
}, 0);
