<template>
    <div class="main-content">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane
                label="最新数据"
                name="first"
                v-if="
                    buttonPermissions.includes(
                        'conditionMonitoringInspectionDetails'
                    )
                "
            >
                <first-content :detailData="detailData"></first-content>
            </el-tab-pane>
            <el-tab-pane
                label="历史趋势"
                name="second"
                v-if="
                    buttonPermissions.includes(
                        'conditionMonitoringHistoricalInspectionRecords'
                    )
                "
            >
                <second-content
                    :detailData="detailData"
                    v-if="activeName === 'second'"
                ></second-content>
            </el-tab-pane>
            <!-- <el-tab-pane label="设备动态" name="third">
                <third-content :detailData="detailData"></third-content>
            </el-tab-pane> -->
        </el-tabs>
        <i class="el-icon-close close-btn" @click="closeDialog"></i>
        <div class="bot-btn">
            <div class="left-status">
                <div>
                    <span> 统计时间： </span>
                    <span> {{ detailData.time }}</span>
                </div>

                <div>
                    <span> 车牌号： </span>
                    <span> {{ detailData.plateNum || "--" }} </span>
                </div>
                <div>
                    <span> 终端手机号： </span>
                    <span> {{ detailData.deviceCode || "--" }} </span>
                </div>
                <div>
                    <span> 设备状态： </span>
                    <span :class="`deviceStatus_${detailData.deviceStatus}`">
                        {{ deviceStatusObj[detailData.deviceStatus] }}
                    </span>
                </div>
            </div>
            <div class="operation-list">
                <div @click="goLivePreview()">
                    <img
                        src="/static/images/conditionMonitoring/icon_preview.svg"
                        alt=""
                    />
                    <span>实时预览</span>
                </div>
                <div @click="goVideoPlayback()">
                    <img
                        src="/static/images/conditionMonitoring/icon_playback.svg"
                        alt=""
                    />
                    <span>录像回放</span>
                </div>
                <div @click="goHistoryPlayback()">
                    <img
                        src="/static/images/conditionMonitoring/icon_trajectory.svg"
                        alt=""
                    />
                    <span>轨迹回放</span>
                </div>
                <div
                    @click="equipmentInspectionReboot()"
                    v-btn="'conditionMonitoringRebootDevice'"
                >
                    <img
                        src="/static/images/conditionMonitoring/icon_restart.svg"
                        alt=""
                    />
                    <span>设备重启</span>
                </div>
                <el-tooltip
                    placement="top"
                    content="简单恢复出厂设置：保留账号、密码、Wi-Fi、智能算法标定、车速标定、ADAS相机标定、平台、NTP校时、升级平台参数。"
                >
                    <div
                        @click="equipmentInspectionFactoryReset()"
                        v-btn="'conditionMonitoringSimpleFactoryReset'"
                    >
                        <img
                            src="/static/images/conditionMonitoring/icon_restoration.svg"
                            alt=""
                        />
                        <span>恢复出厂</span>
                    </div>
                </el-tooltip>

                <div @click="goDevLog()">
                    <img
                        src="/static/images/conditionMonitoring/icon_export.svg"
                        alt=""
                    />
                    <span>设备日志</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import firstContent from "./firstContent.vue";
