<template>
    <div>
        <el-row>
            <!-- 左边树 -->
            <el-col :span="4" class="b-r">
                <div :class="{ loading_: searchLoading }" class="p-a">
                    <el-input
                        v-model="organizationName"
                        :placeholder="$t('common.input')"
                        clearable
                    >
                        <i
                            slot="suffix"
                            class="el-input__icon el-icon-search"
                        ></i>
                    </el-input>
                    <el-tree
                        class="m-t"
                        ref="tree"
                        :data="treeData"
                        :default-expanded-keys="expandedList"
                        @node-click="handleNodeClick"
                        default-icon="el-icon-folder"
                        highlight-current
                        node-key="id"
                        :props="defaultProps"
                        :current-node-key="currentNodeId"
                        :filter-node-method="filterNode"
                        :style="{ height: treeHeight + 'px' }"
                        :expand-on-click-node="false"
                    ></el-tree>
                </div>
            </el-col>
            <!-- 右边表 -->
            <el-col :span="20">
                <div class="wrap">
                    <div class="m-x" ref="searchBtn">
                        <el-tabs v-model="reportType" @tab-click="change">
                            <!-- 按日查看 -->
                            <el-tab-pane
                                :disabled="searchLoading"
                                name="0"
                                :label="$t('vehicleOnlineTime.viewByDay')"
                            ></el-tab-pane>
                            <!-- 按月查看 -->
                            <el-tab-pane
                                :disabled="searchLoading"
                                name="1"
                                :label="$t('vehicleOnlineTime.viewByMonth')"
                            ></el-tab-pane>
                        </el-tabs>
                    </div>
                    <div class="m-x" ref="searchBox">
                        <div class="forTime" v-show="reportType == 0">
                            <!-- <div>
                        <p>车牌号</p>
                        <el-input v-model="params.plateNum" placeholder="请输入车牌号"></el-input>
                      </div> -->
                            <div>
                                <!-- 车牌号 -->
                                <p>{{ $t("common.plateNum") }}</p>
                                <el-select
                                    :remote-method="remoteMethod"
                                    :loading="loading"
                                    filterable
                                    style="width: 300px"
                                    reserve-keyword
                                    remote
                                    clearable
                                    multiple
                                    collapse-tags
                                    :placeholder="
                                        $t(
                                            'devLog.enterThreeLicensePlateNumbers'
                                        )
                                    "
                                    v-model="params.plateNums"
                                >
                                    <el-option
                                        v-for="item in params.plateArr"
                                        :key="item.id"
                                        :value="item.plateNum"
                                        :label="item.plateNum"
                                    ></el-option>
                                </el-select>
                            </div>
                            <div>
                                <!-- 选择时间 -->
                                <p>{{ $t("vehicleOnlineTime.selectTime") }}</p>
                                <el-date-picker
                                    v-model="date"
                                    type="date"
                                    :disabled="searchLoading"
                                    :placeholder="$t('common.select')"
                                    style="width: 200px"
                                    format="yyyy-MM-dd"
                                    clearable
                                    :picker-options="pickerOptions"
                                ></el-date-picker>
                                <el-button
                                    class="goExport"
                                    :loading="loadingAll"
                                    @click="goExport"
                                    :disabled="loadingAll"
                                >
                                    <!-- 导出 -->
                                    {{ $t("common.export") }}
                                </el-button>
                            </div>
                            <el-button
                                type="default"
                                @click="clearData"
                                class="search-Btn"
                            >
                                <!-- 清除条件 -->
                                {{ $t("common.reset") }}
                            </el-button>
                            <el-button
                                type="primary"
                                :disabled="searchLoading"
                                :loading="searchLoading"
                                @click="
                                    params.currentPage = 1;
                                    searchData();
                                "
                                class="search-Btn"
                            >
                                <!-- 查询 -->
                                {{ $t("common.search") }}
                            </el-button>
                        </div>
                        <div class="forTime" v-show="reportType == 1">
                            <!-- <div>
                        <p>车牌号</p>
                        <el-input v-model="params.plateNum" placeholder="请输入车牌号"></el-input>
                      </div> -->
                            <div>
                                <!-- 车牌号 -->
                                <p>{{ $t("common.plateNum") }}</p>
                                <el-select
                                    :remote-method="remoteMethod"
                                    :loading="loading"
                                    filterable
                                    style="width: 300px"
                                    reserve-keyword
                                    remote
                                    clearable
                                    multiple
                                    collapse-tags
                                    :placeholder="
                                        $t(
                                            'devLog.enterThreeLicensePlateNumbers'
                                        )
                                    "
                                    v-model="params.plateNums"
                                >
                                    <el-option
                                        v-for="item in params.plateArr"
                                        :key="item.id"
                                        :value="item.plateNum"
                                        :label="item.plateNum"
                                    ></el-option>
                                </el-select>
                            </div>
                            <div>
                                <!-- 选择月份 -->
                                <p>{{ $t("vehicleOnlineTime.selectMonth") }}</p>
                                <el-date-picker
                                    v-model="month"
                                    :disabled="searchLoading"
                                    type="month"
                                    :placeholder="$t('common.select')"
                                    style="width: 200px"
                                    format="yyyy-MM"
                                    clearable
                                    :picker-options="pickerOptions2"
                                ></el-date-picker>
                                <el-button
                                    class="goExport"
                                    @click="goExport"
                                    :loading="loadingAll"
                                    :disabled="loadingAll"
                                >
                                    <!-- 导出 -->
                                    {{ $t("common.export") }}
                                </el-button>
                                <!-- <el-button type="default" @click="clearData" class="search-Btn">清除条件</el-button>
                        <el-button type="primary" :disabled="searchLoading" :loading="searchLoading" @click="params.currentPage=1;searchData()" class="search-Btn">查询</el-button> -->
                            </div>
                            <el-button
                                type="default"
                                @click="clearData"
                                class="search-Btn"
                            >
                                <!-- 清除条件 -->
                                {{ $t("common.reset") }}
                            </el-button>
                            <el-button
                                type="primary"
                                :disabled="searchLoading"
                                :loading="searchLoading"
                                @click="
                                    params.currentPage = 1;
                                    searchData();
                                "
                                class="search-Btn"
                            >
                                <!-- 查询 -->
                                {{ $t("common.search") }}
                            </el-button>
                        </div>
                    </div>
                    <div v-show="reportType == 0" class="m-x m-b">
                        <el-table
                            v-loading="searchLoading"
                            :element-loading-text="
                                $t('common.desperatelyLoading')
                            "
                            element-loading-color="#007213"
                            :height="tableHeight"
                            border
                            stripe
                            :data="tableData"
                            @sort-change="handleSortChange"
                        >
                            <!-- 车牌号 -->
                            <el-table-column
                                prop="plateNum"
                                :label="$t('common.plateNum')"
                                min-width="100px"
                            ></el-table-column>
                            <!-- 所属组织 -->
                            <el-table-column
                                prop="orgName"
                                :label="$t('common.orgPath')"
                                min-width="120px"
                                show-overflow-tooltip
                            ></el-table-column>
                            <!-- 在线时长（h） -->
                            <el-table-column
                                prop="onlineTimeHour"
                                align="right"
                                sortable
                                :label="
                                    $t('vehicleOnlineRate.onlineDuration') +
                                    '（h）'
                                "
                                min-width="100px"
                            ></el-table-column>
                            <!-- 最早上线时间 -->
                            <el-table-column
                                sortable
                                prop="earliestOnlineTime"
                                :label="
                                    $t('vehicleOnlineTime.earliestOnlineTime')
                                "
                                min-width="160px"
                            ></el-table-column>
                            <!-- 最早GPS上报时间 -->
                            <el-table-column
                                sortable
                                prop="earliestGPSTime"
                                :label="$t('vehicleOnlineTime.earliestGPSTime')"
                                min-width="160px"
                            ></el-table-column>
                            <!-- 里程(km) -->
                            <el-table-column
                                prop="totalMileage"
                                align="right"
                                sortable
                                :label="
                                    $t('vehicleOnlineTime.totalMileage') +
                                    '（km）'
                                "
                                min-width="100px"
                            ></el-table-column>
                            <!-- 在/离线 -->
                            <el-table-column
                                :label="$t('vehicleOnlineTime.lineStatus')"
                                min-width="160px"
                            >
                                <template slot-scope="scope">
                                    <div
                                        v-if="
                                            scope.row.deviceOnlineVo &&
                                            scope.row.deviceOnlineVo
                                                .deviceOnlineSectionVoList
                                        "
                                    >
                                        <timeCom
                                            :onlineTimeList="
                                                scope.row.deviceOnlineVo
                                                    .deviceOnlineSectionVoList
                                            "
                                            @openDialog="
                                                showModalOnline(
                                                    scope.row.deviceOnlineVo
                                                )
                                            "
                                        ></timeCom>
                                    </div>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <div v-show="reportType == 1" class="m-x m-b">
                        <el-table
                            v-loading="searchLoading"
                            :element-loading-text="
                                $t('common.desperatelyLoading')
                            "
                            element-loading-color="#007213"
                            :height="tableHeight"
                            border
                            stripe
                            :data="tableData2"
                            @sort-change="handleSortChange"
                        >
                            <!-- 车牌号 -->
                            <el-table-column
                                prop="plateNum"
                                :label="$t('common.plateNum')"
                                width="100px"
                                fixed
                            ></el-table-column>
                            <!-- 所属组织 -->
                            <el-table-column
                                prop="orgName"
                                :label="$t('common.orgPath')"
                                width="120px"
                                show-overflow-tooltip
                            ></el-table-column>
                            <!-- 上线天数（天） -->
                            <el-table-column
                                prop="uplineDay"
                                align="right"
                                :label="
                                    $t('vehicleOnlineTime.uplineDay') +
                                    '（' +
                                    $t('vehicleOnlineTime.day') +
                                    '）'
                                "
                                width="150px"
                                sortable
                            ></el-table-column>
                            <!-- 离线天数（天） -->
                            <el-table-column
                                prop="offlineDay"
                                align="right"
                                :label="
                                    $t('vehicleOnlineTime.offlineDay') +
                                    '（' +
                                    $t('vehicleOnlineTime.day') +
                                    '）'
                                "
                                width="150px"
                                sortable
                            ></el-table-column>
                            <!-- 在线总时长（时） -->
                            <el-table-column
                                prop="onlineTimeHour"
                                align="right"
                                :label="
                                    $t('vehicleOnlineTime.onlineTimeHour') +
                                    '（' +
                                    $t('vehicleOnlineTime.hour') +
                                    '）'
                                "
                                width="180px"
                                sortable
                            ></el-table-column>
                            <!-- 里程（km） -->
                            <el-table-column
                                prop="totalMileage"
                                align="right"
                                :label="
                                    $t('vehicleOnlineRate.totalMileage') +
                                    '（km）'
                                "
                                width="150px"
                                sortable
                            ></el-table-column>
                            <el-table-column
                                align="right"
                                v-for="(item, index) in monthDay"
                                :label="String(item)"
                                :key="String(monthDay.length) + index"
                                width="70px"
                            >
                                <template slot-scope="scope">
                                    <div
                                        v-for="i in scope.row
                                            .carOnlineTimeDayList"
                                        :key="i.index"
                                    >
                                        <a
                                            v-if="i.day == item"
                                            @click="
                                                showModalOnline(
                                                    i.deviceOnlineVo,
                                                    true
                                                )
                                            "
                                            :disabled="!i.deviceOnlineVo"
                                        >
                                            {{
                                                i.onlineTimeHour
                                                    ? Number(
                                                          i.onlineTimeHour
                                                      ).toFixed(2)
                                                    : "--"
                                            }}
                                        </a>
                                    </div>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <div class="wrap-bottom p-x" ref="searchPagination">
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
            </el-col>
        </el-row>
        <!-- 当日上线/离线时间 -->
        <el-dialog
            :width="'1200px'"
            :visible.sync="modalOnline"
            :title="$t('vehicleOnlineTime.dailyOnlineOfflineTime')"
        >
            <!-- <AttendenceRecord
                :onlineTimeList="onlineTimeList"
                :totalHours="totalHours"
                :totalMinutes="totalMinutes"
                :totalSeconds="totalSeconds"
            ></AttendenceRecord> -->
            <onlineTimeChart
                :onlineTimeList="onlineTimeList"
                :selectDate="selectDate"
                :totalHours="totalHours"
                :totalMinutes="totalMinutes"
                :totalSeconds="totalSeconds"
            ></onlineTimeChart>
        </el-dialog>
    </div>
