<template>
    <div class="configuration-form">
        <el-form
            :label-width="`${labelWidth}px`"
            :model="newForm"
            :inline="true"
            ref="form"
        >
            <div
                v-if="
                    newForm['param957'] &&
                    capability['intelliDrive_warn'] &&
                    capability['intelliDrive_warn']['overSpeed']
                "
            >
                <h3>超速报警</h3>
                <el-form-item
                    label="超速持续时间"
                    v-if="
                        capability['intelliDrive_warn'] &&
                        capability['intelliDrive_warn']['overSpeed'] &&
                        capability['intelliDrive_warn']['overSpeed']['duration']
                    "
                >
                    <el-input-number
                        :precision="0"
                        controls-position="right"
                        v-model="newForm['param957'].duration"
                        :min="
                            capability.intelliDrive_warn.overSpeed.duration.min
                        "
                        :max="
                            capability.intelliDrive_warn.overSpeed.duration.max
                        "
                        data-unit="s"
                        @blur="
                            (e) => {
                                if (e.target.value === '') {
                                    newForm['param957'].duration = Number(
                                        e.target.ariaValueMin
                                    );
                                }
                            }
                        "
                    ></el-input-number>
                </el-form-item>
                <el-form-item
                    label="超速预警差值"
                    v-if="
                        capability['intelliDrive_warn'] &&
                        capability['intelliDrive_warn']['overSpeed'] &&
                        capability['intelliDrive_warn']['overSpeed'][
                            'speedDifference'
                        ]
                    "
                >
                    <el-input-number
                        :precision="0"
                        controls-position="right"
                        v-model="newForm['param957'].speedDifference"
                        :min="
                            capability.intelliDrive_warn.overSpeed
                                .speedDifference.min
                        "
                        :max="
                            capability.intelliDrive_warn.overSpeed
                                .speedDifference.max
                        "
                        data-unit="km/h"
                        @blur="
                            (e) => {
                                if (e.target.value === '') {
                                    newForm['param957'].speedDifference =
                                        Number(e.target.ariaValueMin);
                                }
                            }
                        "
                    ></el-input-number>
                </el-form-item>
                <el-form-item
                    label="日间超速阈值"
                    v-if="
                        capability['intelliDrive_warn'] &&
                        capability['intelliDrive_warn']['overSpeed'] &&
                        capability['intelliDrive_warn']['overSpeed'][
                            'speedThreshold'
                        ]
                    "
                >
                    <el-input-number
                        :precision="0"
                        controls-position="right"
                        v-model="newForm['param957'].speedThreshold"
                        :min="
                            capability.intelliDrive_warn.overSpeed
                                .speedThreshold.min
                        "
                        :max="
                            capability.intelliDrive_warn.overSpeed
                                .speedThreshold.max
                        "
                        data-unit="km/h"
                        @blur="
                            (e) => {
                                if (e.target.value === '') {
                                    newForm['param957'].speedThreshold = Number(
                                        e.target.ariaValueMin
                                    );
                                }
                            }
                        "
                    ></el-input-number>
                </el-form-item>
                <el-form-item
                    label="夜间超速阈值"
                    v-if="
                        capability['intelliDrive_warn'] &&
                        capability['intelliDrive_warn']['overSpeed'] &&
                        capability['intelliDrive_warn']['overSpeed'][
                            'nightSpeedThreshold'
                        ]
                    "
                >
                    <el-input-number
                        :precision="0"
                        controls-position="right"
                        v-model="newForm['param957'].nightSpeedThreshold"
                        :min="
                            capability.intelliDrive_warn.overSpeed
                                .nightSpeedThreshold.min
                        "
                        :max="
                            capability.intelliDrive_warn.overSpeed
                                .nightSpeedThreshold.max
                        "
                        data-unit="km/h"
                        @blur="
                            (e) => {
                                if (e.target.value === '') {
                                    newForm['param957'].nightSpeedThreshold =
                                        Number(e.target.ariaValueMin);
                                }
                            }
                        "
                    ></el-input-number>
                </el-form-item>
                <el-form-item
                    label="夜间超速百分比"
                    v-if="
                        capability['intelliDrive_warn'] &&
                        capability['intelliDrive_warn']['overSpeed'] &&
                        capability['intelliDrive_warn']['overSpeed'][
                            'nightOverSpeedPercent'
                        ]
                    "
                >
                    <el-input-number
                        :precision="0"
                        controls-position="right"
                        v-model="newForm['param957'].nightOverSpeedPercent"
                        :min="
                            capability.intelliDrive_warn.overSpeed
                                .nightOverSpeedPercent.rangeMin
                        "
                        :max="
                            capability.intelliDrive_warn.overSpeed
                                .nightOverSpeedPercent.rangeMax
                        "
                        data-unit="%"
                        @blur="
                            (e) => {
                                if (e.target.value === '') {
                                    newForm['param957'].nightOverSpeedPercent =
                                        Number(e.target.ariaValueMin);
                                }
                            }
                        "
                    ></el-input-number>
                </el-form-item>
            </div>
            <div
                v-if="
                    newForm['param924'] &&
                    capability['intelliDrive_warn'] &&
                    capability['intelliDrive_warn']['overtimeDriving']
                "
            >
                <h3>超时驾驶</h3>
                <h2>疲劳驾驶</h2>
                <el-form-item
                    label="日间起始时间"
                    v-if="
                        capability['intelliDrive_warn'] &&
                        capability['intelliDrive_warn']['overtimeDriving'] &&
                        capability['intelliDrive_warn']['overtimeDriving'][
                            'daylightStartTime'
                        ]
                    "
                >
                    <el-time-select
                        v-model="newForm['param924'].daylightStartTime"
                        placeholder="选择时间"
                        :clearable="false"
                        :picker-options="{
                            start: '00:00',
                            step: '00:01',
                            end: '23:59',
                        }"
                    >
                    </el-time-select>
                    
                </el-form-item>
                <el-form-item
                    label="日间结束时间"
                    v-if="
                        capability['intelliDrive_warn'] &&
                        capability['intelliDrive_warn']['overtimeDriving'] &&
                        capability['intelliDrive_warn']['overtimeDriving'][
                            'daylightEndTime'
                        ]
                    "
                >
                    <el-time-select
                        v-model="newForm['param924'].daylightEndTime"
                        placeholder="选择时间"
                        :clearable="false"
                        :picker-options="{
                            start: '00:00',
                            step: '00:01',
                            end: '23:59',
                        }"
                    >
                    </el-time-select>
                    
                </el-form-item>
                <el-form-item
                    label="日间连续驾驶时长"
                    v-if="
                        capability['intelliDrive_warn'] &&
                        capability['intelliDrive_warn']['overtimeDriving'] &&
                        capability['intelliDrive_warn']['overtimeDriving'][
                            'daylightDrivingTimeMax'
                        ]
                    "
                >
                    <el-input-number
                        :precision="0"
                        controls-position="right"
                        v-model="newForm['param924'].daylightDrivingTimeMax"
                        :min="
                            capability.intelliDrive_warn.overtimeDriving
                                .daylightDrivingTimeMax[0] / 60
                        "
                        :max="
                            capability.intelliDrive_warn.overtimeDriving
                                .daylightDrivingTimeMax[1] / 60
                        "
                        data-unit="min"
                        @blur="
                            (e) => {
                                if (e.target.value === '') {
                                    newForm['param924'].daylightDrivingTimeMax =
                                        Number(e.target.ariaValueMin);
                                }
                            }
                        "
                    ></el-input-number>
                </el-form-item>
                <el-form-item
                    label="日间连续休息时长"
                    v-if="
                        capability['intelliDrive_warn'] &&
                        capability['intelliDrive_warn']['overtimeDriving'] &&
                        capability['intelliDrive_warn']['overtimeDriving'][
                            'restTimeMin'
                        ]
                    "
                >
                    <el-input-number
                        :precision="0"
                        controls-position="right"
                        v-model="newForm['param924'].restTimeMin"
                        :min="
                            capability.intelliDrive_warn.overtimeDriving
                                .restTimeMin[0] / 60
                        "
                        :max="
                            capability.intelliDrive_warn.overtimeDriving
                                .restTimeMin[1] / 60
                        "
                        data-unit="min"
                        @blur="
                            (e) => {
                                if (e.target.value === '') {
                                    newForm['param924'].restTimeMin = Number(
                                        e.target.ariaValueMin
                                    );
                                }
                            }
                        "
                    ></el-input-number>
                </el-form-item>
                <el-form-item
                    label="夜间连续驾驶时长"
                    v-if="
                        capability['intelliDrive_warn'] &&
                        capability['intelliDrive_warn']['overtimeDriving'] &&
                        capability['intelliDrive_warn']['overtimeDriving'][
                            'nightDrivingTimeMax'
                        ]
                    "
                >
                    <el-input-number
                        :precision="0"
                        controls-position="right"
                        v-model="newForm['param924'].nightDrivingTimeMax"
                        :min="
                            capability.intelliDrive_warn.overtimeDriving
                                .nightDrivingTimeMax[0] / 60
                        "
                        :max="
                            capability.intelliDrive_warn.overtimeDriving
                                .nightDrivingTimeMax[1] / 60
                        "
                        data-unit="min"
                        @blur="
                            (e) => {
                                if (e.target.value === '') {
                                    newForm['param924'].nightDrivingTimeMax =
                                        Number(e.target.ariaValueMin);
                                }
                            }
                        "
                    ></el-input-number>
                </el-form-item>
                <el-form-item
                    label="夜间连续休息时长"
                    v-if="
                        capability['intelliDrive_warn'] &&
                        capability['intelliDrive_warn']['overtimeDriving'] &&
                        capability['intelliDrive_warn']['overtimeDriving'][
                            'nightDrivingRestTime'
                        ]
                    "
                >
                    <el-input-number
                        :precision="0"
                        controls-position="right"
                        v-model="newForm['param924'].nightDrivingRestTime"
                        :min="
                            capability.intelliDrive_warn.overtimeDriving
                                .nightDrivingRestTime[0] / 60
                        "
                        :max="
                            capability.intelliDrive_warn.overtimeDriving
                                .nightDrivingRestTime[1] / 60
                        "
                        data-unit="min"
                        @blur="
                            (e) => {
                                if (e.target.value === '') {
                                    newForm['param924'].nightDrivingRestTime =
                                        Number(e.target.ariaValueMin);
                                }
                            }
                        "
                    ></el-input-number>
                </el-form-item>
                <h2
                    v-if="
                        newForm['param924'] &&
                        capability['intelliDrive_warn'] &&
                        capability['intelliDrive_warn']['overtimeDriving'] &&
                        (capability['intelliDrive_warn']['overtimeDriving'][
                            'allDayDrivingTimeMaxEnable'
                        ] ||
                            capability['intelliDrive_warn']['overtimeDriving'][
                                'allDayDrivingTimeMax'
                            ] ||
                            capability['intelliDrive_warn']['overtimeDriving'][
                                'deltaWarnTime'
                            ])
                    "
                >
                    累计驾驶超时
                </h2>
                <el-form-item
                    label="全天累计驾驶时间门限使能"
                    v-if="
                        capability['intelliDrive_warn'] &&
                        capability['intelliDrive_warn']['overtimeDriving'] &&
                        capability['intelliDrive_warn']['overtimeDriving'][
                            'allDayDrivingTimeMaxEnable'
                        ]
                    "
                >
                    <el-switch
                        v-model="newForm['param924'].allDayDrivingTimeMaxEnable"
                        :active-value="Number(1)"
                        :inactive-value="Number(0)"
                    ></el-switch>
                </el-form-item>
                <el-form-item
                    label="全天累计驾驶时间门限"
                    v-if="
                        capability['intelliDrive_warn'] &&
                        capability['intelliDrive_warn']['overtimeDriving'] &&
                        capability['intelliDrive_warn']['overtimeDriving'][
                            'allDayDrivingTimeMax'
                        ]
                    "
                >
                    <el-input-number
                        :precision="0"
                        controls-position="right"
                        v-model="newForm['param924'].allDayDrivingTimeMax"
                        :min="
                            capability.intelliDrive_warn.overtimeDriving
                                .allDayDrivingTimeMax[0] / 3600
                        "
                        :max="
                            capability.intelliDrive_warn.overtimeDriving
                                .allDayDrivingTimeMax[1] / 3600
                        "
                        data-unit="h"
                        @blur="
                            (e) => {
                                if (e.target.value === '') {
                                    newForm['param924'].allDayDrivingTimeMax =
                                        Number(e.target.ariaValueMin);
                                }
                            }
                        "
                    ></el-input-number>
                </el-form-item>
                <el-form-item
                    label="预警差值时间"
                    v-if="
                        capability['intelliDrive_warn'] &&
                        capability['intelliDrive_warn']['overtimeDriving'] &&
                        capability['intelliDrive_warn']['overtimeDriving'][
                            'deltaWarnTime'
                        ]
                    "
                >
                    <el-input-number
                        :precision="0"
                        controls-position="right"
                        v-model="newForm['param924'].deltaWarnTime"
                        :min="
                            capability.intelliDrive_warn.overtimeDriving
                                .deltaWarnTime[0] / 60
                        "
                        :max="
                            capability.intelliDrive_warn.overtimeDriving
                                .deltaWarnTime[1] / 60
                        "
                        data-unit="min"
                        @blur="
                            (e) => {
                                if (e.target.value === '') {
                                    newForm['param924'].deltaWarnTime = Number(
                                        e.target.ariaValueMin
                                    );
                                }
                            }
                        "
                    ></el-input-number>
                </el-form-item>
            </div>
            <div v-if="newForm[`param1303`] && alarmInfo.length">
                <h3>业务报警</h3>
                <el-collapse>
                    <el-collapse-item
                        v-for="(tabItem, index) in alarmInfo"
                        :key="index"
                        :title="tabItem.label"
                        :name="tabItem.label"
                        arrowPlacement="right"
                    >
                        <template v-if="newForm[`param1303`].alarmList">
                            <el-form-item
                                label="限制模型使能"
                                v-if="tabItem.enabled"
                            >
                                <el-select
                                    v-model="
                                        newForm[`param1303`].alarmList[index][
                                            'enabled'
                                        ]
                                    "
                                    multiple
                                    collapse-tags
                                >
                                    <el-option
                                        v-for="item in tabItem.enabledList"
                                        :label="item.label"
                                        :value="item.value"
                                        :key="item.value"
                                    ></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item
                                label="限制优先级"
                                v-if="tabItem.priority"
                            >
                                <el-input-number
                                    :precision="0"
                                    controls-position="right"
                                    v-model="
                                        newForm[`param1303`].alarmList[index][
                                            'priority'
                                        ]
                                    "
                                    :min="tabItem.priority.min"
                                    :max="tabItem.priority.max"
                                    @blur="
                                        (e) => {
                                            if (e.target.value === '') {
                                                newForm[`param1303`].alarmList[
                                                    index
                                                ]['priority'] = Number(
                                                    e.target.ariaValueMin
                                                );
                                            }
                                        }
                                    "
                                ></el-input-number>
                            </el-form-item>
                            <el-form-item
                                label="限制速度"
                                v-if="tabItem.limitSpeed"
                            >
                                <el-input-number
                                    :precision="0"
                                    controls-position="right"
                                    v-model="
                                        newForm[`param1303`].alarmList[index][
                                            'limitSpeed'
                                        ]
                                    "
                                    :min="tabItem.limitSpeed.min"
                                    :max="tabItem.limitSpeed.max"
                                    data-unit="km/h"
                                    @blur="
                                        (e) => {
                                            if (e.target.value === '') {
                                                newForm[`param1303`].alarmList[
                                                    index
                                                ]['limitSpeed'] = Number(
                                                    e.target.ariaValueMin
                                                );
                                            }
                                        }
                                    "
                                ></el-input-number>
                            </el-form-item>
                            <el-form-item
                                label="触发速度"
                                v-if="tabItem.triggerSpeed"
                            >
                                <el-input-number
                                    :precision="0"
                                    controls-position="right"
                                    v-model="
                                        newForm[`param1303`].alarmList[index][
                                            'triggerSpeed'
                                        ]
                                    "
                                    :min="tabItem.triggerSpeed.min"
                                    :max="tabItem.triggerSpeed.max"
                                    data-unit="km/h"
                                    @blur="
                                        (e) => {
                                            if (e.target.value === '') {
                                                newForm[`param1303`].alarmList[
                                                    index
                                                ]['triggerSpeed'] = Number(
                                                    e.target.ariaValueMin
                                                );
                                            }
                                        }
                                    "
                                ></el-input-number>
                            </el-form-item>
                            <el-form-item
                                label="持续时间"
                                v-if="tabItem.continueTime"
                            >
                                <el-input-number
                                    :precision="0"
                                    controls-position="right"
                                    v-model="
                                        newForm[`param1303`].alarmList[index][
                                            'continueTime'
                                        ]
                                    "
                                    :min="tabItem.continueTime.min"
                                    :max="tabItem.continueTime.max"
                                    data-unit="s"
                                    @blur="
                                        (e) => {
                                            if (e.target.value === '') {
                                                newForm[`param1303`].alarmList[
                                                    index
                                                ]['continueTime'] = Number(
                                                    e.target.ariaValueMin
                                                );
                                            }
                                        }
                                    "
                                ></el-input-number>
                            </el-form-item>
                            <el-form-item label="限制掩码" v-if="tabItem.mask">
                                <el-input-number
                                    :precision="0"
                                    controls-position="right"
                                    v-model="
                                        newForm[`param1303`].alarmList[index][
                                            'mask'
                                        ]
                                    "
                                    :min="tabItem.mask.min"
                                    :max="tabItem.mask.max"
                                    @blur="
                                        (e) => {
                                            if (e.target.value === '') {
                                                newForm[`param1303`].alarmList[
                                                    index
                                                ]['mask'] = Number(
                                                    e.target.ariaValueMin
                                                );
                                            }
                                        }
                                    "
                                ></el-input-number>
                            </el-form-item>
                        </template>
                    </el-collapse-item>
                </el-collapse>
            </div>
            <div v-if="gsensorTurn && gsensorTurn.length">
                <h3>路口报警</h3>
                <el-collapse>
                    <el-collapse-item
                        v-for="(tabItem, index) in gsensorTurn"
                        :key="index"
                        :title="tabItem.label"
                        :name="tabItem.label"
                        arrowPlacement="right"
                    >
                        <template
                            v-if="
                                newForm[`param1315_${tabItem.gsensorTurnType}`]
                            "
                        >
                            <el-form-item
                                label="报警使能"
                                v-if="tabItem.turnList[0].enabled"
                            >
                                <el-switch
                                    v-model="
                                        newForm[
                                            `param1315_${tabItem.gsensorTurnType}`
                                        ].turnList[0].enabled
                                    "
                                    :active-value="Number(1)"
                                    :inactive-value="Number(0)"
                                ></el-switch>
                            </el-form-item>
                            <el-form-item
                                label="车速限制速度"
                                v-if="tabItem.turnList[0].limitSpeed"
                            >
                                <el-input-number
                                    :precision="0"
                                    controls-position="right"
                                    v-model="
                                        newForm[
                                            `param1315_${tabItem.gsensorTurnType}`
                                        ].turnList[0].limitSpeed
                                    "
                                    :min="tabItem.turnList[0].limitSpeed.min"
                                    :max="tabItem.turnList[0].limitSpeed.max"
                                    data-unit="km/h"
                                    @blur="
                                        (e) => {
                                            if (e.target.value === '') {
                                                newForm[
                                                    `param1315_${tabItem.gsensorTurnType}`
                                                ].turnList[0].limitSpeed =
                                                    Number(
                                                        e.target.ariaValueMin
                                                    );
                                            }
                                        }
                                    "
                                ></el-input-number>
                            </el-form-item>
                            <el-form-item
                                label="报警音量"
                                v-if="
                                    tabItem.turnList[0].EventTriggerList &&
                                    tabItem.turnList[0].EventTriggerList[0] &&
                                    tabItem.turnList[0].EventTriggerList[0]
                                        .volume
                                "
                            >
                                <el-input-number
                                    :precision="0"
                                    controls-position="right"
                                    v-model="
                                        newForm[
                                            `param1315_${tabItem.gsensorTurnType}`
                                        ].turnList[0].EventTriggerList[0].volume
                                    "
                                    :min="
                                        tabItem.turnList[0].EventTriggerList[0]
                                            .volume.min
                                    "
                                    :max="
                                        tabItem.turnList[0].EventTriggerList[0]
                                            .volume.max
                                    "
                                    @blur="
                                        (e) => {
                                            if (e.target.value === '') {
                                                newForm[
                                                    `param1315_${tabItem.gsensorTurnType}`
                                                ].turnList[0].EventTriggerList[0].volume =
                                                    Number(
                                                        e.target.ariaValueMin
                                                    );
                                            }
                                        }
                                    "
                                ></el-input-number>
                            </el-form-item>
                            <el-form-item
                                label="车辆目标灵敏度"
                                v-if="tabItem.turnList[0].sensitivity"
                            >
                                <el-input-number
                                    :precision="0"
                                    controls-position="right"
                                    v-model="
                                        newForm[
                                            `param1315_${tabItem.gsensorTurnType}`
                                        ].turnList[0].sensitivity
                                    "
                                    :min="tabItem.turnList[0].sensitivity.min"
                                    :max="tabItem.turnList[0].sensitivity.max"
                                    @blur="
                                        (e) => {
                                            if (e.target.value === '') {
                                                newForm[
                                                    `param1315_${tabItem.gsensorTurnType}`
                                                ].turnList[0].sensitivity =
                                                    Number(
                                                        e.target.ariaValueMin
                                                    );
                                            }
                                        }
                                    "
                                ></el-input-number>
                            </el-form-item>
                            <el-form-item
                                label="报警间隔时间"
                                v-if="tabItem.turnList[0].intervalTime"
                            >
                                <el-input-number
                                    :precision="0"
                                    controls-position="right"
                                    v-model="
                                        newForm[
                                            `param1315_${tabItem.gsensorTurnType}`
                                        ].turnList[0].intervalTime
                                    "
                                    :min="tabItem.turnList[0].intervalTime.min"
                                    :max="tabItem.turnList[0].intervalTime.max"
                                    data-unit="s"
                                    @blur="
                                        (e) => {
                                            if (e.target.value === '') {
                                                newForm[
                                                    `param1315_${tabItem.gsensorTurnType}`
                                                ].turnList[0].intervalTime =
                                                    Number(
                                                        e.target.ariaValueMin
                                                    );
                                            }
                                        }
                                    "
                                ></el-input-number>
                            </el-form-item>
                            <el-form-item
                                label="图片上报使能"
                                v-if="tabItem.turnList[0].uploadPicEnabled"
                            >
                                <el-switch
                                    v-model="
                                        newForm[
                                            `param1315_${tabItem.gsensorTurnType}`
                                        ].turnList[0].uploadPicEnabled
                                    "
                                    :active-value="Number(1)"
                                    :inactive-value="Number(0)"
                                ></el-switch>
                            </el-form-item>
                            <el-form-item
                                label="抓图张数"
                                v-if="tabItem.turnList[0].pictureNum"
                            >
                                <el-input-number
                                    :precision="0"
                                    controls-position="right"
                                    v-model="
                                        newForm[
                                            `param1315_${tabItem.gsensorTurnType}`
                                        ].turnList[0].pictureNum
                                    "
                                    :min="tabItem.turnList[0].pictureNum.min"
                                    :max="tabItem.turnList[0].pictureNum.max"
                                    data-unit="张"
                                    @blur="
                                        (e) => {
                                            if (e.target.value === '') {
                                                newForm[
                                                    `param1315_${tabItem.gsensorTurnType}`
                                                ].turnList[0].pictureNum =
                                                    Number(
                                                        e.target.ariaValueMin
                                                    );
                                            }
                                        }
                                    "
                                ></el-input-number>
                            </el-form-item>
                            <el-form-item
                                label="抓图间隔时间"
                                v-if="tabItem.turnList[0].snapIntervalTime"
                            >
                                <el-input-number
                                    :precision="0"
                                    controls-position="right"
                                    v-model="
                                        newForm[
                                            `param1315_${tabItem.gsensorTurnType}`
                                        ].turnList[0].snapIntervalTime
                                    "
                                    :min="
                                        tabItem.turnList[0].snapIntervalTime.min
                                    "
                                    :max="
                                        tabItem.turnList[0].snapIntervalTime.max
                                    "
                                    data-unit="s"
                                    @blur="
                                        (e) => {
                                            if (e.target.value === '') {
                                                newForm[
                                                    `param1315_${tabItem.gsensorTurnType}`
                                                ].turnList[0].snapIntervalTime =
                                                    Number(
                                                        e.target.ariaValueMin
                                                    );
                                            }
                                        }
                                    "
                                ></el-input-number>
                            </el-form-item>
                            <el-form-item
                                label="视频上报使能"
                                v-if="tabItem.turnList[0].uploadVideoEnabled"
                            >
                                <el-switch
                                    v-model="
                                        newForm[
                                            `param1315_${tabItem.gsensorTurnType}`
                                        ].turnList[0].uploadVideoEnabled
                                    "
                                    :active-value="Number(1)"
                                    :inactive-value="Number(0)"
                                ></el-switch>
                            </el-form-item>
                            <el-form-item
                                label="小视频预录时间"
                                v-if="tabItem.turnList[0].videoPreRecordTime"
                            >
                                <el-input-number
                                    :precision="0"
                                    controls-position="right"
                                    v-model="
                                        newForm[
                                            `param1315_${tabItem.gsensorTurnType}`
                                        ].turnList[0].videoPreRecordTime
                                    "
                                    :min="
                                        tabItem.turnList[0].videoPreRecordTime
                                            .min
                                    "
                                    :max="
                                        tabItem.turnList[0].videoPreRecordTime
                                            .max
                                    "
                                    data-unit="s"
                                    @blur="
                                        (e) => {
                                            if (e.target.value === '') {
                                                newForm[
                                                    `param1315_${tabItem.gsensorTurnType}`
                                                ].turnList[0].videoPreRecordTime =
                                                    Number(
                                                        e.target.ariaValueMin
                                                    );
                                            }
                                        }
                                    "
                                ></el-input-number>
                            </el-form-item>
                            <el-form-item
                                label="小视频延录时间"
                                v-if="tabItem.turnList[0].videoDelayRecordTime"
                            >
                                <el-input-number
                                    :precision="0"
                                    controls-position="right"
                                    v-model="
                                        newForm[
                                            `param1315_${tabItem.gsensorTurnType}`
                                        ].turnList[0].videoDelayRecordTime
                                    "
                                    :min="
                                        tabItem.turnList[0].videoDelayRecordTime
                                            .min
                                    "
                                    :max="
                                        tabItem.turnList[0].videoDelayRecordTime
                                            .max
                                    "
                                    data-unit="s"
                                    @blur="
                                        (e) => {
                                            if (e.target.value === '') {
                                                newForm[
                                                    `param1315_${tabItem.gsensorTurnType}`
                                                ].turnList[0].videoDelayRecordTime =
                                                    Number(
                                                        e.target.ariaValueMin
                                                    );
                                            }
                                        }
                                    "
                                ></el-input-number>
                            </el-form-item>
                            <el-form-item
                                label="转向角度"
                                v-if="tabItem.turnList[0].angle"
                            >
                                <el-input-number
                                    :precision="0"
                                    controls-position="right"
                                    v-model="
                                        newForm[
                                            `param1315_${tabItem.gsensorTurnType}`
                                        ].turnList[0].angle
                                    "
                                    :min="tabItem.turnList[0].angle.min"
                                    :max="tabItem.turnList[0].angle.max"
                                    data-unit="°"
                                    @blur="
                                        (e) => {
                                            if (e.target.value === '') {
                                                newForm[
                                                    `param1315_${tabItem.gsensorTurnType}`
                                                ].turnList[0].angle = Number(
                                                    e.target.ariaValueMin
                                                );
                                            }
                                        }
                                    "
                                ></el-input-number>
                            </el-form-item>
                        </template>
                    </el-collapse-item>
                </el-collapse>
            </div>
            <div
                v-if="
                    newForm['param993'] &&
                    newForm['param993'].banTime &&
                    capability['intelliDrive_warn'] &&
                    capability['intelliDrive_warn']['banTime'] &&
                    capability['intelliDrive_warn']['banTime'].length
                "
            >
                <h3>违规驾驶</h3>
                <el-collapse v-model="banTimeActiveName">
                    <el-collapse-item
                        v-for="(tabItem, index) in this.banTime"
                        :key="index"
                        :title="tabItem.label"
                        :name="tabItem.label"
                        arrowPlacement="right"
                    >
                        <template v-if="newForm[`param993`]">
                            <el-form-item
                                label="报警使能"
                                v-if="tabItem['enable']"
                            >
                                <el-switch
                                    v-model="
                                        newForm[`param993`]['banTime'][index]
                                            .enable
                                    "
                                    :active-value="Number(1)"
                                    :inactive-value="Number(0)"
                                ></el-switch>
                            </el-form-item>
                            <el-form-item label="禁行开始时间">
                                <el-time-picker
                                    :clearable="false"
                                    :value-format="'HH:mm:ss'"
                                    v-model="
                                        newForm[`param993`]['banTime'][index][
                                            'startTime'
                                        ]
                                    "
                                    :picker-options="{
                                        selectableRange: `00:00:00 - ${
                                            newForm[`param993`]['banTime'][
                                                index
                                            ]['endTime']
                                                ? newForm[`param993`][
                                                      'banTime'
                                                  ][index]['endTime']
                                                : '23:59:59'
                                        }`,
                                    }"
                                >
                                </el-time-picker>
                            </el-form-item>
                            <el-form-item label="禁行结束时间">
                                <el-time-picker
                                    :clearable="false"
                                    :value-format="'HH:mm:ss'"
                                    v-model="
                                        newForm[`param993`]['banTime'][index][
                                            'endTime'
                                        ]
                                    "
                                    :picker-options="{
                                        selectableRange: `${
                                            newForm[`param993`]['banTime'][
                                                index
                                            ]['startTime']
                                                ? newForm[`param993`][
                                                      'banTime'
                                                  ][index]['startTime']
                                                : '00:00:00'
                                        } - 23:59:59`,
                                    }"
                                >
                                </el-time-picker>
                            </el-form-item>
                            <el-form-item
                                label="提前预警时间"
                                v-if="tabItem['advanceWarningTime']"
                            >
                                <el-input-number
                                    :precision="0"
                                    controls-position="right"
                                    v-model="
                                        newForm[`param993`]['banTime'][index]
                                            .advanceWarningTime
                                    "
                                    :min="
                                        tabItem.advanceWarningTime.rangeMin / 60
                                    "
                                    :max="
                                        tabItem.advanceWarningTime.rangeMax / 60
                                    "
                                    data-unit="min"
                                    @blur="
                                        (e) => {
                                            if (e.target.value === '') {
                                                newForm[`param993`]['banTime'][
                                                    index
                                                ].advanceWarningTime = Number(
                                                    e.target.ariaValueMin
                                                );
                                            }
                                        }
                                    "
                                ></el-input-number>
                            </el-form-item>
                            <el-form-item
                                label="报警提示周期"
                                v-if="tabItem['warningPeriod']"
                            >
                                <el-input-number
                                    :precision="0"
                                    controls-position="right"
                                    v-model="
                                        newForm[`param993`]['banTime'][index]
                                            .warningPeriod
                                    "
                                    :min="tabItem.warningPeriod.rangeMin / 60"
                                    :max="tabItem.warningPeriod.rangeMax / 60"
                                    data-unit="min"
                                    @blur="
                                        (e) => {
                                            if (e.target.value === '') {
                                                newForm[`param993`]['banTime'][
                                                    index
                                                ].warningPeriod = Number(
                                                    e.target.ariaValueMin
                                                );
                                            }
                                        }
                                    "
                                ></el-input-number>
                            </el-form-item>
                        </template>
                    </el-collapse-item>
                </el-collapse>
            </div>
            <div
                v-if="
                    newForm[`param6014`] &&
                    capability['intelliDrive_warn'] &&
                    capability['intelliDrive_warn']['alarmFilter'] &&
                    capability['intelliDrive_warn']['alarmFilter'].length
                "
            >
                <h3>报警屏蔽字</h3>
                <el-form-item
                    label="报警屏蔽字"
                    v-if="
                        capability['intelliDrive_warn'] &&
                        capability['intelliDrive_warn']['alarmFilter'] &&
                        capability['intelliDrive_warn']['alarmFilter'].length
                    "
                >
                    <el-select
                        multiple
                        collapse-tags
                        v-model="newForm[`param6014`].alarmFilter"
                    >
                        <el-option
                            v-for="item in alarmFilterList"
                            :label="item.label"
                            :value="item.value"
                            :key="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
            </div>
        </el-form>
    </div>
