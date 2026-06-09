<template>
    <div class="third-content">
        <div class="content-box">
            <div class="big-title">近24小时升级记录</div>
            <div class="bot-box">
                <div>
                    <div class="third-label">
                        <span>当前版本：</span>
                        <span>
                            {{ upgradeInfo.currentVersion || "--" }}
                        </span>
                    </div>
                    <div class="third-label">
                        <span>目标版本：</span>
                        <span>
                            {{ upgradeInfo.firmwareVersion || "--" }}
                        </span>
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
                </div>
                <div class="bot-btn" @click="goDeviceUpgrade()">去升级></div>
            </div>
        </div>
        <div class="content-box">
            <div class="big-title">近24小时设备故障</div>
            <div class="left-box" v-if="faultRecordInfo.length">
                <div :class="faultRecordStatus ? 'error' : 'success'">
                    {{ faultRecordStatus ? "故障暂未派单" : "故障已派单" }}
                </div>
                <div>
                    <div v-for="(item, index) in faultRecordInfo" :key="index">
                        <span :class="`status_${item.status}`">
                            <i></i>
                            {{ item.status === 1 ? "已解决" : "待维护" }}
                        </span>
                        <el-tooltip placement="top" effect="light">
                            <div slot="content">
                                <b>解决建议：</b>
                                <p v-html="item.faultSolution"></p>
                            </div>
                            <span>
                                {{ item.faultTypeString }}
                            </span>
                        </el-tooltip>
                        <span>
                            {{ item.collectTime.substring(0, 16) }}
                        </span>
                    </div>
                </div>
                <div class="bot-btn" @click="makeMaintenance()">
                    生成维护任务>
                </div>
            </div>
            <el-empty
                v-else
                :image="emptyImage"
                :image-size="56"
                :description="'暂无数据'"
            ></el-empty>
        </div>
        <div class="content-box">
            <div class="big-title">近24小时设备异常</div>
            <div class="mid-box" v-if="anomalyRecordInfo.length">
                <div>
                    <div
                        v-for="(item, index) in anomalyRecordInfo"
                        :key="index"
                    >
                        <span :class="`status_${item.handleState}`">
                            <i></i>
                            {{ anomalyRecordInfoStatus[item.handleState] }}
                        </span>
                        <span>
                            {{ item.alarmAnalyseName }}
                        </span>
                        <span> {{ item.startTime }}~{{ item.endTime }} </span>
                    </div>
                </div>
                <div class="bot-btn" @click="goAnomalyDetails()">去处理></div>
            </div>
            <el-empty
                v-else
                :image="emptyImage"
                :image-size="56"
                :description="'暂无数据'"
            ></el-empty>
        </div>

        <el-dialog
            title="生成维护任务"
            :visible.sync="taskVisible"
            :width="'520px'"
            append-to-body
            @close="handleExit"
        >
            <el-form
                content-width="480px"
                inline
                label-position="top"
                ref="taskForm"
            >
                <el-form-item label="上传平台信息">
                    <el-checkbox
                        v-for="item in taskList"
                        :key="item.fileType"
                        :disabled="item.disabled"
                        v-model="item.isCheckd"
                        >{{ item.fileTypeName }}</el-checkbox
                    >
                </el-form-item>
                <el-form-item label="备注信息" prop="comment">
                    <el-input
                        style="width: 480px"
                        v-model="taskForm.comment"
                        type="textarea"
                        :maxlength="500"
                        show-word-limit
                        :autosize="{
                            minRows: 2,
                            maxRows: 6,
                        }"
                        clearable
                        placeholder="请输入备注信息"
                    >
                    </el-input>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="handleExit">取 消</el-button>
                <el-button
                    type="primary"
                    @click="handleSure"
                    :disabled="loadingBtn"
                    >确 定</el-button
                >
            </span>
        </el-dialog>
    </div>
