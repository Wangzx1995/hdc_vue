<template>
    <div class="configuration-form">
        <el-form
            :label-width="`${labelWidth}px`"
            :model="newForm"
            :inline="true"
            ref="form"
            :rules="rules"
        >
            <div
                v-if="
                    (newForm['param1301'] &&
                        capability['zhatu'] &&
                        capability['zhatu']['workMode']) ||
                    (newForm['param32'] &&
                        capability['generic'] &&
                        capability['generic']['schemeType'])
                "
            >
                <h3>
                    {{ $t("protocolConfig.equipmentInformation") }}
                    <i class="el-icon-warning"></i>
                    <span class="warning-msg">
                        {{ $t("protocolConfig.equipmentInformationMsg") }}</span
                    >
                </h3>

                <el-form-item
                    :label="$t('protocolConfig.workMode')"
                    v-if="
                        newForm['param1301'] &&
                        capability['zhatu'] &&
                        capability['zhatu']['workMode']
                    "
                >
                    <el-select v-model="newForm['param1301'].workMode">
                        <el-option
                            v-for="item in enumeration['zhatu_workMode']"
                            :label="item.label"
                            :value="item.value"
                            :key="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item
                    :label="$t('protocolConfig.schemeType')"
                    v-if="
                        newForm['param32'] &&
                        capability['generic'] &&
                        capability['generic']['schemeType']
                    "
                >
                    <el-select v-model="newForm['param32'].type">
                        <el-option
                            v-for="item in enumeration['generic_schemeType']"
                            :label="item.label"
                            :value="item.value"
                            :key="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
            </div>
            <div
                v-if="
                    showParam306 &&
                    capability['network'] &&
                    capability['network']['internet'] &&
                    capability['network']['internet'].length
                "
            >
                <h3>
                    {{ $t("protocolConfig.dialingConfiguration") }}
                    <i class="el-icon-warning"></i>
                    <span class="warning-msg">
                        {{ $t("protocolConfig.dialingConfigurationMsg") }}
                    </span>
                </h3>
                <el-collapse v-model="collapse_306_ActiveName">
                    <el-collapse-item
                        v-for="(tabItem, index) in capability['network'][
                            'internet'
                        ]"
                        :key="index"
                        :title="`${$t('protocolConfig.cardNumber')}${
                            tabItem.index
                        }`"
                        :name="tabItem.index"
                        arrowPlacement="right"
                        v-show="newForm[`param306_${tabItem.index}`]"
                    >
                        <template v-if="newForm[`param306_${tabItem.index}`]">
                            <el-form-item
                                :label="$t('protocolConfig.enable')"
                                v-if="tabItem['enable']"
                            >
                                <el-switch
                                    v-model="
                                        newForm[`param306_${tabItem.index}`]
                                            .enable
                                    "
                                    :active-value="Number(1)"
                                    :inactive-value="Number(0)"
                                    :disabled="
                                        (deviceInfo &&
                                            deviceInfo.deviceModelCode) !==
                                        'AE-DT0000-G1'
                                    "
                                ></el-switch>
                            </el-form-item>

                            <el-form-item
                                :label="$t('protocolConfig.apn')"
                                v-if="tabItem['apn']"
                            >
                                <el-input
                                    v-model="
                                        newForm[`param306_${tabItem.index}`].apn
                                    "
                                />
                            </el-form-item>

                            <el-form-item
                                :label="$t('protocolConfig.telephone')"
                                v-if="tabItem['telephone']"
                            >
                                <el-input
                                    v-model="
                                        newForm[`param306_${tabItem.index}`]
                                            .telephone
                                    "
                                />
                            </el-form-item>

                            <el-form-item
                                :label="$t('protocolConfig.username')"
                                v-if="tabItem['username']"
                            >
                                <el-input
                                    v-model="
                                        newForm[`param306_${tabItem.index}`]
                                            .username
                                    "
                                />
                            </el-form-item>

                            <el-form-item
                                :label="$t('protocolConfig.password')"
                                v-if="tabItem['password']"
                            >
                                <el-input
                                    v-model="
                                        newForm[`param306_${tabItem.index}`]
                                            .password
                                    "
                                />
                            </el-form-item>

                            <el-form-item
                                :label="$t('protocolConfig.mtu')"
                                v-if="tabItem['mtu']"
                            >
                                <el-input-number
                                    :precision="0"
                                    controls-position="right"
                                    v-model="
                                        newForm[`param306_${tabItem.index}`].mtu
                                    "
                                    :min="tabItem.mtu.min"
                                    :max="tabItem.mtu.max"
                                    @blur="
                                        (e) => {
                                            if (e.target.value === '') {
                                                newForm[
                                                    `param306_${tabItem.index}`
                                                ].mtu = Number(
                                                    e.target.ariaValueMin
                                                );
                                            }
                                        }
                                    "
                                />
                            </el-form-item>

                            <el-form-item
                                :label="$t('protocolConfig.verify')"
                                v-if="tabItem['verify']"
                            >
                                <el-select
                                    v-model="
                                        newForm[`param306_${tabItem.index}`]
                                            .verify
                                    "
                                >
                                    <el-option
                                        v-for="item in enumeration[
                                            'network_internet_verify'
                                        ]"
                                        :label="item.label"
                                        :value="item.value"
                                        :key="item.value"
                                    ></el-option>
                                </el-select>
                            </el-form-item>

                            <el-form-item
                                :label="$t('protocolConfig.band')"
                                v-if="tabItem['band']"
                            >
                                <el-select
                                    v-model="
                                        newForm[`param306_${tabItem.index}`]
                                            .band
                                    "
                                >
                                    <el-option
                                        v-for="item in enumeration[
                                            'network_internet_band'
                                        ]"
                                        :label="item.label"
                                        :value="item.value"
                                        :key="item.value"
                                    ></el-option>
                                </el-select>
                            </el-form-item>
                        </template>
                    </el-collapse-item>
                </el-collapse>
            </div>
            <div
                v-if="
                    newForm['param192'] &&
                    capability['generic'] &&
                    (capability['generic']['shutdownDelay'] ||
                        capability['generic']['shutdownDelayCustom'])
                "
            >
                <h3>
                    {{ $t("protocolConfig.delayedShutdown") }}
                </h3>

                <el-form-item
                    :label="$t('protocolConfig.shutdownDelayCustom')"
                    v-if="
                        capability['generic'] &&
                        (capability['generic']['shutdownDelay'] ||
                            capability['generic']['shutdownDelayCustom'])
                    "
                >
                    <el-select
                        v-if="capability.generic.shutdownDelay"
                        v-model="newForm['param192'].shutdownDelay"
                    >
                        <el-option
                            v-for="item in enumeration[
                                'generic_shutdownDelayCustom'
                            ]"
                            :label="item.label"
                            :value="item.value"
                            :key="item.value"
                        ></el-option>
                    </el-select>
                    <el-input-number
                        :precision="0"
                        controls-position="right"
                        v-else
                        v-model="newForm['param192'].shutdownDelayCustom"
                        :min="capability.generic.shutdownDelayCustom.min"
                        :max="capability.generic.shutdownDelayCustom.max"
                        @blur="
                            (e) => {
                                if (e.target.value === '') {
                                    newForm['param192'].shutdownDelayCustom =
                                        Number(e.target.ariaValueMin);
                                }
                            }
                        "
                    />
                </el-form-item>
            </div>
            <div
                v-if="
                    newForm['param721'] &&
                    capability['network'] &&
                    capability['network']['remoteTime']
                "
            >
                <h3>
                    {{ $t("protocolConfig.sleepConfiguration") }}
                </h3>

                <el-form-item
                    :label="$t('protocolConfig.enable')"
                    v-if="
                        capability['network'] &&
                        capability['network']['remoteTime'] &&
                        capability['network']['remoteTime']['enable']
                    "
                >
                    <el-switch
                        v-model="newForm['param721'].enable"
                        :active-value="Number(1)"
                        :inactive-value="Number(0)"
                    ></el-switch>
                </el-form-item>

                <el-form-item
                    :label="$t('protocolConfig.awakenTime')"
                    v-if="
                        capability['network'] &&
                        capability['network']['remoteTime'] &&
                        capability['network']['remoteTime']['awaken']
                    "
                >
                    <el-input-number
                        :precision="0"
                        controls-position="right"
                        v-model="newForm['param721'].awakenTime"
                        :min="capability.network.remoteTime.awaken.min"
                        :max="capability.network.remoteTime.awaken.max"
                        @blur="
                            (e) => {
                                if (e.target.value === '') {
                                    newForm['param721'].awakenTime = Number(
                                        e.target.ariaValueMin
                                    );
                                }
                            }
                        "
                    />
                </el-form-item>
            </div>
            <div
                v-if="
                    newForm['param2205_1_audio'] &&
                    capability['generic'] &&
                    (capability['generic']['voiceCallOutput'] ||
                        capability['generic']['volume'] ||
                        capability['generic']['audioOutput'] ||
                        capability['generic']['alarmFollowSystem'])
                "
            >
                <h3>
                    {{ $t("protocolConfig.audioOutputModule") }}
                </h3>

                <el-form-item
                    :label="$t('protocolConfig.voiceCallOutput')"
                    v-if="
                        capability['generic'] &&
                        capability['generic']['voiceCallOutput']
                    "
                >
                    <el-select
                        v-model="newForm['param2205_1_audio'].voiceCallOutput"
                    >
                        <el-option
                            v-for="item in enumeration[
                                'generic_voiceCallOutput'
                            ]"
                            :label="item.label"
                            :value="item.value"
                            :key="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item
                    :label="$t('protocolConfig.volume')"
                    v-if="
                        capability['generic'] && capability['generic']['volume']
                    "
                >
                    <el-input-number
                        :precision="0"
                        controls-position="right"
                        v-model="newForm['param2205_1_audio'].volume"
                        :min="capability.generic.volume.min"
                        :max="capability.generic.volume.max"
                        @blur="
                            (e) => {
                                if (e.target.value === '') {
                                    newForm['param2205_1_audio'].volume =
                                        Number(e.target.ariaValueMin);
                                }
                            }
                        "
                    />
                </el-form-item>

                <el-form-item
                    :label="$t('protocolConfig.audioOutput')"
                    v-if="
                        capability['generic'] &&
                        capability['generic']['audioOutput']
                    "
                >
                    <el-select
                        v-model="newForm['param2205_1_audio'].audioOutput"
                    >
                        <el-option
                            v-for="item in enumeration['generic_audioOutput']"
                            :label="item.label"
                            :value="item.value"
                            :key="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item
                    :label="$t('protocolConfig.alarmFollowSystem')"
                    v-if="
                        capability['generic'] &&
                        capability['generic']['alarmFollowSystem']
                    "
                >
                    <el-switch
                        v-model="newForm['param2205_1_audio'].alarmFollowSystem"
                        :active-value="Number(1)"
                        :inactive-value="Number(0)"
                    ></el-switch>
                </el-form-item>
            </div>
            <div
                v-if="
                    showEventDisplay &&
                    capability.intelliDrive_sensor &&
                    capability.intelliDrive_sensor.eventDisplay &&
                    capability.intelliDrive_sensor.eventDisplay.length
                "
            >
                <h3>
                    {{ $t("protocolConfig.displayOutput") }}
                </h3>
                <el-tabs
                    style="margin-bottom: 16px"
                    v-model="eventDisplayActiveName"
                    type="border-card"
                    :before-leave="tabBeforeLeave"
                >
                    <el-tab-pane
                        v-for="(item, index) in eventDisplayList"
                        :key="item.value"
                        :label="item.label"
                        :name="item.label"
                    >
                        <template v-if="newForm[`param950_${item.value}`]">
                            <div>
                                <el-form-item
                                    :label="$t('protocolConfig.enable')"
                                    v-if="
                                        capability.intelliDrive_sensor
                                            .eventDisplay[index].enable
                                    "
                                >
                                    <el-switch
                                        v-model="
                                            newForm[`param950_${item.value}`]
                                                .enable
                                        "
                                        :active-value="Number(1)"
                                        :inactive-value="Number(0)"
                                    ></el-switch>
                                </el-form-item>

                                <el-form-item
                                    :label="$t('protocolConfig.splitType')"
                                    v-if="
                                        capability.intelliDrive_sensor
                                            .eventDisplay[index].splitType
                                    "
                                >
                                    <el-select
                                        v-model="
                                            newForm[`param950_${item.value}`]
                                                .splitType
                                        "
                                    >
                                        <el-option
                                            v-for="item2 in capability
                                                .intelliDrive_sensor
                                                .eventDisplay[index].splitType"
                                            :label="
                                                getJsonLabel(
                                                    'intelliDrive_sensor_splitType',
                                                    item2
                                                )
                                            "
                                            :value="item2"
                                            :key="item2"
                                        ></el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                            <div>
                                <split-type-box
                                    :value="item.value"
                                    :splitChanBinds="
                                        newForm[`param950_${item.value}`]
                                            .splitChanBinds
                                    "
                                    :splitType="
                                        newForm[`param950_${item.value}`]
                                            .splitType
                                    "
                                    :splitChans="
                                        capability.intelliDrive_sensor
                                            .eventDisplay[index].splitChans
                                    "
                                    @chanNoChange="chanNoChange"
                                ></split-type-box>
                            </div>
                        </template>
                    </el-tab-pane>
                </el-tabs>
            </div>
            <div
                v-if="
                    newForm['param34'] &&
                    capability['generic'] &&
                    capability['generic']['GPSCompensation']
                "
            >
                <h3>
                    {{ $t("protocolConfig.GPSConfiguration") }}
                </h3>

                <el-form-item
                    :label="$t('protocolConfig.combinePositionMode')"
                    v-if="
                        capability['generic'] &&
                        capability['generic']['GPSCompensation'] &&
                        capability['generic']['GPSCompensation'][
                            'combinePositionMode'
                        ]
                    "
                >
                    <el-select v-model="newForm['param34'].combinePositionMode">
                        <el-option
                            v-for="item in enumeration[
                                'generic_GPSCompensation_combinePositionMode'
                            ]"
                            :label="item.label"
                            :value="item.value"
                            :key="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item
                    :label="$t('protocolConfig.compensationMode')"
                    v-if="
                        capability['generic'] &&
                        capability['generic']['GPSCompensation'] &&
                        capability['generic']['GPSCompensation'][
                            'compensationMode'
                        ]
                    "
                >
                    <el-select v-model="newForm['param34'].compensationMode">
                        <el-option
                            v-for="item in enumeration[
                                'generic_GPSCompensation_compensationMode'
                            ]"
                            :label="item.label"
                            :value="item.value"
                            :key="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item
                    :label="$t('protocolConfig.positionMode')"
                    v-if="
                        capability['generic'] &&
                        capability['generic']['GPSCompensation'] &&
                        capability['generic']['GPSCompensation']['positionMode']
                    "
                >
                    <el-select v-model="newForm['param34'].positionMode">
                        <el-option
                            v-for="item in enumeration[
                                'generic_GPSCompensation_positionMode'
                            ]"
                            :label="item.label"
                            :value="item.value"
                            :key="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item
                    :label="$t('protocolConfig.Gmouse')"
                    v-if="
                        capability['generic'] &&
                        capability['generic']['GPSCompensation'] &&
                        capability['generic']['GPSCompensation']['Gmouse']
                    "
                >
                    <el-select v-model="newForm['param34'].GMouse">
                        <el-option
                            v-for="item in enumeration[
                                'generic_GPSCompensation_Gmouse'
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
                    newForm['param2205_1_sleepReportTimeInterval'] &&
                    capability['generic'] &&
                    capability['generic']['sleepReportTimeInterval']
                "
            >
                <h3>
                    {{ $t("protocolConfig.sleepReportingInterval") }}
                </h3>

                <el-form-item
                    :label="$t('protocolConfig.sleepReportingInterval')"
                    v-if="
                        capability['generic'] &&
                        capability['generic']['sleepReportTimeInterval']
                    "
                >
                    <el-input-number
                        :precision="0"
                        controls-position="right"
                        v-model="
                            newForm['param2205_1_sleepReportTimeInterval']
                                .sleepReportTimeInterval
                        "
                        :min="
                            capability.generic.sleepReportTimeInterval.rangeMin
                        "
                        :max="
                            capability.generic.sleepReportTimeInterval.rangeMax
                        "
                        data-unit="s"
                        @blur="
                            (e) => {
                                if (e.target.value === '') {
                                    newForm[
                                        'param2205_1_sleepReportTimeInterval'
                                    ].sleepReportTimeInterval = Number(
                                        e.target.ariaValueMin
                                    );
                                }
                            }
                        "
                    ></el-input-number>
                </el-form-item>
            </div>
            <div
                v-if="
                    newForm['param709'] &&
                    capability['time'] &&
                    capability['time']['NTP'] &&
                    capability['time']['NTP'][0]
                "
            >
                <h3>
                    {{ $t("protocolConfig.NTPTiming") }}
                </h3>

                <el-form-item
                    :label="$t('protocolConfig.NTPIp')"
                    v-if="
                        capability['time'] &&
                        capability['time']['NTP'] &&
                        capability['time']['NTP'][0] &&
                        capability['time']['NTP'][0]['ip']
                    "
                >
                    <el-input v-model="newForm['param709'].ip" />
                </el-form-item>

                <el-form-item
                    :label="$t('protocolConfig.NTPPort')"
                    v-if="
                        capability['time'] &&
                        capability['time']['NTP'] &&
                        capability['time']['NTP'][0] &&
                        capability['time']['NTP'][0]['port']
                    "
                >
                    <el-input-number
                        :precision="0"
                        controls-position="right"
                        v-model="newForm['param709'].port"
                        :max="65535"
                        @blur="
                            (e) => {
                                if (e.target.value === '') {
                                    newForm['param709'].port = 0;
                                }
                            }
                        "
                    />
                </el-form-item>

                <el-form-item
                    :label="$t('protocolConfig.NTPDuration')"
                    v-if="
                        capability['time'] &&
                        capability['time']['NTP'] &&
                        capability['time']['NTP'][0] &&
                        capability['time']['NTP'][0]['duration']
                    "
                >
                    <el-input-number
                        :precision="0"
                        controls-position="right"
                        v-model="newForm['param709'].duration"
                        :min="capability.time.NTP[0].duration.min"
                        :max="capability.time.NTP[0].duration.max"
                        data-unit="s"
                        @blur="
                            (e) => {
                                if (e.target.value === '') {
                                    newForm['param709'].duration = Number(
                                        e.target.ariaValueMin
                                    );
                                }
                            }
                        "
                    ></el-input-number>
                </el-form-item>

                <el-form-item
                    :label="$t('protocolConfig.NTPEnable')"
                    v-if="
                        capability['time'] &&
                        capability['time']['NTP'] &&
                        capability['time']['NTP'][0] &&
                        capability['time']['NTP'][0]['enable']
                    "
                >
                    <el-switch
                        v-model="newForm['param709'].enable"
                        :active-value="Number(1)"
                        :inactive-value="Number(0)"
                    ></el-switch>
                </el-form-item>
            </div>
            <div
                v-if="
                    newForm['param971'] &&
                    capability['intelliDrive_face'] &&
                    capability['intelliDrive_face'][0]
                "
            >
                <h3>
                    {{ $t("protocolConfig.facialConfiguration") }}
                </h3>

                <el-form-item
                    :label="$t('protocolConfig.faceDetectEnable')"
                    v-if="
                        capability['intelliDrive_face'] &&
                        capability['intelliDrive_face'][0] &&
                        capability['intelliDrive_face'][0]['faceDetect']
                    "
                >
                    <el-switch
                        v-model="newForm['param971'].faceDetectEnable"
                        :active-value="Number(1)"
                        :inactive-value="Number(0)"
                    ></el-switch>
                </el-form-item>

                <el-form-item
                    :label="$t('protocolConfig.faceContrastMode')"
                    v-if="
                        capability['intelliDrive_face'] &&
                        capability['intelliDrive_face'][0] &&
                        capability['intelliDrive_face'][0]['faceContrastMode']
                    "
                >
                    <el-select v-model="newForm['param971'].faceContrastMode">
                        <el-option
                            v-for="item in enumeration[
                                'intelliDrive_face_faceContrastMode'
                            ]"
                            :label="item.label"
                            :value="item.value"
                            :key="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item
                    :label="$t('protocolConfig.faceDetectInterval')"
                    v-if="
                        capability['intelliDrive_face'] &&
                        capability['intelliDrive_face'][0] &&
                        capability['intelliDrive_face'][0]['faceDetectInterval']
                    "
                >
                    <el-input-number
                        :precision="0"
                        controls-position="right"
                        v-model="newForm['param971'].faceDetectInterval"
                        :min="
                            capability.intelliDrive_face[0].faceDetectInterval
                                .min
                        "
                        :max="
                            capability.intelliDrive_face[0].faceDetectInterval
                                .max
                        "
                        @blur="
                            (e) => {
                                if (e.target.value === '') {
                                    newForm['param971'].faceDetectInterval =
                                        Number(e.target.ariaValueMin);
                                }
                            }
                        "
                    />
                </el-form-item>

                <el-form-item
                    :label="$t('protocolConfig.faceScore')"
                    v-if="
                        capability['intelliDrive_face'] &&
                        capability['intelliDrive_face'][0] &&
                        capability['intelliDrive_face'][0]['faceScore']
                    "
                >
                    <el-input-number
                        :precision="0"
                        controls-position="right"
                        v-model="newForm['param971'].faceScore"
                        :min="capability.intelliDrive_face[0].faceScore.min"
                        :max="capability.intelliDrive_face[0].faceScore.max"
                        @blur="
                            (e) => {
                                if (e.target.value === '') {
                                    newForm['param971'].faceScore = Number(
                                        e.target.ariaValueMin
                                    );
                                }
                            }
                        "
                    />
                </el-form-item>

                <el-form-item
                    :label="$t('protocolConfig.faceConfidenceThreshold')"
                    v-if="
                        capability['intelliDrive_face'] &&
                        capability['intelliDrive_face'][0] &&
                        capability['intelliDrive_face'][0][
                            'faceConfidenceThreshold'
                        ]
                    "
                >
                    <el-input-number
                        :precision="0"
                        controls-position="right"
                        v-model="newForm['param971'].faceConfidenceThreshold"
                        :min="
                            capability.intelliDrive_face[0]
                                .faceConfidenceThreshold.min
                        "
                        :max="
                            capability.intelliDrive_face[0]
                                .faceConfidenceThreshold.max
                        "
                        @blur="
                            (e) => {
                                if (e.target.value === '') {
                                    newForm[
                                        'param971'
                                    ].faceConfidenceThreshold = Number(
                                        e.target.ariaValueMin
                                    );
                                }
                            }
                        "
                    />
                </el-form-item>
            </div>
            <div v-if="faceSettingList.length">
                <h3>
                    {{ $t("protocolConfig.facialParameterConfiguration") }}
                </h3>
                <el-collapse
                    v-model="faceSettingActiveName"
                    class="face-setting"
                >
                    <el-collapse-item
                        v-for="(chanNoItem, index) in faceSettingList"
                        :key="index"
                        :title="chanNoItem.label"
                        :name="chanNoItem.label"
                        arrowPlacement="right"
                    >
                        <div
                            v-for="tabItem in chanNoItem.info"
                            :key="tabItem.type"
                        >
                            <template
                                v-if="
                                    newForm[
                                        `param971_${tabItem.type}_${chanNoItem.chanNo}`
                                    ]
                                "
                            >
                                <h3>{{ tabItem.label }}</h3>

                                <el-form-item
                                    :label="$t('protocolConfig.enable')"
                                    v-if="tabItem.enable"
                                >
                                    <el-switch
                                        v-model="
                                            newForm[
                                                `param971_${tabItem.type}_${chanNoItem.chanNo}`
                                            ].enable
                                        "
                                        :active-value="Number(1)"
                                        :inactive-value="Number(0)"
                                    ></el-switch>
                                </el-form-item>

                                <el-form-item
                                    :label="
                                        $t('protocolConfig.faceDetectInterval')
                                    "
                                    v-if="tabItem.faceDetectInterval"
                                >
                                    <el-input-number
                                        :precision="0"
                                        controls-position="right"
                                        v-model="
                                            newForm[
                                                `param971_${tabItem.type}_${chanNoItem.chanNo}`
                                            ].faceDetectInterval
                                        "
                                        :min="tabItem.faceDetectInterval.min"
                                        :max="tabItem.faceDetectInterval.max"
                                        @blur="
                                            (e) => {
                                                if (e.target.value === '') {
                                                    newForm[
                                                        `param971_${tabItem.type}_${chanNoItem.chanNo}`
                                                    ].faceDetectInterval =
                                                        Number(
                                                            e.target
                                                                .ariaValueMin
                                                        );
                                                }
                                            }
                                        "
                                    />
                                </el-form-item>

                                <el-form-item
                                    :label="$t('protocolConfig.faceScore')"
                                    v-if="tabItem.faceScore"
                                >
                                    <el-input-number
                                        :precision="0"
                                        controls-position="right"
                                        v-model="
                                            newForm[
                                                `param971_${tabItem.type}_${chanNoItem.chanNo}`
                                            ].faceScore
                                        "
                                        :min="tabItem.faceScore.min"
                                        :max="tabItem.faceScore.max"
                                        @blur="
                                            (e) => {
                                                if (e.target.value === '') {
                                                    newForm[
                                                        `param971_${tabItem.type}_${chanNoItem.chanNo}`
                                                    ].faceScore = Number(
                                                        e.target.ariaValueMin
                                                    );
                                                }
                                            }
                                        "
                                    />
                                </el-form-item>

                                <el-form-item
                                    :label="$t('protocolConfig.faceSimilarity')"
                                    v-if="tabItem.faceSimilarity"
                                >
                                    <el-input-number
                                        :precision="0"
                                        controls-position="right"
                                        v-model="
                                            newForm[
                                                `param971_${tabItem.type}_${chanNoItem.chanNo}`
                                            ].faceSimilarity
                                        "
                                        :min="tabItem.faceSimilarity.min"
                                        :max="tabItem.faceSimilarity.max"
                                        @blur="
                                            (e) => {
                                                if (e.target.value === '') {
                                                    newForm[
                                                        `param971_${tabItem.type}_${chanNoItem.chanNo}`
                                                    ].faceSimilarity = Number(
                                                        e.target.ariaValueMin
                                                    );
                                                }
                                            }
                                        "
                                    />
                                </el-form-item>
                            </template>
                        </div>
                    </el-collapse-item>
                </el-collapse>
            </div>
            <div
                v-if="
                    showParam36 &&
                    capability['generic'] &&
                    capability['generic']['outputFrameRate']
                "
            >
                <h3>
                    {{ $t("protocolConfig.outputFormatConfiguration") }}
                    <i class="el-icon-warning"></i>
                    <span class="warning-msg">
                        {{ $t("protocolConfig.needRestarted") }}
                    </span>
                </h3>
                <el-collapse v-model="collapse_36_ActiveName">
                    <el-collapse-item
                        v-for="(tabItem, index) in capability['generic'][
                            'outputFrameRate'
                        ]"
                        :key="index"
                        :title="`${tabItem.label}${$t(
                            'protocolConfig.interfaceType'
                        )}`"
                        :name="tabItem.label"
                        arrowPlacement="right"
                        v-show="newForm[`param36_${tabItem.type}`]"
                    >
                        <template v-if="newForm[`param36_${tabItem.type}`]">
                            <el-form-item
                                :label="$t('protocolConfig.outputFormat')"
                                v-if="tabItem.hasOwnProperty('format')"
                            >
                                <el-select
                                    v-model="
                                        newForm[`param36_${tabItem.type}`]
                                            .format
                                    "
                                >
                                    <el-option
                                        v-for="item in tabItem.formatList"
                                        :label="item.label"
                                        :value="item.value"
                                        :key="item.value"
                                    ></el-option>
                                </el-select>
                            </el-form-item>
                        </template>
                    </el-collapse-item>
                </el-collapse>
            </div>
            <div
                v-if="
                    newForm.hasOwnProperty(`param2209`) &&
                    capability['picture'] &&
                    capability['picture'].length &&
                    capability['picture'][0] &&
                    capability['picture'][0].OSDCap &&
                    capability['picture'][0].OSDCap.channelName
                "
            >
                <h3>
                    {{ $t("protocolConfig.OSDChannelSetting") }}
                </h3>

                <el-form-item
                    :label="
                        $t('protocolConfig.channelName', { index: index + 1 })
                    "
                    :key="index"
                    v-for="(item, index) in capability.picture"
                >
                    <el-input
                        v-if="
                            newForm.hasOwnProperty(`param2209`) &&
                            newForm['param2209'].hasOwnProperty(`${index + 1}`)
                        "
                        v-model="
                            newForm[`param2209`][`${index + 1}`].channelName
                        "
                        :minlength="item.OSDCap.channelName.min"
                        :maxlength="item.OSDCap.channelName.max"
                    />
                </el-form-item>
            </div>
            <div
                v-if="
                    newForm['param192'] &&
                    capability['generic'] &&
                    capability['generic']['sentryMode']
                "
            >
                <h3>
                    {{ $t("protocolConfig.sentryMode") }}
                </h3>

                <el-form-item
                    :label="$t('protocolConfig.enable')"
                    v-if="
                        capability['generic'] &&
                        capability['generic']['sentryMode']
                    "
                >
                    <el-switch
                        v-model="newForm['param192'].sentryMode"
                        :active-value="Number(1)"
                        :inactive-value="Number(0)"
                    ></el-switch>
                </el-form-item>
            </div>
            <div
                v-if="
                    newForm['param45'] &&
                    capability['generic'] &&
                    capability['generic']['videoEncrypt']
                "
            >
                <h3>
                    {{ $t("protocolConfig.videoEncryptionMode") }}
                </h3>

                <el-form-item
                    :label="$t('protocolConfig.encryptEnable')"
                    v-if="
                        capability['generic'] &&
                        capability['generic']['videoEncrypt']
                    "
                >
                    <el-switch
                        v-model="newForm['param45'].enable"
                        :active-value="Number(1)"
                        :inactive-value="Number(0)"
                    ></el-switch>
                </el-form-item>

                <el-form-item
                    :label="$t('protocolConfig.encryptType')"
                    v-if="
                        capability['generic'] &&
                        capability['generic']['videoEncrypt'] &&
                        capability['generic']['videoEncrypt']['encryptType'] &&
                        capability['generic']['videoEncrypt']['encryptType']
                            .length
                    "
                >
                    <el-select v-model="newForm['param45'].encryptType">
                        <el-option
                            v-for="item in enumeration[
                                'generic_videoEncrypt_encryptType'
                            ]"
                            :label="item.label"
                            :value="item.value"
                            :key="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item
                    :label="$t('protocolConfig.encryptKey')"
                    v-if="
                        newForm['param45'].encryptType &&
                        capability['generic'] &&
                        capability['generic']['videoEncrypt'] &&
                        capability['generic']['videoEncrypt']['encryptType'] &&
                        capability['generic']['videoEncrypt']['encryptType']
                            .length
                    "
                    prop="param45.key"
                >
                    <el-input
                        v-model="newForm['param45'].key"
                        :minlength="
                            enumeration[
                                'generic_videoEncrypt_encryptType'
                            ].find(
                                (e) =>
                                    e.value === newForm['param45'].encryptType
                            ).key.lenMin
                        "
                        :maxlength="
                            enumeration[
                                'generic_videoEncrypt_encryptType'
                            ].find(
                                (e) =>
                                    e.value === newForm['param45'].encryptType
                            ).key.lenMax
                        "
                    />
                </el-form-item>
            </div>
            <div
                v-if="
                    newForm['param192'] &&
                    capability['generic'] &&
                    capability['generic']['speakerSwitch']
                "
            >
                <h3>
                    {{ $t("protocolConfig.generalAbility") }}
                </h3>

                <el-form-item
                    :label="$t('protocolConfig.speakerSwitch')"
                    v-if="
                        capability['generic'] &&
                        capability['generic']['speakerSwitch']
                    "
                >
                    <el-switch
                        v-model="newForm['param192'].speakerSwitch"
                        :active-value="Number(1)"
                        :inactive-value="Number(0)"
                    ></el-switch>
                </el-form-item>
            </div>
            <div
                v-if="
                    newForm['param2232'] &&
                    capability['generic'] &&
                    capability['generic']['ins']
                "
            >
                <h3>
                    {{ $t("protocolConfig.insSettings") }}
                </h3>

                <el-form-item
                    :label="$t('protocolConfig.insReset')"
                    v-if="
                        !isTemplate &&
                        capability['generic'] &&
                        capability['generic']['ins'] &&
                        capability['generic']['ins']['reset']
                    "
                >
                    <el-button @click="resetInertialNavigation()">
                        {{ $t("protocolConfig.insReset") }}
                    </el-button>
                </el-form-item>

                <el-form-item
                    :label="$t('protocolConfig.insEnable')"
                    v-if="
                        capability['generic'] &&
                        capability['generic']['ins'] &&
                        capability['generic']['ins']['enable']
                    "
                >
                    <el-switch
                        v-model="newForm['param2232'].enable"
                        :active-value="Number(1)"
                        :inactive-value="Number(0)"
                    ></el-switch>
                </el-form-item>
            </div>
            <div
                v-if="
                    newForm['param498'] &&
                    capability['storage'] &&
                    capability['storage']['microphone']
                "
            >
                <h3>
                    {{ $t("protocolConfig.storageParameters") }}
                </h3>

                <el-form-item
                    :label="$t('protocolConfig.microphone')"
                    v-if="
                        capability['storage'] &&
                        capability['storage']['microphone']
                    "
                >
                    <el-switch
                        v-model="newForm['param498'].microphone"
                        :active-value="Number(1)"
                        :inactive-value="Number(0)"
                    ></el-switch>
                </el-form-item>
            </div>
            <div
                v-if="
                    newForm['param198'] &&
                    ((capability['intelliDrive_sensor'] &&
                        capability['intelliDrive_sensor']['gSensorEnable']) ||
                        (capability['intelliDrive_sensor'] &&
                            capability['intelliDrive_sensor'][
                                'gSensorSensitity'
                            ]))
                "
            >
                <h3>G-Sensor</h3>

                <el-form-item
                    :label="$t('protocolConfig.gSensorSensitity')"
                    v-if="
                        capability['intelliDrive_sensor'] &&
                        capability['intelliDrive_sensor']['gSensorSensitity']
                    "
                >
                    <el-select v-model="newForm['param198'].gSensorSensitity">
                        <el-option
                            v-for="item in enumeration[
                                'intelliDrive_sensor_gSensorSensitity'
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
                    newForm['param47'] &&
                    capability['intelliDrive_sensor'] &&
                    capability['intelliDrive_sensor'][
                        'surveillanceRecordMode'
                    ] &&
                    (capability['intelliDrive_sensor'][
                        'surveillanceRecordMode'
                    ]['radioMode'] ||
                        capability['intelliDrive_sensor'][
                            'surveillanceRecordMode'
                        ]['checkMode'])
                "
            >
                <h3>
                    {{ $t("protocolConfig.parkingMonitoring") }}
                </h3>

                <el-form-item
                    :label="$t('protocolConfig.enable')"
                    v-if="
                        capability['intelliDrive_sensor'][
                            'surveillanceRecordMode'
                        ]['enable']
                    "
                >
                    <el-switch
                        v-model="newForm['param47'].enable"
                        :active-value="Number(1)"
                        :inactive-value="Number(0)"
                    ></el-switch>
                </el-form-item>

                <el-form-item
                    :label="$t('protocolConfig.radioMode')"
                    v-if="
                        capability['intelliDrive_sensor'][
                            'surveillanceRecordMode'
                        ]['radioMode']
                    "
                >
                    <el-select v-model="newForm['param47'].radioMode">
                        <el-option
                            v-for="item in enumeration[
                                'intelliDrive_sensor_surveillanceRecordMode_radioMode'
                            ]"
                            :label="item.label"
                            :value="item.value"
                            :key="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item
                    :label="$t('protocolConfig.motionDetect')"
                    v-if="
                        capability['intelliDrive_sensor'][
                            'surveillanceRecordMode'
                        ]['checkMode'] &&
                        capability['intelliDrive_sensor'][
                            'surveillanceRecordMode'
                        ]['checkMode']['motionDetect']
                    "
                >
                    <el-switch
                        v-model="newForm['param47'].motionDetect"
                        :active-value="Number(1)"
                        :inactive-value="Number(0)"
                    ></el-switch>
                </el-form-item>

                <el-form-item
                    :label="$t('protocolConfig.sentryMode')"
                    v-if="
                        capability['intelliDrive_sensor'][
                            'surveillanceRecordMode'
                        ]['checkMode'] &&
                        capability['intelliDrive_sensor'][
                            'surveillanceRecordMode'
                        ]['checkMode']['sentryMode']
                    "
                >
                    <el-switch
                        v-model="newForm['param47'].sentryMode"
                        :active-value="Number(1)"
                        :inactive-value="Number(0)"
                    ></el-switch>
                </el-form-item>

                <el-form-item
                    :label="$t('protocolConfig.remoteAwake')"
                    v-if="
                        capability['intelliDrive_sensor'][
                            'surveillanceRecordMode'
                        ]['checkMode'] &&
                        capability['intelliDrive_sensor'][
                            'surveillanceRecordMode'
                        ]['checkMode']['remoteTime'] &&
                        capability['intelliDrive_sensor'][
                            'surveillanceRecordMode'
                        ]['checkMode']['remoteTime']['enable']
                    "
                >
                    <el-switch
                        v-model="newForm['param47'].remoteAwake"
                        :active-value="Number(1)"
                        :inactive-value="Number(0)"
                    ></el-switch>
                </el-form-item>
            </div>
            <div
                v-if="
                    newForm['param2205_1_SSHSwitch'] &&
                    capability['generic'] &&
                    capability['generic']['SSHSwitch']
                "
            >
                <h3>
                    {{ $t("protocolConfig.sshSwitch") }}
                </h3>
                <el-form-item
                    :label="$t('protocolConfig.sshSwitch')"
                    v-if="
                        capability['generic'] &&
                        capability['generic']['SSHSwitch']
                    "
                >
                    <el-switch
                        v-model="newForm['param2205_1_SSHSwitch'].SSHSwitch"
                        :active-value="Number(1)"
                        :inactive-value="Number(0)"
                    ></el-switch>
                </el-form-item>
            </div>
        </el-form>
    </div>
</template>
<script>
import mixins from "@/mixins/mixins";
import splitTypeBox from "./splitTypeBox.vue";
export default {
    name: "deviceParams",
    mixins: [mixins],
    components: { splitTypeBox },
    props: {},
    data() {
        let that = this;
        const validateKey = (rule, value, callback) => {
            let key = this.enumeration["generic_videoEncrypt_encryptType"].find(
                (e) => e.value === this.newForm["param45"].encryptType
            ).key;
            if (!value) {
                callback();
            } else if (value.length < key.lenMin) {
                callback(
                    new Error(
                        that.$t("protocolConfig.encryptKeyvalidate1", {
                            lenMin: key.lenMin,
                        })
                    )
                );
            } else if (value.length > key.lenMax) {
                callback(
                    new Error(
                        that.$t("protocolConfig.encryptKeyvalidate2", {
                            lenMax: key.lenMax,
                        })
                    )
                );
            } else {
                callback();
            }
        };
        return {
            setForm: {},
            eventDisplayList: [],
            eventDisplayActiveName: "",
            showEventDisplay: false,
            componentsName: "platformParams",

            outputFrameRateTypeList: [],
            collapse_36_ActiveName: "",
            collapse_306_ActiveName: [],
            faceSettingList: [],
            faceSettingActiveName: "",
            showParam36: false,
            showParam306: false,
            rules: {
                "param45.key": [
                    {
                        required: false,
                        validator: validateKey,
                        trigger: "blur",
                    },
                ],
            },
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
                    if (val.param1301) {
                        if (
                            !this.setForm.hasOwnProperty(
                                `this.${$t(
                                    "protocolConfig.equipmentInformation"
                                )}&param1301`
                            )
                        ) {
                            this.setForm[
                                `this.${$t(
                                    "protocolConfig.equipmentInformation"
                                )}&param1301`
                            ] = {};
                        }

                        this.setForm[
                            `this.${$t(
                                "protocolConfig.equipmentInformation"
                            )}&param1301`
                        ].workMode =
                            val["param1301"].workMode !=
                                this.oldForm["param1301"].workMode ||
                            (this.isTemplate &&
                                val["param1301"].hasOwnProperty("workMode"))
                                ? `param1301.workMode&${this.$t(
                                      "protocolConfig.workMode"
                                  )}number&${this.getLabelSelf(
                                      this.enumeration["zhatu_workMode"],
                                      val["param1301"].workMode
                                  )}&${val["param1301"].workMode}`
                                : null;
                    }
                    if (val.param32) {
                        if (
                            !this.setForm.hasOwnProperty(
                                `this.${$t(
                                    "protocolConfig.equipmentInformation"
                                )}&param32`
                            )
                        ) {
                            this.setForm[
                                `this.${$t(
                                    "protocolConfig.equipmentInformation"
                                )}&param32`
                            ] = {};
                        }
                        this.setForm[
                            `this.${$t(
                                "protocolConfig.equipmentInformation"
                            )}&param32`
                        ].type =
                            val["param32"].type !=
                                this.oldForm["param32"].type ||
                            (this.isTemplate &&
                                val["param32"].hasOwnProperty("type"))
                                ? `param32.type&${this.$t(
                                      "protocolConfig.schemeType"
                                  )}number&${this.getLabelSelf(
                                      this.enumeration["generic_schemeType"],
                                      val["param32"].type
                                  )}&${val["param32"].type}`
                                : null;
                    }

                    if (this.capability["network"]["internet"]) {
                        this.capability["network"]["internet"].forEach(
                            (item) => {
                                if (val[`param306_${item.index}`]) {
                                    if (
                                        !this.setForm.hasOwnProperty(
                                            `${this.$t(
                                                "protocolConfig.cardNumber"
                                            )}${item.index}&param306_${
                                                item.index
                                            }`
                                        )
                                    ) {
                                        this.setForm[
                                            `${this.$t(
                                                "protocolConfig.cardNumber"
                                            )}${item.index}&param306_${
                                                item.index
                                            }`
                                        ] = {};
                                    }
                                    {
                                        this.setForm[
                                            `${this.$t(
                                                "protocolConfig.cardNumber"
                                            )}${item.index}&param306_${
                                                item.index
                                            }`
                                        ].enable =
                                            val[`param306_${item.index}`]
                                                .enable !=
                                                this.oldForm[
                                                    `param306_${item.index}`
                                                ].enable ||
                                            (this.isTemplate &&
                                                val[
                                                    `param306_${item.index}`
                                                ].hasOwnProperty("enable"))
                                                ? `param306_${
                                                      item.index
                                                  }.enable&${this.$t(
                                                      "protocolConfig.enable"
                                                  )}switch&${
                                                      val[
                                                          `param306_${item.index}`
                                                      ].enable
                                                  }`
                                                : null;

                                        this.setForm[
                                            `${this.$t(
                                                "protocolConfig.cardNumber"
                                            )}${item.index}&param306_${
                                                item.index
                                            }`
                                        ].apn =
                                            val[`param306_${item.index}`].apn !=
                                                this.oldForm[
                                                    `param306_${item.index}`
                                                ].apn ||
                                            (this.isTemplate &&
                                                val[
                                                    `param306_${item.index}`
                                                ].hasOwnProperty("apn"))
                                                ? `param306_${
                                                      item.index
                                                  }.apn&${this.$t(
                                                      "protocolConfig.apn"
                                                  )}&${
                                                      val[
                                                          `param306_${item.index}`
                                                      ].apn
                                                  }`
                                                : null;

                                        this.setForm[
                                            `${this.$t(
                                                "protocolConfig.cardNumber"
                                            )}${item.index}&param306_${
                                                item.index
                                            }`
                                        ].telephone =
                                            val[`param306_${item.index}`]
                                                .telephone !=
                                                this.oldForm[
                                                    `param306_${item.index}`
                                                ].telephone ||
                                            (this.isTemplate &&
                                                val[
                                                    `param306_${item.index}`
                                                ].hasOwnProperty("telephone"))
                                                ? `param306_${
                                                      item.index
                                                  }.telephone&${this.$t(
                                                      "protocolConfig.telephone"
                                                  )}&${
                                                      val[
                                                          `param306_${item.index}`
                                                      ].telephone
                                                  }`
                                                : null;

                                        this.setForm[
                                            `${this.$t(
                                                "protocolConfig.cardNumber"
                                            )}${item.index}&param306_${
                                                item.index
                                            }`
                                        ].username =
                                            val[`param306_${item.index}`]
                                                .username !=
                                                this.oldForm[
                                                    `param306_${item.index}`
                                                ].username ||
                                            (this.isTemplate &&
                                                val[
                                                    `param306_${item.index}`
                                                ].hasOwnProperty("username"))
                                                ? `param306_${
                                                      item.index
                                                  }.username&${this.$t(
                                                      "protocolConfig.username"
                                                  )}&${
                                                      val[
                                                          `param306_${item.index}`
                                                      ].username
                                                  }`
                                                : null;

                                        this.setForm[
                                            `${this.$t(
                                                "protocolConfig.cardNumber"
                                            )}${item.index}&param306_${
                                                item.index
                                            }`
                                        ].password =
                                            val[`param306_${item.index}`]
                                                .password !=
                                                this.oldForm[
                                                    `param306_${item.index}`
                                                ].password ||
                                            (this.isTemplate &&
                                                val[
                                                    `param306_${item.index}`
                                                ].hasOwnProperty("password"))
                                                ? `param306_${
                                                      item.index
                                                  }.password&${this.$t(
                                                      "protocolConfig.password"
                                                  )}&${
                                                      val[
                                                          `param306_${item.index}`
                                                      ].password
                                                  }`
                                                : null;

                                        this.setForm[
                                            `${this.$t(
                                                "protocolConfig.cardNumber"
                                            )}${item.index}&param306_${
                                                item.index
                                            }`
                                        ].mtu =
                                            val[`param306_${item.index}`].mtu !=
                                                this.oldForm[
                                                    `param306_${item.index}`
                                                ].mtu ||
                                            (this.isTemplate &&
                                                val[
                                                    `param306_${item.index}`
                                                ].hasOwnProperty("amtupn"))
                                                ? `param306_${
                                                      item.index
                                                  }.mtu&${this.$t(
                                                      "protocolConfig.mtu"
                                                  )}&${
                                                      val[
                                                          `param306_${item.index}`
                                                      ].mtu
                                                  }`
                                                : null;

                                        this.setForm[
                                            `${this.$t(
                                                "protocolConfig.cardNumber"
                                            )}${item.index}&param306_${
                                                item.index
                                            }`
                                        ].verify =
                                            val[`param306_${item.index}`]
                                                .verify !=
                                                this.oldForm[
                                                    `param306_${item.index}`
                                                ].verify ||
                                            (this.isTemplate &&
                                                val[
                                                    `param306_${item.index}`
                                                ].hasOwnProperty("verify"))
                                                ? `param306_${
                                                      item.index
                                                  }.verify&${this.$t(
                                                      "protocolConfig.verify"
                                                  )}number&${this.getLabel(
                                                      "network_internet_verify",
                                                      val[
                                                          `param306_${item.index}`
                                                      ].verify
                                                  )}&${
                                                      val[
                                                          `param306_${item.index}`
                                                      ].verify
                                                  }`
                                                : null;

                                        this.setForm[
                                            `${this.$t(
                                                "protocolConfig.cardNumber"
                                            )}${item.index}&param306_${
                                                item.index
                                            }`
                                        ].band =
                                            val[`param306_${item.index}`]
                                                .band !=
                                                this.oldForm[
                                                    `param306_${item.index}`
                                                ].band ||
                                            (this.isTemplate &&
                                                val[
                                                    `param306_${item.index}`
                                                ].hasOwnProperty("band"))
                                                ? `param306_${
                                                      item.index
                                                  }.band&${this.$t(
                                                      "protocolConfig.band"
                                                  )}number&${this.getLabel(
                                                      "network_internet_band",
                                                      val[
                                                          `param306_${item.index}`
                                                      ].band
                                                  )}&${
                                                      val[
                                                          `param306_${item.index}`
                                                      ].band
                                                  }`
                                                : null;
                                    }
                                }
                            }
                        );
                    }

                    if (val.param192) {
                        if (
                            !this.setForm.hasOwnProperty(
                                `${this.$t(
                                    "protocolConfig.delayedShutdown"
                                )}&param192`
                            )
                        ) {
                            this.setForm[
                                `${this.$t(
                                    "protocolConfig.delayedShutdown"
                                )}&param192`
                            ] = {};
                        }

                        this.setForm[
                            `${this.$t(
                                "protocolConfig.delayedShutdown"
                            )}&param192`
                        ].shutdownDelay =
                            val["param192"].shutdownDelay !=
                                this.oldForm["param192"].shutdownDelay ||
                            (this.isTemplate &&
                                val["param192"].hasOwnProperty("shutdownDelay"))
                                ? `param192.shutdownDelay&${this.$t(
                                      "protocolConfig.shutdownDelayCustom"
                                  )}number&${val["param192"].shutdownDelay}`
                                : null;

                        this.setForm[
                            `${this.$t(
                                "protocolConfig.delayedShutdown"
                            )}&param192`
                        ].shutdownDelayCustom =
                            val["param192"].shutdownDelayCustom !=
                                this.oldForm["param192"].shutdownDelayCustom ||
                            (this.isTemplate &&
                                val["param192"].hasOwnProperty(
                                    "shutdownDelayCustom"
                                ))
                                ? `param192.shutdownDelayCustom&${this.$t(
                                      "protocolConfig.shutdownDelayCustom"
                                  )}number&${
                                      val["param192"].shutdownDelayCustom
                                  }`
                                : null;

                        if (
                            !this.setForm.hasOwnProperty(
                                `${this.$t(
                                    "protocolConfig.sentryMode"
                                )}&param192`
                            )
                        ) {
                            this.setForm[
                                `${this.$t(
                                    "protocolConfig.sentryMode"
                                )}&param192`
                            ] = {};
                        }

                        this.setForm[
                            `${this.$t("protocolConfig.sentryMode")}&param192`
                        ].sentryMode =
                            val["param192"].sentryMode !=
                                this.oldForm["param192"].sentryMode ||
                            (this.isTemplate &&
                                val["param192"].hasOwnProperty("sentryMode"))
                                ? `param192.sentryMode&${this.$t(
                                      "protocolConfig.enable"
                                  )}switch&${val["param192"].sentryMode}`
                                : null;
                    }

                    if (val.param721) {
                        if (
                            !this.setForm.hasOwnProperty(
                                `${this.$t(
                                    "protocolConfig.sleepConfiguration"
                                )}&param721`
                            )
                        ) {
                            this.setForm[
                                `${this.$t(
                                    "protocolConfig.sleepConfiguration"
                                )}&param721`
                            ] = {};
                        }

                        this.setForm[
                            `${this.$t(
                                "protocolConfig.sleepConfiguration"
                            )}&param721`
                        ].enable =
                            val["param721"].enable !=
                                this.oldForm["param721"].enable ||
                            (this.isTemplate &&
                                val["param721"].hasOwnProperty("enable"))
                                ? `param721.enable&${this.$t(
                                      "protocolConfig.enable"
                                  )}switch&${val["param721"].enable}`
                                : null;

                        this.setForm[
                            `${this.$t(
                                "protocolConfig.sleepConfiguration"
                            )}&param721`
                        ].awakenTime =
                            val["param721"].awakenTime !=
                                this.oldForm["param721"].awakenTime ||
                            (this.isTemplate &&
                                val["param721"].hasOwnProperty("awakenTime"))
                                ? `param721.awakenTime&${this.$t(
                                      "protocolConfig.awakenTime"
                                  )}&${val["param721"].awakenTime}`
                                : null;
                    }

                    if (val.param2205_1_audio) {
                        if (
                            !this.setForm.hasOwnProperty(
                                `${this.$t(
                                    "protocolConfig.audioOutputModule"
                                )}&param2205_1_audio`
                            )
                        ) {
                            this.setForm[
                                `${this.$t(
                                    "protocolConfig.audioOutputModule"
                                )}&param2205_1_audio`
                            ] = {};
                        }

                        this.setForm[
                            `${this.$t(
                                "protocolConfig.audioOutputModule"
                            )}&param2205_1_audio`
                        ].voiceCallOutput =
                            val["param2205_1_audio"].voiceCallOutput !=
                                this.oldForm["param2205_1_audio"]
                                    .voiceCallOutput ||
                            (this.isTemplate &&
                                val["param2205_1_audio"].hasOwnProperty(
                                    "voiceCallOutput"
                                ))
                                ? `param2205_1_audio.voiceCallOutput&${this.$t(
                                      "protocolConfig.voiceCallOutput"
                                  )}number&${this.getLabel(
                                      "generic_voiceCallOutput",
                                      val["param2205_1_audio"].voiceCallOutput
                                  )}&${
                                      val["param2205_1_audio"].voiceCallOutput
                                  }`
                                : null;

                        this.setForm[
                            `${this.$t(
                                "protocolConfig.audioOutputModule"
                            )}&param2205_1_audio`
                        ].volume =
                            val["param2205_1_audio"].volume !=
                                this.oldForm["param2205_1_audio"].volume ||
                            (this.isTemplate &&
                                val["param2205_1_audio"].hasOwnProperty(
                                    "volume"
                                ))
                                ? `param2205_1_audio.volume&${this.$t(
                                      "protocolConfig.volume"
                                  )}number&${val["param2205_1_audio"].volume}`
                                : null;

                        this.setForm[
                            `${this.$t(
                                "protocolConfig.audioOutputModule"
                            )}&param2205_1_audio`
                        ].audioOutput =
                            val["param2205_1_audio"].audioOutput !==
                                this.oldForm["param2205_1_audio"].audioOutput ||
                            (this.isTemplate &&
                                val["param2205_1_audio"].hasOwnProperty(
                                    "audioOutput"
                                ))
                                ? `param2205_1_audio.audioOutput&${this.$t(
                                      "protocolConfig.audioOutput"
                                  )}number&${this.getLabel(
                                      "generic_audioOutput",
                                      val["param2205_1_audio"].audioOutput
                                  )}&${val["param2205_1_audio"].audioOutput}`
                                : null;

                        this.setForm[
                            `${this.$t(
                                "protocolConfig.audioOutputModule"
                            )}&param2205_1_audio`
                        ].alarmFollowSystem =
                            val["param2205_1_audio"].alarmFollowSystem !==
                                this.oldForm["param2205_1_audio"]
                                    .alarmFollowSystem ||
                            (this.isTemplate &&
                                val["param2205_1_audio"].hasOwnProperty(
                                    "alarmFollowSystem"
                                ))
                                ? `param2205_1_audio.alarmFollowSystem&${this.$t(
                                      "protocolConfig.alarmFollowSystem"
                                  )}switch&${
                                      val["param2205_1_audio"].alarmFollowSystem
                                  }`
                                : null;
                    }

                    this.eventDisplayList.forEach((item) => {
                        if (val[`param950_${item.value}`]) {
                            if (
                                !this.setForm.hasOwnProperty(
                                    `${this.$t(
                                        "protocolConfig.displayOutput"
                                    )}&param950`
                                )
                            ) {
                                this.setForm[
                                    `${this.$t(
                                        "protocolConfig.displayOutput"
                                    )}&param950`
                                ] = {};
                            }

                            this.setForm[
                                `${this.$t(
                                    "protocolConfig.displayOutput"
                                )}&param950`
                            ][item.value] =
                                JSON.stringify(val[`param950_${item.value}`]) !=
                                    JSON.stringify(
                                        this.oldForm[`param950_${item.value}`]
                                    ) ||
                                (this.isTemplate &&
                                    val[`param950_${item.value}`])
                                    ? `param950_${item.value}&${this.$t(
                                          "protocolConfig.displayOutput"
                                      )}&${JSON.stringify(
                                          val[`param950_${item.value}`]
                                      )}`
                                    : null;
                        }
                    });

                    if (
                        this.capability["picture"] &&
                        this.capability["picture"].length &&
                        this.capability["picture"][0] &&
                        this.capability["picture"][0].OSDCap &&
                        this.capability["picture"][0].OSDCap.channelName
                    ) {
                        this.capability.picture.forEach((item, index) => {
                            if (
                                val[`param2209`] &&
                                this.newForm.hasOwnProperty(`param2209`) &&
                                this.newForm.hasOwnProperty(`param2209`) &&
                                this.newForm[`param2209`].hasOwnProperty(
                                    `${index + 1}`
                                )
                            ) {
                                if (
                                    !this.setForm.hasOwnProperty(
                                        `${this.$t(
                                            "protocolConfig.OSDChannelSetting"
                                        )}&param2209`
                                    )
                                ) {
                                    this.setForm[
                                        `${this.$t(
                                            "protocolConfig.OSDChannelSetting"
                                        )}&param2209`
                                    ] = {};
                                }
                                if (
                                    !this.setForm[
                                        `${this.$t(
                                            "protocolConfig.OSDChannelSetting"
                                        )}&param2209`
                                    ].hasOwnProperty(`${index + 1}`)
                                ) {
                                    this.setForm[
                                        `${this.$t(
                                            "protocolConfig.OSDChannelSetting"
                                        )}&param2209`
                                    ][`${index + 1}`] = { channelName: null };
                                }
                                this.setForm[
                                    `${this.$t(
                                        "protocolConfig.OSDChannelSetting"
                                    )}&param2209`
                                ][`${index + 1}`].channelName =
                                    val[`param2209`][`${index + 1}`]
                                        .channelName !=
                                        this.oldForm[`param2209`][
                                            `${index + 1}`
                                        ].channelName ||
                                    (this.isTemplate &&
                                        val[`param2209`][
                                            `${index + 1}`
                                        ].hasOwnProperty("channelName"))
                                        ? `param2209.${
                                              index + 1
                                          }.channelName&${this.$t(
                                              "protocolConfig.channelName",
                                              { index: index + 1 }
                                          )}&${
                                              val[`param2209`][`${index + 1}`]
                                                  .channelName
                                          }`
                                        : null;
                            }
                        });
                    }

                    if (val.param34) {
                        if (
                            !this.setForm.hasOwnProperty(
                                `${this.$t(
                                    "protocolConfig.GPSConfiguration"
                                )}&param34`
                            )
                        ) {
                            this.setForm[
                                `${this.$t(
                                    "protocolConfig.GPSConfiguration"
                                )}&param34`
                            ] = {};
                        }

                        this.setForm[
                            `${this.$t(
                                "protocolConfig.GPSConfiguration"
                            )}&param34`
                        ].combinePositionMode =
                            val["param34"].combinePositionMode !=
                                this.oldForm["param34"].combinePositionMode ||
                            (this.isTemplate &&
                                val["param34"].hasOwnProperty(
                                    "combinePositionMode"
                                ))
                                ? `param34.combinePositionMode&${this.$t(
                                      "protocolConfig.combinePositionMode"
                                  )}&${this.getLabel(
                                      "generic_GPSCompensation_combinePositionMode",
                                      val["param34"].combinePositionMode
                                  )}&${val["param34"].combinePositionMode}`
                                : null;

                        this.setForm[
                            `${this.$t(
                                "protocolConfig.GPSConfiguration"
                            )}&param34`
                        ].compensationMode =
                            val["param34"].compensationMode !=
                                this.oldForm["param34"].compensationMode ||
                            (this.isTemplate &&
                                val["param34"].hasOwnProperty(
                                    "compensationMode"
                                ))
                                ? `param34.compensationMode&${this.$t(
                                      "protocolConfig.compensationMode"
                                  )}&${this.getLabel(
                                      "generic_GPSCompensation_compensationMode",
                                      val["param34"].compensationMode
                                  )}&${val["param34"].compensationMode}`
                                : null;

                        this.setForm[
                            `${this.$t(
                                "protocolConfig.GPSConfiguration"
                            )}&param34`
                        ].positionMode =
                            val["param34"].positionMode !=
                                this.oldForm["param34"].positionMode ||
                            (this.isTemplate &&
                                val["param34"].hasOwnProperty("positionMode"))
                                ? `param34.positionMode&${this.$t(
                                      "protocolConfig.positionMode"
                                  )}&${this.getLabel(
                                      "generic_GPSCompensation_positionMode",
                                      val["param34"].positionMode
                                  )}&${val["param34"].positionMode}`
                                : null;

                        this.setForm[
                            `${this.$t(
                                "protocolConfig.GPSConfiguration"
                            )}&param34`
                        ].GMouse =
                            val["param34"].GMouse !=
                                this.oldForm["param34"].GMouse ||
                            (this.isTemplate &&
                                val["param34"].hasOwnProperty("GMouse"))
                                ? `param34.GMouse&${this.$t(
                                      "protocolConfig.Gmouse"
                                  )}&${this.getLabel(
                                      "generic_GPSCompensation_Gmouse",
                                      val["param34"].GMouse
                                  )}&${val["param34"].GMouse}`
                                : null;
                    }

                    if (val.param2205_1_sleepReportTimeInterval) {
                        if (
                            !this.setForm.hasOwnProperty(
                                `${this.$t(
                                    "protocolConfig.sleepReportingInterval"
                                )}&param2205_1_sleepReportTimeInterval`
                            )
                        ) {
                            this.setForm[
                                `${this.$t(
                                    "protocolConfig.sleepReportingInterval"
                                )}&param2205_1_sleepReportTimeInterval`
                            ] = {};
                        }

                        this.setForm[
                            `${this.$t(
                                "protocolConfig.sleepReportingInterval"
                            )}&param2205_1_sleepReportTimeInterval`
                        ].sleepReportTimeInterval =
                            val["param2205_1_sleepReportTimeInterval"]
                                .sleepReportTimeInterval !=
                                this.oldForm[
                                    "param2205_1_sleepReportTimeInterval"
                                ].sleepReportTimeInterval ||
                            (this.isTemplate &&
                                val[
                                    "param2205_1_sleepReportTimeInterval"
                                ].hasOwnProperty("sleepReportTimeInterval"))
                                ? `param2205_1_sleepReportTimeInterval.sleepReportTimeInterval&${this.$t(
                                      "protocolConfig.sleepReportingInterval"
                                  )}number&${
                                      val["param2205_1_sleepReportTimeInterval"]
                                          .sleepReportTimeInterval
                                  }`
                                : null;
                    }

                    if (val.param709) {
                        if (
                            !this.setForm.hasOwnProperty(
                                `${this.$t(
                                    "protocolConfig.NTPTiming"
                                )}&param709`
                            )
                        ) {
                            this.setForm[
                                `${this.$t(
                                    "protocolConfig.NTPTiming"
                                )}&param709`
                            ] = {};
                        }

                        this.setForm[
                            `${this.$t("protocolConfig.NTPTiming")}&param709`
                        ].ip =
                            val["param709"].ip != this.oldForm["param709"].ip ||
                            (this.isTemplate &&
                                val["param709"].hasOwnProperty("ip"))
                                ? `param709.ip&${this.$t(
                                      "protocolConfig.NTPIp"
                                  )}&${val["param709"].ip}`
                                : null;

                        this.setForm[
                            `${this.$t("protocolConfig.NTPTiming")}&param709`
                        ].port =
                            val["param709"].port !=
                                this.oldForm["param709"].port ||
                            (this.isTemplate &&
                                val["param709"].hasOwnProperty("port"))
                                ? `param709.port&${this.$t(
                                      "protocolConfig.NTPPort"
                                  )}&${val["param709"].port}`
                                : null;

                        this.setForm[
                            `${this.$t("protocolConfig.NTPTiming")}&param709`
                        ].duration =
                            val["param709"].duration !=
                                this.oldForm["param709"].duration ||
                            (this.isTemplate &&
                                val["param709"].hasOwnProperty("duration"))
                                ? `param709.duration&${this.$t(
                                      "protocolConfig.NTPDuration"
                                  )}&${val["param709"].duration}`
                                : null;

                        this.setForm[
                            `${this.$t("protocolConfig.NTPTiming")}&param709`
                        ].enable =
                            val["param709"].enable !=
                                this.oldForm["param709"].enable ||
                            (this.isTemplate &&
                                val["param709"].hasOwnProperty("enable"))
                                ? `param709.enable&${this.$t(
                                      "protocolConfig.NTPEnable"
                                  )}&${val["param709"].enable}`
                                : null;
                    }

                    if (val.param971) {
                        if (
                            !this.setForm.hasOwnProperty(
                                `${this.$t(
                                    "protocolConfig.facialConfiguration"
                                )}&param971`
                            )
                        ) {
                            this.setForm[
                                `${this.$t(
                                    "protocolConfig.facialConfiguration"
                                )}&param971`
                            ] = {};
                        }

                        this.setForm[
                            `${this.$t(
                                "protocolConfig.facialConfiguration"
                            )}&param971`
                        ].faceDetectEnable =
                            val["param971"].faceDetectEnable !=
                                this.oldForm["param971"].faceDetectEnable ||
                            (this.isTemplate &&
                                val["param971"].hasOwnProperty(
                                    "faceDetectEnable"
                                ))
                                ? `param971.faceDetectEnable&${this.$t(
                                      "protocolConfig.faceDetectEnable"
                                  )}switch&${val["param971"].faceDetectEnable}`
                                : null;

                        this.setForm[
                            `${this.$t(
                                "protocolConfig.facialConfiguration"
                            )}&param971`
                        ].faceContrastMode =
                            val["param971"].faceContrastMode !=
                                this.oldForm["param971"].faceContrastMode ||
                            (this.isTemplate &&
                                val["param971"].hasOwnProperty(
                                    "faceContrastMode"
                                ))
                                ? `param971.faceContrastMode&${this.$t(
                                      "protocolConfig.faceContrastMode"
                                  )}number&${this.getLabel(
                                      "intelliDrive_face_faceContrastMode",
                                      val["param971"].faceContrastMode
                                  )}&${val["param971"].faceContrastMode}`
                                : null;

                        this.setForm[
                            `${this.$t(
                                "protocolConfig.facialConfiguration"
                            )}&param971`
                        ].faceDetectInterval =
                            val["param971"].faceDetectInterval !=
                                this.oldForm["param971"].faceDetectInterval ||
                            (this.isTemplate &&
                                val["param971"].hasOwnProperty(
                                    "faceDetectInterval"
                                ))
                                ? `param971.faceDetectInterval&${this.$t(
                                      "protocolConfig.faceDetectInterval"
                                  )}&${val["param971"].faceDetectInterval}`
                                : null;

                        this.setForm[
                            `${this.$t(
                                "protocolConfig.facialConfiguration"
                            )}&param971`
                        ].faceScore =
                            val["param971"].faceScore !=
                                this.oldForm["param971"].faceScore ||
                            (this.isTemplate &&
                                val["param971"].hasOwnProperty("faceScore"))
                                ? `param971.faceScore&${this.$t(
                                      "protocolConfig.faceScore"
                                  )}&${val["param971"].faceScore}`
                                : null;

                        this.setForm[
                            `${this.$t(
                                "protocolConfig.facialConfiguration"
                            )}&param971`
                        ].faceConfidenceThreshold =
                            val["param971"].faceConfidenceThreshold !=
                                this.oldForm["param971"]
                                    .faceConfidenceThreshold ||
                            (this.isTemplate &&
                                val["param971"].hasOwnProperty(
                                    "faceConfidenceThreshold"
                                ))
                                ? `param971.faceConfidenceThreshold&${this.$t(
                                      "protocolConfig.faceConfidenceThreshold"
                                  )}&${val["param971"].faceConfidenceThreshold}`
                                : null;
                    }
                    this.faceSettingList.forEach((chanNoItem) => {
                        chanNoItem.info.forEach((tabItem) => {
                            if (
                                val[
                                    `param971_${tabItem.type}_${chanNoItem.chanNo}`
                                ]
                            ) {
                                let objName = `${this.$t(
                                    "protocolConfig.facialParameterConfiguration"
                                )}>${this.$t("protocolConfig.chanNo")}${
                                    chanNoItem.chanNo
                                }>${tabItem.label}&param971_${tabItem.type}_${
                                    chanNoItem.chanNo
                                }`;
                                if (!this.setForm.hasOwnProperty(objName)) {
                                    this.setForm[objName] = {};
                                }

                                this.setForm[objName].enable =
                                    val[
                                        `param971_${tabItem.type}_${chanNoItem.chanNo}`
                                    ].enable !==
                                        this.oldForm[
                                            `param971_${tabItem.type}_${chanNoItem.chanNo}`
                                        ].enable ||
                                    (this.isTemplate &&
                                        val[
                                            `param971_${tabItem.type}_${chanNoItem.chanNo}`
                                        ].hasOwnProperty("enable"))
                                        ? `param971_${tabItem.type}_${
                                              chanNoItem.chanNo
                                          }.enable&${this.$t(
                                              "protocolConfig.enable"
                                          )}switch&${
                                              val[
                                                  `param971_${tabItem.type}_${chanNoItem.chanNo}`
                                              ].enable
                                          }`
                                        : null;

                                this.setForm[objName].faceDetectInterval =
                                    val[
                                        `param971_${tabItem.type}_${chanNoItem.chanNo}`
                                    ].faceDetectInterval !==
                                        this.oldForm[
                                            `param971_${tabItem.type}_${chanNoItem.chanNo}`
                                        ].faceDetectInterval ||
                                    (this.isTemplate &&
                                        val[
                                            `param971_${tabItem.type}_${chanNoItem.chanNo}`
                                        ].hasOwnProperty("faceDetectInterval"))
                                        ? `param971_${tabItem.type}_${
                                              chanNoItem.chanNo
                                          }.faceDetectInterval&${this.$t(
                                              "protocolConfig.faceDetectInterval"
                                          )}number&${
                                              val[
                                                  `param971_${tabItem.type}_${chanNoItem.chanNo}`
                                              ].faceDetectInterval
                                          }`
                                        : null;

                                this.setForm[objName].faceScore =
                                    val[
                                        `param971_${tabItem.type}_${chanNoItem.chanNo}`
                                    ].faceScore !==
                                        this.oldForm[
                                            `param971_${tabItem.type}_${chanNoItem.chanNo}`
                                        ].faceScore ||
                                    (this.isTemplate &&
                                        val[
                                            `param971_${tabItem.type}_${chanNoItem.chanNo}`
                                        ].hasOwnProperty("faceScore"))
                                        ? `param971_${tabItem.type}_${
                                              chanNoItem.chanNo
                                          }.faceScore&${this.$t(
                                              "protocolConfig.faceScore"
                                          )}number&${
                                              val[
                                                  `param971_${tabItem.type}_${chanNoItem.chanNo}`
                                              ].faceScore
                                          }`
                                        : null;

                                this.setForm[objName].faceSimilarity =
                                    val[
                                        `param971_${tabItem.type}_${chanNoItem.chanNo}`
                                    ].faceSimilarity !==
                                        this.oldForm[
                                            `param971_${tabItem.type}_${chanNoItem.chanNo}`
                                        ].faceSimilarity ||
                                    (this.isTemplate &&
                                        val[
                                            `param971_${tabItem.type}_${chanNoItem.chanNo}`
                                        ].hasOwnProperty("faceSimilarity"))
                                        ? `param971_${tabItem.type}_${
                                              chanNoItem.chanNo
                                          }.faceSimilarity&${this.$t(
                                              "protocolConfig.faceSimilarity"
                                          )}number&${
                                              val[
                                                  `param971_${tabItem.type}_${chanNoItem.chanNo}`
                                              ].faceSimilarity
                                          }`
                                        : null;
                            }
                        });
                    });

                    if (this.capability["generic"]["outputFrameRate"]) {
                        this.capability["generic"]["outputFrameRate"].forEach(
                            (item) => {
                                if (val[`param36_${item.type}`]) {
                                    if (
                                        !this.setForm.hasOwnProperty(
                                            `${item.label}${this.$t(
                                                "protocolConfig.interfaceType"
                                            )}&param36_${item.type}`
                                        )
                                    ) {
                                        this.setForm[
                                            `${item.label}${this.$t(
                                                "protocolConfig.interfaceType"
                                            )}&param36_${item.type}`
                                        ] = {};
                                    }

                                    this.setForm[
                                        `${item.label}${this.$t(
                                            "protocolConfig.interfaceType"
                                        )}&param36_${item.type}`
                                    ].format =
                                        val[`param36_${item.type}`].format !=
                                            this.oldForm[`param36_${item.type}`]
                                                .format ||
                                        (this.isTemplate &&
                                            val[
                                                `param36_${item.type}`
                                            ].hasOwnProperty("format"))
                                            ? `param36_${
                                                  item.type
                                              }.format&${this.$t(
                                                  "protocolConfig.outputFormat"
                                              )}number&${this.getLabelSelf(
                                                  item.formatList,
                                                  val[`param36_${item.type}`]
                                                      .format
                                              )}&${
                                                  val[`param36_${item.type}`]
                                                      .format
                                              }`
                                            : null;
                                }
                            }
                        );
                    }

                    if (val.param45) {
                        if (
                            !this.setForm.hasOwnProperty(
                                `${this.$t(
                                    "protocolConfig.videoEncryptionMode"
                                )}&param45`
                            )
                        ) {
                            this.setForm[
                                `${this.$t(
                                    "protocolConfig.videoEncryptionMode"
                                )}&param45`
                            ] = {};
                        }

                        this.setForm[
                            `${this.$t(
                                "protocolConfig.videoEncryptionMode"
                            )}&param45`
                        ].enable =
                            val["param45"].enable !=
                                this.oldForm["param45"].enable ||
                            (this.isTemplate &&
                                val["param45"].hasOwnProperty("enable"))
                                ? `param45.enable&${this.$t(
                                      "protocolConfig.encryptEnable"
                                  )}switch&${val["param45"].enable}`
                                : null;

                        this.setForm[
                            `${this.$t(
                                "protocolConfig.videoEncryptionMode"
                            )}&param45`
                        ].encryptType =
                            val["param45"].encryptType !=
                                this.oldForm["param45"].encryptType ||
                            (this.isTemplate &&
                                val["param45"].hasOwnProperty("encryptType"))
                                ? `param45.encryptType&${this.$t(
                                      "protocolConfig.encryptType"
                                  )}number&${this.getLabel(
                                      "generic_videoEncrypt_encryptType",
                                      val["param45"].encryptType
                                  )} &${val["param45"].encryptType}`
                                : null;

                        this.setForm[
                            `${this.$t(
                                "protocolConfig.videoEncryptionMode"
                            )}&param45`
                        ].key =
                            val["param45"].key != this.oldForm["param45"].key ||
                            (this.isTemplate &&
                                val["param45"].hasOwnProperty("key"))
                                ? `param45.key&${this.$t(
                                      "protocolConfig.encryptKey"
                                  )}&${val["param45"].key}`
                                : null;
                    }
                    if (val.param192) {
                        if (
                            !this.setForm.hasOwnProperty(
                                `${this.$t(
                                    "protocolConfig.generalAbility"
                                )}&param192`
                            )
                        ) {
                            this.setForm[
                                `${this.$t(
                                    "protocolConfig.generalAbility"
                                )}&param192`
                            ] = {};
                        }

                        this.setForm[
                            `${this.$t(
                                "protocolConfig.generalAbility"
                            )}&param192`
                        ].speakerSwitch =
                            val["param192"].speakerSwitch !=
                                this.oldForm["param192"].speakerSwitch ||
                            (this.isTemplate &&
                                val["param192"].hasOwnProperty("speakerSwitch"))
                                ? `param192.speakerSwitch&${this.$t(
                                      "protocolConfig.speakerSwitch"
                                  )}switch&${val["param192"].speakerSwitch}`
                                : null;
                    }
                    if (val.param2232) {
                        if (
                            !this.setForm.hasOwnProperty(
                                `${this.$t(
                                    "protocolConfig.insSettings"
                                )}&param2232`
                            )
                        ) {
                            this.setForm[
                                `${this.$t(
                                    "protocolConfig.insSettings"
                                )}&param2232`
                            ] = {};
                        }

                        this.setForm[
                            `${this.$t("protocolConfig.insSettings")}&param2232`
                        ].enable =
                            val["param2232"].enable !=
                                this.oldForm["param2232"].enable ||
                            (this.isTemplate &&
                                val["param2232"].hasOwnProperty("enable"))
                                ? `param2232.enable&${this.$t(
                                      "protocolConfig.insEnable"
                                  )}switch&${val["param2232"].enable}`
                                : null;
                    }
                    if (val.param498) {
                        if (
                            !this.setForm.hasOwnProperty(
                                `${this.$t(
                                    "protocolConfig.storageParameters"
                                )}&param498`
                            )
                        ) {
                            this.setForm[
                                `${this.$t(
                                    "protocolConfig.storageParameters"
                                )}&param498`
                            ] = {};
                        }

                        this.setForm[
                            `${this.$t(
                                "protocolConfig.storageParameters"
                            )}&param498`
                        ].microphone =
                            val["param498"].microphone !=
                                this.oldForm["param498"].microphone ||
                            (this.isTemplate &&
                                val["param498"].hasOwnProperty("microphone"))
                                ? `param498.microphone&${this.$t(
                                      "protocolConfig.microphone"
                                  )}switch&${val["param498"].microphone}`
                                : null;
                    }
                    if (val.param198) {
                        if (!this.setForm.hasOwnProperty("G-Sensor&param198")) {
                            this.setForm["G-Sensor&param198"] = {};
                        }

                        this.setForm["G-Sensor&param198"].gSensorSensitity =
                            val["param198"].gSensorSensitity !=
                                this.oldForm["param198"].gSensorSensitity ||
                            (this.isTemplate &&
                                val["param198"].hasOwnProperty(
                                    "gSensorSensitity"
                                ))
                                ? `param198.gSensorSensitity&${this.$t(
                                      "protocolConfig.gSensorSensitity"
                                  )}number&${this.getLabel(
                                      "intelliDrive_sensor_gSensorSensitity",
                                      val["param198"].gSensorSensitity
                                  )}&${val["param198"].gSensorSensitity}`
                                : null;
                    }
                    if (val.param47) {
                        if (
                            !this.setForm.hasOwnProperty(
                                `${this.$t(
                                    "protocolConfig.parkingMonitoring"
                                )}&param47`
                            )
                        ) {
                            this.setForm[
                                `${this.$t(
                                    "protocolConfig.parkingMonitoring"
                                )}&param47`
                            ] = {};
                        }

                        this.setForm[
                            `${this.$t(
                                "protocolConfig.parkingMonitoring"
                            )}&param47`
                        ].enable =
                            val["param47"].enable !=
                                this.oldForm["param47"].enable ||
                            (this.isTemplate &&
                                val["param47"].hasOwnProperty("enable"))
                                ? `param47.enable&${this.$t(
                                      "protocolConfig.enable"
                                  )}switch&${val["param47"].enable}`
                                : null;

                        this.setForm[
                            `${this.$t(
                                "protocolConfig.parkingMonitoring"
                            )}&param47`
                        ].radioMode =
                            val["param47"].radioMode !=
                                this.oldForm["param47"].radioMode ||
                            (this.isTemplate &&
                                val["param47"].hasOwnProperty("radioMode"))
                                ? `param47.radioMode&${this.$t(
                                      "protocolConfig.radioMode"
                                  )}number&${this.getLabel(
                                      "intelliDrive_sensor_surveillanceRecordMode_radioMode",
                                      val["param47"].radioMode
                                  )}&${val["param47"].radioMode}`
                                : null;

                        this.setForm[
                            `${this.$t(
                                "protocolConfig.parkingMonitoring"
                            )}&param47`
                        ].motionDetect =
                            val["param47"].motionDetect !=
                                this.oldForm["param47"].motionDetect ||
                            (this.isTemplate &&
                                val["param47"].hasOwnProperty("motionDetect"))
                                ? `param47.motionDetect&${this.$t(
                                      "protocolConfig.motionDetect"
                                  )}switch&${val["param47"].motionDetect}`
                                : null;

                        this.setForm[
                            `${this.$t(
                                "protocolConfig.parkingMonitoring"
                            )}&param47`
                        ].sentryMode =
                            val["param47"].sentryMode !=
                                this.oldForm["param47"].sentryMode ||
                            (this.isTemplate &&
                                val["param47"].hasOwnProperty("sentryMode"))
                                ? `param47.sentryMode&${this.$t(
                                      "protocolConfig.sentryMode"
                                  )}switch&${val["param47"].sentryMode}`
                                : null;

                        this.setForm[
                            `${this.$t(
                                "protocolConfig.parkingMonitoring"
                            )}&param47`
                        ].remoteAwake =
                            val["param47"].remoteAwake !=
                                this.oldForm["param47"].remoteAwake ||
                            (this.isTemplate &&
                                val["param47"].hasOwnProperty("remoteAwake"))
                                ? `param47.remoteAwake&${this.$t(
                                      "protocolConfig.remoteAwake"
                                  )}switch&${val["param47"].remoteAwake}`
                                : null;
                    }

                    if (val.param2205_1_SSHSwitch) {
                        if (
                            !this.setForm.hasOwnProperty(
                                `${this.$t(
                                    "protocolConfig.sshSwitch"
                                )}&param2205_1_SSHSwitch`
                            )
                        ) {
                            this.setForm[
                                `${this.$t(
                                    "protocolConfig.sshSwitch"
                                )}&param2205_1_SSHSwitch`
                            ] = {};
                        }

                        this.setForm[
                            `${this.$t(
                                "protocolConfig.sshSwitch"
                            )}&param2205_1_SSHSwitch`
                        ].SSHSwitch =
                            val["param2205_1_SSHSwitch"].SSHSwitch !=
                                this.oldForm["param2205_1_SSHSwitch"]
                                    .SSHSwitch ||
                            (this.isTemplate &&
                                val["param2205_1_SSHSwitch"].hasOwnProperty(
                                    "SSHSwitch"
                                ))
                                ? `param2205_1_SSHSwitch.SSHSwitch&${this.$t(
                                      "protocolConfig.sshSwitch"
                                  )}switch&${
                                      val["param2205_1_SSHSwitch"].SSHSwitch
                                  }`
                                : null;
                    }
                    let firstTitle = {};
                    firstTitle[this.$t("enumeration.设备参数")] = this.setForm;
                    this.$emit("setFormChange", firstTitle);
                }
            },
            deep: true,
            immediate: true,
        },
    },
    methods: {
        showEventDisplayList() {
            if (!this.showEventDisplay) {
                this.eventDisplayList.forEach((item) => {
                    if (this.newForm[`param950_${item.value}`]) {
                        this.showEventDisplay = true;
                    }
                });
            }
        },
        chanNoChange(bindsList, splitType) {
            this.$set(
                this.newForm[`param950_${splitType}`],
                "splitChanBinds",
                bindsList
            );
            let obj = this.eventDisplayList.find((e) => e.value === splitType);
            let filterArr = bindsList
                .reduce((prev, cur) => {
                    return prev.concat(cur["chanNo"]);
                }, [])
                .filter((item) => item);
            if (filterArr.length !== [...new Set(filterArr)].length) {
                this.$emit(
                    "formValidate",
                    false,

                    this.$t("protocolConfig.displayOutputMsg", {
                        label: obj.label,
                    })
                );

                this.$message.error(
                    this.$t("protocolConfig.displayOutputMsg", {
                        label: obj.label,
                    })
                );
            } else {
                this.$emit("formValidate", true);
            }
        },
        initConfig() {
            this.$emit("setFormLoading", true);
            this.showEventDisplay = false;
            let initConfigList = [
                this.getEHomeConfig(45),
                this.getEHomeConfig(32),
                this.getEHomeConfig(1301),
                this.getEHomeConfig(192),
                this.getEHomeConfig(721),
                this.getEHomeConfig(198),
                this.getEHomeConfig(47),
                this.getEHomeConfig(2205, {
                    chanNo: 1,
                    type: "voiceCallOutput",
                }),
                this.getEHomeConfig(2205, {
                    chanNo: 1,
                    type: "audioOutput",
                }),
                this.getEHomeConfig(2205, {
                    chanNo: 1,
                    type: "volume",
                }),
                this.getEHomeConfig(2205, {
                    chanNo: 1,
                    type: "sleepReportTimeInterval",
                }),
                this.getEHomeConfig(2205, {
                    chanNo: 1,
                    type: "alarmFollowSystem",
                }),
                this.getEHomeConfig(2205, {
                    chanNo: 1,
                    type: "SSHSwitch",
                }),
                this.getEHomeConfig(34),
                this.getEHomeConfig(709),
                this.getEHomeConfig(2232),
                this.getEHomeConfig(498),
            ];
            if (
                this.capability.network &&
                this.capability.network.internet &&
                this.capability.network.internet.length
            ) {
                if (this.capability.network.internet.length === 1) {
                    this.capability.network.internet[0].index = 1;
                    initConfigList.push(
                        this.getEHomeConfig(306, {
                            index: 1,
                        })
                    );
                    this.collapse_306_ActiveName = [1];
                } else {
                    this.capability.network.internet.forEach((k) => {
                        if (k.index) {
                            initConfigList.push(
                                this.getEHomeConfig(306, {
                                    index: k.index,
                                })
                            );
                            this.collapse_306_ActiveName.push(k.index);
                        }
                    });
                }
            }
            if (
                this.capability.picture &&
                this.capability.picture.length &&
                this.capability.picture[0] &&
                this.capability.picture[0].OSDCap &&
                this.capability.picture[0].OSDCap.channelName
            ) {
                this.capability.picture.forEach((k, index) => {
                    initConfigList.push(
                        this.getEHomeConfig(2209, {
                            chanNo: index + 1,
                        })
                    );
                });
            }
            if (
                this.capability.intelliDrive_face &&
                this.capability.intelliDrive_face.length &&
                this.capability.intelliDrive_face[0] &&
                !this.capability.intelliDrive_face[0].faceSetting
            ) {
                initConfigList.push(this.getEHomeConfig(971));
            }
            if (
                this.capability.intelliDrive_face &&
                this.capability.intelliDrive_face.length &&
                this.capability.intelliDrive_face[0] &&
                this.capability.intelliDrive_face[0].faceSetting &&
                this.capability.intelliDrive_face[0].faceSetting.length
            ) {
                this.faceSettingList =
                    this.capability.intelliDrive_face[0].faceSetting;
                this.faceSettingList.forEach((item) => {
                    item.label = `${this.$t("protocolConfig.chanNo")}${
                        item.chanNo
                    }`;
                    item.info.forEach((k) => {
                        k.label = this.getJsonLabel(
                            "intelliDrive_face_type",
                            k.type
                        );
                        initConfigList.push(
                            this.getEHomeConfig(971, {
                                chanNo: item.chanNo,
                                type: k.type,
                            })
                        );
                    });
                });

                this.faceSettingActiveName = `${this.$t(
                    "protocolConfig.chanNo"
                )}${this.faceSettingList[0].chanNo}`;
            }
            if (
                this.capability.intelliDrive_sensor &&
                this.capability.intelliDrive_sensor.eventDisplay
            ) {
                let arr = [];
                this.capability.intelliDrive_sensor.eventDisplay.forEach(
                    (item) => {
                        initConfigList.push(
                            this.getEHomeConfig(950, {
                                type: item.type,
                            })
                        );
                        arr.push(item.type);
                    }
                );
                this.eventDisplayList = [];
                setTimeout(() => {
                    this.eventDisplayList = this.getEnumerationValue(
                        arr,
                        "intelliDrive_sensor_eventDisplay"
                    );
                    this.eventDisplayActiveName =
                        this.eventDisplayList[0].label;
                    this.showEventDisplayList();
                }, 500);
            }
            if (
                this.capability.generic &&
                this.capability.generic.outputFrameRate
            ) {
                let arr = [];
                this.capability.generic.outputFrameRate.forEach((item) => {
                    item.label = this.getJsonLabel(
                        "generic_outputFrameRate_type",
                        item.type
                    );
                    initConfigList.push(
                        this.getEHomeConfig(36, {
                            type: item.type,
                        })
                    );
                    arr.push(item.type);
                });
                this.outputFrameRateTypeList = this.getEnumerationValue(
                    arr,
                    "generic_outputFrameRate_type"
                );
                this.collapse_36_ActiveName =
                    this.capability.generic.outputFrameRate[0].label;
            }
            Promise.all(initConfigList).then((result) => {
                this.$emit("setFormLoading", false);
                this.$emit("loadingSuccess");
                for (let key in this.newForm) {
                    if (key.indexOf("param36_") > -1) {
                        this.showParam36 = true;
                    }
                    if (key.indexOf("param306_") > -1) {
                        this.showParam306 = true;
                    }
                }
            });
        },
        tabBeforeLeave(activeName, oldActiveName) {
            let obj = this.eventDisplayList.find(
                (e) => e.label === oldActiveName
            );
            if (obj && this.newForm[`param950_${obj.value}`]) {
                let filterArr = this.newForm[
                    `param950_${obj.value}`
                ].splitChanBinds
                    .reduce((prev, cur) => {
                        return prev.concat(cur["chanNo"]);
                    }, [])
                    .filter((item) => item);
                if (filterArr.length !== [...new Set(filterArr)].length) {
                    this.$emit(
                        "formValidate",
                        false,

                        this.$t("protocolConfig.displayOutputMsg", {
                            label: obj.label,
                        })
                    );

                    this.$message.error(
                        this.$t("protocolConfig.displayOutputMsg", {
                            label: obj.label,
                        })
                    );
                    return false;
                } else {
                    this.$emit("formValidate", true);
                    return true;
                }
            }
        },
        resetInertialNavigation() {
            let deviceIds = [];
            let params = [
                {
                    msgId: 2231,
                    param: {},
                },
            ];
            if (this.tabPosition === "tab2") {
                deviceIds = this.carIds;
            } else {
                deviceIds = [Number(this.$route.query.deviceId)];
            }
            this.$confirm(
                this.$t("protocolConfig.insResetText1"),
                this.$t("common.prompt"),
                {
                    confirmButtonText: this.$t("common.issued"),
                    cancelButtonText: this.$t("common.cancel"),
                    type: "warning",
                }
            ).then(() => {
                this.$api
                    .saveEHomeConfig({
                        deviceIds: deviceIds,
                        params: JSON.stringify(params),
                    })
                    .then((res) => {
                        if (res.success) {
                            this.$message.success(
                                this.$t("protocolConfig.insResetText2")
                            );
                        } else {
                            this.$message.error(res.msg);
                        }
                    });
            });
        },
    },
};
</script>
<style lang="less" scoped>
/deep/.el-tabs {
    .el-tabs__item {
        display: inline-flex;
    }
    .el-tabs__nav {
        .el-tabs__item:first-child {
            border-left: none;
        }
    }
}
@import "./configurationForm.less";
/deep/.el-collapse {
    .el-collapse-item__content {
        padding-top: 20px;
    }
}
/deep/.el-collapse.face-setting {
    .el-collapse-item__content {
        padding: 0 16px;
    }
}
</style>
