<template>
    <div class="configuration-form">
        <el-form
            :label-width="`${labelWidth}px`"
            :model="newForm"
            :inline="true"
            ref="form"
        >
            <div v-if="BBplatformList.length">
                <h3>
                    部标平台<i class="el-icon-warning"></i>
                    <span class="warning-msg"
                        >该配置项修改后需要重启设备才生效！</span
                    >
                </h3>
                <el-collapse v-model="collapseActiveName">
                    <el-collapse-item
                        v-for="(item, index) in BBplatformList"
                        :key="index"
                        :title="item.title"
                        :name="index + 1 + ''"
                        arrowPlacement="right"
                        v-show="newForm[`param705_${item.platformIndex}`]"
                    >
                        <template
                            v-if="newForm[`param705_${item.platformIndex}`]"
                        >
                            <div>
                                <h3>平台连接参数</h3>
                                <el-form-item label="使能" v-if="item.enable">
                                    <el-switch
                                        :disabled="
                                            capability.network.isHikPlatform >
                                            -1
                                                ? !item.editable
                                                : (item.platformIndex === 4 &&
                                                      newForm['param705_4'] &&
                                                      newForm['param705_4']
                                                          .ip ===
                                                          'iot81.hikvisionauto.com' &&
                                                      newForm['param705_4']
                                                          .port === 18884) ||
                                                  (item.platformIndex === 5 &&
                                                      capability.generic &&
                                                      capability.generic
                                                          .schemeType &&
                                                      newForm['param705_5'] &&
                                                      newForm['param705_5']
                                                          .ip ===
                                                          'iot81.hikvisionauto.com' &&
                                                      newForm['param705_5']
                                                          .port === 18884)
                                        "
                                        v-model="
                                            newForm[
                                                `param705_${item.platformIndex}`
                                            ].enable
                                        "
                                        :active-value="Number(1)"
                                        :inactive-value="Number(0)"
                                    ></el-switch>
                                </el-form-item>
                                <el-form-item
                                    label="接入协议"
                                    v-if="item.protocol"
                                >
                                    <el-select
                                        v-model="
                                            newForm[
                                                `param705_${item.platformIndex}`
                                            ].protocol
                                        "
                                        :disabled="
                                            capability.network.isHikPlatform >
                                            -1
                                                ? !item.editable
                                                : (item.platformIndex === 4 &&
                                                      newForm['param705_4'] &&
                                                      newForm['param705_4']
                                                          .ip ===
                                                          'iot81.hikvisionauto.com' &&
                                                      newForm['param705_4']
                                                          .port === 18884) ||
                                                  (item.platformIndex === 5 &&
                                                      capability.generic &&
                                                      capability.generic
                                                          .schemeType &&
                                                      newForm['param705_5'] &&
                                                      newForm['param705_5']
                                                          .ip ===
                                                          'iot81.hikvisionauto.com' &&
                                                      newForm['param705_5']
                                                          .port === 18884)
                                        "
                                    >
                                        <el-option
                                            v-for="item in enumeration[
                                                `network_platformInfo_${item.platformIndex}_platformDetail_accessProtocol`
                                            ].list"
                                            :label="item.label"
                                            :value="item.value"
                                            :key="item.value"
                                        ></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="协议类型" v-if="item.type">
                                    <el-select
                                        v-model="
                                            newForm[
                                                `param705_${item.platformIndex}`
                                            ].type
                                        "
                                        :disabled="
                                            capability.network.isHikPlatform >
                                            -1
                                                ? !item.editable
                                                : (item.platformIndex === 4 &&
                                                      newForm['param705_4'] &&
                                                      newForm['param705_4']
                                                          .ip ===
                                                          'iot81.hikvisionauto.com' &&
                                                      newForm['param705_4']
                                                          .port === 18884) ||
                                                  (item.platformIndex === 5 &&
                                                      capability.generic &&
                                                      capability.generic
                                                          .schemeType &&
                                                      newForm['param705_5'] &&
                                                      newForm['param705_5']
                                                          .ip ===
                                                          'iot81.hikvisionauto.com' &&
                                                      newForm['param705_5']
                                                          .port === 18884)
                                        "
                                    >
                                        <el-option
                                            v-for="item in enumeration[
                                                `network_platformInfo_${item.platformIndex}_platformDetail_extensionProtocol`
                                            ][
                                                newForm[
                                                    `param705_${item.platformIndex}`
                                                ].protocol
                                            ]"
                                            :label="item.label"
                                            :value="item.value"
                                            :key="item.value"
                                        ></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="地址" v-if="item.ip">
                                    <el-input
                                        v-model="
                                            newForm[
                                                `param705_${item.platformIndex}`
                                            ].ip
                                        "
                                        :maxlength="30"
                                        :disabled="
                                            capability.network.isHikPlatform >
                                            -1
                                                ? !item.editable
                                                : (item.platformIndex === 4 &&
                                                      newForm['param705_4'] &&
                                                      newForm['param705_4']
                                                          .ip ===
                                                          'iot81.hikvisionauto.com' &&
                                                      newForm['param705_4']
                                                          .port === 18884) ||
                                                  (item.platformIndex === 5 &&
                                                      capability.generic &&
                                                      capability.generic
                                                          .schemeType &&
                                                      newForm['param705_5'] &&
                                                      newForm['param705_5']
                                                          .ip ===
                                                          'iot81.hikvisionauto.com' &&
                                                      newForm['param705_5']
                                                          .port === 18884)
                                        "
                                    />
                                </el-form-item>
                                <el-form-item label="端口" v-if="item.port">
                                    <el-input-number
                                        :precision="0"
                                        controls-position="right"
                                        v-model="
                                            newForm[
                                                `param705_${item.platformIndex}`
                                            ].port
                                        "
                                        :max="65535"
                                        @blur="
                                            (e) => {
                                                if (e.target.value === '') {
                                                    newForm[
                                                        `param705_${item.platformIndex}`
                                                    ].port = 0;
                                                }
                                            }
                                        "
                                        :disabled="
                                            capability.network.isHikPlatform >
                                            -1
                                                ? !item.editable
                                                : (item.platformIndex === 4 &&
                                                      newForm['param705_4'] &&
                                                      newForm['param705_4']
                                                          .ip ===
                                                          'iot81.hikvisionauto.com' &&
                                                      newForm['param705_4']
                                                          .port === 18884) ||
                                                  (item.platformIndex === 5 &&
                                                      capability.generic &&
                                                      capability.generic
                                                          .schemeType &&
                                                      newForm['param705_5'] &&
                                                      newForm['param705_5']
                                                          .ip ===
                                                          'iot81.hikvisionauto.com' &&
                                                      newForm['param705_5']
                                                          .port === 18884)
                                        "
                                    />
                                </el-form-item>
                                <el-form-item
                                    label="手机号"
                                    v-if="item.serial && tabPosition === 'tab1'"
                                >
                                    <el-input
                                        v-model="
                                            newForm[
                                                `param705_${item.platformIndex}`
                                            ].serial
                                        "
                                        :onkeyup="
                                            (newForm[
                                                `param705_${item.platformIndex}`
                                            ].serial = newForm[
                                                `param705_${item.platformIndex}`
                                            ].serial.replace(/\D/g, ''))
                                        "
                                        onafterpaste="value=value.replace(/\D/g,'')"
                                        :maxlength="20"
                                        :disabled="
                                            capability.network.isHikPlatform >
                                            -1
                                                ? !item.editable
                                                : (item.platformIndex === 4 &&
                                                      newForm['param705_4'] &&
                                                      newForm['param705_4']
                                                          .ip ===
                                                          'iot81.hikvisionauto.com' &&
                                                      newForm['param705_4']
                                                          .port === 18884) ||
                                                  (item.platformIndex === 5 &&
                                                      capability.generic &&
                                                      capability.generic
                                                          .schemeType &&
                                                      newForm['param705_5'] &&
                                                      newForm['param705_5']
                                                          .ip ===
                                                          'iot81.hikvisionauto.com' &&
                                                      newForm['param705_5']
                                                          .port === 18884)
                                        "
                                    />
                                </el-form-item>
                                <el-form-item
                                    label="终端ID"
                                    v-if="item.id && tabPosition === 'tab1'"
                                >
                                    <el-input
                                        v-model="
                                            newForm[
                                                `param705_${item.platformIndex}`
                                            ].id
                                        "
                                        onkeyup="value=value.replace(/[\W]/g,'')"
                                        onafterpaste="value=value.replace(/[\W]/g,'')"
                                        :maxlength="30"
                                        :disabled="
                                            capability.network.isHikPlatform >
                                            -1
                                                ? !item.editable
                                                : (item.platformIndex === 4 &&
                                                      newForm['param705_4'] &&
                                                      newForm['param705_4']
                                                          .ip ===
                                                          'iot81.hikvisionauto.com' &&
                                                      newForm['param705_4']
                                                          .port === 18884) ||
                                                  (item.platformIndex === 5 &&
                                                      capability.generic &&
                                                      capability.generic
                                                          .schemeType &&
                                                      newForm['param705_5'] &&
                                                      newForm['param705_5']
                                                          .ip ===
                                                          'iot81.hikvisionauto.com' &&
                                                      newForm['param705_5']
                                                          .port === 18884)
                                        "
                                    />
                                </el-form-item>
                                <el-form-item
                                    label="主动安全报警使能"
                                    v-if="item.uploadEnable"
                                >
                                    <el-switch
                                        v-model="
                                            newForm[
                                                `param705_${item.platformIndex}`
                                            ].uploadEnable
                                        "
                                        :active-value="Number(1)"
                                        :inactive-value="Number(0)"
                                    ></el-switch>
                                </el-form-item>
                            </div>
                            <div
                                v-if="
                                    item.locationReport &&
                                    (item.locationReport.reportStrategy ||
                                        item.locationReport.reportPlan)
                                "
                            >
                                <h3>位置汇报设置</h3>
                                <el-form-item
                                    label="汇报策略"
                                    v-if="
                                        item.locationReport &&
                                        item.locationReport.reportStrategy
                                    "
                                >
                                    <el-select
                                        v-model="
                                            newForm[
                                                `param705_${item.platformIndex}`
                                            ].locationReport.reportStrategy
                                        "
                                    >
                                        <el-option
                                            v-for="item in enumeration[
                                                `network_platformInfo_${item.platformIndex}_locationReport_reportStrategy`
                                            ]"
                                            :label="item.label"
                                            :value="item.value"
                                            :key="item.value"
                                        ></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item
                                    label="汇报方案"
                                    v-if="
                                        item.locationReport &&
                                        item.locationReport.reportPlan
                                    "
                                >
                                    <el-select
                                        v-model="
                                            newForm[
                                                `param705_${item.platformIndex}`
                                            ].locationReport.reportPlan
                                        "
                                    >
                                        <el-option
                                            v-for="item in enumeration[
                                                `network_platformInfo_${item.platformIndex}_locationReport_reportPlan`
                                            ]"
                                            :label="item.label"
                                            :value="item.value"
                                            :key="item.value"
                                        ></el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                            <div
                                v-if="
                                    item.locationReport &&
                                    item.locationReport.inflectionAngle
                                "
                            >
                                <h3>拐点补传设置</h3>
                                <el-form-item
                                    label="拐点补传角度"
                                    v-if="
                                        item.locationReport &&
                                        item.locationReport.inflectionAngle
                                    "
                                >
                                    <el-input-number
                                        :precision="0"
                                        controls-position="right"
                                        v-model="
                                            newForm[
                                                `param705_${item.platformIndex}`
                                            ].locationReport.inflectionAngle
                                        "
                                        :min="
                                            item.locationReport.inflectionAngle
                                                .min
                                        "
                                        :max="
                                            item.locationReport.inflectionAngle
                                                .max
                                        "
                                        data-unit="度"
                                        @blur="
                                            (e) => {
                                                if (e.target.value === '') {
                                                    newForm[
                                                        `param705_${item.platformIndex}`
                                                    ].locationReport.inflectionAngle =
                                                        Number(
                                                            e.target
                                                                .ariaValueMin
                                                        );
                                                }
                                            }
                                        "
                                    ></el-input-number>
                                </el-form-item>
                            </div>
                            <div
                                v-if="
                                    item.locationReport &&
                                    (item.locationReport
                                        .sleepReportTimeInterval ||
                                        item.locationReport
                                            .emergencyReportTimeInterval ||
                                        item.locationReport
                                            .defaultReportTimeInterval ||
                                        item.locationReport
                                            .driverNotLoginReportTimeInterval)
                                "
                            >
                                <h3>上报时间间隔设置</h3>
                                <el-form-item
                                    label="休眠汇报时间间隔"
                                    v-if="
                                        item.locationReport &&
                                        item.locationReport
                                            .sleepReportTimeInterval
                                    "
                                >
                                    <el-input-number
                                        :precision="0"
                                        controls-position="right"
                                        v-model="
                                            newForm[
                                                `param705_${item.platformIndex}`
                                            ].locationReport
                                                .sleepReportTimeInterval
                                        "
                                        :min="
                                            item.locationReport
                                                .sleepReportTimeInterval.min
                                        "
                                        :max="
                                            item.locationReport
                                                .sleepReportTimeInterval.max
                                        "
                                        data-unit="s"
                                        @blur="
                                            (e) => {
                                                if (e.target.value === '') {
                                                    newForm[
                                                        `param705_${item.platformIndex}`
                                                    ].locationReport.sleepReportTimeInterval =
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
                                    label="紧急报警汇报时间间隔"
                                    v-if="
                                        item.locationReport &&
                                        item.locationReport
                                            .emergencyReportTimeInterval
                                    "
                                >
                                    <el-input-number
                                        :precision="0"
                                        controls-position="right"
                                        v-model="
                                            newForm[
                                                `param705_${item.platformIndex}`
                                            ].locationReport
                                                .emergencyReportTimeInterval
                                        "
                                        :min="
                                            item.locationReport
                                                .emergencyReportTimeInterval.min
                                        "
                                        :max="
                                            item.locationReport
                                                .emergencyReportTimeInterval.max
                                        "
                                        data-unit="s"
                                        @blur="
                                            (e) => {
                                                if (e.target.value === '') {
                                                    newForm[
                                                        `param705_${item.platformIndex}`
                                                    ].locationReport.emergencyReportTimeInterval =
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
                                    label="定位上传时间间隔"
                                    v-if="
                                        item.locationReport &&
                                        item.locationReport
                                            .defaultReportTimeInterval
                                    "
                                >
                                    <el-input-number
                                        :precision="0"
                                        controls-position="right"
                                        v-model="
                                            newForm[
                                                `param705_${item.platformIndex}`
                                            ].locationReport
                                                .defaultReportTimeInterval
                                        "
                                        :min="
                                            item.locationReport
                                                .defaultReportTimeInterval.min
                                        "
                                        :max="
                                            item.locationReport
                                                .defaultReportTimeInterval.max
                                        "
                                        data-unit="s"
                                        @blur="
                                            (e) => {
                                                if (e.target.value === '') {
                                                    newForm[
                                                        `param705_${item.platformIndex}`
                                                    ].locationReport.defaultReportTimeInterval =
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
                                    label="驾驶员未登录汇报时间间隔"
                                    v-if="
                                        item.locationReport &&
                                        item.locationReport
                                            .driverNotLoginReportTimeInterval
                                    "
                                >
                                    <el-input-number
                                        :precision="0"
                                        controls-position="right"
                                        v-model="
                                            newForm[
                                                `param705_${item.platformIndex}`
                                            ].locationReport
                                                .driverNotLoginReportTimeInterval
                                        "
                                        :min="
                                            item.locationReport
                                                .driverNotLoginReportTimeInterval
                                                .min
                                        "
                                        :max="
                                            item.locationReport
                                                .driverNotLoginReportTimeInterval
                                                .max
                                        "
                                        data-unit="s"
                                        @blur="
                                            (e) => {
                                                if (e.target.value === '') {
                                                    newForm[
                                                        `param705_${item.platformIndex}`
                                                    ].locationReport.driverNotLoginReportTimeInterval =
                                                        Number(
                                                            e.target
                                                                .ariaValueMin
                                                        );
                                                }
                                            }
                                        "
                                    ></el-input-number>
                                </el-form-item>
                            </div>
                            <div
                                v-if="
                                    item.locationReport &&
                                    (item.locationReport
                                        .defaultReportDistanceInterval ||
                                        item.locationReport
                                            .driverNotLoginReportDistanceInterval ||
                                        item.locationReport
                                            .sleepReportDistanceInterval ||
                                        item.locationReport
                                            .emerReportDistanceInterval)
                                "
                            >
                                <h3>上报距离间隔设置</h3>
                                <el-form-item
                                    label="缺省距离汇报间隔"
                                    v-if="
                                        item.locationReport &&
                                        item.locationReport
                                            .defaultReportDistanceInterval
                                    "
                                >
                                    <el-input-number
                                        :precision="0"
                                        controls-position="right"
                                        v-model="
                                            newForm[
                                                `param705_${item.platformIndex}`
                                            ].locationReport
                                                .defaultReportDistanceInterval
                                        "
                                        :min="
                                            item.locationReport
                                                .defaultReportDistanceInterval
                                                .min
                                        "
                                        :max="
                                            item.locationReport
                                                .defaultReportDistanceInterval
                                                .max
                                        "
                                        data-unit="m"
                                        @blur="
                                            (e) => {
                                                if (e.target.value === '') {
                                                    newForm[
                                                        `param705_${item.platformIndex}`
                                                    ].locationReport.defaultReportDistanceInterval =
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
                                    label="驾驶员未登录汇报距离间隔"
                                    v-if="
                                        item.locationReport &&
                                        item.locationReport
                                            .driverNotLoginReportDistanceInterval
                                    "
                                >
                                    <el-input-number
                                        :precision="0"
                                        controls-position="right"
                                        v-model="
                                            newForm[
                                                `param705_${item.platformIndex}`
                                            ].locationReport
                                                .driverNotLoginReportDistanceInterval
                                        "
                                        :min="
                                            item.locationReport
                                                .driverNotLoginReportDistanceInterval
                                                .min
                                        "
                                        :max="
                                            item.locationReport
                                                .driverNotLoginReportDistanceInterval
                                                .max
                                        "
                                        data-unit="m"
                                        @blur="
                                            (e) => {
                                                if (e.target.value === '') {
                                                    newForm[
                                                        `param705_${item.platformIndex}`
                                                    ].locationReport.driverNotLoginReportDistanceInterval =
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
                                    label="休眠时汇报距离间隔"
                                    v-if="
                                        item.locationReport &&
                                        item.locationReport
                                            .sleepReportDistanceInterval
                                    "
                                >
                                    <el-input-number
                                        :precision="0"
                                        controls-position="right"
                                        v-model="
                                            newForm[
                                                `param705_${item.platformIndex}`
                                            ].locationReport
                                                .sleepReportDistanceInterval
                                        "
                                        :min="
                                            item.locationReport
                                                .sleepReportDistanceInterval.min
                                        "
                                        :max="
                                            item.locationReport
                                                .sleepReportDistanceInterval.max
                                        "
                                        data-unit="m"
                                        @blur="
                                            (e) => {
                                                if (e.target.value === '') {
                                                    newForm[
                                                        `param705_${item.platformIndex}`
                                                    ].locationReport.sleepReportDistanceInterval =
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
                                    label="紧急报警时汇报距离间隔"
                                    v-if="
                                        item.locationReport &&
                                        item.locationReport
                                            .emerReportDistanceInterval
                                    "
                                >
                                    <el-input-number
                                        :precision="0"
                                        controls-position="right"
                                        v-model="
                                            newForm[
                                                `param705_${item.platformIndex}`
                                            ].locationReport
                                                .emerReportDistanceInterval
                                        "
                                        :min="
                                            item.locationReport
                                                .emerReportDistanceInterval.min
                                        "
                                        :max="
                                            item.locationReport
                                                .emerReportDistanceInterval.max
                                        "
                                        data-unit="m"
                                        @blur="
                                            (e) => {
                                                if (e.target.value === '') {
                                                    newForm[
                                                        `param705_${item.platformIndex}`
                                                    ].locationReport.emerReportDistanceInterval =
                                                        Number(
                                                            e.target
                                                                .ariaValueMin
                                                        );
                                                }
                                            }
                                        "
                                    ></el-input-number>
                                </el-form-item>
                            </div>
                        </template>
                    </el-collapse-item>
                </el-collapse>
            </div>
            <div v-if="JTplatformObj && JTplatformObj.platformOption">
                <h3>
                    JT平台<i class="el-icon-warning"></i>
                    <span class="warning-msg"
                        >该配置项修改后需要重启设备才生效！</span
                    >
                </h3>
                <el-collapse v-model="collapseActiveName">
                    <el-collapse-item
                        v-for="(item, index) in JTplatformObj.platformCount"
                        :key="index"
                        :title="`第${index + 1}中心`"
                        :name="index + 1 + ''"
                        arrowPlacement="right"
                        v-show="newForm[`param703_${index}`]"
                    >
                        <template v-if="newForm[`param703_${index}`]">
                            <div>
                                <h3>平台连接参数</h3>
                                <el-form-item
                                    label="使能"
                                    v-if="
                                        newForm[
                                            `param703_${index}`
                                        ].hasOwnProperty('enable')
                                    "
                                >
                                    <el-switch
                                        :disabled="
                                            newForm[`param703_${index}`][
                                                'platformProperty'
                                            ] === 1
                                        "
                                        v-model="
                                            newForm[`param703_${index}`].enable
                                        "
                                        :active-value="Number(1)"
                                        :inactive-value="Number(0)"
                                    ></el-switch>
                                </el-form-item>
                                <el-form-item
                                    label="接入协议"
                                    v-if="JTplatformObj.accessProtocol"
                                >
                                    <el-select
                                        v-model="
                                            newForm[`param703_${index}`]
                                                .accessProtocol
                                        "
                                        :disabled="
                                            newForm[`param703_${index}`][
                                                'platformProperty'
                                            ] === 1
                                        "
                                    >
                                        <el-option
                                            v-for="item in JTplatformObj.accessProtocolList"
                                            :label="item.label"
                                            :value="item.value"
                                            :key="item.value"
                                        ></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item
                                    label="协议类型"
                                    v-if="JTplatformObj.platformOption"
                                >
                                    <el-select
                                        v-model="
                                            newForm[`param703_${index}`]
                                                .protocol
                                        "
                                        :disabled="
                                            newForm[`param703_${index}`][
                                                'platformProperty'
                                            ] === 1
                                        "
                                    >
                                        <el-option
                                            v-for="item in JTplatformObj.protocolList"
                                            :label="item.label"
                                            :value="item.value"
                                            :key="item.value"
                                        ></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item
                                    label="地址"
                                    v-if="
                                        newForm[
                                            `param703_${index}`
                                        ].hasOwnProperty('ip')
                                    "
                                >
                                    <el-input
                                        v-model="
                                            newForm[`param703_${index}`].ip
                                        "
                                        :maxlength="30"
                                        :disabled="
                                            newForm[`param703_${index}`][
                                                'platformProperty'
                                            ] === 1
                                        "
                                    />
                                </el-form-item>
                                <el-form-item
                                    label="端口"
                                    v-if="
                                        newForm[
                                            `param703_${index}`
                                        ].hasOwnProperty('port')
                                    "
                                >
                                    <el-input-number
                                        :precision="0"
                                        controls-position="right"
                                        v-model="
                                            newForm[`param703_${index}`].port
                                        "
                                        :max="65535"
                                        :disabled="
                                            newForm[`param703_${index}`][
                                                'platformProperty'
                                            ] === 1
                                        "
                                        @blur="
                                            (e) => {
                                                if (e.target.value === '') {
                                                    newForm[
                                                        `param705_${index}`
                                                    ].locationReport.emerReportDistanceInterval = 0;
                                                }
                                            }
                                        "
                                    />
                                </el-form-item>
                                <el-form-item
                                    label="SIM卡号"
                                    v-if="
                                        newForm[
                                            `param703_${index}`
                                        ].hasOwnProperty('serial') &&
                                        tabPosition === 'tab1'
                                    "
                                >
                                    <el-input
                                        v-model="
                                            newForm[`param703_${index}`].serial
                                        "
                                        :maxlength="20"
                                        :disabled="
                                            newForm[`param703_${index}`][
                                                'platformProperty'
                                            ] === 1
                                        "
                                    />
                                </el-form-item>
                                <el-form-item
                                    label="终端ID"
                                    v-if="
                                        newForm[
                                            `param703_${index}`
                                        ].hasOwnProperty('id') &&
                                        tabPosition === 'tab1'
                                    "
                                >
                                    <el-input
                                        v-model="
                                            newForm[`param703_${index}`].id
                                        "
                                        onkeyup="value=value.replace(/[\W]/g,'')"
                                        onafterpaste="value=value.replace(/[\W]/g,'')"
                                        :maxlength="30"
                                        :disabled="
                                            newForm[`param703_${index}`][
                                                'platformProperty'
                                            ] === 1
                                        "
                                    />
                                </el-form-item>
                                <el-form-item
                                    label="主动安全报警使能"
                                    v-if="JTplatformObj.uploadEnable"
                                >
                                    <el-switch
                                        v-model="
                                            newForm[`param703_${index}`]
                                                .uploadEnable
                                        "
                                        :active-value="Number(1)"
                                        :inactive-value="Number(0)"
                                    ></el-switch>
                                </el-form-item>
                            </div>
                            <div v-if="JTplatformObj.locationReport">
                                <h3>上报时间间隔设置</h3>
                                <el-form-item
                                    label="紧急报警汇报时间间隔"
                                    v-if="
                                        JTplatformObj.locationReport &&
                                        JTplatformObj.locationReport
                                            .emergencyReportTimeInterval
                                    "
                                >
                                    <el-input-number
                                        :precision="0"
                                        controls-position="right"
                                        v-model="
                                            newForm[`param703_${index}`]
                                                .locationReport
                                                .emergencyReportTimeInterval
                                        "
                                        :min="
                                            JTplatformObj.locationReport
                                                .emergencyReportTimeInterval.min
                                        "
                                        :max="
                                            JTplatformObj.locationReport
                                                .emergencyReportTimeInterval.max
                                        "
                                        data-unit="s"
                                        @blur="
                                            (e) => {
                                                if (e.target.value === '') {
                                                    newForm[
                                                        `param703_${index}`
                                                    ].locationReport.emergencyReportTimeInterval =
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
                                    label="定位上传时间间隔"
                                    v-if="
                                        JTplatformObj.locationReport &&
                                        JTplatformObj.locationReport
                                            .defaultReportTimeInterval
                                    "
                                >
                                    <el-input-number
                                        :precision="0"
                                        controls-position="right"
                                        v-model="
                                            newForm[`param703_${index}`]
                                                .locationReport
                                                .defaultReportTimeInterval
                                        "
                                        :min="
                                            JTplatformObj.locationReport
                                                .defaultReportTimeInterval.min
                                        "
                                        :max="
                                            JTplatformObj.locationReport
                                                .defaultReportTimeInterval.max
                                        "
                                        data-unit="s"
                                        @blur="
                                            (e) => {
                                                if (e.target.value === '') {
                                                    newForm[
                                                        `param703_${index}`
                                                    ].locationReport.defaultReportTimeInterval =
                                                        Number(
                                                            e.target
                                                                .ariaValueMin
                                                        );
                                                }
                                            }
                                        "
                                    ></el-input-number>
                                </el-form-item>
                            </div>
                        </template>
                    </el-collapse-item>
                </el-collapse>
            </div>
            <div
                v-if="
                    EHOMEplatformObj &&
                    EHOMEplatformObj.platformType &&
                    newForm[`param701`]
                "
            >
                <h3>
                    EHOME 5.0平台<i class="el-icon-warning"></i>
                    <span class="warning-msg"
                        >该配置项修改后需要重启设备才生效！</span
                    >
                </h3>
                <template v-if="newForm[`param701`]">
                    <div>
                        <h3>平台连接参数</h3>
                        <el-form-item
                            label="使能"
                            v-if="newForm[`param701`].hasOwnProperty('enable')"
                        >
                            <el-switch
                                v-model="newForm[`param701`].enable"
                                :active-value="Number(1)"
                                :inactive-value="Number(0)"
                            ></el-switch>
                        </el-form-item>
                        <el-form-item
                            label="地址"
                            v-if="newForm[`param701`].hasOwnProperty('ip')"
                        >
                            <el-input
                                v-model="newForm[`param701`].ip"
                                :maxlength="30"
                            />
                        </el-form-item>
                        <el-form-item
                            label="端口"
                            v-if="newForm[`param701`].hasOwnProperty('port')"
                        >
                            <el-input-number
                                :precision="0"
                                controls-position="right"
                                v-model="newForm[`param701`].port"
                                :max="65535"
                                @blur="
                                    (e) => {
                                        if (e.target.value === '') {
                                            newForm[
                                                `param703_${index}`
                                            ].locationReport.defaultReportTimeInterval = 0;
                                        }
                                    }
                                "
                            />
                        </el-form-item>

                        <el-form-item
                            label="终端ID"
                            v-if="
                                newForm[`param701`].hasOwnProperty('id') &&
                                tabPosition === 'tab1'
                            "
                        >
                            <el-input
                                onkeyup="value=value.replace(/[\W]/g,'')"
                                onafterpaste="value=value.replace(/[\W]/g,'')"
                                v-model="newForm[`param701`].id"
                                :maxlength="30"
                            />
                        </el-form-item>
                        <el-form-item
                            label="加密密钥"
                            v-if="
                                newForm[`param701`].hasOwnProperty(
                                    'securityKey'
                                )
                            "
                        >
                            <el-input
                                v-model="newForm[`param701`].securityKey"
                                :maxlength="64"
                            />
                        </el-form-item>
                    </div>
                    <div v-if="EHOMEplatformObj.locationReport">
                        <h3>上报时间间隔设置</h3>
                        <el-form-item
                            label="紧急报警汇报时间间隔"
                            v-if="
                                EHOMEplatformObj.locationReport &&
                                EHOMEplatformObj.locationReport
                                    .emergencyReportTimeInterval
                            "
                        >
                            <el-input-number
                                :precision="0"
                                controls-position="right"
                                v-model="
                                    newForm[`param701`].locationReport
                                        .emergencyReportTimeInterval
                                "
                                :min="
                                    EHOMEplatformObj.locationReport
                                        .emergencyReportTimeInterval.min
                                "
                                :max="
                                    EHOMEplatformObj.locationReport
                                        .emergencyReportTimeInterval.max
                                "
                                data-unit="s"
                                @blur="
                                    (e) => {
                                        if (e.target.value === '') {
                                            newForm[
                                                `param701`
                                            ].locationReport.emergencyReportTimeInterval =
                                                Number(e.target.ariaValueMin);
                                        }
                                    }
                                "
                            ></el-input-number>
                        </el-form-item>
                        <el-form-item
                            label="定位上传时间间隔"
                            v-if="
                                EHOMEplatformObj.locationReport &&
                                EHOMEplatformObj.locationReport
                                    .defaultReportTimeInterval
                            "
                        >
                            <el-input-number
                                :precision="0"
                                controls-position="right"
                                v-model="
                                    newForm[`param701`].locationReport
                                        .defaultReportTimeInterval
                                "
                                :min="
                                    EHOMEplatformObj.locationReport
                                        .defaultReportTimeInterval.min
                                "
                                :max="
                                    EHOMEplatformObj.locationReport
                                        .defaultReportTimeInterval.max
                                "
                                data-unit="s"
                                @blur="
                                    (e) => {
                                        if (e.target.value === '') {
                                            newForm[
                                                `param701`
                                            ].locationReport.defaultReportTimeInterval =
                                                Number(e.target.ariaValueMin);
                                        }
                                    }
                                "
                            ></el-input-number>
                        </el-form-item>
                    </div>
                </template>
            </div>
            <div
                v-if="
                    type28181platformObj &&
                    type28181platformObj.platformType &&
                    newForm[`param715`]
                "
            >
                <h3>
                    28181平台<i class="el-icon-warning"></i>
                    <span class="warning-msg"
                        >该配置项修改后需要重启设备才生效！</span
                    >
                </h3>
                <template v-if="newForm[`param715`]">
                    <div>
                        <h3>平台连接参数</h3>
                        <el-form-item
                            label="使能"
                            v-if="type28181platformObj.hasOwnProperty('enable')"
                        >
                            <el-switch
                                v-model="newForm[`param715`].enable"
                                :active-value="Number(1)"
                                :inactive-value="Number(0)"
                            ></el-switch>
                        </el-form-item>
                        <el-form-item
                            label="本地SIP端口"
                            v-if="
                                type28181platformObj.hasOwnProperty(
                                    'localSIPPort'
                                )
                            "
                        >
                            <el-input-number
                                :precision="0"
                                controls-position="right"
                                v-model="newForm[`param715`].localSIPPort"
                                :min="type28181platformObj.localSIPPort.min"
                                :max="type28181platformObj.localSIPPort.max"
                                @blur="
                                    (e) => {
                                        if (e.target.value === '') {
                                            newForm[`param715`].localSIPPort =
                                                Number(e.target.ariaValueMin);
                                        }
                                    }
                                "
                            />
                        </el-form-item>
                        <el-form-item
                            label="协议类型"
                            v-if="
                                type28181platformObj.hasOwnProperty(
                                    'transportProtocol'
                                )
                            "
                        >
                            <el-select
                                v-model="newForm[`param715`].transportProtocol"
                            >
                                <el-option
                                    v-for="item in type28181platformObj.transportProtocolList"
                                    :label="item.label"
                                    :value="item.value"
                                    :key="item.value"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item
                            label="协议版本"
                            v-if="
                                type28181platformObj.hasOwnProperty(
                                    'protocolVersion'
                                )
                            "
                        >
                            <el-select
                                v-model="newForm[`param715`].protocolVersion"
                            >
                                <el-option
                                    v-for="item in type28181platformObj.protocolVersionList"
                                    :label="item.label"
                                    :value="item.value"
                                    :key="item.value"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item
                            label="SIP服务器ID"
                            v-if="
                                type28181platformObj.hasOwnProperty('serverID')
                            "
                        >
                            <el-input
                                v-model="newForm[`param715`].serverID"
                                :minlength="type28181platformObj.serverID.min"
                                :maxlength="type28181platformObj.serverID.max"
                            />
                        </el-form-item>
                        <el-form-item
                            label="SIP服务器域"
                            v-if="
                                type28181platformObj.hasOwnProperty(
                                    'serverDomain'
                                )
                            "
                        >
                            <el-input
                                v-model="newForm[`param715`].serverDomain"
                                :minlength="
                                    type28181platformObj.serverDomain.min
                                "
                                :maxlength="
                                    type28181platformObj.serverDomain.max
                                "
                            />
                        </el-form-item>
                        <el-form-item
                            label="SIP服务器地址"
                            v-if="
                                type28181platformObj.hasOwnProperty(
                                    'serverAddress'
                                )
                            "
                        >
                            <el-input
                                v-model="newForm[`param715`].serverAddress"
                                :minlength="
                                    type28181platformObj.serverAddress.min
                                "
                                :maxlength="
                                    type28181platformObj.serverAddress.max
                                "
                            />
                        </el-form-item>
                        <el-form-item
                            label="SIP服务器端口"
                            v-if="
                                type28181platformObj.hasOwnProperty(
                                    'serverPort'
                                )
                            "
                        >
                            <el-input-number
                                :precision="0"
                                controls-position="right"
                                v-model="newForm[`param715`].serverPort"
                                :min="type28181platformObj.serverPort.min"
                                :max="type28181platformObj.serverPort.max"
                                @blur="
                                    (e) => {
                                        if (e.target.value === '') {
                                            newForm[`param715`].serverPort =
                                                Number(e.target.ariaValueMin);
                                        }
                                    }
                                "
                            />
                        </el-form-item>
                        <el-form-item
                            label="SIP用户名"
                            v-if="
                                type28181platformObj.hasOwnProperty('userName')
                            "
                        >
                            <el-input
                                v-model="newForm[`param715`].userName"
                                :minlength="type28181platformObj.userName.min"
                                :maxlength="type28181platformObj.userName.max"
                            />
                        </el-form-item>
                        <el-form-item
                            label="SIP用户认证ID"
                            v-if="
                                type28181platformObj.hasOwnProperty(
                                    'authorizationID'
                                )
                            "
                        >
                            <el-input
                                v-model="newForm[`param715`].authorizationID"
                                :minlength="
                                    type28181platformObj.authorizationID.min
                                "
                                :maxlength="
                                    type28181platformObj.authorizationID.max
                                "
                            />
                        </el-form-item>
                        <el-form-item
                            label="SIP密码"
                            v-if="
                                type28181platformObj.hasOwnProperty('password')
                            "
                        >
                            <el-input
                                v-model="newForm[`param715`].password"
                                :minlength="type28181platformObj.password.min"
                                :maxlength="type28181platformObj.password.max"
                            />
                        </el-form-item>
                        <el-form-item
                            label="注册有效期"
                            v-if="
                                type28181platformObj.hasOwnProperty(
                                    'regValidity'
                                )
                            "
                        >
                            <el-input-number
                                :precision="0"
                                controls-position="right"
                                v-model="newForm[`param715`].regValidity"
                                :min="type28181platformObj.regValidity.min"
                                :max="type28181platformObj.regValidity.max"
                                data-unit="s"
                                @blur="
                                    (e) => {
                                        if (e.target.value === '') {
                                            newForm[`param715`].regValidity =
                                                Number(e.target.ariaValueMin);
                                        }
                                    }
                                "
                            ></el-input-number>
                        </el-form-item>
                        <el-form-item
                            label="心跳周期"
                            v-if="
                                type28181platformObj.hasOwnProperty(
                                    'heartbeatCycle'
                                )
                            "
                        >
                            <el-input-number
                                :precision="0"
                                controls-position="right"
                                v-model="newForm[`param715`].heartbeatCycle"
                                :min="type28181platformObj.heartbeatCycle.min"
                                :max="type28181platformObj.heartbeatCycle.max"
                                data-unit="s"
                                @blur="
                                    (e) => {
                                        if (e.target.value === '') {
                                            newForm[`param715`].heartbeatCycle =
                                                Number(e.target.ariaValueMin);
                                        }
                                    }
                                "
                            ></el-input-number>
                        </el-form-item>
                        <el-form-item
                            label="码流类型"
                            v-if="
                                type28181platformObj.hasOwnProperty(
                                    'streamType'
                                )
                            "
                        >
                            <el-select v-model="newForm[`param715`].streamType">
                                <el-option
                                    v-for="item in type28181platformObj.streamTypeList"
                                    :label="item.label"
                                    :value="item.value"
                                    :key="item.value"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item
                            label="最大心跳超时次数"
                            v-if="
                                type28181platformObj.hasOwnProperty(
                                    'maxHeartbeatTimeout'
                                )
                            "
                        >
                            <el-input-number
                                :precision="0"
                                controls-position="right"
                                v-model="
                                    newForm[`param715`].maxHeartbeatTimeout
                                "
                                :min="
                                    type28181platformObj.maxHeartbeatTimeout.min
                                "
                                :max="
                                    type28181platformObj.maxHeartbeatTimeout.max
                                "
                                @blur="
                                    (e) => {
                                        if (e.target.value === '') {
                                            newForm[
                                                `param715`
                                            ].maxHeartbeatTimeout = Number(
                                                e.target.ariaValueMin
                                            );
                                        }
                                    }
                                "
                            ></el-input-number>
                        </el-form-item>
                    </div>
                    <div
                        v-if="type28181platformObj.hasOwnProperty('videoPort')"
                    >
                        <h3>视频端口设置</h3>
                        <el-form-item
                            :label="`第${videoPort.index}视频端口`"
                            v-for="(
                                videoPort, index
                            ) in type28181platformObj.videoPort"
                            :key="videoPort.index"
                            :prop="`param715.videoPort.${index}.port`"
                            :rules="[
                                {
                                    required: false,
                                    validator: validateRange,
                                    name: `第${videoPort.index}视频端口`,
                                    min: videoPort.port.min,
                                    max: videoPort.port.max,
                                },
                            ]"
                        >
                            <el-input
                                v-model="
                                    newForm[`param715`].videoPort[index].port
                                "
                                :minlength="videoPort.port.min"
                                :maxlength="videoPort.port.max"
                            />
                        </el-form-item>
                    </div>
                </template>
            </div>
        </el-form>
    </div>
</template>
<script>
import mixins from "@/mixins/mixins";
import { validateNumber } from "@/utils/validate";
export default {
    name: "platformParams",
    mixins: [mixins],
    components: {},
    props: {},
    data() {
        return {
            componentsName: "platformParams",
            collapseActiveName: "1",
            setForm: {},
            BBplatformList: [],
            JTplatformObj: {},
            EHOMEplatformObj: {},
            type28181platformObj: {},
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
                    this.BBplatformList.forEach((item, index) => {
                        if (val[`param705_${item.platformIndex}`]) {
                            let objName1 = `部标平台>${item.title}>平台连接参数&param705_${item.platformIndex}`;
                            if (!this.setForm.hasOwnProperty(objName1)) {
                                this.setForm[objName1] = {};
                            }
                            this.setForm[objName1].enable =
                                val[`param705_${item.platformIndex}`].enable !==
                                this.oldForm[`param705_${item.platformIndex}`]
                                    .enable
                                    ? `param705_${
                                          item.platformIndex
                                      }.enable&使能switch&${
                                          val[`param705_${item.platformIndex}`]
                                              .enable
                                      }`
                                    : null;
                            this.setForm[objName1].protocol =
                                val[`param705_${item.platformIndex}`]
                                    .protocol !==
                                this.oldForm[`param705_${item.platformIndex}`]
                                    .protocol
                                    ? `param705_${
                                          item.platformIndex
                                      }.protocol&接入协议number&${this.getLabelByProtocol(
                                          `network_platformInfo_${item.platformIndex}_platformDetail_accessProtocol`,
                                          val[`param705_${item.platformIndex}`]
                                              .protocol
                                      )}&${
                                          val[`param705_${item.platformIndex}`]
                                              .protocol
                                      }`
                                    : null;
                            this.setForm[objName1].type =
                                val[`param705_${item.platformIndex}`].type !==
                                this.oldForm[`param705_${item.platformIndex}`]
                                    .type
                                    ? `param705_${
                                          item.platformIndex
                                      }.type&协议类型number&${this.getLabelByType(
                                          `network_platformInfo_${item.platformIndex}_platformDetail_extensionProtocol`,
                                          val[`param705_${item.platformIndex}`]
                                              .protocol,
                                          val[`param705_${item.platformIndex}`]
                                              .type
                                      )}&${
                                          val[`param705_${item.platformIndex}`]
                                              .type
                                      }`
                                    : null;
                            this.setForm[objName1].ip =
                                val[`param705_${item.platformIndex}`].ip !==
                                this.oldForm[`param705_${item.platformIndex}`]
                                    .ip
                                    ? `param705_${item.platformIndex}.ip&地址&${
                                          val[`param705_${item.platformIndex}`]
                                              .ip
                                      }`
                                    : null;
                            this.setForm[objName1].port =
                                val[`param705_${item.platformIndex}`].port !==
                                this.oldForm[`param705_${item.platformIndex}`]
                                    .port
                                    ? `param705_${
                                          item.platformIndex
                                      }.port&端口&${
                                          val[`param705_${item.platformIndex}`]
                                              .port
                                      }`
                                    : null;
                            this.setForm[objName1].serial =
                                val[`param705_${item.platformIndex}`].serial !==
                                this.oldForm[`param705_${item.platformIndex}`]
                                    .serial
                                    ? `param705_${
                                          item.platformIndex
                                      }.serial&手机号&${
                                          val[`param705_${item.platformIndex}`]
                                              .serial
                                      }`
                                    : null;
                            this.setForm[objName1].id =
                                val[`param705_${item.platformIndex}`].id !==
                                this.oldForm[`param705_${item.platformIndex}`]
                                    .id
                                    ? `param705_${
                                          item.platformIndex
                                      }.id&终端ID&${
                                          val[`param705_${item.platformIndex}`]
                                              .id
                                      }`
                                    : null;
                            this.setForm[objName1].uploadEnable =
                                val[`param705_${item.platformIndex}`]
                                    .uploadEnable !==
                                this.oldForm[`param705_${item.platformIndex}`]
                                    .uploadEnable
                                    ? `param705_${
                                          item.platformIndex
                                      }.uploadEnable&主动安全报警使能switch&${
                                          val[`param705_${item.platformIndex}`]
                                              .uploadEnable
                                      }`
                                    : null;
                            let objName2 = `部标平台>${item.title}>位置汇报设置&param705_${item.platformIndex}`;
                            if (!this.setForm.hasOwnProperty(objName2)) {
                                this.setForm[objName2] = {};
                            }
                            if (
                                !this.setForm[objName2].hasOwnProperty(
                                    "locationReport"
                                )
                            ) {
                                this.setForm[objName2]["locationReport"] = {};
                            }
                            this.setForm[objName2][
                                "locationReport.reportStrategy"
                            ] =
                                val[`param705_${item.platformIndex}`]
                                    .locationReport.reportStrategy !==
                                this.oldForm[`param705_${item.platformIndex}`]
                                    .locationReport.reportStrategy
                                    ? `param705_${
                                          item.platformIndex
                                      }.locationReport.reportStrategy&汇报策略number&${this.getLabel(
                                          `network_platformInfo_${item.platformIndex}_locationReport_reportStrategy`,
                                          val[`param705_${item.platformIndex}`]
                                              .locationReport.reportStrategy
                                      )}&${
                                          val[`param705_${item.platformIndex}`]
                                              .locationReport.reportStrategy
                                      }`
                                    : null;
                            this.setForm[objName2][
                                "locationReport.reportPlan"
                            ] =
                                val[`param705_${item.platformIndex}`]
                                    .locationReport.reportPlan !==
                                this.oldForm[`param705_${item.platformIndex}`]
                                    .locationReport.reportPlan
                                    ? `param705_${
                                          item.platformIndex
                                      }.locationReport.reportPlan&汇报方案number&${this.getLabel(
                                          `network_platformInfo_${item.platformIndex}_locationReport_reportPlan`,
                                          val[`param705_${item.platformIndex}`]
                                              .locationReport.reportPlan
                                      )}&${
                                          val[`param705_${item.platformIndex}`]
                                              .locationReport.reportPlan
                                      }`
                                    : null;
                            let objName3 = `部标平台>${item.title}>拐点补传设置&param705_${item.platformIndex}`;
                            if (!this.setForm.hasOwnProperty(objName3)) {
                                this.setForm[objName3] = {};
                            }
                            if (
                                !this.setForm[objName3].hasOwnProperty(
                                    "locationReport"
                                )
                            ) {
                                this.setForm[objName3]["locationReport"] = {};
                            }
                            this.setForm[objName3][
                                "locationReport.inflectionAngle"
                            ] =
                                val[`param705_${item.platformIndex}`]
                                    .locationReport.inflectionAngle !==
                                this.oldForm[`param705_${item.platformIndex}`]
                                    .locationReport.inflectionAngle
                                    ? `param705_${
                                          item.platformIndex
                                      }.locationReport.inflectionAngle&拐点补传角度&${
                                          val[`param705_${item.platformIndex}`]
                                              .locationReport.inflectionAngle
                                      }`
                                    : null;
                            let objName4 = `部标平台>${item.title}>上报时间间隔设置&param705_${item.platformIndex}`;
                            if (!this.setForm.hasOwnProperty(objName4)) {
                                this.setForm[objName4] = {};
                            }
                            if (
                                !this.setForm[objName4].hasOwnProperty(
                                    "locationReport"
                                )
                            ) {
                                this.setForm[objName4]["locationReport"] = {};
                            }
                            this.setForm[objName4][
                                "locationReport.sleepReportTimeInterval"
                            ] =
                                val[`param705_${item.platformIndex}`]
                                    .locationReport.sleepReportTimeInterval !==
                                this.oldForm[`param705_${item.platformIndex}`]
                                    .locationReport.sleepReportTimeInterval
                                    ? `param705_${
                                          item.platformIndex
                                      }.locationReport.sleepReportTimeInterval&休眠汇报时间间隔&${
                                          val[`param705_${item.platformIndex}`]
                                              .locationReport
                                              .sleepReportTimeInterval
                                      }`
                                    : null;
                            this.setForm[objName4][
                                "locationReport.emergencyReportTimeInterval"
                            ] =
                                val[`param705_${item.platformIndex}`]
                                    .locationReport
                                    .emergencyReportTimeInterval !==
                                this.oldForm[`param705_${item.platformIndex}`]
                                    .locationReport.emergencyReportTimeInterval
                                    ? `param705_${
                                          item.platformIndex
                                      }.locationReport.emergencyReportTimeInterval&紧急报警汇报时间间隔&${
                                          val[`param705_${item.platformIndex}`]
                                              .locationReport
                                              .emergencyReportTimeInterval
                                      }`
                                    : null;
                            this.setForm[objName4][
                                "locationReport.defaultReportTimeInterval"
                            ] =
                                val[`param705_${item.platformIndex}`]
                                    .locationReport
                                    .defaultReportTimeInterval !==
                                this.oldForm[`param705_${item.platformIndex}`]
                                    .locationReport.defaultReportTimeInterval
                                    ? `param705_${
                                          item.platformIndex
                                      }.locationReport.defaultReportTimeInterval&定位上传时间间隔&${
                                          val[`param705_${item.platformIndex}`]
                                              .locationReport
                                              .defaultReportTimeInterval
                                      }`
                                    : null;
                            this.setForm[objName4][
                                "locationReport.driverNotLoginReportTimeInterval"
                            ] =
                                val[`param705_${item.platformIndex}`]
                                    .locationReport
                                    .driverNotLoginReportTimeInterval !==
                                this.oldForm[`param705_${item.platformIndex}`]
                                    .locationReport
                                    .driverNotLoginReportTimeInterval
                                    ? `param705_${
                                          item.platformIndex
                                      }.locationReport.driverNotLoginReportTimeInterval&驾驶员未登录汇报时间间隔&${
                                          val[`param705_${item.platformIndex}`]
                                              .locationReport
                                              .driverNotLoginReportTimeInterval
                                      }`
                                    : null;
                            let objName5 = `部标平台>${item.title}>上报距离间隔设置&param705_${item.platformIndex}`;
                            if (!this.setForm.hasOwnProperty(objName5)) {
                                this.setForm[objName5] = {};
                            }
                            if (
                                !this.setForm[objName5].hasOwnProperty(
                                    "locationReport"
                                )
                            ) {
                                this.setForm[objName5]["locationReport"] = {};
                            }
                            this.setForm[objName5][
                                "locationReport.defaultReportDistanceInterval"
                            ] =
                                val[`param705_${item.platformIndex}`]
                                    .locationReport
                                    .defaultReportDistanceInterval !==
                                this.oldForm[`param705_${item.platformIndex}`]
                                    .locationReport
                                    .defaultReportDistanceInterval
                                    ? `param705_${
                                          item.platformIndex
                                      }.locationReport.defaultReportDistanceInterval&缺省距离汇报间隔&${
                                          val[`param705_${item.platformIndex}`]
                                              .locationReport
                                              .defaultReportDistanceInterval
                                      }`
                                    : null;
                            this.setForm[objName5][
                                "locationReport.driverNotLoginReportDistanceInterval"
                            ] =
                                val[`param705_${item.platformIndex}`]
                                    .locationReport
                                    .driverNotLoginReportDistanceInterval !==
                                this.oldForm[`param705_${item.platformIndex}`]
                                    .locationReport
                                    .driverNotLoginReportDistanceInterval
                                    ? `param705_${
                                          item.platformIndex
                                      }.locationReport.driverNotLoginReportDistanceInterval&驾驶员未登录汇报距离间隔&${
                                          val[`param705_${item.platformIndex}`]
                                              .locationReport
                                              .driverNotLoginReportDistanceInterval
                                      }`
                                    : null;
                            this.setForm[objName5][
                                "locationReport.sleepReportDistanceInterval"
                            ] =
                                val[`param705_${item.platformIndex}`]
                                    .locationReport
                                    .sleepReportDistanceInterval !==
                                this.oldForm[`param705_${item.platformIndex}`]
                                    .locationReport.sleepReportDistanceInterval
                                    ? `param705_${
                                          item.platformIndex
                                      }.locationReport.sleepReportDistanceInterval&休眠时汇报距离间隔&${
                                          val[`param705_${item.platformIndex}`]
                                              .locationReport
                                              .sleepReportDistanceInterval
                                      }`
                                    : null;
                            this.setForm[objName5][
                                "locationReport.emerReportDistanceInterval"
                            ] =
                                val[`param705_${item.platformIndex}`]
                                    .locationReport
                                    .emerReportDistanceInterval !==
                                this.oldForm[`param705_${item.platformIndex}`]
                                    .locationReport.emerReportDistanceInterval
                                    ? `param705_${
                                          item.platformIndex
                                      }.locationReport.emerReportDistanceInterval&紧急报警时汇报距离间隔&${
                                          val[`param705_${item.platformIndex}`]
                                              .locationReport
                                              .emerReportDistanceInterval
                                      }`
                                    : null;
                        }
                    });
                    if (this.JTplatformObj && this.JTplatformObj.platformType) {
                        for (
                            let index = 0;
                            index < this.JTplatformObj.platformCount;
                            index++
                        ) {
                            if (val[`param703_${index}`]) {
                                let objName6 = `JT平台>第${
                                    index + 1
                                }中心>平台连接参数&param703_${index}`;
                                if (!this.setForm.hasOwnProperty(objName6)) {
                                    this.setForm[objName6] = {};
                                }
                                this.setForm[objName6].enable =
                                    val[`param703_${index}`].enable !==
                                    this.oldForm[`param703_${index}`].enable
                                        ? `param703_${index}.enable&使能switch&${
                                              val[`param703_${index}`].enable
                                          }`
                                        : null;
                                this.setForm[objName6].accessProtocol =
                                    val[`param703_${index}`].accessProtocol !==
                                    this.oldForm[`param703_${index}`]
                                        .accessProtocol
                                        ? `param703_${index}.accessProtocol&接入协议&${this.getLabelByJT(
                                              this.JTplatformObj
                                                  .accessProtocolList,
                                              val[`param703_${index}`]
                                                  .accessProtocol
                                          )}&${
                                              val[`param703_${index}`]
                                                  .accessProtocol
                                          }`
                                        : null;
                                this.setForm[objName6].protocol =
                                    val[`param703_${index}`].protocol !==
                                    this.oldForm[`param703_${index}`].protocol
                                        ? `param703_${index}.protocol&协议类型&${this.getLabelByJT(
                                              this.JTplatformObj.protocolList,
                                              val[`param703_${index}`].protocol
                                          )}&${
                                              val[`param703_${index}`].protocol
                                          }`
                                        : null;
                                this.setForm[objName6].ip =
                                    val[`param703_${index}`].ip !==
                                    this.oldForm[`param703_${index}`].ip
                                        ? `param703_${index}.ip&地址&${
                                              val[`param703_${index}`].ip
                                          }`
                                        : null;
                                this.setForm[objName6].port =
                                    val[`param703_${index}`].port !==
                                    this.oldForm[`param703_${index}`].port
                                        ? `param703_${index}.port&端口&${
                                              val[`param703_${index}`].port
                                          }`
                                        : null;
                                this.setForm[objName6].serial =
                                    val[`param703_${index}`].serial !==
                                    this.oldForm[`param703_${index}`].serial
                                        ? `param703_${index}.serial&SIM卡号&${
                                              val[`param703_${index}`].serial
                                          }`
                                        : null;
                                this.setForm[objName6].id =
                                    val[`param703_${index}`].id !==
                                    this.oldForm[`param703_${index}`].id
                                        ? `param703_${index}.id&终端ID&${
                                              val[`param703_${index}`].id
                                          }`
                                        : null;
                                this.setForm[objName6].uploadEnable =
                                    val[`param703_${index}`].uploadEnable !==
                                    this.oldForm[`param703_${index}`]
                                        .uploadEnable
                                        ? `param703_${index}.uploadEnable&主动安全报警使能switch&${
                                              val[`param703_${index}`]
                                                  .uploadEnable
                                          }`
                                        : null;
                                let objName14 = `JT平台>第${
                                    index + 1
                                }中心>上报时间间隔设置&param703_${index}`;
                                if (!this.setForm.hasOwnProperty(objName14)) {
                                    this.setForm[objName14] = {};
                                }
                                if (
                                    !this.setForm[objName14].hasOwnProperty(
                                        "locationReport"
                                    )
                                ) {
                                    this.setForm[objName14]["locationReport"] =
                                        {};
                                }
                                if (val[`param703_${index}`].locationReport) {
                                    this.setForm[objName14][
                                        "locationReport.emergencyReportTimeInterval"
                                    ] =
                                        val[`param703_${index}`].locationReport
                                            .emergencyReportTimeInterval !==
                                        this.oldForm[`param703_${index}`]
                                            .locationReport
                                            .emergencyReportTimeInterval
                                            ? `param703_${index}.locationReport.emergencyReportTimeInterval&紧急报警汇报时间间隔&${
                                                  val[`param703_${index}`]
                                                      .locationReport
                                                      .emergencyReportTimeInterval
                                              }`
                                            : null;
                                    this.setForm[objName14][
                                        "locationReport.defaultReportTimeInterval"
                                    ] =
                                        val[`param703_${index}`].locationReport
                                            .defaultReportTimeInterval !==
                                        this.oldForm[`param703_${index}`]
                                            .locationReport
                                            .defaultReportTimeInterval
                                            ? `param703_${index}.locationReport.defaultReportTimeInterval&定位上传时间间隔&${
                                                  val[`param703_${index}`]
                                                      .locationReport
                                                      .defaultReportTimeInterval
                                              }`
                                            : null;
                                }
                            }
                        }
                    }
                    if (val[`param701`]) {
                        let objName7 = `EHOME 5.0平台>平台连接参数&param701`;
                        if (!this.setForm.hasOwnProperty(objName7)) {
                            this.setForm[objName7] = {};
                        }
                        this.setForm[objName7].enable =
                            val[`param701`].enable !==
                            this.oldForm[`param701`].enable
                                ? `param701.enable&使能switch&${
                                      val[`param701`].enable
                                  }`
                                : null;
                        this.setForm[objName7].ip =
                            val[`param701`].ip !== this.oldForm[`param701`].ip
                                ? `param701.ip&地址&${val[`param701`].ip}`
                                : null;
                        this.setForm[objName7].port =
                            val[`param701`].port !==
                            this.oldForm[`param701`].port
                                ? `param701.port&端口&${val[`param701`].port}`
                                : null;

                        this.setForm[objName7].id =
                            val[`param701`].id !== this.oldForm[`param701`].id
                                ? `param701.id&终端ID&${val[`param701`].id}`
                                : null;
                        this.setForm[objName7].serial =
                            val[`param701`].securityKey !==
                            this.oldForm[`param701`].securityKey
                                ? `param701.securityKey&加密密钥&${
                                      val[`param701`].securityKey
                                  }`
                                : null;
                        let objName15 = `EHOME 5.0平台>上报时间间隔设置&param701`;
                        if (!this.setForm.hasOwnProperty(objName15)) {
                            this.setForm[objName15] = {};
                        }
                        if (
                            !this.setForm[objName15].hasOwnProperty(
                                "locationReport"
                            )
                        ) {
                            this.setForm[objName15]["locationReport"] = {};
                        }
                        if (val[`param701`].locationReport) {
                            this.setForm[objName15][
                                "locationReport.emergencyReportTimeInterval"
                            ] =
                                val[`param701`].locationReport
                                    .emergencyReportTimeInterval !==
                                this.oldForm[`param701`].locationReport
                                    .emergencyReportTimeInterval
                                    ? `param701.locationReport.emergencyReportTimeInterval&紧急报警汇报时间间隔&${
                                          val[`param701`].locationReport
                                              .emergencyReportTimeInterval
                                      }`
                                    : null;
                            this.setForm[objName15][
                                "locationReport.defaultReportTimeInterval"
                            ] =
                                val[`param701`].locationReport
                                    .defaultReportTimeInterval !==
                                this.oldForm[`param701`].locationReport
                                    .defaultReportTimeInterval
                                    ? `param701.locationReport.defaultReportTimeInterval&定位上传时间间隔&${
                                          val[`param701`].locationReport
                                              .defaultReportTimeInterval
                                      }`
                                    : null;
                        }
                    }
                    if (val[`param715`]) {
                        let objName8 = `28181平台>平台连接参数&param715`;
                        if (!this.setForm.hasOwnProperty(objName8)) {
                            this.setForm[objName8] = {};
                        }
                        this.setForm[objName8].enable =
                            val[`param715`].enable !==
                            this.oldForm[`param715`].enable
                                ? `param715.enable&使能switch&${
                                      val[`param715`].enable
                                  }`
                                : null;
                        this.setForm[objName8].localSIPPort =
                            val[`param715`].localSIPPort !==
                            this.oldForm[`param715`].localSIPPort
                                ? `param715.localSIPPort&本地SIP端口number&${
                                      val[`param715`].localSIPPort
                                  }`
                                : null;
                        this.setForm[objName8].transportProtocol =
                            val[`param715`].transportProtocol !==
                            this.oldForm[`param715`].transportProtocol
                                ? `param715.transportProtocol&协议类型&${this.getLabelByJT(
                                      this.type28181platformObj
                                          .transportProtocolList,
                                      val[`param715`].transportProtocol
                                  )}&${val[`param715`].transportProtocol}`
                                : null;
                        this.setForm[objName8].protocolVersion =
                            val[`param715`].protocolVersion !==
                            this.oldForm[`param715`].protocolVersion
                                ? `param715.protocolVersion&协议版本&${this.getLabelByJT(
                                      this.type28181platformObj
                                          .protocolVersionList,
                                      val[`param715`].protocolVersion
                                  )}&${val[`param715`].protocolVersion}`
                                : null;
                        this.setForm[objName8].serverID =
                            val[`param715`].serverID !==
                            this.oldForm[`param715`].serverID
                                ? `param715.serverID&SIP服务器ID&${
                                      val[`param715`].serverID
                                  }`
                                : null;
                        this.setForm[objName8].serverDomain =
                            val[`param715`].serverDomain !==
                            this.oldForm[`param715`].serverDomain
                                ? `param715.serverDomain&SIP服务器域&${
                                      val[`param715`].serverDomain
                                  }`
                                : null;
                        this.setForm[objName8].serverAddress =
                            val[`param715`].serverAddress !==
                            this.oldForm[`param715`].serverAddress
                                ? `param715.serverAddress&SIP服务器地址&${
                                      val[`param715`].serverAddress
                                  }`
                                : null;
                        this.setForm[objName8].serverPort =
                            val[`param715`].serverPort !==
                            this.oldForm[`param715`].serverPort
                                ? `param715.serverPort&SIP服务器端口number&${
                                      val[`param715`].serverPort
                                  }`
                                : null;
                        this.setForm[objName8].userName =
                            val[`param715`].userName !==
                            this.oldForm[`param715`].userName
                                ? `param715.userName&SIP用户名&${
                                      val[`param715`].userName
                                  }`
                                : null;
                        this.setForm[objName8].authorizationID =
                            val[`param715`].authorizationID !==
                            this.oldForm[`param715`].authorizationID
                                ? `param715.authorizationID&SIP用户认证ID&${
                                      val[`param715`].authorizationID
                                  }`
                                : null;
                        this.setForm[objName8].password =
                            val[`param715`].password !==
                            this.oldForm[`param715`].password
                                ? `param715.password&SIP密码&${
                                      val[`param715`].password
                                  }`
                                : null;
                        this.setForm[objName8].regValidity =
                            val[`param715`].regValidity !==
                            this.oldForm[`param715`].regValidity
                                ? `param715.regValidity&注册有效期number&${
                                      val[`param715`].regValidity
                                  }`
                                : null;
                        this.setForm[objName8].heartbeatCycle =
                            val[`param715`].heartbeatCycle !==
                            this.oldForm[`param715`].heartbeatCycle
                                ? `param715.heartbeatCycle&心跳周期&${
                                      val[`param715`].heartbeatCycle
                                  }`
                                : null;
                        this.setForm[objName8].streamType =
                            val[`param715`].streamType !==
                            this.oldForm[`param715`].streamType
                                ? `param715.streamType&码流类型&${this.getLabelByJT(
                                      this.type28181platformObj.streamTypeList,
                                      val[`param715`].streamType
                                  )}&${val[`param715`].streamType}`
                                : null;
                        this.setForm[objName8].maxHeartbeatTimeout =
                            val[`param715`].maxHeartbeatTimeout !==
                            this.oldForm[`param715`].maxHeartbeatTimeout
                                ? `param715.maxHeartbeatTimeout&最大心跳超时次数number&${
                                      val[`param715`].maxHeartbeatTimeout
                                  }`
                                : null;
                        let objName2 = `28181平台>视频端口设置&param715`;
                        if (!this.setForm.hasOwnProperty(objName2)) {
                            this.setForm[objName2] = {};
                        }
                        if (
                            !this.setForm[objName2].hasOwnProperty("videoPort")
                        ) {
                            this.setForm[objName2]["videoPort"] = [];
                        }

                        for (
                            let i = 0;
                            i < this.type28181platformObj.videoPort.length;
                            i++
                        ) {
                            if (
                                this.setForm[objName2].videoPort[i] ===
                                undefined
                            ) {
                                this.setForm[objName2].videoPort[i] = {};
                            }
                            this.setForm[objName2][`videoPort.${i}.port`] =
                                val[`param715`].videoPort[i].port !==
                                this.oldForm[`param715`].videoPort[i].port
                                    ? `param715.videoPort.${i}.port&第${
                                          this.type28181platformObj.videoPort[i]
                                              .index
                                      }视频端口&${
                                          val[`param715`].videoPort[i].port
                                      }`
                                    : null;
                        }
                    }
                    this.$emit("setFormChange", {
                        平台参数: this.setForm,
                    });
                }
            },
            deep: true,
            immediate: true,
        },
    },
    methods: {
        getLabelByJT(obj, val) {
            return obj.find((e) => e.value === val).label;
        },
        getLabelByProtocol(obj, val) {
            return this.enumeration[obj].list.find((e) => e.value === val)
                .label;
        },
        getLabelByType(obj1, obj2, val) {
            return this.enumeration[obj1][obj2].find((e) => e.value === val)
                .label;
        },
        initConfig() {
            this.$emit("setFormLoading", true);
            let initConfigList = [];
            this.BBplatformList = this.capability.network.platformInfo.filter(
                (item) => item.platformType === 1 && !item.platformOption
            );
            this.BBplatformList.forEach((item, index) => {
                if (item.isHikPlatform) {
                    item.title = `海康云平台`;
                } else {
                    item.title = `第${index + 1}中心`;
                }
                item.platformIndex = index;
            });
            let obj = {};
            this.BBplatformList.length &&
                this.BBplatformList.forEach((item, index) => {
                    if (item.isHikPlatform === 1) {
                        obj = item;
                        this.BBplatformList.splice(index, 1);
                        this.BBplatformList.unshift(obj);
                        return;
                    }
                });
            if (this.BBplatformList.length) {
                this.BBplatformList.forEach((item, index) => {
                    initConfigList.push(
                        this.getEHomeConfig(705, {
                            platformOrder: item.platformIndex,
                        })
                    );
                });
            }
            this.JTplatformObj = this.capability.network.platformInfo.find(
                (item) => item.platformType === 1 && item.platformOption
            );
            if (this.JTplatformObj && this.JTplatformObj.platformOption) {
                let newPlatformOption = [];
                let newPlatformOptionObj = {
                    3: 0,
                    12: 1,
                    4: 11,
                    9: 12,
                };
                this.JTplatformObj.platformOption.forEach((item) => {
                    if (newPlatformOptionObj.hasOwnProperty(Number(item))) {
                        newPlatformOption.push(newPlatformOptionObj[Number(item)]);
                    } else {
                        newPlatformOption.push(Number(item));
                    }
                    // for (let key in newPlatformOptionObj) {
                    //     if (Number(key) === Number(item)) {
                    //         newPlatformOption.push(newPlatformOptionObj[key]);
                    //     }
                    // }
                });
                this.JTplatformObj.protocolList = this.getEnumerationValue(
                    newPlatformOption,
                    "network_platformInfo_platformOption"
                );
                this.JTplatformObj.accessProtocolList =
                    this.getEnumerationValue(
                        this.JTplatformObj.accessProtocol,
                        "network_JT_platformInfo_platformDetail_accessProtocol"
                    );
                for (let i = 0; i < this.JTplatformObj.platformCount; i++) {
                    initConfigList.push(
                        this.getEHomeConfig(703, {
                            platformOrder: i,
                        })
                    );
                }
            }
            this.EHOMEplatformObj = this.capability.network.platformInfo.find(
                (item) => item.platformType === 17
            );
            if (this.EHOMEplatformObj && this.EHOMEplatformObj.platformType) {
                initConfigList.push(
                    this.getEHomeConfig(701, {
                        platformOrder: 0,
                        type: 17,
                    })
                );
            }
            this.type28181platformObj =
                this.capability.network.platformInfo.find(
                    (item) =>
                        item.platformType === 19 &&
                        item.platform28181 &&
                        item.platform28181.length
                );
            if (this.type28181platformObj) {
                this.type28181platformObj = {
                    ...this.type28181platformObj.platform28181[0],
                    platformType: 19,
                };
                this.type28181platformObj.transportProtocolList =
                    this.getEnumerationValue(
                        this.type28181platformObj.transportProtocol,
                        "network_platformInfo_28181_transportProtocol"
                    );
                this.type28181platformObj.protocolVersionList =
                    this.getEnumerationValue(
                        this.type28181platformObj.protocolVersion,
                        "network_platformInfo_28181_protocolVersion"
                    );
                this.type28181platformObj.streamTypeList =
                    this.getEnumerationValue(
                        this.type28181platformObj.streamType,
                        "network_platformInfo_28181_streamType"
                    );

                initConfigList.push(
                    this.getEHomeConfig(715, {
                        platformOrder: 0,
                    })
                );
            }
            Promise.all(initConfigList).then((result) => {
                this.$emit("setFormLoading", false);
                this.$emit("loadingSuccess");
            });
        },
    },
};
</script>
<style lang="less" scoped>
@import "./configurationForm.less";
</style>
