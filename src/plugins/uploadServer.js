const fs = require("fs");
const path = require("path");
const pipe = require("multipipe");
const compressing = require("compressing");
const Client = require("ssh2").Client;
const serverList = require("../../uploadServer.config.js");
/* 获取时间，用于重命名打包后的文件 */
let time = countTime();
let server;
let fileList = [];

/* 获取命令行参数 */
let argv = process.argv[2].match(/^(-{2})\S+/)[0].substring(2);
if (serverList.length > 0) {
    let resList = serverList.filter(({ command }) => {
        return command === argv;
    });
    if (resList.length === 1) {
        server = resList[0];
        compress();
    }
}

function getFilesInDirectory(directory, callback) {
    fs.readdir(directory, (err, files) => {
        if (err) throw err;

        files.forEach((file) => {
            let fullPath = path.join(directory, file);
            fs.stat(fullPath, (err, stats) => {
                if (err) throw err;
                callback(fullPath);
            });
        });
    });
}
function compress() {
    const zipStream = new compressing.zip.Stream();
    getFilesInDirectory("./hdc_vue", (filePath) => {
        zipStream.addEntry(filePath);
    });
    const destStream = fs.createWriteStream("hdc_vue.zip");
    pipe(zipStream, destStream, (err) => {
        conn();
    });
}
function countTime() {
    return timeToString(new Date().getTime()).replace(/-|\s|:/g, "");
}
function conn() {
    let connect = new Client();
    let name = server.nm;
    connect
        .on("ready", (err, erer) => {
            upload(connect);
        })
        .on("error", (err) => {
            console.error(err);
            console.log("========连接" + name + "出错========");
        })
        .on("end", () => {
            console.log("========连接" + name + "关闭========");
        })
        .on("close", (err) => {
            if (err) {
                console.log("========连接" + name + "出错========");
            }
        })
        .connect(server.sv);
}
function upload(connect) {
    connect.sftp((err, sftp) => {
        if (err) throw err;
        sftp.fastPut(
            "hdc_vue.zip",
            `${server.server_url}hdc_vue${time}.zip`,
            (err, res) => {
                console.log(
                    `===================${server.server_url}hdc_vue${time}.zip`
                );
                if (err) {
                    console.log(err);
                    console.error("上传失败");
                    connect.end();
                    return;
                }
                fs.unlink("hdc_vue.zip", (err) => {
                    if (err) throw err;
                    console.log("--------------------------------------------文件已删除");
                });
                unzipShell(connect, sftp);
            }
        );
    });
}
function unzipShell(connect, sftp) {
    connect.shell((err, stream) => {
        stream
            .end(
                `
             cd ${server.server_url}
             unzip -o hdc_vue${time}.zip
             exit
            `
            )
            .on("data", (data) => {
                console.log(data.toString());
            })
            .on("close", () => {
                // setTimeout(() => {
                // 删除远程文件
                sftp.unlink(`${server.server_url}hdc_vue${time}.zip`, (err) => {
                    if (err) throw err;
                    console.log(
                        `------------------------------File ${server.server_url}hdc_vue${time}.zip has been deleted`
                    );
                    connect.end();
                });
                // }, 5555);
                // connect.end();
            });
    });
}
function timeToString(timestamp) {
    let time = new Date(timestamp); //先将时间戳转为Date对象，然后才能使用Date的方法
    let year = time.getFullYear(),
        month = time.getMonth() + 1, //月份是从0开始的
        day = time.getDate(),
        hour = time.getHours(),
        minute = time.getMinutes(),
        second = time.getSeconds();
    return (
        year +
        "-" +
        add0(month) +
        "-" +
        add0(day) +
        " " +
        add0(hour) +
        ":" +
        add0(minute) +
        ":" +
        add0(second)
    );
}
function add0(m) {
    return m < 10 ? "0" + m : m;
}
