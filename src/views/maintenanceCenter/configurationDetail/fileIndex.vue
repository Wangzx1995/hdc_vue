<template>
    <div class="configuration-detail">
        <FileConfig
            @open="openDialog"
            @fileSuccess="configFileSuccess"
        ></FileConfig>
        <StartConfig
            :visible.sync="startConfigVisible"
            :organizeId="organizeId"
            :batchCode="batchCode"
            :configType="configType"
            :top="configType == 'file' ? '200px' : 'middle'"
        ></StartConfig>
        <!-- 获取最新配置 -->
        <el-dialog
            :title="$t('deviceConfiguration.fileIndexText1')"
            :visible.sync="dialogVisible"
            :width="'500px'"
        >
            <p>
                <!-- 在线设备可实时获取最新配置信息 -->
                -{{ $t("deviceConfiguration.fileIndexText2") }}；
            </p>
            <p>
                <!-- 离线和休眠设备需设备在线后才可以获取最新配置信息； -->
                -{{ $t("deviceConfiguration.fileIndexText3") }}；
            </p>
            <p>
                <!-- HTTP协议类型的设备需要再次重启后才可以获取最新配置信息。 -->
                -{{ $t("deviceConfiguration.fileIndexText4") }}。
            </p>
            <span slot="footer">
                <el-button type="primary" @click="dialogVisible = false">
                    <!-- 知道了 -->
                    {{ $t("common.gotIt") }}
                </el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
// import TtsForm from './ttsForm'
import FileConfig from "./fileConfig";
// import AgreementConfig from './agreementConfig'
// import HttpConfig from './httpConfig'
import StartConfig from "@/components/coreManage/startConfig";

export default {
    components: {
        // TtsForm,
        FileConfig,
        // AgreementConfig,
        StartConfig,
        // HttpConfig
    },
    name: "FileIndex",
    data() {
        return {
            dialogVisible: false,
            typeVisible: false,
            type: "1",
            startConfigVisible: false,
            organizeId: +this.$route.query.organizeId,
            batchCode: "",
            configType: "",
            isApiDeciveBol: false,
        };
    },
    created() {
        this.getISApiCapality();
    },
    methods: {
        openDialog() {
            this.dialogVisible = true;
        },
        configSuccess(data) {
            if (!this.startConfigVisible) {
                this.startConfigVisible = true;
                this.configType = "protocol";
                this.batchCode = data;
            }
        },
        configFileSuccess(data) {
            this.startConfigVisible = true;
            this.configType = "file";
            this.batchCode = data;
        },
        configTTSSuccess(data) {
            this.startConfigVisible = true;
            this.batchCode = data;
            this.configType = "tts";
        },
        getISApiCapality() {
            let params = {
                deviceId: this.$route.query.deviceId || null,
                commandIds: ["IsApiChannelsCapability"],
            };
            this.$api.getDeviceConfigParamsByIsApi(params).then((res) => {
                if (res.success == true) {
                    if (
                        JSON.stringify(JSON.parse(res.data)) != "{}" &&
                        !JSON.parse(res.data)["IsApiChannelsCapability"][
                            "statusCode"
                        ] &&
                        JSON.parse(res.data)["IsApiChannelsCapability"][
                            "channelEventList"
                        ].length > 0
                    ) {
                        this.isApiDeciveBol = true;
                    } else {
                        this.isApiDeciveBol = false;
                    }
                }
            });
        },
    },
};
</script>

<style lang="less" scoped></style>
