<template>
    <div class="car-query-log" ref="carQueryLog">
        <div class="top-box">
            <G-DeviceSearch
                :valueKey="'deviceCode'"
                :value.sync="searchForm.deviceCode"
                :selectObj.sync="currentWachCar"
            ></G-DeviceSearch>
            <el-button
                type="primary"
                @click="logSearch"
                :disabled="searchLoading"
                :loading="searchLoading"
            >
                <!-- 查询 -->
                {{ $t("common.search") }}
            </el-button>
            <el-button @click="uploadLog" plain v-show="showLog">
                <!-- 上传日志 -->
                {{ $t("devLog.uploadLogs") }}
            </el-button>
            <div v-show="!showLog" style="width: 108px"></div>
        </div>
        <div class="bot-box" v-if="showLog">
            <h2>
                <!-- 日志上传成功记录 -->
                {{ $t("devLog.recordSuccessfulLogUpload") }}
                ：
            </h2>
            <div class="search-box">
                <el-form
                    ref="form"
                    label-position="top"
                    :model="searchForm"
                    inline
                >
                    <!-- 上传时间 -->
                    <el-form-item
                        :label="$t('devLog.uploaded')"
                        prop="timeRange"
                    >
                        <el-date-picker
                            :default-time="['00:00:00', '23:59:59']"
                            size="small"
                            v-model="timeRange"
                            type="datetimerange"
                            :start-placeholder="$t('common.startTime')"
                            :end-placeholder="$t('common.endTime')"
                            transfer
                            clearable
                            format="yyyy-MM-dd HH:mm:ss"
                        ></el-date-picker>
                    </el-form-item>
                    <!-- 日志类型 -->
                    <el-form-item :label="$t('devLog.logType')" prop="logTypes">
                        <el-select
                            :popper-class="'operate-select'"
                            v-model="searchForm.logTypes"
                            :placeholder="$t('common.select')"
                            multiple
                            collapse-tags
                            clearable
                            style="width: 300px"
                            @change="(val) => changeSelect(val)"
                        >
                            <div class="option-box">
                                <el-option
                                    v-for="(item, index) in logTypeList"
                                    :key="index"
                                    :value="item.sysDictCode"
                                    :label="item.sysDictName"
                                ></el-option>
                            </div>
                            <div class="copy-btn">
                                <el-button type="text" @click="selectAll()">
                                    <span v-if="checked">
                                        <!-- 取消全选 -->
                                        {{ $t("common.deselectAll") }}
                                    </span>
                                    <span v-else>
                                        <!-- 全选 -->
                                        {{ $t("common.selectAll") }}
                                    </span>
                                </el-button>
                            </div>
                        </el-select>
                    </el-form-item>
                    <!-- 上传方式 -->
                    <el-form-item
                        :label="$t('devLog.uploadMode')"
                        prop="uploadMode"
                    >
                        <el-select
                            v-model="searchForm.uploadMode"
                            :placeholder="$t('common.select')"
                        >
                            <el-option
                                v-for="(item, index) in uploadMethodList"
                                :key="index"
                                :value="item.value"
                                :label="item.label"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <div class="right-btn">
                    <el-button
                        type="primary"
                        :disabled="searchLoading"
                        :loading="searchLoading"
                        @click="getLogData(true)"
                    >
                        <!-- 查询 -->
                        {{ $t("common.search") }}
                    </el-button>
                    <el-button
                        type="default"
                        @click="handleReset($refs.searchForm)"
                    >
                        <!-- 清除条件 -->
                        {{ $t("common.reset") }}
                    </el-button>
                </div>
            </div>
            <div>
                <el-table
                    v-loading="searchLoading"
                    :element-loading-text="$t('common.desperatelyLoading')"
                    element-loading-color="#007213"
                    :height="tableHeight"
                    :data="tableData"
                    force-scroll="horizontal"
                    style="width: 100%"
                    border
                    stripe
                >
                    <!-- 上传时间 -->
                    <el-table-column
                        prop="uploadTime"
                        :label="$t('devLog.uploaded')"
                        width="200px"
                    >
                        <template slot-scope="scope">
                            <span>
                                {{
                                    $moment(scope.row.uploadTime).format(
                                        "YYYY-MM-DD HH:mm:ss"
                                    )
                                }}
                            </span>
                        </template>
                    </el-table-column>
                    <!-- 日志类型 -->
                    <el-table-column
                        prop="logTypes"
                        :label="$t('devLog.logType')"
                    ></el-table-column>
                    <!-- 上传方式 -->
                    <el-table-column
                        prop="uploadMode"
                        :label="$t('devLog.uploadMode')"
                        width="200px"
                    >
                        <template slot-scope="scope">
                            <div>
                                <span>
                                    {{
                                        uploadMethodList.find(
                                            (e) =>
                                                e.value === scope.row.uploadMode
                                        ).label
                                    }}
                                </span>
                                <span v-if="scope.row.endTime">
                                    ({{
                                        $moment(scope.row.endTime).format(
                                            "YYYY-MM-DD"
                                        )
                                    }})
                                </span>
                            </div>
                        </template>
                    </el-table-column>
                    <!-- 文件名 -->
                    <el-table-column
                        prop="fileName"
                        :label="$t('devLog.fileName')"
                        width="200px"
                        show-overflow-tooltip
                    >
                    </el-table-column>
                    <!-- 文件大小（MB） -->
                    <el-table-column
                        prop="fileSize"
                        :label="$t('devLog.fileSize') + '（MB）'"
                        width="200px"
                    >
                        <template slot-scope="scope">
                            <span v-if="!scope.row.fileSize"> -- </span>
                            <span v-else>
                                <span
                                    v-if="
                                        (
                                            scope.row.fileSize /
                                            1024 /
                                            1024
                                        ).toFixed(2) == 0
                                    "
                                >
                                    0.01
                                </span>
                                <span v-else>
                                    {{
                                        (
                                            scope.row.fileSize /
                                            1024 /
                                            1024
                                        ).toFixed(2)
                                    }}
                                </span>
                            </span>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="wrap-bottom">
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
        </div>
        <!-- 上传日志 -->
        <el-dialog
            :title="$t('devLog.uploadLogs')"
            :visible.sync="uploadLogVisible"
            :close-on-click-modal="false"
            :width="'600px'"
            :custom-class="'upload-log-dialog'"
        >
            <upload-log
                :key="timer"
                :deviceCode="searchForm.deviceCode"
                @cancel="cancel"
                :business="'DEVICE_LOG_ADD_TASK'"
            ></upload-log>
        </el-dialog>
        <!-- 日志上传记录 -->
        <el-dialog
            :fullscreen="true"
            :title="$t('devLog.devLogRecord')"
            :visible.sync="dialogVisible"
            :custom-class="'devLog-record-dialog'"
        >
            <devLog-record v-if="dialogVisible"></devLog-record>
        </el-dialog>
    </div>
