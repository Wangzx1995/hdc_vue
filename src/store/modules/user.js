import api from "@/api/api";
import Auth from "@/utils/auth";
import Storage from "@/utils/storage";
import SessionStorage from "@/utils/sessionStorage";
//import Vue from "vue";
import Vue from "vue/dist/vue.esm.js";
// const Vue = require('vue')
import router from "@/router";
let sha256 = require("js-sha256").sha256; //引入sha256库

const user = {
    state: {
        token: Auth.getToken(),
        name: "",
        avatar: "",
        loggedin: false,
        userSubType: Storage.get("userSubType"),
        technicalSupportEngineerSign: "",
        authorityCenter: 0,
    },

    mutations: {
        SET_TOKEN: (state, token) => {
            state.token = token;
        },
        SET_NAME: (state, username) => {
            state.name = username;
            SessionStorage.set("username", username);
        },
        SET_TECHNICALSUPPORTENGINEERSIGN: (
            state,
            technicalSupportEngineerSign
        ) => {
            state.technicalSupportEngineerSign = technicalSupportEngineerSign;
        },
        SET_NICKNAME: (state, nickname) => {
            state.nickname = nickname;
            SessionStorage.set("nickname", nickname);
        },
        SET_AVATAR: (state, avatar) => {
            state.avatar = avatar;
            Storage.set("avatar", avatar);
        },
        SET_LOGGEDIN: (state, loggedin) => {
            state.loggedin = loggedin;
        },
        SET_DATAPERMISSION: (state, dataPermission) => {
            Storage.set("dataPermission", dataPermission);
            state.dataPermission = dataPermission;
        },
        SET_DAK: (state, dAk) => {
            Storage.set("dAk", dAk);
            state.dAk = dAk;
        },
        SET_AUTHORITYCENTER: (state, authorityCenter) => {
            state.authorityCenter = authorityCenter;
        },
        SET_USERSUBTYPE: (state, userSubType) => {
            state.userSubType = userSubType;
        },
    },

    actions: {
        // 登录
        Login({ commit }, userInfo) {
            const username = userInfo.username.trim();
            //临时保存用户名，为了在第一次登录修改密码时，把用户名当做参数传入
            commit("SET_NAME", username);
            return new Promise((resolve, reject) => {
                let hash = sha256(userInfo.password); //hash为加密后的密码

                api.login(username, hash, userInfo.veryCode)
                    .then((response) => {
                        const data = response;
                        if (data.code == "200" && data.success == true) {
                            Auth.login(username, data.data.token);
                            commit("SET_TOKEN", data.data.token);
                        }
                        resolve(response);
                    })
                    .catch((error) => {
                        reject(error);
                    });
            });
        },
        // 登录
        technicalSupportEngineerLogin({ commit }, userInfo) {
            const username = userInfo.username.trim();
            //临时保存用户名，为了在第一次登录修改密码时，把用户名当做参数传入
            commit("SET_NAME", username);
            return new Promise((resolve, reject) => {
                let params = {
                    username: username,
                    userPassword: sha256(userInfo.password),
                    engineerName: userInfo.engineerName,
                    engineerPassword: sha256(userInfo.engineerPassword),
                };
                api.technicalSupportEngineerLogin(params)
                    .then((response) => {
                        const data = response;
                        if (data.code == "200" && data.success == true) {
                            Auth.login(username, data.data.token);
                            commit("SET_TOKEN", data.data.token);
                        }
                        resolve(response);
                    })
                    .catch((error) => {
                        reject(error);
                    });
            });
        },
        LoginWithPhone({ commit }, info) {
            const phone = info.phone.trim();
            const veryCode = info.veryCode.trim();
            const username = info.username;
            //临时保存用户名，为了在第一次登录修改密码时，把用户名当做参数传入
            commit("SET_NAME", username);
            return new Promise((resolve, reject) => {
                api.loginWithPhone(phone, veryCode, username)
                    .then((response) => {
                        const data = response;
                        if (data.code == "200" && data.success == true) {
                            Auth.login(phone, data.data.token);
                            commit("SET_TOKEN", data.data.token);
                        }
                        resolve(response);
                    })
                    .catch((error) => {
                        reject(error);
                    });
            });
        },
        QrLogin({ commit }, uuid) {
            const phone = uuid.trim();
            //临时保存用户名，为了在第一次登录修改密码时，把用户名当做参数传入
            commit("SET_NAME", uuid);
            return new Promise((resolve, reject) => {
                api.QRCodeLogin(uuid)
                    .then((response) => {
                        const data = response;
                        if (data.code == "200" && data.success == true) {
                            Auth.login(uuid, data.data.token);
                            commit("SET_TOKEN", data.data.token);
                        }
                        resolve(response);
                    })
                    .catch((error) => {
                        reject(error);
                    });
            });
        },
        // 登录
        Register({ commit }, userInfo) {
            const username = userInfo.username.trim();
            return new Promise((resolve, reject) => {
                api.register(username, userInfo.password, userInfo.email)
                    .then((response) => {
                        const data = response.data;
                        // iView.Message.info({
                        //     content: "恭喜您注册成功~！请耐心等待管理员审核。",
                        //     duration: 10,
                        //     closable: true,
                        // });
                        resolve();
                    })
                    .catch((error) => {
                        reject(error);
                    });
            });
        },

        //判断是否需要验证码
        CheckNeedVeryCode({ commit }) {
            return new Promise((resolve, reject) => {
                api.checkNeedVeryCode()
                    .then((response) => {
                        const data = response;
                        resolve(response);
                    })
                    .catch((error) => {
                        reject(error);
                    });
            });
        },

        // 获取用户信息
        GetUserInfo({ commit, state }) {
            return new Promise((resolve, reject) => {
                api.getUserInfo(state.token)
                    .then((response) => {
                        const data = response.data;
                        commit("SET_LOGGEDIN", true);
                        commit("SET_NAME", data.name);
                        commit("SET_NICKNAME", data.nickName);
                        commit("SET_AVATAR", data.headImage);
                        commit("SET_DATAPERMISSION", data.dataPermission);
                        commit("SET_DAK", data.dAK);
                        commit("SET_AUTHORITYCENTER", data.authorityCenter);
                        commit(
                            "SET_TECHNICALSUPPORTENGINEERSIGN",
                            data.technicalSupportEngineerSign
                        );

                        resolve(response);
                    })
                    .catch((error) => {
                        reject(error);
                    });
            });
        },

        // 登出
        LogOut({ commit, state }) {
            return new Promise((resolve, reject) => {
                api.logout(state.token)
                    .then(() => {
                        commit("SET_TOKEN", "");
                        commit("SET_LOGGEDIN", false);
                        commit("SET_DATAPERMISSION", "");
                        commit("SET_DAK", "");
                        localStorage.removeItem("searchTimes");
                        Auth.logout();
                        resolve();
                    })
                    .catch((error) => {
                        reject(error);
                    });
            });
        },

        // 前端 登出
        FedLogOut({ commit }) {
            return new Promise((resolve) => {
                commit("SET_TOKEN", "");
                commit("SET_LOGGEDIN", false);
                commit("SET_DATAPERMISSION", "");
                commit("SET_DAK", "");
                Auth.logout();
                resolve();
            });
        },
        //
        initMapSetting({ commit }) {
            return new Promise((resolve) => {
                const script = document.createElement("script");
                script.type = "text/javascript";
                script.src =
                    "https://api.map.baidu.com/getscript?v=3.0&ak=MMav6mPYajHYhdvAh6AKEEuBDcPh0DKn"; // 替换为你的脚本URL
                document.body.appendChild(script);
                resolve();
            });
        },
        //前端 修改密码
        FedModifyPwd({ commit }, userInfo) {
            return new Promise((resolve) => {
                commit("SET_LOGGEDIN", true);
                Auth.modifyPwd();
                const username = userInfo.username.trim();
                router.push({
                    path: "/modifyPwd",
                    query: { username: username },
                });
                resolve();
            });
        },
        //统一登陆获取token
        LoginWithToken({ commit }, upcToken) {
            return new Promise((resolve, reject) => {
                api.LoginWithToken({ token: upcToken })
                    .then((response) => {
                        const data = response;
                        if (data.code == "200" && data.success == true) {
                            Auth.loginToken(data.data.token);
                            commit("SET_TOKEN", data.data.token);
                            Storage.set("platformType", 0);
                        }
                        resolve(response);
                    })
                    .catch((error) => {
                        reject(error);
                    });
            });
        },
        setUserSubType({ commit }, userSubType) {
            commit("SET_USERSUBTYPE", userSubType);
        },
    },
};

export default user;
