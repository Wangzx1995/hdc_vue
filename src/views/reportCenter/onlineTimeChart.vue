<template>
    <div class="online-offline-records">
        {{ selectDate }}
        <div class="wrap-title">
            {{ $t("vehicleOnlineTime.dailyOnlineDuration") }}
            ：{{ totalHours }}

            {{ $t("common.hour") }}
            {{ totalMinutes }}

            {{ $t("common.min") }}
            {{ totalSeconds }}

            {{ $t("common.sec") }}
        </div>
        <div id="fault-chart" v-show="echartsData && echartsData.length"></div>
        <el-empty
            v-show="!(echartsData && echartsData.length)"
            :image="emptyImage"
            :image-size="56"
            :description="$t('common.noData')"
        ></el-empty>
    </div>
</template>
<script>
export default {
    props: {
        deviceCode: {
            type: [Number, String],
            default: "",
        },
        selectDate: {
            type: [String, Date],
            default: "",
        },
        onlineTimeList: {
            type: Array,
            default: () => [],
        },
        totalHours: { type: Number, default: 1 },
        totalMinutes: { type: Number, default: 1 },
        totalSeconds: { type: Number, default: 1 },
    },
    data() {
        return {
            emptyImage: require("@/assets/images/icon_empty.png"),
            echartsData: [],
            deviceOnlineSectionVoList: [],
        };
    },
    watch: {
        onlineTimeList: {
            handler(val) {
                this.deviceOnlineSectionVoList = JSON.parse(
                    JSON.stringify(val)
                );
                this.$nextTick(() => {
                    this.init();
                });
            },
            deep: true,
            immediate: true,
        },
    },
    mounted() {},
    computed: {
        timerange() {
            return [this.selectDate, this.selectDate];
        },
    },
    methods: {
        init() {
            this.echartsData = [];

            this.categoriesArr = [
                this.$t("videoPlayback.onlineOfflineRecords"),
            ];
            this.deviceOnlineSectionVoList.forEach((item) => {
                this.echartsData.push({
                    name: this.$t("common.deviceStatus_1"),
                    value: [
                        0,
                        +new Date(item.startTime),
                        +new Date(item.endTime),
                    ],
                    startTime: item.startTime,
                    endTime: item.endTime,
                });
            });
            this.myEchars();
        },
        myEchars() {
            this.myChart = this.$echarts.init(
                document.getElementById("fault-chart")
            );
            let that = this;
            function renderItem(params, api) {
                var categoryIndex = api.value(0);
                var start = api.coord([api.value(1), categoryIndex]);
                var end = api.coord([api.value(2), categoryIndex]);
                var height =
                    api.size([0, 1])[1] - (25 - that.categoriesArr.length);
                var rectShape = that.$echarts.graphic.clipRectByRect(
                    {
                        x: start[0],
                        y: start[1] - height / 2,
                        width: end[0] - start[0],
                        height: height,
                    },
                    {
                        x: params.coordSys.x,
                        y: params.coordSys.y,
                        width: params.coordSys.width,
                        height: params.coordSys.height,
                    }
                );

                return (
                    rectShape && {
                        type: "rect",
                        transition: ["shape"],
                        shape: rectShape,
                        style: api.style(),
                    }
                );
            }

            var option = {
                grid: {
                    show: true,
                    left: 100,
                    right: 70,
                    bottom: 60,
                    top: 25,
                    backgroundColor: "rgba(224,224,224,0.30)",
                },
                tooltip: {
                    enterable: true,
                    extraCssText:
                        "max-width:60%;max-height:83%; overflow: auto; ",

                    formatter: (params) => {
                        let str = that.categoriesArr[params.value[0]] + "<br/>";
                        str +=
                            this.$t("qualifiedProbability.timeFrame") +
                            "：" +
                            params.data.startTime +
                            " " +
                            this.$t("deviceLoadTaskManage.to") +
                            " " +
                            params.data.endTime;
                        return str;
                    },
                },
                legend: {
                    show: true,
                    data: [this.$t("common.deviceStatus_1")],
                    right: "70",
                },
                xAxis: {
                    type: "time",
                    show: true,
                    min: +new Date(
                        this.$moment(this.timerange[0])
                            .startOf("day")
                            .format("YYYY-MM-DD HH:mm:ss")
                    ),
                    max: +new Date(
                        this.$moment(this.timerange[1])
                            .endOf("day")
                            .format("YYYY-MM-DD HH:mm:ss")
                    ),
                    axisPointer: {
                        type: "shadow",
                    },
                    axisLabel: {
                        showMaxLabel: true,
                        formatter: function (val) {
                            return that.$moment(val).format("HH:mm");
                        },
                        color: "#333",
                    },
                    axisLine: {
                        show: true,
                        lineStyle: {
                            type: "solid",
                            color: "#cccccc",
                        },
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            type: "dashed",
                            color: "#cccccc",
                        },
                    },
                },
                yAxis: {
                    data: that.categoriesArr,
                    axisTick: {
                        show: false,
                    },
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: "#cccccc",
                        },
                    },
                    axisLabel: {
                        textStyle: {
                            color: "#000000",
                        },
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            width: 25 - this.categoriesArr.length,
                            type: "solid",
                            color: "#ffffff",
                        },
                    },
                },
                series: [
                    {
                        name: this.$t("common.deviceStatus_1"),
                        type: "custom",
                        renderItem: renderItem,
                        itemStyle: {
                            opacity: 1,
                            color: "#52C41A",
                        },
                        encode: {
                            x: [1, 2],
                            y: 0,
                        },
                        data: this.echartsData.filter(
                            (item) =>
                                item.name === this.$t("common.deviceStatus_1")
                        ),
                    },
                ],
                dataZoom: [
                    {
                        show: true,
                        filterMode: "none",
                        bottom: "10",
                        showDataShadow: true,
                        start: 0,
                        end: 100,
                    },
                    {
                        type: "inside",
                        start: 0,
                        end: 100,
                    },
                ],
            };
            this.myChart.setOption(option);

            window.addEventListener("resize", () => {
                this.resize();
            });
            this.$nextTick(() => {
                setTimeout(() => {
                    this.resize();
                }, 1);
            });
        },
        resize() {
            this.myChart && this.myChart.resize();
        },
    },
};
</script>

<style lang="less" scoped>
#fault-chart {
    margin-top: 14px;
    height: 200px;
    width: 100%;
    background-color: #fff;
}
.online-offline-records {
    height: 244px;
    overflow-x: auto;
}
</style>
