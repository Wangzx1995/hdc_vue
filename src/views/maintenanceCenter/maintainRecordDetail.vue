<template>
    <div class="p-x-md main-content">
        <div class="deviceInfo">
            <p class="deviceTitle">
                <!-- 基本信息 -->
                {{ $t("deviceLoadTaskManage.basicInformation") }}
            </p>
            <el-row>
                <el-col :span="6">
                    <p class="title">
                        <!-- 发布时间 -->
                        {{ $t("maintainRecord.releaseTime") }}
                    </p>
                    <span class="content">{{
                        detailsData.createTime || $t("common.unknown")
                    }}</span>
                </el-col>
                <el-col :span="6">
                    <p class="title">
                        <!-- 车牌号 -->
                        {{ $t("common.plateNum") }}
                    </p>
                    <span class="content">{{
                        detailsData.plateNum || $t("common.unknown")
                    }}</span>
                </el-col>
                <el-col :span="6">
                    <p class="title">
                        <!-- 所属组织 -->
                        {{ $t("common.orgPath") }}
                    </p>
                    <span class="content">{{
                        detailsData.orgPath || $t("common.unknown")
                    }}</span>
                </el-col>
                <el-col :span="6">
                    <p class="title">
                        <!-- 状态变更时间 -->
                        {{ $t("maintainRecord.stateChangeTime") }}
                    </p>
                    <span class="content">{{
                        detailsData.updateTime || $t("common.unknown")
                    }}</span>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="6">
                    <p class="title">
                        <!-- 维护人员 -->
                        {{ $t("maintainRecord.maintenanceStaff") }}
                    </p>
                    <span class="content">{{
                        detailsData.maintenancerName || $t("common.unknown")
                    }}</span>
                </el-col>
                <el-col :span="6">
                    <p class="title">
                        <!-- 维护状态 -->
                        {{ $t("maintainRecord.maintenanceStatus") }}
                    </p>
                    <span class="content">{{
                        detailsData.maintenanceStatus == 1
                            ? $t("maintainRecord.maintained")
                            : detailsData.maintenanceStatus == 2
                            ? $t("maintainRecord.termination")
                            : $t("maintainRecord.toBeMaintained") ||
                              $t("common.unknown")
                    }}</span>
                </el-col>
                <el-col :span="6">
                    <p class="title">
                        <!-- 生成维护任务备注信息 -->
                        {{ $t("maintainRecord.generateMaintenanceNote") }}
                    </p>
                    <span
                        :title="detailsData.comment"
                        class="commentContent content"
                        >{{ detailsData.comment }}</span
                    >
                </el-col>
                <el-col :span="6">
                    <p class="title">
                        <!-- 备注信息 -->
                        {{ $t("maintainRecord.memo") }}
                    </p>
                    <span
                        :title="detailsData.submitComment"
                        class="commentContent content"
                        >{{ detailsData.submitComment }}</span
                    >
                </el-col>
            </el-row>
            <p class="deviceTitle">
                <!-- 异常情况处理 -->
                {{ $t("maintainRecord.exception") }}
            </p>
            <div class="title_leftLine">
                <el-row type="flex" justify="space-between">
                    <el-col :span="11">
                        <p
                            v-if="detailsData['maintenanceFaultBeforeList']"
                            class="title_leftLine"
                        >
                            <!-- 处理前故障 -->
                            {{ $t("maintainRecord.faultBeforeHandling") }}
                            ({{
                                detailsData["maintenanceFaultBeforeList"]
                                    .length
                            }})
                        </p>
                        <div class="tableBox">
                            <el-table
                                element-loading-color="#007213"
                                height="300"
                                :data="detailsData.maintenanceFaultBeforeList"
                                border
                            >
                                <!-- 故障类型 -->
                                <el-table-column
                                    prop="faultName"
                                    :label="
                                        $t('deviceHealthCondition.faultType')
                                    "
                                    min-width="100px"
                                >
                                    <template slot-scope="scope">
                                        <div>{{ scope.row.faultName }}</div>
                                    </template>
                                </el-table-column>
                                <!-- 设备序列号 -->
                                <el-table-column
                                    prop="deviceSerialNum"
                                    :label="$t('common.deviceSerialNum')"
                                    min-width="100px"
                                ></el-table-column>
                                <!-- 设备型号 -->
                                <el-table-column
                                    prop="deviceModelCode"
                                    :label="$t('common.deviceModelCode')"
                                    min-width="150px"
                                ></el-table-column>
                                <!-- 故障开始时间 -->
                                <el-table-column
                                    prop="startTime"
                                    :label="$t('maintainRecord.faultStartTime')"
                                    min-width="240px"
                                ></el-table-column>
                            </el-table>
                        </div>
                    </el-col>
                    <el-col :span="11">
                        <p
                            v-if="detailsData['maintenanceFaultBeforeList']"
                            class="title_leftLine"
                        >
                            <!-- 剩余待处理故障 -->
                            {{ $t("maintainRecord.remainingUnresolvedFaults") }}
                            ({{
                                detailsData["maintenanceFaultAfterList"].length
                            }})
                        </p>
                        <div class="tableBox">
                            <!-- 当前维护任务的故障已全部解决 -->
                            <el-table
                                :empty-text="
                                    $t('maintainRecord.tableEmptyText')
                                "
                                element-loading-color="#007213"
                                height="300"
                                :data="detailsData.maintenanceFaultAfterList"
                                border
                            >
                                <!-- 故障类型 -->
                                <el-table-column
                                    prop="faultName"
                                    :label="
                                        $t('deviceHealthCondition.faultType')
                                    "
                                    min-width="100px"
                                >
                                    <template slot-scope="scope">
                                        <div>
                                            {{ scope.row.faultName }}
                                            <span
                                                class="newStyle"
                                                v-if="scope.row.newFault"
                                                >new</span
                                            >
                                        </div>
                                    </template>
                                </el-table-column>
                                <!-- 设备序列号 -->
                                <el-table-column
                                    prop="deviceSerialNum"
                                    :label="$t('common.deviceSerialNum')"
                                    min-width="100px"
                                ></el-table-column>
                                <!-- 设备型号 -->
                                <el-table-column
                                    prop="deviceModelCode"
                                    :label="$t('common.deviceModelCode')"
                                    min-width="150px"
                                ></el-table-column>
                                <!-- 故障开始时间 -->
                                <el-table-column
                                    prop="startTime"
                                    :label="$t('maintainRecord.faultStartTime')"
                                    min-width="240px"
                                ></el-table-column>
                            </el-table>
                        </div>
                    </el-col>
                </el-row>
            </div>
            <p class="deviceTitle">
                <!-- 摄像机截图 -->
                {{ $t("maintainRecord.cameraScreenshot") }}
            </p>
            <div v-if="detailsData['maintenanceImageList']" class="imgBox">
                <div
                    class="imgHeights"
                    v-for="(item, index) in detailsData['maintenanceImageList']"
                    :key="index"
                >
                    <viewer class="img-area">
                        <img
                            class="imgHeight"
                            :src="item.fileUrl"
                            :title="item.fileDesc"
                            :alt="item.fileDesc"
                        />
                    </viewer>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import TimeUtil from "@/utils/time";
