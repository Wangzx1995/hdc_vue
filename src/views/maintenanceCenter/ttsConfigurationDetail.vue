<template>
    <div>
        <div
            class="config-detail p-y-md p-x-xl"
            style="padding-bottom: 4rem !important"
        >
            <div class="config-form">
                <h2 class="m-b-sm">
                    <!-- 配置 -->
                    {{ $t("ttsConfiguration.configuration") }}
                </h2>
                <el-form
                    ref="form"
                    label-position="top"
                    :model="form"
                    :rules="rules"
                    label-width="90px"
                    content-width="800px"
                >
                    <!-- 标题 -->
                    <el-form-item
                        :label="$t('ttsConfiguration.configurationTitle')"
                        prop="configTitle"
                    >
                        <el-input
                            style="width: 800px"
                            v-model="form.configTitle"
                            clearable
                            :placeholder="$t('common.input')"
                            :maxlength="20"
                        ></el-input>
                    </el-form-item>
                    <!-- 配置内容 -->
                    <el-form-item
                        :label="$t('ttsConfiguration.configurationContent')"
                        prop="configContent"
                    >
                        <el-input
                            style="width: 800px"
                            v-model="form.configContent"
                            type="textarea"
                            :rows="4"
                            clearable
                            :placeholder="$t('common.input')"
                            :maxlength="500"
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
                            style="width: 800px"
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
                        required-right
                        introduction-placement="top"
                        introduction="设备离线或休眠时，等待设备下一次上线时自动下发TTS文本"
                    >
                        <span slot="label" class="label-slot">
                            <!-- 是否离线托管 -->
                            {{ $t("ttsConfiguration.whetherToHostOffline") }}
                            <!-- 设备离线或休眠时，等待设备下一次上线时自动下发TTS文本 -->
                            <el-tooltip
                                placement="top"
                                :content="
                                    $t(
                                        'ttsConfiguration.whetherToHostOfflineText'
                                    )
                                "
                            >
                                <i
                                    class="el-icon-warning-outline"
                                ></i> </el-tooltip
                        ></span>
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
                </el-form>
            </div>
            <div class="config-instruction p-t-sm">
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
                <el-form-item
                    :label="$t('ttsConfiguration.configurationTitle')"
                    prop="cmdTitle"
                >
                    <el-input
                        v-model="addForm.cmdTitle"
                        clearable
                        :placeholder="$t('common.input')"
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
                        maxlength="500"
                        show-word-limit
                        :placeholder="$t('common.input')"
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
                deviceIds: this.$route.query.deviceId,
            },
            configProp: ["READ"],
            addForm: {
                cmdTitle: "",
                cmdContent: "",
            },
            configList: [],
            instructionType: "first",
        };
    },
    watch: {
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
                    if (this.$route.query.type == "config") {
                        this.loadSubmit = true;
                        this.$api.saveTTSConfig(this.form).then((res) => {
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
                                business: this.$route.query.business,
                                eventResult: res.success,
                            });
                        });
                    } else {
                        // 整组下发
                        this.loadSubmit = true;
                        const param = this.$route.query;
                        this.$api
                            .saveTTSConfigGroup({ ...this.form, ...param })
                            .then((res) => {
                                if (res.success == true) {
                                    // TTS整组下发成功
                                    this.$message.success(
                                        this.$t(
                                            "ttsConfiguration.ttsGroupSuccessfullyIssued"
                                        )
                                    );
                                    this.loadSubmit = false;
                                    this.batchCode = res.data;
                                    this.firmwareVisible = true;
                                } else {
                                    this.$message.error(res.msg);
                                    this.loadSubmit = false;
                                }
                                this.$api.eventTrackTrigger({
                                    menu: "TTS_CONFIGURATION",
                                    business: this.$route.query.business,
                                    eventResult: res.success,
                                });
                            });
                    }
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
    .config-form {
        margin-right: 200px;
    }
    .config-instruction {
        width: 500px;
        .config-btn {
            display: flex;
            flex-direction: row;
            align-items: center;
            font-size: 14px;
            padding-bottom: 15px;
        }
        .config-list {
            border: 1px solid #b3b3b3;
            height: 300px;
            overflow-x: auto;
            overflow-y: auto;
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
                    p,
                    i {
                        color: #409eff;
                    }
                }
            }
        }
    }
}
.footer {
    width: 100%;
    height: 4rem;
    border-top: 1px solid #ccc;
    position: fixed;
    bottom: 0;
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
</style>
