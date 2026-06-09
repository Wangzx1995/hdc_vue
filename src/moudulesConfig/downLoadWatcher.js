import store from "../store";
//import Vue from "vue";
import Vue from "vue/dist/vue.esm.js";
import { Message } from "element-ui";

import monitorApi from "../api/monitorApi";
import { transFormAndDownLoad, xhrPullFile } from '@/utils/playBack';
const getFileUploadStatus = monitorApi.getFileUploadStatus;
const getVideoDownloadUrl = monitorApi.getVideoDownloadUrl;
let interval = null;
let oldValue = [];
store.watch((state) => {
    return state.downloadManage.uploadingList
}, (uploadingList) => {
    if (uploadingList.length > oldValue.length) {
        oldValue = [...uploadingList];
        if (!interval) {
            interval = setInterval(() => {
                let ids = oldValue.map(({ id }) => {
                    return id;
                });
                getFileUploadStatus({ fileIds: ids }).then((res) => {
                    if (res.success) {
                        uploadingList.remove((item) => {
                            return res.data.map(({ id }) => { return id }).indexOf(item.id) === -1
                        })
                        res.data.forEach(({ id, downStatus }) => {
                            if (downStatus === 1) {
                                let paramsUse = oldValue.find((item) => {
                                    return item.id === id;
                                });
                                getVideoDownloadUrl(paramsUse.params).then(async (res) => {
                                    if (res.success) {
                                        let data = res.data;
                                        for (let i = 0; i <= data.urlList.length - 1; i++) {
                                            await xhrPullFile(data.urlList[i], ({ status, msg }) => {
                                                if (status === 'progress') {
                                                    store.commit("setDownLoadingStatusMap", (downLoadingStatusMap) => {
                                                        downLoadingStatusMap[id].progress = msg;
                                                    })
                                                } else if (status === 'success') {
                                                    transFormAndDownLoad(msg, data.deviceFileName, (data.fileDownLoadType === 1 || data.fileDownLoadType === undefined) ? "5" : '2');
                                                    store.commit("setDownLoadingStatusMap", (downLoadingStatusMap) => {
                                                        vue.delete(downLoadingStatusMap, id);
                                                    })
                                                } else if (status === 'begin') {
                                                    store.commit("setDownLoadingStatusMap", (downLoadingStatusMap) => {
                                                        vue.set(downLoadingStatusMap, id, { progress: 0, xhr: msg });
                                                    })
                                                } else if (status === 'error') {
                                                    Message.error('录像下载失败');
                                                    store.commit("setDownLoadingStatusMap", (downLoadingStatusMap) => {
                                                        vue.delete(downLoadingStatusMap, id);
                                                    })
                                                }
                                            })
                                        }
                                    }
                                }).catch(() => { });
                                store.state.downloadManage.uploadingList.remove((item) => {
                                    return item.id === id;
                                });
                            } else if (downStatus === 2) {
                                store.state.downloadManage.uploadingList.remove((item) => {
                                    return item.id === id;
                                })
                            }
                        });
                    }
                }).catch(() => { });
            }, 5000);
        }
    } else {
        oldValue = [...uploadingList];
        if (uploadingList.length === 0) {
            clearInterval(interval);
            interval = null;
        }
    }
}, { deep: true, immediate: true });


