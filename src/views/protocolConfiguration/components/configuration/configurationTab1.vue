<template>
    <div class="tab1-content">
        <div class="tab1-menu">
            <el-menu
                ref="elMenu"
                v-if="defaultActive"
                :default-active="defaultActive"
                @select="menuSelect"
            >
                <el-menu-item
                    v-for="(item, index) in menuList"
                    :key="index"
                    :index="item.value"
                >
                    {{ item.label }}
                </el-menu-item>
            </el-menu>
        </div>
        <div class="tab1-form" v-loading="formLoading">
            <template v-if="refresh">
                <keep-alive>
                    <component
                        ref="tab1-form"
                        :is="defaultActive"
                        :newForm.sync="newForm"
                        :oldForm.sync="oldForm"
                        :tabPosition="tabPosition"
                        :deviceInfo="deviceInfo"
                        :capability="capability"
                        :enumeration="enumeration"
                        @newFormChange="newFormChange"
                        @setFormChange="setFormChange"
                        @formDataChange="formDataChange"
                        @formValidate="formValidate"
                        @setFormLoading="setFormLoading"
                        @loadingSuccess="loadingSuccess"
                    ></component>
                </keep-alive>
            </template>
        </div>
    </div>
</template>
<script>
import enumerationJSON from "./enumerationJSON/enumeration.json";
import vehicleParams from "./configurationForm/vehicleParams.vue";
import deviceParams from "./configurationForm/deviceParams.vue";
import platformParams from "./configurationForm/platformParams.vue";
import alarmParams from "./configurationForm/alarmParams.vue";
import peripheralParams from "./configurationForm/peripheralParams.vue";
import ADASParams from "./configurationForm/ADAS-Params.vue";
import DSMParams from "./configurationForm/DSM-Params.vue";
import BSDParams from "./configurationForm/BSD-Params.vue";
import WHDParams from "./configurationForm/WHD-Params.vue";
import WIWParams from "./configurationForm/WIW-Params.vue";
import ADParams from "./configurationForm/AD-Params.vue";
import VSDParams from "./configurationForm/VSD-Params.vue";
import PDAParams from "./configurationForm/PDA-Params.vue";
import CMBSParams from "./configurationForm/CMBS-Params.vue";
import videoParams from "./configurationForm/videoParams.vue";
import audioParams from "./configurationForm/audioParams.vue";

