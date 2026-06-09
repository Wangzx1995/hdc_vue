<template>
    <div v-clickoutside="hidePop" class="h-tree-select-wrap">
        <div
            ref="reference"
            :class="{ 'is-disabled': disabled }"
            :title="nodeNames"
            class="h-tree-select"
            @mouseenter="inputHover = true"
            @mouseleave="inputHover = false"
            @click.stop="toggePop"
        >
            <template v-if="showCheckbox">
                <div
                    v-if="collapseTags"
                    :style="{ 'max-width': `${contentWidth - ICON_PADDING}px` }"
                    class="h-tree-select__tag-wrap is-nowrap"
                >
                    <el-tag
                        v-if="selectNodes.length > 0"
                        :closable="!disabled"
                        disable-transitions
                        type="primary"
                        @close.stop="closeTag(selectNodes[0])"
                    >
                        {{ selectNodes[0].label }}
                    </el-tag>
                    <el-tag
                        v-if="selectNodes.length > 1"
                        :closable="false"
                        type="primary"
                        disable-transitions
                        max-width=""
                    >
                        +{{ selectNodes.length - 1 }}
                    </el-tag>
                </div>
                <div
                    v-else
                    :class="{ 'is-nowrap': multipleNowrap }"
                    :style="{ 'max-width': `${contentWidth - ICON_PADDING}px` }"
                    class="h-tree-select__tag-wrap"
                >
                    <el-tag
                        v-for="(selectNode, index) in selectNodes"
                        :key="index"
                        :closable="!disabled"
                        disable-transitions
                        type="primary"
                        @close.stop="closeTag(selectNode)"
                    >
                        {{ selectNode.label }}
                    </el-tag>
                </div>
            </template>
            <span v-else class="selected-text">
                {{ nodeNames }}
            </span>
            <span v-show="!nodeNames" class="placeholder">
                {{ placeholder2 }}
            </span>
            <i
                :class="inputIconClass"
                class="h-tree-select__input-icon"
                @click="inputIconClick"
            />
        </div>
        <transition name="el-zoom-in-top" @after-leave="doDestroy">
            <h-tree-select-dropdown
                v-show="isShowPop"
                ref="popper"
                :width="contentWidth"
                style="z-index: 3000"
            >
                <div class="h-tree-select-main">
                    <el-input
                        v-if="showSearch"
                        v-model="treeSearch"
                        :placeholder="searchPlaceholder2"
                        :on-icon-click="
                            (e) => onIconClick && onIconClick(e, treeSearch)
                        "
                        class="h-tree-select__search"
                        clearable
                        suffix-icon="el-icon-search"
                        @keydown.enter.native="
                            (e) => onIconClick && onIconClick(e, treeSearch)
                        "
                    />
                    <div v-loading="treeLoading" class="h-tree-select-content">
                        <el-tree
                            ref="tree"
                            :data="treeData"
                            :show-checkbox="showCheckbox"
                            :highlight-current="!showCheckbox"
                            :node-key="nodeKey"
                            :filter-node-method="filterNode"
                            :scroll-size="8"
                            :default-expanded-keys="defaultExpandKeys"
                            :empty-text="emptyText"
                            :parent-key="parentKey"
                            :props="props"
                            :load="load"
                            :lazy="lazy"
                            :render-content="renderContent"
                            :default-icon="defaultIcon"
                            :simple-data="simpleData"
                            :expand-on-click-node="expandOnClickNode"
                            :check-strictly="checkStrictly"
                            :check-on-click-node="checkOnClickNode"
                            :default-expand-all="defaultExpandAll"
                            auto-expand-parent
                            @node-click="nodeClick"
                            @check="checkChange"
                            @node-dbclick="
                                (data, node, vm, event) =>
                                    $emit('node-dbclick', data, node, vm, event)
                            "
                            @node-contextmenu="
                                (data, node, vm, event) =>
                                    $emit(
                                        'node-contextmenu',
                                        data,
                                        node,
                                        vm,
                                        event
                                    )
                            "
                            @check-change="
                                (data, check, childCheck) =>
                                    $emit(
                                        'check-change',
                                        data,
                                        check,
                                        childCheck
                                    )
                            "
                            @current-change="
                                (data, node) =>
                                    $emit('current-change', data, node)
                            "
                            @node-expand="
                                (data, node, vm) =>
                                    $emit('node-expand', data, node, vm)
                            "
                            @node-collapse="
                                (data, node, vm) =>
                                    $emit('node-collapse', data, node, vm)
                            "
                        />
                    </div>
                </div>
            </h-tree-select-dropdown>
        </transition>
    </div>
</template>

<script>
import HTreeSelectDropdown from "./tree-select-dropdown.vue";
import Clickoutside from "./utils/clickoutside.js";
import Emitter from "./utils/emitter.js";

