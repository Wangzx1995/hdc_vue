<template>
    <div class="chart-box" v-loading="loading">
        <div id="fault-chart" v-if="categoriesArr.length"></div>
        <el-empty
            v-else
            :image="emptyImage"
            :image-size="56"
            :description="'暂无数据'"
        ></el-empty>
    </div>
</template>
<script>
import TimeUtil from "@/utils/time";
export default {
    name: "",
    components: {},
    props: {
        detailData: {
            type: Object,
            default: () => {},
        },
    },
    data() {
        return {
            emptyImage: require("@/assets/images/icon_empty.png"),
            myChart: null,
            categoriesArr: [],
            echartsData: [],
            startTime: this.$moment()
                .subtract(1, "days")
                .format("YYYY-MM-DD HH:mm:ss"),
            endTime: this.$moment().format("YYYY-MM-DD HH:mm:ss"),
            signalType: [6, 7, 8],
            loading: false,
        };
    },
    mounted() {
        this.init();
    },
    computed: {},
    watch: {},
    methods: {
        //设备上下线记录
        equipmentInspectionDeviceOnlineRecord() {
            return new Promise((resolve, reject) => {
                this.$api
                    .equipmentInspectionDeviceOnlineRecord({
                        deviceCode: this.detailData.deviceCode,
                        startTime: this.startTime,
                        endTime: this.endTime,
                    })
                    .then((res) => {
                        if (res.success == true) {
                            resolve(res.data.deviceOnlineSectionVoList);
                        } else {
                            this.$message.error(res.msg);
                        }
                    });
            });
        },
        //根据设备、时间段 , 查询所有的巡检异常记录
        equipmentInspectionGetInspectionRecordByDevice() {
            return new Promise((resolve, reject) => {
                this.$api
                    .equipmentInspectionGetInspectionRecordByDevice({
                        deviceCode: this.detailData.deviceCode,
                        startTime: this.startTime,
                        endTime: this.endTime,
                    })
                    .then((res) => {
                        if (res.success == true) {
                            resolve(
                                res.data &&
                                    res.data.inspectionFaultRecords &&
                                    res.data.inspectionFaultRecords.filter(
                                        (item) =>
                                            this.signalType.indexOf(item.type) <
                                            0
                                    )
                            );
                        } else {
                            this.$message.error(res.msg);
                        }
                    });
            });
        },
        init() {
            this.loading = true;
            this.categoriesArr = [];
            this.echartsData = [];
            Promise.all([
                this.equipmentInspectionDeviceOnlineRecord(),
                this.equipmentInspectionGetInspectionRecordByDevice(),
            ]).then((result) => {
                if (result && result[0] && result[0].length) {
                    this.categoriesArr = ["上线状态"];
                    result[0].forEach((item) => {
                        this.echartsData.push({
                            name: item.deviceStatus === 1 ? "在线" : "休眠",
                            value: [
                                0,
                                Math.max(
                                    +this.$moment()
                                        .subtract(1, "days")
                                        .format("x"),
                                    +new Date(item.startTime)
                                ),
                                Math.min(
                                    +this.$moment().format("x"),
                                    +new Date(item.endTime)
                                ),
                                // +new Date(item.startTime),
                                // +new Date(item.endTime),
                            ],
                            startTime: item.startTime,
                            endTime: item.endTime,
                        });
                    });
                }
                if (result && result[1] && result[1].length) {
                    this.categoriesArr = [
                        ...new Set(this.categoriesArr),
                        ...new Set(
                            result[1].reduce((prev, cur) => {
                                return prev.concat(cur["typeName"]);
                            }, [])
                        ),
                    ];
                    result[1].forEach((item) => {
                        this.echartsData.push({
                            name: "故障",
                            value: [
                                this.categoriesArr.findIndex(
                                    (k) => k === item.typeName
                                ),
                                Math.max(
                                    +this.$moment()
                                        .subtract(1, "days")
                                        .format("x"),
                                    +new Date(item.startTime)
                                ),
                                Math.min(
                                    +this.$moment().format("x"),
                                    +new Date(item.endTime)
                                ),
                                // +new Date(item.startTime),
                                // +new Date(item.endTime),
                            ],
                            reason: item.reason,
                            advice: item.advice,
                            startTime: item.startTime,
                            endTime: item.endTime,
                        });
                    });
                }
                setTimeout(() => {
                    this.loading = false;
                }, 300);
                this.$nextTick(() => {
                    this.myEchars();
                });
            });
        },
        myEchars() {
            if (!document.getElementById("fault-chart")) {
                return;
            }
            var myChart = this.$echarts.init(
                document.getElementById("fault-chart")
            );
            let that = this;
            function renderItem(params, api) {
                var categoryIndex = api.value(0);
                var start = api.coord([api.value(1), categoryIndex]);
                var end = api.coord([api.value(2), categoryIndex]);
                // var height = api.size([0, 1])[1] * 0.6;
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
                    right: 25,
                    bottom: 25,
                    top: 25,
                    backgroundColor: "rgba(224,224,224,0.30)",
                },
                tooltip: {
                    enterable: true, //滚动条
                    extraCssText:
                        "max-width:60%;max-height:83%; overflow: auto; ", //滚动条
                    position: function (point, params, dom, rect, size) {
                        //其中point为当前鼠标的位置，
                        //size中有两个属性：viewSize和contentSize，分别为外层div和tooltip提示框的大小
                        // 鼠标坐标和提示框位置的参考坐标系是：以外层div的左上角那一点为原点，x轴向右，y轴向下
                        // 提示框位置
                        var x = 0; // x坐标位置
                        var y = 0; // y坐标位置
                        // 当前鼠标位置
                        var pointX = point[0];
                        var pointY = point[1];
                        // 提示框大小
                        var boxWidth = size.contentSize[0];
                        var boxHeight = size.contentSize[1];
                        // boxWidth > pointX 说明鼠标左边放不下提示框
                        if (boxWidth > pointX) {
                            x = 5;
                        } else {
                            // 左边放的下
                            x = pointX - boxWidth;
                        }
                        // boxHeight > pointY 说明鼠标上边放不下提示框
                        if (boxHeight > pointY) {
                            y = 5;
                        } else {
                            // 上边放得下
                            y = pointY - boxHeight;
                        }
                        return [x, y];
                    },
                    formatter: function (params) {
                        let str = that.categoriesArr[params.value[0]] + "<br/>";
                        if (params.name === "故障") {
                            str +=
                                "开始时间：" +
                                params.data.startTime +
                                "<br/>" +
                                "异常原因：" +
                                (params.data.reason || "--") +
                                "<br/>解决建议：" +
                                (params.data.advice.replace(/\n/g, "<br>") ||
                                    "--");
                        } else {
                            str +=
                                "时间范围：" +
                                params.data.startTime +
                                " 至 " +
                                params.data.endTime;
                        }
                        return str;
                    },
                },
                legend: {
                    show: true,
                    data: ["故障", "在线", "休眠"],
                    right: "25",
                },

                xAxis: {
                    type: "time",
                    show: true,
                    min: +new Date(this.startTime),
                    max: +new Date(this.endTime),
                    axisPointer: {
                        type: "shadow",
                    },
                    axisLabel: {
                        showMaxLabel: true,
                        formatter: function (val) {
                            return that.$moment(val).format("HH:mm"); // 格式化
                        },
                        color: "#333",
                    },
                    axisLine: {
                        // x轴线段
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
                        // y轴颜色
                        show: true,
                        lineStyle: {
                            color: "#cccccc",
                        },
                    },
                    axisLabel: {
                        // 文字颜色
                        textStyle: {
                            color: "#000000",
                        },
                        // rich: {
                        //     a1: {
                        //         backgroundColor: {
                        //             image: "/static/images/conditionMonitoring/fault.svg",
                        //         },
                        //         width: 12,
                        //         height: 12,
                        //     },
                        // },
                        // formatter: (params, i) => {
                        //     return [
                        //         (params == "上线状态" ? "" : "{a1|}") +
                        //             "  " +
                        //             params,
                        //     ];
                        // },
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
                        name: "故障",
                        type: "custom",
                        renderItem: renderItem,
                        itemStyle: {
                            opacity: 1,
                            color: "#FFA39E",
                        },
                        encode: {
                            x: [1, 2],
                            y: 0,
                        },
                        data: this.echartsData.filter(
                            (item) => item.name === "故障"
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
                        type: "inside",
                        yAxisIndex: [0],
                    },
                ],
            };
            myChart.setOption(option);
            //随着屏幕大小调节图表
            window.addEventListener("resize", () => {
                myChart.resize();
            });
        },
    },
};
</script>
<style lang="less" scoped>
#fault-chart,
.chart-box {
    height: 340px;
    width: 800px;
    background-color: #fff;
}
</style>
