<template>
    <div class="file-config">
        <div class="p-a-md">
            <div>
                <el-row>
                    <el-col :span="24">
                        <h2>
                            <!-- 版本信息 -->
                            {{ $t("conditionMonitoring.versionInformation") }}
                        </h2>
                        <el-form label-position="top" label-width="120px">
                            <el-row>
                                <el-col :span="4">
                                    <!-- 更新时间 -->
                                    <el-form-item
                                        :label="$t('common.updateTime')"
                                        class="subheading"
                                    >
                                        <template slot="label">
                                            <!-- 更新时间 -->
                                            {{ $t("common.updateTime") }}
                                            <!-- 设备最后一次进行文件配置的时间 -->
                                            <el-tooltip
                                                :content="
                                                    $t(
                                                        'deviceConfiguration.lastTimeDeviceConfiguredWithFile'
                                                    )
                                                "
                                                placement="top"
                                            >
                                                <span>
                                                    <i
                                                        class="el-icon-question"
                                                    ></i>
                                                </span>
                                            </el-tooltip>
                                        </template>
                                        <span>{{
                                            (deviceInfo.deviceParamLastTimeVo &&
                                                deviceInfo.deviceParamLastTimeVo
                                                    .binLastOne &&
                                                deviceInfo.deviceParamLastTimeVo
                                                    .binLastOne.time) ||
                                            "--"
                                        }}</span>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="4">
                                    <!-- 协议类型 -->
                                    <el-form-item
                                        :label="$t('antIrotationNet.protocol')"
                                        class="subheading"
                                    >
                                        <span>{{
                                            deviceInfo.protocolName || "--"
                                        }}</span>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="4">
                                    <!-- 设备状态 -->
                                    <el-form-item
                                        :label="$t('common.deviceStatus')"
                                        class="subheading"
                                    >
                                        <el-tag
                                            type="success"
                                            v-if="deviceInfo.deviceStatus === 1"
                                        >
                                            <!-- 在线 -->
                                            {{ $t("common.deviceStatus_1") }}
                                        </el-tag>
                                        <el-tag
                                            type="warning"
                                            v-else-if="
                                                deviceInfo.deviceStatus === 2 &&
                                                deviceInfo.dormantStatus == 2
                                            "
                                        >
                                            <!-- 休眠 -->
                                            {{ $t("common.deviceStatus_2") }}
                                        </el-tag>
                                        <el-tag
                                            class="littleYellow"
                                            v-else-if="
                                                deviceInfo.deviceStatus === 2 &&
                                                deviceInfo.dormantStatus != 2
                                            "
                                        >
                                            <!-- 休眠 -->
                                            {{ $t("common.deviceStatus_2") }}
                                        </el-tag>
                                        <el-tag
                                            type="info"
                                            v-else-if="
                                                deviceInfo.deviceStatus === 0
                                            "
                                        >
                                            <!-- 离线 -->
                                            {{ $t("common.deviceStatus_0") }}
                                        </el-tag>
                                        <span v-else>--</span>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="4">
                                    <el-form-item label="">
                                        <div class="no-config">
                                            <el-button
                                                icon="el-icon-refresh"
                                                type="primary"
                                                :disabled="
                                                    getBinFileFromDeviceLoad
                                                "
                                                @click="getBinFileFromDevice"
                                            >
                                                <!-- {{
                                                    getBinFileFromDeviceLoad
                                                        ? "正在获取中…"
                                                        : " 获取最新配置"
                                                }} -->
                                                {{
                                                    getBinFileFromDeviceLoad
                                                        ? $t(
                                                              "deviceConfiguration.gettingInProgress"
                                                          )
                                                        : $t(
                                                              "deviceConfiguration.fileIndexText1"
                                                          )
                                                }}
                                            </el-button>
                                            <a @click="openDialog">
                                                <!-- 未获取到 -->
                                                {{
                                                    $t(
                                                        "deviceConfiguration.notObtained"
                                                    )
                                                }}？</a
                                            >
                                        </div>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                    </el-col>
                </el-row>
            </div>
            <h2 class="m-t-xl">
                <!-- 设备配置详情 -->
                {{ $t("deviceConfiguration.equipmentConfigurationDetails") }}
            </h2>
            <template v-if="!operateForm.binId">
                <EmptyBox>
                    <p slot="description" class="text-md">
                        <!-- 暂无数据，请点击“获取最新配置”按键获取设备配置详情～ -->
                        {{ $t("deviceConfiguration.fileConfigText1") }}
                    </p>
                </EmptyBox>
            </template>
            <template v-else>
                <!--控件版本-->
                <div id="AEStreamWebVersion" style="width: 0; height: 0"></div>
                <!-- 加入控件 -->
                <!-- title="下发配置信息时，请确保当前为设备最新配置信息，否则会覆盖掉之前的配置，点击“获取最新配置”按键可获取设备最新配置信息。" -->
                <el-alert
                    :label="$t('deviceConfiguration.fileConfigText2')"
                    type="info"
                    simple
                    show-icon
                    class="m-t-sm"
                ></el-alert>
                <div class="m-y-sm">
                    <el-button type="primary" @click="saveTemplate">
                        <!-- 存至模板 -->
                        {{ $t("deviceConfiguration.fileConfigText3") }}
                    </el-button>
                    <el-button
                        @click="downLoadUrl"
                        :disabled="!binDownloadFileKey"
                    >
                        <!-- 下载至本地 -->
                        {{ $t("deviceConfiguration.fileConfigText4") }}
                    </el-button>
                    <a
                        type="text"
                        style="float: right; line-height: 32px"
                        @click="reDownLoad"
                        v-if="notLastVerson"
                    >
                        <!-- 发现新控件版本 -->
                        {{ $t("deviceConfiguration.fileConfigText5") }}
                    </a>
                </div>
                <div class="h-full w-full text-center divHeight m-t-sm">
                    <div
                        v-if="!noneVideoPlay"
                        class="h-full inline"
                        style="height: 100%; width: 100%"
                        id="videoPlay"
                    ></div>
                    <div
                        v-if="noneVideoPlay"
                        class="h-full flex-layout flex-middle flex-center"
                    >
                        <div class="text-center">
                            <h4>
                                <!-- Web控件未运行 -->
                                {{ $t("deviceConfiguration.fileConfigText6") }}
                            </h4>
                            <p class="text-xs text-muted m-y text-center">
                                <!-- 请尝试以下办法 -->
                                {{
                                    $t("deviceConfiguration.fileConfigText7")
                                }}：
                            </p>
                            <div class="text-xs text-center">
                                <span>
                                    <!-- 本机尚未安装Web控件，请先安装，安装完成后刷新当前页面 -->
                                    1）{{
                                        $t(
                                            "deviceConfiguration.fileConfigText8"
                                        )
                                    }}！
                                </span>
                                <a @click="downloadOcx">
                                    <!-- 安装 -->
                                    {{ $t("deviceConfiguration.install") }}
                                </a>
                                <a @click="refreshPage">
                                    <!-- 刷新 -->
                                    {{ $t("deviceConfiguration.refresh") }}
                                </a>
                            </div>
                            <div class="text-xs text-center">
                                <span>
                                    <!-- 2）本机已安装Web控件，请先启动服务后刷新当前页面！ -->
                                    2）{{
                                        $t(
                                            "deviceConfiguration.fileConfigText9"
                                        )
                                    }}！
                                </span>
                                <a @click="wakeUpOcx">
                                    <!-- 启动 -->
                                    {{ $t("deviceConfiguration.start") }}
                                </a>
                                <a @click="refreshPage">
                                    <!-- 刷新 -->
                                    {{ $t("deviceConfiguration.refresh") }}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </div>
        <div class="config-bottom b-a p-r-md" v-if="!noneVideoPlay">
            <el-button type="default" @click="goBack">
                <!-- 返回 -->
                {{ $t("common.return") }}
            </el-button>
            <el-button type="primary" @click="send">
                <!-- 下发至终端 -->
                {{ $t("deviceUpgrade.issuedToTerminal") }}
            </el-button>
        </div>
        <SaveTemplate
            :visible.sync="templateVisible"
            @submit="submitTemp"
        ></SaveTemplate>
        <!-- 确认 -->
        <el-dialog
            :visible="confirmConfig"
            :title="$t('common.confirm')"
            :show-close="false"
            :width="'400px'"
        >
            <div class="start-config-content">
                <span class="text-md">
                    <!-- 确认要将配置信息下发至设备吗 -->
                    {{ $t("deviceConfiguration.fileConfigText10") }}？</span
                >
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button
                    :disabled="sendFileConfiging"
                    :loading="sendFileConfiging"
                    @click="sendFileConfig"
                >
                    <!-- 下发 -->
                    {{ $t("common.issued") }}
                </el-button>
                <el-button
                    type="primary"
                    @click="
                        confirmConfig = false;
                        sendFileConfiging = false;
                    "
                >
                    <!-- 取消 -->
                    {{ $t("common.cancel") }}
                </el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import { WebControl } from "web-control";
