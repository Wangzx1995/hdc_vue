<template>
    <div class="configuration-content">
        <div class="top-tab">
            <el-tabs
                v-model="tabPosition"
                type="border-card"
                :before-leave="tabPositionChange"
            >
                <el-tab-pane
                    label="单设备参数项配置"
                    name="tab1"
                    v-if="!templateConfigurationType"
                >
                </el-tab-pane>
                <el-tab-pane
                    label="多设备参数项配置"
                    name="tab2"
                    v-if="!templateConfigurationType"
                >
                </el-tab-pane>
                <el-tab-pane label="模板配置" name="tab3"> </el-tab-pane>
            </el-tabs>
            <i class="iconfont icon-jinggao"></i>
            <span>
                切换至“多设备参数项配置”时可以将当前设备的特定参数项作为基准，应用于其他多个设备
            </span>
        </div>
        <div class="component-content" v-loading="loading">
            <configuration-tab1
                ref="configuration-tab1"
                v-show="tabPosition === 'tab1' || tabPosition === 'tab2'"
                :tabPosition="tabPosition"
                :capability="capability"
                :deviceInfo="deviceInfo"
                :enumeration="enumeration"
                :carIds="carIds"
                @newFormChange="newFormChange"
                @setFormChange="setFormChange"
                @formDataChange="formDataChange"
                @formValidate="formValidate"
                @loadingSuccess="loadingSuccess"
            ></configuration-tab1>

            <configuration-tab3
                ref="configuration-tab3"
                :tabPosition="tabPosition"
                v-show="tabPosition === 'tab3'"
                @templateObjChange="templateObjChange"
            ></configuration-tab3>
        </div>
    </div>
</template>
<script>
import configurationTab1 from "./configuration/configurationTab1.vue";
import configurationTab2 from "./configuration/configurationTab2.vue";
import configurationTab3 from "./configuration/configurationTab3.vue";
export default {
    name: "",
    components: { configurationTab1, configurationTab2, configurationTab3 },
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
        paramsLength: {
            type: Number,
            default: 0,
        },
        carIds: {
            type: Array,
            default: () => [],
        },
    },
    data() {
        return {
            tabPosition: "tab1",
            setForm: {},
            loading: false,
            templateConfigurationType:
                this.$route.query.templateConfigurationType,
        };
    },
    created() {
        if (this.templateConfigurationType) {
            this.tabPosition = "tab3";
        }
    },
    mounted() {
        if (this.templateConfigurationType) {
            setTimeout(() => {
                this.$emit("tabPositionChange", this.tabPosition);
            }, 0);
        }
    },
    computed: {},
    watch: {},
    methods: {
        setFormChange(setForm) {
            this.$emit("setFormChange", setForm);
        },
        newFormChange(newForm) {
            this.$emit("newFormChange", newForm);
        },
        formDataChange(obj, val) {
            this.$emit("formDataChange", obj, val);
        },
        loadingSuccess() {
            this.$emit("loadingSuccess");
        },
        tabPositionChange(val) {
            this.loading = true;
            setTimeout(() => {
                this.loading = false;
            }, 500);
            this.tabPosition = val;
            this.$refs[`configuration-tab1`].tabPositionChange(val);
            this.$emit("tabPositionChange", this.tabPosition);
            if (val === "tab3") {
                this.$refs["configuration-tab3"].searchForm();
            } else {
                this.$nextTick(() => {
                    this.$refs["configuration-tab1"].labelWidthResize();
                });
            }
            return true;
        },
        formValidate(validate, errorMsg) {
            this.$emit("formValidate", validate, errorMsg);
        },
        initConfig() {
            this.$refs[`configuration-tab1`].initConfig();
        },
        deleteFormItem(item) {
            this.$refs[`configuration-tab1`].deleteFormItem(item);
        },
        templateObjChange(templateObj) {
            this.$emit("templateObjChange", templateObj);
        },
    },
};
</script>
<style lang="less" scoped>
.configuration-content {
    .top-tab {
        display: flex;
        align-items: center;
        padding: 8px 14px;
        border-bottom: 1px solid #e9e9e9;
        .icon-jinggao {
            font-size: 24px;
            color: #1890ff;
            margin-left: 16px;
        }
        /deep/.el-tabs__content {
            padding: 0px;
            border: none;
        }
        /deep/.el-tabs__nav {
            height: 32px;
            background: #ffffff;
            .el-tabs__item {
                height: 32px;
                line-height: 32px;
                &:not(:first-child) {
                    border-left: 1px solid #e0e0e0;
                }
                &.is-active {
                    border-color: #2080f7;
                }
            }
        }
    }
    .component-content {
        position: relative;
        height: calc(~"100% - 53px");
    }
}
/deep/.el-tabs {
    box-shadow: none;
    .el-tabs__header {
        border-bottom: none;
    }
    .el-tabs__nav-wrap {
        margin-bottom: 0px;
    }
    .el-tabs__item {
        margin: 0px !important;
    }
}
</style>
