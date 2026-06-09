<template>
    <div class="wrap">
        <!-- <div layout="row" class="m-l"  style="display: flex; justify-content: space-between;"> -->
        <div class="m-x">
            <el-tabs v-model="activeName" @tab-click="changeWay">
                <!-- 按组织查看 -->
                <el-tab-pane
                    :disabled="searchLoading"
                    :label="$t('qualifiedProbability.viewByOrganization')"
                    name="1"
                ></el-tab-pane>
                <!-- 按车辆查看 -->
                <el-tab-pane
                    :disabled="searchLoading"
                    :label="$t('qualifiedProbability.viewByVehicle')"
                    name="2"
                ></el-tab-pane>
            </el-tabs>
        </div>
        <!-- </div> -->
        <div class="m-x" ref="searchBox">
            <div class="wrap-top" v-show="activeName == '1'">
                <div :class="{ hidden: !buttonClick }" ref="wrap1">
                    <el-form
                        :rules="rules"
                        :model="searchForm1"
                        label-position="top"
                        inline
                        ref="searchForm1"
                    >
                        <!-- 所属组织 -->
                        <el-form-item
                            :label="$t('common.orgPath')"
                            prop="organizeId"
                        >
                            <TreeSelect
                                :treeData="treeData"
                                style="width: 300px"
                                ref="asyncTree"
                                filter
                                @nodechange="nodeClick"
                                v-model="searchForm1.organizeId"
                                :props="defaultProps"
                            >
                            </TreeSelect>
                        </el-form-item>

                        <!-- 时间段 -->
                        <el-form-item
                            :label="$t('vehicleTrackIntegrityRate.timeSlot')"
                        >
                            <el-date-picker
                                :picker-options="pickerOptions2"
                                size="small"
                                v-model="timeRange"
                                type="daterange"
                                transfer
                                :clearable="false"
                                format="yyyy-MM-dd"
                            ></el-date-picker>
                        </el-form-item>
                        <!-- 轨迹完整度(%) -->
                        <el-form-item
                            :label="
                                $t(
                                    'vehicleTrackIntegrityRate.trajectoryIntegrity'
                                ) + '(%)'
                            "
                            prop="numberRange"
                        >
                            <input-number-range
                                v-model="searchForm1.numberRange"
                            ></input-number-range>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="m-t p-t" style="display: flex; height: 46px">
                    <el-button
                        type="primary"
                        :disabled="searchLoading"
                        :loading="searchLoading"
                        @click="
                            params2.currentPage = 1;
                            getData();
                        "
                    >
                        <!-- 查询 -->
                        {{ $t("common.search") }}
                    </el-button>
                    <el-button
                        type="default"
                        @click="handleReset($refs.searchForm1)"
                    >
                        <!-- 清除条件 -->
                        {{ $t("common.reset") }}
                    </el-button>
                    <el-button
                        class="goExport"
                        @click="goExport"
                        :loading="loadingAll"
                        :disabled="loadingAll"
                        v-btn="'vehicleTrackIntegrityRateExport'"
                    >
                        <!-- 导出 -->
                        {{ $t("common.export") }}
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
            <div class="wrap-top" v-show="activeName == '2'">
                <div :class="{ hidden: !buttonClick }" ref="wrap">
                    <el-form
                        :rules="rules"
                        :model="searchForm2"
                        label-position="top"
                        inline
                        ref="searchForm2"
                    >
                        <!-- 所属组织 -->
                        <el-form-item
                            :label="$t('common.orgPath')"
                            prop="organizeId"
                        >
                            <TreeSelect
                                :treeData="treeData"
                                style="width: 300px"
                                ref="asyncTree"
                                filter
                                @nodechange="nodeClick"
                                v-model="searchForm2.organizeId"
                                :props="defaultProps"
                            >
                            </TreeSelect>
                        </el-form-item>
                        <!-- 车牌号 -->
                        <el-form-item
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
                                multiple
                                collapse-tags
                                :placeholder="
                                    $t('devLog.enterThreeLicensePlateNumbers')
                                "
                                v-model="searchForm2.plateNums"
                            >
                                <el-option
                                    v-for="item in searchForm2.plateArr"
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
                                :placeholder="$t('common.select')"
                                clearable
                                v-model="searchForm2.manufacturerType"
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
                        <!-- 时间范围 -->
                        <el-form-item
                            :label="$t('qualifiedProbability.timeFrame')"
                        >
                            <el-date-picker
                                :picker-options="pickerOptions2"
                                size="small"
                                v-model="timeRange"
                                type="daterange"
                                transfer
                                :clearable="false"
                                format="yyyy-MM-dd"
                            ></el-date-picker>
                        </el-form-item>
                        <!-- 轨迹完整度(%) -->
                        <el-form-item
                            :label="
                                $t(
                                    'vehicleTrackIntegrityRate.trajectoryIntegrity'
                                ) + '(%)'
                            "
                            prop="numberRange"
                        >
                            <input-number-range
                                v-model="searchForm2.numberRange"
                            ></input-number-range>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="m-t p-t" style="display: flex; height: 46px">
                    <el-button
                        type="primary"
                        :disabled="searchLoading"
                        :loading="searchLoading"
                        @click="
                            params2.currentPage = 1;
                            getData(true);
                        "
                    >
                        <!-- 查询 -->
                        {{ $t("common.search") }}
                    </el-button>
                    <el-button
                        type="default"
                        @click="handleReset($refs.searchForm2)"
                    >
                        <!-- 清除条件 -->
                        {{ $t("common.reset") }}
                    </el-button>
                    <el-button
                        class="goExport"
                        @click="goExport"
                        :loading="loadingAll"
                        :disabled="loadingAll"
                        v-btn="'vehicleTrackIntegrityRateExport'"
                    >
                        <!-- 导出 -->
                        {{ $t("common.export") }}
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
        </div>
        <div class="m-x">
            <el-table
                @sort-change="sortChange"
                v-loading="searchLoading"
                :element-loading-text="$t('common.desperatelyLoading')"
                element-loading-color="#007213"
                :height="tableHeight"
                :data="tableData"
                force-scroll="horizontal"
                style="width: 100%"
                v-show="activeName === '1'"
                border
                stripe
            >
                <!-- 组织名称 -->
                <el-table-column
                    prop="orgName"
                    :label="$t('vehicleTrackIntegrityRate.orgName')"
                    min-width="100px"
                ></el-table-column>
                <!-- 所属组织 -->
                <el-table-column
                    prop="orgPath"
                    :label="$t('common.orgPath')"
                    min-width="300px"
                ></el-table-column>
                <!-- 轨迹缺失段数 -->
                <el-table-column
                    sortable="custom"
                    prop="trackMissSegment"
                    align="right"
                    :label="$t('vehicleTrackIntegrityRate.trackMissSegment')"
                    width="160px"
                ></el-table-column>
                <!-- 轨迹总段数 -->
                <el-table-column
                    sortable="custom"
                    prop="trackSegment"
                    align="right"
                    :label="$t('vehicleTrackIntegrityRate.trackSegment')"
                    width="160px"
                ></el-table-column>
                <!-- 不连续里程(km) -->
                <el-table-column
                    sortable="custom"
                    prop="missMileage"
                    align="right"
                    :label="
                        $t('vehicleTrackIntegrityRate.discontinuousMileage') +
                        '(km)'
                    "
                    width="160px"
                >
                    <template slot-scope="scope">
                        <span>{{
                            keepTwoZero(scope.row.missMileage) == "0.00"
                                ? "0"
                                : keepTwoZero(scope.row.missMileage)
                        }}</span>
                    </template>
                </el-table-column>
                <!-- 连续里程(km) -->
                <el-table-column
                    prop="totalMileage"
                    align="right"
                    :label="
                        $t('vehicleTrackIntegrityRate.continuousMileage') +
                        '(km)'
                    "
                    width="160px"
                >
                    <template slot-scope="scope">
                        <span>{{
                            keepTwoZero(
                                scope.row.totalMileage - scope.row.missMileage
                            ) == "0.00"
                                ? "0"
                                : keepTwoZero(
                                      scope.row.totalMileage -
                                          scope.row.missMileage
                                  )
                        }}</span>
                    </template>
                </el-table-column>
                <!-- 总里程(km) -->
                <el-table-column
                    sortable="custom"
                    prop="totalMileage"
                    align="right"
                    :label="
                        $t('vehicleTrackIntegrityRate.totalMileage') + '(km)'
                    "
                    min-width="160px"
                >
                    <template slot-scope="scope">
                        <span>{{
                            keepTwoZero(scope.row.totalMileage) == "0.00"
                                ? "0"
                                : keepTwoZero(scope.row.totalMileage)
                        }}</span>
                    </template>
                </el-table-column>
                <!-- 轨迹完整率(%) -->
                <el-table-column
                    sortable="custom"
                    prop="trackCompletenessRate"
                    align="right"
                    :label="
                        $t('vehicleTrackIntegrityRate.trackCompletenessRate') +
                        '(%)'
                    "
                    min-width="160px"
                >
                    <template slot-scope="scope">
                        <span>{{
                            keepTwoZero(scope.row.trackCompletenessRate) ==
                            "0.00"
                                ? "0"
                                : keepTwoZero(scope.row.trackCompletenessRate)
                        }}</span>
                    </template>
                </el-table-column>
                <!-- 操作 -->
                <el-table-column
                    prop="orgId"
                    :label="$t('common.operate')"
                    width="100px"
                    fixed="right"
                >
                    <template slot-scope="scope">
                        <a
                            @click="
                                goDetail(scope.row.orgId, scope.row.orgName)
                            "
                        >
                            <!-- 详情 -->
                            {{ $t("common.detail") }}
                        </a>
                    </template>
                </el-table-column>
            </el-table>

            <el-table
                @sort-change="sortChange"
                v-loading="searchLoading"
                :element-loading-text="$t('common.desperatelyLoading')"
                element-loading-color="#007213"
                :height="tableHeight"
                :data="tableData2"
                force-scroll="horizontal"
                style="width: 100%"
                v-show="activeName === '2'"
                border
                stripe
            >
                <!-- 车牌号 -->
                <el-table-column
                    prop="plateNum"
                    :label="$t('common.plateNum')"
                    width="120px"
                ></el-table-column>
                <!-- 所属组织 -->
                <el-table-column
                    prop="orgPath"
                    :label="$t('common.orgPath')"
                    min-width="300px"
                ></el-table-column>
                <!-- 轨迹缺失段数 -->
                <el-table-column
                    sortable="custom"
                    prop="trackMissSegment"
                    align="right"
                    :label="$t('vehicleTrackIntegrityRate.trackMissSegment')"
                    width="160px"
                >
                    <template slot-scope="scope">
                        <a
                            v-if="scope.row.trackMissSegment"
                            @click="goTrackIncomplete(scope.row)"
                            >{{ scope.row.trackMissSegment }}</a
                        >
                        <span v-else>{{ scope.row.trackMissSegment }}</span>
                    </template>
                </el-table-column>
                <!-- 轨迹总段数 -->
                <el-table-column
                    sortable="custom"
                    prop="trackSegment"
                    align="right"
                    :label="$t('vehicleTrackIntegrityRate.trackSegment')"
                    width="160px"
                >
                </el-table-column>
                <!-- 不连续里程(km) -->
                <el-table-column
                    sortable="custom"
                    prop="missMileage"
                    align="right"
                    :label="
                        $t('vehicleTrackIntegrityRate.discontinuousMileage') +
                        '(km)'
                    "
                    width="160px"
                >
                    <template slot-scope="scope">
                        <span>{{
                            scope.row.missMileage.toFixed(2) == "0.00"
                                ? "0"
                                : scope.row.missMileage.toFixed(2)
                        }}</span>
                    </template>
                </el-table-column>
                <!-- 连续里程(km) -->
                <el-table-column
                    sortable="custom"
                    prop="totalMileage"
                    align="right"
                    :label="
                        $t('vehicleTrackIntegrityRate.continuousMileage') +
                        '(km)'
                    "
                    width="160px"
                >
                    <template slot-scope="scope">
                        <span>{{
                            (
                                scope.row.totalMileage - scope.row.missMileage
                            ).toFixed(2) == "0.00"
                                ? "0"
                                : (
                                      scope.row.totalMileage -
                                      scope.row.missMileage
                                  ).toFixed(2)
                        }}</span>
                    </template>
                </el-table-column>
                <!-- 总里程(km) -->
                <el-table-column
                    sortable="custom"
                    prop="totalMileage"
                    align="right"
                    :label="
                        $t('vehicleTrackIntegrityRate.totalMileage') + '(km)'
                    "
                    width="160px"
                >
                    <template slot-scope="scope">
                        <span>{{
                            scope.row.totalMileage.toFixed(2) == "0.00"
                                ? "0"
                                : scope.row.totalMileage.toFixed(2)
                        }}</span>
                    </template>
                </el-table-column>
                <!-- 轨迹完整率(%) -->
                <el-table-column
                    align="right"
                    sortable="custom"
                    prop="trackCompletenessRate"
                    :label="
                        $t('vehicleTrackIntegrityRate.trackCompletenessRate') +
                        '(%)'
                    "
                    min-width="160px"
                >
                    <template slot-scope="scope">
                        <span>{{
                            scope.row.trackCompletenessRate.toFixed(2) == "0.00"
                                ? "0"
                                : scope.row.trackCompletenessRate.toFixed(2)
                        }}</span>
                    </template>
                </el-table-column>
                <!-- 操作 -->
                <el-table-column
                    prop="orgId"
                    :label="$t('common.operate')"
                    width="120px"
                    fixed="right"
                >
                    <template slot-scope="scope">
                        <a
                            @click="goCarDetail(scope.row)"
                            v-btn="'vehicleTrackIntegrityRateTrackReplay'"
                        >
                            <!-- 轨迹回放 -->
                            {{ $t("qualifiedProbability.trackPlayback") }}
                        </a>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="wrap-bottom p-x m-t" ref="searchPagination">
            <el-pagination
                v-show="activeName === '1'"
                :current-page="params.currentPage"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :page-sizes="[20, 50, 100]"
                :page-size="params.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
            >
            </el-pagination>
            <el-pagination
                v-show="activeName === '2'"
                :current-page="params2.currentPage"
                @size-change="handleSizeChange2"
                @current-change="handleCurrentChange2"
                :page-sizes="[20, 50, 100]"
                :page-size="params2.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total2"
            >
            </el-pagination>
        </div>
        <!-- 轨迹不完整明细 -->
        <el-dialog
            :title="$t('vehicleTrackIntegrityRate.incompleteTrajectoryDetails')"
            top="2%"
            :visible.sync="dialogTableVisible"
            :width="dialogWidth + 'px'"
        >
            <div v-if="dialogTableVisible">
                <TrackIncompleteDetails
                    :dialogPlateNum="dialogPlateNum"
                    :dialogTime="dialogTime"
                ></TrackIncompleteDetails>
            </div>
            <!-- <span slot="footer" class="dialog-footer">
            <el-button @click="noVisible">关 闭</el-button>
        </span> -->
        </el-dialog>
    </div>
