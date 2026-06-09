<template>
    <div style="height: 100%">
        <el-tabs v-model="activeName" v-loading="loading">
            <el-tab-pane label="升级记录" name="first">
                <div class="third-content">
                    <div>
                        <div class="third-label">
                            <span>当前版本：</span>
                            <span>
                                {{ upgradeInfo.currentVersion || "--" }}
                            </span>
                        </div>
                        <div class="third-label" v-if="upgradeInfo.taskDevId">
                            <span>目标版本：</span>
                            <span>
                                {{ upgradeInfo.firmwareVersion || "--" }}
                            </span>
                        </div>
                        <el-timeline v-if="upgradeInfo.taskDevId">
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
                    <div class="bot-btn" @click="goDeviceUpgrade()">
                        去升级>
                    </div>
                </div>
            </el-tab-pane>
            <!-- <el-tab-pane label="设备故障 " name="second">
                <div class="first-content" v-if="faultRecordInfo.length">
                    <div :class="faultRecordStatus ? 'error' : 'success'">
                        {{ faultRecordStatus ? "故障暂未派单" : "故障已派单" }}
                    </div>
                    <div>
                        <div
                            v-for="(item, index) in faultRecordInfo"
                            :key="index"
                        >
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
            </el-tab-pane>
            <el-tab-pane label="设备异常" name="third">
                <div class="second-content" v-if="anomalyRecordInfo.length">
                    <div>
                        <div
                            v-for="(item, index) in anomalyRecordInfo"
                            :key="index"
                        >
                            <span>
                                {{ item.name }}
                            </span>
                            <span> {{ item.num }}次 </span>
                        </div>
                    </div>
                    <div class="bot-btn" @click="goAnomalyDetails()">
                        去处理>
                    </div>
                </div>
                <el-empty
                    v-else
                    :image="emptyImage"
                    :image-size="56"
                    :description="'暂无数据'"
                ></el-empty>
            </el-tab-pane> -->
        </el-tabs>
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
            activeName: "first",
            firstList: [],
            secondList: [],
            upgradeStateList: {
                0: { name: "未开始", color: "#cbcbcb" },
                1: { name: "进行中", color: "#36CBCB" },
                2: { name: "进行中", color: "#36CBCB" },
                3: { name: "进行中", color: "#36CBCB" },
                4: { name: "升级成功", color: "#52C41A" },
                5: { name: "升级失败", color: "#FF7777" },
                6: { name: "升级终止", color: "#FF952C" },
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
            loading: false,
        };
    },
    mounted() {},
    computed: {},
    watch: {
        activeName: {
            handler(val) {
                this.loading = true;
                switch (val) {
                    case "first":
                        this.equipmentInspectionUpgradeInfo();
                        break;
                    case "second":
                        this.equipmentInspectionGetFaultRecordInfo();
                        this.getRequirementFiles();
                        break;
                    case "third":
                        this.equipmentInspectionGetAnomalyRecordInfo();
                        break;
                }
            },
            immediate: true,
        },
    },
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
                    setTimeout(() => {
                        this.loading = false;
                    }, 300);
                });
        },
        countOccurrences(array) {
            let obj = array.reduce((countMap, element) => {
                countMap[element.alarmAnalyseName] =
                    (countMap[element.alarmAnalyseName] || 0) + 1;
                return countMap;
            }, {});
            return Object.keys(obj).map((key) => ({
                name: key,
                num: obj[key],
            }));
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
                        this.anomalyRecordInfo = this.countOccurrences(
                            res.data.results
                        );
                    } else {
                        this.$message.error(res.msg);
                    }
                    setTimeout(() => {
                        this.loading = false;
                    }, 300);
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
                    setTimeout(() => {
                        this.loading = false;
                    }, 300);
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
/deep/.el-tabs {
    height: 100%;
    .el-tabs__content {
        height: calc(~"100% - 59px");
        .el-tab-pane {
            height: 100%;
        }
    }
    .bot-btn {
        display: none;
        line-height: 24px;
        height: 24px;
        text-align: center;
        cursor: pointer;
        font-size: 12px;
        &:hover {
            color: #409eff;
        }
    }
}
.first-content {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
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
        height: calc(~"100% - 36px - 6px - 24px");
        overflow-y: auto;
        div {
            margin-bottom: 6px;
            display: flex;
            line-height: 24px;
            height: 24px;
            span:nth-child(1) {
                display: flex;
                width: 60px;
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
                width: calc(~"100% - 110px - 60px - 8px");
                margin-right: 8px;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
            }
            span:nth-child(3) {
                width: 110px;
                font-size: 12px;
                line-height: 24px;
            }
        }
    }
}
.second-content {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    & > div {
        height: calc(~"100% - 24px");
        overflow-y: auto;
        & > div {
            margin-bottom: 6px;
            display: flex;
            line-height: 24px;
            height: 24px;
            span:nth-child(1) {
                width: calc(~"100% - 50px");
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
            }
            span:nth-child(2) {
                text-align: right;
                width: 50px;
                color: #69757e;
                padding-right: 12px;
            }
        }
    }
}
.third-content {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
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
