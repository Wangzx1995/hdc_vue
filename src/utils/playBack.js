/**
 * 比较对象变化的字段
 */

function compareChange(oldObJ, newObJ) {
    let keyList = [];
    let valueList = [];
    if (
        !(oldObJ instanceof Object) ||
        !(newObJ instanceof Object) ||
        oldObJ === null ||
        newObJ === null
    ) {
        return { keyList, valueList };
    }
    let oldKeys = Object.keys(oldObJ);
    let newKeys = Object.keys(newObJ);
    oldKeys.forEach((key) => {
        if (
            !(
                newKeys.includes(key) &&
                JSON.stringify(oldObJ[key]) === JSON.stringify(newObJ[key])
            )
        ) {
            keyList.push(key);
            valueList.push(newKeys[key]);
        }
    });
    return { keyList, valueList };
}
/**
 * 复制
 */
function copy(text) {
    let oInput = document.createElement("input");
    oInput.value = text;
    document.body.appendChild(oInput);
    oInput.select(); // 选择对象;
    document.execCommand("Copy"); // 执行浏览器复制命令
    oInput.remove();
}
/**
 * 判断是否为空
 * @param {string} value 字符串
 * @return {boolean}
 */
function isEmpty(value) {
    if (typeof value == "string") {
        return value.trim() === "";
    }
    return value === null || value === undefined;
}
/**
 *  数字 保留n位小数并格式化输出（不足的部分补0）
 *  */
function formatFloat(value, n) {
    var f = Math.round(value * Math.pow(10, n)) / Math.pow(10, n);
    var s = f.toString();
    var rs = s.indexOf(".");
    if (rs < 0) {
        s += ".";
    }
    for (var i = s.length - s.indexOf("."); i <= n; i++) {
        s += "0";
    }
    return s;
}
/**
 *  下载文件方法,IE不支持a标签的download属性.目前使用的msSaveBlob仅兼容至IE110+
 *  */
