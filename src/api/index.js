/**
 * 自动加载Api，不再单独写入了 edit by lifangqi
 * require.context
 * 入参：
 * 1. 你要引入文件的目录
 * 2.是否要查找该目录下的子级目录
 * 3.匹配要引入的文件
 * 返回：
 *  · resolve: 是一个函数，他返回的是被解析模块的id；
 *  · keys: 也是一个函数，他返回的是一个数组，该数组是由所有可能被上下文模块解析的请求对象组成
 *  · id：上下文模块的id
 */
import Vue from 'vue'
// const Vue = require('vue')

const apis = require.context('.',true,/\.js$/);
let allApiList = {};
apis.keys().forEach(key => {
    if(key !== './index.js'){
    allApiList = Object.assign(allApiList, apis(key).default);
}
})

Vue.prototype.$api = allApiList;
