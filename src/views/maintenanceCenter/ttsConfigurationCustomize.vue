<template>
    <div>
        <div class="config-detail">
            <div class="config-form">
                <el-form
                    ref="form"
                    label-position="top"
                    :model="form"
                    :rules="rules"
                    label-width="90px"
                >
                    <!-- 标题 -->
                    <el-form-item
                        :label="$t('ttsConfiguration.configurationTitle')"
                        prop="configTitle"
                    >
                        <el-input
                            v-model="form.configTitle"
                            clearable
                            :placeholder="$t('common.input')"
                        ></el-input>
                    </el-form-item>
                    <!-- 配置内容 -->
                    <el-form-item
                        :label="$t('ttsConfiguration.configurationContent')"
                        prop="configContent"
                    >
                        <el-input
                            v-model="form.configContent"
                            type="textarea"
                            :rows="4"
                            clearable
                            :placeholder="$t('common.input')"
                            maxlength="500"
                            show-word-limit
                        >
                        </el-input>
                    </el-form-item>
                    <!-- 发布属性 -->
                    <el-form-item
                        :label="$t('ttsConfiguration.publishAttributes')"
                        prop="configProp"
                    >
                        <el-select
                            style="width: 100%"
                            v-model="form.configProp"
                            :placeholder="$t('common.select')"
                            multiple
                            clearable
                        >
                            <!-- 紧急 -->
                            <el-option
                                :label="$t('ttsConfiguration.ttsContentText1')"
                                value="URGENCY"
                            ></el-option>
                            <!-- 终端显示屏显示 -->
                            <el-option
                                :label="$t('ttsConfiguration.ttsContentText2')"
                                value="DISPLAY"
                            ></el-option>
                            <!-- 终端TTS播读 -->
                            <el-option
                                :label="$t('ttsConfiguration.ttsContentText3')"
                                value="READ"
                            ></el-option>
                            <!-- 广告屏显示 -->
                            <el-option
                                :label="$t('ttsConfiguration.ttsContentText4')"
                                value="ADVERT"
                            ></el-option>
                            <!-- CAN故障码信息 -->
                            <el-option
                                :label="$t('ttsConfiguration.ttsContentText5')"
                                value="CAN"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <!-- 是否离线托管 -->
                    <el-form-item
                        :label="$t('ttsConfiguration.whetherToHostOffline')"
                        prop="offlineManager"
                    >
                        <el-radio-group v-model="form.offlineManager">
                            <el-radio :label="true">
                                <!-- 是 -->
                                {{ $t("common.yes") }}
                            </el-radio>
                            <el-radio :label="false">
                                <!-- 否 -->
                                {{ $t("common.not") }}
                            </el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <!-- 待配置车辆 -->
                    <el-form-item
                        :label="`${$t('deviceManage.deviceSettingTest1')}${
                            form.deviceCodes
                                ? '(' +
                                  form.deviceCodes.split('，').length +
                                  ')'
                                : ''
                        }`"
                        prop="deviceCodes"
                    >
                        <!-- <el-input
                            v-model="form.deviceCodes"
                            type="textarea"
                            :rows="4"
                            clearable
                            placeholder="请输入需要配置的设备终端手机号，多个请换行。"
                        >
                        </el-input>
                        <div style="height: 20px; line-height: 20px">
                            <span class="waring-icon">!</span
                            ><span>系统将自动过滤您未拥有操作权限的设备</span>
                        </div> -->
                        <div class="bulk-import">
                            <el-button
                                class="inspection-content"
                                @click="doBulkImport(false)"
                                :loading="importLoading"
                            >
                                <i class="el-icon-refresh_sm"></i>
                                <!-- 检查内容 -->
                                {{ $t("deviceManage.deviceSettingTest2") }}
                            </el-button>
                            <div>
                                <div class="type-select">
                                    <el-select
                                        v-model="form.type"
                                        :placeholder="$t('common.select')"
                                        @change="typeChange"
                                    >
                                        <el-option
                                            :label="item.label"
                                            :value="item.value"
                                            :key="item.value"
                                            v-for="item in typeList"
                                        ></el-option>
                                    </el-select>
                                    <!-- $t('common.select') -->
                                    <el-select
                                        v-model="form.plateNum"
                                        :placeholder="`${typeListSelected}${$t(
                                            'ttsConfiguration.plateNumPlaceholderText1'
                                        )}${typeListSelected}`"
                                        remote
                                        :remote-method="remoteMethod2"
                                        filterable
                                        clearable
                                        v-selectLoadMore="selectLoadMore"
                                        @visible-change="visibleHandler"
                                        @change="selectCar"
                                    >
                                        <template slot="prefix"
                                            ><span
                                                ><i
                                                    class="iconfont icon-chaxun"
                                                ></i></span
                                        ></template>
                                        <el-option
                                            v-for="item in form.plateArr"
                                            :key="item.id"
                                            :value="item.value"
                                            :label="item.value"
                                        ></el-option>
                                    </el-select>
                                </div>
                                <!-- :placeholder="`输入${typeListSelected}，请用逗号或分号分隔`" -->
                                <el-input
                                    type="textarea"
                                    :rows="6"
                                    :spellcheck="false"
                                    :placeholder="`${$t(
                                        'ttsConfiguration.plateNumPlaceholderText2'
                                    )}${typeListSelected}，${$t(
                                        'ttsConfiguration.plateNumPlaceholderText3'
                                    )}`"
                                    v-model="form.deviceCodes"
                                    @blur="plateNumBlur"
                                >
                                </el-input>
                            </div>
                        </div>
                    </el-form-item>
                </el-form>
            </div>
            <div class="config-instruction">
                <el-tabs v-model="instructionType">
                    <!-- 单指令下发 -->
                    <el-tab-pane
                        :label="
                            $t('ttsConfiguration.singleInstructionIssuance')
                        "
                        name="first"
                    ></el-tab-pane>
                    <!-- 多指令下发 -->
                    <el-tab-pane
                        :label="
                            $t('ttsConfiguration.multipleInstructionIssuance')
                        "
                        name="second"
                    ></el-tab-pane>
                </el-tabs>
                <div class="config-btn">
                    <div v-if="!isEdit">
                        <el-button
                            icon="el-icon-plus"
                            type="text"
                            @click="addConfig"
                            v-btn="'ttsConfigurationAddCommonCommands'"
                        >
                            <!-- 新增 -->
                            {{ $t("common.add") }}
                        </el-button>
                        <el-button
                            type="text"
                            @click="changeEdit(true)"
                            v-btn="'ttsConfigurationEditCommonCommands'"
                        >
                            <!-- 编辑 -->
                            {{ $t("common.edit") }}
                        </el-button>
                    </div>
                    <div v-else>
                        <el-button
                            style="color: red"
                            type="text"
                            @click="deleteConfig"
                        >
                            <!-- 删除 -->
                            {{ $t("common.delete") }}
                        </el-button>
                        <el-button type="text" @click="changeEdit(false)">
                            <!-- 取消 -->
                            {{ $t("common.cancel") }}
                        </el-button>
                    </div>
                </div>
                <div class="config-list">
                    <!-- <div class="config-list-title">指令列表</div> -->
                    <div v-show="!configList.length" class="config-list-no">
                        <!-- 暂无常用指令 -->
                        {{ $t("ttsConfiguration.noCommonlyUsedCommands") }}
                    </div>
                    <div
                        v-show="configList.length"
                        class="config-list-item"
                        :title="item.cmdTitle"
                        v-for="item in configList"
                        v-bind:key="item.index"
                        @click="copyToInput(item)"
                    >
                        <el-checkbox
                            class="m-r-sm"
                            v-if="isEdit"
                            v-model="item.check"
                        ></el-checkbox>
                        <p>{{ item.cmdTitle }}</p>
                        <i
                            v-if="!isEdit"
                            class="el-icon-plus"
                            style="float: right"
                        ></i>
                    </div>
                    <!-- <el-radio-group
                        v-model="radio"
                        v-show="!isEdit"
                        @input="configlistChange"
                        class="config-radio"
                    >
                        <el-radio
                            :label="item.id"
                            v-for="item in configList"
                            :key="item.id"
                            >{{ item.cmdTitle }}</el-radio
                        >
                    </el-radio-group>
                    <el-checkbox-group v-model="checkList" v-show="isEdit">
                        <el-checkbox
                            :label="item.id"
                            v-for="item in configList"
                            :key="item.id"
                            >{{ item.cmdTitle }}</el-checkbox
                        >
                    </el-checkbox-group> -->
                    <!-- <div
                        v-show="configList.length"
                        class="config-list-item"
                        :title="item.cmdTitle"
                        v-for="item in configList"
                        v-bind:key="item.index"
                        @click="copyToInput(item)"
                    >
                        <el-checkbox
                            class="m-r-sm"
                            v-if="isEdit"
                            v-model="item.check"
                        ></el-checkbox>
                        <p>{{ item.cmdTitle }}</p>
                    </div> -->
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
                    type="primary"
                    @click="beforeSubmit"
                    :loading="loadSubmit"
                >
                    <!-- 下发至终端 -->
                    {{ $t("deviceUpgrade.issuedToTerminal") }}
                </el-button>
            </div>
        </div>
        <!-- 新增 -->
        <el-dialog
            :title="$t('common.add')"
            :visible.sync="dialogVisible"
            @close="cancel"
        >
            <el-form
                ref="addForm"
                label-position="top"
                :rules="addRules"
                :model="addForm"
            >
                <!-- 标题 -->
                <el-form-item label="标题" prop="cmdTitle">
                    <el-input
                        v-model="addForm.cmdTitle"
                        :placeholder="$t('common.input')"
                        clearable
                    ></el-input>
                </el-form-item>
                <!-- 配置内容 -->
                <el-form-item
                    :label="$t('ttsConfiguration.configurationContent')"
                    prop="cmdContent"
                >
                    <el-input
                        v-model="addForm.cmdContent"
                        type="textarea"
                        :rows="4"
                        :placeholder="$t('common.input')"
                        maxlength="500"
                        show-word-limit
                    >
                    </el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="saveConfig">
                    <!-- 确定 -->
                    {{ $t("common.ok") }}
                </el-button>
                <el-button @click="cancel">
                    <!-- 取消 -->
                    {{ $t("common.cancel") }}
                </el-button>
            </span>
        </el-dialog>
        <el-dialog
            :visible="firmwareVisible"
            :show-close="false"
            @close="close"
            :width="'600px'"
        >
            <div class="start-config-content">
                <span class="text-lg">
                    <!-- 已向设备发送配置命令 -->
                    {{
                        $t("ttsConfiguration.configurationCommandText1")
                    }}，</span
                >
                <span class="text-lg">
                    <!-- 可在“配置查看”中查看进度 -->
                    {{ $t("ttsConfiguration.configurationCommandText2") }}
                </span>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="goTask">
                    <!-- 查看任务 -->
                    {{ $t("ttsConfiguration.configurationCommandText3") }}
                </el-button>
                <el-button type="primary" @click="close">
                    <!-- 知道了 -->
                    {{ $t("common.gotIt") }}
                </el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data() {
        let that = this;
        const checkNumber = function (rule, value, callback) {
            let t = value;
            let k = t.replace(/\n/g, "");
            if (!k.trim()) {
                // 配置内容不能为空
                callback(
                    new Error(that.$t("ttsConfiguration.ttsFormValidatorText1"))
                );
            }
            if (value !== " " && value !== null && value !== undefined) {
                if (value.length > 500) {
                    // 配置内容不得超过500个字符
                    callback(
                        new Error(
                            that.$t("ttsConfiguration.ttsFormValidatorText2")
                        )
                    );
                } else {
                    callback();
                }
            } else {
                // 配置内容不能为空
                callback(
                    new Error(that.$t("ttsConfiguration.ttsFormValidatorText1"))
                );
            }
        };
        const checkPhone = function (rule, value, callback) {
            let t = value;
            let k = t.replace(/\n/g, "");
            if (!k.trim()) {
                // 待配置车辆不能为空
                callback(
                    new Error(that.$t("ttsConfiguration.ttsFormValidatorText5"))
                );
            }
            if (value !== " " && value !== null && value !== undefined) {
                if (value.length > 12000) {
                    // 待配置车辆不得超过12000个字符
                    callback(
                        new Error(
                            that.$t("ttsConfiguration.ttsFormValidatorText6")
                        )
                    );
                } else {
                    callback();
                }
            } else {
                // 待配置车辆不能为空
                callback(
                    new Error(that.$t("ttsConfiguration.ttsFormValidatorText5"))
                );
            }
        };
        const checkNumbers = function (rule, value, callback) {
            let t = value;
            let k = t.replace(/\n/g, "");
            if (!k.trim()) {
                // 标题不能为空
                callback(
                    new Error(that.$t("ttsConfiguration.ttsFormValidatorText4"))
                );
            }
            if (value !== "" && value !== null && value !== undefined) {
                if (value.length > 20) {
                    // 标题不得超过20个字符
                    callback(
                        new Error(
                            that.$t("ttsConfiguration.ttsFormValidatorText3")
                        )
                    );
                } else {
                    callback();
                }
            } else {
                // 标题不能为空
                callback(
                    new Error(that.$t("ttsConfiguration.ttsFormValidatorText4"))
                );
            }
        };
        return {
            batchCode: "",
            firmwareVisible: false,
            loadSubmit: false,
            isEdit: false, // 常用指令是否为编辑状态
            dialogVisible: false,
            rules: {
                configTitle: [
                    {
                        required: false,
                        max: 20,
                        message: this.$t(
                            "ttsConfiguration.ttsFormValidatorText3"
                        ), //"不能超过20个字符",
                        trigger: "blur",
                    },
                ],
                configContent: [
                    {
                        required: true,
                        validator: checkNumber.bind({
                            type: "string",
                            min: 1,
                            max: 500,
                        }),
                        trigger: "blur",
                    },
                ],
                deviceCodes: [
                    {
                        required: true,
                        validator: checkPhone.bind({
                            type: "string",
                            min: 1,
                            max: 200000,
                        }),
                        trigger: "blur",
                    },
                ],
            },
            addRules: {
                cmdTitle: [
                    {
                        required: true,
                        validator: checkNumbers.bind({
                            type: "string",
                            min: 1,
                            max: 20,
                        }),
                        trigger: "blur",
                    },
                ],
                cmdContent: [
                    {
                        required: true,
                        validator: checkNumber.bind({
                            type: "string",
                            min: 1,
                            max: 500,
                        }),
                        trigger: "blur",
                    },
                ],
            },
            form: {
                configTitle: "",
                configContent: "",
                configProp: ["READ"], // 发布属性
                offlineManager: true,
                organizeId: this.$route.query.organizeId,
                deviceCodes: "",
                carId: "",
                plateNum: "",
                plateJson: {},
                plateArr: [],
                type: 1,
                deviceCodeList: [],
            },
            configProp: ["READ"],
            addForm: {
                cmdTitle: "",
                cmdContent: "",
            },
            configList: [],
            radio: "",
            checkList: [],
            importLoading: false,
            typeListSelected: this.$t("common.plateNum"), //"车牌号",
            typeList: [
                {
                    label: this.$t("common.plateNum"), //"车牌号",
                    value: 1,
                },
                {
                    label: this.$t("common.deviceCode"), //"终端手机号",
                    value: 2,
                },
                {
                    label: this.$t("common.deviceSerialNum"), //"设备序列号",
                    value: 3,
                },
                {
                    label: this.$t("common.vin"), //"VIN码",
                    value: 4,
                },
            ],
            pageSizeCar: 20, //车牌分页数量
            currentPageCar: 1, //车牌页码
            query: "",
            haveDataCar: true,
            instructionType: "first",
        };
    },
    watch: {
        "form.carId": {
            handler(val) {
                if (!val && this.query.length < 3) {
                    this.form.plateArr = [];
                }
                this.form.plateNum = this.form.plateJson[this.form.carId];
            },
            deep: true,
        },
        query: {
            handler(val) {
                if (val.length < 3 && !this.form.carId) {
                    this.form.plateArr = [];
                }
            },
            deep: true,
        },
        instructionType: {
            handler(val) {
                this.form.configTitle = "";
                this.form.configContent = "";
            },
            deep: true,
        },
    },
    methods: {
        goTask() {
            this.$router.push({
                path: "/maintenanceCenter/ttsConfiguration/ttsConfigurationTask/ttsConfigurationTaskDetail",
                query: {
                    batchCode: this.batchCode,
                    organizeId: this.$route.query.organizeId,
                    isGo: true,
                },
            });
        },
        close() {
            this.firmwareVisible = false;
        },
        goBack() {
            this.$router.push("/maintenanceCenter/ttsConfiguration");
        },
        beforeSubmit() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    this.doBulkImport(true).then(() => {
                        this.$api.customSaveTTS(this.form).then((res) => {
                            if (res.success == true) {
                                // TTS下发成功
                                this.$message.success(
                                    this.$t(
                                        "ttsConfiguration.ttsSuccessfullyIssued"
                                    )
                                );
                                this.loadSubmit = false;
                                this.batchCode = res.data;
                                this.firmwareVisible = true;
                            } else {
                                this.$message.error(res.msg);
                                this.loadSubmit = false;
                            }
                            this.form.configTitle = "";
                            this.form.configContent = "";
                            this.$api.eventTrackTrigger({
                                menu: "TTS_CONFIGURATION",
                                business: "TTS_CONFIG_CUSTOM",
                                eventResult: res.success,
                            });
                        });
                    });
                }
            });
        },
        copyToInput(item) {
            if (this.isEdit) return;
            else {
                this.$refs["form"].clearValidate();
                if (this.instructionType === "first") {
                    this.form.configTitle = item.cmdTitle;
                    this.form.configContent = item.cmdContent;
                } else {
                    let newConfigTitle = this.form.configTitle
                        ? this.form.configTitle + "+" + item.cmdTitle
                        : item.cmdTitle;
                    let newConfigContent = this.form.configContent
                        ? this.form.configContent + "\n&" + item.cmdContent
                        : item.cmdContent;
                    if (newConfigTitle.length > 20) {
                        // this.$message.warning("该指令标题长度过长，请重新选择");
                    } else {
                        this.form.configTitle = this.form.configTitle
                            ? this.form.configTitle + "+" + item.cmdTitle
                            : item.cmdTitle;
                    }
                    if (newConfigContent.length > 500) {
                        // this.$message.warning("该指令配置内容长度过长，请重新选择");
                    } else {
                        this.form.configContent = this.form.configContent
                            ? this.form.configContent + "\n&" + item.cmdContent
                            : item.cmdContent;
                    }
                }
            }
        },
        changeEdit(isEdit) {
            this.configList.map((i) => {
                i.check = false;
            });
            this.isEdit = isEdit;
        },
        addConfig() {
            this.dialogVisible = true;
            this.addForm = {
                cmdTitle: "",
                cmdContent: "",
            };
        },
        saveConfig() {
            this.$refs.addForm.validate((valid) => {
                if (valid) {
                    this.$api.saveTTSCmd(this.addForm).then((res) => {
                        if (res.success == true) {
                            // 添加TTS常用指令成功！
                            this.$message.success(
                                this.$t(
                                    "ttsConfiguration.addedCommonTTSCommands"
                                )
                            );
                            this.dialogVisible = false;
                            this.getTTSCmdList();
                        } else {
                            this.$message.error(res.msg);
                        }
                    });
                }
            });
        },
        cancel() {
            this.dialogVisible = false;
            this.$refs["addForm"].clearValidate();
        },
        deleteConfig() {
            const ids = [];
            this.configList.forEach((i) => {
                if (i.check) ids.push(i.id);
            });
            if (ids.length == 0) {
                // 未勾选指令！
                this.$message.warning(
                    this.$t("ttsConfiguration.instructionNotSelected")
                );
                return;
            }

            this.$api.deleteTTSCmd({ ids }).then((res) => {
                if (res.success == true) {
                    // 删除TTS常用指令成功！
                    this.$message.success(
                        this.$t("ttsConfiguration.deletedCommonTTSCommands")
                    );
                    this.getTTSCmdList();
                    this.changeEdit(false);
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        // 获得TTS常用指令列表
        getTTSCmdList() {
            this.$api.getTTSCmdList().then((res) => {
                if (res.success == true) {
                    const list = res.data;
                    list.map((i) => (i.check = false));
                    this.configList = list;
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        configlistChange(val) {
            this.copyToInput(this.configList.find((i) => i.id === val));
        },
        typeChange(val) {
            this.form.deviceCodes = "";
            let obj = this.typeList.find((item) => item.value == val);
            this.typeListSelected = obj.label;
        },
        doBulkImport(falg) {
            return new Promise((resolve, reject) => {
                if (!this.form.deviceCodes) {
                    // 请输入待配置
                    this.$message.warning(
                        `${this.$t(
                            "ttsConfiguration.plateNumPlaceholderText4"
                        )}${this.typeListSelected}`
                    );
                    this.loadSubmit = false;
                    return;
                }
                this.importLoading = true;
                this.$api
                    .getGroupDeviceByModelCodeDto({
                        type: this.form.type,
                        values: this.form.deviceCodes.split("，"),
                    })
                    .then((res) => {
                        if (res.success == true) {
                            if (res.data.message) {
                                this.$message.warning(res.data.message);
                                let plateNumArr =
                                    this.form.deviceCodes.split("，");
                                let newPlateNumArr = plateNumArr.filter(
                                    (x) =>
                                        !res.data.nonexistentList.some(
                                            (y) => y === x
                                        )
                                );
                                this.form.deviceCodes = [
                                    ...new Set(newPlateNumArr),
                                ]
                                    .filter((item) => item)
                                    .join("，");
                            }
                            if (res.data.modelVoList.length && falg) {
                                this.form.deviceCodeList = [];
                                res.data.modelVoList.forEach((item) => {
                                    item.checkDeviceInfos.forEach((k) => {
                                        this.form.deviceCodeList.push(
                                            k.deviceCode
                                        );
                                    });
                                });
                                resolve();
                            }
                            this.importLoading = false;
                        } else {
                            this.$message.error(res.msg);
                            this.loadSubmit = false;
                            this.importLoading = false;
                        }
                    });
            });
        },
        //远程搜索
        remoteMethod2(query) {
            this.currentPageCar = 1;
            this.query = query;
            this.haveDataCar = true;
            if (query.length >= 3) {
                this.getPlateNumList({ value: query }, true);
            }
        },
        //获取车牌号下拉信息
        getPlateNumList(jsonData, isDialog) {
            // this.loading = true;
            let param = {
                type: this.form.type,
                pageSize: 20,
                currentPage: this.currentPageCar,
            };
            let params = Object.assign({}, param, jsonData);
            this.$api.deviceSearchDropDown(params).then((res) => {
                if (res.success == true) {
                    this.totalPagesCar = res.data.totalPages;
                    let temp =
                        (res.data.results.length && res.data.totalRecords) ||
                        (!res.data.results.length && !res.data.totalRecords)
                            ? res.data.results
                            : temp;
                    this.form.plateArr = (
                        this.currentPageCar === 1 ? [] : this.form.plateArr
                    ).concat(temp);
                    if (res.data.length < 20) {
                        this.haveDataCar = false;
                    }
                    if (this.form.plateArr.length) {
                        res.data.results.forEach((item) => {
                            this.form.plateJson[item.id] = item.plateNum;
                        });
                    }

                    // this.loading = false;
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        //下拉加载更多
        selectLoadMore() {
            this.currentPageCar += 1;
            if (this.currentPageCar > this.totalPagesCar) return;
            this.getPlateNumList({ value: this.query }); // 请求接口
        },
        //下拉框收取
        visibleHandler() {
            this.currentPageCar = 1; //手机号页码
            this.totalPagesCar = "";
            this.form.plateArr = [];
        },
        selectCar(val) {
            this.form.deviceCodes += `，${val}`;
            this.plateNumBlur();
            this.form.plateNum = "";
        },
        plateNumBlur() {
            this.form.deviceCodes = this.form.deviceCodes
                .replace(/\r\n|\n/g, "，")
                .replace(/\s/g, "")
                .replace(/\,|\;|\；|\。|\./g, "，");
            let plateNumArr = this.form.deviceCodes
                .split("，")
                .filter((item) => !!item);
            let repeatArr = this.getRepeatArr(plateNumArr);
            this.form.deviceCodes = [...new Set(plateNumArr)]
                .filter((item) => item)
                .join("，");
            if (repeatArr.length) {
                this.$message.warning(
                    `${repeatArr[0]}${
                        repeatArr.length > 1
                            ? this.$t("deviceManage.deviceSettingTest12") +
                              repeatArr.length +
                              this.$t("deviceManage.deviceSettingTest13")
                            : ""
                    }${this.$t("deviceManage.deviceSettingTest14")}`
                );
            }
        },
        getRepeatArr(arr) {
            var temp = [];
            arr.forEach((item) => {
                if (
                    arr.indexOf(item) !== arr.lastIndexOf(item) &&
                    temp.indexOf(item) === -1
                ) {
                    temp.push(item);
                }
            });
            return temp;
        },
    },
    mounted() {
        this.getTTSCmdList();
    },
};
</script>
<style lang="less" scoped>
.config-detail {
    display: flex;
    flex-direction: row;
    justify-content: center;
    height: calc(~"100% - 4rem");
    overflow-y: auto;
    .config-form {
        width: 800px;
        margin-right: 48px;
        padding-top: 24px;
        padding-right: 24px;
        overflow-y: auto;
    }
    .config-instruction {
        width: 500px;
        border-left: 1px solid #d7dde4;
        padding: 24px 0 0 48px;
        .config-btn {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            font-size: 14px;
            padding-bottom: 15px;
        }
        .config-list {
            border: 1px solid #b3b3b3;
            height: calc(~"100% - 120px");
            overflow-x: auto;
            overflow-y: auto;
            .config-list-title {
                font-size: 16px;
                font-weight: bold;
                padding: 12px 0 12px 36px;
            }
            .el-radio-group,
            .el-checkbox-group {
                display: flex;
                flex-direction: column;
                overflow-y: auto;
                .el-radio,
                .el-checkbox {
                    height: 46px;
                    line-height: 21px;
                    border-top: 1px solid #d7dde4;
                    padding: 12px 0 12px 12px;
                    &:last-child {
                        border-bottom: 1px solid #d7dde4;
                    }
                }
            }
            .config-list-no {
                display: flex;
                flex-direction: row;
                align-items: center;
                height: 32px;
                padding: 0 8px;
                font-size: 14px;
                line-height: 1;
                // cursor: pointer;
                // background: rgb(250, 250, 250);
                // border-bottom: 1px solid rgb(240, 240, 240);
                // white-space: nowrap;
            }
            .config-list-item {
                display: flex;
                flex-direction: row;
                align-items: center;
                height: 32px;
                padding: 0 8px;
                font-size: 14px;
                line-height: 1;
                cursor: pointer;
                // background: rgb(250, 250, 250);
                border-bottom: 1px solid rgb(240, 240, 240);
                // white-space: nowrap;
                p {
                    flex: 1;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                &:hover {
                    background-color: whitesmoke;
                    color: #4d4d4d;
                }
            }
        }
    }
}
/deep/.bulk-import {
    font-size: 14px;
    margin-top: 4px;
    .inspection-content {
        position: absolute;
        right: 0px;
        top: -32px;
    }
    p {
        font-size: 14px;
        color: rgba(0, 0, 0, 0.85);
        margin-bottom: 8px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    & > div {
        border: 1px solid rgba(217, 217, 217, 1);
        border-radius: 2px;
    }
    .el-textarea {
        border-top: 1px solid rgba(217, 217, 217, 1);
    }
    .el-select {
        width: 100% !important;
    }
    .el-textarea__inner,
    .el-input__inner {
        border: none;
    }
    .type-select {
        display: flex;
        .el-select:nth-child(1) {
            width: 150px !important;
            border-right: 1px solid rgba(217, 217, 217, 1);
        }
    }
    .el-input__prefix {
        display: flex;
        align-items: center;
    }
}
.waring-icon {
    display: inline-block;
    height: 14px;
    width: 14px;
    line-height: 14px;
    border: 1px solid #ff6100;
    border-radius: 7px;
    text-align: center;
    color: #ff6100;
}
.footer {
    width: 100%;
    height: 4rem;
    border-top: 1px solid #d7dde4;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    background: #ffffff;
    .footer-btn {
        padding-right: 28px;
    }
}
.start-config-content {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    color: #000;
}
/deep/.config-radio {
    .el-radio {
        &:hover {
            background-color: #f5f5f5;
        }
    }
    .el-radio__input {
        visibility: hidden;
    }
    .is-checked {
        .el-radio__label {
            color: #606266 !important;
        }
    }
}
</style>
