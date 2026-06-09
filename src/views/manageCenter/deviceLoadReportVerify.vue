<template>
    <div class="deviceLoadTask-manage wrap">
        <div ref="searchBox" class="search-module">
            <div
                class="search-form-content"
                :class="{ hidden: !buttonClick }"
                ref="wrap"
            >
                <el-form ref="searchForm" :model="searchForm" inline>
                    <el-form-item
                        :label="$t('common.keywords')"
                        prop="deviceCode"
                    >
                        <G-DeviceSearch
                            :valueKey="'deviceCode'"
                            :value.sync="searchForm.deviceCode"
                            :organizeId="params.organizeId"
                        ></G-DeviceSearch>
                    </el-form-item>
                    <!-- 报告提交时间 -->
                    <el-form-item
                        prop="deviceCode"
                        :label="
                            $t('deviceLoadReportVerify.reportSubmissionTime')
                        "
                    >
                        <el-date-picker
                            size="small"
                            v-model="timeRange"
                            type="datetimerange"
                            transfer
                            clearable
                            :start-placeholder="$t('common.startTime')"
                            :end-placeholder="$t('common.endTime')"
                            format="yyyy-MM-dd HH:mm:ss"
                            :default-time="['00:00:00', '23:59:59']"
                        ></el-date-picker>
                    </el-form-item>
                    <!-- 所属组织 -->
                    <el-form-item
                        :label="$t('common.orgPath')"
                        prop="organizeId"
                    >
                        <TreeSelect
                            :placeholder="$t('common.select')"
                            :treeData="treeData"
                            style="width: 250px"
                            filter
                            v-model="searchForm.organizeId"
                            :props="defaultProps"
                        >
                        </TreeSelect>
                    </el-form-item>
                </el-form>
            </div>
            <div style="width: 384px">
                <el-button
                    style="float: right; margin-left: 10px"
                    :icon="
                        !buttonClick
                            ? 'el-icon-d-arrow-left'
                            : 'el-icon-d-arrow-right'
                    "
                    @click="handleClick"
                    v-if="iconShow"
                ></el-button>
                <el-button
                    style="float: right; margin-left: 10px"
                    type="default"
                    @click="handleReset($refs.searchForm)"
                >
                    <!-- 清除条件 -->
                    {{ $t("common.reset") }}
                </el-button>
                <el-button
                    style="float: right; margin-left: 0px"
                    :loading="searchLoading"
                    :disabled="searchLoading"
                    type="primary"
                    @click="
                        params.currentPage = 1;
                        search();
                    "
                >
                    <!-- 查询 -->
                    {{ $t("common.search") }}
                </el-button>
            </div>
        </div>
        <div class="m-b p-x" style="height: 32px">
            <el-button
                type="primary"
                class="goExport"
                @click="batchSendActiveCode()"
            >
                <!-- 批量失败重发激活码 -->
                {{ $t("deviceLoadReportVerify.batchIssueActivationCode") }}
            </el-button>
            <el-radio-group
                style="float: right"
                v-model="searchForm.reportStatus"
                @change="
                    params.currentPage = 1;
                    search();
                "
            >
                <el-radio-button
                    v-for="item in reportStatusList"
                    :key="item.value"
                    :label="item.value"
                    >{{ item.label }}</el-radio-button
                >
            </el-radio-group>
        </div>
        <!-- //列表区域 -->
        <div class="p-x">
            <el-table
                v-loading="searchLoading"
                :element-loading-text="$t('common.desperatelyLoading')"
                element-loading-color="#007213"
                :data="listData"
                ref="table"
                border
                stripe
                :height="tableHeight"
            >
                <!-- 装车任务 -->
                <el-table-column
                    prop="taskName"
                    :label="$t('deviceLoadReportVerify.loadingTask')"
                    width="120px"
                    fixed="left"
                >
                </el-table-column>
                <!-- 车牌号 -->
                <el-table-column
                    prop="plateNum"
                    :label="$t('common.plateNum')"
                    width="100px"
                ></el-table-column>
                <!-- 所属组织 -->
                <el-table-column
                    prop="orgName"
                    :label="$t('common.orgPath')"
                    width="240px"
                    show-overflow-tooltip
                >
                </el-table-column>
                <!-- 设备序列号 -->
                <el-table-column
                    prop="deviceSerialNum"
                    :label="$t('common.deviceSerialNum')"
                    width="120px"
                ></el-table-column>
                <!-- 终端手机号 -->
                <el-table-column
                    prop="deviceCode"
                    :label="$t('common.deviceCode')"
                    width="120px"
                >
                </el-table-column>
                <!-- 设备型号 -->
                <el-table-column
                    prop="deviceModelCode"
                    :label="$t('common.deviceModelCode')"
                    width="160px"
                >
                </el-table-column>
                <!-- 接入协议 -->
                <el-table-column
                    prop="protocolName"
                    :label="$t('common.protocolName')"
                    width="100px"
                >
                </el-table-column>
                <!-- 报告提交时间 -->
                <el-table-column
                    prop="createTime"
                    :label="$t('deviceLoadReportVerify.reportSubmissionTime')"
                    width="150px"
                >
                </el-table-column>
                <!-- 报告提交人 -->
                <el-table-column
                    prop="creator"
                    :label="$t('deviceLoadReportVerify.reportSubmitter')"
                    width="100px"
                >
                </el-table-column>
                <!-- 审核人 -->
                <el-table-column
                    prop="checkUserName"
                    :label="$t('deviceLoadReportVerify.checkUserName')"
                    width="100px"
                >
                </el-table-column>
                <!-- 操作时间 -->
                <el-table-column
                    prop="checkTime"
                    :label="$t('deviceLoadReportVerify.checkTime')"
                    width="150px"
                >
                </el-table-column>
                <!-- 报告状态 -->
                <el-table-column
                    prop="reportStatus"
                    :label="$t('deviceLoadReportVerify.reportStatus')"
                    min-width="120px"
                    fixed="right"
                >
                    <template slot-scope="scope">
                        <div>
                            <span
                                :class="
                                    configStatusList[scope.row.reportStatus] &&
                                    configStatusList[scope.row.reportStatus]
                                        .color
                                "
                                >●</span
                            >
                            {{
                                configStatusList[scope.row.reportStatus] &&
                                configStatusList[scope.row.reportStatus].name
                            }}
                        </div>
                    </template>
                </el-table-column>
                <!-- 失败原因 -->
                <el-table-column
                    prop="activeCodeErrorMessage"
                    :label="$t('deviceLoadReportVerify.activeCodeErrorMessage')"
                    width="120px"
                    fixed="right"
                    show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                    :label="$t('common.operate')"
                    width="180px"
                    fixed="right"
                >
                    <template slot-scope="scope">
                        <div class="text-nowrap">
                            <el-button
                                type="text"
                                class="text-info"
                                @click="goDetail(scope.row.id, 'check')"
                                v-if="scope.row.reportStatus === 0"
                                v-btn="'deviceLoadReportVerifyProcess'"
                            >
                                <!-- 审核 -->
                                {{ $t("deviceLoadReportVerify.examine") }}
                            </el-button>
                            <el-button
                                type="text"
                                class="text-info"
                                @click="goDetail(scope.row.id, 'detail')"
                                v-if="
                                    scope.row.reportStatus === 2 ||
                                    scope.row.reportStatus === 3
                                "
                            >
                                <!-- 详情 -->
                                {{ $t("common.detail") }}
                            </el-button>
                            <el-button
                                type="text"
                                class="text-info"
                                @click="goDetail(scope.row.id, 'deal')"
                                v-if="scope.row.reportStatus === 5"
                            >
                                <!-- 处理 -->
                                {{ $t("deviceLoadReportVerify.deal") }}
                            </el-button>
                            <el-button
                                type="text"
                                class="text-info"
                                @click="
                                    sendActiveCode(
                                        scope.row.deviceCode,
                                        scope.row.id
                                    )
                                "
                                v-if="
                                    scope.row.reportStatus !== 0 &&
                                    scope.row.activeCodeStatus === 1
                                "
                            >
                                <!-- 下发激活码 -->
                                {{
                                    $t(
                                        "deviceLoadReportVerify.issueActivationCode"
                                    )
                                }}
                            </el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="p-x m-t wrap-bottom">
            <el-pagination
                @size-change="PageSizeChange"
                @current-change="pageChange"
                :current-page="params.currentPage"
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
import TreeSelect from "@/components/hui-pro/tree-select/src/tree-select.vue";
import "@/components/hui-pro/tree-select/theme/index.scss";
import TimeUtil from "@/utils/time";
export default {
    name: "deviceLoadTaskManage",
    components: {
        TreeSelect,
    },
    data() {
        return {
            configStatusList: {
                0: {
                    name: this.$t("deviceLoadReportVerify.reportStatusText1"), //"待审核",
                    color: "text-warning",
                },
                2: {
                    name: this.$t("deviceLoadReportVerify.reportStatusText2"), //"审核通过",
                    color: "text-success",
                },
                3: {
                    name: this.$t("deviceLoadReportVerify.reportStatusText3"), // "审核不通过",
                    color: "text-error",
                },
                5: {
                    name: this.$t("deviceLoadReportVerify.reportStatusText4"), // "无需审核",
                    color: "text-gary",
                },
            },
            defaultProps: {
                children: "children",
                label: "name",
            },
            treeData: [],
            searchLoading: true,
            tableHeight: 500,
            timeRange: [],
            searchForm: {
                // 搜索表单
                plateNum: "",
                deviceSerialNum: "",
                deviceCode: "",
                reportStatus: "",
                startTime: "",
                endTime: "",
                organizeId: "",
                plateArr: [],
                carId: "",
            },
            pageSizeCar: 20, //车牌分页数量
            currentPageCar: 1, //车牌页码
            params: {
                currentPage: 1, // 页码，从1开始
                pageSize: 20, // 分页大小
            },
            listData: [], // @:data
            total: 0, // 数据总数
            buttonClick: false,
            iconShow: false,
            reportStatusList: [
                {
                    // label: "全部",
                    label: this.$t("common.all"),
                    value: "",
                },
                {
                    // label: "待审核",
                    label: this.$t("deviceLoadReportVerify.reportStatusText1"),
                    value: 0,
                },
                {
                    // label: "审核通过",
                    label: this.$t("deviceLoadReportVerify.reportStatusText2"),
                    value: 2,
                },
                {
                    // label: "审核不通过",
                    label: this.$t("deviceLoadReportVerify.reportStatusText3"),
                    value: 3,
                },
                {
                    // label: "无需审核",
                    label: this.$t("deviceLoadReportVerify.reportStatusText4"),
                    value: 5,
                },
            ],
        };
    },
    watch: {
        params: {
            handler(val) {
                const params = Object.assign({}, val, this.searchForm);
                this.getData(params);
            },
            deep: true,
        },
        timeRange: {
            handler(val) {
                if (val && val.length > 0) {
                    this.searchForm.startTime = TimeUtil.getDateTime(
                        this.timeRange[0]
                    );
                    this.searchForm.endTime = TimeUtil.getDateTime(
                        this.timeRange[1]
                    );
                } else {
                    this.searchForm.startTime = "";
                    this.searchForm.endTime = "";
                }
            },
            deep: true,
            immediate: true,
        },
        "searchForm.carId": {
            handler(val) {
                if (!val && this.query.length < 3) {
                    this.searchForm.plateArr = [];
                }
            },
            deep: true,
        },
    },
    methods: {
        handleClick() {
            this.buttonClick = !this.buttonClick;
            this.setTableHeight();
        },
        search() {
            if (this.params.currentPage == 1) {
                const params = Object.assign(this.params, this.searchForm);
                delete params.plateArr;
                this.getData(params);
            } else {
                this.params.currentPage = 1;
            }
        },
        getOrgTree() {
            this.$api.getOrgTree().then((res) => {
                if (res.success == true) {
                    this.treeData = res.data;
                    this.$nextTick(() => {
                        // this.searchForm = this.$store.state.tree.searchForm ? this.$store.state.tree.searchForm : this.searchForm;
                        // this.timeRange = this.$store.state.tree.time ? this.$store.state.tree.time : [new Date(new Date()-7*24*60*60*1000),new Date()]
                        this.search();
                    });
                }
            });
        },
        getData(params) {
            this.searchLoading = true;
            this.$api
                .getDeviceLoadReportPage(params)
                .then((res) => {
                    if (res.success == true) {
                        this.listData =
                            (res.data.results.length &&
                                res.data.totalRecords) ||
                            (!res.data.results.length && !res.data.totalRecords)
                                ? res.data.results
                                : this.listData;
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
        pageChange(page) {
            this.params.currentPage = page;
        },
        PageSizeChange(limit) {
            this.params.currentPage = 1;
            this.params.pageSize = limit;
        },
        handleReset(ref) {
            if (ref !== undefined) {
                ref.resetFields();
                this.timeRange = [];
            }
        },
        goDetail(reportId, type) {
            this.$router.push({
                path: "/manageCenter/deviceLoadReportVerify/deviceLoadReportVerifyDetail",
                query: {
                    type,
                    reportId,
                },
            });
        },

        sendActiveCode(deviceCode, reportId) {
            this.$api.sendActiveCode({ deviceCode, reportId }).then((res) => {
                if (res.success == true) {
                    // 下发激活码成功！
                    this.$message.success(
                        this.$t("deviceLoadReportVerify.issueActivationCode") +
                            this.$t("common.success")
                    );
                    this.search();
                } else {
                    this.$message.error(res.msg);
                }
                this.searchLoading = false;
            });
        },
        setTableHeight() {
            this.tableHeight = document.body.clientHeight - 260;
            this.tableHeight = this.buttonClick
                ? document.body.clientHeight - 255 - 46
                : document.body.clientHeight - 209 - 46;
        },
        setWrap() {
            let scrollHeight = this.$refs.wrap.scrollHeight;
            if (this.$refs.wrap.scrollHeight > 74) {
                this.iconShow = true;
            } else {
                this.iconShow = false;
            }
        },
        //  下拉加载更多
        selectLoadMore() {
            this.currentPageCar += 1;
            if (this.currentPageCar > this.totalPagesCar) return;
            this.getPlateNumList({ plateNum: this.query }); // 请求接口
        },
        //下拉框收取
        visibleHandler() {
            this.currentPageCar = 1;
            this.totalPagesCar = "";
        },
        //获取车牌号下拉信息
        getPlateNumList(jsonData) {
            let param = {
                orgId: this.params.organizeId,
                pageSize: this.pageSizeCar,
                currentPage: this.currentPageCar,
            };
            let params = Object.assign({}, param, jsonData);
            this.$api.carDropDown(params).then((res) => {
                if (res.success == true) {
                    this.totalPagesCar = res.data.totalPages;
                    let temp =
                        (res.data.results.length && res.data.totalRecords) ||
                        (!res.data.results.length && !res.data.totalRecords)
                            ? res.data.results
                            : temp;
                    this.searchForm.plateArr = (
                        this.currentPageCar === 1
                            ? []
                            : this.searchForm.plateArr
                    ).concat(temp);
                    if (res.data.length < 20) {
                        this.haveDataCar = false;
                    }
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        //远程搜索
        remoteMethod(query) {
            this.currentPageCar = 1;
            this.query = query;
            this.haveDataCar = true;
            if (query.length >= 3) {
                this.getPlateNumList({ plateNum: query });
            }
        },
        batchSendActiveCode() {
            // `此操作将会批量失败重发激活码，是否确认?`,
            this.$confirm(
                this.$t("deviceLoadReportVerify.batchSendActiveCode"),
                this.$t("common.prompt"),
                {
                    confirmButtonText: this.$t("common.ok"),
                    cancelButtonText: this.$t("common.cancel"),
                    type: "warning",
                }
            )
                .then(() => {
                    this.$api.batchSendActiveCode().then((res) => {
                        if (res.success == true) {
                            // 下发成功！
                            this.$message.success(
                                this.$t("common.issued") +
                                    this.$t("common.success")
                            );
                        } else {
                            this.$message.error(res.msg);
                        }
                    });
                })
                .catch(() => {});
        },
    },
    mounted() {
        this.setWrap();
        const that = this;
        window.onresize = () =>
            (() => {
                that.setTableHeight();
                this.setWrap();
            })();
    },
    created() {
        this.setTableHeight();
        this.search();
        this.getOrgTree();
    },
};
</script>
<style lang="less" scoped>
.text-gary {
    color: #909399;
}
.loading_ {
    pointer-events: none;
}
.deviceLoadTask-manage {
    height: 100%;
    .wrap-top {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        .flex {
            display: flex;
        }
        .el-form-item {
            margin-bottom: 12px !important;
        }
    }
    .wrap-bottom {
        width: 100%;
        border-top: 1px solid #e4e4e4;
    }
    .hidden {
        height: 46px;
        overflow: hidden;
    }
}
div /deep/ .el-card__body {
    padding: 0 !important;
}
.save-info-dialog {
    width: 1100px;
    margin: 0 auto;
    /deep/ .el-dialog__body {
        color: #4d4d4d;
        padding: 16px 24px;
        .info-content {
            display: flex;
            .info-content-left {
                flex: 1;
            }
            .info-content-right {
                width: 130px;
                display: flex;
                align-items: center;
                flex-direction: column;
                img {
                    width: 130px;
                    height: 130px;
                }
            }
        }
        .info-manage {
            display: flex;
            justify-content: center;
        }
    }
}
</style>
