import store from "../store";
import { saveAs } from "file-saver";
import * as JSZip from "jszip";
import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import vue from "vue";
const exportManage = store.state.exportManage;

function indexToColor(index) {
    let color = "";
    switch (index) {
        case 1:
            color = "蓝色";
            break;
        case 2:
            color = "黄色";
            break;
        case 3:
            color = "黑色";
            break;
        case 4:
            color = "白色";
            break;
        case 5:
            color = "绿色";
            break;
        case 6:
            color = "白绿色";
            break;
        case 7:
            color = "农黄色";
            break;
        case 8:
            color = "农绿色";
            break;
        case 9:
            color = "其他";
            break;
        case 10:
            color = "黄绿色";
            break;
        case 11:
            color = "渐变绿色";
            break;
        case 12:
            color = "无";
            break;
    }
    return color;
}

/**
 * @method 导出excel,pdf（后端整合数据）
 * @param apiName:后端提供的接口名称
 * @param params:查询条件，列表的查询条件
 * @param reportName:右边提示框的报表名称
 * @param exportName:vuex里配置的对象
 * @param needProgress:是否需要进度条（目前只有报警导出需要，其他后端不支持）
 * @param removeTime:文件下载后iframe的移除时间
 */
function exportHander(apiName, params, reportName, exportName, needProgress, removeTime) {
    const reg = /(\.csv)|(\.xls)|(\.pdf)$/;
    let notifyMy;
    let progress = 0;
    let prototypeHander = exportHander.prototype;
    //区分id
    if (Object.keys(prototypeHander).length === 0) {
        prototypeHander.idCount = 0;
    }
    prototypeHander.idCount++;
    if (needProgress) {
        notifyMy = this.$notify({
            customClass: "export-style",
            dangerouslyUseHTMLString: true,
            message: `<div class='exportAdditionalstyle'><div id='temp${
                prototypeHander.idCount
            }'>${progress}%</div><div>${reportName}数据准备中，该过程可能持续几分钟，请勿刷新页面，耐心等待...</div></div>`,
            duration: 0,
            offset: 55
        });
    } else {
        notifyMy = this.$notify({
            customClass: "export-style",
            iconClass: "el-icon-loading",
            message: `${reportName}数据准备中，该过程可能持续几分钟，请勿刷新页面，耐心等待...`,
            duration: 0,
            offset: 55
        });
    }
    this.$store.commit("beginLoading", exportName);
    this.$api[apiName](params)
        .then(res => {
            if (res.success == true) {
                let fileName = res.data.fileName;
                let run = () => {
                    if (needProgress) {
                        this.$api
                            .getProgress(fileName)
                            .then(res1 => {
                                if (res1.success == true && reg.test(res1.data.status)) {
                                    notifyMy.close();
                                    this.$notify({
                                        customClass: "export-style",
                                        type: "success",
                                        title: `${reportName}准备完成，已为您自动下载`,
                                        offset: 55,
                                        duration: 2000
                                    });
                                    this.$store.commit("closeExport", exportName);
                                    this.$store.commit("closeLoading", exportName);
                                    let iframe = document.createElement("iframe");
                                    iframe.src =
                                        (process.env.VUE_APP_BASE_API == "/" ? "" : process.env.VUE_APP_BASE_API) +
                                        "/excel?fileName=" +
                                        res1.data.status;
                                    iframe.style.display = "none";
                                    document.body.appendChild(iframe);
                                    setTimeout(()=>{
                                        iframe.remove();
                                    },5000)
                                } else if (
                                    res1.success == true &&
                                    (res1.data.status == "PRODUCING" || res1.data.status == "UPLOADING" || res1.data.status == "QUEUING")
                                ) {
                                    if (res1.data.progress) {
                                        progress = Math.floor(res1.data.progress);
                                        let tempxy = "-10px " + (38 - Math.floor((progress * 38) / 100)) + "px";
                                        notifyMy["message"] = `<div  class='exportAdditionalstyle'><div id='temp${
                                            prototypeHander.idCount
                                        }'>${progress}%</div><div>${reportName}数据准备中，该过程可能持续几分钟，请勿刷新页面，耐心等待...</div></div>`;
                                        this.$nextTick(() => {
                                            let temp = document.getElementById(`temp${prototypeHander.idCount}`);
                                            temp.style.backgroundPosition = tempxy;
                                        });
                                    }
                                    if (!exportManage[exportName].interval) {
                                        let intervalName = setInterval(run, 1000);
                                        this.$store.commit("beginExport", { exportName: exportName, intervalName: intervalName });
                                    }
                                } else {
                                    this.$store.commit("closeExport", exportName);
                                    this.$store.commit("closeLoading", exportName);
                                    notifyMy.close();
                                    let notifyTitle = `${reportName}准备失败，请重试`
                                    if(res1.code == "export.too.much"){
                                        notifyTitle = "当前导出任务过多，请稍后再试"
                                    }
                                    if (res1.code === "too.much.gps") {
                                        notifyTitle = res1.msg
                                    }
                                    this.$notify({
                                        customClass: "export-style",
                                        type: "error",
                                        title: notifyTitle,
                                        offset: 55,
                                        duration: 2000
                                    });
                                }
                            })
                            .catch(() => {
                                this.$store.commit("closeExport", exportName);
                                this.$store.commit("closeLoading", exportName);
                                notifyMy.close();
                                this.$notify({
                                    customClass: "export-style",
                                    type: "error",
                                    title: `${reportName}数据准备失败，请重试`,
                                    offset: 55,
                                    duration: 2000
                                });
                            });
                    } else {
                        this.$api
                            .isExportFinished(fileName)
                            .then(res1 => {
                                if (res1.success == true && reg.test(res1.data)) {
                                    console.log(res1.data);
                                    notifyMy.close();
                                    this.$notify({
                                        customClass: "export-style",
                                        type: "success",
                                        title: `${reportName}准备完成，已为您自动下载`,
                                        offset: 55,
                                        duration: 2000
                                    });
                                    this.$store.commit("closeExport", exportName);
                                    this.$store.commit("closeLoading", exportName);
                                    let iframe = document.createElement("iframe");
                                    iframe.src =
                                        (process.env.VUE_APP_BASE_API == "/" ? "" : process.env.VUE_APP_BASE_API) + "/excel?fileName=" + res1.data;
                                    iframe.style.display = "none";
                                    document.body.appendChild(iframe);
                                    if(removeTime){
                                        setTimeout(() => {
                                            iframe.remove()
                                        }, removeTime)
                                    } else {
                                        setTimeout(() => {
                                            iframe.remove()
                                        },10000)
                                    }
                                } else if (res1.success == true && (res1.data == "PRODUCING" || res1.data == "UPLOADING" || res1.data == "QUEUING")) {
                                    if (!exportManage[exportName].interval) {
                                        let intervalName = setInterval(run, 1000);
                                        this.$store.commit("beginExport", { exportName: exportName, intervalName: intervalName });
                                    }
                                } else {
                                    this.$store.commit("closeExport", exportName);
                                    this.$store.commit("closeLoading", exportName);
                                    notifyMy.close();
                                    let notifyTitle = `${reportName}准备失败，请重试`
                                    if(res1.code == "export.too.much"){
                                        notifyTitle = "当前导出任务过多，请稍后再试"
                                    }
                                    this.$notify({
                                        customClass: "export-style",
                                        type: "error",
                                        title: notifyTitle,
                                        offset: 55,
                                        duration: 2000
                                    });
                                }
                            })
                            .catch(() => {
                                this.$store.commit("closeExport", exportName);
                                this.$store.commit("closeLoading", exportName);
                                notifyMy.close();
                                this.$notify({
                                    customClass: "export-style",
                                    type: "error",
                                    title: `${reportName}数据准备失败，请重试`,
                                    offset: 55,
                                    duration: 2000
                                });
                            });
                    }
                };
                run();
            } else {
                this.$store.commit("closeExport", exportName);
                this.$store.commit("closeLoading", exportName);
                notifyMy.close();
                this.$notify({
                    customClass: "export-style",
                    type: "error",
                    title: res.code === "sdk.gps.too.much" || res.code === "export.too.much"  ? res.msg : `${reportName}数据准备失败，请重试`,
                    offset: 55,
                    duration: 2000
                });
            }
        })
                           
        .catch(() => {
            // mase 新增-- 修复 当断网时点击导出，加载对话框不会消失的问题
            this.$store.commit("closeExport", exportName);
            this.$store.commit("closeLoading", exportName);
            notifyMy.close();
            this.$notify({
                customClass: "export-style",
                type: "error",
                title: `失败`,
                offset: 55,
                duration: 2000
            });
        });
}

