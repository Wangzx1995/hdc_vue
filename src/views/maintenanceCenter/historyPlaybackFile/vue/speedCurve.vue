<template>
    <div class="mycontent">
        <div class="content">
            <div
                style="height: 30px; width: 100%"
                class="flex-layout flex-between p-x"
            >
                <div class="flex-layout flex-middle">
                    <el-radio-group v-model="speedTabs" size="small">
                        <!-- <el-radio-button label="speed"
                            >速度曲线</el-radio-button
                        > -->
                        <!-- <el-radio-button label="form">超速明细</el-radio-button> -->
                    </el-radio-group>
                </div>
                <div class="flex-layout flex-middle">
                    <span>速度阈值：</span
                    ><el-input
                        size="mini"
                        v-model="limitSpeed"
                        style="width: 70px"
                        @blur="setLimitSpeed"
                    ></el-input
                    ><span class="m-l-xs">km/h</span>
                    <div class="m-l">
                        平均速度：{{ avgSpeed.toFixed(2) }}km/h
                    </div>
                    <div class="m-l">最高速度：{{ maxSpeed || 0 }}km/h</div>
                </div>
            </div>
            <div
                ref="chart"
                :style="{ height: commonHeight - 88 + 'px' }"
                style="width: calc(100vw - 424px)"
                v-show="speedTabs === 'speed' && GpsData.length > 0"
            ></div>
            <div
                class="content"
                v-show="speedTabs === 'speed' && !GpsData.length"
                :style="{ height: commonHeight - 88 + 'px' }"
                style="width: calc(100vw - 424px)"
            >
                <p style="color: #909399; margin-bottom: 18px">暂无数据</p>
                <img src="/static/images/noData.svg" />
            </div>
        </div>
    </div>
</template>
<script>
import mixins from "../js/mixins";
import * as echarts from "echarts";
// import echarts from "@/moudulesConfig/echarts.js";
import moment from "moment";

