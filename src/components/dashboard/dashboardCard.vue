<template>
    <!-- v-show="showItemId[0].showBol || showItemId[1].showBol || showItemId[2].showBol" -->
    <div v-show="showItem2 || showItem4" layout="row" class="dashboard-card">
        <el-card
            v-show="showItem2"
            class="box-card"
            :class="showItem4 ? ' m-r-md' : ''"
        >
            <div slot="header" class="card-header">
                <span class="marginTop">
                    <!-- 升级任务 -->
                    {{ $t("dashboard.itemsTitle1") }}
                </span>
                <span class="more-fault" @click="goToUpgradeTask">
                    <!-- 更多 -->
                    {{ $t("common.more") }}
                    ></span
                >
            </div>
            <div v-if="taskUpdateData">
                <!-- 暂无数据 -->
                {{ $t("common.noData") }}
            </div>
            <TaskItem
                :updateData="updateData"
                v-if="flag"
                :batchCode="batchCode"
            ></TaskItem>
        </el-card>
        <el-card v-show="showItem4" class="box-card" style="padding-top: 0px">
            <div slot="header" class="card-header">
                <span class="marginTop">
                    <!-- 配置任务 -->
                    {{ $t("dashboard.itemsTitle3") }}
                </span>
                <span class="more-fault" @click="goToConfigTask">
                    <!-- 更多 -->
                    {{ $t("common.more") }}
                    ></span
                >
            </div>
            <div v-if="taskConfigData">
                <!-- 暂无数据 -->
                {{ $t("common.noData") }}
            </div>
            <TaskItemCon :updateData="updateData1" v-if="flag2"></TaskItemCon>
        </el-card>
    </div>
</template>
<script>
import TaskItem from "@/components/dashboard/taskItem.vue";
import TaskItemCon from "@/components/dashboard/taskItemCon.vue";
export default {
    data() {
        return {
            showItem2: false,
            showItem4: false,
            isNoData: true,
            activeName: "first",
            updateData: [],
            updateData1: [],
            flag: false,
            flag2: false,
            // waitFaultData: [],
            faultFlag: false,
            batchCode: "",
            taskUpdateData: false,
            taskConfigData: false,
        };
    },
    props: {
        showItemBoolean: {
            type: Boolean,
            default: false,
        },
        showItems: {
            type: Array,
            default: () => {
                return [];
            },
        },
        // showItemId:{
        //   type:Array,
        //   default:[]
        // }
    },
    watch: {
        showItemBoolean: {
            handler(val) {},
            deep: true,
            immediate: false,
        },
        showItems: {
            handler(val) {
                if (val.length) {
                    val.forEach((item) => {
                        if (item["id"] == 4) {
                            this.showItem4 = item["showBol"];
                        }
                        if (item["id"] == 2) {
                            this.showItem2 = item["showBol"];
                        }
                    });
                }
            },
            deep: true,
            immediate: true,
        },
        // showItemId:{
        //   handler(val){
        //     console.log(val, '+++++++++++++');
        //     this.activeName = !val[1].showBol ? 'second' : 'first'
        //     this.getData();
        //   },
        //   deep: true
        // }
    },
    components: { TaskItem, TaskItemCon },
    methods: {
        //跳转升级任务页
        goToUpgradeTask() {
            this.$router.push({
                path: "/maintenanceCenter/deviceUpgrade/deviceUpgradeTask",
                query: {
                    tabName: "task",
                },
            });
        },
        //跳转至配置任务页
        goToConfigTask() {
            this.$router.push({
                path: "/maintenanceCenter/deviceConfiguration/configurationTask",
                query: {
                    searchWay: "2",
                },
            });
        },
        //升级/配置任务列表
        getData() {
            this.$api.getUpdateData().then((res) => {
                if (res.success == true) {
                    if (res.data.length > 0) {
                        this.updateData = res.data;
                        this.flag = true;
                    } else {
                        this.taskUpdateData = true;
                    }
                } else {
                    this.updateData = "";
                    this.$message.error(res.msg);
                }
            });
            this.$api.getSettingData().then((res) => {
                if (res.success == true) {
                    if (res.data.length > 0) {
                        this.updateData1 = res.data;
                        this.flag2 = true;
                    } else {
                        this.taskConfigData = true;
                    }
                } else {
                    this.updateData1 = "";
                    this.$message.error(res.msg);
                }
            });
        },
        //待处理故障列表
        // getFaultList(){
        //   this.$api.getFaultList().then(res=>{
        //     if(res.success==true){
        //       if(res.data.length>0){
        //         this.waitFaultData = res.data
        //         this.faultFlag = true
        //         this.isNoData = false
        //       }else{
        //         this.isNoData = true;
        //       }
        //     }else{
        //       this.$message.error('获取待处理故障数据失败:' + res.msg)
        //     }
        //   })
        // },
        setHeight() {},
    },
    mounted() {
        this.getData();
        // this.getFaultList()
    },
};
</script>
<style scoped lang="less">
div /deep/ .el-card__body {
    padding-top: 0 !important;
}
.marginTop {
    font-size: 14px;
    font-weight: bold;
}
.dashboard-card {
    width: 100%;
    min-height: 210px;
    .more-fault {
        color: #4886ff;
        cursor: pointer;
    }
    // margin-top: 20px;
    justify-content: space-between;
    .box-card {
        flex: 1;
        .card-header {
            display: flex;
            justify-content: space-between;
            span,
            a {
                line-height: 1 !important;
            }
        }
        &.tab-card {
            background: #ffffff;
            position: relative;
        }
    }
    .el-tabs__header {
        .el-tabs__nav,
        .el-tabs__item {
            height: 50px !important;
            line-height: 50px;
        }
    }
    .el-tabs__content {
        padding: 20px;
    }
    .link {
        height: 50px;
        position: absolute;
        line-height: 50px;
        right: 0;
        top: 0;
        margin-right: 20px;
        z-index: 99999;
    }
}
</style>
