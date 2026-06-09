<template>
    <div class="p-a-md">
        <h2
            id="title"
            v-if="
                form['IsApiRegisterInfo'] ||
                form['IsApiVehicleRecord'] ||
                form['IsApiDriverCard']
            "
        >
            基本信息
        </h2>
        <el-form ref="PublicVehicleInfo" label-position="top" :model="form">
            <el-row type="flex" justify="space-between">
                <el-col :span="7">
                    <el-form-item
                        style="padding-top: 5px"
                        label="车牌号"
                        class="m-r-md p-r"
                        v-if="form['IsApiRegisterInfo']"
                        :rules="{
                            validator: checkName.bind({
                                min: form['IsApiRegisterInfoCapability']
                                    .licenseNumberMin,
                                max: form['IsApiRegisterInfoCapability']
                                    .licenseNumberMax,
                            }),
                            trigger: 'blur',
                        }"
                        prop="IsApiRegisterInfo.licenseNumber"
                    >
                        <el-input
                            tips-placement="top-end"
                            :tips="`键入值长度范围为${form['IsApiRegisterInfoCapability'].licenseNumberMin}~${form['IsApiRegisterInfoCapability'].licenseNumberMax},一个中文字等于2个字符`"
                            v-model="form['IsApiRegisterInfo'].licenseNumber"
                        ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="7">
                    <el-form-item
                        style="padding-top: 5px"
                        label="车牌颜色"
                        class="m-r-md p-r"
                        v-if="form['IsApiRegisterInfo']"
                    >
                        <el-select
                            v-model="form['IsApiRegisterInfo'].licenseColor"
                        >
                            <el-option
                                v-for="item in licenseColors"
                                :key="item.value"
                                :value="item.value"
                                :label="item.label"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="7">
                    <el-form-item
                        class="m-r-md p-r"
                        v-if="form['IsApiVehicleRecord']"
                        prop="IsApiVehicleRecord.licenseTypeName"
                    >
                        <template #label>
                            车辆类型

                            <el-tooltip
                                class="item"
                                :content="msg"
                                placement="right-start"
                            >
                                <i class="el-icon-question"></i>
                            </el-tooltip>
                        </template>
                        <!--下拉框按钮-->
                        <el-select
                            v-model="form['IsApiVehicleRecord'].licenseTypeName"
                        >
                            <el-option
                                v-for="(item, index) in vehicleTypeList"
                                :key="index"
                                :label="item.name"
                                :value="item.value"
                            >
                            </el-option>
                            <div class="add-type">
                                <el-input v-model="addTypeVal"></el-input>
                                <div class="add-btn" @click="addType">
                                    +新增类型
                                </div>
                            </div>
                        </el-select>
                        <!-- <el-input v-model="form['IsApiVehicleRecord'].licenseTypeName"></el-input> -->
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row type="flex" justify="space-between">
                <el-col :span="7">
                    <el-form-item
                        label="车辆VIN号"
                        class="m-r-md p-r"
                        v-if="form['IsApiVehicleRecord']"
                        :rules="{
                            validator: checkName.bind({
                                min: form['IsApiVehicleRecordCapability']
                                    .vinNumMin,
                                max: form['IsApiVehicleRecordCapability']
                                    .vinNumMax,
                            }),
                            trigger: 'blur',
                        }"
                        prop="IsApiVehicleRecord.vinNum"
                    >
                        <el-input
                            tips-placement="top-end"
                            :tips="`键入值长度范围为${form['IsApiVehicleRecordCapability'].vinNumMin}~${form['IsApiVehicleRecordCapability'].vinNumMax},一个中文字等于2个字符`"
                            v-model="form['IsApiVehicleRecord'].vinNum"
                        ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="7">
                    <el-form-item
                        label="发动机号"
                        class="m-r-md p-r"
                        v-if="form['IsApiVehicleRecord']"
                        :rules="{
                            validator: checkName.bind({
                                min: form['IsApiVehicleRecordCapability']
                                    .engineNumMin,
                                max: form['IsApiVehicleRecordCapability']
                                    .engineNumMax,
                            }),
                            trigger: 'blur',
                        }"
                        prop="IsApiVehicleRecord.engineNum"
                    >
                        <el-input
                            tips-placement="top-end"
                            :tips="`键入值长度范围为${form['IsApiVehicleRecordCapability'].engineNumMin}~${form['IsApiVehicleRecordCapability'].engineNumMax},一个中文字等于2个字符`"
                            v-model="form['IsApiVehicleRecord'].engineNum"
                        ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="7">
                    <el-form-item
                        label="制造商ID"
                        class="m-r-md p-r"
                        v-if="form['IsApiRegisterInfo']"
                        :rules="{
                            validator: checkName.bind({
                                min: form['IsApiRegisterInfoCapability']
                                    .factoryIdMin,
                                max: form['IsApiRegisterInfoCapability']
                                    .factoryIdMax,
                            }),
                            trigger: 'blur',
                        }"
                        prop="IsApiRegisterInfo.factoryId"
                    >
                        <el-input
                            tips-placement="top-end"
                            :tips="`键入值长度范围为${form['IsApiRegisterInfoCapability'].factoryIdMin}~${form['IsApiRegisterInfoCapability'].factoryIdMax},一个中文字等于2个字符`"
                            v-model="form['IsApiRegisterInfo'].factoryId"
                        ></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row type="flex" justify="space-between">
                <el-col :span="7">
                    <el-form-item
                        label="省域ID"
                        class="m-r-md p-r"
                        v-if="form['IsApiRegisterInfo']"
                        :rules="{
                            validator: checkNumber.bind({
                                min: form['IsApiRegisterInfoCapability']
                                    .provinceIdMin,
                                max: form['IsApiRegisterInfoCapability']
                                    .provinceIdMax,
                            }),
                            trigger: 'blur',
                        }"
                        prop="IsApiRegisterInfo.provinceId"
                    >
                        <el-input
                            tips-placement="top-end"
                            :tips="`键入数值范围为${form['IsApiRegisterInfoCapability'].provinceIdMin}~${form['IsApiRegisterInfoCapability'].provinceIdMax}`"
                            v-model="form['IsApiRegisterInfo'].provinceId"
                        ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="7">
                    <el-form-item
                        label="市域ID"
                        class="m-r-md p-r"
                        v-if="form['IsApiRegisterInfo']"
                        :rules="{
                            validator: checkNumber.bind({
                                min: form['IsApiRegisterInfoCapability']
                                    .cityIdMin,
                                max: form['IsApiRegisterInfoCapability']
                                    .cityIdMax,
                            }),
                            trigger: 'blur',
                        }"
                        prop="IsApiRegisterInfo.cityId"
                    >
                        <el-input
                            tips-placement="top-end"
                            :tips="`键入数值范围为${form['IsApiRegisterInfoCapability'].cityIdMin}~${form['IsApiRegisterInfoCapability'].cityIdMax}`"
                            v-model="form['IsApiRegisterInfo'].cityId"
                        ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="7" v-if="form['IsApiVehicleRecord']">
                    <el-form-item
                        label="车辆初始里程"
                        class="m-r-md p-r"
                        :rules="{
                            validator: checkNumber.bind({
                                min: form['IsApiVehicleRecordCapability']
                                    .mileageInitMin,
                                max: form['IsApiVehicleRecordCapability']
                                    .mileageInitMax,
                            }),
                            trigger: 'blur',
                        }"
                        prop="IsApiVehicleRecord.mileageInit"
                    >
                        <el-input
                            tips-placement="top-end"
                            :tips="`键入数值范围为${form['IsApiVehicleRecordCapability'].mileageInitMin}~${form['IsApiVehicleRecordCapability'].mileageInitMax}`"
                            v-model="form['IsApiVehicleRecord'].mileageInit"
                        >
                            <span slot="suffix">km</span>
                        </el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row type="flex" justify="space-between">
                <el-col :span="7" v-if="form['IsApiVehicleRecord']">
                    <el-form-item
                        label="车辆累计里程"
                        class="m-r-md p-r"
                        :rules="{
                            validator: checkNumber.bind({
                                min: form['IsApiVehicleRecordCapability']
                                    .mileageTotalMin,
                                max: form['IsApiVehicleRecordCapability']
                                    .mileageTotalMax,
                            }),
                            trigger: 'blur',
                        }"
                        prop="IsApiVehicleRecord.mileageTotal"
                    >
                        <el-input
                            tips-placement="top-end"
                            :tips="`键入数值范围为${form['IsApiVehicleRecordCapability'].mileageTotalMin}~${form['IsApiVehicleRecordCapability'].mileageTotalMax}`"
                            v-model="form['IsApiVehicleRecord'].mileageTotal"
                        >
                            <span slot="suffix">km</span>
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="7">
                    <el-form-item
                        label="脉冲系数校准模式"
                        class="m-r-md p-r"
                        v-if="form['IsApiVehicleRecord']"
                    >
                        <el-select
                            v-model="
                                form['IsApiVehicleRecord'].correctFactorMode
                            "
                        >
                            <el-option label="自动" value="auto"></el-option>
                            <el-option label="手动" value="manual"></el-option>
                            <el-option
                                label="未启用"
                                value="disable"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="7" v-if="form['IsApiVehicleRecord']">
                    <el-form-item
                        style="padding-top: 4px"
                        label="脉冲系数"
                        class="m-r-md p-r"
                        :rules="{
                            validator: checkNumber.bind({
                                min: form['IsApiVehicleRecordCapability']
                                    .pulseFactorMin,
                                max: form['IsApiVehicleRecordCapability']
                                    .pulseFactorMax,
                            }),
                            trigger: 'blur',
                        }"
                        prop="IsApiVehicleRecord.pulseFactor"
                    >
                        <el-input
                            tips-placement="top-end"
                            :tips="`键入数值范围为${form['IsApiVehicleRecordCapability'].pulseFactorMin}~${form['IsApiVehicleRecordCapability'].pulseFactorMax}`"
                            v-model="form['IsApiVehicleRecord'].pulseFactor"
                        ></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row type="flex" justify="space-between">
                <el-col :span="7">
                    <el-form-item
                        label="MCU的脉冲占空比"
                        class="m-r-md p-r"
                        v-if="form['IsApiVehicleRecord']"
                    >
                        <el-select
                            v-model="form['IsApiVehicleRecord'].dutyRadio"
                        >
                            <el-option label="5% - 95%" :value="0"></el-option>
                            <el-option label="15% - 85%" :value="1"></el-option>
                            <el-option label="25% - 75%" :value="2"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="7">
                    <el-form-item
                        label="终端型号"
                        class="m-r-md p-r"
                        :rules="
                            form['IsApiRegisterInfoCapability'].terminalTypeMax
                                ? {
                                      validator: checkName.bind({
                                          min: form[
                                              'IsApiRegisterInfoCapability'
                                          ].terminalTypeMin,
                                          max: form[
                                              'IsApiRegisterInfoCapability'
                                          ].terminalTypeMax,
                                      }),
                                      trigger: 'blur',
                                  }
                                : {}
                        "
                        prop="IsApiRegisterInfo.terminalType"
                    >
                        <el-input
                            tips-placement="top-end"
                            :tips="
                                form['IsApiRegisterInfoCapability']
                                    .terminalTypeMax
                                    ? `键入值长度范围为${form['IsApiRegisterInfoCapability'].terminalTypeMin}~${form['IsApiRegisterInfoCapability'].terminalTypeMax},一个中文字等于2个字符`
                                    : ''
                            "
                            v-model="form['IsApiRegisterInfo'].terminalType"
                        ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="7"></el-col>
            </el-row>
            <h2 class="m-t-lg" v-if="form['IsApiDriverCard']">IC卡写卡</h2>
            <template v-if="form['IsApiDriverCard']">
                <el-row type="flex" justify="space-between">
                    <el-col :span="7">
                        <el-form-item
                            label="驾驶员姓名"
                            class="m-r-md p-r"
                            :rules="{
                                validator: checkName.bind({
                                    min: form['IsApiDriverCardCapability']
                                        .driverNameMin,
                                    max: form['IsApiDriverCardCapability']
                                        .driverNameMax,
                                }),
                                trigger: 'blur',
                            }"
                            prop="IsApiDriverCard.driverName"
                        >
                            <el-input
                                tips-placement="top-end"
                                :tips="`键入值长度范围为${form['IsApiDriverCardCapability'].driverNameMin}~${form['IsApiDriverCardCapability'].driverNameMax},一个中文字等于2个字符`"
                                v-model="form['IsApiDriverCard'].driverName"
                            ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7">
                        <el-form-item
                            label="驾驶证号码"
                            class="m-r-md p-r"
                            :rules="{
                                validator: validQualCert,
                                trigger: 'blur',
                            }"
                            prop="IsApiDriverCard.driverNo"
                        >
                            <el-input
                                tips-placement="top-end"
                                v-model="form['IsApiDriverCard'].driverNo"
                            ></el-input>
                        </el-form-item>

                        <!-- <el-form-item
                            label="驾驶证号码"
                            class="m-r-md p-r"
                            :rules="{
                                validator: checkName.bind({
                                    min: form['IsApiDriverCardCapability']
                                        .driverNoMin,
                                    max: form['IsApiDriverCardCapability']
                                        .driverNoMax,
                                }),
                                trigger: 'blur',
                            }"
                            prop="IsApiDriverCard.driverNo"
                        >
                            <el-input
                                tips-placement="top-end"
                                :tips="`键入值长度范围为${form['IsApiDriverCardCapability'].driverNoMin}~${form['IsApiDriverCardCapability'].driverNoMax},一个中文字等于2个字符`"
                                v-model="form['IsApiDriverCard'].driverNo"
                            ></el-input>
                        </el-form-item> -->
                    </el-col>
                    <el-col :span="7">
                        <el-form-item
                            label="从业资格证号"
                            class="m-r-md p-r"
                            :rules="{
                                validator: validQualCert,
                                trigger: 'blur',
                            }"
                            prop="IsApiDriverCard.qualificationNo"
                        >
                            <el-input
                                tips-placement="top-end"
                                v-model="
                                    form['IsApiDriverCard'].qualificationNo
                                "
                            ></el-input>
                        </el-form-item>
                        <!-- <el-form-item
                            label="从业资格证号"
                            class="m-r-md p-r"
                            :rules="{
                                validator: checkName.bind({
                                    min: form['IsApiDriverCardCapability']
                                        .qualificationNoMin,
                                    max: form['IsApiDriverCardCapability']
                                        .qualificationNoMax,
                                }),
                                trigger: 'blur',
                            }"
                            prop="IsApiDriverCard.qualificationNo"
                        >
                            <el-input
                                tips-placement="top-end"
                                :tips="`键入值长度范围为${form['IsApiDriverCardCapability'].qualificationNoMin}~${form['IsApiDriverCardCapability'].qualificationNoMax},一个中文字等于2个字符`"
                                v-model="
                                    form['IsApiDriverCard'].qualificationNo
                                "
                            ></el-input>
                        </el-form-item> -->
                    </el-col>
                </el-row>
                <el-row type="flex" justify="space-between">
                    <el-col :span="7">
                        <el-form-item
                            label="IC卡发证机构"
                            class="m-r-md p-r"
                            :rules="{
                                validator: checkName.bind({
                                    min: form['IsApiDriverCardCapability']
                                        .certificateOrgMin,
                                    max: form['IsApiDriverCardCapability']
                                        .certificateOrgMax,
                                }),
                                trigger: 'blur',
                            }"
                            prop="IsApiDriverCard.certificateOrg"
                        >
                            <el-input
                                tips-placement="top-end"
                                :tips="`键入值长度范围为${form['IsApiDriverCardCapability'].certificateOrgMin}~${form['IsApiDriverCardCapability'].certificateOrgMax},一个中文字等于2个字符`"
                                v-model="form['IsApiDriverCard'].certificateOrg"
                            ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7">
                        <el-form-item
                            label="IC卡有效期"
                            class="m-r-md p-r"
                            :rules="{
                                required: true,
                                message: 'IC卡有效期不能为空',
                                trigger: 'change',
                            }"
                            prop="IsApiDriverCard.validDate"
                        >
                            <el-date-picker
                                v-model="form['IsApiDriverCard'].validDate"
                                type="date"
                                placeholder="请选择日期"
                                format="yyyy-MM-dd"
                                value-format="yyyy-MM-dd"
                                :picker-options="pickerOptions"
                            />
                        </el-form-item>
                        <!-- <el-form-item
                            label="IC卡有效期"
                            class="m-r-md p-r"
                            :rules="{
                                required: true,
                                message: 'IC卡有效期不能为空',
                                trigger: 'change',
                            }"
                            prop="IsApiDriverCard.validDate"
                        >
                            <el-date-picker
                                v-model="form['IsApiDriverCard'].validDate"
                                type="date"
                                placeholder="请选择日期"
                                format="yyyy-MM-dd"
                                value-format="yyyy-MM-dd"
                            />
                        </el-form-item> -->
                    </el-col>
                    <el-col :span="7"> </el-col>
                </el-row>
            </template>
        </el-form>
        <!--<el-form ref="form" label-position="top" :model="form">
          <el-row type="flex" justify="space-between">
              <el-col :span="7">
                <el-form-item label="车牌号" class="m-r-md p-r">
                    <el-input v-model="form.engineNumber"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item class="m-r-md p-r">
                    <template #tips>
                        车辆类型
                        <el-tooltip
                            class="item"
                            :content="msg"
                            placement="right-start"
                        >
                            <i class="el-icon-question"></i>
                        </el-tooltip>
                    </template>-->
        <!--下拉框按钮-->
        <!--<el-select v-model="form.vehicleType">
                      <el-option
                            v-for="item in vehicleTypeList"
                            :key="item"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                          <div class="add-type">
                            <el-input v-model="addTypeVal"></el-input>
                            <div class="add-btn" @click="addType">+新增类型</div>
                          </div>
                      </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label="车辆VIN号" class="m-r-md p-r">
                      <el-input v-model="form.vehicleVINNumber"></el-input>
                  </el-form-item>
              </el-col>
          </el-row>

          <el-row type="flex" justify="space-between">
              <el-col :span="7">
                <el-form-item label="发动机号" class="m-r-md p-r">
                    <el-input v-model="form.engineNumber"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label="制造商ID" class="m-r-md p-r">
                    <el-input v-model="form.manufacturerID"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label="车辆初始里程" class="m-r-md p-r">
                    <el-input v-model="form.vehicleVINNumber">
                        <span slot="suffix">km</span>
                    </el-input>
                </el-form-item>
              </el-col>
          </el-row>

          <el-row type="flex" justify="space-between">
              <el-col :span="7">
                 <el-form-item label="车辆累计里程" class="m-r-md p-r">
                    <el-input v-model="form.engineNumber">
                        <span slot="suffix">km</span>
                    </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item class="m-r-md p-r">
                    <template #tips>
                        脉冲系数校准模式
                    </template>
                    <el-select v-model="form.vehicleType"></el-select>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label="脉冲系数" class="m-r-md p-r">
                    <el-input v-model="form.vehicleVINNumber"></el-input>
                </el-form-item>
              </el-col>
          </el-row>

          <el-row type="flex" justify="space-between">
              <el-col :span="7">
                <el-form-item label="MCU的脉冲占空比" class="m-r-md p-r">
                    <el-input v-model="form.engineNumber">
                        <span slot="suffix">%</span>
                    </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="7">
               
              </el-col>
              <el-col :span="7">
               
              </el-col>
          </el-row>

        <h2 class="m-t-lg">IC卡写卡</h2>
        <el-row type="flex" justify="space-between">
              <el-col :span="7">
                <el-form-item label="驾驶员姓名" class="m-r-md p-r">
                    <el-input v-model="form.driverLicenseNumber"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="7">
               <el-form-item label="驾驶证号码" class="m-r-md p-r">
                    <el-input v-model="form.driverLicenseNumber"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label="从业资格证号" class="m-r-md p-r">
                    <el-input v-model="form.certificateNo"></el-input>
                </el-form-item>
              </el-col>
          </el-row>
          <el-row type="flex" justify="space-between">
              <el-col :span="7">
                <el-form-item label="IC卡发证机构" class="m-r-md p-r">
                    <el-input v-model="form.driverLicenseNumber"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="7">
               <el-form-item label="IC卡有效期" class="m-r-md p-r">
                    <el-input v-model="form.driverLicenseNumber"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="7">
               
              </el-col>
          </el-row>
    </el-form>-->
    </div>
