<template>
    <div>
        <div class="acceptance-standard p-x p-t">
            <div
                class="standard-item"
                v-for="(item, index) in standardList"
                v-bind:key="index"
            >
                <div
                    class="top p-x-lg"
                    :style="
                        index != 0
                            ? 'border-top:1px solid rgba(0, 0, 0, 0.06);'
                            : ''
                    "
                >
                    <div class="left" @click="showAll(item, index)">
                        <div class="title-name">{{ item.faultCategory }}</div>
                    </div>
                    <el-button type="text" @click="selectAll(item, index)">
                        <!-- 取消全选：全选 -->
                        {{
                            item.isAll
                                ? $t("common.deselectAll")
                                : $t("common.selectAll")
                        }}
                    </el-button>
                </div>
                <!-- <div v-show="item.isActive"> -->
                <div class="middle p-l-lg p-r">
                    <div
                        class="sub-item-content"
                        v-for="i in item.faultTypes"
                        :key="i.index"
                    >
                        <p class="sub-title">{{ i.typeName }}</p>
                        <el-switch
                            @change="bolChange(item)"
                            v-model="i.subscribe"
                        ></el-switch>
                    </div>
                </div>
                <!-- </div> -->
            </div>
        </div>
        <!-- <div class="footer">
            <div class="footer-btn">
                <el-button type="primary" @click="save" :loading="loadSubmit"
                    >保存</el-button
                >
            </div>
        </div> -->
    </div>
</template>
<script>
//import Vue from "vue";
import Vue from "vue/dist/vue.esm.js";
import TreeSelect from "@/components/hui-pro/tree-select/src/tree-select.vue";
import "@/components/hui-pro/tree-select/theme/index.scss";
import TimeUtil from "@/utils/time";

export default {
    components: {
        TreeSelect,
    },
    data() {
        return {
            treeData: [],
            loadUsersList: [],
            defaultProps: {
                children: "children",
                label: "name",
            },
            form: {
                taskName: "",
                orgId: "",
                startTime: "",
                endTime: "",
                deviceActiveCode: "",
                carNum: "",
                userIds: [],
            },
            timeRange: [],
            loadSubmit: false,
            standardList: [],
            projects: [],
            loading: false,
        };
    },
    watch: {
        timeRange: {
            handler(val) {
                if (val.length > 0) {
                    this.form.startTime = TimeUtil.getDateTime(
                        this.timeRange[0]
                    );
                    this.form.endTime = TimeUtil.getDateTime(this.timeRange[1]);
                } else {
                    this.form.startTime = "";
                    this.form.endTime = "";
                }
            },
            deep: true,
            immediate: true,
        },
        "form.orgId": {
            handler(val) {
                if (val !== "") {
                    this.$refs.form.clearValidate("orgId");
                }
            },
            deep: true,
            immediate: true,
        },
        standardList: {
            handler(val) {},
            deep: true,
            immediate: true,
        },
    },
    created() {},
    methods: {
        //待处理故障订阅查询
        getSubscribe() {
            this.$api.getSubscribe().then((res) => {
                if (res.success) {
                    this.standardList = res.data;
                    this.standardList.forEach((item) => {
                        this.$set(item, "isAll", false);
                        this.$set(item, "allArr", []);
                    });
                    this.standardList.forEach((item) => {
                        item.allArr = item.faultTypes.filter((item_) => {
                            return item_.subscribe == true;
                        });
                        item.isAll =
                            item.allArr.length == item.faultTypes.length
                                ? true
                                : false;
                    });
                } else {
                    this.$message.error(`${res.msg}`);
                }
            });
        },
        //单个开启或关闭
        bolChange(item) {
            item.allArr = item.faultTypes.filter((item_) => {
                return item_.subscribe == true;
            });
            item.isAll =
                item.allArr.length == item.faultTypes.length ? true : false;
            this.$nextTick(() => {
                this.save();
            });
        },
        selectAll(item, index) {
            //全选、取消全选
            const obj = item;
            obj.faultTypes.map((i) => {
                if (!item.isAll) i.subscribe = true;
                else i.subscribe = false;
            });
            item.isAll = !item.isAll;
            Vue.set(this.standardList, index, obj);
            this.$nextTick(() => {
                this.save();
            });
        },
        showAll(item, index) {
            const obj = item;
            Vue.set(this.standardList, index, obj);
        },
        goBack() {
            this.$router.go(-1);
        },
        save() {
            let faultSubscribeArr = [];
            this.standardList.forEach((item) => {
                if (item.faultTypes.length) {
                    item.faultTypes.forEach((item_) => {
                        if (item_.subscribe) {
                            faultSubscribeArr.push(item_.typeCode);
                        }
                    });
                }
            });
            this.$api
                .faultSubscribeSubmit({ faultTypes: faultSubscribeArr })
                .then((res) => {
                    if (res.success) {
                        // this.$message.success("保存成功！");
                        this.getSubscribe();
                    } else {
                        this.$message.error(`${res.msg}`);
                    }
                });
        },
    },
    mounted() {
        this.getSubscribe();
    },
};
</script>
<style lang="less" scoped>
.acceptance-standard {
    height: calc(~"100% - 56px");
    overflow-y: auto;
    .standard-item {
        .top {
            background: rgba(0, 0, 0, 0.03);
            height: 36px;
            display: flex;
            // flex-direction: row;
            align-items: center;
            justify-content: flex-start;
            // border-top: 1px solid rgba(0, 0, 0, 0.06);
            .left {
                cursor: pointer;
                margin-left: -30px;
                margin-right: 16px;
                .collapse-item__arrow {
                    margin-right: 4px;
                    font-size: 24px;
                    font-weight: 300;
                    transition: transform 0.3s;
                }
                .collapse-item__arrow.is-active {
                    transform: rotate(90deg);
                }
            }
            .title-name,
            .el-button--text {
                font-size: 14px;
                color: rgba(0, 0, 0, 0.85);
            }
            .el-button--text {
                color: #409eff;
            }
        }
        .middle {
            display: flex;
            flex-wrap: wrap;
            flex-direction: row;
            align-items: center;
            justify-content: flex-start;
            font-size: 14px;
            color: rgba(0, 0, 0, 0.65);
            font-weight: 400;
            background: #ffffff;
            border-top: 1px solid rgba(0, 0, 0, 0.06);
            .sub-item-content {
                // display: inline-block;
                width: 235px;
                height: 36px;
                display: flex;
                flex-direction: row;
                align-items: center;
                margin-right: 130px;
                .sub-title {
                    width: 180px;
                    text-align: right;
                    white-space: normal;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    margin-right: 12px;
                }
                .sub-item {
                    width: 10vw;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    .el-input,
                    .el-input-number {
                        margin-right: 8px;
                        .el-input__inner {
                            text-align: center !important;
                        }
                    }
                }
                .sub-read {
                    width: 10vw;
                    white-space: normal;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .sub-note {
                    width: 68vw;
                    white-space: normal;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
            }
        }
    }
}
.footer {
    width: 100%;
    height: 4rem;
    border-top: 1px solid rgba(0, 0, 0, 0.06);
    position: fixed;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    background: #ffffff;
    left: 0;
    .footer-btn {
        padding-right: 28px;
    }
}
</style>
