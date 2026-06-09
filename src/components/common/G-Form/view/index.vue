<template>
    <el-form
        :label-position="'top'"
        :inline="inline"
        :size="size"
        :model="formData"
        :rules="rules"
        :ref="refName"
        :label-width="labelWidth"
    >
        <el-form-item
            v-for="item in formList.filter((i) => {
                return !i.hidden;
            })"
            :label="item.label ? item.label + '：' : ''"
            :key="item.prop"
            :prop="item.prop"
        >
            <!-- 单选框 -->
            <el-radio-group
                v-if="item.type === 'radio'"
                v-model="formData[item.prop]"
                @change="handleEvent($event, item.onChange)"
            >
                <el-radio
                    v-for="ra in item.options"
                    :label="ra.value"
                    :key="ra.value"
                    :disabled="ra.disabled"
                    :border="item.border"
                    :size="item.size"
                >
                    {{ ra.label }}
                </el-radio>
            </el-radio-group>

            <!-- 多选框 -->
            <el-checkbox-group
                v-if="item.type === 'checkbox'"
                v-model="formData[item.prop]"
                :min="item.min"
                :max="item.max"
                @change="handleEvent($event, item.onChange)"
            >
                <el-checkbox
                    v-for="ch in item.options"
                    :label="ch.value"
                    :key="ch.value"
                    :disabled="ch.disabled"
                    :border="item.border"
                    :size="item.size"
                    >{{ ch.label }}</el-checkbox
                >
            </el-checkbox-group>

            <!-- 输入框 -->
            <el-input
                v-if="item.type === 'input' || item.type === 'textarea'"
                :type="item.type === 'textarea' ? 'textarea' : ''"
                v-model="formData[item.prop]"
                :placeholder="item.placeholder || `请输入${item.label}`"
                :disabled="item.disabled"
                :readonly="item.readonly"
                :clearable="item.clearable"
                :rows="item.rows"
                :autosize="{ minRows: item.minRows, maxRows: item.maxRows }"
                :maxlength="item.maxlength"
                :minlength="item.minlength"
                :show-word-limit="item.showWordLimit"
                @blur="handleEvent($event, item.onBlur)"
                @focus="handleEvent($event, item.onFocus)"
                @change="handleEvent($event, item.onChange)"
                @input="handleEvent($event, item.onInput)"
                @clear="handleEvent($event, item.onClear)"
            ></el-input>

            <!-- 计数器 -->
            <el-input-number
                v-if="item.type === 'inputNumber'"
                v-model="formData[item.prop]"
                :placeholder="item.placeholder || `请输入${item.label}`"
                :class="item.className"
                :min="item.min"
                :max="item.max"
                :step="item.step"
                :precision="item.precision"
                :size="item.size"
                :disabled="item.disabled"
                :controls-position="item.position"
                :step-strictly="item.stepStrictly"
                @blur="handleEvent($event, item.onBlur)"
                @focus="handleEvent($event, item.onFocus)"
                @change="handleEvent($event, item.onChange)"
            ></el-input-number>

            <!-- 选择器 -->
            <el-select
                v-if="item.type === 'select'"
                v-model="formData[item.prop]"
                :placeholder="item.placeholder || `请选择${item.label}`"
                :multiple="item.multiple"
                :disabled="item.disabled"
                :clearable="item.clearable"
                :multiple-limit="item.limit"
                :filterable="item.filterable"
                :collapse-tags="item.collapseTags"
                :remote="item.remote"
                :remote-method="item.remoteMethod"
                @change="handleEvent($event, item.onChange)"
                @visible-change="$forceUpdate()"
                @clear="handleEvent($event, item.onClear)"
                @blur="handleEvent($event, item.onBlur)"
                @focus="handleEvent($event, item.onFocus)"
            >
                <el-option
                    v-for="op in item.options"
                    :label="
                        item.optionsFormat
                            ? op[item.optionsFormat.label]
                            : op.label
                    "
                    :value="
                        item.optionsFormat
                            ? op[item.optionsFormat.value]
                            : op.value
                    "
                    :key="
                        item.optionsFormat
                            ? op[item.optionsFormat.value]
                            : op.value
                    "
                    :disabled="op.disabled"
                >
                    {{
                        item.optionsFormat
                            ? op[item.optionsFormat.label]
                            : op.label
                    }}
                </el-option>
            </el-select>

            <el-select
                v-if="item.type === 'selectGroup'"
                v-model="formData[item.prop]"
                :placeholder="item.placeholder || `请选择${item.label}`"
                :multiple="item.multiple"
                :disabled="item.disabled"
                :clearable="item.clearable"
                :multiple-limit="item.limit"
                :filterable="item.filterable"
                :collapse-tags="item.collapseTags"
                :remote="item.remote"
                :remote-method="item.remoteMethod"
                @change="handleEvent($event, item.onChange)"
                @visible-change="$forceUpdate()"
                @clear="handleEvent($event, item.onClear)"
                @blur="handleEvent($event, item.onBlur)"
                @focus="handleEvent($event, item.onFocus)"
            >
                <el-option-group
                    v-for="group in item.options"
                    :label="
                        item.optionsFormat
                            ? group[item.optionsFormat.label]
                            : group.label
                    "
                    :value="
                        item.optionsFormat
                            ? group[item.optionsFormat.value]
                            : group.value
                    "
                    :key="
                        item.optionsFormat
                            ? group[item.optionsFormat.value]
                            : group.value
                    "
                >
                    <el-option
                        v-for="op in item.childrenName
                            ? group[item.childrenName]
                            : group.options"
                        :label="
                            item.optionsFormat
                                ? op[item.optionsFormat.label]
                                : op.label
                        "
                        :value="
                            item.optionsFormat
                                ? op[item.optionsFormat.value]
                                : op.value
                        "
                        :key="
                            item.optionsFormat
                                ? op[item.optionsFormat.value]
                                : op.value
                        "
                        :disabled="op.disabled"
                    >
                        {{
                            item.optionsFormat
                                ? op[item.optionsFormat.label]
                                : op.label
                        }}
                    </el-option>
                </el-option-group>
            </el-select>
            <!-- 级联选择器 -->
            <el-cascader
                v-if="item.type === 'cascader'"
                v-model="formData[item.prop]"
                :placeholder="item.placeholder || `请选择${item.label}`"
                :options="item.options"
                :props="item.props"
                :size="item.size"
                :collapse-tags="item.collapseTags"
                :clearable="item.clearable"
                :filterable="item.filterable"
                :show-all-levels="item.showAllLevels"
                @change="handleEvent($event, item.onChange)"
                @expand-change="handleEvent($event, item.expandChange)"
                @blur="handleEvent($event, item.onBlur)"
                @focus="handleEvent($event, item.onFocus)"
                @visible-change="handleEvent($event, item.onVisibleChange)"
                @remove-tag="handleEvent($event, item.onRemoveTag)"
            ></el-cascader>

            <!-- 开关 -->
            <el-switch
                v-if="item.type === 'switch'"
                v-model="formData[item.prop]"
                :disabled="item.disabled"
                :width="item.width"
                :active-value="item.activeValue"
                :inactive-value="item.inactiveValue"
                @change="handleEvent($event, item.onChange)"
            >
            </el-switch>

            <!-- 滑块 -->
            <el-slider
                v-if="item.type === 'slider'"
                v-model="formData[item.prop]"
                :min="item.min"
                :max="item.max"
                :disabled="item.disabled"
                :step="item.step"
                @change="handleEvent($event, item.onChange)"
            ></el-slider>

            <!-- 时间选择器 -->
            <el-time-select
                v-if="item.type === 'time'"
                v-model="formData[item.prop]"
                :picker-options="
                    item.pickerOptions || {
                        start: '00:00',
                        step: '00:15',
                        end: '23:45',
                    }
                "
                :value-format="item.format || 'HH:mm:ss'"
                :placeholder="item.placeholder || '选择时间'"
                :readonly="item.readonly"
                :disabled="item.disabled"
                :clearable="item.clearable"
                :size="item.size"
                :default-value="item.defaultValue"
                @change="handleEvent($event, item.onChange)"
                @blur="handleEvent($event, item.onBlur)"
                @focus="handleEvent($event, item.onFocus)"
            ></el-time-select>

            <!-- 日期选择器 -->
            <el-date-picker
                v-if="item.type === 'date'"
                :type="item.dateType"
                v-dataTimeRange="item.dataTimeRange"
                v-model="formData[item.prop]"
                :value-format="item.format || dateFormat[item.dateType]"
                :placeholder="item.placeholder || '选择日期'"
                :start-placeholder="item.startPlaceholder || '开始时间'"
                :end-placeholder="item.endPlaceholder || '结束时间'"
                :readonly="item.readonly"
                :disabled="item.disabled"
                :clearable="item.clearable"
                :size="item.size"
                :default-value="item.defaultValue"
                :default-time="item.defaultTime"
                :picker-options="item.pickerOptions || {}"
                :popper-class="item.popperClass"
                @change="handleEvent($event, item.onChange)"
                @blur="handleEvent($event, item.onBlur)"
                @focus="handleEvent($event, item.onFocus)"
            ></el-date-picker>
            <slot :name="item.slot" v-if="item.slot"></slot>
            <span v-if="item.unit" class="unit">{{ item.unit }}</span>
        </el-form-item>
    </el-form>
