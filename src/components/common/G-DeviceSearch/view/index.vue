<template>
    <div style="height: 100%" class="G-DeviceSearch">
        <!-- 请输入至少3位车牌号、终端手机号、设备序列号、VIN码 -->
        <el-select
            v-model="mySelected"
            :placeholder="$t('deviceSearch.keywordsPlaceholder')"
            remote
            :remote-method="remoteMethod"
            filterable
            clearable
            @visible-change="visibleHandler"
            @clear="selectClear"
            @change="selectChange"
            :loading="loading"
            :popper-class="'select-option-box'"
        >
            <div class="device-search-title">
                <!-- 车牌号 -->
                <span>{{ $t("common.plateNum") }}</span>
                <!-- 终端手机号 -->
                <span>{{ $t("common.deviceCode") }}</span>
                <!-- 设备序列号 -->
                <span>{{ $t("common.deviceSerialNum") }}</span>
                <!-- VIN码 -->
                <span>{{ $t("common.vin") }}</span>
                <!-- 设备状态 -->
                <span v-if="showDeviceStatus">{{
                    $t("common.deviceStatus")
                }}</span>
            </div>
            <el-option
                v-for="item in plateArr"
                :key="item.id"
                :value="item[valueKey]"
                :label="item.title"
            >
                <div
                    class="device-search-option"
                    :title="item.title"
                    v-html="item.html"
                ></div>
            </el-option>
        </el-select>
    </div>
</template>

<script>
export default {
    name: "G-DeviceSearch",
    props: {
        valueKey: {
            type: String,
            default: "deviceId",
        },
        organizeId: {
            type: [String, Number],
            default: null,
        },
        value: {
            type: [String, Number],
            default: "",
        },
        selectObj: {
            type: Object,
            default: () => {},
        },
        otherParams: {
            type: Object,
            default: () => {},
        },
        showDeviceStatus: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            loading: false,
            plateArr: [],
            mySelected: this.value,
            deviceStatusList: ["离线", "在线", "休眠"],
        };
    },
    watch: {
        value: {
            handler(value) {
                this.mySelected = value;
                if (this.selectObj && this.selectObj.deviceId && this.value) {
                    this.plateArr.push(this.selectObj);
                }
            },
            immediate: true,
        },
    },
    mounted() {},
    computed: {},
    methods: {
        remoteMethod(query) {
            this.query = query.trim();
            if (query.length >= 3) {
                this.getPlateNumList({
                    ...this.otherParams,
                    keywords: this.query,
                    organizeId: this.organizeId,
                });
            } else {
                this.plateArr = [];
            }
        },
        getPlateNumList(params) {
            this.loading = true;
            this.$api.newUpgradeGetDevByKeywords(params).then((res) => {
                if (res.success && res.data && res.data.length) {
                    let arr = JSON.parse(JSON.stringify(res.data));
                    arr.forEach((item) => {
                        item.html = `<span>${
                            item.plateNum || "--"
                        }</span>；<span>${
                            item.deviceCode || "--"
                        }</span>；<span>${
                            item.deviceSerialNum || "--"
                        }</span>；<span>${item.vin || "--"}</span>`;
                        if (this.showDeviceStatus) {
                            item.html += `；<span class="deviceStatus-${
                                item.deviceStatus
                            }">${
                                this.deviceStatusList[item.deviceStatus]
                            }</span>`;
                        }
                        item.title = `${item.plateNum || "--"}；${
                            item.deviceCode || "--"
                        }；${item.deviceSerialNum || "--"}；${
                            item.vin || "--"
                        }`;
                        if (this.showDeviceStatus) {
                            item.title += `；${
                                this.deviceStatusList[item.deviceStatus]
                            }`;
                        }
                    });
                    this.plateArr = this.setHightLight(arr, this.query);
                } else {
                    this.plateArr = [];
                }
                this.loading = false;
                this.$nextTick(() => {
                    let h = document
                        .getElementsByClassName("select-option-box")[0]
                        .getElementsByClassName("el-scrollbar")[0].offsetHeight;
                    this.$emit("showOption", h);
                });
            });
        },
        // 设置高亮
        setHightLight(arr, keyword) {
            if (arr && arr.length > 0 && keyword) {
                arr = arr.filter((item) => {
                    let reg = new RegExp(keyword, "g");
                    let replaceString = `<span class='search-highlight'>${keyword.trim()}</span>`;
                    if (item.html.match(reg)) {
                        item.html = item.html.replace(reg, replaceString);
                        return item;
                    }
                });
                return arr;
            }
            if (!keyword) {
                return arr;
            }
        },
        visibleHandler(val) {
            this.plateArr = [];
            if (!val) {
                this.$emit("showOption", -1);
            }
        },
        selectClear() {
            this.showLog = false;
        },
        selectChange(val) {
            let obj = this.plateArr.find((item) => {
                return item[this.valueKey] == val;
            });
            this.$emit("update:value", this.mySelected);
            this.$emit("update:selectObj", obj ? obj : {});
        },
    },
};
</script>

<style lang="less">
.device-search-title {
    padding: 0 20px 6px;
    border-bottom: 1px solid #cccccc;
    display: flex;
    span {
        flex: 1;
        &:not(:first-child) {
            margin-left: 14px;
        }
    }
}
.search-highlight {
    color: #1890ff;
}
.device-search-option {
    display: flex;
    & > span {
        display: inline-block;
        width: 100px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }
}
.G-DeviceSearch {
    .el-select,
    .el-input {
        width: 400px !important;
    }
}
.deviceStatus-0 {
    color: #909399;
}
.deviceStatus-1 {
    color: #67c23a;
}
.deviceStatus-2 {
    color: #e6a23c;
}
</style>
