<template>
    <div class="firmware-box">
        <el-tabs v-model="activeName" @tab-click="handleClick" class="p-x">
            <!-- 主机 -->
            <el-tab-pane :label="$t('firmware.host')" name="main"></el-tab-pane>
            <!-- 外设 -->
            <el-tab-pane
                :label="$t('firmware.peripherals')"
                name="peripheral"
            ></el-tab-pane>
        </el-tabs>
        <div ref="searchBox" class="search-module">
            <div class="search-form-content">
                <el-form :model="searchForm" ref="searchForm" inline>
                    <!-- 备注 -->
                    <el-form-item :label="$t('firmware.notes')" prop="remark">
                        <el-input
                            clearable
                            v-model="searchForm.remark"
                            :placeholder="$t('common.input')"
                        ></el-input>
                    </el-form-item>
                    <!-- 外设名称 -->
                    <el-form-item
                        :label="$t('firmware.peripheralName')"
                        prop="peripheralType"
                        v-if="activeName === 'peripheral'"
                    >
                        <el-select
                            style="width: 100%"
                            v-model="searchForm.peripheralType"
                            :placeholder="$t('common.select')"
                            clearable
                        >
                            <el-option
                                v-for="(item, index) in deviceTypeList"
                                :key="index"
                                :value="item.sysDictCode"
                                :label="item.sysDictName"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
            <div>
                <el-button
                    type="primary"
                    :loading="searchLoading"
                    :disabled="searchLoading"
                    @click="
                        params.currentPage = 1;
                        search();
                    "
                >
                    <!-- 查询 -->
                    {{ $t("common.search") }}
                </el-button>
                <el-button type="default" @click="handleReset()">
                    <!-- 清除条件 -->
                    {{ $t("common.reset") }}
                </el-button>
            </div>
        </div>
        <div ref="searchBtn" class="p-x">
            <el-button type="primary" @click="openFirmwareUpload">
                <!-- 上传固件包 -->
                {{ $t("firmware.uploadFirmwarePackage") }}
            </el-button>
        </div>
        <div class="m-b m-y p-x">
            <el-table
                v-loading="searchLoading"
                :element-loading-text="$t('common.desperatelyLoading')"
                element-loading-color="#007213"
                :data="tableData"
                highlight-current-row
                @current-change="radioChange"
                :height="tableHeight"
                border
            >
                <!-- 上传时间 -->
                <el-table-column
                    fixed
                    prop="createTime"
                    :label="$t('devLog.uploaded')"
                    min-width="165px"
                >
                    <template slot-scope="scope">
                        {{
                            $moment(scope.row.createTime).format(
                                "YYYY-MM-DD HH:mm:ss"
                            )
                        }}
                    </template>
                </el-table-column>
                <!-- 设备型号 -->
                <el-table-column
                    prop="deviceModelCode"
                    :label="$t('common.deviceModelCode')"
                    min-width="160px"
                    :show-overflow-tooltip="true"
                    v-if="activeName === 'main'"
                >
                </el-table-column>
                <!-- 接入协议 -->
                <el-table-column
                    prop="protocolName"
                    :label="$t('common.protocolName')"
                    min-width="100px"
                    :show-overflow-tooltip="true"
                    v-if="activeName === 'main'"
                >
                </el-table-column>
                <!-- '设备版本号' : '外设版本号' -->
                <el-table-column
                    prop="firmwareVersion"
                    :label="
                        activeName === 'main'
                            ? $t('firmware.deviceVersionNumber')
                            : $t('firmware.peripheralVersionNumber')
                    "
                    min-width="165px"
                    key="firmwareVersion"
                ></el-table-column>
                <!-- 外设名称 -->
                <el-table-column
                    prop="peripheralTypeName"
                    :label="$t('firmware.peripheralName')"
                    min-width="160px"
                    key="peripheralTypeName"
                    v-if="activeName === 'peripheral'"
                ></el-table-column>
                <!-- 上传人员 -->
                <el-table-column
                    prop="createName"
                    :label="$t('firmware.uploadPersonnel')"
                    min-width="100px"
                ></el-table-column>
                <!-- 大小(MB) -->
                <el-table-column
                    prop="fileSize"
                    :label="$t('firmware.size') + '(MB)'"
                    min-width="100px"
                    align="right"
                >
                    <template slot-scope="scope">
                        <div v-if="scope.row.fileSize">
                            {{
                                Math.ceil(
                                    (scope.row.fileSize / 1024 / 1024) * 100
                                ) / 100
                            }}
                        </div>
                        <div v-else>--</div>
                    </template>
                </el-table-column>
                <!-- 固件名称 -->
                <el-table-column
                    prop="originalFileName"
                    :label="$t('firmware.firmwareName')"
                    min-width="160px"
                    show-overflow-tooltip
                ></el-table-column>
                <!-- 备注 -->
                <el-table-column
                    prop="remark"
                    :label="$t('firmware.notes')"
                    fixed="right"
                    show-overflow-tooltip
                    min-width="160px"
                ></el-table-column>
                <!-- 操作 -->
                <el-table-column
                    fixed="right"
                    :label="$t('common.operate')"
                    width="100px"
                >
                    <template slot-scope="scope">
                        <el-button type="text">
                            <!-- 选择 -->
                            {{ $t("login.select") }}
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div ref="searchPagination" class="wrap-bottom m-x">
            <el-pagination
                :current-page="params.currentPage"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :page-sizes="[20, 50, 100]"
                :page-size="params.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
            >
            </el-pagination>
        </div>
        <div class="footer-button p-r p-y">
            <el-button type="default" @click="goBack">
                <!-- 返回 -->
                {{ $t("common.return") }}
            </el-button>
            <el-button
                type="primary"
                :loading="loadingBol"
                @click="startUpgrade"
            >
                <!-- 下发至终端 -->
                {{ $t("deviceUpgrade.issuedToTerminal") }}
            </el-button>
        </div>
        <StartUpgrade
            :visible.sync="startUpgradeVisible"
            :organizeId="organizeId"
            :taskId="taskId"
            :deviceInfoList="deviceInfoList"
            @continueUpgrade="continueUpgrade"
        ></StartUpgrade>
        <div v-if="showFirmwareUpload">
            <FirmwareUpload
                :defaultType="activeName"
                @close="closeFirmwareUpload"
                :visible="firmwareVisible"
                :deviceModelCode="searchForm.deviceModelCode"
            ></FirmwareUpload>
        </div>
        <el-dialog
            :visible.sync="dialogVisible"
            :width="'495px'"
            :custom-class="'confirm-dialog'"
        >
            <div class="upgradeDispose">
                <div class="title">
                    <i
                        style="color: #faad14; font-size: 20px"
                        class="el-icon-warning"
                    ></i>
                    <span>
                        <!-- 确认对同版本进行升级吗？ -->
                        {{ $t("deviceUpgrade.sameVersionUpgradeText1") }}
                    </span>
                </div>
                <p class="marginBottom">
                    <!-- 待升级的设备中可能含有相同设备版本号的固件，是否对同版本进行升级？再次升级将消耗额外流量。 -->
                    {{ $t("deviceUpgrade.sameVersionUpgradeText2") }}
                </p>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="noEqualUpgrade">
                    <!-- 仅升级不同版本号设备 -->
                    {{ $t("deviceUpgrade.sameVersionUpgradeText3") }}
                </el-button>
                <el-button type="primary" @click="equalUpgrade">
                    <!-- 全部升级 -->
                    {{ $t("deviceUpgrade.sameVersionUpgradeText4") }}
                </el-button>
            </span>
        </el-dialog>
        <!-- 确定要将该固件下发至设备吗？ -->
        <el-dialog
            :close-on-click-modal="false"
            :visible.sync="confirmVisible"
            :width="'600px'"
            :custom-class="'new-dialog'"
            :title="$t('deviceUpgrade.firmwareDistributionToDevice')"
        >
            <div>
                <!-- 待升级的设备中可能存在与当前相同版本号的固件，对同版本升级将消耗额外流量 -->
                <el-alert
                    v-show="activeName == 'main'"
                    :title="$t('deviceUpgrade.sameVersionAlert')"
                    type="warning"
                    show-icon
                    :closable="false"
                    style="margin: 22px 0"
                >
                </el-alert>
                <el-form
                    :model="confirmForm"
                    ref="confirmForm"
                    label-width="140px"
                    :label-position="'top'"
                >
                    <!-- 升级失败是否重试升级 -->
                    <el-form-item
                        :label="$t('deviceUpgrade.retryMark')"
                        prop="retryMark"
                    >
                        <el-radio-group v-model="confirmForm.retryMark">
                            <el-radio :label="1">
                                <!-- 重试 -->
                                {{ $t("deviceUpgrade.retry") }}
                            </el-radio>
                            <el-radio :label="0">
                                <!-- 不重试 -->
                                {{ $t("deviceUpgrade.notRetry") }}
                            </el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <!-- 是否对同版本进行升级 -->
                    <el-form-item
                        v-show="activeName == 'main'"
                        :label="$t('deviceUpgrade.equalNeedUpgrade')"
                        prop="equalNeedUpgrade"
                        :rules="[
                            {
                                required: true,
                                message: this.$t('common.select'),
                                trigger: 'change',
                            },
                        ]"
                    >
                        <el-radio-group v-model="confirmForm.equalNeedUpgrade">
                            <el-radio :label="0">
                                <!-- 仅升级不同版本号设备 -->
                                {{
                                    this.$t(
                                        "deviceUpgrade.sameVersionUpgradeText3"
                                    )
                                }}
                            </el-radio>
                            <el-radio :label="1">
                                <!-- 全部升级 -->
                                {{
                                    this.$t(
                                        "deviceUpgrade.sameVersionUpgradeText4"
                                    )
                                }}
                            </el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <!-- 升级原因 -->
                    <el-form-item
                        :label="$t('deviceUpgrade.reasonForUpgrade')"
                        prop="equalNeedUpgrade"
                    >
                        <el-checkbox-group
                            v-model="confirmForm.checkList"
                            @change="handleCheckAllChange"
                        >
                            <!-- 新增需求升级固件 -->
                            <el-checkbox
                                :label="
                                    $t(
                                        'deviceUpgrade.newRequirementToUpgradeFirmware'
                                    )
                                "
                            ></el-checkbox>
                            <!-- 设备问题升级固件 -->
                            <el-checkbox
                                :label="
                                    $t(
                                        'deviceUpgrade.upgradeFirmwareForDeviceIssues'
                                    )
                                "
                            ></el-checkbox>
                            <!-- 异常升级维护 -->
                            <el-checkbox
                                v-btn="'deviceUpgradeDowngradeUpgrade'"
                                :label="
                                    $t(
                                        'deviceUpgrade.abnormalUpgradeMaintenance'
                                    )
                                "
                                v-show="activeName == 'main'"
                            >
                                <!-- 异常升级维护 -->
                                {{
                                    $t(
                                        "deviceUpgrade.abnormalUpgradeMaintenance"
                                    )
                                }}
                                <!-- 需要降版本升级，请勾选异常升级维护，并输入验证码后执行 -->
                                <el-tooltip
                                    :content="
                                        $t(
                                            'deviceUpgrade.abnormalUpgradeMaintenanceText'
                                        )
                                    "
                                >
                                    <i
                                        class="el-icon-warning-outline"
                                    ></i> </el-tooltip
                            ></el-checkbox>
                            <!-- 其他 -->
                            <el-checkbox
                                :label="$t('deviceHealthCondition.other')"
                            ></el-checkbox>
                        </el-checkbox-group>
                        <el-input
                            v-if="
                                confirmForm.checkList.find(
                                    (item) =>
                                        item ===
                                        $t('deviceHealthCondition.other')
                                )
                            "
                            type="textarea"
                            :rows="4"
                            :placeholder="$t('common.input')"
                            v-model="confirmForm.textarea"
                            maxlength="200"
                            show-word-limit
                        >
                        </el-input>
                    </el-form-item>
                    <el-form-item
                        v-if="
                            confirmForm.checkList.find(
                                (item) =>
                                    item ===
                                    $t(
                                        'deviceUpgrade.abnormalUpgradeMaintenance'
                                    )
                            ) && whetherCheckLowVersionUpgrade
                        "
                        :label="$t('login.verificationCode')"
                        prop="verificationCode"
                        :rules="[
                            {
                                required: true,
                                message: this.$t('common.input'),
                                trigger: 'blur',
                            },
                        ]"
                    >
                        <el-input
                            v-model="confirmForm.verificationCode"
                            :placeholder="$t('common.input')"
                            style="width: 200px"
                        ></el-input>
                        <el-button
                            class="m-x-sm"
                            @click="newUpgradeGetPhoneVeryCode"
                            :disabled="blackTime > 0"
                            v-show="blackTime <= 0"
                        >
                            <!-- 获取 -->
                            {{ $t("deviceUpgrade.obtain") }}
                        </el-button>
                        <el-button
                            class="m-x-sm"
                            :disabled="blackTime > 0"
                            v-show="blackTime > 0"
                            >{{ blackTime }} s</el-button
                        >
                        <span>
                            <!-- 请联系海康技术支持获取验证码 -->
                            {{
                                $t(
                                    "deviceUpgrade.contactHikvisionTechnicalSupport"
                                )
                            }}
                        </span>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="confirmVisible = false">
                    <!-- 取消 -->
                    {{ $t("common.cancel") }}
                </el-button>
                <el-button type="primary" @click="doUpgradeReason">
                    <!-- 下发 -->
                    {{ $t("common.issued") }}
                </el-button>
            </span>
        </el-dialog>
        <el-dialog
            :title="`批量导入${typeListSelected}`"
            :visible.sync="deviceListVisible"
            :width="'500px'"
        >
            <div class="device-list">
                <div>
                    <i class="el-icon-info"></i>
                    <span>
                        <!-- 你导入的{{
                            typeListSelected
                        }}有多种设备型号，请选择其中一种进行升级 -->
                        {{
                            $t("deviceUpgrade.chooseOneToUpgrade", {
                                typeListSelected: typeListSelected,
                            })
                        }}
                    </span>
                </div>
                <p>
                    <!-- 设备型号列表 -->
                    {{ $t("deviceUpgrade.equipmentModelList") }}
                </p>
                <el-radio-group v-model="deviceModelCode">
                    <el-radio
                        :disabled="item.disabled"
                        :label="item.deviceModelCode"
                        v-for="item in deviceInfoList"
                        :key="item.deviceModelCode"
                        ><span :title="item.deviceModelCode">{{
                            item.deviceModelCode
                        }}</span
                        >&nbsp;&nbsp;[{{
                            item.checkDeviceInfos.length
                        }}]<!-- 辆 -->
                        {{ $t("deviceUpgrade.theVehicle") }}</el-radio
                    >
                </el-radio-group>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="deviceListVisible = false">
                    <!-- 取消 -->
                    {{ $t("common.cancel") }}
                </el-button>
                <el-button type="primary" @click="doDeviceList">
                    <!-- 确定 -->
                    {{ $t("common.ok") }}
                </el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import FirmwareUpload from "@/components/coreManage/firmwareUpload";
