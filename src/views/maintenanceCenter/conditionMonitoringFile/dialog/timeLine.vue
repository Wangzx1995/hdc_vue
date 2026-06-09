<template>
    <div class="record-wrap" ref="timeLine">
        <div>当日上下线</div>
        <div class="record-list">
            <div class="online-fragment-wrap">
                <ul class="online-fragment-list">
                    <li
                        v-for="item in fragment"
                        :key="item.id"
                        class="fragment-item"
                        :style="`width:${getFragmentWidth(
                            item
                        )}px; left:${getLeft(item.startTime)}px`"
                    >
                        <el-tooltip
                            :content="`${formatTime(item)}`"
                            placement="top"
                        >
                            <span
                                :style="`display: flex;height:6px;width:${getFragmentWidth(
                                    item
                                )}px`"
                            ></span>
                        </el-tooltip>
                    </li>
                </ul>
            </div>
            <ul class="scale-list">
                <li
                    class="scale-list-li"
                    v-for="(item, index) in scales"
                    :key="index"
                >
                    {{ item }}
                </li>
            </ul>
            <ul class="time-list">
                <li class="time-list-li" v-for="item in times" :key="item">
                    {{ item }}
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
import * as moment from "moment";
export default {
    name: "AttendenceRecord",
    props: {
        detailData: {
            type: Object,
            default: () => {},
        },
    },
    data() {
        return {
            width: 1000,
            times: [
                "00:00",
                "01:00",
                "02:00",
                "03:00",
                "04:00",
                "05:00",
                "06:00",
                "07:00",
                "08:00",
                "09:00",
                "10:00",
                "11:00",
                "12:00",
                "13:00",
                "14:00",
                "15:00",
                "16:00",
                "17:00",
                "18:00",
                "19:00",
                "20:00",
                "21:00",
                "22:00",
                "23:00",
                "24:00",
            ],
            scales: Array(25),
            onlineTimeList: [],
            startTime: this.$moment()
                .startOf("day")
                .format("YYYY-MM-DD HH:mm:ss"),
            endTime: this.$moment().endOf("day").format("YYYY-MM-DD HH:mm:ss"),
        };
    },
    computed: {
        fragment() {
            return this.onlineTimeList.map((item, index) => {
                const startTime = item.startTime.replace(
                    new RegExp(/-/gm),
                    "/"
                );
                const endTime = item.endTime.replace(new RegExp(/-/gm), "/");
                return {
                    id: index,
                    startTime: new Date(
                        new Date().getFullYear(),
                        new Date().getMonth(),
                        new Date().getDate(),
                        new Date(startTime).getHours(),
                        new Date(startTime).getMinutes(),
                        new Date(startTime).getSeconds()
                    ),
                    endTime: new Date(
                        new Date().getFullYear(),
                        new Date().getMonth(),
                        new Date().getDate(),
                        new Date(endTime).getHours(),
                        new Date(endTime).getMinutes(),
                        new Date(endTime).getSeconds()
                    ),
                };
            });
        },
    },
    methods: {
        initData() {
            this.fragment = this.onlineTimeList.map((item, index) => {
                return {
                    id: index,
                    startTime: new Date(item.startTime),
                    endTime: new Date(item.endTime),
                };
            });
        },
        getFragmentWidth(item) {
            const ratio =
                (new Date(item.endTime).getTime() -
                    new Date(item.startTime).getTime()) /
                (1000 * 3600 * 24);
            return parseInt(ratio * this.width) == 0
                ? 0.1
                : parseInt(ratio * this.width);
        },
        formatTime(item) {
            return (
                moment(item.startTime).format("HH:mm:ss") +
                " - " +
                moment(item.endTime).format("HH:mm:ss")
            );
        },
        getLeft(time) {
            const ratio =
                (new Date(time).getTime() -
                    new Date(
                        new Date().getFullYear(),
                        new Date().getMonth(),
                        new Date().getDate(),
                        0,
                        0,
                        0
                    ).getTime()) /
                (1000 * 3600 * 24);
            const left = parseInt(ratio * this.width);
            return left;
        },
        getHHMM(value) {
            return moment(value).format().substring(11, 16);
        },
        //设备近24上下线记录
        equipmentInspectionDeviceOnlineRecord() {
            this.$api
                .equipmentInspectionDeviceOnlineRecord({
                    deviceCode: this.detailData.deviceCode,
                    startTime: this.startTime,
                    endTime: this.endTime,
                })
                .then((res) => {
                    if (res.success == true) {
                        this.onlineTimeList =
                            res.data.deviceOnlineSectionVoList.filter(
                                (item) => {
                                    return item.deviceStatus === 1;
                                }
                            );
                    } else {
                        this.$message.error(res.msg);
                    }
                });
        },
        timeLineResize() {
            this.width = this.$refs.timeLine.clientWidth - 100;
        },
    },
    mounted() {
        this.equipmentInspectionDeviceOnlineRecord();
        window.addEventListener("resize", this.timeLineResize);
        this.$nextTick(() => {
            this.timeLineResize();
        });
    },
};
</script>
<style lang="less" scoped>
.record-wrap {
    width: 100%;
    position: relative;
    display: flex;
    padding-top: 8px;
    .record-list {
        margin-left: 30px;
        width: calc(~"100% - 100px");
        .time-list {
            width: 100%;
            margin-left: -14px;
            padding: 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: rgba(0, 0, 0, 0.5);
            font-size: 12px;
        }
        .scale-list {
            padding: 0;
            margin-top: -10px;
            display: flex;
            width: 100%;
            justify-content: space-between;
            align-items: center;
            padding: 0 1px;
            .scale-list-li {
                width: 1px;
                height: 5px;
                background: rgba(0, 0, 0, 0.5);
                display: block;
                margin-top: 8px;
            }
        }
        .online-fragment-wrap {
            position: relative;
            width: 100%;
            left: 0;
            height: 6px;
            background: #ccc;
            border: 1px solid transparent;
            .online-fragment-list {
                position: absolute;
                padding: 0px;
                margin: 0px;
                .fragment-item {
                    position: absolute;
                    cursor: pointer;
                    height: 6px;
                    background-color: #08ce68;
                    display: block;
                    top: -1px;
                }
            }
        }
    }
}
</style>
