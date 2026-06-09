<template>
    <div>
        <!--        <div class="failure_distribution_health">-->
        <!--            <span class="text-md health">故障设备类型分布</span>-->
        <!--        </div>-->
        <div class="failureDistributioncontainer">
            <span class="no_data" v-if="flag">暂无数据</span>
            <div id="failureDistribution" :style="myChartStyle"></div>
        </div>
    </div>
</template>

<script>
import * as echarts from "echarts";

export default {
    name: "FaultDeviceTypeDistribution",
    props: {
        dataData: {
            type: Array,
            default: () => {
                return [];
            },
        },
        flag: {
            type: Boolean,
            default: false,
        },
        activeName: {
            type: String,
            default: "first",
        },
    },
    data() {
        return {
            myChartStyle: { width: "100%", height: "350px" }, //图表样式
        };
    },
    methods: {
        myEchars() {
            console.log("dataData===", this.dataData);
            const myChart = echarts.init(
                document.getElementById("failureDistribution")
            );
            var option = {
                tooltip: {
                    trigger: "item",
                    formatter: "{b}: \t {d}%",
                },
                legend: {
                    top: "15%",
                    orient: "vertical",
                    left: "45%",
                    itemWidth: 10,
                    itemHeight: 10,
                    icon: "circle",
                    textStyle: {
                        width: 300,
                        rich: {
                            a: {
                                align: "left",
                                fontSize: 14,
                                lineHeight: 30,
                            },
                            b: {
                                color: "#b3b3b3",
                                align: "left",
                                padding: [0, 5, 0, 5],
                                fontSize: 14,
                                lineHeight: 30,
                            },
                            c: {
                                color: "#b3b3b3",
                                align: "left",
                                fontSize: 14,
                                lineHeight: 30,
                            },
                            d: {
                                align: "right",
                                fontSize: 14,
                                lineHeight: 30,
                            },
                        },
                    },
                    formatter: (name) => {
                        var total = 0;
                        var tarValue, percent;
                        var line = "|";
                        this.dataData.forEach((item, i) => {
                            total += Number(item.value);
                            if (item.name == name) {
                                tarValue = Number(item.value ? item.value : 0);
                                percent = Number(
                                    item.percent ? item.percent : 0
                                );
                            }
                        });
                        return (
                            "{a|" +
                            name +
                            " }" +
                            "{b|" +
                            line +
                            "}" +
                            "{c|" +
                            percent +
                            "%}" +
                            "{d|" +
                            tarValue +
                            "}"
                        );
                    },
                },
                color: [
                    " #3aa0ff",
                    "#36cbcb",
                    " #4dcb73",
                    "#fad337",
                    "#ff6666",
                    " #9c66e5",
                ],
                series: [
                    {
                        name: "Access From",
                        type: "pie",
                        radius: ["50%", "65%"],
                        center: ["20%", "45%"],
                        avoidLabelOverlap: false,
                        itemStyle: {
                            borderColor: "#fff",
                            borderWidth: 4,
                        },
                        label: {
                            normal: {
                                show: true,
                                position: "center",
                                rich: {
                                    a: {
                                        color: "#b3b3b3",
                                        fontSize: 14,
                                    },
                                    b: {
                                        color: "#000",
                                        fontSize: 25,
                                    },
                                },
                                formatter: (name) => {
                                    var total = 0;
                                    var tarValue;
                                    this.dataData.forEach((item, i) => {
                                        total += Number(item.value);
                                        if (item.name == name) {
                                            tarValue = Number(
                                                item.value ? item.value : 0
                                            );
                                        }
                                    });
                                    return (
                                        "{a|" +
                                        "故障总数" +
                                        "}" +
                                        "\n\n" +
                                        "{b|" +
                                        total +
                                        "}"
                                    );
                                },
                            },
                            emphasis: {
                                show: false,
                                textStyle: {
                                    fontSize: "30",
                                },
                            },
                        },
                        labelLine: {
                            show: false,
                        },
                        data: this.dataData,
                    },
                ],
            };
            myChart.setOption(option);
            myChart.resize();
            //随着屏幕大小调节图表
            window.addEventListener("resize", () => {
                myChart.resize();
            });
        },
    },
    watch: {
        dataData: {
            handler(val) {
                this.dataData = val;
                this.myEchars();
            },
            deep: true,
        },
        activeName: {
            handler(val) {
                if (val == "first") {
                    const myChart = echarts.init(
                        document.getElementById("failureDistribution")
                    );
                    myChart.resize();
                }
            },
            deep: true,
        },
    },
    mounted() {
        // window.addEventListener("resize", () => {
        //     document.getElementsByTagName("canvas")[0].style.width =
        //         document.getElementById("failureDistribution").clientWidth +
        //         "px";
        // });
    },
};
</script>

<style lang="less" scoped>
.failureDistributioncontainer {
    height: 350px;
    position: relative;
    .no_data {
        width: 100%;
        display: inline-block;
        background: #fff;
        height: 350px;
        line-height: 350px;
        text-align: center;
        position: absolute;
        font-size: 25px;
        font-weight: 500;
        z-index: 10;
    }

    .failure_distribution_health {
        height: 70px;
        border-bottom: 1px solid #e4e4e4;
        padding-top: 35px;
        padding-left: 15px;
    }
    #failureDistribution {
        width: 740px !important;
    }
}
</style>
