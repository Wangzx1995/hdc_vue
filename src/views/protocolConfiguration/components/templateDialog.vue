<template>
    <div
        v-loading.lock="loading"
        element-loading-text="模块正在加载中..."
        element-loading-spinner="el-icon-loading"
    >
        <div class="template-box">
            <el-alert
                class="m-b"
                title="已为您过滤车牌号等不可批量下发的参数项！"
                :closable="false"
                type="warning"
                show-icon
                simple
            ></el-alert>
            <el-form
                ref="form"
                :model="templateForm"
                :rules="templateRules"
                :label-position="'top'"
            >
                <el-form-item label="模板名称" prop="templateName">
                    <el-input
                        v-model="templateForm.templateName"
                        placeholder="请输入"
                        :maxlength="32"
                    ></el-input>
                </el-form-item>
                <el-form-item label="备注信息" prop="templateRemark">
                    <el-input
                        v-model="templateForm.templateRemark"
                        placeholder="请输入"
                        type="text"
                        :maxlength="100"
                        ><span slot="suffix">{{
                            100 - templateForm.templateRemark.length
                        }}</span></el-input
                    >
                </el-form-item>
                <el-form-item
                    label="选择要保存为模板的模块"
                    prop="templateList"
                >
                    <div class="tree-box">
                        <el-tree
                            ref="tree"
                            :data="treeData"
                            :node-key="'value'"
                            show-checkbox
                            :default-expanded-keys="defaultExpandedKeys"
                            :props="defaultProps"
                            @check="treeCheck"
                        >
                        </el-tree>
                    </div>
                </el-form-item>
            </el-form>
        </div>
        <span class="dialog-footer">
            <el-button @click="close">取 消</el-button>
            <el-button
                type="primary"
                @click="saveTemplate"
                :loading="saveLoading"
                >确 定</el-button
            >
        </span>
    </div>
</template>
<script>
import { validateTempSpecial } from "@/utils/validate";
import enumerationJSON from "./configuration/enumerationJSON/enumeration.json";
import utils from "./configuration/enumerationJSON/utils.js";