import SaveTemplate from "@/components/coreManage/saveTemplate";
import EmptyBox from "@/components/coreManage/emptyBox";
import ocxWebControl from "@/utils/ocxWebControl";

export default {
    components: { SaveTemplate, EmptyBox },
    name: "fileConfig",
    data() {
        return {
            sendFileConfiging: false,
            confirmConfig: false,
            // confirmUpdataDialog: true,//更新弹窗
            noneVideoPlay: true, // 是否显示控件
            binDownloadUrl: "",
            binDownloadFileKey: "",
            saveParam: {},
            saveMould: {},
            type: 1,
            webVersionControl: null,
            templateVisible: false,
            operateForm: {
                type: "protocol",
                deviceId: this.$route.query.deviceId,
                binId: "",
                fileKey: "",
            },
            deviceInfo: {},
            notLastVerson: false,
            getBinFileFromDeviceLoad: false,
        };
    },
    watch: {},
    methods: {
        //唤醒设备
        awakenDevice() {
            let params = { deviceId: this.operateForm.deviceId };
            this.$api
                .awakenDevice(params)
                .then((res) => {
                    if (res.success) {
                        // "已向设备下发唤醒指令，静待1分钟左右设备将重新上线！"
                        this.$message.success(
                            this.$t("videoPlayback.issueWakeupCommand")
                        );
                    } else {
                        // 下发唤醒失败！
                        this.$message.error(
                            this.$t("videoPlayback.wakeupFailed")
                        );
                    }
                })
                .catch((err) => {
                    // 下发唤醒失败！
                    this.$message.error(this.$t("videoPlayback.wakeupFailed"));
                });
        },
        submitTemp(temp) {
            let this_ = this;
            let data = this.saveMould;
            if (this.videoPlayControl != null) {
                let argumentsList = {
                    host: "",
                    params: [],
                };
                for (let item in data) {
                    if (item == "host") {
                        argumentsList["host"] = data[item];
                    } else {
                        argumentsList["params"].push({
                            key: item,
                            value: data[item],
                        });
                    }
                }
                // let argumentsList = {}
                //   for(let item in data){
                //     argumentsList[item] = data[item]
                // }
                this.setCallbacks(this.videoPlayControl);
                this.videoPlayControl
                    .JS_RequestInterface({
                        funcName: "startUpload_New",
                        arguments: argumentsList,
                        // arguments: {
                        //     "host": data.host,
                        //     "fileKey": data.fileName, //文件名，随机字符串
                        //     "OSSAccessKeyId": data.OSSAccessKeyId,
                        //     "policy": data.policy,
                        //     "Signature": data.Signature
                        // }
                    })
                    .then(function (oData) {
                        if (oData.responseMsg.error == 0) {
                            this_.saveParam.fileKey = this_.saveMould.fileName;
                            let params = Object.assign(
                                this_.deviceInfo,
                                temp,
                                { templateType: 2, fileType: 0 },
                                {
                                    templateContent: JSON.stringify(
                                        this_.saveParam
                                    ),
                                }
                            );
                            this_.$api
                                .hikDevParamTempAdd(params)
                                .then((res) => {
                                    if (res.success == true) {
                                        // this_.$message.success("模板保存成功");
                                        this_.$message.success(
                                            this.$t(
                                                "deviceConfiguration.fileConfigText12"
                                            )
                                        );
                                        this_.templateVisible = false;
                                    } else {
                                        this_.$message.error(res.msg);
                                    }
                                });
                        } else {
                            return;
                        }
                    });
            } else {
                // 控件未初始化
                this.$message.error(
                    this.$t("deviceConfiguration.fileConfigText11")
                );
            }
        },
        goBack() {
            this.$router.push("/maintenanceCenter/deviceConfiguration");
        },
        send() {
            document.body.scrollTop = document.documentElement.scrollTop = 0;
            this.confirmConfig = true;
            this.sendFileConfiging = false;
        },
        sendFileConfig() {
            this.type = 2;
            this.sendFileConfiging = true;
            let this_ = this;
            this.$api.getBinFileConfigUploadUrl().then((res) => {
                if (res.success == true) {
                    let data = res.data;
                    let argumentsList = {
                        host: "",
                        params: [],
                    };

                    for (let item in data) {
                        if (item == "host") {
                            argumentsList["host"] = data[item];
                        } else {
                            argumentsList["params"].push({
                                key: item,
                                value: data[item],
                            });
                        }
                        // let argumentsList = {}
                        // for(let item in data){
                        //    argumentsList[item] = data[item]
                        //   }
                    }
                    if (this.videoPlayControl != null) {
                        this.setCallbacks(this.videoPlayControl);
                        this.videoPlayControl
                            .JS_RequestInterface({
                                funcName: "startUpload_New",
                                arguments: argumentsList,
                                // arguments: {
                                //     "host": data.host,
                                //     "fileKey": data.fileName, //文件名，随机字符串
                                //     "OSSAccessKeyId": data.OSSAccessKeyId,
                                //     "policy": data.policy,
                                //     "Signature": data.Signature
                                // }
                            })
                            .then(function (oData) {
                                // console.log(this);
                                this_.sendFileConfiging = false;
                                //showCBInfo(JSON.stringify(oData.responseMsg));
                            });
                    } else {
                        this.sendFileConfiging = false;
                        // 控件未初始化
                        this.$message.error(
                            this.$t("deviceConfiguration.fileConfigText11")
                        );
                    }
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        updateConfig() {
            // this.confirmUpdataDialog=false;
            that.downloadOcx();
        },
        // 回调设置
        setCallbacks(obj) {
            obj.JS_SetWindowControlCallback({
                cbIntegrationCallBack: this.cbIntegrationCallBack,
            });
        },
        cbIntegrationCallBack(oData) {
            //回调文件上传完成
            if (oData.responseMsg.event == "UploadFinishedNotify") {
                let data = oData.responseMsg.msg;
                if (null == data) {
                    // 控件返回值异常，请稍后重试
                    this.$message.error(
                        this.$t("deviceConfiguration.fileConfigText13")
                    );
                    return;
                }
                let code = data.code;
                if (this.type == 2) {
                    if (code != null && code === 0) {
                        this.operateForm.fileKey = data.fileKey;
                        this.$api
                            .saveBinFileToDevice(this.operateForm)
                            .then((res) => {
                                if (res.success == true) {
                                    // this.$message.success('信令已发送，在任务管理查看详情');
                                    //  this.getDeviceBinFile();
                                    //  document.body.scrollTop=document.documentElement.scrollTop=0
                                    setTimeout(() => {
                                        this.$emit("fileSuccess", res.data);
                                        this.confirmConfig = false;
                                    }, 1000);
                                } else {
                                    this.$message.error(res.msg);
                                    this.sendFileConfiging = false;
                                }
                            });
                        this.refresh();
                    } else {
                        return;
                    }
                }
            }
        },
        // 打开“未获取到？”弹窗
        openDialog() {
            this.$emit("open");
        },
        downLoadUrl() {
            let dealForm = { fileKey: this.binDownloadFileKey };
            //获取下载url,不可直接取页面url,防止url过期
            this.$api.getBinFileDownloadUrl(dealForm).then((res) => {
                if (res.success == true) {
                    this.binDownloadUrl = res.data;
                    var iframe = document.createElement("iframe");
                    iframe.src = this.binDownloadUrl;
                    iframe.style.display = "none";
                    document.body.appendChild(iframe);
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        saveTemplate() {
            this.type = 1;
            this.$api.getBatchBinUploadUrl().then((res) => {
                if (res.success == true) {
                    this.saveMould = res.data;
                    this.templateVisible = true;
                } else {
                    this.$message.error(res.msg);
                }
            });
            document.body.scrollTop = document.documentElement.scrollTop = 0;
        },
        //配置文件配置
        downLoadFile(data) {
            this.noneVideoPlay = false;
            let dealForm = { fileKey: data.fileKey };
            //获取播放url,不可直接取页面url,防止url过期
            this.$api.getBinFileDownloadUrl(dealForm).then((res) => {
                if (res.success == true) {
                    if (this.videoPlayControl == null) {
                        let params = {
                            fileKey: data.fileKey,
                            deviceType: data.deviceModelCode,
                            customNum: data.projectCode,
                            url: res.data,
                            configVersion: data.configVersion,
                            hardwareVersion: data.version,
                            versionDate: data.versionDate,
                        };
                        this.$nextTick(() => {
                            let box = document.getElementById("videoPlay");
                            let offsetHeight = box.offsetHeight;
                            let offsetWidth = box.offsetWidth;
                            this.videoPlayControl = this.initWebOcx(
                                this.videoPlayControl,
                                "videoPlay",
                                offsetWidth,
                                offsetHeight,
                                params
                            );
                        });
                        this.saveParam = params;
                    }
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        /**初始化回放控件-云端回放
         * @param {object} obj 控件实例化对象,每个播放窗口都具有唯一的obj
         * @param {string} id 控件id,用id控件唯一标示
         * @param {int} width 控件宽度,整数
         * @param {int} height 控件高度,整数
         */
        initWebOcx(obj, id, width, height, item) {
            let that = this;
            return (obj = new WebControl({
                szPluginContainer: id,
                iServicePortStart: 14450, // 对应 LocalServiceConfig.xml 中的ServicePortStart值
                iServicePortEnd: 14452, // 对应 LocalServiceConfig.xml 中的ServicePortEnd值
                szClassId: "58BC9428-61BE-4F39-ABA3-89452662A4A0",
                cbConnectSuccess: () => {
                    obj.JS_StartService("window", {
                        dllPath: "./WebParamConfig.dll",
                    }).then(
                        () => {
                            obj.JS_CreateWnd(id, width, height).then(
                                function () {
                                    obj.JS_RequestInterface({
                                        funcName: "startDownload",
                                        arguments: {
                                            fileKey: item.fileKey,
                                            deviceType: item.deviceType,
                                            customNum: item.customNum,
                                            url: item.url,
                                            configVersion: item.configVersion,
                                            hardwareVersion:
                                                item.hardwareVersion,
                                            versionDate: item.versionDate,
                                        },
                                    }).then(function (oData) {
                                        //showCBInfo(JSON.stringify(oData.responseMsg));
                                    });
                                }
                            );
                        },
                        function () {
                            // this.$message.error("控件服务启动失败！");
                            that.$message.error(
                                that.$t("deviceConfiguration.fileConfigText14")
                            );
                        }
                    );
                },
                cbConnectError: () => {
                    obj = null;
                    this.noneVideoPlay = true;
                    this.videoPlayControl = null;
                    //this.$message.error('控件连接失败！');
                },
                cbConnectClose: (bNormalClose) => {
                    if (!bNormalClose) {
                        obj = null;
                        this.noneVideoPlay = true;
                        this.videoPlayControl = null;
                        //this.$message.error('控件连接异常断开');
                        //obj.JS_WakeUp("HATWebCtrlPlugin://");
                    }
                    return null;
                },
            }));
        },
        // 检查版本
        initWebControl(obj, id, height, width) {
            let that = this;
            return (obj = new WebControl({
                szPluginContainer: id,
                iServicePortStart: 14450, // 对应 LocalServiceConfig.xml 中的ServicePortStart值
                iServicePortEnd: 14452, // 对应 LocalServiceConfig.xml 中的ServicePortEnd值
                szClassId: "58BC9428-61BE-4F39-ABA3-89452662A4A0",
                cbConnectSuccess: () => {
                    obj.JS_StartService("window", {
                        dllPath: "./WebVersion.dll",
                    }).then(
                        () => {
                            obj.JS_CreateWnd(id, width, height).then(
                                function () {
                                    obj.JS_RequestInterface({
                                        funcName: "GetControlVersion",
                                        arguments: {},
                                    }).then((oData) => {
                                        if (oData.responseMsg.error === 0) {
                                            //获取版本号成功
                                            let pluginVersion =
                                                oData.responseMsg.version.toString();
                                            // that.pluginVersionCreat = oData.responseMsg.version
                                            //     .toString();
                                            let params = {
                                                pluginVersion: pluginVersion,
                                            };
                                            //调用比对接口
                                            that.$api
                                                .comparePluginVersion(params)
                                                .then((res) => {
                                                    if (res.success) {
                                                        let isLastVerson =
                                                            res.data;
                                                        if (isLastVerson) {
                                                            // "当前Web控件版本已经是最新的！"
                                                            that.$message.info(
                                                                that.$t(
                                                                    "deviceConfiguration.fileConfigText15"
                                                                )
                                                            );
                                                            that.notLastVerson = false;
                                                        } else {
                                                            // this.confirmUpdataDialog=true;
                                                            that.notLastVerson = true;
                                                            document.body.scrollTop =
                                                                document.documentElement.scrollTop = 0;
                                                            // that.$Modal.confirm({
                                                            //   content: '<h3 class="m-b-sm">当前控件版本不是最新,是否要下载最新控件,下载安装后需刷新页面</h3>',
                                                            //   styles: 'MessageTop',
                                                            //   onOk: () => {
                                                            //       that.downloadOcx();
                                                            //   },
                                                            //   onCancel: () => {}
                                                            // });
                                                            that.$confirm(
                                                                // "当前控件版本不是最新,是否要下载最新控件,下载安装后需刷新页面。",
                                                                that.$t(
                                                                    "deviceConfiguration.fileConfigText16"
                                                                ),
                                                                {
                                                                    confirmButtonText:
                                                                        this.$t(
                                                                            "common.ok"
                                                                        ),
                                                                    cancelButtonText:
                                                                        this.$t(
                                                                            "common.cancel"
                                                                        ),
                                                                    type: "warning",
                                                                }
                                                            )
                                                                .then(() => {
                                                                    that.downloadOcx();
                                                                })
                                                                .catch(
                                                                    () => {}
                                                                );
                                                        }
                                                    } else {
                                                        // "调用控件版本比对接口失败！"
                                                        that.$message.error(
                                                            that.$t(
                                                                "deviceConfiguration.fileConfigText16"
                                                            )
                                                        );
                                                    }
                                                });
                                        } else {
                                            // 查询控件版本号失败！
                                            that.$message.error(
                                                that.$t(
                                                    "deviceConfiguration.fileConfigText18"
                                                )
                                            );
                                        }
                                    });
                                }
                            );
                        },
                        function () {
                            // that.$message.error("查询版本控件启动失败!!!!");
                            that.$message.error(
                                that.$t("deviceConfiguration.fileConfigText19")
                            );
                        }
                    );
                },
                cbConnectError: () => {
                    obj = null;
                    this.webVersionControl = null;
                },
                cbConnectClose: () => {
                    obj = null;
                    this.webVersionControl = null;
                },
            }));
        },
        //刷新Session
        refreshSession() {
            var _this = this;
            this.refreshSessionHandle = setInterval(function () {
                _this.$api.refreshSession().then((res) => {});
            }, 1000 * 60);
        },
        // 安装
        downloadOcx() {
            this.$api.getBinFileConfigDownloadUrl().then((res) => {
                let url = "";
                if (res.success && !!res.data) {
                    url = res.data;
                    let elemIF = document.createElement("iframe");
                    elemIF.src = url;
                    elemIF.style.display = "none";
                    document.body.appendChild(elemIF);
                    setTimeout(() => {
                        document.body.removeChild(elemIF);
                    }, 2000);
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        reDownLoad() {
            document.body.scrollTop = document.documentElement.scrollTop = 0;
            this.$confirm(
                // "当前控件版本不是最新,是否要下载最新控件,下载安装后需刷新页面",
                this.$t("deviceConfiguration.fileConfigText16"),
                {
                    confirmButtonText: this.$t("common.ok"),
                    cancelButtonText: this.$t("common.cancel"),
                    type: "warning",
                }
            )
                .then(() => {
                    this.downloadOcx();
                })
                .catch(() => {});
        },
        // 刷新
        refresh() {
            if (this.videoPlayControl != null) {
                this.videoPlayControl.JS_Disconnect();
            }
            this.videoPlayControl = null;
        },
        refreshPage() {
            location.reload();
        },
        // 启动
        wakeUpOcx() {
            WebControl.JS_WakeUp("HATConfigCtrlPlugin://");
        },
        //文件配置---从设备获取BIN文件 获取最新配置
        getBinFileFromDevice() {
            this.getBinFileFromDeviceLoad = true;
            //this.$message('已向设备发送命令！')
            this.$message(this.$t("deviceConfiguration.fileConfigText20"));
            let params = {
                type: this.operateForm.type,
                deviceId: this.$route.query.deviceId,
            };
            let this_api = this.$api;
            let this_ = this;
            let newPromisee = new Promise((resolve, reject) => {
                this_api.getBinFileFromDevice(params).then((res) => {
                    if (res.success == true) {
                        resolve();
                    } else {
                        reject(res);
                    }
                });
            })
                .then(() => {
                    this_api.getCurrentDeviceBinFile(params).then((res) => {
                        if (res.success == true) {
                            this_.refresh();
                            if (res.success == true) {
                                if (res.data) {
                                    if (localStorage.getItem("radioType")) {
                                        // "查询最新配置文件成功"
                                        this_.$message.success(
                                            this_.$t(
                                                "deviceConfiguration.fileConfigText21"
                                            )
                                        );
                                    }
                                    if (this_.operateForm.deviceId) {
                                        this_.getParamDeviceById();
                                    }
                                    this_.operateForm.binId = res.data.id;
                                } else {
                                    if (localStorage.getItem("radioType")) {
                                        // "没有查询到配置文件信息"
                                        this_.$message(
                                            this_.$t(
                                                "deviceConfiguration.fileConfigText22"
                                            )
                                        );
                                    }
                                    this_.getBinFileFromDeviceLoad = false;
                                    if (this_.operateForm.deviceId) {
                                        this_.getParamDeviceById();
                                    }
                                    return;
                                }
                                this_.binDownloadFileKey = res.data.fileKey;
                                this_.$nextTick(() => {
                                    this_.downLoadFile(res.data);
                                });
                            } else {
                                if (this_.operateForm.deviceId) {
                                    this_.getParamDeviceById();
                                }
                                this_.$message.error(res.msg);
                            }

                            // this_.getCurrentDeviceBinFile();
                            // this_.getParamDeviceById();
                            this_.getBinFileFromDeviceLoad = false;
                        } else {
                            this_.$message.error(res.msg);
                            // this_.getParamDeviceById();
                            this_.getBinFileFromDeviceLoad = false;
                        }
                    });
                })
                .catch((err) => {
                    this_.$message.error(err.msg);
                    this_.getParamDeviceById();
                    this_.getBinFileFromDeviceLoad = false;
                });
        },
        //获取最新的文件配置
        getCurrentDeviceBinFile() {
            let params = {
                type: this.operateForm.type,
                deviceId: this.$route.query.deviceId,
            };
            this.$api.getCurrentDeviceBinFile(params).then((res) => {
                if (res.success == true) {
                    if (res.data) {
                        if (localStorage.getItem("radioType")) {
                            // this.$message.success("查询最新配置文件成功");
                            this.$message.success(
                                this.$t("deviceConfiguration.fileConfigText21")
                            );
                        }
                        this.operateForm.binId = res.data.id;
                    } else {
                        if (localStorage.getItem("radioType")) {
                            // this.$message("没有查询到配置文件信息");
                            this.$message(
                                this.$t("deviceConfiguration.fileConfigText22")
                            );
                        }
                        return;
                    }
                    this.binDownloadFileKey = res.data.fileKey;
                    this.$nextTick(() => {
                        this.downLoadFile(res.data);
                    });
                } else {
                    this.$message.error(res.msg);
                }
            });
        },

        // 数据库保存的最新文件配置---获取设备最新BIN文件信息和URL
        getDeviceBinFile(type) {
            let params = {
                deviceId: this.$route.query.deviceId,
            };
            this.$api.getDeviceBinFile(params).then((res) => {
                if (res.success == true) {
                    if (res.data) {
                        if (localStorage.getItem("radioType")) {
                            // this.$message.success("查询最新配置文件成功");
                            this.$message.success(
                                this.$t("deviceConfiguration.fileConfigText21")
                            );
                        }

                        this.operateForm.binId = res.data.id;
                    } else {
                        if (localStorage.getItem("radioType")) {
                            // this.$message("没有查询到配置文件信息");
                            this.$message(
                                this.$t("deviceConfiguration.fileConfigText22")
                            );
                        }
                        return;
                    }
                    this.binDownloadFileKey = res.data.fileKey;
                    this.$nextTick(() => {
                        this.downLoadFile(res.data);
                    });
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        // 获取设备详情
        getParamDeviceById() {
            let params = {
                deviceId: this.$route.query.deviceId,
            };
            this.$api.filegetParamDeviceById(params).then((res) => {
                if (res.success == true) {
                    this.deviceInfo = res.data.length > 0 ? res.data[0] : {};
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
    },
    mounted() {
        this.getBinFileFromDevice();
        // let script = document.createElement('script');
        // script.src = '/static/js/jsWebControl-1.0.0.min.js';
        // document.head.appendChild(script);

        // this.getParamDeviceById()
        this.refreshSession();
        //监听页面滚动
        window.addEventListener("scroll", () => {
            if (this.videoPlayControl != null) {
                let box = document.getElementById("videoPlay");
                let offsetHeight = box.offsetHeight;
                let offsetWidth = box.offsetWidth;
                ocxWebControl.pageScroll(
                    this.videoPlayControl,
                    "videoPlay",
                    offsetWidth,
                    offsetHeight
                );
            }
        }),
            //监听窗口拉伸
            window.addEventListener("resize", () => {
                if (this.videoPlayControl != null) {
                    let box = document.getElementById("videoPlay");
                    let offsetHeight = box.offsetHeight;
                    let offsetWidth = box.offsetWidth;
                    ocxWebControl.pageResize(
                        this.videoPlayControl,
                        "videoPlay",
                        offsetWidth,
                        offsetHeight
                    );
                }
            });
        // this.onCardClicked('params');
        //this.getDeviceBinFile(0)
        setTimeout(() => {
            if (null == this.webVersionControl) {
                this.webVersionControl = this.initWebControl(
                    this.webVersionControl,
                    "AEStreamWebVersion",
                    0,
                    0
                );
            }
        }, 2000);
    },
    beforeDestroy() {
        this.radioType == 3;
        this.operateForm.deviceId = "";
        localStorage.removeItem("radioType");
        if (this.videoPlayControl != null) {
            //this.videoPlayControl.JS_Disconnect();
            this.videoPlayControl.JS_DestroyWnd().then(
                () => {},
                () => {}
            );
            this.videoPlayControl = null;
            this.noneVideoPlay = false;
        }
        // 控件销毁
        if (this.webVersionControl != null) {
            this.webVersionControl.JS_DestroyWnd().then(
                () => {},
                () => {
                    // console.log('控件销毁失败');
                }
            );
            this.webVersionControl = null;
            this.noneVideoPlay = false;
        }
    },
    created() {
        localStorage.setItem("radioType", 1);
    },
};
</script>
<style lang="less">
.file-config {
    .no-config {
        width: 140px;
        display: flex;
        flex-direction: column;
        a {
            text-align: right;
        }
    }
    .divHeight {
        height: calc(~"100vh - 37rem");
        margin-bottom: 0;
    }
    .config-bottom {
        // position: fixed;
        // bottom: 0;
        display: flex;
        align-items: center;
        width: 100%;
        height: 60px;
        justify-content: flex-end;
    }
}
.el-message-box {
    vertical-align: unset !important;
}
.subheading .el-form-item__label {
    color: #b3b3b3 !important;
    font-size: 14px !important;
}
.littleYellow {
    border: 1px solid rgba(255, 149, 44, 1);
    background-color: rgba(255, 149, 44, 0.8);
    color: white;
    position: relative;
    display: inline-block;
    height: 24px;
    box-sizing: border-box;
    padding: 0 8px;
    border-radius: 2px;
    font-size: 14px;
    line-height: 24px;
    white-space: nowrap;
}
.mask {
    background-color: rgb(0, 0, 0);
    opacity: 0.3;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 9999999;
}
.start-config-content {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    color: #000;
}
.MessageTop {
    vertical-align: top !important;
    margin-top: 5% !important;
}
</style>