</template>

<script>
import TimeUtil from "@/utils/time";
import timeCom from "@/components/timeCom";
import AttendenceRecord from "@/components/AttendenceRecord";
import onlineTimeChart from "./onlineTimeChart";
export default {
    name: "vehicleOnlineTime",
    components: {
        timeCom,
        AttendenceRecord,
        onlineTimeChart,
    },
    data() {
        return {
            selectDate: "",
            loading: false,
            searchLoading: true,
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() > Date.now() - 24 * 60 * 60 * 1000;
                },
            },
            pickerOptions2: {
                disabledDate(time) {
                    return time.getTime() > TimeUtil.oneMonthAgo();
                },
            },
            loadingAll: false,
            defaultProps: {
                label: "name",
            },
            params: {
                currentPage: 1, //页码，从1开始
                pageSize: 20, //分页大小
                organizeId: null,
                plateNum: "",
                orderDir: "",
                orderColumn: "",
                plateArr: [],
                plateNums: [],
            },
            date: new Date(new Date() - 24 * 60 * 60 * 1000),
            month: new Date(),
            total: 0,
            currentNodeId: null,
            modalOnline: false,
            tableHeight: 500,
            treeHeight: 500,
            reportType: this.$store.state.tree.tabName
                ? this.$store.state.tree.tabName
                : 0,
            onlineTimeList: [],
            totalHours: 0,
            totalMinutes: 0,
            totalSeconds: 0,
            organizationName: "",
            treeData: [],
            expandedList: [],
            tableData: [],
            tableData2: [],
            monthDayCount: 30,
            query: "",
        };
    },
    computed: {
        monthDay() {
            return [...Array(this.monthDayCount).keys()].map((i) => i + 1);
        },
    },
    watch: {
        organizationName(val) {
            this.filterTree(this.treeData, val, 0);
            this.$nextTick(() => {
                this.$refs.tree.filter("show", !this.organizationName);
            });
        },
        date: {
            handler(val) {
                this.params.currentPage = 1;
                (this.params.orderDir = ""), (this.params.orderColumn = "");
                this.getData();
            },
            deep: true,
        },
        month: {
            handler(val) {
                this.params.currentPage = 1;
                (this.params.orderDir = ""), (this.params.orderColumn = "");
                this.changeMonthDayCount();
                this.getData();
            },
            deep: true,
        },
        "params.plateNums": {
            handler(val) {
                if (!val.length && this.query.length < 3) {
                    this.params.plateArr = [];
                }
            },
            deep: true,
        },
        query: {
            handler(val) {
                if (val.length < 3 && !this.params.plateNums.length) {
                    this.params.plateArr = [];
                }
            },
            deep: true,
        },
    },
    methods: {
        //远程搜索
        remoteMethod(query) {
            this.query = query;
            if (query.length >= 3) {
                this.getPlateNumList({ plateNum: query });
            }
        },
        //获取车牌号
        getPlateNumList(params) {
            this.loading = true;
            this.$api.getCarList(params).then((res) => {
                this.params.plateArr = res.data.carList;
                this.loading = false;
            });
        },
        //排序
        handleSortChange(column, prop, order) {
            this.params.orderDir = !column.order
                ? ""
                : column.order == "ascending"
                ? "asc"
                : "desc";
            this.params.orderColumn = !column.prop
                ? ""
                : column.prop == "onlineTimeHour"
                ? "onlineTime"
                : column.prop;
            this.getData();
        },
        filterTree(data, val, type) {
            data.forEach((item) => {
                if (item.name.indexOf(val) !== -1) {
                    // item.show = true;
                    this.$set(item, "show", true);
                    this.itemChildren(item);
                } else {
                    this.$set(item, "show", false);
                    if (item.children.length > 0) {
                        this.filterTree(item.children, val, 1);
                    }
                }
            });
        },
        itemChildren(val) {
            if (val.children.length > 0) {
                val.children.forEach((item) => {
                    item.show = true;
                    if (item.children.length > 0) {
                        this.itemChildren(item);
                    }
                });
            }
        },
        changeMonthDayCount() {
            let arr = TimeUtil.format(this.month, "YYYY-MM").split("-");
            this.monthDayCount = new Date(arr[0], arr[1], 0).getDate();
        },
        change() {
            this.date = this.date || new Date(new Date() - 24 * 60 * 60 * 1000);
            this.month = this.month || new Date();
            this.tableData = [];
            this.tableData2 = [];
            this.total = 0;
            // this.params.plateNum = ""
            // this.params.plateNums = [];
            // this.params.plateArr = [];
            this.params.currentPage = 1;
            (this.params.orderDir = ""), (this.params.orderColumn = "");
            this.$store.dispatch("SetTabName", this.reportType);

            this.getData();
        },
        handleSizeChange(val) {
            this.params.pageSize = val;
            this.getData();
        },
        handleCurrentChange(val) {
            this.params.currentPage = val;
            this.getData();
        },
        showModalOnline(data, falg) {
            this.onlineTimeList = data.deviceOnlineSectionVoList;
            if (falg) {
                this.selectDate = this.onlineTimeList[0].startTime;
            } else {
                this.selectDate = this.date;
            }
            this.totalHours = data.totalHours;
            this.totalMinutes = data.totalMinutes;
            this.totalSeconds = data.totalSeconds;
            this.modalOnline = true;
        },
        goExport() {
            if (!this.params.organizeId) {
                this.$message.error(this.$t("common.organizationIsEmpty"));
                return;
            }
            if (this.total > 50000) {
                this.$message.error(this.$t("common.unableEport50000"));
            } else {
                this.loadingAll = true;
                let params = {};
                params.organizeId = this.params.organizeId;
                params.plateNum = this.params.plateNum;
                params.plateNums = this.params.plateNums;
                if (this.reportType == 0) {
                    if (!this.date) {
                        // 请选择日期
                        this.$message.warning(
                            this.$t("vehicleOnlineTime.pleaseSelectDate")
                        );
                        return;
                    }
                    params.date = TimeUtil.getDate(this.date);
                    params.month = null;
                    this.$api.exportCarOnlineTime(params).then((res) => {
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
                                                        : process.env
                                                              .BASE_API) +
                                                    "/excel?fileName=" +
                                                    fileName;
                                                iframe.style.display = "none";
                                                document.body.appendChild(
                                                    iframe
                                                );
                                                window.clearInterval(
                                                    _this.getExportResultInterval
                                                );
                                                _this.getExportResultInterval =
                                                    "";
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
                } else {
                    if (!this.month) {
                        // this.$message.warning("请选择月份");
                        this.$message.warning(
                            this.$t("vehicleOnlineRate.pleaseSelectMonthFirst")
                        );
                        return;
                    }
                    params.month = TimeUtil.format(this.month, "YYYY-MM");
                    params.date = null;
                    this.$api.exportCarOnlineTimeOnMonth(params).then((res) => {
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
                                                        : process.env
                                                              .BASE_API) +
                                                    "/excel?fileName=" +
                                                    fileName;
                                                iframe.style.display = "none";
                                                document.body.appendChild(
                                                    iframe
                                                );
                                                window.clearInterval(
                                                    _this.getExportResultInterval
                                                );
                                                _this.getExportResultInterval =
                                                    "";
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
            }
        },
        filterNode(value, data) {
            return data[value];
        },
        handleNodeClick(data) {
            this.params.plateNum = "";
            this.params.plateNums = [];
            this.params.plateArr = [];
            this.currentNodeId = data.id;
            this.params.currentPage = 1;
            if (data.type == 1) {
                this.params.organizeId = data.id;
                this.params.plateNum = "";
            } else if (data.type == 2) {
                this.params.plateNum = data.name;
                this.params.organizeId = null;
            }
            this.$store.dispatch("SetDeviceUpgradeId", data.id);
            this.$store.dispatch("SetTabName", this.reportType);
            this.searchData();
        },
        searchData() {
            this.$store.dispatch("SetDate", TimeUtil.getDate(this.date));
            this.$store.dispatch(
                "SetMonth",
                TimeUtil.format(this.month, "YYYY-MM")
            );
            this.$store.dispatch("SetCondtion", this.params);
            this.getData();
        },
        clearData() {
            this.params.plateNum = "";
            this.params.plateNums = [];
            this.params.plateArr = [];
        },
        // 获取组织树
        getTeeData() {
            this.$api.getOrgTree().then((res) => {
                this.treeData = [];
                this.expandedList = [];
                this.setTableHeight();
                if (res.success == true) {
                    // res.data.forEach(item =>{
                    //      item = this.showCar(item);
                    // })
                    this.treeData = res.data;
                    if (res.data.length > 0) {
                        this.params.organizeId = this.$store.state.tree
                            .deviceUpgradeId
                            ? this.$store.state.tree.deviceUpgradeId
                            : res.data[0].id;
                        this.currentNodeId = this.$store.state.tree
                            .deviceUpgradeId
                            ? this.$store.state.tree.deviceUpgradeId
                            : res.data[0].id;
                        this.params = this.$store.state.tree.params
                            ? this.$store.state.tree.params
                            : this.params;
                        this.date = this.$store.state.tree.date
                            ? this.$store.state.tree.date
                            : this.date;
                        this.month = this.$store.state.tree.month
                            ? this.$store.state.tree.month
                            : this.month;
                        this.$nextTick(() => {
                            this.treeData.forEach((m) => {
                                this.expandedList.push(m.id);
                            });
                            this.$refs["tree"].setCurrentKey(
                                this.params.organizeId
                            );
                        });
                        this.getData();
                    } else {
                        this.searchLoading = false;
                    }
                } else {
                    this.$message.error(res.msg);
                    this.searchLoading = false;
                }
            });
        },
        // showCar(data){
        //   if(data.children){
        //     data.children.forEach(item =>{
        //       item.showCar = 1;
        //       if(item.children){
        //         this.showCar(item)
        //       }
        //     })
        //   }
        //   return data;
        // },
        getData() {
            // if(!this.params.organizeId){
            //   return
            // }
            if (!this.params.organizeId) {
                this.$message.error(this.$t("common.organizationIsEmpty"));
                return;
            }
            if (this.reportType == 0) {
                if (!this.date) {
                    // 请选择日期
                    this.$message.warning(
                        this.$t("vehicleOnlineTime.pleaseSelectDate")
                    );
                    return;
                }
                this.searchLoading = true;
                let param = {};
                for (let key in this.params) {
                    if (key != "plateArr") {
                        param[key] = this.params[key];
                    }
                }
                let params = Object.assign(param, {
                    date: TimeUtil.getDate(this.date),
                });
                params.month = null;
                this.$api
                    .pageCarOnlineTime(params)
                    .then((res) => {
                        if (res.success == true) {
                            res.data.results.forEach((item) => {
                                item.onlineTimeHour = item.onlineTimeHour
                                    ? Number(item.onlineTimeHour.toFixed(2))
                                    : 0.0;
                                item.totalMileage = item.totalMileage
                                    ? Number(item.totalMileage.toFixed(2))
                                    : 0.0;
                            });
                            this.tableData =
                                (res.data.results.length &&
                                    res.data.totalRecords) ||
                                (!res.data.results.length &&
                                    !res.data.totalRecords)
                                    ? res.data.results
                                    : this.tableData;
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
            } else {
                if (!this.month) {
                    // this.$message.warning("请选择月份");
                    this.$message.warning(
                        this.$t("vehicleOnlineRate.pleaseSelectMonthFirst")
                    );
                    return;
                }
                this.searchLoading = true;
                let param = {};
                for (let key in this.params) {
                    if (key != "plateArr") {
                        param[key] = this.params[key];
                    }
                }
                let params = Object.assign(param, {
                    month: TimeUtil.format(this.month, "YYYY-MM"),
                });
                params.date = null;
                this.$api
                    .pageCarOnlineTimeOnMonth(params)
                    .then((res) => {
                        if (res.success == true) {
                            res.data.results.forEach((item) => {
                                item.uplineDay = item.uplineDay
                                    ? item.uplineDay
                                    : "0";
                                item.offlineDay = item.offlineDay
                                    ? item.offlineDay
                                    : "0";
                                item.onlineTimeHour = item.onlineTimeHour
                                    ? Number(item.onlineTimeHour.toFixed(2))
                                    : 0.0;
                                item.totalMileage = item.totalMileage
                                    ? Number(item.totalMileage.toFixed(2))
                                    : 0.0;
                            });
                            this.tableData2 =
                                (res.data.results.length &&
                                    res.data.totalRecords) ||
                                (!res.data.results.length &&
                                    !res.data.totalRecords)
                                    ? res.data.results
                                    : this.tableData2;
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
            }
        },
        setTableHeight() {
            this.tableHeight =
                document.body.clientHeight -
                this.$refs.searchBox.clientHeight -
                this.$refs.searchBtn.clientHeight -
                this.$refs.searchPagination.clientHeight -
                97;
            this.treeHeight = document.body.clientHeight - 156;
        },
    },
    mounted() {
        const that = this;
        window.onresize = () => {
            return (() => {
                that.setTableHeight();
            })();
        };
    },
    created() {
        this.getTeeData();
        this.changeMonthDayCount();
    },
};
</script>

<style lang="less" scoped>
/deep/.el-select {
    .el-input__inner {
        height: 32px !important;
    }
}

.loading_ {
    pointer-events: none;
}
.goExport {
    margin-left: 10px;
}
.wrap {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    .forTime {
        overflow: hidden;
        padding-bottom: 12px;
        div {
            float: left;
            margin-right: 10px;
            overflow: hidden;
            p {
                font-size: 14px;
                height: 24px;
                line-height: 24px;
                margin-bottom: 4px;
            }
        }
        .search-Btn {
            float: right;
            margin-left: 20px;
            margin-top: 28px;
        }
    }
    .wrap-bottom {
        // position: absolute;
        // bottom:0;
        border-top: 1px solid #e4e4e4;
    }
    .wrap-top {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }
    .wrap-top-right {
        display: flex;
        flex-direction: row-reverse;
    }
    a[disabled] {
        pointer-events: all;
    }
}
</style>