let chart = null;
export default {
    props: {
        avgSpeed: {
            type: Number,
            default: 0,
        },
        maxSpeed: {
            type: Number | null,
            default: 0,
        },
        historyTrajectoryForm: {
            type: Object,
            default: () => {
                return {};
            },
        },
        fullScreenTable: {
            type: Number,
            default: 1,
        },
        indexTrajectory: {
            type: Number,
            default: 0,
        },
        GpsData: {
            type: Array,
            default: () => {
                return [];
            },
        },
    },
    mixins: [mixins],
    data() {
        return {
            total: 0,
            speedTabs: "speed",
            limitSpeed: 100,
            startValue: 0,
            endValue: 100,
            indexTrajectoryCopy: 0,
            columns: [
                {
                    label: "开始时间",
                    prop: "alarmTimeFormat",
                },
                {
                    label: "结束时间",
                    prop: "endTimeFormat",
                },
                {
                    label: "超速最高速度",
                    prop: "maxOverSpeed",
                },
                {
                    label: "持续时长(秒)",
                    prop: "alarmTimeSum",
                },
                {
                    label: "超速最小速度",
                    prop: "minOverSpeed",
                },
                {
                    label: "超速里程（km）",
                    prop: "overSpeedMileage",
                },
                {
                    label: "开始位置",
                    prop: "startLocation",
                },
                {
                    label: "结束位置",
                    prop: "endLocation",
                },
            ],
            url: "/analysis/overSpeed/record",
        };
    },
    methods: {
        setLimitSpeed() {
            let option = chart.getOption();
            let markList = option.series[0].markLine.data;
            if (!this.limitSpeed && markList.length === 2) {
                let chartConfig = {
                    series: {
                        markLine: {
                            id: 10,
                            data: [
                                {
                                    id: 4,
                                    silent: true,
                                    lineStyle: {
                                        type: "solid",
                                        color: "gray",
                                        width: 1,
                                    },
                                    emphasis: false,
                                    label: {
                                        show: true,
                                        formatter: "速度阈值",
                                    },
                                    yAxis: 0,
                                },
                            ],
                        },
                    },
                };
                chart.setOption(chartConfig);
            } else if (this.limitSpeed) {
                let chartConfig = {
                    series: {
                        markLine: {
                            id: 10,
                            data: [
                                {
                                    id: 4,
                                    silent: true,
                                    lineStyle: {
                                        type: "solid",
                                        color: "gray",
                                        width: 1,
                                    },
                                    emphasis: false,
                                    label: {
                                        show: true,
                                        formatter: "速度阈值",
                                    },
                                    yAxis: Number(this.limitSpeed),
                                },
                            ],
                        },
                    },
                };
                chart.setOption(chartConfig);
            }
            // this.searchOverSpeed();
        },
        getContentWidth() {
            this.divWidth = document.getElementById("contentBox").offsetWidth;
        },
        initChart() {
            let chartConfig = {
                animationDuration: 200,
                dataZoom: [
                    {
                        id: 7,
                        type: "inside",
                        throttle: 10,
                        startValue: 0,
                        endValue: 0,
                    },
                    {
                        height: "5px",
                        type: "slider",
                        left: "center",
                        bottom: 10,
                        throttle: 10,
                        textStyle: false,
                    },
                ],
                tooltip: {
                    trigger: "axis",
                    lineStyle: {
                        color: "red",
                    },
                    emphasis: {
                        lineStyle: {
                            color: "red",
                        },
                    },
                    axisPointer: {
                        type: "line",
                        axis: "auto",
                        snap: true,
                    },
                    formatter: function (params) {
                        var relVal = params[0].data[0];
                        for (var i = 0, l = params.length; i < l; i++) {
                            relVal +=
                                "<br/>" +
                                params[i].marker +
                                " " +
                                params[i].seriesName +
                                " " +
                                params[i].value[1];
                        }
                        return relVal;
                    },
                },
                grid: {
                    left: "4%",
                    top: "8%",
                    bottom: "8%",
                    right: "4%",
                    containLabel: true,
                },
                xAxis: [
                    {
                        id: 6,
                        type: "time",
                        axisTick: {
                            inside: true,
                        },
                        axisLabel: {
                            textStyle: {
                                color: "#606266",
                                fontSize: 10,
                            },
                            formatter: function (value) {
                                return moment(value).format(
                                    "YYYY-MM-DD HH:mm:ss"
                                );
                            },
                        },
                        axisLine: {
                            lineStyle: {
                                color: "rgba(204,204,204,.8)",
                            },
                        },
                        data: [],
                    },
                ],
                yAxis: [
                    {
                        axisTick: {
                            show: false,
                        },
                        type: "value",
                        axisLabel: {
                            textStyle: {
                                color: "#606266",
                                fontSize: 10,
                            },
                        },
                        axisLine: {
                            lineStyle: {
                                color: "rgba(204,204,204,.8)",
                            },
                        },
                        splitLine: {
                            show: false,
                        },
                        max: ({ max }) => {
                            return max > this.limitSpeed
                                ? max
                                : this.limitSpeed;
                        },
                    },
                ],
                series: [
                    {
                        sampling: "lttb",
                        id: 1,
                        symbol: "none",
                        animation: false,
                        smooth: true,
                        name: "GPS速度",
                        type: "line",
                        data: this.handleGPSData.speedList,
                        lineStyle: {
                            color: "#489DF7",
                        },
                        itemStyle: {
                            color: "#489DF7",
                        },
                        markLine: {
                            id: 10,
                            animation: "none",
                            symbol: "none",
                            data: [
                                {
                                    id: 4,
                                    silent: true,
                                    lineStyle: {
                                        type: "solid",
                                        color: "gray",
                                        width: 1,
                                    },
                                    emphasis: false,
                                    label: {
                                        show: true,
                                        formatter: "速度阈值",
                                    },
                                    yAxis: Number(this.limitSpeed),
                                },
                            ],
                        },
                        areaStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(
                                    0,
                                    0,
                                    0,
                                    1,
                                    [
                                        {
                                            offset: 0,
                                            color: "rgba(175,211,250,0.74)",
                                        }, //上边区域
                                        {
                                            offset: 0.7,
                                            color: "rgba(175,211,250,0.00)",
                                        }, //下边的区域
                                    ],
                                    false
                                ),
                            },
                        },
                    },
                    {
                        sampling: "lttb",
                        id: 2,
                        symbol: "none",
                        animation: false,
                        smooth: true,
                        name: "行车记录仪速度",
                        type: "line",
                        data: this.handleGPSData.recorderSpeedList,
                        lineStyle: {
                            color: "#67C23A",
                        },
                        itemStyle: {
                            color: "#67C23A",
                        },
                    },
                ],
            };
            chart = echarts.init(this.$refs.chart);
            chart.setOption(chartConfig);
            chart.on("dataZoom", () => {
                this.endValue = chart.getOption().dataZoom[0].endValue;
                this.startValue = chart.getOption().dataZoom[0].startValue;
            });
            // chart.on('click', (params) => {
            //     console.log('点击了图表');
            //     console.log(params);
            // });
            chart.getZr().on("click", (params) => {
                // console.log(params,'params');
                // const pointInPixel = [params.offsetX, params.offsetY];
                // if (chart.containPixel("grid", pointInPixel)) {
                //     let xIndex = chart.convertFromPixel({ seriesIndex: 0 }, [params.offsetX, params.offsetY])[0];
                //     this.$emit("getEchartsIndex", xIndex);
                // }
            });
        },
        reflash() {
            // let range = this.endValue - this.startValue;
            // if (this.indexTrajectoryCopy >= this.endValue) {
            //     this.endValue = this.endValue + range;
            //     this.startValue = this.startValue + range;
            // }
            // if (this.indexTrajectoryCopy < this.startValue) {
            //     this.startValue =
            //         this.indexTrajectoryCopy - 1 >= 0
            //             ? this.indexTrajectoryCopy - 1
            //             : 0;
            //     this.endValue = this.startValue + range;
            // }
            if (
                this.handleGPSData.speedList &&
                this.handleGPSData.speedList.length
            ) {
                this.endValue =
                    this.handleGPSData.speedList[
                        this.handleGPSData.speedList.length - 1
                    ][0];
            }

            let option = {
                dataZoom: [
                    {
                        id: 7,
                        startValue: this.startValue,
                        endValue: this.endValue,
                    },
                ],
                xAxis: [
                    {
                        id: 6,
                        data: this.handleGPSData.timeList,
                    },
                ],
                series: [
                    {
                        id: 1,
                        data: this.handleGPSData.speedList,
                    },
                    {
                        id: 2,
                        data: this.handleGPSData.recorderSpeedList,
                    },
                ],
            };
            chart.setOption(option);
        },
        clear() {
            if (chart) {
                chart.clear();
            }
        },
        searchOverSpeed() {
            let params = {
                carNumber: this.historyTrajectoryForm.carNumber,
                startTime: this.historyTrajectoryForm.startTime,
                endTime: this.historyTrajectoryForm.endTime,
                speedLimit: this.limitSpeed,
            };
            this.$refs["g-table"].searchTable(params);
        },
    },
    computed: {
        handleGPSData() {
            let tempObj = {
                timeList: [],
                speedList: [],
                recorderSpeedList: [],
            };
            if (this.GpsData.length > 0) {
                this.endValue = this.GpsData.length;
                this.GpsData.forEach(
                    ({ collectTime, speed, recorderSpeed }) => {
                        tempObj.timeList.push(collectTime);
                        tempObj.speedList.push([collectTime, speed]);
                        tempObj.recorderSpeedList.push([
                            collectTime ? collectTime : "--",
                            recorderSpeed ? recorderSpeed : "--",
                        ]);
                    }
                );
            }
            return tempObj;
        },
    },
    watch: {
        commonHeight: {
            handler() {
                this.$nextTick(() => {
                    chart.resize();
                });
            },
            deep: true,
        },
        handleGPSData({ speedList, timeList }) {
            chart.resize();
            this.reflash();
            if (!speedList.length && !timeList.length) {
                return;
            }
            // this.getFormData();
        },
        // indexTrajectory: {
        //     handler(value) {
        //         this.indexTrajectoryCopy = value;
        //         this.reflash();
        //     }
        // }
    },
    mounted() {
        console.log(this.$parent, "@@@");
        // this.getContentWidth();
        this.initChart();
        window.addEventListener("resize", () => {
            chart.resize();
        });
    },
};
</script>

<style lang="less" scoped>
.el-radio-group
    /deep/.el-radio-button__orig-radio:checked
    + .el-radio-button__inner {
    color: #409eff;
    border-color: #409eff;
    -webkit-box-shadow: -1px 0 0 0 #409eff;
    box-shadow: -1px 0 0 0 #409eff;
    background-color: #fff;
}

.g-table /deep/ .pagination {
    padding: 0.5rem !important;
}

.g-table {
    margin-top: 10px;
}

.content {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

.small {
    display: none;
}
.flex-between {
    justify-content: space-between;
}
.flex-middle {
    align-items: center;
}
.flex-layout {
    display: flex;
}
</style>