import StartUpgrade from "@/components/coreManage/startUpgrade";
export default {
    name: "upgrade",
    components: { StartUpgrade, FirmwareUpload },
    data() {
        return {
            typeListSelected: this.$route.query.typeListSelected,
            radio: "1",
            searchLoading: true,
            task: 0,
            loadingBol: false,
            dialogVisible: false,
            confirmVisible: false,
            // compulsive:false,
            // forceCoverage:false,
            title: "",
            tableHeight: 500,
            params: {
                currentPage: 1, //页码，从1开始
                pageSize: 20, //分页大小
                orderColumn: "createTime", //排序列
                orderDir: "desc", //排序方向
            },
            total: 0,
            firmwareVisible: false,
            showFirmwareUpload: false,
            searchForm: {
                remark: "",
                peripheralType: "",
            },
            tableData: [],
            selectId: "",
            selection: {},
            startUpgradeVisible: false,
            organizeId: +this.$route.query.organizeId,
            taskId: null,
            equalNeedUpgrade: null,
            deviceIds: this.$route.query.deviceIds,
            deviceInfoList: [],
            deviceListVisible: false,
            deviceModelCode: "",
            timer: null,
            confirmForm: {
                equalNeedUpgrade: 0,
                checkList: [
                    this.$t("deviceUpgrade.upgradeFirmwareForDeviceIssues"), //设备问题升级固件
                ],
                textarea: "",
                verificationCode: "",
                retryMark: 1,
            },
            activeName: "main",
            blackTime: 0,
            deviceTypeList: [],
            whetherCheckLowVersionUpgrade: false,
        };
    },
    methods: {
        handleSizeChange(val) {
            this.params.pageSize = val;
            this.search();
        },
        handleCurrentChange(val) {
            this.params.currentPage = val;
            this.search();
        },
        openFirmwareUpload() {
            this.showFirmwareUpload = true;
            this.firmwareVisible = true;
        },
        closeFirmwareUpload(data) {
            this.firmwareVisible = false;
            setTimeout(() => {
                this.showFirmwareUpload = false;
            }, 300);
            if (data) {
                this.search();
            }
        },
        goBack() {
            this.$router.go(-1);
        },
        // 设备升级 下发终端
        startUpgrade() {
            if (!this.selectId) {
                // 请先选择固件！
                this.$message.warning(this.$t("firmware.firstSelectFirmware"));
                return;
            }
            // this.dialogVisible = true;
            this.confirm();
            // this.pickCheckUpgradeTask()
        },
        noEqualUpgrade() {
            this.equalNeedUpgrade = 0;
            this.dialogVisible = false;
            this.confirm();
        },
        equalUpgrade() {
            this.equalNeedUpgrade = 1;
            this.dialogVisible = false;
            this.confirm();
        },
        confirm() {
            this.confirmForm.equalNeedUpgrade =
                this.activeName == "main" ? 0 : 1;
            this.confirmForm.checkList = [
                this.$t("deviceUpgrade.upgradeFirmwareForDeviceIssues"), //"设备问题升级固件"
            ];
            this.confirmForm.textarea = "";
            this.confirmForm.verificationCode = "";

            this.confirmVisible = true;
        },
        doUpgradeReason() {
            this.$refs.confirmForm.validate((valid) => {
                if (valid) {
                    const params = {
                        deviceIds: this.$route.query.deviceIds,
                        organizeId: this.$route.query.organizeId,
                        deviceId: this.$route.query.deviceId,
                        deviceModelCode: this.$route.query.deviceModelCode,
                        deviceStatus: this.$route.query.deviceStatus,
                        firmwareVersion: this.$route.query.firmwareVersion,
                        realDeviceModelCode:
                            this.$route.query.realDeviceModelCode,
                        firmwareId: this.selectId,
                        equalNeedUpgrade: this.confirmForm.equalNeedUpgrade,
                        verificationCode: this.confirmForm.verificationCode,
                        retryMark: this.confirmForm.retryMark,
                        downgrading: 0,
                    };
                    let checkList = JSON.parse(
                        JSON.stringify(this.confirmForm.checkList)
                    );
                    // 其他
                    if (
                        checkList.find(
                            (item) =>
                                item === this.$t("deviceHealthCondition.other")
                        )
                    ) {
                        checkList.splice(
                            checkList.findIndex(
                                (item) =>
                                    item ===
                                    this.$t("deviceHealthCondition.other")
                            ),
                            1
                        );
                        checkList.push(
                            this.$t("deviceHealthCondition.other") +
                                (this.confirmForm.textarea
                                    ? "：" + this.confirmForm.textarea
                                    : this.confirmForm.textarea)
                        );
                    }
                    // 异常升级维护
                    if (
                        checkList.find(
                            (item) =>
                                item ===
                                this.$t(
                                    "deviceUpgrade.abnormalUpgradeMaintenance"
                                )
                        )
                    ) {
                        params.downgrading = 1;
                    }
                    params.upgradeReasons = checkList;
                    this.$api
                        .newUpgradeCreateUpgradeTask(params)
                        .then((res) => {
                            if (res.success == true) {
                                if (this.deviceInfoList.length) {
                                    this.deviceInfoList.forEach((item) => {
                                        if (
                                            item.deviceModelCode ===
                                            params.deviceModelCode
                                        ) {
                                            item.disabled = true;
                                        }
                                    });
                                    sessionStorage.setItem(
                                        "deviceInfoList",
                                        JSON.stringify(this.deviceInfoList)
                                    );
                                }

                                this.startUpgradeVisible = true;
                                this.taskId = res.data.taskId;
                                // this.compulsive = false;
                                this.confirmVisible = false;
                                this.$api.eventTrackTrigger({
                                    menu: "DEVICE_UPGRADE",
                                    business: this.$route.query.business,
                                    eventResult: res.success,
                                });
                            } else {
                                this.$message.error(res.msg);
                            }
                        });
                }
            });
        },
        radioChange(selection) {
            if (selection) {
                this.selection = selection;
                this.selectId = selection.id;
            } else {
                this.selection = {};
                this.selectId = "";
            }
        },
        // 表格查询
        search() {
            let params = Object.assign(this.params, this.searchForm, {
                type: this.activeName,
                deviceModelCode:
                    this.activeName === "main"
                        ? this.$route.query.deviceModelCode
                        : "",
            });
            this.getFirmware(params);
        },
        /*获取固件信息列表*/
        getFirmware(params) {
            this.searchLoading = true;
            this.$api
                .newFirmwarePage(params)
                .then((res) => {
                    this.timer = new Date().getTime();
                    if (res.success == true) {
                        this.tableData =
                            (res.data.results.length &&
                                res.data.totalRecords) ||
                            (!res.data.results.length && !res.data.totalRecords)
                                ? res.data.results
                                : this.tableData;
                        this.total = res.data.totalRecords;
                        this.$nextTick(() => {
                            this.setTableHeight();
                        });
                    } else {
                        this.$message.error(res.msg);
                    }
                    this.searchLoading = false;
                    this.selection = {};
                    this.selectId = "";
                })
                .catch((err) => {
                    this.searchLoading = false;
                });
        },
        setTableHeight() {
            this.tableHeight = document.body.clientHeight - 361;
        },
        beforeunloadHandler(e) {
            sessionStorage.removeItem("deviceInfoList");
        },
        continueUpgrade() {
            this.deviceModelCode = this.deviceInfoList.filter((item) => {
                return item.disabled === false;
            })[0].deviceModelCode;
            this.deviceListVisible = true;
        },
        doDeviceList() {
            let deviceArr = this.deviceInfoList.find(
                (item) => item.deviceModelCode === this.deviceModelCode
            );
            this.$router.replace({
                query: {
                    typeListSelected: this.typeListSelected,
                    deviceModelCode: deviceArr.deviceModelCode,
                    organizeId: this.organizeId,
                    deviceIds: deviceArr.checkDeviceInfos.reduce(
                        (prev, cur) => {
                            return prev.concat(cur["deviceId"]);
                        },
                        []
                    ),
                },
            });
        },
        handleReset() {
            this.$refs.searchForm.resetFields();
        },
        handleClick() {
            this.handleReset();
            this.params.currentPage = 1;
            this.search();
        },
        newUpgradeGetPhoneVeryCode() {
            this.$api.newUpgradeGetPhoneVeryCode().then((res) => {
                if (res.success == true) {
                    // 短信发送成功
                    this.$message.success(this.$t("login.SMSSentSuccess"));
                    this.blackTime = 300;
                    let timeInterval = setInterval(() => {
                        this.blackTime = this.blackTime - 1;
                        if (this.blackTime == 0) {
                            clearInterval(timeInterval);
                        }
                    }, 1000);
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        getDeviceType() {
            this.$api.newFirmwareGetPeripheralList().then((res) => {
                if (res.success == true) {
                    this.deviceTypeList = [
                        { sysDictCode: "", sysDictName: this.$t("common.all") },
                    ];
                    res.data.forEach((item) => {
                        this.deviceTypeList.push(item);
                    });
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        handleCheckAllChange(val) {
            this.whetherCheckLowVersionUpgrade = false;
            if (
                val.find(
                    (item) =>
                        item ===
                        this.$t("deviceUpgrade.abnormalUpgradeMaintenance")
                )
            ) {
                this.$api.whetherCheckLowVersionUpgrade().then((res) => {
                    if (res.success == true) {
                        this.whetherCheckLowVersionUpgrade = res.data;
                    }
                });
            }
        },
    },
    mounted() {
        this.getDeviceType();
        const that = this;
        window.onresize = () => {
            return (() => {
                that.setTableHeight();
            })();
        };
        let deviceInfoList = sessionStorage.getItem("deviceInfoList");
        this.deviceInfoList = deviceInfoList ? JSON.parse(deviceInfoList) : [];
    },
    created() {
        window.addEventListener("beforeunload", (e) =>
            this.beforeunloadHandler(e)
        );
        this.setTableHeight();
        this.search();
    },
    destroyed() {
        window.removeEventListener("beforeunload", (e) =>
            this.beforeunloadHandler(e)
        );
    },
};
</script>

<style scoped lang="less">
/deep/.firmware-box {
    height: 100%;
    position: relative;
    // padding: 0 12px;
    .el-tabs__header {
        margin: 0px;
    }
}
.wrap-bottom {
    border-top: 1px solid #e4e4e4 !important;
}
.footer-button {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    box-shadow: 0px -4px 4px 0px rgba(0, 0, 0, 0.08);
}
.upgrade {
    .title {
        padding: 0px;
        display: flex;
        justify-content: space-between;
    }
    .upgrade-footer {
        width: 100%;
        .footer-pagination {
            border-top: 1px solid #e4e4e4;
            border-bottom: 1px solid #e4e4e4;
        }
    }
}
.marginBottom {
    margin-bottom: 10px;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.65);
    padding-left: 34px;
}
.showTold {
    font-size: 24px;
    cursor: pointer;
}
.el-message-box__title {
    word-break: break-all !important;
}
.device-list {
    & > div:first-child {
        display: flex;
        align-items: center;
        color: #faad14;
        i {
            font-size: 26px;
        }
        span {
            line-height: 26px;
        }
    }
    p {
        color: #575757;
        margin: 12px 0;
    }
    .el-radio-group {
        display: flex;
        flex-direction: column;
    }
    /deep/.el-radio {
        margin-left: 0px !important;
        margin-bottom: 12px;
        max-width: 400px !important;
        display: flex;
        align-items: center;
        .el-radio__label {
            display: flex;
            align-items: center;
            span {
                max-width: 380px;
                display: inline-block;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
            }
        }
    }
}
</style>
<style lang="less">
.confirm-dialog {
    .el-checkbox__label {
        color: rgba(0, 0, 0, 0.65);
        font-size: 14px;
    }
    // .el-dialog__header {
    //     display: none;
    // }
    .el-checkbox-group {
        display: flex;
        flex-direction: column;
    }
    .el-checkbox {
        margin-left: 0px !important;
    }
    .title {
        display: flex;
        align-items: center;
        span {
            width: 430px;
            word-wrap: break-word;
            font-size: 16px;
            color: #000000;
            font-weight: bold;
        }
    }
    .content {
        padding-left: 34px;
        color: rgba(0, 0, 0, 0.65);
        font-size: 14px;
    }
    .ivu-icon {
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 50%;
        width: 22px;
        height: 22px;
        background: #faad14;
        color: #ffffff;
        margin-right: 12px;
    }
}
</style>
