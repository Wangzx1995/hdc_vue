<template>
    <div>
        <!-- 左边树 -->
        <el-col :span="4" class="b-r">
            <div
                :class="{ loading_: searchLoading || searchLoading2 }"
                class="p-a tree"
            >
                <el-tree
                    ref="tree"
                    :data="treeData"
                    :default-expanded-keys="expandedList"
                    @node-click="handleNodeClick"
                    default-icon="el-icon-folder"
                    highlight-current
                    node-key="id"
                    :props="defaultProps"
                    :filter-node-method="filterNode"
                    :current-node-key="params.orgId"
                    :style="{ height: treeHeight + 'px' }"
                    :expand-on-click-node="false"
                ></el-tree>
            </div>
        </el-col>
        <!-- 右边列 -->
        <el-col :span="20" style="height: 100%">
            <div class="wrap">
                <!-- <div class="p-a-md health-count">
                    <div layout="column">
                        <span class="text-md">故障设备数/设备总数</span>
                        <span class="text-2x">{{FaultNum}}/{{totalNum}}</span>
                    </div>
                    <div layout="column">
                        <span class="text-md">已处理故障数</span>
                        <span class="text-2x">{{handledFaultNum}}</span>
                    </div>
                    <div layout="column">
                        <span class="text-md">遗留故障数</span>
                        <span class="text-2x">{{leaveFaultNum}}</span>
                    </div>
                </div> -->
                <div class="search">
                    <el-form
                        :rules="rules"
                        :model="searchForm"
                        inline
                        label-position="left"
                        ref="searchForm"
                    >
                        <el-form-item label="时间范围">
                            <el-date-picker
                                v-model="time"
                                type="daterange"
                                :clearable="false"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                            />
                        </el-form-item>
                        <el-form-item prop="faultTypes" label="故障类型">
                            <TreeSelect
                                :treeData="allFaultType"
                                show-checkbox
                                check-model="child"
                                style="width: 300px"
                                collapse-tags
                                filter
                                placeholder="请选择故障类型"
                                v-model="searchForm.faultTypes"
                            >
                            </TreeSelect>
                        </el-form-item>
                    </el-form>
                    <div class="button">
                        <el-button
                            type="primary"
                            :loading="searchLoading"
                            @click="search()"
                            >查询</el-button
                        >
                        <el-button type="default" @click="handleReset()"
                            >清除条件</el-button
                        >
                    </div>
                </div>
                <div class="faultDetail">
                    <el-card class="box-card faultDetail_item m-r-md">
                        <el-tabs v-model="activeName" @tab-click="handleClick">
                            <el-tab-pane label="故障项分布" name="first">
                                <div v-if="flag" class="el-table__empty-block">
                                    <span
                                        class="el-table__empty-text"
                                        style="font-size: 14px !important"
                                    >
                                        暂无数据
                                    </span>
                                </div>
                                <FaultDeviceTypeDistribution
                                    v-if="params.orgId"
                                    :dataData="dataData"
                                    :flag="flag"
                                    :activeName="activeName"
                                ></FaultDeviceTypeDistribution>
                            </el-tab-pane>
                            <el-tab-pane label="故障类型分布" name="second">
                                <div
                                    v-if="flagNew"
                                    class="el-table__empty-block"
                                >
                                    <span
                                        class="el-table__empty-text"
                                        style="font-size: 14px !important"
                                    >
                                        暂无数据
                                    </span>
                                </div>
                                <FaultTypePie
                                    v-if="params.orgId"
                                    :faultTypeArr="faultTypeArr"
                                    :flag="flagNew"
                                ></FaultTypePie>
                            </el-tab-pane>
                        </el-tabs>
                    </el-card>
                    <el-card class="box-card faultDetail_item">
                        <EquipmentFailureBlackList
                            v-if="params.orgId"
                            :tableData="tableData"
                        ></EquipmentFailureBlackList>
                    </el-card>
                </div>
                <div class="search">
                    <div class="m-t">
                        <el-form
                            :model="searchRate"
                            inline
                            label-position="left"
                        >
                            <el-form-item label="时间范围">
                                <el-date-picker
                                    :clearable="false"
                                    v-model="timeRate"
                                    type="daterange"
                                    :picker-options="pickerOptions2"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                />
                            </el-form-item>
                        </el-form>
                    </div>
                    <div class="button">
                        <el-button
                            type="primary"
                            :loading="searchLoading2"
                            @click="getIntactRateTrend()"
                            >查询</el-button
                        >
                        <el-button type="default" @click="handleResetRate()"
                            >清除条件</el-button
                        >
                    </div>
                </div>
                <div class="line">
                    <div class="line_title">
                        <h3 class="text-md health">完好率趋势图</h3>
                    </div>
                    <!-- <span v-if='noData' class="no_data">暂无数据</span> -->
                    <!-- <div v-if='noData' class="el-table__empty-block" style="width: 701px;"><span class="el-table__empty-text"> 暂无数据</span></div> -->
                    <div
                        id="main"
                        ref="line"
                        style="height: 300px; width: 100%"
                    ></div>
                </div>
                <div :style="{ height: `${tableHeight}px` }" class="holiday">
                    <div class="month_health">
                        <h3 class="text-md">月健康状态</h3>
                    </div>
                    <div class="month_picker">
                        <HolidayPicker
                            @calendarChange="calendarChange"
                            class="holiday-picker"
                            :holidayList.sync="currentHolidayList"
                            readonly
                        >
                            <template slot-scope="scope">
                                <div class="date-info mydate">
                                    <!-- 日期信息 -->
                                    <h2>
                                        {{
                                            scope.item &&
                                            scope.item.date.getDate()
                                        }}
                                    </h2>
                                    <span class="custom-date">
                                        <p
                                            v-if="
                                                currentHolidayList.length > 0 &&
                                                scope.item.isHoliday
                                            "
                                        >
                                            <span
                                                :class="
                                                    dayFaultObj[
                                                        scope.item.solarDateStr
                                                    ] == 0
                                                        ? 'green'
                                                        : 'red'
                                                "
                                            >
                                                {{
                                                    dayFaultObj[
                                                        scope.item.solarDateStr
                                                    ] == 0
                                                        ? "健康"
                                                        : "设备故障数/总数"
                                                }}
                                            </span>
                                        </p>
                                        <p>
                                            <span
                                                v-for="(
                                                    element, index
                                                ) in calendarData"
                                                :key="index"
                                                :class="
                                                    dayFaultObj[
                                                        scope.item.solarDateStr
                                                    ] &&
                                                    dayFaultObj[
                                                        scope.item.solarDateStr
                                                    ] == 0
                                                        ? 'green'
                                                        : 'red'
                                                "
                                            >
                                                <span
                                                    v-if="
                                                        element.date ==
                                                        scope.item.solarDateStr
                                                    "
                                                    class="content-num"
                                                >
                                                    <span
                                                        v-if="
                                                            dayFaultObj[
                                                                scope.item
                                                                    .solarDateStr
                                                            ] &&
                                                            dayFaultObj[
                                                                scope.item
                                                                    .solarDateStr
                                                            ] > 0
                                                        "
                                                        >{{
                                                            element.faultDeviceNum
                                                        }}/{{
                                                            element.totalDeviceNum
                                                        }}</span
                                                    >
                                                </span>
                                            </span>
                                        </p>
                                        <!-- <p v-if="scope.item.isHoliday">
                                            <span v-for="(element,index) in calendarData" :key="index">
                                                <p :class="element.faultDeviceNum>0?'red':'green'">{{element.faultDeviceNum>0 ? '故障数/总数' : '健康'}}</p>
                                                <p v-if="element.date==scope.item.solarDateStr&&element.faultDeviceNum>0" class="content-num">
                                                    <span>{{element.faultDeviceNum}}/{{element.totalDeviceNum}}</span>
                                                </p>
                                            </span>
                                        </p> -->
                                    </span>
                                </div>
                            </template>
                        </HolidayPicker>
                    </div>
                </div>
            </div>
        </el-col>
    </div>
