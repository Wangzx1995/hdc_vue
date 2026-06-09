<template>
    <div>
        <el-row>
            <!-- 左边树 -->
            <el-col :span="4" class="b-r">
                <div :class="{ loading_: searchLoading }" class="p-a">
                    <el-input
                        class="marginBottom"
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
                    <div class="wrap-top p-x" ref="searchBox">
                        <div
                            class="m-t"
                            :class="{ hidden: !buttonClick }"
                            ref="wrap"
                        >
                            <el-form
                                :model="searchForm"
                                inline
                                :rules="rules"
                                label-position="top"
                                ref="searchForm"
                            >
                                <div class="m-b">
                                    <el-radio-group
                                        v-model="searchForm.radioType"
                                        @change="changeRadioType"
                                    >
                                        <el-radio-button :label="1">
                                            <!-- 长时间离线 -->
                                            {{
                                                $t(
                                                    "vehicleOfflineLongTime.longTermOffline"
                                                )
                                            }}
                                        </el-radio-button>
                                        <el-radio-button :label="2">
                                            <!-- 从未上线 -->
                                            {{
                                                $t(
                                                    "vehicleOfflineLongTime.neverOnline"
                                                )
                                            }}
                                        </el-radio-button>
                                        <!-- <el-radio-button :label="3">按时间段</el-radio-button> -->
                                    </el-radio-group>
                                </div>
                                <!-- 车牌号 -->
                                <el-form-item
                                    style="margin-left: 0px"
                                    :label="$t('common.plateNum')"
                                    prop="plateNums"
                                >
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
                                        v-model="searchForm.plateNums"
                                    >
                                        <el-option
                                            v-for="item in searchForm.plateArr"
                                            :key="item.id"
                                            :value="item.plateNum"
                                            :label="item.plateNum"
                                        ></el-option>
                                    </el-select>
                                </el-form-item>
                                <!-- 设备厂商 -->
                                <el-form-item
                                    :label="$t('common.manufacturerNameString')"
                                    prop="manufacturerType"
                                >
                                    <el-select
                                        v-model="searchForm.manufacturerType"
                                        :placeholder="$t('common.select')"
                                        clearable
                                    >
                                        <el-option
                                            :value="Number(0)"
                                            :label="$t('common.all')"
                                        ></el-option>
                                        <el-option
                                            :value="Number(1)"
                                            :label="$t('common.hikvision')"
                                        ></el-option>
                                    </el-select>
                                </el-form-item>
                                <!-- 截止日期 -->
                                <el-form-item
                                    prop="dateTime"
                                    :label="
                                        $t('vehicleOfflineLongTime.deadline')
                                    "
                                    v-show="searchForm.radioType == 1"
                                >
                                    <el-date-picker
                                        v-model="searchForm.dateTime"
                                        value-format="yyyy-MM-dd"
                                        format="yyyy-MM-dd"
                                        type="date"
                                        class="w"
                                        :clearable="false"
                                        :picker-options="pickerOptions"
                                    ></el-date-picker>
                                </el-form-item>
                                <!-- 选择时间段 -->
                                <el-form-item
                                    prop="dateTimeRange"
                                    :label="
                                        $t(
                                            'vehicleOfflineLongTime.selectTimePeriod'
                                        )
                                    "
                                    v-show="searchForm.radioType == 3"
                                >
                                    <el-date-picker
                                        v-model="searchForm.dateTimeRange"
                                        value-format="yyyy-MM-dd"
                                        format="yyyy-MM-dd"
                                        type="daterange"
                                        :start-placeholder="
                                            $t('common.startTime')
                                        "
                                        :end-placeholder="$t('common.endTime')"
                                        transfer
                                    ></el-date-picker>
                                </el-form-item>
                                <!-- 离线天数 -->
                                <el-form-item
                                    prop="gtOfflineDay"
                                    :label="
                                        $t('vehicleOfflineLongTime.offlineDays')
                                    "
                                    v-if="searchForm.radioType != 2"
                                >
                                    <el-input
                                        v-model="searchForm.gtOfflineDay"
                                        :placeholder="
                                            $t(
                                                'vehicleOfflineLongTime.offlineDaysTip'
                                            )
                                        "
                                        clearable
                                    >
                                        <template slot="prepend"
                                            ><span class="fontBorder"
                                                >≥</span
                                            ></template
                                        ></el-input
                                    >
                                </el-form-item>
                            </el-form>
                        </div>
                        <div
                            class="flex"
                            style="margin-top: 88px; flex-shrink: 0"
                        >
                            <el-button
                                type="primary"
                                :disabled="searchLoading"
                                :loading="searchLoading"
                                @click="
                                    params.currentPage = 1;
                                    search();
                                "
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
                    <div class="top-bottom m-x" ref="searchBtn">
                        <el-button
                            @click="openExportDialog"
                            :loading="loadingAll"
                            :disabled="loadingAll"
                        >
                            <!-- 导出 -->
                            {{ $t("common.export") }}
                        </el-button>
                    </div>
                    <div class="m-a">
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
                                width="120px"
                            ></el-table-column>
                            <!-- 所属组织 -->
                            <el-table-column
                                prop="orgName"
                                :label="$t('common.orgPath')"
                                min-width="220px"
                                show-overflow-tooltip
                            ></el-table-column>
                            <!-- 设备型号 -->
                            <el-table-column
                                prop="modelCode"
                                :label="$t('common.deviceModelCode')"
                                min-width="170px"
                            ></el-table-column>
                            <!-- 接入协议 -->
                            <el-table-column
                                prop="protocolName"
                                :label="$t('common.protocolName')"
                                min-width="100px"
                            >
                            </el-table-column>
                            <!-- 终端手机号 -->
                            <el-table-column
                                prop="deviceCode"
                                :label="$t('common.deviceCode')"
                                width="140px"
                            ></el-table-column>
                            <!-- 平台添加时间 -->
                            <el-table-column
                                prop="deviceAddTime"
                                :label="
                                    $t('vehicleOfflineLongTime.platformAddTime')
                                "
                                min-width="170px"
                                v-if="searchForm.radioType == 2"
                            ></el-table-column>
                            <!-- 离线时间 -->
                            <el-table-column
                                prop="offlineDate"
                                :label="
                                    $t('vehicleOfflineLongTime.offlineTime')
                                "
                                width="180px"
                                v-if="searchForm.radioType != 2"
                            ></el-table-column>
                            <!-- 离线时长 -->
                            <el-table-column
                                prop="offlineDuration"
                                align="right"
                                sortable
                                :label="
                                    $t('vehicleOfflineLongTime.offlineDuration')
                                "
                                width="180px"
                                v-if="searchForm.radioType != 2"
                            >
                                <template slot-scope="scope">
                                    <div
                                        :title="scope.row.offlineTimeString"
                                        style="
                                            text-overflow: ellipsis;
                                            overflow: hidden;
                                            white-space: nowrap;
                                        "
                                    >
                                        {{ scope.row.offlineTimeString }}
                                    </div>
                                </template>
                            </el-table-column>
                            <!-- 离线位置 -->
                            <el-table-column
                                prop="offlineLocation"
                                :label="
                                    $t('vehicleOfflineLongTime.offlineLocation')
                                "
                                min-width="160px"
                                v-if="searchForm.radioType != 2"
                                show-overflow-tooltip
                            >
                                <template slot-scope="scope">
                                    <el-button
                                        type="text"
                                        @click="getMapAddress(scope.row)"
                                        :disabled="
                                            !scope.row.longitude ||
                                            !scope.row.latitude
                                        "
                                        ><i
                                            class="el-icon-map-location"
                                            style="
                                                font-size: 22px;
                                                color: #2196f3;
                                            "
                                        ></i
                                        >{{
                                            scope.row.longitude &&
                                            scope.row.latitude
                                                ? scope.row.locationName
                                                : $t("common.unknown")
                                        }}</el-button
                                    >
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
        <MapLocation
            :rowData="rowData"
            :modalMap="modalMap"
            @close="close"
        ></MapLocation>
        <!-- 导出 -->
        <el-dialog
            :width="'600px'"
            :visible.sync="exportDialog"
            :title="$t('common.export')"
            @closed="closeExportDialog"
        >
            <div class="group-tree">
                <div class="export-msg">
                    <div>
                        <span>
                            <!-- 设备厂商 -->
                            {{ $t("common.manufacturerNameString") }}
                            ：</span
                        >
                        <span>{{
                            searchForm.manufacturerType === 1
                                ? $t("common.hikvision")
                                : $t("common.all")
                        }}</span>
                        <span v-show="searchForm.radioType === 1">
                            <!-- 截止日期 -->
                            {{ $t("vehicleOfflineLongTime.deadline") }}
                            ：</span
                        >
                        <span v-show="searchForm.radioType === 1">{{
                            searchForm.dateTime
                        }}</span>
                        <span v-show="searchForm.radioType === 1">
                            <!-- 离线天数 -->
                            {{ $t("vehicleOfflineLongTime.offlineDays") }}
                            ：</span
                        >
                        <span v-show="searchForm.radioType === 1"
                            >≥{{ searchForm.gtOfflineDay }}</span
                        >
                    </div>
                    <div v-if="searchForm.plateNums.length">
                        <span>
                            <!-- 车牌号 -->
                            {{ $t("common.plateNum") }}
                            ：</span
                        >
                        <span
                            :title="searchForm.plateNums.join(',')"
                            style="width: 480px"
                            >{{ searchForm.plateNums.join(",") }}</span
                        >
                    </div>
                </div>
                <!-- 请勾选要导出的组织 -->
                <el-alert
                    class="m-b"
                    :title="
                        $t(
                            'vehicleOfflineLongTime.pleaseSelectOrganizationExport'
                        )
                    "
                    type="warning"
                    show-icon
                    :closable="false"
                    simple
                ></el-alert>
                <div class="organization-tree-search">
                    <el-input
                        v-model="organizationName2"
                        :placeholder="$t('common.inputOrganizationName')"
                        clearable
                        suffix-icon="el-icon-search"
                    >
                    </el-input>
                </div>
                <div class="tree-box">
                    <el-tree
                        v-if="showTree2"
                        ref="tree2"
                        :data="treeData"
                        show-checkbox
                        :default-expanded-keys="expandedList"
                        :filter-node-method="filterNode2"
                        node-key="id"
                        :props="defaultProps2"
                    ></el-tree>
                    <!-- :default-checked-keys="[currentNodeId]" -->
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="closeExportDialog">
                    <!-- 取消 -->
                    {{ $t("common.cancel") }}
                </el-button>
                <el-button
                    type="primary"
                    :loading="loading2"
                    @click="goExport()"
                >
                    <!-- 确定 -->
                    {{ $t("common.ok") }}
                </el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import TimeUtil from "@/utils/time";
