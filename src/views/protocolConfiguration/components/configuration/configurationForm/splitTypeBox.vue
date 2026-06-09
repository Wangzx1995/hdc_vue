<template>
    <div class="split-type-box">
        <div :class="`content content-${splitType}`">
            <template v-if="Number(splitType) < 100">
                <div
                    :class="`type type-${item}`"
                    v-for="item in Number(splitType)"
                    :key="item"
                >
                    <template v-if="bindsList.length">
                        <div v-if="isDetail" class="detail">
                            <span
                                v-if="
                                    splitChans.includes(
                                        Number(bindsList[item - 1].chanNo)
                                    )
                                "
                            >
                                通道{{ bindsList[item - 1].chanNo }}
                            </span>
                            <span v-else></span>
                        </div>
                        <el-select
                            v-else
                            v-model="bindsList[item - 1].chanNo"
                            placeholder="请选择"
                            @change="chanNoChange"
                        >
                            <el-option
                                v-for="i in splitChans"
                                :key="i"
                                :label="`通道${i}`"
                                :value="i"
                            >
                            </el-option>
                        </el-select>
                    </template>
                </div>
            </template>
            <template v-else>
                <div
                    :class="`type type-${item}`"
                    v-for="item in Number(2)"
                    :key="item"
                >
                    <template v-if="bindsList.length">
                        <template
                            v-if="
                                (Number(splitType) === 101 && item === 1) ||
                                (Number(splitType) === 102 && item === 2)
                            "
                        >
                            <div>环视</div>
                        </template>
                        <template v-else>
                            <div v-if="isDetail" class="detail">
                                <span
                                    v-if="
                                        splitChans.includes(
                                            Number(bindsList[item - 1].chanNo)
                                        )
                                    "
                                >
                                    通道{{ bindsList[item - 1].chanNo }}
                                </span>
                                <span v-else></span>
                            </div>
                            <el-select
                                v-else
                                v-model="bindsList[item - 1].chanNo"
                                placeholder="请选择"
                                @change="chanNoChange"
                            >
                                <el-option
                                    v-for="i in splitChans"
                                    :key="i"
                                    :label="`通道${i}`"
                                    :value="i"
                                >
                                </el-option>
                            </el-select>
                        </template>
                    </template>
                </div>
            </template>
        </div>
    </div>
</template>
<script>
export default {
    name: "",
    components: {},
    props: {
        splitChans: {
            type: Array,
            default: () => [],
        },
        splitType: {
            type: [Number, String],
            default: "",
        },
        value: {
            type: [Number, String],
            default: "",
        },
        splitChanBinds: {
            type: Array,
            default: () => [],
        },
        isDetail: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            bindsList: [],
        };
    },
    mounted() {
        this.bindsList = this.splitChanBinds.sort(this.sortBy("bindIndex"));
    },
    computed: {},
    watch: {
        splitType(val) {
            this.bindsList = [];
            if (Number(val) < 100) {
                for (let i = 0; i < Number(val); i++) {
                    this.bindsList.push({
                        chanNo: i + 1,
                        bindIndex: i,
                    });
                }
            } else {
                this.bindsList = [
                    {
                        chanNo: Number(val) === 101 ? 0 : 1,
                        bindIndex: 0,
                    },
                    {
                        chanNo: Number(val) === 101 ? 1 : 0,
                        bindIndex: 1,
                    },
                ];
            }
            this.chanNoChange();
        },
        splitChanBinds: {
            handler(val) {
                // if (this.isDetail) {
                let newVal = JSON.parse(JSON.stringify(val));
                this.bindsList = newVal.sort(this.sortBy("bindIndex"));
                // }
            },
            deep: true,
        },
    },
    methods: {
        sortBy(field) {
            //根据传过来的字段进行排序
            return (x, y) => {
                return x[field] - y[field];
            };
        },
        chanNoChange() {
            this.bindsList.forEach((item) => {
                if (!this.splitChans.includes(item.chanNo)) {
                    item.chanNo = 0;
                }
            });
            this.$emit("chanNoChange", this.bindsList, this.value);
        },
    },
};
</script>
<style lang="less" scoped>
.split-type-box {
    width: 400px;
    height: 250px;
    display: flex;
    & > div {
        width: 100%;
        height: 100%;
    }
    .content {
        position: relative;
        padding: 0 !important;
        .el-select {
            width: 90px !important;
        }
        .type {
            background: #cccccc;
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            /deep/ .el-select {
                width: 90px;
                input {
                    border: none;
                }
            }
            .detail {
                padding: 5px 8px;
                width: 90px;
                height: 32px;
                line-height: 22px;
                background: #ffffff;
            }
        }
    }
    .content-1 {
        .type-1 {
            width: 100%;
            height: 100%;
        }
    }
    .content-2 {
        display: flex;
        justify-content: space-between;
        .type {
            width: 190px;
        }
    }
    .content-4 {
        display: flex;
        flex-wrap: wrap;
        .type {
            width: 190px;
            height: 115px;
        }
        .type-1 {
            margin: 0 20px 20px 0;
        }
        .type-3 {
            margin: 0px 20px 0 0;
        }
    }
    .content-6 {
        display: flex;
        flex-wrap: wrap;
        .type {
            position: absolute;
            width: 120px;
            height: 70px;
        }
        .type-1 {
            width: 260px;
            height: 160px;
            top: 0;
            left: 0;
        }
        .type-2 {
            top: 0;
            right: 0;
        }
        .type-3 {
            top: 90px;
            right: 0;
        }
        .type-4 {
            bottom: 0;
            right: 0;
        }
        .type-5 {
            bottom: 0;
            left: 140px;
        }
        .type-6 {
            bottom: 0;
            left: 0;
        }
    }
    .content-9 {
        display: flex;
        flex-wrap: wrap;
        .type {
            width: 120px;
            height: 70px;
        }
        .type-2,
        .type-8 {
            margin: 0 20px;
        }
        .type-5 {
            margin: 20px;
        }
        .type-4,
        .type-6 {
            margin: 20px 0 0 0;
        }
    }
    /deep/.content-16 {
        display: flex;
        flex-wrap: wrap;
        .el-select {
            width: 80px !important;
            .el-input__inner {
                font-size: 12px;
            }
        }
        .detail {
            width: 80px !important;
        }
        .type {
            width: 90px;
            height: 50px;
        }
        .type-1,
        .type-2,
        .type-3 {
            margin-right: 13px;
        }
        .type-5,
        .type-6,
        .type-7,
        .type-9,
        .type-10,
        .type-11,
        .type-13,
        .type-14,
        .type-15 {
            margin: 13px 13px 0 0;
        }
        .type-8,
        .type-12,
        .type-16 {
            margin-top: 13px;
        }
    }
    .content-101 {
        display: flex;
        justify-content: space-between;
        .type-1 {
            width: 126px;
        }
        .type-2 {
            width: 254px;
        }
    }
    .content-102 {
        display: flex;
        justify-content: space-between;
        .type-1 {
            width: 254px;
        }
        .type-2 {
            width: 126px;
        }
    }
}
</style>