</template>

<script>
export default {
    name: "G-Form",
    props: {
        //行内表单模式
        inline: {
            type: Boolean,
            default: true,
        },
        //表单域标签的宽度
        labelWidth: {
            type: String,
            default: "",
        },
        //用于控制该表单内组件的尺寸
        size: {
            type: String,
            default: "mini",
        },
        refName: {
            type: String,
            default: "form",
        },
        //表单配置项
        formList: {
            type: Array,
            default: () => [],
        },
        //第一次是否查询:
        isSearchFirst: {
            type: Boolean,
            default: true,
        },
        //是否搜索组件内
        isSearchTableList: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            //表单数据对象
            formData: {},
            //日期格式化
            dateFormat: {
                year: "yyyy",
                month: "yyyy-MM",
                date: "yyyy-MM-dd",
                dates: "yyyy-MM-dd",
                week: "yyyy-MM-dd",
                datetime: "yyyy-MM-dd HH:mm:ss",
                datetimerange: "yyyy-MM-dd HH:mm:ss",
                daterange: "yyyy-MM-dd",
                monthrange: "yyyy-MM",
            },
        };
    },
    watch: {
        formList: {
            handler(val) {
                let newData = val.reduce((map, i) => {
                    if (i.hidden) {
                        return map;
                    }
                    if (i.prop) {
                        map[i.prop] = i.initialValue || "";
                        if (i.type === "slider") {
                            map[i.prop] = 0;
                        }
                        if (
                            i.type === "checkbox" ||
                            i.type === "cascader" ||
                            (i.type === "selectTree" && i.isMultiple)
                        ) {
                            map[i.prop] = i.initialValue || [];
                        }
                        if (i.prop.indexOf(",") > 0) {
                            map[i.prop.split(",")[0]] = i.initialValue
                                ? i.initialValue[0] || ""
                                : "";
                            map[i.prop.split(",")[1]] = i.initialValue
                                ? i.initialValue[1] || ""
                                : "";
                        }
                    }
                    return map;
                }, {});
                Object.keys(newData).forEach((key) => {
                    if (this.formData.hasOwnProperty(key)) {
                        newData[key] = this.formData[key];
                    }
                });
                this.formData = newData;
            },
            deep: true,
        },
    },
    created() {
        this.formData = this.formList.reduce((map, i) => {
            if (i.prop) {
                map[i.prop] = i.initialValue || "";
                if (i.type === "slider") {
                    map[i.prop] = 0;
                }
                if (
                    i.type === "checkbox" ||
                    i.type === "cascader" ||
                    (i.type === "selectTree" && i.isMultiple)
                ) {
                    map[i.prop] = i.initialValue || [];
                }
                if (i.prop.indexOf(",") > 0) {
                    map[i.prop.split(",")[0]] = i.initialValue
                        ? i.initialValue[0] || ""
                        : "";
                    map[i.prop.split(",")[1]] = i.initialValue
                        ? i.initialValue[1] || ""
                        : "";
                }
            }
            return map;
        }, {});
    },
    mounted() {
        this.$nextTick(() => {
            let rulesArr = Object.values(this.rules).filter((item) => {
                return item.required;
            });
            if (!this.isSearchFirst) return;
            if (this.isSearchTableList && !rulesArr.length) {
                this.validateSuccess();
            }
        });
    },
    computed: {
        //解析表单的正则验证
        rules() {
            let rules = this.formList.reduce((map, i) => {
                if (i.rules) {
                    map[i.prop] = i.rules;
                }
                return map;
            }, {});
            return rules;
        },
    },
    methods: {
        /**
         * validateSuccess
         * @description: 表单验证
         * @param {Boolean} isSearchBtn 是否是查询bar搜索，是则重置为第一页
         */
        validateSuccess(isSearchBtn) {
            this.$emit("validateSuccess", this.getFormValues(), isSearchBtn);
        },
        /**
         * getFormValues
         * @description: 获取表单数据
         */
        getFormValues() {
            let newFormData = JSON.parse(JSON.stringify(this.formData));
            this.formList.forEach((item) => {
                if (item.prop && item.prop.indexOf(",") > 0) {
                    if (newFormData.hasOwnProperty(item.prop)) {
                        newFormData[item.prop.split(",")[0]] = newFormData[
                            item.prop
                        ]
                            ? newFormData[item.prop][0] || ""
                            : "";
                        newFormData[item.prop.split(",")[1]] = newFormData[
                            item.prop
                        ]
                            ? newFormData[item.prop][1] || ""
                            : "";
                    }
                    delete newFormData[item.prop];
                }
            });
            return newFormData;
        },
        /**
         * formValidate
         * @description: 表单验证
         */
        formValidate(isSearchBtn) {
            this.$refs[this.refName].validate((valid) => {
                if (valid) {
                    this.validateSuccess(isSearchBtn);
                } else {
                    return false;
                }
            });
        },
        /**
         * resetFields
         * @description: 表单重置
         */
        resetFields() {
            this.$refs[this.refName].resetFields();
            if (this.$refs.selectTree && this.$refs.selectTree.length) {
                this.$refs.selectTree.forEach((item) => {
                    item.clear();
                });
            }
        },
        /**
         * getCheckedKeys
         * @description: 处理下拉树选中后的回调
         * @param {Object} checkedList 选中节点数据对象
         * @param {Object} item 表单对象
         */
        getCheckedKeys(checkedList, item) {
            this.formData[item.prop] = checkedList;
            this.handleEvent(checkedList, item.getCheckedKeys);
        },
        /**
         * handleEvent
         * @description: 回调处理事件
         * @param {Object} val 返回值
         * @param {Object} func 回调方法
         */
        handleEvent(val, func) {
            if (func) {
                func.call(this, val);
            }
        },
        /**
         * setFormValues
         * @description: 查询表单设值
         * @param {Object} val 表单数据
         */
        setFormValues(val) {
            this.formData = { ...this.formData, ...val };
        },
    },
};
</script>
<style lang="less" scoped>
@import "./../less/index.less";
</style>
