<template>
    <div class="device-setting">
        <div class="container">
            <div class="bulk-import" v-if="settingParam.configType === 3">
                <p>
                    <!-- 待配置车辆 -->
                    <span>{{ $t("deviceManage.deviceSettingTest1") }}： </span
                    ><el-button
                        @click="doBulkImport(false)"
                        :loading="importLoading"
                    >
                        <i class="el-icon-refresh_sm"></i>
                        <!-- 检查内容 -->
                        {{ $t("deviceManage.deviceSettingTest2") }}
                    </el-button>
                </p>
                <div>
                    <el-select
                        v-model="bulkImportForm.plateNum"
                        :placeholder="$t('deviceManage.deviceSettingTest3')"
                        remote
                        :remote-method="remoteMethod2"
                        filterable
                        clearable
                        v-selectLoadMore="selectLoadMore"
                        @visible-change="visibleHandler"
                        @change="selectCar"
                    >
                        <el-option
                            v-for="item in bulkImportForm.plateArr"
                            :key="item.id"
                            :value="item.plateNum"
                            :label="item.plateNum"
                        ></el-option>
                    </el-select>
                    <el-input
                        type="textarea"
                        :rows="6"
                        :spellcheck="false"
                        :placeholder="$t('deviceManage.deviceSettingTest4')"
                        v-model="bulkImportForm.textarea"
                        @blur="plateNumBlur"
                    >
                    </el-input>
                </div>
            </div>
            <el-radio-group v-model="form.settingType" class="m-y">
                <el-radio :label="1">
                    <!-- 平台配置 -->
                    {{ $t("deviceManage.deviceSettingTest5") }}
                </el-radio>
                <!-- <el-radio :label="2">设备配置</el-radio> -->
            </el-radio-group>
            <el-form ref="form" :model="form" :rules="rules" label-width="87px">
                <template v-if="form.settingType === 1">
                    <!-- 配置协议类型 -->
                    <el-form-item
                        :label="$t('deviceManage.deviceSettingTest6')"
                        v-if="isSwitchProtocolButtonShow"
                        prop="protocolCode"
                    >
                        <el-switch
                            v-model="form.protocolCodeOn"
                            :active-text="$t('deviceManage.deviceSettingTest7')"
                            :inactive-text="
                                $t('deviceManage.deviceSettingTest8')
                            "
                            :active-value="1"
                            :inactive-value="0"
                            class="text-on-switch"
                            @change="() => switchChange('protocolCode')"
                        ></el-switch>
                        <el-select
                            v-show="form.protocolCodeOn"
                            v-model="form.protocolCode"
                            :placeholder="$t('common.select')"
                            @change="() => switchChange('protocolCode')"
                        >
                            <el-option
                                v-for="(item, index) in protocolList"
                                :key="index"
                                :value="item"
                                :label="item"
                            ></el-option>
                        </el-select>
                    </el-form-item>

                    <!-- SIM卡类型 -->
                    <el-form-item
                        :label="$t('carManage.simType')"
                        prop="normalCard"
                    >
                        <el-switch
                            v-model="form.normalCardOn"
                            :active-text="$t('deviceManage.deviceSettingTest7')"
                            :inactive-text="
                                $t('deviceManage.deviceSettingTest8')
                            "
                            :active-value="1"
                            :inactive-value="0"
                            class="text-on-switch"
                            @change="() => switchChange('normalCard')"
                        ></el-switch>
                        <el-select
                            v-show="form.normalCardOn"
                            v-model="form.normalCard"
                            :placeholder="$t('common.select')"
                            @change="() => switchChange('normalCard')"
                        >
                            <el-option
                                v-for="(item, index) in normalCardList"
                                :key="index"
                                :value="item.value"
                                :label="item.label"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <!-- 设备型号 -->
                    <el-form-item
                        :label="$t('common.deviceModelCode')"
                        prop="deviceModelCode"
                    >
                        <el-switch
                            v-model="form.deviceModelCodeOn"
                            :active-text="$t('deviceManage.deviceSettingTest7')"
                            :inactive-text="
                                $t('deviceManage.deviceSettingTest8')
                            "
                            :active-value="1"
                            :inactive-value="0"
                            class="text-on-switch"
                            @change="() => switchChange('deviceModelCode')"
                        ></el-switch>
                        <el-select
                            v-show="form.deviceModelCodeOn"
                            v-model="form.deviceModelCode"
                            clearable
                            filterable
                            :placeholder="$t('common.select')"
                            @change="() => switchChange('deviceModelCode')"
                        >
                            <el-option
                                v-for="(item, index) in deviceModelList"
                                :key="index"
                                :value="item.fieldNameEN"
                                :label="item.fieldNameCN"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                </template>
                <template v-if="form.settingType === 2">
                    <p
                        style="
                            font-size: 12px;
                            color: #aaaaaa;
                            margin-bottom: 12px;
                        "
                    >
                        <!-- 配置结果请前往：维护中心>设备配置>我的配置任务中查看进度 -->
                        {{ $t("deviceManage.deviceSettingTest9") }}
                    </p>
                    <!-- 配置Wi-Fi密码 -->
                    <el-form-item
                        :label="$t('deviceManage.deviceSettingTest10')"
                    >
                        <el-switch
                            v-model="form.delivery"
                            :active-text="$t('deviceManage.deviceSettingTest7')"
                            :inactive-text="
                                $t('deviceManage.deviceSettingTest8')
                            "
                            :active-value="1"
                            :inactive-value="0"
                            class="text-on-switch"
                        ></el-switch>
                        <el-input
                            :placeholder="$t('common.input')"
                            style="width: 195px"
                            v-model="form.name"
                        ></el-input>
                    </el-form-item>
                </template>
            </el-form>
        </div>
        <div class="footer">
            <div class="footer-btn">
                <el-button type="default" @click="cancelDialog">
                    {{ $t("common.cancel") }}
                </el-button>
                <el-button type="primary" @click="submit" :loading="loadSubmit">
                    {{ $t("common.ok") }}
                </el-button>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: "",
    components: {},
    props: {
        settingParam: {
            type: Object,
            default: () => {},
        },
    },
    data() {
        const checkRules = (rule, value, callback) => {
            if (!!this.form[rule.on]) {
                if (value || value === 0) {
                    callback();
                } else {
                    callback(
                        new Error(`${this.$t("common.select")}${rule.name}`)
                    );
                }
            } else {
                callback();
            }
        };
        return {
            loadSubmit: false,
            bulkImportForm: {
                carId: "",
                plateNum: "",
                plateJson: {},
                plateArr: [],
                textarea: "",
            },
            form: {
                settingType: 1,
                protocolCodeOn: 1,
                protocolCode: "",
                deviceModelCodeOn: 0,
                deviceModelCode: "",
                normalCardOn: 1,
                normalCard: "",
            },
            deviceModelList: [],
            normalCardList: [
                {
                    // label: "定向卡",
                    label: this.$t("carManage.directionalCard"),
                    value: 0,
                },
                {
                    // label: "正常卡",
                    label: this.$t("carManage.normalCard"),
                    value: 1,
                },
            ],
            protocolList: [],
            isSwitchProtocolButtonShow: true,
            importLoading: false,
            currentPageCar: 1,
            query: "",
            haveDataCar: true,
            totalPagesCar: "",
            rules: {
                protocolCode: [
                    {
                        required: false,
                        validator: checkRules,
                        trigger: "blur",
                        // name: "配置协议类型",
                        name: this.$t("deviceManage.deviceSettingTest6"),
                        on: "protocolCodeOn",
                    },
                ],
                deviceModelCode: [
                    {
                        required: false,
                        validator: checkRules,
                        trigger: "blur",
                        // name: "设备型号",
                        name: this.$t("common.deviceModelCode"),
                        on: "deviceModelCodeOn",
                    },
                ],
                normalCard: [
                    {
                        required: false,
                        validator: checkRules,
                        trigger: "blur",
                        // name: "SIM卡类型",
                        name: this.$t("carManage.simType"),
                        on: "normalCardOn",
                    },
                ],
            },
        };
    },
    mounted() {
        this.getDeviceModelList();
        this.projectProtocolCodes();
        this.switchProtocolButtonShow();
    },
    computed: {},
    watch: {},
    methods: {
        doBulkImport(falg) {
            return new Promise((resolve, reject) => {
                if (!this.bulkImportForm.textarea) {
                    this.$message.warning(
                        this.$t("deviceManage.deviceSettingTest11")
                    );
                    this.loadSubmit = false;
                    return;
                }
                this.importLoading = true;
                this.$api
                    .getGroupDeviceByModelCodeDto({
                        type: 1,
                        values: this.bulkImportForm.textarea.split("，"),
                    })
                    .then((res) => {
                        if (res.success == true) {
                            if (res.data.message) {
                                this.$message.warning(res.data.message);
                                let plateNumArr =
                                    this.bulkImportForm.textarea.split("，");
                                let newPlateNumArr = plateNumArr.filter(
                                    (x) =>
                                        !res.data.nonexistentList.some(
                                            (y) => y === x
                                        )
                                );
                                this.bulkImportForm.textarea = [
                                    ...new Set(newPlateNumArr),
                                ]
                                    .filter((item) => item)
                                    .join("，");
                            }
                            if (res.data.modelVoList.length && falg) {
                                let deviceIdList = [];
                                res.data.modelVoList.forEach((item) => {
                                    item.checkDeviceInfos.forEach((k) => {
                                        deviceIdList.push(k.deviceId);
                                    });
                                });
                                resolve({ deviceIds: deviceIdList });
                            }
                            this.importLoading = false;
                        } else {
                            this.$message.error(res.msg);
                            this.loadSubmit = false;
                            this.importLoading = false;
                        }
                    });
            });
        },
        selectCar(val) {
            this.bulkImportForm.textarea += `，${val}`;
            this.plateNumBlur();
            this.bulkImportForm.plateNum = "";
        },
        plateNumBlur() {
            this.bulkImportForm.textarea = this.bulkImportForm.textarea
                .replace(/\r\n|\n/g, "，")
                .replace(/\s/g, "")
                .replace(/\,|\;|\；|\。|\./g, "，");
            let plateNumArr = this.bulkImportForm.textarea
                .split("，")
                .filter((item) => !!item);
            let repeatArr = this.getRepeatArr(plateNumArr);
            this.bulkImportForm.textarea = [...new Set(plateNumArr)]
                .filter((item) => item)
                .join("，");
            if (repeatArr.length) {
                this.$message.warning(
                    `${repeatArr[0]}${
                        repeatArr.length > 1
                            ? this.$t("deviceManage.deviceSettingTest12") +
                              repeatArr.length +
                              this.$t("deviceManage.deviceSettingTest13")
                            : ""
                    }${this.$t("deviceManage.deviceSettingTest14")}`
                );
            }
        },
        getRepeatArr(arr) {
            var temp = [];
            arr.forEach((item) => {
                if (
                    arr.indexOf(item) !== arr.lastIndexOf(item) &&
                    temp.indexOf(item) === -1
                ) {
                    temp.push(item);
                }
            });
            return temp;
        },
        //远程搜索
        remoteMethod2(query) {
            this.currentPageCar = 1;
            this.query = query;
            this.haveDataCar = true;
            if (query.length >= 3) {
                this.getPlateNumList({ plateNum: query }, true);
            }
        },
        //获取车牌号下拉信息
        getPlateNumList(jsonData, isDialog) {
            // this.loading = true;
            let param = {
                // orgId: this.params.organizeId,
                pageSize: 20,
                currentPage: this.currentPageCar,
            };
            let params = Object.assign({}, param, jsonData);
            this.$api.carDropDown(params).then((res) => {
                if (res.success == true) {
                    this.totalPagesCar = res.data.totalPages;
                    let temp =
                        (res.data.results.length && res.data.totalRecords) ||
                        (!res.data.results.length && !res.data.totalRecords)
                            ? res.data.results
                            : temp;
                    this.bulkImportForm.plateArr = (
                        this.currentPageCar === 1
                            ? []
                            : this.bulkImportForm.plateArr
                    ).concat(temp);
                    if (res.data.length < 20) {
                        this.haveDataCar = false;
                    }
                    if (this.bulkImportForm.plateArr.length) {
                        res.data.results.forEach((item) => {
                            this.bulkImportForm.plateJson[item.id] =
                                item.plateNum;
                        });
                    }

                    // this.loading = false;
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        //下拉加载更多
        selectLoadMore() {
            this.currentPageCar += 1;
            if (this.currentPageCar > this.totalPagesCar) return;
            this.getPlateNumList({ plateNum: this.query }); // 请求接口
        },
        //下拉框收取
        visibleHandler() {
            this.currentPageCar = 1; //手机号页码
            this.totalPagesCar = "";
        },

        getDeviceModelList() {
            this.$api.getProductListByOrgId().then((res) => {
                if (res.success == true) {
                    this.deviceModelList = [];
                    res.data.forEach((item) => {
                        this.deviceModelList.push({
                            fieldNameEN: item,
                            fieldNameCN: item,
                        });
                    });
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        projectProtocolCodes() {
            this.$api.projectProtocolCodes().then((res) => {
                if (res.success == true) {
                    this.protocolList = res.data;
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        switchProtocolButtonShow() {
            this.$api.switchProtocolButtonShow().then((res) => {
                if (res.success == true) {
                    this.isSwitchProtocolButtonShow = res.data;
                    this.form.protocolCodeOn = res.data ? 1 : 0;
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        cancelDialog() {
            this.$emit("settingVisibleClose");
            // this.$router.push("/manageCenter/deviceManage");
        },
        submit() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    if (
                        this.settingParam &&
                        this.settingParam.configType === 3
                    ) {
                        this.doBulkImport(true).then((res) => {
                            this.loadSubmit = true;
                            this.configDeviceInfoBatch({
                                ...this.settingParam,
                                ...res,
                            });
                        });
                    } else {
                        this.configDeviceInfoBatch(this.settingParam);
                    }
                }
            });
        },
        configDeviceInfoBatch(params) {
            const param = Object.assign(this.form, params);
            this.$api.configDeviceInfoBatch(param).then((res) => {
                this.loadSubmit = false;
                if (res.success == true) {
                    this.$message.success(
                        this.$t("deviceManage.deviceSettingTest15")
                    );
                    this.cancelDialog();
                    this.$emit("handleSuccess");
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        switchChange(name) {
            this.$refs.form.validateField(name);
        },
    },
};
</script>
<style lang="less" scoped>
.device-setting {
    .container {
        padding: 0 24px;
    }
    .footer {
        width: 100%;
        height: 4rem;
        bottom: 0;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        background: #ffffff;
        padding: 0 24px;
        position: relative !important;
        .footer-btn {
            text-align: right;
        }
    }
}
/deep/.text-on-switch {
    margin: 0 8px;
    .el-switch__label {
        position: absolute;
        color: #fff;
        display: none;
        width: 3rem;
        span {
            font-size: 12px;
        }
    }
    .el-switch__label--left {
        left: 19px;
        z-index: 1;
    }
    .el-switch__label--right {
        left: 0px;
    }
    .el-switch__label.is-active {
        display: block;
    }
    .el-switch__core {
        width: 60px !important;
    }
}
/deep/.text-on-switch.el-switch.is-checked .el-switch__core {
    background-color: #409eff;
}
/deep/.bulk-import {
    font-size: 14px;
    p {
        font-size: 14px;
        color: rgba(0, 0, 0, 0.85);
        margin-bottom: 8px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    & > div {
        border: 1px solid rgba(217, 217, 217, 1);
        border-radius: 2px;
    }
    .el-textarea {
        border-top: 1px solid rgba(217, 217, 217, 1);
    }
    .el-select {
        width: 100% !important;
    }
    .el-textarea__inner,
    .el-input__inner {
        border: none;
    }
    .type-select {
        display: flex;
        .el-select:nth-child(1) {
            width: 150px !important;
            border-right: 1px solid rgba(217, 217, 217, 1);
        }
    }
    .el-input__prefix {
        display: flex;
        align-items: center;
    }
}
</style>
