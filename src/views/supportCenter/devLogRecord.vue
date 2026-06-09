<template>
    <div class="wrap">
        <div class="wrap-top">
            <div class="m-t" :class="{ hidden: !buttonClick }" ref="wrap">
                <el-form
                    ref="form"
                    label-position="top"
                    :model="searchForm"
                    inline
                >
                    <!-- 车牌号 -->
                    <el-form-item :label="$t('common.plateNum')" prop="carId">
                        <el-select
                            :remote-method="remoteMethod"
                            :loading="loading"
                            filterable
                            style="width: 220px"
                            reserve-keyword
                            remote
                            clearable
                            collapse-tags
                            :placeholder="
                                $t('devLog.enterThreeLicensePlateNumbers')
                            "
                            v-model="searchForm.carId"
                        >
                            <el-option
                                v-for="item in searchForm.plateArr"
                                :key="item.id"
                                :value="item.id"
                                :label="item.plateNum"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <!-- 设备序列号 -->
                    <el-form-item
                        prop="deviceSerialNum"
                        :label="$t('common.deviceSerialNum')"
                    >
                        <el-input
                            v-model="searchForm.deviceSerialNum"
                            :placeholder="$t('common.input')"
                            clearable
                            @clear="clearDeviceSerialNum"
                        ></el-input>
                    </el-form-item>
                    <!-- 终端手机号 -->
                    <el-form-item
                        prop="deviceCode"
                        :label="$t('common.deviceCode')"
                    >
                        <el-input
                            v-model="searchForm.deviceCode"
                            :placeholder="$t('common.input')"
                            clearable
                            @clear="clearDeviceCode"
                        ></el-input>
                    </el-form-item>
                    <!-- 操作时间 -->
                    <el-form-item
                        :label="$t('operationLog.operationTime')"
                        prop="timeRange"
                    >
                        <el-date-picker
                            :picker-options="pickerOptions"
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
            </div>
            <div class="m-t-lg flex">
                <el-button
                    class=""
                    type="primary"
                    :disabled="searchLoading"
                    :loading="searchLoading"
                    @click="getData(true)"
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
                <el-button
                    :icon="
                        !buttonClick
                            ? 'el-icon-d-arrow-left'
                            : 'el-icon-d-arrow-right'
                    "
                    @click="handleClick"
                    v-if="iconShow"
                />
            </div>
        </div>
        <el-table
            @sort-change="sortChange"
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
            <!-- 车牌号 -->
            <el-table-column
                prop="plateNum"
                :label="$t('common.plateNum')"
                width="140px"
                fixed="left"
            ></el-table-column>
            <!-- 操作时间 -->
            <el-table-column
                sortable="custom"
                prop="operateTime"
                :label="$t('operationLog.operationTime')"
                fixed="left"
                width="200px"
            >
                <template slot-scope="scope">
                    <span>
                        {{
                            $moment(scope.row.operateTime).format(
                                "YYYY-MM-DD HH:mm:ss"
                            )
                        }}
                    </span>
                </template>
            </el-table-column>
            <!-- 上传时间 -->
            <el-table-column
                sortable="custom"
                prop="uploadTime"
                :label="$t('devLog.uploaded')"
                width="200px"
            >
                <template slot-scope="scope">
                    <span v-if="scope.row.uploadTime">
                        {{
                            $moment(scope.row.uploadTime).format(
                                "YYYY-MM-DD HH:mm:ss"
                            )
                        }}
                    </span>
                    <span v-else> -- </span>
                </template>
            </el-table-column>
            <!-- 日志类型 -->
            <el-table-column
                prop="logTypes"
                :label="$t('devLog.logType')"
                min-width="300px"
                show-overflow-tooltip
            ></el-table-column>
            <!-- 上传方式 -->
            <el-table-column
                prop="uploadMode"
                :label="$t('devLog.uploadMode')"
                width="200px"
            >
                <template slot-scope="scope">
                    <span>
                        {{
                            uploadMethodList.find(
                                (e) => e.value === scope.row.uploadMode
                            ).label
                        }}
                    </span>
                </template>
            </el-table-column>
            <!-- 所属组织 -->
            <el-table-column
                prop="organization"
                :label="$t('common.orgPath')"
                min-width="300px"
                show-overflow-tooltip
            ></el-table-column>
            <!-- 设备序列号 -->
            <el-table-column
                prop="deviceSerialNum"
                :label="$t('common.deviceSerialNum')"
                width="200px"
            ></el-table-column>
            <!-- 终端手机号 -->
            <el-table-column
                prop="deviceCode"
                :label="$t('common.deviceCode')"
                width="200px"
            >
            </el-table-column>
            <!-- 上传结果 -->
            <el-table-column
                prop="uploadResultCode"
                :label="$t('devLog.uploadResult')"
                width="200px"
                fixed="right"
                show-overflow-tooltip
            >
                <template slot-scope="scope">
                    <div>
                        <span
                            class="status status-1"
                            v-if="scope.row.uploadResultCode === 1"
                        >
                            <i></i>
                            <!-- 成功  -->
                            {{ $t("devLog.uploadResultText1") }}
                        </span>
                        <span
                            class="status status-2"
                            v-else-if="scope.row.uploadResultCode === 0"
                        >
                            <i></i>
                            <!-- 命令未下发  -->
                            {{ $t("devLog.uploadResultText0") }}
                        </span>
                        <span
                            class="status status-2"
                            v-else-if="scope.row.uploadResultCode === 2"
                        >
                            <i></i>
                            <!-- 等待上传  -->
                            {{ $t("devLog.uploadResultText2") }}
                        </span>
                        <span
                            class="status status-3"
                            v-else-if="scope.row.uploadResultCode === 3"
                        >
                            <i></i>
                            <!-- 不支持  -->
                            {{ $t("devLog.uploadResultText3") }}
                        </span>
                        <span class="status status-3" v-else>
                            <i></i>
                            <!-- 失败  -->
                            {{ $t("devLog.uploadResultText4") }}
                            <span v-if="scope.row.uploadResultName">
                                ({{ scope.row.uploadResultName }})
                            </span>
                        </span>
                    </div>
                </template>
            </el-table-column>
            <!-- 操作 -->
            <el-table-column
                fixed="right"
                :label="$t('common.operate')"
                width="120px"
            >
                <template slot-scope="scope">
                    <a
                        v-if="scope.row.uploadResultCode === 1"
                        @click="
                            downloadLog(scope.row.uploadMode, scope.row.logId)
                        "
                        :disabled="loadingEnd"
                    >
                        <!-- 下载日志 -->
                        {{ $t("devLog.downloadLogs") }}
                    </a>
                    <a
                        v-else-if="scope.row.uploadResultCode === -1"
                        @click="reUpload(scope.row)"
                    >
                        <!-- 重新上传 -->
                        {{ $t("devLog.reUpload") }}
                    </a>
                    <span v-else>--</span>
                </template>
            </el-table-column>
        </el-table>
        <div class="wrap-bottom p-x-md">
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
import enumeration from "./devLogComponent/js/enumeration";
import axios from "axios";
export default {
    name: "maintainRecord",
    components: {},
    data() {
        return {
            loading: false,
            searchLoading: false,
            searchForm: {
                carId: "",
                deviceSerialNum: "",
                deviceCode: "",
                plateNum: "",
                orderDir: "desc",
                logTypes: [],
                uploadMode: "",
                plateArr: [],
                plateJson: {},
            },
            params: {
                currentPage: 1, //页码，从1开始
                pageSize: 20, //分页大小
            },
            total: 0,
            timeRange: [],
            tableHeight: 500,
            tableData: [],
            buttonClick: false,
            iconShow: false,
            query: "",
            pickerOptions: {
                disabledDate(time) {
                    return (
                        time.getTime() >
                        new Date(new Date().toLocaleDateString()).getTime() +
                            24 * 60 * 60 * 1000 -
                            1
                    );
                },
            },
            logTypeList: [],
            uploadMethodList: [
                ...[{ label: this.$t("common.all"), value: "" }],
                ...enumeration.uploadMethodList,
            ],
            loadingEnd: false,
            checked: false,
        };
    },
    computed: {},
    watch: {
        "searchForm.carId": {
            handler(val) {
                if (!val && this.query.length < 3) {
                    this.searchForm.plateArr = [];
                }
                this.searchForm.plateNum =
                    this.searchForm.plateJson[this.searchForm.carId] || "";
            },
            deep: true,
        },
        query: {
            handler(val) {
                if (val.length < 3 && !this.searchForm.plateNum) {
                    this.searchForm.plateArr = [];
                }
            },
            deep: true,
        },
    },
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
        //对接接口的排序方法
        sortChange(column, prop, order) {
            this.searchForm.orderDir = !column.order
                ? ""
                : column.order === "ascending"
                ? "asc"
                : "desc";
            this.searchForm.orderColumn = !column.prop ? "" : column.prop;
            this.getData();
        },
        getPlateNumList(params) {
            this.loading = true;
            this.$api.getCarList(params).then((res) => {
                this.searchForm.plateArr = res.data.carList;
                if (this.searchForm.plateArr.length) {
                    res.data.carList.forEach((item) => {
                        this.searchForm.plateJson[item.id] = item.plateNum;
                    });
                }
                this.loading = false;
            });
        },
        remoteMethod(query) {
            this.query = query;
            if (query.length >= 3) {
                this.getPlateNumList({ plateNum: query });
            }
        },
        handleSizeChange(val) {
            this.params.pageSize = val;
            this.getData();
        },
        handleCurrentChange(val) {
            this.params.currentPage = val;
            this.getData();
        },
        // 重置表单
        handleReset(ref) {
            this.timeRange = [];
            this.$refs["form"].resetFields();
            this.checked = false;
            this.$forceUpdate();
            this.$nextTick(() => {
                this.$forceUpdate();
            });
            // this.$store.dispatch("SetCondtion", this.searchForm);
        },
        //查询
        getData(isSetCondtion) {
            this.searchLoading = true;
            let params = {};
            if (this.timeRange && this.timeRange.length > 0) {
                params.operateBeginTime = TimeUtil.getDateTime(
                    this.timeRange[0]
                );
                params.operateEndTime = TimeUtil.getDateTime(this.timeRange[1]);
            } else {
                params.operateBeginTime = "";
                params.operateEndTime = "";
            }
            this.$store.dispatch("SetTime", this.timeRange);
            let carParam = Object.assign(params, this.searchForm, this.params);
            delete carParam.carId;
            delete carParam.plateArr;
            delete carParam.plateJson;
            this.$api
                .getDevLogTaskPage(carParam)
                .then((res) => {
                    if (res.success == true) {
                        if (isSetCondtion) {
                            this.$store.dispatch("SetCondtion", {
                                ...this.searchForm,
                            });
                        }
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
                    this.$api.eventTrackTrigger({
                        menu: "DEVDEVICE_LOG",
                        business: "DEVICE_LOG_SECRET_KEY_TOUCH",
                        eventResult: res.success,
                    });
                })
                .catch((err) => {
                    this.searchLoading = false;
                });
        },
        //查询重叠
        handleClick() {
            this.buttonClick = !this.buttonClick;
            this.setTableHeight();
        },
        setTableHeight() {
            this.tableHeight = this.buttonClick
                ? document.body.clientHeight - 399
                : document.body.clientHeight - 321;
        },
        setWrap() {
            if (this.$refs.wrap.scrollHeight > 86) {
                this.iconShow = true;
            } else {
                this.iconShow = false;
                this.buttonClick = false;
            }
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
                        console.log(ret);
                        if (ret.data.success == false) {
                            self.$message.error(ret.data.msg);
                            self.loadingEnd = false;
                            resetDownloadTimeLimit();
                        } else {
                            window.open(
                                `${ret.data.data}${self.$store.getters.token}`
                            );
                            self.loadingEnd = false;
                            this.$api.eventTrackTrigger({
                                menu: "DEVDEVICE_LOG",
                                business: "DEVICE_LOG_DOWNLOAD_LOG",
                                eventResult: res.success,
                            });
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            } else {
                this.$api[api]({ devLogId: devLogId }).then((res) => {
                    if (res.success) {
                        window.open(res.data);
                        this.loadingEnd = false;
                    } else {
                        this.$message.error(res.msg);
                        this.loadingEnd = false;
                    }
                    this.$api.eventTrackTrigger({
                        menu: "DEVDEVICE_LOG",
                        business: "DEVICE_LOG_DOWNLOAD_LOG",
                        eventResult: res.success,
                    });
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
        reUpload(data) {
            this.$api
                .reUpload({ taskId: data.taskId, deviceCode: data.deviceCode })
                .then((res) => {
                    if (res.success == true) {
                        // 上传成功
                        this.$message.success(this.$t("common.uploadSuccess"));
                        this.getData(true);
                        console.log(res);
                    } else {
                        this.$message.error(res.msg);
                    }
                });
        },
        clearDeviceSerialNum() {
            this.$set(this.searchForm, "deviceSerialNum", "");
            this.$forceUpdate();
        },
        clearDeviceCode() {
            this.$set(this.searchForm, "deviceCode", "");
            this.$forceUpdate();
        },
    },
    mounted() {
        this.getDevLogFileType();
        this.setWrap();
        this.getData(true);
        const that = this;
        window.onresize = () =>
            (() => {
                that.setWrap();
                that.setTableHeight();
            })();
    },
    created() {
        this.setTableHeight();
    },
};
</script>
<style lang="less">
.operate-select {
    .el-select-dropdown__wrap {
        position: relative;
        overflow: hidden;
    }
    .el-scrollbar__view {
        position: relative;
        height: 204px;
        overflow: hidden;
        .option-box {
            height: 164px;
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
        top: 164px;
        .el-button {
            color: #4886ff;
        }
    }
}
</style>
<style lang="less" scoped>
.wrap {
    padding: 0px 12px;
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
    .hidden {
        height: 86px;
        overflow: hidden;
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
        &.status-3 > span {
            width: 135px;
        }
    }
}
</style>
