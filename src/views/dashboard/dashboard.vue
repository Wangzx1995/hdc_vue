<template>
    <div>
        <el-dialog
            :title="diaTitle"
            :visible="noticeBol"
            @close="noticeBol = false"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :destroy-on-close="true"
            :show-close="updateTime == 0"
        >
            <template slot="title">
                <div
                    class="m-l-sm"
                    style="color: #000; font-size: 20px; font-weight: 800"
                >
                    {{ diaTitle }}
                </div>
            </template>
            <div class="dia-title-box">
                <div
                    v-for="(item, index) in noTiceList"
                    :key="index"
                    :style="
                        index == noTiceList.length - 1
                            ? 'border-bottom: none;'
                            : 'border-bottom: 1px solid #ebebeb;'
                    "
                >
                    <div class="content-text" v-html="item.content"></div>

                    <!-- <p style="white-space: pre-line" class="noticeC">
                    {{ item.content }}
                </p> -->
                </div>
            </div>
            <span
                slot="footer"
                class="dialog-footer"
                style="
                    justify-content: space-between;
                    display: flex;
                    align-items: center;
                "
            >
                <el-checkbox v-model="noTice">
                    <!-- 不再提醒 -->
                    {{ $t("login.doNotRemindAgain") }}
                </el-checkbox>
                <el-button
                    type="primary"
                    @click="closeDialog"
                    :disabled="updateTime > 0"
                    >{{
                        updateTime == 0
                            ? $t("common.gotIt")
                            : `${updateTime}` + $t("dashboard.second")
                    }}</el-button
                >
            </span>
        </el-dialog>
        <PromptUser
            :showManage="JSON.stringify(validateOverdueManages)"
        ></PromptUser>
        <div
            v-if="dataPermission != 2"
            id="sortableBox"
            class="dashboard-index p-a-md"
        >
            <div
                data-id="1"
                :class="{ itemWeight: showItemBol }"
                class="item dashboard-count m-b-md"
            >
                <div
                    v-show="enableBigData"
                    layout="column"
                    @click="goCarOnlineRate()"
                    class="point"
                >
                    <span class="text-md">
                        <!-- 车辆上线数/总数 -->
                        {{ $t("dashboard.carUpLineNum") }}
                        /
                        {{ $t("dashboard.carTotal") }}
                        <i class="el-icon-arrow-right"></i
                    ></span>
                    <span class="text-2x"
                        >{{ carUpLineNum }}/{{ carTotal }}</span
                    >
                </div>
                <div
                    layout="column"
                    @click="goConditionMonitor()"
                    class="point"
                >
                    <span class="text-md">
                        <!-- 设备在线数/总数 -->
                        {{ $t("dashboard.onlineNum") }}
                        /
                        {{ $t("dashboard.carTotal") }}
                        <i class="el-icon-arrow-right"></i
                    ></span>
                    <span class="text-2x">{{ onlineNum }}/{{ total }}</span>
                </div>
                <div layout="column">
                    <span class="text-md">
                        <!-- 设备在线率 -->
                        {{ $t("dashboard.onlineRate") }}
                    </span>
                    <span class="text-2x">{{ onlineRate }}%</span>
                </div>
                <div layout="column" @click="goFaultManage()" class="point">
                    <span class="text-md">
                        <!-- 待处理故障数 -->
                        {{ $t("dashboard.waitHandleNum") }}
                        <i class="el-icon-arrow-right"></i
                    ></span>
                    <span class="text-2x">{{ waitHandleNum }}</span>
                </div>
                <div layout="column" @click="goNetLink()" class="point">
                    <span class="text-md">
                        <!-- 车辆入网数/总数 -->
                        {{ $t("dashboard.carNetworkAccess") }}
                        /
                        {{ $t("dashboard.carTotal") }}
                        <i class="el-icon-arrow-right"></i
                    ></span>
                    <span class="text-2x"
                        >{{ carNetworkAccess.accessNum }}/{{
                            carNetworkAccess.totalNum
                        }}</span
                    >
                </div>
            </div>
            <div class="item" :class="{ itemWeight: showItemBol }" data-id="2">
                <!-- 界面内上线率图表 -->
                <DashboardTrend
                    :showItemBoolean="showItemBol"
                    :key="this.timerTrend"
                ></DashboardTrend>
            </div>
            <div class="item" :class="{ itemWeight: showItemBol }" data-id="4">
                <!-- 界面升级统计图表 -->
                <DashboardChart
                    :showItems="items"
                    :showItemBoolean="showItemBol"
                    :key="this.timer"
                ></DashboardChart>
            </div>
            <!-- :showItemId="items" -->
            <div class="item" :class="{ itemWeight: showItemBol }" data-id="3">
                <!-- 升级任务&配置任务 -->
                <DashboardCard
                    :showItems="items"
                    :showItemBoolean="showItemBol"
                ></DashboardCard>
            </div>
            <div
                v-if="showItemBol"
                :style="{ height: rightItemHeight + 'px' }"
                class="rightItem"
            >
                <p class="titleP">
                    <!-- 首页模块自定义 -->
                    {{ $t("dashboard.homeModuleCustomization") }}
                </p>
                <p class="titleTold">
                    <!-- 您可以对卡片进行隐藏，移动等自定义操作 -->
                    {{ $t("dashboard.homeModuleCustomizationMsg1") }}
                </p>
                <div v-for="item in items" :key="item.id" class="item_">
                    <p class="itemTitle">{{ item.title }}</p>
                    <el-switch
                        active-color="#2080f7"
                        class="itemSwitch"
                        v-model="item.showBol"
                    ></el-switch>
                </div>
                <p class="titleTold">
                    <!-- 更多模块敬请期待~ -->
                    {{ $t("dashboard.homeModuleCustomizationMsg1") }}
                </p>
                <div class="btnBox">
                    <el-button
                        @click="showItemBol = false"
                        type="default"
                        size="mini"
                    >
                        <!-- 取消 -->
                        {{ $t("common.cancel") }}
                    </el-button>
                    <el-button @click="saveItem" type="primary" size="mini">
                        <!-- 保存 -->
                        {{ $t("common.save") }}
                    </el-button>
                </div>
            </div>
            <div v-if="!showItemBol" class="showBtn">
                <el-button
                    type="primary"
                    @click="showItemBol = true"
                    :radius="true"
                    ><i class="el-icon-setting"></i
                ></el-button>
            </div>
        </div>
        <div
            :style="{ height: rightItemHeight + 'px' }"
            v-if="dataPermission == 2"
            id="noDataBox"
            class="dashboard-index p-a-md"
        >
            <div class="imgBox">
                <img src="../../../static/images/欢迎页.png" alt="" />
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters } from "vuex";
import Sortable from "sortablejs";
import DashboardTrend from "@/components/dashboard/dashboardTrend.vue";
import DashboardCard from "@/components/dashboard/dashboardCard.vue";
import DashboardChart from "@/components/dashboard/dashboardChart.vue";
import PromptUser from "@/components/promptUser.vue";
import TimeUtil from "@/utils/time";

