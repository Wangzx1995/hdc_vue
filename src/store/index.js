//import Vue from "vue";
import Vue from "vue/dist/vue.esm.js";
// const Vue = require('vue')
import Vuex from "vuex";
import getters from "./getters";
import app from "./modules/app";
import user from "./modules/user";
import permission from "./modules/permission";
import tree from "./modules/tree";
import configView from "./modules/configView";
import exportManage from "./modules/exportManage";
import downloadManage from "./modules/downloadManage";

Vue.use(Vuex);

const store = new Vuex.Store({
    getters,
    modules: {
        app,
        user,
        permission,
        tree,
        configView,
        exportManage,
        downloadManage,
    },
});

export default store;