function download(url, filename) {
    const xhr = new window.XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.responseType = "blob";
    xhr.onload = () => {
        let blob = xhr.response;
        let userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
        let isIE = userAgent.indexOf("Trident") > -1; //判断是否IE浏览器
        if (isIE) {
            window.navigator.msSaveBlob(blob, filename);
        } else {
            var $a = document.createElement("a");
            let url = URL.createObjectURL(blob);
            $a.setAttribute("href", url);
            $a.setAttribute("download", filename);
            $a.setAttribute("target", "_self");
            $a.click();
        }
    };
    xhr.onerror = (e) => {
        console.error(e);
    };
    xhr.send();
}
//排队转换
let ifUse = false;
let arraybufferList = [];
function transFormAndDownLoad(arraybuffer, filename, targetType = "5") {
    if (ifUse) {
        arraybufferList.unshift(
            transFormAndDownLoad.bind(null, arraybuffer, filename, targetType)
        );
    }
    ifUse = true;
    let pData = null;
    let pIndexData = null;
    let pIndexDataBuff = null;
    let pDataBuff = null;
    let nDataBuffLen = 0;
    let nIndexBuffLen = 0;
    const ST_DATA_TYPE = {
        MULTI_DATA: 0, // 复合流数据 -->
        VIDEO_DATA: 1, // 视频流数据 -->
        AUDIO_DATA: 2, // 音频流数据 -->
        PRIVATE_DATA: 3, // 私有数据 -->
        VIDEO_PARA: 4, // 视频流打包参数，定义见HK_VIDEO_PACK_PARA -->
        AUDIO_PARA: 5, // 音频流打包参数，定义见HK_AUDIO_PACK_PARA -->
        PRIVATE_PARA: 6, // 私有流打包参数，定义见HK_PRIVATE_PACK_PARA -->
    };
    function downloadFile(oData, filename) {
        let oBlob = oData;
        if (!(oData instanceof Blob || oData instanceof File)) {
            oBlob = new Blob([oData]);
        }
        let userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
        let isIE = userAgent.indexOf("Trident") > -1; //判断是否IE浏览器
        if (isIE) {
            window.navigator.msSaveBlob(oBlob, filename);
        } else {
            var $a = document.createElement("a");
            let url = URL.createObjectURL(oBlob);
            $a.setAttribute("href", url);
            $a.setAttribute("download", filename);
            $a.setAttribute("target", "_self");
            $a.click();
        }
    }
    function STCallBack(fileIndex, indexLen, data, dataLen) {
        //获取帧信息
        let pDataInfo = Module._GetDetialFrameInfo();
        // 获取码流数据
        pData.set(Module.HEAPU8.subarray(data, data + dataLen));
        for (let i = 0; i < dataLen; i++) {
            if (
                nDataBuffLen === 0 &&
                pDataInfo.nDataType === ST_DATA_TYPE.VIDEO_DATA
            ) {
                //根据第一帧判断编码格式且nDataType===1来判断编码格式
                if (
                    !(
                        (pData[10] === 0 && pData[11] === 1) ||
                        (pData[10] === 5 && pData[11] === 0)
                    )
                ) {
                    return false;
                }
            }
            pDataBuff[nDataBuffLen + i] = pData[i];
        }
        nDataBuffLen += dataLen;
    }
    window.STCallBack = STCallBack;
    pData = null;
    pIndexData = null;
    pIndexDataBuff = null;
    pDataBuff = null;
    nDataBuffLen = 0;
    nIndexBuffLen = 0;
    const fileSize = arraybuffer.byteLength;
    let nDataOffset = 0;
    let bytes = new Uint8Array(arraybuffer);
    // 开始创建句柄(海康头)
    // let fileHead1 = Uint8Array.from([73, 77, 75, 72, 1, 1, 0, 0, 2, 0, 0, 1, 1, 32, 1, 16, 128, 62, 0, 0, 128, 62, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    // let fileHead1 = bytes.slice(0, 40);
    // var pFileHeadBuff = Module._malloc(40);
    // window.writeArrayToMemory(fileHead1, pFileHeadBuff);
    nDataOffset += 40;
    // 获取目标封装类型，打包大小
    let nTgtFmt = targetType; // 2ps , 5MP4
    // 创建句柄
    // <option value="2">PS</option>
    // <option value="0">NULL</option>
    // <option value="1">HIK</option>
    // <option value="3">TS</option>
    // <option value="4">RTP</option>
    // <option value="5">MPEG4</option>
    // <option value="6">ASF</option>
    // <option value="7">AVI</option>
    // <option value="8">AVI</option>
    // <option value="10">FLV</option>
    // <option value="13">RTMP</option>
    let pp = Module._CreatHandle(null, nTgtFmt, "4096");
    if (pp != 0) {
        console.log("Creat Failed:" + pp);
    }
    // 注册回调函数，回调函数一定要是STCallBack
    pp = Module._SysTransRegisterDataCallBack();
    if (pp != 0) {
        console.log("Register Failed:" + pp);
    }
    // pp = Module._SysTransModifyMediaField(1, 0);
    // if (pp != 0) {
    //     console.log("Set frame num Failed:" + pp);
    // }
    // 参数：源文件路径，目标文件路径，如果不是文件模式都为NULL
    // 开始转封装
    pp = Module._SysTransStart(null, null);
    if (pp != 0) {
        console.log("Start Failed:" + pp);
    }
    // 开始输入数据
    let pInputDataBuf = Module._malloc(5000);
    pData = new Uint8Array(100000000);
    pDataBuff = new Uint8Array(fileSize + fileSize * 0.2); //4m
    pIndexData = new Uint8Array(1024);
    pIndexDataBuff = new Uint8Array(fileSize); //4m
    while (nDataOffset < bytes.length) {
        let readDataLen = 1500;
        if (nDataOffset + readDataLen >= bytes.length) {
            readDataLen = bytes.length - nDataOffset;
        }
        let pInputData = bytes.slice(nDataOffset, nDataOffset + readDataLen);
        window.writeArrayToMemory(pInputData, pInputDataBuf);
        // 输入数据，每次1024字节，每次最多2m
        pp = Module._SysTransInputData(0, pInputDataBuf, readDataLen);
        if (pp != 0) {
            console.log("InputData Failed:" + pp);
        }
        nDataOffset += readDataLen;
    }
    pp = Module._SysTransStop();
    if (pp != 0) {
        console.log("Stop Failed:" + pp);
    }
    pp = Module._SysTransRelease();
    if (pp != 0) {
        console.log("Stop Failed:" + pp);
    }
    // 切除多余数据
    pDataBuff = pDataBuff.slice(0, nDataBuffLen);
    pIndexDataBuff = pIndexDataBuff.slice(0, nIndexBuffLen);
    // 下载转封装完成的文件
    if (targetType === "2") {
        filename = filename.replace("mp4", "ps");
    }
    downloadFile(pDataBuff, filename);
    Module._free(pInputDataBuf);
    ifUse = false;
    if (arraybufferList.length) {
        arraybufferList[arraybufferList.length - 1]();
        arraybufferList.pop();
    }
}
function xhrPullFile(url, cb) {
    return new Promise((resolve) => {
        if (url) {
            url = url.replace("47.114.190.241", "download.hikvisionauto.com");
        }
        let xhrMsg = {
            status: null,
            msg: "",
        };
        const xhr = new window.XMLHttpRequest();
        xhr.responseType = "arraybuffer";
        xhr.onload = () => {
            xhrMsg = {
                status: "success",
                msg: xhr.response,
            };
            cb(xhrMsg);
            resolve();
        };
        xhr.onerror = (e) => {
            xhrMsg = {
                status: "error",
                msg: e,
            };
            cb(xhrMsg);
            resolve();
        };
        xhr.addEventListener("progress", (e) => {
            let progress = parseInt((e.loaded / e.total) * 100);
            xhrMsg = {
                status: "progress",
                msg: progress,
            };
            cb(xhrMsg);
        });
        xhr.open("GET", url, true);
        xhr.send();
        xhrMsg = {
            status: "begin",
            msg: xhr,
        };
        cb(xhrMsg);
    });
}
/**
 * 表格固定表头，获取表格高度
 */