export default {
    computed: {
        ...mapGetters(["setting", "permission_routers", "current_page"]),
    },
    data() {
        return {
            noArgen: true,
            enableBigData: false, //是否显示上线率
            noTice: false, //不再提醒
            noticeBol: false, //公告弹窗
            noTiceList: [], //公告内容列表
            diaTitle: "", //公告标题
            codeUpgrade: "", //公告code
            borBottom: false, //是否有下划线
            carTotal: 0,
            dataPermission: localStorage.getItem("dataPermission"),
            carUpLineNum: 0,
            offLineNum: 0,
            onlineNum: 0,
            onlineRate: 0,
            total: 0,
            waitHandleNum: 0,
            carNetworkAccess: {},
            rightItemHeight: 500,
            showItemBol: false,
            copyItemArr: [],
            sortable1: null,
            copyItems: [],
            itemArr: [],
            items: [],
            validateOverdueManages: {},
            timer: "",
            timerTrend: "",
            upgradeBol: false,
            upgradeData: [],
            paramsList: {
                month: TimeUtil.format(new Date(), "YYYY-MM"),
                currentPage: 1, //页码，从1开始
                pageSize: 20, //分页大小
            },
            updateTime: 10, //升级公告倒计时，5S后才能关闭
        };
    },
    components: { DashboardTrend, DashboardCard, PromptUser, DashboardChart },
    created() {
        const flag = Number(localStorage.getItem("enableBigData"));
        if (flag == 0) {
            this.enableBigData = true;
        } else if (flag == 1) {
            this.enableBigData = false;
        }
        if (this.dataPermission == 2) return;
        //根据用户菜单权限设置其首页显示模块
        this.items = [];
        this.itemArr = [1, 2];
        this.permission_routers.forEach((item) => {
            switch (item.path) {
                case "/maintenanceCenter":
                    this.itemArr = [1, 2, 3, 4];
                    for (let i = 0; i < item.children.length; i++) {
                        if (item.children[i].path == "/deviceUpgrade") {
                            this.items.push(
                                {
                                    id: 2,
                                    // title: "升级任务",
                                    title: this.$t("dashboard.itemsTitle1"),
                                    showBol: false,
                                },
                                {
                                    id: 5,
                                    // title: "本月升级统计",
                                    title: this.$t("dashboard.itemsTitle2"),
                                    showBol: false,
                                }
                            );
                        }
                        if (item.children[i].path == "/deviceConfig") {
                            this.items.push({
                                id: 4,
                                // title: "配置任务",
                                title: this.$t("dashboard.itemsTitle3"),
                                showBol: false,
                            });
                        }
                    }
                    break;
            }
        });
        this.copyItems = JSON.parse(JSON.stringify(this.items));
        this.copyItemArr = JSON.parse(JSON.stringify(this.itemArr));
        this.getHomeSettings();
        this.setTableHeight();
        this.getUpgrade();
        // this.basicSettings();
        this.getValidateOverdue();
        // this.devUpgradeForceApplyInfo()
    },
    methods: {
        //获取设备升级锁定任务提示框
        // devUpgradeForceApplyInfo(){
        //   this.$api.devUpgradeForceApplyInfo().then(res =>{
        //     if(res.success){
        //       this.upgradeData = res.data.infoList;
        //       if(this.upgradeData.length) this.upgradeBol = true;
        //     }else{
        //       this.$message.error(`获取升级任务提示失败：${res.msg}`)
        //     }
        //   })
        // },
        //获取公告code（登录前）
        getUpgrade() {
            const params = {
                sysCode: "HDC",
            };
            this.$api.getUpgrade(params).then((res) => {
                if (res.success == true) {
                    this.codeUpgrade = res.data;
                    const result = localStorage.getItem("codeUpgrade");
                    // console.log(JSON.parse(result))
                    if (this.codeUpgrade !== result) {
                        this.getUpgradeList();
                    } else {
                    }
                } else {
                    // this.$message.error('获取公告信息失败:' + res.msg)
                }
            });
        },
        //获取通知List（登录后）
        getUpgradeList() {
            const params = {
                sysCode: "HDC",
            };
            this.$api.getUpgradeList(params).then((res) => {
                if (res.success == true) {
                    this.noTiceList = res.data;
                    this.noTiceList.forEach((item) => {
                        item.content = item.content
                            .replace(/(\n|\r|\r\n|↵)/g, "<br/>")
                            .replace(new RegExp(" ", "gm"), "&nbsp");
                    });
                    if (this.noTiceList.length == 1) {
                        if (this.noTiceList[0].noticeType == 0) {
                            // this.diaTitle = "放假通知公告";
                            this.diaTitle = this.$t("login.diaTitle1");
                        }
                        if (this.noTiceList[0].noticeType == 1) {
                            // this.diaTitle = "停机更新通知公告";
                            this.diaTitle = this.$t("login.diaTitle2");
                        }
                        if (this.noTiceList[0].noticeType == 2) {
                            // this.diaTitle = "版本更新公告";
                            this.diaTitle = this.$t("login.diaTitle4");
                        }
                        this.$nextTick(() => {
                            this.noticeBol = true;
                        });
                    }
                    if (this.noTiceList.length > 1) {
                        this.borBottom = true;
                        // this.diaTitle = "通知公告";
                        this.diaTitle = this.$t("login.diaTitle3");
                        this.$nextTick(() => {
                            this.noticeBol = true;
                        });
                    }
                    this.updateInterval();
                } else {
                    // this.$message.error('获取公告信息失败:' + res.msg)
                }
            });
        },
        // 关闭升级提示
        // Iknow(){
        //   if(this.noArgen){
        //     this.$api.closeDevUpgradeForceApplyInfo().then(res =>{
        //       if(res.success){
        //         this.$message.info(`今日不再提醒升级情况`)
        //       }else{
        //         this.$message.error(`开启今日不再提醒升级情况失败：${res.msg}`)
        //       }
        //     })
        //   }
        //   this.upgradeBol = false
        // },
        /**
         * 关闭公告弹窗
         */
        closeDialog() {
            if (this.noTice === true) {
                localStorage.setItem("codeUpgrade", this.codeUpgrade);
                this.noticeBol = false;
            } else {
                this.noticeBol = false;
            }
        },
        //获取当前用的账号使用期限
        getValidateOverdue() {
            if (localStorage.getItem("searchTimes")) return;
            this.$api.getValidateOverdue().then((res) => {
                if (res.success) {
                    this.validateOverdueManages = res.data;
                    localStorage.setItem("searchTimes", 1);
                } else {
                    this.$message.error(res.msg);
                }
            });
        },

        //获取首页配置
        getHomeSettings() {
            this.$api.getHomeSettings().then((res) => {
                if (res.success == true) {
                    if (
                        res.data.items &&
                        res.data.items.length == 3 &&
                        res.data.order &&
                        res.data.order.length == 4
                    ) {
                        this.items = res.data.items;
                        this.itemArr = res.data.order;
                        for (let i = 0; i < this.items.length; i++) {
                            // if (this.items[i].title == "待处理故障") {
                            if (
                                this.items[i].title ==
                                this.$t("dashboard.itemsTitle4")
                            ) {
                                this.items.splice(i, 1);
                            }
                            // if (this.items[i].title == "升级统计") {
                            //     this.items[i].title = "本月升级统计";
                            // }
                            if (
                                this.items[i].title ==
                                this.$t("dashboard.itemsTitle5")
                            ) {
                                this.items[i].title = this.$t(
                                    "dashboard.itemsTitle2"
                                );
                            }
                        }
                        this.copyItems = JSON.parse(JSON.stringify(this.items));
                        this.copyItemArr = JSON.parse(
                            JSON.stringify(this.itemArr)
                        );
                    } else {
                        this.items = JSON.parse(JSON.stringify(this.copyItems));
                        this.itemArr = JSON.parse(
                            JSON.stringify(this.copyItemArr)
                        );
                    }
                    this.$nextTick(() => {
                        let sortableBox =
                            document.getElementById("sortableBox");
                        let option = {
                            animation: 1000,
                            draggable: ".item",
                        };
                        this.sortable1 = Sortable.create(sortableBox, option);
                        this.sortable1.sort(this.itemArr);
                        this.sortable1.destroy();
                    });
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        setTableHeight() {
            this.rightItemHeight = document.body.clientHeight - 120;
        },
        getDeviceStatusStatistics() {
            this.$api.getDeviceStatusStatistics().then((res) => {
                if (res.success == true) {
                    this.offLineNum = res.data.offLineNum;
                    this.onlineNum = res.data.onlineNum;
                    this.onlineRate = (res.data.onlineRate * 100).toFixed(2);
                    this.total = res.data.total;
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        getCarUpLineNum() {
            this.$api.getCarUpLineNum().then((res) => {
                if (res.success == true) {
                    this.carTotal = res.data.total;
                    this.carUpLineNum = res.data.upLineNum;
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        //待处理故障数
        getWaitingHandleNum() {
            this.$api.getWaitingHandleNum().then((res) => {
                if (res.success == true) {
                    this.waitHandleNum = res.data;
                }
            });
        },
        //入网率统计信息
        getCarNetworkAccessInfo() {
            this.$api.getCarNetworkAccessInfo().then((res) => {
                if (res.success == true) {
                    this.carNetworkAccess = res.data;
                }
            });
        },
        //跳转至车辆上线率统计
        goCarOnlineRate() {
            this.$api
                .pageCarOnlineRate(this.paramsList)
                .then((res) => {
                    if (res.code == "system.error.noAuthority") {
                        // 暂无访问权限
                        this.$message.error(
                            this.$t("dashboard.noAccessPermission")
                        );
                    } else {
                        this.$router.push({
                            path: "/reportCenter/vehicleOnlineRate",
                        });
                    }
                })
                .catch((err) => {});
            // this.$router.push({
            //   path: '/reportCenter/vehicleOnlineRate'
            // })
        },
        //跳转至状态监控
        goConditionMonitor() {
            this.$api
                .getAlarmCounts()
                .then((res) => {
                    if (res.code == "system.error.noAuthority") {
                        // 暂无访问权限
                        this.$message.error(
                            this.$t("dashboard.noAccessPermission")
                        );
                    } else {
                        this.$router.push({
                            path: "/maintenanceCenter/conditionMonitoring",
                        });
                    }
                })
                .catch((err) => {});
        },
        //跳转至故障管理页
        goFaultManage() {
            this.$api
                .requirementFiles(this.paramsList)
                .then((res) => {
                    if (res.code == "system.error.noAuthority") {
                        // 暂无访问权限
                        this.$message.error(
                            this.$t("dashboard.noAccessPermission")
                        );
                    } else {
                        this.$router.push({
                            path: "/maintenanceCenter/handleFault",
                        });
                    }
                })
                .catch((err) => {});
        },
        //跳转至车辆入网率
        goNetLink() {
            this.$api
                .carNetworkAccessPage(this.paramsList)
                .then((res) => {
                    if (res.code == "system.error.noAuthority") {
                        // 暂无访问权限
                        this.$message.error(
                            this.$t("dashboard.noAccessPermission")
                        );
                    } else {
                        this.$router.push({
                            path: "/reportCenter/netLink",
                        });
                    }
                })
                .catch((err) => {});
        },
        //版块保存
        saveItem() {
            let params = {
                order: this.itemArr,
                items: this.items,
            };
            this.$api.saveHomeSettings(params).then((res) => {
                if (res.success == true) {
                    this.showItemBol = false;
                    // "设置成功！"
                    this.$message.success(
                        this.$t("dashboard.settingSuccessful")
                    );
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        cancelItem() {
            location.reload();
        },
        updateInterval() {
            this.updateTime = 10;
            let interval = setInterval(() => {
                this.updateTime--;
                if (this.updateTime == 0) clearInterval(interval);
            }, 1000);
        },
    },
    mounted() {
        this.getDeviceStatusStatistics();
        this.getCarUpLineNum();
        this.getWaitingHandleNum();
        this.getCarNetworkAccessInfo();
        const that = this;
        window.onresize = () => {
            return (() => {
                that.setTableHeight();
                this.timerTrend = new Date().getTime();
                this.timer = new Date().getTime();
            })();
        };
    },
    watch: {
        showItemBol(val) {
            this.timerTrend = new Date().getTime();
            this.timer = new Date().getTime();
            let sortableBox = document.getElementById("sortableBox");
            let option = {
                animation: 1000,
                draggable: ".item",
                onEnd: () => {
                    if (val) {
                        let arr = sortable1.toArray();
                        this.itemArr = arr;
                    }
                },
            };
            let sortable1 = Sortable.create(sortableBox, option);
            if (!this.showItemBol) {
                sortable1.destroy();
            }
        },
        items: {
            handler(val) {
                this.timerTrend = new Date().getTime();
                this.timer = new Date().getTime();
            },
            deep: true,
        },
    },
    beforeCreate() {
        // 修改背景色
        // document
        //     .querySelector("body")
        //     .setAttribute("style", "background-color:#F2F2F2");
    },
    beforeDestroy() {
        // 销毁背景色
        // document.querySelector("body").removeAttribute("style");
    },
};
</script>
<style scoped lang="less">
#noDataBox {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    background: #ffffff;
}
.noticeBtn {
    color: dodgerblue;
    cursor: pointer;
}
.showBtn {
    position: fixed;
    right: 0px;
    top: 33%;
    z-index: 10;
    .el-button {
        padding: 0px 0 0 15px;
        background-color: #0067fb;
        border-radius: 20px 0 0 20px;
        width: 50px;
        height: 30px;
        line-height: 30px;
        font-size: 18px;
        display: flex;
        align-items: center;
    }
}
.rightItem {
    width: 14%;
    position: fixed;
    right: 1rem;
    top: 103px !important;
    background: white;
    .titleP {
        padding: 12px;
        font-size: 14px;
        font-weight: 600;
    }
    .titleTold {
        width: 100%;
        text-align: center;
        opacity: 0.8;
    }
    .btnBox {
        text-align: right;
        padding: 12px 24px;
    }
    .item_ {
        overflow: hidden;
        padding: 10px 12px;
        .itemTitle {
            float: left;
        }
        .itemSwitch {
            float: right;
        }
    }
}
.dashboard-index {
    background-color: #f2f2f2;
    height: 100%;
    overflow-y: auto;
    .item {
        margin-bottom: 1.5rem;
    }
    .itemWeight {
        width: 85% !important;
    }
    .dashboard-count {
        background: #ffffff;
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        height: 140px;
        div {
            display: flex;
            align-items: center;
            justify-content: center;
            border-right: 1px solid #9ea3b1;
            width: 100%;
            height: 60px;
            &:last-child {
                border: none;
            }
        }
        .point {
            cursor: pointer;
        }
    }
}
.content-text {
    text-align: left;
}
.dia-title-box {
    max-height: 500px;
    overflow-y: auto;
}
</style>