</template>
<script>
import mixins from "@/mixins/mixins";
export default {
    name: "alarmParams",
    mixins: [mixins],
    components: {},
    props: {},
    data() {
        return {
            componentsName: "platformParams",
            setForm: {},
            alarmInfo: [],
            gsensorTurn: [],
            banTime: [],
            banTimeActiveName: "",
            alarmFilterList: [],
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
    computed: {},
    watch: {
        newForm: {
            handler(val) {
                if (val) {
                    if (val.param957) {
                        if (!this.setForm.hasOwnProperty("超速报警&param957")) {
                            this.setForm["超速报警&param957"] = {};
                        }
                        this.setForm["超速报警&param957"].duration =
                            val["param957"].duration !=
                                this.oldForm["param957"].duration ||
                            (this.isTemplate &&
                                val["param957"].hasOwnProperty("duration"))
                                ? `param957.duration&超速持续时间&${val["param957"].duration}`
                                : null;
                        this.setForm["超速报警&param957"].speedDifference =
                            val["param957"].speedDifference !=
                                this.oldForm["param957"].speedDifference ||
                            (this.isTemplate &&
                                val["param957"].hasOwnProperty(
                                    "speedDifference"
                                ))
                                ? `param957.speedDifference&超速预警差值&${val["param957"].speedDifference}`
                                : null;
                        this.setForm["超速报警&param957"].speedThreshold =
                            val["param957"].speedThreshold !=
                                this.oldForm["param957"].speedThreshold ||
                            (this.isTemplate &&
                                val["param957"].hasOwnProperty(
                                    "speedThreshold"
                                ))
                                ? `param957.speedThreshold&日间超速阈值&${val["param957"].speedThreshold}`
                                : null;
                        this.setForm["超速报警&param957"].nightSpeedThreshold =
                            val["param957"].nightSpeedThreshold !=
                                this.oldForm["param957"].nightSpeedThreshold ||
                            (this.isTemplate &&
                                val["param957"].hasOwnProperty(
                                    "nightSpeedThreshold"
                                ))
                                ? `param957.nightSpeedThreshold&夜间超速阈值&${val["param957"].nightSpeedThreshold}`
                                : null;
                        this.setForm[
                            "超速报警&param957"
                        ].nightOverSpeedPercent =
                            val["param957"].nightOverSpeedPercent !=
                                this.oldForm["param957"]
                                    .nightOverSpeedPercent ||
                            (this.isTemplate &&
                                val["param957"].hasOwnProperty(
                                    "nightOverSpeedPercent"
                                ))
                                ? `param957.nightOverSpeedPercent&夜间超速百分比&${val["param957"].nightOverSpeedPercent}`
                                : null;
                    }
                    if (val.param924) {
                        if (!this.setForm.hasOwnProperty("超时驾驶&param924")) {
                            this.setForm["超时驾驶&param924"] = {};
                        }
                        this.setForm["超时驾驶&param924"].daylightStartTime =
                            val["param924"].daylightStartTime !=
                                this.oldForm["param924"].daylightStartTime ||
                            (this.isTemplate &&
                                val["param924"].hasOwnProperty(
                                    "daylightStartTime"
                                ))
                                ? `param924.daylightStartTime&日间起始时间&${val["param924"].daylightStartTime}`
                                : null;
                        this.setForm["超时驾驶&param924"].daylightEndTime =
                            val["param924"].daylightEndTime !=
                                this.oldForm["param924"].daylightEndTime ||
                            (this.isTemplate &&
                                val["param924"].hasOwnProperty(
                                    "daylightEndTime"
                                ))
                                ? `param924.daylightEndTime&日间结束时间&${val["param924"].daylightEndTime}`
                                : null;
                        this.setForm[
                            "超时驾驶&param924"
                        ].daylightDrivingTimeMax =
                            val["param924"].daylightDrivingTimeMax !=
                                this.oldForm["param924"]
                                    .daylightDrivingTimeMax ||
                            (this.isTemplate &&
                                val["param924"].hasOwnProperty(
                                    "daylightDrivingTimeMax"
                                ))
                                ? `param924.daylightDrivingTimeMax&日间连续驾驶时长&${val["param924"].daylightDrivingTimeMax}`
                                : null;
                        this.setForm["超时驾驶&param924"].restTimeMin =
                            val["param924"].restTimeMin !=
                                this.oldForm["param924"].restTimeMin ||
                            (this.isTemplate &&
                                val["param924"].hasOwnProperty("restTimeMin"))
                                ? `param924.restTimeMin&日间连续休息时长&${val["param924"].restTimeMin}`
                                : null;
                        this.setForm["超时驾驶&param924"].nightDrivingTimeMax =
                            val["param924"].nightDrivingTimeMax !=
                                this.oldForm["param924"].nightDrivingTimeMax ||
                            (this.isTemplate &&
                                val["param924"].hasOwnProperty(
                                    "nightDrivingTimeMax"
                                ))
                                ? `param924.nightDrivingTimeMax&夜间连续驾驶时长&${val["param924"].nightDrivingTimeMax}`
                                : null;
                        this.setForm["超时驾驶&param924"].nightDrivingRestTime =
                            val["param924"].nightDrivingRestTime !=
                                this.oldForm["param924"].nightDrivingRestTime ||
                            (this.isTemplate &&
                                val["param924"].hasOwnProperty(
                                    "nightDrivingRestTime"
                                ))
                                ? `param924.nightDrivingRestTime&夜间连续休息时长&${val["param924"].nightDrivingRestTime}`
                                : null;
                        this.setForm[
                            "超时驾驶&param924"
                        ].allDayDrivingTimeMaxEnable =
                            val["param924"].allDayDrivingTimeMaxEnable !=
                                this.oldForm["param924"]
                                    .allDayDrivingTimeMaxEnable ||
                            (this.isTemplate &&
                                val["param924"].hasOwnProperty(
                                    "allDayDrivingTimeMaxEnable"
                                ))
                                ? `param924.allDayDrivingTimeMaxEnable&全天累计驾驶时间门限使能switch&${val["param924"].allDayDrivingTimeMaxEnable}`
                                : null;
                        this.setForm["超时驾驶&param924"].allDayDrivingTimeMax =
                            val["param924"].allDayDrivingTimeMax !=
                                this.oldForm["param924"].allDayDrivingTimeMax ||
                            (this.isTemplate &&
                                val["param924"].hasOwnProperty(
                                    "allDayDrivingTimeMax"
                                ))
                                ? `param924.allDayDrivingTimeMax&全天累计驾驶时间门限&${val["param924"].allDayDrivingTimeMax}`
                                : null;
                        this.setForm["超时驾驶&param924"].deltaWarnTime =
                            val["param924"].deltaWarnTime !=
                                this.oldForm["param924"].deltaWarnTime ||
                            (this.isTemplate &&
                                val["param924"].hasOwnProperty("deltaWarnTime"))
                                ? `param924.deltaWarnTime&预警差值时间&${val["param924"].deltaWarnTime}`
                                : null;
                    }
                    if (val.param1303) {
                        this.alarmInfo.forEach((item, index) => {
                            let objName = `业务报警>${item.label}&param1303`;
                            if (!this.setForm.hasOwnProperty(objName)) {
                                this.setForm[objName] = {};
                            }
                            this.setForm[objName][
                                `alarmList.${index}.enabled`
                            ] =
                                this.isEqual(
                                    val["param1303"].alarmList[index].enabled,
                                    this.oldForm["param1303"].alarmList[index]
                                        .enabled
                                ) ||
                                (this.isTemplate &&
                                    val["param1303"].hasOwnProperty(
                                        "alarmList"
                                    ))
                                    ? `param1303.alarmList.${index}.enabled&限制模型使能array&${val["param1303"].alarmList[index].enabled}&${val["param1303"].alarmList[index].enabled}`
                                    : null;
                            this.setForm[objName][
                                `alarmList.${index}.priority`
                            ] =
                                val["param1303"].alarmList[index].priority !=
                                    this.oldForm["param1303"].alarmList[index]
                                        .priority ||
                                (this.isTemplate &&
                                    val["param1303"].hasOwnProperty(
                                        "alarmList"
                                    ))
                                    ? `param1303.alarmList.${index}.priority&限制优先级number&${val["param1303"].alarmList[index].priority}`
                                    : null;
                            this.setForm[objName][
                                `alarmList.${index}.limitSpeed`
                            ] =
                                val["param1303"].alarmList[index].limitSpeed !=
                                    this.oldForm["param1303"].alarmList[index]
                                        .limitSpeed ||
                                (this.isTemplate &&
                                    val["param1303"].hasOwnProperty(
                                        "alarmList"
                                    ))
                                    ? `param1303.alarmList.${index}.limitSpeed&限制速度number&${val["param1303"].alarmList[index].limitSpeed}`
                                    : null;
                            this.setForm[objName][
                                `alarmList.${index}.triggerSpeed`
                            ] =
                                val["param1303"].alarmList[index]
                                    .triggerSpeed !=
                                    this.oldForm["param1303"].alarmList[index]
                                        .triggerSpeed ||
                                (this.isTemplate &&
                                    val["param1303"].hasOwnProperty(
                                        "alarmList"
                                    ))
                                    ? `param1303.alarmList.${index}.triggerSpeed&触发速度number&${val["param1303"].alarmList[index].triggerSpeed}`
                                    : null;
                            this.setForm[objName][
                                `alarmList.${index}.continueTime`
                            ] =
                                val["param1303"].alarmList[index]
                                    .continueTime !=
                                    this.oldForm["param1303"].alarmList[index]
                                        .continueTime ||
                                (this.isTemplate &&
                                    val["param1303"].hasOwnProperty(
                                        "alarmList"
                                    ))
                                    ? `param1303.alarmList.${index}.continueTime&持续时间number&${val["param1303"].alarmList[index].continueTime}`
                                    : null;
                            this.setForm[objName][`alarmList.${index}.mask`] =
                                val["param1303"].alarmList[index].mask !=
                                    this.oldForm["param1303"].alarmList[index]
                                        .mask ||
                                (this.isTemplate &&
                                    val["param1303"].hasOwnProperty(
                                        "alarmList"
                                    ))
                                    ? `param1303.alarmList.${index}.mask&限制掩码number&${val["param1303"].alarmList[index].mask}`
                                    : null;
                        });
                    }
                    this.gsensorTurn.forEach((item) => {
                        if (val[`param1315_${item.gsensorTurnType}`]) {
                            let paramStr = `param1315_${item.gsensorTurnType}`;
                            let objName = `路口报警>${item.label}&${paramStr}`;
                            if (!this.setForm.hasOwnProperty(objName)) {
                                this.setForm[objName] = {
                                    turnList: [{ EventTriggerList: [{}] }],
                                };
                            }
                            this.setForm[objName].turnList[0].enabled =
                                val[paramStr].turnList[0].enabled !=
                                    this.oldForm[paramStr].turnList[0]
                                        .enabled ||
                                (this.isTemplate &&
                                    val[paramStr].turnList[0].hasOwnProperty(
                                        "enabled"
                                    ))
                                    ? `${paramStr}.turnList.0.enabled&报警使能switch&${val[paramStr].turnList[0].enabled}`
                                    : null;
                            this.setForm[objName].turnList[0].limitSpeed =
                                val[paramStr].turnList[0].limitSpeed !=
                                    this.oldForm[paramStr].turnList[0]
                                        .limitSpeed ||
                                (this.isTemplate &&
                                    val[paramStr].turnList[0].hasOwnProperty(
                                        "limitSpeed"
                                    ))
                                    ? `${paramStr}.turnList.0.limitSpeed&车速限制速度number&${val[paramStr].turnList[0].limitSpeed}`
                                    : null;
                            this.setForm[
                                objName
                            ].turnList[0].EventTriggerList[0].volume =
                                val[paramStr].turnList[0].EventTriggerList[0]
                                    .volume !=
                                    this.oldForm[paramStr].turnList[0]
                                        .EventTriggerList[0].volume ||
                                (this.isTemplate &&
                                    val[
                                        paramStr
                                    ].turnList[0].EventTriggerList[0].hasOwnProperty(
                                        "volume"
                                    ))
                                    ? `${paramStr}.turnList.0.EventTriggerList.0.volume&报警音量number&${val[paramStr].turnList[0].EventTriggerList[0].volume}`
                                    : null;
                            this.setForm[objName].turnList[0].sensitivity =
                                val[paramStr].turnList[0].sensitivity !=
                                    this.oldForm[paramStr].turnList[0]
                                        .sensitivity ||
                                (this.isTemplate &&
                                    val[paramStr].turnList[0].hasOwnProperty(
                                        "sensitivity"
                                    ))
                                    ? `${paramStr}.turnList.0.sensitivity&车辆目标灵敏度number&${val[paramStr].turnList[0].sensitivity}`
                                    : null;
                            this.setForm[objName].turnList[0].intervalTime =
                                val[paramStr].turnList[0].intervalTime !=
                                    this.oldForm[paramStr].turnList[0]
                                        .intervalTime ||
                                (this.isTemplate &&
                                    val[paramStr].turnList[0].hasOwnProperty(
                                        "intervalTime"
                                    ))
                                    ? `${paramStr}.turnList.0.intervalTime&报警间隔时间number&${val[paramStr].turnList[0].intervalTime}`
                                    : null;
                            this.setForm[objName].turnList[0].uploadPicEnabled =
                                val[paramStr].turnList[0].uploadPicEnabled !=
                                    this.oldForm[paramStr].turnList[0]
                                        .uploadPicEnabled ||
                                (this.isTemplate &&
                                    val[paramStr].turnList[0].hasOwnProperty(
                                        "uploadPicEnabled"
                                    ))
                                    ? `${paramStr}.turnList.0.uploadPicEnabled&图片上报使能switch&${val[paramStr].turnList[0].uploadPicEnabled}`
                                    : null;
                            this.setForm[objName].turnList[0].pictureNum =
                                val[paramStr].turnList[0].pictureNum !=
                                    this.oldForm[paramStr].turnList[0]
                                        .pictureNum ||
                                (this.isTemplate &&
                                    val[paramStr].turnList[0].hasOwnProperty(
                                        "pictureNum"
                                    ))
                                    ? `${paramStr}.turnList.0.pictureNum&抓图张数number&${val[paramStr].turnList[0].pictureNum}`
                                    : null;
                            this.setForm[objName].turnList[0].snapIntervalTime =
                                val[paramStr].turnList[0].snapIntervalTime !=
                                    this.oldForm[paramStr].turnList[0]
                                        .snapIntervalTime ||
                                (this.isTemplate &&
                                    val[paramStr].turnList[0].hasOwnProperty(
                                        "snapIntervalTime"
                                    ))
                                    ? `${paramStr}.turnList.0.snapIntervalTime&抓图间隔时间number&${val[paramStr].turnList[0].snapIntervalTime}`
                                    : null;
                            this.setForm[
                                objName
                            ].turnList[0].uploadVideoEnabled =
                                val[paramStr].turnList[0].uploadVideoEnabled !=
                                    this.oldForm[paramStr].turnList[0]
                                        .uploadVideoEnabled ||
                                (this.isTemplate &&
                                    val[paramStr].turnList[0].hasOwnProperty(
                                        "uploadVideoEnabled"
                                    ))
                                    ? `${paramStr}.turnList.0.uploadVideoEnabled&视频上报使能switch&${val[paramStr].turnList[0].uploadVideoEnabled}`
                                    : null;
                            this.setForm[
                                objName
                            ].turnList[0].videoPreRecordTime =
                                val[paramStr].turnList[0].videoPreRecordTime !=
                                    this.oldForm[paramStr].turnList[0]
                                        .videoPreRecordTime ||
                                (this.isTemplate &&
                                    val[paramStr].turnList[0].hasOwnProperty(
                                        "videoPreRecordTime"
                                    ))
                                    ? `${paramStr}.turnList.0.videoPreRecordTime&小视频预录时间number&${val[paramStr].turnList[0].videoPreRecordTime}`
                                    : null;
                            this.setForm[
                                objName
                            ].turnList[0].videoDelayRecordTime =
                                val[paramStr].turnList[0]
                                    .videoDelayRecordTime !=
                                    this.oldForm[paramStr].turnList[0]
                                        .videoDelayRecordTime ||
                                (this.isTemplate &&
                                    val[paramStr].turnList[0].hasOwnProperty(
                                        "videoDelayRecordTime"
                                    ))
                                    ? `${paramStr}.turnList.0.videoDelayRecordTime&小视频延录时间number&${val[paramStr].turnList[0].videoDelayRecordTime}`
                                    : null;
                            this.setForm[objName].turnList[0].angle =
                                val[paramStr].turnList[0].angle !=
                                    this.oldForm[paramStr].turnList[0].angle ||
                                (this.isTemplate &&
                                    val[paramStr].turnList[0].hasOwnProperty(
                                        "angle"
                                    ))
                                    ? `${paramStr}.turnList.0.angle&转向角度number&${val[paramStr].turnList[0].angle}`
                                    : null;
                        }
                    });
                    if (val.param993) {
                        this.banTime.forEach((item, index) => {
                            let objName = `违规驾驶>${item.label}&param993`;
                            if (!this.setForm.hasOwnProperty(objName)) {
                                this.setForm[objName] = {};
                            }
                            this.setForm[objName][
                                `banTime.${index}.startTime`
                            ] =
                                val["param993"].banTime[index].startTime !=
                                    this.oldForm["param993"].banTime[index]
                                        .startTime ||
                                (this.isTemplate &&
                                    val["param993"].hasOwnProperty("banTime"))
                                    ? `param993.banTime.${index}.startTime&禁行开始时间&${val["param993"].banTime[index].startTime}`
                                    : null;
                            this.setForm[objName][`banTime.${index}.endTime`] =
                                val["param993"].banTime[index].endTime !=
                                    this.oldForm["param993"].banTime[index]
                                        .endTime ||
                                (this.isTemplate &&
                                    val["param993"].hasOwnProperty("banTime"))
                                    ? `param993.banTime.${index}.endTime&禁行结束时间&${val["param993"].banTime[index].endTime}`
                                    : null;
                            this.setForm[objName][
                                `banTime.${index}.advanceWarningTime`
                            ] =
                                val["param993"].banTime[index]
                                    .advanceWarningTime !=
                                    this.oldForm["param993"].banTime[index]
                                        .advanceWarningTime ||
                                (this.isTemplate &&
                                    val["param993"].hasOwnProperty("banTime"))
                                    ? `param993.banTime.${index}.advanceWarningTime&提前预警时间number&${val["param993"].banTime[index].advanceWarningTime}`
                                    : null;
                            this.setForm[objName][
                                `banTime.${index}.warningPeriod`
                            ] =
                                val["param993"].banTime[index].warningPeriod !=
                                    this.oldForm["param993"].banTime[index]
                                        .warningPeriod ||
                                (this.isTemplate &&
                                    val["param993"].hasOwnProperty("banTime"))
                                    ? `param993.banTime.${index}.warningPeriod&报警提示周期number&${val["param993"].banTime[index].warningPeriod}`
                                    : null;
                        });
                    }
                    if (val.param6014) {
                        if (
                            !this.setForm.hasOwnProperty("报警屏蔽字&param6014")
                        ) {
                            this.setForm["报警屏蔽字&param6014"] = {};
                        }
                        this.setForm["报警屏蔽字&param6014"].alarmFilter =
                            this.isEqual(
                                val["param6014"].alarmFilter,
                                this.oldForm["param6014"].alarmFilter
                            ) ||
                            (this.isTemplate &&
                                val["param6014"].hasOwnProperty("alarmFilter"))
                                ? `param6014.alarmFilter&报警屏蔽字array&${this.getLabelSelfArr(
                                      this.enumerationJSON[
                                          "intelliDrive_warn_alarmFilter"
                                      ],
                                      val["param6014"].alarmFilter
                                  )}&${val["param6014"].alarmFilter}`
                                : null;
                    }
                    this.$emit("setFormChange", {
                        报警设置: this.setForm,
                    });
                }
            },
            deep: true,
            immediate: true,
        },
    },
    methods: {
        initConfig() {
            this.$emit("setFormLoading", true);
            let initConfigList = [
                this.getEHomeConfig(957),
                this.getEHomeConfig(924),
                this.getEHomeConfig(1303),
                this.getEHomeConfig(993),
                this.getEHomeConfig(6014),
            ];

            if (
                this.capability["zhatu"] &&
                this.capability["zhatu"].alarmInfo &&
                this.capability["zhatu"].alarmInfo.length
            ) {
                this.alarmInfo = this.capability["zhatu"].alarmInfo;
                this.alarmInfo.forEach((item) => {
                    if (item.hasOwnProperty("name")) {
                        item.label = item.name;
                    } else {
                        item.label = this.getJsonLabel(
                            "zhatu_alarmInfo_modelType",
                            item.modelType
                        );
                    }
                    item.enabledList = this.getEnumerationValue(
                        item.enabled,
                        "zhatu_alarmInfo_enabled"
                    );
                });
            }
            if (
                this.capability["zhatu"] &&
                this.capability["zhatu"].gsensorTurn &&
                this.capability["zhatu"].gsensorTurn.length
            ) {
                this.gsensorTurn = this.capability["zhatu"].gsensorTurn;
                this.gsensorTurn.forEach((item) => {
                    item.label = this.getJsonLabel(
                        "zhatu_gsensorTurn_modelType",
                        item.gsensorTurnType
                    );
                    initConfigList.push(
                        this.getEHomeConfig(1315, {
                            gsensorTurnType: item.gsensorTurnType,
                        })
                    );
                });
            }
            if (
                this.capability["intelliDrive_warn"] &&
                this.capability["intelliDrive_warn"].banTime &&
                this.capability["intelliDrive_warn"].banTime.length
            ) {
                this.banTime = this.capability["intelliDrive_warn"].banTime;
                this.banTime.forEach((item) => {
                    item.label = this.getJsonLabel(
                        "intelliDrive_warn_banTime_type",
                        item.type
                    );
                });
                this.banTimeActiveName = this.banTime[0].label;
            }
            if (
                this.capability["intelliDrive_warn"] &&
                this.capability["intelliDrive_warn"].alarmFilter &&
                this.capability["intelliDrive_warn"].alarmFilter.length
            ) {
                this.alarmFilterList = this.getEnumerationValue(
                    this.capability["intelliDrive_warn"].alarmFilter,
                    "intelliDrive_warn_alarmFilter"
                );
            }
            Promise.all(initConfigList).then((result) => {
                this.$emit("setFormLoading", false);
                this.$emit("loadingSuccess");
            });
        },
        minTime(time) {
            if (time && time.indexOf(":") > 0) {
                var min = time.split(":")[0];
                var sec = time.split(":")[1];
                return Number(min * 60) + Number(sec);
            }
        },
    },
};
</script>
<style lang="less" scoped>
@import "./configurationForm.less";
/deep/.el-collapse {
    .el-collapse-item__content {
        padding-top: 20px;
    }
}
</style>
