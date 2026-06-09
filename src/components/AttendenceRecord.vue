<template>
    <div class="record-wrap">
        <div class="record-list m-t-lg">
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
                                :style="`display: inline-block;height:24px;width:${getFragmentWidth(
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
                    :class="{ 'scale-list-li-large': index % 5 === 0 }"
                    v-for="(item, index) in scales"
                    :key="item"
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
        <div class="title">
            <div class="wrap-title">
                当日在线时长：{{ totalHours }}时{{ totalMinutes }}分{{
                    totalSeconds
                }}秒
            </div>
        </div>
    </div>
</template>
<script>
import * as moment from "moment";
export default {
    name: "AttendenceRecord",
    props: {
        onlineTimeList: { type: Array, default: () => [] },
        totalHours: { type: Number, default: 1 },
        totalMinutes: { type: Number, default: 1 },
        totalSeconds: { type: Number, default: 1 },
    },
    data() {
        return {
            width: 500,
            times: [
                "00:00",
                "04:00",
                "08:00",
                "12:00",
                "16:00",
                "20:00",
                "24:00",
            ],
            scales: Array(31),
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
    },
};
</script>
<style lang="scss" scoped>
.record-wrap {
    margin: 30px 25px;
    width: 500px;
    position: relative;
    .record-list {
        height: 100px;
        .time-list {
            width: 540px;
            margin-left: -20px;
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
                height: 10px;
                background: rgba(0, 0, 0, 0.5);
                display: block;
            }
            .scale-list-li-large {
                height: 20px;
                margin-top: 10px;
            }
        }
        .online-fragment-wrap {
            position: relative;
            width: 100%;
            left: 0;
            height: 25px;
            background: #ccc;
            border: 1px solid transparent;
            .online-fragment-list {
                position: absolute;
                padding: 0px;
                margin: 0px;
                .fragment-item {
                    position: absolute;
                    cursor: pointer;
                    height: 24px;
                    background-color: #08ce68;
                    display: block;
                }
            }
        }
    }
}
</style>
