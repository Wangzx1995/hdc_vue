<template>
    <div>
        <div class="device-upgrade-status" v-if="upgradeData.upgradeState > 0">
            <el-popover placement="left" width="200" trigger="hover">
                <div class="timeline-top">
                    <span>
                        <!-- 升级进度 -->
                        {{ $t("upgradeProgress.upgradeProgress") }}
                    </span>
                    <div>
                        <slot></slot>
                    </div>
                </div>
                <el-timeline>
                    <el-timeline-item
                        v-for="(activity, index) in activities"
                        :key="index"
                        :color="activity.color"
                        :timestamp="activity.timestamp"
                        :title="activity.content"
                    >
                        {{ activity.content }}
                    </el-timeline-item>
                </el-timeline>
                <el-tag
                    slot="reference"
                    effect="dark"
                    :color="upgradeStateList[upgradeData.upgradeState].color"
                >
                    {{ upgradeStateList[upgradeData.upgradeState].name }}
                </el-tag>
            </el-popover>
        </div>
        <div
            class="device-upgrade-status"
            v-else-if="upgradeData.upgradeState == 0"
        >
            <el-tag
                slot="reference"
                effect="dark"
                :color="upgradeStateList[upgradeData.upgradeState].color"
            >
                {{ upgradeStateList[upgradeData.upgradeState].name }}
            </el-tag>
        </div>
        <div v-else>--</div>
    </div>
</template>
<script>
export default {
    name: "",
    components: {},
    props: {
        upgradeData: {
            type: Object,
            default: () => {},
        },
    },
    data() {
        return {
            upgradeStateList: {
                0: {
                    //  name: "未开始",
                    name: this.$t("upgradeProgress.notStarted"),
                    color: "#cbcbcb",
                },
                1: {
                    // name: "进行中",
                    name: this.$t("upgradeProgress.inProgress"),
                    color: "#36CBCB",
                },
                2: {
                    // name: "进行中",
                    name: this.$t("upgradeProgress.inProgress"),
                    color: "#36CBCB",
                },
                3: {
                    // name: "进行中",
                    name: this.$t("upgradeProgress.inProgress"),
                    color: "#36CBCB",
                },
                4: {
                    // name: "升级成功",
                    name: this.$t("upgradeProgress.upgradeSuccessful"),
                    color: "#52C41A",
                },
                5: {
                    // name: "升级失败",
                    name: this.$t("upgradeProgress.upgradeFailed"),
                    color: "#FF7777",
                },
                6: {
                    // name: "升级终止",
                    name: this.$t("upgradeProgress.upgradeTermination"),
                    color: "#FF952C",
                },
            },
            activities: [],
        };
    },
    mounted() {
        this.getActivities(this.upgradeData);
    },
    computed: {},
    watch: {
        upgradeData: {
            handler(val) {
                this.getActivities(val);
            },
            deep: true,
        },
    },
    methods: {
        getActivities(val) {
            if (val.upgradeState > 0 && val.upgradeState < 5) {
                this.activities = [
                    {
                        // content: "等待升级",
                        content: this.$t("upgradeProgress.waitingForUpgrade"),
                        timestamp: val.createTime
                            ? this.$moment(val.createTime).format(
                                  "YYYY-MM-DD HH:mm:ss"
                              )
                            : "",
                        color: "#52C41A",
                    },
                    {
                        // content: "下发命令",
                        content: this.$t("upgradeProgress.issueCommand"),
                        timestamp: val.sendCmdTime
                            ? this.$moment(val.sendCmdTime).format(
                                  "YYYY-MM-DD HH:mm:ss"
                              )
                            : "",
                        color: val.sendCmdTime ? "#52C41A" : "#e4e7ed",
                    },
                    {
                        // content: "升级成功",
                        content: this.$t("upgradeProgress.upgradeSuccessful"),
                        timestamp: val.upgradeEndTime
                            ? this.$moment(val.upgradeEndTime).format(
                                  "YYYY-MM-DD HH:mm:ss"
                              )
                            : "",
                        color:
                            val.upgradeState === 4
                                ? this.upgradeStateList[val.upgradeState].color
                                : "#e4e7ed",
                    },
                ];
                if (val.upgradeResultCmdTime) {
                    this.activities.splice(2, 0, {
                        // content: "固件烧写完成",
                        content: this.$t(
                            "upgradeProgress.firmwareBurningCompleted"
                        ),
                        timestamp: val.upgradeResultCmdTime
                            ? this.$moment(val.upgradeResultCmdTime).format(
                                  "YYYY-MM-DD HH:mm:ss"
                              )
                            : "",
                        color: val.upgradeResultCmdTime ? "#52C41A" : "#e4e7ed",
                    });
                }
            } else if (val.upgradeState >= 5) {
                this.activities = [
                    {
                        // content: "等待升级",
                        content: this.$t("upgradeProgress.waitingForUpgrade"),
                        timestamp: val.createTime
                            ? this.$moment(val.createTime).format(
                                  "YYYY-MM-DD HH:mm:ss"
                              )
                            : "",
                        color: "#52C41A",
                    },
                ];
                if (val.sendCmdTime) {
                    this.activities.push({
                        // content: "下发命令",
                        content: this.$t("upgradeProgress.issueCommand"),
                        timestamp: this.$moment(val.sendCmdTime).format(
                            "YYYY-MM-DD HH:mm:ss"
                        ),
                        color: "#52C41A",
                    });
                }
                if (val.upgradeResultCmdTime) {
                    this.activities.push({
                        // content: "固件烧写完成",
                        content: this.$t(
                            "upgradeProgress.firmwareBurningCompleted"
                        ),
                        timestamp: this.$moment(
                            val.upgradeResultCmdTime
                        ).format("YYYY-MM-DD HH:mm:ss"),
                        color: "#52C41A",
                    });
                }
                this.activities.push({
                    content: `${this.upgradeStateList[val.upgradeState].name}${
                        val.upgradeState === 5
                            ? val.errorReason
                                ? "(" + val.errorReason + ")"
                                : ""
                            : ""
                    }`,
                    timestamp: val.upgradeEndTime
                        ? this.$moment(val.upgradeEndTime).format(
                              "YYYY-MM-DD HH:mm:ss"
                          )
                        : "",
                    color: this.upgradeStateList[val.upgradeState].color,
                });
            }
        },
    },
};
</script>
<style lang="less" scoped>
.el-timeline {
    /deep/.el-timeline-item {
        padding-bottom: 8px;
        .el-timeline-item__wrapper {
            height: 44px;
            display: flex;
            flex-direction: column;
        }
        .el-timeline-item__content {
            display: inline-block;
            height: 22px;
            line-height: 22px;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
        }
        .el-timeline-item__timestamp {
            margin-top: 0px;
            display: inline-block;
            height: 22px;
            line-height: 22px;
            min-width: 100px;
        }
    }
}
.timeline-top {
    display: flex;
    margin-bottom: 8px;
    & > span,
    .el-button {
        font-size: 14px;
        flex: 1;
    }
}
</style>
<style lang="less">
.device-upgrade-status {
    .el-tag--dark {
        border: none;
        width: 76px;
        text-align: center;
        line-height: 24px !important;
    }
}
</style>
