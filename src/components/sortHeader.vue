<template>
    <div>
        <div style="width: 100%; display: flex">
            <div class="checkbox-container">
                <div style="height: 34px; padding: 5px 0; font-size: 12px">
                    <!-- 需显示的字段 -->
                    {{ $t("sortHeader.fieldsDisplayed") }}
                </div>
                <el-checkbox-group
                    v-model="tableHead"
                    style="display: flex; flex-wrap: wrap"
                >
                    <el-checkbox
                        :label="item.fieldNameEN"
                        v-for="item in tableHeadSelection"
                        :key="item.fieldNameEN"
                        style="margin-bottom: 15px; width: 200px"
                        >{{ item.fieldNameCN }}
                    </el-checkbox>
                </el-checkbox-group>
            </div>
            <div class="sort-div b-l">
                <el-table
                    :data="showTableHeadDataCopy"
                    ref="sortHeadRef"
                    style="width: 250px"
                    height="100%"
                    :stripe="false"
                    :empty-text="' '"
                >
                    <!-- 显示顺序 -->
                    <el-table-column
                        prop="label"
                        :label="$t('sortHeader.order')"
                    >
                        <template slot-scope="{ row, col, $index }">
                            <div :key="row.fieldNameEN">
                                {{ row.fieldNameCN }}
                                <div class="drop-icon">
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <div class="text-right m-t">
            <el-button @click="reDefault">
                <!-- 恢复默认 -->
                {{ $t("sortHeader.restoreDefault") }}
            </el-button>
            <el-button type="primary" @click="comfirm">
                <!-- 确定 -->
                {{ $t("common.ok") }}
            </el-button>
        </div>
    </div>
</template>

