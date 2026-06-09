<template>
    <div class="tree-content" :class="isShowTree ? 'isShowTree' : 'isHideTree'">
        <div class="left-organize-tree">
            <el-input
                class="tree-input"
                v-model="organizationName"
                :placeholder="$t('common.inputOrganizationName')"
                clearable
            >
                <i slot="suffix" class="el-input__icon el-icon-search"></i>
            </el-input>
            <div class="tree-box m-t" :class="{ loading_: searchLoading }">
                <div ref="editTreeBtn" v-if="showEditTreeBtn">
                    <el-popover
                        placement="bottom"
                        width="250"
                        v-model="addVisible"
                    >
                        <p class="m-b-sm text-width">
                            上级组织：{{ currentNode.name }}
                        </p>
                        <el-form>
                            <el-form-item>
                                <el-input
                                    placeholder="请输入名称"
                                    v-model="addOrganizeVal"
                                    clearable
                                ></el-input>
                            </el-form-item>
                        </el-form>
                        <div style="text-align: right; margin: 0">
                            <el-button
                                type="link"
                                size="mini"
                                @click="addOrganize"
                                >确定</el-button
                            >
                        </div>
                        <el-button
                            size="mini"
                            slot="reference"
                            icon="el-icon-plus"
                            :disabled="
                                !params.organizeId || currentNode.source != 1
                            "
                        />
                    </el-popover>
                    <el-popover
                        placement="bottom"
                        width="350"
                        v-model="editVisible"
                        @show="editOrganizeVal = currentNode.name"
                        trigger="manual"
                    >
                        <el-form ref="form" label-position="top" prop="name">
                            <el-form-item label="所属组织">
                                <el-input
                                    placeholder="请输入名称"
                                    v-model="editOrganizeVal"
                                    clearable
                                ></el-input>
                            </el-form-item>
                            <el-form-item label="上级组织" prop="parentId">
                                 <TreeSelect
                            :placeholder="$t('common.select')"
                                    ref="treeId"
                                    node-key="id"
                                    @node-click="handleDialogNodeClick"
                                    :treeData="treeDataId"
                                    highlight-current
                                    filter
                                    v-model="moveOrgList.parentId"
                                    :props="defaultProps"
                                    :current-node-key="dialogNode.id"
                                >
                                </TreeSelect>
                            </el-form-item>
                        </el-form>
                        <div style="text-align: right; margin: 0">
                            <el-button
                                type="link"
                                size="mini"
                                @click="editOrganize"
                                >确定</el-button
                            >
                            <el-button
                                type="link"
                                size="mini"
                                @click="cancelEdit"
                                >取消</el-button
                            >
                        </div>
                        <el-button
                            size="mini"
                            slot="reference"
                            icon="el-icon-edit"
                            :disabled="
                                !params.organizeId ||
                                currentNode.defaultNode == 0 ||
                                currentNode.source != 1
                            "
                            @click="editVisibleClick()"
                        />
                    </el-popover>

                    <el-popover
                        placement="bottom"
                        width="250"
                        v-model="deleteVisible"
                        v-if="currentNode.totalDevNum"
                    >
                        <p class="m-b-sm">
                            当前组织包含设备，不能删除，可移出设备后删除。
                        </p>
                        <div style="text-align: right; margin: 0">
                            <el-button
                                type="primary"
                                size="mini"
                                @click="deleteVisible = false"
                                >知道了</el-button
                            >
                        </div>
                        <el-button
                            size="mini"
                            slot="reference"
                            icon="el-icon-delete"
                            :disabled="
                                !params.organizeId ||
                                currentNode.source != 1 ||
                                currentNode.defaultNode == 0
                            "
                        />
                    </el-popover>
                    <el-popover
                        @show="showPopover"
                        placement="bottom"
                        width="250"
                        v-model="deleteVisible"
                        v-else
                    >
                        <p class="m-b-sm">{{ deletePointOut }}</p>
                        <div style="text-align: right; margin: 0">
                            <el-button
                                type="default"
                                size="mini"
                                @click="deleteVisible = false"
                                >取消</el-button
                            >
                            <el-button
                                type="primary"
                                size="mini"
                                @click="deleteOrganize"
                                >删除</el-button
                            >
                        </div>
                        <el-button
                            size="mini"
                            slot="reference"
                            icon="el-icon-delete"
                            :disabled="
                                !params.organizeId ||
                                currentNode.source != 1 ||
                                currentNode.defaultNode == 0
                            "
                        />
                    </el-popover>
                </div>
                <div :style="editVisible ? 'pointer-events: none;' : ''">
                    <el-tree
                        class="m-t"
                        ref="tree"
                        :data="treeData"
                        :default-expanded-keys="TreeExpanded"
                        @node-click="handleNodeClick"
                        default-icon="el-icon-folder"
                        highlight-current
                        node-key="id"
                        :filter-node-method="filterNode"
                        :props="defaultProps"
                        :current-node-key="params.organizeId"
                        :style="{ height: treeHeight + 'px' }"
                        :expand-on-click-node="false"
                    ></el-tree>
                </div>
            </div>
            <div class="tree-btn" @click="changeShowTree()">
                <i
                    :class="
                        isShowTree
                            ? 'el-icon-arrow-left'
                            : 'el-icon-arrow-right'
                    "
                ></i>
            </div>
        </div>
    </div>