</template>

<script>
import { validateNum } from "@/utils/validate";
export default {
    name: "vehicleInfo",
    props: {
        isTemplate: {
            type: String,
        },
        detail: {
            type: Object,
            default: () => ({}),
        },

        configParams: {
            type: Boolean,
            default: false,
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
    },
    watch: {
        detail: {
            handler(newVal, oldVal) {
                this.form = newVal;
            },
            deep: true,
            immediate: true,
        },
        formDetail: {
            handler(newVal, oldVal) {
                console.log(newVal);
                this.formData = newVal;
            },
            deep: true,
            immediate: true,
        },
        configParams: {
            handler(val) {
                if (
                    !val &&
                    !this.form["IsApiVehicleRecord"] &&
                    this.form["IsApiVehicleRecord"] != "{}" &&
                    !this.form["IsApiRegisterInfo"] &&
                    this.form["IsApiRegisterInfo"] != "{}"
                ) {
                    this.getDeviceConfigParamsByIsApi();
                } else {
                    this.getLicenseColors(
                        this.form["IsApiRegisterInfoCapability"][
                            "licenseColorOptions"
                        ]
                    );
                }
                if (
                    !val &&
                    !this.form["IsApiDriverCard"] &&
                    this.form["IsApiDriverCard"] != "{}"
                ) {
                    this.getDeviceConfigParamsByIsApiCard();
                }
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
        form: {
            handler(val) {
                if (JSON.stringify(val) !== "{}") {
                    this.$emit("change", val);
                }
            },
            deep: true,
            immediate: true,
        },
        copyForm: {
            handler(val) {
                if (JSON.stringify(val) !== "{}") {
                    this.$emit("changeCopy", val);
                }
            },
            deep: true,
            immediate: false,
        },
        "form.IsApiRegisterInfo": {
            handler(val) {
                if (val != undefined) {
                    this.$refs["PublicVehicleInfo"].validate((valid) => {
                        if (valid) {
                            this.watchValite();
                        } else {
                            this.resetValite();
                        }
                    });
                }
            },
            deep: true,
            immediate: false,
        },
        "form.IsApiVehicleRecord": {
            handler(val) {
                if (val != undefined) {
                    this.$refs["PublicVehicleInfo"].validate((valid) => {
                        if (valid) {
                            this.watchValite();
                        } else {
                            this.resetValite();
                        }
                    });
                }
            },
            deep: true,
            immediate: false,
        },
        "form.IsApiDriverCard": {
            handler(val) {
                if (val != undefined) {
                    this.$refs["PublicVehicleInfo"].validate((valid) => {
                        if (valid) {
                            this.watchValite();
                        } else {
                            this.resetValite();
                        }
                    });
                }
            },
            deep: true,
            immediate: false,
        },
    },
    data() {
        return {
            validQualCert: function (rule, value, callback) {
                const title = /^[\a-\z\A-\Z0-9]+$/;
                if (value !== "" && value !== null && value !== undefined) {
                    if (value.length !== 18) {
                        callback(new Error(`请输入18位正确的号码`));
                    } else if (!title.test(value)) {
                        callback(new Error(`只能输入数字和英文`));
                    } else {
                        callback();
                    }
                } else {
                    // callback(new Error("请输入"));
                    callback();
                }
            },
            pickerOptions: {
                disabledDate(time) {
                    // 这个是当前日期后的日期不可选
                    return time.getTime() < Date.now();
                },
            },
            checkNumber(rule, value, callback) {
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
            checkName(rule, value, callback) {
                let len = 0;
                for (let i = 0; i < value.length; i++) {
                    const c = value.charCodeAt(i);
                    if (
                        (c >= 0x0001 && c <= 0x007e) ||
                        (c >= 0xff60 && c <= 0xff9f)
                    ) {
                        len++;
                    } else {
                        len += 2;
                    }
                }
                if ((len < this.min && len > 0) || len > this.max) {
                    callback(
                        new Error(
                            "长度为" +
                                this.min +
                                "~" +
                                this.max +
                                "一个中文字等于2个字符"
                        )
                    );
                } else {
                    callback();
                }
            },

            addTypeVal: "",
            correctFactorModes: {
                auto: "自动",
                manual: "手动",
                disable: "未启用",
            },
            dutyRadios: ["5% - 95%", "15% - 85%", "25% - 75%"],
            vehicleTypeList: [
                {
                    value: "出租车",
                    name: "出租车",
                },
                {
                    value: "校车",
                    name: "校车",
                },
                {
                    value: "小型客车",
                    name: "小型客车",
                },
                {
                    value: "中型客车",
                    name: "中型客车",
                },
                {
                    value: "大型客车",
                    name: "大型客车",
                },
                {
                    value: "小型货车",
                    name: "小型货车",
                },
                {
                    value: "中型货车",
                    name: "中型货车",
                },
                {
                    value: "大型货车",
                    name: "大型货车",
                },
                {
                    value: "小型挂车",
                    name: "小型挂车",
                },
                {
                    value: "中型挂车",
                    name: "中型挂车",
                },
                {
                    value: "大型挂车",
                    name: "大型挂车",
                },
                {
                    value: "危险品运输车",
                    name: "危险品运输车",
                },
                {
                    value: "渣土车",
                    name: "渣土车",
                },
                {
                    value: "泥罐车",
                    name: "泥罐车",
                },
                {
                    value: "其他",
                    name: "其他",
                },
                {
                    value: "自定义",
                    name: "自定义",
                },
            ],
            licenseColors: [],
            licenseColorJson: {},
            msg: `
          大型车辆：10人以上的载客车辆，或者总质量大于或等于4500KG的载货车辆，或者总质量大于或等于4500KG的专业作业车。
          小型车辆：9人或以下的载客车辆，或者总质量小于4500KG的载货车辆，或者总质量小于4500KG的专业作业车。
          挂车：设计和制造上需由汽车或拖拉机牵引，才能在道路上正常使用的无动力道路车辆，用于：载运货物，特殊用途。
          客车：设计制造用于客运的车辆，不限制载客人数，非国标定义的车牌类型，根据项目实际情况进行使用。
          危险品车：一种货箱顶部不封闭，排气管前置并装有防火花装置，运送石油化工品、炸药、鞭炮等危险品的专用车辆。
          货车：设计制造用于货物运输的载货车辆。
          重型箱式货车：载货重量大于等于12000kg，且带密闭集装箱的货车类型。
          校车：用于接送学生，7座或者7座以上的载客汽车
          特种工程车：具有专用设备或器具，在设计和制造上用于专项作业的汽车，例如汽车起重机，消防车，清障车，高空作业车等，但不包括以载运人员或者货物为主要目的的车辆。`,
            form: {},
            copyForm: {},
            formData: {},
            // rules: {
            //   'IsApiVehicleRecord.mileageInit': [ { validator: checkNumber.bind({type:'int',min:0,max:10000000}), trigger: 'blur' }],
            //   'IsApiVehicleRecord.mileageTotal': [ { validator: checkNumber.bind({type:'int',min:0,max:10000000}), trigger: 'blur' }],
            //   'IsApiVehicleRecord.pulseFactor': [ { validator: checkNumber.bind({type:'int',min:0,max:65535}), trigger: 'blur' }],
            //   'IsApiVehicleRecord.licenseTypeName':[{ required: true,message: '车辆类型不能为空', trigger: 'blur'}]
            // }
        };
    },
    methods: {
        // getVehiclePlateType() {
        //   this.$api.getVehiclePlateType().then((res) => {
        //     if (res.success == true) {
        //       this.vehicleTypeList=res.data
        //     } else {
        //       this.$message.error('获取车辆类型失败:' + res.msg)
        //     }
        //   })
        // },
        //配置参数校验不通过，重置配置项
        resetValite() {
            if (this.form["IsApiRegisterInfo"]) {
                this.formData["IsApiRegisterInfo.licenseNumber"] = "";
                this.formData["IsApiRegisterInfo.licenseColor"] = "";
                this.formData["IsApiRegisterInfo.factoryId"] = "";
                this.formData["IsApiRegisterInfo.provinceId"] = "";
                this.formData["IsApiRegisterInfo.cityId"] = "";
            }
            if (this.form["IsApiVehicleRecord"]) {
                this.formData["IsApiVehicleRecord.licenseTypeName"] = "";
                this.formData["IsApiVehicleRecord.vinNum"] = "";
                this.formData["IsApiVehicleRecord.engineNum"] = "";
                this.formData["IsApiVehicleRecord.mileageInit"] = "";
                this.formData["IsApiVehicleRecord.mileageTotal"] = "";
                this.formData["IsApiVehicleRecord.correctFactorMode"] = "";
                this.formData["IsApiVehicleRecord.pulseFactor"] = "";
                this.formData["IsApiVehicleRecord.dutyRadio"] = "";
            }
            if (this.form["IsApiDriverCard"]) {
                this.formData["IsApiDriverCard.driverName"] = "";
                this.formData["IsApiDriverCard.driverNo"] = "";
                this.formData["IsApiDriverCard.qualificationNo"] = "";
                this.formData["IsApiDriverCard.certificateOrg"] = "";
                this.formData["IsApiDriverCard.validDate"] = "";
            }
            this.$emit("changeData", this.formData);
        },
        //监听参数变化并校验参数
        watchValite() {
            if (this.form["IsApiRegisterInfo"]) {
                this.formData["IsApiRegisterInfo.licenseNumber"] =
                    this.form["IsApiRegisterInfo"]["licenseNumber"] !=
                    this.copyForm["IsApiRegisterInfo"]["licenseNumber"]
                        ? `IsApiRegisterInfo.licenseNumber&车辆信息/车牌号&${this.form["IsApiRegisterInfo"]["licenseNumber"]}`
                        : "";
                this.formData["IsApiRegisterInfo.licenseColor"] =
                    this.form["IsApiRegisterInfo"]["licenseColor"] !==
                    this.copyForm["IsApiRegisterInfo"]["licenseColor"]
                        ? `IsApiRegisterInfo.licenseColor&车辆信息/车牌颜色&${
                              this.licenseColorJson[
                                  this.form["IsApiRegisterInfo"]["licenseColor"]
                              ]
                          }`
                        : "";
                this.formData["IsApiRegisterInfo.factoryId"] =
                    this.form["IsApiRegisterInfo"]["factoryId"] !=
                    this.copyForm["IsApiRegisterInfo"]["factoryId"]
                        ? `IsApiRegisterInfo.factoryId&车辆信息/制造商ID&${this.form["IsApiRegisterInfo"]["factoryId"]}`
                        : "";
                this.formData["IsApiRegisterInfo.provinceId"] =
                    this.form["IsApiRegisterInfo"]["provinceId"] !=
                    this.copyForm["IsApiRegisterInfo"]["provinceId"]
                        ? `IsApiRegisterInfo.provinceId&车辆信息/省域ID&${this.form["IsApiRegisterInfo"]["provinceId"]}`
                        : "";
                this.formData["IsApiRegisterInfo.cityId"] =
                    this.form["IsApiRegisterInfo"]["cityId"] !=
                    this.copyForm["IsApiRegisterInfo"]["cityId"]
                        ? `IsApiRegisterInfo.provinceId&车辆信息/市域ID&${this.form["IsApiRegisterInfo"]["cityId"]}`
                        : "";
                this.formData["IsApiRegisterInfo.terminalType"] =
                    this.form["IsApiRegisterInfo"]["terminalType"] !=
                    this.copyForm["IsApiRegisterInfo"]["terminalType"]
                        ? `IsApiRegisterInfo.terminalType&车辆信息/终端型号&${this.form["IsApiRegisterInfo"]["terminalType"]}`
                        : "";
            }
            if (this.form["IsApiVehicleRecord"]) {
                this.formData["IsApiVehicleRecord.licenseTypeName"] =
                    this.form["IsApiVehicleRecord"]["licenseTypeName"] !=
                    this.copyForm["IsApiVehicleRecord"]["licenseTypeName"]
                        ? `IsApiVehicleRecord.licenseTypeName&车辆信息/车辆类型&${this.form["IsApiVehicleRecord"]["licenseTypeName"]}`
                        : "";
                this.formData["IsApiVehicleRecord.vinNum"] =
                    this.form["IsApiVehicleRecord"]["vinNum"] !=
                    this.copyForm["IsApiVehicleRecord"]["vinNum"]
                        ? `IsApiVehicleRecord.vinNum&车辆信息/车辆VIN号&${this.form["IsApiVehicleRecord"]["vinNum"]}`
                        : "";
                this.formData["IsApiVehicleRecord.engineNum"] =
                    this.form["IsApiVehicleRecord"]["engineNum"] !=
                    this.copyForm["IsApiVehicleRecord"]["engineNum"]
                        ? `IsApiVehicleRecord.engineNum&车辆信息/发动机号&${this.form["IsApiVehicleRecord"]["engineNum"]}`
                        : "";
                this.formData["IsApiVehicleRecord.mileageInit"] =
                    this.form["IsApiVehicleRecord"]["mileageInit"] !=
                    this.copyForm["IsApiVehicleRecord"]["mileageInit"]
                        ? `IsApiVehicleRecord.mileageInit&车辆信息/车辆初始里程&${this.form["IsApiVehicleRecord"]["mileageInit"]}`
                        : "";
                this.formData["IsApiVehicleRecord.mileageTotal"] =
                    this.form["IsApiVehicleRecord"]["mileageTotal"] !=
                    this.copyForm["IsApiVehicleRecord"]["mileageTotal"]
                        ? `IsApiVehicleRecord.mileageTotal&车辆信息/车辆累计里程&${this.form["IsApiVehicleRecord"]["mileageTotal"]}`
                        : "";
                this.formData["IsApiVehicleRecord.correctFactorMode"] =
                    this.form["IsApiVehicleRecord"]["correctFactorMode"] !=
                    this.copyForm["IsApiVehicleRecord"]["correctFactorMode"]
                        ? `IsApiVehicleRecord.correctFactorMode&车辆信息/脉冲系数校准模式&${
                              this.correctFactorModes[
                                  this.form["IsApiVehicleRecord"][
                                      "correctFactorMode"
                                  ]
                              ]
                          }`
                        : "";
                this.formData["IsApiVehicleRecord.pulseFactor"] =
                    this.form["IsApiVehicleRecord"]["pulseFactor"] !=
                    this.copyForm["IsApiVehicleRecord"]["pulseFactor"]
                        ? `IsApiVehicleRecord.pulseFactor&车辆信息/脉冲系数&${this.form["IsApiVehicleRecord"]["pulseFactor"]}`
                        : "";
                this.formData["IsApiVehicleRecord.dutyRadio"] =
                    this.form["IsApiVehicleRecord"]["dutyRadio"] !=
                    this.copyForm["IsApiVehicleRecord"]["dutyRadio"]
                        ? `IsApiVehicleRecord.dutyRadio&车辆信息/MCU的脉冲占空比&${
                              this.dutyRadios[
                                  this.form["IsApiVehicleRecord"]["dutyRadio"]
                              ]
                          }`
                        : "";
            }
            if (this.form["IsApiDriverCard"]) {
                this.formData["IsApiDriverCard.driverName"] =
                    this.form["IsApiDriverCard"]["driverName"] !=
                    this.copyForm["IsApiDriverCard"]["driverName"]
                        ? `IsApiDriverCard.driverName&车辆信息/驾驶员姓名&${this.form["IsApiDriverCard"]["driverName"]}`
                        : "";
                this.formData["IsApiDriverCard.driverNo"] =
                    this.form["IsApiDriverCard"]["driverNo"] !=
                    this.copyForm["IsApiDriverCard"]["driverNo"]
                        ? `IsApiDriverCard.driverNo&车辆信息/驾驶证号码&${this.form["IsApiDriverCard"]["driverNo"]}`
                        : "";
                this.formData["IsApiDriverCard.qualificationNo"] =
                    this.form["IsApiDriverCard"]["qualificationNo"] !=
                    this.copyForm["IsApiDriverCard"]["qualificationNo"]
                        ? `IsApiDriverCard.qualificationNo&车辆信息/从业资格证号&${this.form["IsApiDriverCard"]["qualificationNo"]}`
                        : "";
                this.formData["IsApiDriverCard.certificateOrg"] =
                    this.form["IsApiDriverCard"]["certificateOrg"] !=
                    this.copyForm["IsApiDriverCard"]["certificateOrg"]
                        ? `IsApiDriverCard.certificateOrg&车辆信息/IC卡发证机构&${this.form["IsApiDriverCard"]["certificateOrg"]}`
                        : "";
                this.formData["IsApiDriverCard.validDate"] =
                    this.form["IsApiDriverCard"]["validDate"] !=
                    this.copyForm["IsApiDriverCard"]["validDate"]
                        ? `IsApiDriverCard.validDate&车辆信息/IC卡有效期&${this.form["IsApiDriverCard"]["validDate"]}`
                        : "";
            }
            this.$emit("changeData", this.formData);
        },
        addType() {
            for (let i = 0; i < this.vehicleTypeList.length; i++) {
                if (this.vehicleTypeList[i].value === this.addTypeVal) {
                    this.$message.info(
                        `“${this.addTypeVal}”已存在列表内，可直接选用！`
                    );
                    return;
                }
            }
            if (/\s+/g.test(this.addTypeVal)) {
                this.$message.info("请勿输入空格");
                return;
            }
            if (this.addTypeVal != "") {
                this.vehicleTypeList.push({
                    label: this.addTypeVal,
                    value: this.addTypeVal,
                });
            }
            this.addTypeVal = "";
        },
        getDeviceConfigParamsByIsApiCard() {
            if (this.isTemplate == "true") return;
            const params = {
                deviceId: this.$route.query.deviceId || null,
                commandIds: ["IsApiDriverCard"],
            };
            this.$api.getDeviceConfigParamsByIsApi(params).then((res) => {
                if (
                    res.success == true &&
                    !JSON.parse(res.data)["IsApiDriverCard"]["statusCode"]
                ) {
                    this.form = Object.assign(
                        {},
                        this.form,
                        JSON.parse(res.data)
                    );
                    this.copyForm = Object.assign(
                        {},
                        this.copyForm,
                        JSON.parse(res.data)
                    );
                } else {
                    this.$message.error("获取设备配置参数失败:" + res.msg);
                }
            });
        },
        getDeviceConfigParamsByIsApi() {
            if (this.isTemplate == "true") {
                this.getLicenseColors(
                    this.form["IsApiRegisterInfoCapability"][
                        "licenseColorOptions"
                    ]
                );
                return;
            }
            const params = {
                deviceId: this.$route.query.deviceId || null,
                commandIds: ["IsApiRegisterInfo", "IsApiVehicleRecord"],
            };
            this.$api.getDeviceConfigParamsByIsApi(params).then((res) => {
                if (
                    res.success == true &&
                    !JSON.parse(res.data)["IsApiRegisterInfo"]["statusCode"]
                ) {
                    let sameBol = false;
                    for (let i = 0; i < this.vehicleTypeList.length; i++) {
                        if (
                            this.vehicleTypeList[i].value ==
                            JSON.parse(res.data).IsApiVehicleRecord
                                .licenseTypeName
                        ) {
                            sameBol = true;
                        }
                    }
                    if (
                        !sameBol &&
                        JSON.parse(res.data)["IsApiVehicleRecord"]
                            .licenseTypeName != ""
                    ) {
                        this.vehicleTypeList.push({
                            value: JSON.parse(res.data)["IsApiVehicleRecord"]
                                .licenseTypeName,
                            name: JSON.parse(res.data)["IsApiVehicleRecord"]
                                .licenseTypeName,
                        });
                    }
                    this.form = Object.assign(
                        {},
                        this.form,
                        JSON.parse(res.data)
                    );
                    this.getLicenseColors(
                        this.form["IsApiRegisterInfoCapability"][
                            "licenseColorOptions"
                        ]
                    );
                    this.copyForm = Object.assign(
                        {},
                        this.copyForm,
                        JSON.parse(res.data)
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
        getLicenseColors(licenseColorOptions) {
            this.licenseColors = [];
            this.licenseColorJson = {};
            if (licenseColorOptions.length) {
                licenseColorOptions.forEach((item) => {
                    switch (item) {
                        case "vin":
                            this.licenseColors.push({
                                label: "葡萄色",
                                value: item,
                            });
                            this.licenseColorJson[item] = "葡萄色";
                            break;
                        case "blue":
                            this.licenseColors.push({
                                label: "蓝色",
                                value: item,
                            });
                            this.licenseColorJson[item] = "蓝色";
                            break;
                        case "yellow":
                            this.licenseColors.push({
                                label: "黄色",
                                value: item,
                            });
                            this.licenseColorJson[item] = "黄色";
                            break;
                        case "black":
                            this.licenseColors.push({
                                label: "黑色",
                                value: item,
                            });
                            this.licenseColorJson[item] = "黑色";
                            break;
                        case "white":
                            this.licenseColors.push({
                                label: "白色",
                                value: item,
                            });
                            this.licenseColorJson[item] = "白色";
                            break;
                        case "deepYellow":
                            this.licenseColors.push({
                                label: "深黄色",
                                value: item,
                            });
                            this.licenseColorJson[item] = "深黄色";
                            break;
                        case "deepGreen":
                            this.licenseColors.push({
                                label: "深绿色",
                                value: item,
                            });
                            this.licenseColorJson[item] = "深绿色";
                            break;
                        case "yellowGreen":
                            this.licenseColors.push({
                                label: "黄绿色",
                                value: item,
                            });
                            this.licenseColorJson[item] = "黄绿色";
                            break;
                        case "gradualGreen":
                            this.licenseColors.push({
                                label: "渐变绿色",
                                value: item,
                            });
                            this.licenseColorJson[item] = "渐变绿色";
                            break;
                        case "other":
                            this.licenseColors.push({
                                label: "其他色",
                                value: item,
                            });
                            this.licenseColorJson[item] = "其他色";
                            break;
                    }
                });
            } else {
            }
        },
    },
    created() {
        // this.getDeviceConfigParamsByIsApi()
    },
    mounted() {
        // this.getVehiclePlateType()
    },
};
</script>

<style lang="less" scoped>
.question {
    position: absolute;
    top: 4%;
    left: 85%;
    font-size: 20px;
}
.add-type {
    display: flex;
    padding: 8px;
    border-top: 1px solid #b3b3b3;
    .add-btn {
        color: #4886ff;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        width: 100px;
        margin-left: 8px;
    }
}
</style>