</template>
<script>
import TimeUtil from "@/utils/time";
import uploadLog from "./uploadLog";
import enumeration from "./js/enumeration";
import axios from "axios";
import devLogRecord from "../devLogRecord.vue";

export default {
    name: "",
    components: { uploadLog, devLogRecord },
    props: {},
    data() {
        return {
            showLog: false,
            plateArr: [],
            query: "",
            searchForm: {
                deviceCode: "",
                logTypes: [],
                uploadMode: "",
            },
            timeRange: [],
            searchLoading: false,
            tableHeight: 500,
            params: {
                currentPage: 1, //页码，从1开始
                pageSize: 20, //分页大小
            },
            total: 0,
            tableData: [],
            logTypeList: [],
            uploadMethodList: [
                ...[
                    {
                        label: this.$t("common.all"),
                        value: "",
                    },
                ],
                ...enumeration.uploadMethodList,
            ],
            timer: null,
            uploadLogVisible: false,
            checked: false,
            loadingEnd: false,
            secretKey: "",
            dialogVisible: false,
            currentWachCar: {},
        };
    },
    created() {
        this.setTableHeight();
    },
    mounted() {
        this.getDevLogFileType();
        window.addEventListener("resize", this.setTableHeight);
        this.setDeault();
    },
    computed: {},
    watch: {},
    methods: {
        selectAll() {
            this.checked = !this.checked;
            this.$forceUpdate();
            if (this.checked) {
                this.logTypeList.forEach((item) => {
                    this.searchForm.logTypes.push(item.sysDictCode);
                });
                this.searchForm.logTypes = [
                    ...new Set(this.searchForm.logTypes),
                ];
            } else {
                this.searchForm.logTypes = [];
            }
        },
        changeSelect(val) {
            if (val.length === this.logTypeList.length) {
                this.checked = true;
            } else {
                this.checked = false;
            }
            this.$forceUpdate();
        },
        getPlateNumList(params) {
            this.$api.getCarDevByKeywords(params).then((res) => {
                if (res.success) {
                    let arr = JSON.parse(JSON.stringify(res.data));
                    arr.forEach((item) => {
                        item.html = `<span>${item.plateNum || "--"}；${
                            item.deviceSerialNum || "--"
                        }；${item.deviceCode || "--"}</span>`;
                    });
                    this.plateArr = this.setHightLight(arr, this.query);
                }
            });
        },
        remoteMethod(query) {
            this.query = query;
            if (!!query) {
                this.secretKey = query + "";
            }
            if (query.length >= 3) {
                this.getPlateNumList({ keywords: query });
            } else {
                this.plateArr = [];
            }
        },
        // 设置高亮
        setHightLight(arr, keyword) {
            if (arr && arr.length > 0 && keyword) {
                arr = arr.filter((item) => {
                    let reg = new RegExp(keyword, "g");
                    let replaceString = `<span class='option-high'>${keyword.trim()}</span>`;
                    if (item.html.match(reg)) {
                        item.html = item.html.replace(reg, replaceString);
                        return item;
                    }
                });
                return arr;
            }
            if (!keyword) {
                return arr;
            }
        },
        visibleHandler() {
            this.plateArr = [];
        },
        logSearch() {
            // this.$api
            //     .authDownload({
            //         keywords: this.secretKey,
            //     })
            //     .then((res) => {
            //         if (res.success == true && res.data == true) {
            //             this.dialogVisible = true;
            //         }
            //         this.secretKey = "";
            //     });
            if (!this.searchForm.deviceCode) {
                // "车辆不能为空！"
                this.$message.warning(this.$t("devLog.vehicleEmpty"));
                return;
            }
            this.showLog = true;
            this.getLogData(true);
        },
        selectClear() {
            this.showLog = false;
        },
        // 重置表单
        handleReset(ref) {
            this.timeRange = [];
            this.$refs["form"].resetFields();
        },
        getLogData(isReset) {
            if (isReset) {
                this.params.currentPage = 1;
            }
            this.searchLoading = true;
            let params = {};
            if (this.timeRange && this.timeRange.length > 0) {
                params.uploadBeginTime = TimeUtil.getDateTime(
                    this.timeRange[0]
                );
                params.uploadEndTime = TimeUtil.getDateTime(this.timeRange[1]);
            } else {
                params.uploadBeginTime = "";
                params.uploadEndTime = "";
            }
            let carParam = Object.assign(params, this.searchForm, this.params);
            //carParam['organizeId'] = ''
            this.$api
                .getDevLogPage(carParam)
                .then((res) => {
                    if (res.success == true) {
                        this.tableData =
                            (res.data.results.length &&
                                res.data.totalRecords) ||
                            (!res.data.results.length && !res.data.totalRecords)
                                ? res.data.results
                                : this.tableData;
                        this.total = res.data.totalRecords;
                    } else {
                        this.$message.error(res.msg);
                    }
                    this.searchLoading = false;
                })
                .catch((err) => {
                    this.searchLoading = false;
                });
        },
        handleSizeChange(val) {
            this.params.pageSize = val;
            this.getLogData();
        },
        handleCurrentChange(val) {
            this.params.currentPage = val;
            this.getLogData();
        },
        setTableHeight() {
            this.tableHeight = document.body.clientHeight - 162 - 140 - 56 - 56;
        },
        downloadLog(uploadMode, devLogId) {
            let startTime = new Date();
            this.loadingEnd = true;
            const downloadTimeLimit = 3 * 60 * 1000;
            let timeoutPrompted = false; // 是否已经提示过超时
            const checkTime = () => {
                const currentTime = new Date();
                const deltaTime = currentTime.getTime() - startTime.getTime();
                if (deltaTime > downloadTimeLimit) {
                    this.loadingEnd = false;
                    clearInterval(checkTimeInterval);
                    timeoutPrompted = true;
                    // 日志文件过大，下载超时
                    this.$message.error(this.$t("devLog.downloadLogMsg1"));
                }
            };

            let api = uploadMode == 2 ? "getFtpDevLogDown" : "getDevLogDownUrl";
            // 在下载前弹出提示框
            // 日志下载中，请等待下载完成后再操作
            this.$message.info(this.$t("devLog.downloadLogMsg2"));
            if (uploadMode == 2) {
                let self = this;
                axios
                    .get(
                        process.env.BASE_API +
                            "devLog/getFtpDevLogDown" +
                            "?devLogId=" +
                            devLogId,
                        { headers: { "X-Token": this.$store.getters.token } }
                    )
                    .then(function (ret) {
                        if (ret.data.success == false) {
                            self.$message.error(ret.data.msg);
                            self.loadingEnd = false;
                        } else {
                            window.open(
                                `${ret.data.data}${self.$store.getters.token}`
                            );
                            self.loadingEnd = false;
                        }
                    })
                    .catch((err) => {});
            } else {
                this.$api[api]({ devLogId: devLogId }).then((res) => {
                    if (res.success) {
                        window.open(res.data);
                        this.loadingEnd = false;
                    } else {
                        this.$message.error(res.msg);
                        this.loadingEnd = false;
                    }
                });
            }
            // 每秒钟检查一次时间
            const checkTimeInterval = setInterval(() => {
                checkTime();
                if (!this.loadingEnd && !timeoutPrompted) {
                    timeoutPrompted = true;
                    clearInterval(checkTimeInterval);
                }
            }, 1000);
        },
        uploadLog() {
            this.timer = new Date().getTime();
            this.uploadLogVisible = true;
        },
        cancel() {
            this.uploadLogVisible = false;
        },
        getDevLogFileType() {
            this.$api.getDictByType("devLogFileType").then((res) => {
                if (res.success == true) {
                    this.logTypeList = res.data;
                    this.logTypeList.forEach((item) => {
                        this.searchForm.logTypes.push(item.sysDictCode);
                    });
                    this.checked = true;
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        setDeault() {
            let devLogCar = JSON.parse(sessionStorage.getItem("devLogItem"));
            if (devLogCar) {
                this.searchForm.deviceCode = devLogCar.deviceCode;
                this.currentWachCar = {
                    ...devLogCar,
                    deviceId: devLogCar.id,
                    html: `<span>${devLogCar.plateNum || "--"}</span>；<span>${
                        devLogCar.deviceCode || "--"
                    }</span>；<span>${
                        devLogCar.deviceSerialNum || "--"
                    }</span>；<span>${devLogCar.vin || "--"}</span>`,
                    title: `${devLogCar.plateNum || "--"}；${
                        devLogCar.deviceCode || "--"
                    }；${devLogCar.deviceSerialNum || "--"}；${
                        devLogCar.vin || "--"
                    }`,
                };
                this.logSearch();
                sessionStorage.removeItem("devLogItem");
            }
        },
    },
    beforeDestroy() {
        window.removeEventListener("resize", this.setTableHeight);
    },
};
</script>
<style lang="less" scoped>
.car-query-log {
    height: 100%;
    /deep/.top-box {
        display: flex;
        justify-content: center;
        align-items: center;
        padding-top: 24px;
        .el-select {
            width: 450px;
        }
        .el-button {
            margin-left: 12px;
        }
        .el-input__prefix {
            display: flex;
            align-items: center;
        }
    }
    .bot-box {
        padding: 0 16px;
        .search-box {
            display: flex;
            justify-content: space-between;
        }
        .right-btn {
            margin-top: 28px;
        }
        h2 {
            font-size: 16px;
            padding: 16px 0;
        }
    }
}
.el-select-dropdown__item {
    display: flex;
    align-items: center;
}
</style>
<style lang="less">
.option-high {
    color: #1890ff;
}
.upload-log-dialog {
    .el-dialog__body {
        padding: 0px !important;
    }
    .dialog-footer {
        border-top: 1px solid #ebebeb;
        display: flex;
        justify-content: flex-end;
        padding: 12px !important;
    }
}
.devLog-record-dialog {
    .el-dialog__body {
        height: calc(~"100% - 54px");
        padding: 0px !important;
    }
}
</style>
<style lang="less" scoped>
.wrap {
    padding: 0px 30px;
    .top-bottom {
        margin-bottom: 1rem;
    }
    .wrap-top {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        .flex {
            display: flex;
        }
    }
    .wrap-bottom {
        height: 4rem;
        border-top: 1px solid #e4e4e4;
    }
}
.el-table {
    .status {
        font-size: 14px;
        font-weight: 600;
        display: block;
        text-align: center;
        display: flex;
        align-items: center;
        i {
            display: block;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            margin-right: 8px;
        }
        &.status-1 > i {
            background: #52c41a;
        }
        &.status-2 > i {
            background: #faad14;
        }
        &.status-3 > i {
            background: #ff7777;
        }
    }
}
</style>
<style lang="less">
.operate-select {
    .el-select-dropdown__wrap {
        position: relative;
        overflow: hidden;
    }
    .el-scrollbar__view {
        position: relative;
        height: 274px;
        overflow: hidden;
        .option-box {
            height: 234px;
            overflow-y: auto;
        }
    }
    .copy-btn {
        width: 100%;
        background: #ffffff;
        border-top: 1px solid rgb(242, 242, 242);
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: space-around;
        position: absolute;
        top: 234px;
        .el-button {
            color: #4886ff;
        }
    }
}
</style>