export default {
    name: "HTreeSelect",
    directives: { Clickoutside },

    components: { HTreeSelectDropdown },

    mixins: [Emitter],

    model: {
        prop: "value",
        event: "nodechange",
    },
    props: {
        placeholder: { type: String },
        searchPlaceholder: { type: String },
        value: {
            type: [Number, String, Array],
            default: "",
        },
        treeLoading: {
            // 是否正在加载数据
            type: Boolean,
            default: false,
        },
        showPath: {
            // 是否展示路径
            type: Boolean,
            default: false,
        },
        showSearch: {
            type: Boolean,
            default: true,
        },
        filter: {
            // 是否为即时搜索
            type: Boolean,
            default: false,
        },
        multipleNowrap: {
            // 多选时选中项过多，超过一行时不进行换行，多出来的内容截断处理
            type: Boolean,
            default: false,
        },
        collapseTags: {
            // 多选时，超过一项时收起
            type: Boolean,
            default: false,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        onIconClick: {
            type: Function,
            default: null,
        },
        checkModel: {
            type: String,
            default: "parent",
        },
        clearable: {
            type: Boolean,
            default: true,
        },

        /* ---------- 和el-tree的属性保持一致 ----------- */
        emptyText: { type: String, default: "暂无数据" },
        showCheckbox: { type: Boolean, default: false },
        checkStrictly: { type: Boolean, default: false },
        nodeKey: { type: String, default: "id" },
        parentKey: { type: String, default: "" },
        checkOnClickNode: { type: Boolean, default: false },
        props: {
            type: Object,
            default() {
                return {
                    children: "children",
                    label: "label",
                    icon: "icon",
                    disabled: "disabled",
                    selectable: "selectable",
                    isLeaf: "isLeaf",
                };
            },
        },
        load: {
            type: Function,
            default: null,
        },
        lazy: {
            type: Boolean,
            default: false,
        },
        renderContent: {
            type: Function,
            default: null,
        },
        defaultIcon: {
            type: String,
            default: "",
        },
        simpleData: {
            type: Boolean,
            default: false,
        },
        expandOnClickNode: {
            type: Boolean,
            default: false,
        },
        defaultExpandAll: {
            type: Boolean,
            default: false,
        },
        filterNodeMethod: {
            type: Function,
            default: null,
        },
        popperClass: {
            type: String,
            default: null,
        },
        /* ---------- 默认树结构需要的数据 ----------- */
        treeData: {
            type: Array,
            default() {
                return [];
            },
        },
        expandCheckedNode: {
            type: Boolean,
            default: true,
        },
        disableParentNode: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            treeSearch: "",
            isShowPop: false,
            inputHover: false,
            selectNodes: [], // 选中的节点
            contentWidth: 320, // 外框宽度（模拟输入框）

            ICON_PADDING: 32, // 选框中图标占地
            MODEL_PARENT: "parent",
            MODEL_CHILD: "child",
            MODEL_ALL: "all",
        };
    },
    computed: {
        defaultExpandKeys() {
            if (
                (this.expandCheckedNode && this.showCheckbox) ||
                (this.expandOnClickNode && !this.showCheckbox)
            ) {
                return Array.isArray(this.value) ? this.value : [this.value];
            } else {
                return [];
            }
        },
        maxHeight() {
            return `${this.height - 56}px`;
        },
        nodeNames() {
            return !this.showCheckbox && this.showPath
                ? this.findPath(this.selectNodes[0])
                : this.selectNodes.map((item) => item.label).join(", ");
        },
        inputIconClass() {
            return this.selectNodes.length > 0 &&
                this.inputHover &&
                this.clearable &&
                !this.disabled
                ? "el-icon-error"
                : { open: this.isShowPop, "el-icon-arrow-down": true };
        },
        placeholder2() {
            return this.placeholder || this.$t("common.select");
        },
        searchPlaceholder2() {
            return this.searchPlaceholder || this.$t("common.searchFor");
        },
    },
    watch: {
        treeSearch(val) {
            this.filter && this.$refs.tree.filter(val);
            this.$emit("tree-search-input", val);
        },
        value(val) {
            this.setCheckedKeys([]);
            this.setValue(val);
            if (this.$refs.popper && !this.multipleNowrap) {
                // 让popover在根据tag多少动态改变位置，加个定时器才能保证不出错
                setTimeout(() => {
                    this.$refs.popper.updatePopper();
                }, 50);
            }
        },

        isShowPop(val) {
            if (!val) {
                this.broadcast("HTreeSelectDropdown", "destroyPopper");
            } else {
                this.resizeBox();
                this.broadcast("HTreeSelectDropdown", "updatePopper");
            }
        },
    },
    mounted() {
        // 初始化获取外框宽度，用于设置pop宽度，达到自适应
        // window绑定事件是为了保证时时监听
        this.$nextTick(() => {
            this.resizeBox();
        });
        window.addEventListener("resize", this.resizeBox);
        this.setValue();

        // 如果组件在dialog里，需要给dialog绑定一个滚动事件
        // 这样做是为了当dialog太长出现滚动条时，tree-select的pop层能跟着一起滚动
        const $dialog = this.findDialogParent(this);
        if ($dialog) {
            $dialog.$el.addEventListener("scroll", this.updatePopper);
        }
    },
    destroyed() {
        window.removeEventListener("resize", this.resizeBox);

        const $dialog = this.findDialogParent(this);
        if ($dialog) {
            $dialog.$el.removeEventListener("scroll", this.updatePopper);
        }
    },
    methods: {
        updatePopper() {
            this.broadcast("HTreeSelectDropdown", "updatePopper");
        },
        findDialogParent(target) {
            const parent = target.$parent;
            if (!parent) {
                return false;
            }

            if (parent.$el.className.includes("el-dialog__wrapper")) {
                return parent;
            } else {
                return this.findDialogParent(parent);
            }
        },
        setValue(value) {
            const val = value === "" || value ? value : this.value;
            this.selectNodes = [];
            if (this.showCheckbox) {
                for (const v of val) {
                    const node = this.getNode(v);
                    node && this.setChecked(v, true, true);
                    node && this.selectNodes.push(node);
                }
                if (val.length === 0) {
                    this.setCheckedKeys([]);
                }
            } else {
                const node = this.getNode(val);
                this.setCurrentKey(val === "" ? null : val);
                node && (this.selectNodes = [node]);
            }
        },
        resizeBox() {
            const $input = this.$refs.reference;
            this.contentWidth =
                $input && $input.offsetWidth > 0 ? $input.offsetWidth : 240;
        },
        inputIconClick(e) {
            if (
                this.selectNodes.length > 0 &&
                this.inputHover &&
                this.clearable &&
                !this.disabled
            ) {
                e.stopPropagation();
                this.clearSelect();
                this.$emit("clear");
            }
        },
        clearSelect() {
            this.$emit("nodechange", this.showCheckbox ? [] : "");
        },
        toggePop() {
            this.isShowPop ? this.hidePop() : this.showPop();
        },
        hidePop() {
            if (!this.disabled) {
                this.isShowPop = false;
                this.$emit("hide");
            }
        },
        showPop() {
            if (!this.disabled) {
                this.isShowPop = true;
                this.$emit("show");
            }
        },

        doDestroy() {
            this.$refs.popper && this.$refs.popper.doDestroy();
            this.dropdownUl = null;
        },

        filterNode(value, data, node) {
            if (this.filterNodeMethod) {
                return this.filterNodeMethod(value, data, node);
            } else {
                if (!value) return true;
                return node.label.indexOf(value) !== -1;
            }
        },
        nodeClick(data, node, vm, event) {
            if (this.disableParentNode && this.treeData[0].id === data.id) {
                this.$message.warning("根节点组织不能添加装车任务!");
                return false;
            }
            if (!this.showCheckbox) {
                this.$emit("nodechange", data[this.nodeKey]);
            }
            this.$emit("node-click", data, node, vm, event);
        },
        closeTag(node) {
            this._removeSelectNode(node);
            this.setChecked(node.data, false, true);
            this.$emit("remove-tag", node.data);
            this.$emit(
                "nodechange",
                this.selectNodes.map((item) => item.data[this.nodeKey])
            );
        },
        findPath(node) {
            if (!node) return "";
            const pathArr = [node.label];
            let parent = node.parent;
            while (parent && parent.label) {
                pathArr.unshift(parent.label);
                parent = parent.parent;
            }
            return pathArr.join("/");
        },
        checkChange(data, checkData) {
            const node = this.getNode(data[this.nodeKey]);
            if (this.checkStrictly) {
                this.megreCheckedData(node);
            } else {
                this.findCheckData(node);
            }
            this.$emit("check", data, checkData);
        },
        findCheckData(node, lastNode = node) {
            const parentNode = node.parent;
            if (parentNode && parentNode.checked) {
                this.findCheckData(
                    parentNode,
                    parentNode.disabled ? lastNode : parentNode
                );
            } else {
                this.megreCheckedData(lastNode || node);
            }
        },
        /**
         * @author xuzilong
         * @desc 整合勾选节点数组
         * @param {Node} node 需要放入/移除的节点对象
         */
        megreCheckedData(node) {
            let selectKeys = [];
            if (this.checkStrictly) {
                const selectNodes = this.selectNodes;
                node.checked
                    ? selectNodes.push(node)
                    : this._removeSelectNode(node);

                const nodeKey = this.nodeKey;
                selectKeys = selectNodes.map((item) => item.data[nodeKey]);
            } else {
                switch (this.checkModel) {
                    case this.MODEL_PARENT:
                        // 当子节点全勾选时，仅显示父节点
                        selectKeys = this._megreParentCheckedData(node);
                        break;
                    case this.MODEL_CHILD:
                        // 当子节点全勾选时，仅显示子节点
                        selectKeys = this.getCheckedKeys(true);
                        break;
                    default:
                        // 显示全部
                        selectKeys = this.getCheckedKeys(false);
                        break;
                }
            }
            this.$emit("nodechange", selectKeys);
        },
        /**
         * @author xuzilong
         * @desc 合并处理：当子节点全勾选时，仅显示父节点
         * @param {Node} node 需要放入/移除的节点对象
         * @return {Array} 勾选节点的数组集合
         */

        _megreParentCheckedData(node) {
            const nodeKey = this.nodeKey;
            const selectNodes = this.selectNodes;
            if (node.checked) {
                // 勾选操作
                // 1. 将selectNodes中所有该节点的子孙节点移除
                // 2. 将该节点放入
                for (const sn of selectNodes.concat()) {
                    this._isNodeParent(node, sn) && this._removeSelectNode(sn);
                }
                selectNodes.push(node);
            } else {
                // 去勾选操作
                // 1. 将该节点对应的父级节点移除
                // 2. 递归向下找处于勾选的节点，如果找到，就不再向下（可参看 _loopParentPushChild 方法的注解）
                let handledNode;
                for (const sn of selectNodes.concat()) {
                    if (this._isNodeParent(sn, node)) {
                        this._removeSelectNode(sn);
                        handledNode = sn;
                    }
                }
                if (handledNode && handledNode.level > 0) {
                    this._loopParentPushChild(handledNode.childNodes);
                }
            }
            return selectNodes.map((item) => item.data[nodeKey]);
        },
        /**
         * @author xuzilong
         * @desc 递归父节点，找寻勾选的
         * @desc 通过父级节点向下找，一旦发现节点处于勾选状态，就将节点加入（然后就不再向下）
         *       反之，如果节点没勾选，那就继续向下，一直找到叶子节点
         * @param {Array} nodes 子节点集合
         */
        _loopParentPushChild(nodes) {
            for (const node of nodes) {
                if (node.checked && !node.disabled) {
                    this.selectNodes.push(node);
                } else {
                    this._loopParentPushChild(node.childNodes);
                }
            }
        },
        /**
         * @author xuzilong
         * @desc 判断两个节点是否具有父子/祖先的关系
         * @param {Node} sn 层级低（外层）的节点
         * @param {Node} node 层级高（内层）的节点
         * @return {Boolean} 是否具有祖籍关系
         */
        _isNodeParent(sn, node) {
            while (node.level > sn.level) {
                node = node.parent;
            }
            return sn.id === node.id;
        },
        _removeSelectNode(node) {
            const index = this.selectNodes.findIndex(
                (item) => item.id === node.id
            );
            if (index > -1) {
                this.selectNodes.splice(index, 1);
            }
        },
        getNode() {
            return this.$refs.tree && this.$refs.tree.getNode(...arguments);
        },
        getCheckedNodes() {
            return this.$refs.tree.getCheckedNodes(...arguments);
        },
        setCurrentKey() {
            this.$refs.tree.setCurrentKey(...arguments);
        },
        setChecked() {
            this.$refs.tree.setChecked(...arguments);
        },
        setCheckedKeys() {
            this.$refs.tree.setCheckedKeys(...arguments);
        },
        getCheckedKeys() {
            return this.$refs.tree.getCheckedKeys(...arguments);
        },
        getSelectedNode() {
            return this.$refs.tree.getSelectedNode(...arguments);
        },
        getSelectedKey() {
            return this.$refs.tree.getSelectedKey(...arguments);
        },
        getHalfCheckedNodes() {
            return this.$refs.tree.getHalfCheckedNodes(...arguments);
        },
        getHalfCheckedKeys() {
            return this.$refs.tree.getHalfCheckedKeys(...arguments);
        },
        expandNode() {
            this.$refs.tree.expandNode(...arguments);
        },
        collapseNode() {
            this.$refs.tree.collapseNode(...arguments);
        },
        remove() {
            this.$refs.tree.remove(...arguments);
        },
        append() {
            this.$refs.tree.append(...arguments);
        },
        insertBefore() {
            this.$refs.tree.insertBefore(...arguments);
        },
        insertAfter() {
            this.$refs.tree.insertAfter(...arguments);
        },
        reload() {
            this.$refs.tree.reload(...arguments);
        },
    },
};
</script>
<style lang="less" scoped>
.el-tree {
    max-height: 218px;
}
.h-tree-select {
    border: 1px solid #dcdfe6;
}
.h-tree-select__input-icon {
    font-size: 14px;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