import secondContent from "./secondContent.vue";
import thirdContent from "./thirdContent.vue";
export default {
    name: "",
    components: { firstContent, secondContent, thirdContent },
    props: {
        detailData: {
            type: Object,
            default: () => {},
        },
    },
    data() {
        return {
            activeName: "first",
            deviceStatusObj: {
                0: "离线",
                1: "在线",
                2: "休眠",
            },
        };
    },
    mounted() {
        if (
            this.buttonPermissions.includes(
                "conditionMonitoringInspectionDetails"
            )
        ) {
            this.activeName = "first";
        } else if (
            this.buttonPermissions.includes(
                "conditionMonitoringHistoricalInspectionRecords"
            )
        ) {
            this.activeName = "second";
        } else {
            this.activeName = "third";
        }
    },
    computed: {
        buttonPermissions() {
            return this.$store.getters.buttonPermissions;
        },
    },
    watch: {},
    methods: {
        handleClick() {},
        closeDialog() {
            this.$emit("closeDialog");
        },
        //重启设备
        equipmentInspectionReboot() {
            if (this.detailData.deviceStatus === 0) {
                this.$message.error(`设备离线`);
                return;
            }
            this.$confirm("确定重启设备吗？", {
                confirmButtonText: this.$t("common.ok"),
                cancelButtonText: this.$t("common.cancel"),
                type: "warning",
            })
                .then(() => {
                    let params = {
                        deviceCode: this.detailData.deviceCode,
                        productKey: this.detailData.productKey,
                    };
                    this.$api.equipmentInspectionReboot(params).then((res) => {
                        if (res.success == true) {
                            this.$message.success(`设备重启指令下发成功！`);
                        } else {
                            this.$message.error(
                                "设备重启指令下发失败：" + res.msg
                            );
                        }
                    });
                })
                .catch(() => {});
        },
        //重启设备
        equipmentInspectionFactoryReset() {
            if (this.detailData.deviceStatus === 0) {
                this.$message.error(`设备离线`);
                return;
            }
            this.$confirm("确定部分恢复出厂设置吗？", {
                confirmButtonText: this.$t("common.ok"),
                cancelButtonText: this.$t("common.cancel"),
                type: "warning",
            })
                .then(() => {
                    let params = {
                        deviceCode: this.detailData.deviceCode,
                        productKey: this.detailData.productKey,
                        mode: "basic",
                    };
                    this.$api
                        .equipmentInspectionFactoryReset(params)
                        .then((res) => {
                            if (res.success == true) {
                                this.$message.success(
                                    `恢复出厂设置指令下发成功！`
                                );
                            } else {
                                this.$message.error(
                                    "恢复出厂设置指令下发失败：" + res.msg
                                );
                            }
                        });
                })
                .catch(() => {});
        },
        //预览
        goLivePreview() {
            if (this.detailData.deviceStatus === 0) {
                this.$message.error(`设备离线`);
                return;
            }
            sessionStorage.setItem(
                "livePreviewItem",
                JSON.stringify(this.detailData)
            );
            let { href } = this.$router.resolve({
                path: "/maintenanceCenter/livePreview",
            });
            window.open(href, "_blank");
        },
        //回放
        goVideoPlayback() {
            if (this.detailData.deviceStatus === 0) {
                this.$message.error(`设备离线`);
                return;
            }
            sessionStorage.setItem(
                "videoItem",
                JSON.stringify(this.detailData)
            );
            let { href } = this.$router.resolve({
                path: "/maintenanceCenter/videoPlayback",
            });
            window.open(href, "_blank");
        },
        //轨迹
        goHistoryPlayback() {
            sessionStorage.setItem(
                "historyItem",
                JSON.stringify({
                    ...this.detailData,
                    collectTime: this.$moment().startOf("day"),
                    endTime: this.$moment().endOf("day"),
                })
            );
            let { href } = this.$router.resolve({
                path: "/maintenanceCenter/historyPlayback",
            });
            window.open(href, "_blank");
        },
        //设备日志
        goDevLog() {
            sessionStorage.setItem(
                "devLogItem",
                JSON.stringify(this.detailData)
            );
            let { href } = this.$router.resolve({
                path: "/supportCenter/devLog",
            });
            window.open(href, "_blank");
        },
    },
};
</script>
<style lang="less" scoped>
.main-content {
    height: 100%;
    position: relative;
    /deep/.el-tabs {
        height: calc(~"100% - 68px");
        .el-tabs__nav-wrap {
            padding-left: 24px;
        }
        .el-tabs__header {
            margin: 0px;
        }
        .el-tabs__content {
            padding: 24px 24px 0;
            height: calc(~"100% - 45px");
            overflow: auto;
            .el-tab-pane {
                height: 100%;
            }
        }
    }
    .close-btn {
        position: absolute;
        font-size: 20px;
        top: 8px;
        right: 24px;
        cursor: pointer;
        &:hover {
            color: #409eff;
        }
    }
    .bot-btn {
        position: relative;
        height: 68px;
        box-shadow: 0px -4px 4px 0px rgba(0, 0, 0, 0.08);
        display: flex;
        justify-content: space-between;
        padding: 0 24px;
        .left-status {
            display: flex;
            align-self: center;
            flex-wrap: wrap;
            span:nth-child(odd) {
                font-weight: bold;
            }
            span:nth-child(even) {
                margin-right: 24px;
            }
            .deviceStatus_0 {
                color: #4d4d4d;
            }
            .deviceStatus_1 {
                color: #22b01e;
            }
            .deviceStatus_2 {
                color: #faad14;
            }
        }
        .operation-list {
            display: flex;
            justify-content: space-between;
            color: rgba(0, 0, 0, 0.85);
            & > div {
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                &:not(:last-of-type) {
                    margin-right: 30px;
                }
                img {
                    width: 36px;
                    height: 36px;
                    margin-right: 4px;
                    transition: 0.2s;
                }
                &:hover {
                    span {
                        color: #409eff;
                    }
                    img {
                        transform: scale(1.1);
                    }
                }
            }
        }
    }
}
</style>
<style lang="less">
.conditionMonitoring-detail-dialog {
    .el-dialog__header {
        display: none;
        min-width: 1280px;
    }
    .el-dialog__body {
        min-width: 1280px;
        height: 100%;
        padding: 10px 0 0 0;
    }
}
</style>
