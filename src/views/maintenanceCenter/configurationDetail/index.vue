<template>
    <div class="configuration-detail">
        <h2 class="p-a-md">
            选择配置类型<a class="text-sm m-l-sm" @click="typeVisible = true"
                >如何选择？</a
            >
        </h2>
        <el-radio-group v-model="type" class="p-x-md">
            <el-radio-button label="1">文件配置</el-radio-button>
            <!-- <el-radio-button label="2">TTS文本下发配置</el-radio-button> -->
            <el-radio-button label="3">协议配置</el-radio-button>
            <!-- <el-radio-button label="4">HTTP终端参数查询</el-radio-button> -->
        </el-radio-group>
        <template v-if="type == '1'">
            <FileConfig
                @open="openDialog"
                @fileSuccess="configFileSuccess"
            ></FileConfig>
        </template>
        <!-- 协议配置 -->
        <template v-else-if="type == '3'">
            <AgreementConfig
                :isApiDeciveBols="isApiDeciveBol"
                @open="openDialog"
                @protocolSuccess="configSuccess"
            ></AgreementConfig>
        </template>
        <template v-else-if="type == '4'">
            <HttpConfig @httpSuccess="configSuccess"></HttpConfig>
        </template>
        <!-- dialog-未获取到 -->
        <el-dialog
            title="获取最新配置"
            :visible.sync="dialogVisible"
            :width="'500px'"
        >
            <p>- 在线设备可实时获取最新配置信息；</p>
            <p>- 离线和休眠设备需设备在线后才可以获取最新配置信息；</p>
            <p>- HTTP协议类型的设备需要再次重启后才可以获取最新配置信息。</p>
            <span slot="footer">
                <el-button type="primary" @click="dialogVisible = false"
                    >知道了</el-button
                >
            </span>
        </el-dialog>
        <el-dialog
            title="选择配置类型"
            :visible.sync="typeVisible"
            :width="'500px'"
        >
            <p>- 文件配置：支持部标协议+部标拓展协议+私有协议的参数配置</p>
            <p>- TTS文本下发配置：短信配置，私有指令远程控制终端</p>
            <p>- 协议配置：基于部标协议+部标拓展协议的参数配置</p>
            <p>- HTTP终端参数查询：仅支持Http协议模式的终端查询终端参数</p>
            <span slot="footer">
                <el-button type="primary" @click="typeVisible = false"
                    >知道了</el-button
                >
            </span>
        </el-dialog>
        <StartConfig
            :visible.sync="startConfigVisible"
            :organizeId="organizeId"
            :batchCode="batchCode"
            :configType="configType"
            :top="configType == 'file' ? '200px' : 'middle'"
        ></StartConfig>
    </div>
</template>
<script>
import TtsForm from "./ttsForm";
import FileConfig from "./fileConfig";
import AgreementConfig from "./agreementConfig";
import HttpConfig from "./httpConfig";
import StartConfig from "@/components/coreManage/startConfig";

export default {
    components: {
        TtsForm,
        FileConfig,
        AgreementConfig,
        StartConfig,
        HttpConfig,
    },
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