</template>
<script>
import TreeSelect from "@/components/hui-pro/tree-select/src/tree-select.vue";
export default {
    name: "G-LeftOrganizeTree",
    components: { TreeSelect },
    props: {
        showEditTreeBtn: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            treeData: [],
            defaultProps: {
                children: "children",
                label: "name",
                selectable: "selectable",
            },
            organizationName: "",
            TreeExpanded: [],
            searchLoading: true,
            addVisible: false,
            editVisible: false,
            deleteVisible: false,
            deletePointOut: "确定要删除该组织吗？",
            currentNode: {},
            dialogNode: {},
            addOrganizeVal: "",
            editOrganizeVal: "",
            params: {
                organizeId: null,
            },
            treeHeight: 500,
            treeDataId: [],
            moveOrgList: {
                id: "",
                parentId: "",
                name: "",
            },
            isShowTree: true,
        };
    },
    created() {},
    mounted() {
        window.addEventListener("resize", this.setTableHeight);
        this.$nextTick(() => {
            this.setTableHeight();
        });
        this.getOrgTree(false);
    },
    beforeDestroy() {
        window.removeEventListener("resize", this.setTableHeight);
    },
    computed: {},
    watch: {
        organizationName(val) {
            this.filterTree(this.treeData, val, 0);
            this.$nextTick(() => {
                this.$refs.tree.filter("show", !this.organizationName);
                if (!val) {
                    const nodes = this.$refs.tree.store._getAllNodes();
                    nodes.forEach((item) => {
                        if (item.data.id !== this.treeData[0].id) {
                            item.expanded = false;
                        }
                    });
                }
            });
        },
    },
    methods: {
        // 表格高度设置
        setTableHeight() {
            this.treeHeight =
                document.body.clientHeight -
                (this.$refs.editTreeBtn
                    ? this.$refs.editTreeBtn.clientHeight
                    : 0) -
                170;
        },
        itemChildren(dataChild, val) {
            if (dataChild.children.length > 0) {
                dataChild.children.forEach((item) => {
                    item.show = true;
                    if (item.name.indexOf(val) !== -1) {
                        this.TreeExpanded.push(item.id);
                    } else {
                        item.expand = false;
                    }
                    if (item.children.length > 0) {
                        this.itemChildren(item);
                    }
                });
            }
        },
        filterTree(data, val, type) {
            this.TreeExpanded = [];
            data.forEach((item) => {
                if (item.name.indexOf(val) !== -1) {
                    // item.show = true;
                    this.TreeExpanded.push(item.id);
                    this.$set(item, "show", true);
                    this.itemChildren(item, val);
                } else {
                    this.$set(item, "show", false);
                    if (item.children.length > 0) {
                        this.filterTree(item.children, val, 1);
                    }
                }
            });
        },
        // 组织树更改-添加
        addOrganize() {
            if (!this.addOrganizeVal) {
                this.$message.warning("所属组织不能为空！");
                return;
            }
            if (this.addOrganizeVal.length > 32) {
                this.$message.warning("所属组织最多为三十二个字符！");
                return;
            }
            const params = {
                parentId: this.params.organizeId,
                name: this.addOrganizeVal,
            };
            this.$api.addOrg(params).then((res) => {
                if (res.success == true) {
                    this.$message.success("组织添加成功");
                    this.addVisible = false;
                    this.getOrgTree(true);
                } else {
                    this.$message.error("组织添加失败:" + res.msg);
                }
            });
        },
        // 点击选择组织树
        handleNodeClick(data) {
            this.currentNode = data;
            this.params.organizeId = data.id;
        },
        filterNode(value, data) {
            return data[value];
        },
        // 弹窗内点击选择组织树
        handleDialogNodeClick(data) {
            this.dialogNode = data;
        },
        //修改编辑组织树确定按钮
        editOrganize() {
            if (!this.editOrganizeVal) {
                this.$message.warning("所属组织不能为空！");
                return;
            }
            if (this.editOrganizeVal.length > 32) {
                this.$message.warning("所属组织最多为三十二个字符！");
                return;
            }
            if (!this.moveOrgList.parentId) {
                this.$message.warning("修改失败，请选择上级组织!");
                return;
            }
            this.moveOrgList.id = this.params.organizeId;
            this.moveOrgList.name = this.editOrganizeVal;
            this.$confirm(
                "确定对当前节点" + this.currentNode.name + "进行修改吗？",
                this.$t("common.prompt"),
                {
                    confirmButtonText: this.$t("common.ok"),
                    cancelButtonText: this.$t("common.cancel"),
                    type: "warning",
                }
            )
                .then(() => {
                    this.editVisible = false;
                    const params = this.moveOrgList;
                    this.fullscreenLoading = this.$loading({
                        lock: true,
                        text: "正在修改请稍后",
                        spinner: "el-icon-loading",
                        background: "rgba(0,0,0,0.7)",
                    });

                    this.$api.updateOrg(params).then(
                        (res) => {
                            if (res.success == true) {
                                this.fullscreenLoading.close();
                                this.$message.success("组织修改成功");
                                this.editVisible = false;
                                this.getOrgTree(true);
                                this.moveOrgTreeId = "";
                            } else {
                                this.fullscreenLoading.close();
                                this.editVisible = false;
                                this.$message.error("组织修改失败:" + res.msg);
                            }
                        },
                        (err) => {
                            // this.$message.error('组织修改失败:' + err.status)
                            this.fullscreenLoading.close();
                            this.editVisible = false;
                        }
                    );
                })
                .catch(() => {
                    this.editVisible = !this.editVisible;
                });
        },
        // 组织树更改-编辑
        editOrganizedId() {
            this.moveOldId = this.currentNode.id;
            this.setAllChoose(this.treeDataId);
            this.orgTreeSetting(this.treeDataId);
        },
        //重置组织树为全部可选
        setAllChoose(data) {
            data.forEach((item) => {
                this.$set(item, "selectable", true);
                if (item["children"].length) {
                    this.setAllChoose(item["children"]);
                }
            });
        },
        //组织树编辑-按钮
        editVisibleClick() {
            this.editOrganizedId();
            this.moveOrgList.parentId = this.currentNode.parentId;
            this.moveOrgList.name = this.editOrganizeVal;
            this.editVisible = !this.editVisible;
            this.moveOrgTreeId = this.currentNode.parentId;
            if (!this.editVisible) {
                this.moveOrgList.parentId = "";
            }
        },
        cancelEdit() {
            this.editVisible = false;
        },
        //递归现在的组织树
        orgTreeSetting(data) {
            data.forEach((item) => {
                if (item.id == this.moveOldId) {
                    item.selectable = false;
                    this.orgChildrenSetting(item);
                } else {
                    if (item.children.length > 0) {
                        this.orgTreeSetting(item.children);
                    }
                }
            });
        },
        //递归现在组织树的子节点
        orgChildrenSetting(val) {
            if (val.children.length > 0) {
                val.children.forEach((item) => {
                    item.selectable = false;
                    if (item.children.length > 0) {
                        this.orgChildrenSetting(item);
                    }
                });
            }
        },
        // 组织树更改-删除
        showPopover() {
            const params = {
                id: this.params.organizeId,
            };
            this.$api.whetherOrgDistributeOtherUser(params).then((res) => {
                if (res.data) {
                    this.deletePointOut = "组织绑定了用户，是否确认删除？";
                } else {
                    this.deletePointOut = "确定要删除该组织吗？";
                }
            });
        },
        deleteOrganize() {
            const params = {
                id: this.params.organizeId,
            };
            this.$api.delOrg(params).then((res) => {
                if (res.success == true) {
                    this.$store.dispatch(
                        "RemoveDeviceManageId",
                        this.params.organizeId
                    );
                    this.$message.success("组织删除成功");
                    this.deleteVisible = false;
                    this.getOrgTree(true);
                } else {
                    this.$message.error("组织删除失败:" + res.msg);
                }
            });
        },
        // 获取组织树
        getOrgTree(type) {
            this.TreeExpanded = [];
            this.TreeExpandedId = [];
            this.treeData = [];
            this.$nextTick(() => {
                this.$api.deviceGetOrgTree().then((res) => {
                    if (res.success == true) {
                        this.treeData = JSON.parse(JSON.stringify(res.data));
                        this.treeData2 = JSON.parse(JSON.stringify(res.data));
                        this.treeDataId = JSON.parse(JSON.stringify(res.data));
                        if (this.treeDataId.length > 0) {
                            this.treeDataId.forEach((m) => {
                                this.TreeExpandedId.push(m.id);
                                if (m.children.length) {
                                    m.children.forEach((item) => {
                                        this.TreeExpandedId.push(item.id);
                                    });
                                }
                            });
                        }

                        if (res.data.length > 0) {
                            this.params.organizeId = this.$store.state.tree
                                .deviceManageId
                                ? this.$store.state.tree.deviceManageId
                                : res.data[0].id;
                            this.searchForm = this.$store.state.tree.searchForm
                                ? this.$store.state.tree.searchForm
                                : this.searchForm;
                            this.params = Object.assign(
                                this.params,
                                this.searchForm
                            );
                            this.$nextTick(() => {
                                this.treeData.forEach((m) => {
                                    this.TreeExpanded.push(m.id);
                                });
                                this.currentNode = this.$refs.tree.getNode(
                                    this.$store.state.tree.deviceManageId
                                        ? this.$store.state.tree.deviceManageId
                                        : res.data[0].id
                                ).data;
                                this.$refs["tree"].setCurrentKey(
                                    this.params.organizeId
                                );
                            });
                            // if(type){
                            //   this.filterTree(this.treeData,this.organizationName,0)
                            //   this.$nextTick(() =>{
                            //     this.$refs.tree.filter('show', !this.organizationName);
                            //   })
                            // }
                        } else {
                            this.searchLoading = false;
                        }
                    } else {
                        this.$message.error("获取组织树失败:" + res.msg);
                    }
                });
            });
        },
        changeShowTree() {
            this.isShowTree = !this.isShowTree;
            this.$nextTick(() => {
                this.setTableHeight();
            });
        },
    },
};
</script>
<style lang="less" scoped>
.tree-content {
    width: 320px;
    padding-right: 20px;
    .left-organize-tree {
        width: 300px;
        height: 100%;
        padding: 1rem !important;
        border-right: 1px solid #d7dde4 !important;
        position: relative;
        .tree-btn {
            cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 16px;
            height: 40px;
            border: 1px solid #e9e9e9;
            border-left: none;
            position: absolute;
            right: -16px;
            top: 50%;
            border-radius: 0 4px 4px 0;

            &:hover {
                color: #409eff;
            }
        }
    }
}
.isShowTree {
    width: 320px;
}
.isHideTree {
    width: 0 !important;
    padding: 0 20px 0 0 !important;
    .left-organize-tree {
        width: 0 !important;
        padding: 0 !important;
    }
    .tree-input,
    .tree-box {
        overflow: hidden;
    }
}
</style>
