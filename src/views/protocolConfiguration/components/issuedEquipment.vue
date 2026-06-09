<template>
    <div>
        <G-SearchTableList
            ref="SearchTableList"
            :applicationJson="false"
            :columns="columns"
            :customHeight="106"
            @formatParams="formatParams"
            @selectionChange="selectionChange"
            :handleData="carList"
            :key="tableKey"
        >
            <div class="p-b" slot="searchOperation">
                <el-button type="primary" @click="openDialog()"
                    >添加车辆</el-button
                >
                <el-button
                    :disabled="!selectionIds.length || carList.length === 1"
                    @click="deleteCar(selectionIds)"
                    >删除车辆</el-button
                >
            </div>
            <template v-slot:deviceModelCode="scope">
                <div>
                    {{ scope.data.deviceModelCode
                    }}<span v-if="scope.data.protocolName"
                        >({{ scope.data.protocolName }})</span
                    >
                </div>
            </template>
            <template v-slot:deviceStatus="scope">
                <div>
                    <el-tag type="success" v-if="scope.data.deviceStatus === 1"
                        >在线</el-tag
                    >
                    <el-tag
                        type="warning"
                        v-else-if="scope.data.deviceStatus === 2"
                        >休眠</el-tag
                    >
                    <el-tag
                        type="info"
                        v-else-if="scope.data.deviceStatus === 0"
                        >离线</el-tag
                    >
                </div>
            </template>
            <template v-slot:operation="scope">
                <div class="operation-box">
                    <el-button
                        type="text"
                        @click="deleteCar([scope.data.id])"
                        :disabled="carList.length === 1"
                        >删除</el-button
                    >
                </div>
            </template>
        </G-SearchTableList>
        <el-dialog
            title="添加车辆"
            :visible.sync="addCarVisible"
            :close-on-click-modal="false"
            :width="'1400px'"
            :custom-class="'add-car-dialog'"
        >
            <add-car-dialog
                :key="timer"
                @handleSuccess="handleSuccess"
                @cancel="cancel"
            ></add-car-dialog>
        </el-dialog>
    </div>
</template>
<script>
import addCarDialog from "./addCarDialog.vue";
export default {
    name: "",
    props: {
        activeTabName: {
            type: String,
        },
    },
    components: { addCarDialog },
    data() {
        return {
            //列表请求url
            url: "/deviceParam/getParamDevicePage",
            //表格列
            columns: [
                {
                    type: "selection",
                },
                {
                    label: "车牌号",
                    prop: "plateNum",
                },
                {
                    label: "所属组织",
                    prop: "organizeName",
                },
                {
                    label: "设备版本号",
                    prop: "softwareVersion",
                },
                {
                    label: "终端手机号",
                    prop: "deviceCode",
                },
                {
                    label: "设备型号",
                    slot: "deviceModelCode",
                },
                {
                    label: "设备序列号",
                    prop: "deviceSerialNum",
                },
                {
                    label: "设备状态",
                    slot: "deviceStatus",
                },
                {
                    label: "操作",
                    width: 120,
                    slot: "operation",
                },
            ],
            detailsVisible: false,
            //1:添加   2:编辑
            dialogType: 1,
            detailsData: {},
            timer: null,
            carList: [],
            selectionIds: [],
            addCarVisible: false,
            tableKey: "",
        };
    },
    created() {
        this.carList = JSON.parse(this.$route.query.carList);
        this.getCarIds();
    },
    mounted() {},
    computed: {},
    watch: {
        activeTabName(newVal) {
            if (newVal === "second") {
                setTimeout(() => {
                    this.$nextTick(() => {
                        this.$refs.SearchTableList.$refs.GTable.tableResize();
                    });
                }, 100);
            }
        },
    },
    methods: {
        formatParams(params) {
            // params.organizeId = this.$route.query.organizeId;
        },
        selectionChange(selection) {
            this.selectionIds = selection.reduce((prev, cur) => {
                return prev.concat(cur["id"]);
            }, []);
        },
        deleteCar(ids) {
            if (this.carList.length - ids.length < 1) {
                this.$message("请至少保留一个设备！");
                return;
            }
            this.$confirm(
                `确定要删除${ids.length === 1 ? "该" : "选中"}车辆吗？`,
                this.$t("common.prompt"),
                {
                    type: "warning",
                }
            ).then(() => {
                ids.map((id) => {
                    let index = this.carList.findIndex((item) => {
                        return item.id === id;
                    });
                    if (index > -1) {
                        this.carList.splice(index, 1);
                    }
                });
                this.$refs.SearchTableList.clearSelection();
                this.getCarIds();
                this.tableKey = Math.random();
            });
        },
        handleSuccess(list) {
            const hash = {};
            this.carList = this.carList.concat(list).reduce((item, next) => {
                hash[next.id] ? "" : (hash[next.id] = true && item.push(next));
                return item;
            }, []);
            this.getCarIds();
        },
        openDialog() {
            this.timer = new Date().getTime();
            this.addCarVisible = true;
        },
        cancel() {
            this.addCarVisible = false;
        },
        getCarIds() {
            let ids = this.carList.reduce((prev, cur) => {
                return prev.concat(cur["id"]);
            }, []);
            this.$emit("carIdsChange", ids);
        },
    },
};
</script>
<style lang="less" scoped>
.operation-box {
    .el-button {
        color: #1890ff;
    }
}
</style>
<style lang="less">
.add-car-dialog {
    .el-dialog__body {
        padding: 0;
    }
}
</style>
