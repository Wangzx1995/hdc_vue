import Vue from 'vue'
// const Vue = require('vue')
import errLog from '@/store/log'

// 生产环境错误日志
if (process.env.NODE_ENV === 'production') {
  Vue.config.errorHandler = function(err, vm) {
    console.log(err, window.location.href)
    errLog.pushLog({
      err,
      url: window.location.href,
      vm
    })
  }
}
