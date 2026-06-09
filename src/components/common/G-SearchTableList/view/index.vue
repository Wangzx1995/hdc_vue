<template>
    <div class="G-SearchTableList p-x p-t">
        <G-SearchBar
            ref="searchDiv"
            :isSearchFirst="isSearchFirst"
            :formList="formList"
            :submitBtnText="submitBtnText"
            :showSubmitBtn="showSubmitBtn"
            :showClearBtn="showClearBtn"
            :isSearchTableList="true"
            @treeClear="$emit('treeClear')"
            @searchForm="searchForm"
            @resetForm="resetForm"
        >
            <template v-slot:[item.slot]="scope" v-for="item in formList">
                <slot
                    :name="item.slot"
                    :data="scope.data"
                    v-if="item.slot"
                ></slot>
            </template>
            <template slot="btnOperation">
                <slot name="btnOperation"></slot>
            </template>
            <template slot="searchOperation">
                <slot name="searchOperation"></slot>
            </template>
        </G-SearchBar>
        <G-Table
            ref="GTable"
            v-if="showTable"
            :handleData="handleData"
            :columns="columns"
            :url="url"
            :fixedTabelHeight="fixedTabelHeight"
            :calcHeightRefs="calcHeightRefs"
            :tableType="tableType"
            :pageSizes="pageSizes"
            :customHeight="customHeight"
            :applicationJson="applicationJson"
            :rowKey="rowKey"
            :highlightCurrentRow="highlightCurrentRow"
            @pageChange="search"
            @formatParams="formatParams"
            @loadSuccess="loadSuccess"
            @currentChange="currentChange"
            @select="select"
            @selectAll="selectAll"
            @selectionChange="selectionChange"
            @rowClick="rowClick"
            @rowDblclick="rowDblclick"
        >
            <template slot="card" slot-scope="scope">
                <slot
                    name="card"
                    :data="scope.data"
                    :index="scope.index"
                ></slot>
            </template>
            <template v-slot:[item.slot]="scope" v-for="item in columns">
                <slot
                    :name="item.slot"
                    :data="scope.data"
                    v-if="item.slot"
                ></slot>
            </template>
        </G-Table>
        <div :style="{ height: slotHeight + 'px' }" v-else>
            <slot name="tabs"></slot>
        </div>
    </div>
</template>
<script>
import utils from "@/utils/base";
export default {
    name: "G-SearchTableList",
    components: {},
    props: {
        //第一次是否查询
        isSearchFirst: {
            type: Boolean,
            default: true,
        },
        //前端分页时，需要的数据
        handleData: {
            type: Array | null,
            default: () => {
                return null;
            },
        },
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
        //表单配置项
        formList: {
            type: Array,
            default: () => [],
        },
        //数据请求url
        url: {
            type: String,
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
        //展示表格
        showTable: {
            type: Boolean,
            default: true,
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
        //查询框文字
        submitBtnText: {
            type: String,
            default: "查询",
        },
        //是否显示查询按钮
        showSubmitBtn: {
            type: Boolean,
            default: true,
        },
        //是否显示清除按钮
        showClearBtn: {
            type: Boolean,
            default: true,
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
    },
    data() {
        return {
            //计算高度的dom
            calcHeightRefs: ["searchDiv"],
            //插槽高度
            slotHeight: 0,
        };
    },
    mounted() {},
    computed: {},
    watch: {
        //切换table和slot展示时，设置浏览器resize事件
        showTable(val) {
            if (val) {
                this.search();
                window.removeEventListener("resize", this.slotResize);
            } else {
                window.removeEventListener(
                    "resize",
                    this.$refs.GTable.tableResize
                );
                this.$nextTick(() => {
                    this.slotResize();
                    window.addEventListener("resize", this.slotResize);
                });
            }
        },
    },
    methods: {
        /**
         * @description: 手动对表单进行loading或者结束loading
         *
         */
        toggleLoading(loadingBoolean = true) {
            this.$refs.GTable.loading = loadingBoolean;
        },
        /**
         * search
         * @description: 手动更新表格高度
         */
        manualTableResize() {
            this.$refs.GTable.tableResize();
        },
        /**
         * search
         * @description: 表单搜索
         * @param {Boolean} isSearchBtn 是否是查询bar搜索，是则重置为第一页
         */
        search(isSearchBtn = false) {
            this.$refs.searchDiv.validateForm(isSearchBtn);
        },
        /**
         * searchForm
         * @description: 表单搜索
         * @param {Object} formData 表单数据
         */
        searchForm(formData, isSearchBtn) {
            this.$nextTick(() => {
                if (this.$refs.GTable) {
                    this.$refs.GTable.searchTable(formData, isSearchBtn);
                } else {
                    this.formatParams(formData);
                }
            });
        },
        /**
         * resetForm
         * @description: 重置表单
         */
        resetForm() {
            this.$emit("resetForm", this.$refs.searchDiv.getFormValues());
        },
        /**
         * getFormValues
         * @description: 获取表单数据
         */
        getFormValues() {
            return this.$refs.searchDiv.getFormValues();
        },
        /**
         * loadSuccess
         * @description: table数据请求成功后的回调
         * @param {Object} tableData table数据
         */
        loadSuccess(tableData, ...args) {
            this.$emit("loadSuccess", tableData, ...args);
        },
        /**
         * formatParams
         * @description: 格式化params参数
         * @param {Object} params 请求参数
         */
        formatParams(params) {
            this.$emit("formatParams", params);
        },
        /**
         * slotResize
         * @description: 表格高度自适应变化
         */
        slotResize() {
            this.slotHeight =
                utils.getTableHeight.call(this, ...this.calcHeightRefs) - 32;
            this.$emit("slotResize");
        },
        /**
         * setFormValues
         * @description: 查询表单设值
         * @param {Object} val 表单数据
         */
        setFormValues(val) {
            this.$refs.searchDiv.setFormValues(val);
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
        clearSelection() {
            this.$refs.GTable.clearSelection();
        },
    },
    beforeDestroy() {
        if (this.$refs.GTable) {
            window.removeEventListener("resize", this.$refs.GTable.tableResize);
        } else {
            window.removeEventListener("resize", this.slotResize);
        }
    },
};
</script>
<style lang="less" scoped>
.G-SearchTableList {
    background: #ffffff;
}
</style>
