//import Vue from "vue";
import Vue from "vue/dist/vue.esm.js";
// const Vue = require('vue')

import Storage from "@/utils/storage";

const app = {
    state: {
        app: {
            name: "HATC-OMS运维服务平台",
            title: "",
            description: "",
            logo: "./static/images/logo.svg",
            copyright: "Copyright © " + new Date().getFullYear() + " 版权所有",
            version: "",
        },
        color: {
            primary: "#4886FF",
            accent: "#dddee1",
            info: "#4886FF",
            warn: "#fcc100",
            warning: "#FDB44D",
            success: "#72B94F",
            error: "#FB5678",
            white: "#ffffff",
            light: "#f1f2f3",
            dark: "#253449",
            black: "#2a2b3c",
        },
        chartColors: ["#4886FF", "#FB5678", "#FDB44D", "#72B94F", "#2EBEF1"],
        setting: {
            theme: {
                primary: "primary",
                accent: "accent",
                warn: "warn",
            },
            color: {
                primary: "#4886FF",
                accent: "#dddee1",
                warn: "#fcc100",
            },
            folded: false,
            minOpen: false,
            boxed: false,
            container: false,
            themeID: 1,
            bg: "",
        },
        router: {
            currentPageName: "index",
            currentPage: "index",
        },
        visitedViews: [],
        searchState: {
            show: false,
            params: "",
        },
        sdFormatSchedule: "",
        wordObj: JSON.parse(localStorage.getItem("wordObj")) || {},
    },
    mutations: {
        /**
         * 切换语言
         */
        // [types.PATCH_LANGUAGE]: (state, payload) => {
        //   i18n.switchTo(payload.type)
        //   state.language = payload
        //   Storage.set('langType', payload.type)
        //   Storage.set('langName', payload.name)
        // },
        /**
         * 设置语言
         */
        // SET_LANG: (state, payload) => {
        //   i18n.switchTo(payload.language)
        //   state.language = payload.language
        //   Storage.set('language', payload.language)
        // },
        /**
         * 菜单的缩展
         */
        TOGGLE_SIDEBAR: (state) => {
            let winWidth = document.documentElement.clientWidth;
            if (winWidth <= 600) {
                state.setting.minOpen = !state.setting.minOpen;
                state.setting.folded = false;
                Storage.set("sidebarFolded", 0);
                return;
            } else {
                if (state.setting.folded) {
                    Storage.set("sidebarFolded", 1);
                } else {
                    Storage.set("sidebarFolded", 0);
                }
                state.setting.folded = !state.setting.folded;
            }
        },
        CLOSE_SIDEBAR: (state) => {
            Storage.set("sidebarFolded", 0);
            state.setting.folded = false;
            state.setting.minOpen = false;
        },
        OPEN_SIDEBAR: (state) => {
            Storage.set("sidebarFolded", 1);
            state.setting.folded = true;
        },
        /**
         * 切换菜单
         */
        ADD_VISITED_VIEWS: (state, view) => {
            if (state.visitedViews.some((v) => v.path === view.path)) return;
            state.visitedViews.push({ name: view.name, path: view.path });
        },
        DEL_VISITED_VIEWS: (state, view) => {
            let index;
            for (const [i, v] of state.visitedViews.entries()) {
                if (v.path === view.path) {
                    index = i;
                    break;
                }
            }
            state.visitedViews.splice(index, 1);
        },
        /**
         * 面包屑
         */
        GET_CURRENT_PAGE_NAME: (state, payload) => {
            state.router.currentPageName = payload;
        },
        /**
         * 搜索过滤
         */
        SEARCH_FILTER: (state, payload) => {
            if (!payload.params.meta.search) {
                // 路由元信息设置是否有搜索模块
                return;
            } else {
                Object.assign(
                    state.searchState,
                    { show: !state.searchState.show },
                    payload
                );
            }
        },
        CHANGE_CHILD_MENU: (state, payload) => {
            state.router.currentPage = payload;
        },
        //loding加载
        getTaskRemind(state, payload) {
            state.sdFormatSchedule = payload;
        },
        /**
         * 配置页面需要替换的名词
         */
        SET_WORDOBJ: (state, payload) => {
            state.wordObj = payload;
        },
    },
    actions: {
        /**
         * 切换语言
         */
        // patchLanguage: ({commit}, data) => {
        //   commit(types.PATCH_LANGUAGE, {
        //     name: data.name,
        //     type: data.type
        //   })
        // },
        /**
         * 设置语言
         */
        // setLang: ({commit}, payload) => {
        //   commit('SET_LANG', payload)
        // },
        /**
         * 菜单的缩展
         */
        ToggleSideBar: ({ commit }) => {
            commit("TOGGLE_SIDEBAR");
        },
        OpenSideBar: ({ commit }) => {
            commit("OPEN_SIDEBAR");
        },
        CloseSideBar: ({ commit }) => {
            commit("CLOSE_SIDEBAR");
        },
        /**
         * 历史浏览记录
         */
        addVisitedViews: ({ commit }, view) => {
            commit("ADD_VISITED_VIEWS", view);
        },
        delVisitedViews: ({ commit }, view) => {
            commit("DEL_VISITED_VIEWS", view);
        },
        /**
         * 面包屑
         */
        getCurrentPageName: ({ commit }, payload) => {
            commit("GET_CURRENT_PAGE_NAME", payload);
        },
        /**
         * 搜索过滤
         */
        searchFilter: ({ commit }, payload) => {
            commit("SEARCH_FILTER", payload);
        },
        changChildMenu: ({ commit }, payload) => {
            commit("CHANGE_CHILD_MENU", payload);
        },
    },
};

export default app;