</template>

<script>
import TreeSelect from "@/components/hui-pro/tree-select/src/tree-select.vue";
import "@/components/hui-pro/tree-select/theme/index.scss";
import TimeUtil from "@/utils/time";
import TrackIncompleteDetails from "./trackIncompleteDetails.vue";
import InputNumberRange from "@/components/inputNumberRange.vue";

export default {
    name: "vehicleTrackIntegrityRate",
    components: { TreeSelect, TrackIncompleteDetails, InputNumberRange },
    data() {
        return {
            rules: {},
            dialogTableVisible: false,
            dialogPlateNum: "",
            dialogTime: "",
            query: "",
            searchLoading: true,
            loadingAll: false,
            treeData: [],
            treeArr: [],
            loading: false,
            tableHeight: 500,
            tableHeight2: 500,
            defaultProps: {
                children: "children",
                label: "name",
            },
            dialogWidth: 1800,
            activeName: "1",
            timeRange: [
                new Date(new Date() - 7 * 24 * 60 * 60 * 1000),
                new Date(),
            ],
            searchForm1: {
                organizeId: "",
                orderDir: "",
                orderColumn: "",
                numberRange: [],
                maxCompletenessRate: "",
                minCompletenessRate: "",
            },
            searchForm2: {
                organizeId: "",
                plateArr: [],
                plateNums: [],
                manufacturerType: 0,
                orderDir: "",
                orderColumn: "",
                activeName: "",
                numberRange: [],
                maxCompletenessRate: "",
                minCompletenessRate: "",
            },
            params: {
                currentPage: 1, //页码，从1开始
                pageSize: 20, //分页大小
            },
            params2: {
                currentPage: 1, //页码，从1开始
                pageSize: 20, //分页大小
            },

            tableData: [],
            tableData2: [],
            total: 0,
            total2: 0,
            pickerOptions2: {
                disabledDate(time) {
                    // 禁用以后的时间
                    return time.getTime() > Date.now() + 16.64e6;
                },
            },
            buttonClick: false,
            iconShow: false,
        };
    },
    watch: {
        timeRange: {
            handler(val) {
                this.params.currentPage = 1;
                this.params2.currentPage = 1;
                //this.getData();
            },
            deep: true,
        },
        "searchForm2.plateNums": {
            handler(val) {
                if (!val.length && this.query.length < 3) {
                    this.searchForm2.plateArr = [];
                }
            },
            deep: true,
        },
        query: {
            handler(val) {
                if (val.length < 3 && !this.searchForm2.plateNums.length) {
                    this.searchForm2.plateArr = [];
                }
            },
            deep: true,
        },
        "searchForm1.numberRange": {
            handler(val) {
                this.searchForm1.maxCompletenessRate = val[1];
                this.searchForm1.minCompletenessRate = val[0];
            },
            immediate: true,
        },
        "searchForm2.numberRange": {
            handler(val) {
                this.searchForm2.maxCompletenessRate = val[1];
                this.searchForm2.minCompletenessRate = val[0];
            },
            immediate: true,
        },
    },
    methods: {
        handleClick() {
            this.buttonClick = !this.buttonClick;
            this.$nextTick(() => {
                this.setTableHeight();
            });
            this.setDialogWidth();
        },
        //对接接口的排序方法
        sortChange(column, prop, order) {
            console.log(column, prop, order);
            this.searchForm1.orderDir = !column.order
                ? ""
                : column.order === "ascending"
                ? "asc"
                : "desc";
            this.searchForm1.orderColumn = !column.prop ? "" : column.prop;
            this.searchForm2.orderDir = !column.order
                ? ""
                : column.order === "ascending"
                ? "asc"
                : "desc";
            this.searchForm2.orderColumn = !column.prop ? "" : column.prop;
            console.log(
                "this.searchForm2.orderColumn==",
                this.searchForm2.orderColumn,
                this.searchForm2.orderDir
            );
            this.getData();
        },

        //排序
        handleSortChange(column, prop, order) {
            this.params.orderDir = !column.order
                ? ""
                : column.order == "ascending"
                ? "asc"
                : "desc";
            this.params.orderColumn = !column.prop ? "" : column.prop;
            this.getData();
        },
        //排序
        handleSortChange2(column, prop, order) {
            this.params2.orderDir = !column.order
                ? ""
                : column.order == "ascending"
                ? "asc"
                : "desc";
            this.params2.orderColumn = !column.prop ? "" : column.prop;
            this.getData();
        },

        nodeClick(data) {
            this.searchForm1.organizeId = data;
            let dataArr = [];
            dataArr.push(data);
            this.$refs.asyncTree.setCheckedKeys(dataArr);
        },
        getPlateNumList(params) {
            this.loading = true;
            this.$api.getCarList(params).then((res) => {
                this.searchForm2.plateArr = res.data.carList;
                this.loading = false;
            });
        },
        remoteMethod(query) {
            this.query = query;
            if (query.length >= 3) {
                this.getPlateNumList({ plateNum: query });
            }
        },
        // 获取组织树
        getOrgTree() {
            this.$api.getOrgTree().then((res) => {
                if (res.success == true) {
                    this.treeData = res.data;
                    this.treeDataToArr(res.data);
                    this.$nextTick(() => {
                        this.searchForm1 = this.$store.state.tree.showSearchForm
                            ? this.$store.state.tree.showSearchForm
                            : this.searchForm1;
                        this.getData();
                    });
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
        keepTwoZero(num) {
            let result = parseFloat(num);
            if (isNaN(result)) {
                return false;
            }
            result = Math.round(num * 100) / 100;
            let s_x = result.toString(); //将数字转换为字符串
            let pos_decimal = s_x.indexOf("."); //小数点的索引值
            // 当整数时，pos_decimal=-1 自动补0
            if (pos_decimal < 0) {
                pos_decimal = s_x.length;
                s_x += ".";
            }
            // 当数字的长度< 小数点索引+2时，补0
            while (s_x.length <= pos_decimal + 2) {
                s_x += "0";
            }
            return s_x;
        },
        handleSizeChange(val) {
            this.params.pageSize = val;
            this.getData();
        },
        handleSizeChange2(val) {
            this.params2.pageSize = val;
            this.getData();
        },
        handleCurrentChange(val) {
            this.params.currentPage = val;
            this.getData();
        },
        handleCurrentChange2(val) {
            this.params2.currentPage = val;
            this.getData();
        },
        goExport() {
            if (this.total > 50000) {
                this.$message.error(this.$t("common.unableEport50000"));
            } else {
                this.loadingAll = true;
                let params = {};
                if (this.timeRange && this.timeRange.length > 0) {
                    params["startDate"] = TimeUtil.getDate(this.timeRange[0]);
                    params["endDate"] = TimeUtil.getDate(this.timeRange[1]);
                } else {
                    params["startDate"] = "";
                    params["endDate"] = "";
                }
                if (this.activeName == "2") {
                    // 按车辆
                    // this.searchLoading = true;
                    params["organizeId"] = this.searchForm2.organizeId;
                    params["plateNums"] = this.searchForm2.plateNums;
                    params["manufacturerType"] =
                        this.searchForm2.manufacturerType;
                    params["maxCompletenessRate"] =
                        this.searchForm2.maxCompletenessRate;
                    params["minCompletenessRate"] =
                        this.searchForm2.minCompletenessRate;

                    this.$api.exportCarTrackCompleteness(params).then((res) => {
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
                                this.$t("common.exportFailed") + ":" +res.msg
                            );
                            this.loadingAll = false;
                        }
                    });
                } else {
                    params["organizeId"] = this.searchForm1.organizeId;
                    params["maxCompletenessRate"] =
                        this.searchForm1.maxCompletenessRate;
                    params["minCompletenessRate"] =
                        this.searchForm1.minCompletenessRate;
                    this.$api
                        .exportCarTrackCompletenessGroupByOrg(params)
                        .then((res) => {
                            if (res.success == true) {
                                var fileName = res.data.fileName;
                                let _this = this;
                                _this.getExportResultInterval =
                                    window.setInterval(function () {
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
                                                        (process.env.BASE_API ==
                                                        "/"
                                                            ? ""
                                                            : process.env
                                                                  .BASE_API) +
                                                        "/excel?fileName=" +
                                                        fileName;
                                                    iframe.style.display =
                                                        "none";
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
                                    }, 2000);
                            } else {
                                this.$message.error(
                                    this.$t("common.exportFailed") +
                                        ":" +
                                        +res.msg
                                );
                                this.loadingAll = false;
                            }
                        });
                }
            }
        },
        goDetail(id, orgName) {
            this.activeName = "2";
            this.searchForm2.organizeId = id;
            let startDate = "";
            let endDate = "";
            if (this.timeRange && this.timeRange.length > 0) {
                startDate = TimeUtil.getDate(this.timeRange[0]);
                endDate = TimeUtil.getDate(this.timeRange[1]);
            } else {
                startDate = new Date();
                endDate = new Date();
            }
            this.$nextTick(() => {
                this.getData();
                this.setWrap();
            });
            // this.$router.push({
            //     path: "/reportCenter/vehicleTrackIntegrityRate/detail",
            //     query: {
            //         organizeId: id,
            //         orgName,
            //         startDate,
            //         endDate,
            //     },
            // });
        },
        goCarDetail(item) {
            console.log(item);
            let startDate = "";
            let endDate = "";
            if (this.timeRange && this.timeRange.length > 0) {
                startDate = TimeUtil.getDate(this.timeRange[0]);
                endDate = TimeUtil.getDate(this.timeRange[1]);
            } else {
                this.timeRange = [
                    new Date(new Date() - 7 * 24 * 60 * 60 * 1000),
                    new Date(),
                ];
                startDate = TimeUtil.getDate(this.timeRange[0]);
                endDate = TimeUtil.getDate(this.timeRange[1]);
            }
            this.$router.push({
                path: "/reportCenter/vehicleTrackIntegrityRate/carDetail",
                query: {
                    deviceCode: item.deviceCodes,
                    plateNum: item.plateNum,
                    startDate,
                    endDate,
                },
            });
        },
        goTrackIncomplete(item) {
            this.dialogPlateNum = "";
            this.dialogTime = "";
            this.dialogPlateNum = item.plateNum;
            this.dialogTime = JSON.stringify([
                new Date(
                    TimeUtil.getDate(this.timeRange[0]) + " 00:00:00"
                ).getTime(),
                new Date(
                    TimeUtil.getDate(this.timeRange[1]) + " 23:59:59"
                ).getTime(),
            ]);
            this.dialogTableVisible = true;
            // this.$router.push({
            //   path:'/reportCenter/trackIncompleteDetails',
            //   query:{
            //     plateNum:item.plateNum,
            //     time:JSON.stringify([new Date((TimeUtil.getDate(this.timeRange[0])+' 00:00:00')).getTime(),new Date((TimeUtil.getDate(this.timeRange[1])+' 23:59:59')).getTime()])
            //   }
            // })
        },
        // 重置表单
        handleReset(ref) {
            if (ref !== undefined) {
                ref.resetFields();
                this.timeRange = [
                    new Date(new Date() - 7 * 24 * 60 * 60 * 1000),
                    new Date(),
                ];
                this.searchForm2.activeName =
                    this.activeName == "2" ? "2" : "1";
                this.$store.dispatch("SetCondtion", this.searchForm2);
                this.$store.dispatch("SetShowSearchForm", this.searchForm1);
                this.$store.dispatch("SetTime", this.timeRange);
            }
        },
        changeWay() {
            // this.handleReset(this.$refs.searchForm1);
            // this.handleReset(this.$refs.searchForm2);
            this.searchForm2.activeName = this.activeName == "2" ? "2" : "1";

            if (this.activeName === "2") {
                this.searchForm2.numberRange = this.searchForm1.numberRange;
                this.searchForm2.maxCompletenessRate =
                    this.searchForm2.numberRange[1];
                this.searchForm2.minCompletenessRate =
                    this.searchForm2.numberRange[0];
            } else {
                this.searchForm1.numberRange = this.searchForm2.numberRange;
                this.searchForm1.maxCompletenessRate =
                    this.searchForm1.numberRange[1];
                this.searchForm1.minCompletenessRate =
                    this.searchForm1.numberRange[0];
            }

            this.$store.dispatch("SetCondtion", this.searchForm2);
            this.$store.dispatch("SetTabName", this.activeName);

            // this.timeRange = [
            //     new Date(new Date() - 7 * 24 * 60 * 60 * 1000),
            //     new Date(),
            // ];
            this.tableData = [];
            this.tableData2 = [];
            this.total = 0;
            this.total2 = 0;
            this.params.currentPage = 1;
            this.params2.currentPage = 1;
            this.params.pageSize = 20;
            this.params2.pageSize = 20;
            this.$store.dispatch("SetShowSearchForm", this.searchForm1);
            this.$store.dispatch("SetTime", this.timeRange);
            this.getData();
            this.$nextTick(() => {
                this.setWrap();
            });
        },
        getData(isSearch) {
            this.searchLoading = true;
            this.$store.dispatch("SetShowSearchForm", this.searchForm1);
            this.$store.dispatch("SetTime", [
                TimeUtil.getDate(this.timeRange[0]),
                TimeUtil.getDate(this.timeRange[1]),
            ]);

            this.searchForm1 = this.$store.state.tree.showSearchForm
                ? this.$store.state.tree.showSearchForm
                : this.searchForm1;
            this.searchForm2 = this.$store.state.tree.searchForm
                ? this.$store.state.tree.searchForm
                : this.searchForm2;
            this.timeRange = this.$store.state.tree.time
                ? this.$store.state.tree.time
                : this.timeRange;
            let params = {};
            if (this.timeRange && this.timeRange.length > 0) {
                params["startDate"] = TimeUtil.getDate(this.timeRange[0]);
                params["endDate"] = TimeUtil.getDate(this.timeRange[1]);
            } else {
                params["startDate"] = "";
                params["endDate"] = "";
            }
            console.log(
                "this.searchForm2.orderColumn=",
                this.searchForm2.orderColumn,
                this.searchForm2.orderDir
            );

            if (this.activeName == "2") {
                // 按车辆
                this.$refs.searchForm2.validate((valid) => {
                    if (!valid) {
                        return;
                    }
                });
                this.$store.dispatch("SetCondtion", this.searchForm2);

                this.searchForm2 = this.$store.state.tree.searchForm
                    ? this.$store.state.tree.searchForm
                    : this.searchForm2;

                params["organizeId"] = this.searchForm2.organizeId;
                params["plateNums"] = this.searchForm2.plateNums;
                params["manufacturerType"] = this.searchForm2.manufacturerType;
                params["maxCompletenessRate"] =
                    this.searchForm2.maxCompletenessRate;
                params["minCompletenessRate"] =
                    this.searchForm2.minCompletenessRate;
                params["orderDir"] = this.searchForm2.orderDir;
                params["orderColumn"] = this.searchForm2.orderColumn;

                let carParam = Object.assign(params, this.params2);
                console.log(
                    "this.searchForm2.orderColumn=",
                    this.searchForm2.orderColumn,
                    this.searchForm2.orderDir
                );
                this.$api
                    .pageCarTrackCompleteness(carParam)
                    .then((res) => {
                        if (res.success == true) {
                            res.data.results.forEach((item) => {
                                // item.trackMissSegment = item.trackMissSegment ? Number(item.trackMissSegment.toFixed(2)) : 0.00;
                                item.trackSegment = item.trackSegment
                                    ? Number(item.trackSegment.toFixed(2))
                                    : 0.0;
                                item.missMileage = item.missMileage
                                    ? Number(item.missMileage.toFixed(2))
                                    : 0.0;
                                item.totalMileage = item.totalMileage
                                    ? Number(item.totalMileage.toFixed(2))
                                    : 0.0;
                                item.trackCompletenessRate =
                                    item.trackCompletenessRate
                                        ? Number(
                                              (
                                                  item.trackCompletenessRate *
                                                  100
                                              ).toFixed(2)
                                          )
                                        : 0.0;
                            });
                            // this.tableData2 = ((res.data.results.length && res.data.totalRecords) || (!res.data.results.length && !res.data.totalRecords)) ? res.data.results : this.tableData

                            this.tableData2 =
                                (res.data.results.length &&
                                    res.data.totalRecords) ||
                                (!res.data.results.length &&
                                    !res.data.totalRecords)
                                    ? res.data.results
                                    : this.tableData2;

                            this.total2 = res.data.totalRecords;
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
                //按组织
                this.$refs.searchForm1.validate((valid) => {
                    if (!valid) {
                        return;
                    }
                });
                let groupParam = Object.assign(
                    params,
                    this.searchForm1,
                    this.params
                );
                this.$api
                    .pageCarTrackCompletenessGroupByOrg(groupParam)
                    .then((res) => {
                        if (res.success == true) {
                            res.data.results.forEach((item) => {
                                // item.trackMissSegment = item.trackMissSegment ? Number(item.trackMissSegment.toFixed(2)) : 0.00;
                                item.trackSegment = item.trackSegment
                                    ? Number(item.trackSegment.toFixed(2))
                                    : 0.0;
                                item.missMileage = item.missMileage
                                    ? Number(item.missMileage.toFixed(2))
                                    : 0.0;
                                item.totalMileage = item.totalMileage
                                    ? Number(item.totalMileage.toFixed(2))
                                    : 0.0;
                                item.trackCompletenessRate =
                                    item.trackCompletenessRate
                                        ? Number(
                                              (
                                                  item.trackCompletenessRate *
                                                  100
                                              ).toFixed(2)
                                          )
                                        : 0.0;
                            });
                            // this.tableData = ((res.data.results.length && res.data.totalRecords) || (!res.data.results.length && !res.data.totalRecords)) ? res.data.results : this.tableData2

                            this.tableData =
                                (res.data.results.length &&
                                    res.data.totalRecords) ||
                                (!res.data.results.length &&
                                    !res.data.totalRecords)
                                    ? res.data.results
                                    : this.tableData;

                            console.log(this.tableData);
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
                this.$refs.searchPagination.clientHeight -
                152;
        },
        setWrap() {
            if (
                this.$refs.wrap.scrollHeight > 74 ||
                this.$refs.wrap1.scrollHeight > 74
            ) {
                this.iconShow = true;
            } else {
                this.iconShow = false;
            }
        },
        noVisible() {
            this.dialogTableVisible = false;
            this.dialogPlateNum = "";
            this.dialogTime = "";
        },
        setDialogWidth() {
            var val = document.body.clientWidth;
            const def = 1800; // 默认宽度
            if (val < def) {
                this.dialogWidth = Number(val - 20);
            } else {
                this.dialogWidth = Number(def);
            }
        },
    },
    mounted() {
        this.setWrap();
        const that = this;
        window.onresize = () => {
            return (() => {
                that.setTableHeight();
                that.setDialogWidth();
                that.setWrap();
            })();
        };
    },
    created() {
        this.timeRange = this.$store.state.tree.time
            ? this.$store.state.tree.time
            : this.timeRange;
        this.activeName =
            this.$store.state.tree.searchForm &&
            this.$store.state.tree.searchForm.activeName == "2"
                ? "2"
                : "1";
        this.setDialogWidth();
        this.getOrgTree();
    },
};
</script>

<style lang="less" scoped>
/deep/.el-tabs {
    .el-tabs__header {
        margin: 0 0 12px !important;
    }
}
.wrap {
    // height: 100%;
    display: flex;
    flex-direction: column;
    // justify-content: space-between;
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
        height: 74px;
        overflow: hidden;
    }
}
.wrap-top-right {
    display: flex;
    flex-direction: row-reverse;
    .goExport {
        margin-left: 10px;
    }
}
.wrap-bottom {
    border-top: 1px solid #e4e4e4;
}
/deep/.el-select {
    .el-input__inner {
        height: 32px !important;
    }
}
</style>
