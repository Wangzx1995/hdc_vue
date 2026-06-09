<template>
    <div class="start-upgrade">
        <el-dialog
            :visible="firmwareVisible"
            :show-close="false"
            :custom-class="'start-upgrade-dialog'"
            @close="close"
            :close-on-click-modal="false"
            :width="'480px'"
        >
            <span slot="title"> </span>
            <div class="title">
                <i class="el-icon-success" />
                <span>已发送升级命令</span>
            </div>
            <div class="start-upgrade-content">
                <span style="color: rgba(0, 0, 0, 0.65); font-size: 14px"
                    >已向设备发送升级命令，可在“我的升级任务”中查看进度。</span
                >
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="goTask" v-btn="'deviceUpgradeQueryMyTasks'"
                    >查看任务</el-button
                >
                <el-button
                    type="primary"
                    v-if="showNext"
                    @click="continueUpgrade"
                    >继续升级</el-button
                >
                <el-button type="primary" v-else @click="close"
                    >知道了</el-button
                >
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    props: {
        visible: {
            type: Boolean,
            default: false,
        },
        batchCode: {
            type: String,
            default: "",
        },
        organizeId: {
            type: Number,
            default: 0,
        },
        deviceInfoList: {
            type: Array,
            default: () => [],
        },
        taskId: {
            type: [String, Number],
            default: "",
        },
    },
    watch: {
        visible: {
            handler(val) {
                this.firmwareVisible = val;
            },
            deep: true,
        },
        deviceInfoList: {
            handler(val) {
                this.showNext = val.find((item) => {
                    return item.disabled === false;
                });
            },
            deep: true,
        },
    },
    data() {
        return {
            showNext: false,
            firmwareVisible: false,
        };
    },
    methods: {
        goTask() {
            this.$emit("update:visible", false);
            this.$router.push({
                path: "/maintenanceCenter/deviceUpgrade/deviceUpgradeTask/deviceUpgradeTaskDetail",
                query: {
                    batchCode: this.batchCode,
                    organizeId: this.organizeId,
                    taskId: this.taskId,
                },
            });
            // this.$api
            //     .getDeviceUpgradeLogBatchPage_UpgradeTask({
            //         currentPage: 1,
            //         pageSize: 20,
            //         batchCode: this.batchCode,
            //     })
            //     .then((res) => {
            //         if (res.success == true) {
            //             this.$router.push({
            //                 path: "/maintenanceCenter/deviceUpgrade/deviceUpgradeTask/deviceUpgradeTaskDetail",
            //                 query: {
            //                     batchCode: this.batchCode,
            //                     organizeId: this.organizeId,
            //                     taskId: this.taskId,
            //                 },
            //             });
            //         } else {
            //             this.$message.error("查询固件信息列表失败:" + res.msg);
            //         }
            //     });
        },
        close() {
            this.$emit("update:visible", false);
            // this.$router.push('/equipmentOperation/deviceUpgrade')
        },
        continueUpgrade() {
            this.$emit("update:visible", false);
            this.$emit("continueUpgrade");
        },
    },
};
</script>
<style lang="less" scoped>
.start-upgrade-content {
    display: flex;
    // align-items: center;
    // justify-content: center;
    // flex-direction: column;
    color: #000;
    padding-left: 34px;
}
.title {
    display: flex;
    align-items: center;
    span {
        font-size: 16px;
        color: #000000;
        font-weight: bold;
    }
    .el-icon-success {
        width: 22px;
        height: 22px;
        color: #02bf0f;
        margin-right: 12px;
        font-size: 22px;
    }
}
</style>
<style lang="less">
.start-upgrade-dialog {
    // .el-dialog__header {
    //     display: none;
    // }
}
</style>
