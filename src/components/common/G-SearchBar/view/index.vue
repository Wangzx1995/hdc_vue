<template>
    <div>
        <div class="search-bar" v-show="formList && formList.length>0">
            <G-Form
                class="search-form"
                ref="GForm"
                :isSearchFirst="isSearchFirst"
                :inline="inline"
                :labelWidth="labelWidth"
                :size="size"
                @treeClear="$emit('treeClear')"
                :formList="formList"
                :isSearchTableList="isSearchTableList"
                @validateSuccess="validateSuccess"
            >
                <template v-slot:[item.slot]="scope" v-for="item in formList">
                    <slot :name="item.slot" :data="scope.data" v-if="item.slot"></slot>
                </template>
            </G-Form>
            <div class="search-operation">
                <el-button v-if="showSubmitBtn" size="mini" type="primary" @click="validateForm(true)">{{ submitBtnText }}</el-button>
                <el-button v-if="showClearBtn" size="mini" @click="reset()">清除条件</el-button>
                <slot name="btnOperation"></slot>
            </div>
        </div>
        <slot name="searchOperation"></slot>
    </div>
</template>

<script>
export default {
    name: "G-SearchBar",
    props: {
        //第一次是否查询:
        isSearchFirst:{
            type: Boolean,
            default:true
        },
        //行内表单模式
        inline: {
            type: Boolean,
            default: true
        },
        //是否搜索组件内
        isSearchTableList: {
            type: Boolean,
            default: false
        },
        //表单域标签的宽度
        labelWidth: {
            type: String,
            default: ""
        },
        //用于控制该表单内组件的尺寸
        size: {
            type: String,
            default: "mini"
        },
        //表单配置项
        formList: {
            type: Array,
            default: () => []
        },
        //查询框文字
        submitBtnText: {
            type: String,
            default: "查询"
        },
        //是否显示查询按钮
        showSubmitBtn: {
            type: Boolean,
            default: true
        },
        //是否显示清除按钮
        showClearBtn: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {};
    },
    created() {},
    computed: {},
    mounted() {},
    methods: {
        /**
         * validateForm
         * @description: 表单验证
         * @param {Boolean} isSearchBtn 是否是查询bar搜索，是则重置为第一页
         */
        validateForm(isSearchBtn = false) {
            
            // 父组件的点击事件
            this.$refs.GForm.formValidate(isSearchBtn);
        },
        /**
         * getFormValues
         * @description: 获取表单数据
         */
        getFormValues() {
            return this.$refs.GForm.getFormValues();
        },
        /**
         * reset
         * @description: 表单重置
         */
        reset() {
            this.$refs.GForm.resetFields();
            this.$emit("resetForm");
        },
        /**
         * validateSuccess
         * @description: 表单验证成功后的回调
         * @param {Object} formData 表单数据
         */
        validateSuccess(formData, isSearchBtn) {
            
            this.$emit("searchForm", formData, isSearchBtn);
        },
        /**
         * setFormValues
         * @description: 查询表单设值
         * @param {Object} val 表单数据
         */
        setFormValues(val) {
            this.$refs.GForm.setFormValues(val);
        }
    }
};
</script>
<style lang="less" scoped>
@import "./../less/index.less";
</style>