export default {
    name: "",
    components: {},
    props: {
        menuList: {
            type: Array,
            default: () => [],
        },
        capability: {
            type: Object,
            default: () => {},
        },
        formData: {
            type: Object,
            default: () => {},
        },
        setForm: {
            type: Object,
            default: () => {},
        },
    },
    data() {
        const checkName = (rule, value, callback) => {
            if (value != "") {
                if (value.length > 32) {
                    callback(new Error("模板名称长度不超过32个字符"));
                } else if (!validateTempSpecial(value)) {
                    callback(
                        new Error(
                            "模板名称只能包含中文、字母、数字、字符（“_”、“-”和“.”）"
                        )
                    );
                }
            } else {
                callback(new Error("请输入模板名称"));
            }
            callback();
        };
        return {
            enumerationJSON,
            saveLoading: false,
            treeData: [],
            defaultProps: {
                children: "children",
                label: "label",
            },
            templateRules: {
                templateName: [
                    { required: true, validator: checkName, trigger: "blur" },
                ],

                templateList: [
                    {
                        type: "array",
                        required: true,
                        message: "请选择要保存为模板的模块",
                        trigger: "change",
                    },
                ],
            },
            templateForm: {
                templateName: "",
                templateRemark: "",
                templateList: [],
            },
            defaultExpandedKeys: [],
            loading: false,
        };
    },
    mounted() {
        this.loading = true;
        this.$emit("getAllMenuTree");
        // this.getAllMenuTree();
    },
    computed: {},
    methods: {
        removeEmpty(obj) {
            const finalObj = {};
            Object.keys(obj).forEach((key) => {
                if (
                    obj[key] &&
                    typeof obj[key] === "object" &&
                    !Array.isArray(obj[key])
                ) {
                    const nestedObj = this.removeEmpty(obj[key]);
                    if (Object.keys(nestedObj).length) {
                        finalObj[key] = nestedObj;
                    }
                } else if (Array.isArray(obj[key])) {
                    if (obj[key].length) {
                        obj[key].forEach((x) => {
                            const nestedObj = this.removeEmpty(x);
                            if (Object.keys(nestedObj).length) {
                                finalObj[key] = finalObj[key]
                                    ? [...finalObj[key], nestedObj]
                                    : [nestedObj];
                            }
                        });
                    }
                } else if (
                    // obj[key] !== "" &&
                    // obj[key] !== undefined &&
                    obj[key] !== null
                ) {
                    finalObj[key] = obj[key];
                }
            });
            return finalObj;
        },
        deduplicate(arr, t = "") {
            const newArr = [arr[0]];
            // 有指定字段
            if (t) {
                for (let i = 1; i < arr.length; i++) {
                    let repeat = false;
                    for (let j = 0; j < newArr.length; j++) {
                        if (t && arr[i][t] === newArr[j][t]) {
                            repeat = true;
                            break;
                        }
                    }
                    if (!repeat) newArr.push(arr[i]);
                }
            }
            // 无指定字段
            else {
                for (let i = 1; i < arr.length; i++) {
                    let repeat = false;
                    for (let j = 0; j < newArr.length; j++) {
                        if (arr[i] === newArr[j]) {
                            repeat = true;
                            break;
                        }
                    }
                    if (!repeat) newArr.push(arr[i]);
                }
            }
            return newArr;
        },
        getAllMenuTree() {
            this.menuList.forEach((firstTitle) => {
                firstTitle.children = [];
                for (let key of Object.keys(this.setForm[firstTitle.label])) {
                    if (key.indexOf("灵敏度配置") > -1) {
                        if (
                            this.$store.state.user.technicalSupportEngineerSign
                        ) {
                            firstTitle.children.push({
                                label: key.split("&")[0],
                                value: key.split("&")[1],
                            });
                        }
                    } else if (
                        key.indexOf("全局参数") < 0 &&
                        key.indexOf("车辆信息") < 0 &&
                        key.indexOf("驾驶员卡") < 0
                    ) {
                        firstTitle.children.push({
                            label: key.split("&")[0],
                            value: key.split("&")[1],
                        });
                    }
                }
            });
            this.menuList.forEach((item) => {
                if (item.value === "platformParams") {
                    item.children = this.deduplicate(item.children, "value");
                    item.children.forEach((k) => {
                        k.label = k.label.split(">").splice(0, 2).join(">");
                        if (k.value === "param701") {
                            k.label = "EHOME 5.0平台";
                        }
                        if (k.value === "param715") {
                            k.label = "28181平台";
                        }
                    });
                }
            });
            this.treeData = [
                {
                    label: "全部模块",
                    value: "all",
                    children: this.menuList.filter(
                        (item) => item.children.length
                    ),
                },
            ];
            this.defaultExpandedKeys = ["all"];
            this.loading = false;
        },
        treeCheck() {
            this.templateForm.templateList = this.$refs.tree.getCheckedKeys();
            this.$nextTick(() => {
                this.$refs.form.validateField("templateList");
            });
        },
        // 关闭弹窗
        close() {
            this.$emit("closeTemplate");
        },
        getSelectMenuList() {
            const getC = this.$refs.tree.getCheckedNodes();
            const getHC = this.$refs.tree.getHalfCheckedNodes();
            let selected_nodes = getHC.concat(getC);
            let selected_ids = new Set(); // 记录选中的节点tree_id
            let used_ids = new Set(); // 记录已经查询过的节点
            // 遍历初始化selected_ids
            for (let node of selected_nodes) {
                selected_ids.add(node.$treeNodeId);
            }
            // 最终的结果数据用一个根节点存储, 为了对齐递归的数据结构
            let root_node = {
                treeNodeId: -1,
                children: [],
            };
            // 添加给parent_node节点一个新节点 node
            // 注意:node 的类型是原始的 tree 节点
            // 而parent_node 的类型是真正的结果节点
            function AddNode(node, parent_node) {
                if (
                    !selected_ids.has(node.$treeNodeId) ||
                    used_ids.has(node.$treeNodeId)
                ) {
                    return;
                }
                used_ids.add(node.$treeNodeId); // 加过的要存入 used_ids 做标记
                let real_node = {
                    treeNodeId: node.$treeNodeId,
                    children: [],
                    label: node.label,
                    title: node.label,
                    value: node.value,
                    // 存储一下节点的数据
                };
                // // 添加子节点
                if (node.children) {
                    for (let child_node of node.children) {
                        AddNode(child_node, real_node);
                    }
                }
                if (real_node.children.length === 0) {
                    delete real_node.children;
                }
                if (!real_node.grade) {
                    delete real_node.grade;
                }
                if (!real_node.desc) {
                    delete real_node.desc;
                }
                parent_node.children.push(real_node);
            }
            for (let node of selected_nodes) {
                AddNode(node, root_node);
            }
            let result = root_node.children;
            return result[0].children;
        },
        minTime(time) {
            if (time && time.indexOf(":") > 0) {
                var min = time.split(":")[0];
                var sec = time.split(":")[1];
                return Number(min * 60) + Number(sec);
            }
        },
        formatParams() {
            let newFormData = JSON.parse(JSON.stringify(this.formData));
            for (let key of Object.keys(newFormData)) {
                if (key.indexOf("param2205") > -1) {
                    if (key.indexOf("reverse") > -1) {
                        newFormData[key] = {
                            chanNo: Number(key.split("_")[1]),
                            type: key.split("_")[2],
                            value: newFormData[key][key.split("_")[2]],
                        };
                    }
                    if (key.indexOf("sleepReportTimeInterval") > -1) {
                        newFormData[key] = {
                            chanNo: Number(key.split("_")[1]),
                            type: key.split("_")[2],
                            value: newFormData[key][key.split("_")[2]],
                        };
                    }
                }
                if (key.indexOf("param2222") > -1) {
                    if (newFormData[key].hasOwnProperty("mileageRadio")) {
                        newFormData[key].mileageRadio = Math.floor(
                            Number(newFormData[key].mileageRadio * 100)
                        );
                    }
                }
                if (key.indexOf("param924") > -1) {
                    if (newFormData[key].hasOwnProperty("daylightStartTime")) {
                        newFormData[key].daylightStartTime = this.minTime(
                            newFormData[key].daylightStartTime
                        );
                    }
                    if (newFormData[key].hasOwnProperty("daylightEndTime")) {
                        newFormData[key].daylightEndTime = this.minTime(
                            newFormData[key].daylightEndTime
                        );
                    }
                    if (
                        newFormData[key].hasOwnProperty("allDayDrivingTimeMax")
                    ) {
                        newFormData[key].allDayDrivingTimeMax = Math.floor(
                            Number(newFormData[key].allDayDrivingTimeMax * 3600)
                        );
                    }
                    if (newFormData[key].hasOwnProperty("deltaWarnTime")) {
                        newFormData[key].deltaWarnTime = Math.floor(
                            Number(newFormData[key].deltaWarnTime * 60)
                        );
                    }
                    if (
                        newFormData[key].hasOwnProperty(
                            "daylightDrivingTimeMax"
                        )
                    ) {
                        newFormData[key].daylightDrivingTimeMax = Math.floor(
                            Number(newFormData[key].daylightDrivingTimeMax * 60)
                        );
                    }
                    if (newFormData[key].hasOwnProperty("restTimeMin")) {
                        newFormData[key].restTimeMin = Math.floor(
                            Number(newFormData[key].restTimeMin * 60)
                        );
                    }
                    if (
                        newFormData[key].hasOwnProperty("nightDrivingTimeMax")
                    ) {
                        newFormData[key].nightDrivingTimeMax = Math.floor(
                            Number(newFormData[key].nightDrivingTimeMax * 60)
                        );
                    }
                    if (
                        newFormData[key].hasOwnProperty("nightDrivingRestTime")
                    ) {
                        newFormData[key].nightDrivingRestTime = Math.floor(
                            Number(newFormData[key].nightDrivingRestTime * 60)
                        );
                    }
                }
                if (key.indexOf("param993") > -1) {
                    if (
                        newFormData[key].banTime &&
                        newFormData[key].banTime.length
                    ) {
                        newFormData[key].banTime.forEach((item) => {
                            if (item.hasOwnProperty("advanceWarningTime")) {
                                item.advanceWarningTime =
                                    item.advanceWarningTime * 60;
                            }
                            if (item.hasOwnProperty("warningPeriod")) {
                                item.warningPeriod = item.warningPeriod * 60;
                            }
                        });
                    }
                }
                if (key.indexOf("param901") > -1) {
                    if (
                        newFormData[key].info[0].hasOwnProperty(
                            "distanceBeyongLane"
                        )
                    ) {
                        newFormData[key].info[0].distanceBeyongLane =
                            newFormData[key].info[0].distanceBeyongLane * 1000;
                    }
                    if (
                        newFormData[key].info[0].hasOwnProperty(
                            "nearCarDistance"
                        )
                    ) {
                        newFormData[key].info[0].nearCarDistance =
                            newFormData[key].info[0].nearCarDistance * 1000;
                    }
                    if (
                        newFormData[key].info[0].hasOwnProperty(
                            "collisionDistance"
                        )
                    ) {
                        newFormData[key].info[0].collisionDistance =
                            newFormData[key].info[0].collisionDistance * 1000;
                    }
                }
            }
            return newFormData;
        },
        saveTemplate() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    this.saveLoading = true;
                    let menuArr = this.templateForm.templateList.filter(
                        (item) => {
                            return item.indexOf("param") > -1;
                        }
                    );
                    let selectMenuList = this.getSelectMenuList();
                    let formatFormData = this.formatParams();
                    let formatParamsObj = {};
                    menuArr.forEach((item) => {
                        if (item === "param950") {
                            for (let key of Object.keys(formatFormData)) {
                                if (key.indexOf("param950_") > -1) {
                                    formatParamsObj[key] = formatFormData[key];
                                }
                            }
                        } else if (item === "param2205_1_horizonVanishLine") {
                            formatParamsObj["param2205_1_horizonVanishLine"] = {
                                chanNo: formatFormData[
                                    "param2205_1_horizonVanishLine"
                                ].chanNo,
                                type: "horizonVanishLine",
                                value: formatFormData[
                                    "param2205_1_horizonVanishLine"
                                ]["horizonVanishLine"],
                            };
                            formatParamsObj["param2205_1_verticalVanishLine"] =
                                {
                                    chanNo: formatFormData[
                                        "param2205_1_verticalVanishLine"
                                    ].chanNo,
                                    type: "verticalVanishLine",
                                    value: formatFormData[
                                        "param2205_1_verticalVanishLine"
                                    ]["verticalVanishLine"],
                                };
                        } else if (item === "param2205_1_audio") {
                            for (let key of Object.keys(formatFormData[item])) {
                                if (key !== "chanNo") {
                                    formatParamsObj[`param2205_1_${key}`] = {
                                        chanNo: 1,
                                        type: key,
                                        value: formatFormData[item][key],
                                    };
                                }
                            }
                        } else if (item === "param2209") {
                            for (let key of Object.keys(formatFormData[item])) {
                                formatParamsObj[`${item}_${key}`] =
                                    formatFormData[item][key];
                            }
                            delete formatParamsObj["param2209"];
                        } else if (item === "param6004") {
                            this.enumerationJSON.intelliDrive_DSM_newSensitivity.forEach(
                                (item) => {
                                    formatParamsObj[
                                        `param6004_0_${item.value}`
                                    ] = {
                                        ...formatFormData[
                                            `param6004_0_${item.value}`
                                        ],
                                        algorithmType: 0,
                                        sentivityType: Number(item.value),
                                    };
                                }
                            );
                        } else {
                            formatParamsObj[item] = formatFormData[item];
                        }
                    });
                    let ehomeParams = [];
                    for (let key of Object.keys(formatParamsObj)) {
                        let msgId = utils.getMsgId(
                            Number(key.split("_")[0].split("param")[1])
                        );
                        ehomeParams.push({
                            msgId: msgId,
                            params: formatParamsObj[key],
                        });
                    }
                    ehomeParams.forEach((item) => {
                        if (item.msgId === 921) {
                            item.params.cameraPosition = item.params.cameraPos;
                        }
                        if (item.msgId === 39) {
                            item.params.currIccid = "";
                            item.params.lockIccid = "";
                        }
                        if (
                            item.msgId === 706 ||
                            item.msgId === 704 ||
                            item.msgId === 702
                        ) {
                            delete item.params.serial;
                            delete item.params.id;
                        }
                    });
                    this.$api
                        .filegetParamDeviceById({
                            deviceId: Number(this.$route.query.deviceId),
                        })
                        .then((res) => {
                            if (res.success == true) {
                                const params = Object.assign(
                                    {},
                                    res.data[0],
                                    this.templateForm,
                                    {
                                        templateType: 3,
                                        templateContent: JSON.stringify({
                                            menuList: selectMenuList,
                                            ehomeParams: ehomeParams,
                                            capability: this.capability,
                                        }),
                                        templateContent2: {
                                            menuList: selectMenuList,
                                            ehomeParams: ehomeParams,
                                            capability: this.capability,
                                        },
                                    }
                                );
                                this.$api
                                    .hikDevParamTempAdd(params)
                                    .then((res) => {
                                        if (res.success == true) {
                                            this.$message.success(
                                                "模板保存成功"
                                            );
                                            this.close();
                                            this.saveLoading = false;
                                        } else {
                                            this.$message.error(
                                                "模板保存失败:" + res.msg
                                            );
                                            this.saveLoading = false;
                                        }
                                    });
                            } else {
                                this.$message.error(
                                    "获取设备信息失败:" + res.msg
                                );
                                this.saveLoading = false;
                            }
                        });
                }
            });
        },
    },
};
</script>
<style lang="less" scoped>
.template-box {
    padding: 0 20px;
}
.tree-box {
    height: 300px;
    overflow-y: auto;
    border: 1px solid #dcdfe6;
    border-radius: 2px;
    padding: 5px 8px;
}
</style>
<style lang="less">
.add-car-dialog {
    .dialog-footer {
        display: flex;
        justify-content: flex-end;
        padding: 12px !important;
        border-top: 1px solid #ebebeb;
    }
}
</style>
