<template>
    <div class="module">
        <div class="module-content">
            <div class="left-menu">
                <el-alert
                    title="仅支持单模块的参数查询！"
                    show-icon
                    :closable="false"
                    type="warning"
                    class="m-b"
                >
                </el-alert>
                <el-tree
                    ref="tree"
                    :data="moduleJson"
                    :node-key="nodeKey"
                    show-checkbox
                    :default-expanded-keys="defaultExpandedKeys"
                    :props="defaultProps"
                    @check="treeCheck"
                >
                    <span class="custom-tree-node" slot-scope="{ node, data }">
                        <span>{{ data.label }}</span>
                        <el-tooltip :content="data.tips" placement="right">
                            <i class="el-icon-warning" v-if="data.tips"></i>
                        </el-tooltip>
                    </span>
                </el-tree>
            </div>
            <div class="right-form">
                <div v-if="showParamsList && showParamsList.length">
                    <div v-for="(item, index) in showParamsList" :key="index">
                        <h3>{{ item.label }}</h3>
                        <div class="checkbox-content">
                            <div
                                v-for="(k, index) in item.paramsList"
                                :key="index"
                            >
                                <i></i>
                                <span> {{ k }}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="module-no-data" v-else>
                    <img :src="`/static/images/moduleNoData.svg`" />
                    <span>请先选择左侧想要查询的模块，然后选择导出</span>
                </div>
            </div>
        </div>
        <div class="operate">
            <el-button
                type="primary"
                @click="exportExcel"
                :disabled="!(showParamsList && showParamsList.length)"
                :loading="loading"
                v-btn="'parameterQueryExport'"
                >导出excel</el-button
            >
        </div>
    </div>
</template>
<script>
import moduleJson from "./moduleJson.json";
export default {
    name: "",
    components: {},
    props: {},
    data() {
        return {
            moduleJson: JSON.parse(JSON.stringify(moduleJson)),
            defaultActive: "",
            activeMenuList: {},
            defaultExpandedKeys: [],
            defaultProps: {
                children: "children",
                label: "label",
            },
            nodeKey: "label",
            showParamsList: [],
            title: "",
            loading: false,
        };
    },
    mounted() {
        this.defaultExpandedKeys = this.moduleJson.reduce((prev, cur) => {
            return prev.concat(cur[this.nodeKey]);
        }, []);
    },
    computed: {},
    watch: {},
    methods: {
        menuSelect(val) {
            this.defaultActive = val;
            this.activeMenuList = this.moduleJson.find((k) => k.value === val);
        },
        treeCheck(val, checkObj) {
            let checkedParentNode = [
                ...checkObj.checkedNodes,
                ...checkObj.halfCheckedNodes,
            ].find((e) => e.level === 1);
            this.title = checkedParentNode && checkedParentNode.label;
            this.showParamsList = [
                ...checkObj.checkedNodes,
                ...checkObj.halfCheckedNodes,
            ]
                .filter((e) => e.level !== 1)
                .reduce((prev, cur) => {
                    return prev.concat(cur);
                }, []);
            this.setDisabledTree(
                checkedParentNode ? checkedParentNode[this.nodeKey] : null
            );
        },
        setDisabledTree(key) {
            this.moduleJson.forEach((item) => {
                if (key && item[this.nodeKey] !== key) {
                    item.disabled = true;
                    item.children.forEach((k) => {
                        k.disabled = true;
                    });
                } else {
                    item.disabled = false;
                    item.children.forEach((k) => {
                        k.disabled = false;
                    });
                }
            });
            this.$forceUpdate();
        },
        treeFindPath(tree, func, path = []) {
            if (!tree) return [];
            for (const data of tree) {
                path.push(data.id);
                if (func(data)) return path;
                if (data.children) {
                    const findChildren = treeFindPath(
                        data.children,
                        func,
                        path
                    );
                    if (findChildren.length) return findChildren;
                }
                path.pop();
            }
            return [];
        },
        getUrlParams(url) {
            const reg = /(\w+)=(\w+)/g;
            const params = {};
            let match;
            while ((match = reg.exec(url))) {
                params[match[1]] = match[2];
            }
            return params;
        },
        downloadAvi(event) {
            // 提示文字
            // !this.infoed &&
            //     this.$message.info(
            //         "录像文件设备上传至平台中，该过程可能持续几分钟，请耐心等待，上传完毕请前往下载中心下载"
            //     ) &&
            //     (this.infoed = true);
            // 动效
            let self = document.getElementById("download-task");
            let left =
                self.getBoundingClientRect().left +
                document.documentElement.scrollLeft -
                6;
            let top =
                self.getBoundingClientRect().top +
                document.documentElement.scrollTop +
                self.offsetHeight -
                27;
            let obj = {
                tx: left,
                ty: top,
                cx: event.clientX,
                cy: event.clientY,
            };
            this.$bas.$emit("downloadEvent", obj);
        },
        exportExcel($event) {
            let param = {
                ...this.$route.query,
                params: this.showParamsList.reduce((prev, cur) => {
                    return prev.concat({
                        ...cur["param"],
                        ...{
                            label: cur.label,
                        },
                    });
                }, []),
                title: this.title,
            };
            if (param.deviceIds && !Array.isArray(param.deviceIds)) {
                param.deviceIds = [param.deviceIds];
            }
            this.loading = true;
            this.$api.exportEHomeQueryImageTask(param).then((res) => {
                if (res.success && res.data) {
                    this.$message.success(
                        "已下发导出指令，请到下载中心查看任务！",
                        2000
                    );
                    this.downloadAvi($event);
                } else {
                    this.$message.error(res.msg);
                }
                setTimeout(() => {
                    this.loading = false;
                }, 1000);
            });
        },
    },
};
</script>
<style lang="less" scoped>
.module {
    .module-content {
        display: flex;
        height: calc(~"100% - 48px");
        .left-menu {
            padding: 12px 24px;
            width: 300px;
            border-right: 1px solid #e9e9e9;
            overflow-y: auto;
        }
        .right-form {
            position: relative;
            width: calc(~"100% - 300px");
            padding: 14px;
            overflow-y: auto;
            h3 {
                position: relative;
                text-indent: 12px;
                margin: 12px 0;
                font-size: 16px;
                &:before {
                    content: "";
                    background-color: #3796ec;
                    width: 3px;
                    height: 18px;
                    position: absolute;
                    left: 0;
                    top: 50%;
                    margin-top: -9px;
                    -webkit-border-radius: 3px;
                    -moz-border-radius: 3px;
                    border-radius: 3px;
                }
            }
            .checkbox-content {
                display: flex;
                flex-wrap: wrap;
                & > div {
                    width: 230px;
                    margin: 0 30px 12px 0;
                    font-size: 14px;
                    display: flex;
                    align-items: center;
                    i {
                        display: inline-block;
                        width: 5px;
                        height: 5px;
                        border-radius: 50%;
                        background: #999999;
                        margin-right: 4px;
                    }
                }
            }
            .module-no-data {
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                span {
                    margin-top: 12px;
                    font-size: 14px;
                }
            }
        }
    }
    .operate {
        box-shadow: 0px -4px 4px 0px rgba(0, 0, 0, 0.08);
        height: 48px;
        padding: 0 36px;
        display: flex;
        justify-content: flex-end;
        position: relative;
        align-items: center;
        .el-button {
            height: 32px;
        }
    }
}
.el-icon-warning {
    color: #ff952c;
}
</style>
