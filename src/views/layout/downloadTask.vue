<template>
    <div class="wrap">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="视频下载" name="first"></el-tab-pane>
            <el-tab-pane label="文件下载" name="second"></el-tab-pane>
        </el-tabs>
        <div ref="searchBox" class="search-module">
            <div class="search-form-content" ref="wrap">
                <el-form :model="searchForm" inline ref="searchForm">
                    <el-form-item
                        label="关键字"
                        prop="deviceCode"
                        v-if="activeName == 'first'"
                    >
                        <G-DeviceSearch
                            :valueKey="'deviceCode'"
                            :value.sync="searchForm.deviceCode"
                            :organizeId="params.organizeId"
                        ></G-DeviceSearch>
                    </el-form-item>
                    <template v-if="activeName == 'second'">
                        <el-form-item label="文件名称" prop="fileName">
                            <el-input
                                v-model="searchForm.fileName"
                                placeholder="请输入文件名称"
                                clearable
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="文件类型" prop="type">
                            <el-select
                                clearable
                                v-model="searchForm.type"
                                placeholder="请选择文件类型"
                            >
                                <el-option
                                    v-for="item in downTypeList.filter(
                                        (k) => k.value > 1
                                    )"
                                    :key="item.value"
                                    :label="item.name"
                                    :value="item.value"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                    </template>
                    <el-form-item label="上传状态" prop="downStatus">
                        <el-select
                            clearable
                            v-model="searchForm.downStatus"
                            placeholder="请选择文件上传状态"
                        >
                            <el-option
                                v-for="item in activeName == 'first'
                                    ? downStatusList.filter((k) => k.value < 5)
                                    : downStatusList.filter(
                                          (k) => k.value > 0 && k.value !== 3
                                      )"
                                :key="item.value"
                                :label="item.name"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
            <div class="search-btn">
                <el-button
                    type="primary"
                    :disabled="searchLoading"
                    :loading="searchLoading"
                    @click="
                        params.currentPage = 1;
                        search();
                    "
                    >查询</el-button
                >
                <el-button type="default" @click="handleReset($refs.searchForm)"
                    >清除条件</el-button
                >
            </div>
        </div>
        <div class="wrap-top p-x" ref="searchBtn" v-if="activeName == 'first'">
            <div class="flex">
                <el-button
                    type="default"
                    @click="batchDownload()"
                    :disabled="!multipleSelection.length"
                    >批量下载{{
                        multipleSelection.length
                            ? `（${multipleSelection.length}）`
                            : ""
                    }}</el-button
                >
            </div>
        </div>
        <div
            class="wrap-top p-x"
            ref="searchAlert"
            v-if="activeName == 'first'"
        >
            <div class="w-full" style="margin: 1rem 0">
                <el-alert
                    title="若上传时间大于1小时，设备已无法将该文件上传至平台，请重新让设备上传录像文件。"
                    type="info"
                    show-icon
                    simple
                    :closable="false"
                ></el-alert>
            </div>
        </div>
        <div class="p-x">
            <!-- @sort-change="changeSort" @filter-change="filterChange" -->
            <el-table
                v-loading="searchLoading"
                :data="tableData"
                :row-key="'id'"
                :height="tableHeight"
                ref="table"
                @selection-change="handleSelectionChange"
            >
                <template v-if="activeName == 'first'">
                    <el-table-column
                        type="selection"
                        :reserve-selection="true"
                        :selectable="getSelectEnable"
                    ></el-table-column>
                    <el-table-column
                        fixed
                        prop="plateNum"
                        key="plateNum"
                        label="车牌号"
                        min-width="100px"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="deviceCode"
                        key="deviceCode"
                        label="终端手机号"
                        min-width="120px"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="deviceSerialNum"
                        key="deviceSerialNum"
                        label="设备序列号"
                        min-width="125px"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="vin"
                        key="vin"
                        label="VIN码"
                        min-width="100px"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="chanNum"
                        key="chanNum"
                        label="通道号"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="fileStartTime"
                        key="fileStartTime"
                        width="140"
                        label="文件开始时间"
                    >
                        <template slot-scope="scope">
                            {{
                                scope.row.fileStartTime
                                    ? $moment(scope.row.fileStartTime).format(
                                          "YYYY-MM-DD HH:mm:ss"
                                      )
                                    : "--"
                            }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="fileEndTime"
                        key="fileEndTime"
                        width="140"
                        label="文件结束时间"
                    >
                        <template slot-scope="scope">
                            {{
                                scope.row.fileEndTime
                                    ? $moment(scope.row.fileEndTime).format(
                                          "YYYY-MM-DD HH:mm:ss"
                                      )
                                    : "--"
                            }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        key="timeTotal"
                        width="100"
                        label="文件总时长"
                        :formatter="timeTotal"
                    ></el-table-column>
                    <el-table-column prop="fileSize" key="fileSize" width="100">
                        <template slot="header">
                            <span>文件大小</span>
                            <el-tooltip
                                class="item"
                                effect="light"
                                content="用户文件大小是平台预估，实际以下载大小为准"
                                placement="top"
                            >
                                <i
                                    class="el-icon-question"
                                    style="color: #66b1ff"
                                ></i>
                            </el-tooltip>
                        </template>
                        <template slot-scope="scope">
                            {{ scope.row.fileSize | fileSize }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="createTime"
                        key="createTime"
                        width="140"
                        label="下载时间"
                    >
                        <template slot-scope="scope">
                            {{
                                scope.row.createTime
                                    ? $moment(scope.row.createTime).format(
                                          "YYYY-MM-DD HH:mm:ss"
                                      )
                                    : "--"
                            }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="uploadEndTime"
                        key="uploadEndTime"
                        width="140"
                        label="文件上传结束时间"
                    >
                        <template slot-scope="scope">
                            {{
                                scope.row.uploadEndTime
                                    ? $moment(scope.row.uploadEndTime).format(
                                          "YYYY-MM-DD HH:mm:ss"
                                      )
                                    : "--"
                            }}
                        </template>
                    </el-table-column>
                </template>
                <template v-if="activeName == 'second'">
                    <el-table-column
                        prop="fileName"
                        label="文件名称"
                        key="fileName"
                        show-overflow-tooltip
                    >
                    </el-table-column>

                    <el-table-column
                        prop="type"
                        width="140"
                        label="文件类型"
                        key="type"
                    >
                        <template slot-scope="scope">
                            <span>
                                {{
                                    downTypeList.find(
                                        (item) => item.value === scope.row.type
                                    )
                                        ? downTypeList.find(
                                              (item) =>
                                                  item.value === scope.row.type
                                          ).name
                                        : "--"
                                }}</span
                            >
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="createTime"
                        label="创建时间"
                        key="createTime"
                        width="140"
                    >
                        <template slot-scope="scope">
                            {{
                                scope.row.createTime
                                    ? $moment(scope.row.createTime).format(
                                          "YYYY-MM-DD HH:mm:ss"
                                      )
                                    : "--"
                            }}
                        </template>
                    </el-table-column>
                </template>
                <el-table-column prop="downStatus" width="120" label="上传状态">
                    <template slot-scope="scope">
                        <span :class="`downStatus-${scope.row.downStatus}`">
                            <i class="dot"></i
                            >{{
                                downStatusList.find(
                                    (item) =>
                                        item.value === scope.row.downStatus
                                )
                                    ? downStatusList.find(
                                          (item) =>
                                              item.value ===
                                              scope.row.downStatus
                                      ).name
                                    : "--"
                            }}</span
                        >
                    </template>
                </el-table-column>

                <el-table-column
                    prop="operationName"
                    width="140"
                    label="操作人员姓名"
                >
                </el-table-column>
                <el-table-column width="160" label="操作">
                    <template slot-scope="scope">
                        <div class="flex-layout flex-middle flex-end">
                            <el-progress
                                :show-text="false"
                                :percentage="
                                    $store.state.downloadManage
                                        .downLoadingStatusMap[scope.row.id]
                                        .progress
                                "
                                style="
                                    width: 50px;
                                    margin-right: 20px;
                                    display: flex;
                                    align-items: center;
                                "
                                v-if="
                                    $store.state.downloadManage
                                        .downLoadingStatusMap[scope.row.id] &&
                                    scope.row.downStatus == 1
                                "
                            ></el-progress>
                            <span
                                class="text-info pointer m-r"
                                v-show="scope.row.downStatus == 1"
                                @click="
                                    $store.state.downloadManage
                                        .downLoadingStatusMap[scope.row.id]
                                        ? cancelDownLoad(scope.row)
                                        : downFile(scope.row)
                                "
                                >{{
                                    $store.state.downloadManage
                                        .downLoadingStatusMap[scope.row.id]
                                        ? "取消"
                                        : "下载"
                                }}</span
                            >
                            <span
                                v-if="activeName === 'first'"
                                class="text-info pointer m-r"
                                v-show="
                                    scope.row.downStatus == 2 ||
                                    scope.row.downStatus == 3
                                "
                                @click="reUpload(scope.row.id)"
                                >重新上传</span
                            >
                            <span
                                class="text-info pointer"
                                v-show="scope.row.downStatus != 0"
                                @click="doDelete(scope.row.id)"
                            >
                                删除
                            </span>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="p-x wrap-bottom" ref="searchPagination">
            <el-pagination
                :current-page="params.currentPage"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :page-sizes="[20, 50, 100]"
                :page-size="params.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
            >
            </el-pagination>
        </div>
    </div>
</template>
<script>
import TimeUtil from "@/utils/time";
import base from "@/utils/base";
export default {
    name: "",
    components: {},
    props: {},
    data() {
        return {
            activeName: "first",
            activeNameType: {
                first: [1],
                second: [2, 3],
            },
            params: {
                currentPage: 1, //页码，从1开始
                pageSize: 20, //分页大小
            },
            total: 0,
            tableHeight: 0,
            searchLoading: false,
            searchForm: {
                deviceCode: "",
                downStatus: "",
                fileName: "",
                type: "",
            },
            tableData: [],
            multipleSelection: [],
            downStatusList: [],
            downTypeList: [],
        };
    },
    mounted() {
        this.getDownStatusEnum();
        this.getDownTypeEnum();
        window.onresize = () => {
            this.setTableHeight();
        };
        this.search();
        setTimeout(() => {
            this.setTableHeight();
        }, 300);
    },
    beforeDestroy() {
        window.removeEventListener("resize", this.setTableHeight);
    },
    computed: {},
    watch: {},
    methods: {
        handleClick() {
            this.handleReset(this.$refs.searchForm);
            this.params.currentPage = 1;
            this.search();
        },
        timeTotal(row, index, data) {
            let resTime = "";
            if (row.fileTotalTime) {
                resTime = TimeUtil.formatSeconds(row.fileTotalTime);
            }
            return resTime;
        },
        getSelectEnable(row) {
            if (row.downStatus == 1) {
                return true;
            }
        },
        handleSelectionChange(selection) {
            this.multipleSelection = [];
            selection.forEach((item) => {
                this.multipleSelection.push(item.id);
            });
        },
        handleSizeChange(val) {
            this.params.pageSize = val;
            this.search();
        },
        handleCurrentChange(val) {
            this.params.currentPage = val;
            this.search();
        },
        // 重置表单
        handleReset(ref) {
            if (ref !== undefined) {
                ref.resetFields();
                this.$store.dispatch("SetCondtion", this.searchForm);
            }
        },
        // 表格搜索
        search() {
            let params = Object.assign(this.params, this.searchForm, {
                type: this.searchForm.type
                    ? [this.searchForm.type]
                    : this.activeNameType[this.activeName],
            });
            this.getData(params);
        },
        /*获取table列表*/
        getData(params) {
            this.searchLoading = true;
            this.$api
                .getDownloadPage(params)
                .then((res) => {
                    if (res.success == true) {
                        this.tableData = res.data.results;
                        this.total = res.data.totalRecords;
                        this.$nextTick(() => {
                            this.setTableHeight();
                        });
                    } else {
                        this.$message.error(res.msg);
                    }
                    this.searchLoading = false;
                })
                .catch((err) => {
                    this.searchLoading = false;
                });
        },
        setTableHeight() {
            this.tableHeight =
                document.body.clientHeight -
                226 -
                (this.activeName == "first" ? 92 : 0);
        },
        batchDownload() {
            this.$api.getDownloadUrl(this.multipleSelection).then((res) => {
                if (res.success == true) {
                    res.data.forEach((item) => {
                        this.downFile(item);
                    });
                    this.$refs.table.clearSelection();
                }
            });
        },
        cancelDownLoad({ id }) {
            this.$store.commit(
                "setDownLoadingStatusMap",
                (downLoadingStatusMap) => {
                    downLoadingStatusMap[id].xhr.abort();
                    this.$delete(downLoadingStatusMap, id);
                }
            );
        },
        downFile(item) {
            this.getBlob(item);
            // this.getBlob(downloadUrl).then((blob) => {
            //     this.saveAs(blob, fileName);
            // });
            // var iframe = document.createElement("iframe");
            // iframe.src = downloadUrl;
            // iframe.style.display = "none";
            // document.body.appendChild(iframe);
            // setTimeout(() => {
            //     document.body.removeChild(iframe);
            // }, 2000);
        },
        reUpload(id) {
            this.$confirm(
                "确定要重新上传该视频吗？上传时间可能较长，请耐心等待。",
                this.$t("common.prompt"),
                {
                    confirmButtonText: this.$t("common.ok"),
                    cancelButtonText: this.$t("common.cancel"),
                    type: "warning",
                }
            )
                .then(() => {
                    this.$api.reUploadVideo({ id: id }).then((res) => {
                        if (res.success == true) {
                            this.$message.success("已向设备下发重新上传指令！");
                            this.search();
                        } else {
                            this.$message.error(res.msg);
                        }
                    });
                })
                .catch(() => {});
        },
        getUpLoadUrl() {},
        doDelete(id) {
            this.$confirm(
                "删除文件后，无法恢复，是否确认删除？",
                "确定要删除该下载文件吗？",
                {
                    confirmButtonText: this.$t("common.ok"),
                    cancelButtonText: this.$t("common.cancel"),
                    type: "warning",
                }
            )
                .then(() => {
                    this.$api
                        .deleteDownloadData({
                            id: id,
                        })
                        .then((res) => {
                            if (res.success == true) {
                                this.$message.success("删除成功");
                                this.search();
                            } else {
                                this.$message.error(res.msg);
                            }
                        })
                        .catch((err) => {});
                })
                .catch(() => {});
        },
        getDownStatusEnum() {
            this.$api.getDownStatusEnum().then((res) => {
                if (res.success == true) {
                    this.downStatusList = res.data;
                }
            });
        },
        getDownTypeEnum() {
            this.$api.getDownTypeEnum().then((res) => {
                if (res.success == true) {
                    this.downTypeList = res.data;
                }
            });
        },
        /**
         * 获取 blob
         * url 目标文件地址
         */
        getBlob(item) {
            let newUrl = item.downloadUrl;
            if (this.activeName == "first") {
                newUrl = newUrl.replace(
                    "47.114.190.241",
                    "download.hikvisionauto.com"
                );
            }
            newUrl = newUrl.replace(
                "http://47.110.152.146:29999",
                "https://jyp-private-read.oss-cn-hangzhou.aliyuncs.com"
            );
            // return new Promise((resolve) => {
            //     const xhr = new XMLHttpRequest();
            //     xhr.open("GET", newUrl, true);
            //     xhr.responseType = "blob";
            //     xhr.onload = () => {
            //         if (xhr.status === 200) {
            //             resolve(xhr.response);
            //         }
            //     };
            //     xhr.send();
            // });
            base.xhrPullFile(newUrl, ({ status, msg }) => {
                if (status === "progress") {
                    this.$store.commit(
                        "setDownLoadingStatusMap",
                        (downLoadingStatusMap) => {
                            downLoadingStatusMap[item.id].progress = msg;
                        }
                    );
                } else if (status === "success") {
                    this.saveAs(msg, item.fileName);
                    this.$store.commit(
                        "setDownLoadingStatusMap",
                        (downLoadingStatusMap) => {
                            this.$delete(downLoadingStatusMap, item.id);
                        }
                    );
                } else if (status === "begin") {
                    this.$store.commit(
                        "setDownLoadingStatusMap",
                        (downLoadingStatusMap) => {
                            this.$set(downLoadingStatusMap, item.id, {
                                progress: 0,
                                xhr: msg,
                            });
                        }
                    );
                } else if (status === "error") {
                    this.$message.error("下载失败");
                    this.$store.commit(
                        "setDownLoadingStatusMap",
                        (downLoadingStatusMap) => {
                            this.$delete(downLoadingStatusMap, item.id);
                        }
                    );
                }
            });
        },
        /**
         * 保存 blob
         * filename 想要保存的文件名称
         */
        saveAs(blob, filename) {
            if (window.navigator.msSaveOrOpenBlob) {
                navigator.msSaveBlob(blob, filename);
            } else {
                const link = document.createElement("a");
                const body = document.querySelector("body");
                link.href = window.URL.createObjectURL(blob);
                link.download = filename;
                // fix Firefox
                link.style.display = "none";
                body.appendChild(link);
                link.click();
                body.removeChild(link);
                window.URL.revokeObjectURL(link.href);
            }
        },
    },
};
</script>
<style lang="less" scoped>
.wrap {
    /deep/ .el-alert--info {
        background: rgb(225, 248, 255);
        border: 1px solid rgb(133, 219, 255);
        color: #606266;
    }
    /deep/ .el-alert__icon {
        color: rgb(0, 148, 255);
    }
}
.dot {
    display: inline-block;
    height: 8px;
    width: 8px;
    border-radius: 50%;
    margin-right: 8px;
}
.downStatus-1 {
    .dot {
        background: #41b883 !important;
    }
}
.downStatus-2,
.downStatus-4 {
    .dot {
        background: #fb5678 !important;
    }
}
.downStatus-0,
.downStatus-3,
.downStatus-5 {
    .dot {
        background: #ffc313 !important;
    }
}
/deep/.el-tabs {
    .el-tabs__nav-scroll {
        padding: 0 14px;
    }
}
</style>
