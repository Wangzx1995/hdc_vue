<template>
    <div>
        <div class="input-number-range" :class="{ 'is-disabled': disabled }">
            <div class="flex">
                <div class="from">
                    <el-input
                        ref="input_from"
                        v-model="userInputForm"
                        :disabled="disabled"
                        :placeholder="$t('qualifiedProbability.minValue')"
                        @blur="handleBlurFrom"
                        @focus="handleFocusFrom"
                        @input="handleInputFrom"
                        @change="handleInputChangeFrom"
                    ></el-input>
                </div>

                <div>
                    <span>
                        <!-- 至 -->
                        {{ $t("deviceLoadTaskManage.to") }}
                    </span>
                </div>
                <div class="to">
                    <el-input
                        ref="input_to"
                        v-model="userInputTo"
                        :disabled="disabled"
                        :placeholder="$t('qualifiedProbability.maxValue')"
                        @blur="handleBlurTo"
                        @focus="handleFocusTo"
                        @input="handleInputTo"
                        @change="handleInputChangeTo"
                    ></el-input>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "InputNumberRange",

    props: {
        // 初始化范围
        value: { required: true },

        // 是否禁用
        disabled: {
            type: Boolean,
            default: false,
        },

        // 精度参数
        precision: {
            type: Number,
            default: 0,
            validator(val) {
                return val >= 0 && val === parseInt(val, 10);
            },
        },
        min: {
            type: Number,
            default: 0,
        },
        max: {
            type: Number,
            default: 100,
        },
    },

    data() {
        return {
            userInputForm: null,
            userInputTo: null,
        };
    },

    watch: {
        value: {
            immediate: true,
            handler(value) {
                /** 初始化范围 */
                if (value instanceof Array && this.precision !== undefined) {
                    this.userInputForm =
                        typeof value[0] === "number" ? value[0] : null;
                    this.userInputTo =
                        typeof value[1] === "number" ? value[1] : null;
                }
            },
        },
    },

    methods: {
        // 根据精度保留数字
        toPrecision(num, precision) {
            if (precision === undefined) precision = 0;
            return parseFloat(
                Math.round(num * Math.pow(10, precision)) /
                    Math.pow(10, precision)
            );
        },

        handleBlurFrom(event) {
            if (typeof this.userInputForm === "number") {
                this.userInputForm =
                    parseFloat(this.userInputForm) >= parseFloat(this.min)
                        ? parseFloat(this.userInputForm) <= parseFloat(this.max)
                            ? this.userInputForm
                            : this.max
                        : this.min;
            }
            if (
                typeof this.userInputForm === "number" &&
                typeof this.userInputTo === "number"
            ) {
                this.userInputForm =
                    parseFloat(this.userInputForm) <=
                    parseFloat(this.userInputTo)
                        ? this.userInputForm
                        : this.userInputTo;
            }
            this.$emit("input", [this.userInputForm, this.userInputTo]);
            this.$emit("blurfrom", event);
        },

        handleFocusFrom(event) {
            this.$emit("focusfrom", event);
        },

        handleBlurTo(event) {
            if (typeof this.userInputTo === "number") {
                this.userInputTo =
                    parseFloat(this.userInputTo) <= parseFloat(this.max)
                        ? parseFloat(this.userInputTo) >= parseFloat(this.min)
                            ? this.userInputTo
                            : this.min
                        : this.max;
            }

            if (
                typeof this.userInputForm === "number" &&
                typeof this.userInputTo === "number"
            ) {
                this.userInputTo =
                    parseFloat(this.userInputTo) >=
                    parseFloat(this.userInputForm)
                        ? this.userInputTo
                        : this.userInputForm;
            }

            this.$emit("input", [this.userInputForm, this.userInputTo]);
            this.$emit("blurto", event);
        },

        handleFocusTo(event) {
            this.$emit("focusto", event);
        },

        handleInputFrom(value) {
            this.$emit("inputfrom", value);
        },

        handleInputTo(value) {
            this.$emit("inputto", value);
        },

        // from输入框change事件
        handleInputChangeFrom(value) {
            // 如果是非数字空返回null
            if (isNaN(value) || value === "") {
                this.$emit("input", [null, this.userInputTo]);
                this.$emit("changefrom", this.userInputForm);
                return;
            }

            // 初始化数字精度
            this.userInputForm = this.setPrecisionValue(value);
            // this.userInputForm =
            //     parseFloat(this.userInputForm) >= parseFloat(this.min)
            //         ? this.userInputForm
            //         : this.min;
            // 如果from > to 将from值替换成to
            // if (typeof this.userInputTo === "number") {
            //     this.userInputForm =
            //         parseFloat(this.userInputForm) <=
            //         parseFloat(this.userInputTo)
            //             ? this.userInputForm
            //             : this.userInputTo;
            // }
            this.$emit("input", [this.userInputForm, this.userInputTo]);
            this.$emit("changefrom", this.userInputForm);
        },

        // to输入框change事件
        handleInputChangeTo(value) {
            // 如果是非数字空返回null
            if (isNaN(value) || value === "") {
                this.$emit("input", [this.userInputForm, null]);
                this.$emit("changefrom", this.userInputTo);
                return;
            }

            // 初始化数字精度
            this.userInputTo = this.setPrecisionValue(value);
            // this.userInputTo =
            //     parseFloat(this.userInputTo) <= parseFloat(this.max)
            //         ? this.userInputTo
            //         : this.max;
            // 如果to < tfrom 将to值替换成from
            // if (typeof this.userInputForm === "number") {
            //     this.userInputTo =
            //         parseFloat(this.userInputTo) >=
            //         parseFloat(this.userInputForm)
            //             ? this.userInputTo
            //             : this.userInputForm;
            // }
            this.$emit("input", [this.userInputForm, this.userInputTo]);
            this.$emit("changeto", this.userInputTo);
        },

        // 设置成精度数字
        setPrecisionValue(value) {
            if (this.precision !== undefined) {
                const val = this.toPrecision(value, this.precision);
                return val;
            }
            return null;
        },
    },
};
</script>
<style lang="less" scoped>
.input-number-range {
    // 取消element原有的input框样式
    /deep/.el-input__inner {
        border: 0px;
        margin: 0;
        padding: 0 15px;
        line-height: 30px;
        height: 30px;
        background-color: transparent;
        text-align: center;
    }
    .flex {
        display: flex;
        flex-direction: row;
        width: 100%;
        justify-content: center;
        align-items: center;
        background-color: #fff;
        border: 1px solid #dcdfe6;
        width: 300px;
        height: 32px;
        border-radius: 2px;
    }
    .is-disabled {
        background-color: #eef0f6;
        border-color: #e4e7ed;
        color: #c0c4cc;
        cursor: not-allowed;
    }
}
</style>