</template>
<script>
import upgradeProgress from "@/components/upgradeProgress";
export default {
    name: "",
    components: { upgradeProgress },
    props: {
        detailData: {
            type: Object,
            default: () => {},
        },
    },
    data() {
        return {
            emptyImage: require("@/assets/images/icon_empty.png"),
            upgradeStateList: {
                0: { name: "未开始", color: "#cbcbcb" },
                1: { name: "进行中", color: "#36CBCB" },
                2: { name: "进行中", color: "#36CBCB" },
                3: { name: "进行中", color: "#36CBCB" },
                4: { name: "升级成功", color: "#52C41A" },
                5: { name: "升级失败", color: "#FF7777" },
                6: { name: "升级终止", color: "#FF952C" },
            },
            anomalyRecordInfoStatus: {
                0: "未处理",
                1: "处理",
                2: "忽略",
            },
            activities: [],
            faultRecordInfo: [],
            faultRecordStatus: true,
            anomalyRecordInfo: [],
            upgradeInfo: {},
            taskVisible: false,
            taskList: [],
            taskForm: {
                comment: "",
            },
            loadingBtn: false,
        };
    },
    mounted() {
        this.equipmentInspectionGetFaultRecordInfo();
        this.equipmentInspectionGetAnomalyRecordInfo();
        this.equipmentInspectionUpgradeInfo();
        this.getRequirementFiles();
    },
    computed: {},
    watch: {},
    methods: {
        getActivities(val) {
            if (val.upgradeState > 0 && val.upgradeState < 5) {
                this.activities = [
                    {
                        content: "等待升级",
                        timestamp: val.createTime
                            ? this.$moment(val.createTime).format(
                                  "YYYY-MM-DD HH:mm:ss"
                              )
                            : "",
                        color: "#52C41A",
                    },
                    {
                        content: "下发命令",
                        timestamp: val.sendCmdTime
                            ? this.$moment(val.sendCmdTime).format(
                                  "YYYY-MM-DD HH:mm:ss"
                              )
                            : "",
                        color: val.sendCmdTime ? "#52C41A" : "#e4e7ed",
                    },
                    {
                        content: "升级成功",
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
                        content: "固件烧写完成",
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
                        content: "等待升级",
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
                        content: "下发命令",
                        timestamp: this.$moment(val.sendCmdTime).format(
                            "YYYY-MM-DD HH:mm:ss"
                        ),
                        color: "#52C41A",
                    });
                }
                if (val.upgradeResultCmdTime) {
                    this.activities.push({
                        content: "固件烧写完成",
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
        //设备故障
        equipmentInspectionGetFaultRecordInfo() {
            this.$api
                .equipmentInspectionGetFaultRecordInfo({
                    deviceCode: this.detailData.deviceCode,
                    currentPage: 1,
                    pageSize: 100,
                    startTime: this.$moment()
                        .subtract(1, "days")
                        .format("YYYY-MM-DD HH:mm:ss"),
                    endTime: this.$moment().format("YYYY-MM-DD HH:mm:ss"),
                })
                .then((res) => {
                    if (res.success == true) {
                        this.faultRecordInfo = res.data.results;
                        this.faultRecordInfo.forEach((k) => {
                            k.faultSolution = k.faultSolution.replace(
                                /；/g,
                                "；<br/>"
                            );
                        });
                        this.faultRecordStatus = !this.faultRecordInfo.find(
                            (i) => {
                                return i.maintenanceStatus == 1;
                            }
                        );
                    } else {
                        this.$message.error(res.msg);
                    }
                });
        },
        //设备异常
        equipmentInspectionGetAnomalyRecordInfo() {
            this.$api
                .equipmentInspectionGetAnomalyRecordInfo({
                    deviceCode: this.detailData.deviceCode,
                    currentPage: 1,
                    pageSize: 100,
                    anomalyTimeBegin: this.$moment()
                        .subtract(1, "days")
                        .format("YYYY-MM-DD HH:mm:ss"),
                    anomalyTimeEnd: this.$moment().format(
                        "YYYY-MM-DD HH:mm:ss"
                    ),
                })
                .then((res) => {
                    if (res.success == true) {
                        this.anomalyRecordInfo = res.data.results;
                    } else {
                        this.$message.error(res.msg);
                    }
                });
        },
        //获取设备升级信息显示
        equipmentInspectionUpgradeInfo() {
            this.$api
                .equipmentInspectionUpgradeInfo({
                    deviceId: this.detailData.id,
                })
                .then((res) => {
                    if (res.success == true) {
                        this.upgradeInfo = res.data;
                        this.getActivities(res.data);
                    } else {
                        this.$message.error(res.msg);
                    }
                });
        },
        //获取维修记录上传文件要求
        getRequirementFiles() {
            this.$api.requirementFiles().then((res) => {
                if (res.success) {
                    res.data.forEach((item) => {
                        item["isCheckd"] = true;
                        if (item["fileType"] == 1 || item["fileType"] == 2) {
                            item["disabled"] = true;
                        } else {
                            item["disabled"] = false;
                        }
                    });
                    this.taskList = res.data;
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        handleExit() {
            this.taskVisible = false;
        },
        //单个生成维护任务
        makeMaintenance() {
            this.taskForm.comment = "";
            this.taskList.forEach((item) => {
                item["isCheckd"] = true;
            });
            let cars = [
                {
                    plateNum: this.detailData.plateNum,
                    treeLevel: this.detailData.treeLevel,
                },
            ];
            this.taskForm = Object.assign(
                {},
                this.taskForm,
                { cars: cars },
                { organizeId: this.detailData.organizeId }
            );
            this.taskVisible = true;
        },
        handleSure() {
            this.loadingBtn = true;
            let chooseArr = this.taskList.filter((item) => {
                return item.isCheckd == true;
            });
            let typesArr = [];
            chooseArr.forEach((item) => {
                if (item.isCheckd) {
                    typesArr.push(item.fileType);
                }
            });
            this.taskForm = Object.assign(this.taskForm, {
                requireFiles: typesArr,
            });
            this.$api.newAddMaintenanceRecord(this.taskForm).then((res) => {
                if (res.success) {
                    this.$message.success(`生成维护任务成功！`);
                    this.taskVisible = false;
                    this.taskForm.comment = "";
                    this.loadingBtn = false;
                    this.$api.eventTrackTrigger({
                        menu: "HANDLE_FAULT",
                        business: "HANDLE_FAULT_TASKS",
                        eventResult: res.success,
                    });
                } else {
                    this.$message.error(`生成维护任务失败：${res.msg}`);
                    this.taskVisible = false;
                    this.taskForm.comment = "";
                    this.loadingBtn = false;
                }
            });
        },
        //去处理
        goAnomalyDetails() {
            sessionStorage.setItem(
                "anomalyDetailsItem",
                JSON.stringify(this.detailData)
            );
            let { href } = this.$router.resolve({
                path: "/maintenanceCenter/anomalyDetails",
            });
            window.open(href, "_blank");
        },
        //去升级
        goDeviceUpgrade() {
            sessionStorage.setItem(
                "deviceUpgradeItem",
                JSON.stringify(this.detailData)
            );
            let { href } = this.$router.resolve({
                path: "/maintenanceCenter/deviceUpgrade",
            });
            window.open(href, "_blank");
        },
    },
};
</script>
<style lang="less" scoped>
.bot-btn {
    display: none;
    line-height: 24px;
    height: 24px;
    text-align: center;
    cursor: pointer;
    position: absolute;
    bottom: 0px;
    width: 100%;
    &:hover {
        color: #409eff;
    }
}
.third-content {
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: space-between;
    padding-bottom: 24px;
}
.content-box {
    width: calc(~"(100% - 48px) / 3");
    border: 1px solid #dedede;
    border-radius: 6px;
    position: relative;
    padding: 24px 24px 16px 24px;
    .big-title {
        padding: 0px 12px;
        font-size: 14px;
        position: absolute;
        text-align: center;
        line-height: 20px;
        height: 20px;
        top: -10px;
        left: 24px;
        background: #ffffff;
        font-weight: bold;
    }
}
.left-box {
    height: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
    & > div:nth-child(1) {
        height: 36px;
        line-height: 36px;
        font-size: 16px;
        text-align: center;
        border-radius: 6px;
        margin-bottom: 6px;
        &.success {
            background: #f6ffed;
            border: 1px solid #b7eb8f;
            color: #52c41a;
        }
        &.error {
            background: #fff1f0;
            border: 1px solid #ffa39e;
            color: #ff4d4f;
        }
    }
    & > div:nth-child(2) {
        height: calc(~"100% - 36px - 6px - 24px - 16px");
        overflow-y: auto;
        div {
            margin-bottom: 6px;
            display: flex;
            line-height: 24px;
            height: 24px;
            span:nth-child(1) {
                display: flex;
                width: 80px;
                align-items: center;
                color: #ff4d4f;
                i {
                    border-radius: 50%;
                    margin-right: 4px;
                    width: 8px;
                    height: 8px;
                    background: #ff4d4f;
                }
                &.status_1 {
                    color: #52c41a;
                    i {
                        background: #52c41a;
                    }
                }
            }
            span:nth-child(2) {
                width: calc(~"100% - 120px - 80px - 24px");
                margin-right: 24px;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
            }
            span:nth-child(3) {
                width: 120px;
            }
        }
    }
}
.mid-box {
    height: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
    & > div:nth-child(1) {
        height: calc(~"100% - 24px - 16px");
        overflow-y: auto;
        div {
            margin-bottom: 6px;
            display: flex;
            line-height: 24px;
            height: 24px;
            span:nth-child(1) {
                display: flex;
                width: 80px;
                align-items: center;
                color: #ff4d4f;
                i {
                    border-radius: 50%;
                    margin-right: 4px;
                    width: 8px;
                    height: 8px;
                    background: #ff4d4f;
                }
                &.status_1 {
                    color: #52c41a;
                    i {
                        background: #52c41a;
                    }
                }
                &.status_2 {
                    color: #424242;
                    i {
                        background: #424242;
                    }
                }
            }
            span:nth-child(2) {
                width: calc(~"100% - 250px - 80px - 24px");
                margin-right: 24px;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
            }
            span:nth-child(3) {
                width: 250px;
                font-size: 12px;
                line-height: 24px;
            }
        }
    }
}
.bot-box {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    & > div:nth-child(1) {
        height: calc(~"100% - 24px - 16px");
        overflow-y: auto;
    }
    .third-label {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin-bottom: 8px;
        line-height: 24px;
        height: 24px;
        span:nth-child(1) {
            font-size: 14px;
            font-weight: bold;
        }
    }
    .el-timeline {
        padding: 12px;
    }
}
</style>
