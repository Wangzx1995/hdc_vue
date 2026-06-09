<template>
    <div class="start-config" @touchmove.prevent>
        <el-dialog
            :visible="firmwareVisible"
            :show-close="false"
            @close="close"
            append-to-body
            :width="'600px'"
        >
            <div class="start-config-content">
                <span class="text-lg"
                    ><!-- 已向设备发送配置命令 -->
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
                <el-button
                    type="primary"
                    v-if="showNext"
                    @click="continueConfig"
                >
                    <!-- 继续配置 -->
                    {{ $t("deviceConfiguration.continueConfiguring") }}
                </el-button>
                <el-button type="primary" v-else @click="close">
                    <!-- 知道了 -->
                    {{ $t("common.gotIt") }}
                </el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    props: {
        visible: {
            type: Boolean,
            default: false,
        },
        batchCode: {
            type: String,
            default: "",
        },
        configType: {
            type: String,
            default: "",
        },
        top: {
            type: String,
            default: "middle",
        },
        organizeId: {
            type: [Number, Object],
            default: null,
        },
        deviceInfoList: {
            type: Array,
            default: () => [],
        },
    },
    watch: {
        visible: {
            handler(val) {
                this.firmwareVisible = val;
            },
            deep: true,
        },
        deviceInfoList: {
            handler(val) {
                this.showNext = val.find((item) => {
                    return item.disabled === false;
                });
            },
            deep: true,
        },
    },
    data() {
        return {
            showNext: false,
            firmwareVisible: false,
            cmd: "",
            templateName: "",
            createTime: "",
            configTitle: "",
            paramsBefore: "",
            type: "",
            id: "",
        };
    },
    methods: {
        goTask() {
            if (this.configType == "tts") {
                this.$emit("update:visible", false);
                this.$router.push({
                    path: "/maintenanceCenter/deviceConfiguration/configurationView/configurationTTSDetail",
                    query: {
                        batchCode: this.batchCode,
                        isTemplate: true,
                        organizeId: this.organizeId,
                    },
                });
            } else {
                //根据批次号拿到下发详情
                const params = {
                    batchNo: this.batchCode,
                };
                this.$api.getParamBatchPage(params).then((res) => {
                    if (res.success == true) {
                        let data = res.data.results[0];
                        this.cmd = data.cmd;
                        this.templateName = data.templateName;
                        this.createTime = data.createTime;
                        this.configTitle = data.configTitle;
                        if (res.data.results[0].templateType) {
                            this.type = data.templateType;
                            this.id = data.templateId;
                            this.$emit("update:visible", false);
                            this.$router.push({
                                path: "/maintenanceCenter/deviceConfiguration/configurationTask/configurationTaskDetailNew",
                                query: {
                                    batchCode: this.batchCode,
                                    organizeId: this.organizeId,
                                    cmd: this.cmd,
                                    templateName: this.templateName,
                                    createTime: this.createTime,
                                    configTitle: this.configTitle,
                                    type: this.type,
                                    isTemplate: true,
                                    id: this.id,
                                    param: data.params,
                                },
                            });
                        } else {
                            this.paramsBefore = data.paramsBefore;
                            this.$emit("update:visible", false);
                            this.$router.push({
                                path: "/maintenanceCenter/deviceConfiguration/configurationTask/configurationTaskDetailNew",
                                query: {
                                    batchCode: this.batchCode,
                                    organizeId: this.organizeId,
                                    cmd: this.cmd,
                                    templateName: this.templateName,
                                    createTime: this.createTime,
                                    configTitle: this.configTitle,
                                    isTemplate: true,
                                    paramsBefore: this.paramsBefore,
                                    param: data.params,
                                },
                            });
                        }
                    } else {
                        // this.$message.error('获取列表信息失败:' + res.msg)
                    }
                });
            }
        },
        close() {
            this.$emit("update:visible", false);
            this.$emit("reload");
            // this.$router.push('/equipmentOperation/deviceConfiguration')
        },
        continueConfig() {
            this.$emit("update:visible", false);
            this.$emit("continueConfig");
        },
    },
};
</script>
<style lang="less" scoped>
.start-config-content {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    color: #000;
}
</style>