</template>
<script>
import * as echarts from "echarts";
import TreeSelect from "@/components/hui-pro/tree-select/src/tree-select.vue";
import "@/components/hui-pro/tree-select/theme/index.scss";
import HolidayPicker from "@/components/hui-pro/holiday-picker/src/holiday-picker.vue";
import "@/components/hui-pro/holiday-picker/theme/index.scss";
import FaultDeviceTypeDistribution from "./components/faultDeviceTypeDistribution.vue";
import FaultTypePie from "./components/faultTypePie.vue";
import EquipmentFailureBlackList from "./components/equipmentFailureBlackList";
import TimeUtil from "@/utils/time";
export default {
    components: {
        FaultDeviceTypeDistribution,
        EquipmentFailureBlackList,
        HolidayPicker,
        TreeSelect,
        FaultTypePie,
    },
    data() {
        const checkNumber = function (rule, value, callback) {
            if (value.length < 3 && value.length) {
                callback(new Error("至少查询三种故障类型"));
            } else {
                callback();
            }
        };
        return {
            searchLoading: true,
            searchLoading2: true,
            treeData: [],
            expandedList: [],
            defaultProps: {
                children: "children",
                label: "name",
            },
            params: {
                orgId: "",
                month: new Date(),
            },
            searchForm: {
                faultTypes: [],
                orgId: "",
                startDate: TimeUtil.getDate(
                    new Date(new Date() - 7 * 24 * 60 * 60 * 1000)
                ),
                endDate: TimeUtil.getDate(new Date()),
            },
            activeName: "first",
            allFaultType: [],
            time: [new Date(new Date() - 7 * 24 * 60 * 60 * 1000), new Date()],
            treeHeight: 500,
            leaveFaultNum: 0,
            handledFaultNum: 0,
            FaultNum: 0,
            totalNum: 0,
            calendarData: [],
            currentHolidayList: [],
            dayFaultObj: {},
            tableHeight: 500,
            intactRateX: [],
            intactRateY: [],
            tableData: [],
            dataData: [],
            faultTypeArr: [],
            timeRate: [
                new Date(new Date() - 7 * 24 * 60 * 60 * 1000),
                new Date() - 24 * 60 * 60 * 1000,
            ],
            searchRate: {
                orgId: "",
                startDate: TimeUtil.getDate(
                    new Date(new Date() - 7 * 24 * 60 * 60 * 1000)
                ),
                endDate: TimeUtil.getDate(new Date() - 24 * 60 * 60 * 1000),
            },
            flag: false,
            flagNew: false,
            noData: false,
            rules: {
                faultTypes: [
                    {
                        validator: checkNumber.bind({ type: "array" }),
                        trigger: "blur",
                    },
                ],
            },
            pickerOptions2: {
                disabledDate(time) {
                    // 禁用以后的时间
                    return time.getTime() > Date.now() - 24 * 60 * 60 * 1000;
                },
            },
        };
    },
    watch: {
        time: {
            handler(val) {
                this.searchForm.startDate = TimeUtil.getDate(val[0]);
                this.searchForm.endDate = TimeUtil.getDate(val[1]);
            },
            deep: true,
            immediate: false,
        },
        timeRate: {
            handler(val) {
                this.searchRate.startDate = TimeUtil.getDate(val[0]);
                this.searchRate.endDate = TimeUtil.getDate(val[1]);
            },
            deep: true,
            immediate: false,
        },
    },
    methods: {
        //重置完好率条件
        handleResetRate() {
            //this.timeRate = []
            this.timeRate = [
                new Date(new Date() - 7 * 24 * 60 * 60 * 1000),
                new Date() - 24 * 60 * 60 * 1000,
            ];
        },
        //重置故障分布及黑榜条件
        handleReset() {
            //this.time = []
            this.searchForm.faultTypes = [];
            this.time = [
                new Date(new Date() - 7 * 24 * 60 * 60 * 1000),
                new Date(),
            ];
        },
        search() {
            this.$refs.searchForm.validate((valid) => {
                if (valid) {
                    this.getFaults();
                }
            });
        },
        handleClick(tab, event) {
            this.activeName = tab.name;
            // console.log(this.activeName)
        },
        //设备完好率趋势
        getIntactRateTrend() {
            this.intactRateX = [];
            this.intactRateY = [];
            if (!this.searchRate.orgId) {
                this.$message.error(this.$t("common.organizationIsEmpty"));
            } else {
                this.searchLoading2 = true;
                this.$api.deviceIntactRateTrend(this.searchRate).then((res) => {
                    if (res.success == true) {
                        if (res.data && res.data.length > 0) {
                            const intactRate = res.data;
                            intactRate.map((i) => {
                                this.intactRateX.push(i.date);
                                const rate = i.intactRate * 100;
                                this.intactRateY.push(rate);
                            });
                            this.initCharts();
                            this.noData = false;
                        } else {
                            this.noData = true;
                        }
                        this.searchLoading2 = false;
                    } else {
                        this.$message.error(res.msg);
                        this.searchLoading2 = false;
                    }
                });
            }
        },
        //故障项分布
        getFaults() {
            if (!this.searchForm.orgId) {
                this.$message.error(this.$t("common.organizationIsEmpty"));
            } else {
                this.searchLoading = true;
                Promise.all([
                    this.$api.getFaultTypeStatistics(this.searchForm),
                    this.$api.faultGroupStatistics(this.searchForm),
                ]).then((res) => {
                    if (res[0].success && res[1].success) {
                        if (res[0].data != null && res[0].data.length > 0) {
                            let tempData = res[0].data;
                            let count = 0;
                            let totalElse = 0;
                            let data = [];
                            while (tempData.length >= 1 && count <= 4) {
                                count++;
                                let tempObj = tempData.shift();
                                let value = Number(
                                    tempObj.num ? tempObj.num : 0
                                );
                                let name = tempObj.faultTypeDecs;
                                let resObj = { value, name };
                                data.push(resObj);
                            }
                            if (tempData.length > 0) {
                                tempData.forEach((item) => {
                                    totalElse += Number(
                                        item.num ? item.num : 0
                                    );
                                });
                            }
                            if (totalElse > 0) {
                                data.push({ value: totalElse, name: "其他" });
                            }
                            var total = 0;
                            var percentTotal = 0;
                            var tarValue;
                            var percent;
                            data.forEach((item, i) => {
                                total += Number(item.value);
                            });
                            data.forEach((item, i) => {
                                tarValue = Number(item.value ? item.value : 0);
                                percent = ((tarValue / total) * 100).toFixed(2);
                                console.log("total===", total);
                                console.log("tarValue===", tarValue);
                                console.log("percent===", percent);
                                percentTotal += Number(percent);

                                data[i].percent = percent;
                            });
                            percentTotal = percentTotal.toFixed(2);
                            var num = (percentTotal - 100.0).toFixed(2);
                            console.log("percentTotal===", percentTotal, num);
                            if (percentTotal != 100) {
                                data.forEach((item, i) => {
                                    if (item.name == "其他") {
                                        item.percent -= num;
                                        item.percent = item.percent.toFixed(2);
                                    }
                                });
                            }
                            this.dataData = data;
                            this.flag = false;
                        } else {
                            this.flag = true;
                        }
                        if (res[1].data != null && res[1].data.length > 0) {
                            let tempData = res[1].data;
                            let count = 0;
                            let totalElse = 0;
                            let data = [];
                            while (tempData.length >= 1 && count <= 7) {
                                count++;
                                let tempObj = tempData.shift();
                                let value = Number(
                                    tempObj.num ? tempObj.num : 0
                                );
                                let name = tempObj.faultGroupDecs;
                                let resObj = { value, name };
                                data.push(resObj);
                            }
                            if (tempData.length > 0) {
                                tempData.forEach((item) => {
                                    totalElse += Number(
                                        item.num ? item.num : 0
                                    );
                                });
                            }
                            if (totalElse > 0) {
                                data.push({ value: totalElse, name: "其他" });
                            }

                            var totalNew = 0;
                            var percentTotalNew = 0;
                            var tarValueNew;
                            var percentNew;
                            data.forEach((item, i) => {
                                totalNew += Number(item.value);
                            });
                            data.forEach((item, i) => {
                                tarValueNew = Number(
                                    item.value ? item.value : 0
                                );
                                percentNew = (
                                    (tarValueNew / totalNew) *
                                    100
                                ).toFixed(2);
                                console.log("totalNew===", totalNew);
                                console.log("tarValueNew===", tarValueNew);
                                console.log("percentNew===", percentNew);
                                percentTotalNew += Number(percentNew);

                                data[i].percent = percentNew;
                            });
                            percentTotalNew = percentTotalNew.toFixed(2);
                            var num = (percentTotalNew - 100.0).toFixed(2);
                            console.log(
                                "percentTotalNew===",
                                percentTotalNew,
                                num
                            );
                            if (percentTotalNew != 100) {
                                data.forEach((item, i) => {
                                    if (item.name == "其他") {
                                        item.percent -= num;
                                        item.percent =
                                            item.percentNew.toFixed(2);
                                    }
                                });
                            }

                            this.faultTypeArr = data;
                            this.flagNew = false;
                        } else {
                            this.flagNew = true;
                        }
                        this.getBlackList();
                        this.searchLoading = false;
                    } else {
                        this.$message.error(
                            "获取设备故障黑榜数据失败" + res[0].msg
                        );
                        this.$message.error(
                            "获取故障类型分布数据失败" + res[1].msg
                        );
                        this.searchLoading = false;
                    }
                });
            }
        },

        //故障黑榜
        getBlackList() {
            this.$api
                .getDeviceFaultNumBlackList(this.searchForm)
                .then((res) => {
                    if (res.success == true) {
                        this.tableData = res.data;
                        this.tableData = this.tableData.splice(0, 20);
                    } else {
                        this.$message.error(
                            "获取设备故障黑榜数据失败" + res.msg
                        );
                    }
                });
        },
        //获取待处理故障类型
        getAllFaultType() {
            this.$api.getAllFaultType().then((res) => {
                if (res.success == true) {
                    const allFaultType = res.data;
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
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        //完好率趋势图
        initCharts() {
            // 初始化echarts实例
            const myChart = echarts.init(this.$refs.line);
            // 绘制图表
            const option = {
                xAxis: {
                    type: "category",
                    data: this.intactRateX,
                    boundaryGap: false,
                },
                yAxis: {
                    type: "value",
                },
                grid: {
                    left: "3%",
                    right: "3%",
                    bottom: "13%",
                    containLabel: true,
                },
                tooltip: {
                    trigger: "axis",
                    axisPointer: {
                        type: "cross",
                        label: {
                            backgroundColor: "#6a7985",
                        },
                    },
                    formatter: (data) => {
                        return (
                            data[0].name +
                            "</br>" +
                            "完好率趋势：" +
                            data[0].value +
                            "%"
                        );
                    },
                },
                series: [
                    {
                        data: this.intactRateY,
                        type: "line",
                        areaStyle: {
                            color: "#39B1FC",
                            opacity: 0.3,
                        },
                        symbol: "none",
                        lineStyle: {
                            color: "#39B1FC",
                        },
                        itemStyle: {
                            normal: {
                                // color:'#00FF00'
                            },
                        },
                        smooth: true, //true 为平滑曲线，false为直线
                    },
                ],
            };
            // 配置到实例上
            myChart.setOption(option);
            window.addEventListener("resize", () => {
                myChart.resize();
            });
        },
        //日期改变时
        calendarChange(currentYear, currentMonth) {
            if (currentMonth < 10) {
                currentMonth = "0" + currentMonth;
            }
            this.params.month = currentYear + "-" + currentMonth;
            this.getDeviceHealthStatus(this.params);
        },
        filterNode(value, data) {
            if (!value) return true;
            return data.name.indexOf(value) !== -1;
        },
        //获取树结构
        getTreeData() {
            this.$api.getOrgTree().then((res) => {
                this.treeData = [];
                this.expandedList = [];
                if (res.success == true) {
                    this.treeData = res.data;
                    if (res.data.length > 0) {
                        this.params.orgId = res.data[0].id;
                        this.searchForm.orgId = res.data[0].id;
                        this.searchRate.orgId = res.data[0].id;
                        this.params.month = TimeUtil.format(
                            this.params.month,
                            "YYYY-MM"
                        );
                        if (this.$store.state.tree.defaultOrganizeId) {
                            this.params.orgId =
                                this.$store.state.tree.defaultOrganizeId;
                            this.searchForm.orgId =
                                this.$store.state.tree.defaultOrganizeId;
                            this.searchRate.orgId =
                                this.$store.state.tree.defaultOrganizeId;
                            this.expandedList.push(
                                this.$store.state.tree.defaultOrganizeId
                            );
                        }
                        // this.getFaultView(this.params);
                        this.$nextTick(() => {
                            this.treeData.forEach((m) => {
                                console.log("m.children", m.id);
                                this.expandedList.push(m.id);
                            });
                            this.$refs["tree"].setCurrentKey(this.params.orgId);
                        });
                        this.getDeviceHealthStatus(this.params);
                        this.search();
                        this.getIntactRateTrend();
                    } else {
                        this.searchLoading = false;
                        this.searchLoading2 = false;
                    }
                } else {
                    this, (this.searchLoading = false);
                    this.searchLoading2 = false;
                    this.$message.error("获取组织树列表失败:" + res.msg);
                }
            });
        },
        //获取故障概览
        getFaultView(param) {
            this.$api.getFaultView(param).then((res) => {
                if (res.success == true) {
                    this.FaultNum = res.data.faultDeviceNum;
                    this.totalNum = res.data.totalDeviceNum;
                    this.leaveFaultNum = res.data.unresolvedFaultNum;
                    this.handledFaultNum = res.data.resolvedFaultNum;
                }
                this.searchLoading = false;
            });
        },
        //获取设备健康状态
        getDeviceHealthStatus(params) {
            if (!params.orgId) {
                this.$message.error(this.$t("common.organizationIsEmpty"));
            } else {
                this.$api.getDeviceHealthStatus(params).then((res) => {
                    if (res.success == true) {
                        if (res.data.length > 0) {
                            this.calendarData = res.data;
                            let arrHoliday = [];
                            this.calendarData.forEach((item) => {
                                arrHoliday.push(item.date);
                                this.dayFaultObj[item.date] =
                                    item.faultDeviceNum;
                            });
                            this.currentHolidayList = arrHoliday;
                            this.currentHolidayList =
                                this.currentHolidayList.map((item) => {
                                    let arr = item.split("-");
                                    if (arr[2] < 10) {
                                        arr[2] = "0" + arr[2];
                                    }
                                    return (item = arr.join("-"));
                                });
                        } else {
                            this.currentHolidayList = [];
                        }
                    } else {
                        this.$message.error("获取设备健康状态失败:" + res.msg);
                    }
                    this.searchLoading = false;
                });
            }
        },
        //点击节点时
        handleNodeClick(data) {
            this.activeName = "first";
            this.params.orgId = data.id;
            this.searchForm.orgId = data.id;
            this.searchRate.orgId = data.id;
            this.dayFaultObj = [];
            // this.getFaultView(this.params);
            this.getDeviceHealthStatus(this.params);
            this.search();
            this.getIntactRateTrend();
            this.$store.dispatch("SetDefaultOrganizeId", data.id);
        },
        //设置表格高度
        setTableHeight() {
            this.tableHeight = document.body.clientHeight;
            this.treeHeight = document.body.clientHeight - 110;
        },
    },
    mounted() {
        const that = this;
        window.onresize = () => {
            return (() => {
                that.setTableHeight();
            })();
        };
        // window.addEventListener("resize", () => {
        //     document.getElementsByTagName("canvas")[0].style.width =
        //         document.getElementById("main").clientWidth + "px";
        // });
    },
    created() {
        this.getTreeData();
        this.setTableHeight();
        this.getAllFaultType();
    },
};
</script>

<style lang="less" scoped>
.loading_ {
    pointer-events: none;
}
.wrap {
    height: 100%;
    overflow-y: auto;
    background-color: #f2f2f2;
    background: #ffffff;
}
.health-count {
    background: #ffffff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 100px;
    margin-bottom: 20px;
    div {
        display: flex;
        align-items: center;
        justify-content: center;
        border-right: 1px solid #e4e4e4;
        width: 100%;
        height: 60px;
        &:last-child {
            border: none;
        }
    }
}
.search {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 14px;
    background: #ffffff;
    margin-bottom: -1px;
    .el-form-item {
        margin-bottom: 0px !important;
    }
}
.el-card__body {
    padding: 14px;
}
.faultDetail {
    background: #f2f2f2;
    display: flex;
    width: 100%;
    height: 500px;
    margin-bottom: 20px;
    .faultDetail_item {
        width: 60%;
        background: #ffffff;
    }
}
.line {
    width: 100%;
    height: 360px;
    background: #ffffff;
    margin-bottom: 10px;
    position: relative;
    .line_title {
        height: 40px;
        border-bottom: 1px solid #e4e4e4;
        padding-left: 15px;
    }
    .no_data {
        width: 100%;
        display: inline-block;
        background: #fff;
        height: 300px;
        line-height: 300px;
        text-align: center;
        position: absolute;
        font-size: 25px;
        font-weight: 500;
        z-index: 10;
    }
}
.holiday {
    background: #ffffff;
    .month_health {
        height: 70px;
        border-bottom: 1px solid #e4e4e4;
        padding-top: 25px;
        padding-left: 15px;
    }
}
.holiday-picker {
    border: 1px solid #e4e4e4;
    width: 96%;
    margin: 30px auto 0px;
    .mydate {
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        flex-direction: column;
        span {
            font-size: 18px;
            &.red {
                color: red;
            }
            &.green {
                color: green;
            }
        }
        .content-num {
            display: block;
            text-align: center;
        }
    }
}

.treeHeight {
    height: calc(~"100vh - 7rem");
    overflow-x: scroll;
}
</style>
