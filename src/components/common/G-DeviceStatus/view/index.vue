<template>
    <div>
        <el-tooltip placement="top" :effect="'light'">
            <div class="status-box">
                <el-tag type="success" v-if="deviceInfo.deviceStatus === 1">
                    {{ $t("common.deviceStatus_1") }}
                </el-tag>
                <el-tag
                    type="warning"
                    v-else-if="
                        deviceInfo.deviceStatus === 2 &&
                        deviceInfo.dormantStatus == 2
                    "
                >
                    {{ $t("common.deviceStatus_2") }}
                </el-tag>
                <span
                    class="littleYellow"
                    v-else-if="
                        deviceInfo.deviceStatus === 2 &&
                        deviceInfo.dormantStatus != 2
                    "
                >
                    {{ $t("common.deviceStatus_2") }}
                </span>
                <el-tag type="info" v-else-if="deviceInfo.deviceStatus === 0">
                    {{ $t("common.deviceStatus_0") }}
                </el-tag>
                <span v-else>--</span>
            </div>
            <div slot="content">
                <span> {{ $t("conditionMonitoring.dataUpdateTime") }}： </span>
                <span v-if="deviceInfo.deviceStatusTime">
                    {{
                        $moment(deviceInfo.deviceStatusTime).format(
                            "YYYY-MM-DD HH:mm:ss"
                        )
                    }}
                </span>
                <span v-else>--</span>
                <el-button
                    class="m-l"
                    type="text"
                    @click="equipmentInspectionDeviceOnlineRecord"
                >
                    {{ $t("conditionMonitoring.onlineAndOfflineStatus") }}
                </el-button>
            </div>
        </el-tooltip>

        <el-dialog
            :title="$t('common.dailyOnlineAndOfflineStatus')"
            :visible.sync="dialogVisible"
            :append-to-body="true"
            :close-on-click-modal="true"
            width="1100px"
            @closed="chartClosed"
        >
            <div class="online-offline-records" v-if="showEcharts">
                <div
                    id="fault-chart"
                    v-show="echartsData && echartsData.length"
                ></div>
                <el-empty
                    v-show="!(echartsData && echartsData.length)"
                    :image="emptyImage"
                    :image-size="56"
                    :description="$t('common.noData')"
                ></el-empty>
            </div>
        </el-dialog>
    </div>
</template>

<script>

export default {
    name: "G-DeviceStatus",
    props: {
        deviceInfo: {
            type: Object,
            default: () => {},
        },
    },
    data() {
        return {
            emptyImage: require("@/assets/images/icon_empty.png"),
            echartsData: [],
            deviceOnlineSectionVoList: [],
            timerange: [this.$moment(new Date()), this.$moment(new Date())],
            dialogVisible: false,
            showEcharts: false,
        };
    },
    watch: {},
    mounted() {},
    computed: {},
    methods: {
        equipmentInspectionDeviceOnlineRecord() {
            this.dialogVisible = true;
            this.showEcharts = true;
            this.$api
                .equipmentInspectionDeviceOnlineRecord({
                    deviceCode: this.deviceInfo.deviceCode,
                    startTime: this.startTime,
                    endTime: this.endTime,
                })
                .then((res) => {
                    if (res.success == true) {
                        this.deviceOnlineSectionVoList =
                            res.data.deviceOnlineSectionVoList;
                        this.$nextTick(() => {
                            this.init();
                        });
                    } else {
                        this.$message.error(res.msg);
                    }
                });
        },
        init() {
            this.echartsData = [];
            this.categoriesArr = ["上下线记录"];
            this.deviceOnlineSectionVoList.forEach((item) => {
                this.echartsData.push({
                    name: item.deviceStatus === 1 ? "在线" : "休眠",
                    value: [
                        0,
                        Math.max(
                            +this.$moment(this.timerange[0])
                                .startOf("day")
                                .format("x"),
                            +new Date(item.startTime)
                        ),
                        Math.min(
                            +this.$moment(this.timerange[1])
                                .endOf("day")
                                .format("x"),
                            +new Date(item.endTime)
                        ),
                    ],
                    startTime:
                        +this.$moment(this.timerange[0])
                            .startOf("day")
                            .format("x") > +new Date(item.startTime)
                            ? this.$moment(this.timerange[0])
                                  .startOf("day")
                                  .format("YYYY-MM-DD HH:mm:ss")
                            : item.startTime,
                    endTime:
                        +this.$moment(this.timerange[1])
                            .endOf("day")
                            .format("x") < +new Date(item.endTime)
                            ? this.$moment(this.timerange[1])
                                  .endOf("day")
                                  .format("YYYY-MM-DD HH:mm:ss")
                            : item.endTime,
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
                var height = 50;

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
                    left: 80,
                    right: 70,
                    bottom: 60,
                    top: 25,
                    backgroundColor: "rgba(224,224,224,0.30)",
                },
                tooltip: {
                    enterable: true,
                    extraCssText:
                        "max-width:60%;max-height:83%; overflow: auto; ",

                    formatter: function (params) {
                        let str = that.categoriesArr[params.value[0]] + "<br/>";
                        str +=
                            "时间范围：" +
                            params.data.startTime +
                            " 至 " +
                            params.data.endTime;
                        return str;
                    },
                },
                legend: {
                    show: true,
                    data: ["在线", "休眠"],
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
                    },
                },
                series: [
                    {
                        name: "在线",
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
                            (item) => item.name === "在线"
                        ),
                    },

                    {
                        name: "休眠",
                        type: "custom",
                        renderItem: renderItem,
                        itemStyle: {
                            opacity: 1,
                            color: "#FFCC00",
                        },
                        encode: {
                            x: [1, 2],
                            y: 0,
                        },
                        data: this.echartsData.filter(
                            (item) => item.name === "休眠"
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
        chartClosed() {
            this.myChart && this.myChart.clear();
            this.myChart = null;
            this.showEcharts = false;
        },
    },
};
</script>

<style lang="less" scoped>
#fault-chart {
    margin-top: 14px;
    height: 150px;
    width: 100%;
    background-color: #fff;
}
.online-offline-records {
    height: 165px;
    overflow-x: auto;
}
.status-box {
    display: inline-block;
}
.littleYellow {
    border: 1px solid rgba(255, 149, 44, 1);
    background-color: rgba(255, 149, 44, 0.8);
    color: white;
    position: relative;
    display: inline-block;
    height: 24px;
    box-sizing: border-box;
    padding: 0 8px;
    border-radius: 2px;
    font-size: 14px;
    line-height: 24px;
    white-space: nowrap;
}
</style>