import timeCom from "@/components/timeCom";
import AttendenceRecord from "@/components/AttendenceRecord";
import MapLocation from "@/components/mapLocation";
import { validateNum } from "@/utils/validate";
export default {
    name: "vehicleOfflineLongTime",
    components: {
        timeCom,
        AttendenceRecord,
        MapLocation,
    },
    data() {
        const validateHeight = (rule, value, callback) => {
            if (!value || value < 3) {
                // 请输入大于等于3的值
                callback(
                    new Error(
                        this.$t("qualifiedProbability.validateHeightMsg1")
                    )
                );
            } else if (!validateNum(value)) {
                // 只能输入数字值
                callback(
                    new Error(
                        this.$t("qualifiedProbability.validateHeightMsg2")
                    )
                );
            } else {
                callback();
            }
        };
        return {
            showTree2: true,
            loading: false,
            loading2: false,
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() > Date.now();
                },
            },
            exportDialog: false,
            searchLoading: true,
            loadingAll: false,
            buttonClick: false,
            searchForm: {
                gtOfflineDay: 3,
                plateNum: "",
                dateTime: TimeUtil.getDate(
                    new Date(new Date() - 1 * 24 * 60 * 60 * 1000)
                ),
                radioType: 1,
                dateTimeRange: [],
                manufacturerType: 0,
                plateNums: [],
                plateArr: [],
            },
            dateTimes: "",
            defaultProps: {
                label: "name",
            },
            params: {
                currentPage: 1, //页码，从1开始
                pageSize: 20, //分页大小
                orgId: null,
                orderColumn: "offlineDays", //排序列
                orderDir: "desc", //排序方向
            },
            date: new Date(new Date() - 24 * 60 * 60 * 1000),
            month: TimeUtil.oneMonthAgo(),
            total: 0,
            currentNodeId: null,
            modalOnline: false,
            tableHeight: 500,
            treeHeight: 500,
            reportType: 0,
            onlineTimeList: [],
            totalHours: 0,
            totalMinutes: 0,
            totalSeconds: 0,
            organizationName: "",
            organizationName2: "",
            treeData: [],
            expandedList: [],
            tableData: [],
            monthDayCount: 30,
            modalMap: false,
            rowData: {},
            query: "",
            rules: {
                gtOfflineDay: [{ validator: validateHeight, trigger: "blur" }],
            },
            defaultProps2: {
                children: "children",
                label: "name",
                disabled: "forbidden",
            },
        };
    },
    computed: {
        monthDay() {
            return [...Array(this.monthDayCount).keys()].map((i) => i + 1);
        },
    },
    watch: {
        organizationName(val) {
            this.$refs.tree.filter(val, !this.organizationName);
        },
        organizationName2(val) {
            this.filterTree(this.treeData, val, 0);
            this.$nextTick(() => {
                this.$refs.tree2.filter("show", !this.organizationName2);
                if (!val) {
                    const nodes = this.$refs.tree2.store._getAllNodes();
                    nodes.forEach((item) => {
                        item.expanded = true;
                    });
                }
            });
        },
        date: {
            handler(val) {
                this.params.currentPage = 1;
                this.getData();
            },
            deep: true,
        },
        month: {
            handler(val) {
                this.params.currentPage = 1;
                this.changeMonthDayCount();
                this.getData();
            },
            deep: true,
        },
        "searchForm.plateNums": {
            handler(val) {
                if (!val.length && this.query.length < 3) {
                    this.searchForm.plateArr = [];
                }
            },
            deep: true,
        },
        query: {
            handler(val) {
                if (val.length < 3 && !this.searchForm.plateNums.length) {
                    this.searchForm.plateArr = [];
                }
            },
            deep: true,
        },
    },
    methods: {
        filterTree(data, val, type) {
            data.forEach((item) => {
                if (item.name.indexOf(val) !== -1) {
                    // item.show = true;
                    this.$set(item, "show", true);
                    this.itemChildren(item);
                } else {
                    this.$set(item, "show", false);
                    if (item.children.length > 0) {
                        this.filterTree(
                            item.children,
                            this.organizationName2,
                            1
                        );
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
                this.searchForm.plateArr = res.data.carList;
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
            this.params.orderColumn = !column.prop ? "" : column.prop;
            this.search();
        },
        blurInput() {
            if (
                this.searchForm.radioType != 2 &&
                this.searchForm.gtOfflineDay < 3
            ) {
                this.searchForm.gtOfflineDay = 3;
                // 最少离线天数不能小于3天
                this.$message.info(
                    this.$t("vehicleOfflineLongTime.minimum3Days")
                );
            }
        },
        changeRadioType() {
            // for (let key in this.searchForm) {
            //     if (key != "radioType" && key != "plateNums" && key != "plateArr") {
            //         this.searchForm[key] = "";
            //     }
            //     this.searchForm.manufacturerType = 0;
            //     this.searchForm.plateNums = [];
            //     this.searchForm.plateArr = [];
            // }

            // if (this.searchForm.radioType == 1) {
            //     this.searchForm.dateTime = TimeUtil.getDate(new Date(new Date() - 1 * 24 * 60 * 60 * 1000));
            // }
            // if (this.searchForm.radioType != 2) {
            //     this.searchForm.gtOfflineDay = 3;
            // }
            this.params.currentPage = 1;
            this.search();
        },
        getMapAddress(data) {
            this.rowData = data;
            this.modalMap = true;
        },
        close() {
            this.rowData = {};
            this.modalMap = false;
        },
        changeMonthDayCount() {
            let arr = TimeUtil.format(this.month, "YYYY-MM").split("-");
            this.monthDayCount = new Date(arr[0], arr[1], 0).getDate();
        },
        change() {
            this.tableData = [];
            this.total = 0;
            this.params.currentPage = 1;
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
        handleClick() {
            this.buttonClick = !this.buttonClick;
        },
        // 重置表单
        handleReset(ref) {
            if (ref !== undefined) {
                ref.resetFields();
                this.$store.dispatch("SetCondtion", this.searchForm);
                this.searchForm.gtOfflineDay = 3;
                this.searchForm.manufacturerType = 0;
            }
        },

        filterNode(value, data) {
            if (!value) return true;
            return data.name.indexOf(value) !== -1;
        },
        handleNodeClick(data) {
            this.currentNodeId = data.id;
            this.params.currentPage = 1;
            this.params.orgId = data.id;
            let tempRadioType = this.searchForm.radioType;
            for (let key in this.searchForm) {
                this.searchForm[key] = "";
            }
            this.searchForm.manufacturerType = 0;
            this.searchForm.plateNums = [];
            this.searchForm.plateArr = [];
            this.searchForm.dateTime = TimeUtil.getDate(
                new Date(new Date() - 1 * 24 * 60 * 60 * 1000)
            );
            (this.searchForm.gtOfflineDay = 3),
                (this.searchForm.radioType = tempRadioType);
            this.searchForm.dateTimeRange = [];
            this.getData();
            this.$store.dispatch("SetDeviceUpgradeId", data.id);
        },
        search() {
            // let params = Object.assign(this.params, this.searchForm);
            this.$refs.searchForm.validate((valid, invalidFields) => {
                if (valid) {
                    this.getData();
                    this.$store.dispatch("SetCondtion", this.searchForm);
                } else {
                    return false;
                }
            });
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
                        this.params.orgId = this.$store.state.tree
                            .deviceUpgradeId
                            ? this.$store.state.tree.deviceUpgradeId
                            : res.data[0].id;
                        this.currentNodeId = this.$store.state.tree
                            .deviceUpgradeId
                            ? this.$store.state.tree.deviceUpgradeId
                            : res.data[0].id;
                        this.searchForm = this.$store.state.tree.searchForm
                            ? this.$store.state.tree.searchForm
                            : this.searchForm;

                        this.$nextTick(() => {
                            this.treeData.forEach((m) => {
                                this.expandedList.push(m.id);
                            });
                            this.$refs["tree"].setCurrentKey(this.params.orgId);
                        });
                        this.getData();
                    } else {
                        this.searchLoading = false;
                    }
                } else {
                    this.searchLoading = false;
                    this.$message.error(res.msg);
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
            if (!this.params.orgId) {
                this.$message.error(this.$t("common.organizationIsEmpty"));
                return;
            }
            this.searchLoading = true;

            let param = {};
            if (this.searchForm.radioType == 1) {
                param = {
                    gtOfflineDay: this.searchForm.gtOfflineDay,
                    plateNum: this.searchForm.plateNum,
                    plateNums: this.searchForm.plateNums,
                    manufacturerType: this.searchForm.manufacturerType,
                    dateTime: this.searchForm.dateTime,
                };
            } else if (this.searchForm.radioType == 3) {
                param = {
                    gtOfflineDay: this.searchForm.gtOfflineDay,
                    plateNum: this.searchForm.plateNum,
                    plateNums: this.searchForm.plateNums,
                    startTime:
                        this.searchForm.dateTimeRange.length > 0
                            ? this.searchForm.dateTimeRange[0]
                            : "",
                    endTime:
                        this.searchForm.dateTimeRange.length > 0
                            ? this.searchForm.dateTimeRange[1]
                            : "",
                    manufacturerType: this.searchForm.manufacturerType,
                };
            } else {
                param = {
                    plateNum: this.searchForm.plateNum,
                    plateNums: this.searchForm.plateNums,
                    manufacturerType: this.searchForm.manufacturerType,
                };
            }

            let params = { ...param, ...this.params };
            if (this.searchForm.radioType == 2) {
                this.$api
                    .getPageCarNeverOnline(params)
                    .then((res) => {
                        if (res.success == true) {
                            this.tableData = res.data.results;
                            this.total = res.data.totalRecords;
                            this.$nextTick(() => {
                                this.setTableHeight();
                            });
                        } else {
                            this.tableData = [];
                            this.total = 0;
                            this.$message.error(res.msg);
                        }
                        this.searchLoading = false;
                    })
                    .catch((err) => {
                        this.tableData = [];
                        this.total = 0;
                        this.searchLoading = false;
                    });
            } else {
                this.$api
                    .getPageCarOfflineLongTime(params)
                    .then((res) => {
                        if (res.success == true) {
                            // res.data.results.forEach(item =>{
                            //   item.offlineDays = item.offlineDays ? Number(item.offlineDays).toFixed(2) : '0.00';
                            // })
                            this.tableData = res.data.results;
                            this.total = res.data.totalRecords;
                            this.$nextTick(() => {
                                this.setTableHeight();
                            });
                        } else {
                            this.tableData = [];
                            this.total = 0;
                            this.$message.error(res.msg);
                        }
                        this.searchLoading = false;
                    })
                    .catch((err) => {
                        this.tableData = [];
                        this.total = 0;
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
                111;
            this.treeHeight = document.body.clientHeight - 150;
        },
        filterNode2(value, data) {
            return data[value];
        },
        openExportDialog() {
            this.showTree2 = true;
            this.exportDialog = true;
            this.$nextTick(() => {
                this.$refs.tree2.setCheckedKeys([this.currentNodeId]);
            });
        },
        closeExportDialog() {
            this.exportDialog = false;
            setTimeout(() => {
                this.organizationName2 = "";
                this.showTree2 = false;
            }, 300);
        },
        goExport() {
            if (this.$refs.tree2.getCheckedKeys().length === 0) {
                // "请勾选要导出的组织"
                this.$message.warning(
                    this.$t(
                        "vehicleOfflineLongTime.pleaseSelectOrganizationExport"
                    )
                );
                return;
            }
            this.loading2 = true;
            setTimeout(() => {
                this.loading2 = false;
            }, 300);
            this.loadingAll = true;
            this.closeExportDialog();
            let param = {};
            if (this.searchForm.radioType == 1) {
                param = {
                    gtOfflineDay: this.searchForm.gtOfflineDay,
                    plateNum: this.searchForm.plateNum,
                    plateNums: this.searchForm.plateNums,
                    manufacturerType: this.searchForm.manufacturerType,
                    dateTime: this.searchForm.dateTime,
                };
            } else if (this.searchForm.radioType == 3) {
                param = {
                    gtOfflineDay: this.searchForm.gtOfflineDay,
                    plateNum: this.searchForm.plateNum,
                    plateNums: this.searchForm.plateNums,
                    startTime:
                        this.searchForm.dateTimeRange.length > 0
                            ? this.searchForm.dateTimeRange[0]
                            : "",
                    endTime:
                        this.searchForm.dateTimeRange.length > 0
                            ? this.searchForm.dateTimeRange[1]
                            : "",
                    manufacturerType: this.searchForm.manufacturerType,
                };
            } else {
                param = {
                    plateNum: this.searchForm.plateNum,
                    plateNums: this.searchForm.plateNums,
                    manufacturerType: this.searchForm.manufacturerType,
                };
            }
            let params = {
                orgIds: this.$refs.tree2.getCheckedKeys(),
                ...param,
            };
            if (this.searchForm.radioType == 2) {
                this.$api.exportCarNeverOnline(params).then((res) => {
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
            } else {
                this.$api.exportCarOfflineLongTime(params).then((res) => {
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
.tree-box {
    height: 400px;
    overflow-y: auto;
}
.loading_ {
    pointer-events: none;
}
.marginBottom {
    margin-bottom: 8px;
}
.wrap {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    .exportDownload {
        margin: -8px 0 16px;
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
        .el-form-item {
            margin-bottom: 12px !important;
        }
    }
    .wrap-top-right {
        display: flex;
        flex-direction: row-reverse;
    }
    a[disabled] {
        pointer-events: all;
    }
    .top-bottom {
    }
}
.export-msg {
    & > div {
        display: flex;
        align-items: center;
        margin-bottom: 12px;
        & > span:nth-child(2n) {
            display: inline-block;
            width: 95px;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            margin-right: 20px;
        }
        & > span:nth-child(2n + 1) {
            display: inline-block;
            width: 78px;
        }
    }
}
</style>