export default {
    name: "",
    components: {
        vehicleParams,
        deviceParams,
        platformParams,
        alarmParams,
        peripheralParams,
        ADASParams,
        DSMParams,
        BSDParams,
        WHDParams,
        WIWParams,
        ADParams,
        VSDParams,
        PDAParams,
        CMBSParams,
        videoParams,
        audioParams,
    },
    props: {
        deviceInfo: {
            type: Object,
            default: () => ({}),
        },
        capability: {
            type: Object,
            default: () => ({}),
        },
        enumeration: {
            type: Object,
            default: () => ({}),
        },
        tabPosition: {
            type: String,
        },
    },
    data() {
        return {
            enumerationJSON,
            defaultActive: "",
            menuList: [],
            refresh: true,
            newForm: {},
            oldForm: {},
            formLoading: false,
            loadingCount: 0,
        };
    },
    mounted() {},
    computed: {},
    watch: {
        capability: {
            deep: true,
            handler(newVal, oldVal) {
                this.setMenuList();
            },
        },
    },
    methods: {
        setMenuList() {
            if (
                this.capability.generic ||
                this.capability.intelliDrive_sensor ||
                this.capability.zhatu.containerStatus ||
                this.capability.zhatu.vehicleControl ||
                this.capability.zhatu.engineVehicleControl
            ) {
                this.menuList.push({
                    label: "车辆参数",
                    value: this.getMenuListValue("车辆参数"),
                });
            }
            if (
                this.capability.generic ||
                this.capability.network ||
                this.capability.intelliDrive_sensor ||
                this.capability.time ||
                this.capability.intelliDrive_face ||
                this.capability.zhatu.workMode
            ) {
                this.menuList.push({
                    label: "设备参数",
                    value: this.getMenuListValue("设备参数"),
                });
            }
            if (
                this.capability.network &&
                this.capability.network.platformInfo
            ) {
                this.menuList.push({
                    label: "平台参数",
                    value: this.getMenuListValue("平台参数"),
                });
            }
            if (this.capability.intelliDrive_ADAS) {
                this.menuList.push({
                    label: "ADAS",
                    value: this.getMenuListValue("ADAS"),
                });
            }
            if (this.capability.intelliDrive_DSM) {
                this.menuList.push({
                    label: "DSM",
                    value: this.getMenuListValue("DSM"),
                });
            }
            if (this.capability.intelliDrive_BSD) {
                this.menuList.push({
                    label: "BSD",
                    value: this.getMenuListValue("BSD"),
                });
            }
            if (this.capability.intelliDrive_WHD) {
                this.menuList.push({
                    label: "WHD",
                    value: this.getMenuListValue("WHD"),
                });
            }
            if (this.capability.intelliDrive_WIW) {
                this.menuList.push({
                    label: "WIW",
                    value: this.getMenuListValue("WIW"),
                });
            }
            if (this.capability.intelliDrive_AD) {
                this.menuList.push({
                    label: "AD",
                    value: this.getMenuListValue("AD"),
                });
            }
            if (this.capability.intelliDrive_VSD) {
                this.menuList.push({
                    label: "VSD",
                    value: this.getMenuListValue("VSD"),
                });
            }
            if (this.capability.intelliDrive_PDA) {
                this.menuList.push({
                    label: "PDA",
                    value: this.getMenuListValue("PDA"),
                });
            }
            if (this.capability.intelliDrive_CMBS) {
                this.menuList.push({
                    label: "CMBS",
                    value: this.getMenuListValue("CMBS"),
                });
            }
            if (
                this.capability.intelliDrive_warn ||
                this.capability.zhatu.alarmInfo ||
                this.capability.zhatu.gsensorTurn
            ) {
                this.menuList.push({
                    label: "报警设置",
                    value: this.getMenuListValue("报警设置"),
                });
            }
            if (
                this.capability.peripheral_warn_out ||
                this.capability.zhatu.externalInfo ||
                this.capability.zhatu.androidScreen
            ) {
                this.menuList.push({
                    label: "外设设置",
                    value: this.getMenuListValue("外设设置"),
                });
            }
            if (this.capability.compress && this.capability.compress.length) {
                this.menuList.push({
                    label: "视频参数设置",
                    value: this.getMenuListValue("视频参数设置"),
                });
            }
            if (
                this.capability.audio &&
                this.capability.audio.chanInfo &&
                this.capability.audio.chanInfo.length
            ) {
                this.menuList.push({
                    label: "音频设置",
                    value: this.getMenuListValue("音频设置"),
                });
            }
            if (this.menuList.length) {
                if (this.$route.query.multicenter) {
                    this.defaultActive = this.menuList.find(
                        (e) => e.label === "平台参数"
                    ).value;
                } else {
                    this.defaultActive = this.menuList[0].value;
                    // let time = null;
                    // this.menuList.forEach((item, index) => {
                    //     time = 100 * index;
                    //     setTimeout(() => {
                    //         this.defaultActive = item.value;
                    //     }, 1 * index);
                    // });
                    // setTimeout(() => {
                    //     this.defaultActive = this.menuList[0].value;
                    // }, time + 1);
                }

                this.$forceUpdate();
            }
        },

        getMenuListValue(label) {
            return this.enumerationJSON["menu_list"].find(
                (e) => e.label === label
            ).value;
        },
        menuSelect(val) {
            let _defaultActive = this.defaultActive;
            this.defaultActive = null;
            this.$refs["tab1-form"]
                .formValidate()
                .then(() => {
                    this.defaultActive = val;
                    if (val === "BSDParams" || val === "WHDParams") {
                        setTimeout(() => {
                            this.defaultActive = "BSDParams";
                        }, 1);
                        setTimeout(() => {
                            this.defaultActive = "WHDParams";
                        }, 2);
                        setTimeout(() => {
                            this.defaultActive = val;
                        }, 3);
                    }
                })
                .catch(() => {
                    this.$nextTick(() => {
                        this.defaultActive = _defaultActive;
                        this.$message.error(`当前表单校验不通过，请检查！`);
                    });
                });
        },
        setFormChange(setForm) {
            this.$emit("setFormChange", setForm);
        },
        newFormChange(newForm) {
            this.$emit("newFormChange", newForm);
        },
        formDataChange(obj, val) {
            this.$emit("formDataChange", obj, val);
        },
        formValidate(validate, errorMsg) {
            this.$emit("formValidate", validate, errorMsg);
        },
        initConfig() {
            this.formLoading = true;
            this.refresh = false;
            this.loadingCount = 0;
            setTimeout(() => {
                this.refresh = true;
            }, 0);
        },
        deleteFormItem(item) {
            this.$refs["tab1-form"].deleteFormItem(item);
        },
        tabPositionChange(val) {
            this.$refs["tab1-form"].resetFormItem(val);
        },
        labelWidthResize() {
            this.$refs["tab1-form"].labelWidthResize();
        },
        setFormLoading(val) {
            this.formLoading = val;
        },
        getAllMenuTree() {
            if (this.loadingCount === this.menuList.length) {
                this.$emit("loadingSuccess");
            } else {
                let _defaultActive = this.defaultActive;
                let time = null;
                this.menuList.forEach((item, index) => {
                    time = 1 * index;
                    setTimeout(() => {
                        this.defaultActive = item.value;
                    }, 1 * index);
                });
                setTimeout(() => {
                    this.defaultActive = _defaultActive;
                }, time + 1);
            }
        },
        loadingSuccess() {
            this.loadingCount++;
            if (this.loadingCount === this.menuList.length) {
                this.$emit("loadingSuccess");
            }
        },
    },
};
</script>
<style lang="less" scoped>
.tab1-content {
    display: flex;
    height: 100%;
    .tab1-menu {
        width: 240px;
        border-right: 1px solid #e9e9e9;
        .el-menu {
            background: transparent;
            height: 100%;
            overflow-y: auto;
        }
        .el-menu-item {
            &::before {
                border-left: 0px;
            }
            &::after {
                position: absolute;
                top: 0;
                bottom: 0;
                right: 0;
                border-right: 2px solid #2080f7;
                content: "";
                transform: scaleY(0.0001);
                transition: all 0.3s linear;
            }
        }
        .el-menu-item.is-active {
            background-color: #e7f7ff;
            color: #1890ff;
            &::after {
                transform: scaleY(1);
            }
        }
    }
    .tab1-form {
        position: relative;
        width: calc(~"100% - 240px");
        padding: 14px 14px 14px 14px;
        overflow-y: auto;
        // overflow-y: overlay;
    }
}
</style>
