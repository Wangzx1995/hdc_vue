<template>
    <div class="p-a-md">
        <el-form
            ref="PrivateDbaForm"
            label-position="top"
            :model="form"
            label-width="120px"
            style="margin-top: 10px"
        >
            <el-dialog
                title="DBA全局音量调整"
                :visible.sync="dialogVisible"
                top="35%"
            >
                <div class="p-a-md">
                    <p class="m-b-sm">
                        点击确定后DBA所有报警项音量将调整为该值,下发至终端成功后生效。
                    </p>
                    <el-slider
                        v-model="volume"
                        :min="
                            tabAndConfiguration[0].tabList[0].capabilitys[0]
                                .volume.min
                        "
                        :max="
                            tabAndConfiguration[0].tabList[0].capabilitys[0]
                                .volume.max
                        "
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
            <div id="title" class="channels">
                <el-button
                    :type="item['chanNo'] == activeChannel ? 'info' : ''"
                    v-for="item in tabAndConfiguration"
                    @click="changeChannel(item['chanNo'], index)"
                    :key="item['chanNo']"
                    >通道{{ item["chanNo"] }}</el-button
                >
            </div>
            <el-tabs
                v-show="activeChannel == item['chanNo']"
                v-for="(item, index) in tabAndConfiguration"
                :key="index"
                v-model="activeName"
                :before-leave="beforeLeave"
                @tab-click="getPrivateProcotol(activeName, item, '', '')"
            >
                <el-tab-pane
                    label="DBA全局配置"
                    name="DBA全局配置"
                    v-if="
                        (deviceCapability['intelliDrive_DBA'][index][
                            'enable'
                        ] &&
                            deviceCapability['intelliDrive_DBA'][index][
                                'enable'
                            ].length) ||
                        deviceCapability['intelliDrive_DBA'][index][
                            'speedCalibration'
                        ]
                    "
                >
                    <template v-if="form['param905_']">
                        <div class="configurations">
                            <div class="configuration-item">
                                <el-form-item
                                    label="DBA全局音量配置"
                                    v-if="!Boolean(this.isTemplate)"
                                >
                                    <el-button
                                        v-if="isTemplate != 'true'"
                                        @click="openDialog"
                                        >DBA全局音量配置</el-button
                                    >
                                    <span
                                        v-if="isTemplate != 'true'"
                                        class="prompt"
                                        >全局音量是为了方便用户统一设置各子项音量增加的配置，实际设备中无此项配置，故获取时此配置无意义。</span
                                    >
                                </el-form-item>
                            </div>
                            <div
                                v-if="
                                    deviceCapability['intelliDrive_DBA'][index][
                                        'enable'
                                    ] &&
                                    deviceCapability['intelliDrive_DBA'][index][
                                        'enable'
                                    ].length
                                "
                                class="configuration-item"
                            >
                                <el-form-item
                                    label="DBA全局报警使能"
                                    description="此项配置控制算法，不是统一配置子报警使能"
                                >
                                    <el-switch
                                        v-model="form['param905_'].enable"
                                        :active-value="Number(1)"
                                        :inactive-value="Number(0)"
                                    ></el-switch>
                                </el-form-item>
                            </div>
                            <div
                                v-if="
                                    deviceCapability['intelliDrive_DBA'][index][
                                        'speedCalibration'
                                    ]
                                "
                                class="configuration-item"
                            >
                                <el-form-item label="DBA全局报警使能">
                                    <el-button>DBA全局标定</el-button>
                                </el-form-item>
                            </div>
                        </div>
                    </template>
                </el-tab-pane>
                <el-tab-pane
                    v-for="(item_, index_) in item['tabList']"
                    :key="index_"
                    :name="item_['name']"
                    :label="item_['name']"
                >
                    <div class="alarmLevelBox">
                        <el-button
                            v-for="(_item, _index) in item_['types']"
                            :key="_index"
                            @click="
                                changeAlarmLevel(_item, _index, index, index_)
                            "
                            :type="_item == chooseType ? 'primary' : 'default'"
                            >{{ !_index ? "一级报警" : "二级报警" }}</el-button
                        >
                    </div>
                    <template v-if="form['param905_' + chooseType]">
                        <div class="configurations">
                            <div
                                v-if="
                                    chooseType == item_['types'][chooseIndex] &&
                                    item_['capabilitys'][chooseIndex][
                                        'enable'
                                    ] &&
                                    item_['capabilitys'][chooseIndex]['enable']
                                        .length
                                "
                                class="configuration-item"
                            >
                                <el-form-item label=" 报警使能">
                                    <el-switch
                                        v-model="
                                            form['param905_' + chooseType][
                                                'info'
                                            ][0].enable
                                        "
                                        :active-value="Number(1)"
                                        :inactive-value="Number(0)"
                                    ></el-switch>
                                </el-form-item>
                            </div>
                            <div
                                v-if="
                                    chooseType == item_['types'][chooseIndex] &&
                                    item_['capabilitys'][chooseIndex]['speed']
                                "
                                class="configuration-item"
                            >
                                <el-form-item
                                    label="报警判断速度阈值"
                                    :prop="
                                        'param905_' +
                                        chooseType +
                                        '.info.0.speed'
                                    "
                                    :rules="{
                                        validator: checkNumber.bind({
                                            type: 'int',
                                            min: item_['capabilitys'][
                                                chooseIndex
                                            ]['speed']['min'],
                                            max: item_['capabilitys'][
                                                chooseIndex
                                            ]['speed']['max'],
                                        }),
                                        trigger: 'blur',
                                    }"
                                >
                                    <el-input
                                        tips-placement="top-end"
                                        :tips="`键入值范围为${item_['capabilitys'][chooseIndex]['speed']['min']}~${item_['capabilitys'][chooseIndex]['speed']['max']}`"
                                        v-model.number="
                                            form['param905_' + chooseType][
                                                'info'
                                            ][0]['speed']
                                        "
                                        ><span slot="suffix"
                                            >km/h</span
                                        ></el-input
                                    >
                                </el-form-item>
                            </div>
                            <div
                                v-if="
                                    chooseType == item_['types'][chooseIndex] &&
                                    item_['capabilitys'][chooseIndex][
                                        'confidence'
                                    ]
                                "
                                class="configuration-item"
                            >
                                <!-- <el-form-item
                                    label="算法置信度"
                                    :prop="
                                        'param905_' +
                                        chooseType +
                                        '.info.0.confidence'
                                    "
                                    :rules="{
                                        validator: checkNumber.bind({
                                            type: 'int',
                                            min: item_['capabilitys'][
                                                chooseIndex
                                            ]['confidence']['min'],
                                            max: item_['capabilitys'][
                                                chooseIndex
                                            ]['confidence']['max'],
                                        }),
                                        trigger: 'blur',
                                    }"
                                >
                                    <el-input
                                        tips-placement="top-end"
                                        :tips="`键入值范围为${item_['capabilitys'][chooseIndex]['confidence']['min']}~${item_['capabilitys'][chooseIndex]['confidence']['max']}`"
                                        v-model.number="
                                            form['param905_' + chooseType][
                                                'info'
                                            ][0]['confidence']
                                        "
                                        ><span slot="suffix">%</span></el-input
                                    >
                                </el-form-item> -->
                                <el-form-item label="算法置信度">
                                    <el-select
                                        v-model="
                                            form['param905_' + chooseType][
                                                'info'
                                            ][0]['confidence']
                                        "
                                    >
                                        <el-option
                                            v-for="_item in item_[
                                                'capabilitys'
                                            ][chooseIndex]['confidenceList']"
                                            :value="_item.value"
                                            :key="_item.value"
                                            :label="_item.label"
                                        ></el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                            <div
                                v-if="
                                    chooseType == item_['types'][chooseIndex] &&
                                    item_['capabilitys'][chooseIndex][
                                        'sensitivity'
                                    ]
                                "
                                class="configuration-item"
                            >
                                <!-- <el-form-item
                                    label="算法灵敏度"
                                    :prop="
                                        'param905_' +
                                        chooseType +
                                        '.info.0.sensitivity'
                                    "
                                    :rules="{
                                        validator: checkNumber.bind({
                                            type: 'int',
                                            min: item_['capabilitys'][
                                                chooseIndex
                                            ]['sensitivity']['min'],
                                            max: item_['capabilitys'][
                                                chooseIndex
                                            ]['sensitivity']['max'],
                                        }),
                                        trigger: 'blur',
                                    }"
                                >
                                    <el-input
                                        tips-placement="top-end"
                                        :tips="`键入值范围为${item_['capabilitys'][chooseIndex]['sensitivity']['min']}~${item_['capabilitys'][chooseIndex]['sensitivity']['max']}`"
                                        v-model.number="
                                            form['param905_' + chooseType][
                                                'info'
                                            ][0]['sensitivity']
                                        "
                                    ></el-input>
                                </el-form-item> -->
                                <el-form-item label="算法灵敏度">
                                    <el-select
                                        v-model="
                                            form['param905_' + chooseType][
                                                'info'
                                            ][0]['sensitivity']
                                        "
                                    >
                                        <el-option
                                            v-for="_item in item_[
                                                'capabilitys'
                                            ][chooseIndex]['sensitivityList']"
                                            :value="_item.value"
                                            :key="_item.value"
                                            :label="_item.label"
                                        ></el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                            <div
                                v-if="
                                    chooseType == item_['types'][chooseIndex] &&
                                    item_['capabilitys'][chooseIndex][
                                        'volumeEnable'
                                    ] &&
                                    item_['capabilitys'][chooseIndex][
                                        'volumeEnable'
                                    ].length
                                "
                                class="configuration-item"
                            >
                                <el-form-item label="音量使能">
                                    <el-switch
                                        v-model="
                                            form['param905_' + chooseType][
                                                'info'
                                            ][0]['volumeEnable']
                                        "
                                        :active-value="Number(1)"
                                        :inactive-value="Number(0)"
                                    ></el-switch>
                                </el-form-item>
                            </div>
                            <div
                                v-if="
                                    chooseType == item_['types'][chooseIndex] &&
                                    item_['capabilitys'][chooseIndex]['volume']
                                "
                                class="configuration-item"
                            >
                                <el-form-item label="报警音量">
                                    <el-slider
                                        v-model="
                                            form['param905_' + chooseType][
                                                'info'
                                            ][0]['volume']
                                        "
                                        :min="
                                            item_['capabilitys'][chooseIndex][
                                                'volume'
                                            ]['min']
                                        "
                                        :max="
                                            item_['capabilitys'][chooseIndex][
                                                'volume'
                                            ]['max']
                                        "
                                        :step="1"
                                        show-input
                                    ></el-slider>
                                </el-form-item>
                            </div>
                            <div
                                v-if="
                                    chooseType == item_['types'][chooseIndex] &&
                                    item_['capabilitys'][chooseIndex][
                                        'snapshot'
                                    ] &&
                                    item_['capabilitys'][chooseIndex][
                                        'snapshot'
                                    ]['upload'] &&
                                    item_['capabilitys'][chooseIndex][
                                        'snapshot'
                                    ]['upload'].length
                                "
                                class="configuration-item"
                            >
                                <el-form-item label="报警图片上传使能">
                                    <el-switch
                                        v-model="
                                            form['param905_' + chooseType][
                                                'info'
                                            ][0]['snapshot']['upload']
                                        "
                                        :active-value="Number(1)"
                                        :inactive-value="Number(0)"
                                    ></el-switch>
                                </el-form-item>
                            </div>
                            <div
                                v-if="
                                    chooseType == item_['types'][chooseIndex] &&
                                    item_['capabilitys'][chooseIndex][
                                        'snapshot'
                                    ] &&
                                    item_['capabilitys'][chooseIndex][
                                        'snapshot'
                                    ]['save'] &&
                                    item_['capabilitys'][chooseIndex][
                                        'snapshot'
                                    ]['save'].length
                                "
                                class="configuration-item"
                            >
                                <el-form-item label="报警图片保存使能">
                                    <el-switch
                                        v-model="
                                            form['param905_' + chooseType][
                                                'info'
                                            ][0]['snapshot']['save']
                                        "
                                        :active-value="Number(1)"
                                        :inactive-value="Number(0)"
                                    ></el-switch>
                                </el-form-item>
                            </div>
                            <div
                                v-if="
                                    chooseType == item_['types'][chooseIndex] &&
                                    item_['capabilitys'][chooseIndex]['clip'] &&
                                    item_['capabilitys'][chooseIndex]['clip'][
                                        'upload'
                                    ] &&
                                    item_['capabilitys'][chooseIndex]['clip'][
                                        'upload'
                                    ].length
                                "
                                class="configuration-item"
                            >
                                <el-form-item label="报警视频上传使能">
                                    <el-switch
                                        v-model="
                                            form['param905_' + chooseType][
                                                'info'
                                            ][0]['clip']['upload']
                                        "
                                        :active-value="Number(1)"
                                        :inactive-value="Number(0)"
                                    ></el-switch>
                                </el-form-item>
                            </div>
                            <div
                                v-if="
                                    chooseType == item_['types'][chooseIndex] &&
                                    item_['capabilitys'][chooseIndex]['clip'] &&
                                    item_['capabilitys'][chooseIndex]['clip'][
                                        'save'
                                    ] &&
                                    item_['capabilitys'][chooseIndex]['clip'][
                                        'save'
                                    ].length
                                "
                                class="configuration-item"
                            >
                                <el-form-item label="报警视频保存使能">
                                    <el-switch
                                        v-model="
                                            form['param905_' + chooseType][
                                                'info'
                                            ][0]['clip']['save']
                                        "
                                        :active-value="Number(1)"
                                        :inactive-value="Number(0)"
                                    ></el-switch>
                                </el-form-item>
                            </div>
                            <div
                                v-if="
                                    chooseType == item_['types'][chooseIndex] &&
                                    item_['capabilitys'][chooseIndex][
                                        'uploadEventPlatform'
                                    ] &&
                                    item_['capabilitys'][chooseIndex][
                                        'uploadEventPlatform'
                                    ].length
                                "
                                class="configuration-item"
                            >
                                <el-form-item label="事件上传平台设置">
                                    <el-select
                                        multiple
                                        multiple-nowrap
                                        v-model="
                                            form['param905_' + chooseType][
                                                'info'
                                            ][0]['uploadEventPlatform']
                                        "
                                    >
                                        <el-option
                                            v-for="_item in item_[
                                                'capabilitys'
                                            ][chooseIndex][
                                                'uploadEventPlatform'
                                            ]"
                                            :value="_item"
                                            :key="_item"
                                            :label="'第' + _item + '中心'"
                                        ></el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                        </div>
                    </template>
                </el-tab-pane>
            </el-tabs>
        </el-form>
    </div>
</template>

