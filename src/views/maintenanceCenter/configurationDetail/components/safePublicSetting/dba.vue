<template>
    <div class="p-a-md">
        <el-form
            ref="PublicDba"
            label-position="top"
            :model="form"
            label-width="120px"
        >
            <div id="title" class="channels">
                <el-button
                    :type="item == activeChannel ? 'info' : ''"
                    v-for="item in channelList"
                    @click="changeChannel(item)"
                    :key="item"
                    >通道{{ item }}</el-button
                >
            </div>
            <el-tabs
                v-model="activeName"
                :before-leave="beforeLeave"
                @tab-click="getByIsApi(activeName, activeChannel, true)"
            >
                <el-tab-pane
                    v-if="form['IsApiDBAGlobal'] != undefined"
                    label="DBA全局配置"
                    name="first"
                >
                    <el-row
                        type="flex"
                        justify="space-between"
                        style="margin-top: 10px"
                    >
                        <el-col :span="7" v-if="isTemplate != 'true'">
                            <el-button @click="openDialog"
                                >DBA全局音量配置</el-button
                            >
                            <span class="prompt"
                                >全局音量是为了方便用户统一设置各子项音量增加的配置，实际设备中无此项配置，故获取时此配置无意义。</span
                            >
                        </el-col>
                        <el-col :span="7">
                            <el-form-item
                                label="DBA报警使能"
                                description="此项配置控制算法，不是统一配置子报警使能"
                            >
                                <el-switch
                                    v-if="form['IsApiDBAGlobal']"
                                    v-model="form['IsApiDBAGlobal'].enable"
                                ></el-switch>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7"></el-col>
                        <el-col :span="7" v-if="isTemplate == 'true'"></el-col>
                    </el-row>
                </el-tab-pane>
                <el-tab-pane
                    :label="item.name"
                    :name="item.name"
                    v-for="item in tablist"
                    :key="item.index"
                >
                    <template v-if="form[item.commandId]">
                        <template v-if="showDeploy">
                            <el-row
                                type="flex"
                                justify="space-between"
                                class="m-t-sm"
                            >
                                <!-- <el-form-item>
                <el-radio-group v-model="item.alarmLevel" type="simple">
                  <el-radio-button :label="1">一级报警</el-radio-button>
                  <el-radio-button :label="2">二级报警</el-radio-button>
                </el-radio-group>                
              </el-form-item> -->
                                <div class="alarmLevelBox">
                                    <el-button
                                        @click="changeAlarmLevel(item, 1)"
                                        :type="
                                            item.alarmLevel == 1
                                                ? 'primary'
                                                : 'default'
                                        "
                                        >一级报警</el-button
                                    >
                                    <el-button
                                        @click="changeAlarmLevel(item, 2)"
                                        :type="
                                            item.alarmLevel == 2
                                                ? 'primary'
                                                : 'default'
                                        "
                                        >二级报警</el-button
                                    >
                                </div>
                            </el-row>
                            <div
                                v-for="(i, iIndex) in form[item.commandId]
                                    .dbaList"
                                :key="iIndex"
                            >
                                <template
                                    v-if="i.alarmLevel == item.alarmLevel"
                                >
                                    <el-row type="flex" justify="space-between">
                                        <el-col :span="7">
                                            <el-form-item
                                                v-if="isTemplate != 'true'"
                                                :label="
                                                    item.shortName + '报警使能'
                                                "
                                            >
                                                <el-switch
                                                    :disabled="
                                                        form['IsApiDBAGlobal']
                                                            .enable != 1
                                                    "
                                                    v-model="i.enabled"
                                                ></el-switch>
                                                <!-- <el-select v-model="i[item.commandId].enabled">
                              <el-option label="关闭" :value="0"></el-option>
                              <el-option label="开启" :value="1"></el-option>
                            </el-select> -->
                                            </el-form-item>
                                            <el-form-item
                                                v-if="isTemplate == 'true'"
                                                :label="
                                                    item.shortName + '报警使能'
                                                "
                                            >
                                                <el-switch
                                                    v-if="
                                                        form[
                                                            'IsApiAdasGlobal'
                                                        ] == undefined
                                                    "
                                                    v-model="i.enabled"
                                                ></el-switch>
                                                <el-switch
                                                    v-if="
                                                        form[
                                                            'IsApiAdasGlobal'
                                                        ] != undefined
                                                    "
                                                    :disabled="
                                                        form['IsApiDBAGlobal']
                                                            .enable != 1
                                                    "
                                                    v-model="i.enabled"
                                                ></el-switch>
                                                <!-- <el-select v-model="i[item.commandId].enabled">
                              <el-option label="关闭" :value="0"></el-option>
                              <el-option label="开启" :value="1"></el-option>
                            </el-select> -->
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="7">
                                            <el-form-item
                                                label="报警视频上传使能"
                                            >
                                                <el-switch
                                                    v-model="
                                                        i.uploadVideoEnabled
                                                    "
                                                ></el-switch>
                                                <!-- <el-select v-model="i.snapShotUpload">
                                <el-option label="关闭" :value="0"></el-option>
                                <el-option label="上传" :value="1"></el-option>
                              </el-select> -->
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="7">
                                            <el-form-item
                                                label="报警图片上传使能"
                                            >
                                                <el-switch
                                                    v-model="i.uploadPicEnabled"
                                                ></el-switch>
                                                <!-- <el-select v-model="i.snapShotUpload">
                              <el-option label="关闭" :value="0"></el-option>
                              <el-option label="上传" :value="1"></el-option>
                            </el-select> -->
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                    <el-row type="flex" justify="space-between">
                                        <!-- <el-col :span="7" >
                        <el-form-item label="时间阈值" :rules="{ validator: checkNumber.bind({type:'int',min:form[item.commandId+'Capability'].intervalTimeMin,max:form[item.commandId+'Capability'].intervalTimeMax}), trigger: 'blur' }" :prop="item.commandId + '.dbaList.' + iIndex + '.intervalTime'">
                            <el-input v-model="i.intervalTime"><span slot="suffix">s</span></el-input>
                        </el-form-item>
                    </el-col> -->
                                        <el-col :span="7">
                                            <el-form-item
                                                v-if="
                                                    form[
                                                        item.IsApiTriggerInfo
                                                    ] &&
                                                    form[item.IsApiTriggerInfo][
                                                        'EventRuleTriggerList'
                                                    ].length
                                                "
                                                :label="
                                                    item.shortName + '报警音量'
                                                "
                                            >
                                                <el-slider
                                                    v-model="
                                                        form[
                                                            item
                                                                .IsApiTriggerInfo
                                                        ][
                                                            'EventRuleTriggerList'
                                                        ][iIndex][
                                                            'EventTriggerList'
                                                        ][0]['Audio'].volume
                                                    "
                                                    :min="0"
                                                    :max="64"
                                                    :step="1"
                                                    show-input
                                                ></el-slider>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="7">
                                            <el-form-item
                                                v-if="iIndex == 0"
                                                description="一二级报警速度差不小于20"
                                                label="报警判断速度阈值"
                                                :rules="{
                                                    validator: checkNumber.bind(
                                                        {
                                                            type: 'int',
                                                            min: form[
                                                                item.commandId +
                                                                    'Capability'
                                                            ].limitSpeedMin,
                                                            max:
                                                                Number(
                                                                    form[
                                                                        item
                                                                            .commandId
                                                                    ].dbaList[1]
                                                                        .limitSpeed
                                                                ) - 20,
                                                        }
                                                    ),
                                                    trigger: 'blur',
                                                }"
                                                :prop="
                                                    item.commandId +
                                                    '.dbaList.' +
                                                    iIndex +
                                                    '.limitSpeed'
                                                "
                                            >
                                                <el-input
                                                    tips-placement="top-end"
                                                    :tips="`键入值范围为${
                                                        form[
                                                            item.commandId +
                                                                'Capability'
                                                        ].limitSpeedMin
                                                    }~${
                                                        Number(
                                                            form[item.commandId]
                                                                .dbaList[1]
                                                                .limitSpeed
                                                        ) - 20
                                                    }`"
                                                    v-model="i.limitSpeed"
                                                    ><span slot="suffix"
                                                        >km/h</span
                                                    ></el-input
                                                >
                                            </el-form-item>
                                            <el-form-item
                                                v-if="iIndex == 1"
                                                description="一二级报警速度差不小于20"
                                                label="报警判断速度阈值"
                                                :rules="{
                                                    validator: checkNumber.bind(
                                                        {
                                                            type: 'int',
                                                            min:
                                                                Number(
                                                                    form[
                                                                        item
                                                                            .commandId
                                                                    ].dbaList[0]
                                                                        .limitSpeed
                                                                ) + 20,
                                                            max: form[
                                                                item.commandId +
                                                                    'Capability'
                                                            ].limitSpeedMax,
                                                        }
                                                    ),
                                                    trigger: 'blur',
                                                }"
                                                :prop="
                                                    item.commandId +
                                                    '.dbaList.' +
                                                    iIndex +
                                                    '.limitSpeed'
                                                "
                                            >
                                                <el-input
                                                    tips-placement="top-end"
                                                    :tips="`键入值范围为${
                                                        Number(
                                                            form[item.commandId]
                                                                .dbaList[0]
                                                                .limitSpeed
                                                        ) + 20
                                                    }~${
                                                        form[
                                                            item.commandId +
                                                                'Capability'
                                                        ].limitSpeedMax
                                                    }`"
                                                    v-model="i.limitSpeed"
                                                    ><span slot="suffix"
                                                        >km/h</span
                                                    ></el-input
                                                >
                                            </el-form-item>
                                        </el-col>
                                        <!-- <el-col :span="7" >
                        <el-form-item label="报警抑制时间" :rules="{ validator: checkNumber.bind({type:'int',min:form[item.commandId+'Capability'].intervalTimeMin,max:form[item.commandId+'Capability'].intervalTimeMax}), trigger: 'blur' }" :prop="item.commandId + '.dbaList.' + iIndex + '.intervalTime'">
                            <el-input v-model="i.intervalTime"><span slot="suffix">ms</span></el-input>
                        </el-form-item>
                    </el-col> -->
                                        <el-col :span="7">
                                            <el-form-item
                                                label="灵敏度"
                                                :rules="{
                                                    validator: checkNumber.bind(
                                                        {
                                                            type: 'int',
                                                            min: form[
                                                                item.commandId +
                                                                    'Capability'
                                                            ].sensitivityMin,
                                                            max: form[
                                                                item.commandId +
                                                                    'Capability'
                                                            ].sensitivityMax,
                                                        }
                                                    ),
                                                    trigger: 'blur',
                                                }"
                                                :prop="
                                                    item.commandId +
                                                    '.dbaList.' +
                                                    iIndex +
                                                    '.sensitivity'
                                                "
                                            >
                                                <el-input
                                                    tips-placement="top-end"
                                                    :tips="`键入值范围为${
                                                        form[
                                                            item.commandId +
                                                                'Capability'
                                                        ].sensitivityMin
                                                    }~${
                                                        form[
                                                            item.commandId +
                                                                'Capability'
                                                        ].sensitivityMax
                                                    }`"
                                                    v-model="i.sensitivity"
                                                    ><span slot="suffix"
                                                        >s</span
                                                    ></el-input
                                                >
                                            </el-form-item>
                                        </el-col>

                                        <!-- <el-col :span="7" >
                        <el-form-item label="事件上传使能">
                            <el-select v-model="i[item.commandId].eventEnabled">
                              <el-option label="不上传" :value="0"></el-option>
                              <el-option label="上传" :value="1"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col> -->
                                    </el-row>
                                    <el-row type="flex" justify="space-between">
                                        <!-- <el-col :span="7" >
                        <el-form-item label="抓图报警类型">
                            <el-select v-model="i[item.commandId].snapShotUpload">
                              <el-option label="关闭" :value="0"></el-option>
                              <el-option label="打开" :value="1"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col> -->

                                        <!-- <el-col :span="7" >
                        <el-form-item label="抓图张数" :rules="{ validator: checkNumber.bind({type:'int',min:form[item.commandId+'Capability'].pictureNumMin,max:form[item.commandId+'Capability'].pictureNumMax}), trigger: 'blur' }" :prop="item.commandId + '.dbaList.' + iIndex + '.pictureNum'">
                              <el-input v-model="i.pictureNum"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7" >
                        <el-form-item label="抓图间隔" :rules="{ validator: checkNumber.bind({type:'int',min:form[item.commandId+'Capability'].snapIntervalTimeMin,max:form[item.commandId+'Capability'].snapIntervalTimeMax}), trigger: 'blur' }" :prop="item.commandId + '.dbaList.' + iIndex + '.snapIntervalTime'">
                              <el-input v-model="i.snapIntervalTime"><span slot="suffix">s</span></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span=7>

                    </el-col> -->
                                    </el-row>
                                    <el-row type="flex" justify="space-between">
                                        <!-- <el-col :span="7" >
                        <el-form-item label="视频报警类型">
                          <el-select v-model="i[item.commandId].clipUpload">
                              <el-option label="关闭" :value="0"></el-option>
                              <el-option label="打开" :value="1"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col> -->
                                        <!-- <el-col :span="7" >
                        <el-form-item label="短视频前半部分时长" :rules="{ validator: checkNumber.bind({type:'int'}), trigger: 'blur' }" :prop="'IsApiDbaInfoList.' + iIndex + '.' + item.commandId +'.clipPreDuration'">
                              <el-input v-model="i[item.commandId].clipPreDuration"><span slot="suffix">s</span></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7" >
                        <el-form-item label="短视频后半部分时长" :rules="{ validator: checkNumber.bind({type:'int'}), trigger: 'blur' }" :prop="'IsApiDbaInfoList.' + iIndex + '.' + item.commandId +'.clipPostDuration'">
                              <el-input v-model="i[item.commandId].clipPostDuration"><span slot="suffix">s</span></el-input>
                        </el-form-item>
                    </el-col> -->
                                    </el-row>
                                </template>
                            </div>
                        </template>
                    </template>
                </el-tab-pane>
            </el-tabs>
        </el-form>
        <el-dialog title="DBA全局音量调整" :visible.sync="dialogVisible">
            <div class="p-a-md">
                <p class="m-b-sm">
                    点击确定后DBA所有报警项音量将调整为该值,下发至终端成功后生效。
                </p>
                <el-slider
                    v-model="volume"
                    :min="0"
                    :max="64"
                    :step="1"
                    show-input
                ></el-slider>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button
                    type="primary"
                    :loading="sendEveryVolume"
                    :disabled="sendEveryVolume"
                    @click="send"
                    >{{ sendEveryVolume ? "设置中" : "确 定" }}</el-button
                >
                <el-button @click="dialogVisible = false">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { validateNum } from "@/utils/validate";
export default {
    props: {
        detail: {
            type: Object,
            default: () => {
                return {};
            },
        },
        componentName: {
            type: String,
            default: () => {
                return {};
            },
        },
        isTemplate: {
            type: String,
        },
        configParams: {
            type: Boolean,
            default: false,
        },
        deviceCapabilities: {
            type: Object,
            default: () => {
                return {};
            },
        },
        allCopyData: {
            type: Object,
            default: () => {
                return {};
            },
        },
        formDetail: {
            type: Object,
            default: () => {
                return {};
            },
        },
        postChannel: {
            type: Object,
            default: () => {
                return {};
            },
        },
        postChannelData: {
            type: Object,
            default: () => {
                return {};
            },
        },
    },
    watch: {
        deviceCapabilities: {
            handler(newVal, oldVal) {
                if (Boolean(this.isTemplate) == true) {
                } else {
                    this.channelList = [];
                    console.log(newVal);
                    let channelShow = [
                        "DriverCalling",
                        "DriverEyeClosed",
                        "DriverSmoking",
                        "DriverInattention",
                        "DriverAbsented",
                        "DriverBlockCamera",
                        "DriverSafetyBelt",
                        "DriverSunglasses",
                        "RapidAcceleration",
                        "RapidDeceleration",
                        "RapidTurn",
                        "DriverAbnorma",
                        "DriveTime",
                        "DriveChange",
                    ];
                    let channels = [];
                    newVal["IsApiChannelsCapability"][
                        "channelEventList"
                    ].forEach((item) => {
                        for (let i = 0; i < item.eventTypeArray.length; i++) {
                            for (let j = 0; j < channelShow.length; j++) {
                                if (item.eventTypeArray[i] == channelShow[j]) {
                                    channels.push(item.channelId);
                                }
                            }
                        }
                    });
                    this.channelList = [...new Set(channels)];
                    this.activeChannel = this.channelList[0];
                    this.deviceCapability = newVal;
                }
            },
            deep: true,
            immediate: true,
        },
        detail: {
            handler(newVal, oldVal) {
                this.form = newVal;
            },
            deep: true,
            immediate: true,
        },
        componentName: {
            handler(newVal, oldVal) {
                if (newVal == "PublicDba")
                    if (this.isTemplate != "true") {
                        this.commandIds = "IsApiDbaInfoList";
                    }
            },
            deep: true,
            immediate: true,
        },
        form: {
            handler(val) {
                if (JSON.stringify(val) !== "{}") {
                    if (
                        val[this.currentIsApiTriggerInfo] &&
                        val[this.currentCommandId] &&
                        this.currentCommandId != "IsApiDBAGlobal"
                    ) {
                        this.showDeploy = true;
                    } else {
                        this.showDeploy = false;
                    }
                    this.$emit("change", val);
                }
            },
            deep: true,
            immediate: true,
        },

        currentCommandId: {
            handler(newVal, oldVal) {
                this.$emit("adasCommandId", newVal);
            },
        },
        currentIsApiTriggerInfo: {
            handler(newVal, oldVal) {
                this.$emit("currentIsApiTriggerInfos", newVal);
            },
        },
        formDetail: {
            handler(newVal, oldVal) {
                console.log(newVal);
                this.formData = newVal;
            },
            deep: true,
            immediate: true,
        },
        allCopyData: {
            handler(newVal, oldVal) {
                console.log(newVal);
                this.copyForm = newVal;
            },
            deep: true,
            immediate: true,
        },
        postChannel: {
            handler(newVal, oldVal) {
                this.channelForm = newVal;
                if (this.isTemplate == "true") {
                    if (JSON.stringify(newVal) != "{}") {
                        let channels = [];
                        let form = {};
                        for (let key in newVal) {
                            for (let key_ in newVal[key]) {
                                if (
                                    key_ == "IsApiDBAGlobal" ||
                                    key_ == "IsApiDriverEyeClosedInfo" ||
                                    key_ == "IsApiDriverCallingInfo" ||
                                    key_ == "IsApiDriverSmokingInfo" ||
                                    key_ == "IsApiDriverInattentionInfo" ||
                                    key_ == "IsApiDriverAbsentedInfo" ||
                                    key_ == "IsApiDriverBlockCameraInfo" ||
                                    key_ == "IsApiDriverSafetyBeltInfo" ||
                                    key_ == "IsApiDriverSunglassesInfo" ||
                                    key_ == "IsApiRapidAccelerationInfo" ||
                                    key_ == "IsApiRapidDecelerationInfo" ||
                                    key_ == "IsApiRapidTurnInfo" ||
                                    key_ == "IsApiDriverAbnormaInfo" ||
                                    key_ == "IsApiDriveTimeInfo" ||
                                    key_ == "IsApiDriveChangeInfo"
                                ) {
                                    channels.push(key.substring(8, 9));
                                }
                            }
                        }
                        this.channelList = [...new Set(channels)];
                        this.activeChannel = this.channelList[0];
                        for (let key in newVal[
                            "channel_" + this.activeChannel
                        ]) {
                            form[key] =
                                newVal["channel_" + this.activeChannel][key];
                        }
                        this.form = Object.assign({}, this.form, form);
                    }
                }
            },
            deep: true,
            immediate: true,
        },
        copyForm: {
            handler(val) {
                console.log(val);
                if (JSON.stringify(val) !== "{}") {
                    this.$emit("changeCopy", val);
                }
            },
            deep: true,
            immediate: false,
        },
        channelForm: {
            handler(val) {
                if (JSON.stringify(val) !== "{}") {
                    this.$emit("changeChannels", val);
                }
            },
            deep: true,
            immediate: false,
        },
        copyChannelForm: {
            handler(val) {
                if (JSON.stringify(val) !== "{}") {
                    this.$emit("changeCopyChannel", val);
                }
            },
            deep: true,
            immediate: false,
        },
        postChannelData: {
            handler(newVal, oldVal) {
                console.log(newVal);
                this.copyChannelForm = newVal;
            },
            deep: true,
            immediate: true,
        },
        configParams: {
            handler(val) {
                if (!val) {
                    this.getByIsApi(this.activeName, this.activeChannel, false);
                }
            },
            deep: true,
            immediate: true,
        },
        //全局DBA使能
        "form.IsApiDBAGlobal": {
            handler(val) {
                if (val != undefined) {
                    this.$refs["PublicDba"].validate((valid) => {
                        if (valid) {
                            this.formData[
                                "IsApiDBAGlobal_" +
                                    val.channelId +
                                    ".enable." +
                                    val.channelId
                            ] =
                                val["enable"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDBAGlobal"]["enable"]
                                    ? `IsApiDBAGlobal_${
                                          val["channelId"]
                                      }.enable.${
                                          val["channelId"]
                                      }&主动安全设置/DBA/通道${
                                          val.channelId
                                      }/DBA全局设置/DBA报警使能&${
                                          val["enable"] ? "开启" : "关闭"
                                      }`
                                    : "";
                        } else {
                            this.formData[
                                "IsApiDBAGlobal_" +
                                    val.channelId +
                                    ".enable." +
                                    val.channelId
                            ] = "";
                        }
                        this.$emit("changeData", this.formData);
                    });
                }
            },
            deep: true,
            immediate: false,
        },
        //疲劳驾驶音量变化监听
        "form.IsApiDriverEyeClosedTriggerList": {
            handler(val) {
                if (val != undefined) {
                    console.log(this.copyChannelForm);
                    this.$refs["PublicDba"].validate((valid) => {
                        if (valid) {
                            this.formData[
                                "IsApiDriverEyeClosedTriggerList_" +
                                    val.channelId +
                                    ".EventRuleTriggerList.0.EventTriggerList.0.Audio.volume." +
                                    val.channelId
                            ] =
                                val["EventRuleTriggerList"][0][
                                    "EventTriggerList"
                                ][0]["Audio"]["volume"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriverEyeClosedTriggerList"][
                                    "EventRuleTriggerList"
                                ][0]["EventTriggerList"][0]["Audio"]["volume"]
                                    ? `IsApiDriverEyeClosedTriggerList_${val["channelId"]}.EventRuleTriggerList.0.EventTriggerList.0.Audio.volume.${val.channelId}&主动安全设置/DBA/通道${val.channelId}/疲劳驾驶/一级报警/报警提示音量&${val["EventRuleTriggerList"][0]["EventTriggerList"][0]["Audio"]["volume"]}`
                                    : "";
                            this.formData[
                                "IsApiDriverEyeClosedTriggerList_" +
                                    val.channelId +
                                    ".EventRuleTriggerList.1.EventTriggerList.0.Audio.volume." +
                                    val.channelId
                            ] =
                                val["EventRuleTriggerList"][1][
                                    "EventTriggerList"
                                ][0]["Audio"]["volume"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriverEyeClosedTriggerList"][
                                    "EventRuleTriggerList"
                                ][1]["EventTriggerList"][0]["Audio"]["volume"]
                                    ? `IsApiDriverEyeClosedTriggerList_${val["channelId"]}.EventRuleTriggerList.1.EventTriggerList.0.Audio.volume.${val.channelId}&主动安全设置/DBA/通道${val.channelId}/疲劳驾驶/二级报警/报警提示音量&${val["EventRuleTriggerList"][1]["EventTriggerList"][0]["Audio"]["volume"]}`
                                    : "";
                        } else {
                            this.formData[
                                "IsApiDriverEyeClosedTriggerList_" +
                                    val.channelId +
                                    ".EventRuleTriggerList.0.EventTriggerList.0.Audio.volume." +
                                    val.channelId
                            ] = "";
                            this.formData[
                                "IsApiDriverEyeClosedTriggerList_" +
                                    val.channelId +
                                    ".EventRuleTriggerList.1.EventTriggerList.0.Audio.volume." +
                                    val.channelId
                            ] = "";
                        }
                        console.log(this.formData);
                        this.$emit("changeData", this.formData);
                    });
                }
            },
            deep: true,
            immediate: false,
        },
        //打电话音量变化监听
        "form.IsApiDriverCallingTriggerList": {
            handler(val) {
                if (val != undefined) {
                    console.log(this.copyChannelForm);
                    this.$refs["PublicDba"].validate((valid) => {
                        if (valid) {
                            this.formData[
                                "IsApiDriverCallingTriggerList_" +
                                    val.channelId +
                                    ".EventRuleTriggerList.0.EventTriggerList.0.Audio.volume." +
                                    val.channelId
                            ] =
                                val["EventRuleTriggerList"][0][
                                    "EventTriggerList"
                                ][0]["Audio"]["volume"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriverCallingTriggerList"][
                                    "EventRuleTriggerList"
                                ][0]["EventTriggerList"][0]["Audio"]["volume"]
                                    ? `IsApiDriverCallingTriggerList_${val["channelId"]}.EventRuleTriggerList.0.EventTriggerList.0.Audio.volume.${val.channelId}&主动安全设置/DBA/通道${val.channelId}/打电话/一级报警/报警提示音量&${val["EventRuleTriggerList"][0]["EventTriggerList"][0]["Audio"]["volume"]}`
                                    : "";
                            this.formData[
                                "IsApiDriverCallingTriggerList_" +
                                    val.channelId +
                                    ".EventRuleTriggerList.1.EventTriggerList.0.Audio.volume." +
                                    val.channelId
                            ] =
                                val["EventRuleTriggerList"][1][
                                    "EventTriggerList"
                                ][0]["Audio"]["volume"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriverCallingTriggerList"][
                                    "EventRuleTriggerList"
                                ][1]["EventTriggerList"][0]["Audio"]["volume"]
                                    ? `IsApiDriverCallingTriggerList_${val["channelId"]}.EventRuleTriggerList.1.EventTriggerList.0.Audio.volume.${val.channelId}&主动安全设置/DBA/通道${val.channelId}/打电话/二级报警/报警提示音量&${val["EventRuleTriggerList"][1]["EventTriggerList"][0]["Audio"]["volume"]}`
                                    : "";
                        } else {
                            this.formData[
                                "IsApiDriverCallingTriggerList_" +
                                    val.channelId +
                                    ".EventRuleTriggerList.0.EventTriggerList.0.Audio.volume." +
                                    val.channelId
                            ] = "";
                            this.formData[
                                "IsApiDriverCallingTriggerList_" +
                                    val.channelId +
                                    ".EventRuleTriggerList.1.EventTriggerList.0.Audio.volume." +
                                    val.channelId
                            ] = "";
                        }
                        console.log(this.formData);
                        this.$emit("changeData", this.formData);
                    });
                }
            },
            deep: true,
            immediate: false,
        },
        //抽烟音量变化监听
        "form.IsApiDriverSmokingTriggerList": {
            handler(val) {
                if (val != undefined) {
                    console.log(this.copyChannelForm);
                    this.$refs["PublicDba"].validate((valid) => {
                        if (valid) {
                            this.formData[
                                "IsApiDriverSmokingTriggerList_" +
                                    val.channelId +
                                    ".EventRuleTriggerList.0.EventTriggerList.0.Audio.volume." +
                                    val.channelId
                            ] =
                                val["EventRuleTriggerList"][0][
                                    "EventTriggerList"
                                ][0]["Audio"]["volume"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriverSmokingTriggerList"][
                                    "EventRuleTriggerList"
                                ][0]["EventTriggerList"][0]["Audio"]["volume"]
                                    ? `IsApiDriverSmokingTriggerList_${val["channelId"]}.EventRuleTriggerList.0.EventTriggerList.0.Audio.volume.${val.channelId}&主动安全设置/DBA/通道${val.channelId}/抽烟/一级报警/报警提示音量&${val["EventRuleTriggerList"][0]["EventTriggerList"][0]["Audio"]["volume"]}`
                                    : "";
                            this.formData[
                                "IsApiDriverSmokingTriggerList_" +
                                    val.channelId +
                                    ".EventRuleTriggerList.1.EventTriggerList.0.Audio.volume." +
                                    val.channelId
                            ] =
                                val["EventRuleTriggerList"][1][
                                    "EventTriggerList"
                                ][0]["Audio"]["volume"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriverSmokingTriggerList"][
                                    "EventRuleTriggerList"
                                ][1]["EventTriggerList"][0]["Audio"]["volume"]
                                    ? `IsApiDriverSmokingTriggerList_${val["channelId"]}.EventRuleTriggerList.1.EventTriggerList.0.Audio.volume.${val.channelId}&主动安全设置/DBA/通道${val.channelId}/抽烟/二级报警/报警提示音量&${val["EventRuleTriggerList"][1]["EventTriggerList"][0]["Audio"]["volume"]}`
                                    : "";
                        } else {
                            this.formData[
                                "IsApiDriverSmokingTriggerList_" +
                                    val.channelId +
                                    ".EventRuleTriggerList.0.EventTriggerList.0.Audio.volume." +
                                    val.channelId
                            ] = "";
                            this.formData[
                                "IsApiDriverSmokingTriggerList_" +
                                    val.channelId +
                                    ".EventRuleTriggerList.1.EventTriggerList.0.Audio.volume." +
                                    val.channelId
                            ] = "";
                        }
                        console.log(this.formData);
                        this.$emit("changeData", this.formData);
                    });
                }
            },
            deep: true,
            immediate: false,
        },
        //注意力不集中音量变化监听
        "form.IsApiDriverInattentionTriggerList": {
            handler(val) {
                if (val != undefined) {
                    console.log(this.copyChannelForm);
                    this.$refs["PublicDba"].validate((valid) => {
                        if (valid) {
                            this.formData[
                                "IsApiDriverInattentionTriggerList_" +
                                    val.channelId +
                                    ".EventRuleTriggerList.0.EventTriggerList.0.Audio.volume." +
                                    val.channelId
                            ] =
                                val["EventRuleTriggerList"][0][
                                    "EventTriggerList"
                                ][0]["Audio"]["volume"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriverInattentionTriggerList"][
                                    "EventRuleTriggerList"
                                ][0]["EventTriggerList"][0]["Audio"]["volume"]
                                    ? `IsApiDriverInattentionTriggerList_${val["channelId"]}.EventRuleTriggerList.0.EventTriggerList.0.Audio.volume.${val.channelId}&主动安全设置/DBA/通道${val.channelId}/注意力不集中/一级报警/报警提示音量&${val["EventRuleTriggerList"][0]["EventTriggerList"][0]["Audio"]["volume"]}`
                                    : "";
                            this.formData[
                                "IsApiDriverInattentionTriggerList_" +
                                    val.channelId +
                                    ".EventRuleTriggerList.1.EventTriggerList.0.Audio.volume." +
                                    val.channelId
                            ] =
                                val["EventRuleTriggerList"][1][
                                    "EventTriggerList"
                                ][0]["Audio"]["volume"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriverInattentionTriggerList"][
                                    "EventRuleTriggerList"
                                ][1]["EventTriggerList"][0]["Audio"]["volume"]
                                    ? `IsApiDriverInattentionTriggerList_${val["channelId"]}.EventRuleTriggerList.1.EventTriggerList.0.Audio.volume.${val.channelId}&主动安全设置/DBA/通道${val.channelId}/注意力不集中/二级报警/报警提示音量&${val["EventRuleTriggerList"][1]["EventTriggerList"][0]["Audio"]["volume"]}`
                                    : "";
                        } else {
                            this.formData[
                                "IsApiDriverInattentionTriggerList_" +
                                    val.channelId +
                                    ".EventRuleTriggerList.0.EventTriggerList.0.Audio.volume." +
                                    val.channelId
                            ] = "";
                            this.formData[
                                "IsApiDriverInattentionTriggerList_" +
                                    val.channelId +
                                    ".EventRuleTriggerList.1.EventTriggerList.0.Audio.volume." +
                                    val.channelId
                            ] = "";
                        }
                        console.log(this.formData);
                        this.$emit("changeData", this.formData);
                    });
                }
            },
            deep: true,
            immediate: false,
        },
        //驾驶员离岗音量变化监听
        "form.IsApiDriverAbsentedTriggerList": {
            handler(val) {
                if (val != undefined) {
                    console.log(this.copyChannelForm);
                    this.$refs["PublicDba"].validate((valid) => {
                        if (valid) {
                            this.formData[
                                "IsApiDriverAbsentedTriggerList_" +
                                    val.channelId +
                                    ".EventRuleTriggerList.0.EventTriggerList.0.Audio.volume." +
                                    val.channelId
                            ] =
                                val["EventRuleTriggerList"][0][
                                    "EventTriggerList"
                                ][0]["Audio"]["volume"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriverAbsentedTriggerList"][
                                    "EventRuleTriggerList"
                                ][0]["EventTriggerList"][0]["Audio"]["volume"]
                                    ? `IsApiDriverAbsentedTriggerList_${val["channelId"]}.EventRuleTriggerList.0.EventTriggerList.0.Audio.volume.${val.channelId}&主动安全设置/DBA/通道${val.channelId}/驾驶员离岗/一级报警/报警提示音量&${val["EventRuleTriggerList"][0]["EventTriggerList"][0]["Audio"]["volume"]}`
                                    : "";
                            this.formData[
                                "IsApiDriverAbsentedTriggerList_" +
                                    val.channelId +
                                    ".EventRuleTriggerList.1.EventTriggerList.0.Audio.volume." +
                                    val.channelId
                            ] =
                                val["EventRuleTriggerList"][1][
                                    "EventTriggerList"
                                ][0]["Audio"]["volume"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriverAbsentedTriggerList"][
                                    "EventRuleTriggerList"
                                ][1]["EventTriggerList"][0]["Audio"]["volume"]
                                    ? `IsApiDriverAbsentedTriggerList_${val["channelId"]}.EventRuleTriggerList.1.EventTriggerList.0.Audio.volume.${val.channelId}&主动安全设置/DBA/通道${val.channelId}/驾驶员离岗/二级报警/报警提示音量&${val["EventRuleTriggerList"][1]["EventTriggerList"][0]["Audio"]["volume"]}`
                                    : "";
                        } else {
                            this.formData[
                                "IsApiDriverAbsentedTriggerList_" +
                                    val.channelId +
                                    ".EventRuleTriggerList.0.EventTriggerList.0.Audio.volume." +
                                    val.channelId
                            ] = "";
                            this.formData[
                                "IsApiDriverAbsentedTriggerList_" +
                                    val.channelId +
                                    ".EventRuleTriggerList.1.EventTriggerList.0.Audio.volume." +
                                    val.channelId
                            ] = "";
                        }
                        console.log(this.formData);
                        this.$emit("changeData", this.formData);
                    });
                }
            },
            deep: true,
            immediate: false,
        },
        //摄像头遮挡音量变化监听
        "form.IsApiDriverBlockCameraTriggerList": {
            handler(val) {
                if (val != undefined) {
                    console.log(this.copyChannelForm);
                    this.$refs["PublicDba"].validate((valid) => {
                        if (valid) {
                            this.formData[
                                "IsApiDriverBlockCameraTriggerList_" +
                                    val.channelId +
                                    ".EventRuleTriggerList.0.EventTriggerList.0.Audio.volume." +
                                    val.channelId
                            ] =
                                val["EventRuleTriggerList"][0][
                                    "EventTriggerList"
                                ][0]["Audio"]["volume"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriverBlockCameraTriggerList"][
                                    "EventRuleTriggerList"
                                ][0]["EventTriggerList"][0]["Audio"]["volume"]
                                    ? `IsApiDriverBlockCameraTriggerList_${val["channelId"]}.EventRuleTriggerList.0.EventTriggerList.0.Audio.volume.${val.channelId}&主动安全设置/DBA/通道${val.channelId}/摄像头遮挡/一级报警/报警提示音量&${val["EventRuleTriggerList"][0]["EventTriggerList"][0]["Audio"]["volume"]}`
                                    : "";
                            this.formData[
                                "IsApiDriverBlockCameraTriggerList_" +
                                    val.channelId +
                                    ".EventRuleTriggerList.1.EventTriggerList.0.Audio.volume." +
                                    val.channelId
                            ] =
                                val["EventRuleTriggerList"][1][
                                    "EventTriggerList"
                                ][0]["Audio"]["volume"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriverBlockCameraTriggerList"][
                                    "EventRuleTriggerList"
                                ][1]["EventTriggerList"][0]["Audio"]["volume"]
                                    ? `IsApiDriverBlockCameraTriggerList_${val["channelId"]}.EventRuleTriggerList.1.EventTriggerList.0.Audio.volume.${val.channelId}&主动安全设置/DBA/通道${val.channelId}/摄像头遮挡/二级报警/报警提示音量&${val["EventRuleTriggerList"][1]["EventTriggerList"][0]["Audio"]["volume"]}`
                                    : "";
                        } else {
                            this.formData[
                                "IsApiDriverBlockCameraTriggerList_" +
                                    val.channelId +
                                    ".EventRuleTriggerList.0.EventTriggerList.0.Audio.volume." +
                                    val.channelId
                            ] = "";
                            this.formData[
                                "IsApiDriverBlockCameraTriggerList_" +
                                    val.channelId +
                                    ".EventRuleTriggerList.1.EventTriggerList.0.Audio.volume." +
                                    val.channelId
                            ] = "";
                        }
                        console.log(this.formData);
                        this.$emit("changeData", this.formData);
                    });
                }
            },
            deep: true,
            immediate: false,
        },
        //未系安全带音量变化监听
        "form.IsApiDriverSafetyBeltTriggerList": {
            handler(val) {
                if (val != undefined) {
                    console.log(this.copyChannelForm);
                    this.$refs["PublicDba"].validate((valid) => {
                        if (valid) {
                            this.formData[
                                "IsApiDriverSafetyBeltTriggerList_" +
                                    val.channelId +
                                    ".EventRuleTriggerList.0.EventTriggerList.0.Audio.volume." +
                                    val.channelId
                            ] =
                                val["EventRuleTriggerList"][0][
                                    "EventTriggerList"
                                ][0]["Audio"]["volume"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriverSafetyBeltTriggerList"][
                                    "EventRuleTriggerList"
                                ][0]["EventTriggerList"][0]["Audio"]["volume"]
                                    ? `IsApiDriverSafetyBeltTriggerList_${val["channelId"]}.EventRuleTriggerList.0.EventTriggerList.0.Audio.volume.${val.channelId}&主动安全设置/DBA/通道${val.channelId}/未系安全带/一级报警/报警提示音量&${val["EventRuleTriggerList"][0]["EventTriggerList"][0]["Audio"]["volume"]}`
                                    : "";
                            this.formData[
                                "IsApiDriverSafetyBeltTriggerList_" +
                                    val.channelId +
                                    ".EventRuleTriggerList.1.EventTriggerList.0.Audio.volume." +
                                    val.channelId
                            ] =
                                val["EventRuleTriggerList"][1][
                                    "EventTriggerList"
                                ][0]["Audio"]["volume"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriverSafetyBeltTriggerList"][
                                    "EventRuleTriggerList"
                                ][1]["EventTriggerList"][0]["Audio"]["volume"]
                                    ? `IsApiDriverSafetyBeltTriggerList_${val["channelId"]}.EventRuleTriggerList.1.EventTriggerList.0.Audio.volume.${val.channelId}&主动安全设置/DBA/通道${val.channelId}/未系安全带/二级报警/报警提示音量&${val["EventRuleTriggerList"][1]["EventTriggerList"][0]["Audio"]["volume"]}`
                                    : "";
                        } else {
                            this.formData[
                                "IsApiDriverSafetyBeltTriggerList_" +
                                    val.channelId +
                                    ".EventRuleTriggerList.0.EventTriggerList.0.Audio.volume." +
                                    val.channelId
                            ] = "";
                            this.formData[
                                "IsApiDriverSafetyBeltTriggerList_" +
                                    val.channelId +
                                    ".EventRuleTriggerList.1.EventTriggerList.0.Audio.volume." +
                                    val.channelId
                            ] = "";
                        }
                        console.log(this.formData);
                        this.$emit("changeData", this.formData);
                    });
                }
            },
            deep: true,
            immediate: false,
        },
        //墨镜音量变化监听
        "form.IsApiDriverSunglassesTriggerList": {
            handler(val) {
                if (val != undefined) {
                    console.log(this.copyChannelForm);
                    this.$refs["PublicDba"].validate((valid) => {
                        if (valid) {
                            this.formData[
                                "IsApiDriverSunglassesTriggerList_" +
                                    val.channelId +
                                    ".EventRuleTriggerList.0.EventTriggerList.0.Audio.volume." +
                                    val.channelId
                            ] =
                                val["EventRuleTriggerList"][0][
                                    "EventTriggerList"
                                ][0]["Audio"]["volume"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriverSunglassesTriggerList"][
                                    "EventRuleTriggerList"
                                ][0]["EventTriggerList"][0]["Audio"]["volume"]
                                    ? `IsApiDriverSunglassesTriggerList_${val["channelId"]}.EventRuleTriggerList.0.EventTriggerList.0.Audio.volume.${val.channelId}&主动安全设置/DBA/通道${val.channelId}/墨镜/一级报警/报警提示音量&${val["EventRuleTriggerList"][0]["EventTriggerList"][0]["Audio"]["volume"]}`
                                    : "";
                            this.formData[
                                "IsApiDriverSunglassesTriggerList_" +
                                    val.channelId +
                                    ".EventRuleTriggerList.1.EventTriggerList.0.Audio.volume." +
                                    val.channelId
                            ] =
                                val["EventRuleTriggerList"][1][
                                    "EventTriggerList"
                                ][0]["Audio"]["volume"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriverSunglassesTriggerList"][
                                    "EventRuleTriggerList"
                                ][1]["EventTriggerList"][0]["Audio"]["volume"]
                                    ? `IsApiDriverSunglassesTriggerList_${val["channelId"]}.EventRuleTriggerList.1.EventTriggerList.0.Audio.volume.${val.channelId}&主动安全设置/DBA/通道${val.channelId}/墨镜/二级报警/报警提示音量&${val["EventRuleTriggerList"][1]["EventTriggerList"][0]["Audio"]["volume"]}`
                                    : "";
                        } else {
                            this.formData[
                                "IsApiDriverSunglassesTriggerList_" +
                                    val.channelId +
                                    ".EventRuleTriggerList.0.EventTriggerList.0.Audio.volume." +
                                    val.channelId
                            ] = "";
                            this.formData[
                                "IsApiDriverSunglassesTriggerList_" +
                                    val.channelId +
                                    ".EventRuleTriggerList.1.EventTriggerList.0.Audio.volume." +
                                    val.channelId
                            ] = "";
                        }
                        console.log(this.formData);
                        this.$emit("changeData", this.formData);
                    });
                }
            },
            deep: true,
            immediate: false,
        },
        //急加速音量变化监听
        "form.IsApiRapidAccelerationTriggerList": {
            handler(val) {
                if (val != undefined) {
                    console.log(this.copyChannelForm);
                    this.$refs["PublicDba"].validate((valid) => {
                        if (valid) {
                            this.formData[
                                "IsApiRapidAccelerationTriggerList_" +
                                    val.channelId +
                                    ".EventRuleTriggerList.0.EventTriggerList.0.Audio.volume." +
                                    val.channelId
                            ] =
                                val["EventRuleTriggerList"][0][
                                    "EventTriggerList"
                                ][0]["Audio"]["volume"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiRapidAccelerationTriggerList"][
                                    "EventRuleTriggerList"
                                ][0]["EventTriggerList"][0]["Audio"]["volume"]
                                    ? `IsApiRapidAccelerationTriggerList_${val["channelId"]}.EventRuleTriggerList.0.EventTriggerList.0.Audio.volume.${val.channelId}&主动安全设置/DBA/通道${val.channelId}/急加速/一级报警/报警提示音量&${val["EventRuleTriggerList"][0]["EventTriggerList"][0]["Audio"]["volume"]}`
                                    : "";
                            this.formData[
                                "IsApiRapidAccelerationTriggerList_" +
                                    val.channelId +
                                    ".EventRuleTriggerList.1.EventTriggerList.0.Audio.volume." +
                                    val.channelId
                            ] =
                                val["EventRuleTriggerList"][1][
                                    "EventTriggerList"
                                ][0]["Audio"]["volume"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiRapidAccelerationTriggerList"][
                                    "EventRuleTriggerList"
                                ][1]["EventTriggerList"][0]["Audio"]["volume"]
                                    ? `IsApiRapidAccelerationTriggerList_${val["channelId"]}.EventRuleTriggerList.1.EventTriggerList.0.Audio.volume.${val.channelId}&主动安全设置/DBA/通道${val.channelId}/急加速/二级报警/报警提示音量&${val["EventRuleTriggerList"][1]["EventTriggerList"][0]["Audio"]["volume"]}`
                                    : "";
                        } else {
                            this.formData[
                                "IsApiRapidAccelerationTriggerList_" +
                                    val.channelId +
                                    ".EventRuleTriggerList.0.EventTriggerList.0.Audio.volume." +
                                    val.channelId
                            ] = "";
                            this.formData[
                                "IsApiRapidAccelerationTriggerList_" +
                                    val.channelId +
                                    ".EventRuleTriggerList.1.EventTriggerList.0.Audio.volume." +
                                    val.channelId
                            ] = "";
                        }
                        console.log(this.formData);
                        this.$emit("changeData", this.formData);
                    });
                }
            },
            deep: true,
            immediate: false,
        },
        //急减速音量变化监听
        "form.IsApiRapidDecelerationTriggerList": {
            handler(val) {
                if (val != undefined) {
                    console.log(this.copyChannelForm);
                    this.$refs["PublicDba"].validate((valid) => {
                        if (valid) {
                            this.formData[
                                "IsApiRapidDecelerationTriggerList_" +
                                    val.channelId +
                                    ".EventRuleTriggerList.0.EventTriggerList.0.Audio.volume." +
                                    val.channelId
                            ] =
                                val["EventRuleTriggerList"][0][
                                    "EventTriggerList"
                                ][0]["Audio"]["volume"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiRapidDecelerationTriggerList"][
                                    "EventRuleTriggerList"
                                ][0]["EventTriggerList"][0]["Audio"]["volume"]
                                    ? `IsApiRapidDecelerationTriggerList_${val["channelId"]}.EventRuleTriggerList.0.EventTriggerList.0.Audio.volume.${val.channelId}&主动安全设置/DBA/通道${val.channelId}/急减速/一级报警/报警提示音量&${val["EventRuleTriggerList"][0]["EventTriggerList"][0]["Audio"]["volume"]}`
                                    : "";
                            this.formData[
                                "IsApiRapidDecelerationTriggerList_" +
                                    val.channelId +
                                    ".EventRuleTriggerList.1.EventTriggerList.0.Audio.volume." +
                                    val.channelId
                            ] =
                                val["EventRuleTriggerList"][1][
                                    "EventTriggerList"
                                ][0]["Audio"]["volume"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiRapidDecelerationTriggerList"][
                                    "EventRuleTriggerList"
                                ][1]["EventTriggerList"][0]["Audio"]["volume"]
                                    ? `IsApiRapidDecelerationTriggerList_${val["channelId"]}.EventRuleTriggerList.1.EventTriggerList.0.Audio.volume.${val.channelId}&主动安全设置/DBA/通道${val.channelId}/急减速/二级报警/报警提示音量&${val["EventRuleTriggerList"][1]["EventTriggerList"][0]["Audio"]["volume"]}`
                                    : "";
                        } else {
                            this.formData[
                                "IsApiRapidDecelerationTriggerList_" +
                                    val.channelId +
                                    ".EventRuleTriggerList.0.EventTriggerList.0.Audio.volume." +
                                    val.channelId
                            ] = "";
                            this.formData[
                                "IsApiRapidDecelerationTriggerList_" +
                                    val.channelId +
                                    ".EventRuleTriggerList.1.EventTriggerList.0.Audio.volume." +
                                    val.channelId
                            ] = "";
                        }
                        console.log(this.formData);
                        this.$emit("changeData", this.formData);
                    });
                }
            },
            deep: true,
            immediate: false,
        },
        //急转弯音量变化监听
        "form.IsApiRapidTurnTriggerList": {
            handler(val) {
                if (val != undefined) {
                    console.log(this.copyChannelForm);
                    this.$refs["PublicDba"].validate((valid) => {
                        if (valid) {
                            this.formData[
                                "IsApiRapidTurnTriggerList_" +
                                    val.channelId +
                                    ".EventRuleTriggerList.0.EventTriggerList.0.Audio.volume." +
                                    val.channelId
                            ] =
                                val["EventRuleTriggerList"][0][
                                    "EventTriggerList"
                                ][0]["Audio"]["volume"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiRapidTurnTriggerList"][
                                    "EventRuleTriggerList"
                                ][0]["EventTriggerList"][0]["Audio"]["volume"]
                                    ? `IsApiRapidTurnTriggerList_${val["channelId"]}.EventRuleTriggerList.0.EventTriggerList.0.Audio.volume.${val.channelId}&主动安全设置/DBA/通道${val.channelId}/急转弯/一级报警/报警提示音量&${val["EventRuleTriggerList"][0]["EventTriggerList"][0]["Audio"]["volume"]}`
                                    : "";
                            this.formData[
                                "IsApiRapidTurnTriggerList_" +
                                    val.channelId +
                                    ".EventRuleTriggerList.1.EventTriggerList.0.Audio.volume." +
                                    val.channelId
                            ] =
                                val["EventRuleTriggerList"][1][
                                    "EventTriggerList"
                                ][0]["Audio"]["volume"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiRapidTurnTriggerList"][
                                    "EventRuleTriggerList"
                                ][1]["EventTriggerList"][0]["Audio"]["volume"]
                                    ? `IsApiRapidTurnTriggerList_${val["channelId"]}.EventRuleTriggerList.1.EventTriggerList.0.Audio.volume.${val.channelId}&主动安全设置/DBA/通道${val.channelId}/急转弯/二级报警/报警提示音量&${val["EventRuleTriggerList"][1]["EventTriggerList"][0]["Audio"]["volume"]}`
                                    : "";
                        } else {
                            this.formData[
                                "IsApiRapidTurnTriggerList_" +
                                    val.channelId +
                                    ".EventRuleTriggerList.0.EventTriggerList.0.Audio.volume." +
                                    val.channelId
                            ] = "";
                            this.formData[
                                "IsApiRapidTurnTriggerList_" +
                                    val.channelId +
                                    ".EventRuleTriggerList.1.EventTriggerList.0.Audio.volume." +
                                    val.channelId
                            ] = "";
                        }
                        console.log(this.formData);
                        this.$emit("changeData", this.formData);
                    });
                }
            },
            deep: true,
            immediate: false,
        },
        //驾驶员异常音量变化监听
        "form.IsApiDriverAbnormaTriggerList": {
            handler(val) {
                if (val != undefined) {
                    console.log(this.copyChannelForm);
                    this.$refs["PublicDba"].validate((valid) => {
                        if (valid) {
                            this.formData[
                                "IsApiDriverAbnormaTriggerList_" +
                                    val.channelId +
                                    ".EventRuleTriggerList.0.EventTriggerList.0.Audio.volume." +
                                    val.channelId
                            ] =
                                val["EventRuleTriggerList"][0][
                                    "EventTriggerList"
                                ][0]["Audio"]["volume"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriverAbnormaTriggerList"][
                                    "EventRuleTriggerList"
                                ][0]["EventTriggerList"][0]["Audio"]["volume"]
                                    ? `IsApiDriverAbnormaTriggerList_${val["channelId"]}.EventRuleTriggerList.0.EventTriggerList.0.Audio.volume.${val.channelId}&主动安全设置/DBA/通道${val.channelId}/驾驶员异常/一级报警/报警提示音量&${val["EventRuleTriggerList"][0]["EventTriggerList"][0]["Audio"]["volume"]}`
                                    : "";
                            this.formData[
                                "IsApiDriverAbnormaTriggerList_" +
                                    val.channelId +
                                    ".EventRuleTriggerList.1.EventTriggerList.0.Audio.volume." +
                                    val.channelId
                            ] =
                                val["EventRuleTriggerList"][1][
                                    "EventTriggerList"
                                ][0]["Audio"]["volume"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriverAbnormaTriggerList"][
                                    "EventRuleTriggerList"
                                ][1]["EventTriggerList"][0]["Audio"]["volume"]
                                    ? `IsApiDriverAbnormaTriggerList_${val["channelId"]}.EventRuleTriggerList.1.EventTriggerList.0.Audio.volume.${val.channelId}&主动安全设置/DBA/通道${val.channelId}/驾驶员异常/二级报警/报警提示音量&${val["EventRuleTriggerList"][1]["EventTriggerList"][0]["Audio"]["volume"]}`
                                    : "";
                        } else {
                            this.formData[
                                "IsApiDriverAbnormaTriggerList_" +
                                    val.channelId +
                                    ".EventRuleTriggerList.0.EventTriggerList.0.Audio.volume." +
                                    val.channelId
                            ] = "";
                            this.formData[
                                "IsApiDriverAbnormaTriggerList_" +
                                    val.channelId +
                                    ".EventRuleTriggerList.1.EventTriggerList.0.Audio.volume." +
                                    val.channelId
                            ] = "";
                        }
                        console.log(this.formData);
                        this.$emit("changeData", this.formData);
                    });
                }
            },
            deep: true,
            immediate: false,
        },
        //超时驾驶音量变化监听
        "form.IsApiDriveTimeTriggerList": {
            handler(val) {
                if (val != undefined) {
                    console.log(this.copyChannelForm);
                    this.$refs["PublicDba"].validate((valid) => {
                        if (valid) {
                            this.formData[
                                "IsApiDriveTimeTriggerList_" +
                                    val.channelId +
                                    ".EventRuleTriggerList.0.EventTriggerList.0.Audio.volume." +
                                    val.channelId
                            ] =
                                val["EventRuleTriggerList"][0][
                                    "EventTriggerList"
                                ][0]["Audio"]["volume"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriveTimeTriggerList"][
                                    "EventRuleTriggerList"
                                ][0]["EventTriggerList"][0]["Audio"]["volume"]
                                    ? `IsApiDriveTimeTriggerList_${val["channelId"]}.EventRuleTriggerList.0.EventTriggerList.0.Audio.volume.${val.channelId}&主动安全设置/DBA/通道${val.channelId}/超时驾驶/一级报警/报警提示音量&${val["EventRuleTriggerList"][0]["EventTriggerList"][0]["Audio"]["volume"]}`
                                    : "";
                            this.formData[
                                "IsApiDriveTimeTriggerList_" +
                                    val.channelId +
                                    ".EventRuleTriggerList.1.EventTriggerList.0.Audio.volume." +
                                    val.channelId
                            ] =
                                val["EventRuleTriggerList"][1][
                                    "EventTriggerList"
                                ][0]["Audio"]["volume"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriveTimeTriggerList"][
                                    "EventRuleTriggerList"
                                ][1]["EventTriggerList"][0]["Audio"]["volume"]
                                    ? `IsApiDriveTimeTriggerList_${val["channelId"]}.EventRuleTriggerList.1.EventTriggerList.0.Audio.volume.${val.channelId}&主动安全设置/DBA/通道${val.channelId}/超时驾驶/二级报警/报警提示音量&${val["EventRuleTriggerList"][1]["EventTriggerList"][0]["Audio"]["volume"]}`
                                    : "";
                        } else {
                            this.formData[
                                "IsApiDriveTimeTriggerList_" +
                                    val.channelId +
                                    ".EventRuleTriggerList.0.EventTriggerList.0.Audio.volume." +
                                    val.channelId
                            ] = "";
                            this.formData[
                                "IsApiDriveTimeTriggerList_" +
                                    val.channelId +
                                    ".EventRuleTriggerList.1.EventTriggerList.0.Audio.volume." +
                                    val.channelId
                            ] = "";
                        }
                        console.log(this.formData);
                        this.$emit("changeData", this.formData);
                    });
                }
            },
            deep: true,
            immediate: false,
        },
        //换人事件音量变化监听
        "form.IsApiDriveChangeTriggerList": {
            handler(val) {
                if (val != undefined) {
                    console.log(this.copyChannelForm);
                    this.$refs["PublicDba"].validate((valid) => {
                        if (valid) {
                            this.formData[
                                "IsApiDriveChangeTriggerList_" +
                                    val.channelId +
                                    ".EventRuleTriggerList.0.EventTriggerList.0.Audio.volume." +
                                    val.channelId
                            ] =
                                val["EventRuleTriggerList"][0][
                                    "EventTriggerList"
                                ][0]["Audio"]["volume"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriveChangeTriggerList"][
                                    "EventRuleTriggerList"
                                ][0]["EventTriggerList"][0]["Audio"]["volume"]
                                    ? `IsApiDriveChangeTriggerList_${val["channelId"]}.EventRuleTriggerList.0.EventTriggerList.0.Audio.volume.${val.channelId}&主动安全设置/DBA/通道${val.channelId}/换人事件/一级报警/报警提示音量&${val["EventRuleTriggerList"][0]["EventTriggerList"][0]["Audio"]["volume"]}`
                                    : "";
                            this.formData[
                                "IsApiDriveChangeTriggerList_" +
                                    val.channelId +
                                    ".EventRuleTriggerList.1.EventTriggerList.0.Audio.volume." +
                                    val.channelId
                            ] =
                                val["EventRuleTriggerList"][1][
                                    "EventTriggerList"
                                ][0]["Audio"]["volume"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriveChangeTriggerList"][
                                    "EventRuleTriggerList"
                                ][1]["EventTriggerList"][0]["Audio"]["volume"]
                                    ? `IsApiDriveChangeTriggerList_${val["channelId"]}.EventRuleTriggerList.1.EventTriggerList.0.Audio.volume.${val.channelId}&主动安全设置/DBA/通道${val.channelId}/换人事件/二级报警/报警提示音量&${val["EventRuleTriggerList"][1]["EventTriggerList"][0]["Audio"]["volume"]}`
                                    : "";
                        } else {
                            this.formData[
                                "IsApiDriveChangeTriggerList_" +
                                    val.channelId +
                                    ".EventRuleTriggerList.0.EventTriggerList.0.Audio.volume." +
                                    val.channelId
                            ] = "";
                            this.formData[
                                "IsApiDriveChangeTriggerList_" +
                                    val.channelId +
                                    ".EventRuleTriggerList.1.EventTriggerList.0.Audio.volume." +
                                    val.channelId
                            ] = "";
                        }
                        console.log(this.formData);
                        this.$emit("changeData", this.formData);
                    });
                }
            },
            deep: true,
            immediate: false,
        },
        //疲劳驾驶变化监听
        "form.IsApiDriverEyeClosedInfo": {
            handler(val) {
                if (val != undefined) {
                    console.log(this.copyChannelForm);
                    this.$refs["PublicDba"].validate((valid) => {
                        if (valid) {
                            this.formData[
                                "IsApiDriverEyeClosedInfo_" +
                                    val.channelId +
                                    ".dbaList.0.enabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][0]["enabled"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriverEyeClosedInfo"]["dbaList"][0][
                                    "enabled"
                                ]
                                    ? `IsApiDriverEyeClosedInfo_${
                                          val["channelId"]
                                      }.dbaList.0.enabled.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/DBA/通道${
                                          val.channelId
                                      }/疲劳驾驶/一级报警/疲劳驾驶报警使能&${
                                          val["dbaList"][0]["enabled"]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiDriverEyeClosedInfo_" +
                                    val.channelId +
                                    ".dbaList.0.uploadVideoEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][0]["uploadVideoEnabled"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriverEyeClosedInfo"]["dbaList"][0][
                                    "uploadVideoEnabled"
                                ]
                                    ? `IsApiDriverEyeClosedInfo_${
                                          val["channelId"]
                                      }.dbaList.0.uploadVideoEnabled.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/DBA/通道${
                                          val.channelId
                                      }/疲劳驾驶/一级报警/报警视频上传使能&${
                                          val["dbaList"][0][
                                              "uploadVideoEnabled"
                                          ]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiDriverEyeClosedInfo_" +
                                    val.channelId +
                                    ".dbaList.0.uploadPicEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][0]["uploadPicEnabled"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriverEyeClosedInfo"]["dbaList"][0][
                                    "uploadPicEnabled"
                                ]
                                    ? `IsApiDriverEyeClosedInfo_${
                                          val["channelId"]
                                      }.dbaList.0.uploadPicEnabled.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/DBA/通道${
                                          val.channelId
                                      }/疲劳驾驶/一级报警/报警图片上传使能&${
                                          val["dbaList"][0]["uploadPicEnabled"]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiDriverEyeClosedInfo_" +
                                    val.channelId +
                                    ".dbaList.0.limitSpeed." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][0]["limitSpeed"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriverEyeClosedInfo"]["dbaList"][0][
                                    "limitSpeed"
                                ]
                                    ? `IsApiDriverEyeClosedInfo_${val["channelId"]}.dbaList.0.limitSpeed.${val.channelId}.channel.useless&主动安全设置/DBA/通道${val.channelId}/疲劳驾驶/一级报警/报警判断速度阈值&${val["dbaList"][0]["limitSpeed"]}`
                                    : "";
                            this.formData[
                                "IsApiDriverEyeClosedInfo_" +
                                    val.channelId +
                                    ".dbaList.0.sensitivity." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][0]["sensitivity"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriverEyeClosedInfo"]["dbaList"][0][
                                    "sensitivity"
                                ]
                                    ? `IsApiDriverEyeClosedInfo_${val["channelId"]}.dbaList.0.sensitivity.${val.channelId}.channel.useless&主动安全设置/DBA/通道${val.channelId}/疲劳驾驶/一级报警/灵敏度&${val["dbaList"][0]["sensitivity"]}`
                                    : "";
                            this.formData[
                                "IsApiDriverEyeClosedInfo_" +
                                    val.channelId +
                                    ".dbaList.1.enabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][1]["enabled"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriverEyeClosedInfo"]["dbaList"][1][
                                    "enabled"
                                ]
                                    ? `IsApiDriverEyeClosedInfo_${
                                          val["channelId"]
                                      }.dbaList.1.enabled.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/DBA/通道${
                                          val.channelId
                                      }/疲劳驾驶/二级报警/疲劳驾驶报警使能&${
                                          val["dbaList"][1]["enabled"]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiDriverEyeClosedInfo_" +
                                    val.channelId +
                                    ".dbaList.1.uploadVideoEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][1]["uploadVideoEnabled"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriverEyeClosedInfo"]["dbaList"][1][
                                    "uploadVideoEnabled"
                                ]
                                    ? `IsApiDriverEyeClosedInfo_${
                                          val["channelId"]
                                      }.dbaList.1.uploadVideoEnabled.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/DBA/通道${
                                          val.channelId
                                      }/疲劳驾驶/二级报警/报警视频上传使能&${
                                          val["dbaList"][1][
                                              "uploadVideoEnabled"
                                          ]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiDriverEyeClosedInfo_" +
                                    val.channelId +
                                    ".dbaList.1.uploadPicEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][1]["uploadPicEnabled"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriverEyeClosedInfo"]["dbaList"][1][
                                    "uploadPicEnabled"
                                ]
                                    ? `IsApiDriverEyeClosedInfo_${
                                          val["channelId"]
                                      }.dbaList.1.uploadPicEnabled.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/DBA/通道${
                                          val.channelId
                                      }/疲劳驾驶/二级报警/报警图片上传使能&${
                                          val["dbaList"][1]["uploadPicEnabled"]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiDriverEyeClosedInfo_" +
                                    val.channelId +
                                    ".dbaList.1.limitSpeed." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][1]["limitSpeed"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriverEyeClosedInfo"]["dbaList"][1][
                                    "limitSpeed"
                                ]
                                    ? `IsApiDriverEyeClosedInfo_${val["channelId"]}.dbaList.1.limitSpeed.${val.channelId}.channel.useless&主动安全设置/DBA/通道${val.channelId}/疲劳驾驶/二级报警/报警判断速度阈值&${val["dbaList"][1]["limitSpeed"]}`
                                    : "";
                            this.formData[
                                "IsApiDriverEyeClosedInfo_" +
                                    val.channelId +
                                    ".dbaList.1.sensitivity." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][1]["sensitivity"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriverEyeClosedInfo"]["dbaList"][1][
                                    "sensitivity"
                                ]
                                    ? `IsApiDriverEyeClosedInfo_${val["channelId"]}.dbaList.1.sensitivity.${val.channelId}.channel.useless&主动安全设置/DBA/通道${val.channelId}/疲劳驾驶/二级报警/灵敏度&${val["dbaList"][1]["sensitivity"]}`
                                    : "";
                        } else {
                            this.formData[
                                "IsApiDriverEyeClosedInfo_" +
                                    val.channelId +
                                    ".dbaList.0.enabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiDriverEyeClosedInfo_" +
                                    val.channelId +
                                    ".dbaList.0.uploadVideoEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiDriverEyeClosedInfo_" +
                                    val.channelId +
                                    ".dbaList.0.uploadPicEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiDriverEyeClosedInfo_" +
                                    val.channelId +
                                    ".dbaList.0.limitSpeed." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiDriverEyeClosedInfo_" +
                                    val.channelId +
                                    ".dbaList.0.sensitivity." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiDriverEyeClosedInfo_" +
                                    val.channelId +
                                    ".dbaList.1.enabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiDriverEyeClosedInfo_" +
                                    val.channelId +
                                    ".dbaList.1.uploadVideoEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiDriverEyeClosedInfo_" +
                                    val.channelId +
                                    ".dbaList.1.uploadPicEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiDriverEyeClosedInfo_" +
                                    val.channelId +
                                    ".dbaList.1.limitSpeed." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiDriverEyeClosedInfo_" +
                                    val.channelId +
                                    ".dbaList.1.sensitivity." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                        }
                        this.$emit("changeData", this.formData);
                    });
                }
            },
            deep: true,
            immediate: false,
        },
        //打电话变化监听
        "form.IsApiDriverCallingInfo": {
            handler(val) {
                if (val != undefined) {
                    console.log(this.copyChannelForm);
                    this.$refs["PublicDba"].validate((valid) => {
                        if (valid) {
                            this.formData[
                                "IsApiDriverCallingInfo_" +
                                    val.channelId +
                                    ".dbaList.0.enabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][0]["enabled"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriverCallingInfo"]["dbaList"][0][
                                    "enabled"
                                ]
                                    ? `IsApiDriverCallingInfo_${
                                          val["channelId"]
                                      }.dbaList.0.enabled.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/DBA/通道${
                                          val.channelId
                                      }/打电话/一级报警/打电话报警使能&${
                                          val["dbaList"][0]["enabled"]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiDriverCallingInfo_" +
                                    val.channelId +
                                    ".dbaList.0.uploadVideoEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][0]["uploadVideoEnabled"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriverCallingInfo"]["dbaList"][0][
                                    "uploadVideoEnabled"
                                ]
                                    ? `IsApiDriverCallingInfo_${
                                          val["channelId"]
                                      }.dbaList.0.uploadVideoEnabled.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/DBA/通道${
                                          val.channelId
                                      }/打电话/一级报警/报警视频上传使能&${
                                          val["dbaList"][0][
                                              "uploadVideoEnabled"
                                          ]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiDriverCallingInfo_" +
                                    val.channelId +
                                    ".dbaList.0.uploadPicEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][0]["uploadPicEnabled"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriverCallingInfo"]["dbaList"][0][
                                    "uploadPicEnabled"
                                ]
                                    ? `IsApiDriverCallingInfo_${
                                          val["channelId"]
                                      }.dbaList.0.uploadPicEnabled.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/DBA/通道${
                                          val.channelId
                                      }/打电话/一级报警/报警图片上传使能&${
                                          val["dbaList"][0]["uploadPicEnabled"]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiDriverCallingInfo_" +
                                    val.channelId +
                                    ".dbaList.0.limitSpeed." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][0]["limitSpeed"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriverCallingInfo"]["dbaList"][0][
                                    "limitSpeed"
                                ]
                                    ? `IsApiDriverCallingInfo_${val["channelId"]}.dbaList.0.limitSpeed.${val.channelId}.channel.useless&主动安全设置/DBA/通道${val.channelId}/打电话/一级报警/报警判断速度阈值&${val["dbaList"][0]["limitSpeed"]}`
                                    : "";
                            this.formData[
                                "IsApiDriverCallingInfo_" +
                                    val.channelId +
                                    ".dbaList.0.sensitivity." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][0]["sensitivity"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriverCallingInfo"]["dbaList"][0][
                                    "sensitivity"
                                ]
                                    ? `IsApiDriverCallingInfo_${val["channelId"]}.dbaList.0.sensitivity.${val.channelId}.channel.useless&主动安全设置/DBA/通道${val.channelId}/打电话/一级报警/灵敏度&${val["dbaList"][0]["sensitivity"]}`
                                    : "";
                            this.formData[
                                "IsApiDriverCallingInfo_" +
                                    val.channelId +
                                    ".dbaList.1.enabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][1]["enabled"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriverCallingInfo"]["dbaList"][1][
                                    "enabled"
                                ]
                                    ? `IsApiDriverCallingInfo_${
                                          val["channelId"]
                                      }.dbaList.1.enabled.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/DBA/通道${
                                          val.channelId
                                      }/打电话/二级报警/打电话报警使能&${
                                          val["dbaList"][1]["enabled"]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiDriverCallingInfo_" +
                                    val.channelId +
                                    ".dbaList.1.uploadVideoEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][1]["uploadVideoEnabled"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriverCallingInfo"]["dbaList"][1][
                                    "uploadVideoEnabled"
                                ]
                                    ? `IsApiDriverCallingInfo_${
                                          val["channelId"]
                                      }.dbaList.1.uploadVideoEnabled.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/DBA/通道${
                                          val.channelId
                                      }/打电话/二级报警/报警视频上传使能&${
                                          val["dbaList"][1][
                                              "uploadVideoEnabled"
                                          ]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiDriverCallingInfo_" +
                                    val.channelId +
                                    ".dbaList.1.uploadPicEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][1]["uploadPicEnabled"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriverCallingInfo"]["dbaList"][1][
                                    "uploadPicEnabled"
                                ]
                                    ? `IsApiDriverCallingInfo_${
                                          val["channelId"]
                                      }.dbaList.01.uploadPicEnabled.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/DBA/通道${
                                          val.channelId
                                      }/打电话/二级报警/报警图片上传使能&${
                                          val["dbaList"][1]["uploadPicEnabled"]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiDriverCallingInfo_" +
                                    val.channelId +
                                    ".dbaList.1.limitSpeed." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][1]["limitSpeed"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriverCallingInfo"]["dbaList"][1][
                                    "limitSpeed"
                                ]
                                    ? `IsApiDriverCallingInfo_${val["channelId"]}.dbaList.1.limitSpeed.${val.channelId}.channel.useless&主动安全设置/DBA/通道${val.channelId}/打电话/二级报警/报警判断速度阈值&${val["dbaList"][1]["limitSpeed"]}`
                                    : "";
                            this.formData[
                                "IsApiDriverCallingInfo_" +
                                    val.channelId +
                                    ".dbaList.1.sensitivity." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][1]["sensitivity"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriverCallingInfo"]["dbaList"][1][
                                    "sensitivity"
                                ]
                                    ? `IsApiDriverCallingInfo_${val["channelId"]}.dbaList.1.sensitivity.${val.channelId}.channel.useless&主动安全设置/DBA/通道${val.channelId}/打电话/二级报警/灵敏度&${val["dbaList"][1]["sensitivity"]}`
                                    : "";
                        } else {
                            this.formData[
                                "IsApiDriverCallingInfo_" +
                                    val.channelId +
                                    ".dbaList.0.enabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiDriverCallingInfo_" +
                                    val.channelId +
                                    ".dbaList.0.uploadVideoEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiDriverCallingInfo_" +
                                    val.channelId +
                                    ".dbaList.0.uploadPicEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiDriverCallingInfo_" +
                                    val.channelId +
                                    ".dbaList.0.limitSpeed." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiDriverCallingInfo_" +
                                    val.channelId +
                                    ".dbaList.0.sensitivity." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiDriverCallingInfo_" +
                                    val.channelId +
                                    ".dbaList.1.enabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiDriverCallingInfo_" +
                                    val.channelId +
                                    ".dbaList.1.uploadVideoEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiDriverCallingInfo_" +
                                    val.channelId +
                                    ".dbaList.1.uploadPicEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiDriverCallingInfo_" +
                                    val.channelId +
                                    ".dbaList.1.limitSpeed." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiDriverCallingInfo_" +
                                    val.channelId +
                                    ".dbaList.1.sensitivity." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                        }
                        this.$emit("changeData", this.formData);
                    });
                }
            },
            deep: true,
            immediate: false,
        },
        //抽烟变化监听
        "form.IsApiDriverSmokingInfo": {
            handler(val) {
                if (val != undefined) {
                    console.log(this.copyChannelForm);
                    this.$refs["PublicDba"].validate((valid) => {
                        if (valid) {
                            this.formData[
                                "IsApiDriverSmokingInfo_" +
                                    val.channelId +
                                    ".dbaList.0.enabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][0]["enabled"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriverSmokingInfo"]["dbaList"][0][
                                    "enabled"
                                ]
                                    ? `IsApiDriverSmokingInfo_${
                                          val["channelId"]
                                      }.dbaList.0.enabled.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/DBA/通道${
                                          val.channelId
                                      }/抽烟/一级报警/抽烟报警使能&${
                                          val["dbaList"][0]["enabled"]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiDriverSmokingInfo_" +
                                    val.channelId +
                                    ".dbaList.0.uploadVideoEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][0]["uploadVideoEnabled"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriverSmokingInfo"]["dbaList"][0][
                                    "uploadVideoEnabled"
                                ]
                                    ? `IsApiDriverSmokingInfo_${
                                          val["channelId"]
                                      }.dbaList.0.uploadVideoEnabled.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/DBA/通道${
                                          val.channelId
                                      }/抽烟/一级报警/报警视频上传使能&${
                                          val["dbaList"][0][
                                              "uploadVideoEnabled"
                                          ]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiDriverSmokingInfo_" +
                                    val.channelId +
                                    ".dbaList.0.uploadPicEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][0]["uploadPicEnabled"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriverSmokingInfo"]["dbaList"][0][
                                    "uploadPicEnabled"
                                ]
                                    ? `IsApiDriverSmokingInfo_${
                                          val["channelId"]
                                      }.dbaList.0.uploadPicEnabled.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/DBA/通道${
                                          val.channelId
                                      }/抽烟/一级报警/报警图片上传使能&${
                                          val["dbaList"][0]["uploadPicEnabled"]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiDriverSmokingInfo_" +
                                    val.channelId +
                                    ".dbaList.0.limitSpeed." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][0]["limitSpeed"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriverSmokingInfo"]["dbaList"][0][
                                    "limitSpeed"
                                ]
                                    ? `IsApiDriverSmokingInfo_${val["channelId"]}.dbaList.0.limitSpeed.${val.channelId}.channel.useless&主动安全设置/DBA/通道${val.channelId}/抽烟/一级报警/报警判断速度阈值&${val["dbaList"][0]["limitSpeed"]}`
                                    : "";
                            this.formData[
                                "IsApiDriverSmokingInfo_" +
                                    val.channelId +
                                    ".dbaList.0.sensitivity." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][0]["sensitivity"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriverSmokingInfo"]["dbaList"][0][
                                    "sensitivity"
                                ]
                                    ? `IsApiDriverSmokingInfo_${val["channelId"]}.dbaList.0.sensitivity.${val.channelId}.channel.useless&主动安全设置/DBA/通道${val.channelId}/抽烟/一级报警/灵敏度&${val["dbaList"][0]["sensitivity"]}`
                                    : "";
                            this.formData[
                                "IsApiDriverSmokingInfo_" +
                                    val.channelId +
                                    ".dbaList.1.enabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][1]["enabled"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriverSmokingInfo"]["dbaList"][1][
                                    "enabled"
                                ]
                                    ? `IsApiDriverSmokingInfo_${
                                          val["channelId"]
                                      }.dbaList.1.enabled.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/DBA/通道${
                                          val.channelId
                                      }/抽烟/二级报警/抽烟报警使能&${
                                          val["dbaList"][1]["enabled"]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiDriverSmokingInfo_" +
                                    val.channelId +
                                    ".dbaList.1.uploadVideoEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][1]["uploadVideoEnabled"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriverSmokingInfo"]["dbaList"][1][
                                    "uploadVideoEnabled"
                                ]
                                    ? `IsApiDriverSmokingInfo_${
                                          val["channelId"]
                                      }.dbaList.1.uploadVideoEnabled.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/DBA/通道${
                                          val.channelId
                                      }/抽烟/二级报警/报警视频上传使能&${
                                          val["dbaList"][1][
                                              "uploadVideoEnabled"
                                          ]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiDriverSmokingInfo_" +
                                    val.channelId +
                                    ".dbaList.1.uploadPicEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][1]["uploadPicEnabled"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriverSmokingInfo"]["dbaList"][1][
                                    "uploadPicEnabled"
                                ]
                                    ? `IsApiDriverSmokingInfo_${
                                          val["channelId"]
                                      }.dbaList.1.uploadPicEnabled.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/DBA/通道${
                                          val.channelId
                                      }/抽烟/二级报警/报警图片上传使能&${
                                          val["dbaList"][1]["uploadPicEnabled"]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiDriverSmokingInfo_" +
                                    val.channelId +
                                    ".dbaList.1.limitSpeed." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][1]["limitSpeed"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriverSmokingInfo"]["dbaList"][1][
                                    "limitSpeed"
                                ]
                                    ? `IsApiDriverSmokingInfo_${val["channelId"]}.dbaList.1.limitSpeed.${val.channelId}.channel.useless&主动安全设置/DBA/通道${val.channelId}/抽烟/二级报警/报警判断速度阈值&${val["dbaList"][1]["limitSpeed"]}`
                                    : "";
                            this.formData[
                                "IsApiDriverSmokingInfo_" +
                                    val.channelId +
                                    ".dbaList.1.sensitivity." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][1]["sensitivity"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriverSmokingInfo"]["dbaList"][1][
                                    "sensitivity"
                                ]
                                    ? `IsApiDriverSmokingInfo_${val["channelId"]}.dbaList.1.sensitivity.${val.channelId}.channel.useless&主动安全设置/DBA/通道${val.channelId}/抽烟/二级报警/灵敏度&${val["dbaList"][1]["sensitivity"]}`
                                    : "";
                        } else {
                            this.formData[
                                "IsApiDriverSmokingInfo_" +
                                    val.channelId +
                                    ".dbaList.0.enabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiDriverSmokingInfo_" +
                                    val.channelId +
                                    ".dbaList.0.uploadVideoEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiDriverSmokingInfo_" +
                                    val.channelId +
                                    ".dbaList.0.uploadPicEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiDriverSmokingInfo_" +
                                    val.channelId +
                                    ".dbaList.0.limitSpeed." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiDriverSmokingInfo_" +
                                    val.channelId +
                                    ".dbaList.0.sensitivity." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiDriverSmokingInfo_" +
                                    val.channelId +
                                    ".dbaList.1.enabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiDriverSmokingInfo_" +
                                    val.channelId +
                                    ".dbaList.1.uploadVideoEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiDriverSmokingInfo_" +
                                    val.channelId +
                                    ".dbaList.1.uploadPicEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiDriverSmokingInfo_" +
                                    val.channelId +
                                    ".dbaList.1.limitSpeed." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiDriverSmokingInfo_" +
                                    val.channelId +
                                    ".dbaList.1.sensitivity." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                        }
                        this.$emit("changeData", this.formData);
                    });
                }
            },
            deep: true,
            immediate: false,
        },
        //注意力不集中变化监听
        "form.IsApiDriverInattentionInfo": {
            handler(val) {
                if (val != undefined) {
                    console.log(this.copyChannelForm);
                    this.$refs["PublicDba"].validate((valid) => {
                        if (valid) {
                            this.formData[
                                "IsApiDriverInattentionInfo_" +
                                    val.channelId +
                                    ".dbaList.0.enabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][0]["enabled"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriverInattentionInfo"]["dbaList"][0][
                                    "enabled"
                                ]
                                    ? `IsApiDriverInattentionInfo_${
                                          val["channelId"]
                                      }.dbaList.0.enabled.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/DBA/通道${
                                          val.channelId
                                      }/注意力不集中/一级报警/注意力不集中报警使能&${
                                          val["dbaList"][0]["enabled"]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiDriverInattentionInfo_" +
                                    val.channelId +
                                    ".dbaList.0.uploadVideoEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][0]["uploadVideoEnabled"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriverInattentionInfo"]["dbaList"][0][
                                    "uploadVideoEnabled"
                                ]
                                    ? `IsApiDriverInattentionInfo_${
                                          val["channelId"]
                                      }.dbaList.0.uploadVideoEnabled.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/DBA/通道${
                                          val.channelId
                                      }/注意力不集中/一级报警/报警视频上传使能&${
                                          val["dbaList"][0][
                                              "uploadVideoEnabled"
                                          ]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiDriverInattentionInfo_" +
                                    val.channelId +
                                    ".dbaList.0.uploadPicEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][0]["uploadPicEnabled"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriverInattentionInfo"]["dbaList"][0][
                                    "uploadPicEnabled"
                                ]
                                    ? `IsApiDriverInattentionInfo_${
                                          val["channelId"]
                                      }.dbaList.0.uploadPicEnabled.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/DBA/通道${
                                          val.channelId
                                      }/注意力不集中/一级报警/报警图片上传使能&${
                                          val["dbaList"][0]["uploadPicEnabled"]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiDriverInattentionInfo_" +
                                    val.channelId +
                                    ".dbaList.0.limitSpeed." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][0]["limitSpeed"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriverInattentionInfo"]["dbaList"][0][
                                    "limitSpeed"
                                ]
                                    ? `IsApiDriverInattentionInfo_${val["channelId"]}.dbaList.0.limitSpeed.${val.channelId}.channel.useless&主动安全设置/DBA/通道${val.channelId}/注意力不集中/一级报警/报警判断速度阈值&${val["dbaList"][0]["limitSpeed"]}`
                                    : "";
                            this.formData[
                                "IsApiDriverInattentionInfo_" +
                                    val.channelId +
                                    ".dbaList.0.sensitivity." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][0]["sensitivity"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriverInattentionInfo"]["dbaList"][0][
                                    "sensitivity"
                                ]
                                    ? `IsApiDriverInattentionInfo_${val["channelId"]}.dbaList.0.sensitivity.${val.channelId}.channel.useless&主动安全设置/DBA/通道${val.channelId}/注意力不集中/一级报警/灵敏度&${val["dbaList"][0]["sensitivity"]}`
                                    : "";
                            this.formData[
                                "IsApiDriverInattentionInfo_" +
                                    val.channelId +
                                    ".dbaList.1.enabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][1]["enabled"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriverInattentionInfo"]["dbaList"][1][
                                    "enabled"
                                ]
                                    ? `IsApiDriverInattentionInfo_${
                                          val["channelId"]
                                      }.dbaList.1.enabled.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/DBA/通道${
                                          val.channelId
                                      }/注意力不集中/二级报警/注意力不集中报警使能&${
                                          val["dbaList"][1]["enabled"]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiDriverInattentionInfo_" +
                                    val.channelId +
                                    ".dbaList.1.uploadVideoEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][1]["uploadVideoEnabled"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriverInattentionInfo"]["dbaList"][1][
                                    "uploadVideoEnabled"
                                ]
                                    ? `IsApiDriverInattentionInfo_${
                                          val["channelId"]
                                      }.dbaList.1.uploadVideoEnabled.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/DBA/通道${
                                          val.channelId
                                      }/注意力不集中/二级报警/报警视频上传使能&${
                                          val["dbaList"][1][
                                              "uploadVideoEnabled"
                                          ]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiDriverInattentionInfo_" +
                                    val.channelId +
                                    ".dbaList.1.uploadPicEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][1]["uploadPicEnabled"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriverInattentionInfo"]["dbaList"][1][
                                    "uploadPicEnabled"
                                ]
                                    ? `IsApiDriverInattentionInfo_${
                                          val["channelId"]
                                      }.dbaList.1.uploadPicEnabled.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/DBA/通道${
                                          val.channelId
                                      }/注意力不集中/二级报警/报警图片上传使能&${
                                          val["dbaList"][1]["uploadPicEnabled"]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiDriverInattentionInfo_" +
                                    val.channelId +
                                    ".dbaList.1.limitSpeed." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][1]["limitSpeed"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriverInattentionInfo"]["dbaList"][1][
                                    "limitSpeed"
                                ]
                                    ? `IsApiDriverInattentionInfo_${val["channelId"]}.dbaList.1.limitSpeed.${val.channelId}.channel.useless&主动安全设置/DBA/通道${val.channelId}/注意力不集中/二级报警/报警判断速度阈值&${val["dbaList"][1]["limitSpeed"]}`
                                    : "";
                            this.formData[
                                "IsApiDriverInattentionInfo_" +
                                    val.channelId +
                                    ".dbaList.1.sensitivity." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][1]["sensitivity"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriverInattentionInfo"]["dbaList"][1][
                                    "sensitivity"
                                ]
                                    ? `IsApiDriverInattentionInfo_${val["channelId"]}.dbaList.1.sensitivity.${val.channelId}.channel.useless&主动安全设置/DBA/通道${val.channelId}/注意力不集中/二级报警/灵敏度&${val["dbaList"][1]["sensitivity"]}`
                                    : "";
                        } else {
                            this.formData[
                                "IsApiDriverInattentionInfo_" +
                                    val.channelId +
                                    ".dbaList.0.enabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiDriverInattentionInfo_" +
                                    val.channelId +
                                    ".dbaList.0.uploadVideoEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiDriverInattentionInfo_" +
                                    val.channelId +
                                    ".dbaList.0.uploadPicEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiDriverInattentionInfo_" +
                                    val.channelId +
                                    ".dbaList.0.limitSpeed." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiDriverInattentionInfo_" +
                                    val.channelId +
                                    ".dbaList.0.sensitivity." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiDriverInattentionInfo_" +
                                    val.channelId +
                                    ".dbaList.1.enabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiDriverInattentionInfo_" +
                                    val.channelId +
                                    ".dbaList.1.uploadVideoEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiDriverInattentionInfo_" +
                                    val.channelId +
                                    ".dbaList.1.uploadPicEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiDriverInattentionInfo_" +
                                    val.channelId +
                                    ".dbaList.1.limitSpeed." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiDriverInattentionInfo_" +
                                    val.channelId +
                                    ".dbaList.1.sensitivity." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                        }
                        this.$emit("changeData", this.formData);
                    });
                }
            },
            deep: true,
            immediate: false,
        },
        //驾驶员离岗变化监听
        "form.IsApiDriverAbsentedInfo": {
            handler(val) {
                if (val != undefined) {
                    console.log(this.copyChannelForm);
                    this.$refs["PublicDba"].validate((valid) => {
                        if (valid) {
                            this.formData[
                                "IsApiDriverAbsentedInfo_" +
                                    val.channelId +
                                    ".dbaList.0.enabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][0]["enabled"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriverAbsentedInfo"]["dbaList"][0][
                                    "enabled"
                                ]
                                    ? `IsApiDriverAbsentedInfo_${
                                          val["channelId"]
                                      }.dbaList.0.enabled.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/DBA/通道${
                                          val.channelId
                                      }/驾驶员离岗/一级报警/驾驶员离岗报警使能&${
                                          val["dbaList"][0]["enabled"]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiDriverAbsentedInfo_" +
                                    val.channelId +
                                    ".dbaList.0.uploadVideoEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][0]["uploadVideoEnabled"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriverAbsentedInfo"]["dbaList"][0][
                                    "uploadVideoEnabled"
                                ]
                                    ? `IsApiDriverAbsentedInfo_${
                                          val["channelId"]
                                      }.dbaList.0.uploadVideoEnabled.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/DBA/通道${
                                          val.channelId
                                      }/驾驶员离岗/一级报警/报警视频上传使能&${
                                          val["dbaList"][0][
                                              "uploadVideoEnabled"
                                          ]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiDriverAbsentedInfo_" +
                                    val.channelId +
                                    ".dbaList.0.uploadPicEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][0]["uploadPicEnabled"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriverAbsentedInfo"]["dbaList"][0][
                                    "uploadPicEnabled"
                                ]
                                    ? `IsApiDriverAbsentedInfo_${
                                          val["channelId"]
                                      }.dbaList.0.uploadPicEnabled.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/DBA/通道${
                                          val.channelId
                                      }/驾驶员离岗/一级报警/报警图片上传使能&${
                                          val["dbaList"][0]["uploadPicEnabled"]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiDriverAbsentedInfo_" +
                                    val.channelId +
                                    ".dbaList.0.limitSpeed." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][0]["limitSpeed"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriverAbsentedInfo"]["dbaList"][0][
                                    "limitSpeed"
                                ]
                                    ? `IsApiDriverAbsentedInfo_${val["channelId"]}.dbaList.0.limitSpeed.${val.channelId}.channel.useless&主动安全设置/DBA/通道${val.channelId}/驾驶员离岗/一级报警/报警判断速度阈值&${val["dbaList"][0]["limitSpeed"]}`
                                    : "";
                            this.formData[
                                "IsApiDriverAbsentedInfo_" +
                                    val.channelId +
                                    ".dbaList.0.sensitivity." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][0]["sensitivity"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriverAbsentedInfo"]["dbaList"][0][
                                    "sensitivity"
                                ]
                                    ? `IsApiDriverAbsentedInfo_${val["channelId"]}.dbaList.0.sensitivity.${val.channelId}.channel.useless&主动安全设置/DBA/通道${val.channelId}/驾驶员离岗/一级报警/灵敏度&${val["dbaList"][0]["sensitivity"]}`
                                    : "";
                            this.formData[
                                "IsApiDriverAbsentedInfo_" +
                                    val.channelId +
                                    ".dbaList.1.enabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][1]["enabled"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriverAbsentedInfo"]["dbaList"][1][
                                    "enabled"
                                ]
                                    ? `IsApiDriverAbsentedInfo_${
                                          val["channelId"]
                                      }.dbaList.1.enabled.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/DBA/通道${
                                          val.channelId
                                      }/驾驶员离岗/二级报警/驾驶员离岗报警使能&${
                                          val["dbaList"][1]["enabled"]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiDriverAbsentedInfo_" +
                                    val.channelId +
                                    ".dbaList.1.uploadVideoEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][1]["uploadVideoEnabled"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriverAbsentedInfo"]["dbaList"][1][
                                    "uploadVideoEnabled"
                                ]
                                    ? `IsApiDriverAbsentedInfo_${
                                          val["channelId"]
                                      }.dbaList.1.uploadVideoEnabled.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/DBA/通道${
                                          val.channelId
                                      }/驾驶员离岗/二级报警/报警视频上传使能&${
                                          val["dbaList"][1][
                                              "uploadVideoEnabled"
                                          ]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiDriverAbsentedInfo_" +
                                    val.channelId +
                                    ".dbaList.1.uploadPicEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][1]["uploadPicEnabled"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriverAbsentedInfo"]["dbaList"][1][
                                    "uploadPicEnabled"
                                ]
                                    ? `IsApiDriverAbsentedInfo_${
                                          val["channelId"]
                                      }.dbaList.1.uploadPicEnabled.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/DBA/通道${
                                          val.channelId
                                      }/驾驶员离岗/二级报警/报警图片上传使能&${
                                          val["dbaList"][1]["uploadPicEnabled"]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiDriverAbsentedInfo_" +
                                    val.channelId +
                                    ".dbaList.1.limitSpeed." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][1]["limitSpeed"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriverAbsentedInfo"]["dbaList"][1][
                                    "limitSpeed"
                                ]
                                    ? `IsApiDriverAbsentedInfo_${val["channelId"]}.dbaList.1.limitSpeed.${val.channelId}.channel.useless&主动安全设置/DBA/通道${val.channelId}/驾驶员离岗/二级报警/报警判断速度阈值&${val["dbaList"][1]["limitSpeed"]}`
                                    : "";
                            this.formData[
                                "IsApiDriverAbsentedInfo_" +
                                    val.channelId +
                                    ".dbaList.1.sensitivity." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][1]["sensitivity"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriverAbsentedInfo"]["dbaList"][1][
                                    "sensitivity"
                                ]
                                    ? `IsApiDriverAbsentedInfo_${val["channelId"]}.dbaList.1.sensitivity.${val.channelId}.channel.useless&主动安全设置/DBA/通道${val.channelId}/驾驶员离岗/二级报警/灵敏度&${val["dbaList"][1]["sensitivity"]}`
                                    : "";
                        } else {
                            this.formData[
                                "IsApiDriverAbsentedInfo_" +
                                    val.channelId +
                                    ".dbaList.0.enabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiDriverAbsentedInfo_" +
                                    val.channelId +
                                    ".dbaList.0.uploadVideoEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiDriverAbsentedInfo_" +
                                    val.channelId +
                                    ".dbaList.0.uploadPicEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiDriverAbsentedInfo_" +
                                    val.channelId +
                                    ".dbaList.0.limitSpeed." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiDriverAbsentedInfo_" +
                                    val.channelId +
                                    ".dbaList.0.sensitivity." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiDriverAbsentedInfo_" +
                                    val.channelId +
                                    ".dbaList.1.enabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiDriverAbsentedInfo_" +
                                    val.channelId +
                                    ".dbaList.1.uploadVideoEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiDriverAbsentedInfo_" +
                                    val.channelId +
                                    ".dbaList.1.uploadPicEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiDriverAbsentedInfo_" +
                                    val.channelId +
                                    ".dbaList.1.limitSpeed." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiDriverAbsentedInfo_" +
                                    val.channelId +
                                    ".dbaList.1.sensitivity." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                        }
                        this.$emit("changeData", this.formData);
                    });
                }
            },
            deep: true,
            immediate: false,
        },
        //摄像头遮挡变化监听
        "form.IsApiDriverBlockCameraInfo": {
            handler(val) {
                if (val != undefined) {
                    console.log(this.copyChannelForm);
                    this.$refs["PublicDba"].validate((valid) => {
                        if (valid) {
                            this.formData[
                                "IsApiDriverBlockCameraInfo_" +
                                    val.channelId +
                                    ".dbaList.0.enabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][0]["enabled"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriverBlockCameraInfo"]["dbaList"][0][
                                    "enabled"
                                ]
                                    ? `IsApiDriverBlockCameraInfo_${
                                          val["channelId"]
                                      }.dbaList.0.enabled.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/DBA/通道${
                                          val.channelId
                                      }/摄像头遮挡/一级报警/摄像头遮挡报警使能&${
                                          val["dbaList"][0]["enabled"]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiDriverBlockCameraInfo_" +
                                    val.channelId +
                                    ".dbaList.0.uploadVideoEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][0]["uploadVideoEnabled"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriverBlockCameraInfo"]["dbaList"][0][
                                    "uploadVideoEnabled"
                                ]
                                    ? `IsApiDriverBlockCameraInfo_${
                                          val["channelId"]
                                      }.dbaList.0.uploadVideoEnabled.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/DBA/通道${
                                          val.channelId
                                      }/摄像头遮挡/一级报警/报警视频上传使能&${
                                          val["dbaList"][0][
                                              "uploadVideoEnabled"
                                          ]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiDriverBlockCameraInfo_" +
                                    val.channelId +
                                    ".dbaList.0.uploadPicEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][0]["uploadPicEnabled"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriverBlockCameraInfo"]["dbaList"][0][
                                    "uploadPicEnabled"
                                ]
                                    ? `IsApiDriverBlockCameraInfo_${
                                          val["channelId"]
                                      }.dbaList.0.uploadPicEnabled.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/DBA/通道${
                                          val.channelId
                                      }/摄像头遮挡/一级报警/报警图片上传使能&${
                                          val["dbaList"][0]["uploadPicEnabled"]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiDriverBlockCameraInfo_" +
                                    val.channelId +
                                    ".dbaList.0.limitSpeed." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][0]["limitSpeed"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriverBlockCameraInfo"]["dbaList"][0][
                                    "limitSpeed"
                                ]
                                    ? `IsApiDriverBlockCameraInfo_${val["channelId"]}.dbaList.0.limitSpeed.${val.channelId}.channel.useless&主动安全设置/DBA/通道${val.channelId}/摄像头遮挡/一级报警/报警判断速度阈值&${val["dbaList"][0]["limitSpeed"]}`
                                    : "";
                            this.formData[
                                "IsApiDriverBlockCameraInfo_" +
                                    val.channelId +
                                    ".dbaList.0.sensitivity." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][0]["sensitivity"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriverBlockCameraInfo"]["dbaList"][0][
                                    "sensitivity"
                                ]
                                    ? `IsApiDriverBlockCameraInfo_${val["channelId"]}.dbaList.0.sensitivity.${val.channelId}.channel.useless&主动安全设置/DBA/通道${val.channelId}/摄像头遮挡/一级报警/灵敏度&${val["dbaList"][0]["sensitivity"]}`
                                    : "";
                            this.formData[
                                "IsApiDriverBlockCameraInfo_" +
                                    val.channelId +
                                    ".dbaList.1.enabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][1]["enabled"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriverBlockCameraInfo"]["dbaList"][1][
                                    "enabled"
                                ]
                                    ? `IsApiDriverBlockCameraInfo_${
                                          val["channelId"]
                                      }.dbaList.1.enabled.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/DBA/通道${
                                          val.channelId
                                      }/摄像头遮挡/二级报警/摄像头遮挡报警使能&${
                                          val["dbaList"][1]["enabled"]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiDriverBlockCameraInfo_" +
                                    val.channelId +
                                    ".dbaList.1.uploadVideoEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][1]["uploadVideoEnabled"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriverBlockCameraInfo"]["dbaList"][1][
                                    "uploadVideoEnabled"
                                ]
                                    ? `IsApiDriverBlockCameraInfo_${
                                          val["channelId"]
                                      }.dbaList.1.uploadVideoEnabled.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/DBA/通道${
                                          val.channelId
                                      }/摄像头遮挡/二级报警/报警视频上传使能&${
                                          val["dbaList"][1][
                                              "uploadVideoEnabled"
                                          ]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiDriverBlockCameraInfo_" +
                                    val.channelId +
                                    ".dbaList.1.uploadPicEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][1]["uploadPicEnabled"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriverBlockCameraInfo"]["dbaList"][1][
                                    "uploadPicEnabled"
                                ]
                                    ? `IsApiDriverBlockCameraInfo_${
                                          val["channelId"]
                                      }.dbaList.1.uploadPicEnabled.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/DBA/通道${
                                          val.channelId
                                      }/摄像头遮挡/二级报警/报警图片上传使能&${
                                          val["dbaList"][1]["uploadPicEnabled"]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiDriverBlockCameraInfo_" +
                                    val.channelId +
                                    ".dbaList.1.limitSpeed." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][1]["limitSpeed"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriverBlockCameraInfo"]["dbaList"][1][
                                    "limitSpeed"
                                ]
                                    ? `IsApiDriverBlockCameraInfo_${val["channelId"]}.dbaList.1.limitSpeed.${val.channelId}.channel.useless&主动安全设置/DBA/通道${val.channelId}/摄像头遮挡/二级报警/报警判断速度阈值&${val["dbaList"][1]["limitSpeed"]}`
                                    : "";
                            this.formData[
                                "IsApiDriverBlockCameraInfo_" +
                                    val.channelId +
                                    ".dbaList.1.sensitivity." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][1]["sensitivity"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriverBlockCameraInfo"]["dbaList"][1][
                                    "sensitivity"
                                ]
                                    ? `IsApiDriverBlockCameraInfo_${val["channelId"]}.dbaList.1.sensitivity.${val.channelId}.channel.useless&主动安全设置/DBA/通道${val.channelId}/摄像头遮挡/二级报警/灵敏度&${val["dbaList"][1]["sensitivity"]}`
                                    : "";
                        } else {
                            this.formData[
                                "IsApiDriverBlockCameraInfo_" +
                                    val.channelId +
                                    ".dbaList.0.enabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiDriverBlockCameraInfo_" +
                                    val.channelId +
                                    ".dbaList.0.uploadVideoEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiDriverBlockCameraInfo_" +
                                    val.channelId +
                                    ".dbaList.0.uploadPicEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiDriverBlockCameraInfo_" +
                                    val.channelId +
                                    ".dbaList.0.limitSpeed." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiDriverBlockCameraInfo_" +
                                    val.channelId +
                                    ".dbaList.0.sensitivity." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiDriverBlockCameraInfo_" +
                                    val.channelId +
                                    ".dbaList.1.enabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiDriverBlockCameraInfo_" +
                                    val.channelId +
                                    ".dbaList.1.uploadVideoEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiDriverBlockCameraInfo_" +
                                    val.channelId +
                                    ".dbaList.1.uploadPicEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiDriverBlockCameraInfo_" +
                                    val.channelId +
                                    ".dbaList.1.limitSpeed." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiDriverBlockCameraInfo_" +
                                    val.channelId +
                                    ".dbaList.1.sensitivity." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                        }
                        this.$emit("changeData", this.formData);
                    });
                }
            },
            deep: true,
            immediate: false,
        },
        //未系安全带变化监听
        "form.IsApiDriverSafetyBeltInfo": {
            handler(val) {
                if (val != undefined) {
                    console.log(this.copyChannelForm);
                    this.$refs["PublicDba"].validate((valid) => {
                        if (valid) {
                            this.formData[
                                "IsApiDriverSafetyBeltInfo_" +
                                    val.channelId +
                                    ".dbaList.0.enabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][0]["enabled"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriverSafetyBeltInfo"]["dbaList"][0][
                                    "enabled"
                                ]
                                    ? `IsApiDriverSafetyBeltInfo_${
                                          val["channelId"]
                                      }.dbaList.0.enabled.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/DBA/通道${
                                          val.channelId
                                      }/未系安全带/一级报警/未系安全带报警使能&${
                                          val["dbaList"][0]["enabled"]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiDriverSafetyBeltInfo_" +
                                    val.channelId +
                                    ".dbaList.0.uploadVideoEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][0]["uploadVideoEnabled"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriverSafetyBeltInfo"]["dbaList"][0][
                                    "uploadVideoEnabled"
                                ]
                                    ? `IsApiDriverSafetyBeltInfo_${
                                          val["channelId"]
                                      }.dbaList.0.uploadVideoEnabled.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/DBA/通道${
                                          val.channelId
                                      }/未系安全带/一级报警/报警视频上传使能&${
                                          val["dbaList"][0][
                                              "uploadVideoEnabled"
                                          ]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiDriverSafetyBeltInfo_" +
                                    val.channelId +
                                    ".dbaList.0.uploadPicEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][0]["uploadPicEnabled"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriverSafetyBeltInfo"]["dbaList"][0][
                                    "uploadPicEnabled"
                                ]
                                    ? `IsApiDriverSafetyBeltInfo_${
                                          val["channelId"]
                                      }.dbaList.0.uploadPicEnabled.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/DBA/通道${
                                          val.channelId
                                      }/未系安全带/一级报警/报警图片上传使能&${
                                          val["dbaList"][0]["uploadPicEnabled"]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiDriverSafetyBeltInfo_" +
                                    val.channelId +
                                    ".dbaList.0.limitSpeed." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][0]["limitSpeed"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriverSafetyBeltInfo"]["dbaList"][0][
                                    "limitSpeed"
                                ]
                                    ? `IsApiDriverSafetyBeltInfo_${val["channelId"]}.dbaList.0.limitSpeed.${val.channelId}.channel.useless&主动安全设置/DBA/通道${val.channelId}/未系安全带/一级报警/报警判断速度阈值&${val["dbaList"][0]["limitSpeed"]}`
                                    : "";
                            this.formData[
                                "IsApiDriverSafetyBeltInfo_" +
                                    val.channelId +
                                    ".dbaList.0.sensitivity." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][0]["sensitivity"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriverSafetyBeltInfo"]["dbaList"][0][
                                    "sensitivity"
                                ]
                                    ? `IsApiDriverSafetyBeltInfo_${val["channelId"]}.dbaList.0.sensitivity.${val.channelId}.channel.useless&主动安全设置/DBA/通道${val.channelId}/未系安全带/一级报警/灵敏度&${val["dbaList"][0]["sensitivity"]}`
                                    : "";
                            this.formData[
                                "IsApiDriverSafetyBeltInfo_" +
                                    val.channelId +
                                    ".dbaList.1.enabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][1]["enabled"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriverSafetyBeltInfo"]["dbaList"][1][
                                    "enabled"
                                ]
                                    ? `IsApiDriverSafetyBeltInfo_${
                                          val["channelId"]
                                      }.dbaList.1.enabled.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/DBA/通道${
                                          val.channelId
                                      }/未系安全带/二级报警/未系安全带报警使能&${
                                          val["dbaList"][1]["enabled"]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiDriverSafetyBeltInfo_" +
                                    val.channelId +
                                    ".dbaList.1.uploadVideoEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][1]["uploadVideoEnabled"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriverSafetyBeltInfo"]["dbaList"][1][
                                    "uploadVideoEnabled"
                                ]
                                    ? `IsApiDriverSafetyBeltInfo_${
                                          val["channelId"]
                                      }.dbaList.1.uploadVideoEnabled.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/DBA/通道${
                                          val.channelId
                                      }/未系安全带/二级报警/报警视频上传使能&${
                                          val["dbaList"][1][
                                              "uploadVideoEnabled"
                                          ]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiDriverSafetyBeltInfo_" +
                                    val.channelId +
                                    ".dbaList.1.uploadPicEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][1]["uploadPicEnabled"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriverSafetyBeltInfo"]["dbaList"][1][
                                    "uploadPicEnabled"
                                ]
                                    ? `IsApiDriverSafetyBeltInfo_${
                                          val["channelId"]
                                      }.dbaList.1.uploadPicEnabled.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/DBA/通道${
                                          val.channelId
                                      }/未系安全带/二级报警/报警图片上传使能&${
                                          val["dbaList"][1]["uploadPicEnabled"]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiDriverSafetyBeltInfo_" +
                                    val.channelId +
                                    ".dbaList.1.limitSpeed." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][1]["limitSpeed"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriverSafetyBeltInfo"]["dbaList"][1][
                                    "limitSpeed"
                                ]
                                    ? `IsApiDriverSafetyBeltInfo_${val["channelId"]}.dbaList.1.limitSpeed.${val.channelId}.channel.useless&主动安全设置/DBA/通道${val.channelId}/未系安全带/二级报警/报警判断速度阈值&${val["dbaList"][1]["limitSpeed"]}`
                                    : "";
                            this.formData[
                                "IsApiDriverSafetyBeltInfo_" +
                                    val.channelId +
                                    ".dbaList.1.sensitivity." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][1]["sensitivity"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriverSafetyBeltInfo"]["dbaList"][1][
                                    "sensitivity"
                                ]
                                    ? `IsApiDriverSafetyBeltInfo_${val["channelId"]}.dbaList.1.sensitivity.${val.channelId}.channel.useless&主动安全设置/DBA/通道${val.channelId}/未系安全带/二级报警/灵敏度&${val["dbaList"][1]["sensitivity"]}`
                                    : "";
                        } else {
                            this.formData[
                                "IsApiDriverSafetyBeltInfo_" +
                                    val.channelId +
                                    ".dbaList.0.enabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiDriverSafetyBeltInfo_" +
                                    val.channelId +
                                    ".dbaList.0.uploadVideoEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiDriverSafetyBeltInfo_" +
                                    val.channelId +
                                    ".dbaList.0.uploadPicEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiDriverSafetyBeltInfo_" +
                                    val.channelId +
                                    ".dbaList.0.limitSpeed." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiDriverSafetyBeltInfo_" +
                                    val.channelId +
                                    ".dbaList.0.sensitivity." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiDriverSafetyBeltInfo_" +
                                    val.channelId +
                                    ".dbaList.1.enabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiDriverSafetyBeltInfo_" +
                                    val.channelId +
                                    ".dbaList.1.uploadVideoEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiDriverSafetyBeltInfo_" +
                                    val.channelId +
                                    ".dbaList.1.uploadPicEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiDriverSafetyBeltInfo_" +
                                    val.channelId +
                                    ".dbaList.1.limitSpeed." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiDriverSafetyBeltInfo_" +
                                    val.channelId +
                                    ".dbaList.1.sensitivity." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                        }
                        this.$emit("changeData", this.formData);
                    });
                }
            },
            deep: true,
            immediate: false,
        },
        //墨镜变化监听
        "form.IsApiDriverSunglassesInfo": {
            handler(val) {
                if (val != undefined) {
                    console.log(this.copyChannelForm);
                    this.$refs["PublicDba"].validate((valid) => {
                        if (valid) {
                            this.formData[
                                "IsApiDriverSunglassesInfo_" +
                                    val.channelId +
                                    ".dbaList.0.enabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][0]["enabled"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriverSunglassesInfo"]["dbaList"][0][
                                    "enabled"
                                ]
                                    ? `IsApiDriverSunglassesInfo_${
                                          val["channelId"]
                                      }.dbaList.0.enabled.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/DBA/通道${
                                          val.channelId
                                      }/墨镜/一级报警/墨镜报警使能&${
                                          val["dbaList"][0]["enabled"]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiDriverSunglassesInfo_" +
                                    val.channelId +
                                    ".dbaList.0.uploadVideoEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][0]["uploadVideoEnabled"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriverSunglassesInfo"]["dbaList"][0][
                                    "uploadVideoEnabled"
                                ]
                                    ? `IsApiDriverSunglassesInfo_${
                                          val["channelId"]
                                      }.dbaList.0.uploadVideoEnabled.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/DBA/通道${
                                          val.channelId
                                      }/墨镜/一级报警/报警视频上传使能&${
                                          val["dbaList"][0][
                                              "uploadVideoEnabled"
                                          ]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiDriverSunglassesInfo_" +
                                    val.channelId +
                                    ".dbaList.0.uploadPicEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][0]["uploadPicEnabled"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriverSunglassesInfo"]["dbaList"][0][
                                    "uploadPicEnabled"
                                ]
                                    ? `IsApiDriverSunglassesInfo_${
                                          val["channelId"]
                                      }.dbaList.0.uploadPicEnabled.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/DBA/通道${
                                          val.channelId
                                      }/墨镜/一级报警/报警图片上传使能&${
                                          val["dbaList"][0]["uploadPicEnabled"]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiDriverSunglassesInfo_" +
                                    val.channelId +
                                    ".dbaList.0.limitSpeed." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][0]["limitSpeed"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriverSunglassesInfo"]["dbaList"][0][
                                    "limitSpeed"
                                ]
                                    ? `IsApiDriverSunglassesInfo_${val["channelId"]}.dbaList.0.limitSpeed.${val.channelId}.channel.useless&主动安全设置/DBA/通道${val.channelId}/墨镜/一级报警/报警判断速度阈值&${val["dbaList"][0]["limitSpeed"]}`
                                    : "";
                            this.formData[
                                "IsApiDriverSunglassesInfo_" +
                                    val.channelId +
                                    ".dbaList.0.sensitivity." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][0]["sensitivity"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriverSunglassesInfo"]["dbaList"][0][
                                    "sensitivity"
                                ]
                                    ? `IsApiDriverSunglassesInfo_${val["channelId"]}.dbaList.0.sensitivity.${val.channelId}.channel.useless&主动安全设置/DBA/通道${val.channelId}/墨镜/一级报警/灵敏度&${val["dbaList"][0]["sensitivity"]}`
                                    : "";
                            this.formData[
                                "IsApiDriverSunglassesInfo_" +
                                    val.channelId +
                                    ".dbaList.1.enabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][1]["enabled"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriverSunglassesInfo"]["dbaList"][1][
                                    "enabled"
                                ]
                                    ? `IsApiDriverSunglassesInfo_${
                                          val["channelId"]
                                      }.dbaList.1.enabled.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/DBA/通道${
                                          val.channelId
                                      }/墨镜/二级报警/墨镜报警使能&${
                                          val["dbaList"][1]["enabled"]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiDriverSunglassesInfo_" +
                                    val.channelId +
                                    ".dbaList.1.uploadVideoEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][1]["uploadVideoEnabled"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriverSunglassesInfo"]["dbaList"][1][
                                    "uploadVideoEnabled"
                                ]
                                    ? `IsApiDriverSunglassesInfo_${
                                          val["channelId"]
                                      }.dbaList.1.uploadVideoEnabled.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/DBA/通道${
                                          val.channelId
                                      }/墨镜/二级报警/报警视频上传使能&${
                                          val["dbaList"][1][
                                              "uploadVideoEnabled"
                                          ]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiDriverSunglassesInfo_" +
                                    val.channelId +
                                    ".dbaList.1.uploadPicEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][1]["uploadPicEnabled"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriverSunglassesInfo"]["dbaList"][1][
                                    "uploadPicEnabled"
                                ]
                                    ? `IsApiDriverSunglassesInfo_${
                                          val["channelId"]
                                      }.dbaList.1.uploadPicEnabled.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/DBA/通道${
                                          val.channelId
                                      }/墨镜/二级报警/报警图片上传使能&${
                                          val["dbaList"][1]["uploadPicEnabled"]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiDriverSunglassesInfo_" +
                                    val.channelId +
                                    ".dbaList.1.limitSpeed." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][1]["limitSpeed"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriverSunglassesInfo"]["dbaList"][1][
                                    "limitSpeed"
                                ]
                                    ? `IsApiDriverSunglassesInfo_${val["channelId"]}.dbaList.1.limitSpeed.${val.channelId}.channel.useless&主动安全设置/DBA/通道${val.channelId}/墨镜/二级报警/报警判断速度阈值&${val["dbaList"][1]["limitSpeed"]}`
                                    : "";
                            this.formData[
                                "IsApiDriverSunglassesInfo_" +
                                    val.channelId +
                                    ".dbaList.1.sensitivity." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][1]["sensitivity"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriverSunglassesInfo"]["dbaList"][1][
                                    "sensitivity"
                                ]
                                    ? `IsApiDriverSunglassesInfo_${val["channelId"]}.dbaList.1.sensitivity.${val.channelId}.channel.useless&主动安全设置/DBA/通道${val.channelId}/墨镜/二级报警/灵敏度&${val["dbaList"][1]["sensitivity"]}`
                                    : "";
                        } else {
                            this.formData[
                                "IsApiDriverSunglassesInfo_" +
                                    val.channelId +
                                    ".dbaList.0.enabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiDriverSunglassesInfo_" +
                                    val.channelId +
                                    ".dbaList.0.uploadVideoEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiDriverSunglassesInfo_" +
                                    val.channelId +
                                    ".dbaList.0.uploadPicEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiDriverSunglassesInfo_" +
                                    val.channelId +
                                    ".dbaList.0.limitSpeed." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiDriverSunglassesInfo_" +
                                    val.channelId +
                                    ".dbaList.0.sensitivity." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiDriverSunglassesInfo_" +
                                    val.channelId +
                                    ".dbaList.1.enabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiDriverSunglassesInfo_" +
                                    val.channelId +
                                    ".dbaList.1.uploadVideoEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiDriverSunglassesInfo_" +
                                    val.channelId +
                                    ".dbaList.1.uploadPicEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiDriverSunglassesInfo_" +
                                    val.channelId +
                                    ".dbaList.1.limitSpeed." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiDriverSunglassesInfo_" +
                                    val.channelId +
                                    ".dbaList.1.sensitivity." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                        }
                        this.$emit("changeData", this.formData);
                    });
                }
            },
            deep: true,
            immediate: false,
        },
        //急加速变化监听
        "form.IsApiRapidAccelerationInfo": {
            handler(val) {
                if (val != undefined) {
                    console.log(this.copyChannelForm);
                    this.$refs["PublicDba"].validate((valid) => {
                        if (valid) {
                            this.formData[
                                "IsApiRapidAccelerationInfo_" +
                                    val.channelId +
                                    ".dbaList.0.enabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][0]["enabled"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiRapidAccelerationInfo"]["dbaList"][0][
                                    "enabled"
                                ]
                                    ? `IsApiRapidAccelerationInfo_${
                                          val["channelId"]
                                      }.dbaList.0.enabled.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/DBA/通道${
                                          val.channelId
                                      }/急加速/一级报警/急加速报警使能&${
                                          val["dbaList"][0]["enabled"]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiRapidAccelerationInfo_" +
                                    val.channelId +
                                    ".dbaList.0.uploadVideoEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][0]["uploadVideoEnabled"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiRapidAccelerationInfo"]["dbaList"][0][
                                    "uploadVideoEnabled"
                                ]
                                    ? `IsApiRapidAccelerationInfo_${
                                          val["channelId"]
                                      }.dbaList.0.uploadVideoEnabled.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/DBA/通道${
                                          val.channelId
                                      }/急加速/一级报警/报警视频上传使能&${
                                          val["dbaList"][0][
                                              "uploadVideoEnabled"
                                          ]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiRapidAccelerationInfo_" +
                                    val.channelId +
                                    ".dbaList.0.uploadPicEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][0]["uploadPicEnabled"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiRapidAccelerationInfo"]["dbaList"][0][
                                    "uploadPicEnabled"
                                ]
                                    ? `IsApiRapidAccelerationInfo_${
                                          val["channelId"]
                                      }.dbaList.0.uploadPicEnabled.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/DBA/通道${
                                          val.channelId
                                      }/急加速/一级报警/报警图片上传使能&${
                                          val["dbaList"][0]["uploadPicEnabled"]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiRapidAccelerationInfo_" +
                                    val.channelId +
                                    ".dbaList.0.limitSpeed." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][0]["limitSpeed"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiRapidAccelerationInfo"]["dbaList"][0][
                                    "limitSpeed"
                                ]
                                    ? `IsApiRapidAccelerationInfo_${val["channelId"]}.dbaList.0.limitSpeed.${val.channelId}.channel.useless&主动安全设置/DBA/通道${val.channelId}/急加速/一级报警/报警判断速度阈值&${val["dbaList"][0]["limitSpeed"]}`
                                    : "";
                            this.formData[
                                "IsApiRapidAccelerationInfo_" +
                                    val.channelId +
                                    ".dbaList.0.sensitivity." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][0]["sensitivity"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiRapidAccelerationInfo"]["dbaList"][0][
                                    "sensitivity"
                                ]
                                    ? `IsApiRapidAccelerationInfo_${val["channelId"]}.dbaList.0.sensitivity.${val.channelId}.channel.useless&主动安全设置/DBA/通道${val.channelId}/急加速/一级报警/灵敏度&${val["dbaList"][0]["sensitivity"]}`
                                    : "";
                            this.formData[
                                "IsApiRapidAccelerationInfo_" +
                                    val.channelId +
                                    ".dbaList.1.enabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][1]["enabled"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiRapidAccelerationInfo"]["dbaList"][1][
                                    "enabled"
                                ]
                                    ? `IsApiRapidAccelerationInfo_${
                                          val["channelId"]
                                      }.dbaList.1.enabled.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/DBA/通道${
                                          val.channelId
                                      }/急加速/二级报警/急加速报警使能&${
                                          val["dbaList"][1]["enabled"]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiRapidAccelerationInfo_" +
                                    val.channelId +
                                    ".dbaList.1.uploadVideoEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][1]["uploadVideoEnabled"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiRapidAccelerationInfo"]["dbaList"][1][
                                    "uploadVideoEnabled"
                                ]
                                    ? `IsApiRapidAccelerationInfo_${
                                          val["channelId"]
                                      }.dbaList.1.uploadVideoEnabled.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/DBA/通道${
                                          val.channelId
                                      }/急加速/二级报警/报警视频上传使能&${
                                          val["dbaList"][1][
                                              "uploadVideoEnabled"
                                          ]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiRapidAccelerationInfo_" +
                                    val.channelId +
                                    ".dbaList.1.uploadPicEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][1]["uploadPicEnabled"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiRapidAccelerationInfo"]["dbaList"][1][
                                    "uploadPicEnabled"
                                ]
                                    ? `IsApiRapidAccelerationInfo_${
                                          val["channelId"]
                                      }.dbaList.1.uploadPicEnabled.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/DBA/通道${
                                          val.channelId
                                      }/急加速/二级报警/报警图片上传使能&${
                                          val["dbaList"][1]["uploadPicEnabled"]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiRapidAccelerationInfo_" +
                                    val.channelId +
                                    ".dbaList.1.limitSpeed." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][1]["limitSpeed"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiRapidAccelerationInfo"]["dbaList"][1][
                                    "limitSpeed"
                                ]
                                    ? `IsApiRapidAccelerationInfo_${val["channelId"]}.dbaList.1.limitSpeed.${val.channelId}.channel.useless&主动安全设置/DBA/通道${val.channelId}/急加速/二级报警/报警判断速度阈值&${val["dbaList"][1]["limitSpeed"]}`
                                    : "";
                            this.formData[
                                "IsApiRapidAccelerationInfo_" +
                                    val.channelId +
                                    ".dbaList.1.sensitivity." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][1]["sensitivity"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiRapidAccelerationInfo"]["dbaList"][1][
                                    "sensitivity"
                                ]
                                    ? `IsApiRapidAccelerationInfo_${val["channelId"]}.dbaList.1.sensitivity.${val.channelId}.channel.useless&主动安全设置/DBA/通道${val.channelId}/急加速/二级报警/灵敏度&${val["dbaList"][1]["sensitivity"]}`
                                    : "";
                        } else {
                            this.formData[
                                "IsApiRapidAccelerationInfo_" +
                                    val.channelId +
                                    ".dbaList.0.enabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiRapidAccelerationInfo_" +
                                    val.channelId +
                                    ".dbaList.0.uploadVideoEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiRapidAccelerationInfo_" +
                                    val.channelId +
                                    ".dbaList.0.uploadPicEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiRapidAccelerationInfo_" +
                                    val.channelId +
                                    ".dbaList.0.limitSpeed." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiRapidAccelerationInfo_" +
                                    val.channelId +
                                    ".dbaList.0.sensitivity." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiRapidAccelerationInfo_" +
                                    val.channelId +
                                    ".dbaList.1.enabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiRapidAccelerationInfo_" +
                                    val.channelId +
                                    ".dbaList.1.uploadVideoEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiRapidAccelerationInfo_" +
                                    val.channelId +
                                    ".dbaList.1.uploadPicEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiRapidAccelerationInfo_" +
                                    val.channelId +
                                    ".dbaList.1.limitSpeed." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiRapidAccelerationInfo_" +
                                    val.channelId +
                                    ".dbaList.1.sensitivity." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                        }
                        this.$emit("changeData", this.formData);
                    });
                }
            },
            deep: true,
            immediate: false,
        },
        //急减速变化监听
        "form.IsApiRapidDecelerationInfo": {
            handler(val) {
                if (val != undefined) {
                    console.log(this.copyChannelForm);
                    this.$refs["PublicDba"].validate((valid) => {
                        if (valid) {
                            this.formData[
                                "IsApiRapidDecelerationInfo_" +
                                    val.channelId +
                                    ".dbaList.0.enabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][0]["enabled"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiRapidDecelerationInfo"]["dbaList"][0][
                                    "enabled"
                                ]
                                    ? `IsApiRapidDecelerationInfo_${
                                          val["channelId"]
                                      }.dbaList.0.enabled.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/DBA/通道${
                                          val.channelId
                                      }/急减速/一级报警/急减速报警使能&${
                                          val["dbaList"][0]["enabled"]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiRapidDecelerationInfo_" +
                                    val.channelId +
                                    ".dbaList.0.uploadVideoEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][0]["uploadVideoEnabled"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiRapidDecelerationInfo"]["dbaList"][0][
                                    "uploadVideoEnabled"
                                ]
                                    ? `IsApiRapidDecelerationInfo_${
                                          val["channelId"]
                                      }.dbaList.0.uploadVideoEnabled.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/DBA/通道${
                                          val.channelId
                                      }/急减速/一级报警/报警视频上传使能&${
                                          val["dbaList"][0][
                                              "uploadVideoEnabled"
                                          ]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiRapidDecelerationInfo_" +
                                    val.channelId +
                                    ".dbaList.0.uploadPicEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][0]["uploadPicEnabled"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiRapidDecelerationInfo"]["dbaList"][0][
                                    "uploadPicEnabled"
                                ]
                                    ? `IsApiRapidDecelerationInfo_${
                                          val["channelId"]
                                      }.dbaList.0.uploadPicEnabled.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/DBA/通道${
                                          val.channelId
                                      }/急减速/一级报警/报警图片上传使能&${
                                          val["dbaList"][0]["uploadPicEnabled"]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiRapidDecelerationInfo_" +
                                    val.channelId +
                                    ".dbaList.0.limitSpeed." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][0]["limitSpeed"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiRapidDecelerationInfo"]["dbaList"][0][
                                    "limitSpeed"
                                ]
                                    ? `IsApiRapidDecelerationInfo_${val["channelId"]}.dbaList.0.limitSpeed.${val.channelId}.channel.useless&主动安全设置/DBA/通道${val.channelId}/急减速/一级报警/报警判断速度阈值&${val["dbaList"][0]["limitSpeed"]}`
                                    : "";
                            this.formData[
                                "IsApiRapidDecelerationInfo_" +
                                    val.channelId +
                                    ".dbaList.0.sensitivity." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][0]["sensitivity"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiRapidDecelerationInfo"]["dbaList"][0][
                                    "sensitivity"
                                ]
                                    ? `IsApiRapidDecelerationInfo_${val["channelId"]}.dbaList.0.sensitivity.${val.channelId}.channel.useless&主动安全设置/DBA/通道${val.channelId}/急减速/一级报警/灵敏度&${val["dbaList"][0]["sensitivity"]}`
                                    : "";
                            this.formData[
                                "IsApiRapidDecelerationInfo_" +
                                    val.channelId +
                                    ".dbaList.1.enabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][1]["enabled"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiRapidDecelerationInfo"]["dbaList"][1][
                                    "enabled"
                                ]
                                    ? `IsApiRapidDecelerationInfo_${
                                          val["channelId"]
                                      }.dbaList.1.enabled.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/DBA/通道${
                                          val.channelId
                                      }/急减速/二级报警/急减速报警使能&${
                                          val["dbaList"][1]["enabled"]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiRapidDecelerationInfo_" +
                                    val.channelId +
                                    ".dbaList.1.uploadVideoEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][1]["uploadVideoEnabled"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiRapidDecelerationInfo"]["dbaList"][1][
                                    "uploadVideoEnabled"
                                ]
                                    ? `IsApiRapidDecelerationInfo_${
                                          val["channelId"]
                                      }.dbaList.1.uploadVideoEnabled.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/DBA/通道${
                                          val.channelId
                                      }/急减速/二级报警/报警视频上传使能&${
                                          val["dbaList"][1][
                                              "uploadVideoEnabled"
                                          ]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiRapidDecelerationInfo_" +
                                    val.channelId +
                                    ".dbaList.1.uploadPicEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][1]["uploadPicEnabled"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiRapidDecelerationInfo"]["dbaList"][1][
                                    "uploadPicEnabled"
                                ]
                                    ? `IsApiRapidDecelerationInfo_${
                                          val["channelId"]
                                      }.dbaList.1.uploadPicEnabled.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/DBA/通道${
                                          val.channelId
                                      }/急减速/二级报警/报警图片上传使能&${
                                          val["dbaList"][1]["uploadPicEnabled"]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiRapidDecelerationInfo_" +
                                    val.channelId +
                                    ".dbaList.1.limitSpeed." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][1]["limitSpeed"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiRapidDecelerationInfo"]["dbaList"][1][
                                    "limitSpeed"
                                ]
                                    ? `IsApiRapidDecelerationInfo_${val["channelId"]}.dbaList.1.limitSpeed.${val.channelId}.channel.useless&主动安全设置/DBA/通道${val.channelId}/急减速/二级报警/报警判断速度阈值&${val["dbaList"][1]["limitSpeed"]}`
                                    : "";
                            this.formData[
                                "IsApiRapidDecelerationInfo_" +
                                    val.channelId +
                                    ".dbaList.1.sensitivity." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][1]["sensitivity"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiRapidDecelerationInfo"]["dbaList"][1][
                                    "sensitivity"
                                ]
                                    ? `IsApiRapidDecelerationInfo_${val["channelId"]}.dbaList.1.sensitivity.${val.channelId}.channel.useless&主动安全设置/DBA/通道${val.channelId}/急减速/二级报警/灵敏度&${val["dbaList"][1]["sensitivity"]}`
                                    : "";
                        } else {
                            this.formData[
                                "IsApiRapidDecelerationInfo_" +
                                    val.channelId +
                                    ".dbaList.0.enabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiRapidDecelerationInfo_" +
                                    val.channelId +
                                    ".dbaList.0.uploadVideoEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiRapidDecelerationInfo_" +
                                    val.channelId +
                                    ".dbaList.0.uploadPicEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiRapidDecelerationInfo_" +
                                    val.channelId +
                                    ".dbaList.0.limitSpeed." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiRapidDecelerationInfo_" +
                                    val.channelId +
                                    ".dbaList.0.sensitivity." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiRapidDecelerationInfo_" +
                                    val.channelId +
                                    ".dbaList.1.enabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiRapidDecelerationInfo_" +
                                    val.channelId +
                                    ".dbaList.1.uploadVideoEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiRapidDecelerationInfo_" +
                                    val.channelId +
                                    ".dbaList.1.uploadPicEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiRapidDecelerationInfo_" +
                                    val.channelId +
                                    ".dbaList.1.limitSpeed." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiRapidDecelerationInfo_" +
                                    val.channelId +
                                    ".dbaList.1.sensitivity." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                        }
                        this.$emit("changeData", this.formData);
                    });
                }
            },
            deep: true,
            immediate: false,
        },
        //急转弯变化监听
        "form.IsApiRapidTurnInfo": {
            handler(val) {
                if (val != undefined) {
                    console.log(this.copyChannelForm);
                    this.$refs["PublicDba"].validate((valid) => {
                        if (valid) {
                            this.formData[
                                "IsApiRapidTurnInfo_" +
                                    val.channelId +
                                    ".dbaList.0.enabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][0]["enabled"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiRapidTurnInfo"]["dbaList"][0]["enabled"]
                                    ? `IsApiRapidTurnInfo_${
                                          val["channelId"]
                                      }.dbaList.0.enabled.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/DBA/通道${
                                          val.channelId
                                      }/急转弯/一级报警/急转弯报警使能&${
                                          val["dbaList"][0]["enabled"]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiRapidTurnInfo_" +
                                    val.channelId +
                                    ".dbaList.0.uploadVideoEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][0]["uploadVideoEnabled"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiRapidTurnInfo"]["dbaList"][0][
                                    "uploadVideoEnabled"
                                ]
                                    ? `IsApiRapidTurnInfo_${
                                          val["channelId"]
                                      }.dbaList.0.uploadVideoEnabled.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/DBA/通道${
                                          val.channelId
                                      }/急转弯/一级报警/报警视频上传使能&${
                                          val["dbaList"][0][
                                              "uploadVideoEnabled"
                                          ]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiRapidTurnInfo_" +
                                    val.channelId +
                                    ".dbaList.0.uploadPicEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][0]["uploadPicEnabled"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiRapidTurnInfo"]["dbaList"][0][
                                    "uploadPicEnabled"
                                ]
                                    ? `IsApiRapidTurnInfo_${
                                          val["channelId"]
                                      }.dbaList.0.uploadPicEnabled.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/DBA/通道${
                                          val.channelId
                                      }/急转弯/一级报警/报警图片上传使能&${
                                          val["dbaList"][0]["uploadPicEnabled"]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiRapidTurnInfo_" +
                                    val.channelId +
                                    ".dbaList.0.limitSpeed." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][0]["limitSpeed"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiRapidTurnInfo"]["dbaList"][0][
                                    "limitSpeed"
                                ]
                                    ? `IsApiRapidTurnInfo_${val["channelId"]}.dbaList.0.limitSpeed.${val.channelId}.channel.useless&主动安全设置/DBA/通道${val.channelId}/急转弯/一级报警/报警判断速度阈值&${val["dbaList"][0]["limitSpeed"]}`
                                    : "";
                            this.formData[
                                "IsApiRapidTurnInfo_" +
                                    val.channelId +
                                    ".dbaList.0.sensitivity." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][0]["sensitivity"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiRapidTurnInfo"]["dbaList"][0][
                                    "sensitivity"
                                ]
                                    ? `IsApiRapidTurnInfo_${val["channelId"]}.dbaList.0.sensitivity.${val.channelId}.channel.useless&主动安全设置/DBA/通道${val.channelId}/急转弯/一级报警/灵敏度&${val["dbaList"][0]["sensitivity"]}`
                                    : "";
                            this.formData[
                                "IsApiRapidTurnInfo_" +
                                    val.channelId +
                                    ".dbaList.1.enabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][1]["enabled"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiRapidTurnInfo"]["dbaList"][1]["enabled"]
                                    ? `IsApiRapidTurnInfo_${
                                          val["channelId"]
                                      }.dbaList.1.enabled.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/DBA/通道${
                                          val.channelId
                                      }/急转弯/二级报警/急转弯报警使能&${
                                          val["dbaList"][1]["enabled"]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiRapidTurnInfo_" +
                                    val.channelId +
                                    ".dbaList.1.uploadVideoEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][1]["uploadVideoEnabled"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiRapidTurnInfo"]["dbaList"][1][
                                    "uploadVideoEnabled"
                                ]
                                    ? `IsApiRapidTurnInfo_${
                                          val["channelId"]
                                      }.dbaList.1.uploadVideoEnabled.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/DBA/通道${
                                          val.channelId
                                      }/急转弯/二级报警/报警视频上传使能&${
                                          val["dbaList"][1][
                                              "uploadVideoEnabled"
                                          ]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiRapidTurnInfo_" +
                                    val.channelId +
                                    ".dbaList.1.uploadPicEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][1]["uploadPicEnabled"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiRapidTurnInfo"]["dbaList"][1][
                                    "uploadPicEnabled"
                                ]
                                    ? `IsApiRapidTurnInfo_${
                                          val["channelId"]
                                      }.dbaList.1.uploadPicEnabled.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/DBA/通道${
                                          val.channelId
                                      }/急转弯/二级报警/报警图片上传使能&${
                                          val["dbaList"][1]["uploadPicEnabled"]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiRapidTurnInfo_" +
                                    val.channelId +
                                    ".dbaList.1.limitSpeed." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][1]["limitSpeed"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiRapidTurnInfo"]["dbaList"][1][
                                    "limitSpeed"
                                ]
                                    ? `IsApiRapidTurnInfo_${val["channelId"]}.dbaList.1.limitSpeed.${val.channelId}.channel.useless&主动安全设置/DBA/通道${val.channelId}/急转弯/二级报警/报警判断速度阈值&${val["dbaList"][1]["limitSpeed"]}`
                                    : "";
                            this.formData[
                                "IsApiRapidTurnInfo_" +
                                    val.channelId +
                                    ".dbaList.1.sensitivity." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][1]["sensitivity"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiRapidTurnInfo"]["dbaList"][1][
                                    "sensitivity"
                                ]
                                    ? `IsApiRapidTurnInfo_${val["channelId"]}.dbaList.1.sensitivity.${val.channelId}.channel.useless&主动安全设置/DBA/通道${val.channelId}/急转弯/二级报警/灵敏度&${val["dbaList"][1]["sensitivity"]}`
                                    : "";
                        } else {
                            this.formData[
                                "IsApiRapidTurnInfo_" +
                                    val.channelId +
                                    ".dbaList.0.enabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiRapidTurnInfo_" +
                                    val.channelId +
                                    ".dbaList.0.uploadVideoEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiRapidTurnInfo_" +
                                    val.channelId +
                                    ".dbaList.0.uploadPicEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiRapidTurnInfo_" +
                                    val.channelId +
                                    ".dbaList.0.limitSpeed." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiRapidTurnInfo_" +
                                    val.channelId +
                                    ".dbaList.0.sensitivity." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiRapidTurnInfo_" +
                                    val.channelId +
                                    ".dbaList.1.enabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiRapidTurnInfo_" +
                                    val.channelId +
                                    ".dbaList.1.uploadVideoEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiRapidTurnInfo_" +
                                    val.channelId +
                                    ".dbaList.1.uploadPicEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiRapidTurnInfo_" +
                                    val.channelId +
                                    ".dbaList.1.limitSpeed." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiRapidTurnInfo_" +
                                    val.channelId +
                                    ".dbaList.1.sensitivity." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                        }
                        this.$emit("changeData", this.formData);
                    });
                }
            },
            deep: true,
            immediate: false,
        },
        //驾驶员异常变化监听
        "form.IsApiDriverAbnormaInfo": {
            handler(val) {
                if (val != undefined) {
                    console.log(this.copyChannelForm);
                    this.$refs["PublicDba"].validate((valid) => {
                        if (valid) {
                            this.formData[
                                "IsApiDriverAbnormaInfo_" +
                                    val.channelId +
                                    ".dbaList.0.enabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][0]["enabled"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriverAbnormaInfo"]["dbaList"][0][
                                    "enabled"
                                ]
                                    ? `IsApiDriverAbnormaInfo_${
                                          val["channelId"]
                                      }.dbaList.0.enabled.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/DBA/通道${
                                          val.channelId
                                      }/驾驶员异常/一级报警/驾驶员异常报警使能&${
                                          val["dbaList"][0]["enabled"]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiDriverAbnormaInfo_" +
                                    val.channelId +
                                    ".dbaList.0.uploadVideoEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][0]["uploadVideoEnabled"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriverAbnormaInfo"]["dbaList"][0][
                                    "uploadVideoEnabled"
                                ]
                                    ? `IsApiDriverAbnormaInfo_${
                                          val["channelId"]
                                      }.dbaList.0.uploadVideoEnabled.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/DBA/通道${
                                          val.channelId
                                      }/驾驶员异常/一级报警/报警视频上传使能&${
                                          val["dbaList"][0][
                                              "uploadVideoEnabled"
                                          ]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiDriverAbnormaInfo_" +
                                    val.channelId +
                                    ".dbaList.0.uploadPicEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][0]["uploadPicEnabled"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriverAbnormaInfo"]["dbaList"][0][
                                    "uploadPicEnabled"
                                ]
                                    ? `IsApiDriverAbnormaInfo_${
                                          val["channelId"]
                                      }.dbaList.0.uploadPicEnabled.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/DBA/通道${
                                          val.channelId
                                      }/驾驶员异常/一级报警/报警图片上传使能&${
                                          val["dbaList"][0]["uploadPicEnabled"]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiDriverAbnormaInfo_" +
                                    val.channelId +
                                    ".dbaList.0.limitSpeed." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][0]["limitSpeed"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriverAbnormaInfo"]["dbaList"][0][
                                    "limitSpeed"
                                ]
                                    ? `IsApiDriverAbnormaInfo_${val["channelId"]}.dbaList.0.limitSpeed.${val.channelId}.channel.useless&主动安全设置/DBA/通道${val.channelId}/驾驶员异常/一级报警/报警判断速度阈值&${val["dbaList"][0]["limitSpeed"]}`
                                    : "";
                            this.formData[
                                "IsApiDriverAbnormaInfo_" +
                                    val.channelId +
                                    ".dbaList.0.sensitivity." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][0]["sensitivity"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriverAbnormaInfo"]["dbaList"][0][
                                    "sensitivity"
                                ]
                                    ? `IsApiDriverAbnormaInfo_${val["channelId"]}.dbaList.0.sensitivity.${val.channelId}.channel.useless&主动安全设置/DBA/通道${val.channelId}/驾驶员异常/一级报警/灵敏度&${val["dbaList"][0]["sensitivity"]}`
                                    : "";
                            this.formData[
                                "IsApiDriverAbnormaInfo_" +
                                    val.channelId +
                                    ".dbaList.1.enabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][1]["enabled"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriverAbnormaInfo"]["dbaList"][1][
                                    "enabled"
                                ]
                                    ? `IsApiDriverAbnormaInfo_${
                                          val["channelId"]
                                      }.dbaList.1.enabled.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/DBA/通道${
                                          val.channelId
                                      }/驾驶员异常/二级报警/驾驶员异常报警使能&${
                                          val["dbaList"][1]["enabled"]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiDriverAbnormaInfo_" +
                                    val.channelId +
                                    ".dbaList.1.uploadVideoEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][1]["uploadVideoEnabled"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriverAbnormaInfo"]["dbaList"][1][
                                    "uploadVideoEnabled"
                                ]
                                    ? `IsApiDriverAbnormaInfo_${
                                          val["channelId"]
                                      }.dbaList.1.uploadVideoEnabled.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/DBA/通道${
                                          val.channelId
                                      }/驾驶员异常/二级报警/报警视频上传使能&${
                                          val["dbaList"][1][
                                              "uploadVideoEnabled"
                                          ]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiDriverAbnormaInfo_" +
                                    val.channelId +
                                    ".dbaList.1.uploadPicEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][1]["uploadPicEnabled"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriverAbnormaInfo"]["dbaList"][1][
                                    "uploadPicEnabled"
                                ]
                                    ? `IsApiDriverAbnormaInfo_${
                                          val["channelId"]
                                      }.dbaList.1.uploadPicEnabled.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/DBA/通道${
                                          val.channelId
                                      }/驾驶员异常/二级报警/报警图片上传使能&${
                                          val["dbaList"][1]["uploadPicEnabled"]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiDriverAbnormaInfo_" +
                                    val.channelId +
                                    ".dbaList.1.limitSpeed." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][1]["limitSpeed"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriverAbnormaInfo"]["dbaList"][1][
                                    "limitSpeed"
                                ]
                                    ? `IsApiDriverAbnormaInfo_${val["channelId"]}.dbaList.1.limitSpeed.${val.channelId}.channel.useless&主动安全设置/DBA/通道${val.channelId}/驾驶员异常/二级报警/报警判断速度阈值&${val["dbaList"][1]["limitSpeed"]}`
                                    : "";
                            this.formData[
                                "IsApiDriverAbnormaInfo_" +
                                    val.channelId +
                                    ".dbaList.1.sensitivity." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][1]["sensitivity"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriverAbnormaInfo"]["dbaList"][1][
                                    "sensitivity"
                                ]
                                    ? `IsApiDriverAbnormaInfo_${val["channelId"]}.dbaList.1.sensitivity.${val.channelId}.channel.useless&主动安全设置/DBA/通道${val.channelId}/驾驶员异常/二级报警/灵敏度&${val["dbaList"][1]["sensitivity"]}`
                                    : "";
                        } else {
                            this.formData[
                                "IsApiDriverAbnormaInfo_" +
                                    val.channelId +
                                    ".dbaList.0.enabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiDriverAbnormaInfo_" +
                                    val.channelId +
                                    ".dbaList.0.uploadVideoEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiDriverAbnormaInfo_" +
                                    val.channelId +
                                    ".dbaList.0.uploadPicEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiDriverAbnormaInfo_" +
                                    val.channelId +
                                    ".dbaList.0.limitSpeed." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiDriverAbnormaInfo_" +
                                    val.channelId +
                                    ".dbaList.0.sensitivity." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiDriverAbnormaInfo_" +
                                    val.channelId +
                                    ".dbaList.1.enabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiDriverAbnormaInfo_" +
                                    val.channelId +
                                    ".dbaList.1.uploadVideoEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiDriverAbnormaInfo_" +
                                    val.channelId +
                                    ".dbaList.1.uploadPicEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiDriverAbnormaInfo_" +
                                    val.channelId +
                                    ".dbaList.1.limitSpeed." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiDriverAbnormaInfo_" +
                                    val.channelId +
                                    ".dbaList.1.sensitivity." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                        }
                        this.$emit("changeData", this.formData);
                    });
                }
            },
            deep: true,
            immediate: false,
        },
        //超时驾驶变化监听
        "form.IsApiDriveTimeInfo": {
            handler(val) {
                if (val != undefined) {
                    console.log(this.copyChannelForm);
                    this.$refs["PublicDba"].validate((valid) => {
                        if (valid) {
                            this.formData[
                                "IsApiDriveTimeInfo_" +
                                    val.channelId +
                                    ".dbaList.0.enabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][0]["enabled"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriveTimeInfo"]["dbaList"][0]["enabled"]
                                    ? `IsApiDriveTimeInfo_${
                                          val["channelId"]
                                      }.dbaList.0.enabled.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/DBA/通道${
                                          val.channelId
                                      }/超时驾驶/一级报警/超时驾驶报警使能&${
                                          val["dbaList"][0]["enabled"]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiDriveTimeInfo_" +
                                    val.channelId +
                                    ".dbaList.0.uploadVideoEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][0]["uploadVideoEnabled"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriveTimeInfo"]["dbaList"][0][
                                    "uploadVideoEnabled"
                                ]
                                    ? `IsApiDriveTimeInfo_${
                                          val["channelId"]
                                      }.dbaList.0.uploadVideoEnabled.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/DBA/通道${
                                          val.channelId
                                      }/超时驾驶/一级报警/报警视频上传使能&${
                                          val["dbaList"][0][
                                              "uploadVideoEnabled"
                                          ]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiDriveTimeInfo_" +
                                    val.channelId +
                                    ".dbaList.0.uploadPicEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][0]["uploadPicEnabled"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriveTimeInfo"]["dbaList"][0][
                                    "uploadPicEnabled"
                                ]
                                    ? `IsApiDriveTimeInfo_${
                                          val["channelId"]
                                      }.dbaList.0.uploadPicEnabled.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/DBA/通道${
                                          val.channelId
                                      }/超时驾驶/一级报警/报警图片上传使能&${
                                          val["dbaList"][0]["uploadPicEnabled"]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiDriveTimeInfo_" +
                                    val.channelId +
                                    ".dbaList.0.limitSpeed." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][0]["limitSpeed"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriveTimeInfo"]["dbaList"][0][
                                    "limitSpeed"
                                ]
                                    ? `IsApiDriveTimeInfo_${val["channelId"]}.dbaList.0.limitSpeed.${val.channelId}.channel.useless&主动安全设置/DBA/通道${val.channelId}/超时驾驶/一级报警/报警判断速度阈值&${val["dbaList"][0]["limitSpeed"]}`
                                    : "";
                            this.formData[
                                "IsApiDriveTimeInfo_" +
                                    val.channelId +
                                    ".dbaList.0.sensitivity." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][0]["sensitivity"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriveTimeInfo"]["dbaList"][0][
                                    "sensitivity"
                                ]
                                    ? `IsApiDriveTimeInfo_${val["channelId"]}.dbaList.0.sensitivity.${val.channelId}.channel.useless&主动安全设置/DBA/通道${val.channelId}/超时驾驶/一级报警/灵敏度&${val["dbaList"][0]["sensitivity"]}`
                                    : "";
                            this.formData[
                                "IsApiDriveTimeInfo_" +
                                    val.channelId +
                                    ".dbaList.1.enabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][1]["enabled"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriveTimeInfo"]["dbaList"][1]["enabled"]
                                    ? `IsApiDriveTimeInfo_${
                                          val["channelId"]
                                      }.dbaList.1.enabled.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/DBA/通道${
                                          val.channelId
                                      }/超时驾驶/二级报警/超时驾驶报警使能&${
                                          val["dbaList"][1]["enabled"]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiDriveTimeInfo_" +
                                    val.channelId +
                                    ".dbaList.1.uploadVideoEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][1]["uploadVideoEnabled"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriveTimeInfo"]["dbaList"][1][
                                    "uploadVideoEnabled"
                                ]
                                    ? `IsApiDriveTimeInfo_${
                                          val["channelId"]
                                      }.dbaList.1.uploadVideoEnabled.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/DBA/通道${
                                          val.channelId
                                      }/超时驾驶/二级报警/报警视频上传使能&${
                                          val["dbaList"][1][
                                              "uploadVideoEnabled"
                                          ]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiDriveTimeInfo_" +
                                    val.channelId +
                                    ".dbaList.1.uploadPicEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][1]["uploadPicEnabled"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriveTimeInfo"]["dbaList"][1][
                                    "uploadPicEnabled"
                                ]
                                    ? `IsApiDriveTimeInfo_${
                                          val["channelId"]
                                      }.dbaList.1.uploadPicEnabled.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/DBA/通道${
                                          val.channelId
                                      }/超时驾驶/二级报警/报警图片上传使能&${
                                          val["dbaList"][1]["uploadPicEnabled"]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiDriveTimeInfo_" +
                                    val.channelId +
                                    ".dbaList.1.limitSpeed." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][1]["limitSpeed"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriveTimeInfo"]["dbaList"][1][
                                    "limitSpeed"
                                ]
                                    ? `IsApiDriveTimeInfo_${val["channelId"]}.dbaList.1.limitSpeed.${val.channelId}.channel.useless&主动安全设置/DBA/通道${val.channelId}/超时驾驶/二级报警/报警判断速度阈值&${val["dbaList"][1]["limitSpeed"]}`
                                    : "";
                            this.formData[
                                "IsApiDriveTimeInfo_" +
                                    val.channelId +
                                    ".dbaList.1.sensitivity." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][1]["sensitivity"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriveTimeInfo"]["dbaList"][1][
                                    "sensitivity"
                                ]
                                    ? `IsApiDriveTimeInfo_${val["channelId"]}.dbaList.1.sensitivity.${val.channelId}.channel.useless&主动安全设置/DBA/通道${val.channelId}/超时驾驶/二级报警/灵敏度&${val["dbaList"][1]["sensitivity"]}`
                                    : "";
                        } else {
                            this.formData[
                                "IsApiDriveTimeInfo_" +
                                    val.channelId +
                                    ".dbaList.0.enabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiDriveTimeInfo_" +
                                    val.channelId +
                                    ".dbaList.0.uploadVideoEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiDriveTimeInfo_" +
                                    val.channelId +
                                    ".dbaList.0.uploadPicEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiDriveTimeInfo_" +
                                    val.channelId +
                                    ".dbaList.0.limitSpeed." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiDriveTimeInfo_" +
                                    val.channelId +
                                    ".dbaList.0.sensitivity." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiDriveTimeInfo_" +
                                    val.channelId +
                                    ".dbaList.1.enabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiDriveTimeInfo_" +
                                    val.channelId +
                                    ".dbaList.1.uploadVideoEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiDriveTimeInfo_" +
                                    val.channelId +
                                    ".dbaList.1.uploadPicEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiDriveTimeInfo_" +
                                    val.channelId +
                                    ".dbaList.1.limitSpeed." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiDriveTimeInfo_" +
                                    val.channelId +
                                    ".dbaList.1.sensitivity." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                        }
                        this.$emit("changeData", this.formData);
                    });
                }
            },
            deep: true,
            immediate: false,
        },
        //换人事件变化监听
        "form.IsApiDriveChangeInfo": {
            handler(val) {
                if (val != undefined) {
                    console.log(this.copyChannelForm);
                    this.$refs["PublicDba"].validate((valid) => {
                        if (valid) {
                            this.formData[
                                "IsApiDriveChangeInfo_" +
                                    val.channelId +
                                    ".dbaList.0.enabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][0]["enabled"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriveChangeInfo"]["dbaList"][0][
                                    "enabled"
                                ]
                                    ? `IsApiDriveChangeInfo_${
                                          val["channelId"]
                                      }.dbaList.0.enabled.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/DBA/通道${
                                          val.channelId
                                      }/换人事件/一级报警/换人事件报警使能&${
                                          val["dbaList"][0]["enabled"]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiDriveChangeInfo_" +
                                    val.channelId +
                                    ".dbaList.0.uploadVideoEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][0]["uploadVideoEnabled"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriveChangeInfo"]["dbaList"][0][
                                    "uploadVideoEnabled"
                                ]
                                    ? `IsApiDriveChangeInfo_${
                                          val["channelId"]
                                      }.dbaList.0.uploadVideoEnabled.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/DBA/通道${
                                          val.channelId
                                      }/换人事件/一级报警/报警视频上传使能&${
                                          val["dbaList"][0][
                                              "uploadVideoEnabled"
                                          ]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiDriveChangeInfo_" +
                                    val.channelId +
                                    ".dbaList.0.uploadPicEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][0]["uploadPicEnabled"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriveChangeInfo"]["dbaList"][0][
                                    "uploadPicEnabled"
                                ]
                                    ? `IsApiDriveChangeInfo_${
                                          val["channelId"]
                                      }.dbaList.0.uploadPicEnabled.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/DBA/通道${
                                          val.channelId
                                      }/换人事件/一级报警/报警图片上传使能&${
                                          val["dbaList"][0]["uploadPicEnabled"]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiDriveChangeInfo_" +
                                    val.channelId +
                                    ".dbaList.0.limitSpeed." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][0]["limitSpeed"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriveChangeInfo"]["dbaList"][0][
                                    "limitSpeed"
                                ]
                                    ? `IsApiDriveChangeInfo_${val["channelId"]}.dbaList.0.limitSpeed.${val.channelId}.channel.useless&主动安全设置/DBA/通道${val.channelId}/换人事件/一级报警/报警判断速度阈值&${val["dbaList"][0]["limitSpeed"]}`
                                    : "";
                            this.formData[
                                "IsApiDriveChangeInfo_" +
                                    val.channelId +
                                    ".dbaList.0.sensitivity." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][0]["sensitivity"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriveChangeInfo"]["dbaList"][0][
                                    "sensitivity"
                                ]
                                    ? `IsApiDriveChangeInfo_${val["channelId"]}.dbaList.0.sensitivity.${val.channelId}.channel.useless&主动安全设置/DBA/通道${val.channelId}/换人事件/一级报警/灵敏度&${val["dbaList"][0]["sensitivity"]}`
                                    : "";
                            this.formData[
                                "IsApiDriveChangeInfo_" +
                                    val.channelId +
                                    ".dbaList.1.enabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][1]["enabled"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriveChangeInfo"]["dbaList"][1][
                                    "enabled"
                                ]
                                    ? `IsApiDriveChangeInfo_${
                                          val["channelId"]
                                      }.dbaList.1.enabled.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/DBA/通道${
                                          val.channelId
                                      }/换人事件/二级报警/换人事件报警使能&${
                                          val["dbaList"][1]["enabled"]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiDriveChangeInfo_" +
                                    val.channelId +
                                    ".dbaList.1.uploadVideoEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][1]["uploadVideoEnabled"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriveChangeInfo"]["dbaList"][1][
                                    "uploadVideoEnabled"
                                ]
                                    ? `IsApiDriveChangeInfo_${
                                          val["channelId"]
                                      }.dbaList.1.uploadVideoEnabled.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/DBA/通道${
                                          val.channelId
                                      }/换人事件/二级报警/报警视频上传使能&${
                                          val["dbaList"][1][
                                              "uploadVideoEnabled"
                                          ]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiDriveChangeInfo_" +
                                    val.channelId +
                                    ".dbaList.1.uploadPicEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][1]["uploadPicEnabled"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriveChangeInfo"]["dbaList"][1][
                                    "uploadPicEnabled"
                                ]
                                    ? `IsApiDriveChangeInfo_${
                                          val["channelId"]
                                      }.dbaList.1.uploadPicEnabled.${
                                          val.channelId
                                      }.channel.useless&主动安全设置/DBA/通道${
                                          val.channelId
                                      }/换人事件/二级报警/报警图片上传使能&${
                                          val["dbaList"][1]["uploadPicEnabled"]
                                              ? "开启"
                                              : "关闭"
                                      }`
                                    : "";
                            this.formData[
                                "IsApiDriveChangeInfo_" +
                                    val.channelId +
                                    ".dbaList.1.limitSpeed." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][1]["limitSpeed"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriveChangeInfo"]["dbaList"][1][
                                    "limitSpeed"
                                ]
                                    ? `IsApiDriveChangeInfo_${val["channelId"]}.dbaList.1.limitSpeed.${val.channelId}.channel.useless&主动安全设置/DBA/通道${val.channelId}/换人事件/二级报警/报警判断速度阈值&${val["dbaList"][1]["limitSpeed"]}`
                                    : "";
                            this.formData[
                                "IsApiDriveChangeInfo_" +
                                    val.channelId +
                                    ".dbaList.1.sensitivity." +
                                    val.channelId +
                                    ".channel.useless"
                            ] =
                                val["dbaList"][1]["sensitivity"] !=
                                this.copyChannelForm[
                                    "channel_" + val.channelId
                                ]["IsApiDriveChangeInfo"]["dbaList"][1][
                                    "sensitivity"
                                ]
                                    ? `IsApiDriveChangeInfo_${val["channelId"]}.dbaList.1.sensitivity.${val.channelId}.channel.useless&主动安全设置/DBA/通道${val.channelId}/换人事件/二级报警/灵敏度&${val["dbaList"][1]["sensitivity"]}`
                                    : "";
                        } else {
                            this.formData[
                                "IsApiDriveChangeInfo_" +
                                    val.channelId +
                                    ".dbaList.0.enabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiDriveChangeInfo_" +
                                    val.channelId +
                                    ".dbaList.0.uploadVideoEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiDriveChangeInfo_" +
                                    val.channelId +
                                    ".dbaList.0.uploadPicEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiDriveChangeInfo_" +
                                    val.channelId +
                                    ".dbaList.0.limitSpeed." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiDriveChangeInfo_" +
                                    val.channelId +
                                    ".dbaList.0.sensitivity." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiDriveChangeInfo_" +
                                    val.channelId +
                                    ".dbaList.1.enabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiDriveChangeInfo_" +
                                    val.channelId +
                                    ".dbaList.1.uploadVideoEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiDriveChangeInfo_" +
                                    val.channelId +
                                    ".dbaList.1.uploadPicEnabled." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiDriveChangeInfo_" +
                                    val.channelId +
                                    ".dbaList.1.limitSpeed." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                            this.formData[
                                "IsApiDriveChangeInfo_" +
                                    val.channelId +
                                    ".dbaList.1.sensitivity." +
                                    val.channelId +
                                    ".channel.useless"
                            ] = "";
                        }
                        this.$emit("changeData", this.formData);
                    });
                }
            },
            deep: true,
            immediate: false,
        },
    },
    data() {
        return {
            activeChannel: "",
            channelList: [],
            form: {},
            volume: 50,
            channelForm: {},
            copyChannelForm: {},
            copyForm: {},
            formData: {},
            capabilitiesEmit: {},
            checkNumber: function (rule, value, callback) {
                if (value !== "" && value !== null && value !== undefined) {
                    if (!validateNum(value)) {
                        callback(new Error("请输入正确的整数"));
                    } else if (value < this.min) {
                        callback(new Error(`最小值为${this.min}`));
                    } else if (value > this.max) {
                        callback(new Error(`最大值为${this.max}`));
                    } else if (
                        (this.type == "short" && value > 32767) ||
                        (this.type == "byte" && value > 127) ||
                        (this.type == "int" && value > Math.pow(2, 31) - 1)
                    ) {
                        callback(new Error("输入的数值超出有效范围"));
                    } else {
                        callback();
                    }
                } else {
                    // callback(new Error("请输入"));
                    callback();
                }
            },
            activeName: "first",
            dialogVisible: false,
            sendEveryVolume: false,
            showDeploy: false,
            currentCommandId: "",
            currentIsApiTriggerInfo: "",
            tablist: [
                {
                    name: "疲劳驾驶",
                    shortName: "疲劳驾驶",
                    commandId: "IsApiDriverEyeClosedInfo",
                    IsApiTriggerInfo: "IsApiDriverEyeClosedTriggerList",
                    capability: "IsApiDriverEyeClosedInfoCapability",
                    alarmLevel: 1,
                },
                {
                    name: "打电话",
                    shortName: "打电话",
                    commandId: "IsApiDriverCallingInfo",
                    IsApiTriggerInfo: "IsApiDriverCallingTriggerList",
                    capability: "IsApiDriverCallingInfoCapability",
                    alarmLevel: 1,
                },
                {
                    name: "抽烟",
                    shortName: "抽烟",
                    commandId: "IsApiDriverSmokingInfo",
                    IsApiTriggerInfo: "IsApiDriverSmokingTriggerList",
                    capability: "IsApiDriverSmokingInfoCapability",
                    alarmLevel: 1,
                },
                {
                    name: "注意力不集中",
                    shortName: "注意力不集中",
                    commandId: "IsApiDriverInattentionInfo",
                    IsApiTriggerInfo: "IsApiDriverInattentionTriggerList",
                    capability: "IsApiDriverInattentionInfoCapability",
                    alarmLevel: 1,
                },
                {
                    name: "驾驶员离岗",
                    shortName: "驾驶员离岗",
                    commandId: "IsApiDriverAbsentedInfo",
                    IsApiTriggerInfo: "IsApiDriverAbsentedTriggerList",
                    capability: "IsApiDriverAbsentedInfoCapability",
                    alarmLevel: 1,
                },
                {
                    name: "摄像头遮挡",
                    shortName: "摄像头遮挡",
                    commandId: "IsApiDriverBlockCameraInfo",
                    IsApiTriggerInfo: "IsApiDriverBlockCameraTriggerList",
                    capability: "IsApiDriverBlockCameraInfoCapability",
                    alarmLevel: 1,
                },
                {
                    name: "未系安全带",
                    shortName: "未系安全带",
                    commandId: "IsApiDriverSafetyBeltInfo",
                    IsApiTriggerInfo: "IsApiDriverSafetyBeltTriggerList",
                    capability: "IsApiDriverSafetyBeltInfoCapability",
                    alarmLevel: 1,
                },
                {
                    name: "墨镜",
                    shortName: "墨镜",
                    commandId: "IsApiDriverSunglassesInfo",
                    IsApiTriggerInfo: "IsApiDriverSunglassesTriggerList",
                    capability: "IsApiDriverSunglassesInfoCapability",
                    alarmLevel: 1,
                },
                // {
                //   name: '急加速',
                //   shortName: '急加速',
                //   commandId:'IsApiRapidAccelerationInfo',
                //   IsApiTriggerInfo:'IsApiRapidAccelerationTriggerList',
                //   capability:'IsApiRapidAccelerationInfoCapability',
                //   alarmLevel: 1
                // },
                // {
                //   name: '急减速',
                //   shortName: '急减速',
                //   commandId:'IsApiRapidDecelerationInfo',
                //   IsApiTriggerInfo:'IsApiRapidDecelerationTriggerList',
                //   capability:'IsApiRapidDecelerationInfoCapability',
                //   alarmLevel: 1
                // },
                // {
                //   name: '急转弯',
                //   shortName: '急转弯',
                //   commandId:'IsApiRapidTurnInfo',
                //   IsApiTriggerInfo:'IsApiRapidTurnTriggerList',
                //   capability:'IsApiRapidTurnInfoCapability',
                //   alarmLevel: 1
                // },
                // {
                //   name: '驾驶员异常',
                //   shortName: '驾驶员异常',
                //   commandId:'IsApiDriverAbnormaInfo',
                //   IsApiTriggerInfo:'IsApiDriverAbnormaTriggerList',
                //   capability:'IsApiDriverAbnormaInfoCapability',
                //   alarmLevel: 1
                // },
                // {
                //   name: '超时驾驶',
                //   shortName: '超时驾驶',
                //   commandId:'IsApiDriveTimeInfo',
                //   IsApiTriggerInfo:'IsApiDriveTimeTriggerList',
                //   capability:'IsApiDriveTimeInfoCapability',
                //   alarmLevel: 1
                // },
                // {
                //   name: '换人事件',
                //   shortName: '换人事件',
                //   commandId:'IsApiDriveChangeInfo',
                //   IsApiTriggerInfo:'IsApiDriveChangeTriggerList',
                //   capability:'IsApiDriveChangeInfoCapability',
                //   alarmLevel: 1
                // }
            ],
        };
    },
    methods: {
        send() {
            this.everyVolume = true;
            this.sendEveryVolume = true;
            let findFlag = 0;
            let tabLength = this.tablist.length;
            for (let i = 0; i < this.tablist.length; i++) {
                let params = {
                    deviceId: this.$route.query.deviceId || null,
                    channelId: this.activeChannel,
                    commandIds: [this.tablist[i].IsApiTriggerInfo],
                }; //['EventRuleTriggerList'][iIndex]['EventTriggerList'][0]['Audio'].volume
                if (
                    this.channelForm["channel_" + this.activeChannel][
                        this.tablist[i].IsApiTriggerInfo
                    ]
                ) {
                    this.channelForm["channel_" + this.activeChannel][
                        this.tablist[i].IsApiTriggerInfo
                    ]["EventRuleTriggerList"].forEach((item_) => {
                        item_["EventTriggerList"][0]["Audio"][volume] =
                            this.volume;
                    });
                    this.dialogVisible = false;
                } else {
                    this.$api
                        .getDeviceConfigParamsByIsApi(params)
                        .then((res) => {
                            if (res.success == true) {
                                let resData = JSON.parse(res.data);
                                console.log(resData);
                                if (
                                    !resData[this.tablist[i].IsApiTriggerInfo][
                                        "statusCode"
                                    ]
                                ) {
                                    this.copyChannelForm[
                                        "channel_" + this.activeChannel
                                    ] = Object.assign(
                                        {},
                                        this.copyChannelForm[
                                            "channel_" + this.activeChannel
                                        ],
                                        JSON.parse(JSON.stringify(resData))
                                    );
                                    this.form = Object.assign(
                                        {},
                                        this.form,
                                        resData
                                    );
                                    this.channelForm[
                                        "channel_" + this.activeChannel
                                    ] = Object.assign(
                                        {},
                                        this.channelForm[
                                            "channel_" + this.activeChannel
                                        ],
                                        resData
                                    );
                                    if (
                                        !this.channelForm[
                                            "channel_" + this.activeChannel
                                        ][this.tablist[i].IsApiTriggerInfo][
                                            "statusCode"
                                        ]
                                    ) {
                                        this.channelForm[
                                            "channel_" + this.activeChannel
                                        ][this.tablist[i].IsApiTriggerInfo][
                                            "EventRuleTriggerList"
                                        ].forEach((item_) => {
                                            item_["EventTriggerList"][0][
                                                "Audio"
                                            ]["volume"] = this.volume;
                                        });
                                    }
                                    this.copyForm = Object.assign(
                                        {},
                                        this.copyForm,
                                        JSON.parse(JSON.stringify(resData))
                                    );
                                    this.capabilitiesEmit = JSON.parse(
                                        res.data
                                    )[this.currentCommandId];
                                }
                                if (i == tabLength - 1) {
                                    this.$message.success(
                                        "全局音量设置成功，请先下发！"
                                    );
                                    this.sendEveryVolume = false;
                                    this.dialogVisible = false;
                                }
                            } else {
                                this.sendEveryVolume = false;
                                this.$message.error(
                                    "获取设备配置参数失败:" + res.msg
                                );
                            }
                        });
                }
            }
        },
        getByIsApi(tabName, channel, type) {
            if (Boolean(this.isTemplate) == true) {
                this.tablist.forEach((tab) => {
                    if (tab.name == tabName) {
                        // console.log(tab.name);
                        // console.log(tab.commandId);
                        // params.commandIds.push(tab.commandId,tab.IsApiTriggerInfo)
                        this.currentCommandId = tab.commandId;
                        this.currentIsApiTriggerInfo = tab.IsApiTriggerInfo;
                        this.showDeploy = true;
                    }
                });
                return;
            }
            let params = {
                deviceId: this.$route.query.deviceId || null,
                commandIds: [],
                channelId: channel,
            };
            let findFlag = 0;
            if (tabName == "first") {
                if (this.channelForm["channel_" + channel] == undefined) {
                    params.commandIds.push("IsApiDBAGlobal");
                } else if (
                    this.channelForm["channel_" + channel]["IsApiDBAGlobal"]
                ) {
                    this.form["IsApiDBAGlobal"] =
                        this.channelForm["channel_" + channel][
                            "IsApiDBAGlobal"
                        ];
                } else {
                    params.commandIds.push("IsApiDBAGlobal");
                }
                findFlag++;
            } else {
                this.tablist.forEach((tab) => {
                    if (tab.name == tabName) {
                        if (type) {
                            if (
                                this.channelForm["channel_" + channel] ==
                                undefined
                            ) {
                                params.commandIds.push("IsApiDBAGlobal");
                            } else if (
                                this.channelForm["channel_" + channel][
                                    "IsApiDBAGlobal"
                                ]
                            ) {
                                this.form["IsApiDBAGlobal"] =
                                    this.channelForm["channel_" + channel][
                                        "IsApiDBAGlobal"
                                    ];
                            } else {
                                params.commandIds.push("IsApiDBAGlobal");
                            }
                            if (
                                !this.channelForm["channel_" + channel][
                                    tab.commandId
                                ]
                            ) {
                                params.commandIds.push(tab.commandId);
                            } else {
                                this.form[tab.commandId] =
                                    this.channelForm["channel_" + channel][
                                        tab.commandId
                                    ];
                                this.form[tab.capability] =
                                    this.channelForm["channel_" + channel][
                                        tab.capability
                                    ];
                            }
                            if (
                                !this.channelForm["channel_" + channel][
                                    tab.IsApiTriggerInfo
                                ]
                            ) {
                                params.commandIds.push(tab.IsApiTriggerInfo);
                            } else {
                                this.form[tab.IsApiTriggerInfo] =
                                    this.channelForm["channel_" + channel][
                                        tab.IsApiTriggerInfo
                                    ];
                            }
                        } else {
                            if (
                                this.channelForm["channel_" + channel] ==
                                undefined
                            ) {
                                params.commandIds.push("IsApiDBAGlobal");
                                params.commandIds.push(tab.commandId);
                                params.commandIds.push(tab.IsApiTriggerInfo);
                            }
                        }
                        // params.commandIds.push('IsApiDBAGlobal');
                        // params.commandIds.push(tab.commandId,tab.IsApiTriggerInfo)
                        this.currentCommandId = tab.commandId;
                        this.currentIsApiTriggerInfo = tab.IsApiTriggerInfo;
                        findFlag++;
                    }
                });
            }
            if (!type) {
                this.$emit("adasCommandId", this.currentCommandId);
                this.$emit(
                    "currentIsApiTriggerInfos",
                    this.currentIsApiTriggerInfo
                );
            }
            if (!findFlag) return;
            if (!params.commandIds.length) return;
            this.$api.getDeviceConfigParamsByIsApi(params).then((res) => {
                if (res.success == true) {
                    let resData = JSON.parse(res.data);
                    this.form = Object.assign({}, this.form, resData);
                    this.copyForm = Object.assign(
                        {},
                        this.copyForm,
                        JSON.parse(JSON.stringify(resData))
                    );
                    this.channelForm["channel_" + this.activeChannel] =
                        Object.assign(
                            {},
                            this.channelForm["channel_" + this.activeChannel],
                            resData
                        );
                    this.copyChannelForm["channel_" + this.activeChannel] =
                        Object.assign(
                            {},
                            this.copyChannelForm[
                                "channel_" + this.activeChannel
                            ],
                            JSON.parse(JSON.stringify(resData))
                        );
                    this.$nextTick(() => {
                        if (!document.querySelector("#title")) {
                            this.$message.info(
                                "获取设备配置异常，请点击“刷新最新配置”"
                            );
                        }
                    });
                } else {
                    this.$message.error("获取设备配置参数失败:" + res.msg);
                }
            });
        },
        openDialog() {
            this.dialogVisible = true;
        },
        beforeLeave(activeName, oldActiveName) {
            this.$refs.PublicDba.validate((valid) => {
                if (!valid) {
                    this.$message.warning("当前表单验证不通过，请先完善！");
                    return new Promise((resolve, reject) => {
                        valid == true;
                    })
                        .then(() => {
                            resolve();
                        })
                        .catch(reject(err));
                }
            });
        },
        changeChannel(channel) {
            this.activeChannel = channel;
            this.getByIsApi(this.activeName, channel, false);
        },
        changeAlarmLevel(label, type) {
            if (label.alarmLevel == type) return;
            this.$refs.PublicDba.validate((valid) => {
                if (!valid) {
                    this.$message.warning("当前表单验证不通过，请先完善！");
                    label.alarmLevel = type == 1 ? 2 : 1;
                } else {
                    label.alarmLevel = type;
                }
            });
        },
    },
    created() {
        // this.getByIsApi();
    },
    mounted() {
        // console.log(this.form)
    },
};
</script>

<style lang="less" scoped>
.alarmLevelBox {
    padding-bottom: 8px;
}
.prompt {
    display: block;
    width: 36%;
    font-size: 14px;
    color: darkgray;
    margin-top: 10px;
}
</style>
