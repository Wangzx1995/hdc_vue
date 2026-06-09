<template>
    <div v-loading="loading">
        <div class="big-content">
            <div class="small-box" :class="`status_${situation.storageStatus}`">
                <div>
                    <span>存储状态</span>
                    <em></em>
                </div>
                <template v-if="situation.hasOwnProperty('storageStatus')">
                    <div>{{ statusObj[situation.storageStatus] }}</div>
                    <div>
                        近24小时故障：{{
                            situation.latest24StorageFaultCount
                        }}次
                    </div>
                </template>
                <div v-else>未知</div>
            </div>
            <div
                class="small-box"
                :class="`status_${situation.lostVideoChannelStatus}`"
            >
                <div>
                    <span>视频状态</span>
                    <em></em>
                </div>
                <template
                    v-if="situation.hasOwnProperty('lostVideoChannelStatus')"
                >
                    <div>
                        {{ statusObj[situation.lostVideoChannelStatus] }}
                    </div>
                    <div>
                        近24小时故障：{{
                            situation.latest24LostVideoChannelFaultCount
                        }}次
                    </div>
                </template>
                <div v-else>未知</div>
            </div>
            <div
                class="small-box"
                :class="`status_${situation.videoRecordStatus}`"
            >
                <div>
                    <span>录像状态</span>
                    <em></em>
                </div>
                <template v-if="situation.hasOwnProperty('videoRecordStatus')">
                    <div>{{ statusObj[situation.videoRecordStatus] }}</div>
                    <div>
                        近24小时故障：{{
                            situation.latest24VideoRecordFaultCount
                        }}次
                    </div>
                </template>
                <div v-else>未知</div>
            </div>
            <div class="small-box" :class="`status_${situation.gpsStatus}`">
                <div>
                    <span>定位状态</span>
                    <em></em>
                </div>
                <template v-if="situation.hasOwnProperty('gpsStatus')">
                    <div>{{ statusObj[situation.gpsStatus] }}</div>
                    <div>
                        近24小时故障：{{ situation.latest24GpsFaultCount }}次
                    </div>
                </template>
                <div v-else>未知</div>
            </div>
            <div
                class="small-box big-box"
                :class="`status_${situation.algStatus}`"
            >
                <div>
                    <span>架设状态</span>
                    <em></em>
                </div>
                <template v-if="situation.hasOwnProperty('algStatus')">
                    <div>{{ statusObj[situation.algStatus] }}</div>
                    <div>
                        近24小时故障：{{ situation.latest24AlgFaultCount }}次
                    </div>
                </template>
                <div v-else>未知</div>
            </div>
        </div>
        <div class="common-operation">
            <div class="operation-title">
                <span>常用操作</span>
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
            statusObj: {
                0: "异常",
                1: "正常",
            },
            situation: {}, //设备概览
            loading: false,
        };
    },
    mounted() {
        this.equipmentInspectionSituation();
    },
    computed: {},
    watch: {},
    methods: {
        //设备概览
        equipmentInspectionSituation() {
            this.loading = true;
            this.$api
                .equipmentInspectionSituation({
                    deviceId: this.detailData.id,
                    startTime: this.$moment()
                        .subtract(1, "days")
                        .format("YYYY-MM-DD HH:mm:ss"),
                    endTime: this.$moment().format("YYYY-MM-DD HH:mm:ss"),
                })
                .then((res) => {
                    if (res.success == true) {
                        this.situation = res.data;
                    } else {
                        this.$message.error(res.msg);
                    }
                    this.loading = false;
                });
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
@import "./../boxless.less";

.big-content {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
}
.common-operation {
    margin-top: 14px;
    padding-top: 14px;
    .operation-title {
        position: relative;
        border-top: 1px dashed #e0e0e0;
        span {
            padding: 0px 12px;
            font-size: 14px;
            position: absolute;
            text-align: center;
            line-height: 20px;
            height: 20px;
            top: -10px;
            left: 50%;
            transform: translate(-50%, 0%);
            background: #ffffff;
        }
    }
    .operation-list {
        display: flex;
        justify-content: space-between;
        padding-top: 14px;
        & > div {
            width: 56px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            font-size: 14px;
            img {
                width: 36px;
                height: 36px;
                margin-bottom: 4px;
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
</style>
