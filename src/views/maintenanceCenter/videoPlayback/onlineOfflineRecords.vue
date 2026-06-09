<template>
    <div class="online-offline-records">
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
        videoData: {
            type: Array,
            default: () => [],
        },
        selectDate: {
            type: String,
            default: "",
        },
    },
    data() {
        return {
            emptyImage: require("@/assets/images/icon_empty.png"),
            echartsData: [],
            deviceOnlineSectionVoList: [],
        };
    },
    watch: {
        videoData: {
            handler(val) {
                this.equipmentInspectionDeviceOnlineRecord();
            },
            deep: true,
        },
    },
    mounted() {},
    computed: {
        timerange() {
            return [
                this.$moment(this.formatDate(this.selectDate)),
                this.$moment(this.formatDate(this.selectDate)),
            ];
        },
    },
    methods: {
        formatDate(dateString) {
            if (!dateString) return;
            const [year, month, day] = dateString.split("-").map(Number);
            const formattedMonth = month.toString().padStart(2, "0");
            const formattedDay = day.toString().padStart(2, "0");
            return `${year}-${formattedMonth}-${formattedDay}`;
        },

        equipmentInspectionDeviceOnlineRecord() {
            this.$api
                .equipmentInspectionDeviceOnlineRecord({
                    deviceCode: this.deviceCode,
                    startTime: this.startTime,
                    endTime: this.endTime,
                })
                .then((res) => {
                    if (res.success == true) {
                        this.deviceOnlineSectionVoList =
                            res.data.deviceOnlineSectionVoList;
                        this.init();
                    } else {
                        this.$message.error(res.msg);
                    }
                });
        },
        init() {
            this.echartsData = [];
            this.categoriesArr = ["上下线记录", "录像记录"];
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
            this.videoData.forEach((item) => {
                this.echartsData.push({
                    name: "录像",
                    value: [
                        1,
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
                    left: 150,
                    right: 70,
                    bottom: 60,
                    top: 25,
                    backgroundColor: "rgba(224,224,224,0.30)",
                },
                tooltip: {
                    enterable: true,
                    extraCssText:
                        "max-width:60%;max-height:83%; overflow: auto; ",
                    position: function (point, params, dom, rect, size) {
                        var x = 0;
                        var y = 0;

                        var pointX = point[0];
                        var pointY = point[1];

                        var boxWidth = size.contentSize[0];
                        var boxHeight = size.contentSize[1];

                        if (boxWidth > pointX) {
                            x = 5;
                        } else {
                            x = pointX - boxWidth;
                        }

                        if (boxHeight > pointY) {
                            y = 5;
                        } else {
                            y = pointY - boxHeight;
                        }
                        return [x, y];
                    },
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
                    data: ["录像", "在线", "休眠"],
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
                        name: "录像",
                        type: "custom",
                        renderItem: renderItem,
                        itemStyle: {
                            opacity: 1,
                            color: "#1B8BF1",
                        },
                        encode: {
                            x: [1, 2],
                            y: 0,
                        },
                        data: this.echartsData.filter(
                            (item) => item.name === "录像"
                        ),
                    },
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
