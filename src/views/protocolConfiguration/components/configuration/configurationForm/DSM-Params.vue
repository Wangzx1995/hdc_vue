<template>
    <div class="configuration-form">
        <el-form
            :label-width="`${labelWidth}px`"
            :model="newForm"
            :inline="true"
            ref="form"
        >
            <el-radio-group type="simple" v-model="chanNoActive">
                <el-radio-button
                    v-for="(item, index) in DSMList"
                    :key="index"
                    :label="`通道${item.chanNo}`"
                />
            </el-radio-group>
            <div>
                <div v-for="(chanNoItem, index) in DSMList" :key="index">
                    <div v-show="`通道${chanNoItem.chanNo}` === chanNoActive">
                        <div
                            v-if="
                                newForm[`param6004_0_0`] &&
                                newForm[`param6004_0_1`] &&
                                newForm[`param6004_0_2`] &&
                                $store.state.user.technicalSupportEngineerSign
                            "
                        >
                            <h3>DSM灵敏度配置</h3>
                            <el-form-item
                                label="DSM灵敏度配置"
                                v-if="chanNoItem.customizeAlgorithm"
                            >
                                <el-button
                                    @click="openAlgorithm()"
                                    style="width: 100%"
                                    >DSM灵敏度配置</el-button
                                >
                            </el-form-item>
                        </div>
                        <div
                            v-if="
                                newForm[
                                    `param905_${chanNoItem.chanNo}_${firstType}`
                                ] &&
                                chanNoItem.installPosition &&
                                chanNoItem.installPosition.length &&
                                $store.state.user.technicalSupportEngineerSign
                            "
                        >
                            <h3>DSM白盒算法配置</h3>
                            <el-form-item
                                label="架设方式"
                                v-if="
                                    newForm[
                                        `param905_${chanNoItem.chanNo}_${firstType}`
                                    ] &&
                                    chanNoItem.installPosition &&
                                    chanNoItem.installPosition.length
                                "
                            >
                                <el-select
                                    v-model="
                                        newForm[
                                            `param905_${chanNoItem.chanNo}_${firstType}`
                                        ].installPosition
                                    "
                                >
                                    <el-option
                                        v-for="item in chanNoItem.installPositionList"
                                        :label="item.label"
                                        :value="item.value"
                                        :key="item.value"
                                    ></el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                        <div
                            v-if="
                                newForm[
                                    `param905_${chanNoItem.chanNo}_${firstType}`
                                ]
                            "
                        >
                            <h3>DSM全局参数</h3>
                            <el-form-item
                                label="DSM算法使能"
                                v-if="
                                    newForm[
                                        `param905_${chanNoItem.chanNo}_${firstType}`
                                    ].hasOwnProperty('enable')
                                "
                            >
                                <h-switch
                                    v-model="
                                        newForm[
                                            `param905_${chanNoItem.chanNo}_${firstType}`
                                        ].enable
                                    "
                                    :active-value="Number(1)"
                                    :inactive-value="Number(0)"
                                    :before-change="
                                        (value, done) =>
                                            beforeChange(value, done)
                                    "
                                    @change="
                                        (val) => enableChange(val, chanNoItem)
                                    "
                                ></h-switch>
                            </el-form-item>
                            <el-form-item
                                label="DSM全局音量配置"
                                v-if="
                                    newForm[
                                        `param905_${chanNoItem.chanNo}_${firstType}`
                                    ].enable
                                "
                            >
                                <el-button
                                    @click="openDialog(chanNoItem)"
                                    style="width: 100%"
                                    >DSM全局音量配置</el-button
                                >
                            </el-form-item>
                            <el-form-item
                                label="联动抓拍的通道"
                                v-if="
                                    chanNoItem.linkChannel &&
                                    chanNoItem.linkChannel.length &&
                                    chanNoItem.maxLinkChannel
                                "
                            >
                                <el-select
                                    v-model="
                                        newForm[
                                            `param905_${chanNoItem.chanNo}_${firstType}`
                                        ].linkChannel
                                    "
                                    :multiple-limit="
                                        chanNoItem.maxLinkChannel || 0
                                    "
                                    multiple
                                    collapse-tags
                                >
                                    <el-option
                                        v-for="item in chanNoItem.linkChannel"
                                        :label="`通道${item}`"
                                        :value="item"
                                        :key="item"
                                    ></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item
                                label="相机位置"
                                v-if="
                                    chanNoItem.cameraPosition &&
                                    chanNoItem.cameraPosition.length
                                "
                            >
                                <el-select
                                    v-model="
                                        newForm[
                                            `param905_${chanNoItem.chanNo}_${firstType}`
                                        ].cameraPosition
                                    "
                                >
                                    <el-option
                                        v-for="item in chanNoItem.cameraPositionList"
                                        :label="item.label"
                                        :value="item.value"
                                        :key="item.value"
                                    ></el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                        <el-collapse
                            v-if="
                                newForm[
                                    `param905_${chanNoItem.chanNo}_${firstType}`
                                ] &&
                                newForm[
                                    `param905_${chanNoItem.chanNo}_${firstType}`
                                ].enable
                            "
                            v-model="activeCollapse"
                            @change="collapseChange"
                        >
                            <el-collapse-item
                                v-for="(infoItem, key) in chanNoItem.info"
                                :key="key"
                                :title="key.split('-')[1]"
                                :name="key.split('-')[1]"
                                arrowPlacement="right"
                                :class="{
                                    'template-hide': setTemplateHide(
                                        chanNoItem,
                                        infoItem
                                    ),
                                }"
                            >
                                <div
                                    v-for="(levelItem, index2) in infoItem"
                                    :key="index2"
                                >
                                    <template
                                        v-if="
                                            newForm[
                                                `param905_${chanNoItem.chanNo}_${levelItem.type}`
                                            ]
                                        "
                                    >
                                        <h3>
                                            {{
                                                index2 === 0
                                                    ? "一级报警"
                                                    : index2 === 1
                                                    ? "二级报警"
                                                    : "三级报警"
                                            }}
                                            <template
                                                v-if="
                                                    infoItem.length > 1 &&
                                                    levelItem.speed
                                                "
                                            >
                                                <i class="el-icon-warning"></i>
                                                <span class="warning-msg"
                                                    >二级报警的判断速度阈值必须比一级报警的判断速度阈值≥20</span
                                                >
                                            </template>
                                        </h3>
                                        <el-form-item
                                            label="报警使能"
                                            v-if="levelItem.enable"
                                        >
                                            <el-switch
                                                v-model="
                                                    newForm[
                                                        `param905_${chanNoItem.chanNo}_${levelItem.type}`
                                                    ].info[0].enable
                                                "
                                                :active-value="Number(1)"
                                                :inactive-value="Number(0)"
                                            ></el-switch>
                                        </el-form-item>
                                        <el-form-item
                                            label="报警判断速度阈值"
                                            v-if="levelItem.speed"
                                        >
                                            <el-input-number
                                                :precision="0"
                                                controls-position="right"
                                                v-model="
                                                    newForm[
                                                        `param905_${chanNoItem.chanNo}_${levelItem.type}`
                                                    ].info[0].speed
                                                "
                                                :min="levelItem.speed.min"
                                                :max="levelItem.speed.max"
                                                @change="
                                                    (e) =>
                                                        speedBlur(
                                                            chanNoItem,
                                                            key
                                                        )
                                                "
                                                data-unit="km/h"
                                                @blur="
                                                    (e) => {
                                                        if (
                                                            e.target.value ===
                                                            ''
                                                        ) {
                                                            newForm[
                                                                `param905_${chanNoItem.chanNo}_${levelItem.type}`
                                                            ].info[0].speed =
                                                                Number(
                                                                    e.target
                                                                        .ariaValueMin
                                                                );
                                                        }
                                                    }
                                                "
                                            ></el-input-number>
                                        </el-form-item>

                                        <el-form-item
                                            label="算法灵敏度"
                                            introduction="灵敏度越高越容易触发报警"
                                            v-if="
                                                levelItem.sensitivity ||
                                                levelItem.newSensitivity
                                            "
                                        >
                                            <span
                                                slot="label"
                                                class="label-slot"
                                                >算法灵敏度
                                                <el-tooltip
                                                    content="灵敏度越高越容易触发报警"
                                                >
                                                    <i
                                                        class="el-icon-question"
                                                    ></i> </el-tooltip
                                            ></span>
                                            <el-select
                                                v-if="
                                                    levelItem.newSensitivity &&
                                                    levelItem.newSensitivity
                                                        .length &&
                                                    levelItem.sensitivityList &&
                                                    levelItem.sensitivityList
                                                        .length
                                                "
                                                v-model="
                                                    newForm[
                                                        `param905_${chanNoItem.chanNo}_${levelItem.type}`
                                                    ].info[0].newSensitivity
                                                "
                                            >
                                                <el-option
                                                    v-for="item in levelItem.sensitivityList"
                                                    :label="item.label"
                                                    :value="item.value"
                                                    :key="item.value"
                                                ></el-option>
                                            </el-select>
                                            <el-select
                                                v-else-if="
                                                    !levelItem.newSensitivity &&
                                                    levelItem.sensitivityList &&
                                                    levelItem.sensitivityList
                                                        .length
                                                "
                                                v-model="
                                                    newForm[
                                                        `param905_${chanNoItem.chanNo}_${levelItem.type}`
                                                    ].info[0].sensitivity
                                                "
                                            >
                                                <el-option
                                                    v-for="item in levelItem.sensitivityList"
                                                    :label="item.label"
                                                    :value="item.value"
                                                    :key="item.value"
                                                ></el-option>
                                            </el-select>
                                            <el-input-number
                                                :precision="0"
                                                controls-position="right"
                                                v-else
                                                :disabled="true"
                                                v-model="
                                                    newForm[
                                                        `param905_${chanNoItem.chanNo}_${levelItem.type}`
                                                    ].info[0].sensitivity
                                                "
                                                :max="10"
                                                @blur="
                                                    (e) => {
                                                        if (
                                                            e.target.value ===
                                                            ''
                                                        ) {
                                                            newForm[
                                                                `param905_${chanNoItem.chanNo}_${levelItem.type}`
                                                            ].info[0].sensitivity =
                                                                Number(
                                                                    e.target
                                                                        .ariaValueMin
                                                                );
                                                        }
                                                    }
                                                "
                                            ></el-input-number>
                                        </el-form-item>
                                        <el-form-item
                                            label="音量使能"
                                            v-if="levelItem.volumeEnable"
                                        >
                                            <el-switch
                                                v-model="
                                                    newForm[
                                                        `param905_${chanNoItem.chanNo}_${levelItem.type}`
                                                    ].info[0].volumeEnable
                                                "
                                                :active-value="Number(1)"
                                                :inactive-value="Number(0)"
                                            ></el-switch>
                                        </el-form-item>
                                        <el-form-item
                                            label="报警音量"
                                            v-if="levelItem.volume"
                                        >
                                            <el-input-number
                                                :precision="0"
                                                controls-position="right"
                                                v-model="
                                                    newForm[
                                                        `param905_${chanNoItem.chanNo}_${levelItem.type}`
                                                    ].info[0].volume
                                                "
                                                :min="levelItem.volume.min"
                                                :max="levelItem.volume.max"
                                                @blur="
                                                    (e) => {
                                                        if (
                                                            e.target.value ===
                                                            ''
                                                        ) {
                                                            newForm[
                                                                `param905_${chanNoItem.chanNo}_${levelItem.type}`
                                                            ].info[0].volume =
                                                                Number(
                                                                    e.target
                                                                        .ariaValueMin
                                                                );
                                                        }
                                                    }
                                                "
                                            ></el-input-number>
                                        </el-form-item>
                                        <el-form-item
                                            label="抓图张数"
                                            v-if="
                                                levelItem.snapshot &&
                                                levelItem.snapshot.number
                                            "
                                        >
                                            <el-input-number
                                                :precision="0"
                                                controls-position="right"
                                                v-model="
                                                    newForm[
                                                        `param905_${chanNoItem.chanNo}_${levelItem.type}`
                                                    ].info[0].snapshot.number
                                                "
                                                :min="
                                                    levelItem.snapshot.number
                                                        .min
                                                "
                                                :max="
                                                    levelItem.snapshot.number
                                                        .max
                                                "
                                                data-unit="张"
                                                @blur="
                                                    (e) => {
                                                        if (
                                                            e.target.value ===
                                                            ''
                                                        ) {
                                                            newForm[
                                                                `param905_${chanNoItem.chanNo}_${levelItem.type}`
                                                            ].info[0].snapshot.number =
                                                                Number(
                                                                    e.target
                                                                        .ariaValueMin
                                                                );
                                                        }
                                                    }
                                                "
                                            ></el-input-number>
                                        </el-form-item>
                                        <el-form-item
                                            label="抓图间隔"
                                            v-if="
                                                levelItem.snapshot &&
                                                levelItem.snapshot.interval
                                            "
                                        >
                                            <el-select
                                                v-model="
                                                    newForm[
                                                        `param905_${chanNoItem.chanNo}_${levelItem.type}`
                                                    ].info[0].snapshot.interval
                                                "
                                            >
                                                <el-option
                                                    v-for="item in levelItem
                                                        .snapshot.interval"
                                                    :label="`${item * 100}毫秒`"
                                                    :value="item"
                                                    :key="item"
                                                ></el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item
                                            label="报警短视频前半部分时长"
                                            v-if="
                                                levelItem.clip &&
                                                levelItem.clip.perRecord
                                            "
                                        >
                                            <el-input-number
                                                :precision="0"
                                                controls-position="right"
                                                v-model="
                                                    newForm[
                                                        `param905_${chanNoItem.chanNo}_${levelItem.type}`
                                                    ].info[0].clip.perRecord
                                                "
                                                :min="
                                                    levelItem.clip.perRecord.min
                                                "
                                                :max="
                                                    levelItem.clip.perRecord.max
                                                "
                                                data-unit="s"
                                                @blur="
                                                    (e) => {
                                                        if (
                                                            e.target.value ===
                                                            ''
                                                        ) {
                                                            newForm[
                                                                `param905_${chanNoItem.chanNo}_${levelItem.type}`
                                                            ].info[0].clip.perRecord =
                                                                Number(
                                                                    e.target
                                                                        .ariaValueMin
                                                                );
                                                        }
                                                    }
                                                "
                                            ></el-input-number>
                                        </el-form-item>
                                        <el-form-item
                                            label="报警短视频后半部分时长"
                                            v-if="
                                                levelItem.clip &&
                                                levelItem.clip.afterRecord
                                            "
                                        >
                                            <el-input-number
                                                :precision="0"
                                                controls-position="right"
                                                v-model="
                                                    newForm[
                                                        `param905_${chanNoItem.chanNo}_${levelItem.type}`
                                                    ].info[0].clip.afterRecord
                                                "
                                                :min="
                                                    levelItem.clip.afterRecord
                                                        .min
                                                "
                                                :max="
                                                    levelItem.clip.afterRecord
                                                        .max
                                                "
                                                data-unit="s"
                                                @blur="
                                                    (e) => {
                                                        if (
                                                            e.target.value ===
                                                            ''
                                                        ) {
                                                            newForm[
                                                                `param905_${chanNoItem.chanNo}_${levelItem.type}`
                                                            ].info[0].clip.afterRecord =
                                                                Number(
                                                                    e.target
                                                                        .ariaValueMin
                                                                );
                                                        }
                                                    }
                                                "
                                            ></el-input-number>
                                        </el-form-item>
                                        <el-form-item
                                            label="报警图片上传使能"
                                            v-if="
                                                levelItem.snapshot &&
                                                levelItem.snapshot.upload
                                            "
                                        >
                                            <el-switch
                                                v-model="
                                                    newForm[
                                                        `param905_${chanNoItem.chanNo}_${levelItem.type}`
                                                    ].info[0].snapshot.upload
                                                "
                                                :active-value="Number(1)"
                                                :inactive-value="Number(0)"
                                                @change="
                                                    (val) =>
                                                        uploadChange(
                                                            val,
                                                            'snapshot',
                                                            chanNoItem.chanNo,
                                                            levelItem.type
                                                        )
                                                "
                                            ></el-switch>
                                        </el-form-item>
                                        <el-form-item
                                            label="报警视频上传使能"
                                            v-if="
                                                levelItem.clip &&
                                                levelItem.clip.upload
                                            "
                                        >
                                            <el-switch
                                                v-model="
                                                    newForm[
                                                        `param905_${chanNoItem.chanNo}_${levelItem.type}`
                                                    ].info[0].clip.upload
                                                "
                                                :active-value="Number(1)"
                                                :inactive-value="Number(0)"
                                                @change="
                                                    (val) =>
                                                        uploadChange(
                                                            val,
                                                            'clip',
                                                            chanNoItem.chanNo,
                                                            levelItem.type
                                                        )
                                                "
                                            ></el-switch>
                                        </el-form-item>
                                        <el-form-item
                                            label="报警抑制时间"
                                            v-if="levelItem.inhibitionTime"
                                        >
                                            <el-input-number
                                                :precision="0"
                                                controls-position="right"
                                                v-model="
                                                    newForm[
                                                        `param905_${chanNoItem.chanNo}_${levelItem.type}`
                                                    ].info[0].inhibitionTime
                                                "
                                                :min="
                                                    levelItem.inhibitionTime
                                                        .rangeMin
                                                "
                                                :max="
                                                    levelItem.inhibitionTime
                                                        .rangeMax
                                                "
                                                data-unit="s"
                                                @blur="
                                                    (e) => {
                                                        if (
                                                            e.target.value ===
                                                            ''
                                                        ) {
                                                            newForm[
                                                                `param905_${chanNoItem.chanNo}_${levelItem.type}`
                                                            ].info[0].inhibitionTime =
                                                                Number(
                                                                    e.target
                                                                        .ariaValueMin
                                                                );
                                                        }
                                                    }
                                                "
                                            ></el-input-number>
                                        </el-form-item>
                                        <el-form-item
                                            label="事件上传平台使能"
                                            v-if="levelItem.uploadEventPlatform"
                                        >
                                            <el-select
                                                v-model="
                                                    newForm[
                                                        `param905_${chanNoItem.chanNo}_${levelItem.type}`
                                                    ].info[0]
                                                        .uploadEventPlatform
                                                "
                                                multiple
                                                collapse-tags
                                            >
                                                <el-option
                                                    v-for="item in levelItem[
                                                        'uploadEventPlatform'
                                                    ]"
                                                    :label="
                                                        Number(item) - 1 ===
                                                        Number(
                                                            capability.network
                                                                .isHikPlatform
                                                        )
                                                            ? '海康云平台'
                                                            : '第' +
                                                              item +
                                                              '中心'
                                                    "
                                                    :value="item"
                                                    :key="item"
                                                ></el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item
                                            label="联动抓拍的通道"
                                            v-if="
                                                levelItem.snapshot &&
                                                levelItem.snapshot
                                                    .linkChannel &&
                                                levelItem.snapshot.linkChannel
                                                    .length
                                            "
                                        >
                                            <el-select
                                                v-model="
                                                    newForm[
                                                        `param905_${chanNoItem.chanNo}_${levelItem.type}`
                                                    ].info[0].snapshot
                                                        .linkChannel
                                                "
                                                :multiple-limit="
                                                    levelItem.snapshot
                                                        .maxLinkChannel || 0
                                                "
                                                multiple
                                                collapse-tags
                                            >
                                                <el-option
                                                    v-for="item in levelItem
                                                        .snapshot.linkChannel"
                                                    :label="`通道${item}`"
                                                    :value="item"
                                                    :key="item"
                                                ></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </template>
                                </div>
                            </el-collapse-item>
                        </el-collapse>
                    </div>
                </div>
            </div>
        </el-form>
        <el-dialog
            title="DSM全局音量调整"
            :visible.sync="dialogVisible"
            @close="close"
            :append-to-body="true"
        >
            <div class="p-a-md">
                <p class="m-b-sm">
                    点击确定后DSM所有报警项音量将调整为单项报警音量值（超出单项报警阈值范围将按阈值范围设定）,下发至终端成功后生效。
                </p>
                <el-slider
                    v-model="globalVolume"
                    :min="0"
                    :max="100"
                    :step="1"
                    show-input
                ></el-slider>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="send">确 定</el-button>
                <el-button @click="close">取 消</el-button>
            </span>
        </el-dialog>
        <el-dialog
            :modal="algorithmLoading"
            title="DSM灵敏度配置"
            :visible.sync="dialogAlgorithmVisible"
            @close="closeAlgorithm"
            width="1200px"
            :custom-class="algorithmLoading ? '' : 'dialog-algorithm'"
            :close-on-click-modal="true"
            :append-to-body="true"
        >
            <div>
                <DSM-Algorithm
                    :isTemplate="isTemplate"
                    :newForm="newForm"
                    :oldForm="oldForm"
                    :chanNoActive="chanNoActive"
                    :customizeAlgorithm="
                        capability.intelliDrive_DSM[0].customizeAlgorithm
                    "
                    @setFormChange="setFormChange"
                ></DSM-Algorithm>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import mixins from "@/mixins/mixins";
