<template>
    <div class="p-a-md">
        <el-tabs
            v-model="activeName"
            :before-leave="beforeLeave"
            @tab-click="tabClick"
        >
            <template
                v-if="form['param1313'] && deviceCapability['zhatu'].gsensor"
            >
                <el-tab-pane label="路口报警使能" name="first">
                    <el-form
                        ref="PrivateGsensorForm"
                        label-position="top"
                        :model="form"
                        label-width="120px"
                        style="margin-top: 10px"
                    >
                        <el-form-item label="算法使能" class="m-r-md p-r">
                            <el-switch
                                v-model="form['param1313'].enable"
                                :active-value="Number(1)"
                                :inactive-value="Number(0)"
                            ></el-switch>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
            </template>
            <el-tab-pane
                :disabled="tabBol"
                :label="item.label"
                :name="item.gsensorTurnType + 'tab'"
                v-for="(item, index) in dictionaryData['gsensorTurnList']"
                :key="index"
            >
                <template
                    v-if="
                        form['param1315'] &&
                        deviceCapability['zhatu'].gsensorTurn
                    "
                >
                    <el-form
                        :ref="
                            'PrivateGsensorTurnForm' +
                            item.gsensorTurnType +
                            'tab'
                        "
                        label-position="top"
                        :model="form"
                        label-width="120px"
                        style="margin-top: 10px"
                    >
                        <div
                            class="alarmLevelBox"
                            v-if="
                                deviceCapability['zhatu']['gsensorTurn'][index][
                                    'turnList'
                                ].alarmLevel
                            "
                        >
                            <el-button
                                v-for="(item2, index2) in deviceCapability[
                                    'zhatu'
                                ]['gsensorTurn'][index]['turnList']"
                                :key="index2"
                                @click="changeAlarmLevel(index2)"
                                :type="
                                    form['param1315'][index].turnList[index2][
                                        'alarmLevel'
                                    ] === chooseType
                                        ? 'primary'
                                        : 'default'
                                "
                                >{{
                                    item2.alarmLevel === 1
                                        ? "一级报警"
                                        : "二级报警"
                                }}
                            </el-button>
                        </div>
                        <el-row
                            style="display: flex; flex-wrap: wrap"
                            class="m-t-sm"
                        >
                            <el-col>
                                <el-form-item :label="item.label + '报警使能'">
                                    <el-switch
                                        v-model="
                                            form['param1315'][index].turnList[
                                                chooseType - 1
                                            ]['enabled']
                                        "
                                        :active-value="Number(1)"
                                        :inactive-value="Number(0)"
                                    ></el-switch>
                                </el-form-item>
                            </el-col>
                            <el-col
                                v-if="
                                    deviceCapability['zhatu']['gsensorTurn'][
                                        index
                                    ]['turnList'][chooseType - 1]['limitSpeed']
                                "
                            >
                                <el-form-item
                                    label="车速限制速度"
                                    :rules="{
                                        validator: checkNumber.bind({
                                            type: 'int',
                                            min: deviceCapability['zhatu'][
                                                'gsensorTurn'
                                            ][index]['turnList'][
                                                chooseType - 1
                                            ]['limitSpeed']['min'],
                                            max: deviceCapability['zhatu'][
                                                'gsensorTurn'
                                            ][index]['turnList'][
                                                chooseType - 1
                                            ]['limitSpeed']['max'],
                                        }),
                                        trigger: 'blur',
                                    }"
                                    :prop="
                                        'param1315.' +
                                        index +
                                        '.turnList.' +
                                        [chooseType - 1] +
                                        '.limitSpeed'
                                    "
                                >
                                    <el-input
                                        tips-placement="top-end"
                                        :tips="`键入值范围为${
                                            deviceCapability['zhatu'][
                                                'gsensorTurn'
                                            ][index]['turnList'][
                                                chooseType - 1
                                            ]['limitSpeed']['min']
                                        }~${
                                            deviceCapability['zhatu'][
                                                'gsensorTurn'
                                            ][index]['turnList'][
                                                chooseType - 1
                                            ]['limitSpeed']['max']
                                        }`"
                                        v-model.number="
                                            form['param1315'][index].turnList[
                                                chooseType - 1
                                            ]['limitSpeed']
                                        "
                                        ><span slot="suffix"
                                            >km/h</span
                                        ></el-input
                                    >
                                </el-form-item>
                            </el-col>
                            <el-col
                                v-if="
                                    deviceCapability['zhatu']['gsensorTurn'][
                                        index
                                    ]['turnList'][chooseType - 1][
                                        'EventTriggerList'
                                    ] &&
                                    deviceCapability['zhatu']['gsensorTurn'][
                                        index
                                    ]['turnList'][chooseType - 1][
                                        'EventTriggerList'
                                    ].length &&
                                    deviceCapability['zhatu']['gsensorTurn'][
                                        index
                                    ]['turnList'][chooseType - 1][
                                        'EventTriggerList'
                                    ][0]['volume']
                                "
                            >
                                <el-form-item
                                    label="报警音量"
                                    :rules="{
                                        validator: checkNumber.bind({
                                            type: 'int',
                                            min: deviceCapability['zhatu'][
                                                'gsensorTurn'
                                            ][index]['turnList'][
                                                chooseType - 1
                                            ]['EventTriggerList'][0]['volume'][
                                                'min'
                                            ],
                                            max: deviceCapability['zhatu'][
                                                'gsensorTurn'
                                            ][index]['turnList'][
                                                chooseType - 1
                                            ]['EventTriggerList'][0]['volume'][
                                                'max'
                                            ],
                                        }),
                                        trigger: 'blur',
                                    }"
                                    :prop="
                                        'param1315.' +
                                        index +
                                        '.turnList.' +
                                        [chooseType - 1] +
                                        '.EventTriggerList.0.volume'
                                    "
                                >
                                    <el-slider
                                        v-model="
                                            form['param1315'][index].turnList[
                                                chooseType - 1
                                            ]['EventTriggerList'][0]['volume']
                                        "
                                        :min="
                                            deviceCapability['zhatu'][
                                                'gsensorTurn'
                                            ][index]['turnList'][
                                                chooseType - 1
                                            ]['EventTriggerList'][0]['volume'][
                                                'min'
                                            ]
                                        "
                                        :max="
                                            deviceCapability['zhatu'][
                                                'gsensorTurn'
                                            ][index]['turnList'][
                                                chooseType - 1
                                            ]['EventTriggerList'][0]['volume'][
                                                'max'
                                            ]
                                        "
                                        :step="1"
                                        show-input
                                    >
                                    </el-slider>
                                </el-form-item>
                            </el-col>
                            <el-col
                                v-if="
                                    deviceCapability['zhatu']['gsensorTurn'][
                                        index
                                    ]['turnList'][chooseType - 1]['sensitivity']
                                "
                            >
                                <el-form-item
                                    label="车辆目标灵敏度"
                                    :rules="{
                                        validator: checkNumber.bind({
                                            type: 'int',
                                            min: deviceCapability['zhatu'][
                                                'gsensorTurn'
                                            ][index]['turnList'][
                                                chooseType - 1
                                            ]['sensitivity']['min'],
                                            max: deviceCapability['zhatu'][
                                                'gsensorTurn'
                                            ][index]['turnList'][
                                                chooseType - 1
                                            ]['sensitivity']['max'],
                                        }),
                                        trigger: 'blur',
                                    }"
                                    :prop="
                                        'param1315.' +
                                        index +
                                        '.turnList.' +
                                        [chooseType - 1] +
                                        '.sensitivity'
                                    "
                                >
                                    <el-input
                                        tips-placement="top-end"
                                        :tips="`键入值范围为${
                                            deviceCapability['zhatu'][
                                                'gsensorTurn'
                                            ][index]['turnList'][
                                                chooseType - 1
                                            ]['sensitivity']['min']
                                        }~${
                                            deviceCapability['zhatu'][
                                                'gsensorTurn'
                                            ][index]['turnList'][
                                                chooseType - 1
                                            ]['sensitivity']['max']
                                        }`"
                                        v-model.number="
                                            form['param1315'][index].turnList[
                                                chooseType - 1
                                            ]['sensitivity']
                                        "
                                    ></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col
                                v-if="
                                    deviceCapability['zhatu']['gsensorTurn'][
                                        index
                                    ]['turnList'][chooseType - 1][
                                        'intervalTime'
                                    ]
                                "
                            >
                                <el-form-item
                                    label="报警间隔时间"
                                    :rules="{
                                        validator: checkNumber.bind({
                                            type: 'int',
                                            min: deviceCapability['zhatu'][
                                                'gsensorTurn'
                                            ][index]['turnList'][
                                                chooseType - 1
                                            ]['intervalTime']['min'],
                                            max: deviceCapability['zhatu'][
                                                'gsensorTurn'
                                            ][index]['turnList'][
                                                chooseType - 1
                                            ]['intervalTime']['max'],
                                        }),
                                        trigger: 'blur',
                                    }"
                                    :prop="
                                        'param1315.' +
                                        index +
                                        '.turnList.' +
                                        [chooseType - 1] +
                                        '.intervalTime'
                                    "
                                >
                                    <el-input
                                        tips-placement="top-end"
                                        :tips="`键入值范围为${
                                            deviceCapability['zhatu'][
                                                'gsensorTurn'
                                            ][index]['turnList'][
                                                chooseType - 1
                                            ]['intervalTime']['min']
                                        }~${
                                            deviceCapability['zhatu'][
                                                'gsensorTurn'
                                            ][index]['turnList'][
                                                chooseType - 1
                                            ]['intervalTime']['max']
                                        }`"
                                        v-model.number="
                                            form['param1315'][index].turnList[
                                                chooseType - 1
                                            ]['intervalTime']
                                        "
                                        ><span slot="suffix">s</span></el-input
                                    >
                                </el-form-item>
                            </el-col>
                            <el-col>
                                <el-form-item label="图片上报使能">
                                    <el-switch
                                        v-model="
                                            form['param1315'][index].turnList[
                                                chooseType - 1
                                            ]['uploadPicEnabled']
                                        "
                                        :active-value="Number(1)"
                                        :inactive-value="Number(0)"
                                    ></el-switch>
                                </el-form-item>
                            </el-col>
                            <el-col
                                v-if="
                                    deviceCapability['zhatu']['gsensorTurn'][
                                        index
                                    ]['turnList'][chooseType - 1]['pictureNum']
                                "
                            >
                                <el-form-item
                                    label="抓图张数"
                                    :rules="{
                                        validator: checkNumber.bind({
                                            type: 'int',
                                            min: deviceCapability['zhatu'][
                                                'gsensorTurn'
                                            ][index]['turnList'][
                                                chooseType - 1
                                            ]['pictureNum']['min'],
                                            max: deviceCapability['zhatu'][
                                                'gsensorTurn'
                                            ][index]['turnList'][
                                                chooseType - 1
                                            ]['pictureNum']['max'],
                                        }),
                                        trigger: 'blur',
                                    }"
                                    :prop="
                                        'param1315.' +
                                        index +
                                        '.turnList.' +
                                        [chooseType - 1] +
                                        '.pictureNum'
                                    "
                                >
                                    <el-input
                                        tips-placement="top-end"
                                        :tips="`键入值范围为${
                                            deviceCapability['zhatu'][
                                                'gsensorTurn'
                                            ][index]['turnList'][
                                                chooseType - 1
                                            ]['pictureNum']['min']
                                        }~${
                                            deviceCapability['zhatu'][
                                                'gsensorTurn'
                                            ][index]['turnList'][
                                                chooseType - 1
                                            ]['pictureNum']['max']
                                        }`"
                                        v-model.number="
                                            form['param1315'][index].turnList[
                                                chooseType - 1
                                            ]['pictureNum']
                                        "
                                        ><span slot="suffix">张</span></el-input
                                    >
                                </el-form-item>
                            </el-col>
                            <el-col
                                v-if="
                                    deviceCapability['zhatu']['gsensorTurn'][
                                        index
                                    ]['turnList'][chooseType - 1][
                                        'snapintervalTime'
                                    ]
                                "
                            >
                                <el-form-item
                                    label="抓图间隔时间"
                                    :rules="{
                                        validator: checkNumber.bind({
                                            type: 'int',
                                            min: deviceCapability['zhatu'][
                                                'gsensorTurn'
                                            ][index]['turnList'][
                                                chooseType - 1
                                            ]['snapintervalTime']['min'],
                                            max: deviceCapability['zhatu'][
                                                'gsensorTurn'
                                            ][index]['turnList'][
                                                chooseType - 1
                                            ]['snapintervalTime']['max'],
                                        }),
                                        trigger: 'blur',
                                    }"
                                    :prop="
                                        'param1315.' +
                                        index +
                                        '.turnList.' +
                                        [chooseType - 1] +
                                        '.snapintervalTime'
                                    "
                                >
                                    <el-input
                                        tips-placement="top-end"
                                        :tips="`键入值范围为${
                                            deviceCapability['zhatu'][
                                                'gsensorTurn'
                                            ][index]['turnList'][
                                                chooseType - 1
                                            ]['snapintervalTime']['min']
                                        }~${
                                            deviceCapability['zhatu'][
                                                'gsensorTurn'
                                            ][index]['turnList'][
                                                chooseType - 1
                                            ]['snapintervalTime']['max']
                                        }`"
                                        v-model.number="
                                            form['param1315'][index].turnList[
                                                chooseType - 1
                                            ]['snapintervalTime']
                                        "
                                        ><span slot="suffix">s</span></el-input
                                    >
                                </el-form-item>
                            </el-col>
                            <el-col>
                                <el-form-item label="视频上报使能">
                                    <el-switch
                                        v-model="
                                            form['param1315'][index].turnList[
                                                chooseType - 1
                                            ]['uploadVideoEnabled']
                                        "
                                        :active-value="Number(1)"
                                        :inactive-value="Number(0)"
                                    ></el-switch>
                                </el-form-item>
                            </el-col>
                            <el-col
                                v-if="
                                    deviceCapability['zhatu']['gsensorTurn'][
                                        index
                                    ]['turnList'][chooseType - 1][
                                        'videoPreRecordTime'
                                    ]
                                "
                            >
                                <el-form-item
                                    label="小视频预录时间"
                                    :rules="{
                                        validator: checkNumber.bind({
                                            type: 'int',
                                            min: deviceCapability['zhatu'][
                                                'gsensorTurn'
                                            ][index]['turnList'][
                                                chooseType - 1
                                            ]['videoPreRecordTime']['min'],
                                            max: deviceCapability['zhatu'][
                                                'gsensorTurn'
                                            ][index]['turnList'][
                                                chooseType - 1
                                            ]['videoPreRecordTime']['max'],
                                        }),
                                        trigger: 'blur',
                                    }"
                                    :prop="
                                        'param1315.' +
                                        index +
                                        '.turnList.' +
                                        [chooseType - 1] +
                                        '.videoPreRecordTime'
                                    "
                                >
                                    <el-input
                                        tips-placement="top-end"
                                        :tips="`键入值范围为${
                                            deviceCapability['zhatu'][
                                                'gsensorTurn'
                                            ][index]['turnList'][
                                                chooseType - 1
                                            ]['videoPreRecordTime']['min']
                                        }~${
                                            deviceCapability['zhatu'][
                                                'gsensorTurn'
                                            ][index]['turnList'][
                                                chooseType - 1
                                            ]['videoPreRecordTime']['max']
                                        }`"
                                        v-model.number="
                                            form['param1315'][index].turnList[
                                                chooseType - 1
                                            ]['videoPreRecordTime']
                                        "
                                        ><span slot="suffix">s</span></el-input
                                    >
                                </el-form-item>
                            </el-col>
                            <el-col
                                v-if="
                                    deviceCapability['zhatu']['gsensorTurn'][
                                        index
                                    ]['turnList'][chooseType - 1][
                                        'videoDelayRecordTime'
                                    ]
                                "
                            >
                                <el-form-item
                                    label="小视频延录时间"
                                    :rules="{
                                        validator: checkNumber.bind({
                                            type: 'int',
                                            min: deviceCapability['zhatu'][
                                                'gsensorTurn'
                                            ][index]['turnList'][
                                                chooseType - 1
                                            ]['videoDelayRecordTime']['min'],
                                            max: deviceCapability['zhatu'][
                                                'gsensorTurn'
                                            ][index]['turnList'][
                                                chooseType - 1
                                            ]['videoDelayRecordTime']['max'],
                                        }),
                                        trigger: 'blur',
                                    }"
                                    :prop="
                                        'param1315.' +
                                        index +
                                        '.turnList.' +
                                        [chooseType - 1] +
                                        '.videoDelayRecordTime'
                                    "
                                >
                                    <el-input
                                        tips-placement="top-end"
                                        :tips="`键入值范围为${
                                            deviceCapability['zhatu'][
                                                'gsensorTurn'
                                            ][index]['turnList'][
                                                chooseType - 1
                                            ]['videoDelayRecordTime']['min']
                                        }~${
                                            deviceCapability['zhatu'][
                                                'gsensorTurn'
                                            ][index]['turnList'][
                                                chooseType - 1
                                            ]['videoDelayRecordTime']['max']
                                        }`"
                                        v-model.number="
                                            form['param1315'][index].turnList[
                                                chooseType - 1
                                            ]['videoDelayRecordTime']
                                        "
                                        ><span slot="suffix">s</span></el-input
                                    >
                                </el-form-item>
                            </el-col>
                            <el-col
                                v-if="
                                    deviceCapability['zhatu']['gsensorTurn'][
                                        index
                                    ]['turnList'][chooseType - 1]['angle']
                                "
                            >
                                <el-form-item
                                    label="转向角度"
                                    :rules="{
                                        validator: checkNumber.bind({
                                            type: 'int',
                                            min: deviceCapability['zhatu'][
                                                'gsensorTurn'
                                            ][index]['turnList'][
                                                chooseType - 1
                                            ]['angle']['min'],
                                            max: deviceCapability['zhatu'][
                                                'gsensorTurn'
                                            ][index]['turnList'][
                                                chooseType - 1
                                            ]['angle']['max'],
                                        }),
                                        trigger: 'blur',
                                    }"
                                    :prop="
                                        'param1315.' +
                                        index +
                                        '.turnList.' +
                                        [chooseType - 1] +
                                        '.angle'
                                    "
                                >
                                    <el-input
                                        tips-placement="top-end"
                                        :tips="`键入值范围为${
                                            deviceCapability['zhatu'][
                                                'gsensorTurn'
                                            ][index]['turnList'][
                                                chooseType - 1
                                            ]['angle']['min']
                                        }~${
                                            deviceCapability['zhatu'][
                                                'gsensorTurn'
                                            ][index]['turnList'][
                                                chooseType - 1
                                            ]['angle']['max']
                                        }`"
                                        v-model.number="
                                            form['param1315'][index].turnList[
                                                chooseType - 1
                                            ]['angle']
                                        "
                                        ><span slot="suffix">°</span></el-input
                                    >
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </template>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import { validateNum } from "@/utils/validate";
export default {
    props: {
        allCapability: {
            type: Object,
            default: () => ({}),
        },
        formDetail: {
            type: Object,
            default: () => ({}),
        },
        originalForm: {
            type: Object,
            default: () => ({}),
        },
        setStatisticsData: {
            type: Object,
            default: () => ({}),
        },
        allEnumerationData: {
            type: Object,
            default: () => ({}),
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
                    this.getPrivateProcotol();
                    this.dictionaryData["gsensorTurnList"].forEach((item) => {
                        this.getPrivateProcotol2(item.gsensorTurnType);
                    });

                    // this.getPrivateProcotol2();
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
        "form.param1313": {
            handler(val) {
                if (val && !this.isTemplate) {
                    this.formData["param1313.enable"] =
                        val.enable !== this.copyForm.param1313.enable
                            ? `param1313.enable&渣土车配置/路口报警/路口报警使能/算法使能&${
                                  val.enable ? "开启" : "关闭"
                              }&${this.copyForm.param1313.enable}`
                            : "";
                    this.$emit("formDataChange", this.formData);
                }
            },
            deep: true,
            immediate: true,
        },
        "form.param1315": {
            handler(val) {
                if (val && !this.isTemplate) {
                    val.forEach((item) => {
                        if (!item.gsensorTurnType) {
                            return;
                        }
                        let name = JSON.parse(
                            JSON.stringify(
                                this.dictionaryData["gsensorTurnList"]
                            )
                        ).find(
                            (e) => e.gsensorTurnType === item.gsensorTurnType
                        ).label;
                        item.turnList.forEach((k, index) => {
                            this.formData[
                                "param1315." +
                                    item.gsensorTurnIndex +
                                    ".turnList." +
                                    index +
                                    ".enabled"
                            ] =
                                k["enabled"] !==
                                this.copyForm.param1315[item.gsensorTurnIndex][
                                    "turnList"
                                ][index]["enabled"]
                                    ? `param1315.${
                                          item.gsensorTurnIndex
                                      }.turnList.${index}.enabled&渣土车设置/路口报警/${
                                          index ? `二级报警` : `一级报警`
                                      }/${name}/${name}报警使能&${
                                          k["enabled"] ? "开启" : "关闭"
                                      }&${
                                          this.copyForm.param1315[
                                              item.gsensorTurnIndex
                                          ]["turnList"][index]["enabled"]
                                      }`
                                    : "";
                            this.formData[
                                "param1315." +
                                    item.gsensorTurnIndex +
                                    ".turnList." +
                                    index +
                                    ".limitSpeed"
                            ] =
                                k["limitSpeed"] !==
                                this.copyForm.param1315[item.gsensorTurnIndex][
                                    "turnList"
                                ][index]["limitSpeed"]
                                    ? `param1315.${
                                          item.gsensorTurnIndex
                                      }.turnList.${index}.limitSpeed&渣土车设置/路口报警/${
                                          index ? `二级报警` : `一级报警`
                                      }/${name}/车速限制速度&${
                                          k["limitSpeed"]
                                      }&${
                                          this.copyForm.param1315[
                                              item.gsensorTurnIndex
                                          ]["turnList"][index]["limitSpeed"]
                                      }`
                                    : "";
                            this.formData[
                                "param1315." +
                                    item.gsensorTurnIndex +
                                    ".turnList." +
                                    index +
                                    ".EventTriggerList.0.volume"
                            ] =
                                k['EventTriggerList'][0]['volume']!==
                                this.copyForm.param1315[item.gsensorTurnIndex][
                                    "turnList"
                                ][index]["EventTriggerList"][0]["volume"]
                                    ? `param1315.${
                                          item.gsensorTurnIndex
                                      }.turnList.${index}.EventTriggerList.0.volume&渣土车设置/路口报警/${
                                          index ? `二级报警` : `一级报警`
                                      }/${name}/报警音量&${k['EventTriggerList'][0]['volume']}&${
                                          this.copyForm.param1315[
                                              item.gsensorTurnIndex
                                          ]["turnList"][index][
                                              "EventTriggerList"
                                          ][0]["volume"]
                                      }`
                                    : "";
                            this.formData[
                                "param1315." +
                                    item.gsensorTurnIndex +
                                    ".turnList." +
                                    index +
                                    ".sensitivity"
                            ] =
                                k["sensitivity"] !==
                                this.copyForm.param1315[item.gsensorTurnIndex][
                                    "turnList"
                                ][index]["sensitivity"]
                                    ? `param1315.${
                                          item.gsensorTurnIndex
                                      }.turnList.${index}.sensitivity&渣土车设置/路口报警/${
                                          index ? `二级报警` : `一级报警`
                                      }/${name}/车辆目标灵敏度&${
                                          k["sensitivity"]
                                      }&${
                                          this.copyForm.param1315[
                                              item.gsensorTurnIndex
                                          ]["turnList"][index]["sensitivity"]
                                      }`
                                    : "";
                            this.formData[
                                "param1315." +
                                    item.gsensorTurnIndex +
                                    ".turnList." +
                                    index +
                                    ".intervalTime"
                            ] =
                                k["intervalTime"] !==
                                this.copyForm.param1315[item.gsensorTurnIndex][
                                    "turnList"
                                ][index]["intervalTime"]
                                    ? `param1315.${
                                          item.gsensorTurnIndex
                                      }.turnList.${index}.intervalTime&渣土车设置/路口报警/${
                                          index ? `二级报警` : `一级报警`
                                      }/${name}/报警间隔时间&${
                                          k["intervalTime"]
                                      }&${
                                          this.copyForm.param1315[
                                              item.gsensorTurnIndex
                                          ]["turnList"][index]["intervalTime"]
                                      }`
                                    : "";
                            this.formData[
                                "param1315." +
                                    item.gsensorTurnIndex +
                                    ".turnList." +
                                    index +
                                    ".uploadPicEnabled"
                            ] =
                                k["uploadPicEnabled"] !==
                                this.copyForm.param1315[item.gsensorTurnIndex][
                                    "turnList"
                                ][index]["uploadPicEnabled"]
                                    ? `param1315.${
                                          item.gsensorTurnIndex
                                      }.turnList.${index}.uploadPicEnabled&渣土车设置/路口报警/${
                                          index ? `二级报警` : `一级报警`
                                      }/${name}/图片上报使能&${
                                          k["uploadPicEnabled"]
                                              ? "开启"
                                              : "关闭"
                                      }&${
                                          this.copyForm.param1315[
                                              item.gsensorTurnIndex
                                          ]["turnList"][index][
                                              "uploadPicEnabled"
                                          ]
                                      }`
                                    : "";
                            this.formData[
                                "param1315." +
                                    item.gsensorTurnIndex +
                                    ".turnList." +
                                    index +
                                    ".pictureNum"
                            ] =
                                k["pictureNum"] !==
                                this.copyForm.param1315[item.gsensorTurnIndex][
                                    "turnList"
                                ][index]["pictureNum"]
                                    ? `param1315.${
                                          item.gsensorTurnIndex
                                      }.turnList.${index}.pictureNum&渣土车设置/路口报警/${
                                          index ? `二级报警` : `一级报警`
                                      }/${name}/抓图张数&${k["pictureNum"]}&${
                                          this.copyForm.param1315[
                                              item.gsensorTurnIndex
                                          ]["turnList"][index]["pictureNum"]
                                      }`
                                    : "";
                            this.formData[
                                "param1315." +
                                    item.gsensorTurnIndex +
                                    ".turnList." +
                                    index +
                                    ".snapintervalTime"
                            ] =
                                k["snapintervalTime"] !==
                                this.copyForm.param1315[item.gsensorTurnIndex][
                                    "turnList"
                                ][index]["snapintervalTime"]
                                    ? `param1315.${
                                          item.gsensorTurnIndex
                                      }.turnList.${index}.snapintervalTime&渣土车设置/路口报警/${
                                          index ? `二级报警` : `一级报警`
                                      }/${name}/抓图间隔时间&${
                                          k["snapintervalTime"]
                                      }&${
                                          this.copyForm.param1315[
                                              item.gsensorTurnIndex
                                          ]["turnList"][index][
                                              "snapintervalTime"
                                          ]
                                      }`
                                    : "";
                            this.formData[
                                "param1315." +
                                    item.gsensorTurnIndex +
                                    ".turnList." +
                                    index +
                                    ".uploadVideoEnabled"
                            ] =
                                k["uploadVideoEnabled"] !==
                                this.copyForm.param1315[item.gsensorTurnIndex][
                                    "turnList"
                                ][index]["uploadVideoEnabled"]
                                    ? `param1315.${
                                          item.gsensorTurnIndex
                                      }.turnList.${index}.uploadVideoEnabled&渣土车设置/路口报警/${
                                          index ? `二级报警` : `一级报警`
                                      }/${name}/视频上报使能&${
                                          k["uploadVideoEnabled"]
                                              ? "开启"
                                              : "关闭"
                                      }&${
                                          this.copyForm.param1315[
                                              item.gsensorTurnIndex
                                          ]["turnList"][index][
                                              "uploadVideoEnabled"
                                          ]
                                      }`
                                    : "";
                            this.formData[
                                "param1315." +
                                    item.gsensorTurnIndex +
                                    ".turnList." +
                                    index +
                                    ".videoPreRecordTime"
                            ] =
                                k["videoPreRecordTime"] !==
                                this.copyForm.param1315[item.gsensorTurnIndex][
                                    "turnList"
                                ][index]["videoPreRecordTime"]
                                    ? `param1315.${
                                          item.gsensorTurnIndex
                                      }.turnList.${index}.videoPreRecordTime&渣土车设置/路口报警/${
                                          index ? `二级报警` : `一级报警`
                                      }/${name}/小视频预录时间&${
                                          k["videoPreRecordTime"]
                                      }&${
                                          this.copyForm.param1315[
                                              item.gsensorTurnIndex
                                          ]["turnList"][index][
                                              "videoPreRecordTime"
                                          ]
                                      }`
                                    : "";
                            this.formData[
                                "param1315." +
                                    item.gsensorTurnIndex +
                                    ".turnList." +
                                    index +
                                    ".videoDelayRecordTime"
                            ] =
                                k["videoDelayRecordTime"] !==
                                this.copyForm.param1315[item.gsensorTurnIndex][
                                    "turnList"
                                ][index]["videoDelayRecordTime"]
                                    ? `param1315.${
                                          item.gsensorTurnIndex
                                      }.turnList.${index}.videoDelayRecordTime&渣土车设置/路口报警/${
                                          index ? `二级报警` : `一级报警`
                                      }/${name}/小视频延录时间&${
                                          k["videoDelayRecordTime"]
                                      }&${
                                          this.copyForm.param1315[
                                              item.gsensorTurnIndex
                                          ]["turnList"][index][
                                              "videoDelayRecordTime"
                                          ]
                                      }`
                                    : "";
                            this.formData[
                                "param1315." +
                                    item.gsensorTurnIndex +
                                    ".turnList." +
                                    index +
                                    ".angle"
                            ] =
                                k["angle"] !==
                                this.copyForm.param1315[item.gsensorTurnIndex][
                                    "turnList"
                                ][index]["angle"]
                                    ? `param1315.${
                                          item.gsensorTurnIndex
                                      }.turnList.${index}.angle&渣土车设置/路口报警/${
                                          index ? `二级报警` : `一级报警`
                                      }/${name}/转向角度&${k["angle"]}&${
                                          this.copyForm.param1315[
                                              item.gsensorTurnIndex
                                          ]["turnList"][index]["angle"]
                                      }`
                                    : "";
                        });
                    });
                    this.$emit("formDataChange", this.formData);
                }
            },
            deep: true,
            immediate: true,
        },
    },
    data() {
        return {
            aa: 1,
            activeName: "first",
            chooseType: 1,
            tabBol: false,
            deviceId: this.$route.query.deviceId || "",
            deviceCapability: {},
            form: {},
            copyForm: {},
            formData: {},
            dictionaryData: {},
            childConfigParams: false,
            checkNumber(rule, value, callback) {
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
            checkString(rule, value, callback) {
                if (value !== "" && value !== null && value !== undefined) {
                    if (value.length < this.min) {
                        callback(new Error(`最小长度为${this.min}`));
                    } else if (value.length > this.max) {
                        callback(new Error(`最大长度为${this.max}`));
                    } else {
                        callback();
                    }
                } else {
                    // callback(new Error("请输入"));
                    callback();
                }
            },
            gsensorForm: [{}, {}, {}, {}, {}],
        };
    },
    created() {
        // this.getByIsApi(1)
        this.$emit("setMenuActiveRefFormName", "PrivateGsensorForm");
        this.dictionaryData["gsensorTurnList"].forEach((item, index) => {
            this.gsensorForm[index] = {};
        });
    },
    mounted() {
        this.activeName = this.deviceCapability["zhatu"].gsensor
            ? "first"
            : this.deviceCapability["zhatu"].gsensorTurn[0].gsensorTurnType +
              "tab";
    },
    methods: {
        changeAlarmLevel(index) {
            this.chooseType = index + 1;
        },
        beforeLeave() {
            this.chooseType = 1;
        },
        getPrivateProcotol() {
            const param1313 = {
                deviceId: this.deviceId,
                param: "",
                msgId: 1313,
            };
            if (!this.form.param1313) {
                if (this.isTemplate) return;
                this.$api.getEHomeConfig(param1313).then((res) => {
                    // if (res && res.data) {
                    //     const formData = {
                    //         enable: 1,
                    //     };
                    //     this.$set(this.form, "param1313", formData);
                    //     this.$set(
                    //         this.copyForm,
                    //         "param1313",
                    //         JSON.parse(JSON.stringify(formData))
                    //     );
                    //     this.childConfigParams = false;
                    // } else {
                    //     this.$message.error("协议获取失败");
                    //     this.childConfigParams = false;
                    // }
                    if (res && res.data && res.data.param) {
                        const formData = JSON.parse(res.data.param);
                        this.$set(this.form, "param1313", formData);
                        this.$set(
                            this.copyForm,
                            "param1313",
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
        tabClick(val) {
            this.$emit(
                "setMenuActiveRefFormName",
                "PrivateGsensorTurnForm" + val.name
            );
        },
        getPrivateProcotol2(gsensorTurnType) {
            const param1315 = {
                deviceId: this.deviceId,
                param: JSON.stringify({
                    gsensorTurnType: gsensorTurnType,
                }),
                msgId: 1315,
            };
            if (!this.form.param1315) {
                if (this.isTemplate) return;
                this.$api.getEHomeConfig(param1315).then((res) => {
                    // if (res && res.data) {
                    //     const formData = [
                    //         {
                    //             gsensorTurnType: 3,
                    //             turnList: [
                    //                 {
                    //                     uploadVideoEnabled: 1,
                    //                     videoPreRecordTime: 10,
                    //                     videoDelayRecordTime: 0,
                    //                     uploadPicEnabled: 0,
                    //                     angle: 0,
                    //                     ruleID: 1,
                    //                     enabled: 0,
                    //                     pictureNum: 1,
                    //                     limitSpeed: 10,
                    //                     intervalTime: 100,
                    //                     snapIntervalTime: 1,
                    //                 },
                    //             ],
                    //         },
                    //         {
                    //             gsensorTurnType: 4,
                    //             turnList: [
                    //                 {
                    //                     uploadVideoEnabled: 1,
                    //                     videoPreRecordTime: 10,
                    //                     videoDelayRecordTime: 0,
                    //                     uploadPicEnabled: 0,
                    //                     angle: 0,
                    //                     ruleID: 1,
                    //                     enabled: 0,
                    //                     pictureNum: 1,
                    //                     limitSpeed: 10,
                    //                     intervalTime: 100,
                    //                     snapIntervalTime: 1,
                    //                 },
                    //             ],
                    //         },
                    //         {
                    //             gsensorTurnType: 5,
                    //             turnList: [
                    //                 {
                    //                     uploadVideoEnabled: 1,
                    //                     videoPreRecordTime: 10,
                    //                     videoDelayRecordTime: 0,
                    //                     uploadPicEnabled: 0,
                    //                     angle: 0,
                    //                     ruleID: 1,
                    //                     enabled: 0,
                    //                     pictureNum: 1,
                    //                     limitSpeed: 10,
                    //                     intervalTime: 100,
                    //                     snapIntervalTime: 1,
                    //                 },
                    //             ],
                    //         },
                    //         {
                    //             gsensorTurnType: 6,
                    //             turnList: [
                    //                 {
                    //                     uploadVideoEnabled: 1,
                    //                     videoPreRecordTime: 10,
                    //                     videoDelayRecordTime: 0,
                    //                     uploadPicEnabled: 0,
                    //                     angle: 0,
                    //                     ruleID: 1,
                    //                     enabled: 0,
                    //                     pictureNum: 1,
                    //                     limitSpeed: 10,
                    //                     intervalTime: 100,
                    //                     snapIntervalTime: 1,
                    //                 },
                    //             ],
                    //         },
                    //         {
                    //             gsensorTurnType: 7,
                    //             turnList: [
                    //                 {
                    //                     uploadVideoEnabled: 1,
                    //                     videoPreRecordTime: 10,
                    //                     videoDelayRecordTime: 0,
                    //                     uploadPicEnabled: 0,
                    //                     angle: 0,
                    //                     ruleID: 1,
                    //                     enabled: 0,
                    //                     pictureNum: 1,
                    //                     limitSpeed: 10,
                    //                     intervalTime: 100,
                    //                     snapIntervalTime: 1,
                    //                 },
                    //             ],
                    //         },
                    //     ];
                    //     formData.forEach((i, index) => {
                    //         i.gsensorTurnIndex = index;
                    //     });
                    //     this.$set(this.form, "param1315", formData);
                    //     this.$set(
                    //         this.copyForm,
                    //         "param1315",
                    //         JSON.parse(JSON.stringify(formData))
                    //     );

                    //     this.childConfigParams = false;
                    // } else {
                    //     this.$message.error("协议获取失败");
                    //     this.childConfigParams = false;
                    // }
                    if (res && res.data && res.data.param) {
                        const formData = JSON.parse(res.data.param);
                        this.dictionaryData["gsensorTurnList"].forEach(
                            (item, index) => {
                                if (
                                    item.gsensorTurnType ===
                                    formData.gsensorTurnType
                                ) {
                                    this.gsensorForm[index] = {
                                        ...{ gsensorTurnIndex: index },
                                        ...formData,
                                    };
                                    this.gsensorForm[index].turnList.forEach(
                                        (k) => {
                                            if (!k.volume) {
                                                k.volume = 0;
                                            }
                                        }
                                    );
                                }
                            }
                        );
                        if (
                            this.gsensorForm[0].gsensorTurnType &&
                            this.gsensorForm[1].gsensorTurnType &&
                            this.gsensorForm[2].gsensorTurnType &&
                            this.gsensorForm[3].gsensorTurnType &&
                            this.gsensorForm[4].gsensorTurnType
                        ) {
                            this.$set(
                                this.form,
                                "param1315",
                                JSON.parse(JSON.stringify(this.gsensorForm))
                            );
                            this.$set(
                                this.copyForm,
                                "param1315",
                                JSON.parse(JSON.stringify(this.gsensorForm))
                            );
                            this.childConfigParams = false;
                        }
                    } else {
                        this.$message.error("协议获取失败");
                        this.childConfigParams = false;
                    }
                });
            } else {
                this.childConfigParams = false;
            }
        },
    },
};
</script>

<style lang="less" scoped>
.el-col {
    width: 32%;
    margin-right: 1.3%;
}
</style>