<script>
import Sortable from "sortablejs";
export default {
    name: "sortHeader",
    props: {
        /**
         * @param tableHeadSelection {fieldNameEN，fieldNameCN}
         *
         *  */
        tableHeadSelection: {
            type: Array,
            default: () => {
                return [];
            },
        },
        /**
         * @param showTableHeadData
         *
         *  */
        showTableHeadData: {
            type: Array,
            default: () => {
                return [];
            },
        },
        /**
         * @param defaultUnvisible
         * 默认不选的字段
         *  */
        defaultUnvisible: {
            type: Array,
            default: () => {
                return [];
            },
        },
        headMsg: {
            type: Object,
            default: () => {
                return {};
            },
        },
        visible: {
            type: Boolean,
            default: false,
        },
    },
    model: {
        prop: "showTableHeadData",
        event: "changeShowTable",
    },
    data() {
        return {
            showTableHeadDataCopy: [],
            tableHead: [],
            watcher_tableHead_flag: false,
            watcher_dataCopy_flag: false,
        };
    },
    methods: {
        /* 恢复默认 */
        reDefault() {
            this.showTableHeadDataCopy = [];
            this.$nextTick(() => {
                this.tableHead = this.tableHeadSelection.map(
                    ({ fieldNameEN }) => {
                        if (this.defaultUnvisible.includes(fieldNameEN)) {
                            return;
                        } else {
                            return fieldNameEN;
                        }
                    }
                );
                //this.$emit("changeShowTable", this.showTableHeadDataCopy);
                //this.$emit("comfirm", true);
            });
        },
        comfirm() {
            if (this.showTableHeadDataCopy.length === 0) {
                // this.$message.warning("表头不能为空!");
                this.$message.warning(this.$t("sortHeader.headerCannotEmpty"));
                return;
            }
            if (this.headMsg && this.headMsg.tableType !== undefined) {
                this.savetableHead();
            } else {
                this.$emit("changeShowTable", this.showTableHeadDataCopy);
                this.$emit("comfirm", true);
            }
        },
        //保存数据至后台
        savetableHead() {
            debugger;
            let param = {
                tableColumnVoList: this.showTableHeadDataCopy,
                tableShowList: JSON.stringify(this.showTableHeadDataCopy),
            };
            let url = "addTablePersonaliseSet";
            if (this.headMsg && this.headMsg.createId === undefined) {
                param.tableType = this.headMsg.tableType;
            } else {
                url = "updateTablePersonaliseSet";
                param = {
                    tableColumnVoList: this.showTableHeadDataCopy,
                    createId: this.headMsg.createId,
                    id: this.headMsg.id,
                    tableType: this.headMsg.tableType,
                };
            }
            this.$api[url](param)
                .then((res) => {
                    if (!res.success) {
                        this.$message.error(res.msg);
                    } else {
                        this.$emit(
                            "changeShowTable",
                            this.showTableHeadDataCopy
                        );
                    }
                })
                .catch(() => {});
        },
        pullSort() {
            //监听拖动事件
            const el = this.$refs.sortHeadRef.$el.querySelectorAll(
                ".el-table__body-wrapper > table > tbody"
            )[0];
            this.sortable = Sortable.create(el, {
                sort: true,
                animation: 500,
                onEnd: (e) => {
                    const currRow = this.showTableHeadDataCopy.splice(
                        e.oldIndex,
                        1
                    )[0];
                    this.showTableHeadDataCopy.splice(e.newIndex, 0, currRow);
                    const newArr = this.showTableHeadDataCopy.slice(0);
                    this.showTableHeadDataCopy = [];
                    this.$nextTick(() => {
                        this.showTableHeadDataCopy = newArr;
                    });
                },
            });
        },
    },
    watch: {
        showTableHeadData: {
            handler(newVal) {
                this.showTableHeadDataCopy = this.$deepCopy(newVal);
            },
            immediate: true,
        },
        tableHead: {
            handler(newVal, oldVal) {
                if (this.watcher_tableHead_flag) {
                    return;
                }
                if (newVal.length > oldVal.length) {
                    let newList = newVal.filter((item) => {
                        return !oldVal.includes(item);
                    });
                    let List = this.tableHeadSelection.filter((item) => {
                        return newList.includes(item.fieldNameEN);
                    });
                    // 添加
                    this.showTableHeadDataCopy = [
                        ...this.showTableHeadDataCopy,
                        ...List,
                    ];
                } else if (newVal.length < oldVal.length) {
                    //删除
                    let filterFieldNameEN = oldVal.filter(
                        (v) => !newVal.includes(v)
                    );
                    let filterIndex;
                    for (
                        var i = 0;
                        i < this.showTableHeadDataCopy.length;
                        i++
                    ) {
                        if (
                            this.showTableHeadDataCopy[i].fieldNameEN ===
                            filterFieldNameEN[0]
                        ) {
                            filterIndex = i;
                        }
                    }
                    this.showTableHeadDataCopy.splice(filterIndex, 1);
                }
            },
            deep: true,
        },
        showTableHeadDataCopy: {
            handler(newVal) {
                if (this.watcher_dataCopy_flag) {
                    return;
                }
                this.watcher_tableHead_flag = true;
                this.tableHead = newVal.map(({ fieldNameEN }) => {
                    return fieldNameEN;
                });
                this.$nextTick(() => {
                    this.watcher_tableHead_flag = false;
                });
            },
            immediate: true,
        },
        visible: {
            handler(val) {
                this.showTableHeadDataCopy = val
                    ? this.$deepCopy(this.showTableHeadData)
                    : [];
            },
        },
    },
    created() {
        if (this.showTableHeadData.length === 0) {
            this.tableHead = this.tableHeadSelection.map(({ fieldNameEN }) => {
                if (this.defaultUnvisible.includes(fieldNameEN)) {
                    return;
                } else {
                    return fieldNameEN;
                }
            });
            this.showTableHeadDataCopy = this.tableHeadSelection.filter(
                (item) => !this.defaultUnvisible.includes(item.fieldNameEN)
            );
        }
    },
    mounted() {
        this.pullSort();
    },
};
</script>

<style lang="less" scoped>
.sort-div {
    width: 250px;
    height: 466px;
    top: 60px;
    padding-left: 1rem;
    right: 0rem;

    .cell,
    .is-leaf {
        background-color: #fff;
        font-size: 12px;
        font-weight: 500;
    }

    .el-table th.gutter {
        background-color: #fff;
    }

    .el-table__body tr:hover > td {
        background-color: #fff;
    }

    ::-webkit-scrollbar-thumb {
        background-color: rgba(0, 0, 0, 0.1);
    }
}

.checkbox-container {
    width: 690px;
    max-height: 600px;
    // /deep/.el-checkbox{
    //     overflow: hidden;
    // }
    /deep/.el-checkbox__label {
        min-width: 120px;
    }
}

.drop-icon {
    float: right;
    margin-top: 7px;
    cursor: pointer;

    div {
        width: 15px;
        height: 2px;
        margin-bottom: 2px;
        background-color: #dddddd;
    }
}
</style>