/**
 * @method 打包下载报警附件，并且压缩重命名
 * @param {
 * [{fileName:xxx,fileType:xxx,fileUrl:xxxx}]
 * }data
 */
function downloadHander(attachmentInfo, data) {
    return new Promise(async (resvole, reject) => {
        if (!data || data.length === 0) {
            vue.prototype.$message("暂无附件");
            return reject();
        }
        let axiosFile = url => {
            return new Promise((res, rej) => {
                axios
                    .get(url, {
                        responseType: "blob",
                        timeout: 40000
                    })
                    .then(result => {
                        res(result.data);
                    })
                    .catch(error => {
                        rej(error);
                    });
            });
        };
        let res = await getdownloadVideoFile(data).catch(() => {});
        if (!res || !res.length) {
            return reject();
        }
        let promiseList = [];
        const zip = new JSZip(); // 实例化zip
        promiseList = res.map(item => {
            return axiosFile(item);
        });
        Promise.all(promiseList)
            .then(result => {
                //准备通用名称部分
                let name = "";
                if (attachmentInfo.carPlateColor) {
                    name = `${attachmentInfo.carNumber}(${indexToColor(attachmentInfo.carPlateColor)})_${attachmentInfo.alarmTypeName}_${
                        attachmentInfo.alarmTimeFormat
                    }`;
                } else {
                    name = `${attachmentInfo.carNumber}_${attachmentInfo.alarmTypeName}_${attachmentInfo.alarmTimeFormat}`;
                }
                //如果附件只有一个，则不用打包，直接下载
                if (result.length === 1) {
                    let completeName = "";
                    completeName = name + "." + data[0].fileName.split(".")[1];
                    let url = window.URL.createObjectURL(result[0]);
                    let a = document.createElement("a");
                    a.href = url;
                    a.download = completeName;
                    a.click();
                    resvole();
                } else {
                    result.forEach((item, index) => {
                        zip.file(`0${index}_${name}.${data[index].fileName.split(".")[1]}`, item, { base64: true });
                    });
                    zip.generateAsync({
                        type: "blob"
                    }).then(content => {
                        saveAs(content, name + ".zip"); // 利用file-saver保存文件
                        resvole();
                    });
                }
            })
            .catch(() => {
                vue.prototype.$message.error("附件下载失败");
                reject();
            });
    });
}
function getdownloadVideoFile(data) {
    return new Promise(async (resolve, reject) => {
        let promisList = data.map(({ fileName }) => {
            let obj = { fileName: fileName };
            return new Promise((resolveIn, rejectIn) => {
                vue.prototype.$api
                    .getPrivateDownloadUrl(obj)
                    .then(res => {
                        if (res.success === true) {
                            resolveIn(res.data);
                        } else {
                            rejectIn("error");
                        }
                    })
                    .catch(() => {
                        rejectIn("error");
                    });
            });
        });
        let result = await Promise.all(promisList).catch(() => {
            vue.prototype.$message.error("获取附件Url失败");
            reject();
        });

        resolve(result);
    });
}