import DSMAlgorithm from "./DSM-Algorithm.vue";
export default {
    name: "DSM-Params",
    mixins: [mixins],
    components: {
        DSMAlgorithm,
    },
    props: {},
    data() {
        return {
            algorithmLoading: true,
            componentsName: "platformParams",
            setForm: {},
            chanNoActive: "",
            DSMList: [],
            dialogVisible: false,
            globalVolume: 0,
            volumeItem: {},
            activeCollapse: [],
            typeObj: {},
            firstType: null,
            dialogAlgorithmVisible: false,
        };
    },
    activated() {
        this.$nextTick(() => {
            this.labelWidthResize();
        });
    },
    mounted() {
        this.initConfig();
    },
    computed: {
        setTemplateHide() {
            return function (chanNoItem, infoItem) {
                if (this.isTemplate || this.$route.query.isTemplate) {
                    let bol = false;
                    infoItem.forEach((infoItem) => {
                        if (
                            this.newForm[
                                `param905_${chanNoItem.chanNo}_${infoItem.type}`
                            ]
                        ) {
                            bol = true;
                        }
                    });
                    return !bol;
                } else {
                    return false;
                }
            };
        },
    },
    watch: {
        chanNoActive(val) {
            this.activeCollapse = [];
            let obj = this.DSMList.find(
                (item) => item.chanNo == Number(val.split("通道")[1])
            );
            for (let key of Object.keys(obj.info)) {
                if (!this.activeCollapse.length) {
                    this.activeCollapse.push(key.split("-")[1]);
                }
            }
        },
        newForm: {
            handler(val) {
                if (val) {
                    this.DSMList.forEach((chanNoItem) => {
                        let _type = Object.entries(chanNoItem.info)[0][0].split(
                            "-"
                        )[0];
                        if (val[`param905_${chanNoItem.chanNo}_${_type}`]) {
                            if (
                                !this.setForm.hasOwnProperty(
                                    `通道${chanNoItem.chanNo}>DSM全局参数&param905_${chanNoItem.chanNo}_${_type}`
                                )
                            ) {
                                this.setForm[
                                    `通道${chanNoItem.chanNo}>DSM全局参数&param905_${chanNoItem.chanNo}_${_type}`
                                ] = {};
                            }
                            this.setForm[
                                `通道${chanNoItem.chanNo}>DSM全局参数&param905_${chanNoItem.chanNo}_${_type}`
                            ].enable =
                                val[`param905_${chanNoItem.chanNo}_${_type}`]
                                    .enable !=
                                this.oldForm[
                                    `param905_${chanNoItem.chanNo}_${_type}`
                                ].enable
                                    ? `param905_${
                                          chanNoItem.chanNo
                                      }_${_type}.enable&DSM算法使能switch&${
                                          val[
                                              `param905_${chanNoItem.chanNo}_${_type}`
                                          ].enable
                                      }`
                                    : null;
                            this.setForm[
                                `通道${chanNoItem.chanNo}>DSM全局参数&param905_${chanNoItem.chanNo}_${_type}`
                            ].linkChannel = this.isEqual(
                                val[`param905_${chanNoItem.chanNo}_${_type}`]
                                    .linkChannel,
                                this.oldForm[
                                    `param905_${chanNoItem.chanNo}_${_type}`
                                ].linkChannel
                            )
                                ? `param905_${
                                      chanNoItem.chanNo
                                  }_${_type}.linkChannel&联动抓拍的通道array&
                                  &${this.getLinkChannel(
                                      val[
                                          `param905_${chanNoItem.chanNo}_${_type}`
                                      ].linkChannel
                                  )}&${
                                      val[
                                          `param905_${chanNoItem.chanNo}_${_type}`
                                      ].linkChannel
                                  }`
                                : null;
                            this.setForm[
                                `通道${chanNoItem.chanNo}>DSM全局参数&param905_${chanNoItem.chanNo}_${_type}`
                            ].cameraPosition =
                                val[`param905_${chanNoItem.chanNo}_${_type}`]
                                    .cameraPosition !=
                                this.oldForm[
                                    `param905_${chanNoItem.chanNo}_${_type}`
                                ].cameraPosition
                                    ? `param905_${
                                          chanNoItem.chanNo
                                      }_${_type}.cameraPosition&相机位置number&${this.getLabelSelf(
                                          chanNoItem.cameraPositionList,
                                          val[
                                              `param905_${chanNoItem.chanNo}_${_type}`
                                          ].cameraPosition
                                      )}&${
                                          val[
                                              `param905_${chanNoItem.chanNo}_${_type}`
                                          ].cameraPosition
                                      }`
                                    : null;
                            if (
                                !this.setForm.hasOwnProperty(
                                    `通道${chanNoItem.chanNo}>DSM白盒算法配置&param905_${chanNoItem.chanNo}_${_type}`
                                )
                            ) {
                                this.setForm[
                                    `通道${chanNoItem.chanNo}>DSM白盒算法配置&param905_${chanNoItem.chanNo}_${_type}`
                                ] = {};
                            }
                            this.setForm[
                                `通道${chanNoItem.chanNo}>DSM白盒算法配置&param905_${chanNoItem.chanNo}_${_type}`
                            ].installPosition =
                                val[`param905_${chanNoItem.chanNo}_${_type}`]
                                    .installPosition !=
                                this.oldForm[
                                    `param905_${chanNoItem.chanNo}_${_type}`
                                ].installPosition
                                    ? `param905_${
                                          chanNoItem.chanNo
                                      }_${_type}.installPosition&架设方式number&${this.getLabelSelf(
                                          chanNoItem.installPositionList,
                                          val[
                                              `param905_${chanNoItem.chanNo}_${_type}`
                                          ].installPosition
                                      )}&${
                                          val[
                                              `param905_${chanNoItem.chanNo}_${_type}`
                                          ].installPosition
                                      }`
                                    : null;
                        }
                        for (let typeName of Object.keys(chanNoItem.info)) {
                            chanNoItem.info[typeName].forEach((typeItem) => {
                                if (
                                    val[
                                        `param905_${chanNoItem.chanNo}_${typeItem.type}`
                                    ]
                                ) {
                                    let paramStr = `param905_${chanNoItem.chanNo}_${typeItem.type}`;
                                    let objName = `通道${
                                        chanNoItem.chanNo
                                    }>${this.getLabelByType(
                                        typeItem.type
                                    )}&${paramStr}`;
                                    if (!this.setForm.hasOwnProperty(objName)) {
                                        this.setForm[objName] = {
                                            info: [{ snapshot: {}, clip: {} }],
                                        };
                                    }
                                    this.setForm[objName].info[0].enable =
                                        val[paramStr].info[0].enable !=
                                            this.oldForm[paramStr].info[0]
                                                .enable ||
                                        (this.isTemplate &&
                                            val[
                                                paramStr
                                            ].info[0].hasOwnProperty("enable"))
                                            ? `${paramStr}.info.0.enable&报警使能switch&${val[paramStr].info[0].enable}`
                                            : null;
                                    this.setForm[objName].info[0].speed =
                                        val[paramStr].info[0].speed !=
                                            this.oldForm[paramStr].info[0]
                                                .speed ||
                                        (this.isTemplate &&
                                            val[
                                                paramStr
                                            ].info[0].hasOwnProperty("speed"))
                                            ? `${paramStr}.info.0.speed&报警判断速度阈值number&${val[paramStr].info[0].speed}`
                                            : null;

                                    if (
                                        typeItem.newSensitivity &&
                                        typeItem.newSensitivity.length &&
                                        typeItem.sensitivityList &&
                                        typeItem.sensitivityList.length
                                    ) {
                                        this.setForm[
                                            objName
                                        ].info[0].newSensitivity =
                                            val[paramStr].info[0]
                                                .newSensitivity !=
                                                this.oldForm[paramStr].info[0]
                                                    .newSensitivity ||
                                            (this.isTemplate &&
                                                val[
                                                    paramStr
                                                ].info[0].hasOwnProperty(
                                                    "newSensitivity"
                                                ))
                                                ? `${paramStr}.info.0.newSensitivity&算法灵敏度number&${this.getLabelSelf(
                                                      typeItem.sensitivityList,
                                                      val[paramStr].info[0]
                                                          .newSensitivity
                                                  )}&${
                                                      val[paramStr].info[0]
                                                          .newSensitivity
                                                  }`
                                                : null;
                                    } else if (
                                        typeItem.sensitivityList &&
                                        typeItem.sensitivityList.length
                                    ) {
                                        this.setForm[
                                            objName
                                        ].info[0].sensitivity =
                                            val[paramStr].info[0].sensitivity !=
                                                this.oldForm[paramStr].info[0]
                                                    .sensitivity ||
                                            (this.isTemplate &&
                                                val[
                                                    paramStr
                                                ].info[0].hasOwnProperty(
                                                    "sensitivity"
                                                ))
                                                ? `${paramStr}.info.0.sensitivity&算法灵敏度number&${this.getLabelSelf(
                                                      typeItem.sensitivityList,
                                                      val[paramStr].info[0]
                                                          .sensitivity
                                                  )}&${
                                                      val[paramStr].info[0]
                                                          .sensitivity
                                                  }`
                                                : null;
                                    } else {
                                        this.setForm[
                                            objName
                                        ].info[0].sensitivity =
                                            val[paramStr].info[0].sensitivity !=
                                                this.oldForm[paramStr].info[0]
                                                    .sensitivity ||
                                            (this.isTemplate &&
                                                val[
                                                    paramStr
                                                ].info[0].hasOwnProperty(
                                                    "sensitivity"
                                                ))
                                                ? `${paramStr}.info.0.sensitivity&算法灵敏度number&${val[paramStr].info[0].sensitivity}`
                                                : null;
                                    }
                                    this.setForm[
                                        objName
                                    ].info[0].staticWarnEnable =
                                        val[paramStr].info[0]
                                            .staticWarnEnable !=
                                            this.oldForm[paramStr].info[0]
                                                .staticWarnEnable ||
                                        (this.isTemplate &&
                                            val[
                                                paramStr
                                            ].info[0].hasOwnProperty(
                                                "staticWarnEnable"
                                            ))
                                            ? `${paramStr}.info.0.staticWarnEnable&静止报警使能switch&${val[paramStr].info[0].staticWarnEnable}`
                                            : null;
                                    this.setForm[objName].info[0].volumeEnable =
                                        val[paramStr].info[0].volumeEnable !=
                                            this.oldForm[paramStr].info[0]
                                                .volumeEnable ||
                                        (this.isTemplate &&
                                            val[
                                                paramStr
                                            ].info[0].hasOwnProperty(
                                                "volumeEnable"
                                            ))
                                            ? `${paramStr}.info.0.volumeEnable&音量使能switch&${val[paramStr].info[0].volumeEnable}`
                                            : null;
                                    this.setForm[objName].info[0].volume =
                                        val[paramStr].info[0].volume !=
                                            this.oldForm[paramStr].info[0]
                                                .volume ||
                                        (this.isTemplate &&
                                            val[
                                                paramStr
                                            ].info[0].hasOwnProperty("volume"))
                                            ? `${paramStr}.info.0.volume&报警音量number&${val[paramStr].info[0].volume}`
                                            : null;
                                    this.setForm[
                                        objName
                                    ].info[0].snapshot.upload =
                                        val[paramStr].info[0].snapshot.upload !=
                                            this.oldForm[paramStr].info[0]
                                                .snapshot.upload ||
                                        (this.isTemplate &&
                                            val[
                                                paramStr
                                            ].info[0].snapshot.hasOwnProperty(
                                                "upload"
                                            ))
                                            ? `${paramStr}.info.0.snapshot.upload&报警图片上传使能switch&${val[paramStr].info[0].snapshot.upload}`
                                            : null;
                                    this.setForm[objName].info[0].clip.upload =
                                        val[paramStr].info[0].clip.upload !=
                                            this.oldForm[paramStr].info[0].clip
                                                .upload ||
                                        (this.isTemplate &&
                                            val[
                                                paramStr
                                            ].info[0].clip.hasOwnProperty(
                                                "upload"
                                            ))
                                            ? `${paramStr}.info.0.clip.upload&报警视频上传使能switch&${val[paramStr].info[0].clip.upload}`
                                            : null;
                                    this.setForm[
                                        objName
                                    ].info[0].snapshot.number =
                                        val[paramStr].info[0].snapshot.number !=
                                            this.oldForm[paramStr].info[0]
                                                .snapshot.number ||
                                        (this.isTemplate &&
                                            val[
                                                paramStr
                                            ].info[0].snapshot.hasOwnProperty(
                                                "number"
                                            ))
                                            ? `${paramStr}.info.0.snapshot.number&抓图张数number&${val[paramStr].info[0].snapshot.number}`
                                            : null;
                                    this.setForm[
                                        objName
                                    ].info[0].snapshot.interval =
                                        val[paramStr].info[0].snapshot
                                            .interval !=
                                            this.oldForm[paramStr].info[0]
                                                .snapshot.interval ||
                                        (this.isTemplate &&
                                            val[
                                                paramStr
                                            ].info[0].snapshot.hasOwnProperty(
                                                "interval"
                                            ))
                                            ? `${paramStr}.info.0.snapshot.interval&抓图间隔number&${
                                                  Number(
                                                      val[paramStr].info[0]
                                                          .snapshot.interval
                                                  ) * 100
                                              }毫秒&${
                                                  val[paramStr].info[0].snapshot
                                                      .interval
                                              }`
                                            : null;
                                    this.setForm[
                                        objName
                                    ].info[0].clip.perRecord =
                                        val[paramStr].info[0].clip.perRecord !=
                                            this.oldForm[paramStr].info[0].clip
                                                .perRecord ||
                                        (this.isTemplate &&
                                            val[
                                                paramStr
                                            ].info[0].clip.hasOwnProperty(
                                                "perRecord"
                                            ))
                                            ? `${paramStr}.info.0.clip.perRecord&报警短视频前半部分时长number&${val[paramStr].info[0].clip.perRecord}`
                                            : null;
                                    this.setForm[
                                        objName
                                    ].info[0].clip.afterRecord =
                                        val[paramStr].info[0].clip
                                            .afterRecord !=
                                            this.oldForm[paramStr].info[0].clip
                                                .afterRecord ||
                                        (this.isTemplate &&
                                            val[
                                                paramStr
                                            ].info[0].clip.hasOwnProperty(
                                                "afterRecord"
                                            ))
                                            ? `${paramStr}.info.0.clip.afterRecord&报警短视频后半部分时长number&${val[paramStr].info[0].clip.afterRecord}`
                                            : null;
                                    this.setForm[
                                        objName
                                    ].info[0].inhibitionTime =
                                        val[paramStr].info[0].inhibitionTime !=
                                            this.oldForm[paramStr].info[0]
                                                .inhibitionTime ||
                                        (this.isTemplate &&
                                            val[
                                                paramStr
                                            ].info[0].hasOwnProperty(
                                                "inhibitionTime"
                                            ))
                                            ? `${paramStr}.info.0.inhibitionTime&报警抑制时间number&${val[paramStr].info[0].inhibitionTime}`
                                            : null;
                                    this.setForm[
                                        objName
                                    ].info[0].uploadEventPlatform =
                                        this.isEqual(
                                            val[paramStr].info[0]
                                                .uploadEventPlatform,
                                            this.oldForm[paramStr].info[0]
                                                .uploadEventPlatform
                                        ) ||
                                        (this.isTemplate &&
                                            val[
                                                paramStr
                                            ].info[0].hasOwnProperty(
                                                "uploadEventPlatform"
                                            ))
                                            ? `${paramStr}.info.0.uploadEventPlatform&事件上传平台使能array&${this.getUploadEventPlatform(
                                                  val[paramStr].info[0]
                                                      .uploadEventPlatform
                                              )}&${
                                                  val[paramStr].info[0]
                                                      .uploadEventPlatform
                                              }`
                                            : null;
                                    this.setForm[
                                        objName
                                    ].info[0].snapshot.linkChannel =
                                        this.isEqual(
                                            val[paramStr].info[0].snapshot
                                                .linkChannel,
                                            this.oldForm[paramStr].info[0]
                                                .snapshot.linkChannel
                                        ) ||
                                        (this.isTemplate &&
                                            val[
                                                paramStr
                                            ].info[0].snapshot.hasOwnProperty(
                                                "linkChannel"
                                            ))
                                            ? `${paramStr}.info.0.snapshot.linkChannel&联动抓拍的通道array&${this.getLinkChannel(
                                                  val[paramStr].info[0].snapshot
                                                      .linkChannel
                                              )}&${
                                                  val[paramStr].info[0].snapshot
                                                      .linkChannel
                                              }`
                                            : null;
                                }
                            });
                        }
                    });
                    this.$emit("setFormChange", {
                        DSM: this.setForm,
                    });
                }
            },
            deep: true,
            immediate: true,
        },
    },
    methods: {
        setFormChange(obj) {
            this.$emit("setFormChange", {
                DSM: { ...this.setForm, ...obj },
            });
        },
        initConfig() {
            this.$emit("setFormLoading", true);
            let initConfigList = [];
            this.DSMList = [];
            this.chanNoActive = `通道${this.capability.intelliDrive_DSM[0].chanNo}`;
            if (this.capability.intelliDrive_DSM[0].customizeAlgorithm) {
                initConfigList.push(
                    this.getEHomeConfig(6004, {
                        algorithmType: 0,
                        sentivityType: 0,
                    })
                );
                initConfigList.push(
                    this.getEHomeConfig(6004, {
                        algorithmType: 0,
                        sentivityType: 1,
                    })
                );
                initConfigList.push(
                    this.getEHomeConfig(6004, {
                        algorithmType: 0,
                        sentivityType: 2,
                    })
                );
                initConfigList.push(
                    this.getEHomeConfig(6004, {
                        algorithmType: 1,
                        sentivityType: 0,
                    })
                );
                initConfigList.push(
                    this.getEHomeConfig(6004, {
                        algorithmType: 1,
                        sentivityType: 1,
                    })
                );
                initConfigList.push(
                    this.getEHomeConfig(6004, {
                        algorithmType: 1,
                        sentivityType: 2,
                    })
                );
            }
            this.capability.intelliDrive_DSM.forEach((chanNoItem) => {
                initConfigList.push(
                    this.getEHomeConfig(
                        905,
                        {
                            type: "",
                            chanNo: chanNoItem.chanNo,
                        },
                        "DSM"
                    )
                );
                if (
                    chanNoItem.installPosition &&
                    chanNoItem.installPosition.length
                ) {
                    chanNoItem.installPositionList = this.getEnumerationValue(
                        chanNoItem.installPosition,
                        "intelliDrive_DSM_installPosition"
                    );
                }
                if (
                    chanNoItem.cameraPosition &&
                    chanNoItem.cameraPosition.length
                ) {
                    chanNoItem.cameraPositionList = this.getEnumerationValue(
                        chanNoItem.cameraPosition,
                        "intelliDrive_DSM_cameraPosition"
                    );
                }
                let obj = {
                    ...chanNoItem,
                    info: {},
                };
                chanNoItem.info.forEach((infoItem) => {
                    if (!this.isTemplate) {
                        /* --------------------算法灵敏度 start-------------------------*/
                        infoItem.sensitivityList = [];
                        if (infoItem.sensitivity && !infoItem.newSensitivity) {
                            let sensitivityRange =
                                infoItem.sensitivity.max -
                                infoItem.sensitivity.min;
                            let sensitivityLow =
                                infoItem.sensitivity.min +
                                parseInt(sensitivityRange / 6);
                            let sensitivityMiddle =
                                infoItem.sensitivity.min +
                                parseInt(sensitivityRange / 2);
                            let sensitivityHigh =
                                infoItem.sensitivity.min +
                                parseInt((sensitivityRange * 5) / 6);
                            infoItem.sensitivityRange = sensitivityRange;
                            switch (infoItem.type) {
                                case 0:
                                case 7:
                                case 34:
                                case 35:
                                case 36:
                                case 37:
                                case 38:
                                case 39:
                                case 2:
                                case 16:
                                    infoItem.sensitivityList = [
                                        {
                                            value: 6,
                                            label: "低",
                                        },
                                        {
                                            value: 4,
                                            label: "中",
                                        },
                                        {
                                            value: 3,
                                            label: "高",
                                        },
                                    ];
                                    break;
                                case 3:
                                case 8:
                                case 40:
                                    infoItem.sensitivityList = [
                                        {
                                            value: 8,
                                            label: "低",
                                        },
                                        {
                                            value: 7,
                                            label: "中",
                                        },
                                        {
                                            value: 6,
                                            label: "高",
                                        },
                                    ];
                                    break;
                                case 1:
                                case 15:
                                    infoItem.sensitivityList = [
                                        {
                                            value: 8,
                                            label: "低",
                                        },
                                        {
                                            value: 6,
                                            label: "中",
                                        },
                                        {
                                            value: 3,
                                            label: "高",
                                        },
                                    ];
                                    break;
                                case 6:
                                case 19:
                                case 12:
                                case 23:
                                case 5:
                                case 18:
                                case 26:
                                case 27:
                                    infoItem.sensitivityList = [
                                        {
                                            value: 10,
                                            label: "低",
                                        },
                                    ];
                                    if (
                                        this.isTemplate &&
                                        this.newForm[
                                            `param905_${chanNoItem.chanNo}_${infoItem.type}`
                                        ] &&
                                        !infoItem.sensitivityList.find(
                                            (e) =>
                                                e.value ===
                                                this.newForm[
                                                    `param905_${chanNoItem.chanNo}_${infoItem.type}`
                                                ].info[0].sensitivity
                                        )
                                    ) {
                                        infoItem.sensitivityList.push({
                                            value: this.newForm[
                                                `param905_${chanNoItem.chanNo}_${infoItem.type}`
                                            ].info[0].sensitivity,
                                            label: `自定义值(${
                                                this.newForm[
                                                    `param905_${chanNoItem.chanNo}_${infoItem.type}`
                                                ].info[0].sensitivity
                                            })`,
                                        });
                                    }
                                    break;
                                case 9:
                                case 10:
                                case 11:
                                case 20:
                                case 21:
                                case 22:
                                    infoItem.sensitivityList = [
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
                                    break;
                                default:
                                    infoItem.sensitivityList = [];
                                    break;
                            }
                        } else if (
                            infoItem.newSensitivity &&
                            infoItem.newSensitivity.length
                        ) {
                            infoItem.sensitivityList = this.getEnumerationValue(
                                infoItem.newSensitivity,
                                "intelliDrive_DSM_newSensitivity"
                            );
                        }
                        /* --------------------算法灵敏度 end-------------------------*/
                        /* --------------------算法置信度 start-------------------------*/
                        infoItem.confidenceList = [];
                        if (infoItem.confidence) {
                            let confidenceRange =
                                infoItem.confidence.max -
                                infoItem.confidence.min;
                            let confidenceLow =
                                infoItem.confidence.min +
                                parseInt(confidenceRange / 6);
                            let confidenceMiddle =
                                infoItem.confidence.min +
                                parseInt(confidenceRange / 2);
                            let confidenceHigh =
                                infoItem.confidence.min +
                                parseInt((confidenceRange * 5) / 6);
                            infoItem.confidenceRange = confidenceRange;
                            infoItem.confidenceList = [
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
                    }
                    for (let key of Object.keys(
                        this.enumerationJSON["intelliDrive_DSM_type"]
                    )) {
                        if (
                            this.enumerationJSON["intelliDrive_DSM_type"][
                                key
                            ].indexOf(infoItem.type) > -1
                        ) {
                            if (!obj.info.hasOwnProperty(key)) {
                                obj.info[key] = [];
                            }
                            obj.info[key].push(infoItem);
                            if (!this.activeCollapse.length) {
                                this.activeCollapse.push(key.split("-")[1]);
                            }
                        }
                    }
                    initConfigList.push(
                        this.getEHomeConfig(
                            905,
                            {
                                type: infoItem.type,
                                chanNo: chanNoItem.chanNo,
                            },
                            "DSM"
                        )
                    );
                });
                this.DSMList.push(obj);
            });
            Promise.all(initConfigList).then((result) => {
                this.algorithmLoading = false;
                this.openAlgorithm();
                setTimeout(() => {
                    this.closeAlgorithm();
                    setTimeout(() => {
                        this.algorithmLoading = true;
                    }, 300);
                }, 1);

                this.$emit("setFormLoading", false);
                this.$emit("loadingSuccess");
                this.typeObj = {};
                this.DSMList.forEach((item) => {
                    this.typeObj[item.chanNo] = Object.entries(
                        item.info
                    ).reduce((prev, cur) => {
                        let arr = [];
                        cur[1].forEach((k) => {
                            arr.push(k.type);
                        });
                        return prev.concat(arr);
                    }, []);
                });
                let chanNo = this.chanNoActive.split("通道")[1];
                this.firstType = Number(
                    this.typeObj[chanNo].find((type) => {
                        if (this.newForm[`param905_${chanNo}_${type}`]) {
                            return type + "";
                        }
                    })
                );
                for (let key of Object.keys(
                    this.enumerationJSON["intelliDrive_DSM_type"]
                )) {
                    if (
                        this.enumerationJSON["intelliDrive_DSM_type"][
                            key
                        ].indexOf(this.firstType) > -1 &&
                        !this.activeCollapse.length
                    ) {
                        this.activeCollapse.push(key.split("-")[1]);
                    }
                }
            });
        },
        getLabelByType(type) {
            let label = "";
            for (let key of Object.keys(
                this.enumerationJSON["intelliDrive_DSM_type"]
            )) {
                let index =
                    this.enumerationJSON["intelliDrive_DSM_type"][key].indexOf(
                        type
                    );
                if (index === 0) {
                    label = key + ">一级报警";
                } else if (index === 1) {
                    label = key + ">二级报警";
                }
            }
            return label.split("-")[1];
        },
        beforeChange(value, done) {
            if (value === 1) {
                this.$confirm(
                    "算法使能关闭后算法将不再运行，本次修改的报警项配置不再保留。",
                    "确定要关闭DSM算法使能吗？",
                    {
                        confirmButtonText: this.$t("common.ok"),
                        cancelButtonText: this.$t("common.cancel"),
                        type: "warning",
                    }
                )
                    .then(() => {
                        let chanNo = this.chanNoActive.split("通道")[1];
                        this.DSMList.forEach((chanNoItem) => {
                            if (Number(chanNoItem.chanNo) === Number(chanNo)) {
                                for (let typeName of Object.keys(
                                    chanNoItem.info
                                )) {
                                    chanNoItem.info[typeName].forEach(
                                        (typeItem) => {
                                            if (
                                                this.newForm[
                                                    `param905_${chanNo}_${typeItem.type}`
                                                ] &&
                                                this.oldForm[
                                                    `param905_${chanNo}_${typeItem.type}`
                                                ]
                                            ) {
                                                this.newForm[
                                                    `param905_${chanNo}_${typeItem.type}`
                                                ] = JSON.parse(
                                                    JSON.stringify(
                                                        this.oldForm[
                                                            `param905_${chanNo}_${typeItem.type}`
                                                        ]
                                                    )
                                                );
                                            }
                                        }
                                    );
                                }
                            }
                        });
                        done();
                    })
                    .catch(() => {});
            } else {
                done();
            }
        },
        openDialog(chanNoItem) {
            this.volumeItem = chanNoItem;
            this.dialogVisible = true;
        },
        close() {
            this.dialogVisible = false;
            setTimeout(() => {
                this.volumeItem = {};
                this.globalVolume = 0;
            }, 300);
        },

        send() {
            for (let key of Object.keys(this.volumeItem.info)) {
                this.volumeItem.info[key].map((item) => {
                    this.newForm[
                        `param905_${this.volumeItem.chanNo}_${item.type}`
                    ].info[0].volume = this.globalVolume;
                });
            }
            this.close();
        },
        getLabelSelf(arr, val) {
            let obj = arr.find((e) => e.value === val);
            if (obj) {
                return obj.label;
            }
        },
        collapseChange(val) {
            if (val.length) {
                setTimeout(() => {
                    this.labelWidthResize();
                }, 300);
            }
        },
        speedBlur(chanNoItem, key) {
            if (chanNoItem.info[key].length > 1 && !this.isTemplate) {
                if (
                    this.newForm[
                        `param905_${chanNoItem.chanNo}_${chanNoItem.info[key][1].type}`
                    ].info[0].speed -
                        this.newForm[
                            `param905_${chanNoItem.chanNo}_${chanNoItem.info[key][0].type}`
                        ].info[0].speed <
                    20
                ) {
                    this.$message.error(
                        `${
                            key.split("-")[1]
                        }一级报警与二级报警报警判断速度阈值小于20！`
                    );
                }
            }
        },
        enableChange(val, chanNoItem) {
            for (let typeItem of Object.keys(chanNoItem.info)) {
                chanNoItem.info[typeItem].forEach((levelItem) => {
                    if (
                        this.newForm[
                            `param905_${chanNoItem.chanNo}_${levelItem.type}`
                        ]
                    ) {
                        this.newForm[
                            `param905_${chanNoItem.chanNo}_${levelItem.type}`
                        ].enable = val;
                        this.$emit(
                            "formDataChange",
                            `param905_${chanNoItem.chanNo}_${levelItem.type}`,
                            {
                                ...this.newForm[
                                    `param905_${chanNoItem.chanNo}_${levelItem.type}`
                                ],
                            }
                        );
                    }
                });
            }
        },
        uploadChange(val, attr, chanNo, type) {
            this.newForm[`param905_${chanNo}_${type}`].info[0][attr].save = val;
            this.$emit("formDataChange", `param905_${chanNo}_${type}`, {
                ...this.newForm[`param905_${chanNo}_${type}`],
            });
        },
        openAlgorithm() {
            this.dialogAlgorithmVisible = true;
        },
        closeAlgorithm() {
            this.dialogAlgorithmVisible = false;
        },
        saveAlgorithm() {},
    },
};
</script>
<style lang="less" scoped>
@import "./configurationForm.less";
</style>
<style lang="less">
.dialog-algorithm {
    display: none;
    position: absolute;
    left: -999999px;
}
</style>
