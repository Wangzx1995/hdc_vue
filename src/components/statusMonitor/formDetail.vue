<template>
    <div class="form-detail">
        <div class="reopen m-b">
            <h2>
                车牌号：<span :title="carDetails.plateNum">{{
                    carDetails.plateNum
                }}</span>
            </h2>
            <div>
                <el-button @click="rebootDevice()">重启设备</el-button>
                <el-button @click="reset()">简单恢复出厂设置</el-button>
                <el-tooltip class="item" :content="msg" placement="top">
                    <i class="el-icon-warning" />
                </el-tooltip>
            </div>
        </div>
        <div class="deviceInfo">
            <p class="deviceTitle">设备信息</p>
            <el-row>
                <el-col :span="6">
                    <p class="title">车牌号</p>
                    <span
                        class="content car-number"
                        :title="deviceManages2.plateNum || '--'"
                        >{{ deviceManages2.plateNum || "--" }}</span
                    >
                </el-col>
                <el-col :span="6">
                    <p class="title">VIN</p>
                    <span class="content">{{
                        deviceManages2.vin || "--"
                    }}</span>
                </el-col>
                <el-col :span="6">
                    <p class="title">设备序列号</p>
                    <span class="content">{{
                        deviceManages2.deviceSerialNum || "--"
                    }}</span>
                </el-col>
                <el-col :span="6">
                    <p class="title">终端手机号</p>
                    <span class="content">{{
                        deviceManages2.deviceCode || "--"
                    }}</span>
                </el-col>
                <el-col :span="6">
                    <p class="title">设备型号</p>
                    <span class="content"
                        >{{ deviceManages2.deviceModelCode || "--"
                        }}<span v-if="deviceManages2.protocolName"
                            >({{ deviceManages2.protocolName }})</span
                        ></span
                    >
                </el-col>
                <el-col :span="6">
                    <p class="title">版本号</p>
                    <span class="content">{{
                        deviceManages2.deviceVersion || "--"
                    }}</span>
                </el-col>
                <el-col :span="6">
                    <p class="title">ICCID</p>
                    <span class="content">{{
                        deviceManages2.iccId || "--"
                    }}</span>
                </el-col>
                <!-- <el-col :span="6">
                    <p class="title">接入协议</p>
                    <span class="content">{{
                        deviceManages2.accessProtocol || "--"
                    }}</span>
                </el-col> -->
                <el-col :span="6">
                    <p class="title">安装服务商</p>
                    <span class="content">{{
                        deviceManages2.installServiceProvider || "--"
                    }}</span>
                </el-col>
                <el-col :span="6">
                    <p class="title">设备厂商</p>
                    <span class="content">{{
                        getLabelSelf(deviceManages2.manufacturerName) || "--"
                    }}</span>
                </el-col>
            </el-row>
            <template v-if="deviceManages2 && deviceManages2.devResourceVer">
                <p class="deviceTitle m-t">设备版本</p>
                <el-row>
                    <el-col
                        :span="6"
                        v-for="(
                            val, key, index
                        ) in deviceManages2.devResourceVer"
                        :key="index"
                        v-show="key !== 'outDevVer'"
                    >
                        <p class="title" v-if="key === 'powerMcuVer'">
                            电源板MCU版本
                        </p>
                        <p class="title" v-else>
                            {{ key.replace("Ver", "版本").toUpperCase() }}
                        </p>
                        <span class="content">{{ val }}</span>
                    </el-col>
                </el-row>
            </template>
            <template
                v-if="
                    deviceManages2.devResourceVer &&
                    deviceManages2.devResourceVer.outDevVer &&
                    deviceManages2.devResourceVer.outDevVer.length
                "
            >
                <p class="deviceTitle m-t">外设版本</p>
                <el-row>
                    <div
                        class="out-dev-info"
                        v-for="(item, index) in deviceManages2.devResourceVer
                            .outDevVer"
                        :key="index"
                    >
                        <div>
                            <span> 外设类型： </span>
                            <span :title="item.outDevType">
                                {{ item.outDevType || "--" }}</span
                            >
                        </div>
                        <div>
                            <span>外设名称： </span>
                            <span :title="item.outDevName">
                                {{ item.outDevName || "--" }}</span
                            >
                        </div>
                        <div>
                            <span> 外设版本： </span>
                            <span :title="item.outDevVersion">
                                {{ item.outDevVersion || "--" }}</span
                            >
                        </div>
                    </div>
                </el-row>
            </template>
        </div>
        <div class="deviceInfo">
            <p class="deviceInfoTitle">设备状态</p>
            <el-row type="flex" justify="space-between">
                <el-col :span="24">
                    <p class="title_leftLine">
                        视频状态&nbsp;&nbsp;<span class="title_span"
                            >更新时间：{{
                                videoManage.lostVideoChannelStatusTime
                            }}</span
                        >
                    </p>
                    <p class="title">录像状态</p>
                    <span v-if="videoManage.recordStatus == 1" class="content"
                        ><span class="text-success">●&nbsp;</span>正常</span
                    >
                    <span
                        v-else-if="videoManage.recordStatus == 0"
                        class="content"
                        ><span class="text-error">●&nbsp;</span>异常{{
                            deviceManages.recordStatus
                                ? "（存储卡写入异常）"
                                : "（存储卡异常）"
                        }}</span
                    >
                    <span class="content" v-else>●&nbsp;--</span>

                    <div class="tableBox">
                        <el-table
                            stripe
                            element-loading-color="#007213"
                            :data="videoManage.videoChannelStatus"
                            border
                        >
                            <el-table-column
                                prop="name"
                                label="通道号"
                                min-width="100px"
                            ></el-table-column>
                            <el-table-column
                                prop="type"
                                label="类型"
                                min-width="100px"
                            ></el-table-column>
                            <el-table-column
                                prop="status"
                                label="视频信号状态"
                                min-width="150px"
                            >
                                <template slot-scope="scope">
                                    <span
                                        v-if="
                                            scope.row.enable != 0 &&
                                            scope.row.status == 1
                                        "
                                        class="content"
                                        ><span class="text-success"
                                            >●&nbsp;</span
                                        >正常</span
                                    >
                                    <span
                                        v-else-if="
                                            scope.row.enable != 0 &&
                                            scope.row.status == 0
                                        "
                                        class="content"
                                        ><span class="text-error">●&nbsp;</span
                                        >未接入</span
                                    >
                                    <span v-else>●&nbsp;--</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="shelter"
                                label="视频遮挡状态"
                                min-width="240px"
                            >
                                <template slot-scope="scope">
                                    <span
                                        v-if="scope.row.installationStatus == 0"
                                        >●&nbsp;--</span
                                    >
                                    <template v-else>
                                        <span
                                            v-if="scope.row.shelter == 1"
                                            class="content"
                                            ><span class="text-success"
                                                >●&nbsp;</span
                                            >正常</span
                                        >
                                        <span
                                            v-if="scope.row.shelter == 0"
                                            class="content"
                                            ><span class="text-error"
                                                >●&nbsp;</span
                                            >异常</span
                                        >
                                    </template>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <p style="margin-top: 14px" class="title_leftLine">
                        灾备录像状态&nbsp;&nbsp;<span class="title_span"
                            >更新时间：{{
                                videoManage.boxRecordStatusTime
                            }}</span
                        >
                    </p>
                    <span
                        v-if="videoManage.boxRecordStatus == 2"
                        class="content tableBox"
                        ><span>●&nbsp;</span>不支持</span
                    >
                    <span
                        v-else-if="videoManage.boxRecordStatus == 1"
                        class="content tableBox"
                        ><span class="text-success">●&nbsp;</span>正常</span
                    >
                    <span
                        v-else-if="videoManage.boxRecordStatus == 0"
                        class="content tableBox"
                        ><span class="text-error">●&nbsp;</span>异常{{
                            deviceManages.boxRecordStatus
                                ? "（存储卡写入异常）"
                                : "（存储卡异常）"
                        }}</span
                    >
                    <span class="content tableBox" v-else
                        >●&nbsp;{{
                            videoManage.boxRecordStatus == undefined
                                ? "--"
                                : "--"
                        }}</span
                    >
                </el-col>
                <!-- <el-col :span="8">
          <p class="title_leftLine">近24小时录像状态&nbsp;&nbsp;<span class="title_span">更新时间：{{videoManage.recordLostUpdateTime}}</span></p>
          <el-row>
            <el-col :span="8">
              <p class="title">录像缺失段数</p>
              <span class="content">{{videoManage.recordLostNum || '●&nbsp;--'}}</span>
            </el-col>
            <el-col :span="8">
              <p class="title">录像缺失时长</p>
              <span class="content">{{videoManage.recordLostTime ? videoManage.recordLostTime+'分钟' : '●&nbsp;--'}}</span>
            </el-col>
          </el-row>
          <div class="tableBox">
            <el-table element-loading-color="#007213" :data="videoManage.recordLostInfo" border>
              <el-table-column prop="channelNum" label="通道号" min-width="100px"></el-table-column>
              <el-table-column prop="lostCount" label="丢失片段数" min-width="100px"></el-table-column>
              <el-table-column prop="recordTime" label="录像时长" min-width="150px">
                <template slot-scope="scope">
                  <span>{{scope.row.recordTime ? scope.row.recordTime+'分钟' : '●&nbsp;--'}}</span>
                </template>  
              </el-table-column>
            </el-table>
          </div>
        </el-col> -->
            </el-row>
            <div
                class="storage-list"
                v-if="deviceManages['storageMediaStatus']"
            >
                <p class="title_leftLine">
                    存储状态&nbsp;&nbsp;<span class="title_span"
                        >更新时间：{{
                            deviceManages["storageMediaStatus"]["updateTime"]
                        }}</span
                    >
                </p>
                <el-button @click="openFormatRecord">格式化记录</el-button>
            </div>

            <div v-if="deviceManages['storageMediaStatus']" class="tableBox">
                <el-table
                    stripe
                    element-loading-color="#007213"
                    :data="deviceManages['storageMediaStatus']['hddVoList']"
                    border
                >
                    <el-table-column
                        prop="hddName"
                        label="存储介质"
                        min-width="100px"
                    >
                        <template slot-scope="scope">
                            <!-- <span v-if="isApi" class="content">{{
                                scope.row.hddType + " : " + scope.row.hddName
                            }}</span>
                            <span v-else class="content">{{
                                scope.row.hddName
                            }}</span> -->
                            <span class="content">{{ scope.row.hddName }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="hddStatus"
                        label="状态"
                        min-width="100px"
                    >
                        <template slot-scope="scope">
                            <div v-if="isApi">
                                <span
                                    v-if="scope.row.hddStatus == 0"
                                    class="content"
                                    ><span class="text-success">●&nbsp;</span
                                    >正常</span
                                >
                                <span
                                    v-else-if="scope.row.hddStatus == 1"
                                    class="content"
                                    ><span class="text-error">●&nbsp;</span
                                    >本地存储介质不存在</span
                                >
                                <span
                                    v-else-if="scope.row.hddStatus == 2"
                                    class="content"
                                    ><span class="text-muted">●&nbsp;</span
                                    >未格式化</span
                                >
                                <span
                                    v-else-if="scope.row.hddStatus == 3"
                                    class="content"
                                    ><span class="text-muted">●&nbsp;</span
                                    >错误</span
                                >
                                <span
                                    v-else-if="scope.row.hddStatus == 4"
                                    class="content"
                                    ><span class="text-muted">●&nbsp;</span
                                    >闲置</span
                                >
                                <span
                                    v-else-if="scope.row.hddStatus == 5"
                                    class="content"
                                    ><span class="text-muted">●&nbsp;</span
                                    >不匹配</span
                                >
                                <span
                                    v-else-if="scope.row.hddStatus == 6"
                                    class="content"
                                    ><span class="text-muted">●&nbsp;</span
                                    >网络存储未连接</span
                                >
                                <span
                                    v-else-if="scope.row.hddStatus == 7"
                                    class="content"
                                    ><span class="text-muted">●&nbsp;</span
                                    >检测失败</span
                                >
                                <span
                                    v-else-if="scope.row.hddStatus == 8"
                                    class="content"
                                    ><span class="text-muted">●&nbsp;</span
                                    >存储正在修复</span
                                >
                                <span
                                    v-else-if="scope.row.hddStatus == 9"
                                    class="content"
                                    ><span class="text-muted">●&nbsp;</span
                                    >正在格式化</span
                                >
                                <span
                                    v-else-if="scope.row.hddStatus == 10"
                                    class="content"
                                    ><span class="text-muted">●&nbsp;</span
                                    >未在录播主机中格式化</span
                                >
                                <span
                                    v-else-if="scope.row.hddStatus == 11"
                                    class="content"
                                    ><span class="text-muted">●&nbsp;</span
                                    >维护中</span
                                >
                                <span
                                    v-else-if="scope.row.hddStatus == 12"
                                    class="content"
                                    ><span class="text-muted">●&nbsp;</span
                                    >同步中</span
                                >
                                <span
                                    v-else-if="scope.row.hddStatus == 13"
                                    class="content"
                                    ><span class="text-muted">●&nbsp;</span
                                    >同步异常</span
                                >
                                <span
                                    v-else-if="scope.row.hddStatus == 14"
                                    class="content"
                                    ><span class="text-muted">●&nbsp;</span
                                    >已卸载</span
                                >
                                <span
                                    v-else-if="scope.row.hddStatus == -1"
                                    class="content"
                                    ><span class="text-error">●&nbsp;</span
                                    >存储容量太小</span
                                >
                                <span
                                    v-else-if="scope.row.hddStatus == -2"
                                    class="content"
                                    ><span class="text-muted">●&nbsp;</span
                                    >未初始化</span
                                >
                                <span
                                    v-else-if="scope.row.hddStatus == -3"
                                    class="content"
                                    ><span class="text-muted">●&nbsp;</span
                                    >正在初始化中</span
                                >
                                <span v-else class="content"
                                    ><span class="text-muted">●&nbsp;</span
                                    >--</span
                                >
                            </div>
                            <div v-else>
                                <span
                                    v-if="scope.row.hddStatus == 0"
                                    class="content"
                                    ><span class="text-error">●&nbsp;</span
                                    >本地存储介质不存在</span
                                >
                                <span
                                    v-else-if="scope.row.hddStatus == 1"
                                    class="content"
                                    ><span class="text-success">●&nbsp;</span
                                    >正常</span
                                >
                                <span
                                    v-else-if="scope.row.hddStatus == 2"
                                    class="content"
                                    ><span class="text-muted">●&nbsp;</span
                                    >异常</span
                                >
                                <span
                                    v-else-if="scope.row.hddStatus == 3"
                                    class="content"
                                    ><span class="text-error">●&nbsp;</span
                                    >存储容量太小</span
                                >
                                <span
                                    v-else-if="scope.row.hddStatus == 4"
                                    class="content"
                                    ><span class="text-muted">●&nbsp;</span
                                    >未初始化</span
                                >
                                <span
                                    v-else-if="scope.row.hddStatus == 5"
                                    class="content"
                                    ><span class="text-muted">●&nbsp;</span
                                    >正在初始化中</span
                                >
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="capacity"
                        column-key="capacity"
                        label="容量"
                        min-width="150px"
                        :render-header="
                            (h) => {
                                return h('span', { class: 'poptip' }, [
                                    h('span', '容量'), //表格当前列标题
                                    h(
                                        'el-tooltip',
                                        {
                                            props: {
                                                placement: 'top',
                                                width: '80px',
                                                trigger: 'hover',
                                                offset: 2,
                                                transfer: true,
                                            },
                                        },
                                        [
                                            h('Icon', {
                                                //筛选图标
                                                props: {
                                                    type: 'information-circled',
                                                    color: '#B9BCCD',
                                                    size: '12',
                                                },
                                                style: {
                                                    'margin-left': '4px',
                                                },
                                            }),
                                            h(
                                                'span',
                                                { slot: 'content' },
                                                '使用海康威视安防级文件预分配存储技术，格式化时即根据存储卡总容量预置录像文件'
                                            ),
                                        ]
                                    ),
                                ]);
                            }
                        "
                    >
                        <template slot-scope="scope">
                            <span>{{
                                scope.row.capacity == 0 || scope.row.capacity
                                    ? scope.row.capacity + "GB"
                                    : "--"
                            }}</span>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column label="剩余容量" min-width="100px">
            <template slot-scope="scope">
              <span>{{scope.row.freeSpace>=1024 ? Math.ceil(scope.row.freeSpace/1024)+'GB' : scope.row.freeSpace+'MB' || '--'}}</span>
            </template>  
          </el-table-column> -->
                    <el-table-column :label="$t('common.operate')" min-width="100px">
                        <template slot-scope="scope">
                            <div v-if="isApi">
                                <a
                                    v-if="!scope.row.hddType.includes('BACKUP')"
                                    @click="
                                        formatting(
                                            scope.row.id,
                                            scope.row.hddType +
                                                ' : ' +
                                                scope.row.hddName,
                                            scope.row.hddName
                                        )
                                    "
                                    :disabled="
                                        scope.row.sdFormatSchedule ||
                                        (scope.row.hddStatus != 3 &&
                                            scope.row.hddStatus != 2)
                                    "
                                    >格式化</a
                                >
                            </div>
                            <div v-else>
                                <div
                                    v-if="!scope.row.hddType.includes('BACKUP')"
                                >
                                    <a
                                        v-if="
                                            !scope.row.sdFormatSchedule ||
                                            scope.row.sdFormatSchedule === 100
                                        "
                                        @click="
                                            formatting(
                                                scope.row.id,
                                                scope.row.hddType,
                                                scope.row.hddName
                                            )
                                        "
                                        :disabled="
                                            (scope.row.sdFormatSchedule &&
                                                scope.row.sdFormatSchedule !==
                                                    100) ||
                                            (scope.row.hddStatus != 2 &&
                                                scope.row.hddStatus != 4)
                                        "
                                        >格式化</a
                                    >
                                    <a
                                        v-else
                                        :disabled="true"
                                        class="formatting"
                                        >格式化中({{
                                            scope.row.sdFormatSchedule
                                        }}%)</a
                                    >
                                </div>
                            </div>

                            <!-- <span class="split">|</span>
                <a>巡检</a> -->
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <p class="title_leftLine">
                多中心连接状态&nbsp;&nbsp;<span class="title_span"
                    >更新时间：{{ devicePlatformInfo.updateTime }}</span
                >
            </p>
            <el-table
                class="tableBox"
                stripe
                element-loading-color="#007213"
                :data="devicePlatformInfo.platformInfo"
                border
            >
                <el-table-column label="中心名称" width="160px">
                    <template slot-scope="scope">
                        <span>第{{ scope.row.platformOrder + 1 }}中心</span>
                    </template>
                </el-table-column>
                <el-table-column label="使能" width="160px">
                    <template slot-scope="scope">
                        <el-switch
                            disabled
                            :active-value="Number(1)"
                            :inactive-value="Number(0)"
                            v-model="scope.row.enable"
                        >
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column prop="ip" label="连接地址" width="160px">
                </el-table-column>
                <el-table-column prop="port" label="连接端口" width="160px">
                </el-table-column>
                <el-table-column label="连接状态" width="160px">
                    <template slot-scope="scope">
                        <span>{{
                            scope.row.status === 1 ? "未连接" : "已连接"
                        }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="离线原因" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{ scope.row.offlineReason }}</span>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('common.operate')">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            v-if="carDetails.deviceStatus == 1"
                            @click="goCenterSetting()"
                        >
                            <i class="el-icon-edit"></i
                        ></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <p class="title_leftLine">
                定位状态&nbsp;&nbsp;<span class="title_span"
                    >更新时间：{{ deviceManages.gpsStatusTime }}</span
                >
            </p>
            <el-row>
                <el-col :span="6">
                    <p class="title">定位状态</p>
                    <span class="content">{{
                        deviceManages.gpsStatus == 1 ? "定位成功" : "定位失败"
                    }}</span>
                </el-col>
                <el-col :span="6">
                    <p class="title">定位方式</p>
                    <span class="content">{{
                        deviceManages.gpsType
                            ? gpsTypes[Number(deviceManages.gpsType) - 1]
                            : "--"
                    }}</span>
                </el-col>
                <el-col :span="6">
                    <p class="title">精度因子</p>
                    <span class="content">{{
                        deviceManages.gpsPrecisionFactor
                            ? deviceManages.gpsPrecisionFactor
                            : "--"
                    }}</span>
                </el-col>
                <el-col :span="6">
                    <p class="title">可用卫星数</p>
                    <span class="content">{{
                        deviceManages.gnssSatellitesNum
                            ? deviceManages.gnssSatellitesNum
                            : "--"
                    }}</span>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="6">
                    <p class="title">最强4颗卫星信噪比</p>
                    <span class="content">{{
                        deviceManages.gpsHss ? deviceManages.gpsHss : "--"
                    }}</span>
                </el-col>
                <el-col :span="6">
                    <p class="title">其他异常</p>
                    <span class="content">{{
                        (deviceManages.link != null ||
                            deviceManages.link != undefined) &&
                        deviceManages.link != 2
                            ? "天线" + links[Number(deviceManages.link)]
                            : "无"
                    }}</span>
                    <!-- <span v-if="deviceManages.link !=null || deviceManages.link !=undefined && deviceManages.link == 1" class="content">无</span> -->
                </el-col>
            </el-row>
            <p class="title_leftLine">
                网络信号&nbsp;&nbsp;<span class="title_span"
                    >更新时间：{{ deviceManages.signalIntensityTime }}</span
                >
            </p>
            <el-row>
                <el-col :span="6">
                    <p class="title">信号强度</p>
                    <img
                        class="image"
                        v-if="
                            deviceManages.signalIntensity === '' ||
                            deviceManages.signalIntensity === null
                        "
                        src="/static/images/5G_0.png"
                    />
                    <img
                        class="image"
                        v-else-if="
                            deviceManages.signalIntensity > 0 &&
                            deviceManages.signalIntensity <= 85
                        "
                        src="/static/images/5G_5.png"
                    />
                    <img
                        class="image"
                        v-else-if="
                            deviceManages.signalIntensity > 85 &&
                            deviceManages.signalIntensity <= 90
                        "
                        src="/static/images/5G_4.png"
                    />
                    <img
                        class="image"
                        v-else-if="
                            deviceManages.signalIntensity > 90 &&
                            deviceManages.signalIntensity <= 95
                        "
                        src="/static/images/5G_3.png"
                    />
                    <img
                        class="image"
                        v-else-if="
                            deviceManages.signalIntensity > 95 &&
                            deviceManages.signalIntensity <= 100
                        "
                        src="/static/images/5G_2.png"
                    />
                    <img
                        class="image"
                        v-else-if="
                            deviceManages.signalIntensity > 100 &&
                            deviceManages.signalIntensity <= 105
                        "
                        src="/static/images/5G_1.png"
                    />
                    <span v-else>--</span>
                </el-col>
                <el-col :span="6">
                    <p class="title">网络状态</p>
                    <span class="content">{{
                        deviceManages.signalType
                            ? deviceManages.signalType
                            : "--"
                    }}</span>
                </el-col>
            </el-row>
            <p class="title_leftLine">
                上下线状态&nbsp;&nbsp;<span class="title_span"
                    >更新时间：{{ deviceManages.gpsStatusTime }}</span
                >
            </p>
            <el-row>
                <el-col :span="6">
                    <p class="title">最后一次上线时间</p>
                    <span class="content">{{
                        videoManage.lastOnlineTime
                            ? videoManage.lastOnlineTime
                            : "--"
                    }}</span>
                </el-col>
                <el-col :span="6">
                    <p class="title">最后一次下线时间</p>
                    <span class="content">{{
                        videoManage.lastOfflineTime
                            ? videoManage.lastOfflineTime
                            : "--"
                    }}</span>
                </el-col>
            </el-row>
            <p class="title_leftLine">上线/离线记录</p>
            <el-row>
                <AttendenceRecord
                    :onlineTimeList="deviceOnlineVo.deviceOnlineSectionVoList"
                    :totalHours="deviceOnlineVo.totalHours"
                    :totalMinutes="deviceOnlineVo.totalMinutes"
                    :totalSeconds="deviceOnlineVo.totalSeconds"
                ></AttendenceRecord>
            </el-row>
            <p class="title_leftLine">
                架设状态&nbsp;&nbsp;<span class="title_span"
                    >更新时间：{{ inspectionData.startTime }}</span
                >
            </p>
            <el-row>
                <el-col :span="12">
                    <p class="title">ADAS架设状态</p>
                    <span class="content">{{
                        inspectionData.adasAlgStatus === undefined
                            ? "--"
                            : adasStatus[inspectionData.adasAlgStatus] || "--"
                    }}</span>
                </el-col>
                <el-col :span="12">
                    <p class="title">DSM架设状态</p>
                    <span class="content">{{
                        inspectionData.dbaAlgStatus === undefined
                            ? "--"
                            : dbaStatus[inspectionData.dbaAlgStatus] || "--"
                    }}</span>
                </el-col>
                <el-col :span="12">
                    <p class="title">BSD架设状态</p>

                    <span class="content"
                        >前：{{
                            inspectionData.frontBsdStatusDesc === "不支持"
                                ? "--"
                                : inspectionData.frontBsdStatusDesc || "--"
                        }}
                        ， 后：{{
                            inspectionData.backBsdStatusDesc === "不支持"
                                ? "--"
                                : inspectionData.backBsdStatusDesc || "--"
                        }}
                        ， 左：{{
                            inspectionData.leftBsdStatusDesc === "不支持"
                                ? "--"
                                : inspectionData.leftBsdStatusDesc || "--"
                        }}
                        ， 右：{{
                            inspectionData.rightBsdStatusDesc === "不支持"
                                ? "--"
                                : inspectionData.rightBsdStatusDesc || "--"
                        }}
                        <!-- inspectionData.rightBsdStatusDesc
                                ? inspectionData.rightBsdStatusDesc === "不支持"
                                    ? "--"
                                    : inspectionData.rightBsdStatusDesc || "--"
                                : inspectionData.bsdAlgStatus === undefined
                                ? "--"
                                : bsdStatus[inspectionData.bsdAlgStatus] || "--" -->
                    </span>
                    <!-- <span class="content" v-else>
                        {{
                            inspectionData.bsdAlgStatus === undefined
                                ? "--"
                                : bsdStatus[inspectionData.bsdAlgStatus] || "--"
                        }}
                    </span> -->
                </el-col>
                <el-col :span="12">
                    <p class="title">WHD架设状态</p>
                    <span class="content">{{
                        inspectionData.whdAlgStatus === undefined
                            ? "--"
                            : whdStatus[inspectionData.whdAlgStatus] || "--"
                    }}</span>
                </el-col>
            </el-row>
            <p
                style="margin-top: 14px"
                class="title_leftLine"
                v-if="customExpandInfoData.customExpand"
            >
                自定义扩展信息&nbsp;&nbsp;<span class="title_span"
                    >更新时间：{{ customExpandInfoData.uploadTime }}</span
                >
            </p>
            <pre v-if="customExpandInfoData.customExpand">
        {{ JSON.parse(customExpandInfoData.customExpand) }} 
        </pre
            >
        </div>
        <!-- <div class="form-detail-module" v-for="item in dataList" v-bind:key="item.index">
      <h2 v-if="item.detail.length>0" class="m-y">{{item.title}}</h2>
      <div class="form-detail-content">
        <div class="form-detail-item" v-for="i in item.detail" v-bind:key="i.index">
          <p>{{i.name}}
            <el-popover
            :ref="'popover'+i.index"
            placement="top"
            trigger="click"
            v-if="i.showPopover"
          >
            <p>更新时间：{{updateTime}}</p>
            <i class="el-icon-warning m-x-sm" slot="reference"></i>
          </el-popover>
          <el-popover
            :ref="'popover'+i.index"
            placement="top"
            trigger="click"
            v-else-if="i.showLocationPopover"
          >
            <p>更新时间：{{locationUpdateTime}}</p>
            <p>经纬度：{{location}}</p>
            <p>方向角：{{directionAngle}}</p>
            <i class="el-icon-warning m-x-sm" slot="reference"></i>
          </el-popover>

          <el-popover
            :ref="'popover'+i.index"
            placement="top"
            trigger="click"
            v-else-if="i.showLostVideoChannelStatus"
          >
           <p> 视频信号丢失通道状态：<span v-for="(item , i) in lostVideoChannelValueList " v-bind:style="item!=0?errorStatus:normalStatus">{{i + 1 }} </span> </p>
            <p>更新时间：{{lostVideoChannelStatusTime}}</p>
            <i class="el-icon-warning m-x-sm" slot="reference"></i>
          </el-popover>

          <el-popover
            :ref="'popover'+i.index"
            placement="top"
            trigger="click"
            v-else-if="i.showOcclusionChannelStatus"
          >
            <p> 视频遮挡通道状态：<span v-for="(item , i) in occlusionChannelValueList " v-bind:style="item!=0?errorStatus:normalStatus">{{i + 1 }} </span> </p>
            <p>更新时间：{{occlusionChannelStatusTime}}</p>
            <i class="el-icon-warning m-x-sm" slot="reference"></i>
          </el-popover>

          <el-popover
            :ref="'popover'+i.index"
            placement="top"
            trigger="click"
            v-else-if="i.showStorage"
          >
            <p>存储类型: {{i.name}}</p>
            <p>存储状态: {{i.hddStatus}}</p>
            <p>最大容量: {{i.capacity}}M</p>
            <p>剩余容量: {{i.freeSpace}}M</p>
            <p>更新时间: {{i.hddUpdateTime}}</p>
            <i class="el-icon-warning m-x-sm" slot="reference"></i>
          </el-popover>
          <a @click="formatting(i.hddId,i.name)" v-if="i.formatting">格式化</a>
          </p>
          <span v-if="i.flag">
            <span>{{i.value.lastOnlineTime}}</span>
            <br/>
            <span>{{i.value.lastOfflineTime}}</span>
          </span>
          <span v-else-if='i.value=="异常"&&i.showOcclusionChannelStatus'>
             <span v-for="(item , i) in occlusionChannelValueList " v-bind:style="item!=0?errorStatus:normalStatus">{{i + 1 }} </span> 
          </span>
          <span v-else>
             {{i.value}}
          </span>
        </div>
      </div>
    </div> -->
        <el-dialog
            title="格式化记录"
            :visible.sync="formatRecordVisible"
            append-to-body
            :width="'960px'"
        >
            <el-table
                stripe
                v-loading="searchLoading"
                :element-loading-text="$t('common.desperatelyLoading')"
                :data="listData"
                :height="500"
                border
            >
                <el-table-column
                    prop="hddName"
                    label="存储介质"
                ></el-table-column>
                <el-table-column prop="createTime" label="操作时间">
                    <template slot-scope="scope">
                        <span>{{
                            TimeUtil.getDateTime(scope.row.createTime)
                        }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="operateUserName"
                    label="操作人员"
                ></el-table-column>
                <el-table-column
                    prop="operateIp"
                    label="操作人IP"
                ></el-table-column>
                <el-table-column prop="result" label="操作结果">
                    <template slot-scope="scope"
                        ><div class="status-box">
                            <span v-if="scope.row.result === 1"
                                ><i class="status-1"></i>成功</span
                            >
                            <span v-if="scope.row.result === 2"
                                ><i class="status-2"></i>失败<span
                                    :title="scope.row.failReason"
                                    >({{ scope.row.failReason }})</span
                                ></span
                            >
                            <span v-if="scope.row.result === 3"
                                ><i class="status-3"></i>
                                <span v-if="isApi"> 已下发 </span>
                                <span v-else>
                                    进行中({{ scope.row.schedule }}%)
                                </span>
                            </span>
                            <span v-if="scope.row.result === 0"
                                ><i class="status-0"></i>未开始</span
                            >
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                @size-change="PageSizeChange"
                @current-change="pageChange"
                :current-page="params.currentPage"
                :page-sizes="[20, 50, 100]"
                :page-size="params.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
            >
            </el-pagination>
        </el-dialog>
    </div>
</template>

<script>
import AttendenceRecord from "@/components/AttendenceRecord";
import TimeUtil from "@/utils/time";
export default {
    props: {
        carDetails: {
            type: Object,
            default: () => {},
        },
    },
    components: {
        AttendenceRecord,
    },
    data() {
        return {
            deviceOnlineVo: {},
            deviceManages2: {},
            TimeUtil,
            isApi: false,
            searchLoading: false,
            formatRecordVisible: false,
            params: {
                currentPage: 1, //页码，从1开始
                pageSize: 20, //分页大小
                orderColumn: "operateTime", //排序列
                orderDir: "desc", //排序方向
            },
            listData: [], // @:data
            total: 0, // 数据总数
            normalStatus: {
                color: "green",
            },
            errorStatus: {
                color: "red",
            },
            updateTime: "",
            videoManage: {},
            customExpandInfoData: {},
            deviceManages: {},
            gpsTypes: ["单GPS", "单BD", "双模（GPS+BD）"],
            inspectionData: {},
            links: ["短路", "检测状态--", "正常", "开路"],
            deviceCode: this.carDetails.deviceCode,
            productKey: this.carDetails.productKey,
            storageDetails: this.carDetails.storageDetails
                ? JSON.parse(this.carDetails.storageDetails)
                : "",
            msg: "简单恢复出厂设置：保留账号、密码、Wi-Fi、智能算法标定、车速标定、ADAS相机标定、平台、NTP校时、升级平台参数。",
            locationStatusList: {
                0: "无效",
                1: "有效",
            },
            signalStrengthList: {
                0: "弱",
                1: "中等",
                2: "强",
            },
            channelStatusList: {
                0: "异常",
                1: "正常",
            },
            locationUpdateTime: "",
            location: "",
            lostVideoChannelValueList: [],
            occlusionChannelValueList: [],
            occlusionChannelValue: [],
            occlusionChannelStatusTime: "",
            lostVideoChannelStatusTime: "",
            directionAngle: "",
            dataList: [
                {
                    title: "设备信息",
                    detail: [],
                },
                {
                    title: "设备状态",
                    detail: [],
                },
            ],
            dbaStatus: {
                0: "正常",
                1: "无人脸输出---离岗",
                2: "无人脸输出---镜头偏离",
                3: "人脸过大，宽度大于450",
                4: "人脸过小，宽度小于150",
                5: "人脸过亮，亮度大于220",
                6: "人脸过暗，亮度小于60",
                7: "人脸位置太靠左、右、下",
                8: "架设异常预警(画面模糊或者遮挡)",
                65534: "无效",
            },
            bsdStatus: {
                0: "正常",
                257: "车身占比异常",
                65534: "无效",
            },
            adasStatus: {
                0: "正常",
                769: "路面分割占比偏低",
                770: "消隐线异常",
                771: "初始消隐线过低",
                772: "初始消隐线过高",
                773: "ADAS镜头遮挡预警",
                65534: "无效",
            },
            whdStatus: {
                0: "正常",
                1281: "未检测到方向盘",
                1282: "方向盘路未检测到头部",
                1283: "方向盘架设不规范",
                1284: "方向盘位置太靠近上、下",
                65534: "无效",
            },
            devicePlatformInfo: {},
            deviceDicList: [],
        };
    },
    methods: {
        formatting(harddiskID, isApiHddName, name) {
            this.$confirm(`确定格式化${this.isApi ? isApiHddName : name}吗？`, {
                confirmButtonText: "格式化",
                cancelButtonText: this.$t("common.cancel"),
                type: "warning",
            })
                .then(() => {
                    let params = {};
                    if (this.isApi) {
                        params = {
                            deviceCode: this.deviceCode,
                            productKey: this.productKey,
                            hddName: isApiHddName,
                            harddiskID,
                        };
                    } else {
                        params = {
                            deviceCode: this.deviceCode,
                            hddName: name,
                        };
                    }
                    this.$api[
                        this.isApi ? "contentMgmtStorageFormat" : "hddFormat"
                    ](params).then((res) => {
                        if (res.success == true) {
                            this.$message.success(`格式化指令下发成功`);
                            this.getTable();
                        } else {
                            this.$message.error(
                                "格式化指令下发失败:" + res.msg
                            );
                        }
                    });
                })
                .catch(() => {});
        },
        rebootDevice() {
            this.$confirm("确定重启设备吗？", {
                confirmButtonText: this.$t("common.ok"),
                cancelButtonText: this.$t("common.cancel"),
                type: "warning",
            })
                .then(() => {
                    let params = {
                        deviceCode: this.deviceCode,
                        productKey: this.productKey,
                    };
                    this.$api.reboot(params).then((res) => {
                        if (res.success == true) {
                            this.$message.success(`设备重启指令下发成功！`);
                        } else {
                            this.$message.error(
                                "设备重启指令下发失败:" + res.msg
                            );
                        }
                    });
                })
                .catch(() => {});
        },
        reset() {
            this.$confirm("确定部分恢复出厂设置吗？", {
                confirmButtonText: this.$t("common.ok"),
                cancelButtonText: this.$t("common.cancel"),
                type: "warning",
            })
                .then(() => {
                    let params = {
                        deviceCode: this.deviceCode,
                        productKey: this.productKey,
                    };
                    this.$api.factoryReset(params).then((res) => {
                        if (res.success == true) {
                            this.$message.success(`恢复出厂设置指令下发成功！`);
                        } else {
                            this.$message.error(
                                "恢复出厂设置指令下发失败:" + res.msg
                            );
                        }
                    });
                })
                .catch(() => {});
        },
        init() {
            let params = {
                deviceCode: this.deviceCode,
                productKey: this.productKey,
            };

            // this.$api.systemLocationStatus(params).then((res) => {
            //     if (res.success == true) {
            //         // console.log(res)
            //     } else {
            //         // this.$message.error('查询定位状态信息失败:' + res.msg)
            //     }
            // });
            // this.$api.systemDeviceInfo(params).then((res) => {
            //     if (res.success == true) {
            //         // console.log(res.data)
            //     } else {
            //         // this.$message.error('查询设备详细信息失败:' + res.msg)
            //     }
            // });
            //获取设备巡检记录接口
            this.$api
                .getInspection({ deviceCode: this.deviceCode })
                .then((res) => {
                    if (res.success) {
                        this.inspectionData = res.data;
                    } else {
                    }
                });
            //巡检详情--设备上下线记录
            this.$api
                .equipmentInspectionDeviceOnlineInfo({
                    deviceId: this.carDetails.deviceId,
                })
                .then((res) => {
                    if (res.success) {
                        this.deviceOnlineVo = res.data;
                    } else {
                    }
                });
            //巡检详情--各平台连接状态显示
            this.$api
                .equipmentInspectionDevicePlatformInfo({
                    deviceId: this.carDetails.deviceId,
                })
                .then((res) => {
                    if (res.success) {
                        this.devicePlatformInfo = res.data || {};
                    } else {
                    }
                });
            //获取设备信息与其他

            // this.$api[this.isApi ? "contentMgmtStorage" : "ehomeStorage"](
            //     params
            // ).then((res) => {
            this.$api
                .equipmentInspectionDeviceInfo({
                    deviceId: this.carDetails.deviceId,
                })
                .then((res) => {
                    if (res.success == true) {
                        this.deviceManages2 = res.data;
                    } else {
                    }
                });

            this.$api.deviceManage(params).then((res) => {
                if (res.success == true) {
                    this.deviceManages = res.data;
                    this.$api
                        .formatCapacity({
                            deviceCode: this.deviceCode,
                        })
                        .then((res2) => {
                            this.isApi = !res2.data;
                            this.$api[
                                this.isApi
                                    ? "contentMgmtStorage"
                                    : "ehomeStorage"
                            ](params).then((response) => {
                                if (response.success == true) {
                                    this.$set(
                                        this.deviceManages,
                                        "storageMediaStatus",
                                        response.data
                                    );
                                    if (
                                        this.deviceManages[
                                            "storageMediaStatus"
                                        ]["hddVoList"] &&
                                        this.deviceManages[
                                            "storageMediaStatus"
                                        ]["hddVoList"].length
                                    ) {
                                        this.deviceManages[
                                            "storageMediaStatus"
                                        ]["hddVoList"].forEach((item) => {
                                            item.sdFormatSchedule =
                                                item.sdFormatSchedule
                                                    ? item.sdFormatSchedule
                                                    : 0;
                                        });
                                    }
                                    if (
                                        response.data.hddVoList &&
                                        response.data.hddVoList.length > 0
                                    ) {
                                        for (
                                            let i = 0;
                                            i < response.data.hddVoList.length;
                                            i++
                                        ) {
                                            if (
                                                response.data.hddVoList[i]
                                                    .hddStatus == 0
                                            ) {
                                                this.$set(
                                                    this.deviceManages,
                                                    "recordStatus",
                                                    true
                                                );
                                                return;
                                            } else {
                                                this.$set(
                                                    this.deviceManages,
                                                    "recordStatus",
                                                    false
                                                );
                                            }
                                        }
                                    } else {
                                        this.$set(
                                            this.deviceManages,
                                            "recordStatus",
                                            false
                                        );
                                    }
                                } else {
                                    this.$set(
                                        this.deviceManages,
                                        "recordStatus",
                                        false
                                    );
                                }
                            });
                        });
                } else {
                }
            });
            //获取录像状态
            this.$api.systemVideoInfo(params).then((res) => {
                if (res.success == true) {
                    this.videoManage = res.data;
                } else {
                    // this.$message.error('查询设备视频信息失败:' + res.msg)
                }
            });
            //获取自定义扩展信息接口
            this.$api.customExpandInfo(params).then((res) => {
                if (res.success == true) {
                    console.log(res);
                    if (res.data.customExpandTime) {
                        res.data["uploadTime"] = TimeUtil.getDateTime(
                            res.data.customExpandTime
                        );
                    }
                    this.customExpandInfoData = res.data;
                } else {
                    // this.$message.error('查询设备视频信息失败:' + res.msg)
                }
            });
        },
        getTable() {
            let params = {
                deviceCode: this.deviceCode,
                productKey: this.productKey,
            };
            this.$api.deviceManage(params).then((res) => {
                if (res.success == true) {
                    this.deviceManages = res.data;
                    this.$api
                        .formatCapacity({
                            deviceCode: this.deviceCode,
                        })
                        .then((res2) => {
                            this.isApi = !res2.data;
                            this.$api[
                                this.isApi
                                    ? "contentMgmtStorage"
                                    : "ehomeStorage"
                            ](params).then((response) => {
                                if (response.success == true) {
                                    this.$set(
                                        this.deviceManages,
                                        "storageMediaStatus",
                                        response.data
                                    );
                                    if (
                                        this.deviceManages[
                                            "storageMediaStatus"
                                        ]["hddVoList"] &&
                                        this.deviceManages[
                                            "storageMediaStatus"
                                        ]["hddVoList"].length
                                    ) {
                                        this.deviceManages[
                                            "storageMediaStatus"
                                        ]["hddVoList"].forEach((item) => {
                                            item.sdFormatSchedule =
                                                item.sdFormatSchedule
                                                    ? item.sdFormatSchedule
                                                    : 0;
                                        });
                                    }
                                }
                            });
                        });
                } else {
                }
            });
        },
        openFormatRecord() {
            this.formatRecordVisible = true;
            this.listData = [];
            this.total = 0;
            this.params = {
                currentPage: 1, //页码，从1开始
                pageSize: 20, //分页大小
                orderColumn: "createTime", //排序列
                orderDir: "desc", //排序方向
                deviceCode: this.deviceCode,
            };
            // this.getData();
        },
        /**
         * @params:category 分类 page：页码 limit:条数
         * */
        getData() {
            this.searchLoading = true;
            this.$api.formatLog(this.params).then((res) => {
                if (res.success == true) {
                    this.listData =
                        (res.data.results.length && res.data.totalRecords) ||
                        (!res.data.results.length && !res.data.totalRecords)
                            ? res.data.results
                            : this.listData;
                    this.total = res.data.totalRecords;
                } else {
                    this.$message.error("获取设备操作日志列表失败:" + res.msg);
                }
                this.searchLoading = false;
            });
        },
        pageChange(page) {
            this.params.currentPage = page;
        },
        /**
         * @on-page-size-change 切换每页条数时的回调，返回切换后的每页条数
         * */
        PageSizeChange(limit) {
            this.params.pageSize = limit;
        },
        goCenterSetting() {
            let params = {
                deviceId: this.carDetails.deviceId,
            };
            this.$api.getDeviceConfigParamWay(params).then((res) => {
                if (res && res.data) {
                    this.$api
                        .getDeviceEHomeCapacity({
                            deviceId: this.carDetails.deviceId,
                            param: "",
                            msgId: 4401,
                        })
                        .then((res2) => {
                            if (res2 && res2.data && res2.data.param) {
                                this.$router.push({
                                    path: "/maintenanceCenter/deviceConfiguration/protocolConfiguration",
                                    query: {
                                        deviceModelCode:
                                            this.carDetails.deviceModelCode,
                                        productKey: this.carDetails.productKey,
                                        organizeId: this.carDetails.organizeId,
                                        deviceId: this.carDetails.deviceId,
                                        carList: JSON.stringify([
                                            this.carDetails,
                                        ]),
                                        multicenter: true,
                                    },
                                });
                            } else {
                                this.$router.push({
                                    path: "/maintenanceCenter/deviceConfiguration/configurationDetail/agreementIndex",
                                    query: {
                                        deviceId: this.carDetails.deviceId,
                                        deviceCode: this.carDetails.deviceCode,
                                        organizeId: this.carDetails.organizeId,
                                        multicenter: true,
                                    },
                                });
                            }
                        });
                } else {
                    this.$router.push({
                        path: "/maintenanceCenter/deviceConfiguration/configurationDetail/agreementIndex",
                        query: {
                            deviceId: this.carDetails.deviceId,
                            deviceCode: this.carDetails.deviceCode,
                            organizeId: this.carDetails.organizeId,
                            multicenter: true,
                        },
                    });
                }
            });
        },
        getLabelSelf(val) {
            let attribute = this.deviceDicList.find(
                (e) => Number(e.sysDictCode) === Number(val)
            );
            if (attribute) {
                return attribute.sysDictName;
            } else {
                return "--";
            }
        },
        getDictionList() {
            this.$api
                .getDictionList({
                    dictType: "deviceLimitType",
                })
                .then((res) => {
                    if (res.success == true) {
                        this.deviceDicList = res.data;
                    }
                });
        },
    },
    watch: {
        params: {
            handler(val) {
                let params = Object.assign(val, this.searchForm);
                this.getData(params);
            },
            deep: true,
        },
        "$store.state.app.sdFormatSchedule": {
            handler(val) {
                if (
                    this.deviceManages["storageMediaStatus"]["hddVoList"] &&
                    this.deviceManages["storageMediaStatus"]["hddVoList"].length
                ) {
                    val.hddVoList.forEach((item) => {
                        this.deviceManages["storageMediaStatus"][
                            "hddVoList"
                        ].map((k) => {
                            if (k.hddName === item.hddName) {
                                k.capacity = item.capacity;
                                k.hddStatus = item.hddStatus;
                                k.sdFormatSchedule = item.sdFormatSchedule;
                                this.$forceUpdate();
                            }
                        });
                    });
                }
            },
            deep: true,
        },
    },
    mounted() {
        this.getDictionList();
        this.init();
    },
};
</script>

<style lang="less" scoped>
.out-dev-info {
    display: flex;
    // flex-direction: column;
    &:not(:first-child) {
        border-top: 1px dashed #ccc;
        padding-top: 8px;
    }
    &:first-child {
        padding-top: 8px;
    }
    & > div {
        display: flex;
        width: 33%;
        margin-bottom: 8px;

        span:nth-child(1) {
            width: 80px;
            text-align: right;
        }
        span:nth-child(2) {
            width: calc(~"100% - 80px");
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
        }
    }
}
.deviceInfo {
    width: 100%;
    margin-bottom: 10px;
    .deviceTitle {
        font-size: 16px;
        font-weight: 600;
        padding-bottom: 10px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.2);
    }
    .deviceInfoTitle {
        font-size: 16px;
        font-weight: 600;
        padding-bottom: 10px;
        margin-top: 20px;
    }
    .title {
        font-size: 12px;
        color: #000000;
    }
    .image {
        width: 20px;
    }
    .tableBox {
        margin: 15px 0;
    }
    .content {
        font-size: 14px;
        color: #000000;
    }
    .title_leftLine {
        padding-left: 4px;
        border-left: 4px solid #000000;
        font-size: 16px;
        color: #000000;
        font-weight: 600;
        .title_span {
            color: #000000;
            font-size: 12px;
            font-weight: 100;
        }
    }
}
.form-detail {
    height: 100%;
    overflow-y: auto;
    padding-right: 12px;
    color: #000000;
    .reopen {
        display: flex;
        justify-content: space-between;
        h2 {
            display: flex;
            align-items: center;
            width: calc(~"100% - 300px");
            font-size: 18px;
            span {
                width: calc(~"100% - 72px");
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
            }
        }
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
.storage-list {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.status-box {
    display: flex;
    align-items: center;
    white-space: nowrap;
    span {
        display: flex;
        align-items: center;
        span {
            display: inline-block;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            width: 120px;
        }
    }
    i {
        display: block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        margin-right: 8px;
    }
    .status-0 {
        background: #cccccc;
    }
    .status-1 {
        background: #77ca67;
    }
    .status-2 {
        background: #ff7777;
    }
    .status-3 {
        background: #ff952c;
    }
}
.formatting {
    color: rgba(0, 0, 0, 0.7);
}
.car-number {
    width: 100%;
    display: block;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}
</style>
