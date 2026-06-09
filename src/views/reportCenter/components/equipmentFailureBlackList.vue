<template>
    <div>
        <div class="equipment_failure_health">
            <h5 class="text-md health">
                <!-- 故障设备黑榜 -->
                {{ $t("deviceHealthCondition.faultyDevicesBlacklist") }}
            </h5>
        </div>
        <el-table
            :data="tableData"
            border
            class="table_equipment_failure"
            height="370"
        >
            <!-- 排名 -->
            <el-table-column
                type="index"
                min-width="100px"
                :label="$t('deviceHealthCondition.ranking')"
            ></el-table-column>
            <!-- 车牌号 -->
            <el-table-column
                prop="plateNum"
                :label="$t('common.plateNum')"
                min-width="200px"
            ></el-table-column>
            <!-- 设备序列号 -->
            <el-table-column
                prop="deviceCode"
                :label="$t('common.deviceSerialNum')"
                min-width="200px"
            ></el-table-column>
            <!-- 次数 -->
            <el-table-column
                prop="faultNum"
                :label="$t('deviceHealthCondition.faultNum')"
                align="right"
                min-width="100px"
            ></el-table-column>
        </el-table>
    </div>
</template>

<script>
export default {
    name: "EquipmentFailureBlackList",
    props: {
        tableData: {
            type: Array,
            default: () => {
                return [];
            },
        },
    },
    watch: {
        tableData: {
            handler(val) {
                this.tableData = val;
            },
            deep: true,
        },
    },
};
</script>

<style lang="less" scoped>
.equipment_failure_health {
    height: 50px;
    border-bottom: 1px solid #e4e4e4;
    padding-top: 10px;
}
.table_equipment_failure {
    width: 95%;
    margin: 20px auto;
}
</style>
