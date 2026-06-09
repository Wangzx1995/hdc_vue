/**
 * npm run pack&nbsp--&nbsp--38    打包并且上传到38服务器
 * npm run upload&nbsp--&nbsp--38  不打包，直接上传dist文件夹
 * 上传后自动解压 ，上传的文件重命名为当前时间
 * #######################################################
 * 示例
 * npm run pack -- --32  npm run upload -- --32
 * npm run pack -- --242  npm run upload -- --40   
 *  /


/**服务器配置项：请仔细配置
 * @param {
 * command --- 运行打包命令的参数(不可重复)
 * nm ---- 服务器名称
 * sv :{   ----服务器配置文件  地址，端口， 用户名，密码
 *   host: '10.41.46.38',
 *   port: '55555',
 *   username: 'hik',
 *   password: 'aetest12345+'
 * }
 * server_url --- 需要上传到的服务器目录
 * } 
 * 
 * 
 * 
 * 
 * */
module.exports = [
    {
        command: "32",
        nm: "32环境",
        sv: {
            host: "10.42.110.32",
            port: "55555",
            username: "root",
            password: "Oms13579++",
        },
        server_url: "/home/hik/hatc-v2.0-service/HDC/web/",
    },
    {
        command: "242",
        nm: "242环境",
        sv: {
            host: "120.26.50.242 ",
            port: "2098",
            username: "root",
            password: "Oms13579+",
        },
        server_url: "/home/HATC2.0/hdc/web/",
    },
];
