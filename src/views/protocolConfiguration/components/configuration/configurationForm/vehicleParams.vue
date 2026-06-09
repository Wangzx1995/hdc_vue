<template>
    <div class="configuration-form">
        <el-form
            :label-width="`${labelWidth}px`"
            :model="newForm"
            :inline="true"
            :rules="rules"
            ref="form"
        >
            <div v-if="!isTemplate">
                <el-alert
                    style="margin-bottom: 8px"
                    title="多设备参数项配置仅支持配置设备共有参数项，不支持配置设备独立参数项~"
                    :closable="true"
                    type="warning"
                    show-icon
                    simple
                ></el-alert>
            </div>
            <div
                v-if="
                    newForm['param8'] &&
                    capability['generic'] &&
                    capability['generic']['vehicleDetail'] &&
                    capability['generic']['vehicleDetail'] &&
                    tabPosition === 'tab1'
                "
            >
                <h3>
                    车辆信息<i class="el-icon-warning"></i>
                    <span class="warning-msg"
                        >该配置项配置成功，设备将重新连接平台，请谨慎修改！</span
                    >
                </h3>
                <el-form-item
                    label="车辆所在的省域ID"
                    v-if="
                        capability['generic'] &&
                        capability['generic']['vehicleDetail'] &&
                        capability['generic']['vehicleDetail']['provinceID']
                    "
                >
                    <el-input-number
                        :precision="0"
                        controls-position="right"
                        class="input-no-step"
                        v-model="newForm['param8'].provinceID"
                        :min="0"
                        v-on:input="
                            (val) => {
                                if (
                                    String(val).length >
                                    capability.generic.vehicleDetail.provinceID
                                        .max
                                ) {
                                    newForm['param8'].provinceID = String(
                                        val
                                    ).slice(
                                        0,
                                        capability.generic.vehicleDetail
                                            .provinceID.max
                                    );
                                }
                            }
                        "
                        @blur="
                            (e) => {
                                if (e.target.value === '') {
                                    newForm['param8'].provinceID = Number(
                                        e.target.ariaValueMin
                                    );
                                }
                            }
                        "
                    />
                </el-form-item>
                <el-form-item
                    label="车辆所在的市域ID"
                    v-if="
                        capability['generic'] &&
                        capability['generic']['vehicleDetail'] &&
                        capability['generic']['vehicleDetail']['cityID']
                    "
                >
                    <el-input-number
                        :precision="0"
                        controls-position="right"
                        class="input-no-step"
                        v-model="newForm['param8'].cityID"
                        :min="0"
                        v-on:input="
                            (val) => {
                                if (
                                    String(val).length >
                                    capability.generic.vehicleDetail.cityID.max
                                ) {
                                    newForm['param8'].cityID = String(
                                        val
                                    ).slice(
                                        0,
                                        capability.generic.vehicleDetail.cityID
                                            .max
                                    );
                                }
                            }
                        "
                        @blur="
                            (e) => {
                                if (e.target.value === '') {
                                    newForm['param8'].cityID = Number(
                                        e.target.ariaValueMin
                                    );
                                }
                            }
                        "
                    />
                </el-form-item>
                <el-form-item
                    label="制造商ID"
                    v-if="
                        capability['generic'] &&
                        capability['generic']['vehicleDetail'] &&
                        capability['generic']['vehicleDetail']['manufacturerID']
                    "
                >
                    <el-input-number
                        :precision="0"
                        controls-position="right"
                        class="input-no-step"
                        v-model="newForm['param8'].manufacturerID"
                        :min="0"
                        v-on:input="
                            (val) => {
                                if (
                                    String(val).length >
                                    capability.generic.vehicleDetail
                                        .manufacturerID.max
                                ) {
                                    newForm['param8'].manufacturerID = String(
                                        val
                                    ).slice(
                                        0,
                                        capability.generic.vehicleDetail
                                            .manufacturerID.max
                                    );
                                }
                            }
                        "
                        @blur="
                            (e) => {
                                if (e.target.value === '') {
                                    newForm['param8'].manufacturerID = Number(
                                        e.target.ariaValueMin
                                    );
                                }
                            }
                        "
                    />
                </el-form-item>
                <el-form-item
                    label="车牌号"
                    v-if="
                        capability['generic'] &&
                        capability['generic']['vehicleDetail'] &&
                        capability['generic']['vehicleDetail']['plateNum']
                    "
                >
                    <el-input
                        v-model="newForm['param8'].plateNum"
                        :minlength="
                            capability.generic.vehicleDetail.plateNum.min
                        "
                        :maxlength="
                            capability.generic.vehicleDetail.plateNum.max
                        "
                    />
                </el-form-item>
                <el-form-item
                    label="终端类型"
                    v-if="
                        capability['generic'] &&
                        capability['generic']['vehicleDetail'] &&
                        capability['generic']['vehicleDetail']['terminalType']
                    "
                >
                    <el-input
                        v-model="newForm['param8'].terminalType"
                        :minlength="
                            capability.generic.vehicleDetail.terminalType.min
                        "
                        :maxlength="
                            capability.generic.vehicleDetail.terminalType.max
                        "
                    />
                </el-form-item>
                <el-form-item
                    label="车牌颜色"
                    v-if="
                        capability['generic'] &&
                        capability['generic']['vehicleDetail'] &&
                        capability['generic']['vehicleDetail']['plateColor']
                    "
                >
                    <el-select v-model="newForm['param8'].plateColor">
                        <el-option
                            v-for="item in enumeration[
                                'generic_vehicleDetail_plateColor'
                            ]"
                            :label="item.label"
                            :value="item.value"
                            :key="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    label="车辆类型"
                    v-if="
                        capability['generic'] &&
                        capability['generic']['vehicleDetail'] &&
                        capability['generic']['vehicleDetail']['plateType']
                    "
                >
                    <el-select v-model="newForm['param8'].plateType" clearable>
                        <el-option
                            v-for="item in enumeration[
                                'generic_vehicleDetail_plateType'
                            ]"
                            :label="item.label"
                            :value="item.value"
                            :key="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    label="车辆使用性质"
                    v-if="
                        capability['generic'] &&
                        capability['generic']['vehicleDetail'] &&
                        capability['generic']['vehicleDetail']['vehCharacter']
                    "
                >
                    <el-input
                        v-model="newForm['param8'].vehCharacter"
                        :minlength="0"
                        :maxlength="10"
                    />
                </el-form-item>
                <el-form-item
                    label="VIN"
                    v-if="
                        capability['generic'] &&
                        capability['generic']['vehicleDetail'] &&
                        capability['generic']['vehicleDetail']['VIN']
                    "
                >
                    <el-input
                        v-model="newForm['param8'].VIN"
                        :minlength="0"
                        :maxlength="17"
                    />
                </el-form-item>

                <el-form-item
                    :label="$t('protocolConfiguration.engineNo')"
                    v-if="
                        capability['generic'] &&
                        capability['generic']['vehicleDetail'] &&
                        capability['generic']['vehicleDetail']['engineNum']
                    "
                >
                    <el-input
                        v-model="newForm['param8'].engineNum"
                        :minlength="0"
                        :maxlength="20"
                    />
                </el-form-item>
                <el-form-item
                    label="车身高度"
                    v-if="
                        capability['generic'] &&
                        capability['generic']['vehicleDetail'] &&
                        capability['generic']['vehicleDetail']['height']
                    "
                >
                    <el-input-number
                        :precision="0"
                        controls-position="right"
                        v-model="newForm['param8'].height"
                        :min="capability.generic.vehicleDetail.height.min"
                        :max="capability.generic.vehicleDetail.height.max"
                        data-unit="mm"
                        @blur="
                            (e) => {
                                if (e.target.value === '') {
                                    newForm['param8'].height = Number(
                                        e.target.ariaValueMin
                                    );
                                }
                            }
                        "
                    >
                    </el-input-number>
                </el-form-item>
                <el-form-item
                    label="车身重量"
                    v-if="
                        capability['generic'] &&
                        capability['generic']['vehicleDetail'] &&
                        capability['generic']['vehicleDetail']['weight']
                    "
                >
                    <el-input-number
                        :precision="0"
                        controls-position="right"
                        v-model="newForm['param8'].weight"
                        :min="capability.generic.vehicleDetail.weight.min"
                        :max="capability.generic.vehicleDetail.weight.max"
                        data-unit="kg"
                        @blur="
                            (e) => {
                                if (e.target.value === '') {
                                    newForm['param8'].weight = Number(
                                        e.target.ariaValueMin
                                    );
                                }
                            }
                        "
                    >
                    </el-input-number>
                </el-form-item>
            </div>
            <div
                v-if="
                    newForm['param2222'] &&
                    capability['intelliDrive_sensor'] &&
                    capability['intelliDrive_sensor']['initialMileage']
                "
            >
                <h3>里程信息</h3>
                <el-form-item
                    label="车辆初始里程"
                    v-if="
                        capability['intelliDrive_sensor'] &&
                        capability['intelliDrive_sensor']['initialMileage'] &&
                        capability['intelliDrive_sensor']['initialMileage'][
                            'initialMileage'
                        ]
                    "
                >
                    <el-input-number
                        :precision="0"
                        controls-position="right"
                        v-model="newForm['param2222'].initialMileage"
                        :min="0"
                        :max="10000000"
                        data-unit="0.1km"
                        @blur="
                            (e) => {
                                if (e.target.value === '') {
                                    newForm['param2222'].initialMileage =
                                        Number(e.target.ariaValueMin);
                                }
                            }
                        "
                    >
                    </el-input-number>
                </el-form-item>
                <el-form-item
                    label="车辆累计里程"
                    v-if="
                        capability['intelliDrive_sensor'] &&
                        capability['intelliDrive_sensor']['initialMileage'] &&
                        capability['intelliDrive_sensor']['initialMileage'][
                            'addUpMileage'
                        ]
                    "
                >
                    <el-input-number
                        :precision="0"
                        controls-position="right"
                        v-model="newForm['param2222'].addUpMileage"
                        :min="0"
                        :max="10000000"
                        data-unit="0.1km"
                        @blur="
                            (e) => {
                                if (e.target.value === '') {
                                    newForm['param2222'].addUpMileage = Number(
                                        e.target.ariaValueMin
                                    );
                                }
                            }
                        "
                    >
                    </el-input-number>
                </el-form-item>
                <el-form-item
                    label="里程补传系数"
                    v-if="
                        capability['intelliDrive_sensor'] &&
                        capability['intelliDrive_sensor']['initialMileage'] &&
                        capability['intelliDrive_sensor']['initialMileage'][
                            'mileageRadio'
                        ]
                    "
                >
                    <el-input-number
                        :precision="2"
                        :step="0.01"
                        controls-position="right"
                        v-model="newForm['param2222'].mileageRadio"
                        :min="
                            capability.intelliDrive_sensor.initialMileage
                                .mileageRadio.min / 100
                        "
                        :max="
                            capability.intelliDrive_sensor.initialMileage
                                .mileageRadio.max / 100
                        "
                        @blur="
                            (e) => {
                                if (e.target.value === '') {
                                    newForm['param2222'].mileageRadio = Number(
                                        e.target.ariaValueMin
                                    );
                                }
                            }
                        "
                    >
                    </el-input-number>
                </el-form-item>
            </div>
            <div
                v-if="
                    newForm['param10'] &&
                    capability['generic'] &&
                    capability['generic']['driverInfo'] &&
                    tabPosition === 'tab1'
                "
            >
                <h3>驾驶员卡</h3>
                <el-form-item
                    label="驾驶员姓名"
                    prop="param10.driverName"
                    v-if="
                        capability['generic'] &&
                        capability['generic']['driverInfo'] &&
                        capability['generic']['driverInfo']['driverName']
                    "
                >
                    <el-input
                        v-model="newForm['param10'].driverName"
                        :maxlength="18"
                    />
                </el-form-item>
                <el-form-item
                    label="驾驶证号码"
                    prop="param10.licenseNumber"
                    v-if="
                        capability['generic'] &&
                        capability['generic']['driverInfo'] &&
                        capability['generic']['driverInfo']['licenseNumber']
                    "
                >
                    <el-input
                        v-model="newForm['param10'].licenseNumber"
                        :maxlength="18"
                    />
                </el-form-item>
                <el-form-item
                    label="从业资格证号"
                    prop="param10.qualCert"
                    v-if="newForm['param10'].hasOwnProperty('qualCert')"
                >
                    <el-input
                        v-model="newForm['param10'].qualCert"
                        :maxlength="18"
                    />
                </el-form-item>
                <el-form-item
                    label="IC卡发卡机构"
                    prop="param10.certificationOrgan"
                    v-if="
                        newForm['param10'].hasOwnProperty('certificationOrgan')
                    "
                >
                    <el-input
                        v-model="newForm['param10'].certificationOrgan"
                        :maxlength="8"
                    />
                </el-form-item>
                <el-form-item
                    label="IC卡有效期"
                    prop="param10.validTime"
                    v-if="newForm['param10'].hasOwnProperty('validTime')"
                >
                    <el-date-picker
                        class="validTime"
                        v-model="newForm['param10'].validTime"
                        type="date"
                        placeholder="请选择日期"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        :picker-options="{
                            disabledDate(time) {
                                return time.getTime() < Date.now();
                            },
                        }"
                    />
                </el-form-item>
            </div>
            <div
                v-if="
                    newForm['param930'] &&
                    capability['intelliDrive_sensor'] &&
                    capability['intelliDrive_sensor']['pulseSetting'] &&
                    capability['intelliDrive_sensor']['pulseSetting'][0]
                "
            >
                <h3>车速配置</h3>
                <el-form-item
                    label="车速来源"
                    v-if="
                        capability['intelliDrive_sensor'] &&
                        capability['intelliDrive_sensor']['pulseSetting'] &&
                        capability['intelliDrive_sensor']['pulseSetting'][0] &&
                        capability['intelliDrive_sensor']['pulseSetting'][0][
                            'speedSource'
                        ]
                    "
                >
                    <el-select v-model="newForm['param930'].speedSource">
                        <el-option
                            v-for="item in enumeration[
                                'intelliDrive_sensor_pulseSetting_speedSource'
                            ]"
                            :label="item.label"
                            :value="item.value"
                            :key="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    label="速度脉冲电压上拉开关"
                    v-if="
                        capability['intelliDrive_sensor'] &&
                        capability['intelliDrive_sensor']['pulseSetting'] &&
                        capability['intelliDrive_sensor']['pulseSetting'][0] &&
                        capability['intelliDrive_sensor']['pulseSetting'][0][
                            'velocityPulseVoltage'
                        ]
                    "
                >
                    <el-switch
                        v-model="newForm['param930'].velocityPulseVoltage"
                        :active-value="Number(1)"
                        :inactive-value="Number(0)"
                    ></el-switch>
                </el-form-item>
                <el-form-item
                    label="脉冲系数校准模式"
                    v-if="
                        capability['intelliDrive_sensor'] &&
                        capability['intelliDrive_sensor']['pulseSetting'] &&
                        capability['intelliDrive_sensor']['pulseSetting'][0] &&
                        capability['intelliDrive_sensor']['pulseSetting'][0][
                            'pulseCalibrationMode'
                        ]
                    "
                >
                    <el-select
                        v-model="newForm['param930'].pulseCalibrationMode"
                    >
                        <el-option
                            v-for="item in enumeration[
                                'intelliDrive_sensor_pulseSetting_pulseCalibrationMode'
                            ]"
                            :label="item.label"
                            :value="item.value"
                            :key="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    label="脉冲系数"
                    v-if="
                        capability['intelliDrive_sensor'] &&
                        capability['intelliDrive_sensor']['pulseSetting'] &&
                        capability['intelliDrive_sensor']['pulseSetting'][0] &&
                        capability['intelliDrive_sensor']['pulseSetting'][0][
                            'pulseCoefficient'
                        ]
                    "
                >
                    <el-input-number
                        :precision="0"
                        controls-position="right"
                        v-model="newForm['param930'].pulseCoefficient"
                        :min="
                            capability.intelliDrive_sensor.pulseSetting[0]
                                .pulseCoefficient.min
                        "
                        :max="
                            capability.intelliDrive_sensor.pulseSetting[0]
                                .pulseCoefficient.max
                        "
                        @blur="
                            (e) => {
                                if (e.target.value === '') {
                                    newForm['param930'].pulseCoefficient =
                                        Number(e.target.ariaValueMin);
                                }
                            }
                        "
                    />
                </el-form-item>
                <el-form-item
                    label="占空比"
                    v-if="
                        capability['intelliDrive_sensor'] &&
                        capability['intelliDrive_sensor']['pulseSetting'] &&
                        capability['intelliDrive_sensor']['pulseSetting'][0] &&
                        capability['intelliDrive_sensor']['pulseSetting'][0][
                            'PWM'
                        ]
                    "
                >
                    <el-select v-model="newForm['param930'].PWM">
                        <el-option
                            v-for="item in enumeration[
                                'intelliDrive_sensor_pulseSetting_PWM'
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
                    newForm['param1305'] &&
                    newForm['param1305'].tcssList &&
                    capability['zhatu'] &&
                    capability['zhatu'].containerStatus &&
                    capability['zhatu'].containerStatus.tcssList &&
                    capability['zhatu'].containerStatus.tcssList.length
                "
            >
                <h3>货箱检测列表</h3>
                <el-collapse
                    :value="
                        tcssList.reduce((prev, cur) => {
                            return prev.concat(cur.label);
                        }, [])
                    "
                >
                    <el-collapse-item
                        v-for="(tabItem, index) in this.tcssList"
                        :key="index"
                        :title="tabItem.label"
                        :name="tabItem.label"
                        arrowPlacement="right"
                    >
                        <template v-if="newForm[`param1305`]">
                            <el-form-item
                                label="采集类型"
                                v-if="tabItem.acquireType"
                            >
                                <el-select
                                    v-model="
                                        newForm[`param1305`].tcssList[index][
                                            'acquireType'
                                        ]
                                    "
                                >
                                    <el-option
                                        v-for="item in tabItem.acquireTypeList"
                                        :label="item.label"
                                        :value="item.value"
                                        :key="item.value"
                                    ></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item
                                label="手动设置状态"
                                v-if="tabItem.manualStatus"
                            >
                                <el-select
                                    :disabled="
                                        newForm[`param1305`].tcssList[index][
                                            'acquireType'
                                        ] != 0
                                    "
                                    v-model="
                                        newForm[`param1305`].tcssList[index][
                                            'manualStatus'
                                        ]
                                    "
                                >
                                    <el-option
                                        v-for="item in tabItem.manualStatusList"
                                        :label="item.label"
                                        :value="item.value"
                                        :key="item.value"
                                    ></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item
                                label="当前状态"
                                v-if="tabItem.curStatus"
                            >
                                <el-select
                                    :disabled="true"
                                    v-model="
                                        newForm[`param1305`].tcssList[index][
                                            'curStatus'
                                        ]
                                    "
                                >
                                    <el-option
                                        v-for="item in tabItem.curStatusList"
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
                    newForm['param1305'] &&
                    capability['zhatu'] &&
                    capability['zhatu']['containerStatus'] &&
                    capability['zhatu']['containerStatus']
                "
            >
                <h3>静态手动设置</h3>
                <el-form-item
                    label="静态手动设置使能"
                    v-if="
                        capability['zhatu'] &&
                        capability['zhatu']['containerStatus'] &&
                        capability['zhatu']['containerStatus']['staticEnable']
                    "
                >
                    <el-switch
                        v-model="newForm['param1305'].staticEnable"
                        :active-value="Number(1)"
                        :inactive-value="Number(0)"
                    ></el-switch>
                </el-form-item>
                <el-form-item
                    label="静态手动速度"
                    v-if="
                        capability['zhatu'] &&
                        capability['zhatu']['containerStatus'] &&
                        capability['zhatu']['containerStatus']['staticSpeed']
                    "
                >
                    <el-input-number
                        :precision="0"
                        controls-position="right"
                        v-model="newForm['param1305'].staticSpeed"
                        :min="capability.zhatu.containerStatus.staticSpeed.min"
                        :max="capability.zhatu.containerStatus.staticSpeed.max"
                        data-unit="km/h"
                        @blur="
                            (e) => {
                                if (e.target.value === '') {
                                    newForm['param1305'].staticSpeed = Number(
                                        e.target.ariaValueMin
                                    );
                                }
                            }
                        "
                    ></el-input-number>
                </el-form-item>
                <el-form-item
                    label="持续时间"
                    v-if="
                        capability['zhatu'] &&
                        capability['zhatu']['containerStatus'] &&
                        capability['zhatu']['containerStatus']['staticContinue']
                    "
                >
                    <el-input-number
                        :precision="0"
                        controls-position="right"
                        v-model="newForm['param1305'].staticContinue"
                        :min="
                            capability.zhatu.containerStatus.staticContinue.min
                        "
                        :max="
                            capability.zhatu.containerStatus.staticContinue.max
                        "
                        data-unit="s"
                        @blur="
                            (e) => {
                                if (e.target.value === '') {
                                    newForm['param1305'].staticContinue =
                                        Number(e.target.ariaValueMin);
                                }
                            }
                        "
                    ></el-input-number>
                </el-form-item>
            </div>
            <div
                v-if="
                    newForm['param1305'] &&
                    capability['zhatu'] &&
                    capability['zhatu']['containerStatus'] &&
                    capability['zhatu']['containerStatus']['osdEnable']
                "
            >
                <h3>车厢状态OSD开关</h3>
                <el-form-item
                    :label="`通道${item.chanNo}`"
                    v-for="item in newForm['param1305'].osdEnable"
                    :key="item.chanNo"
                >
                    <el-switch
                        v-model="item.enable"
                        :active-value="Number(1)"
                        :inactive-value="Number(0)"
                    ></el-switch>
                </el-form-item>
            </div>
            <div
                v-if="
                    newForm['param965'] &&
                    capability['intelliDrive_sensor'] &&
                    capability['intelliDrive_sensor']['vehicleControlScheme']
                "
            >
                <h3>发动机控车</h3>
                <el-form-item
                    label="ECU方案"
                    v-if="
                        capability['intelliDrive_sensor'] &&
                        capability['intelliDrive_sensor'][
                            'vehicleControlScheme'
                        ] &&
                        capability['intelliDrive_sensor'][
                            'vehicleControlScheme'
                        ]['schemeType']
                    "
                >
                    <el-select v-model="newForm['param965'].schemeType">
                        <el-option
                            v-for="item in capability.zhatu.engineVehicleControl
                                .ecuType"
                            :label="`方案${item}`"
                            :value="item"
                            :key="item"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    label="ECU车型值"
                    v-if="
                        capability['intelliDrive_sensor'] &&
                        capability['intelliDrive_sensor'][
                            'vehicleControlScheme'
                        ] &&
                        capability['intelliDrive_sensor'][
                            'vehicleControlScheme'
                        ]['vehicleType']
                    "
                >
                    <el-input-number
                        :precision="0"
                        controls-position="right"
                        v-model="newForm['param965'].vehicleType"
                        :min="
                            capability.zhatu.engineVehicleControl.ecuValue.min
                        "
                        :max="
                            capability.zhatu.engineVehicleControl.ecuValue.max
                        "
                        @blur="
                            (e) => {
                                if (e.target.value === '') {
                                    newForm['param965'].vehicleType = Number(
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
                    newForm['param960'] &&
                    capability['intelliDrive_sensor'] &&
                    capability['intelliDrive_sensor']['vehicleConrolSetting']
                "
            >
                <h3>控车参数</h3>
                <el-form-item
                    label="车辆管控模式"
                    v-if="
                        capability['intelliDrive_sensor'] &&
                        capability['intelliDrive_sensor'][
                            'vehicleConrolSetting'
                        ] &&
                        capability['intelliDrive_sensor'][
                            'vehicleConrolSetting'
                        ]['controlEnable']
                    "
                >
                    <el-switch
                        v-model="newForm['param960'].controlEnable"
                        :active-value="Number(1)"
                        :inactive-value="Number(0)"
                        @change="controlEnableChange"
                    ></el-switch>
                </el-form-item>
                <template v-for="item in vehCtrlList">
                    <el-form-item
                        :key="item.ctrlType"
                        :label="item.label"
                        v-if="
                            newForm['param960'].controlEnable &&
                            capability['intelliDrive_sensor'] &&
                            capability['intelliDrive_sensor'][
                                'vehicleConrolSetting'
                            ] &&
                            capability['intelliDrive_sensor'][
                                'vehicleConrolSetting'
                            ][item.param]
                        "
                    >
                        <el-input-number
                            :precision="0"
                            controls-position="right"
                            v-if="item.ctrlType === 2"
                            v-model="newForm['param960'][item.param]"
                            :min="item.ctrlSpeed.min"
                            :max="item.ctrlSpeed.max"
                            @blur="
                                (e) => {
                                    if (e.target.value === '') {
                                        newForm['param960'][item.param] =
                                            Number(e.target.ariaValueMin);
                                    }
                                }
                            "
                        />
                        <el-select
                            v-else
                            v-model="newForm['param960'][item.param]"
                        >
                            <el-option
                                v-for="item in item.ctrlStatusList"
                                :label="item.label"
                                :value="item.value"
                                :key="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                </template>
            </div>
            <div
                v-if="
                    newForm['param38'] &&
                    capability['generic'] &&
                    capability['generic']['lockSetting']
                "
            >
                <h3>
                    锁定参数
                    <i class="el-icon-warning"></i>
                    <span class="warning-msg">
                        已默认将运维平台参数锁定不允许修改！
                    </span>
                </h3>
                <el-form-item
                    label="ICC锁定状态"
                    v-if="
                        capability['generic'] &&
                        capability['generic']['lockSetting'] &&
                        capability['generic']['lockSetting']['iccid']
                    "
                >
                    <el-switch
                        v-model="newForm['param38'].iccidlockStatus"
                        :active-value="Number(1)"
                        :inactive-value="Number(0)"
                    ></el-switch>
                </el-form-item>
                <el-form-item
                    label="当前设备读取的ICCID"
                    v-if="
                        !isTemplate &&
                        capability['generic'] &&
                        capability['generic']['lockSetting'] &&
                        capability['generic']['lockSetting']['iccid']
                    "
                >
                    <el-input
                        :title="newForm['param38'].currIccid"
                        v-model="newForm['param38'].currIccid"
                        :disabled="true"
                    />
                </el-form-item>
                <el-form-item
                    label="锁定的ICCID"
                    v-if="
                        !isTemplate &&
                        capability['generic'] &&
                        capability['generic']['lockSetting'] &&
                        capability['generic']['lockSetting']['iccid']
                    "
                >
                    <el-input
                        :title="newForm['param38'].lockIccid"
                        v-model="newForm['param38'].lockIccid"
                        :minlength="capability.generic.lockSetting.iccid.lenMin"
                        :maxlength="capability.generic.lockSetting.iccid.lenMax"
                        :disabled="true"
                    />
                </el-form-item>
                <br />
                <el-form-item
                    label="锁定部标平台参数"
                    v-if="
                        capability['generic'] &&
                        capability['generic']['lockSetting'] &&
                        capability['generic']['lockSetting']['platform'] &&
                        capability['generic']['lockSetting']['platform'][
                            'jtStandard'
                        ] &&
                        capability['generic']['lockSetting']['platform'][
                            'jtStandard'
                        ].length
                    "
                >
                    <el-select
                        v-model="
                            newForm['param38'].platformLockStatus.jtStandardList
                        "
                        multiple
                        collapse-tags
                    >
                        <el-option
                            v-for="item in capability['generic']['lockSetting'][
                                'platform'
                            ]['jtStandard']"
                            :label="
                                Number(item) - 1 ===
                                Number(capability.network.isHikPlatform)
                                    ? '海康云平台'
                                    : '第' + item + '中心'
                            "
                            :value="item"
                            :key="item"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <br />
                <el-form-item
                    label="信息锁定状态"
                    v-if="
                        capability['generic'] &&
                        capability['generic']['lockSetting'] &&
                        capability['generic']['lockSetting']['vehicleParam']
                    "
                >
                    <el-switch
                        v-model="newForm['param38'].vehicleParamLockStatus"
                        :active-value="Number(1)"
                        :inactive-value="Number(0)"
                    ></el-switch>
                </el-form-item>
                <div
                    class="lock-status-text"
                    v-if="
                        capability['generic'] &&
                        capability['generic']['lockSetting'] &&
                        capability['generic']['lockSetting']['vehicleParam'] &&
                        newForm['param38'] &&
                        newForm['param38'].vehicleParamLockStatus
                    "
                >
                    具体锁定项：车辆信息、ADAS、DSM、VSD、BSD、WHD、超速报警、超时驾驶，定制以实际为准
                </div>
            </div>
            <div
                v-if="
                    newForm['param6'] &&
                    capability['generic'] &&
                    capability['generic']['modDeviceInfo']
                "
            >
                <h3>终端主机参数</h3>
                <el-form-item
                    label="欠压报警阈值"
                    v-if="
                        capability['generic']['modDeviceInfo'][
                            'underVoltageThreshold'
                        ]
                    "
                >
                    <el-input-number
                        :precision="0"
                        controls-position="right"
                        v-model="newForm['param6'].underVoltageThreshold"
                        :min="
                            capability.generic.modDeviceInfo
                                .underVoltageThreshold.rangeMin
                        "
                        :max="
                            capability.generic.modDeviceInfo
                                .underVoltageThreshold.rangeMax
                        "
                        data-unit="0.1V"
                        @blur="
                            (e) => {
                                if (e.target.value === '') {
                                    newForm['param6'].underVoltageThreshold =
                                        Number(e.target.ariaValueMin);
                                }
                            }
                        "
                    >
                    </el-input-number>
                </el-form-item>
            </div>
            <div
                v-if="
                    newForm['param20'] &&
                    capability['generic'] &&
                    capability['generic']['positioning']
                "
            >
                <h3>定位配置</h3>
                <el-form-item
                    label="定位方式"
                    v-if="
                        capability['generic'] &&
                        capability['generic']['positioning'] &&
                        capability['generic']['positioning']['positionType'] &&
                        capability['generic']['positioning']['positionType']
                            .length
                    "
                >
                    <el-select v-model="newForm['param20'].positionType">
                        <el-option
                            v-for="item in enumeration[
                                'generic_positioning_positionType'
                            ]"
                            :label="item.label"
                            :value="item.value"
                            :key="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    label="北斗上报周期"
                    v-if="
                        capability['generic']['positioning']['bdReportInterval']
                    "
                >
                    <el-input-number
                        :precision="0"
                        controls-position="right"
                        v-model="newForm['param20'].bdReportInterval"
                        :min="
                            capability.generic.positioning.bdReportInterval
                                .rangeMin
                        "
                        :max="
                            capability.generic.positioning.bdReportInterval
                                .rangeMax
                        "
                        data-unit="s"
                        @blur="
                            (e) => {
                                if (e.target.value === '') {
                                    newForm['param20'].bdReportInterval =
                                        Number(e.target.ariaValueMin);
                                }
                            }
                        "
                    >
                    </el-input-number>
                </el-form-item>
            </div>
        </el-form>
    </div>
</template>
<script>
import mixins from "@/mixins/mixins";
export default {
    name: "vehicleParams",
    mixins: [mixins],
    components: {},
    props: {},
    data() {
        const validateNumber = (rule, value, callback) => {
            if (!value) {
                callback();
            } else if (value.length !== 18) {
                callback(new Error(`请输入18位${rule.name}`));
            } else {
                callback();
            }
        };
        const validateCommonEmpty = (rule, value, callback) => {
            if (!value && this.newForm["param10"]) {
                callback(new Error(`${rule.name}不能为空`));
            } else {
                callback();
            }
        };
        const validateEmpty = (rule, value, callback) => {
            if (
                !value &&
                this.newForm["param38"] &&
                this.newForm["param38"].iccidlockStatus
            ) {
                callback(new Error(`${rule.name}不能为空`));
            } else {
                callback();
            }
        };
        return {
            setForm: {},
            tcssList: [],
            vehCtrlList: [],
            rules: {
                "param10.licenseNumber": [
                    {
                        required: false,
                        validator: validateNumber,
                        trigger: "blur",
                        name: "驾驶证号码",
                    },
                ],
                "param10.qualCert": [
                    {
                        required: false,
                        validator: validateNumber,
                        trigger: "blur",
                        name: "从业资格证号",
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
        this.activedCount = 0;
        this.initConfig();
    },
    computed: {},
    watch: {
        newForm: {
            handler(val) {
                if (val) {
                    if (val.param8) {
                        if (!this.setForm.hasOwnProperty("车辆信息&param8")) {
                            this.setForm["车辆信息&param8"] = {};
                        }
                        this.setForm["车辆信息&param8"].provinceID =
                            val["param8"].provinceID !=
                                this.oldForm["param8"].provinceID ||
                            (this.isTemplate &&
                                val["param8"].hasOwnProperty("provinceID"))
                                ? `param8.provinceID&车辆所在的省域ID&${val["param8"].provinceID}`
                                : null;
                        this.setForm["车辆信息&param8"].cityID =
                            val["param8"].cityID !=
                                this.oldForm["param8"].cityID ||
                            (this.isTemplate &&
                                val["param8"].hasOwnProperty("cityID"))
                                ? `param8.cityID&车辆所在的市域ID&${val["param8"].cityID}`
                                : null;
                        this.setForm["车辆信息&param8"].manufacturerID =
                            val["param8"].manufacturerID !=
                                this.oldForm["param8"].manufacturerID ||
                            (this.isTemplate &&
                                val["param8"].hasOwnProperty("manufacturerID"))
                                ? `param8.manufacturerID&制造商ID&${val["param8"].manufacturerID}`
                                : null;
                        this.setForm["车辆信息&param8"].plateNum =
                            val["param8"].plateNum !=
                                this.oldForm["param8"].plateNum ||
                            (this.isTemplate &&
                                val["param8"].hasOwnProperty("plateNum"))
                                ? `param8.plateNum&车牌号&${val["param8"].plateNum}`
                                : null;
                        this.setForm["车辆信息&param8"].terminalType =
                            val["param8"].terminalType !=
                                this.oldForm["param8"].terminalType ||
                            (this.isTemplate &&
                                val["param8"].hasOwnProperty("terminalType"))
                                ? `param8.terminalType&终端类型&${val["param8"].terminalType}`
                                : null;
                        this.setForm["车辆信息&param8"].plateColor =
                            val["param8"].plateColor !=
                                this.oldForm["param8"].plateColor ||
                            (this.isTemplate &&
                                val["param8"].hasOwnProperty("plateColor"))
                                ? `param8.plateColor&车牌颜色&${this.getLabel(
                                      "generic_vehicleDetail_plateColor",
                                      val["param8"].plateColor
                                  )}&${val["param8"].plateColor}`
                                : null;
                        this.setForm["车辆信息&param8"].plateType =
                            val["param8"].plateType !=
                                this.oldForm["param8"].plateType ||
                            (this.isTemplate &&
                                val["param8"].hasOwnProperty("plateType"))
                                ? `param8.plateType&车辆类型&${this.getLabel(
                                      "generic_vehicleDetail_plateType",
                                      val["param8"].plateType
                                  )}&${val["param8"].plateType}`
                                : null;
                        this.setForm["车辆信息&param8"].vehCharacter =
                            val["param8"].vehCharacter !=
                                this.oldForm["param8"].vehCharacter ||
                            (this.isTemplate &&
                                val["param8"].hasOwnProperty("vehCharacter"))
                                ? `param8.vehCharacter&车辆使用性质&${val["param8"].vehCharacter}`
                                : null;
                        this.setForm["车辆信息&param8"].VIN =
                            val["param8"].VIN != this.oldForm["param8"].VIN ||
                            (this.isTemplate &&
                                val["param8"].hasOwnProperty("VIN"))
                                ? `param8.VIN&VIN&${val["param8"].VIN}`
                                : null;
                        this.setForm["车辆信息&param8"].engineNum =
                            val["param8"].engineNum !=
                                this.oldForm["param8"].engineNum ||
                            (this.isTemplate &&
                                val["param8"].hasOwnProperty("engineNum"))
                                ? `param8.engineNum&${this.$t(
                                      "protocolConfiguration.engineNo"
                                  )}&${val["param8"].engineNum}`
                                : null;
                        this.setForm["车辆信息&param8"].height =
                            val["param8"].height !=
                                this.oldForm["param8"].height ||
                            (this.isTemplate &&
                                val["param8"].hasOwnProperty("height"))
                                ? `param8.height&车身高度&${val["param8"].height}`
                                : null;
                        this.setForm["车辆信息&param8"].weight =
                            val["param8"].weight !=
                                this.oldForm["param8"].weight ||
                            (this.isTemplate &&
                                val["param8"].hasOwnProperty("weight"))
                                ? `param8.weight&车身重量&${val["param8"].weight}`
                                : null;
                    }
                    if (
                        val.param2222 &&
                        this.capability["intelliDrive_sensor"] &&
                        this.capability["intelliDrive_sensor"]["initialMileage"]
                    ) {
                        if (
                            !this.setForm.hasOwnProperty("里程信息&param2222")
                        ) {
                            this.setForm["里程信息&param2222"] = {};
                        }
                        this.setForm["里程信息&param2222"].initialMileage =
                            val["param2222"].initialMileage !=
                                this.oldForm["param2222"].initialMileage ||
                            (this.isTemplate &&
                                val["param2222"].hasOwnProperty(
                                    "initialMileage"
                                ))
                                ? `param2222.initialMileage&车辆初始里程&${val["param2222"].initialMileage}`
                                : null;
                        this.setForm["里程信息&param2222"].addUpMileage =
                            val["param2222"].addUpMileage !=
                                this.oldForm["param2222"].addUpMileage ||
                            (this.isTemplate &&
                                val["param2222"].hasOwnProperty("addUpMileage"))
                                ? `param2222.addUpMileage&车辆累计里程&${val["param2222"].addUpMileage}`
                                : null;
                        this.setForm["里程信息&param2222"].mileageRadio =
                            val["param2222"].mileageRadio !=
                                this.oldForm["param2222"].mileageRadio ||
                            (this.isTemplate &&
                                val["param2222"].hasOwnProperty("mileageRadio"))
                                ? `param2222.mileageRadio&里程补传系数&${val["param2222"].mileageRadio}`
                                : null;
                    }
                    if (val.param10) {
                        if (!this.setForm.hasOwnProperty("驾驶员卡&param10")) {
                            this.setForm["驾驶员卡&param10"] = {};
                        }
                        this.setForm["驾驶员卡&param10"].driverName =
                            val["param10"].driverName !=
                            this.oldForm["param10"].driverName
                                ? `param10.driverName&驾驶员姓名&${val["param10"].driverName}`
                                : null;
                        this.setForm["驾驶员卡&param10"].licenseNumber =
                            val["param10"].licenseNumber !=
                            this.oldForm["param10"].licenseNumber
                                ? `param10.licenseNumber&驾驶证号码&${val["param10"].licenseNumber}`
                                : null;
                        this.setForm["驾驶员卡&param10"].qualCert =
                            val["param10"].qualCert !=
                            this.oldForm["param10"].qualCert
                                ? `param10.qualCert&从业资格证号&${val["param10"].qualCert}`
                                : null;
                        this.setForm["驾驶员卡&param10"].certificationOrgan =
                            val["param10"].certificationOrgan !=
                            this.oldForm["param10"].certificationOrgan
                                ? `param10.certificationOrgan&IC卡发卡机构&${val["param10"].certificationOrgan}`
                                : null;
                        this.setForm["驾驶员卡&param10"].validTime =
                            val["param10"].validTime !=
                            this.oldForm["param10"].validTime
                                ? `param10.validTime&IC卡有效期&${val["param10"].validTime}`
                                : null;
                    }
                    if (val.param930) {
                        if (!this.setForm.hasOwnProperty("车速配置&param930")) {
                            this.setForm["车速配置&param930"] = {};
                        }
                        this.setForm["车速配置&param930"].speedSource =
                            val["param930"].speedSource !=
                                this.oldForm["param930"].speedSource ||
                            (this.isTemplate &&
                                val["param930"].hasOwnProperty("speedSource"))
                                ? `param930.speedSource&车速来源number&${this.getLabel(
                                      "intelliDrive_sensor_pulseSetting_speedSource",
                                      val["param930"].speedSource
                                  )}&${val["param930"].speedSource}`
                                : null;
                        this.setForm["车速配置&param930"].velocityPulseVoltage =
                            val["param930"].velocityPulseVoltage !=
                                this.oldForm["param930"].velocityPulseVoltage ||
                            (this.isTemplate &&
                                val["param930"].hasOwnProperty(
                                    "velocityPulseVoltage"
                                ))
                                ? `param930.velocityPulseVoltage&速度脉冲电压上拉开关switch&${val["param930"].velocityPulseVoltage}`
                                : null;
                        this.setForm["车速配置&param930"].pulseCalibrationMode =
                            val["param930"].pulseCalibrationMode !=
                                this.oldForm["param930"].pulseCalibrationMode ||
                            (this.isTemplate &&
                                val["param930"].hasOwnProperty(
                                    "pulseCalibrationMode"
                                ))
                                ? `param930.pulseCalibrationMode&脉冲系数校准模式number&${this.getLabel(
                                      "intelliDrive_sensor_pulseSetting_pulseCalibrationMode",
                                      val["param930"].pulseCalibrationMode
                                  )}&${val["param930"].pulseCalibrationMode}`
                                : null;
                        this.setForm["车速配置&param930"].pulseCoefficient =
                            val["param930"].pulseCoefficient !=
                                this.oldForm["param930"].pulseCoefficient ||
                            (this.isTemplate &&
                                val["param930"].hasOwnProperty(
                                    "pulseCoefficient"
                                ))
                                ? `param930.pulseCoefficient&脉冲系数&${val["param930"].pulseCoefficient}`
                                : null;
                        this.setForm["车速配置&param930"].PWM =
                            val["param930"].PWM !=
                                this.oldForm["param930"].PWM ||
                            (this.isTemplate &&
                                val["param930"].hasOwnProperty("PWM"))
                                ? `param930.PWM&占空比number&${this.getLabel(
                                      "intelliDrive_sensor_pulseSetting_PWM",
                                      val["param930"].PWM
                                  )}&${val["param930"].PWM}`
                                : null;
                    }
                    if (val.param1305) {
                        this.tcssList.forEach((item, index) => {
                            let objName = `货箱检测列表>${item.label}&param1305`;
                            if (!this.setForm.hasOwnProperty(objName)) {
                                this.setForm[objName] = {};
                            }
                            this.setForm[objName][
                                `tcssList.${index}.acquireType`
                            ] =
                                val["param1305"].tcssList[index].acquireType !=
                                    this.oldForm["param1305"].tcssList[index]
                                        .acquireType ||
                                (this.isTemplate &&
                                    val["param1305"].hasOwnProperty("tcssList"))
                                    ? `param1305.tcssList.${index}.acquireType&采集类型number&${this.getLabelSelf(
                                          item.acquireTypeList,
                                          val["param1305"].tcssList[index]
                                              .acquireType
                                      )}&${
                                          val["param1305"].tcssList[index]
                                              .acquireType
                                      }`
                                    : null;
                            this.setForm[objName][
                                `tcssList.${index}.manualStatus`
                            ] =
                                val["param1305"].tcssList[index].manualStatus !=
                                    this.oldForm["param1305"].tcssList[index]
                                        .manualStatus ||
                                (this.isTemplate &&
                                    val["param1305"].hasOwnProperty("tcssList"))
                                    ? `param1305.tcssList.${index}.manualStatus&手动设置状态number&${this.getLabelSelf(
                                          item.manualStatusList,
                                          val["param1305"].tcssList[index]
                                              .manualStatus
                                      )}&${
                                          val["param1305"].tcssList[index]
                                              .manualStatus
                                      }`
                                    : null;
                            this.setForm[objName][
                                `tcssList.${index}.curStatus`
                            ] =
                                val["param1305"].tcssList[index].curStatus !=
                                    this.oldForm["param1305"].tcssList[index]
                                        .curStatus ||
                                (this.isTemplate &&
                                    val["param1305"].hasOwnProperty("tcssList"))
                                    ? `param1305.tcssList.${index}.curStatus&当前状态number&${this.getLabelSelf(
                                          item.curStatusList,
                                          val["param1305"].tcssList[index]
                                              .curStatus
                                      )}&${
                                          val["param1305"].tcssList[index]
                                              .curStatus
                                      }`
                                    : null;
                        });
                        if (
                            !this.setForm.hasOwnProperty(
                                "静态手动设置&param1305"
                            )
                        ) {
                            this.setForm["静态手动设置&param1305"] = {};
                        }
                        this.setForm["静态手动设置&param1305"].staticEnable =
                            val["param1305"].staticEnable !=
                                this.oldForm["param1305"].staticEnable ||
                            (this.isTemplate &&
                                val["param1305"].hasOwnProperty("staticEnable"))
                                ? `param1305.staticEnable&静态手动设置使能switch&${val["param1305"].staticEnable}`
                                : null;
                        this.setForm["静态手动设置&param1305"].staticSpeed =
                            val["param1305"].staticSpeed !=
                                this.oldForm["param1305"].staticSpeed ||
                            (this.isTemplate &&
                                val["param1305"].hasOwnProperty("staticSpeed"))
                                ? `param1305.staticSpeed&静态手动速度number&${val["param1305"].staticSpeed}`
                                : null;
                        this.setForm["静态手动设置&param1305"].staticContinue =
                            val["param1305"].staticContinue !=
                                this.oldForm["param1305"].staticContinue ||
                            (this.isTemplate &&
                                val["param1305"].hasOwnProperty(
                                    "staticContinue"
                                ))
                                ? `param1305.staticContinue&持续时间number&${val["param1305"].staticContinue}`
                                : null;
                        if (
                            !this.setForm.hasOwnProperty(
                                "车厢状态OSD开关&param1305"
                            )
                        ) {
                            this.setForm["车厢状态OSD开关&param1305"] = {};
                        }
                        val["param1305"].osdEnable.forEach((item, index) => {
                            this.setForm["车厢状态OSD开关&param1305"][
                                `osdEnable.${index}.enable`
                            ] =
                                val["param1305"].osdEnable[index].enable !=
                                    this.oldForm["param1305"].osdEnable[index]
                                        .enable ||
                                (this.isTemplate &&
                                    val["param1305"].hasOwnProperty(
                                        "osdEnable"
                                    ))
                                    ? `param1305.osdEnable.${index}.enable&通道${item.chanNo}switch&${val["param1305"].osdEnable[index].enable}`
                                    : null;
                        });
                    }
                    if (val.param965) {
                        if (
                            !this.setForm.hasOwnProperty("发动机控车&param965")
                        ) {
                            this.setForm["发动机控车&param965"] = {};
                        }
                        this.setForm["发动机控车&param965"].schemeType =
                            val["param965"].schemeType !=
                                this.oldForm["param965"].schemeType ||
                            (this.isTemplate &&
                                val["param965"].hasOwnProperty("schemeType"))
                                ? `param965.schemeType&ECU方案number&方案${val["param965"].schemeType}&${val["param965"].schemeType}`
                                : null;
                        this.setForm["发动机控车&param965"].vehicleType =
                            val["param965"].vehicleType !=
                                this.oldForm["param965"].vehicleType ||
                            (this.isTemplate &&
                                val["param965"].hasOwnProperty("vehicleType"))
                                ? `param965.vehicleType&ECU车型值number&${val["param965"].vehicleType}`
                                : null;
                    }
                    if (val.param960) {
                        if (!this.setForm.hasOwnProperty("控车参数&param960")) {
                            this.setForm["控车参数&param960"] = {};
                        }
                        this.setForm["控车参数&param960"].controlEnable =
                            val["param960"].controlEnable !=
                                this.oldForm["param960"].controlEnable ||
                            (this.isTemplate &&
                                val["param960"].hasOwnProperty("controlEnable"))
                                ? `param960.controlEnable&车辆管控模式switch&${val["param960"].controlEnable}`
                                : null;
                        this.setForm["控车参数&param960"].lock =
                            val["param960"].lock !=
                                this.oldForm["param960"].lock ||
                            (this.isTemplate &&
                                val["param960"].hasOwnProperty("lock"))
                                ? `param960.lock&锁车指令number&${this.getLabelSelf(
                                      this.vehCtrlList.find(
                                          (item) => item.ctrlType === 1
                                      ).ctrlStatusList,
                                      val["param960"].lock
                                  )}&${val["param960"].lock}`
                                : null;
                        this.setForm["控车参数&param960"].speedLimit =
                            val["param960"].speedLimit !=
                                this.oldForm["param960"].speedLimit ||
                            (this.isTemplate &&
                                val["param960"].hasOwnProperty("speedLimit"))
                                ? `param960.speedLimit&限速指令number&${val["param960"].speedLimit}`
                                : null;
                        this.setForm["控车参数&param960"].liftLimit =
                            val["param960"].liftLimit !=
                                this.oldForm["param960"].liftLimit ||
                            (this.isTemplate &&
                                val["param960"].hasOwnProperty("liftLimit"))
                                ? `param960.liftLimit&限举指令number&${this.getLabelSelf(
                                      this.vehCtrlList.find(
                                          (item) => item.ctrlType === 3
                                      ).ctrlStatusList,
                                      val["param960"].liftLimit
                                  )}&${val["param960"].liftLimit}`
                                : null;
                    }
                    if (val.param38) {
                        if (!this.setForm.hasOwnProperty("锁定参数&param38")) {
                            this.setForm["锁定参数&param38"] = {
                                platformLockStatus: {},
                            };
                        }
                        this.setForm["锁定参数&param38"].iccidlockStatus =
                            val["param38"].iccidlockStatus !=
                                this.oldForm["param38"].iccidlockStatus ||
                            (this.isTemplate &&
                                val["param38"].hasOwnProperty(
                                    "iccidlockStatus"
                                ))
                                ? `param38.iccidlockStatus&ICC锁定状态switch&${val["param38"].iccidlockStatus}`
                                : null;

                        this.setForm["锁定参数&param38"].jtStandardList =
                            JSON.stringify(
                                val["param38"].platformLockStatus.jtStandardList
                            ) !=
                                JSON.stringify(
                                    this.oldForm["param38"].platformLockStatus
                                        .jtStandardList
                                ) ||
                            (this.isTemplate &&
                                val["param38"].hasOwnProperty(
                                    "platformLockStatus"
                                ) &&
                                val["param38"][
                                    "platformLockStatus"
                                ].hasOwnProperty("jtStandardList"))
                                ? `param38.platformLockStatus.jtStandard&锁定部标平台参数objArray&${this.getUploadEventPlatform(
                                      val["param38"].platformLockStatus
                                          .jtStandardList
                                  )}&${this.getJtStandard(
                                      val["param38"].platformLockStatus
                                          .jtStandardList,
                                      val["param38"].platformLockStatus
                                          .jtStandard
                                  )}`
                                : null;
                        this.setForm[
                            "锁定参数&param38"
                        ].vehicleParamLockStatus =
                            val["param38"].vehicleParamLockStatus !=
                                this.oldForm["param38"]
                                    .vehicleParamLockStatus ||
                            (this.isTemplate &&
                                val["param38"].hasOwnProperty(
                                    "vehicleParamLockStatus"
                                ))
                                ? `param38.vehicleParamLockStatus&信息锁定状态switch&${val["param38"].vehicleParamLockStatus}`
                                : null;
                    }
                    if (val.param20) {
                        if (!this.setForm.hasOwnProperty("定位配置&param20")) {
                            this.setForm["定位配置&param20"] = {};
                        }
                        this.setForm["定位配置&param20"].positionType =
                            val["param20"].positionType !=
                                this.oldForm["param20"].positionType ||
                            (this.isTemplate &&
                                val["param20"].hasOwnProperty("positionType"))
                                ? `param20.positionType&定位方式&${this.getLabel(
                                      "generic_positioning_positionType",
                                      val["param20"].positionType
                                  )}&${val["param20"].positionType}`
                                : null;
                        this.setForm["定位配置&param20"].bdReportInterval =
                            val["param20"].bdReportInterval !=
                                this.oldForm["param20"].bdReportInterval ||
                            (this.isTemplate &&
                                val["param20"].hasOwnProperty(
                                    "bdReportInterval"
                                ))
                                ? `param20.bdReportInterval&北斗上报周期&${val["param20"].bdReportInterval}`
                                : null;
                    }
                    if (
                        this.capability &&
                        this.capability["generic"] &&
                        this.capability["generic"]["modDeviceInfo"] &&
                        this.capability["generic"]["modDeviceInfo"][
                            "underVoltageThreshold"
                        ] &&
                        val.param6
                    ) {
                        if (
                            !this.setForm.hasOwnProperty("终端主机参数&param6")
                        ) {
                            this.setForm["终端主机参数&param6"] = {};
                        }
                        this.setForm[
                            "终端主机参数&param6"
                        ].underVoltageThreshold =
                            val["param6"].underVoltageThreshold !=
                                this.oldForm["param6"].underVoltageThreshold ||
                            (this.isTemplate &&
                                val["param6"].hasOwnProperty(
                                    "underVoltageThreshold"
                                ))
                                ? `param6.underVoltageThreshold&欠压报警阈值&${val["param6"].underVoltageThreshold}`
                                : null;
                    }
                    this.$emit("setFormChange", {
                        车辆参数: this.setForm,
                    });
                }
            },
            deep: true,
            immediate: true,
        },
    },
    methods: {
        getJtStandard(arr1, arr2) {
            arr2.forEach((i) => {
                if (arr1.indexOf(Number(i.index)) > -1) {
                    i.lockStatus = 1;
                } else {
                    i.lockStatus = 0;
                }
            });
            return JSON.stringify(arr2);
        },
        controlEnableChange(val) {
            if (!val) {
                this.newForm["param960"].lock = this.oldForm["param960"].lock;
                this.newForm["param960"].speedLimit =
                    this.oldForm["param960"].speedLimit;
                this.newForm["param960"].liftLimit =
                    this.oldForm["param960"].liftLimit;
            }
        },

        initConfig() {
            this.$emit("setFormLoading", true);
            Promise.all([
                this.getEHomeConfig(2222),
                this.getEHomeConfig(930),
                this.getEHomeConfig(8),
                this.getEHomeConfig(6),
                this.getEHomeConfig(20),
                this.getEHomeConfig(38),
                this.getEHomeConfig(10),
                this.getEHomeConfig(1305),
                this.getEHomeConfig(965),
                this.getEHomeConfig(960),
            ]).then((result) => {
                this.$emit("setFormLoading", false);
                this.$emit("loadingSuccess");
            });
            if (
                this.capability["zhatu"] &&
                this.capability["zhatu"].containerStatus &&
                this.capability["zhatu"].containerStatus.tcssList &&
                this.capability["zhatu"].containerStatus.tcssList.length
            ) {
                this.tcssList =
                    this.capability["zhatu"].containerStatus.tcssList;
                this.tcssList.forEach((item) => {
                    item.label = this.getJsonLabel(
                        "zhatu_containerStatus_tcssList_tcssType",
                        item.tcssType
                    );
                    item.acquireTypeList = this.getEnumerationValue(
                        item.acquireType,
                        "zhatu_containerStatus_tcssList_acquireType"
                    );
                    item.curStatusList = this.getEnumerationValue(
                        item.curStatus,
                        `zhatu_containerStatus_tcssList_Status_${item.tcssType}`
                    );
                    item.manualStatusList = this.getEnumerationValue(
                        item.manualStatus,
                        `zhatu_containerStatus_tcssList_Status_${item.tcssType}`
                    );
                });
            }
            if (
                this.capability["zhatu"] &&
                this.capability["zhatu"].vehicleControl &&
                this.capability["zhatu"].vehicleControl.vehCtrlList &&
                this.capability["zhatu"].vehicleControl.vehCtrlList.length
            ) {
                this.vehCtrlList =
                    this.capability["zhatu"].vehicleControl.vehCtrlList;
                this.vehCtrlList.forEach((item) => {
                    item.label = this.getJsonLabel(
                        "zhatu_vehicleControl_vehCtrlList_ctrlType",
                        item.ctrlType
                    );
                    item.param = this.getJsonLabel(
                        "zhatu_vehicleControl_vehCtrlList_ctrlType_param",
                        item.ctrlType
                    );
                    item.ctrlStatusList = this.getEnumerationValue(
                        item.ctrlStatus,
                        "zhatu_vehicleControl_vehCtrlList_ctrlStatus"
                    );
                });
            }
        },
        formValidate() {
            return new Promise((resolve, reject) => {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        resolve();
                    } else {
                        reject();
                    }
                });
            });
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
/deep/ .validTime {
    .el-input__validateIcon {
        display: none !important;
    }
}
</style>
