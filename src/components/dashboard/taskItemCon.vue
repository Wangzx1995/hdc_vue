<template>
    <div class="task-item m-b-sm">
        <div
            v-for="(item, orgId) in updateData"
            :key="orgId"
            class="border_btm"
        >
            <div class="item" style="margin-top: 10px">
                <span>{{
                    item.cmd && cmdList[item.cmd] ? cmdList[item.cmd] : "--"
                }}</span>
                <span>
                    <!-- 更新时间 -->
                    {{ $t("common.updateTime") }}
                    {{
                        $moment(item.updateTime).format("YYYY-MM-DD HH:mm:ss")
                    }}</span
                >
            </div>
            <div class="item">
                <span>
                    <!-- 全部 -->
                    {{ $t("common.all") }}
                    ：{{ item.totalNum }} ｜
                    <!-- 成功 -->
                    {{ $t("common.success") }}：{{ item.successNum }} ｜
                    <!-- 进行中 -->
                    {{ $t("common.progress") }}：{{ item.ingNum }} ｜
                    <!-- 失败 -->
                    {{ $t("common.failed") }}：{{ item.failNum }}</span
                >
                <!-- <span>
            <span class="config-detail" @click="goToTaskDetail(item.orgId,item.batchCode,item.cmd)">详情></span>
          </span> -->
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ["updateData"],
    data() {
        return {
            cmdList: {
                // 2: '文件配置下发--HTTP协议',
                5: this.$t("dashboard.cmdListText1"), //"文件配置下发",
                6: this.$t("dashboard.cmdListText2"), //"协议配置下发",
                8: this.$t("dashboard.cmdListText3"), //"协议配置下发",
                9: this.$t("dashboard.cmdListText4"), //"文件模板配置下发",
                10: this.$t("dashboard.cmdListText5"), //"协议模板配置下发",
            },
        };
    },
    methods: {
        goToTaskDetail(orgId, batchCode, cmd) {
            this.$router.push({
                path: "/maintenanceCenter/deviceConfiguration/configurationView/configurationTaskDetailNew",
                query: { batchCode, orgId, cmd },
            });
            // this.$router.push({
            //   path: "/equipmentOperation/deviceUpgrade/deviceUpgradeTask/deviceUpgradeTaskDetail",
            //   query:{
            //     batchCode: batchCode,
            //     organizeId: orgId,
            //   }
            // })
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