/**
 * @method 控件单独下载报警视频附件
 * @param {
 * [{fileName:xxx,fileType:xxx,fileUrl:xxxx}]
 * }data
 */
async function downloadHanderForControl(attachmentInfo, data) {
    if (data.length === 0) {
        this.$message.info("暂无视频附件");
        return "success";
    }
    let name = "";
    if (attachmentInfo.carPlateColor) {
        name = `${attachmentInfo.carNumber}(${indexToColor(attachmentInfo.carPlateColor)})_${attachmentInfo.alarmTypeName}_${
            attachmentInfo.alarmTimeFormat
        }`;
    } else {
        name = `${attachmentInfo.carNumber}_${attachmentInfo.alarmTypeName}_${attachmentInfo.alarmTimeFormat}`;
    }
    let completeName = "";
    completeName = name + "." + data[0].fileName.split(".")[1];
    let axiosFile = url => {
        return new Promise((resolve, reject) => {
            axios
                .get(url, {
                    responseType: "blob",
                    timeout: 40000
                })
                .then(result => {
                    resolve(result.data);
                })
                .catch(error => {
                    reject(error);
                });
        });
    };
    let url = data[0].url;
    try {
        let res = await axiosFile(url);
        let urlnew = window.URL.createObjectURL(res);
        let a = document.createElement("a");
        a.href = urlnew;
        a.download = completeName;
        a.click();
        return "success";
    } catch (e) {
        console.log("附件准备错误！", e);
        return "error";
    }
}

/**
 * @method 下载PDF（截取页面）
 * @param dom:实例
 * @param pdfName:下载后PDF的名称
 */
