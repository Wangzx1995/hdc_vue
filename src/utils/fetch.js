//import Vue from "vue";
import Vue from "vue/dist/vue.esm.js";
// const Vue = require('vue')
import axios from "axios";
import Qs from "qs";
import store from "../store";
import Auth from "@/utils/auth";

const isProduction = process.env.NODE_ENV === "production";
if (isProduction) {
    console.log(
        "%c 如果你看到这条 log , 说明当前是生产环境 ",
        "font-size:14px;color:#f00;background:#000"
    );
} else {
    console.log(
        "%c 如果你看到这条 log , 说明当前是开发环境 ",
        "font-size:14px;color:#f00;background:#000"
    );
}

// 创建axios实例
const service = axios.create({
    baseURL: process.env.BASE_API, // api的base_url
    timeout: 30000, // 请求超时时间
});

// request拦截器
service.interceptors.request.use(
    (config) => {
        if (store.getters.token) {
            config.headers["X-Token"] = Auth.getToken(); // 让每个请求携带自定义token 请根据实际情况自行修改
        }
        if (config.url.indexOf("fileUpload") > 0) {
            config.headers["Content-Type"] = "multipart/form-data";
        }

        if (config.headers["Content-Type"] != "application/json") {
            config.transformRequest = [
                function (data) {
                    data = Qs.stringify(data, { indices: false });
                    return data;
                },
            ];
        }
        if (
            config.url.indexOf("/upgrade/getFirmwareVersion") > -1 ||
            config.url.indexOf("new/firmware/getFirmwareInfo") > -1
        ) {
            config.transformRequest = [(data) => data];
            config.headers["Content-Type"] = "multipart/form-data";
        }

        return config;
    },
    (error) => {
        // Do something with request error
        console.log(error); // for debug
        Promise.reject(error);
    }
);

// respone拦截器
service.interceptors.response.use(
    (response) => {
        /**
         * code为非200是抛错 可结合自己业务进行修改
         */
        const res = response.data;
        if (res.success !== true) {
            if (res.code <= 999999 && res.code >= 900000) {
                Vue.prototype.$message.error({
                    content: res.msg,
                    duration: 5,
                });
            }

            // 50014:Token 过期了;
            if (res.code == "cms.user.userNotLogin") {
                localStorage.removeItem("searchTimes");
                store.dispatch("FedLogOut").then(() => {
                    location.reload(); // 为了重新实例化vue-router对象 避免bug
                });
                return Promise.reject("error");
            }
            if (res.code == "system.firstLogin.modifyPwd") {
                store.dispatch("FedModifyPwd", Auth.get()).then(() => {
                    Vue.prototype.$message.error(
                        "由于您是第一次登录，请修改密码以保证安全"
                    );
                    //location.reload();// 为了重新实例化vue-router对象 避免bug
                });
                return Promise.reject("error");
            }

            if (res.code == "system.password.overtime") {
                store.dispatch("FedModifyPwd", Auth.get()).then(() => {
                    Vue.prototype.$message.error(
                        "您的密码已经过期，请修改密码以保证安全"
                    );
                    //location.reload();// 为了重新实例化vue-router对象 避免bug
                });

                return Promise.reject("error");
            }
            return response.data;
        } else {
            return response.data;
        }
    },
    (error) => {
        Vue.prototype.$message.error(
            error.message == "timeout of 30000ms exceeded"
                ? "网络不佳或者系统繁忙，请稍后再试"
                : error.message
        );
        return Promise.reject(error);
    }
);

export default service;
