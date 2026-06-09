<template>
    <div class="wrap">
        <div ref="searchBox" class="search-module">
            <div
                class="search-form-content"
                :class="{ hidden: !buttonClick }"
                ref="wrap"
            >
                <el-form :model="searchForm" inline ref="searchForm">
                    <!-- 组织 -->
                    <el-form-item
                        :label="$t('common.orgPath')"
                        prop="organizeId"
                    >
                        <TreeSelect
                            :placeholder="$t('common.select')"
                            :treeData="treeData"
                            style="width: 244px"
                            filter
                            v-model="searchForm.organizeId"
                            :props="defaultProps"
                        >
                        </TreeSelect>
                    </el-form-item>
                    <el-form-item
                        :label="$t('common.keywords')"
                        prop="deviceCode"
                    >
                        <G-DeviceSearch
                            :valueKey="'deviceCode'"
                            :value.sync="searchForm.deviceCode"
                            :selectObj.sync="searchForm.selectObj"
                            :organizeId="searchForm.organizeId"
                        ></G-DeviceSearch>
                    </el-form-item>
                    <!-- 处理状态 -->
                    <el-form-item
                        prop="deviceStatusList"
                        :label="$t('anomalyDetails.processingStatus')"
                    >
                        <el-select
                            v-model="searchForm.status"
                            :placeholder="$t('common.select')"
                            clearable
                        >
                            <!-- 待维护 -->
                            <el-option
                                :label="$t('maintainRecord.toBeMaintained')"
                                :value="0"
                            ></el-option>
                            <!-- 已维护 -->
                            <el-option
                                :label="$t('maintainRecord.maintained')"
                                :value="1"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <!-- 故障类型 -->
                    <el-form-item
                        prop="faultTypes"
                        :label="$t('deviceHealthCondition.faultType')"
                    >
                        <TreeSelect
                            :placeholder="$t('common.select')"
                            style="width: 300px"
                            :treeData="allFaultType"
                            show-checkbox
                            filter
                            collapse-tags
                            check-model="child"
                            v-model="searchForm.faultTypes"
                        >
                        </TreeSelect>
                    </el-form-item>
                    <!-- 故障开始时间段 -->
                    <el-form-item
                        prop="deviceCode"
                        :label="$t('handleFault.faultStartTimePeriod')"
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
                </el-form>
            </div>
            <div ref="searchBtn" class="search-btn">
                <el-button
                    type="primary"
                    :loading="searchLoading"
                    @click="
                        params.currentPage = 1;
                        search();
                    "
                >
                    <!-- 查询 -->
                    {{ $t("common.search") }}
                </el-button>
                <el-button type="default" @click="handleReset('searchForm')">
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
        <div class="wrap-top p-x" ref="searchBtn">
            <el-button
                @click="goExport"
                :disabled="loadingAll"
                :loading="loadingAll"
                v-btn="'faultAccountExport'"
            >
                <!-- 导出 -->
                {{ $t("common.export") }}
            </el-button>
        </div>
        <div class="m-x p-y">
            <el-table
                id="clickTable"
                border
                stripe
                v-loading="searchLoading"
                :element-loading-text="$t('common.desperatelyLoading')"
                element-loading-color="#007213"
                :data="tableData"
                :height="tableHeight"
                label-width="auto"
                @sort-change="handleSortChange"
            >
                <!-- 处理状态 -->
                <el-table-column
                    prop="plateNum"
                    :label="$t('anomalyDetails.processingStatus')"
                    fixed
                    min-width="80px"
                >
                    <template slot-scope="scope">
                        <div v-if="scope.row.status == 0">
                            <span class="noDo">●</span>&nbsp;
                            <!-- 待维护 -->
                            {{ $t("maintainRecord.toBeMaintained") }}
                        </div>
                        <div v-else-if="scope.row.status == 1">
                            <span class="done">●</span>&nbsp;
                            <!-- 已维护 -->
                            {{ $t("maintainRecord.maintained") }}
                        </div>
                        <div v-else>
                            <span class="doing">●</span>&nbsp;
                            <!-- 维护中 -->
                            {{ $t("maintainRecord.underMaintained") }}
                        </div>
                    </template>
                </el-table-column>
                <!-- 故障类型 -->
                <el-table-column
                    fixed
                    prop="faultTypeString"
                    :label="$t('deviceHealthCondition.faultType')"
                    min-width="80px"
                    key="faultTypeString"
                ></el-table-column>
                <!-- 车牌号 -->
                <el-table-column
                    fixed
                    prop="plateNum"
                    :label="$t('common.plateNum')"
                    min-width="80px"
                    key="plateNum"
                ></el-table-column>
                <!-- 所属组织 -->
                <el-table-column
                    prop="orgName"
                    :label="$t('common.orgPath')"
                    min-width="80px"
                    column-key="orgName"
                    show-overflow-tooltip
                ></el-table-column>
                <!-- 设备序列号 -->
                <el-table-column
                    prop="serialNum"
                    :label="$t('common.deviceSerialNum')"
                    min-width="80px"
                    column-key="orgName"
                ></el-table-column>
                <!-- 终端手机号 -->
                <el-table-column
                    prop="deviceCode"
                    :label="$t('common.deviceCode')"
                    min-width="80px"
                    column-key="deviceCode"
                ></el-table-column>
                <!-- 设备型号 -->
                <el-table-column
                    prop="modelName"
                    :label="$t('common.deviceModelCode')"
                    min-width="80px"
                    column-key="modelName"
                    show-overflow-tooltip
                ></el-table-column>
                <!-- 故障开始时间 -->
                <el-table-column
                    prop="collectTime"
                    :label="$t('maintainRecord.faultStartTime')"
                    min-width="120px"
                    column-key="startTime"
                ></el-table-column>
                <!-- 故障结束时间 -->
                <el-table-column
                    prop="endTime"
                    :label="$t('maintainRecord.faultEndTime')"
                    min-width="120px"
                    column-key="endTime"
                ></el-table-column>
                <!-- 故障可能原因 -->
                <el-table-column
                    prop="faultReason"
                    :label="$t('handleFault.faultReason')"
                    min-width="120px"
                    column-key="faultReason"
                    show-overflow-tooltip
                ></el-table-column>
                <!-- 解决建议 -->
                <el-table-column
                    prop="faultSolution"
                    :label="$t('handleFault.faultSolution')"
                    min-width="120px"
                    column-key="faultSolution"
                    show-overflow-tooltip
                ></el-table-column>
                <!-- 故障位置 -->
                <el-table-column
                    column-key="location"
                    prop="location"
                    :label="$t('faultAccount.faultLocation')"
                    min-width="240px"
                    show-overflow-tooltip
                ></el-table-column>
                <!-- <el-table-column sortable prop="faultReason" label="处理时间" min-width="120px" column-key="faultReason"></el-table-column> -->
                <!-- <el-table-column prop="maintainer" label="维护人员" min-width="120px" column-key="maintainer"></el-table-column> -->
                <!-- 操作 -->
                <el-table-column
                    prop="action"
                    :label="$t('common.operate')"
                    width="240px"
                    fixed="right"
                >
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            @click="goVideoPlayback(scope.row)"
                            v-btn="'faultAccountReplayTheater'"
                        >
                            <!-- 录像回放 -->
                            {{ $t("faultAccount.videoPlayback") }}
                        </el-button>
                        <el-button
                            type="text"
                            @click="goHistoryPlayback(scope.row)"
                            v-btn="'faultAccountTrackReplay'"
                        >
                            <!-- 轨迹回放 -->
                            {{ $t("faultAccount.historyPlayback") }}
                        </el-button>
                        <el-button
                            type="text"
                            @click="goLivePreview(scope.row)"
                            v-btn="'faultAccountPreview'"
                        >
                            <!-- 实时预览 -->
                            {{ $t("faultAccount.livePreview") }}
                        </el-button>
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
import TreeSelect from "@/components/hui-pro/tree-select/src/tree-select.vue";
import "@/components/hui-pro/tree-select/theme/index.scss";
import TimeUtil from "@/utils/time";
import timeCom from "@/components/timeCom";
import AttendenceRecord from "@/components/AttendenceRecord";
require("@/assets/style/base.scss");
export default {
    name: "faultAccount",
    components: { TimeUtil, timeCom, AttendenceRecord, TreeSelect },
    data() {
        return {
            defaultProps: {
                children: "children",
                label: "name",
            },
            loading: false,
            loadingAll: false,
            tableData: [],
            searchForm: {
                // 搜索表单
                treeLevel: this.$route.query.treeLevel || "",
                organizeId: "",
                plateNums: this.$route.query.plateNum
                    ? [this.$route.query.plateNum]
                    : [],
                //plateNum:,
                deviceCode: "",
                status: "", //0为解决，1已解决
                faultTypes: [],
                startTime: "",
                endTime: "",
                selectObj: {},
            },
            allFaultType: [],
            searchLoading: false,
            timeRange: "",
            params: {
                currentPage: 1, //页码，从1开始
                pageSize: 20, //分页大小
                // orderColumn: 'deviceSerialNum', //排序列
                // orderDir: 'asc',   //排序方向
            },
            plateArr: [],
            query: "",
            treeData: [],
            deviceModelList: [],
            faultTypeArr: [],
            treeArr: [],
            tableHeight: 500,
            total: 0,
            pickerOptions2: {
                disabledDate(time) {
                    // 禁用以后的时间
                    return time.getTime() > Date.now();
                },
            },
            buttonClick: false,
            iconShow: false,
        };
    },
    watch: {
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
        "searchForm.plateNums": {
            handler(val) {
                if (!val.length && this.query.length < 3) {
                    this.plateArr = [];
                }
            },
            deep: true,
        },
        query: {
            handler(val) {
                if (val.length < 3 && !this.searchForm.plateNums.length) {
                    this.plateArr = [];
                }
            },
            deep: true,
        },
    },
    methods: {
        handleClick() {
            this.buttonClick = !this.buttonClick;
            this.$nextTick(() => {
                this.setTableHeight();
            });
        },
        //排序
        handleSortChange(column, prop, order) {
            this.params.orderDir = !column.order
                ? ""
                : column.order == "ascending"
                ? "asc"
                : "desc";
            this.params.orderColumn = !column.prop ? "" : column.prop;
            this.search();
        },
        getPlateNumList(params) {
            this.$api.getCarList(params).then((res) => {
                this.plateArr = res.data.carList;
            });
        },
        remoteMethod(query) {
            this.query = query;
            if (query.length >= 3) {
                this.getPlateNumList({ plateNum: query });
            }
        },
        //获取待处理故障类型
        getAllFaultType() {
            this.$api.getAllFaultType().then((res) => {
                if (res.success == true) {
                    let allFaultType = res.data;
                    allFaultType.map((i) => {
                        let flag = true;
                        let indexCurrent;
                        this.allFaultType.forEach((item, index) => {
                            if (i.faultGroup == -item.id) {
                                flag = false;
                                indexCurrent = index;
                            }
                        });
                        if (flag) {
                            let obj = {};
                            obj.id = -i.faultGroup;
                            obj.label = i.faultGroupDesc;
                            obj.children = [];
                            obj.children.push({
                                id: i.faultType,
                                label: i.faultName,
                            });
                            this.allFaultType.push(obj);
                        } else {
                            this.allFaultType[indexCurrent].children.push({
                                id: i.faultType,
                                label: i.faultName,
                            });
                        }
                    });
                    this.$nextTick(() => {
                        this.searchForm.faultTypes = this.$route.query
                            .faultTypes
                            ? [this.$route.query.faultTypes]
                            : [];
                        this.search();
                    });
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        search() {
            this.searchLoading = true;
            let params = Object.assign({}, this.params, this.searchForm);
            this.$api.faultRecordPage(params).then((res) => {
                if (res.success) {
                    this.tableData =
                        (res.data.results.length && res.data.totalRecords) ||
                        (!res.data.results.length && !res.data.totalRecords)
                            ? res.data.results
                            : this.tableData;
                    this.total = res.data.totalRecords;
                    this.searchLoading =
                        res.data.results.length == 0 &&
                        res.data.totalRecords != 0
                            ? true
                            : false;
                    this.$nextTick(() => {
                        this.setTableHeight();
                    });
                } else {
                    this.$message.error(res.msg);
                    this.searchLoading = false;
                }
                this.$nextTick(() => {
                    this.setTableHeight();
                });
            });
        },
        goExport() {
            //导出
            if (this.total > 50000) {
                this.$message.error(this.$t("common.unableEport50000"));
            } else {
                this.loadingAll = true;
                let params = Object.assign({}, this.searchForm);
                this.$api.doExportFaultRecord(params).then((res) => {
                    if (res.success == true) {
                        var fileName = res.data.fileName;
                        let _this = this;
                        _this.getExportResultInterval = window.setInterval(
                            function () {
                                _this.$api
                                    .isExportFinished(fileName)
                                    .then((res1) => {
                                        if (
                                            res1.success == true &&
                                            res1.data == true
                                        ) {
                                            var iframe =
                                                document.createElement(
                                                    "iframe"
                                                );
                                            iframe.src =
                                                (process.env.BASE_API == "/"
                                                    ? ""
                                                    : process.env.BASE_API) +
                                                "/excel?fileName=" +
                                                fileName;
                                            iframe.style.display = "none";
                                            document.body.appendChild(iframe);
                                            window.clearInterval(
                                                _this.getExportResultInterval
                                            );
                                            _this.getExportResultInterval = "";
                                            _this.loadingAll = false;
                                        }
                                    });
                            },
                            2000
                        );
                    } else {
                        this.$message.error(
                            this.$t("common.exportFailed") + ":" + res.msg
                        );
                        this.loadingAll = false;
                    }
                });
            }
        },
        setTableHeight() {
            this.tableHeight =
                document.body.clientHeight -
                this.$refs.searchBox.clientHeight -
                this.$refs.searchBtn.clientHeight -
                this.$refs.searchPagination.clientHeight -
                111;
        },
        setWrap() {
            let scrollHeight = this.$refs.wrap.scrollHeight;
            if (this.$refs.wrap.scrollHeight > 46) {
                this.iconShow = true;
            } else {
                this.iconShow = false;
            }
        },
        getFaultTypeArr() {
            this.$api.getDictByType("faultType").then((res) => {
                if (res.success == true) {
                    this.faultTypeArr = res.data;
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        handleReset(name) {
            this.timeRange = [
                new Date(new Date() - 9 * 24 * 60 * 60 * 1000),
                new Date(),
            ];
            this.$refs[name].resetFields();
            this.searchForm.status = "";
            this.searchForm.faultTypes = this.$route.query.faultTypes
                ? [this.$route.query.faultTypes]
                : [];
            this.searchForm.plateNums = this.$route.query.plateNum
                ? [this.$route.query.plateNum]
                : [];
        },
        getDeviceModelList() {
            this.$api.getDeviceModelList_DeviceParamTask().then((res) => {
                if (res.success == true) {
                    this.deviceModelList = res.data;
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        getOrgTree() {
            this.$api.getOrgTree().then((res) => {
                if (res.success == true) {
                    this.treeData = res.data;
                    this.treeDataToArr(res.data);
                }
            });
        },
        treeDataToArr(val, type) {
            if (type) {
                this.treeArr = [];
            }
            val.forEach((item) => {
                this.treeArr.push({
                    id: item.id,
                    name: item.name,
                });
                if (item.children.length > 0) {
                    this.treeDataToArr(item.children, "");
                }
            });
        },
        handleSizeChange(val) {
            this.params.currentPage = 1;
            this.params.pageSize = val;
            this.search();
        },
        handleCurrentChange(val) {
            this.params.currentPage = val;
            this.search();
        },
        goVideoPlayback(data) {
            sessionStorage.setItem("videoItem", JSON.stringify(data));
            let { href } = this.$router.resolve({
                path: "/maintenanceCenter/videoPlayback",
            });
            window.open(href, "_blank");
            // this.$router.push({ path: "/maintenanceCenter/videoPlayback" });
        },
        goHistoryPlayback(data) {
            sessionStorage.setItem("historyItem", JSON.stringify(data));
            let { href } = this.$router.resolve({
                path: "/maintenanceCenter/historyPlayback",
            });
            window.open(href, "_blank");
            // this.$router.push({ path: "/maintenanceCenter/historyPlayback" });
        },
        goLivePreview(data) {
            sessionStorage.setItem("livePreviewItem", JSON.stringify(data));
            let { href } = this.$router.resolve({
                path: "/maintenanceCenter/livePreview",
            });
            window.open(href, "_blank");
            // this.$router.push({ path: "/maintenanceCenter/livePreview" });
        },
    },
    created() {
        if (this.$route.query.plateNum)
            this.getPlateNumList({ plateNum: this.$route.query.plateNum });
        this.getOrgTree();
        // this.getDeviceModelList();
        // this.getFaultTypeArr();
        this.getAllFaultType();
        if (this.$route.query.time) {
            if (this.$route.query.time.length) {
                this.timeRange = this.$route.query.time.split("~");
            } else {
                this.timeRange = [];
            }
        } else {
            this.timeRange = [
                new Date(new Date() - 9 * 24 * 60 * 60 * 1000),
                new Date(),
            ];
        }
    },
    mounted() {
        this.setWrap();
        let that = this;
        window.onresize = () => {
            return (() => {
                that.setTableHeight();
                that.setWrap();
            })();
        };
    },
};
</script>
<style lang="less" scoped>
.el-row {
    padding: 5px 0;
}
.wrap {
    height: calc(~"100% - 33px");
    overflow-y: hidden;
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
    .hidden {
        height: 46px;
        overflow: hidden;
    }
    .wrap-bottom {
        border-top: 1px solid #e4e4e4;
    }
}
.noDo {
    color: rgb(255, 119, 199);
}
.doing {
    color: rgb(255, 185, 75);
}
.done {
    color: rgb(119, 202, 103);
}
</style>
