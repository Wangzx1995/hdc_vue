<template>
    <div>
        <el-input
            v-if="item.type === 'input' && !item.number"
            v-model="componentValue"
            :clearable="item.clearable"
            :maxlength="item.maxlength"
            :minlength="item.minlength"
            :show-word-limit="item.showWordLimit"
            @change="formItemValueChange"
        ></el-input>
        <el-input
            v-if="item.type === 'input' && item.number"
            v-model.number="componentValue"
            :clearable="item.clearable"
            :maxlength="item.maxlength"
            :minlength="item.minlength"
            :show-word-limit="item.showWordLimit"
            @change="formItemValueChange"
        ></el-input>
    </div>
</template>
<script>
export default {
    name: "G-ConfigurationForm",
    components: {},
    model: {
        prop: "formItemValue",
        event: "formItemValueChange",
    },
    props: {
        formItemValue: {
            type: [String, Number],
            default: "",
        },
        item: {
            type: Object,
            default: () => {},
        },
    },
    data() {
        return {
            componentValue: this.formItemValue,
        };
    },
    mounted() {},
    computed: {},
    watch: {
        formItemValue(val) {
            this.componentValue = val;
        },
    },
    methods: {
        formItemValueChange() {
            this.$emit("formItemValueChange", this.componentValue);
        },
    },
};
</script>
<style lang="less" scoped></style>
