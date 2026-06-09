var merge = require("webpack-merge");
const { BASE_API } = require("./prod.env");
var prodEnv = require("./prod.env");

module.exports = merge(prodEnv, {
    NODE_ENV: '"development"',

    // BASE_API: '"https://10.67.192.37:18448/"', // 蒋辉
    // BASE_API: '"https://10.67.196.119:18448/"', // 全
    // BASE_API: '"https://10.67.196.10:18448/"', // 大叔
    // BASE_API: '"http://10.67.196.104:8448/"', // 欧阳严
    //
    // BASE_API: '"https://10.41.46.82:18448/"', // 82服务器`

    // BASE_API: '"https://10.42.110.32:8444/"', // 32服务器`

    // BASE_API: '"https://10.41.46.40:8444/"', // 40服务器`

    // BASE_API: '"https://120.26.50.242:8444/"', // 242服务器`

    BASE_API:'"https://oms.hikvisionauto.com:8444/"' //线上环境

    // BASE_API:'"https://omspre.hikvisionauto.com:8444/"'  //预发布环境
});