export default {
    data() {
        return {
            id: this.$route.query.id,
            detailsData: {},
        };
    },
    methods: {
        getDetails() {
            this.$api
                .faultMaintenanceGetDetails({ id: this.id })
                .then((res) => {
                    if (res.success) {
                        this.detailsData = res.data;
                    } else {
                        this.$message.error(`${res.msg}`);
                    }
                });
        },
    },
    mounted() {},
    created() {
        this.getDetails();
    },
};
</script>

<style lang="less" scoped>
.top {
    padding: 20px 30px 0px 30px;
}
.deviceInfo {
    width: 100%;
    margin-bottom: 10px;
    padding-top: 10px;
    .deviceTitle {
        margin-top: 10px;
        font-size: 16px;
        font-weight: 600;
        border-left: 4px solid rgba(0, 0, 0, 0.4);
        padding-left: 4px;
    }
    .imgBox {
        overflow: hidden;
        padding-bottom: 20px;
        .imgHeights {
            float: left;
            margin-right: 10px;
            margin-top: 10px;
            .imgHeight {
                height: 200px;
            }
            .img-area {
                height: 200px;
                cursor: pointer;
            }
        }
    }
    .deviceInfoTitle {
        font-size: 16px;
        font-weight: 600;
        padding-bottom: 10px;
        margin-top: 20px;
    }
    .title {
        font-size: 12px;
        color: rgba(0, 0, 0, 0.4);
    }
    .image {
        width: 20px;
    }
    .tableBox {
        margin: 15px 0;
    }
    .content {
        font-size: 14px;
    }
    .commentContent {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    .title_leftLine {
        padding-left: 4px;
        font-size: 14px;
        font-weight: 400;
        margin-top: 5px;
        .title_span {
            color: rgba(0, 0, 0, 0.4);
            font-size: 12px;
        }
    }
}
.newRow {
    display: flex;
    flex-direction: row;
}
.newStyle {
    font-size: 14px;
    color: red;
}
.form-detail {
    .reopen {
        display: flex;
        justify-content: space-between;
    }
    .form-detail-content {
        display: flex;
        flex-wrap: wrap;
        .form-detail-item {
            width: 25%;
            margin-bottom: 16px;
            font-size: 14px;
            p {
                display: flex;
                align-items: center;
                color: #999;
                line-height: 1;
                .el-icon-warning {
                    font-size: 20px;
                }
            }
        }
    }
}
</style>