function downloadPDF(ele, pdfName) {
    let time = vue.prototype.$moment().format("YYYY[年]MM[月]DD[日] HH[点]mm[分]ss[秒]");
    pdfName = pdfName !== undefined ? time + pdfName : time;
    return new Promise((resolve, reject) => {
        html2canvas(ele, {
            dpi: 300,
            scale: 2,
            useCORS: true //允许canvas画布内 可以跨域请求外部链接图片, 允许跨域请求。
        })
            .then(canvas => {
                //未生成pdf的html页面高度
                let leftHeight = canvas.height;
                let a4Width = 595.28;
                let a4Height = 821.89; //（一张A4高=841.89减去20，使得上下边距空出20,pdf.addImage生成上边距（第四个参数=10）致使使得上下边距各10）
                //一页pdf显示html页面生成的canvas高度;
                let a4HeightRef = Math.floor((canvas.width / a4Width) * a4Height);
                //pdf页面偏移
                let position = 0;
                let pageData = canvas.toDataURL("image/jpeg", 1.0);
                let pdf = new jsPDF("x", "pt", "a4");
                let canvas1 = document.createElement("canvas");
                let height;
                pdf.setDisplayMode("fullwidth", "continuous", "FullScreen");
                function createImpl(canvas) {
                    if (leftHeight > 0) {
                        let checkCount = 0;
                        if (leftHeight > a4HeightRef) {
                            let i = position + a4HeightRef;
                            for (i = position + a4HeightRef; i >= position; i--) {
                                let isWrite = true;
                                for (let j = 0; j < canvas.width; j++) {
                                    let c = canvas.getContext("2d").getImageData(j, i, 1, 1).data;
                                    if (c[0] != 0xff || c[1] != 0xff || c[2] != 0xff) {
                                        isWrite = false;
                                        break;
                                    }
                                }
                                if (isWrite) {
                                    checkCount++;
                                    if (checkCount >= 10) {
                                        break;
                                    }
                                } else {
                                    checkCount = 0;
                                }
                            }
                            height = Math.round(i - position) || Math.min(leftHeight, a4HeightRef);
                            if (height <= 0) {
                                height = a4HeightRef;
                            }
                        } else {
                            height = leftHeight;
                        }
                        canvas1.width = canvas.width;
                        canvas1.height = height;
                        let ctx = canvas1.getContext("2d");
                        ctx.drawImage(canvas, 0, position, canvas.width, height, 0, 0, canvas.width, height);
                        if (position != 0) {
                            pdf.addPage();
                        }
                        pdf.addImage(canvas1.toDataURL("image/jpeg", 1.0), "JPEG", 0, 10, a4Width, (a4Width / canvas1.width) * height);
                        leftHeight -= height;
                        position += height;
                        if (leftHeight > 0) {
                            setTimeout(createImpl, 500, canvas);
                        } else {
                            pdf.save(pdfName);
                            resolve();
                        }
                    }
                }
                // 当内容未超过pdf一页显示的范围，无需分页
                if (leftHeight < a4HeightRef) {
                    pdf.addImage(pageData, "JPEG", 0, 10, a4Width, (a4Width / canvas.width) * leftHeight);
                    pdf.save(pdfName);
                    resolve();
                } else {
                    try {
                        pdf.deletePage(0);
                        setTimeout(createImpl, 500, canvas);
                    } catch (e) {
                        reject("pdf导出失败");
                    }
                }
            })
            .catch(() => {
                reject("pdf导出失败");
            });
    });
}

/**
 * @method 另起一个tab在线预览PDF
 * @param src:PDF的后端生成路径，非阿里云
 */
async function preViewFile(src, viewConfigStr) {
    let url = (process.env.VUE_APP_BASE_API == "/" ? "" : process.env.VUE_APP_BASE_API) + "/excel?fileName=" + src;
    let axiosFile = url => {
        return new Promise((resolve, reject) => {
            axios
                .get(url, {
                    responseType: "blob",
                    timeout: 40000
                })
                .then(result => {
                    resolve(result.data);
                })
                .catch(error => {
                    reject(error);
                });
        });
    };
    try {
        let res = await axiosFile(url);
        /* blob文件流转指定种类的blob，预览需要有这一步，下载不用 */
        // let urlnew = window.URL.createObjectURL(new Blob([res], { type: "application/pdf" }));
        /* #toolbar=0&view=FitH,top 禁用工具栏，全屏打开 */
        // window.open(`${urlnew}${viewConfigStr ? viewConfigStr : ""}`);
        //IE不允许你直接打开blob.你必须使用msSaveOrOpenBlob.还有msSaveBlob
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(new Blob([res], { type: "application/pdf" }));
        } else {
            let urlnew = window.URL.createObjectURL(new Blob([res], { type: "application/pdf" }));
            window.open(`${urlnew}${viewConfigStr ? viewConfigStr : ""}`);
        }
    } catch (e) {
        console.error(e);
    }
}
export { exportHander, downloadHander, downloadHanderForControl, downloadPDF, preViewFile };
