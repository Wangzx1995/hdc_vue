<template>
    <div>
        <el-row>
            <!-- 左边树 -->
            <el-col :span="4" class="p-a b-r">
                <el-input
                    class="marginBottom"
                    v-model="organizationName"
                    :placeholder="$t('common.inputOrganizationName')"
                    clearable
                >
                    <i slot="suffix" class="el-input__icon el-icon-search"></i>
                </el-input>
                <div :class="{ loading_: searchLoading }">
                    <el-tree
                        ref="tree"
                        :data="treeData"
                        :default-expanded-keys="TreeExpanded"
                        @node-click="handleNodeClick"
                        default-icon="el-icon-folder"
                        highlight-current
                        node-key="id"
                        :filter-node-method="filterNode"
                        :props="defaultProps"
                        :current-node-key="params.organizeId"
                        :style="{ height: treeHeight + 'px' }"
                        :expand-on-click-node="false"
                    ></el-tree>
                </div>
            </el-col>
            <el-col :span="20">
                <div class="wrap">
                    <!-- 搜索区域 -->
                    <div ref="searchBox" class="search-module">
                        <div
                            class="search-form-content"
                            :class="{ hidden: !buttonClick }"
                            ref="wrap"
                        >
                            <el-form
                                :model="searchForm"
                                inline
                                ref="searchForm"
                            >
                                <!-- 车牌号 -->
                                <el-form-item
                                    prop="plateNum"
                                    :label="$t('common.plateNum')"
                                >
                                    <el-input
                                        v-model="searchForm.plateNum"
                                        :placeholder="$t('common.input')"
                                        clearable
                                    ></el-input>
                                </el-form-item>
                                <!-- 模板 -->
                                <el-form-item
                                    prop="ipLockIds"
                                    :label="$t('antIrotationNet.template')"
                                >
                                    <el-select
                                        class="ipLockIds"
                                        :popper-class="'operate-select'"
                                        multiple
                                        multiple-nowrap
                                        v-model="searchForm.ipLockIds"
                                        collapse-tags
                                        clearable
                                        :placeholder="$t('common.select')"
                                        @change="(val) => changeSelect(val)"
                                    >
                                        <div class="option-box">
                                            <el-option
                                                v-for="item in mouldTemplateList"
                                                :key="item.id"
                                                :value="item.id"
                                                :label="item.name"
                                            ></el-option>
                                        </div>
                                        <div class="copy-btn">
                                            <el-button
                                                type="text"
                                                @click="selectAll()"
                                            >
                                                <span v-if="checked">
                                                    <!-- 取消全选 -->
                                                    {{
                                                        $t("common.deselectAll")
                                                    }}
                                                </span>
                                                <span v-else>
                                                    <!-- 全选模板 -->
                                                    {{
                                                        $t(
                                                            "antIrotationNet.selectAllTemplates"
                                                        )
                                                    }}
                                                </span>
                                            </el-button>
                                        </div>
                                    </el-select>
                                </el-form-item>
                            </el-form>
                        </div>
                        <div ref="searchBtn" class="search-btn">
                            <el-button
                                type="primary"
                                :disabled="searchLoading"
                                :loading="searchLoading"
                                @click="
                                    params.currentPage = 1;
                                    getIpLockDevicePage();
                                "
                            >
                                <!-- 查询 -->
                                {{ $t("common.search") }}
                            </el-button>
                            <el-button
                                type="default"
                                @click="handleReset($refs.searchForm)"
                            >
                                <!-- 清除条件 -->
                                {{ $t("common.reset") }}
                            </el-button>
                            <!-- <el-button :icon="!buttonClick ? 'el-icon-d-arrow-left' : 'el-icon-d-arrow-right'" @click="handleClick" v-if="iconShow"></el-button> -->
                        </div>
                    </div>
                    <div class="wrap-top p-x m-b" ref="searchBtn">
                        <div>
                            <el-button
                                :disabled="subType == 1"
                                @click="antIrotationDo"
                                v-btn="
                                    'antIrotationNetBatchAntiTransferNetwork'
                                "
                            >
                                <!-- 批量防转网 -->
                                {{
                                    $t(
                                        "antIrotationNet.batchAntiTransferNetwork"
                                    )
                                }}{{
                                    selectionLength
                                        ? "(" + selectionLength + ")"
                                        : ""
                                }}</el-button
                            >
                            <el-button
                                :disabled="groupDisabled || subType == 1"
                                @click="oneGroup"
                                v-btn="
                                    'antIrotationNetEntireAntiTransferNetwork'
                                "
                            >
                                <!-- 整组防转网 -->
                                {{
                                    $t(
                                        "antIrotationNet.entireAntiRotationNetwork"
                                    )
                                }}
                            </el-button>
                            <el-button
                                :disabled="
                                    subType == 1 ||
                                    !selection.length ||
                                    !(
                                        selection.length &&
                                        selection.find(
                                            (item) =>
                                                item.ipLockId !== 0 &&
                                                item.capacityLock === 0
                                        )
                                    )
                                "
                                @click="batchs(1)"
                            >
                                <!-- 批量启用 -->
                                {{ $t("antIrotationNet.batchActivation") }}
                                {{
                                    selection.filter(
                                        (item) =>
                                            item.ipLockId !== 0 &&
                                            item.capacityLock === 0
                                    ).length
                                        ? "(" +
                                          selection.filter(
                                              (item) =>
                                                  item.ipLockId !== 0 &&
                                                  item.capacityLock === 0
                                          ).length +
                                          ")"
                                        : ""
                                }}</el-button
                            >
                            <el-button
                                :disabled="
                                    subType == 1 ||
                                    !selection.length ||
                                    !(
                                        selection.length &&
                                        selection.find(
                                            (item) =>
                                                item.ipLockId !== 0 &&
                                                item.capacityLock === 1
                                        )
                                    )
                                "
                                @click="batchs(0)"
                            >
                                <!-- 批量停用 -->
                                {{ $t("antIrotationNet.batchDeactivation") }}
                                {{
                                    selection.filter(
                                        (item) =>
                                            item.ipLockId !== 0 &&
                                            item.capacityLock === 1
                                    ).length
                                        ? "(" +
                                          selection.filter(
                                              (item) =>
                                                  item.ipLockId !== 0 &&
                                                  item.capacityLock === 1
                                          ).length +
                                          ")"
                                        : ""
                                }}</el-button
                            >
                            <!-- <el-button :disabled="subType == 1" @click="antIrotationExit">批量解除防转网{{selectionLength?'('+selectionLength+')':''}}</el-button> -->
                            <template v-if="ipLockDeviceLockUserCheckBtn">
                                <el-button @click="handleLock(1)">
                                    <!-- 锁定 -->
                                    {{ $t("antIrotationNet.lock") }}
                                    {{
                                        selectionLength
                                            ? "(" + selectionLength + ")"
                                            : ""
                                    }}
                                </el-button>
                                <el-button @click="handleLock(0)">
                                    <!-- 解锁 -->
                                    {{ $t("antIrotationNet.unlock") }}
                                    {{
                                        selectionLength
                                            ? "(" + selectionLength + ")"
                                            : ""
                                    }}
                                </el-button>
                            </template>
                        </div>
                        <el-button @click="goIplockTemplate">
                            <!-- 防转网模板管理 -->
                            {{ $t("antIrotationNet.templateManagement") }}
                        </el-button>
                    </div>
                    <div class="m-x m-b">
                        <el-table
                            ref="table"
                            v-loading="searchLoading"
                            :element-loading-text="
                                $t('common.desperatelyLoading')
                            "
                            element-loading-color="#007213"
                            :data="listData"
                            :height="tableHeight"
                            @selection-change="onSelectionChange"
                            border
                            stripe
                            @filter-change="filterChange"
                            @sort-change="onSortChange"
                            row-key="id"
                        >
                            <el-table-column
                                :reserve-selection="true"
                                :selectable="selectable"
                                type="selection"
                            ></el-table-column>
                            <!-- 车牌号 -->
                            <el-table-column
                                prop="plateNum"
                                :label="$t('common.plateNum')"
                                width="160px"
                            >
                                <template slot-scope="scope">
                                    <div>
                                        {{ scope.row.plateNum
                                        }}<span
                                            v-show="scope.row.freeze == 1"
                                            class="freeze-icon"
                                            >{{ $t("carManage.freeze") }}</span
                                        >
                                    </div>
                                </template>
                            </el-table-column>
                            <!-- 设备序列号 -->
                            <el-table-column
                                prop="deviceSerialNum"
                                :label="$t('common.deviceSerialNum')"
                                min-width="60px"
                            ></el-table-column>
                            <!-- 所属组织 -->
                            <el-table-column
                                prop="organizePath"
                                :label="$t('common.orgPath')"
                                min-width="240px"
                            ></el-table-column>
                            <!-- 所属组织 -->
                            <el-table-column
                                sortable
                                prop="ipLockNum"
                                :label="$t('antIrotationNet.defenseFrequency')"
                                min-width="60px"
                                align="right"
                            >
                                <template slot-scope="scope">
                                    <a
                                        @click="
                                            openIpLockNum(
                                                scope.row.ipLockNum,
                                                scope.row.id
                                            )
                                        "
                                        v-if="scope.row.ipLockNum > 0"
                                        >{{ scope.row.ipLockNum }}</a
                                    >
                                    <span v-else>{{
                                        scope.row.ipLockNum
                                    }}</span>
                                </template>
                            </el-table-column>
                            <!-- 模板 -->
                            <el-table-column
                                sortable
                                prop="ipLockName"
                                show-overflow-tooltip
                                :label="$t('antIrotationNet.template')"
                                width="160px"
                            ></el-table-column>
                            <!-- 是否启用 -->
                            <el-table-column
                                prop="ipLockName"
                                show-overflow-tooltip
                                :label="$t('antIrotationNet.enabled')"
                                width="160px"
                                fixed="right"
                            >
                                <template slot-scope="scope">
                                    <el-switch
                                        @change="changeCapacityLock(scope.row)"
                                        v-if="scope.row.ipLockId"
                                        v-model="scope.row.capacityLock"
                                        :active-value="Number(1)"
                                        :inactive-value="Number(0)"
                                        v-btn="
                                            'antIrotationNetEnable&DisableAntiTransferNetwork'
                                        "
                                    ></el-switch>
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
            </el-col>
        </el-row>
        <!-- 防转网到期通知 -->
        <el-dialog
            :visible="noticeBol"
            :title="$t('parameterQuery.noticeBolText1')"
            @close="noticeBol = false"
            class="modal-nopadding"
        >
            <div>
                <p class="noticeP">
                    <!-- 尊敬的客户 -->
                    {{ $t("parameterQuery.noticeBolText2") }}
                    ：
                </p>
                <p class="noticeC">
                    <!-- 您的2个月防转网免费体验时长已到期，为了不影响您的使用，请联系我司续费。 -->
                    {{ $t("parameterQuery.noticeBolText3") }}
                </p>
            </div>
            <div class="configuration-detail-submit p-y-sm p-x-md">
                <div style="margin-left: auto; text-align: right">
                    <p style="display: inline-block">
                        <el-button type="default" @click="noticeBol = false">
                            <!-- 知道了 -->
                            {{ $t("common.gotIt") }}
                        </el-button>
                    </p>
                </div>
            </div>
        </el-dialog>
        <!-- 防转网设备确认 -->
        <el-dialog
            :visible="showIplocked"
            :title="$t('parameterQuery.showIplocked1')"
            class="modal-nopadding"
            @close="doCancel"
        >
            <div>
                <p class="showIplockedManageP">{{ showIplockedManage }}</p>
                <div>
                    <el-radio-group
                        @change="changeDevice"
                        v-model="updateExistIpLockDevice"
                    >
                        <div>
                            <el-radio :label="Number(0)">{{
                                noIplockedManage
                            }}</el-radio>
                        </div>
                        <div class="radioDiv">
                            <el-radio :label="Number(1)">{{
                                iplockedManage
                            }}</el-radio>
                        </div>
                    </el-radio-group>
                    <el-table
                        v-if="updateExistIpLockDevice == 1"
                        v-loading="ipLockedSearchLoading"
                        :element-loading-text="$t('common.desperatelyLoading')"
                        element-loading-color="#007213"
                        :data="iplockedListData"
                        height="400"
                        border
                        stripe
                        @selection-change="onSelectionChange"
                    >
                        <!-- 车牌号 -->
                        <el-table-column
                            prop="plateNum"
                            :label="$t('common.plateNum')"
                            min-width="60px"
                        ></el-table-column>
                        <!-- 设备序列号 -->
                        <el-table-column
                            prop="deviceSerialNum"
                            :label="$t('common.deviceSerialNum')"
                            min-width="60px"
                        ></el-table-column>
                        <!-- 所属组织 -->
                        <el-table-column
                            prop="organizePath"
                            :label="$t('common.orgPath')"
                            min-width="240px"
                        ></el-table-column>
                        <!-- 模板 -->
                        <el-table-column
                            prop="ipLockName"
                            :label="$t('antIrotationNet.template')"
                            width="160px"
                        ></el-table-column>
                    </el-table>
                </div>
                <div class="p-l-md p-r-md wrap-bottom">
                    <el-pagination
                        v-if="updateExistIpLockDevice == 1"
                        :current-page="iplockedPramas.currentPage"
                        @size-change="ipLockedHandleSizeChange"
                        @current-change="ipLockedHandleCurrentChange"
                        :page-sizes="[20, 50, 100]"
                        :page-size="iplockedPramas.pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="iplockedTotal"
                    >
                    </el-pagination>
                </div>
                <div class="configuration-detail-submit p-y-sm p-x-md">
                    <div style="margin-left: auto; text-align: right">
                        <p style="display: inline-block">
                            <el-button type="default" @click="getExit">
                                <!-- 取消 -->
                                {{ $t("common.cancel") }}
                            </el-button>
                            <el-button
                                type="primary"
                                :loading="makeSureLoading"
                                @click="doSure"
                            >
                                <!-- 应用中 -->
                                {{
                                    makeSureLoading
                                        ? this.$t(
                                              "antIrotationNet.inApplication"
                                          )
                                        : this.$t("common.ok")
                                }}
                            </el-button>
                        </p>
                    </div>
                </div>
            </div>
        </el-dialog>
        <AntIrotationDialog
            :openDialogBol="openDialog"
            @ipLockId="applyIpLockDo"
            @closeDia="closeDiaBol"
            @canUseTemplate="templateUse"
            :organizeIdTitle="organizeId"
            :selectionNum="selectionLength"
            :totalNum="total"
            :loadingUse="useLoading"
        ></AntIrotationDialog>
        <IpLockNumDialog
            :ipLockNumDialog="ipLockNumDialog"
            @close="closeIpLockNumDialog"
            :ipLockNum="ipLockNum"
            :deviceId="deviceId"
        ></IpLockNumDialog>
    </div>
