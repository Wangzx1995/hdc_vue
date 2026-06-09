<template>
    <div class="save-template">
        <el-dialog
            title="存至模板"
            :top="2 + '%'"
            :visible.sync="templateVisible"
            :width="'500px'"
            @close="close"
            :custom-class="'save-template-body'"
        >
            <el-form
                ref="templateForm"
                label-position="top"
                :model="templateForm"
                :rules="templateRules"
                content-width="450px"
            >
                <el-form-item
                    label="模板名称"
                    prop="templateName"
                    style="margin-bottom: 10px !important"
                >
                    <el-input
                        v-model="templateForm.templateName"
                        placeholder="请输入"
                    ></el-input>
                </el-form-item>
                <el-form-item label="备注信息" prop="templateRemark">
                    <el-input
                        v-model="templateForm.templateRemark"
                        placeholder="请输入"
                        type="textarea"
                        :count="100"
                        :rows="5"
                    ></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <!-- <el-button type="default" @click="lookMouble">查看</el-button> -->
                <el-button type="default" @click="close">取消</el-button>
                <el-button type="primary" @click="submit">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import { validateTempSpecial } from "@/utils/validate";
export default {
    props: {
        visible: {
            type: Boolean,
            default: false,
        },
    },
    watch: {
        visible: {
            handler(newVal, oldVal) {
                this.templateVisible = newVal;
                if (this.$refs.templateForm) {
                    this.$refs.templateForm.resetFields();
                }
            },
            deep: true,
            immediate: true,
        },
    },
    data() {
        const checkName = (rule, value, callback) => {
            if (value != "") {
                if (value.length > 32) {
                    callback(new Error("模板名称长度不超过32个字符"));
                } else if (!validateTempSpecial(value)) {
                    callback(
                        new Error(
                            "模板名称只能包含中文、字母、数字、字符（“_”、“-”和“.”）"
                        )
                    );
                }
            } else {
                callback(new Error("请输入模板名称"));
            }
            callback();
        };
        return {
            templateRules: {
                templateName: [
                    { required: true, validator: checkName, trigger: "blur" },
                ],
            },
            templateVisible: false,
            templateForm: {
                templateName: "",
                templateRemark: "",
            },
        };
    },
    methods: {
        close() {
            this.$emit("update:visible", false);
        },
        submit() {
            this.$refs.templateForm.validate((valid, invalidFields) => {
                if (valid) {
                    this.$emit("submit", this.templateForm);
                } else {
                    return false;
                }
            });
        },
        // lookMouble(){
        //   this.$emit('showMouble',true)
        // }
    },
};
</script>
<style lang="less">
.save-template-body {
    .el-dialog__body {
        padding: 0 20px;
    }
}
</style>
