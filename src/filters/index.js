/**
 * 自动加载filters，不再重复get了 edit by lifangqi
 * 全局Filter
 * register global utility filters.
 */
// 导入模块
import * as filters from './filters'
import * as Filters from '@/filters/filters'
import Vue from 'vue'
// const Vue = require('vue')

Object.keys(Filters).forEach(key => {
    Vue.filter(key, Filters[key])
})

Vue.prototype.$filter = filters;
