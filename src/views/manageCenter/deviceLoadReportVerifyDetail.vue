<template>
    <div class="verify-detail">
        <div
            class="reportStatus"
            v-if="reportInfo.reportStatus == 2 || reportInfo.reportStatus == 3"
        >
            <div class="state">
                <i
                    class="el-icon-error"
                    style="color: #e6202a; font-size: 20px"
                    v-if="reportInfo.reportStatus == 3"
                ></i>
                <i
                    class="el-icon-success"
                    style="color: #1db84c; font-size: 20px"
                    v-if="reportInfo.reportStatus == 2"
                ></i>
                <span
                    :class="reportInfo.reportStatus == 3 ? 'unpass' : 'pass'"
                    >{{
                        // reportInfo.reportStatus == 3 ? "审核不通过" : "审核通过"
                        reportInfo.reportStatus == 3
                            ? $t("deviceLoadReportVerify.reviewFailed")
                            : $t("deviceLoadReportVerify.approved")
                    }}</span
                >
            </div>
            <div class="reason" v-if="reportInfo.reportStatus == 3">
                <p>
                    <!-- 审批意见 -->
                    {{ $t("deviceLoadReportVerify.approvalOpinion") }}
                </p>
                <span>{{ reportInfo.revokeReason }}</span>
            </div>
        </div>
        <div
            class="detail-main"
            :class="
                reportInfo.reportStatus == 2 || reportInfo.reportStatus == 3
                    ? 'main2'
                    : ''
            "
        >
            <div v-for="item in reportDetail" v-bind:key="item.index">
                <div class="title">
                    {{ item.title }}
                </div>
                <div class="form-detail-content" v-if="item.type == 'platform'">
                    <el-table
                        :data="item.listData"
                        class="table"
                        style="width: 100%"
                    >
                        <!-- 中心名称 -->
                        <el-table-column
                            prop="name"
                            :label="$t('deviceLoadReportVerify.centerName')"
                        >
                        </el-table-column>
                        <!-- IP地址 -->
                        <el-table-column
                            prop="add"
                            :label="$t('deviceLoadReportVerify.ipAddress')"
                        >
                            <template slot-scope="scope">
                                <span class="red" v-if="scope.row.add === ''">
                                    <!-- 未输入 -->
                                    {{
                                        $t("deviceLoadReportVerify.notEntered")
                                    }}
                                </span>
                                <span v-else>{{ scope.row.add }}</span>
                            </template>
                        </el-table-column>
                        <!-- 启用状态 -->
                        <el-table-column
                            prop="enabled"
                            :label="$t('deviceLoadReportVerify.enableStatus')"
                        ></el-table-column>
                        <!-- 端口号 -->
                        <el-table-column
                            prop="port"
                            :label="$t('deviceLoadReportVerify.portNumber')"
                        >
                            <template slot-scope="scope">
                                <span class="red" v-if="scope.row.port === ''">
                                    <!-- 未输入 -->
                                    {{
                                        $t("deviceLoadReportVerify.notEntered")
                                    }}
                                </span>
                                <span v-else>{{ scope.row.port }}</span>
                            </template>
                        </el-table-column>
                        <!-- 接入协议 -->
                        <el-table-column
                            prop="protocol"
                            :label="$t('common.protocolName')"
                        ></el-table-column>
                        <!-- 连接状态 -->
                        <el-table-column
                            prop="status"
                            :label="
                                $t('deviceLoadReportVerify.connectionStatus')
                            "
                        >
                            <template slot-scope="scope">
                                <span v-if="scope.row.status === 1">
                                    <!-- 已连接 -->
                                    {{
                                        $t(
                                            "deviceLoadReportVerify.connectionStatusText1"
                                        )
                                    }}
                                </span>
                                <span
                                    class="red"
                                    v-else-if="scope.row.status === 2"
                                >
                                    <!-- 未连接 -->
                                    {{
                                        $t(
                                            "deviceLoadReportVerify.connectionStatusText2"
                                        )
                                    }}
                                </span>
                                <span class="red" v-else>
                                    <!-- 未输入 -->
                                    {{
                                        $t("deviceLoadReportVerify.notEntered")
                                    }}
                                </span>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div v-else-if="item.type == 'calibration'" class="calibration">
                    <div
                        v-for="(i, index) in item.listData"
                        class="form-detail-content"
                        v-bind:key="index"
                        :class="index != 0 ? 'b-t p-t-sm p-b-sm' : ''"
                    >
                        <div
                            class="form-detail-item"
                            v-for="j in i.listDatas"
                            v-bind:key="j.index"
                        >
                            <div>
                                <p>{{ j.title }}</p>
                                <span
                                    :class="j.isNormal ? '' : 'red'"
                                    v-if="j.type != 'image'"
                                    >{{
                                        j.content !== null &&
                                        j.content !== undefined &&
                                        j.content !== ""
                                            ? j.content
                                            : "--"
                                    }}{{
                                        j.content !== null &&
                                        j.content !== undefined &&
                                        j.content !== ""
                                            ? j.unit
                                            : ""
                                    }}</span
                                >
                            </div>
                            <viewer class="img-area">
                                <img
                                    :src="j.content"
                                    v-if="j.type == 'image'"
                                />
                            </viewer>
                        </div>
                    </div>
                </div>
                <div class="form-detail-content" v-else>
                    <div
                        class="form-detail-item"
                        v-for="i in item.listData"
                        v-bind:key="i.index"
                    >
                        <div>
                            <p>{{ i.title }}</p>
                            <span
                                :class="i.isNormal ? '' : 'red'"
                                v-if="i.type != 'image'"
                                >{{
                                    i.content !== null &&
                                    i.content !== undefined &&
                                    i.content !== ""
                                        ? i.content
                                        : "--"
                                }}</span
                            >
                        </div>
                        <viewer class="img-area">
                            <img :src="i.content" v-if="i.type == 'image'" />
                        </viewer>
                    </div>
                </div>
            </div>
        </div>
        <div class="footer">
            <div class="footer-btn">
                <el-button type="default" @click="goBack">
                    <!-- 返回 -->
                    {{ $t("common.return") }}
                </el-button>
                <el-button
                    type="default"
                    @click="handleUnpass"
                    v-if="type == 'check'"
                >
                    <!-- 不通过 -->
                    {{ $t("deviceLoadReportVerify.reportStatusText3") }}
                </el-button>
                <el-button
                    type="primary"
                    @click="handlePass"
                    v-if="type == 'check'"
                >
                    <!-- 审核通过 -->
                    {{ $t("deviceLoadReportVerify.reportStatusText2") }}
                </el-button>

                <el-button
                    type="default"
                    @click="handleUnpass"
                    v-if="type == 'deal'"
                >
                    <!-- 不通过 -->
                    {{ $t("deviceLoadReportVerify.reportStatusText3") }}
                </el-button>
                <el-button
                    type="primary"
                    @click="handlePass2"
                    v-if="type == 'deal'"
                >
                    <!-- 审核通过 -->
                    {{ $t("deviceLoadReportVerify.reportStatusText2") }}
                </el-button>
            </div>
        </div>
        <el-dialog
            :title="$t('deviceLoadReportVerify.reportStatusText3')"
            :visible.sync="dialogVisible"
        >
            <el-form
                :model="form"
                label-position="top"
                :rules="rules"
                ref="form"
                label-width="100px"
                class="demo-form"
            >
                <!-- 审批意见 -->
                <el-form-item
                    :label="$t('deviceLoadReportVerify.approvalOpinion')"
                    prop="reason"
                    :placeholder="$t('common.input')"
                >
                    <el-input
                        v-model="form.reason"
                        type="textarea"
                        :rows="6"
                        :count="200"
                        maxlength="200"
                        show-word-limit
                    ></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleCancel">
                    <!-- 取消 -->
                    {{ $t("common.cancel") }}
                </el-button>
                <el-button type="primary" @click="handleConfirm">
                     <!-- 确定 -->
                    {{ $t("common.ok") }}
                </el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data() {
        return {
            form: {
                reason: "",
            },
            rules: {
                reason: [
                    {
                        required: true,
                        // message: "请输入审批意见",
                        message: this.$t("deviceLoadReportVerify.reasonText1"),
                        trigger: "blur",
                    },
                    {
                        max: 200,
                        // message: "审批意见不超过200个字符",
                        message: this.$t("deviceLoadReportVerify.reasonText2"),
                        trigger: "blur",
                    },
                ],
            },
            dialogVisible: false,
            type: this.$route.query.type,
            reportId: this.$route.query.reportId,
            reportInfo: {},
            reportDetail: [],
            storageStatusMap: {
                // 存储介质状态：0-不存在 1-正常 2-异常 3-容量过小 4-未初始化 5-正在初始化
                0: this.$t("deviceLoadReportVerify.storageStatusMapText0"), //"不存在",
                1: this.$t("deviceLoadReportVerify.storageStatusMapText1"), //"正常",
                2: this.$t("deviceLoadReportVerify.storageStatusMapText2"), //"异常",
                3: this.$t("deviceLoadReportVerify.storageStatusMapText3"), //"容量过小",
                4: this.$t("deviceLoadReportVerify.storageStatusMapText4"), //"未初始化",
                5: this.$t("deviceLoadReportVerify.storageStatusMapText5"), //"正在初始化",
            },
            videoTypeMap: {
                Analog: this.$t("deviceLoadReportVerify.videoTypeMapText1"), //"（模拟相机）",
                IPC: this.$t("deviceLoadReportVerify.videoTypeMapText2"), // "（IPC）",
            },
            videoStatusMap: {
                1: this.$t("deviceLoadReportVerify.videoStatusMapText1"), //"正常",
                0: this.$t("deviceLoadReportVerify.videoStatusMapText0"), //"未连接",
            },
            locateLinkMap: {
                0: this.$t("deviceLoadReportVerify.locateLinkMapText0"), //"短路",
                1: this.$t("deviceLoadReportVerify.locateLinkMapText1"), //"检测状态未知",
                2: this.$t("deviceLoadReportVerify.locateLinkMapText2"), //"正常",
                3: this.$t("deviceLoadReportVerify.locateLinkMapText3"), //"开路",
            },
            netStatusMap: {
                1: this.$t("deviceLoadReportVerify.netStatusMapText1"), //"正常",
                2: this.$t("deviceLoadReportVerify.netStatusMapText2"), //"异常",
                3: this.$t("deviceLoadReportVerify.netStatusMapText3"), //"未插卡",
            },
            calibrationStatusMap: {
                1: this.$t("deviceLoadReportVerify.calibrationStatusMapText1"), //"正常",
                2: this.$t("deviceLoadReportVerify.calibrationStatusMapText2"), //"异常",
            },
        };
    },
    methods: {
        goBack() {
            this.$router.push("/manageCenter/deviceLoadReportVerify");
        },
        handleUnpass() {
            this.dialogVisible = true;
        },
        handleCancel() {
            this.$refs.form.resetFields();
            this.dialogVisible = false;
            this.form.reason = "";
        },
        handleConfirm() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    if (this.type == "check") {
                        this.$api
                            .revokeVerify({
                                reportId: this.reportId,
                                ...this.form,
                            })
                            .then((res) => {
                                if (res.success == true) {
                                    // "报告审核不通过！"
                                    this.$message.success(
                                        this.$t(
                                            "deviceLoadReportVerify.reportReviewFailed"
                                        )
                                    );
                                    this.dialogVisible = false;
                                    this.$router.push(
                                        "/manageCenter/deviceLoadReportVerify"
                                    );
                                } else {
                                    this.$message.error(res.msg);
                                }
                                this.$api.eventTrackTrigger({
                                    menu: "DEVICE_LOAD_TASK_MANAGE",
                                    business: "LOAD_REPORT_CHECK",
                                    eventResult: res.success,
                                });
                            });
                    } else {
                        this.$api
                            .handleIgnoreReport({
                                reportId: this.reportId,
                                ...this.form,
                                status: 3,
                            })
                            .then((res) => {
                                if (res.success == true) {
                                    // "报告审核不通过！"
                                    this.$message.success(
                                        this.$t(
                                            "deviceLoadReportVerify.reportReviewFailed"
                                        )
                                    );
                                    this.dialogVisible = false;
                                    this.$router.push(
                                        "/manageCenter/deviceLoadReportVerify"
                                    );
                                } else {
                                    this.$message.error(res.msg);
                                }
                                this.$api.eventTrackTrigger({
                                    menu: "DEVICE_LOAD_TASK_MANAGE",
                                    business: "LOAD_REPORT_CHECK",
                                    eventResult: res.success,
                                });
                            });
                    }
                } else {
                }
            });
        },
        handlePass() {
            this.$confirm(
                this.$t("deviceLoadReportVerify.surePass"), //"确定审批通过吗？"
                {
                    confirmButtonText: this.$t("deviceLoadReportVerify.pass"),
                    cancelButtonText: this.$t("common.cancel"),
                    type: "warning",
                }
            )
                .then(() => {
                    this.$api
                        .finishVerify({ reportId: this.reportId })
                        .then((res) => {
                            if (res.success == true) {
                                // "报告审核通过！"
                                this.$message.success(
                                    this.$t(
                                        "deviceLoadReportVerify.reportReviewSuccess"
                                    )
                                );
                                this.$router.push(
                                    "/manageCenter/deviceLoadReportVerify"
                                );
                            } else {
                                this.$message.error(res.msg);
                            }
                            this.$api.eventTrackTrigger({
                                menu: "DEVICE_LOAD_TASK_MANAGE",
                                business: "LOAD_REPORT_CHECK",
                                eventResult: res.success,
                            });
                        });
                })
                .catch(() => {});
        },

        handlePass2() {
            this.$confirm(
                this.$t("deviceLoadReportVerify.surePass"), //"确定审批通过吗？"
                {
                    confirmButtonText: this.$t("deviceLoadReportVerify.pass"),
                    cancelButtonText: this.$t("common.cancel"),
                    type: "warning",
                }
            )
                .then(() => {
                    this.$api
                        .handleIgnoreReport({
                            reportId: this.reportId,
                            status: 2,
                        })
                        .then((res) => {
                            if (res.success == true) {
                                // "报告审核通过！"
                                this.$message.success(
                                    this.$t(
                                        "deviceLoadReportVerify.reportReviewSuccess"
                                    )
                                );
                                this.$router.push(
                                    "/manageCenter/deviceLoadReportVerify"
                                );
                            } else {
                                this.$message.error(res.msg);
                            }
                            this.$api.eventTrackTrigger({
                                menu: "DEVICE_LOAD_TASK_MANAGE",
                                business: "LOAD_REPORT_CHECK",
                                eventResult: res.success,
                            });
                        });
                })
                .catch(() => {});
        },

        getDetail() {
            if (this.type !== "check") {
                this.$route.meta.title = this.$t("common.detail"); //"详情";
            } else {
                this.$route.meta.title = this.$t(
                    "deviceLoadReportVerify.examine"
                ); //"审核";
            }
            this.reportDetail = [];
            this.$api
                .getReportDetail({ reportId: this.reportId })
                .then((res) => {
                    if (res.success == true) {
                        this.reportInfo = res.data;
                        const inspection = res.data.inspection;

                        // 车辆信息
                        if (inspection.carInfo) {
                            const carInfo = inspection.carInfo;
                            const carInfoObj = {
                                // title: "车辆信息",
                                title: this.$t("carManage.vehicleInformation"),
                                state: "normal",
                                stateNum: 0,
                                listData: [
                                    {
                                        // title: "车牌号",
                                        title: this.$t("common.plateNum"),
                                        content: carInfo.plateNum,
                                        isNormal: true,
                                    },
                                    {
                                        // title: "车牌颜色",
                                        title: this.$t("carManage.plateColor"),
                                        content: carInfo.plateColor,
                                        isNormal: true,
                                    },
                                    {
                                        // title: "VIN",
                                        title: this.$t("common.vin"),
                                        content: carInfo.vin,
                                        isNormal: true,
                                    },
                                    {
                                        // title: "车辆使用性质",
                                        title: this.$t(
                                            "common.vehicleUsageNature"
                                        ),
                                        content: carInfo.carType,
                                        isNormal: true,
                                    },
                                ],
                            };
                            this.reportDetail.push(carInfoObj);
                        }

                        // 磁盘信息
                        if (inspection.storage) {
                            const storage = inspection.storage;
                            const storageList = [];
                            let storageStateNum = 0;
                            storage.map((i) => {
                                if (i.status !== 1) storageStateNum++;
                                storageList.push({
                                    title:
                                        (i.typeName ? `${i.typeName} - ` : "") +
                                        `${i.name}（${i.capacity || 0}GB）`,
                                    content: this.storageStatusMap[i.status],
                                    isNormal: i.status == 1,
                                });
                            });
                            const storageObj = {
                                // title: "磁盘信息",
                                title: this.$t(
                                    "deviceLoadReportVerify.diskInformation"
                                ),
                                state:
                                    storageStateNum > 0 ? "unnormal" : "normal",
                                stateNum: storageStateNum,
                                listData: storageList,
                            };
                            this.reportDetail.push(storageObj);
                        }

                        // 视频信息
                        if (inspection.video) {
                            const video = inspection.video;
                            const videoList = [];
                            let videoStateNum = 0;
                            video.map((i) => {
                                if (i.status !== 1) videoStateNum++;
                                videoList.push({
                                    title: `${i.name}${
                                        this.videoTypeMap[i.type]
                                    }`,
                                    content: this.videoStatusMap[i.status],
                                    isNormal: i.status == 1,
                                });
                            });
                            const videoObj = {
                                // title: "视频信息",
                                title: this.$t(
                                    "deviceLoadReportVerify.videoInformation"
                                ),
                                state:
                                    videoStateNum > 0 ? "unnormal" : "normal",
                                stateNum: videoStateNum,
                                listData: videoList,
                            };
                            this.reportDetail.push(videoObj);
                        }

                        // 平台信息
                        if (inspection.platform) {
                            const platform = inspection.platform;
                            const platformList = [];
                            let platformStateNum = 0;
                            platform.map((i) => {
                                if (i.status !== 1) platformStateNum++;
                                platformList.push({
                                    name: `第${i.id}中心`,
                                    add: i.add,
                                    // enabled: i.enabled ? "开启" : "关闭",
                                    enabled: i.enabled
                                        ? this.$t("common.open")
                                        : this.$t("common.close"),
                                    port: i.port,
                                    protocol: i.protocol,
                                    status: i.status,
                                    isNormal: i.status == 1,
                                });
                            });
                            const platformObj = {
                                // title: "平台信息",
                                title: this.$t(
                                    "deviceLoadReportVerify.platformInformation"
                                ),
                                state:
                                    platformStateNum > 0
                                        ? "unnormal"
                                        : "normal",
                                stateNum: platformStateNum,
                                type: "platform",
                                listData: platformList,
                            };
                            this.reportDetail.push(platformObj);
                        }

                        // 驾驶员信息
                        if (inspection.driver) {
                            const driver = inspection.driver;
                            const driverObj = {
                                // title: "驾驶员信息",
                                title: this.$t(
                                    "deviceLoadReportVerify.driverInformation"
                                ),
                                state: "normal",
                                stateNum: 0,
                                listData: [
                                    {
                                        // title: "驾驶员姓名",
                                        title: this.$t(
                                            "deviceLoadReportVerify.driverName"
                                        ),
                                        content: driver.name,
                                        isNormal: true,
                                    },
                                    {
                                        // title: "驾驶证号",
                                        title: this.$t(
                                            "deviceLoadReportVerify.driverNo"
                                        ),
                                        content: driver.driverNo,
                                        isNormal: true,
                                    },
                                    {
                                        // title: "有效期",
                                        title: this.$t(
                                            "deviceLoadReportVerify.driverValidDate"
                                        ),
                                        content: driver.validDate,
                                        isNormal: true,
                                    },
                                    {
                                        // title: "从业资格证号",
                                        title: this.$t(
                                            "deviceLoadReportVerify.driverQualificationNo"
                                        ),
                                        content: driver.qualificationNo,
                                        isNormal: true,
                                    },
                                    {
                                        // title: "发证机构",
                                        title: this.$t(
                                            "deviceLoadReportVerify.driverCertificateOrg"
                                        ),
                                        content: driver.certificateOrg,
                                        isNormal: true,
                                    },
                                    // { title: '身份证号', content: driver.idNum, isNormal: true },
                                    // { title: '驾驶员代码', content: driver.code, isNormal: true }
                                ],
                            };
                            this.reportDetail.push(driverObj);
                        }

                        // 定位信息
                        if (inspection.locate) {
                            const locate = inspection.locate;
                            const locateObj = {
                                // title: "定位信息",
                                title: this.$t(
                                    "deviceLoadReportVerify.locateInformation"
                                ),
                                state: "normal",
                                stateNum: 0,
                                listData: [
                                    {
                                        // title: "定位状态",
                                        title: this.$t(
                                            "deviceLoadReportVerify.positioningStatus"
                                        ),
                                        content:
                                            this.locateLinkMap[locate.link],
                                        isNormal: true,
                                    },
                                    {
                                        // title: "连接星数",
                                        title: this.$t(
                                            "deviceLoadReportVerify.connectedStarsNumber"
                                        ),
                                        content: locate.strength,
                                        isNormal: true,
                                    },
                                ],
                            };
                            this.reportDetail.push(locateObj);
                        }

                        // 网络信息
                        if (inspection.net) {
                            const net = inspection.net;
                            let netStateNum = 0;
                            if (net.status != 1) netStateNum++;
                            if (net.strength <= 0) netStateNum++;
                            const netObj = {
                                // title: "网络信息",
                                title: this.$t(
                                    "deviceLoadReportVerify.networkInformation"
                                ),
                                state: netStateNum > 0 ? "unnormal" : "normal",
                                stateNum: netStateNum,
                                listData: [
                                    {
                                        // title: "蜂窝网络模块",
                                        title: this.$t(
                                            "deviceLoadReportVerify.cellularNetworkModule"
                                        ),
                                        content: net.moduleNum,
                                        isNormal: true,
                                    },
                                    {
                                        // title: "拨号状态",
                                        title: this.$t(
                                            "deviceLoadReportVerify.dialing"
                                        ),
                                        content: `${
                                            this.netStatusMap[net.status]
                                        } ${
                                            net.status == 2
                                                ? `（${net.reason}）`
                                                : ""
                                        }`,
                                        isNormal: net.status == 1,
                                    },
                                    {
                                        // title: "信号强度",
                                        title: this.$t(
                                            "deviceLoadReportVerify.signalStrength"
                                        ),
                                        content: net.strength
                                            ? net.strength
                                            : this.$t(
                                                  "deviceLoadReportVerify.noSignal"
                                              ), //"无信号"
                                        isNormal: true,
                                    },
                                ],
                            };
                            this.reportDetail.push(netObj);
                        }

                        // 标定信息
                        if (inspection.calibration) {
                            const calibration = inspection.calibration;
                            const calibrationObj = {
                                // title: "标定信息",
                                title: this.$t(
                                    "deviceLoadReportVerify.calibrationInformation"
                                ),
                                state: "normal",
                                stateNum: 0,
                                type: "calibration",
                                listData: [],
                            };
                            calibration.map((i) => {
                                if (i.name == "ADAS") {
                                    const adas = i;
                                    calibrationObj.listData.push({
                                        name: "ADAS",
                                        listDatas: [
                                            {
                                                // title: "ADAS标定状态",
                                                title: this.$t(
                                                    "deviceLoadReportVerify.calibrationInformationText1"
                                                ),
                                                content:
                                                    this.calibrationStatusMap[
                                                        adas.status
                                                    ],
                                                isNormal: adas.status == 1,
                                            },
                                            {
                                                // title: "启用状态",
                                                title: this.$t(
                                                    "deviceLoadReportVerify.calibrationInformationText2"
                                                ),
                                                content: adas.enabled
                                                    ? this.$t("common.open")
                                                    : this.$t("common.close"),
                                                isNormal: true,
                                            },
                                            {
                                                // title: "通道",
                                                title: this.$t(
                                                    "deviceLoadReportVerify.calibrationInformationText3"
                                                ),
                                                content: adas.channelId,
                                                isNormal: true,
                                            },
                                            {
                                                // title: "垂直距离",
                                                title: this.$t(
                                                    "deviceLoadReportVerify.calibrationInformationText4"
                                                ),
                                                content: adas.vehicleDistance,
                                                unit: this.$t(
                                                    "deviceLoadReportVerify.cm"
                                                ),
                                                isNormal: true,
                                            },
                                            {
                                                // title: "车头距离",
                                                title: this.$t(
                                                    "deviceLoadReportVerify.calibrationInformationText5"
                                                ),
                                                content: adas.headDistance,
                                                unit: this.$t(
                                                    "deviceLoadReportVerify.cm"
                                                ),
                                                isNormal: true,
                                            },
                                            {
                                                // title: "左轮距离",
                                                title: this.$t(
                                                    "deviceLoadReportVerify.calibrationInformationText6"
                                                ),
                                                content: adas.leftWheelDistance,
                                                unit: this.$t(
                                                    "deviceLoadReportVerify.cm"
                                                ),
                                                isNormal: true,
                                            },
                                            {
                                                // title: "右轮距离",
                                                title: this.$t(
                                                    "deviceLoadReportVerify.calibrationInformationText7"
                                                ),
                                                content:
                                                    adas.rightWheelDistance,
                                                unit: this.$t(
                                                    "deviceLoadReportVerify.cm"
                                                ),
                                                isNormal: true,
                                            },
                                            {
                                                // title: "车头占比",
                                                title: this.$t(
                                                    "deviceLoadReportVerify.calibrationInformationText8"
                                                ),
                                                content: adas.headRatio,
                                                unit: "%",
                                                isNormal: true,
                                            },
                                            {
                                                // title: "图像",
                                                title: this.$t(
                                                    "deviceLoadReportVerify.calibrationInformationText9"
                                                ),
                                                content:
                                                    adas.imageUrl == "" ||
                                                    adas.imageUrl == undefined
                                                        ? this.$t(
                                                              "deviceLoadReportVerify.notUploaded"
                                                          )
                                                        : adas.imageUrl,
                                                isNormal:
                                                    adas.imageUrl != "" &&
                                                    adas.imageUrl != undefined,
                                                type:
                                                    adas.imageUrl == "" ||
                                                    adas.imageUrl == undefined
                                                        ? ""
                                                        : "image",
                                            },
                                        ],
                                    });
                                } else if (
                                    i.name == "BSD" ||
                                    i.name == "DSM" ||
                                    i.name == "WHD"
                                ) {
                                    calibrationObj.listData.push({
                                        name: i.name,
                                        listDatas: [
                                            {
                                                title:
                                                    i.name +
                                                    this.$t(
                                                        "deviceLoadReportVerify.calibrationInformationText9"
                                                    ), //图像,
                                                content:
                                                    i.imageUrl == "" ||
                                                    i.imageUrl == undefined
                                                        ? this.$t(
                                                              "deviceLoadReportVerify.notUploaded"
                                                          )
                                                        : i.imageUrl,
                                                isNormal:
                                                    i.imageUrl != "" &&
                                                    i.imageUrl != undefined,
                                                type:
                                                    i.imageUrl == "" ||
                                                    i.imageUrl == undefined
                                                        ? ""
                                                        : "image",
                                            },
                                            {
                                                // title: "通道",
                                                title: this.$t(
                                                    "deviceLoadTaskManage.channel"
                                                ),
                                                content: i.channelId,
                                                isNormal: true,
                                            },
                                        ],
                                    });
                                } else if (i.name == "STOPLIGHT") {
                                    calibrationObj.listData.push({
                                        // name: "刹车",
                                        name: this.$t(
                                            "deviceLoadReportVerify.brake"
                                        ),
                                        listDatas: [
                                            {
                                                // title: "刹车状态",
                                                title: this.$t(
                                                    "deviceLoadReportVerify.brakeStatus"
                                                ),
                                                content:
                                                    this.calibrationStatusMap[
                                                        i.status
                                                    ],
                                                isNormal: i.status == 1,
                                            },
                                        ],
                                    });
                                } else if (i.name == "LEFT-LAMP") {
                                    calibrationObj.listData.push({
                                        // name: "左转向灯",
                                        name: this.$t(
                                            "deviceLoadReportVerify.leftTurnSignal"
                                        ),
                                        listDatas: [
                                            {
                                                // title: "左转向灯状态",
                                                title: this.$t(
                                                    "deviceLoadReportVerify.leftTurnSignalStatus"
                                                ),
                                                content:
                                                    this.calibrationStatusMap[
                                                        i.status
                                                    ],
                                                isNormal: i.status == 1,
                                            },
                                        ],
                                    });
                                } else if (i.name == "RIGHT-LAMP") {
                                    calibrationObj.listData.push({
                                        // name: "右转向灯",
                                        name: this.$t(
                                            "deviceLoadReportVerify.rightTurnSignal"
                                        ),
                                        listDatas: [
                                            {
                                                // title: "右转向灯状态",
                                                title: this.$t(
                                                    "deviceLoadReportVerify.rightTurnSignalStatus"
                                                ),
                                                content:
                                                    this.calibrationStatusMap[
                                                        i.status
                                                    ],
                                                isNormal: i.status == 1,
                                            },
                                        ],
                                    });
                                } else {
                                    calibrationObj.listData.push({
                                        name: i.name,
                                        listDatas: [
                                            {
                                                title:
                                                    i.name +
                                                    this.$t(
                                                        "deviceLoadTaskManage.taskStatus"
                                                    ),
                                                content:
                                                    this.calibrationStatusMap[
                                                        i.status
                                                    ],
                                                isNormal: i.status == 1,
                                            },
                                        ],
                                    });
                                }
                            });
                            this.reportDetail.push(calibrationObj);
                        }

                        // 装车图片
                        const picObj = {
                            // title: "装车图片",
                            title: this.$t(
                                "deviceLoadReportVerify.loadingPicture"
                            ),
                            state: "normal",
                            stateNum: 0,
                            listData: [
                                {
                                    // title: "GPS天线图像",
                                    title: this.$t(
                                        "deviceLoadReportVerify.loadingPictureText1"
                                    ),
                                    content:
                                        this.reportInfo.gpsAntennaImage == "" ||
                                        this.reportInfo.gpsAntennaImage ==
                                            undefined
                                            ? this.$t(
                                                  "deviceLoadReportVerify.notUploaded"
                                              )
                                            : this.reportInfo.gpsAntennaImage,
                                    isNormal:
                                        this.reportInfo.gpsAntennaImage != "" &&
                                        this.reportInfo.gpsAntennaImage !=
                                            undefined,
                                    type:
                                        this.reportInfo.gpsAntennaImage == "" ||
                                        this.reportInfo.gpsAntennaImage ==
                                            undefined
                                            ? ""
                                            : "image",
                                },
                                {
                                    // title: "4G天线图像",
                                    title: this.$t(
                                        "deviceLoadReportVerify.loadingPictureText2"
                                    ),
                                    content:
                                        this.reportInfo.c4gAntennaImage == "" ||
                                        this.reportInfo.c4gAntennaImage ==
                                            undefined
                                            ? this.$t(
                                                  "deviceLoadReportVerify.notUploaded"
                                              )
                                            : this.reportInfo.c4gAntennaImage,
                                    isNormal:
                                        this.reportInfo.c4gAntennaImage != "" &&
                                        this.reportInfo.c4gAntennaImage !=
                                            undefined,
                                    type:
                                        this.reportInfo.c4gAntennaImage == "" ||
                                        this.reportInfo.c4gAntennaImage ==
                                            undefined
                                            ? ""
                                            : "image",
                                },
                                {
                                    // title: "整车图像",
                                    title: this.$t(
                                        "deviceLoadReportVerify.loadingPictureText3"
                                    ),
                                    content:
                                        this.reportInfo.carOverallImage == "" ||
                                        this.reportInfo.carOverallImage ==
                                            undefined
                                            ? this.$t(
                                                  "deviceLoadReportVerify.notUploaded"
                                              )
                                            : this.reportInfo.carOverallImage,
                                    isNormal:
                                        this.reportInfo.carOverallImage != "" &&
                                        this.reportInfo.carOverallImage !=
                                            undefined,
                                    type:
                                        this.reportInfo.carOverallImage == "" ||
                                        this.reportInfo.carOverallImage ==
                                            undefined
                                            ? ""
                                            : "image",
                                },
                                {
                                    // title: "主机图像",
                                    title: this.$t(
                                        "deviceLoadReportVerify.loadingPictureText4"
                                    ),
                                    content:
                                        this.reportInfo.hostImage == "" ||
                                        this.reportInfo.hostImage == undefined
                                            ? this.$t(
                                                  "deviceLoadReportVerify.notUploaded"
                                              )
                                            : this.reportInfo.hostImage,
                                    isNormal:
                                        this.reportInfo.hostImage != "" &&
                                        this.reportInfo.hostImage != undefined,
                                    type:
                                        this.reportInfo.hostImage == "" ||
                                        this.reportInfo.hostImage == undefined
                                            ? ""
                                            : "image",
                                },
                                {
                                    // title: "ADAS位置图像",
                                    title: this.$t(
                                        "deviceLoadReportVerify.loadingPictureText5"
                                    ),
                                    content:
                                        this.reportInfo.adasLocationImage ==
                                            "" ||
                                        this.reportInfo.adasLocationImage ==
                                            undefined
                                            ? this.$t(
                                                  "deviceLoadReportVerify.notUploaded"
                                              )
                                            : this.reportInfo.adasLocationImage,
                                    isNormal:
                                        this.reportInfo.adasLocationImage !=
                                            "" &&
                                        this.reportInfo.adasLocationImage !=
                                            undefined,
                                    type:
                                        this.reportInfo.adasLocationImage ==
                                            "" ||
                                        this.reportInfo.adasLocationImage ==
                                            undefined
                                            ? ""
                                            : "image",
                                },
                                {
                                    // title: "DSM位置图像",
                                    title: this.$t(
                                        "deviceLoadReportVerify.loadingPictureText6"
                                    ),
                                    content:
                                        this.reportInfo.dbaLocationImage ==
                                            "" ||
                                        this.reportInfo.dbaLocationImage ==
                                            undefined
                                            ? this.$t(
                                                  "deviceLoadReportVerify.notUploaded"
                                              )
                                            : this.reportInfo.dbaLocationImage,
                                    isNormal:
                                        this.reportInfo.dbaLocationImage !=
                                            "" &&
                                        this.reportInfo.dbaLocationImage !=
                                            undefined,
                                    type:
                                        this.reportInfo.dbaLocationImage ==
                                            "" ||
                                        this.reportInfo.dbaLocationImage ==
                                            undefined
                                            ? ""
                                            : "image",
                                },
                            ],
                        };
                        this.reportDetail.push(picObj);
                    } else {
                        this.$message.error(res.msg);
                    }
                });
        },
    },
    mounted() {
        this.getDetail();
    },
};
</script>
<style lang="less" scoped>
.verify-detail {
    .reportStatus {
        background: rgb(242, 242, 242);
        display: flex;
        align-items: center;
        flex-direction: row;
        width: 100%;
        padding: 16px 40px;
        height: 75px;
        .state {
            display: flex;
            align-items: center;
            font-size: 26px;
            .unpass {
                color: red;
                font-size: 22px;
                margin-left: 8px;
                font-weight: 600;
            }
            .pass {
                color: rgb(82, 196, 26);
                font-size: 22px;
                margin-left: 8px;
                font-weight: 600;
            }
        }
        .reason {
            flex: 1;
            font-size: 14px;
            display: flex;
            flex-direction: column;
            margin-left: 40px;
            p {
                color: #999;
                line-height: 1;
                margin-bottom: 6px;
            }
        }
    }
    .detail-main {
        padding: 10px 40px 10px 40px;
        height: calc(~"100% - 56px");
        overflow-y: auto;
        &.main2 {
            height: calc(~"100% - 56px - 75px");
        }
        .title {
            display: flex;
            align-items: center;
            font-size: 18px;
            font-weight: 600;
            color: rgba(0, 0, 0, 0.85);
            padding: 12px 0 4px;
            &::before {
                content: "";
                width: 4px;
                height: 16px;
                margin-right: 6px;
                color: rgba(0, 0, 0, 0.8);
                background: rgba(0, 0, 0, 0.8);
                display: inline-block;
            }
            .state {
                color: #ffffff;
                width: 56px;
                height: 24px;
                font-size: 14px;
                font-weight: normal;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 12px;
                margin-left: 10px;
                &.normal {
                    background: rgb(82, 196, 26);
                }
                &.unnormal {
                    background: rgb(252, 122, 126);
                }
            }
        }
        .form-detail-content {
            display: flex;
            flex-wrap: wrap;
            .form-detail-item {
                width: 25%;
                margin: 10px 0;
                font-size: 14px;
                display: flex;
                flex-direction: row;
                .img-area {
                    height: 40px;
                    min-width: 40px;
                    margin-left: 10px;
                    cursor: pointer;
                }
                img {
                    height: 100%;
                }
                p {
                    color: #999;
                    line-height: 1;
                    margin-bottom: 6px;
                }
            }
            span {
                &.red {
                    color: rgb(252, 122, 126);
                }
            }
        }
        .table {
            margin: 8px 0 12px 0;
        }
    }
    .footer {
        z-index: 99;
        width: 100%;
        height: 56px;
        border-top: 1px solid rgba(0, 0, 0, 0.06);
        position: fixed;
        bottom: 0;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        background: #ffffff;
        left: 0;
        .footer-btn {
            padding-right: 28px;
        }
    }
}
</style>