<script>
import { validateNum } from "@/utils/validate";
export default {
    props: {
        allCapability: {
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
        originalForm: {
            type: Object,
            default: () => {
                return {};
            },
        },
        setStatisticsData: {
            type: Object,
            default: () => {
                return {};
            },
        },
        allEnumerationData: {
            type: Object,
            default: () => {
                return {};
            },
        },
        setConfigParams: {
            type: Boolean,
            default: false,
        },
        isTemplate: {
            type: String,
        },
    },
    watch: {
        allCapability: {
            handler(val) {
                if (val) {
                    this.deviceCapability = val;
                    this.activeChannel = val["intelliDrive_DBA"][0]["chanNo"];
                    this.makeTabList();
                }
            },
            deep: true,
            immediate: true,
        },
        formDetail: {
            handler(val) {
                if (val) {
                    this.form = val;
                }
            },
            deep: true,
            immediate: true,
        },
        originalForm: {
            handler(val) {
                if (val) {
                    this.copyForm = val;
                }
            },
            deep: true,
            immediate: true,
        },
        form: {
            handler(val) {
                if (val) {
                    this.$emit("change", val);
                }
            },
            deep: true,
            immediate: true,
        },
        copyForm: {
            handler(val) {
                if (val) {
                    this.$emit("changeCopy", val);
                }
            },
            deep: true,
            immediate: false,
        },
        setStatisticsData: {
            handler(val) {
                if (val) {
                    this.formData = val;
                }
            },
            deep: true,
            immediate: true,
        },
        allEnumerationData: {
            handler(val) {
                if (val) {
                    this.dictionaryData = val;
                }
            },
            deep: true,
            immediate: true,
        },
        setConfigParams: {
            handler(val) {
                if (val) {
                    this.childConfigParams = val;
                    this.getPrivateProcotol(
                        this.activeName,
                        this.tabAndConfiguration[this.chanNoIndex],
                        "",
                        "",
                        true
                    );
                }
            },
            deep: true,
            immediate: true,
        },
        childConfigParams: {
            handler(val) {
                this.$emit("changeConfigParams", val);
            },
            deep: true,
            immediate: true,
        },
        "form.param905_": {
            handler(val) {
                if (val && !Boolean(this.isTemplate) && this.activeChannel) {
                    this.formData[
                        "param905_." + this.activeChannel + ".enable.useless"
                    ] =
                        val["enable"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_"
                        ]["enable"]
                            ? `param905_.${
                                  this.activeChannel
                              }.enable.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/DBA全局配置&${val["enable"] ? "开启" : "关闭"}`
                            : "";
                    this.$emit("formDataChange", this.formData);
                }
            },
            deep: true,
            immediate: true,
        },
        "form.param905_0": {
            handler(val) {
                if (val && !Boolean(this.isTemplate)) {
                    this.formData[
                        "param905_0." +
                            this.activeChannel +
                            ".info.0.enable.useless.useless.useless"
                    ] =
                        val["info"][0]["enable"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_0"
                        ]["info"][0]["enable"]
                            ? `param905_0.${
                                  this.activeChannel
                              }.info.0.enable.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/疲劳驾驶/一级报警/报警使能&${
                                  val["info"][0]["enable"] ? "开启" : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_0"
                                  ]["info"][0]["enable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_0." +
                            this.activeChannel +
                            ".info.0.speed.useless.useless.useless"
                    ] =
                        val["info"][0]["speed"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_0"
                        ]["info"][0]["speed"]
                            ? `param905_0.${
                                  this.activeChannel
                              }.info.0.speed.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/疲劳驾驶/一级报警/报警判断速度阈值&${
                                  val["info"][0]["speed"]
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_0"
                                  ]["info"][0]["speed"]
                              }`
                            : "";
                    this.formData[
                        "param905_0." +
                            this.activeChannel +
                            ".info.0.confidence.useless.useless.useless"
                    ] =
                        val["info"][0]["confidence"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_0"
                        ]["info"][0]["confidence"]
                            ? `param905_0.${
                                  this.activeChannel
                              }.info.0.confidence.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/疲劳驾驶/一级报警/算法置信度&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].confidenceList.find(
                                      (e) => e.value === val.info[0].confidence
                                  ).label
                              }&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].confidenceList.find(
                                      (e) =>
                                          e.value ===
                                          this.copyForm["param905"][
                                              this.activeChannel
                                          ]["param905_0"]["info"][0][
                                              "confidence"
                                          ]
                                  ).label
                              }`
                            : "";
                    this.formData[
                        "param905_0." +
                            this.activeChannel +
                            ".info.0.sensitivity.useless.useless.useless"
                    ] =
                        val["info"][0]["sensitivity"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_0"
                        ]["info"][0]["sensitivity"]
                            ? `param905_0.${
                                  this.activeChannel
                              }.info.0.sensitivity.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/疲劳驾驶/一级报警/算法灵敏度&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].sensitivityList.find(
                                      (e) => e.value === val.info[0].sensitivity
                                  ).label
                              }&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].sensitivityList.find(
                                      (e) =>
                                          e.value ===
                                          this.copyForm["param905"][
                                              this.activeChannel
                                          ]["param905_0"]["info"][0][
                                              "sensitivity"
                                          ]
                                  ).label
                              }`
                            : "";
                    this.formData[
                        "param905_0." +
                            this.activeChannel +
                            ".info.0.volume.useless.useless.useless"
                    ] =
                        val["info"][0]["volume"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_0"
                        ]["info"][0]["volume"]
                            ? `param905_0.${
                                  this.activeChannel
                              }.info.0.volume.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/疲劳驾驶/一级报警/报警音量&${
                                  val["info"][0]["volume"]
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_0"
                                  ]["info"][0]["volume"]
                              }`
                            : "";
                    this.formData[
                        "param905_0." +
                            this.activeChannel +
                            ".info.0.volumeEnable.useless.useless.useless"
                    ] =
                        val["info"][0]["volumeEnable"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_0"
                        ]["info"][0]["volumeEnable"]
                            ? `param905_0.${
                                  this.activeChannel
                              }.info.0.volumeEnable.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/疲劳驾驶/一级报警/音量使能&${
                                  val["info"][0]["volumeEnable"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_0"
                                  ]["info"][0]["volumeEnable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_0." +
                            this.activeChannel +
                            ".info.0.snapshot.upload.useless.useless.useless"
                    ] =
                        val["info"][0]["snapshot"]["upload"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_0"
                        ]["info"][0]["snapshot"]["upload"]
                            ? `param905_0.${
                                  this.activeChannel
                              }.info.0.snapshot.upload.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/疲劳驾驶/一级报警/报警图片上传使能&${
                                  val["info"][0]["snapshot"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_0"
                                  ]["info"][0]["snapshot"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_0." +
                            this.activeChannel +
                            ".info.0.clip.upload.useless.useless.useless"
                    ] =
                        val["info"][0]["clip"]["upload"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_0"
                        ]["info"][0]["clip"]["upload"]
                            ? `param905_0.${
                                  this.activeChannel
                              }.info.0.clip.upload.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/疲劳驾驶/一级报警/报警视频上传使能&${
                                  val["info"][0]["clip"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_0"
                                  ]["info"][0]["clip"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_0." +
                            this.activeChannel +
                            ".info.0.uploadEventPlatform.useless.useless.useless"
                    ] =
                        val["info"][0]["uploadEventPlatform"].join("_") !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_0"
                        ]["info"][0]["uploadEventPlatform"].join("_")
                            ? `param905_0.${
                                  this.activeChannel
                              }.info.0.uploadEventPlatform.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/疲劳驾驶/一级报警/事件上传平台设置&第${val[
                                  "info"
                              ][0]["uploadEventPlatform"].join(
                                  "、"
                              )}中心&第${this.copyForm["param905"][
                                  this.activeChannel
                              ]["param905_0"]["info"][0][
                                  "uploadEventPlatform"
                              ].join("、")}中心`
                            : "";
                    this.$emit("formDataChange", this.formData);
                }
            },
            deep: true,
            immediate: true,
        },
        "form.param905_7": {
            handler(val) {
                if (val && !Boolean(this.isTemplate)) {
                    this.formData[
                        "param905_7." +
                            this.activeChannel +
                            ".info.0.enable.useless.useless.useless"
                    ] =
                        val["info"][0]["enable"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_7"
                        ]["info"][0]["enable"]
                            ? `param905_7.${
                                  this.activeChannel
                              }.info.0.enable.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/疲劳驾驶/二级报警/报警使能&${
                                  val["info"][0]["enable"] ? "开启" : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_7"
                                  ]["info"][0]["enable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_7." +
                            this.activeChannel +
                            ".info.0.speed.useless.useless.useless"
                    ] =
                        val["info"][0]["speed"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_7"
                        ]["info"][0]["speed"]
                            ? `param905_7.${
                                  this.activeChannel
                              }.info.0.speed.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/疲劳驾驶/二级报警/报警判断速度阈值&${
                                  val["info"][0]["speed"]
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_7"
                                  ]["info"][0]["speed"]
                              }`
                            : "";
                    this.formData[
                        "param905_7." +
                            this.activeChannel +
                            ".info.0.confidence.useless.useless.useless"
                    ] =
                        val["info"][0]["confidence"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_7"
                        ]["info"][0]["confidence"]
                            ? `param905_7.${
                                  this.activeChannel
                              }.info.0.confidence.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/疲劳驾驶/二级报警/算法置信度&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].confidenceList.find(
                                      (e) => e.value === val.info[0].confidence
                                  ).label
                              }&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].confidenceList.find(
                                      (e) =>
                                          e.value ===
                                          this.copyForm["param905"][
                                              this.activeChannel
                                          ]["param905_7"]["info"][0][
                                              "confidence"
                                          ]
                                  ).label
                              }`
                            : "";
                    this.formData[
                        "param905_7." +
                            this.activeChannel +
                            ".info.0.sensitivity.useless.useless.useless"
                    ] =
                        val["info"][0]["sensitivity"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_7"
                        ]["info"][0]["sensitivity"]
                            ? `param905_7.${
                                  this.activeChannel
                              }.info.0.sensitivity.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/疲劳驾驶/二级报警/算法灵敏度&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].sensitivityList.find(
                                      (e) => e.value === val.info[0].sensitivity
                                  ).label
                              }&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].sensitivityList.find(
                                      (e) =>
                                          e.value ===
                                          this.copyForm["param905"][
                                              this.activeChannel
                                          ]["param905_7"]["info"][0][
                                              "sensitivity"
                                          ]
                                  ).label
                              }`
                            : "";
                    this.formData[
                        "param905_7." +
                            this.activeChannel +
                            ".info.0.volume.useless.useless.useless"
                    ] =
                        val["info"][0]["volume"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_7"
                        ]["info"][0]["volume"]
                            ? `param905_7.${
                                  this.activeChannel
                              }.info.0.volume.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/疲劳驾驶/二级报警/报警音量&${
                                  val["info"][0]["volume"]
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_7"
                                  ]["info"][0]["volume"]
                              }`
                            : "";
                    this.formData[
                        "param905_7." +
                            this.activeChannel +
                            ".info.0.volumeEnable.useless.useless.useless"
                    ] =
                        val["info"][0]["volumeEnable"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_7"
                        ]["info"][0]["volumeEnable"]
                            ? `param905_7.${
                                  this.activeChannel
                              }.info.0.volumeEnable.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/疲劳驾驶/二级报警/音量使能&${
                                  val["info"][0]["volumeEnable"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_7"
                                  ]["info"][0]["volumeEnable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_7." +
                            this.activeChannel +
                            ".info.0.snapshot.upload.useless.useless.useless"
                    ] =
                        val["info"][0]["snapshot"]["upload"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_7"
                        ]["info"][0]["snapshot"]["upload"]
                            ? `param905_7.${
                                  this.activeChannel
                              }.info.0.snapshot.upload.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/疲劳驾驶/二级报警/报警图片上传使能&${
                                  val["info"][0]["snapshot"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_7"
                                  ]["info"][0]["snapshot"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_7." +
                            this.activeChannel +
                            ".info.0.clip.upload.useless.useless.useless"
                    ] =
                        val["info"][0]["clip"]["upload"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_7"
                        ]["info"][0]["clip"]["upload"]
                            ? `param905_7.${
                                  this.activeChannel
                              }.info.0.clip.upload.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/疲劳驾驶/二级报警/报警视频上传使能&${
                                  val["info"][0]["clip"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_7"
                                  ]["info"][0]["clip"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_7." +
                            this.activeChannel +
                            ".info.0.uploadEventPlatform.useless.useless.useless"
                    ] =
                        val["info"][0]["uploadEventPlatform"].join("_") !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_7"
                        ]["info"][0]["uploadEventPlatform"].join("_")
                            ? `param905_7.${
                                  this.activeChannel
                              }.info.0.uploadEventPlatform.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/疲劳驾驶/二级报警/事件上传平台设置&第${val[
                                  "info"
                              ][0]["uploadEventPlatform"].join(
                                  "、"
                              )}中心&第${this.copyForm["param905"][
                                  this.activeChannel
                              ]["param905_7"]["info"][0][
                                  "uploadEventPlatform"
                              ].join("、")}中心`
                            : "";
                    this.$emit("formDataChange", this.formData);
                }
            },
            deep: true,
            immediate: true,
        },
        "form.param905_1": {
            handler(val) {
                if (val && !Boolean(this.isTemplate)) {
                    this.formData[
                        "param905_1." +
                            this.activeChannel +
                            ".info.0.enable.useless.useless.useless"
                    ] =
                        val["info"][0]["enable"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_1"
                        ]["info"][0]["enable"]
                            ? `param905_1.${
                                  this.activeChannel
                              }.info.0.enable.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/打电话/一级报警/报警使能&${
                                  val["info"][0]["enable"] ? "开启" : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_1"
                                  ]["info"][0]["enable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_1." +
                            this.activeChannel +
                            ".info.0.speed.useless.useless.useless"
                    ] =
                        val["info"][0]["speed"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_1"
                        ]["info"][0]["speed"]
                            ? `param905_1.${
                                  this.activeChannel
                              }.info.0.speed.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/打电话/一级报警/报警判断速度阈值&${
                                  val["info"][0]["speed"]
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_1"
                                  ]["info"][0]["speed"]
                              }`
                            : "";
                    this.formData[
                        "param905_1." +
                            this.activeChannel +
                            ".info.0.confidence.useless.useless.useless"
                    ] =
                        val["info"][0]["confidence"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_1"
                        ]["info"][0]["confidence"]
                            ? `param905_1.${
                                  this.activeChannel
                              }.info.0.confidence.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/打电话/一级报警/算法置信度&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].confidenceList.find(
                                      (e) => e.value === val.info[0].confidence
                                  ).label
                              }&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].confidenceList.find(
                                      (e) =>
                                          e.value ===
                                          this.copyForm["param905"][
                                              this.activeChannel
                                          ]["param905_1"]["info"][0][
                                              "confidence"
                                          ]
                                  ).label
                              }`
                            : "";
                    this.formData[
                        "param905_1." +
                            this.activeChannel +
                            ".info.0.sensitivity.useless.useless.useless"
                    ] =
                        val["info"][0]["sensitivity"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_1"
                        ]["info"][0]["sensitivity"]
                            ? `param905_1.${
                                  this.activeChannel
                              }.info.0.sensitivity.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/打电话/一级报警/算法灵敏度&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].sensitivityList.find(
                                      (e) => e.value === val.info[0].sensitivity
                                  ).label
                              }&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].sensitivityList.find(
                                      (e) =>
                                          e.value ===
                                          this.copyForm["param905"][
                                              this.activeChannel
                                          ]["param905_1"]["info"][0][
                                              "sensitivity"
                                          ]
                                  ).label
                              }`
                            : "";
                    this.formData[
                        "param905_1." +
                            this.activeChannel +
                            ".info.0.volume.useless.useless.useless"
                    ] =
                        val["info"][0]["volume"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_1"
                        ]["info"][0]["volume"]
                            ? `param905_1.${
                                  this.activeChannel
                              }.info.0.volume.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/打电话/一级报警/报警音量&${
                                  val["info"][0]["volume"]
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_1"
                                  ]["info"][0]["volume"]
                              }`
                            : "";
                    this.formData[
                        "param905_1." +
                            this.activeChannel +
                            ".info.0.volumeEnable.useless.useless.useless"
                    ] =
                        val["info"][0]["volumeEnable"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_1"
                        ]["info"][0]["volumeEnable"]
                            ? `param905_1.${
                                  this.activeChannel
                              }.info.0.volumeEnable.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/打电话/一级报警/音量使能&${
                                  val["info"][0]["volumeEnable"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_1"
                                  ]["info"][0]["volumeEnable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_1." +
                            this.activeChannel +
                            ".info.0.snapshot.upload.useless.useless.useless"
                    ] =
                        val["info"][0]["snapshot"]["upload"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_1"
                        ]["info"][0]["snapshot"]["upload"]
                            ? `param905_1.${
                                  this.activeChannel
                              }.info.0.snapshot.upload.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/打电话/一级报警/报警图片上传使能&${
                                  val["info"][0]["snapshot"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_1"
                                  ]["info"][0]["snapshot"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_1." +
                            this.activeChannel +
                            ".info.0.clip.upload.useless.useless.useless"
                    ] =
                        val["info"][0]["clip"]["upload"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_1"
                        ]["info"][0]["clip"]["upload"]
                            ? `param905_1.${
                                  this.activeChannel
                              }.info.0.clip.upload.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/打电话/一级报警/报警视频上传使能&${
                                  val["info"][0]["clip"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_1"
                                  ]["info"][0]["clip"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_1." +
                            this.activeChannel +
                            ".info.0.uploadEventPlatform.useless.useless.useless"
                    ] =
                        val["info"][0]["uploadEventPlatform"].join("_") !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_1"
                        ]["info"][0]["uploadEventPlatform"].join("_")
                            ? `param905_1.${
                                  this.activeChannel
                              }.info.0.uploadEventPlatform.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/打电话/一级报警/事件上传平台设置&第${val[
                                  "info"
                              ][0]["uploadEventPlatform"].join(
                                  "、"
                              )}中心&第${this.copyForm["param905"][
                                  this.activeChannel
                              ]["param905_1"]["info"][0][
                                  "uploadEventPlatform"
                              ].join("、")}中心`
                            : "";
                    this.$emit("formDataChange", this.formData);
                }
            },
            deep: true,
            immediate: true,
        },
        "form.param905_15": {
            handler(val) {
                if (val && !Boolean(this.isTemplate)) {
                    this.formData[
                        "param905_15." +
                            this.activeChannel +
                            ".info.0.enable.useless.useless.useless"
                    ] =
                        val["info"][0]["enable"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_15"
                        ]["info"][0]["enable"]
                            ? `param905_15.${
                                  this.activeChannel
                              }.info.0.enable.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/打电话/二级报警/报警使能&${
                                  val["info"][0]["enable"] ? "开启" : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_15"
                                  ]["info"][0]["enable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_15." +
                            this.activeChannel +
                            ".info.0.speed.useless.useless.useless"
                    ] =
                        val["info"][0]["speed"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_15"
                        ]["info"][0]["speed"]
                            ? `param905_15.${
                                  this.activeChannel
                              }.info.0.speed.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/打电话/二级报警/报警判断速度阈值&${
                                  val["info"][0]["speed"]
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_15"
                                  ]["info"][0]["speed"]
                              }`
                            : "";
                    this.formData[
                        "param905_15." +
                            this.activeChannel +
                            ".info.0.confidence.useless.useless.useless"
                    ] =
                        val["info"][0]["confidence"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_15"
                        ]["info"][0]["confidence"]
                            ? `param905_15.${
                                  this.activeChannel
                              }.info.0.confidence.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/打电话/二级报警/算法置信度&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].confidenceList.find(
                                      (e) => e.value === val.info[0].confidence
                                  ).label
                              }&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].confidenceList.find(
                                      (e) =>
                                          e.value ===
                                          this.copyForm["param905"][
                                              this.activeChannel
                                          ]["param905_15"]["info"][0][
                                              "confidence"
                                          ]
                                  ).label
                              }`
                            : "";
                    this.formData[
                        "param905_15." +
                            this.activeChannel +
                            ".info.0.sensitivity.useless.useless.useless"
                    ] =
                        val["info"][0]["sensitivity"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_15"
                        ]["info"][0]["sensitivity"]
                            ? `param905_15.${
                                  this.activeChannel
                              }.info.0.sensitivity.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/打电话/二级报警/算法灵敏度&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].sensitivityList.find(
                                      (e) => e.value === val.info[0].sensitivity
                                  ).label
                              }&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].sensitivityList.find(
                                      (e) =>
                                          e.value ===
                                          this.copyForm["param905"][
                                              this.activeChannel
                                          ]["param905_15"]["info"][0][
                                              "sensitivity"
                                          ]
                                  ).label
                              }`
                            : "";
                    this.formData[
                        "param905_15." +
                            this.activeChannel +
                            ".info.0.volume.useless.useless.useless"
                    ] =
                        val["info"][0]["volume"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_15"
                        ]["info"][0]["volume"]
                            ? `param905_15.${
                                  this.activeChannel
                              }.info.0.volume.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/打电话/二级报警/报警音量&${
                                  val["info"][0]["volume"]
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_15"
                                  ]["info"][0]["volume"]
                              }`
                            : "";
                    this.formData[
                        "param905_15." +
                            this.activeChannel +
                            ".info.0.volumeEnable.useless.useless.useless"
                    ] =
                        val["info"][0]["volumeEnable"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_15"
                        ]["info"][0]["volumeEnable"]
                            ? `param905_15.${
                                  this.activeChannel
                              }.info.0.volumeEnable.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/打电话/二级报警/音量使能&${
                                  val["info"][0]["volumeEnable"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_15"
                                  ]["info"][0]["volumeEnable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_15." +
                            this.activeChannel +
                            ".info.0.snapshot.upload.useless.useless.useless"
                    ] =
                        val["info"][0]["snapshot"]["upload"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_15"
                        ]["info"][0]["snapshot"]["upload"]
                            ? `param905_15.${
                                  this.activeChannel
                              }.info.0.snapshot.upload.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/打电话/二级报警/报警图片上传使能&${
                                  val["info"][0]["snapshot"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_15"
                                  ]["info"][0]["snapshot"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_15." +
                            this.activeChannel +
                            ".info.0.clip.upload.useless.useless.useless"
                    ] =
                        val["info"][0]["clip"]["upload"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_15"
                        ]["info"][0]["clip"]["upload"]
                            ? `param905_15.${
                                  this.activeChannel
                              }.info.0.clip.upload.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/打电话/二级报警/报警视频上传使能&${
                                  val["info"][0]["clip"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_15"
                                  ]["info"][0]["clip"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_15." +
                            this.activeChannel +
                            ".info.0.uploadEventPlatform.useless.useless.useless"
                    ] =
                        val["info"][0]["uploadEventPlatform"].join("_") !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_15"
                        ]["info"][0]["uploadEventPlatform"].join("_")
                            ? `param905_15.${
                                  this.activeChannel
                              }.info.0.uploadEventPlatform.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/打电话/二级报警/事件上传平台设置&第${val[
                                  "info"
                              ][0]["uploadEventPlatform"].join(
                                  "、"
                              )}中心&第${this.copyForm["param905"][
                                  this.activeChannel
                              ]["param905_15"]["info"][0][
                                  "uploadEventPlatform"
                              ].join("、")}中心`
                            : "";
                    this.$emit("formDataChange", this.formData);
                }
            },
            deep: true,
            immediate: true,
        },
        "form.param905_2": {
            handler(val) {
                if (val && !Boolean(this.isTemplate)) {
                    this.formData[
                        "param905_2." +
                            this.activeChannel +
                            ".info.0.enable.useless.useless.useless"
                    ] =
                        val["info"][0]["enable"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_2"
                        ]["info"][0]["enable"]
                            ? `param905_2.${
                                  this.activeChannel
                              }.info.0.enable.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/抽烟/一级报警/报警使能&${
                                  val["info"][0]["enable"] ? "开启" : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_2"
                                  ]["info"][0]["enable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_2." +
                            this.activeChannel +
                            ".info.0.speed.useless.useless.useless"
                    ] =
                        val["info"][0]["speed"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_2"
                        ]["info"][0]["speed"]
                            ? `param905_2.${
                                  this.activeChannel
                              }.info.0.speed.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/抽烟/一级报警/报警判断速度阈值&${
                                  val["info"][0]["speed"]
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_2"
                                  ]["info"][0]["speed"]
                              }`
                            : "";
                    this.formData[
                        "param905_2." +
                            this.activeChannel +
                            ".info.0.confidence.useless.useless.useless"
                    ] =
                        val["info"][0]["confidence"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_2"
                        ]["info"][0]["confidence"]
                            ? `param905_2.${
                                  this.activeChannel
                              }.info.0.confidence.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/抽烟/一级报警/算法置信度&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].confidenceList.find(
                                      (e) => e.value === val.info[0].confidence
                                  ).label
                              }&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].confidenceList.find(
                                      (e) =>
                                          e.value ===
                                          this.copyForm["param905"][
                                              this.activeChannel
                                          ]["param905_2"]["info"][0][
                                              "confidence"
                                          ]
                                  ).label
                              }`
                            : "";
                    this.formData[
                        "param905_2." +
                            this.activeChannel +
                            ".info.0.sensitivity.useless.useless.useless"
                    ] =
                        val["info"][0]["sensitivity"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_2"
                        ]["info"][0]["sensitivity"]
                            ? `param905_2.${
                                  this.activeChannel
                              }.info.0.sensitivity.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/抽烟/一级报警/算法灵敏度&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].sensitivityList.find(
                                      (e) => e.value === val.info[0].sensitivity
                                  ).label
                              }&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].sensitivityList.find(
                                      (e) =>
                                          e.value ===
                                          this.copyForm["param905"][
                                              this.activeChannel
                                          ]["param905_2"]["info"][0][
                                              "sensitivity"
                                          ]
                                  ).label
                              }`
                            : "";
                    this.formData[
                        "param905_2." +
                            this.activeChannel +
                            ".info.0.volume.useless.useless.useless"
                    ] =
                        val["info"][0]["volume"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_2"
                        ]["info"][0]["volume"]
                            ? `param905_2.${
                                  this.activeChannel
                              }.info.0.volume.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/抽烟/一级报警/报警音量&${
                                  val["info"][0]["volume"]
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_2"
                                  ]["info"][0]["volume"]
                              }`
                            : "";
                    this.formData[
                        "param905_2." +
                            this.activeChannel +
                            ".info.0.volumeEnable.useless.useless.useless"
                    ] =
                        val["info"][0]["volumeEnable"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_2"
                        ]["info"][0]["volumeEnable"]
                            ? `param905_2.${
                                  this.activeChannel
                              }.info.0.volumeEnable.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/抽烟/一级报警/音量使能&${
                                  val["info"][0]["volumeEnable"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_2"
                                  ]["info"][0]["volumeEnable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_2." +
                            this.activeChannel +
                            ".info.0.snapshot.upload.useless.useless.useless"
                    ] =
                        val["info"][0]["snapshot"]["upload"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_2"
                        ]["info"][0]["snapshot"]["upload"]
                            ? `param905_2.${
                                  this.activeChannel
                              }.info.0.snapshot.upload.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/抽烟/一级报警/报警图片上传使能&${
                                  val["info"][0]["snapshot"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_2"
                                  ]["info"][0]["snapshot"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_2." +
                            this.activeChannel +
                            ".info.0.clip.upload.useless.useless.useless"
                    ] =
                        val["info"][0]["clip"]["upload"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_2"
                        ]["info"][0]["clip"]["upload"]
                            ? `param905_2.${
                                  this.activeChannel
                              }.info.0.clip.upload.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/抽烟/一级报警/报警视频上传使能&${
                                  val["info"][0]["clip"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_2"
                                  ]["info"][0]["clip"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_2." +
                            this.activeChannel +
                            ".info.0.uploadEventPlatform.useless.useless.useless"
                    ] =
                        val["info"][0]["uploadEventPlatform"].join("_") !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_2"
                        ]["info"][0]["uploadEventPlatform"].join("_")
                            ? `param905_2.${
                                  this.activeChannel
                              }.info.0.uploadEventPlatform.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/抽烟/一级报警/事件上传平台设置&第${val[
                                  "info"
                              ][0]["uploadEventPlatform"].join(
                                  "、"
                              )}中心&第${this.copyForm["param905"][
                                  this.activeChannel
                              ]["param905_2"]["info"][0][
                                  "uploadEventPlatform"
                              ].join("、")}中心`
                            : "";
                    this.$emit("formDataChange", this.formData);
                }
            },
            deep: true,
            immediate: true,
        },
        "form.param905_16": {
            handler(val) {
                if (val && !Boolean(this.isTemplate)) {
                    this.formData[
                        "param905_16." +
                            this.activeChannel +
                            ".info.0.enable.useless.useless.useless"
                    ] =
                        val["info"][0]["enable"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_16"
                        ]["info"][0]["enable"]
                            ? `param905_16.${
                                  this.activeChannel
                              }.info.0.enable.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/抽烟/二级报警/报警使能&${
                                  val["info"][0]["enable"] ? "开启" : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_16"
                                  ]["info"][0]["enable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_16." +
                            this.activeChannel +
                            ".info.0.speed.useless.useless.useless"
                    ] =
                        val["info"][0]["speed"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_16"
                        ]["info"][0]["speed"]
                            ? `param905_16.${
                                  this.activeChannel
                              }.info.0.speed.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/抽烟/二级报警/报警判断速度阈值&${
                                  val["info"][0]["speed"]
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_16"
                                  ]["info"][0]["speed"]
                              }`
                            : "";
                    this.formData[
                        "param905_16." +
                            this.activeChannel +
                            ".info.0.confidence.useless.useless.useless"
                    ] =
                        val["info"][0]["confidence"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_16"
                        ]["info"][0]["confidence"]
                            ? `param905_16.${
                                  this.activeChannel
                              }.info.0.confidence.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/抽烟/二级报警/算法置信度&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].confidenceList.find(
                                      (e) => e.value === val.info[0].confidence
                                  ).label
                              }&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].confidenceList.find(
                                      (e) =>
                                          e.value ===
                                          this.copyForm["param905"][
                                              this.activeChannel
                                          ]["param905_16"]["info"][0][
                                              "confidence"
                                          ]
                                  ).label
                              }`
                            : "";
                    this.formData[
                        "param905_16." +
                            this.activeChannel +
                            ".info.0.sensitivity.useless.useless.useless"
                    ] =
                        val["info"][0]["sensitivity"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_16"
                        ]["info"][0]["sensitivity"]
                            ? `param905_16.${
                                  this.activeChannel
                              }.info.0.sensitivity.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/抽烟/二级报警/算法灵敏度&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].sensitivityList.find(
                                      (e) => e.value === val.info[0].sensitivity
                                  ).label
                              }&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].sensitivityList.find(
                                      (e) =>
                                          e.value ===
                                          this.copyForm["param905"][
                                              this.activeChannel
                                          ]["param905_16"]["info"][0][
                                              "sensitivity"
                                          ]
                                  ).label
                              }`
                            : "";
                    this.formData[
                        "param905_16." +
                            this.activeChannel +
                            ".info.0.volume.useless.useless.useless"
                    ] =
                        val["info"][0]["volume"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_16"
                        ]["info"][0]["volume"]
                            ? `param905_16.${
                                  this.activeChannel
                              }.info.0.volume.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/抽烟/二级报警/报警音量&${
                                  val["info"][0]["volume"]
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_16"
                                  ]["info"][0]["volume"]
                              }`
                            : "";
                    this.formData[
                        "param905_16." +
                            this.activeChannel +
                            ".info.0.volumeEnable.useless.useless.useless"
                    ] =
                        val["info"][0]["volumeEnable"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_16"
                        ]["info"][0]["volumeEnable"]
                            ? `param905_16.${
                                  this.activeChannel
                              }.info.0.volumeEnable.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/抽烟/二级报警/音量使能&${
                                  val["info"][0]["volumeEnable"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_16"
                                  ]["info"][0]["volumeEnable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_16." +
                            this.activeChannel +
                            ".info.0.snapshot.upload.useless.useless.useless"
                    ] =
                        val["info"][0]["snapshot"]["upload"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_16"
                        ]["info"][0]["snapshot"]["upload"]
                            ? `param905_16.${
                                  this.activeChannel
                              }.info.0.snapshot.upload.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/抽烟/二级报警/报警图片上传使能&${
                                  val["info"][0]["snapshot"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_16"
                                  ]["info"][0]["snapshot"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_16." +
                            this.activeChannel +
                            ".info.0.clip.upload.useless.useless.useless"
                    ] =
                        val["info"][0]["clip"]["upload"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_16"
                        ]["info"][0]["clip"]["upload"]
                            ? `param905_16.${
                                  this.activeChannel
                              }.info.0.clip.upload.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/抽烟/二级报警/报警视频上传使能&${
                                  val["info"][0]["clip"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_16"
                                  ]["info"][0]["clip"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_16." +
                            this.activeChannel +
                            ".info.0.uploadEventPlatform.useless.useless.useless"
                    ] =
                        val["info"][0]["uploadEventPlatform"].join("_") !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_16"
                        ]["info"][0]["uploadEventPlatform"].join("_")
                            ? `param905_16.${
                                  this.activeChannel
                              }.info.0.uploadEventPlatform.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/抽烟/二级报警/事件上传平台设置&第${val[
                                  "info"
                              ][0]["uploadEventPlatform"].join(
                                  "、"
                              )}中心&第${this.copyForm["param905"][
                                  this.activeChannel
                              ]["param905_16"]["info"][0][
                                  "uploadEventPlatform"
                              ].join("、")}中心`
                            : "";
                    this.$emit("formDataChange", this.formData);
                }
            },
            deep: true,
            immediate: true,
        },
        "form.param905_3": {
            handler(val) {
                if (val && !Boolean(this.isTemplate)) {
                    this.formData[
                        "param905_3." +
                            this.activeChannel +
                            ".info.0.enable.useless.useless.useless"
                    ] =
                        val["info"][0]["enable"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_3"
                        ]["info"][0]["enable"]
                            ? `param905_3.${
                                  this.activeChannel
                              }.info.0.enable.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/注意力不集中/一级报警/报警使能&${
                                  val["info"][0]["enable"] ? "开启" : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_3"
                                  ]["info"][0]["enable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_3." +
                            this.activeChannel +
                            ".info.0.speed.useless.useless.useless"
                    ] =
                        val["info"][0]["speed"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_3"
                        ]["info"][0]["speed"]
                            ? `param905_3.${
                                  this.activeChannel
                              }.info.0.speed.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/注意力不集中/一级报警/报警判断速度阈值&${
                                  val["info"][0]["speed"]
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_3"
                                  ]["info"][0]["speed"]
                              }`
                            : "";
                    this.formData[
                        "param905_3." +
                            this.activeChannel +
                            ".info.0.confidence.useless.useless.useless"
                    ] =
                        val["info"][0]["confidence"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_3"
                        ]["info"][0]["confidence"]
                            ? `param905_3.${
                                  this.activeChannel
                              }.info.0.confidence.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/注意力不集中/一级报警/算法置信度&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].confidenceList.find(
                                      (e) => e.value === val.info[0].confidence
                                  ).label
                              }&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].confidenceList.find(
                                      (e) =>
                                          e.value ===
                                          this.copyForm["param905"][
                                              this.activeChannel
                                          ]["param905_3"]["info"][0][
                                              "confidence"
                                          ]
                                  ).label
                              }`
                            : "";
                    this.formData[
                        "param905_3." +
                            this.activeChannel +
                            ".info.0.sensitivity.useless.useless.useless"
                    ] =
                        val["info"][0]["sensitivity"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_3"
                        ]["info"][0]["sensitivity"]
                            ? `param905_3.${
                                  this.activeChannel
                              }.info.0.sensitivity.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/注意力不集中/一级报警/算法灵敏度&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].sensitivityList.find(
                                      (e) => e.value === val.info[0].sensitivity
                                  ).label
                              }&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].sensitivityList.find(
                                      (e) =>
                                          e.value ===
                                          this.copyForm["param905"][
                                              this.activeChannel
                                          ]["param905_3"]["info"][0][
                                              "sensitivity"
                                          ]
                                  ).label
                              }`
                            : "";
                    this.formData[
                        "param905_3." +
                            this.activeChannel +
                            ".info.0.volume.useless.useless.useless"
                    ] =
                        val["info"][0]["volume"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_3"
                        ]["info"][0]["volume"]
                            ? `param905_3.${
                                  this.activeChannel
                              }.info.0.volume.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/注意力不集中/一级报警/报警音量&${
                                  val["info"][0]["volume"]
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_3"
                                  ]["info"][0]["volume"]
                              }`
                            : "";
                    this.formData[
                        "param905_3." +
                            this.activeChannel +
                            ".info.0.volumeEnable.useless.useless.useless"
                    ] =
                        val["info"][0]["volumeEnable"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_3"
                        ]["info"][0]["volumeEnable"]
                            ? `param905_3.${
                                  this.activeChannel
                              }.info.0.volumeEnable.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/注意力不集中/一级报警/音量使能&${
                                  val["info"][0]["volumeEnable"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_3"
                                  ]["info"][0]["volumeEnable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_3." +
                            this.activeChannel +
                            ".info.0.snapshot.upload.useless.useless.useless"
                    ] =
                        val["info"][0]["snapshot"]["upload"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_3"
                        ]["info"][0]["snapshot"]["upload"]
                            ? `param905_3.${
                                  this.activeChannel
                              }.info.0.snapshot.upload.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/注意力不集中/一级报警/报警图片上传使能&${
                                  val["info"][0]["snapshot"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_3"
                                  ]["info"][0]["snapshot"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_3." +
                            this.activeChannel +
                            ".info.0.clip.upload.useless.useless.useless"
                    ] =
                        val["info"][0]["clip"]["upload"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_3"
                        ]["info"][0]["clip"]["upload"]
                            ? `param905_3.${
                                  this.activeChannel
                              }.info.0.clip.upload.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/注意力不集中/一级报警/报警视频上传使能&${
                                  val["info"][0]["clip"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_3"
                                  ]["info"][0]["clip"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_3." +
                            this.activeChannel +
                            ".info.0.uploadEventPlatform.useless.useless.useless"
                    ] =
                        val["info"][0]["uploadEventPlatform"].join("_") !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_3"
                        ]["info"][0]["uploadEventPlatform"].join("_")
                            ? `param905_3.${
                                  this.activeChannel
                              }.info.0.uploadEventPlatform.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/注意力不集中/一级报警/事件上传平台设置&第${val[
                                  "info"
                              ][0]["uploadEventPlatform"].join(
                                  "、"
                              )}中心&第${this.copyForm["param905"][
                                  this.activeChannel
                              ]["param905_3"]["info"][0][
                                  "uploadEventPlatform"
                              ].join("、")}中心`
                            : "";
                    this.$emit("formDataChange", this.formData);
                }
            },
            deep: true,
            immediate: true,
        },
        "form.param905_8": {
            handler(val) {
                if (val && !Boolean(this.isTemplate)) {
                    this.formData[
                        "param905_8." +
                            this.activeChannel +
                            ".info.0.enable.useless.useless.useless"
                    ] =
                        val["info"][0]["enable"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_8"
                        ]["info"][0]["enable"]
                            ? `param905_8.${
                                  this.activeChannel
                              }.info.0.enable.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/注意力不集中/二级报警/报警使能&${
                                  val["info"][0]["enable"] ? "开启" : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_8"
                                  ]["info"][0]["enable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_8." +
                            this.activeChannel +
                            ".info.0.speed.useless.useless.useless"
                    ] =
                        val["info"][0]["speed"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_8"
                        ]["info"][0]["speed"]
                            ? `param905_8.${
                                  this.activeChannel
                              }.info.0.speed.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/注意力不集中/二级报警/报警判断速度阈值&${
                                  val["info"][0]["speed"]
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_8"
                                  ]["info"][0]["speed"]
                              }`
                            : "";
                    this.formData[
                        "param905_8." +
                            this.activeChannel +
                            ".info.0.confidence.useless.useless.useless"
                    ] =
                        val["info"][0]["confidence"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_8"
                        ]["info"][0]["confidence"]
                            ? `param905_8.${
                                  this.activeChannel
                              }.info.0.confidence.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/注意力不集中/二级报警/算法置信度&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].confidenceList.find(
                                      (e) => e.value === val.info[0].confidence
                                  ).label
                              }&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].confidenceList.find(
                                      (e) =>
                                          e.value ===
                                          this.copyForm["param905"][
                                              this.activeChannel
                                          ]["param905_8"]["info"][0][
                                              "confidence"
                                          ]
                                  ).label
                              }`
                            : "";
                    this.formData[
                        "param905_8." +
                            this.activeChannel +
                            ".info.0.sensitivity.useless.useless.useless"
                    ] =
                        val["info"][0]["sensitivity"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_8"
                        ]["info"][0]["sensitivity"]
                            ? `param905_8.${
                                  this.activeChannel
                              }.info.0.sensitivity.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/注意力不集中/二级报警/算法灵敏度&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].sensitivityList.find(
                                      (e) => e.value === val.info[0].sensitivity
                                  ).label
                              }&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].sensitivityList.find(
                                      (e) =>
                                          e.value ===
                                          this.copyForm["param905"][
                                              this.activeChannel
                                          ]["param905_8"]["info"][0][
                                              "sensitivity"
                                          ]
                                  ).label
                              }`
                            : "";
                    this.formData[
                        "param905_8." +
                            this.activeChannel +
                            ".info.0.volume.useless.useless.useless"
                    ] =
                        val["info"][0]["volume"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_8"
                        ]["info"][0]["volume"]
                            ? `param905_8.${
                                  this.activeChannel
                              }.info.0.volume.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/注意力不集中/二级报警/报警音量&${
                                  val["info"][0]["volume"]
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_8"
                                  ]["info"][0]["volume"]
                              }`
                            : "";
                    this.formData[
                        "param905_8." +
                            this.activeChannel +
                            ".info.0.volumeEnable.useless.useless.useless"
                    ] =
                        val["info"][0]["volumeEnable"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_8"
                        ]["info"][0]["volumeEnable"]
                            ? `param905_8.${
                                  this.activeChannel
                              }.info.0.volumeEnable.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/注意力不集中/二级报警/音量使能&${
                                  val["info"][0]["volumeEnable"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_8"
                                  ]["info"][0]["volumeEnable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_8." +
                            this.activeChannel +
                            ".info.0.snapshot.upload.useless.useless.useless"
                    ] =
                        val["info"][0]["snapshot"]["upload"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_8"
                        ]["info"][0]["snapshot"]["upload"]
                            ? `param905_8.${
                                  this.activeChannel
                              }.info.0.snapshot.upload.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/注意力不集中/二级报警/报警图片上传使能&${
                                  val["info"][0]["snapshot"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_8"
                                  ]["info"][0]["snapshot"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_8." +
                            this.activeChannel +
                            ".info.0.clip.upload.useless.useless.useless"
                    ] =
                        val["info"][0]["clip"]["upload"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_8"
                        ]["info"][0]["clip"]["upload"]
                            ? `param905_8.${
                                  this.activeChannel
                              }.info.0.clip.upload.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/注意力不集中/二级报警/报警视频上传使能&${
                                  val["info"][0]["clip"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_8"
                                  ]["info"][0]["clip"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_8." +
                            this.activeChannel +
                            ".info.0.uploadEventPlatform.useless.useless.useless"
                    ] =
                        val["info"][0]["uploadEventPlatform"].join("_") !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_8"
                        ]["info"][0]["uploadEventPlatform"].join("_")
                            ? `param905_8.${
                                  this.activeChannel
                              }.info.0.uploadEventPlatform.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/注意力不集中/二级报警/事件上传平台设置&第${val[
                                  "info"
                              ][0]["uploadEventPlatform"].join(
                                  "、"
                              )}中心&第${this.copyForm["param905"][
                                  this.activeChannel
                              ]["param905_8"]["info"][0][
                                  "uploadEventPlatform"
                              ].join("、")}中心`
                            : "";
                    this.$emit("formDataChange", this.formData);
                }
            },
            deep: true,
            immediate: true,
        },
        "form.param905_4": {
            handler(val) {
                if (val && !Boolean(this.isTemplate)) {
                    this.formData[
                        "param905_4." +
                            this.activeChannel +
                            ".info.0.enable.useless.useless.useless"
                    ] =
                        val["info"][0]["enable"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_4"
                        ]["info"][0]["enable"]
                            ? `param905_4.${
                                  this.activeChannel
                              }.info.0.enable.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/离岗/一级报警/报警使能&${
                                  val["info"][0]["enable"] ? "开启" : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_4"
                                  ]["info"][0]["enable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_4." +
                            this.activeChannel +
                            ".info.0.speed.useless.useless.useless"
                    ] =
                        val["info"][0]["speed"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_4"
                        ]["info"][0]["speed"]
                            ? `param905_4.${
                                  this.activeChannel
                              }.info.0.speed.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/离岗/一级报警/报警判断速度阈值&${
                                  val["info"][0]["speed"]
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_4"
                                  ]["info"][0]["speed"]
                              }`
                            : "";
                    this.formData[
                        "param905_4." +
                            this.activeChannel +
                            ".info.0.confidence.useless.useless.useless"
                    ] =
                        val["info"][0]["confidence"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_4"
                        ]["info"][0]["confidence"]
                            ? `param905_4.${
                                  this.activeChannel
                              }.info.0.confidence.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/离岗/一级报警/算法置信度&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].confidenceList.find(
                                      (e) => e.value === val.info[0].confidence
                                  ).label
                              }&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].confidenceList.find(
                                      (e) =>
                                          e.value ===
                                          this.copyForm["param905"][
                                              this.activeChannel
                                          ]["param905_4"]["info"][0][
                                              "confidence"
                                          ]
                                  ).label
                              }`
                            : "";
                    this.formData[
                        "param905_4." +
                            this.activeChannel +
                            ".info.0.sensitivity.useless.useless.useless"
                    ] =
                        val["info"][0]["sensitivity"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_4"
                        ]["info"][0]["sensitivity"]
                            ? `param905_4.${
                                  this.activeChannel
                              }.info.0.sensitivity.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/离岗/一级报警/算法灵敏度&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].sensitivityList.find(
                                      (e) => e.value === val.info[0].sensitivity
                                  ).label
                              }&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].sensitivityList.find(
                                      (e) =>
                                          e.value ===
                                          this.copyForm["param905"][
                                              this.activeChannel
                                          ]["param905_4"]["info"][0][
                                              "sensitivity"
                                          ]
                                  ).label
                              }`
                            : "";
                    this.formData[
                        "param905_4." +
                            this.activeChannel +
                            ".info.0.volume.useless.useless.useless"
                    ] =
                        val["info"][0]["volume"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_4"
                        ]["info"][0]["volume"]
                            ? `param905_4.${
                                  this.activeChannel
                              }.info.0.volume.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/离岗/一级报警/报警音量&${
                                  val["info"][0]["volume"]
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_4"
                                  ]["info"][0]["volume"]
                              }`
                            : "";
                    this.formData[
                        "param905_4." +
                            this.activeChannel +
                            ".info.0.volumeEnable.useless.useless.useless"
                    ] =
                        val["info"][0]["volumeEnable"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_4"
                        ]["info"][0]["volumeEnable"]
                            ? `param905_4.${
                                  this.activeChannel
                              }.info.0.volumeEnable.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/离岗/一级报警/音量使能&${
                                  val["info"][0]["volumeEnable"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_4"
                                  ]["info"][0]["volumeEnable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_4." +
                            this.activeChannel +
                            ".info.0.snapshot.upload.useless.useless.useless"
                    ] =
                        val["info"][0]["snapshot"]["upload"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_4"
                        ]["info"][0]["snapshot"]["upload"]
                            ? `param905_4.${
                                  this.activeChannel
                              }.info.0.snapshot.upload.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/离岗/一级报警/报警图片上传使能&${
                                  val["info"][0]["snapshot"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_4"
                                  ]["info"][0]["snapshot"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_4." +
                            this.activeChannel +
                            ".info.0.clip.upload.useless.useless.useless"
                    ] =
                        val["info"][0]["clip"]["upload"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_4"
                        ]["info"][0]["clip"]["upload"]
                            ? `param905_4.${
                                  this.activeChannel
                              }.info.0.clip.upload.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/离岗/一级报警/报警视频上传使能&${
                                  val["info"][0]["clip"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_4"
                                  ]["info"][0]["clip"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_4." +
                            this.activeChannel +
                            ".info.0.uploadEventPlatform.useless.useless.useless"
                    ] =
                        val["info"][0]["uploadEventPlatform"].join("_") !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_4"
                        ]["info"][0]["uploadEventPlatform"].join("_")
                            ? `param905_4.${
                                  this.activeChannel
                              }.info.0.uploadEventPlatform.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/离岗/一级报警/事件上传平台设置&第${val[
                                  "info"
                              ][0]["uploadEventPlatform"].join(
                                  "、"
                              )}中心&第${this.copyForm["param905"][
                                  this.activeChannel
                              ]["param905_4"]["info"][0][
                                  "uploadEventPlatform"
                              ].join("、")}中心`
                            : "";
                    this.$emit("formDataChange", this.formData);
                }
            },
            deep: true,
            immediate: true,
        },
        "form.param905_17": {
            handler(val) {
                if (val && !Boolean(this.isTemplate)) {
                    this.formData[
                        "param905_17." +
                            this.activeChannel +
                            ".info.0.enable.useless.useless.useless"
                    ] =
                        val["info"][0]["enable"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_17"
                        ]["info"][0]["enable"]
                            ? `param905_17.${
                                  this.activeChannel
                              }.info.0.enable.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/离岗/二级报警/报警使能&${
                                  val["info"][0]["enable"] ? "开启" : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_17"
                                  ]["info"][0]["enable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_17." +
                            this.activeChannel +
                            ".info.0.speed.useless.useless.useless"
                    ] =
                        val["info"][0]["speed"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_17"
                        ]["info"][0]["speed"]
                            ? `param905_17.${
                                  this.activeChannel
                              }.info.0.speed.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/离岗/二级报警/报警判断速度阈值&${
                                  val["info"][0]["speed"]
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_17"
                                  ]["info"][0]["speed"]
                              }`
                            : "";
                    this.formData[
                        "param905_17." +
                            this.activeChannel +
                            ".info.0.confidence.useless.useless.useless"
                    ] =
                        val["info"][0]["confidence"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_17"
                        ]["info"][0]["confidence"]
                            ? `param905_17.${
                                  this.activeChannel
                              }.info.0.confidence.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/离岗/二级报警/算法置信度&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].confidenceList.find(
                                      (e) => e.value === val.info[0].confidence
                                  ).label
                              }&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].confidenceList.find(
                                      (e) =>
                                          e.value ===
                                          this.copyForm["param905"][
                                              this.activeChannel
                                          ]["param905_17"]["info"][0][
                                              "confidence"
                                          ]
                                  ).label
                              }`
                            : "";
                    this.formData[
                        "param905_17." +
                            this.activeChannel +
                            ".info.0.sensitivity.useless.useless.useless"
                    ] =
                        val["info"][0]["sensitivity"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_17"
                        ]["info"][0]["sensitivity"]
                            ? `param905_17.${
                                  this.activeChannel
                              }.info.0.sensitivity.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/离岗/二级报警/算法灵敏度&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].sensitivityList.find(
                                      (e) => e.value === val.info[0].sensitivity
                                  ).label
                              }&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].sensitivityList.find(
                                      (e) =>
                                          e.value ===
                                          this.copyForm["param905"][
                                              this.activeChannel
                                          ]["param905_17"]["info"][0][
                                              "sensitivity"
                                          ]
                                  ).label
                              }`
                            : "";
                    this.formData[
                        "param905_17." +
                            this.activeChannel +
                            ".info.0.volume.useless.useless.useless"
                    ] =
                        val["info"][0]["volume"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_17"
                        ]["info"][0]["volume"]
                            ? `param905_17.${
                                  this.activeChannel
                              }.info.0.volume.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/离岗/二级报警/报警音量&${
                                  val["info"][0]["volume"]
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_17"
                                  ]["info"][0]["volume"]
                              }`
                            : "";
                    this.formData[
                        "param905_17." +
                            this.activeChannel +
                            ".info.0.volumeEnable.useless.useless.useless"
                    ] =
                        val["info"][0]["volumeEnable"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_17"
                        ]["info"][0]["volumeEnable"]
                            ? `param905_17.${
                                  this.activeChannel
                              }.info.0.volumeEnable.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/离岗/二级报警/音量使能&${
                                  val["info"][0]["volumeEnable"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_17"
                                  ]["info"][0]["volumeEnable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_17." +
                            this.activeChannel +
                            ".info.0.snapshot.upload.useless.useless.useless"
                    ] =
                        val["info"][0]["snapshot"]["upload"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_17"
                        ]["info"][0]["snapshot"]["upload"]
                            ? `param905_17.${
                                  this.activeChannel
                              }.info.0.snapshot.upload.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/离岗/二级报警/报警图片上传使能&${
                                  val["info"][0]["snapshot"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_17"
                                  ]["info"][0]["snapshot"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_17." +
                            this.activeChannel +
                            ".info.0.clip.upload.useless.useless.useless"
                    ] =
                        val["info"][0]["clip"]["upload"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_17"
                        ]["info"][0]["clip"]["upload"]
                            ? `param905_17.${
                                  this.activeChannel
                              }.info.0.clip.upload.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/离岗/二级报警/报警视频上传使能&${
                                  val["info"][0]["clip"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_17"
                                  ]["info"][0]["clip"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_17." +
                            this.activeChannel +
                            ".info.0.uploadEventPlatform.useless.useless.useless"
                    ] =
                        val["info"][0]["uploadEventPlatform"].join("_") !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_17"
                        ]["info"][0]["uploadEventPlatform"].join("_")
                            ? `param905_17.${
                                  this.activeChannel
                              }.info.0.uploadEventPlatform.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/离岗/二级报警/事件上传平台设置&第${val[
                                  "info"
                              ][0]["uploadEventPlatform"].join(
                                  "、"
                              )}中心&第${this.copyForm["param905"][
                                  this.activeChannel
                              ]["param905_17"]["info"][0][
                                  "uploadEventPlatform"
                              ].join("、")}中心`
                            : "";
                    this.$emit("formDataChange", this.formData);
                }
            },
            deep: true,
            immediate: true,
        },
        "form.param905_5": {
            handler(val) {
                if (val && !Boolean(this.isTemplate)) {
                    this.formData[
                        "param905_5." +
                            this.activeChannel +
                            ".info.0.enable.useless.useless.useless"
                    ] =
                        val["info"][0]["enable"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_5"
                        ]["info"][0]["enable"]
                            ? `param905_5.${
                                  this.activeChannel
                              }.info.0.enable.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/视频遮挡/一级报警/报警使能&${
                                  val["info"][0]["enable"] ? "开启" : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_5"
                                  ]["info"][0]["enable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_5." +
                            this.activeChannel +
                            ".info.0.speed.useless.useless.useless"
                    ] =
                        val["info"][0]["speed"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_5"
                        ]["info"][0]["speed"]
                            ? `param905_5.${
                                  this.activeChannel
                              }.info.0.speed.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/视频遮挡/一级报警/报警判断速度阈值&${
                                  val["info"][0]["speed"]
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_5"
                                  ]["info"][0]["speed"]
                              }`
                            : "";
                    this.formData[
                        "param905_5." +
                            this.activeChannel +
                            ".info.0.confidence.useless.useless.useless"
                    ] =
                        val["info"][0]["confidence"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_5"
                        ]["info"][0]["confidence"]
                            ? `param905_5.${
                                  this.activeChannel
                              }.info.0.confidence.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/视频遮挡/一级报警/算法置信度&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].confidenceList.find(
                                      (e) => e.value === val.info[0].confidence
                                  ).label
                              }&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].confidenceList.find(
                                      (e) =>
                                          e.value ===
                                          this.copyForm["param905"][
                                              this.activeChannel
                                          ]["param905_5"]["info"][0][
                                              "confidence"
                                          ]
                                  ).label
                              }`
                            : "";
                    this.formData[
                        "param905_5." +
                            this.activeChannel +
                            ".info.0.sensitivity.useless.useless.useless"
                    ] =
                        val["info"][0]["sensitivity"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_5"
                        ]["info"][0]["sensitivity"]
                            ? `param905_5.${
                                  this.activeChannel
                              }.info.0.sensitivity.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/视频遮挡/一级报警/算法灵敏度&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].sensitivityList.find(
                                      (e) => e.value === val.info[0].sensitivity
                                  ).label
                              }&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].sensitivityList.find(
                                      (e) =>
                                          e.value ===
                                          this.copyForm["param905"][
                                              this.activeChannel
                                          ]["param905_5"]["info"][0][
                                              "sensitivity"
                                          ]
                                  ).label
                              }`
                            : "";
                    this.formData[
                        "param905_5." +
                            this.activeChannel +
                            ".info.0.volume.useless.useless.useless"
                    ] =
                        val["info"][0]["volume"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_5"
                        ]["info"][0]["volume"]
                            ? `param905_5.${
                                  this.activeChannel
                              }.info.0.volume.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/视频遮挡/一级报警/报警音量&${
                                  val["info"][0]["volume"]
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_5"
                                  ]["info"][0]["volume"]
                              }`
                            : "";
                    this.formData[
                        "param905_5." +
                            this.activeChannel +
                            ".info.0.volumeEnable.useless.useless.useless"
                    ] =
                        val["info"][0]["volumeEnable"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_5"
                        ]["info"][0]["volumeEnable"]
                            ? `param905_5.${
                                  this.activeChannel
                              }.info.0.volumeEnable.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/视频遮挡/一级报警/音量使能&${
                                  val["info"][0]["volumeEnable"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_5"
                                  ]["info"][0]["volumeEnable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_5." +
                            this.activeChannel +
                            ".info.0.snapshot.upload.useless.useless.useless"
                    ] =
                        val["info"][0]["snapshot"]["upload"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_5"
                        ]["info"][0]["snapshot"]["upload"]
                            ? `param905_5.${
                                  this.activeChannel
                              }.info.0.snapshot.upload.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/视频遮挡/一级报警/报警图片上传使能&${
                                  val["info"][0]["snapshot"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_5"
                                  ]["info"][0]["snapshot"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_5." +
                            this.activeChannel +
                            ".info.0.clip.upload.useless.useless.useless"
                    ] =
                        val["info"][0]["clip"]["upload"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_5"
                        ]["info"][0]["clip"]["upload"]
                            ? `param905_5.${
                                  this.activeChannel
                              }.info.0.clip.upload.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/视频遮挡/一级报警/报警视频上传使能&${
                                  val["info"][0]["clip"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_5"
                                  ]["info"][0]["clip"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_5." +
                            this.activeChannel +
                            ".info.0.uploadEventPlatform.useless.useless.useless"
                    ] =
                        val["info"][0]["uploadEventPlatform"].join("_") !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_5"
                        ]["info"][0]["uploadEventPlatform"].join("_")
                            ? `param905_5.${
                                  this.activeChannel
                              }.info.0.uploadEventPlatform.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/视频遮挡/一级报警/事件上传平台设置&第${val[
                                  "info"
                              ][0]["uploadEventPlatform"].join(
                                  "、"
                              )}中心&第${this.copyForm["param905"][
                                  this.activeChannel
                              ]["param905_5"]["info"][0][
                                  "uploadEventPlatform"
                              ].join("、")}中心`
                            : "";
                    this.$emit("formDataChange", this.formData);
                }
            },
            deep: true,
            immediate: true,
        },
        "form.param905_18": {
            handler(val) {
                if (val && !Boolean(this.isTemplate)) {
                    this.formData[
                        "param905_18." +
                            this.activeChannel +
                            ".info.0.enable.useless.useless.useless"
                    ] =
                        val["info"][0]["enable"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_18"
                        ]["info"][0]["enable"]
                            ? `param905_18.${
                                  this.activeChannel
                              }.info.0.enable.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/视频遮挡/二级报警/报警使能&${
                                  val["info"][0]["enable"] ? "开启" : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_18"
                                  ]["info"][0]["enable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_18." +
                            this.activeChannel +
                            ".info.0.speed.useless.useless.useless"
                    ] =
                        val["info"][0]["speed"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_18"
                        ]["info"][0]["speed"]
                            ? `param905_18.${
                                  this.activeChannel
                              }.info.0.speed.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/视频遮挡/二级报警/报警判断速度阈值&${
                                  val["info"][0]["speed"]
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_18"
                                  ]["info"][0]["speed"]
                              }`
                            : "";
                    this.formData[
                        "param905_18." +
                            this.activeChannel +
                            ".info.0.confidence.useless.useless.useless"
                    ] =
                        val["info"][0]["confidence"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_18"
                        ]["info"][0]["confidence"]
                            ? `param905_18.${
                                  this.activeChannel
                              }.info.0.confidence.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/视频遮挡/二级报警/算法置信度&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].confidenceList.find(
                                      (e) => e.value === val.info[0].confidence
                                  ).label
                              }&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].confidenceList.find(
                                      (e) =>
                                          e.value ===
                                          this.copyForm["param905"][
                                              this.activeChannel
                                          ]["param905_18"]["info"][0][
                                              "confidence"
                                          ]
                                  ).label
                              }`
                            : "";
                    this.formData[
                        "param905_18." +
                            this.activeChannel +
                            ".info.0.sensitivity.useless.useless.useless"
                    ] =
                        val["info"][0]["sensitivity"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_18"
                        ]["info"][0]["sensitivity"]
                            ? `param905_18.${
                                  this.activeChannel
                              }.info.0.sensitivity.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/视频遮挡/二级报警/算法灵敏度&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].sensitivityList.find(
                                      (e) => e.value === val.info[0].sensitivity
                                  ).label
                              }&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].sensitivityList.find(
                                      (e) =>
                                          e.value ===
                                          this.copyForm["param905"][
                                              this.activeChannel
                                          ]["param905_18"]["info"][0][
                                              "sensitivity"
                                          ]
                                  ).label
                              }`
                            : "";
                    this.formData[
                        "param905_18." +
                            this.activeChannel +
                            ".info.0.volume.useless.useless.useless"
                    ] =
                        val["info"][0]["volume"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_18"
                        ]["info"][0]["volume"]
                            ? `param905_18.${
                                  this.activeChannel
                              }.info.0.volume.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/视频遮挡/二级报警/报警音量&${
                                  val["info"][0]["volume"]
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_18"
                                  ]["info"][0]["volume"]
                              }`
                            : "";
                    this.formData[
                        "param905_18." +
                            this.activeChannel +
                            ".info.0.volumeEnable.useless.useless.useless"
                    ] =
                        val["info"][0]["volumeEnable"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_18"
                        ]["info"][0]["volumeEnable"]
                            ? `param905_18.${
                                  this.activeChannel
                              }.info.0.volumeEnable.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/视频遮挡/二级报警/音量使能&${
                                  val["info"][0]["volumeEnable"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_18"
                                  ]["info"][0]["volumeEnable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_18." +
                            this.activeChannel +
                            ".info.0.snapshot.upload.useless.useless.useless"
                    ] =
                        val["info"][0]["snapshot"]["upload"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_18"
                        ]["info"][0]["snapshot"]["upload"]
                            ? `param905_18.${
                                  this.activeChannel
                              }.info.0.snapshot.upload.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/视频遮挡/二级报警/报警图片上传使能&${
                                  val["info"][0]["snapshot"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_18"
                                  ]["info"][0]["snapshot"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_18." +
                            this.activeChannel +
                            ".info.0.clip.upload.useless.useless.useless"
                    ] =
                        val["info"][0]["clip"]["upload"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_18"
                        ]["info"][0]["clip"]["upload"]
                            ? `param905_18.${
                                  this.activeChannel
                              }.info.0.clip.upload.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/视频遮挡/二级报警/报警视频上传使能&${
                                  val["info"][0]["clip"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_18"
                                  ]["info"][0]["clip"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_18." +
                            this.activeChannel +
                            ".info.0.uploadEventPlatform.useless.useless.useless"
                    ] =
                        val["info"][0]["uploadEventPlatform"].join("_") !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_18"
                        ]["info"][0]["uploadEventPlatform"].join("_")
                            ? `param905_18.${
                                  this.activeChannel
                              }.info.0.uploadEventPlatform.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/视频遮挡/二级报警/事件上传平台设置&第${val[
                                  "info"
                              ][0]["uploadEventPlatform"].join(
                                  "、"
                              )}中心&第${this.copyForm["param905"][
                                  this.activeChannel
                              ]["param905_18"]["info"][0][
                                  "uploadEventPlatform"
                              ].join("、")}中心`
                            : "";
                    this.$emit("formDataChange", this.formData);
                }
            },
            deep: true,
            immediate: true,
        },
        "form.param905_6": {
            handler(val) {
                if (val && !Boolean(this.isTemplate)) {
                    this.formData[
                        "param905_6." +
                            this.activeChannel +
                            ".info.0.enable.useless.useless.useless"
                    ] =
                        val["info"][0]["enable"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_6"
                        ]["info"][0]["enable"]
                            ? `param905_6.${
                                  this.activeChannel
                              }.info.0.enable.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/未系安全带/一级报警/报警使能&${
                                  val["info"][0]["enable"] ? "开启" : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_6"
                                  ]["info"][0]["enable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_6." +
                            this.activeChannel +
                            ".info.0.speed.useless.useless.useless"
                    ] =
                        val["info"][0]["speed"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_6"
                        ]["info"][0]["speed"]
                            ? `param905_6.${
                                  this.activeChannel
                              }.info.0.speed.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/未系安全带/一级报警/报警判断速度阈值&${
                                  val["info"][0]["speed"]
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_6"
                                  ]["info"][0]["speed"]
                              }`
                            : "";
                    this.formData[
                        "param905_6." +
                            this.activeChannel +
                            ".info.0.confidence.useless.useless.useless"
                    ] =
                        val["info"][0]["confidence"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_6"
                        ]["info"][0]["confidence"]
                            ? `param905_6.${
                                  this.activeChannel
                              }.info.0.confidence.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/未系安全带/一级报警/算法置信度&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].confidenceList.find(
                                      (e) => e.value === val.info[0].confidence
                                  ).label
                              }&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].confidenceList.find(
                                      (e) =>
                                          e.value ===
                                          this.copyForm["param905"][
                                              this.activeChannel
                                          ]["param905_6"]["info"][0][
                                              "confidence"
                                          ]
                                  ).label
                              }`
                            : "";
                    this.formData[
                        "param905_6." +
                            this.activeChannel +
                            ".info.0.sensitivity.useless.useless.useless"
                    ] =
                        val["info"][0]["sensitivity"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_6"
                        ]["info"][0]["sensitivity"]
                            ? `param905_6.${
                                  this.activeChannel
                              }.info.0.sensitivity.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/未系安全带/一级报警/算法灵敏度&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].sensitivityList.find(
                                      (e) => e.value === val.info[0].sensitivity
                                  ).label
                              }&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].sensitivityList.find(
                                      (e) =>
                                          e.value ===
                                          this.copyForm["param905"][
                                              this.activeChannel
                                          ]["param905_6"]["info"][0][
                                              "sensitivity"
                                          ]
                                  ).label
                              }`
                            : "";
                    this.formData[
                        "param905_6." +
                            this.activeChannel +
                            ".info.0.volume.useless.useless.useless"
                    ] =
                        val["info"][0]["volume"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_6"
                        ]["info"][0]["volume"]
                            ? `param905_6.${
                                  this.activeChannel
                              }.info.0.volume.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/未系安全带/一级报警/报警音量&${
                                  val["info"][0]["volume"]
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_6"
                                  ]["info"][0]["volume"]
                              }`
                            : "";
                    this.formData[
                        "param905_6." +
                            this.activeChannel +
                            ".info.0.volumeEnable.useless.useless.useless"
                    ] =
                        val["info"][0]["volumeEnable"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_6"
                        ]["info"][0]["volumeEnable"]
                            ? `param905_6.${
                                  this.activeChannel
                              }.info.0.volumeEnable.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/未系安全带/一级报警/音量使能&${
                                  val["info"][0]["volumeEnable"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_6"
                                  ]["info"][0]["volumeEnable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_6." +
                            this.activeChannel +
                            ".info.0.snapshot.upload.useless.useless.useless"
                    ] =
                        val["info"][0]["snapshot"]["upload"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_6"
                        ]["info"][0]["snapshot"]["upload"]
                            ? `param905_6.${
                                  this.activeChannel
                              }.info.0.snapshot.upload.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/未系安全带/一级报警/报警图片上传使能&${
                                  val["info"][0]["snapshot"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_6"
                                  ]["info"][0]["snapshot"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_6." +
                            this.activeChannel +
                            ".info.0.clip.upload.useless.useless.useless"
                    ] =
                        val["info"][0]["clip"]["upload"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_6"
                        ]["info"][0]["clip"]["upload"]
                            ? `param905_6.${
                                  this.activeChannel
                              }.info.0.clip.upload.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/未系安全带/一级报警/报警视频上传使能&${
                                  val["info"][0]["clip"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_6"
                                  ]["info"][0]["clip"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_6." +
                            this.activeChannel +
                            ".info.0.uploadEventPlatform.useless.useless.useless"
                    ] =
                        val["info"][0]["uploadEventPlatform"].join("_") !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_6"
                        ]["info"][0]["uploadEventPlatform"].join("_")
                            ? `param905_6.${
                                  this.activeChannel
                              }.info.0.uploadEventPlatform.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/未系安全带/一级报警/事件上传平台设置&第${val[
                                  "info"
                              ][0]["uploadEventPlatform"].join(
                                  "、"
                              )}中心&第${this.copyForm["param905"][
                                  this.activeChannel
                              ]["param905_6"]["info"][0][
                                  "uploadEventPlatform"
                              ].join("、")}中心`
                            : "";
                    this.$emit("formDataChange", this.formData);
                }
            },
            deep: true,
            immediate: true,
        },
        "form.param905_19": {
            handler(val) {
                if (val && !Boolean(this.isTemplate)) {
                    this.formData[
                        "param905_19." +
                            this.activeChannel +
                            ".info.0.enable.useless.useless.useless"
                    ] =
                        val["info"][0]["enable"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_19"
                        ]["info"][0]["enable"]
                            ? `param905_19.${
                                  this.activeChannel
                              }.info.0.enable.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/未系安全带/二级报警/报警使能&${
                                  val["info"][0]["enable"] ? "开启" : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_19"
                                  ]["info"][0]["enable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_19." +
                            this.activeChannel +
                            ".info.0.speed.useless.useless.useless"
                    ] =
                        val["info"][0]["speed"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_19"
                        ]["info"][0]["speed"]
                            ? `param905_19.${
                                  this.activeChannel
                              }.info.0.speed.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/未系安全带/二级报警/报警判断速度阈值&${
                                  val["info"][0]["speed"]
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_19"
                                  ]["info"][0]["speed"]
                              }`
                            : "";
                    this.formData[
                        "param905_19." +
                            this.activeChannel +
                            ".info.0.confidence.useless.useless.useless"
                    ] =
                        val["info"][0]["confidence"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_19"
                        ]["info"][0]["confidence"]
                            ? `param905_19.${
                                  this.activeChannel
                              }.info.0.confidence.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/未系安全带/二级报警/算法置信度&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].confidenceList.find(
                                      (e) => e.value === val.info[0].confidence
                                  ).label
                              }&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].confidenceList.find(
                                      (e) =>
                                          e.value ===
                                          this.copyForm["param905"][
                                              this.activeChannel
                                          ]["param905_19"]["info"][0][
                                              "confidence"
                                          ]
                                  ).label
                              }`
                            : "";
                    this.formData[
                        "param905_19." +
                            this.activeChannel +
                            ".info.0.sensitivity.useless.useless.useless"
                    ] =
                        val["info"][0]["sensitivity"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_19"
                        ]["info"][0]["sensitivity"]
                            ? `param905_19.${
                                  this.activeChannel
                              }.info.0.sensitivity.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/未系安全带/二级报警/算法灵敏度&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].sensitivityList.find(
                                      (e) => e.value === val.info[0].sensitivity
                                  ).label
                              }&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].sensitivityList.find(
                                      (e) =>
                                          e.value ===
                                          this.copyForm["param905"][
                                              this.activeChannel
                                          ]["param905_19"]["info"][0][
                                              "sensitivity"
                                          ]
                                  ).label
                              }`
                            : "";
                    this.formData[
                        "param905_19." +
                            this.activeChannel +
                            ".info.0.volume.useless.useless.useless"
                    ] =
                        val["info"][0]["volume"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_19"
                        ]["info"][0]["volume"]
                            ? `param905_19.${
                                  this.activeChannel
                              }.info.0.volume.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/未系安全带/二级报警/报警音量&${
                                  val["info"][0]["volume"]
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_19"
                                  ]["info"][0]["volume"]
                              }`
                            : "";
                    this.formData[
                        "param905_19." +
                            this.activeChannel +
                            ".info.0.volumeEnable.useless.useless.useless"
                    ] =
                        val["info"][0]["volumeEnable"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_19"
                        ]["info"][0]["volumeEnable"]
                            ? `param905_19.${
                                  this.activeChannel
                              }.info.0.volumeEnable.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/未系安全带/二级报警/音量使能&${
                                  val["info"][0]["volumeEnable"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_19"
                                  ]["info"][0]["volumeEnable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_19." +
                            this.activeChannel +
                            ".info.0.snapshot.upload.useless.useless.useless"
                    ] =
                        val["info"][0]["snapshot"]["upload"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_19"
                        ]["info"][0]["snapshot"]["upload"]
                            ? `param905_19.${
                                  this.activeChannel
                              }.info.0.snapshot.upload.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/未系安全带/二级报警/报警图片上传使能&${
                                  val["info"][0]["snapshot"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_19"
                                  ]["info"][0]["snapshot"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_19." +
                            this.activeChannel +
                            ".info.0.clip.upload.useless.useless.useless"
                    ] =
                        val["info"][0]["clip"]["upload"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_19"
                        ]["info"][0]["clip"]["upload"]
                            ? `param905_19.${
                                  this.activeChannel
                              }.info.0.clip.upload.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/未系安全带/二级报警/报警视频上传使能&${
                                  val["info"][0]["clip"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_19"
                                  ]["info"][0]["clip"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_19." +
                            this.activeChannel +
                            ".info.0.uploadEventPlatform.useless.useless.useless"
                    ] =
                        val["info"][0]["uploadEventPlatform"].join("_") !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_19"
                        ]["info"][0]["uploadEventPlatform"].join("_")
                            ? `param905_19.${
                                  this.activeChannel
                              }.info.0.uploadEventPlatform.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/未系安全带/二级报警/事件上传平台设置&第${val[
                                  "info"
                              ][0]["uploadEventPlatform"].join(
                                  "、"
                              )}中心&第${this.copyForm["param905"][
                                  this.activeChannel
                              ]["param905_19"]["info"][0][
                                  "uploadEventPlatform"
                              ].join("、")}中心`
                            : "";
                    this.$emit("formDataChange", this.formData);
                }
            },
            deep: true,
            immediate: true,
        },
        "form.param905_9": {
            handler(val) {
                if (val && !Boolean(this.isTemplate)) {
                    this.formData[
                        "param905_9." +
                            this.activeChannel +
                            ".info.0.enable.useless.useless.useless"
                    ] =
                        val["info"][0]["enable"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_9"
                        ]["info"][0]["enable"]
                            ? `param905_9.${
                                  this.activeChannel
                              }.info.0.enable.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/急加速/一级报警/报警使能&${
                                  val["info"][0]["enable"] ? "开启" : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_9"
                                  ]["info"][0]["enable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_9." +
                            this.activeChannel +
                            ".info.0.speed.useless.useless.useless"
                    ] =
                        val["info"][0]["speed"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_9"
                        ]["info"][0]["speed"]
                            ? `param905_9.${
                                  this.activeChannel
                              }.info.0.speed.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/急加速/一级报警/报警判断速度阈值&${
                                  val["info"][0]["speed"]
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_9"
                                  ]["info"][0]["speed"]
                              }`
                            : "";
                    this.formData[
                        "param905_9." +
                            this.activeChannel +
                            ".info.0.confidence.useless.useless.useless"
                    ] =
                        val["info"][0]["confidence"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_9"
                        ]["info"][0]["confidence"]
                            ? `param905_9.${
                                  this.activeChannel
                              }.info.0.confidence.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/急加速/一级报警/算法置信度&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].confidenceList.find(
                                      (e) => e.value === val.info[0].confidence
                                  ).label
                              }&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].confidenceList.find(
                                      (e) =>
                                          e.value ===
                                          this.copyForm["param905"][
                                              this.activeChannel
                                          ]["param905_9"]["info"][0][
                                              "confidence"
                                          ]
                                  ).label
                              }`
                            : "";
                    this.formData[
                        "param905_9." +
                            this.activeChannel +
                            ".info.0.sensitivity.useless.useless.useless"
                    ] =
                        val["info"][0]["sensitivity"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_9"
                        ]["info"][0]["sensitivity"]
                            ? `param905_9.${
                                  this.activeChannel
                              }.info.0.sensitivity.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/急加速/一级报警/算法灵敏度&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].sensitivityList.find(
                                      (e) => e.value === val.info[0].sensitivity
                                  ).label
                              }&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].sensitivityList.find(
                                      (e) =>
                                          e.value ===
                                          this.copyForm["param905"][
                                              this.activeChannel
                                          ]["param905_9"]["info"][0][
                                              "sensitivity"
                                          ]
                                  ).label
                              }`
                            : "";
                    this.formData[
                        "param905_9." +
                            this.activeChannel +
                            ".info.0.volume.useless.useless.useless"
                    ] =
                        val["info"][0]["volume"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_9"
                        ]["info"][0]["volume"]
                            ? `param905_9.${
                                  this.activeChannel
                              }.info.0.volume.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/急加速/一级报警/报警音量&${
                                  val["info"][0]["volume"]
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_9"
                                  ]["info"][0]["volume"]
                              }`
                            : "";
                    this.formData[
                        "param905_9." +
                            this.activeChannel +
                            ".info.0.volumeEnable.useless.useless.useless"
                    ] =
                        val["info"][0]["volumeEnable"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_9"
                        ]["info"][0]["volumeEnable"]
                            ? `param905_9.${
                                  this.activeChannel
                              }.info.0.volumeEnable.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/急加速/一级报警/音量使能&${
                                  val["info"][0]["volumeEnable"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_9"
                                  ]["info"][0]["volumeEnable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_9." +
                            this.activeChannel +
                            ".info.0.snapshot.upload.useless.useless.useless"
                    ] =
                        val["info"][0]["snapshot"]["upload"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_9"
                        ]["info"][0]["snapshot"]["upload"]
                            ? `param905_9.${
                                  this.activeChannel
                              }.info.0.snapshot.upload.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/急加速/一级报警/报警图片上传使能&${
                                  val["info"][0]["snapshot"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_9"
                                  ]["info"][0]["snapshot"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_9." +
                            this.activeChannel +
                            ".info.0.clip.upload.useless.useless.useless"
                    ] =
                        val["info"][0]["clip"]["upload"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_9"
                        ]["info"][0]["clip"]["upload"]
                            ? `param905_9.${
                                  this.activeChannel
                              }.info.0.clip.upload.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/急加速/一级报警/报警视频上传使能&${
                                  val["info"][0]["clip"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_9"
                                  ]["info"][0]["clip"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_9." +
                            this.activeChannel +
                            ".info.0.uploadEventPlatform.useless.useless.useless"
                    ] =
                        val["info"][0]["uploadEventPlatform"].join("_") !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_9"
                        ]["info"][0]["uploadEventPlatform"].join("_")
                            ? `param905_9.${
                                  this.activeChannel
                              }.info.0.uploadEventPlatform.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/急加速/一级报警/事件上传平台设置&第${val[
                                  "info"
                              ][0]["uploadEventPlatform"].join(
                                  "、"
                              )}中心&第${this.copyForm["param905"][
                                  this.activeChannel
                              ]["param905_9"]["info"][0][
                                  "uploadEventPlatform"
                              ].join("、")}中心`
                            : "";
                    this.$emit("formDataChange", this.formData);
                }
            },
            deep: true,
            immediate: true,
        },
        "form.param905_20": {
            handler(val) {
                if (val && !Boolean(this.isTemplate)) {
                    this.formData[
                        "param905_20." +
                            this.activeChannel +
                            ".info.0.enable.useless.useless.useless"
                    ] =
                        val["info"][0]["enable"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_20"
                        ]["info"][0]["enable"]
                            ? `param905_20.${
                                  this.activeChannel
                              }.info.0.enable.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/急加速/二级报警/报警使能&${
                                  val["info"][0]["enable"] ? "开启" : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_20"
                                  ]["info"][0]["enable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_20." +
                            this.activeChannel +
                            ".info.0.speed.useless.useless.useless"
                    ] =
                        val["info"][0]["speed"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_20"
                        ]["info"][0]["speed"]
                            ? `param905_20.${
                                  this.activeChannel
                              }.info.0.speed.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/急加速/二级报警/报警判断速度阈值&${
                                  val["info"][0]["speed"]
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_20"
                                  ]["info"][0]["speed"]
                              }`
                            : "";
                    this.formData[
                        "param905_20." +
                            this.activeChannel +
                            ".info.0.confidence.useless.useless.useless"
                    ] =
                        val["info"][0]["confidence"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_20"
                        ]["info"][0]["confidence"]
                            ? `param905_20.${
                                  this.activeChannel
                              }.info.0.confidence.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/急加速/二级报警/算法置信度&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].confidenceList.find(
                                      (e) => e.value === val.info[0].confidence
                                  ).label
                              }&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].confidenceList.find(
                                      (e) =>
                                          e.value ===
                                          this.copyForm["param905"][
                                              this.activeChannel
                                          ]["param905_20"]["info"][0][
                                              "confidence"
                                          ]
                                  ).label
                              }`
                            : "";
                    this.formData[
                        "param905_20." +
                            this.activeChannel +
                            ".info.0.sensitivity.useless.useless.useless"
                    ] =
                        val["info"][0]["sensitivity"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_20"
                        ]["info"][0]["sensitivity"]
                            ? `param905_20.${
                                  this.activeChannel
                              }.info.0.sensitivity.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/急加速/二级报警/算法灵敏度&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].sensitivityList.find(
                                      (e) => e.value === val.info[0].sensitivity
                                  ).label
                              }&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].sensitivityList.find(
                                      (e) =>
                                          e.value ===
                                          this.copyForm["param905"][
                                              this.activeChannel
                                          ]["param905_20"]["info"][0][
                                              "sensitivity"
                                          ]
                                  ).label
                              }`
                            : "";
                    this.formData[
                        "param905_20." +
                            this.activeChannel +
                            ".info.0.volume.useless.useless.useless"
                    ] =
                        val["info"][0]["volume"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_20"
                        ]["info"][0]["volume"]
                            ? `param905_20.${
                                  this.activeChannel
                              }.info.0.volume.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/急加速/二级报警/报警音量&${
                                  val["info"][0]["volume"]
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_20"
                                  ]["info"][0]["volume"]
                              }`
                            : "";
                    this.formData[
                        "param905_20." +
                            this.activeChannel +
                            ".info.0.volumeEnable.useless.useless.useless"
                    ] =
                        val["info"][0]["volumeEnable"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_20"
                        ]["info"][0]["volumeEnable"]
                            ? `param905_20.${
                                  this.activeChannel
                              }.info.0.volumeEnable.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/急加速/二级报警/音量使能&${
                                  val["info"][0]["volumeEnable"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_20"
                                  ]["info"][0]["volumeEnable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_20." +
                            this.activeChannel +
                            ".info.0.snapshot.upload.useless.useless.useless"
                    ] =
                        val["info"][0]["snapshot"]["upload"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_20"
                        ]["info"][0]["snapshot"]["upload"]
                            ? `param905_20.${
                                  this.activeChannel
                              }.info.0.snapshot.upload.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/急加速/二级报警/报警图片上传使能&${
                                  val["info"][0]["snapshot"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_20"
                                  ]["info"][0]["snapshot"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_20." +
                            this.activeChannel +
                            ".info.0.clip.upload.useless.useless.useless"
                    ] =
                        val["info"][0]["clip"]["upload"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_20"
                        ]["info"][0]["clip"]["upload"]
                            ? `param905_20.${
                                  this.activeChannel
                              }.info.0.clip.upload.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/急加速/二级报警/报警视频上传使能&${
                                  val["info"][0]["clip"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_20"
                                  ]["info"][0]["clip"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_20." +
                            this.activeChannel +
                            ".info.0.uploadEventPlatform.useless.useless.useless"
                    ] =
                        val["info"][0]["uploadEventPlatform"].join("_") !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_20"
                        ]["info"][0]["uploadEventPlatform"].join("_")
                            ? `param905_20.${
                                  this.activeChannel
                              }.info.0.uploadEventPlatform.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/急加速/二级报警/事件上传平台设置&第${val[
                                  "info"
                              ][0]["uploadEventPlatform"].join(
                                  "、"
                              )}中心&第${this.copyForm["param905"][
                                  this.activeChannel
                              ]["param905_20"]["info"][0][
                                  "uploadEventPlatform"
                              ].join("、")}中心`
                            : "";
                    this.$emit("formDataChange", this.formData);
                }
            },
            deep: true,
            immediate: true,
        },
        "form.param905_10": {
            handler(val) {
                if (val && !Boolean(this.isTemplate)) {
                    this.formData[
                        "param905_10." +
                            this.activeChannel +
                            ".info.0.enable.useless.useless.useless"
                    ] =
                        val["info"][0]["enable"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_10"
                        ]["info"][0]["enable"]
                            ? `param905_10.${
                                  this.activeChannel
                              }.info.0.enable.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/急减速/一级报警/报警使能&${
                                  val["info"][0]["enable"] ? "开启" : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_10"
                                  ]["info"][0]["enable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_10." +
                            this.activeChannel +
                            ".info.0.speed.useless.useless.useless"
                    ] =
                        val["info"][0]["speed"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_10"
                        ]["info"][0]["speed"]
                            ? `param905_10.${
                                  this.activeChannel
                              }.info.0.speed.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/急减速/一级报警/报警判断速度阈值&${
                                  val["info"][0]["speed"]
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_10"
                                  ]["info"][0]["speed"]
                              }`
                            : "";
                    this.formData[
                        "param905_10." +
                            this.activeChannel +
                            ".info.0.confidence.useless.useless.useless"
                    ] =
                        val["info"][0]["confidence"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_10"
                        ]["info"][0]["confidence"]
                            ? `param905_10.${
                                  this.activeChannel
                              }.info.0.confidence.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/急减速/一级报警/算法置信度&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].confidenceList.find(
                                      (e) => e.value === val.info[0].confidence
                                  ).label
                              }&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].confidenceList.find(
                                      (e) =>
                                          e.value ===
                                          this.copyForm["param905"][
                                              this.activeChannel
                                          ]["param905_10"]["info"][0][
                                              "confidence"
                                          ]
                                  ).label
                              }`
                            : "";
                    this.formData[
                        "param905_10." +
                            this.activeChannel +
                            ".info.0.sensitivity.useless.useless.useless"
                    ] =
                        val["info"][0]["sensitivity"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_10"
                        ]["info"][0]["sensitivity"]
                            ? `param905_10.${
                                  this.activeChannel
                              }.info.0.sensitivity.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/急减速/一级报警/算法灵敏度&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].sensitivityList.find(
                                      (e) => e.value === val.info[0].sensitivity
                                  ).label
                              }&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].sensitivityList.find(
                                      (e) =>
                                          e.value ===
                                          this.copyForm["param905"][
                                              this.activeChannel
                                          ]["param905_10"]["info"][0][
                                              "sensitivity"
                                          ]
                                  ).label
                              }`
                            : "";
                    this.formData[
                        "param905_10." +
                            this.activeChannel +
                            ".info.0.volume.useless.useless.useless"
                    ] =
                        val["info"][0]["volume"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_10"
                        ]["info"][0]["volume"]
                            ? `param905_10.${
                                  this.activeChannel
                              }.info.0.volume.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/急减速/一级报警/报警音量&${
                                  val["info"][0]["volume"]
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_10"
                                  ]["info"][0]["volume"]
                              }`
                            : "";
                    this.formData[
                        "param905_10." +
                            this.activeChannel +
                            ".info.0.volumeEnable.useless.useless.useless"
                    ] =
                        val["info"][0]["volumeEnable"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_10"
                        ]["info"][0]["volumeEnable"]
                            ? `param905_10.${
                                  this.activeChannel
                              }.info.0.volumeEnable.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/急减速/一级报警/音量使能&${
                                  val["info"][0]["volumeEnable"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_10"
                                  ]["info"][0]["volumeEnable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_10." +
                            this.activeChannel +
                            ".info.0.snapshot.upload.useless.useless.useless"
                    ] =
                        val["info"][0]["snapshot"]["upload"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_10"
                        ]["info"][0]["snapshot"]["upload"]
                            ? `param905_10.${
                                  this.activeChannel
                              }.info.0.snapshot.upload.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/急减速/一级报警/报警图片上传使能&${
                                  val["info"][0]["snapshot"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_10"
                                  ]["info"][0]["snapshot"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_10." +
                            this.activeChannel +
                            ".info.0.clip.upload.useless.useless.useless"
                    ] =
                        val["info"][0]["clip"]["upload"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_10"
                        ]["info"][0]["clip"]["upload"]
                            ? `param905_10.${
                                  this.activeChannel
                              }.info.0.clip.upload.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/急减速/一级报警/报警视频上传使能&${
                                  val["info"][0]["clip"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_10"
                                  ]["info"][0]["clip"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_10." +
                            this.activeChannel +
                            ".info.0.uploadEventPlatform.useless.useless.useless"
                    ] =
                        val["info"][0]["uploadEventPlatform"].join("_") !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_10"
                        ]["info"][0]["uploadEventPlatform"].join("_")
                            ? `param905_10.${
                                  this.activeChannel
                              }.info.0.uploadEventPlatform.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/急减速/一级报警/事件上传平台设置&第${val[
                                  "info"
                              ][0]["uploadEventPlatform"].join(
                                  "、"
                              )}中心&第${this.copyForm["param905"][
                                  this.activeChannel
                              ]["param905_10"]["info"][0][
                                  "uploadEventPlatform"
                              ].join("、")}中心`
                            : "";
                    this.$emit("formDataChange", this.formData);
                }
            },
            deep: true,
            immediate: true,
        },
        "form.param905_21": {
            handler(val) {
                if (val && !Boolean(this.isTemplate)) {
                    this.formData[
                        "param905_21." +
                            this.activeChannel +
                            ".info.0.enable.useless.useless.useless"
                    ] =
                        val["info"][0]["enable"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_21"
                        ]["info"][0]["enable"]
                            ? `param905_21.${
                                  this.activeChannel
                              }.info.0.enable.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/急减速/二级报警/报警使能&${
                                  val["info"][0]["enable"] ? "开启" : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_21"
                                  ]["info"][0]["enable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_21." +
                            this.activeChannel +
                            ".info.0.speed.useless.useless.useless"
                    ] =
                        val["info"][0]["speed"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_21"
                        ]["info"][0]["speed"]
                            ? `param905_21.${
                                  this.activeChannel
                              }.info.0.speed.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/急减速/二级报警/报警判断速度阈值&${
                                  val["info"][0]["speed"]
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_21"
                                  ]["info"][0]["speed"]
                              }`
                            : "";
                    this.formData[
                        "param905_21." +
                            this.activeChannel +
                            ".info.0.confidence.useless.useless.useless"
                    ] =
                        val["info"][0]["confidence"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_21"
                        ]["info"][0]["confidence"]
                            ? `param905_21.${
                                  this.activeChannel
                              }.info.0.confidence.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/急减速/二级报警/算法置信度&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].confidenceList.find(
                                      (e) => e.value === val.info[0].confidence
                                  ).label
                              }&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].confidenceList.find(
                                      (e) =>
                                          e.value ===
                                          this.copyForm["param905"][
                                              this.activeChannel
                                          ]["param905_21"]["info"][0][
                                              "confidence"
                                          ]
                                  ).label
                              }`
                            : "";
                    this.formData[
                        "param905_21." +
                            this.activeChannel +
                            ".info.0.sensitivity.useless.useless.useless"
                    ] =
                        val["info"][0]["sensitivity"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_21"
                        ]["info"][0]["sensitivity"]
                            ? `param905_21.${
                                  this.activeChannel
                              }.info.0.sensitivity.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/急减速/二级报警/算法灵敏度&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].sensitivityList.find(
                                      (e) => e.value === val.info[0].sensitivity
                                  ).label
                              }&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].sensitivityList.find(
                                      (e) =>
                                          e.value ===
                                          this.copyForm["param905"][
                                              this.activeChannel
                                          ]["param905_21"]["info"][0][
                                              "sensitivity"
                                          ]
                                  ).label
                              }`
                            : "";
                    this.formData[
                        "param905_21." +
                            this.activeChannel +
                            ".info.0.volume.useless.useless.useless"
                    ] =
                        val["info"][0]["volume"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_21"
                        ]["info"][0]["volume"]
                            ? `param905_21.${
                                  this.activeChannel
                              }.info.0.volume.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/急减速/二级报警/报警音量&${
                                  val["info"][0]["volume"]
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_21"
                                  ]["info"][0]["volume"]
                              }`
                            : "";
                    this.formData[
                        "param905_21." +
                            this.activeChannel +
                            ".info.0.volumeEnable.useless.useless.useless"
                    ] =
                        val["info"][0]["volumeEnable"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_21"
                        ]["info"][0]["volumeEnable"]
                            ? `param905_21.${
                                  this.activeChannel
                              }.info.0.volumeEnable.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/急减速/二级报警/音量使能&${
                                  val["info"][0]["volumeEnable"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_21"
                                  ]["info"][0]["volumeEnable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_21." +
                            this.activeChannel +
                            ".info.0.snapshot.upload.useless.useless.useless"
                    ] =
                        val["info"][0]["snapshot"]["upload"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_21"
                        ]["info"][0]["snapshot"]["upload"]
                            ? `param905_21.${
                                  this.activeChannel
                              }.info.0.snapshot.upload.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/急减速/二级报警/报警图片上传使能&${
                                  val["info"][0]["snapshot"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_21"
                                  ]["info"][0]["snapshot"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_21." +
                            this.activeChannel +
                            ".info.0.clip.upload.useless.useless.useless"
                    ] =
                        val["info"][0]["clip"]["upload"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_21"
                        ]["info"][0]["clip"]["upload"]
                            ? `param905_21.${
                                  this.activeChannel
                              }.info.0.clip.upload.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/急减速/二级报警/报警视频上传使能&${
                                  val["info"][0]["clip"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_21"
                                  ]["info"][0]["clip"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_21." +
                            this.activeChannel +
                            ".info.0.uploadEventPlatform.useless.useless.useless"
                    ] =
                        val["info"][0]["uploadEventPlatform"].join("_") !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_21"
                        ]["info"][0]["uploadEventPlatform"].join("_")
                            ? `param905_21.${
                                  this.activeChannel
                              }.info.0.uploadEventPlatform.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/急减速/二级报警/事件上传平台设置&第${val[
                                  "info"
                              ][0]["uploadEventPlatform"].join(
                                  "、"
                              )}中心&第${this.copyForm["param905"][
                                  this.activeChannel
                              ]["param905_21"]["info"][0][
                                  "uploadEventPlatform"
                              ].join("、")}中心`
                            : "";
                    this.$emit("formDataChange", this.formData);
                }
            },
            deep: true,
            immediate: true,
        },
        "form.param905_11": {
            handler(val) {
                if (val && !Boolean(this.isTemplate)) {
                    this.formData[
                        "param905_11." +
                            this.activeChannel +
                            ".info.0.enable.useless.useless.useless"
                    ] =
                        val["info"][0]["enable"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_11"
                        ]["info"][0]["enable"]
                            ? `param905_11.${
                                  this.activeChannel
                              }.info.0.enable.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/急转弯/一级报警/报警使能&${
                                  val["info"][0]["enable"] ? "开启" : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_11"
                                  ]["info"][0]["enable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_11." +
                            this.activeChannel +
                            ".info.0.speed.useless.useless.useless"
                    ] =
                        val["info"][0]["speed"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_11"
                        ]["info"][0]["speed"]
                            ? `param905_11.${
                                  this.activeChannel
                              }.info.0.speed.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/急转弯/一级报警/报警判断速度阈值&${
                                  val["info"][0]["speed"]
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_11"
                                  ]["info"][0]["speed"]
                              }`
                            : "";
                    this.formData[
                        "param905_11." +
                            this.activeChannel +
                            ".info.0.confidence.useless.useless.useless"
                    ] =
                        val["info"][0]["confidence"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_11"
                        ]["info"][0]["confidence"]
                            ? `param905_11.${
                                  this.activeChannel
                              }.info.0.confidence.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/急转弯/一级报警/算法置信度&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].confidenceList.find(
                                      (e) => e.value === val.info[0].confidence
                                  ).label
                              }&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].confidenceList.find(
                                      (e) =>
                                          e.value ===
                                          this.copyForm["param905"][
                                              this.activeChannel
                                          ]["param905_11"]["info"][0][
                                              "confidence"
                                          ]
                                  ).label
                              }`
                            : "";
                    this.formData[
                        "param905_11." +
                            this.activeChannel +
                            ".info.0.sensitivity.useless.useless.useless"
                    ] =
                        val["info"][0]["sensitivity"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_11"
                        ]["info"][0]["sensitivity"]
                            ? `param905_11.${
                                  this.activeChannel
                              }.info.0.sensitivity.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/急转弯/一级报警/算法灵敏度&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].sensitivityList.find(
                                      (e) => e.value === val.info[0].sensitivity
                                  ).label
                              }&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].sensitivityList.find(
                                      (e) =>
                                          e.value ===
                                          this.copyForm["param905"][
                                              this.activeChannel
                                          ]["param905_11"]["info"][0][
                                              "sensitivity"
                                          ]
                                  ).label
                              }`
                            : "";
                    this.formData[
                        "param905_11." +
                            this.activeChannel +
                            ".info.0.volume.useless.useless.useless"
                    ] =
                        val["info"][0]["volume"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_11"
                        ]["info"][0]["volume"]
                            ? `param905_11.${
                                  this.activeChannel
                              }.info.0.volume.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/急转弯/一级报警/报警音量&${
                                  val["info"][0]["volume"]
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_11"
                                  ]["info"][0]["volume"]
                              }`
                            : "";
                    this.formData[
                        "param905_11." +
                            this.activeChannel +
                            ".info.0.volumeEnable.useless.useless.useless"
                    ] =
                        val["info"][0]["volumeEnable"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_11"
                        ]["info"][0]["volumeEnable"]
                            ? `param905_11.${
                                  this.activeChannel
                              }.info.0.volumeEnable.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/急转弯/一级报警/音量使能&${
                                  val["info"][0]["volumeEnable"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_11"
                                  ]["info"][0]["volumeEnable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_11." +
                            this.activeChannel +
                            ".info.0.snapshot.upload.useless.useless.useless"
                    ] =
                        val["info"][0]["snapshot"]["upload"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_11"
                        ]["info"][0]["snapshot"]["upload"]
                            ? `param905_11.${
                                  this.activeChannel
                              }.info.0.snapshot.upload.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/急转弯/一级报警/报警图片上传使能&${
                                  val["info"][0]["snapshot"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_11"
                                  ]["info"][0]["snapshot"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_11." +
                            this.activeChannel +
                            ".info.0.clip.upload.useless.useless.useless"
                    ] =
                        val["info"][0]["clip"]["upload"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_11"
                        ]["info"][0]["clip"]["upload"]
                            ? `param905_11.${
                                  this.activeChannel
                              }.info.0.clip.upload.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/急转弯/一级报警/报警视频上传使能&${
                                  val["info"][0]["clip"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_11"
                                  ]["info"][0]["clip"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_11." +
                            this.activeChannel +
                            ".info.0.uploadEventPlatform.useless.useless.useless"
                    ] =
                        val["info"][0]["uploadEventPlatform"].join("_") !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_11"
                        ]["info"][0]["uploadEventPlatform"].join("_")
                            ? `param905_11.${
                                  this.activeChannel
                              }.info.0.uploadEventPlatform.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/急转弯/一级报警/事件上传平台设置&第${val[
                                  "info"
                              ][0]["uploadEventPlatform"].join(
                                  "、"
                              )}中心&第${this.copyForm["param905"][
                                  this.activeChannel
                              ]["param905_11"]["info"][0][
                                  "uploadEventPlatform"
                              ].join("、")}中心`
                            : "";
                    this.$emit("formDataChange", this.formData);
                }
            },
            deep: true,
            immediate: true,
        },
        "form.param905_22": {
            handler(val) {
                if (val && !Boolean(this.isTemplate)) {
                    this.formData[
                        "param905_22." +
                            this.activeChannel +
                            ".info.0.enable.useless.useless.useless"
                    ] =
                        val["info"][0]["enable"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_22"
                        ]["info"][0]["enable"]
                            ? `param905_22.${
                                  this.activeChannel
                              }.info.0.enable.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/急转弯/二级报警/报警使能&${
                                  val["info"][0]["enable"] ? "开启" : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_22"
                                  ]["info"][0]["enable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_22." +
                            this.activeChannel +
                            ".info.0.speed.useless.useless.useless"
                    ] =
                        val["info"][0]["speed"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_22"
                        ]["info"][0]["speed"]
                            ? `param905_22.${
                                  this.activeChannel
                              }.info.0.speed.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/急转弯/二级报警/报警判断速度阈值&${
                                  val["info"][0]["speed"]
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_22"
                                  ]["info"][0]["speed"]
                              }`
                            : "";
                    this.formData[
                        "param905_22." +
                            this.activeChannel +
                            ".info.0.confidence.useless.useless.useless"
                    ] =
                        val["info"][0]["confidence"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_22"
                        ]["info"][0]["confidence"]
                            ? `param905_22.${
                                  this.activeChannel
                              }.info.0.confidence.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/急转弯/二级报警/算法置信度&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].confidenceList.find(
                                      (e) => e.value === val.info[0].confidence
                                  ).label
                              }&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].confidenceList.find(
                                      (e) =>
                                          e.value ===
                                          this.copyForm["param905"][
                                              this.activeChannel
                                          ]["param905_22"]["info"][0][
                                              "confidence"
                                          ]
                                  ).label
                              }`
                            : "";
                    this.formData[
                        "param905_22." +
                            this.activeChannel +
                            ".info.0.sensitivity.useless.useless.useless"
                    ] =
                        val["info"][0]["sensitivity"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_22"
                        ]["info"][0]["sensitivity"]
                            ? `param905_22.${
                                  this.activeChannel
                              }.info.0.sensitivity.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/急转弯/二级报警/算法灵敏度&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].sensitivityList.find(
                                      (e) => e.value === val.info[0].sensitivity
                                  ).label
                              }&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].sensitivityList.find(
                                      (e) =>
                                          e.value ===
                                          this.copyForm["param905"][
                                              this.activeChannel
                                          ]["param905_22"]["info"][0][
                                              "sensitivity"
                                          ]
                                  ).label
                              }`
                            : "";
                    this.formData[
                        "param905_22." +
                            this.activeChannel +
                            ".info.0.volume.useless.useless.useless"
                    ] =
                        val["info"][0]["volume"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_22"
                        ]["info"][0]["volume"]
                            ? `param905_22.${
                                  this.activeChannel
                              }.info.0.volume.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/急转弯/二级报警/报警音量&${
                                  val["info"][0]["volume"]
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_22"
                                  ]["info"][0]["volume"]
                              }`
                            : "";
                    this.formData[
                        "param905_22." +
                            this.activeChannel +
                            ".info.0.volumeEnable.useless.useless.useless"
                    ] =
                        val["info"][0]["volumeEnable"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_22"
                        ]["info"][0]["volumeEnable"]
                            ? `param905_22.${
                                  this.activeChannel
                              }.info.0.volumeEnable.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/急转弯/二级报警/音量使能&${
                                  val["info"][0]["volumeEnable"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_22"
                                  ]["info"][0]["volumeEnable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_22." +
                            this.activeChannel +
                            ".info.0.snapshot.upload.useless.useless.useless"
                    ] =
                        val["info"][0]["snapshot"]["upload"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_22"
                        ]["info"][0]["snapshot"]["upload"]
                            ? `param905_22.${
                                  this.activeChannel
                              }.info.0.snapshot.upload.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/急转弯/二级报警/报警图片上传使能&${
                                  val["info"][0]["snapshot"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_22"
                                  ]["info"][0]["snapshot"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_22." +
                            this.activeChannel +
                            ".info.0.clip.upload.useless.useless.useless"
                    ] =
                        val["info"][0]["clip"]["upload"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_22"
                        ]["info"][0]["clip"]["upload"]
                            ? `param905_22.${
                                  this.activeChannel
                              }.info.0.clip.upload.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/急转弯/二级报警/报警视频上传使能&${
                                  val["info"][0]["clip"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_22"
                                  ]["info"][0]["clip"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_22." +
                            this.activeChannel +
                            ".info.0.uploadEventPlatform.useless.useless.useless"
                    ] =
                        val["info"][0]["uploadEventPlatform"].join("_") !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_22"
                        ]["info"][0]["uploadEventPlatform"].join("_")
                            ? `param905_22.${
                                  this.activeChannel
                              }.info.0.uploadEventPlatform.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/急转弯/二级报警/事件上传平台设置&第${val[
                                  "info"
                              ][0]["uploadEventPlatform"].join(
                                  "、"
                              )}中心&第${this.copyForm["param905"][
                                  this.activeChannel
                              ]["param905_22"]["info"][0][
                                  "uploadEventPlatform"
                              ].join("、")}中心`
                            : "";
                    this.$emit("formDataChange", this.formData);
                }
            },
            deep: true,
            immediate: true,
        },
        "form.param905_12": {
            handler(val) {
                if (val && !Boolean(this.isTemplate)) {
                    this.formData[
                        "param905_12." +
                            this.activeChannel +
                            ".info.0.enable.useless.useless.useless"
                    ] =
                        val["info"][0]["enable"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_12"
                        ]["info"][0]["enable"]
                            ? `param905_12.${
                                  this.activeChannel
                              }.info.0.enable.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/驾驶员异常/一级报警/报警使能&${
                                  val["info"][0]["enable"] ? "开启" : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_12"
                                  ]["info"][0]["enable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_12." +
                            this.activeChannel +
                            ".info.0.speed.useless.useless.useless"
                    ] =
                        val["info"][0]["speed"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_12"
                        ]["info"][0]["speed"]
                            ? `param905_12.${
                                  this.activeChannel
                              }.info.0.speed.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/驾驶员异常/一级报警/报警判断速度阈值&${
                                  val["info"][0]["speed"]
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_12"
                                  ]["info"][0]["speed"]
                              }`
                            : "";
                    this.formData[
                        "param905_12." +
                            this.activeChannel +
                            ".info.0.confidence.useless.useless.useless"
                    ] =
                        val["info"][0]["confidence"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_12"
                        ]["info"][0]["confidence"]
                            ? `param905_12.${
                                  this.activeChannel
                              }.info.0.confidence.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/驾驶员异常/一级报警/算法置信度&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].confidenceList.find(
                                      (e) => e.value === val.info[0].confidence
                                  ).label
                              }&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].confidenceList.find(
                                      (e) =>
                                          e.value ===
                                          this.copyForm["param905"][
                                              this.activeChannel
                                          ]["param905_12"]["info"][0][
                                              "confidence"
                                          ]
                                  ).label
                              }`
                            : "";
                    this.formData[
                        "param905_12." +
                            this.activeChannel +
                            ".info.0.sensitivity.useless.useless.useless"
                    ] =
                        val["info"][0]["sensitivity"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_12"
                        ]["info"][0]["sensitivity"]
                            ? `param905_12.${
                                  this.activeChannel
                              }.info.0.sensitivity.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/驾驶员异常/一级报警/算法灵敏度&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].sensitivityList.find(
                                      (e) => e.value === val.info[0].sensitivity
                                  ).label
                              }&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].sensitivityList.find(
                                      (e) =>
                                          e.value ===
                                          this.copyForm["param905"][
                                              this.activeChannel
                                          ]["param905_12"]["info"][0][
                                              "sensitivity"
                                          ]
                                  ).label
                              }`
                            : "";
                    this.formData[
                        "param905_12." +
                            this.activeChannel +
                            ".info.0.volume.useless.useless.useless"
                    ] =
                        val["info"][0]["volume"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_12"
                        ]["info"][0]["volume"]
                            ? `param905_12.${
                                  this.activeChannel
                              }.info.0.volume.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/驾驶员异常/一级报警/报警音量&${
                                  val["info"][0]["volume"]
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_12"
                                  ]["info"][0]["volume"]
                              }`
                            : "";
                    this.formData[
                        "param905_12." +
                            this.activeChannel +
                            ".info.0.volumeEnable.useless.useless.useless"
                    ] =
                        val["info"][0]["volumeEnable"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_12"
                        ]["info"][0]["volumeEnable"]
                            ? `param905_12.${
                                  this.activeChannel
                              }.info.0.volumeEnable.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/驾驶员异常/一级报警/音量使能&${
                                  val["info"][0]["volumeEnable"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_12"
                                  ]["info"][0]["volumeEnable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_12." +
                            this.activeChannel +
                            ".info.0.snapshot.upload.useless.useless.useless"
                    ] =
                        val["info"][0]["snapshot"]["upload"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_12"
                        ]["info"][0]["snapshot"]["upload"]
                            ? `param905_12.${
                                  this.activeChannel
                              }.info.0.snapshot.upload.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/驾驶员异常/一级报警/报警图片上传使能&${
                                  val["info"][0]["snapshot"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_12"
                                  ]["info"][0]["snapshot"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_12." +
                            this.activeChannel +
                            ".info.0.clip.upload.useless.useless.useless"
                    ] =
                        val["info"][0]["clip"]["upload"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_12"
                        ]["info"][0]["clip"]["upload"]
                            ? `param905_12.${
                                  this.activeChannel
                              }.info.0.clip.upload.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/驾驶员异常/一级报警/报警视频上传使能&${
                                  val["info"][0]["clip"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_12"
                                  ]["info"][0]["clip"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_12." +
                            this.activeChannel +
                            ".info.0.uploadEventPlatform.useless.useless.useless"
                    ] =
                        val["info"][0]["uploadEventPlatform"].join("_") !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_12"
                        ]["info"][0]["uploadEventPlatform"].join("_")
                            ? `param905_12.${
                                  this.activeChannel
                              }.info.0.uploadEventPlatform.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/驾驶员异常/一级报警/事件上传平台设置&第${val[
                                  "info"
                              ][0]["uploadEventPlatform"].join(
                                  "、"
                              )}中心&第${this.copyForm["param905"][
                                  this.activeChannel
                              ]["param905_12"]["info"][0][
                                  "uploadEventPlatform"
                              ].join("、")}中心`
                            : "";
                    this.$emit("formDataChange", this.formData);
                }
            },
            deep: true,
            immediate: true,
        },
        "form.param905_23": {
            handler(val) {
                if (val && !Boolean(this.isTemplate)) {
                    this.formData[
                        "param905_23." +
                            this.activeChannel +
                            ".info.0.enable.useless.useless.useless"
                    ] =
                        val["info"][0]["enable"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_23"
                        ]["info"][0]["enable"]
                            ? `param905_23.${
                                  this.activeChannel
                              }.info.0.enable.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/驾驶员异常/二级报警/报警使能&${
                                  val["info"][0]["enable"] ? "开启" : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_23"
                                  ]["info"][0]["enable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_23." +
                            this.activeChannel +
                            ".info.0.speed.useless.useless.useless"
                    ] =
                        val["info"][0]["speed"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_23"
                        ]["info"][0]["speed"]
                            ? `param905_23.${
                                  this.activeChannel
                              }.info.0.speed.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/驾驶员异常/二级报警/报警判断速度阈值&${
                                  val["info"][0]["speed"]
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_23"
                                  ]["info"][0]["speed"]
                              }`
                            : "";
                    this.formData[
                        "param905_23." +
                            this.activeChannel +
                            ".info.0.confidence.useless.useless.useless"
                    ] =
                        val["info"][0]["confidence"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_23"
                        ]["info"][0]["confidence"]
                            ? `param905_23.${
                                  this.activeChannel
                              }.info.0.confidence.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/驾驶员异常/二级报警/算法置信度&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].confidenceList.find(
                                      (e) => e.value === val.info[0].confidence
                                  ).label
                              }&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].confidenceList.find(
                                      (e) =>
                                          e.value ===
                                          this.copyForm["param905"][
                                              this.activeChannel
                                          ]["param905_23"]["info"][0][
                                              "confidence"
                                          ]
                                  ).label
                              }`
                            : "";
                    this.formData[
                        "param905_23." +
                            this.activeChannel +
                            ".info.0.sensitivity.useless.useless.useless"
                    ] =
                        val["info"][0]["sensitivity"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_23"
                        ]["info"][0]["sensitivity"]
                            ? `param905_23.${
                                  this.activeChannel
                              }.info.0.sensitivity.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/驾驶员异常/二级报警/算法灵敏度&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].sensitivityList.find(
                                      (e) => e.value === val.info[0].sensitivity
                                  ).label
                              }&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].sensitivityList.find(
                                      (e) =>
                                          e.value ===
                                          this.copyForm["param905"][
                                              this.activeChannel
                                          ]["param905_23"]["info"][0][
                                              "sensitivity"
                                          ]
                                  ).label
                              }`
                            : "";
                    this.formData[
                        "param905_23." +
                            this.activeChannel +
                            ".info.0.volume.useless.useless.useless"
                    ] =
                        val["info"][0]["volume"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_23"
                        ]["info"][0]["volume"]
                            ? `param905_23.${
                                  this.activeChannel
                              }.info.0.volume.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/驾驶员异常/二级报警/报警音量&${
                                  val["info"][0]["volume"]
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_23"
                                  ]["info"][0]["volume"]
                              }`
                            : "";
                    this.formData[
                        "param905_23." +
                            this.activeChannel +
                            ".info.0.volumeEnable.useless.useless.useless"
                    ] =
                        val["info"][0]["volumeEnable"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_23"
                        ]["info"][0]["volumeEnable"]
                            ? `param905_23.${
                                  this.activeChannel
                              }.info.0.volumeEnable.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/驾驶员异常/二级报警/音量使能&${
                                  val["info"][0]["volumeEnable"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_23"
                                  ]["info"][0]["volumeEnable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_23." +
                            this.activeChannel +
                            ".info.0.snapshot.upload.useless.useless.useless"
                    ] =
                        val["info"][0]["snapshot"]["upload"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_23"
                        ]["info"][0]["snapshot"]["upload"]
                            ? `param905_23.${
                                  this.activeChannel
                              }.info.0.snapshot.upload.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/驾驶员异常/二级报警/报警图片上传使能&${
                                  val["info"][0]["snapshot"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_23"
                                  ]["info"][0]["snapshot"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_23." +
                            this.activeChannel +
                            ".info.0.clip.upload.useless.useless.useless"
                    ] =
                        val["info"][0]["clip"]["upload"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_23"
                        ]["info"][0]["clip"]["upload"]
                            ? `param905_23.${
                                  this.activeChannel
                              }.info.0.clip.upload.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/驾驶员异常/二级报警/报警视频上传使能&${
                                  val["info"][0]["clip"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_23"
                                  ]["info"][0]["clip"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_23." +
                            this.activeChannel +
                            ".info.0.uploadEventPlatform.useless.useless.useless"
                    ] =
                        val["info"][0]["uploadEventPlatform"].join("_") !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_23"
                        ]["info"][0]["uploadEventPlatform"].join("_")
                            ? `param905_23.${
                                  this.activeChannel
                              }.info.0.uploadEventPlatform.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/驾驶员异常/二级报警/事件上传平台设置&第${val[
                                  "info"
                              ][0]["uploadEventPlatform"].join(
                                  "、"
                              )}中心&第${this.copyForm["param905"][
                                  this.activeChannel
                              ]["param905_23"]["info"][0][
                                  "uploadEventPlatform"
                              ].join("、")}中心`
                            : "";
                    this.$emit("formDataChange", this.formData);
                }
            },
            deep: true,
            immediate: true,
        },
        "form.param905_13": {
            handler(val) {
                if (val && !Boolean(this.isTemplate)) {
                    this.formData[
                        "param905_13." +
                            this.activeChannel +
                            ".info.0.enable.useless.useless.useless"
                    ] =
                        val["info"][0]["enable"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_13"
                        ]["info"][0]["enable"]
                            ? `param905_13.${
                                  this.activeChannel
                              }.info.0.enable.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/超时驾驶/一级报警/报警使能&${
                                  val["info"][0]["enable"] ? "开启" : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_13"
                                  ]["info"][0]["enable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_13." +
                            this.activeChannel +
                            ".info.0.speed.useless.useless.useless"
                    ] =
                        val["info"][0]["speed"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_13"
                        ]["info"][0]["speed"]
                            ? `param905_13.${
                                  this.activeChannel
                              }.info.0.speed.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/超时驾驶/一级报警/报警判断速度阈值&${
                                  val["info"][0]["speed"]
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_13"
                                  ]["info"][0]["speed"]
                              }`
                            : "";
                    this.formData[
                        "param905_13." +
                            this.activeChannel +
                            ".info.0.confidence.useless.useless.useless"
                    ] =
                        val["info"][0]["confidence"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_13"
                        ]["info"][0]["confidence"]
                            ? `param905_13.${
                                  this.activeChannel
                              }.info.0.confidence.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/超时驾驶/一级报警/算法置信度&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].confidenceList.find(
                                      (e) => e.value === val.info[0].confidence
                                  ).label
                              }&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].confidenceList.find(
                                      (e) =>
                                          e.value ===
                                          this.copyForm["param905"][
                                              this.activeChannel
                                          ]["param905_13"]["info"][0][
                                              "confidence"
                                          ]
                                  ).label
                              }`
                            : "";
                    this.formData[
                        "param905_13." +
                            this.activeChannel +
                            ".info.0.sensitivity.useless.useless.useless"
                    ] =
                        val["info"][0]["sensitivity"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_13"
                        ]["info"][0]["sensitivity"]
                            ? `param905_13.${
                                  this.activeChannel
                              }.info.0.sensitivity.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/超时驾驶/一级报警/算法灵敏度&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].sensitivityList.find(
                                      (e) => e.value === val.info[0].sensitivity
                                  ).label
                              }&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].sensitivityList.find(
                                      (e) =>
                                          e.value ===
                                          this.copyForm["param905"][
                                              this.activeChannel
                                          ]["param905_13"]["info"][0][
                                              "sensitivity"
                                          ]
                                  ).label
                              }`
                            : "";
                    this.formData[
                        "param905_13." +
                            this.activeChannel +
                            ".info.0.volume.useless.useless.useless"
                    ] =
                        val["info"][0]["volume"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_13"
                        ]["info"][0]["volume"]
                            ? `param905_13.${
                                  this.activeChannel
                              }.info.0.volume.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/超时驾驶/一级报警/报警音量&${
                                  val["info"][0]["volume"]
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_13"
                                  ]["info"][0]["volume"]
                              }`
                            : "";
                    this.formData[
                        "param905_13." +
                            this.activeChannel +
                            ".info.0.volumeEnable.useless.useless.useless"
                    ] =
                        val["info"][0]["volumeEnable"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_13"
                        ]["info"][0]["volumeEnable"]
                            ? `param905_13.${
                                  this.activeChannel
                              }.info.0.volumeEnable.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/超时驾驶/一级报警/音量使能&${
                                  val["info"][0]["volumeEnable"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_13"
                                  ]["info"][0]["volumeEnable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_13." +
                            this.activeChannel +
                            ".info.0.snapshot.upload.useless.useless.useless"
                    ] =
                        val["info"][0]["snapshot"]["upload"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_13"
                        ]["info"][0]["snapshot"]["upload"]
                            ? `param905_13.${
                                  this.activeChannel
                              }.info.0.snapshot.upload.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/超时驾驶/一级报警/报警图片上传使能&${
                                  val["info"][0]["snapshot"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_13"
                                  ]["info"][0]["snapshot"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_13." +
                            this.activeChannel +
                            ".info.0.clip.upload.useless.useless.useless"
                    ] =
                        val["info"][0]["clip"]["upload"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_13"
                        ]["info"][0]["clip"]["upload"]
                            ? `param905_13.${
                                  this.activeChannel
                              }.info.0.clip.upload.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/超时驾驶/一级报警/报警视频上传使能&${
                                  val["info"][0]["clip"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_13"
                                  ]["info"][0]["clip"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_13." +
                            this.activeChannel +
                            ".info.0.uploadEventPlatform.useless.useless.useless"
                    ] =
                        val["info"][0]["uploadEventPlatform"].join("_") !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_13"
                        ]["info"][0]["uploadEventPlatform"].join("_")
                            ? `param905_13.${
                                  this.activeChannel
                              }.info.0.uploadEventPlatform.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/超时驾驶/一级报警/事件上传平台设置&第${val[
                                  "info"
                              ][0]["uploadEventPlatform"].join(
                                  "、"
                              )}中心&第${this.copyForm["param905"][
                                  this.activeChannel
                              ]["param905_13"]["info"][0][
                                  "uploadEventPlatform"
                              ].join("、")}中心`
                            : "";
                    this.$emit("formDataChange", this.formData);
                }
            },
            deep: true,
            immediate: true,
        },
        "form.param905_24": {
            handler(val) {
                if (val && !Boolean(this.isTemplate)) {
                    this.formData[
                        "param905_24." +
                            this.activeChannel +
                            ".info.0.enable.useless.useless.useless"
                    ] =
                        val["info"][0]["enable"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_24"
                        ]["info"][0]["enable"]
                            ? `param905_24.${
                                  this.activeChannel
                              }.info.0.enable.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/超时驾驶/二级报警/报警使能&${
                                  val["info"][0]["enable"] ? "开启" : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_24"
                                  ]["info"][0]["enable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_24." +
                            this.activeChannel +
                            ".info.0.speed.useless.useless.useless"
                    ] =
                        val["info"][0]["speed"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_24"
                        ]["info"][0]["speed"]
                            ? `param905_24.${
                                  this.activeChannel
                              }.info.0.speed.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/超时驾驶/二级报警/报警判断速度阈值&${
                                  val["info"][0]["speed"]
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_24"
                                  ]["info"][0]["speed"]
                              }`
                            : "";
                    this.formData[
                        "param905_24." +
                            this.activeChannel +
                            ".info.0.confidence.useless.useless.useless"
                    ] =
                        val["info"][0]["confidence"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_24"
                        ]["info"][0]["confidence"]
                            ? `param905_24.${
                                  this.activeChannel
                              }.info.0.confidence.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/超时驾驶/二级报警/算法置信度&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].confidenceList.find(
                                      (e) => e.value === val.info[0].confidence
                                  ).label
                              }&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].confidenceList.find(
                                      (e) =>
                                          e.value ===
                                          this.copyForm["param905"][
                                              this.activeChannel
                                          ]["param905_24"]["info"][0][
                                              "confidence"
                                          ]
                                  ).label
                              }`
                            : "";
                    this.formData[
                        "param905_24." +
                            this.activeChannel +
                            ".info.0.sensitivity.useless.useless.useless"
                    ] =
                        val["info"][0]["sensitivity"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_24"
                        ]["info"][0]["sensitivity"]
                            ? `param905_24.${
                                  this.activeChannel
                              }.info.0.sensitivity.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/超时驾驶/二级报警/算法灵敏度&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].sensitivityList.find(
                                      (e) => e.value === val.info[0].sensitivity
                                  ).label
                              }&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].sensitivityList.find(
                                      (e) =>
                                          e.value ===
                                          this.copyForm["param905"][
                                              this.activeChannel
                                          ]["param905_24"]["info"][0][
                                              "sensitivity"
                                          ]
                                  ).label
                              }`
                            : "";
                    this.formData[
                        "param905_24." +
                            this.activeChannel +
                            ".info.0.volume.useless.useless.useless"
                    ] =
                        val["info"][0]["volume"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_24"
                        ]["info"][0]["volume"]
                            ? `param905_24.${
                                  this.activeChannel
                              }.info.0.volume.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/超时驾驶/二级报警/报警音量&${
                                  val["info"][0]["volume"]
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_24"
                                  ]["info"][0]["volume"]
                              }`
                            : "";
                    this.formData[
                        "param905_24." +
                            this.activeChannel +
                            ".info.0.volumeEnable.useless.useless.useless"
                    ] =
                        val["info"][0]["volumeEnable"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_24"
                        ]["info"][0]["volumeEnable"]
                            ? `param905_24.${
                                  this.activeChannel
                              }.info.0.volumeEnable.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/超时驾驶/二级报警/音量使能&${
                                  val["info"][0]["volumeEnable"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_24"
                                  ]["info"][0]["volumeEnable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_24." +
                            this.activeChannel +
                            ".info.0.snapshot.upload.useless.useless.useless"
                    ] =
                        val["info"][0]["snapshot"]["upload"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_24"
                        ]["info"][0]["snapshot"]["upload"]
                            ? `param905_24.${
                                  this.activeChannel
                              }.info.0.snapshot.upload.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/超时驾驶/二级报警/报警图片上传使能&${
                                  val["info"][0]["snapshot"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_24"
                                  ]["info"][0]["snapshot"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_24." +
                            this.activeChannel +
                            ".info.0.clip.upload.useless.useless.useless"
                    ] =
                        val["info"][0]["clip"]["upload"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_24"
                        ]["info"][0]["clip"]["upload"]
                            ? `param905_24.${
                                  this.activeChannel
                              }.info.0.clip.upload.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/超时驾驶/二级报警/报警视频上传使能&${
                                  val["info"][0]["clip"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_24"
                                  ]["info"][0]["clip"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_24." +
                            this.activeChannel +
                            ".info.0.uploadEventPlatform.useless.useless.useless"
                    ] =
                        val["info"][0]["uploadEventPlatform"].join("_") !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_24"
                        ]["info"][0]["uploadEventPlatform"].join("_")
                            ? `param905_24.${
                                  this.activeChannel
                              }.info.0.uploadEventPlatform.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/超时驾驶/二级报警/事件上传平台设置&第${val[
                                  "info"
                              ][0]["uploadEventPlatform"].join(
                                  "、"
                              )}中心&第${this.copyForm["param905"][
                                  this.activeChannel
                              ]["param905_24"]["info"][0][
                                  "uploadEventPlatform"
                              ].join("、")}中心`
                            : "";
                    this.$emit("formDataChange", this.formData);
                }
            },
            deep: true,
            immediate: true,
        },
        "form.param905_14": {
            handler(val) {
                if (val && !Boolean(this.isTemplate)) {
                    this.formData[
                        "param905_14." +
                            this.activeChannel +
                            ".info.0.enable.useless.useless.useless"
                    ] =
                        val["info"][0]["enable"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_14"
                        ]["info"][0]["enable"]
                            ? `param905_14.${
                                  this.activeChannel
                              }.info.0.enable.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/换人提醒/一级报警/报警使能&${
                                  val["info"][0]["enable"] ? "开启" : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_14"
                                  ]["info"][0]["enable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_14." +
                            this.activeChannel +
                            ".info.0.speed.useless.useless.useless"
                    ] =
                        val["info"][0]["speed"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_14"
                        ]["info"][0]["speed"]
                            ? `param905_14.${
                                  this.activeChannel
                              }.info.0.speed.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/换人提醒/一级报警/报警判断速度阈值&${
                                  val["info"][0]["speed"]
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_14"
                                  ]["info"][0]["speed"]
                              }`
                            : "";
                    this.formData[
                        "param905_14." +
                            this.activeChannel +
                            ".info.0.confidence.useless.useless.useless"
                    ] =
                        val["info"][0]["confidence"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_14"
                        ]["info"][0]["confidence"]
                            ? `param905_14.${
                                  this.activeChannel
                              }.info.0.confidence.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/换人提醒/一级报警/算法置信度&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].confidenceList.find(
                                      (e) => e.value === val.info[0].confidence
                                  ).label
                              }&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].confidenceList.find(
                                      (e) =>
                                          e.value ===
                                          this.copyForm["param905"][
                                              this.activeChannel
                                          ]["param905_14"]["info"][0][
                                              "confidence"
                                          ]
                                  ).label
                              }`
                            : "";
                    this.formData[
                        "param905_14." +
                            this.activeChannel +
                            ".info.0.sensitivity.useless.useless.useless"
                    ] =
                        val["info"][0]["sensitivity"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_14"
                        ]["info"][0]["sensitivity"]
                            ? `param905_14.${
                                  this.activeChannel
                              }.info.0.sensitivity.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/换人提醒/一级报警/算法灵敏度&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].sensitivityList.find(
                                      (e) => e.value === val.info[0].sensitivity
                                  ).label
                              }&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].sensitivityList.find(
                                      (e) =>
                                          e.value ===
                                          this.copyForm["param905"][
                                              this.activeChannel
                                          ]["param905_14"]["info"][0][
                                              "sensitivity"
                                          ]
                                  ).label
                              }`
                            : "";
                    this.formData[
                        "param905_14." +
                            this.activeChannel +
                            ".info.0.volume.useless.useless.useless"
                    ] =
                        val["info"][0]["volume"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_14"
                        ]["info"][0]["volume"]
                            ? `param905_14.${
                                  this.activeChannel
                              }.info.0.volume.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/换人提醒/一级报警/报警音量&${
                                  val["info"][0]["volume"]
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_14"
                                  ]["info"][0]["volume"]
                              }`
                            : "";
                    this.formData[
                        "param905_14." +
                            this.activeChannel +
                            ".info.0.volumeEnable.useless.useless.useless"
                    ] =
                        val["info"][0]["volumeEnable"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_14"
                        ]["info"][0]["volumeEnable"]
                            ? `param905_14.${
                                  this.activeChannel
                              }.info.0.volumeEnable.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/换人提醒/一级报警/音量使能&${
                                  val["info"][0]["volumeEnable"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_14"
                                  ]["info"][0]["volumeEnable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_14." +
                            this.activeChannel +
                            ".info.0.snapshot.upload.useless.useless.useless"
                    ] =
                        val["info"][0]["snapshot"]["upload"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_14"
                        ]["info"][0]["snapshot"]["upload"]
                            ? `param905_14.${
                                  this.activeChannel
                              }.info.0.snapshot.upload.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/换人提醒/一级报警/报警图片上传使能&${
                                  val["info"][0]["snapshot"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_14"
                                  ]["info"][0]["snapshot"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_14." +
                            this.activeChannel +
                            ".info.0.clip.upload.useless.useless.useless"
                    ] =
                        val["info"][0]["clip"]["upload"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_14"
                        ]["info"][0]["clip"]["upload"]
                            ? `param905_14.${
                                  this.activeChannel
                              }.info.0.clip.upload.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/换人提醒/一级报警/报警视频上传使能&${
                                  val["info"][0]["clip"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_14"
                                  ]["info"][0]["clip"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_14." +
                            this.activeChannel +
                            ".info.0.uploadEventPlatform.useless.useless.useless"
                    ] =
                        val["info"][0]["uploadEventPlatform"].join("_") !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_14"
                        ]["info"][0]["uploadEventPlatform"].join("_")
                            ? `param905_14.${
                                  this.activeChannel
                              }.info.0.uploadEventPlatform.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/换人提醒/一级报警/事件上传平台设置&第${val[
                                  "info"
                              ][0]["uploadEventPlatform"].join(
                                  "、"
                              )}中心&第${this.copyForm["param905"][
                                  this.activeChannel
                              ]["param905_14"]["info"][0][
                                  "uploadEventPlatform"
                              ].join("、")}中心`
                            : "";
                    this.$emit("formDataChange", this.formData);
                }
            },
            deep: true,
            immediate: true,
        },
        "form.param905_25": {
            handler(val) {
                if (val && !Boolean(this.isTemplate)) {
                    this.formData[
                        "param905_25." +
                            this.activeChannel +
                            ".info.0.enable.useless.useless.useless"
                    ] =
                        val["info"][0]["enable"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_25"
                        ]["info"][0]["enable"]
                            ? `param905_25.${
                                  this.activeChannel
                              }.info.0.enable.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/换人提醒/二级报警/报警使能&${
                                  val["info"][0]["enable"] ? "开启" : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_25"
                                  ]["info"][0]["enable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_25." +
                            this.activeChannel +
                            ".info.0.speed.useless.useless.useless"
                    ] =
                        val["info"][0]["speed"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_25"
                        ]["info"][0]["speed"]
                            ? `param905_25.${
                                  this.activeChannel
                              }.info.0.speed.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/换人提醒/二级报警/报警判断速度阈值&${
                                  val["info"][0]["speed"]
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_25"
                                  ]["info"][0]["speed"]
                              }`
                            : "";
                    this.formData[
                        "param905_25." +
                            this.activeChannel +
                            ".info.0.confidence.useless.useless.useless"
                    ] =
                        val["info"][0]["confidence"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_25"
                        ]["info"][0]["confidence"]
                            ? `param905_25.${
                                  this.activeChannel
                              }.info.0.confidence.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/换人提醒/二级报警/算法置信度&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].confidenceList.find(
                                      (e) => e.value === val.info[0].confidence
                                  ).label
                              }&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].confidenceList.find(
                                      (e) =>
                                          e.value ===
                                          this.copyForm["param905"][
                                              this.activeChannel
                                          ]["param905_25"]["info"][0][
                                              "confidence"
                                          ]
                                  ).label
                              }`
                            : "";
                    this.formData[
                        "param905_25." +
                            this.activeChannel +
                            ".info.0.sensitivity.useless.useless.useless"
                    ] =
                        val["info"][0]["sensitivity"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_25"
                        ]["info"][0]["sensitivity"]
                            ? `param905_25.${
                                  this.activeChannel
                              }.info.0.sensitivity.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/换人提醒/二级报警/算法灵敏度&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].sensitivityList.find(
                                      (e) => e.value === val.info[0].sensitivity
                                  ).label
                              }&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].sensitivityList.find(
                                      (e) =>
                                          e.value ===
                                          this.copyForm["param905"][
                                              this.activeChannel
                                          ]["param905_25"]["info"][0][
                                              "sensitivity"
                                          ]
                                  ).label
                              }`
                            : "";
                    this.formData[
                        "param905_25." +
                            this.activeChannel +
                            ".info.0.volume.useless.useless.useless"
                    ] =
                        val["info"][0]["volume"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_25"
                        ]["info"][0]["volume"]
                            ? `param905_25.${
                                  this.activeChannel
                              }.info.0.volume.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/换人提醒/二级报警/报警音量&${
                                  val["info"][0]["volume"]
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_25"
                                  ]["info"][0]["volume"]
                              }`
                            : "";
                    this.formData[
                        "param905_25." +
                            this.activeChannel +
                            ".info.0.volumeEnable.useless.useless.useless"
                    ] =
                        val["info"][0]["volumeEnable"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_25"
                        ]["info"][0]["volumeEnable"]
                            ? `param905_25.${
                                  this.activeChannel
                              }.info.0.volumeEnable.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/换人提醒/二级报警/音量使能&${
                                  val["info"][0]["volumeEnable"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_25"
                                  ]["info"][0]["volumeEnable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_25." +
                            this.activeChannel +
                            ".info.0.snapshot.upload.useless.useless.useless"
                    ] =
                        val["info"][0]["snapshot"]["upload"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_25"
                        ]["info"][0]["snapshot"]["upload"]
                            ? `param905_25.${
                                  this.activeChannel
                              }.info.0.snapshot.upload.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/换人提醒/二级报警/报警图片上传使能&${
                                  val["info"][0]["snapshot"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_25"
                                  ]["info"][0]["snapshot"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_25." +
                            this.activeChannel +
                            ".info.0.clip.upload.useless.useless.useless"
                    ] =
                        val["info"][0]["clip"]["upload"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_25"
                        ]["info"][0]["clip"]["upload"]
                            ? `param905_25.${
                                  this.activeChannel
                              }.info.0.clip.upload.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/换人提醒/二级报警/报警视频上传使能&${
                                  val["info"][0]["clip"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_25"
                                  ]["info"][0]["clip"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_25." +
                            this.activeChannel +
                            ".info.0.uploadEventPlatform.useless.useless.useless"
                    ] =
                        val["info"][0]["uploadEventPlatform"].join("_") !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_25"
                        ]["info"][0]["uploadEventPlatform"].join("_")
                            ? `param905_25.${
                                  this.activeChannel
                              }.info.0.uploadEventPlatform.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/换人提醒/二级报警/事件上传平台设置&第${val[
                                  "info"
                              ][0]["uploadEventPlatform"].join(
                                  "、"
                              )}中心&第${this.copyForm["param905"][
                                  this.activeChannel
                              ]["param905_25"]["info"][0][
                                  "uploadEventPlatform"
                              ].join("、")}中心`
                            : "";
                    this.$emit("formDataChange", this.formData);
                }
            },
            deep: true,
            immediate: true,
        },
        "form.param905_26": {
            handler(val) {
                if (val && !Boolean(this.isTemplate)) {
                    this.formData[
                        "param905_26." +
                            this.activeChannel +
                            ".info.0.enable.useless.useless.useless"
                    ] =
                        val["info"][0]["enable"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_26"
                        ]["info"][0]["enable"]
                            ? `param905_26.${
                                  this.activeChannel
                              }.info.0.enable.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/墨镜/一级报警/报警使能&${
                                  val["info"][0]["enable"] ? "开启" : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_26"
                                  ]["info"][0]["enable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_26." +
                            this.activeChannel +
                            ".info.0.speed.useless.useless.useless"
                    ] =
                        val["info"][0]["speed"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_26"
                        ]["info"][0]["speed"]
                            ? `param905_26.${
                                  this.activeChannel
                              }.info.0.speed.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/墨镜/一级报警/报警判断速度阈值&${
                                  val["info"][0]["speed"]
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_26"
                                  ]["info"][0]["speed"]
                              }`
                            : "";
                    this.formData[
                        "param905_26." +
                            this.activeChannel +
                            ".info.0.confidence.useless.useless.useless"
                    ] =
                        val["info"][0]["confidence"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_26"
                        ]["info"][0]["confidence"]
                            ? `param905_26.${
                                  this.activeChannel
                              }.info.0.confidence.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/墨镜/一级报警/算法置信度&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].confidenceList.find(
                                      (e) => e.value === val.info[0].confidence
                                  ).label
                              }&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].confidenceList.find(
                                      (e) =>
                                          e.value ===
                                          this.copyForm["param905"][
                                              this.activeChannel
                                          ]["param905_26"]["info"][0][
                                              "confidence"
                                          ]
                                  ).label
                              }`
                            : "";
                    this.formData[
                        "param905_26." +
                            this.activeChannel +
                            ".info.0.sensitivity.useless.useless.useless"
                    ] =
                        val["info"][0]["sensitivity"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_26"
                        ]["info"][0]["sensitivity"]
                            ? `param905_26.${
                                  this.activeChannel
                              }.info.0.sensitivity.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/墨镜/一级报警/算法灵敏度&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].sensitivityList.find(
                                      (e) => e.value === val.info[0].sensitivity
                                  ).label
                              }&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].sensitivityList.find(
                                      (e) =>
                                          e.value ===
                                          this.copyForm["param905"][
                                              this.activeChannel
                                          ]["param905_26"]["info"][0][
                                              "sensitivity"
                                          ]
                                  ).label
                              }`
                            : "";
                    this.formData[
                        "param905_26." +
                            this.activeChannel +
                            ".info.0.volume.useless.useless.useless"
                    ] =
                        val["info"][0]["volume"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_26"
                        ]["info"][0]["volume"]
                            ? `param905_26.${
                                  this.activeChannel
                              }.info.0.volume.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/墨镜/一级报警/报警音量&${
                                  val["info"][0]["volume"]
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_26"
                                  ]["info"][0]["volume"]
                              }`
                            : "";
                    this.formData[
                        "param905_26." +
                            this.activeChannel +
                            ".info.0.volumeEnable.useless.useless.useless"
                    ] =
                        val["info"][0]["volumeEnable"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_26"
                        ]["info"][0]["volumeEnable"]
                            ? `param905_26.${
                                  this.activeChannel
                              }.info.0.volumeEnable.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/墨镜/一级报警/音量使能&${
                                  val["info"][0]["volumeEnable"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_26"
                                  ]["info"][0]["volumeEnable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_26." +
                            this.activeChannel +
                            ".info.0.snapshot.upload.useless.useless.useless"
                    ] =
                        val["info"][0]["snapshot"]["upload"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_26"
                        ]["info"][0]["snapshot"]["upload"]
                            ? `param905_26.${
                                  this.activeChannel
                              }.info.0.snapshot.upload.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/墨镜/一级报警/报警图片上传使能&${
                                  val["info"][0]["snapshot"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_26"
                                  ]["info"][0]["snapshot"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_26." +
                            this.activeChannel +
                            ".info.0.clip.upload.useless.useless.useless"
                    ] =
                        val["info"][0]["clip"]["upload"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_26"
                        ]["info"][0]["clip"]["upload"]
                            ? `param905_26.${
                                  this.activeChannel
                              }.info.0.clip.upload.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/墨镜/一级报警/报警视频上传使能&${
                                  val["info"][0]["clip"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_26"
                                  ]["info"][0]["clip"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_26." +
                            this.activeChannel +
                            ".info.0.uploadEventPlatform.useless.useless.useless"
                    ] =
                        val["info"][0]["uploadEventPlatform"].join("_") !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_26"
                        ]["info"][0]["uploadEventPlatform"].join("_")
                            ? `param905_26.${
                                  this.activeChannel
                              }.info.0.uploadEventPlatform.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/墨镜/一级报警/事件上传平台设置&第${val[
                                  "info"
                              ][0]["uploadEventPlatform"].join(
                                  "、"
                              )}中心&第${this.copyForm["param905"][
                                  this.activeChannel
                              ]["param905_26"]["info"][0][
                                  "uploadEventPlatform"
                              ].join("、")}中心`
                            : "";
                    this.$emit("formDataChange", this.formData);
                }
            },
            deep: true,
            immediate: true,
        },
        "form.param905_27": {
            handler(val) {
                if (val && !Boolean(this.isTemplate)) {
                    this.formData[
                        "param905_27." +
                            this.activeChannel +
                            ".info.0.enable.useless.useless.useless"
                    ] =
                        val["info"][0]["enable"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_27"
                        ]["info"][0]["enable"]
                            ? `param905_27.${
                                  this.activeChannel
                              }.info.0.enable.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/墨镜/二级报警/报警使能&${
                                  val["info"][0]["enable"] ? "开启" : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_27"
                                  ]["info"][0]["enable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_27." +
                            this.activeChannel +
                            ".info.0.speed.useless.useless.useless"
                    ] =
                        val["info"][0]["speed"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_27"
                        ]["info"][0]["speed"]
                            ? `param905_27.${
                                  this.activeChannel
                              }.info.0.speed.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/墨镜/二级报警/报警判断速度阈值&${
                                  val["info"][0]["speed"]
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_27"
                                  ]["info"][0]["speed"]
                              }`
                            : "";
                    this.formData[
                        "param905_27." +
                            this.activeChannel +
                            ".info.0.confidence.useless.useless.useless"
                    ] =
                        val["info"][0]["confidence"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_27"
                        ]["info"][0]["confidence"]
                            ? `param905_27.${
                                  this.activeChannel
                              }.info.0.confidence.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/墨镜/二级报警/算法置信度&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].confidenceList.find(
                                      (e) => e.value === val.info[0].confidence
                                  ).label
                              }&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].confidenceList.find(
                                      (e) =>
                                          e.value ===
                                          this.copyForm["param905"][
                                              this.activeChannel
                                          ]["param905_27"]["info"][0][
                                              "confidence"
                                          ]
                                  ).label
                              }`
                            : "";
                    this.formData[
                        "param905_27." +
                            this.activeChannel +
                            ".info.0.sensitivity.useless.useless.useless"
                    ] =
                        val["info"][0]["sensitivity"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_27"
                        ]["info"][0]["sensitivity"]
                            ? `param905_27.${
                                  this.activeChannel
                              }.info.0.sensitivity.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/墨镜/二级报警/算法灵敏度&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].sensitivityList.find(
                                      (e) => e.value === val.info[0].sensitivity
                                  ).label
                              }&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].sensitivityList.find(
                                      (e) =>
                                          e.value ===
                                          this.copyForm["param905"][
                                              this.activeChannel
                                          ]["param905_27"]["info"][0][
                                              "sensitivity"
                                          ]
                                  ).label
                              }`
                            : "";
                    this.formData[
                        "param905_27." +
                            this.activeChannel +
                            ".info.0.volume.useless.useless.useless"
                    ] =
                        val["info"][0]["volume"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_27"
                        ]["info"][0]["volume"]
                            ? `param905_27.${
                                  this.activeChannel
                              }.info.0.volume.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/墨镜/二级报警/报警音量&${
                                  val["info"][0]["volume"]
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_27"
                                  ]["info"][0]["volume"]
                              }`
                            : "";
                    this.formData[
                        "param905_27." +
                            this.activeChannel +
                            ".info.0.volumeEnable.useless.useless.useless"
                    ] =
                        val["info"][0]["volumeEnable"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_27"
                        ]["info"][0]["volumeEnable"]
                            ? `param905_27.${
                                  this.activeChannel
                              }.info.0.volumeEnable.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/墨镜/二级报警/音量使能&${
                                  val["info"][0]["volumeEnable"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_27"
                                  ]["info"][0]["volumeEnable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_27." +
                            this.activeChannel +
                            ".info.0.snapshot.upload.useless.useless.useless"
                    ] =
                        val["info"][0]["snapshot"]["upload"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_27"
                        ]["info"][0]["snapshot"]["upload"]
                            ? `param905_27.${
                                  this.activeChannel
                              }.info.0.snapshot.upload.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/墨镜/二级报警/报警图片上传使能&${
                                  val["info"][0]["snapshot"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_27"
                                  ]["info"][0]["snapshot"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_27." +
                            this.activeChannel +
                            ".info.0.clip.upload.useless.useless.useless"
                    ] =
                        val["info"][0]["clip"]["upload"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_27"
                        ]["info"][0]["clip"]["upload"]
                            ? `param905_27.${
                                  this.activeChannel
                              }.info.0.clip.upload.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/墨镜/二级报警/报警视频上传使能&${
                                  val["info"][0]["clip"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_27"
                                  ]["info"][0]["clip"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_27." +
                            this.activeChannel +
                            ".info.0.uploadEventPlatform.useless.useless.useless"
                    ] =
                        val["info"][0]["uploadEventPlatform"].join("_") !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_27"
                        ]["info"][0]["uploadEventPlatform"].join("_")
                            ? `param905_27.${
                                  this.activeChannel
                              }.info.0.uploadEventPlatform.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/墨镜/二级报警/事件上传平台设置&第${val[
                                  "info"
                              ][0]["uploadEventPlatform"].join(
                                  "、"
                              )}中心&第${this.copyForm["param905"][
                                  this.activeChannel
                              ]["param905_27"]["info"][0][
                                  "uploadEventPlatform"
                              ].join("、")}中心`
                            : "";
                    this.$emit("formDataChange", this.formData);
                }
            },
            deep: true,
            immediate: true,
        },
        "form.param905_28": {
            handler(val) {
                if (val && !Boolean(this.isTemplate)) {
                    this.formData[
                        "param905_28." +
                            this.activeChannel +
                            ".info.0.enable.useless.useless.useless"
                    ] =
                        val["info"][0]["enable"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_28"
                        ]["info"][0]["enable"]
                            ? `param905_28.${
                                  this.activeChannel
                              }.info.0.enable.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/面部遮挡/一级报警/报警使能&${
                                  val["info"][0]["enable"] ? "开启" : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_28"
                                  ]["info"][0]["enable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_28." +
                            this.activeChannel +
                            ".info.0.speed.useless.useless.useless"
                    ] =
                        val["info"][0]["speed"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_28"
                        ]["info"][0]["speed"]
                            ? `param905_28.${
                                  this.activeChannel
                              }.info.0.speed.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/面部遮挡/一级报警/报警判断速度阈值&${
                                  val["info"][0]["speed"]
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_28"
                                  ]["info"][0]["speed"]
                              }`
                            : "";
                    this.formData[
                        "param905_28." +
                            this.activeChannel +
                            ".info.0.confidence.useless.useless.useless"
                    ] =
                        val["info"][0]["confidence"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_28"
                        ]["info"][0]["confidence"]
                            ? `param905_28.${
                                  this.activeChannel
                              }.info.0.confidence.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/面部遮挡/一级报警/算法置信度&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].confidenceList.find(
                                      (e) => e.value === val.info[0].confidence
                                  ).label
                              }&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].confidenceList.find(
                                      (e) =>
                                          e.value ===
                                          this.copyForm["param905"][
                                              this.activeChannel
                                          ]["param905_28"]["info"][0][
                                              "confidence"
                                          ]
                                  ).label
                              }`
                            : "";
                    this.formData[
                        "param905_28." +
                            this.activeChannel +
                            ".info.0.sensitivity.useless.useless.useless"
                    ] =
                        val["info"][0]["sensitivity"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_28"
                        ]["info"][0]["sensitivity"]
                            ? `param905_28.${
                                  this.activeChannel
                              }.info.0.sensitivity.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/面部遮挡/一级报警/算法灵敏度&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].sensitivityList.find(
                                      (e) => e.value === val.info[0].sensitivity
                                  ).label
                              }&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].sensitivityList.find(
                                      (e) =>
                                          e.value ===
                                          this.copyForm["param905"][
                                              this.activeChannel
                                          ]["param905_28"]["info"][0][
                                              "sensitivity"
                                          ]
                                  ).label
                              }`
                            : "";
                    this.formData[
                        "param905_28." +
                            this.activeChannel +
                            ".info.0.volume.useless.useless.useless"
                    ] =
                        val["info"][0]["volume"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_28"
                        ]["info"][0]["volume"]
                            ? `param905_28.${
                                  this.activeChannel
                              }.info.0.volume.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/面部遮挡/一级报警/报警音量&${
                                  val["info"][0]["volume"]
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_28"
                                  ]["info"][0]["volume"]
                              }`
                            : "";
                    this.formData[
                        "param905_28." +
                            this.activeChannel +
                            ".info.0.volumeEnable.useless.useless.useless"
                    ] =
                        val["info"][0]["volumeEnable"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_28"
                        ]["info"][0]["volumeEnable"]
                            ? `param905_28.${
                                  this.activeChannel
                              }.info.0.volumeEnable.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/面部遮挡/一级报警/音量使能&${
                                  val["info"][0]["volumeEnable"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_28"
                                  ]["info"][0]["volumeEnable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_28." +
                            this.activeChannel +
                            ".info.0.snapshot.upload.useless.useless.useless"
                    ] =
                        val["info"][0]["snapshot"]["upload"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_28"
                        ]["info"][0]["snapshot"]["upload"]
                            ? `param905_28.${
                                  this.activeChannel
                              }.info.0.snapshot.upload.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/面部遮挡/一级报警/报警图片上传使能&${
                                  val["info"][0]["snapshot"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_28"
                                  ]["info"][0]["snapshot"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_28." +
                            this.activeChannel +
                            ".info.0.clip.upload.useless.useless.useless"
                    ] =
                        val["info"][0]["clip"]["upload"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_28"
                        ]["info"][0]["clip"]["upload"]
                            ? `param905_28.${
                                  this.activeChannel
                              }.info.0.clip.upload.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/面部遮挡/一级报警/报警视频上传使能&${
                                  val["info"][0]["clip"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_28"
                                  ]["info"][0]["clip"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_28." +
                            this.activeChannel +
                            ".info.0.uploadEventPlatform.useless.useless.useless"
                    ] =
                        val["info"][0]["uploadEventPlatform"].join("_") !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_28"
                        ]["info"][0]["uploadEventPlatform"].join("_")
                            ? `param905_28.${
                                  this.activeChannel
                              }.info.0.uploadEventPlatform.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/面部遮挡/一级报警/事件上传平台设置&第${val[
                                  "info"
                              ][0]["uploadEventPlatform"].join(
                                  "、"
                              )}中心&第${this.copyForm["param905"][
                                  this.activeChannel
                              ]["param905_28"]["info"][0][
                                  "uploadEventPlatform"
                              ].join("、")}中心`
                            : "";
                    this.$emit("formDataChange", this.formData);
                }
            },
            deep: true,
            immediate: true,
        },
        "form.param905_29": {
            handler(val) {
                if (val && !Boolean(this.isTemplate)) {
                    this.formData[
                        "param905_29." +
                            this.activeChannel +
                            ".info.0.enable.useless.useless.useless"
                    ] =
                        val["info"][0]["enable"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_29"
                        ]["info"][0]["enable"]
                            ? `param905_29.${
                                  this.activeChannel
                              }.info.0.enable.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/面部遮挡/二级报警/报警使能&${
                                  val["info"][0]["enable"] ? "开启" : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_29"
                                  ]["info"][0]["enable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_29." +
                            this.activeChannel +
                            ".info.0.speed.useless.useless.useless"
                    ] =
                        val["info"][0]["speed"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_29"
                        ]["info"][0]["speed"]
                            ? `param905_29.${
                                  this.activeChannel
                              }.info.0.speed.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/面部遮挡/二级报警/报警判断速度阈值&${
                                  val["info"][0]["speed"]
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_29"
                                  ]["info"][0]["speed"]
                              }`
                            : "";
                    this.formData[
                        "param905_29." +
                            this.activeChannel +
                            ".info.0.confidence.useless.useless.useless"
                    ] =
                        val["info"][0]["confidence"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_29"
                        ]["info"][0]["confidence"]
                            ? `param905_29.${
                                  this.activeChannel
                              }.info.0.confidence.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/面部遮挡/二级报警/算法置信度&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].confidenceList.find(
                                      (e) => e.value === val.info[0].confidence
                                  ).label
                              }&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].confidenceList.find(
                                      (e) =>
                                          e.value ===
                                          this.copyForm["param905"][
                                              this.activeChannel
                                          ]["param905_29"]["info"][0][
                                              "confidence"
                                          ]
                                  ).label
                              }`
                            : "";
                    this.formData[
                        "param905_29." +
                            this.activeChannel +
                            ".info.0.sensitivity.useless.useless.useless"
                    ] =
                        val["info"][0]["sensitivity"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_29"
                        ]["info"][0]["sensitivity"]
                            ? `param905_29.${
                                  this.activeChannel
                              }.info.0.sensitivity.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/面部遮挡/二级报警/算法灵敏度&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].sensitivityList.find(
                                      (e) => e.value === val.info[0].sensitivity
                                  ).label
                              }&${
                                  this.tabAndConfiguration[
                                      this.chanNoIndex
                                  ].tabList[this.tabIndex].capabilitys[
                                      this.chooseIndex
                                  ].sensitivityList.find(
                                      (e) =>
                                          e.value ===
                                          this.copyForm["param905"][
                                              this.activeChannel
                                          ]["param905_29"]["info"][0][
                                              "sensitivity"
                                          ]
                                  ).label
                              }`
                            : "";
                    this.formData[
                        "param905_29." +
                            this.activeChannel +
                            ".info.0.volume.useless.useless.useless"
                    ] =
                        val["info"][0]["volume"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_29"
                        ]["info"][0]["volume"]
                            ? `param905_29.${
                                  this.activeChannel
                              }.info.0.volume.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/面部遮挡/二级报警/报警音量&${
                                  val["info"][0]["volume"]
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_29"
                                  ]["info"][0]["volume"]
                              }`
                            : "";
                    this.formData[
                        "param905_29." +
                            this.activeChannel +
                            ".info.0.volumeEnable.useless.useless.useless"
                    ] =
                        val["info"][0]["volumeEnable"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_29"
                        ]["info"][0]["volumeEnable"]
                            ? `param905_29.${
                                  this.activeChannel
                              }.info.0.volumeEnable.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/面部遮挡/二级报警/音量使能&${
                                  val["info"][0]["volumeEnable"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_29"
                                  ]["info"][0]["volumeEnable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_29." +
                            this.activeChannel +
                            ".info.0.snapshot.upload.useless.useless.useless"
                    ] =
                        val["info"][0]["snapshot"]["upload"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_29"
                        ]["info"][0]["snapshot"]["upload"]
                            ? `param905_29.${
                                  this.activeChannel
                              }.info.0.snapshot.upload.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/面部遮挡/二级报警/报警图片上传使能&${
                                  val["info"][0]["snapshot"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_29"
                                  ]["info"][0]["snapshot"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_29." +
                            this.activeChannel +
                            ".info.0.clip.upload.useless.useless.useless"
                    ] =
                        val["info"][0]["clip"]["upload"] !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_29"
                        ]["info"][0]["clip"]["upload"]
                            ? `param905_29.${
                                  this.activeChannel
                              }.info.0.clip.upload.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/面部遮挡/二级报警/报警视频上传使能&${
                                  val["info"][0]["clip"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param905"][this.activeChannel][
                                      "param905_29"
                                  ]["info"][0]["clip"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param905_29." +
                            this.activeChannel +
                            ".info.0.uploadEventPlatform.useless.useless.useless"
                    ] =
                        val["info"][0]["uploadEventPlatform"].join("_") !==
                        this.copyForm["param905"][this.activeChannel][
                            "param905_29"
                        ]["info"][0]["uploadEventPlatform"].join("_")
                            ? `param905_29.${
                                  this.activeChannel
                              }.info.0.uploadEventPlatform.useless.useless.useless&主动安全设置/DBA/通道${
                                  this.activeChannel
                              }/面部遮挡/二级报警/事件上传平台设置&第${val[
                                  "info"
                              ][0]["uploadEventPlatform"].join(
                                  "、"
                              )}中心&第${this.copyForm["param905"][
                                  this.activeChannel
                              ]["param905_29"]["info"][0][
                                  "uploadEventPlatform"
                              ].join("、")}中心`
                            : "";
                    this.$emit("formDataChange", this.formData);
                }
            },
            deep: true,
            immediate: true,
        },
    },
    data() {
        return {
            tabIndex: 0,
            deviceId: this.$route.query.deviceId || "",
            activeName: "",
            deviceCapability: {},
            form: {},
            copyForm: {},
            formData: {},
            dictionaryData: {},
            tabAndConfiguration: [],
            activeChannel: "",
            chooseType: "",
            chooseIndex: "",
            chanNoIndex: 0,
            volume: 50,
            sendEveryVolume: false,
            dialogVisible: false,
            childConfigParams: false,
            checkNumber: function (rule, value, callback) {
                if (value !== "" && value !== null && value !== undefined) {
                    if (!validateNum(value)) {
                        callback(new Error("请输入正确的整数"));
                    } else if (value < this.min) {
                        callback(new Error(`最小值为${this.min}`));
                    } else if (value > this.max) {
                        callback(new Error(`最大值为${this.max}`));
                    } else {
                        callback();
                    }
                } else {
                    // callback(new Error("请输入"));
                    callback();
                }
            },
        };
    },
    created() {
        // this.getByIsApi(1)
        this.$emit("setMenuActiveRefFormName", "PrivateDbaForm");
        //this.makeTabList()
    },
    methods: {
        beforeLeave(activeName, oldActiveName) {
            this.$refs.PrivateDbaForm.validate((valid) => {
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
        openDialog() {
            this.dialogVisible = true;
        },
        send() {
            this.sendEveryVolume = true;
            for (
                let i = 0;
                i < this.deviceCapability["intelliDrive_DBA"][0]["info"].length;
                i++
            ) {
                if (
                    !this.form[
                        "param905_" +
                            this.deviceCapability["intelliDrive_DBA"][0][
                                "info"
                            ][i].type
                    ]
                ) {
                    let params = {
                        deviceId: this.deviceId,
                        param: {
                            type: this.deviceCapability["intelliDrive_DBA"][0][
                                "info"
                            ][i].type,
                            chanNo: this.activeChannel,
                        },
                        msgId: 905,
                    };
                    this.$api.getEHomeConfig(params).then((res) => {
                        if (res && res.data && res.data.param) {
                            let formData = JSON.parse(res.data.param);
                            let copyFormData = JSON.parse(res.data.param);
                            formData["info"][0].volume = this.volume;
                            formData["chanNo"] = this.activeChannel;
                            copyFormData["chanNo"] = this.activeChannel;
                            if (this.form["param905_"]) {
                                formData["enable"] =
                                    this.form["param905_"]["enable"];
                            } else {
                                this.$set(this.form, `param905_`, formData);
                                this.$set(
                                    this.copyForm,
                                    `param905_`,
                                    JSON.parse(JSON.stringify(formData))
                                );
                            }
                            this.$set(
                                this.form,
                                `param905_${this.deviceCapability["intelliDrive_DBA"][0]["info"][i].type}`,
                                formData
                            );
                            if (!this.form["param905"])
                                this.$set(this.form, "param905", {});
                            if (
                                this.form["param905"] &&
                                !this.form["param905"][this.activeChannel]
                            )
                                this.$set(
                                    this.form["param905"],
                                    this.activeChannel,
                                    {}
                                );
                            if (
                                this.form["param905"] &&
                                this.form["param905"][this.activeChannel] &&
                                !this.form["param905"][this.activeChannel][
                                    `param905_${this.deviceCapability["intelliDrive_DBA"][0]["info"][i].type}`
                                ]
                            )
                                this.$set(
                                    this.form["param905"][this.activeChannel],
                                    `param905_${this.deviceCapability["intelliDrive_DBA"][0]["info"][i].type}`,
                                    formData
                                );
                            this.$set(
                                this.copyForm,
                                `param905_${this.deviceCapability["intelliDrive_DBA"][0]["info"][i].type}`,
                                JSON.parse(JSON.stringify(formData))
                            );
                            if (!this.copyForm["param905"])
                                this.$set(
                                    this.copyForm,
                                    "param905",
                                    JSON.parse(JSON.stringify({}))
                                );
                            if (
                                this.copyForm["param905"] &&
                                !this.copyForm["param905"][this.activeChannel]
                            )
                                this.$set(
                                    this.copyForm["param905"],
                                    this.activeChannel,
                                    JSON.parse(JSON.stringify({}))
                                );
                            if (
                                this.copyForm["param905"] &&
                                this.copyForm["param905"][this.activeChannel] &&
                                !this.copyForm["param905"][this.activeChannel][
                                    `param905_${this.deviceCapability["intelliDrive_DBA"][0]["info"][i].type}`
                                ]
                            )
                                this.$set(
                                    this.copyForm["param905"][
                                        this.activeChannel
                                    ],
                                    `param905_${this.deviceCapability["intelliDrive_DBA"][0]["info"][i].type}`,
                                    JSON.parse(JSON.stringify(copyFormData))
                                );
                            this.childConfigParams = false;
                            if (
                                i ==
                                this.deviceCapability["intelliDrive_DBA"][0][
                                    "info"
                                ].length -
                                    1
                            ) {
                                this.$message.success(
                                    "全局音量设置成功，请先下发！"
                                );
                                this.sendEveryVolume = false;
                                this.dialogVisible = false;
                            }
                        } else {
                            this.$message.error("协议获取失败");
                            this.childConfigParams = false;
                        }
                    });
                } else {
                    this.form[
                        "param905_" +
                            this.deviceCapability["intelliDrive_DBA"][0][
                                "info"
                            ][i].type
                    ]["info"][0]["volume"] = this.volume;
                    if (
                        i ==
                        this.deviceCapability["intelliDrive_DBA"][0]["info"]
                            .length -
                            1
                    ) {
                        this.$message.success("全局音量设置成功，请先下发！");
                        this.sendEveryVolume = false;
                        this.dialogVisible = false;
                    }
                }
            }
        },
        getPrivateProcotol(
            activeName,
            item,
            chooseType,
            chooseIndex,
            bol,
            index_
        ) {
            this.activeName = activeName;

            if (chooseType !== "" && chooseIndex !== "") {
                this.chooseType = chooseType;
                this.chooseIndex = chooseIndex;
                this.tabIndex = index_;
            } else {
                item["tabList"].forEach((item_) => {
                    if (item_["name"] === activeName) {
                        if (!bol) {
                            this.chooseType = item_["types"][0];
                            this.chooseIndex = 0;
                            this.tabIndex = item_.index;
                        }
                    }
                });
            }
            let params = {
                deviceId: this.deviceId,
                param: {
                    type:
                        this.activeName == "DBA全局配置" ? "" : this.chooseType,
                    chanNo: this.activeChannel,
                },
                msgId: 905,
            };
            this.chooseType =
                this.activeName == "DBA全局配置" ? "" : this.chooseType;
            if (
                !this.form["param905"] ||
                !this.form["param905"][this.activeChannel] ||
                !this.form["param905"][this.activeChannel][
                    "param905_" + this.chooseType
                ]
            ) {
                if (Boolean(this.isTemplate)) return;
                this.$api.getEHomeConfig(params).then((res) => {
                    if (res && res.data && res.data.param) {
                        let formData = JSON.parse(res.data.param);
                        formData["chanNo"] = this.activeChannel;

                        let obj =
                            this.tabAndConfiguration[this.chanNoIndex].tabList[
                                this.tabIndex
                            ].capabilitys[this.chooseIndex];
                        if (obj.sensitivity) {
                            if (
                                formData.info[0].sensitivity <
                                obj.sensitivity.min +
                                    parseInt(obj.sensitivityRange / 3)
                            ) {
                                formData.info[0].sensitivity =
                                    obj.sensitivityList[0].value;
                            } else if (
                                formData.info[0].sensitivity >
                                obj.sensitivity.min +
                                    parseInt((obj.sensitivityRange * 2) / 3)
                            ) {
                                formData.info[0].sensitivity =
                                    obj.sensitivityList[2].value;
                            } else {
                                formData.info[0].sensitivity =
                                    obj.sensitivityList[1].value;
                            }
                        }
                        if (obj.confidence) {
                            if (
                                formData.info[0].confidence <
                                obj.confidence.min +
                                    parseInt(obj.confidenceRange / 3)
                            ) {
                                formData.info[0].confidence =
                                    obj.confidenceList[0].value;
                            } else if (
                                formData.info[0].confidence >
                                obj.confidence.min +
                                    parseInt((obj.confidenceRange * 2) / 3)
                            ) {
                                formData.info[0].confidence =
                                    obj.confidenceList[2].value;
                            } else {
                                formData.info[0].confidence =
                                    obj.confidenceList[1].value;
                            }
                        }

                        if (this.form["param905_"]) {
                            formData["enable"] =
                                this.form["param905_"]["enable"];
                        } else {
                            this.$set(this.form, `param905_`, formData);
                            this.$set(
                                this.copyForm,
                                `param905_`,
                                JSON.parse(JSON.stringify(formData))
                            );
                            if (!this.copyForm["param905"])
                                this.$set(
                                    this.copyForm,
                                    "param905",
                                    JSON.parse(JSON.stringify({}))
                                );
                            if (
                                this.copyForm["param905"] &&
                                !this.copyForm["param905"][this.activeChannel]
                            )
                                this.$set(
                                    this.copyForm["param905"],
                                    this.activeChannel,
                                    JSON.parse(JSON.stringify({}))
                                );
                            if (
                                this.copyForm["param905"] &&
                                this.copyForm["param905"][this.activeChannel] &&
                                !this.copyForm["param905"][this.activeChannel][
                                    `param905_`
                                ]
                            )
                                this.$set(
                                    this.copyForm["param905"][
                                        this.activeChannel
                                    ],
                                    `param905_`,
                                    JSON.parse(JSON.stringify(formData))
                                );
                        }
                        this.$set(
                            this.form,
                            `param905_${
                                this.activeName == "DBA全局配置"
                                    ? ""
                                    : this.chooseType
                            }`,
                            formData
                        );
                        if (!this.form["param905"])
                            this.$set(this.form, "param905", {});
                        if (
                            this.form["param905"] &&
                            !this.form["param905"][this.activeChannel]
                        )
                            this.$set(
                                this.form["param905"],
                                this.activeChannel,
                                {}
                            );
                        if (
                            this.form["param905"] &&
                            this.form["param905"][this.activeChannel] &&
                            !this.form["param905"][this.activeChannel][
                                `param905_${this.chooseType}`
                            ]
                        )
                            this.$set(
                                this.form["param905"][this.activeChannel],
                                `param905_${this.chooseType}`,
                                formData
                            );
                        this.$set(
                            this.copyForm,
                            `param905_${
                                this.activeName == "DBA全局配置"
                                    ? ""
                                    : this.chooseType
                            }`,
                            JSON.parse(JSON.stringify(formData))
                        );
                        if (!this.copyForm["param905"])
                            this.$set(
                                this.copyForm,
                                "param905",
                                JSON.parse(JSON.stringify({}))
                            );
                        if (
                            this.copyForm["param905"] &&
                            !this.copyForm["param905"][this.activeChannel]
                        )
                            this.$set(
                                this.copyForm["param905"],
                                this.activeChannel,
                                JSON.parse(JSON.stringify({}))
                            );
                        if (
                            this.copyForm["param905"] &&
                            this.copyForm["param905"][this.activeChannel] &&
                            !this.copyForm["param905"][this.activeChannel][
                                `param905_${this.chooseType}`
                            ]
                        )
                            this.$set(
                                this.copyForm["param905"][this.activeChannel],
                                `param905_${
                                    this.activeName == "DBA全局配置"
                                        ? ""
                                        : this.chooseType
                                }`,
                                JSON.parse(JSON.stringify(formData))
                            );
                        this.childConfigParams = false;
                    } else {
                        this.$message.error("协议获取失败");
                        this.childConfigParams = false;
                    }
                });
            } else {
                this.childConfigParams = false;
            }
        },
        //切换通道号
        changeChannel(chanNo, index) {
            this.form = Object.assign(
                {},
                this.form,
                this.form["param905"][chanNo]
            );
            this.activeChannel = chanNo;
            this.activeName =
                (this.deviceCapability["intelliDrive_DBA"][index]["enable"] &&
                    this.deviceCapability["intelliDrive_DBA"][index]["enable"]
                        .length) ||
                this.deviceCapability["intelliDrive_DBA"][index][
                    "speedCalibration"
                ]
                    ? "DBA全局配置"
                    : this.tabAndConfiguration[index]["tabList"][0]["name"];
            this.chooseType =
                (this.deviceCapability["intelliDrive_DBA"][index]["enable"] &&
                    this.deviceCapability["intelliDrive_DBA"][index]["enable"]
                        .length) ||
                this.deviceCapability["intelliDrive_DBA"][index][
                    "speedCalibration"
                ]
                    ? ""
                    : this.tabAndConfiguration[index]["tabList"][0]["types"][0];
            this.chooseIndex = 0;
            this.chanNoIndex = index;
            this.getPrivateProcotol(
                this.activeName,
                this.tabAndConfiguration[this.chanNoIndex],
                "",
                ""
            );
        },
        //切换报警等级
        changeAlarmLevel(item, _index, index, index_) {
            this.$refs.PrivateDbaForm.validate((valid) => {
                if (!valid) {
                    this.$message.warning("当前表单验证不通过，请先完善！");
                } else {
                    this.chooseType = item;
                    this.chooseIndex = _index;
                    this.tabIndex = index_;
                    this.getPrivateProcotol(
                        this.activeName,
                        this.tabAndConfiguration[index],
                        this.chooseType,
                        this.chooseIndex,
                        false,
                        index_
                    );
                }
            });
            // this.chooseType = item;
            // this.chooseIndex = index;
            // this.getPrivateProcotol(this.activeName,this.tabAndConfiguration[index_],this.chooseType,this.chooseIndex)
        },
        makeTabList() {
            this.tabAndConfiguration = [];
            this.deviceCapability["intelliDrive_DBA"].forEach((item, index) => {
                this.tabAndConfiguration[index] = {};
                this.tabAndConfiguration[index]["chanNo"] = item["chanNo"];
                this.tabAndConfiguration[index]["tabList"] = [];
                this.tabListPublic(
                    item,
                    this.tabAndConfiguration[index]["tabList"],
                    "疲劳驾驶",
                    0,
                    7
                );
                this.tabListPublic(
                    item,
                    this.tabAndConfiguration[index]["tabList"],
                    "打电话",
                    1,
                    15
                );
                this.tabListPublic(
                    item,
                    this.tabAndConfiguration[index]["tabList"],
                    "抽烟",
                    2,
                    16
                );
                this.tabListPublic(
                    item,
                    this.tabAndConfiguration[index]["tabList"],
                    "注意力不集中",
                    3,
                    8
                );
                this.tabListPublic(
                    item,
                    this.tabAndConfiguration[index]["tabList"],
                    "离岗",
                    4,
                    17
                );
                this.tabListPublic(
                    item,
                    this.tabAndConfiguration[index]["tabList"],
                    "视频遮挡",
                    5,
                    18
                );
                this.tabListPublic(
                    item,
                    this.tabAndConfiguration[index]["tabList"],
                    "未系安全带",
                    6,
                    19
                );
                this.tabListPublic(
                    item,
                    this.tabAndConfiguration[index]["tabList"],
                    "急加速",
                    9,
                    20
                );
                this.tabListPublic(
                    item,
                    this.tabAndConfiguration[index]["tabList"],
                    "急减速",
                    10,
                    21
                );
                this.tabListPublic(
                    item,
                    this.tabAndConfiguration[index]["tabList"],
                    "急转弯",
                    11,
                    22
                );
                this.tabListPublic(
                    item,
                    this.tabAndConfiguration[index]["tabList"],
                    "驾驶员异常",
                    12,
                    23
                );
                this.tabListPublic(
                    item,
                    this.tabAndConfiguration[index]["tabList"],
                    "超时驾驶",
                    13,
                    24
                );
                this.tabListPublic(
                    item,
                    this.tabAndConfiguration[index]["tabList"],
                    "换人提醒",
                    14,
                    25
                );
                this.tabListPublic(
                    item,
                    this.tabAndConfiguration[index]["tabList"],
                    "墨镜",
                    26,
                    27
                );
                this.tabListPublic(
                    item,
                    this.tabAndConfiguration[index]["tabList"],
                    "面部遮挡",
                    28,
                    29
                );
            });
            this.activeName =
                (this.deviceCapability["intelliDrive_DBA"][0]["enable"] &&
                    this.deviceCapability["intelliDrive_DBA"][0]["enable"]
                        .length) ||
                this.deviceCapability["intelliDrive_DBA"][0]["speedCalibration"]
                    ? "DBA全局配置"
                    : this.tabAndConfiguration[0]["tabList"][0]["name"];
            this.activeChannel = this.tabAndConfiguration[0]["chanNo"];
            this.chooseType =
                (this.deviceCapability["intelliDrive_DBA"][0]["enable"] &&
                    this.deviceCapability["intelliDrive_DBA"][0]["enable"]
                        .length) ||
                this.deviceCapability["intelliDrive_DBA"][0]["speedCalibration"]
                    ? ""
                    : this.tabAndConfiguration[0]["tabList"][0]["types"][0];
            this.chooseIndex = 0;
            this.chanNoIndex = 0;
            this.tabAndConfiguration.forEach((i) => {
                i.tabList.forEach((j, index) => {
                    j.index = index;
                    j.capabilitys.forEach((k) => {
                        k.sensitivityList = [];
                        /* --------------------算法灵敏度 start-------------------------*/
                        if (k.sensitivity) {
                            let sensitivityRange =
                                k.sensitivity.max - k.sensitivity.min;
                            let sensitivityLow =
                                k.sensitivity.min +
                                parseInt(sensitivityRange / 6);
                            let sensitivityMiddle =
                                k.sensitivity.min +
                                parseInt(sensitivityRange / 2);
                            let sensitivityHigh =
                                k.sensitivity.min +
                                parseInt((sensitivityRange * 5) / 6);
                            k.sensitivityRange = sensitivityRange;
                            k.sensitivityList = [
                                {
                                    value: sensitivityLow,
                                    label: "高",
                                },
                                {
                                    value: sensitivityMiddle,
                                    label: "中",
                                },
                                {
                                    value: sensitivityHigh,
                                    label: "低",
                                },
                            ];
                        }

                        /* --------------------算法灵敏度 end-------------------------*/
                        /* --------------------算法置信度 start-------------------------*/
                        k.confidenceList = [];
                        if (k.confidence) {
                            let confidenceRange =
                                k.confidence.max - k.confidence.min;
                            let confidenceLow =
                                k.confidence.min +
                                parseInt(confidenceRange / 6);
                            let confidenceMiddle =
                                k.confidence.min +
                                parseInt(confidenceRange / 2);
                            let confidenceHigh =
                                k.confidence.min +
                                parseInt((confidenceRange * 5) / 6);
                            k.confidenceRange = confidenceRange;
                            k.confidenceList = [
                                {
                                    value: confidenceLow,
                                    label: "低",
                                },
                                {
                                    value: confidenceMiddle,
                                    label: "中",
                                },
                                {
                                    value: confidenceHigh,
                                    label: "高",
                                },
                            ];
                        }
                        /* --------------------算法置信度 end-------------------------*/
                    });
                });
            });
        },
        //生成tab列表页
        tabListPublic(item, targetArr, name, type1, type2) {
            if (
                item["supportType"].indexOf(type1) != -1 &&
                item["supportType"].indexOf(type2) != -1
            ) {
                let capability = [];
                item["info"].forEach((item_) => {
                    if (item_["type"] == type1 || item_["type"] == type2) {
                        capability.push(item_);
                    }
                });
                targetArr.push({
                    name: name,
                    types: [type1, type2],
                    capabilitys: capability,
                });
            } else if (item["supportType"].indexOf(type1) != -1) {
                let capability = [];
                item["info"].forEach((item_) => {
                    if (item_["type"] == type1) {
                        capability.push(item_);
                    }
                });
                targetArr.push({
                    name: name,
                    types: [type1],
                    capabilitys: capability,
                });
            } else if (item["supportType"].indexOf(type2) != -1) {
                let capability = [];
                item["info"].forEach((item_) => {
                    if (item_["type"] == type2) {
                        capability.push(item_);
                    }
                });
                targetArr.push({
                    name: name,
                    types: [type2],
                    capabilitys: capability,
                });
            }
        },
    },
};
</script>

<style lang="less" scoped>
.configuration-detail-submit {
    width: 100%;
    border-right: 1px solid #f0f0f0;
    border-bottom: 1px solid #f0f0f0;
    border-left: 1px solid #f0f0f0;
    display: flex;
    position: fixed;
    bottom: 0;
    z-index: 500;
    right: 1%;
    background: white;
}
.maginBottom {
    margin-bottom: 10px;
}
.prompt {
    display: block;
    width: 36%;
    font-size: 14px;
    color: darkgray;
    line-height: 18px;
}
</style>
