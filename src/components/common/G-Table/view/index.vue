<template>
    <div class="G-Table" v-loading="loading">
        <div :style="{ height: tableHeight + 'px' }" class="table-box">
            <el-table
                v-if="tableType === 'table'"
                ref="table"
                size="medium"
                tooltip-effect="dark"
                :border="true"
                stripe
                :data="tableData"
                :max-height="tableHeight"
                :row-key="rowKey"
                :highlight-current-row="highlightCurrentRow"
                @current-change="currentChange"
                @select="select"
                @select-all="selectAll"
                @selection-change="selectionChange"
                @row-click="rowClick"
                @row-dblclick="rowDblclick"
                @sort-change="onSortChange"
            >
                <template v-for="(item, index) in columns">
                    <el-table-column
                        v-if="!item.slot"
                        :fixed="item.fixed"
                        :key="(item.prop || item.type) + index"
                        :type="item.type"
                        :selectable="item.selectable"
                        :prop="item.prop"
                        :sortable="item.sortable"
                        :label="item.label"
                        :width="item.width"
                        :show-overflow-tooltip="true"
                        :min-width="item.minWidth"
                        :align="item.align"
                        :reserve-selection="true"
                    >
                        <template slot="header">
                            <el-tooltip
                                effect="dark"
                                :content="item.label"
                                placement="top-start"
                            >
                                <span>{{ item.label }}</span>
                            </el-tooltip>
                        </template>
                    </el-table-column>

                    <el-table-column
                        v-else
                        :key="`index'${index}`"
                        :type="item.type"
                        :selectable="item.selectable"
                        :prop="item.prop"
                        :sortable="item.sortable"
                        :label="item.label"
                        :width="item.width"
                        :min-width="item.minWidth"
                        :align="item.align"
                    >
                        <template slot-scope="scope">
                            <slot :name="item.slot" :data="scope.row"></slot>
                        </template>
                    </el-table-column>
                </template>
                <template slot="empty">
                    <slot name="empty"></slot>
                </template>
            </el-table>
            <template v-else>
                <div v-for="(item, index) in tableData" :key="index">
                    <slot :data="item" :index="index" name="card"></slot>
                </div>
                <div class="no-data" v-if="!tableData.length">暂无数据</div>
            </template>
        </div>
        <el-pagination
            ref="pagination"
            class="pagination text-left"
            layout="total,prev,pager,next,sizes,jumper"
            :current-page="pagination.currentPage"
            :page-size="pagination.pageSize"
            :page-sizes="pageSizes"
            :total="total"
            :background="true"
            @size-change="pageSizeChange"
            @current-change="pageCurrentChange"
        >
        </el-pagination>
    </div>
</template>

