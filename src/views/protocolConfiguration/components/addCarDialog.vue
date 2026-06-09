<template>
    <div class="add-car">
        <div class="wrap">
            <div class="wrap-top">
                <div class="m-t" ref="wrap">
                    <el-form
                        ref="form"
                        label-position="top"
                        :model="searchForm"
                        inline
                    >
                        <el-form-item label="车牌号" prop="carId">
                            <el-select
                                :remote-method="remoteMethod"
                                :loading="loading"
                                filterable
                                style="width: 185px"
                                reserve-keyword
                                remote
                                clearable
                                collapse-tags
                                :placeholder="
                                    $t('devLog.enterThreeLicensePlateNumbers')
                                "
                                v-model="searchForm.carId"
                            >
                                <el-option
                                    v-for="item in searchForm.plateArr"
                                    :key="item.id"
                                    :value="item.id"
                                    :label="item.plateNum"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="所属组织" prop="organizeId">
                            <TreeSelect
                                :placeholder="$t('common.select')"
                                ref="TreeSelect"
                                :treeData="treeData"
                                style="width: 280px"
                                filter
                                v-model="searchForm.organizeId"
                                :props="defaultProps"
                            >
                            </TreeSelect>
                        </el-form-item>
                        <el-form-item
                            class="widthVersion"
                            prop="softwareVersion"
                            label="设备版本号"
                        >
                            <el-input
                                v-model="searchForm.softwareVersion"
                                placeholder="请输入设备版本号"
                                clearable
                            ></el-input>
                        </el-form-item>
                        <el-form-item
                            class="widthVersion"
                            prop="deviceSerialNum"
                            label="设备序列号"
                        >
                            <el-input
                                v-model="searchForm.deviceSerialNum"
                                placeholder="请输入设备序列号"
                                clearable
                            ></el-input>
                        </el-form-item>
                        <el-form-item
                            class="widthVersion"
                            prop="deviceCode"
                            label="终端手机号"
                        >
                            <el-input
                                v-model="searchForm.deviceCode"
                                placeholder="请输入终端手机号"
                                clearable
                            ></el-input>
                        </el-form-item>
                        <el-form-item
                            class="widthShort"
                            prop="deviceStatus"
                            label="设备状态"
                        >
                            <el-select
                                v-model="searchForm.deviceStatus"
                                placeholder="请选择"
                                clearable
                            >
                                <el-option
                                    v-for="(item, index) in deviceStatusList"
                                    :key="index"
                                    :value="item.value"
                                    :label="item.label"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="m-t-lg flex">
                    <el-button
                        class=""
                        type="primary"
                        :disabled="searchLoading"
                        :loading="searchLoading"
                        @click="getData(true)"
                        >查询</el-button
                    >
                    <el-button
                        type="default"
                        @click="handleReset($refs.searchForm)"
                        >清除条件</el-button
                    >
                </div>
            </div>
            <div class="top-bottom">
                <span>设备型号：{{ $route.query.deviceModelCode }}</span>
            </div>
            <el-table
                @selection-change="handleSelectionChange"
                v-loading="searchLoading"
                :element-loading-text="$t('common.desperatelyLoading')"
                element-loading-color="#007213"
                :height="tableHeight"
                :data="tableData"
                force-scroll="horizontal"
                row-key="id"
                style="width: 100%"
                ref="table"
                border
                stripe
            >
                <el-table-column
                    type="selection"
                    :reserve-selection="true"
                ></el-table-column>
                <el-table-column
                    prop="plateNum"
                    label="车牌号"
                    width="140px"
                ></el-table-column>
                <el-table-column
                    prop="organizeName"
                    label="所属组织"
                    show-overflow-tooltip
                ></el-table-column>
                <el-table-column prop="softwareVersion" label="设备版本号">
                </el-table-column>
                <el-table-column prop="deviceCode" label="终端手机号">
                </el-table-column>
                <el-table-column prop="deviceSerialNum" label="设备序列号">
                </el-table-column>
                <el-table-column label="设备状态" width="100px">
                    <template slot-scope="scope">
                        <div>
                            <el-tag
                                type="success"
                                v-if="scope.row.deviceStatus === 1"
                                >在线</el-tag
                            >
                            <el-tag
                                type="warning"
                                v-else-if="scope.row.deviceStatus === 2"
                                >休眠</el-tag
                            >
                            <el-tag
                                type="info"
                                v-else-if="scope.row.deviceStatus === 0"
                                >离线</el-tag
                            >
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <div class="p-x-md">
                <el-pagination
                    :current-page="params.currentPage"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :page-sizes="[20, 50, 100]"
                    :page-size="params.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total"
                >
                </el-pagination>
            </div>
        </div>
        <div class="dialog-footer">
            <el-button @click="cancel()">取 消</el-button>
            <el-button type="primary" @click="submit"
                >确定新增({{ selection.length }})</el-button
            >
        </div>
    </div>
</template>