</template>
<script>
import AntIrotationDialog from "@/components/antIrotationDialog";
import IpLockNumDialog from "@/components/ipLockNumDialog";
export default {
    name: "antIrotationNet",
    components: {
        AntIrotationDialog,
        IpLockNumDialog,
    },
    data() {
        return {
            showIplockedManage: "",
            noIplockedManage: "",
            iplockedManage: "",
            updateExistIpLockDevice: 0,
            iplockedListData: [],
            iplockedPramas: {
                currentPage: 1, //页码，从1开始
                pageSize: 20, //分页大小
                organizeId: null,
            },
            iplockedTotal: 0,
            ipLockedSearchLoading: false,
            makeSureLoading: false,
            showIplocked: false,
            noticeBol: false,
            treeData: [],
            TreeExpanded: [],
            groupIds: [],
            organizationName: "",
            groupDisabled: false,
            searchLoading: true,
            tableHeight: 500,
            treeHeight: 500,
            buttonClick: false,
            defaultProps: {
                children: "children",
                label: "name",
            },
            params: {
                currentPage: 1, //页码，从1开始
                pageSize: 20, //分页大小
                // orderColumn: 'plateNum', //排序列
                // orderDir: 'asc',   //排序方向
                organizeId: null,
            },
            searchForm: {
                plateNum: "",
                ipLockIds: [],
            },
            useTemplate: [],
            mouldTemplateList: [],
            ipLockIdsList: [],
            total: 0,
            listData: [],
            selection: [],
            selectionLength: 0,
            filterTagLength: 0,
            openDialog: false,
            ipLockNumDialog: false,
            ipLockId: "",
            organizeId: null,
            deviceIds: [],
            ipLockNum: 0,
            deviceId: "",
            useLoading: false,
            subType: this.$store.state.user.userSubType,
            checked: false,
            ipLockDeviceLockUserCheckBtn: false,
            business: "",
        };
    },
    watch: {
        "$store.state.user.userSubType"(newValue, oldValue) {
            this.subType = newValue;
        },
        organizationName(val) {
            this.filterTree(this.treeData, val, 0);
            this.$nextTick(() => {
                this.$refs.tree.filter("show", !this.organizationName);
                if (!val) {
                    const nodes = this.$refs.tree.store._getAllNodes();
                    nodes.forEach((item) => {
                        if (item.data.id !== this.treeData[0].id) {
                            item.expanded = false;
                        }
                    });
                }
            });
        },
        // ipLockId(val){
        //     console.log(val);
        //     if(val){
        //         console.log('可以应用')
        //         if(this.organizeId){
        //             this.updateDeviceIpLock(1)
        //         }else{
        //             this.updateDeviceIpLock(0);
        //         }
        //     }
        // }
    },

    created() {
        this.getIpLockTree();
        this.getTemplate();
        this.ipLockDeviceLockUserCheck();
    },
    mounted() {
        this.checked = false;
        // this.setWrap()
        const that = this;
        window.onresize = () => {
            return (() => {
                that.setTableHeight();
                // that.setWrap()
            })();
        };
    },
    methods: {
        filterTree(data, val, type) {
            data.forEach((item) => {
                if (item.name.indexOf(val) !== -1) {
                    // item.show = true;
                    this.$set(item, "show", true);
                    this.itemChildren(item);
                } else {
                    this.$set(item, "show", false);
                    if (item.children.length > 0) {
                        this.filterTree(item.children, val, 1);
                    }
                }
            });
        },
        itemChildren(val) {
            if (val.children.length > 0) {
                val.children.forEach((item) => {
                    item.show = true;
                    if (item.children.length > 0) {
                        this.itemChildren(item);
                    }
                });
            }
        },
        getExit() {
            this.showIplocked = false;
            this.updateExistIpLockDevice = 0;
        },
        doSure() {
            this.updateDeviceIpLock(1);
        },
        doCancel() {
            this.showIplocked = false;
            this.updateExistIpLockDevice = 0;
        },
        changeDevice(val) {
            if (val == 1) {
                this.getIpLockedDevicePage();
            } else {
            }
        },
        closeDiaBol() {
            this.openDialog = false;
        },
        templateUse(val) {
            this.useTemplate = val;
        },
        openIpLockNum(num, deviceId) {
            this.ipLockNumDialog = true;
            this.ipLockNum = num;
            this.deviceId = deviceId;
        },
        closeIpLockNumDialog() {
            this.ipLockNumDialog = false;
        },
        //接收选定的模板ID
        applyIpLockDo(val) {
            this.ipLockId = val;
            if (this.ipLockId) {
                if (this.organizeId) {
                    this.useLoading = true;
                    //要执行的设备数和已经被设置模板的设备数
                    this.$api
                        .getExistIpLockDevice({ organizeId: this.organizeId })
                        .then((res) => {
                            if (res.success) {
                                this.$api.eventTrackTrigger({
                                    menu: "ANTIROTATION_NET",
                                    business: this.business,
                                    eventResult: res.success,
                                });
                                if (res.data.recordExistIpLockNum) {
                                    this.showIplocked = true;
                                    // this.showIplockedManage = `您选择的${res.data.recordTotleNum}个设备中有${res.data.recordExistIpLockNum}个已经应用模板，请确认要应用防转网模板的设备。`;
                                    // this.noIplockedManage = `不包含${res.data.recordExistIpLockNum}个已应用模板的设备`;
                                    // this.iplockedManage = `包含${res.data.recordExistIpLockNum}个已应用模板的设备`;
                                    this.showIplockedManage = `${this.$t(
                                        "antIrotationNet.applyIpLockDoText1"
                                    )}${res.data.recordTotleNum}${this.$t(
                                        "antIrotationNet.applyIpLockDoText2"
                                    )}${res.data.recordExistIpLockNum}${this.$t(
                                        "antIrotationNet.applyIpLockDoText3"
                                    )}`;
                                    this.noIplockedManage = `${this.$t(
                                        "antIrotationNet.applyIpLockDoText4"
                                    )}${res.data.recordExistIpLockNum}${this.$t(
                                        "antIrotationNet.applyIpLockDoText5"
                                    )}`;
                                    this.iplockedManage = `${this.$t(
                                        "antIrotationNet.applyIpLockDoText6"
                                    )}${res.data.recordExistIpLockNum}${this.$t(
                                        "antIrotationNet.applyIpLockDoText7"
                                    )}`;
                                    this.showIplocked = true;
                                    this.iplockedPramas.organizeId =
                                        this.organizeId;
                                    this.useLoading = false;
                                } else {
                                    this.updateDeviceIpLock(1);
                                    this.useLoading = false;
                                }
                            }
                        });
                } else {
                    this.updateDeviceIpLock(0);
                }
                this.$refs.table.clearSelection();
            }
        },
        //批量应用/ipLock/updateDeviceIpLock
        updateDeviceIpLock(type) {
            let param;
            switch (type) {
                case 0:
                    param = {
                        deviceIds: this.deviceIds,
                        ipLockId: this.ipLockId,
                        organizeId: "",
                        useEnable: 1,
                    };
                    this.useLoading = true;
                    break;
                case 1:
                    param = {
                        deviceIds: [],
                        ipLockId: this.ipLockId,
                        organizeId: this.organizeId,
                        useEnable: 1,
                        updateExistIpLockDevice: this.updateExistIpLockDevice,
                    };
                    // this.useLoading = true;
                    this.makeSureLoading = true;
                    break;
                case 2:
                    param = {
                        deviceIds: this.deviceIds,
                        ipLockId: this.ipLockId,
                        organizeId: "",
                        useEnable: 0,
                    };
                    break;
            }
            let params = param;
            this.$api.updateDeviceIpLock(params).then((res) => {
                if (res.success == true) {
                    if (type === 2) {
                        // 解除防转网成功
                        this.$message.success(
                            this.$t(
                                "antIrotationNet.removedAntiTransferNetwork"
                            )
                        );
                    } else {
                        // 应用成功
                        this.$message.success(
                            this.$t("antIrotationNet.applicationSuccessful")
                        );
                        this.useLoading = false;
                        this.showIplocked = false;
                        this.makeSureLoading = false;
                    }
                    this.getIpLockDevicePage();
                    this.openDialog = false;
                } else {
                    this.$message.error(res.msg);
                    this.makeSureLoading = false;
                    this.useLoading = false;
                }
            });
        },
        //跳转至模板管理页
        goIplockTemplate() {
            this.$router.push(
                "/maintenanceCenter/antIrotationNet/antIrotationNetTemplate"
            );
        },
        //获取模板列表
        getTemplate() {
            //ipLock/getIpLockItem
            this.$api.getIpLockItem().then((res) => {
                if (res.success == true) {
                    this.mouldTemplateList = res.data;
                    this.mouldTemplateList.forEach((item) => {
                        if (item.id != 0) {
                            this.ipLockIdsList.push(item.id);
                        }
                    });
                } else {
                    this.noticeBol = true;
                    this.searchLoading = false;
                }
            });
        },
        //获取组织树
        getIpLockTree() {
            this.$api.getIpLockTree().then((res) => {
                this.TreeExpanded = [];
                this.treeData = [];
                this.setTableHeight();
                if (res.success == true) {
                    this.treeData = res.data;
                    if (res.data.length > 0) {
                        this.groupIds = [];
                        res.data.forEach((item) => {
                            if (item.parentId === 0) {
                                this.groupIds.push(item.id);
                            }
                        });

                        this.params.organizeId = this.$store.state.tree
                            .antIrotationId
                            ? this.$store.state.tree.antIrotationId
                            : res.data[0].id;
                        this.organizeId = this.params.organizeId;
                        this.searchForm = this.$store.state.tree.searchForm
                            ? this.$store.state.tree.searchForm
                            : this.searchForm;
                        this.$nextTick(() => {
                            this.treeData.forEach((m) => {
                                this.TreeExpanded.push(m.id);
                            });
                            this.$refs["tree"].setCurrentKey(
                                this.params.organizeId
                            );
                        });
                        let groupArr = this.groupIds.filter((item) => {
                            return item == this.params.organizeId;
                        });
                        this.groupDisabled = groupArr.length > 0 ? true : false;
                        this.getIpLockDevicePage();
                    } else {
                        this.searchLoading = false;
                    }
                } else {
                    this.noticeBol = true;
                    this.searchLoading = false;
                }
            });
        },
        // 表格高度设置
        setTableHeight() {
            this.tableHeight =
                document.body.clientHeight -
                this.$refs.searchBox.clientHeight -
                this.$refs.searchBtn.clientHeight -
                this.$refs.searchPagination.clientHeight -
                111;
            this.treeHeight = document.body.clientHeight - 149;
        },
        //过滤组织树信息
        filterNode(value, data) {
            return data[value];
        },
        //批量防转网设置
        antIrotationDo() {
            this.organizeId = null;
            if (!this.selection.length) {
                // 请勾选需要设置防转网的设备
                this.$message.info(
                    this.$t("antIrotationNet.antIrotationDoText1")
                );
            } else {
                if (
                    this.mouldTemplateList.length <= 1 ||
                    !this.useTemplate.length
                ) {
                    this.$confirm(
                        // "你还未添加防转网模板，请前往：防转网模板管理“添加”",
                        this.$t("antIrotationNet.antIrotationDoText2"),
                        this.$t("common.prompt"),
                        {
                            confirmButtonText: this.$t(
                                "antIrotationNet.antIrotationDoText3"
                            ), //"现在添加",
                            cancelButtonText: this.$t("common.cancel"),
                            type: "info",
                        }
                    )
                        .then(() => {
                            this.$router.push({
                                path: "/maintenanceCenter/antIrotationNet/antIrotationNetTemplate",
                                query: { type: 1 },
                            });
                        })
                        .catch(() => {});
                } else {
                    this.business = "ANTIROTATION_NET_BATCH_NETWORK";
                    this.openDialog = true;
                }
            }
        },
        //开启/关闭是否启用
        changeCapacityLock(item) {
            let params = {
                deviceIds: [item.id],
                capacityLock: item.capacityLock,
            };
            this.$api.updateIpLockCapacity(params).then((res) => {
                if (res.success) {
                    this.$api.eventTrackTrigger({
                        menu: "ANTIROTATION_NET",
                        business:
                            item.capacityLock == 1
                                ? "ANTIROTATION_NET_SINGLE_ACTIVATION"
                                : "ANTIROTATION_NET_SINGLE_DEACTIVATION",
                        eventResult: res.success,
                    });
                    this.$message.success(
                        // `${item.capacityLock == 1 ? "启用" : "停用"}模板成功`
                        `${
                            item.capacityLock == 1
                                ? this.$t(
                                      "antIrotationNet.changeCapacityLockText1"
                                  )
                                : this.$t(
                                      "antIrotationNet.changeCapacityLockText2"
                                  )
                        }${this.$t("antIrotationNet.changeCapacityLockText3")}}`
                    );
                    this.getIpLockDevicePage();
                } else {
                    this.$message.error(
                        // `${item.capacityLock == 1 ? "启用" : "停用"}模板失败：${
                        //     res.msg
                        // }`
                        `${
                            item.capacityLock == 1
                                ? this.$t(
                                      "antIrotationNet.changeCapacityLockText1"
                                  )
                                : this.$t(
                                      "antIrotationNet.changeCapacityLockText2"
                                  )
                        }${this.$t(
                            "antIrotationNet.changeCapacityLockText4"
                        )}：${res.msg}`
                    );
                }
            });
        },
        //批量启用-批量停用
        batchs(num) {
            if (this.deviceIds.length) {
                this.searchLoading = true;
                this.$nextTick(() => {
                    let params = {
                        deviceIds: this.deviceIds,
                        capacityLock: num,
                    };
                    this.$api.updateIpLockCapacity(params).then((res) => {
                        if (res.success) {
                            this.$api.eventTrackTrigger({
                                menu: "ANTIROTATION_NET",
                                business:
                                    num === 1
                                        ? "ANTIROTATION_NET_BATCH_ACTIVATION"
                                        : "ANTIROTATION_NET_BATCH_DEACTIVATION",
                                eventResult: res.success,
                            });
                            this.$message.success(
                                // `批量${num == 1 ? "启用" : "停用"}模板成功`
                                `${this.$t(
                                    "antIrotationNet.changeCapacityLockText5"
                                )}${
                                    num == 1
                                        ? this.$t(
                                              "antIrotationNet.changeCapacityLockText1"
                                          )
                                        : this.$t(
                                              "antIrotationNet.changeCapacityLockText2"
                                          )
                                }${this.$t(
                                    "antIrotationNet.changeCapacityLockText3"
                                )}`
                            );
                            this.getIpLockDevicePage(true);
                        } else {
                            this.searchLoading = false;
                            this.$message.error(
                                // `批量${num == 1 ? "启用" : "停用"}模板失败：${
                                //     res.msg
                                // }`
                                `${this.$t(
                                    "antIrotationNet.changeCapacityLockText5"
                                )}${
                                    num == 1
                                        ? this.$t(
                                              "antIrotationNet.changeCapacityLockText1"
                                          )
                                        : this.$t(
                                              "antIrotationNet.changeCapacityLockText2"
                                          )
                                }${this.$t(
                                    "antIrotationNet.changeCapacityLockText4"
                                )}：${res.msg}`
                            );
                        }
                    });
                });
            } else {
                // 请勾选需要操作设备
                this.$message.info(
                    this.$t("antIrotationNet.changeCapacityLockText6")
                );
            }
        },

        //整组防转网
        oneGroup() {
            if (!this.listData.length) {
                // 当前组织下无设备，暂不能设置防转网！
                this.$message.info(this.$t("antIrotationNet.oneGroupText1"));
                return;
            }
            this.organizeId = this.params.organizeId;
            if (
                this.mouldTemplateList.length <= 1 ||
                !this.useTemplate.length
            ) {
                this.$confirm(
                    // "你还未添加防转网模板，请前往：防转网模板管理“添加”",
                    this.$t("antIrotationNet.oneGroupText2"),
                    this.$t("common.prompt"),
                    {
                        confirmButtonText: this.$t(
                            "antIrotationNet.oneGroupText3"
                        ), //"现在添加",
                        cancelButtonText: this.$t("common.cancel"),
                        type: "info",
                    }
                )
                    .then(() => {
                        this.$router.push({
                            path: "/maintenanceCenter/antIrotationNet/antIrotationNetTemplate",
                            query: { type: 1 },
                        });
                    })
                    .catch(() => {});
            } else {
                this.business = "ANTIROTATION_NET_GROUP_NETWORK";
                this.openDialog = true;
            }
        },
        selectable(row, index) {
            return true;
        },
        //批量解除防转网
        antIrotationExit() {
            if (!this.selection.length) {
                // 请勾选需要解除防转网的设备
                this.$message.info(
                    this.$t("antIrotationNet.antIrotationExitText1")
                );
            } else {
                this.$confirm(
                    // "该操作会解除已勾选设备的防转网设置，确认批量解除？",
                    this.$t("antIrotationNet.antIrotationExitText2"),
                    this.$t("common.prompt"),
                    {
                        confirmButtonText: this.$t("common.confirm"),
                        cancelButtonText: this.$t("common.cancel"),
                        type: "info",
                    }
                )
                    .then(() => {
                        this.updateDeviceIpLock(2);
                    })
                    .catch(() => {});
            }
        },
        //查询已绑定防转网模板设备列表
        getIpLockedDevicePage() {
            this.ipLockedSearchLoading = true;
            let params = Object.assign(this.iplockedPramas, { allLockIds: 1 });
            this.$api.getIpLockDevicePage(params).then((res) => {
                if (res.success) {
                    let listData =
                        (res.data.results.length && res.data.totalRecords) ||
                        (!res.data.results.length && !res.data.totalRecords)
                            ? res.data.results
                            : listData;
                    // 为数据添加rowspan字段，方便后面合并数据
                    // listData.forEach(item => {
                    //     item.rowspan = listData.filter(function(i) {
                    //         return i.plateNum == item.plateNum
                    //     }).length;
                    //     item.firstOnlineTime = item.firstOnlineTime ? item.firstOnlineTime : '--';
                    // });
                    // for (let i = 1; i < listData.length; i++) {
                    //     if (listData[i].plateNum == listData[i - 1].plateNum) {
                    //         listData[i].rowspan = 0
                    //     }
                    // }
                    this.iplockedListData = listData;
                    this.iplockedTotal = res.data.totalRecords;
                    this.ipLockedSearchLoading = false;
                    this.$nextTick(() => {
                        this.setTableHeight();
                    });
                } else {
                    this.$message.error(res.msg);
                    this.ipLockedSearchLoading = false;
                }
            });
        },
        //查询设备列表
        getIpLockDevicePage(isClear) {
            if (!this.params.organizeId) {
                this.$message.error(this.$t("common.organizationIsEmpty"));
                return;
            }
            //ipLock/ipLockDevicePage
            this.searchLoading = true;
            this.$store.dispatch("SetCondtion", this.searchForm);
            let params = Object.assign(this.params, this.searchForm);
            this.$api
                .getIpLockDevicePage(params)
                .then((res) => {
                    if (res.success == true) {
                        let listData =
                            (res.data.results.length &&
                                res.data.totalRecords) ||
                            (!res.data.results.length && !res.data.totalRecords)
                                ? res.data.results
                                : listData;
                        // 为数据添加rowspan字段，方便后面合并数据
                        // listData.forEach(item => {
                        //     item.rowspan = listData.filter(function(i) {
                        //         return i.plateNum == item.plateNum
                        //     }).length;
                        //     item.firstOnlineTime = item.firstOnlineTime ? item.firstOnlineTime : '--';
                        // });
                        // for (let i = 1; i < listData.length; i++) {
                        //     if (listData[i].plateNum == listData[i - 1].plateNum) {
                        //         listData[i].rowspan = 0
                        //     }
                        // }
                        this.listData = listData;
                        // console.log(this.listData);
                        this.total = res.data.totalRecords;
                        this.$nextTick(() => {
                            this.setTableHeight();
                            if (isClear) {
                                this.$refs.table.clearSelection();
                            }
                        });
                    } else {
                        this.$message.error(res.msg);
                    }
                    this.searchLoading = false;
                })
                .catch((err) => {
                    this.searchLoading = false;
                });
        },
        // 重置表单
        handleReset(ref) {
            if (ref !== undefined) {
                this.checked = false;
                ref.resetFields();
                this.$store.dispatch("SetCondtion", this.searchForm);
            }
        },
        // 行合并
        // objectSpanMethod({ row, column, rowIndex, columnIndex }) {
        //     if ((this.filterTagLength == 0 || this.filterTagLength == 3)) {
        //         if (row.rowspan != 0) {
        //             if (columnIndex === 0 || columnIndex === 1 || columnIndex === 3) {
        //                 return {
        //                     rowspan: row.rowspan,
        //                     colspan: 1
        //                 };
        //             }
        //         } else {
        //             if (columnIndex === 0 || columnIndex === 1 || columnIndex === 3) {
        //                 return {
        //                     rowspan: row.rowspan,
        //                     colspan: 0
        //                 };
        //             }
        //         }
        //     } else {
        //         return {
        //             rowspan: 1,
        //             colspan: 1
        //         };
        //     }
        // },
        // objectSpanMethodIplock({ row, column, rowIndex, columnIndex }){
        //   if ((this.filterTagLength == 0 || this.filterTagLength == 3)) {
        //         if (row.rowspan != 0) {
        //             if (columnIndex === 1 || columnIndex === 2) {
        //                 return {
        //                     rowspan: row.rowspan,
        //                     colspan: 1
        //                 };
        //             }
        //         } else {
        //             if (columnIndex === 1 || columnIndex === 2) {
        //                 return {
        //                     rowspan: row.rowspan,
        //                     colspan: 0
        //                 };
        //             }
        //         }
        //     } else {
        //         return {
        //             rowspan: 1,
        //             colspan: 1
        //         };
        //     }
        // },
        // 多选事件
        onSelectionChange(selection) {
            this.selectionLength = 0;
            this.selectionLength += selection.length;
            this.selection = selection;
            this.deviceIds = selection.map((item) => item.id);
        },
        filterChange(val) {
            for (let i in val) {
                this.filterTagLength = val[i].length;
            }
        },
        handleNodeClick(data) {
            this.searchForm.plateNum = "";
            this.searchForm.ipLockIds = [];
            this.params.currentPage = 1;
            this.currentNode = data;
            this.params.organizeId = data.id;
            this.organizeId = data.id;
            let groupArr = this.groupIds.filter((item) => {
                return item == this.params.organizeId;
            });
            this.groupDisabled = groupArr.length > 0 ? true : false;
            this.$store.dispatch("SetAntIrotationId", this.params.organizeId);
            this.getIpLockDevicePage();
        },
        handleSizeChange(val) {
            this.params.pageSize = val;
            this.getIpLockDevicePage();
        },
        ipLockedHandleSizeChange(val) {
            this.iplockedPramas.pageSize = val;
            this.getIpLockedDevicePage();
        },
        handleCurrentChange(val) {
            this.params.currentPage = val;
            this.getIpLockDevicePage();
        },
        ipLockedHandleCurrentChange(val) {
            this.iplockedPramas.currentPage = val;
            this.getIpLockedDevicePage();
        },
        selectAll() {
            this.checked = !this.checked;
            this.$forceUpdate();
            if (this.checked) {
                this.mouldTemplateList.forEach((item) => {
                    if (item.id != 0) {
                        this.searchForm.ipLockIds.push(item.id);
                    }
                });
                this.searchForm.ipLockIds = [
                    ...new Set(this.searchForm.ipLockIds),
                ];
            } else {
                this.searchForm.ipLockIds = [];
            }
        },
        changeSelect(val) {
            if (
                val.length &&
                (val.length === this.ipLockIdsList.length ||
                    val.length === this.mouldTemplateList.length)
            ) {
                this.checked = true;
            } else {
                this.checked = false;
            }
            this.$forceUpdate();
        },
        onSortChange(data) {
            let key = data.prop;
            let order = data.order;
            if (order == "descending") {
                order = "desc";
            } else if (order == "ascending") {
                order = "asc";
            }
            if (order != "normal") {
                this.searchForm.orderColumn = key;
                this.searchForm.orderDir = order;
            }
            this.params.currentPage = 1;
            this.getIpLockDevicePage();
        },
        handleLock(type) {
            if (!this.selection.length) {
                this.$message.info(
                    // `请勾选需要${type === 1 ? "锁定" : "解锁"}的设备`
                    `${this.$t("antIrotationNet.handleLockText1")}${
                        type === 1
                            ? this.$t("antIrotationNet.lock")
                            : this.$t("antIrotationNet.unlock")
                    }${this.$t("antIrotationNet.handleLockText2")}`
                );
            } else {
                let deviceIds = this.selection.reduce((prev, cur) => {
                    return prev.concat(cur["id"]);
                }, []);
                this.$confirm(
                    `${this.$t("antIrotationNet.handleLockText3")}${
                        this.selection.length
                    }${this.$t("antIrotationNet.handleLockText4")}${
                        type === 1
                            ? this.$t("antIrotationNet.lock")
                            : this.$t("antIrotationNet.unlock")
                    }？`,
                    this.$t("common.prompt"),
                    {
                        confirmButtonText: this.$t("common.ok"),
                        cancelButtonText: this.$t("common.cancel"),
                        type: "warning",
                    }
                )
                    .then(() => {
                        this.$api
                            .ipLockDeviceLockPlatform({
                                lockEnable: type,
                                deviceIds: deviceIds,
                            })
                            .then((res) => {
                                if (res.success) {
                                    this.$message.success(
                                        `${
                                            type === 1
                                                ? this.$t(
                                                      "antIrotationNet.lock"
                                                  )
                                                : this.$t(
                                                      "antIrotationNet.unlock"
                                                  )
                                        }${this.$t("common.success")}}`
                                    );
                                } else {
                                    this.$message.error(res.msg);
                                }
                                this.$refs.table.clearSelection();
                                this.getIpLockDevicePage();
                            });
                    })
                    .catch(() => {});
            }
        },
        //批量启用-批量停用
        ipLockDeviceLockUserCheck() {
            this.$api.ipLockDeviceLockUserCheck().then((res) => {
                if (res.success) {
                    this.ipLockDeviceLockUserCheckBtn = res.data;
                }
            });
        },
    },
};
</script>
<style lang="less" scoped>
.showIplockedManageP {
    color: #000;
    margin-bottom: 0.5rem;
}
.noticeP {
    color: #000;
    font-size: 14px;
}
.noticeC {
    font-size: 14px;
    text-indent: 28px;
    margin: 10px 0;
}
.radioDiv {
    margin-bottom: 0.5rem;
}
.wrap {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .wrap-top {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        .flex {
            display: flex;
        }
        .el-form-item {
            margin-bottom: 12px !important;
        }
    }
    .wrap-bottom {
        border-top: 1px solid #e4e4e4;
    }
    .hidden {
        height: 46px;
        overflow: hidden;
    }
}
.marginBottom {
    margin-bottom: 0.5rem;
}
/deep/.ipLockIds {
    width: 220px;
    .el-select__tags-text {
        overflow: hidden;
        text-overflow: ellipsis;
        vertical-align: top;
        max-width: 85px;
        display: inline-block;
    }
}
</style>
<style lang="less">
.operate-select {
    width: 195px;

    .el-select-dropdown__wrap {
        position: relative;
        overflow: hidden;
        white-space: nowrap;
    }
    .el-scrollbar__view {
        position: relative;
        height: 274px;
        overflow: hidden;
        .option-box {
            height: 234px;
            overflow-y: auto;
        }
    }
    .copy-btn {
        width: 100%;
        background: #ffffff;
        border-top: 1px solid rgb(242, 242, 242);
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: space-around;
        position: absolute;
        top: 234px;
        .el-button {
            color: #4886ff;
        }
    }
}
</style>
