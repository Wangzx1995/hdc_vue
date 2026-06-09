<template>
    <div style="height: 100%;">
        <el-input @change="inputVal($event, 'popupDisplayFrequency', 10, 1)" v-model="model" :style="{ width: width }" :placeholder="placeholder" @blur="blur($event)">
            <div slot="suffix" style="font-Size:12px;line-height: 28px;" v-if="nautical">{{ nautical }}</div>
        </el-input>
    </div>
</template>

<script>
export default {
    name: "G-Number-input",
    props: {
        placeholder: {
            type: null,
            default: ""
        },
        notNull: {
            type: Boolean,
            default:false,
        },
        width: {
            type: null,
            default: "120px"
        },
        modelData: {
            type: null
        },
        nautical: {
            type: null,
            default:null
        },
        formDataList: {
            type: Array,
            default: () => {
                return [{}, "", 100, 1];
            }
        }
    },
    model: {
        prop: "modelData",
        event: "change"
    },
    data() {
        return {
            model: ""
        };
    },
    computed: {
        formData() {
            return this.formDataList[0];
        },
        itemName() {
            return this.formDataList[1];
        },
        max() {
            return this.formDataList[2];
        },
        min() {
            return this.formDataList[3];
        },
        index() {
            return this.formDataList[4];
        }
    },
    watch: {
        modelData: {
            handler(value) {
                this.model = value;
            },
            immediate: true
        },
        model(value) {
            this.$emit("change", value);
        }
    },
    methods: {
        blur($event) {
            this.$emit('blur',$event);  
        },
        inputVal(newValue) {
            let val = "";
            var reg = /^[+-]?[0-9]+$/;
            if (newValue == "" || !reg.test(newValue)) {
                val = this.notNull ? this.min : "";
            } else {
                val = Math.ceil(newValue - 0);
                if (val > this.max) {
                    val = this.max;
                } else if (val < this.min) {
                    val = this.min;
                }
            }
            if (this.index===undefined) {
                this["formData"][this.itemName] = val;
            } else {
                this["formData"][this.itemName][this.index] = val;
            }
        }
    }
};
</script>

<style></style>
