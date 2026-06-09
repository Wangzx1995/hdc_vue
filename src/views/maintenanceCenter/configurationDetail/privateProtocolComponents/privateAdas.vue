<template>
    <div class="p-a-md">
        <el-form
            ref="PrivateAdasForm"
            label-position="top"
            :model="form"
            label-width="120px"
            style="margin-top: 10px"
        >
            <el-dialog
                title="ADAS全局音量调整"
                :visible.sync="dialogVisible"
                @close="close"
            >
                <div class="p-a-md">
                    <p class="m-b-sm">
                        点击确定后ADAS所有报警项音量将调整为该值,下发至终端成功后生效。
                    </p>
                    <el-slider
                        v-model="volume"
                        :min="tabAndConfiguration[0].tabList[0].capabilitys[0].volume.min"
                        :max="tabAndConfiguration[0].tabList[0].capabilitys[0].volume.max"
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
                    <el-button @click="close">取 消</el-button>
                </span>
            </el-dialog>
            <div id="title" class="channels">
                <el-button
                    :type="item['chanNo'] == activeChannel ? 'info' : ''"
                    v-for="(item, index) in tabAndConfiguration"
                    @click="changeChannel(item['chanNo'], index)"
                    :key="item['chanNo']"
                    >通道{{ item["chanNo"] }}</el-button
                >
            </div>
            <!-- {{ chanNoIndex }}---{{ tabIndex }}---{{ chooseIndex }} -->
            <el-tabs
                v-show="activeChannel == item['chanNo']"
                v-for="(item, index) in tabAndConfiguration"
                :key="index"
                v-model="activeName"
                :before-leave="beforeLeave"
                @tab-click="getPrivateProcotol(activeName, item, '', '')"
            >
                <el-tab-pane
                    label="ADAS全局配置"
                    name="ADAS全局配置"
                    v-if="
                        (deviceCapability['intelliDrive_ADAS'][index][
                            'enable'
                        ] &&
                            deviceCapability['intelliDrive_ADAS'][index][
                                'enable'
                            ].length) ||
                        deviceCapability['intelliDrive_ADAS'][index][
                            'speedCalibration'
                        ]
                    "
                >
                    <template v-if="form['param901_']">
                        <div class="configurations">
                            <div
                                v-if="
                                    deviceCapability['intelliDrive_ADAS'][
                                        index
                                    ]['enable'] &&
                                    deviceCapability['intelliDrive_ADAS'][
                                        index
                                    ]['enable'].length
                                "
                                class="configuration-item"
                            >
                                <el-form-item
                                    label="ADAS全局报警使能"
                                    description="此项配置控制算法，不是统一配置子报警使能"
                                >
                                    <el-switch
                                        v-model="form['param901_'].enable"
                                        :active-value="Number(1)"
                                        :inactive-value="Number(0)"
                                    ></el-switch>
                                </el-form-item>
                            </div>
                            <div class="configuration-item">
                                <el-form-item
                                    v-if="!Boolean(isTemplate)"
                                    label="ADAS全局音量配置"
                                >
                                    <el-button
                                        v-if="isTemplate != 'true'"
                                        @click="openDialog"
                                        >ADAS全局音量配置</el-button
                                    >
                                    <span
                                        v-if="isTemplate != 'true'"
                                        class="prompt"
                                        >全局音量是为了方便用户统一设置各子项音量增加的配置，实际设备中无此项配置，故获取时此配置无意义。</span
                                    >
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
                    <template
                        v-if="
                            chooseType !== '' && form['param901_' + chooseType]
                        "
                    >
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
                                            form['param901_' + chooseType][
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
                                        'param901_' +
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
                                            form['param901_' + chooseType][
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
                                        'param901_' +
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
                                            form['param901_' + chooseType][
                                                'info'
                                            ][0]['confidence']
                                        "
                                        ><span slot="suffix">%</span></el-input
                                    >
                                </el-form-item> -->
                                <el-form-item label="算法置信度">
                                    <el-select
                                        v-model="
                                            form['param901_' + chooseType][
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
                                <!-- {{
                                    item_["capabilitys"][chooseIndex][
                                        "sensitivityList"
                                    ]
                                }} -->

                                <!-- <el-form-item
                                    label="算法灵敏度"
                                    :prop="
                                        'param901_' +
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
                                            form['param901_' + chooseType][
                                                'info'
                                            ][0]['sensitivity']
                                        "
                                    ></el-input>
                                </el-form-item> -->
                                <el-form-item label="算法灵敏度">
                                    <el-select
                                        v-model="
                                            form['param901_' + chooseType][
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
                                            form['param901_' + chooseType][
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
                                            form['param901_' + chooseType][
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
                                            form['param901_' + chooseType][
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
                                            form['param901_' + chooseType][
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
                                            form['param901_' + chooseType][
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
                    console.log(val);
                    this.deviceCapability = val;
                    this.activeChannel = val["intelliDrive_ADAS"][0]["chanNo"];
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
        "form.param901_": {
            handler(val) {
                if (val && !Boolean(this.isTemplate) && this.activeChannel) {
                    this.formData[
                        "param901_." + this.activeChannel + ".enable.useless"
                    ] =
                        val["enable"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_"
                        ]["enable"]
                            ? `param901_.${
                                  this.activeChannel
                              }.enable.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/ADAS全局配置&${val["enable"] ? "开启" : "关闭"}`
                            : "";
                    this.$emit("formDataChange", this.formData);
                }
            },
            deep: true,
            immediate: true,
        },
        "form.param901_0": {
            handler(val) {
                if (val && !Boolean(this.isTemplate)) {
                    console.log(val["info"][0]["uploadEventPlatform"]);
                    console.log(
                        this.copyForm["param901"][this.activeChannel][
                            "param901_0"
                        ]["info"][0]["uploadEventPlatform"]
                    );
                    this.formData[
                        "param901_0." +
                            this.activeChannel +
                            ".info.0.enable.useless.useless.useless"
                    ] =
                        val["info"][0]["enable"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_0"
                        ]["info"][0]["enable"]
                            ? `param901_0.${
                                  this.activeChannel
                              }.info.0.enable.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/前车碰撞（FCW）/一级报警/报警使能&${
                                  val["enable"] ? "开启" : "关闭"
                              }&${
                                  this.copyForm["param901"][this.activeChannel][
                                      "param901_0"
                                  ]["info"][0]["enable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param901_0." +
                            this.activeChannel +
                            ".info.0.speed.useless.useless.useless"
                    ] =
                        val["info"][0]["speed"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_0"
                        ]["info"][0]["speed"]
                            ? `param901_0.${
                                  this.activeChannel
                              }.info.0.speed.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/前车碰撞（FCW）/一级报警/报警判断速度阈值&${
                                  val["info"][0]["speed"]
                              }&${
                                  this.copyForm["param901"][this.activeChannel][
                                      "param901_0"
                                  ]["info"][0]["speed"]
                              }`
                            : "";
                    this.formData[
                        "param901_0." +
                            this.activeChannel +
                            ".info.0.confidence.useless.useless.useless"
                    ] =
                        val["info"][0]["confidence"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_0"
                        ]["info"][0]["confidence"]
                            ? `param901_0.${
                                  this.activeChannel
                              }.info.0.confidence.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/前车碰撞（FCW）/一级报警/算法置信度&${
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
                                          this.copyForm["param901"][
                                              this.activeChannel
                                          ]["param901_0"]["info"][0][
                                              "confidence"
                                          ]
                                  ).label
                              }`
                            : "";
                    this.formData[
                        "param901_0." +
                            this.activeChannel +
                            ".info.0.sensitivity.useless.useless.useless"
                    ] =
                        val["info"][0]["sensitivity"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_0"
                        ]["info"][0]["sensitivity"]
                            ? `param901_0.${
                                  this.activeChannel
                              }.info.0.sensitivity.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/前车碰撞（FCW）/一级报警/算法灵敏度&${
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
                                          this.copyForm["param901"][
                                              this.activeChannel
                                          ]["param901_0"]["info"][0][
                                              "sensitivity"
                                          ]
                                  ).label
                              }`
                            : "";

                    this.formData[
                        "param901_0." +
                            this.activeChannel +
                            ".info.0.volume.useless.useless.useless"
                    ] =
                        val["info"][0]["volume"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_0"
                        ]["info"][0]["volume"]
                            ? `param901_0.${
                                  this.activeChannel
                              }.info.0.volume.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/前车碰撞（FCW）/一级报警/报警音量&${
                                  val["info"][0]["volume"]
                              }&${
                                  this.copyForm["param901"][this.activeChannel][
                                      "param901_0"
                                  ]["info"][0]["volume"]
                              }`
                            : "";
                    this.formData[
                        "param901_0." +
                            this.activeChannel +
                            ".info.0.volumeEnable.useless.useless.useless"
                    ] =
                        val["info"][0]["volumeEnable"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_0"
                        ]["info"][0]["volumeEnable"]
                            ? `param901_0.${
                                  this.activeChannel
                              }.info.0.volumeEnable.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/前车碰撞（FCW）/一级报警/音量使能&${
                                  val["info"][0]["volumeEnable"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param901"][this.activeChannel][
                                      "param901_0"
                                  ]["info"][0]["volumeEnable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param901_0." +
                            this.activeChannel +
                            ".info.0.snapshot.upload.useless.useless.useless"
                    ] =
                        val["info"][0]["snapshot"]["upload"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_0"
                        ]["info"][0]["snapshot"]["upload"]
                            ? `param901_0.${
                                  this.activeChannel
                              }.info.0.snapshot.upload.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/前车碰撞（FCW）/一级报警/报警图片上传使能&${
                                  val["info"][0]["snapshot"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param901"][this.activeChannel][
                                      "param901_0"
                                  ]["info"][0]["snapshot"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param901_0." +
                            this.activeChannel +
                            ".info.0.clip.upload.useless.useless.useless"
                    ] =
                        val["info"][0]["clip"]["upload"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_0"
                        ]["info"][0]["clip"]["upload"]
                            ? `param901_0.${
                                  this.activeChannel
                              }.info.0.clip.upload.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/前车碰撞（FCW）/一级报警/报警视频上传使能&${
                                  val["info"][0]["clip"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param901"][this.activeChannel][
                                      "param901_0"
                                  ]["info"][0]["clip"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param901_0." +
                            this.activeChannel +
                            ".info.0.uploadEventPlatform.useless.useless.useless"
                    ] =
                        val["info"][0]["uploadEventPlatform"].join("_") !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_0"
                        ]["info"][0]["uploadEventPlatform"].join("_")
                            ? `param901_0.${
                                  this.activeChannel
                              }.info.0.uploadEventPlatform.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/前车碰撞（FCW）/一级报警/事件上传平台设置&第${val[
                                  "info"
                              ][0]["uploadEventPlatform"].join(
                                  "、"
                              )}中心&第${this.copyForm["param901"][
                                  this.activeChannel
                              ]["param901_0"]["info"][0][
                                  "uploadEventPlatform"
                              ].join("、")}中心`
                            : "";
                    this.$emit("formDataChange", this.formData);
                }
            },
            deep: true,
            immediate: true,
        },
        "form.param901_4": {
            handler(val) {
                if (val && !Boolean(this.isTemplate)) {
                    this.formData[
                        "param901_4." +
                            this.activeChannel +
                            ".info.0.enable.useless.useless.useless"
                    ] =
                        val["info"][0]["enable"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_4"
                        ]["info"][0]["enable"]
                            ? `param901_4.${
                                  this.activeChannel
                              }.info.0.enable.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/前车碰撞（FCW）/二级报警/报警使能&${
                                  val["info"][0]["enable"] ? "开启" : "关闭"
                              }&${
                                  this.copyForm["param901"][this.activeChannel][
                                      "param901_4"
                                  ]["info"][0]["enable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param901_4." +
                            this.activeChannel +
                            ".info.0.speed.useless.useless.useless"
                    ] =
                        val["info"][0]["speed"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_4"
                        ]["info"][0]["speed"]
                            ? `param901_4.${
                                  this.activeChannel
                              }.info.0.speed.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/前车碰撞（FCW）/二级报警/报警判断速度阈值&${
                                  val["info"][0]["speed"]
                              }&${
                                  this.copyForm["param901"][this.activeChannel][
                                      "param901_4"
                                  ]["info"][0]["speed"]
                              }`
                            : "";
                    this.formData[
                        "param901_4." +
                            this.activeChannel +
                            ".info.0.confidence.useless.useless.useless"
                    ] =
                        val["info"][0]["confidence"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_4"
                        ]["info"][0]["confidence"]
                            ? `param901_4.${
                                  this.activeChannel
                              }.info.0.confidence.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/前车碰撞（FCW）/二级报警/算法置信度&${
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
                                          this.copyForm["param901"][
                                              this.activeChannel
                                          ]["param901_4"]["info"][0][
                                              "confidence"
                                          ]
                                  ).label
                              }`
                            : "";
                    this.formData[
                        "param901_4." +
                            this.activeChannel +
                            ".info.0.sensitivity.useless.useless.useless"
                    ] =
                        val["info"][0]["sensitivity"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_4"
                        ]["info"][0]["sensitivity"]
                            ? `param901_4.${
                                  this.activeChannel
                              }.info.0.sensitivity.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/前车碰撞（FCW）/二级报警/算法灵敏度&${
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
                                          this.copyForm["param901"][
                                              this.activeChannel
                                          ]["param901_4"]["info"][0][
                                              "sensitivity"
                                          ]
                                  ).label
                              }`
                            : "";
                    this.formData[
                        "param901_4." +
                            this.activeChannel +
                            ".info.0.volume.useless.useless.useless"
                    ] =
                        val["info"][0]["volume"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_4"
                        ]["info"][0]["volume"]
                            ? `param901_4.${
                                  this.activeChannel
                              }.info.0.volume.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/前车碰撞（FCW）/二级报警/报警音量&${
                                  val["info"][0]["volume"]
                              }&${
                                  this.copyForm["param901"][this.activeChannel][
                                      "param901_4"
                                  ]["info"][0]["volume"]
                              }`
                            : "";
                    this.formData[
                        "param901_4." +
                            this.activeChannel +
                            ".info.0.volumeEnable.useless.useless.useless"
                    ] =
                        val["info"][0]["volumeEnable"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_4"
                        ]["info"][0]["volumeEnable"]
                            ? `param901_4.${
                                  this.activeChannel
                              }.info.0.volumeEnable.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/前车碰撞（FCW）/二级报警/音量使能&${
                                  val["info"][0]["volumeEnable"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param901"][this.activeChannel][
                                      "param901_4"
                                  ]["info"][0]["volumeEnable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param901_4." +
                            this.activeChannel +
                            ".info.0.snapshot.upload.useless.useless.useless"
                    ] =
                        val["info"][0]["snapshot"]["upload"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_4"
                        ]["info"][0]["snapshot"]["upload"]
                            ? `param901_4.${
                                  this.activeChannel
                              }.info.0.snapshot.upload.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/前车碰撞（FCW）/二级报警/报警图片上传使能&${
                                  val["info"][0]["snapshot"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param901"][this.activeChannel][
                                      "param901_4"
                                  ]["info"][0]["snapshot"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param901_4." +
                            this.activeChannel +
                            ".info.0.clip.upload.useless.useless.useless"
                    ] =
                        val["info"][0]["clip"]["upload"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_4"
                        ]["info"][0]["clip"]["upload"]
                            ? `param901_4.${
                                  this.activeChannel
                              }.info.0.clip.upload.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/前车碰撞（FCW）/二级报警/报警视频上传使能&${
                                  val["info"][0]["clip"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param901"][this.activeChannel][
                                      "param901_4"
                                  ]["info"][0]["clip"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param901_4." +
                            this.activeChannel +
                            ".info.0.uploadEventPlatform.useless.useless.useless"
                    ] =
                        val["info"][0]["uploadEventPlatform"].join("_") !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_4"
                        ]["info"][0]["uploadEventPlatform"].join("_")
                            ? `param901_4.${
                                  this.activeChannel
                              }.info.0.uploadEventPlatform.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/前车碰撞（FCW）/二级报警/事件上传平台设置&第${val[
                                  "info"
                              ][0]["uploadEventPlatform"].join(
                                  "、"
                              )}中心&第${this.copyForm["param901"][
                                  this.activeChannel
                              ]["param901_4"]["info"][0][
                                  "uploadEventPlatform"
                              ].join("、")}中心`
                            : "";
                    this.$emit("formDataChange", this.formData);
                }
            },
            deep: true,
            immediate: true,
        },
        "form.param901_1": {
            handler(val) {
                if (val && !Boolean(this.isTemplate)) {
                    this.formData[
                        "param901_1." +
                            this.activeChannel +
                            ".info.0.enable.useless.useless.useless"
                    ] =
                        val["info"][0]["enable"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_1"
                        ]["info"][0]["enable"]
                            ? `param901_1.${
                                  this.activeChannel
                              }.info.0.enable.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/车道偏离（LDW）/一级报警/报警使能&${
                                  val["info"][0]["enable"] ? "开启" : "关闭"
                              }&${
                                  this.copyForm["param901"][this.activeChannel][
                                      "param901_1"
                                  ]["info"][0]["enable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param901_1." +
                            this.activeChannel +
                            ".info.0.speed.useless.useless.useless"
                    ] =
                        val["info"][0]["speed"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_1"
                        ]["info"][0]["speed"]
                            ? `param901_1.${
                                  this.activeChannel
                              }.info.0.speed.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/车道偏离（LDW）/一级报警/报警判断速度阈值&${
                                  val["info"][0]["speed"]
                              }&${
                                  this.copyForm["param901"][this.activeChannel][
                                      "param901_1"
                                  ]["info"][0]["speed"]
                              }`
                            : "";
                    this.formData[
                        "param901_1." +
                            this.activeChannel +
                            ".info.0.confidence.useless.useless.useless"
                    ] =
                        val["info"][0]["confidence"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_1"
                        ]["info"][0]["confidence"]
                            ? `param901_1.${
                                  this.activeChannel
                              }.info.0.confidence.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/车道偏离（LDW）/一级报警/算法置信度&${
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
                                          this.copyForm["param901"][
                                              this.activeChannel
                                          ]["param901_1"]["info"][0][
                                              "confidence"
                                          ]
                                  ).label
                              }`
                            : "";
                    this.formData[
                        "param901_1." +
                            this.activeChannel +
                            ".info.0.sensitivity.useless.useless.useless"
                    ] =
                        val["info"][0]["sensitivity"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_1"
                        ]["info"][0]["sensitivity"]
                            ? `param901_1.${
                                  this.activeChannel
                              }.info.0.sensitivity.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/车道偏离（LDW）/一级报警/算法灵敏度&${
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
                                          this.copyForm["param901"][
                                              this.activeChannel
                                          ]["param901_1"]["info"][0][
                                              "sensitivity"
                                          ]
                                  ).label
                              }`
                            : "";
                    this.formData[
                        "param901_1." +
                            this.activeChannel +
                            ".info.0.volume.useless.useless.useless"
                    ] =
                        val["info"][0]["volume"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_1"
                        ]["info"][0]["volume"]
                            ? `param901_1.${
                                  this.activeChannel
                              }.info.0.volume.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/车道偏离（LDW）/一级报警/报警音量&${
                                  val["info"][0]["volume"]
                              }&${
                                  this.copyForm["param901"][this.activeChannel][
                                      "param901_1"
                                  ]["info"][0]["volume"]
                              }`
                            : "";
                    this.formData[
                        "param901_1." +
                            this.activeChannel +
                            ".info.0.volumeEnable.useless.useless.useless"
                    ] =
                        val["info"][0]["volumeEnable"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_1"
                        ]["info"][0]["volumeEnable"]
                            ? `param901_1.${
                                  this.activeChannel
                              }.info.0.volumeEnable.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/车道偏离（LDW）/一级报警/音量使能&${
                                  val["info"][0]["volumeEnable"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param901"][this.activeChannel][
                                      "param901_1"
                                  ]["info"][0]["volumeEnable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param901_1." +
                            this.activeChannel +
                            ".info.0.snapshot.upload.useless.useless.useless"
                    ] =
                        val["info"][0]["snapshot"]["upload"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_1"
                        ]["info"][0]["snapshot"]["upload"]
                            ? `param901_1.${
                                  this.activeChannel
                              }.info.0.snapshot.upload.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/车道偏离（LDW）/一级报警/报警图片上传使能&${
                                  val["info"][0]["snapshot"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param901"][this.activeChannel][
                                      "param901_1"
                                  ]["info"][0]["snapshot"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param901_1." +
                            this.activeChannel +
                            ".info.0.clip.upload.useless.useless.useless"
                    ] =
                        val["info"][0]["clip"]["upload"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_1"
                        ]["info"][0]["clip"]["upload"]
                            ? `param901_1.${
                                  this.activeChannel
                              }.info.0.clip.upload.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/车道偏离（LDW）/一级报警/报警视频上传使能&${
                                  val["info"][0]["clip"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param901"][this.activeChannel][
                                      "param901_1"
                                  ]["info"][0]["clip"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param901_1." +
                            this.activeChannel +
                            ".info.0.uploadEventPlatform.useless.useless.useless"
                    ] =
                        val["info"][0]["uploadEventPlatform"].join("_") !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_1"
                        ]["info"][0]["uploadEventPlatform"].join("_")
                            ? `param901_1.${
                                  this.activeChannel
                              }.info.0.uploadEventPlatform.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/车道偏离（LDW）/一级报警/事件上传平台设置&第${val[
                                  "info"
                              ][0]["uploadEventPlatform"].join(
                                  "、"
                              )}中心&第${this.copyForm["param901"][
                                  this.activeChannel
                              ]["param901_1"]["info"][0][
                                  "uploadEventPlatform"
                              ].join("、")}中心`
                            : "";
                    this.$emit("formDataChange", this.formData);
                }
            },
            deep: true,
            immediate: true,
        },
        "form.param901_5": {
            handler(val) {
                if (val && !Boolean(this.isTemplate)) {
                    this.formData[
                        "param901_5." +
                            this.activeChannel +
                            ".info.0.enable.useless.useless.useless"
                    ] =
                        val["info"][0]["enable"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_5"
                        ]["info"][0]["enable"]
                            ? `param901_5.${
                                  this.activeChannel
                              }.info.0.enable.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/车道偏离（LDW）/二级报警/报警使能&${
                                  val["info"][0]["enable"] ? "开启" : "关闭"
                              }&${
                                  this.copyForm["param901"][this.activeChannel][
                                      "param901_5"
                                  ]["info"][0]["enable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param901_5." +
                            this.activeChannel +
                            ".info.0.speed.useless.useless.useless"
                    ] =
                        val["info"][0]["speed"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_5"
                        ]["info"][0]["speed"]
                            ? `param901_5.${
                                  this.activeChannel
                              }.info.0.speed.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/车道偏离（LDW）/二级报警/报警判断速度阈值&${
                                  val["info"][0]["speed"]
                              }&${
                                  this.copyForm["param901"][this.activeChannel][
                                      "param901_5"
                                  ]["info"][0]["speed"]
                              }`
                            : "";
                    this.formData[
                        "param901_5." +
                            this.activeChannel +
                            ".info.0.confidence.useless.useless.useless"
                    ] =
                        val["info"][0]["confidence"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_5"
                        ]["info"][0]["confidence"]
                            ? `param901_5.${
                                  this.activeChannel
                              }.info.0.confidence.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/车道偏离（LDW）/二级报警/算法置信度&${
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
                                          this.copyForm["param901"][
                                              this.activeChannel
                                          ]["param901_5"]["info"][0][
                                              "confidence"
                                          ]
                                  ).label
                              }`
                            : "";
                    this.formData[
                        "param901_5." +
                            this.activeChannel +
                            ".info.0.sensitivity.useless.useless.useless"
                    ] =
                        val["info"][0]["sensitivity"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_5"
                        ]["info"][0]["sensitivity"]
                            ? `param901_5.${
                                  this.activeChannel
                              }.info.0.sensitivity.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/车道偏离（LDW）/二级报警/算法灵敏度&${
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
                                          this.copyForm["param901"][
                                              this.activeChannel
                                          ]["param901_5"]["info"][0][
                                              "sensitivity"
                                          ]
                                  ).label
                              }`
                            : "";
                    this.formData[
                        "param901_5." +
                            this.activeChannel +
                            ".info.0.volume.useless.useless.useless"
                    ] =
                        val["info"][0]["volume"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_5"
                        ]["info"][0]["volume"]
                            ? `param901_5.${
                                  this.activeChannel
                              }.info.0.volume.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/车道偏离（LDW）/二级报警/报警音量&${
                                  val["info"][0]["volume"]
                              }&${
                                  this.copyForm["param901"][this.activeChannel][
                                      "param901_5"
                                  ]["info"][0]["volume"]
                              }`
                            : "";
                    this.formData[
                        "param901_5." +
                            this.activeChannel +
                            ".info.0.volumeEnable.useless.useless.useless"
                    ] =
                        val["info"][0]["volumeEnable"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_5"
                        ]["info"][0]["volumeEnable"]
                            ? `param901_5.${
                                  this.activeChannel
                              }.info.0.volumeEnable.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/车道偏离（LDW）/二级报警/音量使能&${
                                  val["info"][0]["volumeEnable"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param901"][this.activeChannel][
                                      "param901_5"
                                  ]["info"][0]["volumeEnable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param901_5." +
                            this.activeChannel +
                            ".info.0.snapshot.upload.useless.useless.useless"
                    ] =
                        val["info"][0]["snapshot"]["upload"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_5"
                        ]["info"][0]["snapshot"]["upload"]
                            ? `param901_5.${
                                  this.activeChannel
                              }.info.0.snapshot.upload.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/车道偏离（LDW）/二级报警/报警图片上传使能&${
                                  val["info"][0]["snapshot"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param901"][this.activeChannel][
                                      "param901_5"
                                  ]["info"][0]["snapshot"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param901_5." +
                            this.activeChannel +
                            ".info.0.clip.upload.useless.useless.useless"
                    ] =
                        val["info"][0]["clip"]["upload"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_5"
                        ]["info"][0]["clip"]["upload"]
                            ? `param901_5.${
                                  this.activeChannel
                              }.info.0.clip.upload.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/车道偏离（LDW）/二级报警/报警视频上传使能&${
                                  val["info"][0]["clip"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param901"][this.activeChannel][
                                      "param901_5"
                                  ]["info"][0]["clip"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param901_5." +
                            this.activeChannel +
                            ".info.0.uploadEventPlatform.useless.useless.useless"
                    ] =
                        val["info"][0]["uploadEventPlatform"].join("_") !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_5"
                        ]["info"][0]["uploadEventPlatform"].join("_")
                            ? `param901_5.${
                                  this.activeChannel
                              }.info.0.uploadEventPlatform.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/车道偏离（LDW）/二级报警/事件上传平台设置&第${val[
                                  "info"
                              ][0]["uploadEventPlatform"].join(
                                  "、"
                              )}中心&第${this.copyForm["param901"][
                                  this.activeChannel
                              ]["param901_5"]["info"][0][
                                  "uploadEventPlatform"
                              ].join("、")}中心`
                            : "";
                    this.$emit("formDataChange", this.formData);
                }
            },
            deep: true,
            immediate: true,
        },
        "form.param901_2": {
            handler(val) {
                if (val && !Boolean(this.isTemplate)) {
                    this.formData[
                        "param901_2." +
                            this.activeChannel +
                            ".info.0.enable.useless.useless.useless"
                    ] =
                        val["info"][0]["enable"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_2"
                        ]["info"][0]["enable"]
                            ? `param901_2.${
                                  this.activeChannel
                              }.info.0.enable.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/车距检测（HMW）/一级报警/报警使能&${
                                  val["info"][0]["enable"] ? "开启" : "关闭"
                              }&${
                                  this.copyForm["param901"][this.activeChannel][
                                      "param901_2"
                                  ]["info"][0]["enable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param901_2." +
                            this.activeChannel +
                            ".info.0.speed.useless.useless.useless"
                    ] =
                        val["info"][0]["speed"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_2"
                        ]["info"][0]["speed"]
                            ? `param901_2.${
                                  this.activeChannel
                              }.info.0.speed.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/车距检测（HMW）/一级报警/报警判断速度阈值&${
                                  val["info"][0]["speed"]
                              }&${
                                  this.copyForm["param901"][this.activeChannel][
                                      "param901_2"
                                  ]["info"][0]["speed"]
                              }`
                            : "";
                    this.formData[
                        "param901_2." +
                            this.activeChannel +
                            ".info.0.confidence.useless.useless.useless"
                    ] =
                        val["info"][0]["confidence"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_2"
                        ]["info"][0]["confidence"]
                            ? `param901_2.${
                                  this.activeChannel
                              }.info.0.confidence.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/车距检测（HMW）/一级报警/算法置信度&${
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
                                          this.copyForm["param901"][
                                              this.activeChannel
                                          ]["param901_2"]["info"][0][
                                              "confidence"
                                          ]
                                  ).label
                              }`
                            : "";
                    this.formData[
                        "param901_2." +
                            this.activeChannel +
                            ".info.0.sensitivity.useless.useless.useless"
                    ] =
                        val["info"][0]["sensitivity"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_2"
                        ]["info"][0]["sensitivity"]
                            ? `param901_2.${
                                  this.activeChannel
                              }.info.0.sensitivity.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/车距检测（HMW）/一级报警/算法灵敏度&${
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
                                          this.copyForm["param901"][
                                              this.activeChannel
                                          ]["param901_2"]["info"][0][
                                              "sensitivity"
                                          ]
                                  ).label
                              }`
                            : "";
                    this.formData[
                        "param901_2." +
                            this.activeChannel +
                            ".info.0.volume.useless.useless.useless"
                    ] =
                        val["info"][0]["volume"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_2"
                        ]["info"][0]["volume"]
                            ? `param901_2.${
                                  this.activeChannel
                              }.info.0.volume.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/车距检测（HMW）/一级报警/报警音量&${
                                  val["info"][0]["volume"]
                              }&${
                                  this.copyForm["param901"][this.activeChannel][
                                      "param901_2"
                                  ]["info"][0]["volume"]
                              }`
                            : "";
                    this.formData[
                        "param901_2." +
                            this.activeChannel +
                            ".info.0.volumeEnable.useless.useless.useless"
                    ] =
                        val["info"][0]["volumeEnable"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_2"
                        ]["info"][0]["volumeEnable"]
                            ? `param901_2.${
                                  this.activeChannel
                              }.info.0.volumeEnable.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/车距检测（HMW）/一级报警/音量使能&${
                                  val["info"][0]["volumeEnable"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param901"][this.activeChannel][
                                      "param901_2"
                                  ]["info"][0]["volumeEnable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param901_2." +
                            this.activeChannel +
                            ".info.0.snapshot.upload.useless.useless.useless"
                    ] =
                        val["info"][0]["snapshot"]["upload"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_2"
                        ]["info"][0]["snapshot"]["upload"]
                            ? `param901_2.${
                                  this.activeChannel
                              }.info.0.snapshot.upload.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/车距检测（HMW）/一级报警/报警图片上传使能&${
                                  val["info"][0]["snapshot"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param901"][this.activeChannel][
                                      "param901_2"
                                  ]["info"][0]["snapshot"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param901_2." +
                            this.activeChannel +
                            ".info.0.clip.upload.useless.useless.useless"
                    ] =
                        val["info"][0]["clip"]["upload"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_2"
                        ]["info"][0]["clip"]["upload"]
                            ? `param901_2.${
                                  this.activeChannel
                              }.info.0.clip.upload.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/车距检测（HMW）/一级报警/报警视频上传使能&${
                                  val["info"][0]["clip"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param901"][this.activeChannel][
                                      "param901_2"
                                  ]["info"][0]["clip"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param901_2." +
                            this.activeChannel +
                            ".info.0.uploadEventPlatform.useless.useless.useless"
                    ] =
                        val["info"][0]["uploadEventPlatform"].join("_") !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_2"
                        ]["info"][0]["uploadEventPlatform"].join("_")
                            ? `param901_2.${
                                  this.activeChannel
                              }.info.0.uploadEventPlatform.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/车距检测（HMW）/一级报警/事件上传平台设置&第${val[
                                  "info"
                              ][0]["uploadEventPlatform"].join(
                                  "、"
                              )}中心&第${this.copyForm["param901"][
                                  this.activeChannel
                              ]["param901_2"]["info"][0][
                                  "uploadEventPlatform"
                              ].join("、")}中心`
                            : "";
                    this.$emit("formDataChange", this.formData);
                }
            },
            deep: true,
            immediate: true,
        },
        "form.param901_6": {
            handler(val) {
                if (val && !Boolean(this.isTemplate)) {
                    this.formData[
                        "param901_6." +
                            this.activeChannel +
                            ".info.0.enable.useless.useless.useless"
                    ] =
                        val["info"][0]["enable"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_6"
                        ]["info"][0]["enable"]
                            ? `param901_6.${
                                  this.activeChannel
                              }.info.0.enable.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/车距检测（HMW）/二级报警/报警使能&${
                                  val["info"][0]["enable"] ? "开启" : "关闭"
                              }&${
                                  this.copyForm["param901"][this.activeChannel][
                                      "param901_6"
                                  ]["info"][0]["enable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param901_6." +
                            this.activeChannel +
                            ".info.0.speed.useless.useless.useless"
                    ] =
                        val["info"][0]["speed"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_6"
                        ]["info"][0]["speed"]
                            ? `param901_6.${
                                  this.activeChannel
                              }.info.0.speed.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/车距检测（HMW）/二级报警/报警判断速度阈值&${
                                  val["info"][0]["speed"]
                              }&${
                                  this.copyForm["param901"][this.activeChannel][
                                      "param901_6"
                                  ]["info"][0]["speed"]
                              }`
                            : "";
                    this.formData[
                        "param901_6." +
                            this.activeChannel +
                            ".info.0.confidence.useless.useless.useless"
                    ] =
                        val["info"][0]["confidence"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_6"
                        ]["info"][0]["confidence"]
                            ? `param901_6.${
                                  this.activeChannel
                              }.info.0.confidence.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/车距检测（HMW）/二级报警/算法置信度&${
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
                                          this.copyForm["param901"][
                                              this.activeChannel
                                          ]["param901_6"]["info"][0][
                                              "confidence"
                                          ]
                                  ).label
                              }`
                            : "";
                    this.formData[
                        "param901_6." +
                            this.activeChannel +
                            ".info.0.sensitivity.useless.useless.useless"
                    ] =
                        val["info"][0]["sensitivity"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_6"
                        ]["info"][0]["sensitivity"]
                            ? `param901_6.${
                                  this.activeChannel
                              }.info.0.sensitivity.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/车距检测（HMW）/二级报警/算法灵敏度&${
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
                                          this.copyForm["param901"][
                                              this.activeChannel
                                          ]["param901_6"]["info"][0][
                                              "sensitivity"
                                          ]
                                  ).label
                              }`
                            : "";
                    this.formData[
                        "param901_6." +
                            this.activeChannel +
                            ".info.0.volume.useless.useless.useless"
                    ] =
                        val["info"][0]["volume"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_6"
                        ]["info"][0]["volume"]
                            ? `param901_6.${
                                  this.activeChannel
                              }.info.0.volume.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/车距检测（HMW）/二级报警/报警音量&${
                                  val["info"][0]["volume"]
                              }&${
                                  this.copyForm["param901"][this.activeChannel][
                                      "param901_6"
                                  ]["info"][0]["volume"]
                              }`
                            : "";
                    this.formData[
                        "param901_6." +
                            this.activeChannel +
                            ".info.0.volumeEnable.useless.useless.useless"
                    ] =
                        val["info"][0]["volumeEnable"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_6"
                        ]["info"][0]["volumeEnable"]
                            ? `param901_6.${
                                  this.activeChannel
                              }.info.0.volumeEnable.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/车距检测（HMW）/二级报警/音量使能&${
                                  val["info"][0]["volumeEnable"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param901"][this.activeChannel][
                                      "param901_6"
                                  ]["info"][0]["volumeEnable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param901_6." +
                            this.activeChannel +
                            ".info.0.snapshot.upload.useless.useless.useless"
                    ] =
                        val["info"][0]["snapshot"]["upload"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_6"
                        ]["info"][0]["snapshot"]["upload"]
                            ? `param901_6.${
                                  this.activeChannel
                              }.info.0.snapshot.upload.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/车距检测（HMW）/二级报警/报警图片上传使能&${
                                  val["info"][0]["snapshot"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param901"][this.activeChannel][
                                      "param901_6"
                                  ]["info"][0]["snapshot"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param901_6." +
                            this.activeChannel +
                            ".info.0.clip.upload.useless.useless.useless"
                    ] =
                        val["info"][0]["clip"]["upload"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_6"
                        ]["info"][0]["clip"]["upload"]
                            ? `param901_6.${
                                  this.activeChannel
                              }.info.0.clip.upload.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/车距检测（HMW）/二级报警/报警视频上传使能&${
                                  val["info"][0]["clip"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param901"][this.activeChannel][
                                      "param901_6"
                                  ]["info"][0]["clip"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param901_6." +
                            this.activeChannel +
                            ".info.0.uploadEventPlatform.useless.useless.useless"
                    ] =
                        val["info"][0]["uploadEventPlatform"].join("_") !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_6"
                        ]["info"][0]["uploadEventPlatform"].join("_")
                            ? `param901_6.${
                                  this.activeChannel
                              }.info.0.uploadEventPlatform.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/车距检测（HMW）/二级报警/事件上传平台设置&第${val[
                                  "info"
                              ][0]["uploadEventPlatform"].join(
                                  "、"
                              )}中心&第${this.copyForm["param901"][
                                  this.activeChannel
                              ]["param901_6"]["info"][0][
                                  "uploadEventPlatform"
                              ].join("、")}中心`
                            : "";
                    this.$emit("formDataChange", this.formData);
                }
            },
            deep: true,
            immediate: true,
        },
        "form.param901_3": {
            handler(val) {
                if (val && !Boolean(this.isTemplate)) {
                    this.formData[
                        "param901_3." +
                            this.activeChannel +
                            ".info.0.enable.useless.useless.useless"
                    ] =
                        val["info"][0]["enable"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_3"
                        ]["info"][0]["enable"]
                            ? `param901_3.${
                                  this.activeChannel
                              }.info.0.enable.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/行人监测（PCW）/一级报警/报警使能&${
                                  val["info"][0]["enable"] ? "开启" : "关闭"
                              }&${
                                  this.copyForm["param901"][this.activeChannel][
                                      "param901_3"
                                  ]["info"][0]["enable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param901_3." +
                            this.activeChannel +
                            ".info.0.speed.useless.useless.useless"
                    ] =
                        val["info"][0]["speed"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_3"
                        ]["info"][0]["speed"]
                            ? `param901_3.${
                                  this.activeChannel
                              }.info.0.speed.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/行人监测（PCW）/一级报警/报警判断速度阈值&${
                                  val["info"][0]["speed"]
                              }&${
                                  this.copyForm["param901"][this.activeChannel][
                                      "param901_3"
                                  ]["info"][0]["speed"]
                              }`
                            : "";
                    this.formData[
                        "param901_3." +
                            this.activeChannel +
                            ".info.0.confidence.useless.useless.useless"
                    ] =
                        val["info"][0]["confidence"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_3"
                        ]["info"][0]["confidence"]
                            ? `param901_3.${
                                  this.activeChannel
                              }.info.0.confidence.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/行人监测（PCW）/一级报警/算法置信度&${
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
                                          this.copyForm["param901"][
                                              this.activeChannel
                                          ]["param901_3"]["info"][0][
                                              "confidence"
                                          ]
                                  ).label
                              }`
                            : "";
                    this.formData[
                        "param901_3." +
                            this.activeChannel +
                            ".info.0.sensitivity.useless.useless.useless"
                    ] =
                        val["info"][0]["sensitivity"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_3"
                        ]["info"][0]["sensitivity"]
                            ? `param901_3.${
                                  this.activeChannel
                              }.info.0.sensitivity.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/行人监测（PCW）/一级报警/算法灵敏度&${
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
                                          this.copyForm["param901"][
                                              this.activeChannel
                                          ]["param901_3"]["info"][0][
                                              "sensitivity"
                                          ]
                                  ).label
                              }`
                            : "";
                    this.formData[
                        "param901_3." +
                            this.activeChannel +
                            ".info.0.volume.useless.useless.useless"
                    ] =
                        val["info"][0]["volume"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_3"
                        ]["info"][0]["volume"]
                            ? `param901_3.${
                                  this.activeChannel
                              }.info.0.volume.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/行人监测（PCW）/一级报警/报警音量&${
                                  val["info"][0]["volume"]
                              }&${
                                  this.copyForm["param901"][this.activeChannel][
                                      "param901_3"
                                  ]["info"][0]["volume"]
                              }`
                            : "";
                    this.formData[
                        "param901_3." +
                            this.activeChannel +
                            ".info.0.volumeEnable.useless.useless.useless"
                    ] =
                        val["info"][0]["volumeEnable"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_3"
                        ]["info"][0]["volumeEnable"]
                            ? `param901_3.${
                                  this.activeChannel
                              }.info.0.volumeEnable.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/行人监测（PCW）/一级报警/音量使能&${
                                  val["info"][0]["volumeEnable"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param901"][this.activeChannel][
                                      "param901_3"
                                  ]["info"][0]["volumeEnable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param901_3." +
                            this.activeChannel +
                            ".info.0.snapshot.upload.useless.useless.useless"
                    ] =
                        val["info"][0]["snapshot"]["upload"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_3"
                        ]["info"][0]["snapshot"]["upload"]
                            ? `param901_3.${
                                  this.activeChannel
                              }.info.0.snapshot.upload.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/行人监测（PCW）/一级报警/报警图片上传使能&${
                                  val["info"][0]["snapshot"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param901"][this.activeChannel][
                                      "param901_3"
                                  ]["info"][0]["snapshot"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param901_3." +
                            this.activeChannel +
                            ".info.0.clip.upload.useless.useless.useless"
                    ] =
                        val["info"][0]["clip"]["upload"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_3"
                        ]["info"][0]["clip"]["upload"]
                            ? `param901_3.${
                                  this.activeChannel
                              }.info.0.clip.upload.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/行人监测（PCW）/一级报警/报警视频上传使能&${
                                  val["info"][0]["clip"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param901"][this.activeChannel][
                                      "param901_3"
                                  ]["info"][0]["clip"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param901_3." +
                            this.activeChannel +
                            ".info.0.uploadEventPlatform.useless.useless.useless"
                    ] =
                        val["info"][0]["uploadEventPlatform"].join("_") !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_3"
                        ]["info"][0]["uploadEventPlatform"].join("_")
                            ? `param901_3.${
                                  this.activeChannel
                              }.info.0.uploadEventPlatform.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/行人监测（PCW）/一级报警/事件上传平台设置&第${val[
                                  "info"
                              ][0]["uploadEventPlatform"].join(
                                  "、"
                              )}中心&第${this.copyForm["param901"][
                                  this.activeChannel
                              ]["param901_3"]["info"][0][
                                  "uploadEventPlatform"
                              ].join("、")}中心`
                            : "";
                    this.$emit("formDataChange", this.formData);
                }
            },
            deep: true,
            immediate: true,
        },
        "form.param901_7": {
            handler(val) {
                if (val && !Boolean(this.isTemplate)) {
                    this.formData[
                        "param901_7." +
                            this.activeChannel +
                            ".info.0.enable.useless.useless.useless"
                    ] =
                        val["info"][0]["enable"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_7"
                        ]["info"][0]["enable"]
                            ? `param901_7.${
                                  this.activeChannel
                              }.info.0.enable.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/行人监测（PCW）/二级报警/报警使能&${
                                  val["info"][0]["enable"] ? "开启" : "关闭"
                              }&${
                                  this.copyForm["param901"][this.activeChannel][
                                      "param901_7"
                                  ]["info"][0]["enable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param901_7." +
                            this.activeChannel +
                            ".info.0.speed.useless.useless.useless"
                    ] =
                        val["info"][0]["speed"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_7"
                        ]["info"][0]["speed"]
                            ? `param901_7.${
                                  this.activeChannel
                              }.info.0.speed.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/行人监测（PCW）/二级报警/报警判断速度阈值&${
                                  val["info"][0]["speed"]
                              }&${
                                  this.copyForm["param901"][this.activeChannel][
                                      "param901_7"
                                  ]["info"][0]["speed"]
                              }`
                            : "";
                    this.formData[
                        "param901_7." +
                            this.activeChannel +
                            ".info.0.confidence.useless.useless.useless"
                    ] =
                        val["info"][0]["confidence"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_7"
                        ]["info"][0]["confidence"]
                            ? `param901_7.${
                                  this.activeChannel
                              }.info.0.confidence.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/行人监测（PCW）/二级报警/算法置信度&${
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
                                          this.copyForm["param901"][
                                              this.activeChannel
                                          ]["param901_7"]["info"][0][
                                              "confidence"
                                          ]
                                  ).label
                              }`
                            : "";
                    this.formData[
                        "param901_7." +
                            this.activeChannel +
                            ".info.0.sensitivity.useless.useless.useless"
                    ] =
                        val["info"][0]["sensitivity"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_7"
                        ]["info"][0]["sensitivity"]
                            ? `param901_7.${
                                  this.activeChannel
                              }.info.0.sensitivity.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/行人监测（PCW）/二级报警/算法灵敏度&${
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
                                          this.copyForm["param901"][
                                              this.activeChannel
                                          ]["param901_7"]["info"][0][
                                              "sensitivity"
                                          ]
                                  ).label
                              }`
                            : "";
                    this.formData[
                        "param901_7." +
                            this.activeChannel +
                            ".info.0.volume.useless.useless.useless"
                    ] =
                        val["info"][0]["volume"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_7"
                        ]["info"][0]["volume"]
                            ? `param901_7.${
                                  this.activeChannel
                              }.info.0.volume.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/行人监测（PCW）/二级报警/报警音量&${
                                  val["info"][0]["volume"]
                              }&${
                                  this.copyForm["param901"][this.activeChannel][
                                      "param901_7"
                                  ]["info"][0]["volume"]
                              }`
                            : "";
                    this.formData[
                        "param901_7." +
                            this.activeChannel +
                            ".info.0.volumeEnable.useless.useless.useless"
                    ] =
                        val["info"][0]["volumeEnable"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_7"
                        ]["info"][0]["volumeEnable"]
                            ? `param901_7.${
                                  this.activeChannel
                              }.info.0.volumeEnable.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/行人监测（PCW）/二级报警/音量使能&${
                                  val["info"][0]["volumeEnable"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param901"][this.activeChannel][
                                      "param901_7"
                                  ]["info"][0]["volumeEnable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param901_7." +
                            this.activeChannel +
                            ".info.0.snapshot.upload.useless.useless.useless"
                    ] =
                        val["info"][0]["snapshot"]["upload"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_7"
                        ]["info"][0]["snapshot"]["upload"]
                            ? `param901_7.${
                                  this.activeChannel
                              }.info.0.snapshot.upload.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/行人监测（PCW）/二级报警/报警图片上传使能&${
                                  val["info"][0]["snapshot"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param901"][this.activeChannel][
                                      "param901_7"
                                  ]["info"][0]["snapshot"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param901_7." +
                            this.activeChannel +
                            ".info.0.clip.upload.useless.useless.useless"
                    ] =
                        val["info"][0]["clip"]["upload"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_7"
                        ]["info"][0]["clip"]["upload"]
                            ? `param901_7.${
                                  this.activeChannel
                              }.info.0.clip.upload.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/行人监测（PCW）/二级报警/报警视频上传使能&${
                                  val["info"][0]["clip"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param901"][this.activeChannel][
                                      "param901_7"
                                  ]["info"][0]["clip"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param901_7." +
                            this.activeChannel +
                            ".info.0.uploadEventPlatform.useless.useless.useless"
                    ] =
                        val["info"][0]["uploadEventPlatform"].join("_") !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_7"
                        ]["info"][0]["uploadEventPlatform"].join("_")
                            ? `param901_7.${
                                  this.activeChannel
                              }.info.0.uploadEventPlatform.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/行人监测（PCW）/二级报警/事件上传平台设置&第${val[
                                  "info"
                              ][0]["uploadEventPlatform"].join(
                                  "、"
                              )}中心&第${this.copyForm["param901"][
                                  this.activeChannel
                              ]["param901_7"]["info"][0][
                                  "uploadEventPlatform"
                              ].join("、")}中心`
                            : "";
                    this.$emit("formDataChange", this.formData);
                }
            },
            deep: true,
            immediate: true,
        },
        "form.param901_8": {
            handler(val) {
                if (val && !Boolean(this.isTemplate)) {
                    this.formData[
                        "param901_8." +
                            this.activeChannel +
                            ".info.0.enable.useless.useless.useless"
                    ] =
                        val["info"][0]["enable"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_8"
                        ]["info"][0]["enable"]
                            ? `param901_8.${
                                  this.activeChannel
                              }.info.0.enable.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/交通标识识别（TSR）/一级报警/报警使能&${
                                  val["info"][0]["enable"] ? "开启" : "关闭"
                              }&${
                                  this.copyForm["param901"][this.activeChannel][
                                      "param901_8"
                                  ]["info"][0]["enable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param901_8." +
                            this.activeChannel +
                            ".info.0.speed.useless.useless.useless"
                    ] =
                        val["info"][0]["speed"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_8"
                        ]["info"][0]["speed"]
                            ? `param901_8.${
                                  this.activeChannel
                              }.info.0.speed.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/交通标识识别（TSR）/一级报警/报警判断速度阈值&${
                                  val["info"][0]["speed"]
                              }&${
                                  this.copyForm["param901"][this.activeChannel][
                                      "param901_8"
                                  ]["info"][0]["speed"]
                              }`
                            : "";
                    this.formData[
                        "param901_8." +
                            this.activeChannel +
                            ".info.0.confidence.useless.useless.useless"
                    ] =
                        val["info"][0]["confidence"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_8"
                        ]["info"][0]["confidence"]
                            ? `param901_8.${
                                  this.activeChannel
                              }.info.0.confidence.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/交通标识识别（TSR）/一级报警/算法置信度&${
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
                                          this.copyForm["param901"][
                                              this.activeChannel
                                          ]["param901_8"]["info"][0][
                                              "confidence"
                                          ]
                                  ).label
                              }`
                            : "";
                    this.formData[
                        "param901_8." +
                            this.activeChannel +
                            ".info.0.sensitivity.useless.useless.useless"
                    ] =
                        val["info"][0]["sensitivity"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_8"
                        ]["info"][0]["sensitivity"]
                            ? `param901_8.${
                                  this.activeChannel
                              }.info.0.sensitivity.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/交通标识识别（TSR）/一级报警/算法灵敏度&${
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
                                          this.copyForm["param901"][
                                              this.activeChannel
                                          ]["param901_8"]["info"][0][
                                              "sensitivity"
                                          ]
                                  ).label
                              }`
                            : "";
                    this.formData[
                        "param901_8." +
                            this.activeChannel +
                            ".info.0.volume.useless.useless.useless.useless"
                    ] =
                        val["info"][0]["volume"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_8"
                        ]["info"][0]["volume"]
                            ? `param901_8.${
                                  this.activeChannel
                              }.info.0.volume.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/交通标识识别（TSR）/一级报警/报警音量&${
                                  val["info"][0]["volume"]
                              }&${
                                  this.copyForm["param901"][this.activeChannel][
                                      "param901_8"
                                  ]["info"][0]["volume"]
                              }`
                            : "";
                    this.formData[
                        "param901_8." +
                            this.activeChannel +
                            ".info.0.volumeEnable.useless.useless.useless.useless"
                    ] =
                        val["info"][0]["volumeEnable"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_8"
                        ]["info"][0]["volumeEnable"]
                            ? `param901_8.${
                                  this.activeChannel
                              }.info.0.volumeEnable.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/交通标识识别（TSR）/一级报警/音量使能&${
                                  val["info"][0]["volumeEnable"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param901"][this.activeChannel][
                                      "param901_8"
                                  ]["info"][0]["volumeEnable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param901_8." +
                            this.activeChannel +
                            ".info.0.snapshot.upload.useless.useless.useless"
                    ] =
                        val["info"][0]["snapshot"]["upload"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_8"
                        ]["info"][0]["snapshot"]["upload"]
                            ? `param901_8.${
                                  this.activeChannel
                              }.info.0.snapshot.upload.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/交通标识识别（TSR）/一级报警/报警图片上传使能&${
                                  val["info"][0]["snapshot"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param901"][this.activeChannel][
                                      "param901_8"
                                  ]["info"][0]["snapshot"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param901_8." +
                            this.activeChannel +
                            ".info.0.clip.upload.useless.useless.useless"
                    ] =
                        val["info"][0]["clip"]["upload"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_8"
                        ]["info"][0]["clip"]["upload"]
                            ? `param901_8.${
                                  this.activeChannel
                              }.info.0.clip.upload.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/交通标识识别（TSR）/一级报警/报警视频上传使能&${
                                  val["info"][0]["clip"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param901"][this.activeChannel][
                                      "param901_8"
                                  ]["info"][0]["clip"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param901_8." +
                            this.activeChannel +
                            ".info.0.uploadEventPlatform.useless.useless.useless"
                    ] =
                        val["info"][0]["uploadEventPlatform"].join("_") !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_8"
                        ]["info"][0]["uploadEventPlatform"].join("_")
                            ? `param901_8.${
                                  this.activeChannel
                              }.info.0.uploadEventPlatform.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/交通标识识别（TSR）/一级报警/事件上传平台设置&第${val[
                                  "info"
                              ][0]["uploadEventPlatform"].join(
                                  "、"
                              )}中心&第${this.copyForm["param901"][
                                  this.activeChannel
                              ]["param901_8"]["info"][0][
                                  "uploadEventPlatform"
                              ].join("、")}中心`
                            : "";
                    this.$emit("formDataChange", this.formData);
                }
            },
            deep: true,
            immediate: true,
        },
        "form.param901_9": {
            handler(val) {
                if (val && !Boolean(this.isTemplate)) {
                    this.formData[
                        "param901_9." +
                            this.activeChannel +
                            ".info.0.enable.useless.useless.useless"
                    ] =
                        val["info"][0]["enable"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_9"
                        ]["info"][0]["enable"]
                            ? `param901_9.${
                                  this.activeChannel
                              }.info.0.enable.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/交通标识识别（TSR）/二级报警/报警使能&${
                                  val["info"][0]["enable"] ? "开启" : "关闭"
                              }&${
                                  this.copyForm["param901"][this.activeChannel][
                                      "param901_9"
                                  ]["info"][0]["enable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param901_9." +
                            this.activeChannel +
                            ".info.0.speed.useless.useless.useless"
                    ] =
                        val["info"][0]["speed"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_9"
                        ]["info"][0]["speed"]
                            ? `param901_9.${
                                  this.activeChannel
                              }.info.0.speed.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/交通标识识别（TSR）/二级报警/报警判断速度阈值&${
                                  val["info"][0]["speed"]
                              }&${
                                  this.copyForm["param901"][this.activeChannel][
                                      "param901_9"
                                  ]["info"][0]["speed"]
                              }`
                            : "";
                    this.formData[
                        "param901_9." +
                            this.activeChannel +
                            ".info.0.confidence.useless.useless.useless"
                    ] =
                        val["info"][0]["confidence"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_9"
                        ]["info"][0]["confidence"]
                            ? `param901_9.${
                                  this.activeChannel
                              }.info.0.confidence.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/交通标识识别（TSR）/二级报警/算法置信度&${
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
                                          this.copyForm["param901"][
                                              this.activeChannel
                                          ]["param901_9"]["info"][0][
                                              "confidence"
                                          ]
                                  ).label
                              }`
                            : "";
                    this.formData[
                        "param901_9." +
                            this.activeChannel +
                            ".info.0.sensitivity.useless.useless.useless"
                    ] =
                        val["info"][0]["sensitivity"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_9"
                        ]["info"][0]["sensitivity"]
                            ? `param901_9.${
                                  this.activeChannel
                              }.info.0.sensitivity.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/交通标识识别（TSR）/二级报警/算法灵敏度&${
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
                                          this.copyForm["param901"][
                                              this.activeChannel
                                          ]["param901_9"]["info"][0][
                                              "sensitivity"
                                          ]
                                  ).label
                              }`
                            : "";
                    this.formData[
                        "param901_9." +
                            this.activeChannel +
                            ".info.0.volume.useless.useless.useless.useless"
                    ] =
                        val["info"][0]["volume"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_9"
                        ]["info"][0]["volume"]
                            ? `param901_9.${
                                  this.activeChannel
                              }.info.0.volume.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/交通标识识别（TSR）/二级报警/报警音量&${
                                  val["info"][0]["volume"]
                              }&${
                                  this.copyForm["param901"][this.activeChannel][
                                      "param901_9"
                                  ]["info"][0]["volume"]
                              }`
                            : "";
                    this.formData[
                        "param901_9." +
                            this.activeChannel +
                            ".info.0.volumeEnable.useless.useless.useless.useless"
                    ] =
                        val["info"][0]["volumeEnable"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_9"
                        ]["info"][0]["volumeEnable"]
                            ? `param901_9.${
                                  this.activeChannel
                              }.info.0.volumeEnable.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/交通标识识别（TSR）/二级报警/音量使能&${
                                  val["info"][0]["volumeEnable"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param901"][this.activeChannel][
                                      "param901_9"
                                  ]["info"][0]["volumeEnable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param901_9." +
                            this.activeChannel +
                            ".info.0.snapshot.upload.useless.useless.useless"
                    ] =
                        val["info"][0]["snapshot"]["upload"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_9"
                        ]["info"][0]["snapshot"]["upload"]
                            ? `param901_9.${
                                  this.activeChannel
                              }.info.0.snapshot.upload.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/交通标识识别（TSR）/二级报警/报警图片上传使能&${
                                  val["info"][0]["snapshot"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param901"][this.activeChannel][
                                      "param901_9"
                                  ]["info"][0]["snapshot"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param901_9." +
                            this.activeChannel +
                            ".info.0.clip.upload.useless.useless.useless"
                    ] =
                        val["info"][0]["clip"]["upload"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_9"
                        ]["info"][0]["clip"]["upload"]
                            ? `param901_9.${
                                  this.activeChannel
                              }.info.0.clip.upload.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/交通标识识别（TSR）/二级报警/报警视频上传使能&${
                                  val["info"][0]["clip"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param901"][this.activeChannel][
                                      "param901_9"
                                  ]["info"][0]["clip"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param901_9." +
                            this.activeChannel +
                            ".info.0.uploadEventPlatform.useless.useless.useless"
                    ] =
                        val["info"][0]["uploadEventPlatform"].join("_") !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_9"
                        ]["info"][0]["uploadEventPlatform"].join("_")
                            ? `param901_9.${
                                  this.activeChannel
                              }.info.0.uploadEventPlatform.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/交通标识识别（TSR）/二级报警/事件上传平台设置&第${val[
                                  "info"
                              ][0]["uploadEventPlatform"].join(
                                  "、"
                              )}中心&第${this.copyForm["param901"][
                                  this.activeChannel
                              ]["param901_9"]["info"][0][
                                  "uploadEventPlatform"
                              ].join("、")}中心`
                            : "";
                    this.$emit("formDataChange", this.formData);
                }
            },
            deep: true,
            immediate: true,
        },
        "form.param901_12": {
            handler(val) {
                if (val && !Boolean(this.isTemplate)) {
                    this.formData[
                        "param901_12." +
                            this.activeChannel +
                            ".info.0.enable.useless.useless.useless"
                    ] =
                        val["info"][0]["enable"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_12"
                        ]["info"][0]["enable"]
                            ? `param901_12.${
                                  this.activeChannel
                              }.info.0.enable.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/闯红灯（RRL）/一级报警/报警使能&${
                                  val["info"][0]["enable"] ? "开启" : "关闭"
                              }&${
                                  this.copyForm["param901"][this.activeChannel][
                                      "param901_12"
                                  ]["info"][0]["enable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param901_12." +
                            this.activeChannel +
                            ".info.0.speed.useless.useless.useless"
                    ] =
                        val["info"][0]["speed"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_12"
                        ]["info"][0]["speed"]
                            ? `param901_12.${
                                  this.activeChannel
                              }.info.0.speed.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/闯红灯（RRL）/一级报警/报警判断速度阈值&${
                                  val["info"][0]["speed"]
                              }&${
                                  this.copyForm["param901"][this.activeChannel][
                                      "param901_12"
                                  ]["info"][0]["speed"]
                              }`
                            : "";
                    this.formData[
                        "param901_12." +
                            this.activeChannel +
                            ".info.0.confidence.useless.useless.useless"
                    ] =
                        val["info"][0]["confidence"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_12"
                        ]["info"][0]["confidence"]
                            ? `param901_12.${
                                  this.activeChannel
                              }.info.0.confidence.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/闯红灯（RRL）/一级报警/算法置信度&${
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
                                          this.copyForm["param901"][
                                              this.activeChannel
                                          ]["param901_12"]["info"][0][
                                              "confidence"
                                          ]
                                  ).label
                              }`
                            : "";
                    this.formData[
                        "param901_12." +
                            this.activeChannel +
                            ".info.0.sensitivity.useless.useless.useless"
                    ] =
                        val["info"][0]["sensitivity"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_12"
                        ]["info"][0]["sensitivity"]
                            ? `param901_12.${
                                  this.activeChannel
                              }.info.0.sensitivity.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/闯红灯（RRL）/一级报警/算法灵敏度&${
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
                                          this.copyForm["param901"][
                                              this.activeChannel
                                          ]["param901_12"]["info"][0][
                                              "sensitivity"
                                          ]
                                  ).label
                              }`
                            : "";
                    this.formData[
                        "param901_12." +
                            this.activeChannel +
                            ".info.0.volume.useless.useless.useless.useless"
                    ] =
                        val["info"][0]["volume"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_12"
                        ]["info"][0]["volume"]
                            ? `param901_12.${
                                  this.activeChannel
                              }.info.0.volume.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/闯红灯（RRL）/一级报警/报警音量&${
                                  val["info"][0]["volume"]
                              }&${
                                  this.copyForm["param901"][this.activeChannel][
                                      "param901_12"
                                  ]["info"][0]["volume"]
                              }`
                            : "";
                    this.formData[
                        "param901_12." +
                            this.activeChannel +
                            ".info.0.volumeEnable.useless.useless.useless.useless"
                    ] =
                        val["info"][0]["volumeEnable"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_12"
                        ]["info"][0]["volumeEnable"]
                            ? `param901_12.${
                                  this.activeChannel
                              }.info.0.volumeEnable.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/闯红灯（RRL）/一级报警/音量使能&${
                                  val["info"][0]["volumeEnable"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param901"][this.activeChannel][
                                      "param901_12"
                                  ]["info"][0]["volumeEnable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param901_12." +
                            this.activeChannel +
                            ".info.0.snapshot.upload.useless.useless.useless"
                    ] =
                        val["info"][0]["snapshot"]["upload"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_12"
                        ]["info"][0]["snapshot"]["upload"]
                            ? `param901_12.${
                                  this.activeChannel
                              }.info.0.snapshot.upload.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/闯红灯（RRL）/一级报警/报警图片上传使能&${
                                  val["info"][0]["snapshot"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param901"][this.activeChannel][
                                      "param901_12"
                                  ]["info"][0]["snapshot"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param901_12." +
                            this.activeChannel +
                            ".info.0.clip.upload.useless.useless.useless"
                    ] =
                        val["info"][0]["clip"]["upload"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_12"
                        ]["info"][0]["clip"]["upload"]
                            ? `param901_12.${
                                  this.activeChannel
                              }.info.0.clip.upload.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/闯红灯（RRL）/一级报警/报警视频上传使能&${
                                  val["info"][0]["clip"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param901"][this.activeChannel][
                                      "param901_12"
                                  ]["info"][0]["clip"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param901_12." +
                            this.activeChannel +
                            ".info.0.uploadEventPlatform.useless.useless.useless"
                    ] =
                        val["info"][0]["uploadEventPlatform"].join("_") !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_12"
                        ]["info"][0]["uploadEventPlatform"].join("_")
                            ? `param901_12.${
                                  this.activeChannel
                              }.info.0.uploadEventPlatform.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/闯红灯（RRL）/一级报警/事件上传平台设置&第${val[
                                  "info"
                              ][0]["uploadEventPlatform"].join(
                                  "、"
                              )}中心&第${this.copyForm["param901"][
                                  this.activeChannel
                              ]["param901_12"]["info"][0][
                                  "uploadEventPlatform"
                              ].join("、")}中心`
                            : "";
                    this.$emit("formDataChange", this.formData);
                }
            },
            deep: true,
            immediate: true,
        },
        "form.param901_13": {
            handler(val) {
                if (val && !Boolean(this.isTemplate)) {
                    this.formData[
                        "param901_13." +
                            this.activeChannel +
                            ".info.0.enable.useless.useless.useless"
                    ] =
                        val["info"][0]["enable"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_13"
                        ]["info"][0]["enable"]
                            ? `param901_13.${
                                  this.activeChannel
                              }.info.0.enable.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/闯红灯（RRL）/二级报警/报警使能&${
                                  val["info"][0]["enable"] ? "开启" : "关闭"
                              }&${
                                  this.copyForm["param901"][this.activeChannel][
                                      "param901_13"
                                  ]["info"][0]["enable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param901_13." +
                            this.activeChannel +
                            ".info.0.speed.useless.useless.useless"
                    ] =
                        val["info"][0]["speed"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_13"
                        ]["info"][0]["speed"]
                            ? `param901_13.${
                                  this.activeChannel
                              }.info.0.speed.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/闯红灯（RRL）/二级报警/报警判断速度阈值&${
                                  val["info"][0]["speed"]
                              }&${
                                  this.copyForm["param901"][this.activeChannel][
                                      "param901_13"
                                  ]["info"][0]["speed"]
                              }`
                            : "";
                    this.formData[
                        "param901_13." +
                            this.activeChannel +
                            ".info.0.confidence.useless.useless.useless"
                    ] =
                        val["info"][0]["confidence"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_13"
                        ]["info"][0]["confidence"]
                            ? `param901_13.${
                                  this.activeChannel
                              }.info.0.confidence.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/闯红灯（RRL）/二级报警/算法置信度&${
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
                                          this.copyForm["param901"][
                                              this.activeChannel
                                          ]["param901_13"]["info"][0][
                                              "confidence"
                                          ]
                                  ).label
                              }`
                            : "";
                    this.formData[
                        "param901_13." +
                            this.activeChannel +
                            ".info.0.sensitivity.useless.useless.useless"
                    ] =
                        val["info"][0]["sensitivity"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_13"
                        ]["info"][0]["sensitivity"]
                            ? `param901_13.${
                                  this.activeChannel
                              }.info.0.sensitivity.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/闯红灯（RRL）/二级报警/算法灵敏度&${
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
                                          this.copyForm["param901"][
                                              this.activeChannel
                                          ]["param901_13"]["info"][0][
                                              "sensitivity"
                                          ]
                                  ).label
                              }`
                            : "";
                    this.formData[
                        "param901_13." +
                            this.activeChannel +
                            ".info.0.volume.useless.useless.useless.useless"
                    ] =
                        val["info"][0]["volume"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_13"
                        ]["info"][0]["volume"]
                            ? `param901_13.${
                                  this.activeChannel
                              }.info.0.volume.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/闯红灯（RRL）/二级报警/报警音量&${
                                  val["info"][0]["volume"]
                              }&${
                                  this.copyForm["param901"][this.activeChannel][
                                      "param901_13"
                                  ]["info"][0]["volume"]
                              }`
                            : "";
                    this.formData[
                        "param901_13." +
                            this.activeChannel +
                            ".info.0.volumeEnable.useless.useless.useless.useless"
                    ] =
                        val["info"][0]["volumeEnable"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_13"
                        ]["info"][0]["volumeEnable"]
                            ? `param901_13.${
                                  this.activeChannel
                              }.info.0.volumeEnable.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/闯红灯（RRL）/二级报警/音量使能&${
                                  val["info"][0]["volumeEnable"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param901"][this.activeChannel][
                                      "param901_13"
                                  ]["info"][0]["volumeEnable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param901_13." +
                            this.activeChannel +
                            ".info.0.snapshot.upload.useless.useless.useless"
                    ] =
                        val["info"][0]["snapshot"]["upload"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_13"
                        ]["info"][0]["snapshot"]["upload"]
                            ? `param901_13.${
                                  this.activeChannel
                              }.info.0.snapshot.upload.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/闯红灯（RRL）/二级报警/报警图片上传使能&${
                                  val["info"][0]["snapshot"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param901"][this.activeChannel][
                                      "param901_13"
                                  ]["info"][0]["snapshot"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param901_13." +
                            this.activeChannel +
                            ".info.0.clip.upload.useless.useless.useless"
                    ] =
                        val["info"][0]["clip"]["upload"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_13"
                        ]["info"][0]["clip"]["upload"]
                            ? `param901_13.${
                                  this.activeChannel
                              }.info.0.clip.upload.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/闯红灯（RRL）/二级报警/报警视频上传使能&${
                                  val["info"][0]["clip"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param901"][this.activeChannel][
                                      "param901_13"
                                  ]["info"][0]["clip"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param901_13." +
                            this.activeChannel +
                            ".info.0.uploadEventPlatform.useless.useless.useless"
                    ] =
                        val["info"][0]["uploadEventPlatform"].join("_") !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_13"
                        ]["info"][0]["uploadEventPlatform"].join("_")
                            ? `param901_13.${
                                  this.activeChannel
                              }.info.0.uploadEventPlatform.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/闯红灯（RRL）/二级报警/事件上传平台设置&第${val[
                                  "info"
                              ][0]["uploadEventPlatform"].join(
                                  "、"
                              )}中心&第${this.copyForm["param901"][
                                  this.activeChannel
                              ]["param901_13"]["info"][0][
                                  "uploadEventPlatform"
                              ].join("、")}中心`
                            : "";
                    this.$emit("formDataChange", this.formData);
                }
            },
            deep: true,
            immediate: true,
        },
        "form.param901_18": {
            handler(val) {
                if (val && !Boolean(this.isTemplate)) {
                    this.formData[
                        "param901_18." +
                            this.activeChannel +
                            ".info.0.enable.useless.useless.useless"
                    ] =
                        val["info"][0]["enable"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_18"
                        ]["info"][0]["enable"]
                            ? `param901_18.${
                                  this.activeChannel
                              }.info.0.enable.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/行人安全礼让提醒（PSCW）/一级报警/报警使能&${
                                  val["info"][0]["enable"] ? "开启" : "关闭"
                              }&${
                                  this.copyForm["param901"][this.activeChannel][
                                      "param901_18"
                                  ]["info"][0]["enable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param901_18." +
                            this.activeChannel +
                            ".info.0.speed.useless.useless.useless"
                    ] =
                        val["info"][0]["speed"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_18"
                        ]["info"][0]["speed"]
                            ? `param901_18.${
                                  this.activeChannel
                              }.info.0.speed.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/行人安全礼让提醒（PSCW）/一级报警/报警判断速度阈值&${
                                  val["info"][0]["speed"]
                              }&${
                                  this.copyForm["param901"][this.activeChannel][
                                      "param901_18"
                                  ]["info"][0]["speed"]
                              }`
                            : "";
                    this.formData[
                        "param901_18." +
                            this.activeChannel +
                            ".info.0.confidence.useless.useless.useless"
                    ] =
                        val["info"][0]["confidence"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_18"
                        ]["info"][0]["confidence"]
                            ? `param901_18.${
                                  this.activeChannel
                              }.info.0.confidence.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/行人安全礼让提醒（PSCW）/一级报警/算法置信度&${
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
                                          this.copyForm["param901"][
                                              this.activeChannel
                                          ]["param901_18"]["info"][0][
                                              "confidence"
                                          ]
                                  ).label
                              }`
                            : "";
                    this.formData[
                        "param901_18." +
                            this.activeChannel +
                            ".info.0.sensitivity.useless.useless.useless"
                    ] =
                        val["info"][0]["sensitivity"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_18"
                        ]["info"][0]["sensitivity"]
                            ? `param901_18.${
                                  this.activeChannel
                              }.info.0.sensitivity.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/行人安全礼让提醒（PSCW）/一级报警/算法灵敏度&${
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
                                          this.copyForm["param901"][
                                              this.activeChannel
                                          ]["param901_18"]["info"][0][
                                              "sensitivity"
                                          ]
                                  ).label
                              }`
                            : "";
                    this.formData[
                        "param901_18." +
                            this.activeChannel +
                            ".info.0.volume.useless.useless.useless.useless"
                    ] =
                        val["info"][0]["volume"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_18"
                        ]["info"][0]["volume"]
                            ? `param901_18.${
                                  this.activeChannel
                              }.info.0.volume.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/行人安全礼让提醒（PSCW）/一级报警/报警音量&${
                                  val["info"][0]["volume"]
                              }&${
                                  this.copyForm["param901"][this.activeChannel][
                                      "param901_18"
                                  ]["info"][0]["volume"]
                              }`
                            : "";
                    this.formData[
                        "param901_18." +
                            this.activeChannel +
                            ".info.0.volumeEnable.useless.useless.useless.useless"
                    ] =
                        val["info"][0]["volumeEnable"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_18"
                        ]["info"][0]["volumeEnable"]
                            ? `param901_18.${
                                  this.activeChannel
                              }.info.0.volumeEnable.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/行人安全礼让提醒（PSCW）/一级报警/音量使能&${
                                  val["info"][0]["volumeEnable"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param901"][this.activeChannel][
                                      "param901_18"
                                  ]["info"][0]["volumeEnable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param901_18." +
                            this.activeChannel +
                            ".info.0.snapshot.upload.useless.useless.useless"
                    ] =
                        val["info"][0]["snapshot"]["upload"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_18"
                        ]["info"][0]["snapshot"]["upload"]
                            ? `param901_18.${
                                  this.activeChannel
                              }.info.0.snapshot.upload.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/行人安全礼让提醒（PSCW）/一级报警/报警图片上传使能&${
                                  val["info"][0]["snapshot"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param901"][this.activeChannel][
                                      "param901_18"
                                  ]["info"][0]["snapshot"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param901_18." +
                            this.activeChannel +
                            ".info.0.clip.upload.useless.useless.useless"
                    ] =
                        val["info"][0]["clip"]["upload"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_18"
                        ]["info"][0]["clip"]["upload"]
                            ? `param901_18.${
                                  this.activeChannel
                              }.info.0.clip.upload.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/行人安全礼让提醒（PSCW）/一级报警/报警视频上传使能&${
                                  val["info"][0]["clip"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param901"][this.activeChannel][
                                      "param901_18"
                                  ]["info"][0]["clip"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param901_18." +
                            this.activeChannel +
                            ".info.0.uploadEventPlatform.useless.useless.useless"
                    ] =
                        val["info"][0]["uploadEventPlatform"].join("_") !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_18"
                        ]["info"][0]["uploadEventPlatform"].join("_")
                            ? `param901_18.${
                                  this.activeChannel
                              }.info.0.uploadEventPlatform.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/行人安全礼让提醒（PSCW）/一级报警/事件上传平台设置&第${val[
                                  "info"
                              ][0]["uploadEventPlatform"].join(
                                  "、"
                              )}中心&第${this.copyForm["param901"][
                                  this.activeChannel
                              ]["param901_18"]["info"][0][
                                  "uploadEventPlatform"
                              ].join("、")}中心`
                            : "";
                    this.$emit("formDataChange", this.formData);
                }
            },
            deep: true,
            immediate: true,
        },
        "form.param901_19": {
            handler(val) {
                if (val && !Boolean(this.isTemplate)) {
                    this.formData[
                        "param901_19." +
                            this.activeChannel +
                            ".info.0.enable.useless.useless.useless"
                    ] =
                        val["info"][0]["enable"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_19"
                        ]["info"][0]["enable"]
                            ? `param901_19.${
                                  this.activeChannel
                              }.info.0.enable.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/行人安全礼让提醒（PSCW）/二级报警/报警使能&${
                                  val["info"][0]["enable"] ? "开启" : "关闭"
                              }&${
                                  this.copyForm["param901"][this.activeChannel][
                                      "param901_19"
                                  ]["info"][0]["enable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param901_19." +
                            this.activeChannel +
                            ".info.0.speed.useless.useless.useless"
                    ] =
                        val["info"][0]["speed"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_19"
                        ]["info"][0]["speed"]
                            ? `param901_19.${
                                  this.activeChannel
                              }.info.0.speed.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/行人安全礼让提醒（PSCW）/二级报警/报警判断速度阈值&${
                                  val["info"][0]["speed"]
                              }&${
                                  this.copyForm["param901"][this.activeChannel][
                                      "param901_19"
                                  ]["info"][0]["speed"]
                              }`
                            : "";
                    this.formData[
                        "param901_19." +
                            this.activeChannel +
                            ".info.0.confidence.useless.useless.useless"
                    ] =
                        val["info"][0]["confidence"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_19"
                        ]["info"][0]["confidence"]
                            ? `param901_19.${
                                  this.activeChannel
                              }.info.0.confidence.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/行人安全礼让提醒（PSCW）/二级报警/算法置信度&${
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
                                          this.copyForm["param901"][
                                              this.activeChannel
                                          ]["param901_19"]["info"][0][
                                              "confidence"
                                          ]
                                  ).label
                              }`
                            : "";
                    this.formData[
                        "param901_19." +
                            this.activeChannel +
                            ".info.0.sensitivity.useless.useless.useless"
                    ] =
                        val["info"][0]["sensitivity"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_19"
                        ]["info"][0]["sensitivity"]
                            ? `param901_19.${
                                  this.activeChannel
                              }.info.0.sensitivity.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/行人安全礼让提醒（PSCW）/二级报警/算法灵敏度&${
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
                                          this.copyForm["param901"][
                                              this.activeChannel
                                          ]["param901_19"]["info"][0][
                                              "sensitivity"
                                          ]
                                  ).label
                              }`
                            : "";
                    this.formData[
                        "param901_19." +
                            this.activeChannel +
                            ".info.0.volume.useless.useless.useless.useless"
                    ] =
                        val["info"][0]["volume"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_19"
                        ]["info"][0]["volume"]
                            ? `param901_19.${
                                  this.activeChannel
                              }.info.0.volume.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/行人安全礼让提醒（PSCW）/二级报警/报警音量&${
                                  val["info"][0]["volume"]
                              }&${
                                  this.copyForm["param901"][this.activeChannel][
                                      "param901_19"
                                  ]["info"][0]["volume"]
                              }`
                            : "";
                    this.formData[
                        "param901_19." +
                            this.activeChannel +
                            ".info.0.volumeEnable.useless.useless.useless.useless"
                    ] =
                        val["info"][0]["volumeEnable"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_19"
                        ]["info"][0]["volumeEnable"]
                            ? `param901_19.${
                                  this.activeChannel
                              }.info.0.volumeEnable.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/行人安全礼让提醒（PSCW）/二级报警/音量使能&${
                                  val["info"][0]["volumeEnable"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param901"][this.activeChannel][
                                      "param901_19"
                                  ]["info"][0]["volumeEnable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param901_19." +
                            this.activeChannel +
                            ".info.0.snapshot.upload.useless.useless.useless"
                    ] =
                        val["info"][0]["snapshot"]["upload"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_19"
                        ]["info"][0]["snapshot"]["upload"]
                            ? `param901_19.${
                                  this.activeChannel
                              }.info.0.snapshot.upload.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/行人安全礼让提醒（PSCW）/二级报警/报警图片上传使能&${
                                  val["info"][0]["snapshot"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param901"][this.activeChannel][
                                      "param901_19"
                                  ]["info"][0]["snapshot"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param901_19." +
                            this.activeChannel +
                            ".info.0.clip.upload.useless.useless.useless"
                    ] =
                        val["info"][0]["clip"]["upload"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_19"
                        ]["info"][0]["clip"]["upload"]
                            ? `param901_19.${
                                  this.activeChannel
                              }.info.0.clip.upload.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/行人安全礼让提醒（PSCW）/二级报警/报警视频上传使能&${
                                  val["info"][0]["clip"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param901"][this.activeChannel][
                                      "param901_19"
                                  ]["info"][0]["clip"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param901_19." +
                            this.activeChannel +
                            ".info.0.uploadEventPlatform.useless.useless.useless"
                    ] =
                        val["info"][0]["uploadEventPlatform"].join("_") !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_19"
                        ]["info"][0]["uploadEventPlatform"].join("_")
                            ? `param901_19.${
                                  this.activeChannel
                              }.info.0.uploadEventPlatform.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/行人安全礼让提醒（PSCW）/二级报警/事件上传平台设置&第${val[
                                  "info"
                              ][0]["uploadEventPlatform"].join(
                                  "、"
                              )}中心&第${this.copyForm["param901"][
                                  this.activeChannel
                              ]["param901_19"]["info"][0][
                                  "uploadEventPlatform"
                              ].join("、")}中心`
                            : "";
                    this.$emit("formDataChange", this.formData);
                }
            },
            deep: true,
            immediate: true,
        },
        "form.param901_32": {
            handler(val) {
                if (val && !Boolean(this.isTemplate)) {
                    this.formData[
                        "param901_32." +
                            this.activeChannel +
                            ".info.0.enable.useless.useless.useless"
                    ] =
                        val["info"][0]["enable"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_32"
                        ]["info"][0]["enable"]
                            ? `param901_32.${
                                  this.activeChannel
                              }.info.0.enable.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/违规占道报警（IROW）/一级报警/报警使能&${
                                  val["info"][0]["enable"] ? "开启" : "关闭"
                              }&${
                                  this.copyForm["param901"][this.activeChannel][
                                      "param901_32"
                                  ]["info"][0]["enable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param901_32." +
                            this.activeChannel +
                            ".info.0.speed.useless.useless.useless"
                    ] =
                        val["info"][0]["speed"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_32"
                        ]["info"][0]["speed"]
                            ? `param901_32.${
                                  this.activeChannel
                              }.info.0.speed.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/违规占道报警（IROW）/一级报警/报警判断速度阈值&${
                                  val["info"][0]["speed"]
                              }&${
                                  this.copyForm["param901"][this.activeChannel][
                                      "param901_32"
                                  ]["info"][0]["speed"]
                              }`
                            : "";
                    this.formData[
                        "param901_32." +
                            this.activeChannel +
                            ".info.0.confidence.useless.useless.useless"
                    ] =
                        val["info"][0]["confidence"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_32"
                        ]["info"][0]["confidence"]
                            ? `param901_32.${
                                  this.activeChannel
                              }.info.0.confidence.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/违规占道报警（IROW）/一级报警/算法置信度&${
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
                                          this.copyForm["param901"][
                                              this.activeChannel
                                          ]["param901_32"]["info"][0][
                                              "confidence"
                                          ]
                                  ).label
                              }`
                            : "";
                    this.formData[
                        "param901_32." +
                            this.activeChannel +
                            ".info.0.sensitivity.useless.useless.useless"
                    ] =
                        val["info"][0]["sensitivity"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_32"
                        ]["info"][0]["sensitivity"]
                            ? `param901_32.${
                                  this.activeChannel
                              }.info.0.sensitivity.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/违规占道报警（IROW）/一级报警/算法灵敏度&${
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
                                          this.copyForm["param901"][
                                              this.activeChannel
                                          ]["param901_32"]["info"][0][
                                              "sensitivity"
                                          ]
                                  ).label
                              }`
                            : "";
                    this.formData[
                        "param901_32." +
                            this.activeChannel +
                            ".info.0.volume.useless.useless.useless.useless"
                    ] =
                        val["info"][0]["volume"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_32"
                        ]["info"][0]["volume"]
                            ? `param901_32.${
                                  this.activeChannel
                              }.info.0.volume.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/违规占道报警（IROW）/一级报警/报警音量&${
                                  val["info"][0]["volume"]
                              }&${
                                  this.copyForm["param901"][this.activeChannel][
                                      "param901_32"
                                  ]["info"][0]["volume"]
                              }`
                            : "";
                    this.formData[
                        "param901_32." +
                            this.activeChannel +
                            ".info.0.volumeEnable.useless.useless.useless.useless"
                    ] =
                        val["info"][0]["volumeEnable"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_32"
                        ]["info"][0]["volumeEnable"]
                            ? `param901_32.${
                                  this.activeChannel
                              }.info.0.volumeEnable.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/违规占道报警（IROW）/一级报警/音量使能&${
                                  val["info"][0]["volumeEnable"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param901"][this.activeChannel][
                                      "param901_32"
                                  ]["info"][0]["volumeEnable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param901_32." +
                            this.activeChannel +
                            ".info.0.snapshot.upload.useless.useless.useless"
                    ] =
                        val["info"][0]["snapshot"]["upload"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_32"
                        ]["info"][0]["snapshot"]["upload"]
                            ? `param901_32.${
                                  this.activeChannel
                              }.info.0.snapshot.upload.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/违规占道报警（IROW）/一级报警/报警图片上传使能&${
                                  val["info"][0]["snapshot"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param901"][this.activeChannel][
                                      "param901_32"
                                  ]["info"][0]["snapshot"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param901_32." +
                            this.activeChannel +
                            ".info.0.clip.upload.useless.useless.useless"
                    ] =
                        val["info"][0]["clip"]["upload"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_32"
                        ]["info"][0]["clip"]["upload"]
                            ? `param901_32.${
                                  this.activeChannel
                              }.info.0.clip.upload.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/违规占道报警（IROW）/一级报警/报警视频上传使能&${
                                  val["info"][0]["clip"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param901"][this.activeChannel][
                                      "param901_32"
                                  ]["info"][0]["clip"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param901_32." +
                            this.activeChannel +
                            ".info.0.uploadEventPlatform.useless.useless.useless"
                    ] =
                        val["info"][0]["uploadEventPlatform"].join("_") !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_32"
                        ]["info"][0]["uploadEventPlatform"].join("_")
                            ? `param901_32.${
                                  this.activeChannel
                              }.info.0.uploadEventPlatform.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/违规占道报警（IROW）/一级报警/事件上传平台设置&第${val[
                                  "info"
                              ][0]["uploadEventPlatform"].join(
                                  "、"
                              )}中心&第${this.copyForm["param901"][
                                  this.activeChannel
                              ]["param901_32"]["info"][0][
                                  "uploadEventPlatform"
                              ].join("、")}中心`
                            : "";
                    this.$emit("formDataChange", this.formData);
                }
            },
            deep: true,
            immediate: true,
        },
        "form.param901_33": {
            handler(val) {
                if (val && !Boolean(this.isTemplate)) {
                    this.formData[
                        "param901_33." +
                            this.activeChannel +
                            ".info.0.enable.useless.useless.useless"
                    ] =
                        val["info"][0]["enable"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_33"
                        ]["info"][0]["enable"]
                            ? `param901_33.${
                                  this.activeChannel
                              }.info.0.enable.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/违规占道报警（IROW）/二级报警/报警使能&${
                                  val["info"][0]["enable"] ? "开启" : "关闭"
                              }&${
                                  this.copyForm["param901"][this.activeChannel][
                                      "param901_33"
                                  ]["info"][0]["enable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param901_33." +
                            this.activeChannel +
                            ".info.0.speed.useless.useless.useless"
                    ] =
                        val["info"][0]["speed"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_33"
                        ]["info"][0]["speed"]
                            ? `param901_33.${
                                  this.activeChannel
                              }.info.0.speed.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/违规占道报警（IROW）/二级报警/报警判断速度阈值&${
                                  val["info"][0]["speed"]
                              }&${
                                  this.copyForm["param901"][this.activeChannel][
                                      "param901_33"
                                  ]["info"][0]["speed"]
                              }`
                            : "";
                    this.formData[
                        "param901_33." +
                            this.activeChannel +
                            ".info.0.confidence.useless.useless.useless"
                    ] =
                        val["info"][0]["confidence"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_33"
                        ]["info"][0]["confidence"]
                            ? `param901_33.${
                                  this.activeChannel
                              }.info.0.confidence.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/违规占道报警（IROW）/二级报警/算法置信度&${
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
                                          this.copyForm["param901"][
                                              this.activeChannel
                                          ]["param901_33"]["info"][0][
                                              "confidence"
                                          ]
                                  ).label
                              }`
                            : "";
                    this.formData[
                        "param901_33." +
                            this.activeChannel +
                            ".info.0.sensitivity.useless.useless.useless"
                    ] =
                        val["info"][0]["sensitivity"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_33"
                        ]["info"][0]["sensitivity"]
                            ? `param901_33.${
                                  this.activeChannel
                              }.info.0.sensitivity.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/违规占道报警（IROW）/二级报警/算法灵敏度&${
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
                                          this.copyForm["param901"][
                                              this.activeChannel
                                          ]["param901_33"]["info"][0][
                                              "sensitivity"
                                          ]
                                  ).label
                              }`
                            : "";
                    this.formData[
                        "param901_33." +
                            this.activeChannel +
                            ".info.0.volume.useless.useless.useless.useless"
                    ] =
                        val["info"][0]["volume"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_33"
                        ]["info"][0]["volume"]
                            ? `param901_33.${
                                  this.activeChannel
                              }.info.0.volume.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/违规占道报警（IROW）/二级报警/报警音量&${
                                  val["info"][0]["volume"]
                              }&${
                                  this.copyForm["param901"][this.activeChannel][
                                      "param901_33"
                                  ]["info"][0]["volume"]
                              }`
                            : "";
                    this.formData[
                        "param901_33." +
                            this.activeChannel +
                            ".info.0.volumeEnable.useless.useless.useless.useless"
                    ] =
                        val["info"][0]["volumeEnable"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_33"
                        ]["info"][0]["volumeEnable"]
                            ? `param901_33.${
                                  this.activeChannel
                              }.info.0.volumeEnable.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/违规占道报警（IROW）/二级报警/音量使能&${
                                  val["info"][0]["volumeEnable"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param901"][this.activeChannel][
                                      "param901_33"
                                  ]["info"][0]["volumeEnable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param901_33." +
                            this.activeChannel +
                            ".info.0.snapshot.upload.useless.useless.useless"
                    ] =
                        val["info"][0]["snapshot"]["upload"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_33"
                        ]["info"][0]["snapshot"]["upload"]
                            ? `param901_33.${
                                  this.activeChannel
                              }.info.0.snapshot.upload.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/违规占道报警（IROW）/二级报警/报警图片上传使能&${
                                  val["info"][0]["snapshot"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param901"][this.activeChannel][
                                      "param901_33"
                                  ]["info"][0]["snapshot"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param901_33." +
                            this.activeChannel +
                            ".info.0.clip.upload.useless.useless.useless"
                    ] =
                        val["info"][0]["clip"]["upload"] !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_33"
                        ]["info"][0]["clip"]["upload"]
                            ? `param901_33.${
                                  this.activeChannel
                              }.info.0.clip.upload.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/违规占道报警（IROW）/二级报警/报警视频上传使能&${
                                  val["info"][0]["clip"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }&${
                                  this.copyForm["param901"][this.activeChannel][
                                      "param901_33"
                                  ]["info"][0]["clip"]["upload"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.formData[
                        "param901_33." +
                            this.activeChannel +
                            ".info.0.uploadEventPlatform.useless.useless.useless"
                    ] =
                        val["info"][0]["uploadEventPlatform"].join("_") !==
                        this.copyForm["param901"][this.activeChannel][
                            "param901_33"
                        ]["info"][0]["uploadEventPlatform"].join("_")
                            ? `param901_33.${
                                  this.activeChannel
                              }.info.0.uploadEventPlatform.useless.useless.useless&主动安全设置/ADAS/通道${
                                  this.activeChannel
                              }/违规占道报警（IROW）/二级报警/事件上传平台设置&第${val[
                                  "info"
                              ][0]["uploadEventPlatform"].join(
                                  "、"
                              )}中心&第${this.copyForm["param901"][
                                  this.activeChannel
                              ]["param901_33"]["info"][0][
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
        //console.log(this.isTemplate)
        this.$emit("setMenuActiveRefFormName", "PrivateAdasForm");
    },
    methods: {
        close() {
            this.dialogVisible = false;
            this.sendEveryVolume = false;
        },
        beforeLeave(activeName, oldActiveName) {
            this.$refs.PrivateAdasForm.validate((valid) => {
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
                i <
                this.deviceCapability["intelliDrive_ADAS"][0]["info"].length;
                i++
            ) {
                if (
                    !this.form[
                        "param901_" +
                            this.deviceCapability["intelliDrive_ADAS"][0][
                                "info"
                            ][i].type
                    ]
                ) {
                    let params = {
                        deviceId: this.deviceId,
                        param: {
                            type: this.deviceCapability["intelliDrive_ADAS"][0][
                                "info"
                            ][i].type,
                            chanNo: this.activeChannel,
                        },
                        msgId: 901,
                    };
                    if (Boolean(this.isTemplate)) return;
                    this.$api.getEHomeConfig(params).then((res) => {
                        if (res && res.data && res.data.param) {
                            let formData = JSON.parse(res.data.param);
                            let copyFormData = JSON.parse(res.data.param);
                            formData["info"][0].volume = this.volume;
                            formData["chanNo"] = this.activeChannel;
                            copyFormData["chanNo"] = this.activeChannel;
                            if (this.form["param901_"]) {
                                formData["enable"] =
                                    this.form["param901_"]["enable"];
                            } else {
                                this.$set(this.form, `param901_`, formData);
                                this.$set(
                                    this.copyForm,
                                    `param901_`,
                                    JSON.parse(JSON.stringify(formData))
                                );
                            }
                            this.$set(
                                this.form,
                                `param901_${this.deviceCapability["intelliDrive_ADAS"][0]["info"][i].type}`,
                                formData
                            );
                            if (!this.form["param901"])
                                this.$set(this.form, "param901", {});
                            if (
                                this.form["param901"] &&
                                !this.form["param901"][this.activeChannel]
                            )
                                this.$set(
                                    this.form["param901"],
                                    this.activeChannel,
                                    {}
                                );
                            if (
                                this.form["param901"] &&
                                this.form["param901"][this.activeChannel] &&
                                !this.form["param901"][this.activeChannel][
                                    `param901_${this.deviceCapability["intelliDrive_ADAS"][0]["info"][i].type}`
                                ]
                            )
                                this.$set(
                                    this.form["param901"][this.activeChannel],
                                    `param901_${this.deviceCapability["intelliDrive_ADAS"][0]["info"][i].type}`,
                                    formData
                                );
                            this.$set(
                                this.copyForm,
                                `param901_${this.deviceCapability["intelliDrive_ADAS"][0]["info"][i].type}`,
                                JSON.parse(JSON.stringify(formData))
                            );
                            if (!this.copyForm["param901"])
                                this.$set(
                                    this.copyForm,
                                    "param901",
                                    JSON.parse(JSON.stringify({}))
                                );
                            if (
                                this.copyForm["param901"] &&
                                !this.copyForm["param901"][this.activeChannel]
                            )
                                this.$set(
                                    this.copyForm["param901"],
                                    this.activeChannel,
                                    JSON.parse(JSON.stringify({}))
                                );
                            if (
                                this.copyForm["param901"] &&
                                this.copyForm["param901"][this.activeChannel] &&
                                !this.copyForm["param901"][this.activeChannel][
                                    `param901_${this.deviceCapability["intelliDrive_ADAS"][0]["info"][i].type}`
                                ]
                            )
                                this.$set(
                                    this.copyForm["param901"][
                                        this.activeChannel
                                    ],
                                    `param901_${this.deviceCapability["intelliDrive_ADAS"][0]["info"][i].type}`,
                                    JSON.parse(JSON.stringify(copyFormData))
                                );
                            this.childConfigParams = false;
                            if (
                                i ==
                                this.deviceCapability["intelliDrive_ADAS"][0][
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
                        "param901_" +
                            this.deviceCapability["intelliDrive_ADAS"][0][
                                "info"
                            ][i].type
                    ]["info"][0]["volume"] = this.volume;
                    if (
                        i ==
                        this.deviceCapability["intelliDrive_ADAS"][0]["info"]
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
            console.log(this.chooseType);
            let params = {
                deviceId: this.deviceId,
                param: {
                    type:
                        this.activeName == "ADAS全局配置"
                            ? ""
                            : this.chooseType,
                    chanNo: this.activeChannel,
                },
                msgId: 901,
            };
            if (Boolean(this.isTemplate)) return;
            this.chooseType =
                this.activeName == "ADAS全局配置" ? "" : this.chooseType;
            if (
                !this.form["param901"] ||
                !this.form["param901"][this.activeChannel] ||
                !this.form["param901"][this.activeChannel][
                    "param901_" + this.chooseType
                ]
            ) {
                this.$api.getEHomeConfig(params).then((res) => {
                    if (res && res.data && res.data.param) {
                        let formData = JSON.parse(res.data.param);
                        formData["chanNo"] = this.activeChannel;
                        let obj =
                            this.tabAndConfiguration[this.chanNoIndex].tabList[
                                this.tabIndex
                            ].capabilitys[this.chooseIndex];
                        console.log(
                            666666,
                            this.chooseType,
                            this.activeChannel,
                            JSON.parse(
                                JSON.stringify(
                                    this.tabAndConfiguration[this.chanNoIndex]
                                        .tabList[this.tabIndex].capabilitys[
                                        this.chooseIndex
                                    ]
                                )
                            ),
                            JSON.parse(
                                JSON.stringify(
                                    JSON.parse(res.data.param).info[0]
                                        .sensitivity
                                )
                            ),
                            [
                                obj.sensitivity.min +
                                    parseInt(obj.sensitivityRange / 3),
                                obj.sensitivity.min +
                                    parseInt((obj.sensitivityRange * 2) / 3),
                            ]
                        );
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

                        if (this.form["param901_"]) {
                            formData["enable"] =
                                this.form["param901_"]["enable"];
                        } else {
                            this.$set(this.form, `param901_`, formData);
                            this.$set(
                                this.copyForm,
                                `param901_`,
                                JSON.parse(JSON.stringify(formData))
                            );
                            if (!this.copyForm["param901"])
                                this.$set(
                                    this.copyForm,
                                    "param901",
                                    JSON.parse(JSON.stringify({}))
                                );
                            if (
                                this.copyForm["param901"] &&
                                !this.copyForm["param901"][this.activeChannel]
                            )
                                this.$set(
                                    this.copyForm["param901"],
                                    this.activeChannel,
                                    JSON.parse(JSON.stringify({}))
                                );
                            if (
                                this.copyForm["param901"] &&
                                this.copyForm["param901"][this.activeChannel] &&
                                !this.copyForm["param901"][this.activeChannel][
                                    `param901_`
                                ]
                            )
                                this.$set(
                                    this.copyForm["param901"][
                                        this.activeChannel
                                    ],
                                    `param901_`,
                                    JSON.parse(JSON.stringify(formData))
                                );
                        }
                        this.$set(
                            this.form,
                            `param901_${
                                this.activeName == "ADAS全局配置"
                                    ? ""
                                    : this.chooseType
                            }`,
                            formData
                        );
                        if (!this.form["param901"])
                            this.$set(this.form, "param901", {});
                        if (
                            this.form["param901"] &&
                            !this.form["param901"][this.activeChannel]
                        )
                            this.$set(
                                this.form["param901"],
                                this.activeChannel,
                                {}
                            );
                        if (
                            this.form["param901"] &&
                            this.form["param901"][this.activeChannel] &&
                            !this.form["param901"][this.activeChannel][
                                `param901_${this.chooseType}`
                            ]
                        )
                            this.$set(
                                this.form["param901"][this.activeChannel],
                                `param901_${
                                    this.activeName == "ADAS全局配置"
                                        ? ""
                                        : this.chooseType
                                }`,
                                formData
                            );
                        this.$set(
                            this.copyForm,
                            `param901_${
                                this.activeName == "ADAS全局配置"
                                    ? ""
                                    : this.chooseType
                            }`,
                            JSON.parse(JSON.stringify(formData))
                        );
                        if (!this.copyForm["param901"])
                            this.$set(
                                this.copyForm,
                                "param901",
                                JSON.parse(JSON.stringify({}))
                            );
                        if (
                            this.copyForm["param901"] &&
                            !this.copyForm["param901"][this.activeChannel]
                        )
                            this.$set(
                                this.copyForm["param901"],
                                this.activeChannel,
                                JSON.parse(JSON.stringify({}))
                            );
                        if (
                            this.copyForm["param901"] &&
                            this.copyForm["param901"][this.activeChannel] &&
                            !this.copyForm["param901"][this.activeChannel][
                                `param901_${this.chooseType}`
                            ]
                        )
                            this.$set(
                                this.copyForm["param901"][this.activeChannel],
                                `param901_${
                                    this.activeName == "ADAS全局配置"
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

            // console.log(item);
        },
        //切换通道号
        changeChannel(chanNo, index) {
            this.$refs.PrivateAdasForm.validate((valid) => {
                if (!valid) {
                    this.$message.warning("当前表单验证不通过，请先完善！");
                } else {
                    this.form = Object.assign(
                        {},
                        this.form,
                        this.form["param901"][chanNo]
                    );
                    this.activeChannel = chanNo;
                    this.activeName =
                        (this.deviceCapability["intelliDrive_ADAS"][index][
                            "enable"
                        ] &&
                            this.deviceCapability["intelliDrive_ADAS"][index][
                                "enable"
                            ].length) ||
                        this.deviceCapability["intelliDrive_ADAS"][index][
                            "speedCalibration"
                        ]
                            ? "ADAS全局配置"
                            : this.tabAndConfiguration[index]["tabList"][0][
                                  "name"
                              ];
                    this.chooseType =
                        (this.deviceCapability["intelliDrive_ADAS"][index][
                            "enable"
                        ] &&
                            this.deviceCapability["intelliDrive_ADAS"][index][
                                "enable"
                            ].length) ||
                        this.deviceCapability["intelliDrive_ADAS"][index][
                            "speedCalibration"
                        ]
                            ? ""
                            : this.tabAndConfiguration[index]["tabList"][0][
                                  "types"
                              ][0];
                    this.chooseIndex = 0;
                    this.chanNoIndex = index;
                    this.getPrivateProcotol(
                        this.activeName,
                        this.tabAndConfiguration[this.chanNoIndex],
                        "",
                        ""
                    );
                }
            });
        },
        //切换报警等级
        changeAlarmLevel(item, _index, index, index_) {
            this.$refs.PrivateAdasForm.validate((valid) => {
                if (!valid) {
                    this.$message.warning("当前表单验证不通过，请先完善！");
                } else {
                    this.chooseType = item;
                    this.chooseIndex = _index;
                    this.tabIndex = index_;
                    console.log(index);
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
        },
        makeTabList() {
            this.tabAndConfiguration = [];
            this.deviceCapability["intelliDrive_ADAS"].forEach(
                (item, index) => {
                    this.tabAndConfiguration[index] = {};
                    this.tabAndConfiguration[index]["chanNo"] = item["chanNo"];
                    this.tabAndConfiguration[index]["tabList"] = [];
                    this.tabListPublic(
                        item,
                        this.tabAndConfiguration[index]["tabList"],
                        "前车碰撞（FCW）",
                        0,
                        4
                    );
                    this.tabListPublic(
                        item,
                        this.tabAndConfiguration[index]["tabList"],
                        "车道偏离（LDW）",
                        1,
                        5
                    );
                    this.tabListPublic(
                        item,
                        this.tabAndConfiguration[index]["tabList"],
                        "车距检测（HMW）",
                        2,
                        6
                    );
                    this.tabListPublic(
                        item,
                        this.tabAndConfiguration[index]["tabList"],
                        "行人监测（PCW）",
                        3,
                        7
                    );
                    this.tabListPublic(
                        item,
                        this.tabAndConfiguration[index]["tabList"],
                        "交通标识识别（TSR）",
                        8,
                        9
                    );
                    this.tabListPublic(
                        item,
                        this.tabAndConfiguration[index]["tabList"],
                        "行人安全礼让提醒（PSCW）",
                        18,
                        19
                    );
                    this.tabListPublic(
                        item,
                        this.tabAndConfiguration[index]["tabList"],
                        "闯红灯（RRL）",
                        12,
                        13
                    );
                    this.tabListPublic(
                        item,
                        this.tabAndConfiguration[index]["tabList"],
                        "违规占道报警（IROW）",
                        32,
                        33
                    );
                }
            );
            console.log(
                555555,
                JSON.parse(JSON.stringify(this.tabAndConfiguration))
            );
            this.activeName =
                (this.deviceCapability["intelliDrive_ADAS"][0]["enable"] &&
                    this.deviceCapability["intelliDrive_ADAS"][0]["enable"]
                        .length) ||
                this.deviceCapability["intelliDrive_ADAS"][0][
                    "speedCalibration"
                ]
                    ? "ADAS全局配置"
                    : this.tabAndConfiguration[0]["tabList"][0]["name"];
            this.activeChannel = this.tabAndConfiguration[0]["chanNo"];
            this.chooseType =
                (this.deviceCapability["intelliDrive_ADAS"][0]["enable"] &&
                    this.deviceCapability["intelliDrive_ADAS"][0]["enable"]
                        .length) ||
                this.deviceCapability["intelliDrive_ADAS"][0][
                    "speedCalibration"
                ]
                    ? ""
                    : this.tabAndConfiguration[0]["tabList"][0]["types"][0];
            this.chooseIndex = 0;
            this.chanNoIndex = 0;
            this.tabAndConfiguration.forEach((i) => {
                i.tabList.forEach((j, index) => {
                    j.index = index;
                    j.capabilitys.forEach((k) => {
                        /* --------------------算法灵敏度 start-------------------------*/
                        k.sensitivityList = [];
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
                                    label: "低",
                                },
                                {
                                    value: sensitivityMiddle,
                                    label: "中",
                                },
                                {
                                    value: sensitivityHigh,
                                    label: "高",
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
/deep/.el-tabs {
    .el-tabs__item {
        max-width: 230px !important;
    }
}
</style>