<script>
import fetch from "@/utils/fetch";
import utils from "@/utils/base";
export default {
    name: "G-Table",
    props: {
        //固定高度
        fixedTabelHeight: {
            type: Number,
            default: 0,
        },
        //表格头部字段
        columns: {
            type: Array,
            default: () => [],
        },
        //计算高度的dom
        calcHeightRefs: {
            type: Array,
            default: () => [],
        },
        //数据请求url
        url: {
            type: String,
            default: "",
        },
        //表格类型  表格:"table"    卡片:"card"
        tableType: {
            type: String,
            default: "table",
        },
        //分页大小
        pageSizes: {
            type: Array,
            default: () => [20, 50, 100],
        },
        //数据请求方式编码
        applicationJson: {
            type: Boolean,
            default: false,
        },
        highlightCurrentRow: {
            type: Boolean,
            default: false,
        },
        //自定义高度值
        customHeight: {
            type: Number,
            default: 0,
        },
        //表格唯一row-key
        rowKey: {
            type: String,
            default: "id",
        },
        //手动分页数据
        handleData: {
            type: Array | null,
            default: () => {
                return null;
            },
        },
    },
    data() {
        return {
            //加载loading
            loading: false,
            //table数据
            tableData: [],
            //总条数
            total: 0,
            //分页参数
            pagination: {
                currentPage: 1, //页码，从1开始
                pageSize: 20, //分页大小
            },
            oldPage: 1,
            //table高度
            tableHeight: 100,
        };
    },
    watch: {
        handleData() {
            this.searchTable();
        },
    },
    mounted() {
        window.addEventListener("resize", this.tableResize);
        this.$nextTick(() => {
            this.tableResize();
        });
    },
    methods: {
        /**
         * tableResize
         * @description: 表格高度自适应变化
         */
        tableResize() {
            if (this.fixedTabelHeight) {
                this.tableHeight = this.fixedTabelHeight;
                return;
            }
            let paginationHeight = this.$refs.pagination
                ? this.$refs.pagination.$el.offsetHeight
                : 60;
            this.tableHeight =
                utils.getTableHeight.call(
                    this.$parent,
                    ...this.calcHeightRefs
                ) -
                paginationHeight -
                30 -
                this.customHeight;
        },
        /**
         * pageSizeChange
         * @description: pageSize 改变时会触发
         * @param {Number} limit 每页条数
         */
        pageSizeChange(limit) {
            this.pagination.pageSize = limit;
            this.pagination.currentPage = 1;
            this.$emit("pageChange");
        },
        /**
         * pageCurrentChange
         * @description: currentPage 改变时会触发
         * @param {Number} page 当前页
         */
        pageCurrentChange(page) {
            this.oldPage = this.pagination.currentPage;
            this.pagination.currentPage = page;
            this.$emit("pageChange");
        },
        /**
         * searchTable
         * @description: 搜索
         * @param {Object} params 查询参数
         */
        searchTable(params = {}, isSearchBtn = false) {
            this.loading = true;
            this.$emit("formatParams", params);
            if (isSearchBtn) {
                this.pagination.currentPage = 1;
            }
            if (this.handleData !== null) {
                this.tableData = [];
                this.$nextTick(() => {
                    this.tableData = this.pageInWeb(params);
                    this.total = this.handleData.length;
                    this.$nextTick(() => {
                        this.tableResize();
                    });
                    this.loading = false;
                });
            } else {
                fetch({
                    headers: {
                        "Content-Type": this.applicationJson
                            ? "application/json"
                            : "application/x-www-form-urlencoded",
                    },
                    url: this.url,
                    method: "post",
                    data: { ...params, ...this.pagination },
                })
                    .then((res) => {
                        if (res.success === true) {
                            this.tableData = [];
                            this.$nextTick(() => {
                                this.tableData = res.data.results;
                                this.total = res.data.totalRecords;
                                this.$nextTick(() => {
                                    this.tableResize();
                                    this.$emit("loadSuccess", res.data, {
                                        ...params,
                                        ...this.pagination,
                                    });
                                });
                                this.loading = false;
                            });
                        } else {
                            this.pagination.currentPage = this.oldPage;
                            this.loading = false;
                            this.$message.error(res.msg);
                        }
                    })
                    .catch((err) => {
                        this.loading = false;
                    });
            }
        },
        /**
         * pageInWeb
         * @description: 前端手动排序，分页
         * @param {Object} params 外部传入的条件
         */
        pageInWeb(params) {
            let tableData = this.handleData.slice(
                (this.pagination.currentPage - 1) * this.pagination.pageSize,
                this.pagination.currentPage * this.pagination.pageSize
            );
            return tableData;
        },
        currentChange(row) {
            this.$emit("currentChange", row);
        },
        /**
         * select
         * @description: 当用户手动勾选数据行的 Checkbox 时触发的事件
         * @param {Array} selection 勾选的数据数组
         * @param {Object} row 当前勾选的数据对象
         */
        select(selection, row) {
            this.$emit("select", selection, row);
        },
        /**
         * selectAll
         * @description: 当用户手动勾选全选 Checkbox 时触发的事件
         * @param {Array} selection 勾选的数据数组
         */
        selectAll(selection) {
            this.$emit("selectAll", selection);
        },
        /**
         * selectionChange
         * @description: 当选择项发生变化时会触发该事件
         * @param {Array} selection 勾选的数据数组
         */
        selectionChange(selection) {
            this.$emit("selectionChange", selection);
        },
        /**
         * rowClick
         * @description: 当某一行被点击时会触发该事件
         * @param {Object} row 点击的行
         * @param {Object} column 点击的column属性
         * @param {Object} event event
         */
        rowClick(row, column, event) {
            this.$emit("rowClick", row, column, event);
        },
        /**
         * rowDblclick
         * @description: 当某一行被双击时会触发该事件
         * @param {Object} row 点击的行
         * @param {Object} column 点击的column属性
         * @param {Object} event event
         */
        rowDblclick(row, column, event) {
            this.$emit("rowClick", row, column, event);
        },
        /**
         * onSortChange
         * @description: 排序点击事件
         */
        onSortChange(data) {
            let key = data.prop;
            let order = data.order;
            order = order === "descending" ? "desc" : "asc";
            this.pagination = {
                ...this.pagination,
                ...{ orderColumn: key, orderDir: order },
            };
            this.$emit("pageChange");
        },
        clearSelection() {
            this.$refs.table.clearSelection();
        },
    },
    beforeDestroy() {
        window.removeEventListener("resize", this.tableResize);
    },
};
</script>
<style lang="less" scoped>
.G-Table {
    background: #ffffff;
    .table-box {
        display: flex;
        flex-wrap: wrap;
        overflow-y: auto;
    }
}
.pagination {
    padding: 12px 0px !important;
}
/deep/.el-table {
    height: 100%;
    .el-table__body-wrapper {
        height: calc(~"100% - 34px") !important;
    }
}
.no-data {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #909399;
    font-size: 12px;
}
</style>
