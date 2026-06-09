<template>
    <div class="task-item m-b-sm">
        <div
            v-for="(item, orgId) in updateData"
            :key="orgId"
            class="border_btm"
        >
            <div class="item" style="margin-top: 10px">
                <span>{{
                    item.deviceModelCode + " ｜ " + item.firmwareVersion
                }}</span>
                <span>
                    <!-- 更新时间 -->
                    {{ $t("common.updateTime") }}
                    ：{{
                        $moment(item.statisticsRefreshTime).format(
                            "YYYY-MM-DD HH:mm:ss"
                        )
                    }}</span
                >
            </div>
            <div class="item">
                <span>
                    <!-- 全部 -->
                    {{ $t("common.all") }}
                    ：{{ item.taskDevRecordTotalNum }} ｜
                    <!-- 成功 -->
                    {{ $t("common.success") }}
                    ：{{ item.taskDevSuccessNum }}
                    ｜
                    <!-- 进行中 -->
                    {{ $t("common.progress") }}
                    ：{{ item.taskDevIngNum }} ｜
                    <!-- 失败 -->
                    {{ $t("common.failed") }}
                    ：{{ item.taskDevFailNum }}｜
                    <!-- 终止 -->
                    {{ $t("common.termination") }}
                    ：{{ item.taskDevEndNum }}</span
                >
                <span>
                    <span class="config-detail" @click="goToTaskDetail(item)">
                        <!-- 详情 -->
                        {{ $t("common.detail") }}
                        ></span
                    >
                </span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ["updateData"],
    methods: {
        goToTaskDetail(item) {
            this.$router.push({
                path: "/maintenanceCenter/deviceUpgrade/deviceUpgradeTask/deviceUpgradeTaskDetail",
                query: {
                    batchCode: item.batchCode,
                    organizeId: item.orgId,
                    firmwareTypeName: item.firmwareTypeName,
                    deviceModelCode: item.deviceModelCode,
                    updateVersion: item.updateVersion,
                    operationTime: item.createTime,
                    protocolName: item.protocolName,
                    taskId: item.id,
                },
            });
        },
    },
};
</script>

<style lang="less" scoped>
.task-item {
    .item {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;

        .config-detail {
            color: #4886ff;
            cursor: pointer;
        }
    }
}
.border_btm {
    border-bottom: 1px solid #dfdfdf;
}
</style>