<script>
import TreeSelect from "@/components/hui-pro/tree-select/src/tree-select.vue";
import "@/components/hui-pro/tree-select/theme/index.scss";
export default {
    name: "maintainRecord",
    components: {
        TreeSelect,
    },
    data() {
        return {
            timer: null,
            loading: false,
            searchLoading: false,
            searchForm: {
                carId: "",
                organizeId: "",
                softwareVersion: "",
                deviceSerialNum: "",
                deviceCode: "",
                deviceStatus: "",
                deviceModelCode: this.$route.query.deviceModelCode,
                plateNum: "",
                plateArr: [],
                plateJson: {},
            },
            deviceStatusList: [
                { value: "", label: "全部" },
                { value: 0, label: "离线" },
                { value: 1, label: "在线" },
                { value: 2, label: "休眠" },
            ],
            defaultProps: {
                children: "children",
                label: "name",
            },
            params: {
                currentPage: 1,
                pageSize: 20,
            },
            total: 0,
            tableHeight: 400,
            treeData: [],
            tableData: [],
            query: "",
            ids: [],
            selection: [],
        };
    },
    watch: {
        "searchForm.carId": {
            handler(val) {
                if (!val && this.query.length < 3) {
                    this.searchForm.plateArr = [];
                }
                this.searchForm.plateNum =
                    this.searchForm.plateJson[this.searchForm.carId] || "";
            },
            deep: true,
        },
        query: {
            handler(val) {
                if (val.length < 3 && !this.searchForm.plateNum) {
                    this.searchForm.plateArr = [];
                }
            },
            deep: true,
        },
    },
    methods: {
        getPlateNumList(params) {
            this.loading = true;
            this.$api.getCarList(params).then((res) => {
                this.searchForm.plateArr = res.data.carList;
                if (this.searchForm.plateArr.length) {
                    res.data.carList.forEach((item) => {
                        this.searchForm.plateJson[item.id] = item.plateNum;
                    });
                }
                this.loading = false;
            });
        },
        remoteMethod(query) {
            this.query = query;
            if (query.length >= 3) {
                this.getPlateNumList({ plateNum: query });
            }
        },
        handleSizeChange(val) {
            this.params.pageSize = val;
            this.getData();
        },
        handleCurrentChange(val) {
            this.params.currentPage = val;
            this.getData();
        },
        handleSelectionChange(selection) {
            this.ids = [];
            selection.forEach((item) => {
                this.ids.push(item.deviceCode);
            });
            this.selection = selection;
        },

        handleReset(ref) {
            this.$refs["form"].resetFields();
            this.searchForm.organizeId = this.treeData[0].id;
        },

        getOrgTree() {
            this.$api.getOrgTree().then((res) => {
                if (res.success == true) {
                    this.treeData = res.data;
                    this.$nextTick(() => {
                        this.searchForm.organizeId =
                            this.$route.query.organizeId;
                        this.getData();
                    });
                }
            });
        },

        getData(isReset) {
            if (isReset) {
                this.params.currentPage = 1;
            }
            this.searchLoading = true;
            let params = {};
            let carParam = Object.assign(params, this.searchForm, this.params);
            delete carParam.plateArr;
            delete carParam.plateJson;
            this.$api
                .getParamDevicePage(carParam)
                .then((res) => {
                    if (res.success == true) {
                        this.tableData =
                            (res.data.results.length &&
                                res.data.totalRecords) ||
                            (!res.data.results.length && !res.data.totalRecords)
                                ? res.data.results
                                : this.tableData;
                        this.total = res.data.totalRecords;
                    } else {
                        this.$message.error("获取列表数据失败:" + res.msg);
                    }
                    this.searchLoading = false;
                })
                .catch((err) => {
                    this.searchLoading = false;
                });
        },
        cancel() {
            this.$emit("cancel", false);
        },
        submit() {
            this.$emit("handleSuccess", this.selection);
            this.cancel();
        },
    },
    mounted() {},
    created() {
        this.getOrgTree();
    },
};
</script>

<style lang="less" scoped>
.wrap {
    height: 100%;
    padding: 0px 16px;
    .top-bottom {
        margin-bottom: 1rem;
    }
    .wrap-top {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        .flex {
            display: flex;
        }
    }
    .wrap-bottom {
        height: 4rem;
        border-top: 1px solid #e4e4e4;
    }
    .select-alert {
        background: #e6f7ff !important;
        border: 1px solid rgba(145, 213, 255, 1) !important;
        border-radius: 2px;
    }
    .alert-title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        & > div > span {
            margin-right: 12px;
        }
        .el-button {
            color: #409eff;
            height: 24px;
        }
    }
    .el-form-item {
        margin-right: 10px !important;
    }
}
</style>
<style lang="less">
.add-car-dialog {
    .dialog-footer {
        display: flex;
        justify-content: flex-end;
        padding: 12px !important;
        border-top: 1px solid #ebebeb;
    }
}
</style>
