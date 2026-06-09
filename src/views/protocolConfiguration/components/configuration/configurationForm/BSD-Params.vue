<template>
    <div class="configuration-form">
        <el-form
            :label-width="`${labelWidth}px`"
            :model="newForm"
            :inline="true"
            :rules="rules"
            ref="form"
        >
            <el-radio-group type="simple" v-model="chanNoActive">
                <el-radio-button
                    v-for="(item, index) in BSDList"
                    :key="index"
                    :label="`通道${item.chanNo}`"
                />
            </el-radio-group>
            <div>
                <div v-for="(chanNoItem, index) in BSDList" :key="index">
                    <div v-show="`通道${chanNoItem.chanNo}` === chanNoActive">
                        <div
                            v-if="
                                newForm[
                                    `param920_${chanNoItem.chanNo}_${firstType}`
                                ] &&
                                chanNoItem.linkChannel &&
                                chanNoItem.linkChannel.length &&
                                chanNoItem.maxLinkChannel
                            "
                        >
                            <h3>BSD全局参数</h3>
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
                                            `param920_${chanNoItem.chanNo}_${firstType}`
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
                        </div>
                        <el-collapse
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
                                                `param920_${chanNoItem.chanNo}_${levelItem.type}`
                                            ]
                                        "
                                    >
                                        <h3>
                                            <span
                                                v-if="
                                                    key.split('-')[1] !==
                                                    '全区域(M2设备)'
                                                "
                                            >
                                                {{
                                                    index2 === 0
                                                        ? "一级报警"
                                                        : "二级报警"
                                                }}
                                            </span>
                                            <span v-else>&nbsp;</span>
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
                                                        `param920_${chanNoItem.chanNo}_${levelItem.type}`
                                                    ].info[0].enable
                                                "
                                                :active-value="Number(1)"
                                                :inactive-value="Number(0)"
                                            ></el-switch>
                                        </el-form-item>
                                        <el-form-item
                                            label="静止报警使能"
                                            v-if="levelItem.staticWarnEnable"
                                        >
                                            <el-switch
                                                v-model="
                                                    newForm[
                                                        `param920_${chanNoItem.chanNo}_${levelItem.type}`
                                                    ].info[0].staticWarnEnable
                                                "
                                                :active-value="Number(1)"
                                                :inactive-value="Number(0)"
                                            ></el-switch>
                                        </el-form-item>
                                        <el-form-item
                                            label="报警判断速度阈值"
                                            :prop="`param920_${chanNoItem.chanNo}_${levelItem.type}.info[0].speed`"
                                            :rules="rules.speed"
                                            v-if="levelItem.speed"
                                        >
                                            <el-input-number
                                                :precision="0"
                                                controls-position="right"
                                                v-model="
                                                    newForm[
                                                        `param920_${chanNoItem.chanNo}_${levelItem.type}`
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
                                                                `param920_${chanNoItem.chanNo}_${levelItem.type}`
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
                                            label="音量使能"
                                            v-if="levelItem.volumeEnable"
                                        >
                                            <el-switch
                                                v-model="
                                                    newForm[
                                                        `param920_${chanNoItem.chanNo}_${levelItem.type}`
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
                                                        `param920_${chanNoItem.chanNo}_${levelItem.type}`
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
                                                                `param920_${chanNoItem.chanNo}_${levelItem.type}`
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
                                            label="算法置信度"
                                            v-if="levelItem.confidence"
                                        >
                                            <span
                                                slot="label"
                                                class="label-slot"
                                                >算法置信度
                                                <el-tooltip
                                                    content="置信度越高，检出越低检准越高"
                                                >
                                                    <i
                                                        class="el-icon-question"
                                                    ></i> </el-tooltip
                                            ></span>
                                            <el-select
                                                v-model="
                                                    newForm[
                                                        `param920_${chanNoItem.chanNo}_${levelItem.type}`
                                                    ].info[0].confidence
                                                "
                                            >
                                                <el-option
                                                    v-for="item in levelItem.confidenceList"
                                                    :label="item.label"
                                                    :value="item.value"
                                                    :key="item.value"
                                                ></el-option>
                                            </el-select>
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
                                                        `param920_${chanNoItem.chanNo}_${levelItem.type}`
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
                                                                `param920_${chanNoItem.chanNo}_${levelItem.type}`
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
                                                        `param920_${chanNoItem.chanNo}_${levelItem.type}`
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
                                            label="算法灵敏度"
                                            introduction="灵敏度越高越容易触发报警"
                                            v-if="levelItem.sensitivity"
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
                                                v-model="
                                                    newForm[
                                                        `param920_${chanNoItem.chanNo}_${levelItem.type}`
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
                                        </el-form-item>
                                        <el-form-item
                                            label="相机位置"
                                            v-if="chanNoItem.cameraPos"
                                        >
                                            <el-select
                                                v-model="
                                                    newForm[
                                                        `param920_${chanNoItem.chanNo}_${levelItem.type}`
                                                    ].cameraPos
                                                "
                                            >
                                                <el-option
                                                    v-for="item in chanNoItem[
                                                        'cameraPosList'
                                                    ]"
                                                    :label="item.label"
                                                    :value="item.value"
                                                    :key="item.value"
                                                ></el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item
                                            label="相机安装高度"
                                            v-if="levelItem.installHeight"
                                        >
                                            <el-input-number
                                                :precision="0"
                                                controls-position="right"
                                                v-model="
                                                    newForm[
                                                        `param920_${chanNoItem.chanNo}_${levelItem.type}`
                                                    ].info[0].installHeight
                                                "
                                                :min="
                                                    levelItem.installHeight.min
                                                "
                                                :max="
                                                    levelItem.installHeight.max
                                                "
                                                data-unit="米"
                                                @blur="
                                                    (e) => {
                                                        if (
                                                            e.target.value ===
                                                            ''
                                                        ) {
                                                            newForm[
                                                                `param920_${chanNoItem.chanNo}_${levelItem.type}`
                                                            ].info[0].installHeight =
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
                                            label="转向角"
                                            v-if="levelItem.angle"
                                        >
                                            <el-input-number
                                                :precision="0"
                                                controls-position="right"
                                                v-model="
                                                    newForm[
                                                        `param920_${chanNoItem.chanNo}_${levelItem.type}`
                                                    ].info[0].angle
                                                "
                                                :min="levelItem.angle.min"
                                                :max="levelItem.angle.max"
                                                data-unit="°"
                                                @blur="
                                                    (e) => {
                                                        if (
                                                            e.target.value ===
                                                            ''
                                                        ) {
                                                            newForm[
                                                                `param920_${chanNoItem.chanNo}_${levelItem.type}`
                                                            ].info[0].angle =
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
                                            label="转向角关联使能"
                                            v-if="levelItem.turnAngle"
                                        >
                                            <el-switch
                                                v-model="
                                                    newForm[
                                                        `param920_${chanNoItem.chanNo}_${levelItem.type}`
                                                    ].info[0].turnAngle
                                                "
                                                :active-value="Number(1)"
                                                :inactive-value="Number(0)"
                                            ></el-switch>
                                        </el-form-item>
                                        <el-form-item
                                            label="转向灯关联使能"
                                            v-if="levelItem.turnSignal"
                                        >
                                            <el-switch
                                                v-model="
                                                    newForm[
                                                        `param920_${chanNoItem.chanNo}_${levelItem.type}`
                                                    ].info[0].turnSignal
                                                "
                                                :active-value="Number(1)"
                                                :inactive-value="Number(0)"
                                            ></el-switch>
                                        </el-form-item>
                                        <el-form-item
                                            label="检测类型"
                                            v-if="levelItem.detect"
                                        >
                                            <el-select
                                                v-model="
                                                    newForm[
                                                        `param920_${chanNoItem.chanNo}_${levelItem.type}`
                                                    ].info[0].detect
                                                "
                                                multiple
                                                collapse-tags
                                            >
                                                <el-option
                                                    v-for="item in levelItem[
                                                        'detectList'
                                                    ]"
                                                    :label="item.label"
                                                    :value="item.value"
                                                    :key="item.value"
                                                    :disabled="
                                                        newForm[
                                                            `param920_${chanNoItem.chanNo}_${levelItem.type}`
                                                        ].info[0].detect
                                                            .length === 1 &&
                                                        newForm[
                                                            `param920_${chanNoItem.chanNo}_${levelItem.type}`
                                                        ].info[0].detect[0] ===
                                                            item.value
                                                    "
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
                                                        `param920_${chanNoItem.chanNo}_${levelItem.type}`
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
                                                                `param920_${chanNoItem.chanNo}_${levelItem.type}`
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
                                                        `param920_${chanNoItem.chanNo}_${levelItem.type}`
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
                                                                `param920_${chanNoItem.chanNo}_${levelItem.type}`
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
                                                        `param920_${chanNoItem.chanNo}_${levelItem.type}`
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
                                                        `param920_${chanNoItem.chanNo}_${levelItem.type}`
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
                                                        `param920_${chanNoItem.chanNo}_${levelItem.type}`
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
                                                                `param920_${chanNoItem.chanNo}_${levelItem.type}`
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
                                                        `param920_${chanNoItem.chanNo}_${levelItem.type}`
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
                                            label="标定检测区域"
                                            v-if="levelItem.area"
                                        >
                                            <el-button
                                                @click="
                                                    isPlugin = false;
                                                    openSurvey({
                                                        chanNo: chanNoItem.chanNo,
                                                        type: levelItem.type,
                                                    });
                                                "
                                                >设置</el-button
                                            >
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
                                                        `param920_${chanNoItem.chanNo}_${levelItem.type}`
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
        <div id="id" style="width: 0; height: 0"></div>
        <el-dialog
            title="标定检测区域"
            :visible.sync="openSurveyBol"
            :before-close="handleClose"
            append-to-body
        >
            <el-switch
                v-model="isPlugin"
                active-text="插件"
                inactive-text="无插件"
                class="m-l"
                v-if="!isTemplate"
                :disabled="pluginLoading"
            >
            </el-switch>

            <a
                type="text"
                class="m-r"
                style="float: right; line-height: 32px"
                @click="reDownLoad"
                v-if="notLastVerson && !isTemplate"
                >发现新控件版本</a
            >
            <div class="divHeight" v-show="openSurveyBol && !isPlugin">
                <BSDNoPlugin
                    ref="BSDNoPlugin"
                    :playUrl="playUrl"
                    @cancelSurveyBol="cancelSurveyBol"
                    @saveSurveyBol="saveSurveyBol"
                    :isTemplate="isTemplate"
                ></BSDNoPlugin>
            </div>
            <div class="divHeight" v-show="openSurveyBol && isPlugin">
                <div id="AEStreamWebVersion" style="width: 0; height: 0"></div>

                <div
                    v-show="!noneVideoPlay"
                    class="h-full inline"
                    style="height: 100%; width: 100%"
                    id="videoPlay_BSD"
                ></div>
                <div
                    v-if="noneVideoPlay"
                    class="h-full flex-layout flex-middle flex-center"
                >
                    <div class="text-center">
                        <h4>Web控件未运行</h4>
                        <p class="text-xs text-muted m-y text-center">
                            请尝试以下办法：
                        </p>
                        <div class="text-xs text-center">
                            <span
                                >1）本机尚未安装Web控件，请先安装，安装完成后刷新当前页面！</span
                            >
                            <a @click="downloadOcx">安装</a>
                            <a @click="refreshPage">刷新</a>
                        </div>
                        <div class="text-xs text-center">
                            <span
                                >2）本机已安装Web控件，请先启动服务后刷新当前页面！</span
                            >
                            <a @click="wakeUpOcx">启动</a>
                            <a @click="refreshPage">刷新</a>
                        </div>
                    </div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { WebControl } from "web-control";
import mixins from "@/mixins/mixins";
import ocxWebControl from "@/utils/ocxWebControl";
import BSDNoPlugin from "@/components/webControlService/configuration/bsd.vue";
export default {
    name: "BSD-Params",
    mixins: [mixins],
    components: { BSDNoPlugin },
    props: {},
    data() {
        const validateNumber = (rule, value, callback) => {
            if (
                this.newForm[rule.field.split(".")[0]].info[0].enable &&
                value > this.getSpeedValue()
            ) {
                callback(new Error(`BSD速度阈值不能大于WHD速度阈值`));
            } else {
                callback();
            }
        };
        return {
            isPlugin: false,
            componentsName: "platformParams",
            setForm: {},
            chanNoActive: "",
            BSDList: [],
            activeCollapse: [],
            openSurveyBol: false,
            dialogClick: false,
            noneVideoPlay: false,
            notLastVerson: false,
            surveyObj: {},
            playUrl: "",
            rules: {
                speed: [
                    {
                        required: false,
                        validator: validateNumber,
                        trigger: "change",
                    },
                ],
            },
            typeObj: {},
            firstType: null,
            pluginLoading: false,
            pluginTimeout: null,
        };
    },
    activated() {
        this.$nextTick(() => {
            this.labelWidthResize();
        });
    },
    mounted() {

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
        window.addEventListener("scroll", () => {
            if (this.videoPlayControl != null) {
                let box = document.getElementById("videoPlay_BSD");
                let offsetHeight = box.offsetHeight;
                let offsetWidth = box.offsetWidth;
                ocxWebControl.pageScroll(
                    this.videoPlayControl,
                    "videoPlay_BSD",
                    offsetWidth,
                    offsetHeight
                );
            }
        });

        window.addEventListener("resize", () => {
            if (this.videoPlayControl != null) {
                let box = document.getElementById("videoPlay_BSD");
                let offsetHeight = box.offsetHeight;
                let offsetWidth = box.offsetWidth;
                ocxWebControl.pageResize(
                    this.videoPlayControl,
                    "videoPlay_BSD",
                    offsetWidth,
                    offsetHeight
                );
            }
        });
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
                                `param920_${chanNoItem.chanNo}_${infoItem.type}`
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
        isPlugin: {
            handler(val, oldVal) {
                if (this.pluginTimeout) {
                    clearTimeout(this.pluginTimeout);
                    this.pluginTimeout = null;
                }
                if (this.videoPlayControl != null) {
                    this.pluginLoading = false;
                    this.videoPlayControl.JS_DestroyWnd().then(
                        () => {},
                        () => {}
                    );
                }

                if (val) {
                    this.pluginLoading = true;
                    this.$refs.BSDNoPlugin.cancel(false);
                }

                this.openSurvey(this.surveyObj);
                this.pluginTimeout = setTimeout(() => {
                    this.pluginLoading = false;
                }, 2000);
            },
            deep: true,
        },
        openSurveyBol: {
            handler(newVal) {
                if (!newVal) {
                    this.dialogClick = newVal;
                    this.SurveyBol();
                }
            },
        },
        chanNoActive(val) {
            this.activeCollapse = [];
            let obj = this.BSDList.find(
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
                    this.BSDList.forEach((chanNoItem) => {
                        let _type = Object.entries(chanNoItem.info)[0][0].split(
                            "-"
                        )[0];
                        if (val[`param920_${chanNoItem.chanNo}_${_type}`]) {
                            if (
                                !this.setForm.hasOwnProperty(
                                    `通道${chanNoItem.chanNo}>BSD全局参数&param920_${chanNoItem.chanNo}_${_type}`
                                )
                            ) {
                                this.setForm[
                                    `通道${chanNoItem.chanNo}>BSD全局参数&param920_${chanNoItem.chanNo}_${_type}`
                                ] = {};
                            }
                            this.setForm[
                                `通道${chanNoItem.chanNo}>BSD全局参数&param920_${chanNoItem.chanNo}_${_type}`
                            ].linkChannel = this.isEqual(
                                val[`param920_${chanNoItem.chanNo}_${_type}`]
                                    .linkChannel,
                                this.oldForm[
                                    `param920_${chanNoItem.chanNo}_${_type}`
                                ].linkChannel
                            )
                                ? `param920_${
                                      chanNoItem.chanNo
                                  }_${_type}.linkChannel&联动抓拍的通道array&
                                  &${this.getLinkChannel(
                                      val[
                                          `param920_${chanNoItem.chanNo}_${_type}`
                                      ].linkChannel
                                  )}&${
                                      val[
                                          `param920_${chanNoItem.chanNo}_${_type}`
                                      ].linkChannel
                                  }`
                                : null;
                        }
                        for (let typeName of Object.keys(chanNoItem.info)) {
                            chanNoItem.info[typeName].forEach((typeItem) => {
                                if (
                                    val[
                                        `param920_${chanNoItem.chanNo}_${typeItem.type}`
                                    ]
                                ) {
                                    let paramStr = `param920_${chanNoItem.chanNo}_${typeItem.type}`;
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
                                    this.setForm[objName].info[0].speed =
                                        val[paramStr].info[0].speed !=
                                            this.oldForm[paramStr].info[0]
                                                .speed ||
                                        (this.isTemplate &&
                                            val[
                                                paramStr
                                            ].info[0].hasOwnProperty("speed"))
                                            ? `${paramStr}.info.0.speed&报警判断速度阈值&${
                                                  val[paramStr].info[0].speed ||
                                                  ""
                                              } `
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
                                            ? `${paramStr}.info.0.volume&报警音量&${val[paramStr].info[0].volume}`
                                            : null;
                                    this.setForm[objName].info[0].confidence =
                                        val[paramStr].info[0].confidence !=
                                            this.oldForm[paramStr].info[0]
                                                .confidence ||
                                        (this.isTemplate &&
                                            val[
                                                paramStr
                                            ].info[0].hasOwnProperty(
                                                "confidence"
                                            ))
                                            ? `${paramStr}.info.0.confidence&算法置信度&${this.getLabelSelf(
                                                  typeItem.confidenceList,
                                                  val[paramStr].info[0]
                                                      .confidence
                                              )}&${
                                                  val[paramStr].info[0]
                                                      .confidence
                                              }`
                                            : null;
                                    this.setForm[objName].info[0].sensitivity =
                                        val[paramStr].info[0].sensitivity !=
                                            this.oldForm[paramStr].info[0]
                                                .sensitivity ||
                                        (this.isTemplate &&
                                            val[
                                                paramStr
                                            ].info[0].hasOwnProperty(
                                                "sensitivity"
                                            ))
                                            ? `${paramStr}.info.0.sensitivity&算法灵敏度&${this.getLabelSelf(
                                                  typeItem.sensitivityList,
                                                  val[paramStr].info[0]
                                                      .sensitivity
                                              )}&${
                                                  val[paramStr].info[0]
                                                      .sensitivity
                                              }`
                                            : null;
                                    this.setForm[objName].cameraPos =
                                        val[paramStr].cameraPos !=
                                            this.oldForm[paramStr].cameraPos ||
                                        (this.isTemplate &&
                                            val[paramStr].hasOwnProperty(
                                                "cameraPos"
                                            ))
                                            ? `${paramStr}.cameraPos&相机位置number&${this.getLabelSelf(
                                                  chanNoItem.cameraPosList,
                                                  val[paramStr].cameraPos
                                              )}&${val[paramStr].cameraPos}`
                                            : null;
                                    this.setForm[
                                        objName
                                    ].info[0].installHeight =
                                        val[paramStr].info[0].installHeight !=
                                            this.oldForm[paramStr].info[0]
                                                .installHeight ||
                                        (this.isTemplate &&
                                            val[
                                                paramStr
                                            ].info[0].hasOwnProperty(
                                                "installHeight"
                                            ))
                                            ? `${paramStr}.info.0.installHeight&相机安装高度&${val[paramStr].info[0].installHeight}`
                                            : null;
                                    this.setForm[objName].info[0].angle =
                                        val[paramStr].info[0].angle !=
                                            this.oldForm[paramStr].info[0]
                                                .angle ||
                                        (this.isTemplate &&
                                            val[
                                                paramStr
                                            ].info[0].hasOwnProperty("angle"))
                                            ? `${paramStr}.info.0.angle&转向角&${val[paramStr].info[0].angle}`
                                            : null;
                                    this.setForm[objName].info[0].turnAngle =
                                        val[paramStr].info[0].turnAngle !=
                                            this.oldForm[paramStr].info[0]
                                                .turnAngle ||
                                        (this.isTemplate &&
                                            val[
                                                paramStr
                                            ].info[0].hasOwnProperty(
                                                "turnAngle"
                                            ))
                                            ? `${paramStr}.info.0.turnAngle&转向角关联使能switch&${val[paramStr].info[0].turnAngle}`
                                            : null;
                                    this.setForm[objName].info[0].turnSignal =
                                        val[paramStr].info[0].turnSignal !=
                                            this.oldForm[paramStr].info[0]
                                                .turnSignal ||
                                        (this.isTemplate &&
                                            val[
                                                paramStr
                                            ].info[0].hasOwnProperty(
                                                "turnSignal"
                                            ))
                                            ? `${paramStr}.info.0.turnSignal&转向灯关联使能switch&${val[paramStr].info[0].turnSignal}`
                                            : null;
                                    this.setForm[objName].info[0].detect =
                                        this.isEqual(
                                            val[paramStr].info[0].detect,
                                            this.oldForm[paramStr].info[0]
                                                .detect
                                        ) ||
                                        (this.isTemplate &&
                                            val[
                                                paramStr
                                            ].info[0].hasOwnProperty("detect"))
                                            ? `${paramStr}.info.0.detect&检测类型array&${this.getLabelSelfArr(
                                                  typeItem.detectList,
                                                  val[paramStr].info[0].detect
                                              )}&${
                                                  val[paramStr].info[0].detect
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
                                    this.setForm[objName].info[0].area =
                                        JSON.stringify(
                                            val[paramStr].info[0].area
                                        ) !=
                                            JSON.stringify(
                                                this.oldForm[paramStr].info[0]
                                                    .area
                                            ) ||
                                        (this.isTemplate &&
                                            val[
                                                paramStr
                                            ].info[0].hasOwnProperty("area"))
                                            ? `${paramStr}.info.0.area&标定检测区域&新区域&${JSON.stringify(
                                                  val[paramStr].info[0].area
                                              )}`
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
                        BSD: this.setForm,
                    });
                }
            },
            deep: true,
            immediate: true,
        },
    },
    methods: {
        getSpeedValue() {
            let speedArr = [999999999];
            for (let key of Object.keys(this.newForm)) {
                if (key.indexOf("param938") > -1) {
                    this.newForm[key].info.forEach((item) => {
                        if (item.enable && typeof item.speed === "number") {
                            speedArr.push(item.speed);
                        }
                    });
                }
            }
            return Math.min(...speedArr);
        },
        handleClose(done) {
            if (!this.isPlugin) this.$refs.BSDNoPlugin.cancel(true);
            else {
                done();
            }
        },
        initConfig() {
            this.$emit("setFormLoading", true);
            let initConfigList = [];
            this.BSDList = [];
            this.chanNoActive = `通道${this.capability.intelliDrive_BSD[0].chanNo}`;
            this.capability.intelliDrive_BSD.forEach((chanNoItem) => {
                let obj = {
                    ...chanNoItem,
                    info: {},
                };
                obj["cameraPosList"] = this.getEnumerationValue(
                    chanNoItem.cameraPos,
                    "intelliDrive_BSD_cameraPos"
                );
                chanNoItem.info.forEach((infoItem) => {
                    infoItem.detectList = this.getEnumerationValue(
                        infoItem.detect,
                        "intelliDrive_BSD_detect"
                    );
                    /* --------------------算法灵敏度 start-------------------------*/
                    infoItem.sensitivityList = [];
                    if (infoItem.sensitivity) {
                        let sensitivityRange =
                            infoItem.sensitivity.max - infoItem.sensitivity.min;
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
                    }
                    /* --------------------算法灵敏度 end-------------------------*/
                    /* --------------------算法置信度 start-------------------------*/
                    infoItem.confidenceList = [];
                    if (infoItem.confidence) {
                        let confidenceRange =
                            infoItem.confidence.max - infoItem.confidence.min;
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
                    for (let key of Object.keys(
                        this.enumerationJSON["intelliDrive_BSD_type"]
                    )) {
                        if (
                            this.enumerationJSON["intelliDrive_BSD_type"][
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
                            920,
                            {
                                type: infoItem.type,
                                chanNo: chanNoItem.chanNo,
                            },
                            "BSD"
                        )
                    );
                });
                this.BSDList.push(obj);
            });
            Promise.all(initConfigList).then((result) => {
                this.$emit("setFormLoading", false);
                this.$emit("loadingSuccess");
                this.typeObj = {};
                this.BSDList.forEach((item) => {
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
                        if (this.newForm[`param920_${chanNo}_${type}`]) {
                            return type + "";
                        }
                    })
                );
                for (let key of Object.keys(
                    this.enumerationJSON["intelliDrive_BSD_type"]
                )) {
                    if (
                        this.enumerationJSON["intelliDrive_BSD_type"][
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
                this.enumerationJSON["intelliDrive_BSD_type"]
            )) {
                let index =
                    this.enumerationJSON["intelliDrive_BSD_type"][key].indexOf(
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
        getLabelSelf(arr, val) {
            let attribute = arr.find((e) => e.value === val);
            if (attribute) {
                return attribute.label;
            } else {
                return null;
            }
        },
        collapseChange(val) {
            if (val.length) {
                setTimeout(() => {
                    this.labelWidthResize();
                }, 300);
            }
        },

        initWebControl(obj, id, height, width) {
            let that = this;
            return (obj = new WebControl({
                szPluginContainer: id,
                iServicePortStart: 14450,
                iServicePortEnd: 14452,
                szClassId: "58BC9428-61BE-4F39-ABA3-89452662A4A0",
                cbConnectSuccess: () => {
                    obj.JS_StartService("window", {
                        dllPath: "./WebVersion.dll",
                    }).then(
                        () => {
                            obj.JS_CreateWnd("id", width, height).then(
                                function () {
                                    obj.JS_RequestInterface({
                                        funcName: "GetControlVersion",
                                        arguments: {},
                                    }).then((oData) => {
                                        if (oData.responseMsg.error === 0) {

                                            let pluginVersion =
                                                oData.responseMsg.version.toString();
                                            let params = {
                                                pluginVersion: pluginVersion,
                                            };

                                            that.$api
                                                .comparePluginVersion(params)
                                                .then((res) => {
                                                    if (res.success) {
                                                        let isLastVerson =
                                                            res.data;
                                                        if (isLastVerson) {



                                                            that.notLastVerson = false;
                                                        } else {






                                                            that.notLastVerson = true;
                                                            document.body.scrollTop =
                                                                document.documentElement.scrollTop = 0;







                                                            that.$confirm(
                                                                "当前控件版本不是最新,是否要下载最新控件,下载安装后需刷新页面。",
                                                                this.$t(
                                                                    "common.prompt"
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
                                                        that.$message.error(
                                                            "调用控件版本比对接口失败！"
                                                        );
                                                    }
                                                });
                                        } else {
                                            that.$message.error(
                                                "查询控件版本号失败！"
                                            );
                                        }
                                    });
                                }
                            );
                        },
                        function () {
                            that.$message.error("查询版本控件启动失败!!!!");
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
                    this.$message.error("获取控件URL失败:" + res.msg);
                }
            });
        },
        refreshPage() {
            location.reload();
        },
        wakeUpOcx() {
            WebControl.JS_WakeUp("HATConfigCtrlPlugin://");
        },
        reDownLoad() {
            document.body.scrollTop = document.documentElement.scrollTop = 0;
            this.$confirm(
                "当前控件版本不是最新,是否要下载最新控件,下载安装后需刷新页面。",
                this.$t("common.prompt"),
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
        openSurvey(surveyObj) {
            if (
                !this.isTemplate &&
                (this.deviceInfo.deviceStatus == 0 ||
                    (this.deviceInfo.deviceStatus == 2 &&
                        this.deviceInfo.dormantStatus == 1))
            ) {
                this.$message.warning(
                    `设备处于${
                        this.deviceInfo.deviceStatus == 0 ? "离线" : "深休眠"
                    }状态，无法进行标定操作！`
                );
                return;
            }
            this.surveyObj = surveyObj;
            let areaArr =
                this.newForm[
                    `param920_${this.surveyObj.chanNo}_${this.surveyObj.type}`
                ].info[0].area;
            this.dialogClick = true;
            this.openSurveyBol = true;
            let areaContent = [
                {
                    typeName: "一级区域",
                    polygon: [],
                },
                {
                    typeName: "二级区域",
                    polygon: [],
                },
                {
                    typeName: "三级区域",
                    polygon: [],
                },
            ];
            areaArr.forEach((item, index) => {
                switch (index + 1) {
                    case 1:
                        for (let i = 0; i < item.length; i++) {
                            areaContent[0].polygon.push({
                                x: parseInt(item[i].x),
                                y: parseInt(item[i].y),
                            });
                        }
                        break;
                    case 2:
                        for (let i = 0; i < item.length; i++) {
                            areaContent[1].polygon.push({
                                x: parseInt(item[i].x),
                                y: parseInt(item[i].y),
                            });
                        }
                        break;
                    default:
                        for (let i = 0; i < item.length; i++) {
                            areaContent[2].polygon.push({
                                x: parseInt(item[i].x),
                                y: parseInt(item[i].y),
                            });
                        }
                        break;
                }
            });
            let params = {
                deviceId: this.$route.query.deviceId || null,
                channelNo: this.chanNoActive.split("通道")[1],
                protocolType: this.isPlugin ? 0 : 3,
            };
            this.$api.previewPlay(params).then((res) => {
                if (res.success) {
                    this.playUrl = res.data;
                } else {

                }
                this.$nextTick(() => {
                    if (!this.isPlugin) {
                        this.$refs.BSDNoPlugin.openHatPlugin(
                            this.playUrl,
                            areaContent,
                            !this.isTemplate
                        );
                    } else {

                        this.noneVideoPlay = false;
                        let box = document.getElementById("videoPlay_BSD");
                        let offsetHeight = box.offsetHeight;
                        let offsetWidth = box.offsetWidth;
                        this.videoPlayControl = this.initWebOcx(
                            this.videoPlayControl,
                            "videoPlay_BSD",
                            offsetWidth,
                            offsetHeight,
                            areaContent
                        );
                        setTimeout(() => {
                            this.webVersionControl = this.initWebControl(
                                this.webVersionControl,
                                "AEStreamWebVersion",
                                0,
                                0
                            );
                        }, 2000);
                    }
                });
            });
        },
        initWebOcx(obj, id, width, height, item) {
            let this_ = this;
            return (obj = new WebControl({
                szPluginContainer: id,
                iServicePortStart: 14450,
                iServicePortEnd: 14452,
                szClassId: "58BC9428-61BE-4F39-ABA3-89452662A4A0",
                cbConnectSuccess: () => {
                    obj.JS_StartService("window", {
                        dllPath: "./WebAreaCalibration.dll",
                    }).then(
                        () => {
                            this_.setCallbacks();
                            obj.JS_CreateWnd(id, width, height).then(
                                function () {
                                    obj
                                        .JS_RequestInterface({
                                            funcName: "SetBSDAreaParams",
                                            arguments: {
                                                devSerialNum: "E61911993",
                                                deviceType: "AE-AC3141-A",
                                                areas: item,
                                                horizonFrontDefault: [
                                                    {
                                                        typeName: "一级区域",
                                                        polygon: [
                                                            { x: 626, y: 351 },
                                                            { x: 187, y: 636 },
                                                            { x: 79, y: 964 },
                                                            { x: 627, y: 929 },
                                                            { x: 844, y: 504 },
                                                        ],
                                                    },
                                                    {
                                                        typeName: "二级区域",
                                                        polygon: [
                                                            { x: 594, y: 403 },
                                                            { x: 230, y: 686 },
                                                            { x: 144, y: 910 },
                                                            { x: 627, y: 929 },
                                                            { x: 844, y: 504 },
                                                        ],
                                                    },
                                                    {
                                                        typeName: "三级区域",
                                                        polygon: [
                                                            { x: 588, y: 425 },
                                                            { x: 323, y: 712 },
                                                            { x: 236, y: 846 },
                                                            { x: 627, y: 929 },
                                                            { x: 844, y: 504 },
                                                        ],
                                                    },
                                                ],
                                                overlookDefault: [
                                                    {
                                                        typeName: "一级区域",
                                                        polygon: [
                                                            { x: 967, y: 326 },
                                                            { x: 170, y: 454 },
                                                            { x: 60, y: 853 },
                                                            { x: 822, y: 1000 },
                                                            { x: 947, y: 671 },
                                                        ],
                                                    },
                                                    {
                                                        typeName: "二级区域",
                                                        polygon: [
                                                            { x: 925, y: 382 },
                                                            { x: 166, y: 492 },
                                                            { x: 66, y: 821 },
                                                            { x: 776, y: 950 },
                                                            { x: 937, y: 654 },
                                                        ],
                                                    },
                                                    {
                                                        typeName: "三级区域",
                                                        polygon: [
                                                            { x: 884, y: 468 },
                                                            { x: 212, y: 550 },
                                                            { x: 87, y: 810 },
                                                            { x: 763, y: 917 },
                                                            { x: 912, y: 667 },
                                                        ],
                                                    },
                                                ],
                                            },
                                        })
                                        .then(function (oData) {

                                        }),
                                        obj
                                            .JS_RequestInterface({
                                                funcName: "StartRealPlay",
                                                arguments: {
                                                    playUrl: this_.playUrl,
                                                },
                                            })
                                            .then((oData) => {
                                                this_.pluginLoading = false;
                                            });
                                }
                            );
                        },
                        function () {
                            this.$message.error("控件服务启动失败！");
                        }
                    );
                },





                cbIntegrationCallBack(oData) {},
                cbConnectError: () => {
                    obj = null;
                    this.noneVideoPlay = true;
                    this.videoPlayControl = null;

                },
                cbConnectClose: (bNormalClose) => {
                    if (!bNormalClose) {
                        obj = null;
                        this.noneVideoPlay = true;
                        this.videoPlayControl = null;


                    }
                    return null;
                },
            }));
        },
        setCallbacks() {
            if (this.videoPlayControl) {
                this.videoPlayControl.JS_SetWindowControlCallback({
                    cbIntegrationCallBack: this.cbIntegrationCallBack,
                });
            }
        },
        cancelSurveyBol() {
            this.openSurveyBol = false;
        },
        saveSurveyBol(bsdInfo) {
            let dataArr = [[], [], []];
            bsdInfo.forEach((item) => {
                switch (item.tips) {
                    case "一级区域":
                        for (let i = 0; i < item.points.length; i++) {
                            dataArr[0].push({
                                x: item.points[i][0] * 1000,
                                y: item.points[i][1] * 1000,
                            });
                        }
                        break;
                    case "二级区域":
                        for (let i = 0; i < item.points.length; i++) {
                            dataArr[1].push({
                                x: item.points[i][0] * 1000,
                                y: item.points[i][1] * 1000,
                            });
                        }
                        break;
                    default: {
                        for (let i = 0; i < item.points.length; i++) {
                            dataArr[2].push({
                                x: item.points[i][0] * 1000,
                                y: item.points[i][1] * 1000,
                            });
                        }
                        break;
                    }
                }
            });
            this.newForm[
                `param920_${this.surveyObj.chanNo}_${this.surveyObj.type}`
            ].info[0].area = dataArr;
            this.$message.success("设置成功，点击下发至终端生效");
            this.openSurveyBol = false;
        },
        cbIntegrationCallBack(oData) {
            let dataArr = [[], [], []];
            if (oData.responseMsg) {
                if (oData.responseMsg.event == "BSDAreaParamsChanged") {
                    oData.responseMsg.msg.areas.forEach((item) => {
                        switch (item.typeName) {
                            case "一级区域":
                                for (let i = 0; i < item.polygon.length; i++) {
                                    dataArr[0].push({
                                        x: item.polygon[i].x,
                                        y: item.polygon[i].y,
                                    });
                                }
                                break;
                            case "二级区域":
                                for (let i = 0; i < item.polygon.length; i++) {
                                    dataArr[1].push({
                                        x: item.polygon[i].x,
                                        y: item.polygon[i].y,
                                    });
                                }
                                break;
                            default: {
                                for (let i = 0; i < item.polygon.length; i++) {
                                    dataArr[2].push({
                                        x: item.polygon[i].x,
                                        y: item.polygon[i].y,
                                    });
                                }
                                break;
                            }
                        }
                    });
                    this.newForm[
                        `param920_${this.surveyObj.chanNo}_${this.surveyObj.type}`
                    ].info[0].area = dataArr;
                    this.$message.success("设置成功，点击下发至终端生效");
                    this.openSurveyBol = false;
                } else if (oData.responseMsg.event == "CancelBtnClicked") {
                    this.openSurveyBol = false;
                    return;
                } else if (oData.responseMsg.event == "RealPlayBtnClicked") {
                    let params = {
                        deviceId: this.$route.query.deviceId || null,
                        channelNo: this.chanNoActive.split("通道")[1],
                        protocolType: this.isPlugin ? 0 : 3,
                    };
                    this.$api.previewPlay(params).then((res) => {
                        if (res.success) {
                            this.playUrl = res.data;
                        } else {
                            this.$message.error("预览失败" + res.msg);
                        }
                        this.$nextTick(() => {
                            let box = document.getElementById("videoPlay_BSD");
                            this.videoPlayControl
                                .JS_RequestInterface({
                                    funcName: "StartRealPlay",
                                    arguments: {
                                        playUrl: this.playUrl,
                                    },
                                })
                                .then((oData) => {});
                        });
                    });
                }
            } else {
                this.$message.error("标定区画设置失败");
            }
        },
        SurveyBol() {

            if (this.isPlugin && this.videoPlayControl)
                this.videoPlayControl.JS_DestroyWnd().then(
                    () => {},
                    () => {}
                );
            this.openSurveyBol = false;
        },
        speedBlur(chanNoItem, key) {
            if (chanNoItem.info[key].length > 1 && !this.isTemplate) {
                if (
                    this.newForm[
                        `param920_${chanNoItem.chanNo}_${chanNoItem.info[key][1].type}`
                    ].info[0].speed -
                        this.newForm[
                            `param920_${chanNoItem.chanNo}_${chanNoItem.info[key][0].type}`
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
        uploadChange(val, attr, chanNo, type) {
            this.newForm[`param920_${chanNo}_${type}`].info[0][attr].save = val;
            this.$emit("formDataChange", `param920_${chanNo}_${type}`, {
                ...this.newForm[`param920_${chanNo}_${type}`],
            });
        },
    },
};
</script>
<style lang="less" scoped>
@import "./configurationForm.less";
.el-radio-group {
    margin-bottom: 20px;
}
.divHeight {
    height: 500px;
    width: 800;
}
</style>
