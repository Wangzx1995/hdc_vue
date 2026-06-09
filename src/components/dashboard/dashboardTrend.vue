<template>
    <div v-show="enableBigData" class="dashboard-trend">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <!-- 车辆上线率趋势 -->
            <el-tab-pane
                :label="$t('dashboard.trendTabName1')"
                name="1"
                :disabled="searching || cardLoading"
            >
                <div class="trend-link">
                    <el-radio-group
                        v-model="interval"
                        size="mini"
                        type="simple"
                        @change="changeInterval(1)"
                    >
                        <el-radio-button :disabled="searching" :label="0">
                            <!-- 今日 -->
                            {{ $t("dashboard.today") }}
                        </el-radio-button>
                        <el-radio-button :disabled="searching" :label="7">
                            <!-- 近7天 -->
                            {{ $t("dashboard.past7days") }}
                        </el-radio-button>
                        <el-radio-button :disabled="searching" :label="30">
                            <!-- 近30天 -->
                            {{ $t("dashboard.past30days") }}
                        </el-radio-button>
                    </el-radio-group>
                </div>
                <div>
                    <el-row>
                        <el-col v-if="activeName == 1" :span="16"
                            ><div
                                id="main1"
                                style="width: 100%; height: 400px"
                            ></div
                        ></el-col>
                        <el-col :span="8"
                            ><div style="width: 100%; heigth: 400px">
                                <Rank :rankDatas="rankDatas"></Rank></div
                        ></el-col>
                    </el-row>
                </div>
            </el-tab-pane>
            <!-- 故障数趋势 -->
            <el-tab-pane
                :label="$t('dashboard.trendTabName2')"
                name="2"
                :disabled="searching || cardLoading"
            >
                <div class="trend-link">
                    <el-radio-group
                        v-model="interval"
                        size="mini"
                        type="simple"
                        @change="changeInterval(2)"
                    >
                        <el-radio-button :disabled="searching" :label="0">
                            <!-- 今日 -->
                            {{ $t("dashboard.today") }}
                        </el-radio-button>
                        <el-radio-button :disabled="searching" :label="7">
                            <!-- 近7天 -->
                            {{ $t("dashboard.past7days") }}
                        </el-radio-button>
                        <el-radio-button :disabled="searching" :label="30">
                            <!-- 近30天 -->
                            {{ $t("dashboard.past30days") }}
                        </el-radio-button>
                    </el-radio-group>
                </div>
                <div>
                    <el-row>
                        <el-col v-if="activeName == 2" :span="16"
                            ><div
                                id="main2"
                                style="width: 100%; height: 400px"
                            ></div
                        ></el-col>
                        <el-col :span="8"
                            ><div style="width: 100%; heigth: 400px">
                                <Rank :rankDatas="rankDatas"></Rank></div
                        ></el-col>
                    </el-row>
                </div>
            </el-tab-pane>
            <!-- 运行时长趋势 -->
            <el-tab-pane
                :label="$t('dashboard.trendTabName3')"
                name="3"
                :disabled="searching || cardLoading"
            >
                <div class="show-average">
                    <!-- 显示平均值 -->
                    {{ $t("dashboard.displayAverageValue") }}
                    <el-switch
                        v-model="show"
                        size="mini"
                        @change="isShowAverage"
                        :disabled="searching"
                    ></el-switch>
                </div>
                <div class="trend-link">
                    <el-radio-group
                        v-model="interval"
                        size="mini"
                        type="simple"
                        @change="changeInterval(3)"
                    >
                        <el-radio-button :disabled="searching" :label="0">
                            <!-- 今日 -->
                            {{ $t("dashboard.today") }}
                        </el-radio-button>
                        <el-radio-button :disabled="searching" :label="7">
                            <!-- 近7天 -->
                            {{ $t("dashboard.past7days") }}
                        </el-radio-button>
                        <el-radio-button :disabled="searching" :label="30">
                            <!-- 近30天 -->
                            {{ $t("dashboard.past30days") }}
                        </el-radio-button>
                    </el-radio-group>
                </div>
                <div>
                    <el-row>
                        <el-col v-if="activeName == 3" :span="16"
                            ><div
                                id="main3"
                                style="width: 100%; height: 400px"
                            ></div
                        ></el-col>
                        <el-col :span="8"
                            ><div style="width: 100%; heigth: 400px">
                                <Rank :rankDatas="rankDatas"></Rank></div
                        ></el-col>
                    </el-row>
                </div>
                <!-- <div layout>
            <div class="chartBox" id="main3" style="height:400px;"></div> -->
                <!-- <div style="flex:1"><Rank></Rank></div> -->
                <!-- </div> -->
            </el-tab-pane>
            <!-- <el-tab-pane label="流量使用趋势" name="fourth">
          流量使用趋势
        </el-tab-pane> -->
            <!-- 轨迹完整率趋势 -->
            <el-tab-pane
                :label="$t('dashboard.trendTabName4')"
                name="4"
                :disabled="searching || cardLoading"
            >
                <div class="trend-link">
                    <el-radio-group
                        v-model="interval"
                        size="mini"
                        type="simple"
                        @change="changeInterval(4)"
                    >
                        <el-radio-button :disabled="searching" :label="0">
                            <!-- 今日 -->
                            {{ $t("dashboard.today") }}
                        </el-radio-button>
                        <el-radio-button :disabled="searching" :label="7">
                            <!-- 近7天 -->
                            {{ $t("dashboard.past7days") }}
                        </el-radio-button>
                        <el-radio-button :disabled="searching" :label="30">
                            <!-- 近30天 -->
                            {{ $t("dashboard.past30days") }}
                        </el-radio-button>
                    </el-radio-group>
                </div>
                <div>
                    <el-row>
                        <el-col v-if="activeName == 4" :span="16">
                            <div
                                id="main5"
                                style="width: 100%; height: 400px"
                            ></div
                        ></el-col>
                        <el-col :span="8"
                            ><div style="width: 100%; height: 400px">
                                <Rank :rankDatas="rankDatas"></Rank></div
                        ></el-col>
                    </el-row>
                    <!-- <div style="flex:1"><Rank></Rank></div> -->
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
import Rank from "@/components/dashboard/rank.vue";
export default {
    data() {
        return {
            disabled: false,
            enableBigData: false,
            cardLoading: false,
            show: true,
            activeName: "1",
            searching: false,
            interval: 0,
            chartsList: [],
            chartsData: [],
            rankDatas: {
                titleType: 1,
                title: this.$t("dashboard.offlineBlacklisting"),
                rankData: "",
            },
            markLineOption: null,
            dateList: "",
            dateData: "",
            title: "",
            idName: "",
            max: "",
            formatter: "",
            axisLabelFormatter: "",
        };
    },
    props: {
        showItemBoolean: {
            type: Boolean,
            default: false,
        },
        // showItems:{
        //   type:Boolean,
        //   default:false
        // }
    },
    watch: {
        showItemBoolean: {
            handler(val) {
                if (this.activeName == "1") {
                    document.getElementsByTagName("canvas")[0].style.width =
                        document.getElementById("main1").clientWidth + "px";
                } else if (this.activeName == "3") {
                    document.getElementsByTagName("canvas")[1].style.width =
                        document.getElementById("main3").clientWidth + "px";
                } else if (this.activeName == "5") {
                    document.getElementsByTagName("canvas")[2].style.width =
                        document.getElementById("main5").clientWidth + "px";
                }
            },
        },
        // showItems:{
        //   handler(val){
        //     this.getData('');
        //     console.log(val, "lllllllllllllll");
        //     this.showItem = val
        //     console.log(this.showItem)
        //   },
        //   deep: true,
        //   immediate: true,
        // }
    },
    components: { Rank },
    methods: {
        changeInterval(num) {
            if (num == this.activeName) {
                this.getData(1);
            }
        },
        handleClick(tab, event) {
            this.getData("");
        },
        isShowAverage() {
            this.getData(1);
        },
        myEcharts(
            dateList,
            dateData,
            title,
            idName,
            max,
            formatter,
            axisLabelFormatter,
            markLineOption
        ) {
            var myChart = this.$echarts.init(document.getElementById(idName));
            var option = {
                title: {
                    text: title,
                },
                tooltip: {
                    trigger: "axis",
                    formatter: formatter,
                },
                grid: {
                    left: "3%",
                    right: "5%",
                    bottom: "3%",
                    containLabel: true,
                },
                xAxis: [
                    {
                        type: "category",
                        boundaryGap: false,
                        data: dateList,
                    },
                ],
                yAxis: [
                    {
                        type: "value",
                        min: 0,
                        max: max,
                        axisLabel: {
                            formatter: axisLabelFormatter,
                        },
                    },
                ],
                series: [
                    {
                        type: "line",
                        smooth: true,
                        lineStyle: {
                            color: "rgba(24,144,255,100)",
                        },
                        itemStyle: {
                            color: "rgba(24,144,255,100)",
                        },
                        areaStyle: {
                            color: "rgba(232,244,255,100)",
                        },
                        data: dateData,
                        markLine: markLineOption,
                    },
                ],
            };
            myChart.setOption(option);
            this.searching = false;
        },
        getData(type) {
            let dateList = [];
            let dateData = [];
            const param = { interval: this.interval };
            this.searching = true;
            if (this.activeName == "1") {
                this.$api
                    .carOnlineRateTrend(param)
                    .then((res) => {
                        if (res.success == true) {
                            const data = res.data;
                            data.map((i) => {
                                dateList.push(i.time);
                                dateData.push((i.onlineRate * 100).toFixed(2));
                            });
                            this.markLineOption = null;
                            this.myEcharts(
                                dateList,
                                dateData,
                                this.$t("dashboard.onlineRatePercentage"), // "上线率百分比",
                                "main1",
                                100,
                                "{b}<br />" +
                                    this.$t("dashboard.onlineRatePercentage") +
                                    ": {c}%",
                                "{value}%",
                                this.markLineOption
                            );
                            this.dateList = dateList;
                            this.dateData = dateData;
                            this.title = this.$t(
                                "dashboard.onlineRatePercentage"
                            );
                            this.idName = "main1";
                            this.max = 100;
                            (this.formatter =
                                "{b}<br />" +
                                this.$t("dashboard.onlineRatePercentage") +
                                ": {c}%"),
                                "{value}%";
                        } else {
                            this.$message.error(res.msg);
                            this.searching = false;
                        }
                    })
                    .catch((err) => {
                        this.searching = false;
                    });
                if (type) return;
                this.cardLoading = true;
                this.$api
                    .carOfflineLongTimeBlackList()
                    .then((res) => {
                        if (res.success == true) {
                            this.rankDatas.title = this.$t(
                                "dashboard.offlineBlacklisting"
                            ); //"车辆长时间离线黑榜";
                            this.rankDatas.titleType = 1;
                            this.rankDatas.rankData = res.data;
                            this.cardLoading = false;
                        } else {
                            this.$message.error(res.msg);
                            this.cardLoading = false;
                        }
                    })
                    .catch((err) => {
                        this.searching = false;
                        this.cardLoading = false;
                    });
            } else if (this.activeName == "2") {
                this.$api
                    .faultNumTrend(param)
                    .then((res) => {
                        if (res.success == true) {
                            const data = res.data;
                            data.map((i) => {
                                dateList.push(i.time);
                                dateData.push(i.faultNum);
                            });
                            this.markLineOption = null;
                            this.myEcharts(
                                dateList,
                                dateData,
                                this.$t("dashboard.equipmentFailuresNumber"), //"设备故障数",
                                "main2",
                                null,
                                "{b}<br />" +
                                    this.$t(
                                        "dashboard.equipmentFailuresNumber"
                                    ) +
                                    ": {c}",
                                null,
                                this.markLineOption
                            );
                        } else {
                            this.$message.error(res.msg);
                            this.searching = false;
                        }
                    })
                    .catch((err) => {
                        this.searching = false;
                    });
                if (type) return;
                this.cardLoading = true;
                this.$api
                    .deviceFaulteBlackList(param)
                    .then((res) => {
                        if (res.success == true) {
                            this.rankDatas.title = this.$t(
                                "dashboard.equipmentFailuresNumberBlacklisting"
                            ); //"设备故障数黑榜";
                            this.rankDatas.titleType = 2;
                            this.rankDatas.rankData = res.data;
                            this.cardLoading = false;
                        } else {
                            this.$message.error(res.msg);
                            this.cardLoading = false;
                        }
                    })
                    .catch((err) => {
                        this.searching = false;
                        this.cardLoading = false;
                    });
            } else if (this.activeName == "3") {
                if (this.show === false) {
                    this.markLineOption = null;
                } else {
                    let that = this;
                    this.markLineOption = {
                        symbol: "none",
                        data: [
                            {
                                type: "average",
                                // name: "平均值",
                                name: this.$t("dashboard.averageValue"),
                                label: {
                                    normal: {
                                        color: "#999999",
                                        fontSize: 12,
                                        formatter: function (params) {
                                            return (
                                                that.$t(
                                                    "dashboard.averageValue"
                                                ) +
                                                "：\n" +
                                                params.value +
                                                "h"
                                            );
                                        },
                                    },
                                },
                                lineStyle: {
                                    normal: {
                                        color: "#999999",
                                        type: "solid",
                                    },
                                },
                            },
                        ],
                    };
                }
                this.$api
                    .carOnlineTimeTrend(param)
                    .then((res) => {
                        if (res.success == true) {
                            const data = res.data;
                            data.map((i) => {
                                dateList.push(i.time);
                                dateData.push(i.onlineTime.toFixed(2));
                            });
                            this.myEcharts(
                                dateList,
                                dateData,
                                this.$t("dashboard.vehicleOperatingTime"), //"车辆运行时长（h）",
                                "main3",
                                null,
                                "{b}<br />" +
                                    this.$t("dashboard.vehicleOperatingTime") +
                                    ": {c}h",
                                null,
                                this.markLineOption
                            );
                            this.dateList = dateList;
                            this.dateData = dateData;
                            this.title =
                                this.$t("dashboard.vehicleOperatingTime") +
                                "（h）";
                            this.idName = "main3";
                            this.max = null;
                            this.formatter =
                                "{b}<br />" +
                                this.$t("dashboard.vehicleOperatingTime") +
                                ": {c}h";
                        } else {
                            this.$message.error(res.msg);
                            this.searching = false;
                        }
                    })
                    .catch((err) => {
                        this.searching = false;
                    });
                if (type) return;
                this.cardLoading = true;
                this.$api
                    .carOnlineTimeBlackList()
                    .then((res) => {
                        if (res.success == true) {
                            this.rankDatas.title = this.$t(
                                "dashboard.vehicleOperatingTimeBlacklisting"
                            ); //"车辆运行时长黑榜";
                            this.rankDatas.titleType = 3;
                            this.rankDatas.rankData = res.data;
                            this.cardLoading = false;
                        } else {
                            this.$message.error(res.msg);
                            this.cardLoading = false;
                        }
                    })
                    .catch((err) => {
                        this.searching = false;
                        this.cardLoading = false;
                    });
            } else if (this.activeName == "4") {
                this.markLineOption = {
                    symbol: "none",
                    name: this.$t("dashboard.warningLine"), //"警戒线",
                    silent: true,
                    label: {
                        position: "end",
                        formatter: `80%`,
                        color: "#999999",
                        fontSize: 12,
                    },
                    data: [
                        {
                            silent: true,
                            lineStyle: {
                                type: "solid",
                                color: "red",
                            },
                            name: this.$t("dashboard.warningLine"),
                            yAxis: "80",
                        },
                    ],
                };
                this.$api
                    .carTrackCompletenessTrend(param)
                    .then((res) => {
                        if (res.success == true) {
                            const data = res.data;
                            data.map((i) => {
                                dateList.push(i.time);
                                dateData.push(
                                    (i.trackCompletenessRate * 100).toFixed(2)
                                );
                            });
                            this.myEcharts(
                                dateList,
                                dateData,
                                this.$t("dashboard.trajectoryCompletenessRate"), //"轨迹完整率",
                                "main5",
                                100,
                                "{b}<br />" +
                                    this.$t(
                                        "dashboard.trajectoryCompletenessRate"
                                    ) +
                                    ": {c}%",
                                "{value}%",
                                this.markLineOption
                            );
                            this.dateList = dateList;
                            this.dateData = dateData;
                            this.title = this.$t(
                                "dashboard.trajectoryCompletenessRate"
                            ); //"轨迹完整率";
                            this.idName = "main5";
                            this.max = 100;
                            (this.formatter =
                                "{b}<br />" +
                                this.$t(
                                    "dashboard.trajectoryCompletenessRate"
                                ) +
                                ": {c}%"),
                                "{value}%";
                        } else {
                            this.$message.error(res.msg);
                            this.searching = false;
                        }
                    })
                    .catch((err) => {
                        this.searching = false;
                    });
                if (type) return;
                this.cardLoading = true;
                this.$api
                    .carTrackCompletenessBlackList()
                    .then((res) => {
                        if (res.success == true) {
                            this.rankDatas.title = this.$t(
                                "dashboard.trajectoryCompletenessRateBlacklisting"
                            ); //"轨迹完整率黑榜";
                            this.rankDatas.titleType = 4;
                            this.rankDatas.rankData = res.data;
                            this.cardLoading = false;
                        } else {
                            this.$message.error(res.msg);
                            this.cardLoading = false;
                        }
                    })
                    .catch((err) => {
                        this.searching = false;
                        this.cardLoading = false;
                    });
            }
        },
        canvasResize() {
            // this.myEcharts.resize(this.dateList,this.dateData,this.title,this.idName,this.max,this.formatter,this.markLineOption)
            if (this.activeName == "1") {
                document.getElementsByTagName("canvas")[0].style.width =
                    document.getElementById("main1").clientWidth + "px";
            } else if (this.activeName == "3") {
                document.getElementsByTagName("canvas")[1].style.width =
                    document.getElementById("main3").clientWidth + "px";
            } else if (this.activeName == "4") {
                document.getElementsByTagName("canvas")[3].style.width =
                    document.getElementById("main5").clientWidth + "px";
            }
        },
    },
    created() {
        const flag = Number(localStorage.getItem("enableBigData"));
        if (flag == 0) {
            this.enableBigData = true;
        } else if (flag == 1) {
            this.enableBigData = false;
        }
        this.getData("");
    },
    mounted() {
        let this_ = this;
        window.addEventListener("resize", this.canvasResize);
    },
    beforeDestroy() {
        window.removeEventListener("resize", this.canvasResize);
    },
};
</script>
<style scoped lang="less">
/deep/.el-tabs {
    .el-tabs__item {
        padding-left: 24px !important;
        padding-right: 24px !important;
    }
}
.dashboard-trend {
    background: #ffffff;
    position: relative;

    .el-tabs__header {
        .el-tabs__nav,
        .el-tabs__item {
            height: 50px !important;
            line-height: 50px;
        }
        .layout {
            display: flex;
            width: 100%;
            .chartBox {
                flex-grow: 2;
            }
            .blackBox {
                flex-grow: 1;
            }
        }
    }
    .el-tabs__content {
        padding: 20px;
    }
    .show-average {
        height: 50px;
        position: absolute;
        line-height: 50px;
        right: calc(~"34% + 200px");
        top: 0;
        margin-right: 20px;
        z-index: 800;
    }
    .trend-link {
        height: 50px;
        position: absolute;
        line-height: 50px;
        right: 34%;
        top: 0;
        margin-right: 20px;
        z-index: 799;
        .el-radio-button__inner {
            border: none;
        }
    }
}
</style>
