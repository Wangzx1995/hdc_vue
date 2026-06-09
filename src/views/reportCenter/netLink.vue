<template>
    <div>
        <el-dialog
            :title="title"
            :visible.sync="dialogVisible"
            :width="'960px'"
            @close="handleExit"
        >
            <div class="carDetails">
                <span>所属组织：{{ this.orgName }}</span>
                <span>入网率：{{ this.accessProportion }}%</span>
                <span
                    >{{ this.accessType ? "入网车辆数：" : "未入网车辆数："
                    }}{{ this.totalNum }}</span
                >
            </div>
            <el-button
                v-if="!this.accessType"
                style="margin-bottom: 1rem"
                class="goExport"
                @click="goExportAccess"
                :loading="loadingAccess"
                :disabled="loadingAccess"
                >导出</el-button
            >
            <el-table
                v-loading="accessLoading"
                :element-loading-text="$t('common.desperatelyLoading')"
                element-loading-color="#007213"
                :data="accessData"
                height="260px"
                label-width="auto"
                border
                stripe
            >
                <el-table-column
                    prop="plateNum"
                    label="车牌号"
                    min-width=""
                ></el-table-column>
                <el-table-column
                    v-if="this.accessType"
                    prop="accessTime"
                    label="入网时间"
                    min-width=""
                ></el-table-column>
                <el-table-column
                    v-if="!this.accessType"
                    prop="addTime"
                    label="添加时间"
                    min-width=""
                ></el-table-column>
            </el-table>
            <div class="p-x wrap-bottom">
                <el-pagination
                    :current-page="accessParams.currentPage"
                    @size-change="handleSizeChangeAccess"
                    @current-change="handleCurrentChangeAccess"
                    :page-sizes="[20, 50, 100]"
                    :page-size="accessParams.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="accessTotal"
                >
                </el-pagination>
            </div>
        </el-dialog>
        <div>
            <div class="wrap-top p-x" ref="searchBox">
                <div class="m-t">
                    <el-form
                        :model="searchForm"
                        inline
                        label-position="top"
                        ref="searchForm"
                    >
                        <el-form-item label="所属组织" prop="orgId">
                            <TreeSelect
                                :treeData="treeData"
                                style="width: 300px"
                                placeholder="请选择组织"
                                filter
                                v-model="searchForm.orgId"
                                :props="defaultProps"
                            >
                            </TreeSelect>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="m-t-lg">
                    <el-button
                        type="primary"
                        :loading="searchLoading"
                        @click="
                            params.currentPage = 1;
                            search();
                        "
                        >查询</el-button
                    >
                    <el-button type="default" @click="handleReset()"
                        >清除条件</el-button
                    >
                </div>
            </div>
            <div class="p-x" ref="searchBtn">
                <el-button
                    class="goExport"
                    @click="goExport"
                    :loading="loadingAll"
                    :disabled="loadingAll"
                    >导出</el-button
                >
            </div>
            <div class="m-x p-y table">
                <el-table
                    @sort-change="sortChange"
                    v-loading="searchLoading"
                    :element-loading-text="$t('common.desperatelyLoading')"
                    element-loading-color="#007213"
                    :data="tableData"
                    :height="tableHeight"
                    label-width="auto"
                    border
                    stripe
                >
                    <!-- <el-table-column type="selection" :selectable="selectable"></el-table-column> -->
                    <el-table-column
                        prop="orgName"
                        label="所属组织"
                        min-width="120px"
                    ></el-table-column>
                    <el-table-column
                        sortable="custom"
                        prop="accessProportion"
                        label="入网率（%）"
                        min-width="140px"
                        align="right"
                    ></el-table-column>
                    <el-table-column
                        prop="totalNum"
                        label="车辆数"
                        min-width="120px"
                        align="right"
                    ></el-table-column>
                    <el-table-column
                        sortable="custom"
                        prop="accessNum"
                        label="入网数"
                        min-width="140px"
                        align="right"
                    >
                        <template slot-scope="scope">
                            <a
                                v-if="scope.row.accessNum"
                                @click="
                                    showAccess(
                                        1,
                                        scope.row.accessProportion,
                                        scope.row.orgName,
                                        scope.row.accessNum,
                                        scope.row.orgId,
                                        true
                                    )
                                "
                                >{{ scope.row.accessNum }}</a
                            >
                            <span v-else>{{ scope.row.accessNum }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="accessNotNum"
                        label="未入网数"
                        min-width="140px"
                        align="right"
                    >
                        <template slot-scope="scope">
                            <a
                                v-if="scope.row.accessNotNum"
                                @click="
                                    showAccess(
                                        0,
                                        scope.row.accessProportion,
                                        scope.row.orgName,
                                        scope.row.accessNotNum,
                                        scope.row.orgId,
                                        true
                                    )
                                "
                                >{{ scope.row.accessNotNum }}</a
                            >
                            <span v-else>{{ scope.row.accessNotNum }}</span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="p-x wrap-bottom" ref="searchPagination">
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
    </div>
</template>

<script>
import TreeSelect from "@/components/hui-pro/tree-select/src/tree-select.vue";
import "@/components/hui-pro/tree-select/theme/index.scss";
import TimeUtil from "@/utils/time";
// import func from 'vue-editor-bridge';
export default {
    name: "faultSubsidiary",
    components: {
        TreeSelect,
    },
    data() {
        return {
            dialogVisible: false,
            loading: false,
            loadingAccess: false,
            accessLoading: false,
            title: "",
            searchForm: {
                orgId: "",
                orderDir: "",
                orderColumn: "",
            },
            searchLoading: false,
            defaultProps: {
                children: "children",
                label: "name",
            },
            loadingAll: false,
            allFaultType: [],
            total: 0,
            accessTotal: 0,
            tableHeight: 500,
            pickerOptions2: {
                disabledDate(time) {
                    // 禁用以后的时间
                    return time.getTime() > Date.now();
                },
            },
            params: {
                pageSize: 20,
                currentPage: 1,
            },
            accessParams: {
                pageSize: 20,
                currentPage: 1,
            },
            tableData: [],
            accessData: [],
            treeData: [],
            accessProportion: 0,
            accessType: 0,
            orgName: "",
            totalNum: "",
            orgId: "",
        };
    },
    watch: {},
    methods: {
        //对接接口的排序方法
        sortChange(column, prop, order) {
            console.log(column, prop, order);
            this.searchForm.orderDir = !column.order
                ? ""
                : column.order === "ascending"
                ? "asc"
                : "desc";
            this.searchForm.orderColumn = column.prop || "";
            this.search();
        },
        handleExit() {
            this.accessData = [];
            this.accessProportion = 0;
            this.accessType = 0;
            this.orgName = "";
            this.totalNum = 0;
            this.dialogVisible = false;
            this.title = "";
            this.orgId = "";
        },
        //查看入网详情
        showAccess(type, accessProportion, orgName, totalNum, orgId, bol) {
            this.orgId = orgId;
            if (bol) {
                this.accessParams["pageSize"] = 20;
                this.accessParams["currentPage"] = 1;
            }
            let params = Object.assign({}, this.accessParams, {
                accessType: type,
                orgId: orgId,
            });
            this.accessLoading = true;
            this.$api.carNetworkAccessCarPage(params).then((res) => {
                console.log(res);
                if (res.success) {
                    this.title = type ? "入网数" : "未入网数";
                    this.accessType = type;
                    this.accessProportion = accessProportion;
                    this.orgName = orgName;
                    (this.totalNum = totalNum),
                        (this.accessData = res.data.results);
                    this.accessTotal = res.data.totalRecords;
                    this.dialogVisible = true;
                } else {
                    this.$message.error(
                        `获取车辆${type ? "入网数" : "未入网数"}明细失败：${
                            res.msg
                        }`
                    );
                }
                this.accessLoading = false;
            });
        },

        // handleSelectionChange(selection){
        //   selection.forEach(item =>{
        //     this.selectableList.push(item.id)
        //   })
        //   this.title = `处理(${this.selectableList.length})`
        // },
        // selectable(row, index){
        //   return row.handleStatus == 1;
        // },
        // getPlateNumList(params){
        //   this.loading = true;
        //   this.$api.getCarList(params).then(res =>{
        //     this.plateArr = res.data.carList
        //     this.loading = false;
        //   })
        // },
        // remoteMethod(query){
        //   this.query = query;
        //   if(query.length >= 3){
        //     this.getPlateNumList({plateNum:query})
        //   }
        // },
        // showStatus(status){
        //   if (status==0) {
        //       return '待维护'
        //   } else {
        //       return '已解决'
        //   }
        // }
        //入网率统计
        carNetworkAccessPage() {
            let params = Object.assign({}, this.searchForm, this.params);
            this.$api.carNetworkAccessPage(params).then((res) => {
                console.log(res);
                if (res.success) {
                    this.tableData = res.data.results;
                    this.total = res.data.totalRecords;
                    this.$nextTick(() => {
                        this.setTableHeight();
                    });
                } else {
                    this.$message.error(`获取异常名称失败：${res.msg}`);
                }
            });
        },
        setTableHeight() {
            this.tableHeight =
                document.body.clientHeight -
                this.$refs.searchBox.clientHeight -
                this.$refs.searchBtn.clientHeight -
                this.$refs.searchPagination.clientHeight -
                111;
        },
        // 重置表单
        handleReset() {
            this.$refs["searchForm"].resetFields();
        },
        handleSizeChangeAccess(val) {
            this.accessParams.pageSize = val;
            this.showAccess(
                this.accessType,
                this.accessProportion,
                this.orgName,
                this.totalNum,
                this.orgId,
                false
            );
        },
        handleCurrentChangeAccess(val) {
            this.accessParams.currentPage = val;
            if (this.totalNum) {
                this.showAccess(
                    this.accessType,
                    this.accessProportion,
                    this.orgName,
                    this.totalNum,
                    this.orgId,
                    false
                );
            }
        },
        handleSizeChange(val) {
            this.$refs.searchForm.validate((valid, invalidFields) => {
                if (valid) {
                    this.params.pageSize = val;
                    this.carNetworkAccessPage();
                }
            });
        },
        handleCurrentChange(val) {
            this.$refs.searchForm.validate((valid, invalidFields) => {
                if (valid) {
                    this.params.currentPage = val;
                    this.carNetworkAccessPage();
                }
            });
        },
        search() {
            this.$refs.searchForm.validate((valid, invalidFields) => {
                if (valid) {
                    this.carNetworkAccessPage();
                }
            });
        },
        goExport() {
            if (this.total > 50000) {
                this.$message.error(this.$t("common.unableEport50000"));
            } else {
                this.loadingAll = true;
                this.$api
                    .ExportNetworkAccessStatistic(this.searchForm)
                    .then((res) => {
                        if (res.success == true) {
                            var fileName = res.data.fileName;
                            let _this = this;
                            _this.getExportResultInterval = window.setInterval(
                                function () {
                                    _this.$api
                                        .isExportFinished(fileName)
                                        .then((res1) => {
                                            if (
                                                res1.success == true &&
                                                res1.data == true
                                            ) {
                                                var iframe =
                                                    document.createElement(
                                                        "iframe"
                                                    );
                                                iframe.src =
                                                    (process.env.BASE_API == "/"
                                                        ? ""
                                                        : process.env
                                                              .BASE_API) +
                                                    "/excel?fileName=" +
                                                    fileName;
                                                iframe.style.display = "none";
                                                document.body.appendChild(
                                                    iframe
                                                );
                                                window.clearInterval(
                                                    _this.getExportResultInterval
                                                );
                                                _this.getExportResultInterval =
                                                    "";
                                                _this.loadingAll = false;
                                            }
                                        });
                                },
                                2000
                            );
                        } else {
                            this.$message.error("导出失败:" + res.msg);
                            this.loadingAll = false;
                        }
                    });
            }
        },
        goExportAccess() {
            if (this.accessTotal > 50000) {
                this.$message.error(this.$t("common.unableEport50000"));
            } else {
                let params = Object.assign({}, this.searchForm, {
                    accessType: 0,
                    orgId: this.orgId,
                });
                this.loadingAccess = true;
                this.$api.exportCarNetworkAccessCarPage(params).then((res) => {
                    if (res.success == true) {
                        var fileName = res.data.fileName;
                        let _this = this;
                        _this.getExportResultInterval = window.setInterval(
                            function () {
                                _this.$api
                                    .isExportFinished(fileName)
                                    .then((res1) => {
                                        if (
                                            res1.success == true &&
                                            res1.data == true
                                        ) {
                                            var iframe =
                                                document.createElement(
                                                    "iframe"
                                                );
                                            iframe.src =
                                                (process.env.BASE_API == "/"
                                                    ? ""
                                                    : process.env.BASE_API) +
                                                "/excel?fileName=" +
                                                fileName;
                                            iframe.style.display = "none";
                                            document.body.appendChild(iframe);
                                            window.clearInterval(
                                                _this.getExportResultInterval
                                            );
                                            _this.getExportResultInterval = "";
                                            _this.loadingAccess = false;
                                        }
                                    });
                            },
                            2000
                        );
                    } else {
                        this.$message.error("导出失败:" + res.msg);
                        this.loadingAccess = false;
                    }
                });
            }
        },
        //获取组织选项
        getOrgTree() {
            this.$api.getOrgTree().then((res) => {
                if (res.success == true) {
                    this.treeData = res.data;
                    //this.treeDataToArr(res.data)
                }
            });
        },
        treeDataToArr(val, type) {
            if (type) {
                this.treeArr = [];
            }
            val.forEach((item) => {
                this.treeArr.push({
                    id: item.id,
                    name: item.name,
                });
                if (item.children.length > 0) {
                    this.treeDataToArr(item.children, "");
                }
            });
        },
    },
    mounted() {
        this.search();
        let that = this;
        window.onresize = () => {
            return (() => {
                that.setTableHeight();
            })();
        };
    },
    created() {
        this.getOrgTree();
    },
};
</script>

<style scoped lang="less">
.wrap-top {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .el-form-item {
        margin-bottom: 12px !important;
    }
}
.wrap-bottom {
    border-top: 1px solid #e4e4e4;
}
.el-dialog__title {
    font-weight: 600 !important;
}
.carDetails {
    margin-bottom: 1rem;
    span {
        padding: 0 1.5rem 0 0;
    }
}
</style>