function getTableHeight(...refNames) {
    let height = document.body.clientHeight;
    let headerHeight = document.getElementById("header-bar-box")
        ? document.getElementById("header-bar-box").clientHeight
        : 80;
    let tableHeight = height - headerHeight;
    if (refNames.length > 1 && refNames[0] === true) {
        let className = "." + refNames[1] + " .el-tabs__header";
        let ele = document.querySelector(className);
        let h = 0;
        h = ele.offsetHeight;
        h = Math.ceil(h);
        tableHeight = tableHeight - h;
        refNames.splice(0, 2);
    }

    for (var refName of refNames) {
        let h = 0;
        if (this.$refs[refName]) {
            h =
                this.$refs[refName].offsetHeight ||
                this.$refs[refName].$el.offsetHeight;
        }
        tableHeight = tableHeight - h;
    }
    return tableHeight;
}
function formatDownLoadName(str, url, isMp4) {
    if (isMp4) return str + ".mp4";
    let index = url.lastIndexOf(".");
    if (index === -1) {
        return str + ".mp4";
    } else {
        let urlName = url.substring(index);
        let index0 = urlName.indexOf("?");
        if (index0 > -1) {
            urlName = urlName.substring(0, index0);
        }
        return str + urlName;
    }
}
export {
    isEmpty,
    formatFloat,
    download,
    getTableHeight,
    copy,
    compareChange,
    xhrPullFile,
    transFormAndDownLoad,
    formatDownLoadName,
};
