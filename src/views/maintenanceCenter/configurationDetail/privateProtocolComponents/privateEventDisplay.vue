<template>
    <div class="p-a-md">
        <el-form
            ref="PrivateEventDisplayForm"
            label-position="top"
            :model="form"
            label-width="120px"
            style="margin-top: 10px"
        >
            <el-tabs
                v-model="activeType"
                :before-leave="beforeLeave"
                @tab-click="getPrivateProcotol(activeType)"
            >
                <el-tab-pane
                    v-for="(item, index) in tabList"
                    :key="index"
                    :name="item['name'] + ''"
                    :label="item['label']"
                >
                    <template v-if="form['param950_' + activeType]">
                        <div class="configurations">
                            <div
                                v-if="
                                    deviceCapability['intelliDrive_sensor'][
                                        'eventDisplay'
                                    ][index]['enable'] &&
                                    deviceCapability['intelliDrive_sensor'][
                                        'eventDisplay'
                                    ][index]['enable'].length
                                "
                                class="configuration-item"
                            >
                                <el-form-item label="报警使能">
                                    <el-switch
                                        v-model="
                                            form['param950_' + activeType]
                                                .enable
                                        "
                                        :active-value="Number(1)"
                                        :inactive-value="Number(0)"
                                    ></el-switch>
                                </el-form-item>
                            </div>
                        </div>
                        <div class="splitTypes">
                            <div
                                class="splitButtons"
                                :style="{
                                    width: 100 / item['splitType'].length + '%',
                                }"
                                v-for="(item_, index_) in item['splitType']"
                                :key="index_"
                            >
                                <el-button
                                    @click="
                                        setPageList(activeType, item_, index_)
                                    "
                                    :type="
                                        form['param950_' + activeType][
                                            'splitType'
                                        ] == item_
                                            ? 'success'
                                            : 'default'
                                    "
                                    :radius="true"
                                    >{{ item_ }}分屏</el-button
                                >
                            </div>
                        </div>
                        <el-row
                            v-if="
                                form['param950_' + activeType]['splitType'] == 1
                            "
                            type="flex"
                            justify="space-between"
                        >
                            <el-col :span="5"> </el-col>
                            <el-col :span="12">
                                <el-popover
                                    placement="top"
                                    trigger="click"
                                    width="240"
                                >
                                    <el-select
                                        v-model="
                                            form['param950_' + activeType][
                                                'splitChanBinds'
                                            ][0]['chanNo']
                                        "
                                    >
                                        <el-option
                                            v-for="item_ in item['splitChans']"
                                            :key="item_"
                                            :label="'通道' + item_"
                                            :value="item_"
                                        >
                                        </el-option>
                                    </el-select>
                                    <el-form-item
                                        slot="reference"
                                        class="textCenter"
                                        label=""
                                    >
                                        <div class="channelShow1">
                                            {{
                                                "通道" +
                                                form["param950_" + activeType][
                                                    "splitChanBinds"
                                                ][0]["chanNo"]
                                            }}
                                        </div>
                                    </el-form-item>
                                </el-popover>
                            </el-col>
                            <el-col :span="5"> </el-col>
                        </el-row>
                        <el-row
                            v-else-if="
                                form['param950_' + activeType]['splitType'] == 2
                            "
                            type="flex"
                            justify="space-between"
                        >
                            <el-col :span="11">
                                <el-popover
                                    placement="top"
                                    trigger="click"
                                    width="240"
                                >
                                    <el-select
                                        v-model="
                                            form['param950_' + activeType][
                                                'splitChanBinds'
                                            ][0]['chanNo']
                                        "
                                    >
                                        <el-option
                                            v-for="item_ in item['splitChans']"
                                            :key="item_"
                                            :label="'通道' + item_"
                                            :value="item_"
                                        >
                                        </el-option>
                                    </el-select>
                                    <el-form-item
                                        slot="reference"
                                        class="textCenter"
                                        label=""
                                    >
                                        <div class="channelShow2">
                                            {{
                                                "通道" +
                                                form["param950_" + activeType][
                                                    "splitChanBinds"
                                                ][0]["chanNo"]
                                            }}
                                        </div>
                                    </el-form-item>
                                </el-popover>
                            </el-col>
                            <el-col :span="11">
                                <el-popover
                                    placement="top"
                                    trigger="click"
                                    width="240"
                                >
                                    <el-select
                                        v-model="
                                            form['param950_' + activeType][
                                                'splitChanBinds'
                                            ][1]['chanNo']
                                        "
                                    >
                                        <el-option
                                            v-for="item_ in item['splitChans']"
                                            :key="item_"
                                            :label="'通道' + item_"
                                            :value="item_"
                                        >
                                        </el-option>
                                    </el-select>
                                    <el-form-item
                                        slot="reference"
                                        class="textCenter"
                                        label=""
                                    >
                                        <div class="channelShow2">
                                            {{
                                                "通道" +
                                                form["param950_" + activeType][
                                                    "splitChanBinds"
                                                ][1]["chanNo"]
                                            }}
                                        </div>
                                    </el-form-item>
                                </el-popover>
                            </el-col>
                        </el-row>
                        <el-row
                            v-else-if="
                                form['param950_' + activeType]['splitType'] == 4
                            "
                            type="flex"
                            justify="space-between"
                        >
                            <el-col :span="11">
                                <el-popover
                                    placement="top"
                                    trigger="click"
                                    width="240"
                                >
                                    <el-select
                                        v-model="
                                            form['param950_' + activeType][
                                                'splitChanBinds'
                                            ][0]['chanNo']
                                        "
                                    >
                                        <el-option
                                            v-for="item_ in item['splitChans']"
                                            :key="item_"
                                            :label="'通道' + item_"
                                            :value="item_"
                                        >
                                        </el-option>
                                    </el-select>
                                    <el-form-item
                                        slot="reference"
                                        class="textCenter"
                                        label=""
                                    >
                                        <div class="channelShow4">
                                            {{
                                                "通道" +
                                                form["param950_" + activeType][
                                                    "splitChanBinds"
                                                ][0]["chanNo"]
                                            }}
                                        </div>
                                    </el-form-item>
                                </el-popover>
                                <el-popover
                                    placement="top"
                                    trigger="click"
                                    width="240"
                                >
                                    <el-select
                                        v-model="
                                            form['param950_' + activeType][
                                                'splitChanBinds'
                                            ][2]['chanNo']
                                        "
                                    >
                                        <el-option
                                            v-for="item_ in item['splitChans']"
                                            :key="item_"
                                            :label="'通道' + item_"
                                            :value="item_"
                                        >
                                        </el-option>
                                    </el-select>
                                    <el-form-item
                                        slot="reference"
                                        class="textCenter"
                                        label=""
                                    >
                                        <div class="channelShow4">
                                            {{
                                                "通道" +
                                                form["param950_" + activeType][
                                                    "splitChanBinds"
                                                ][2]["chanNo"]
                                            }}
                                        </div>
                                    </el-form-item>
                                </el-popover>
                            </el-col>
                            <el-col :span="11">
                                <el-popover
                                    placement="top"
                                    trigger="click"
                                    width="240"
                                >
                                    <el-select
                                        v-model="
                                            form['param950_' + activeType][
                                                'splitChanBinds'
                                            ][1]['chanNo']
                                        "
                                    >
                                        <el-option
                                            v-for="item_ in item['splitChans']"
                                            :key="item_"
                                            :label="'通道' + item_"
                                            :value="item_"
                                        >
                                        </el-option>
                                    </el-select>
                                    <el-form-item
                                        slot="reference"
                                        class="textCenter"
                                        label=""
                                    >
                                        <div class="channelShow4">
                                            {{
                                                "通道" +
                                                form["param950_" + activeType][
                                                    "splitChanBinds"
                                                ][1]["chanNo"]
                                            }}
                                        </div>
                                    </el-form-item>
                                </el-popover>
                                <el-popover
                                    placement="top"
                                    trigger="click"
                                    width="240"
                                >
                                    <el-select
                                        v-model="
                                            form['param950_' + activeType][
                                                'splitChanBinds'
                                            ][3]['chanNo']
                                        "
                                    >
                                        <el-option
                                            v-for="item_ in item['splitChans']"
                                            :key="item_"
                                            :label="'通道' + item_"
                                            :value="item_"
                                        >
                                        </el-option>
                                    </el-select>
                                    <el-form-item
                                        slot="reference"
                                        class="textCenter"
                                        label=""
                                    >
                                        <div class="channelShow4">
                                            {{
                                                "通道" +
                                                form["param950_" + activeType][
                                                    "splitChanBinds"
                                                ][3]["chanNo"]
                                            }}
                                        </div>
                                    </el-form-item>
                                </el-popover>
                            </el-col>
                        </el-row>
                        <el-row
                            v-else-if="
                                form['param950_' + activeType]['splitType'] == 6
                            "
                            type="flex"
                            justify="space-between"
                        >
                            <el-col :span="15">
                                <el-popover
                                    placement="top"
                                    trigger="click"
                                    width="240"
                                >
                                    <el-select
                                        v-model="
                                            form['param950_' + activeType][
                                                'splitChanBinds'
                                            ][0]['chanNo']
                                        "
                                    >
                                        <el-option
                                            v-for="item_ in item['splitChans']"
                                            :key="item_"
                                            :label="'通道' + item_"
                                            :value="item_"
                                        >
                                        </el-option>
                                    </el-select>
                                    <el-form-item
                                        slot="reference"
                                        class="textCenter"
                                        label=""
                                    >
                                        <div class="channelShow3">
                                            {{
                                                "通道" +
                                                form["param950_" + activeType][
                                                    "splitChanBinds"
                                                ][0]["chanNo"]
                                            }}
                                        </div>
                                    </el-form-item>
                                </el-popover>
                                <div
                                    class="contentBottom"
                                    type="flex"
                                    justify="space-between"
                                >
                                    <el-popover
                                        placement="top"
                                        trigger="click"
                                        width="240"
                                    >
                                        <el-select
                                            v-model="
                                                form['param950_' + activeType][
                                                    'splitChanBinds'
                                                ][5]['chanNo']
                                            "
                                        >
                                            <el-option
                                                v-for="item_ in item[
                                                    'splitChans'
                                                ]"
                                                :key="item_"
                                                :label="'通道' + item_"
                                                :value="item_"
                                            >
                                            </el-option>
                                        </el-select>
                                        <el-form-item
                                            slot="reference"
                                            class="textCenter"
                                            style="width: 48%; float: left"
                                            label=""
                                        >
                                            <div class="channelShow4">
                                                {{
                                                    "通道" +
                                                    form[
                                                        "param950_" + activeType
                                                    ]["splitChanBinds"][5][
                                                        "chanNo"
                                                    ]
                                                }}
                                            </div>
                                        </el-form-item>
                                    </el-popover>
                                    <el-popover
                                        placement="top"
                                        trigger="click"
                                        width="240"
                                    >
                                        <el-select
                                            v-model="
                                                form['param950_' + activeType][
                                                    'splitChanBinds'
                                                ][4]['chanNo']
                                            "
                                        >
                                            <el-option
                                                v-for="item_ in item[
                                                    'splitChans'
                                                ]"
                                                :key="item_"
                                                :label="'通道' + item_"
                                                :value="item_"
                                            >
                                            </el-option>
                                        </el-select>
                                        <el-form-item
                                            slot="reference"
                                            class="textCenter"
                                            style="width: 48%; float: right"
                                            label=""
                                        >
                                            <div class="channelShow4">
                                                {{
                                                    "通道" +
                                                    form[
                                                        "param950_" + activeType
                                                    ]["splitChanBinds"][4][
                                                        "chanNo"
                                                    ]
                                                }}
                                            </div>
                                        </el-form-item>
                                    </el-popover>
                                </div>
                            </el-col>
                            <el-col :span="7">
                                <el-popover
                                    placement="top"
                                    trigger="click"
                                    width="240"
                                >
                                    <el-select
                                        v-model="
                                            form['param950_' + activeType][
                                                'splitChanBinds'
                                            ][1]['chanNo']
                                        "
                                    >
                                        <el-option
                                            v-for="item_ in item['splitChans']"
                                            :key="item_"
                                            :label="'通道' + item_"
                                            :value="item_"
                                        >
                                        </el-option>
                                    </el-select>
                                    <el-form-item
                                        slot="reference"
                                        class="textCenter"
                                        label=""
                                    >
                                        <div class="channelShow4">
                                            {{
                                                "通道" +
                                                form["param950_" + activeType][
                                                    "splitChanBinds"
                                                ][1]["chanNo"]
                                            }}
                                        </div>
                                    </el-form-item>
                                </el-popover>
                                <el-popover
                                    placement="top"
                                    trigger="click"
                                    width="240"
                                >
                                    <el-select
                                        v-model="
                                            form['param950_' + activeType][
                                                'splitChanBinds'
                                            ][2]['chanNo']
                                        "
                                    >
                                        <el-option
                                            v-for="item_ in item['splitChans']"
                                            :key="item_"
                                            :label="'通道' + item_"
                                            :value="item_"
                                        >
                                        </el-option>
                                    </el-select>
                                    <el-form-item
                                        slot="reference"
                                        class="textCenter"
                                        label=""
                                    >
                                        <div class="channelShow4">
                                            {{
                                                "通道" +
                                                form["param950_" + activeType][
                                                    "splitChanBinds"
                                                ][2]["chanNo"]
                                            }}
                                        </div>
                                    </el-form-item>
                                </el-popover>
                                <el-popover
                                    placement="top"
                                    trigger="click"
                                    width="240"
                                >
                                    <el-select
                                        v-model="
                                            form['param950_' + activeType][
                                                'splitChanBinds'
                                            ][3]['chanNo']
                                        "
                                    >
                                        <el-option
                                            v-for="item_ in item['splitChans']"
                                            :key="item_"
                                            :label="'通道' + item_"
                                            :value="item_"
                                        >
                                        </el-option>
                                    </el-select>
                                    <el-form-item
                                        slot="reference"
                                        class="textCenter"
                                        label=""
                                    >
                                        <div class="channelShow4">
                                            {{
                                                "通道" +
                                                form["param950_" + activeType][
                                                    "splitChanBinds"
                                                ][3]["chanNo"]
                                            }}
                                        </div>
                                    </el-form-item>
                                </el-popover>
                            </el-col>
                        </el-row>
                        <el-row
                            v-else-if="
                                form['param950_' + activeType]['splitType'] == 9
                            "
                            type="flex"
                            justify="space-between"
                        >
                            <el-col :span="7">
                                <el-popover
                                    placement="top"
                                    trigger="click"
                                    width="240"
                                >
                                    <el-select
                                        v-model="
                                            form['param950_' + activeType][
                                                'splitChanBinds'
                                            ][0]['chanNo']
                                        "
                                    >
                                        <el-option
                                            v-for="item_ in item['splitChans']"
                                            :key="item_"
                                            :label="'通道' + item_"
                                            :value="item_"
                                        >
                                        </el-option>
                                    </el-select>
                                    <el-form-item
                                        slot="reference"
                                        class="textCenter"
                                        label=""
                                    >
                                        <div class="channelShow4">
                                            {{
                                                "通道" +
                                                form["param950_" + activeType][
                                                    "splitChanBinds"
                                                ][0]["chanNo"]
                                            }}
                                        </div>
                                    </el-form-item>
                                </el-popover>
                                <el-popover
                                    placement="top"
                                    trigger="click"
                                    width="240"
                                >
                                    <el-select
                                        v-model="
                                            form['param950_' + activeType][
                                                'splitChanBinds'
                                            ][3]['chanNo']
                                        "
                                    >
                                        <el-option
                                            v-for="item_ in item['splitChans']"
                                            :key="item_"
                                            :label="'通道' + item_"
                                            :value="item_"
                                        >
                                        </el-option>
                                    </el-select>
                                    <el-form-item
                                        slot="reference"
                                        class="textCenter"
                                        label=""
                                    >
                                        <div class="channelShow4">
                                            {{
                                                "通道" +
                                                form["param950_" + activeType][
                                                    "splitChanBinds"
                                                ][3]["chanNo"]
                                            }}
                                        </div>
                                    </el-form-item>
                                </el-popover>
                                <el-popover
                                    placement="top"
                                    trigger="click"
                                    width="240"
                                >
                                    <el-select
                                        v-model="
                                            form['param950_' + activeType][
                                                'splitChanBinds'
                                            ][6]['chanNo']
                                        "
                                    >
                                        <el-option
                                            v-for="item_ in item['splitChans']"
                                            :key="item_"
                                            :label="'通道' + item_"
                                            :value="item_"
                                        >
                                        </el-option>
                                    </el-select>
                                    <el-form-item
                                        slot="reference"
                                        class="textCenter"
                                        label=""
                                    >
                                        <div class="channelShow4">
                                            {{
                                                "通道" +
                                                form["param950_" + activeType][
                                                    "splitChanBinds"
                                                ][6]["chanNo"]
                                            }}
                                        </div>
                                    </el-form-item>
                                </el-popover>
                            </el-col>
                            <el-col :span="7">
                                <el-popover
                                    placement="top"
                                    trigger="click"
                                    width="240"
                                >
                                    <el-select
                                        v-model="
                                            form['param950_' + activeType][
                                                'splitChanBinds'
                                            ][1]['chanNo']
                                        "
                                    >
                                        <el-option
                                            v-for="item_ in item['splitChans']"
                                            :key="item_"
                                            :label="'通道' + item_"
                                            :value="item_"
                                        >
                                        </el-option>
                                    </el-select>
                                    <el-form-item
                                        slot="reference"
                                        class="textCenter"
                                        label=""
                                    >
                                        <div class="channelShow4">
                                            {{
                                                "通道" +
                                                form["param950_" + activeType][
                                                    "splitChanBinds"
                                                ][1]["chanNo"]
                                            }}
                                        </div>
                                    </el-form-item>
                                </el-popover>
                                <el-popover
                                    placement="top"
                                    trigger="click"
                                    width="240"
                                >
                                    <el-select
                                        v-model="
                                            form['param950_' + activeType][
                                                'splitChanBinds'
                                            ][4]['chanNo']
                                        "
                                    >
                                        <el-option
                                            v-for="item_ in item['splitChans']"
                                            :key="item_"
                                            :label="'通道' + item_"
                                            :value="item_"
                                        >
                                        </el-option>
                                    </el-select>
                                    <el-form-item
                                        slot="reference"
                                        class="textCenter"
                                        label=""
                                    >
                                        <div class="channelShow4">
                                            {{
                                                "通道" +
                                                form["param950_" + activeType][
                                                    "splitChanBinds"
                                                ][4]["chanNo"]
                                            }}
                                        </div>
                                    </el-form-item>
                                </el-popover>
                                <el-popover
                                    placement="top"
                                    trigger="click"
                                    width="240"
                                >
                                    <el-select
                                        v-model="
                                            form['param950_' + activeType][
                                                'splitChanBinds'
                                            ][7]['chanNo']
                                        "
                                    >
                                        <el-option
                                            v-for="item_ in item['splitChans']"
                                            :key="item_"
                                            :label="'通道' + item_"
                                            :value="item_"
                                        >
                                        </el-option>
                                    </el-select>
                                    <el-form-item
                                        slot="reference"
                                        class="textCenter"
                                        label=""
                                    >
                                        <div class="channelShow4">
                                            {{
                                                "通道" +
                                                form["param950_" + activeType][
                                                    "splitChanBinds"
                                                ][7]["chanNo"]
                                            }}
                                        </div>
                                    </el-form-item>
                                </el-popover>
                            </el-col>
                            <el-col :span="7">
                                <el-popover
                                    placement="top"
                                    trigger="click"
                                    width="240"
                                >
                                    <el-select
                                        v-model="
                                            form['param950_' + activeType][
                                                'splitChanBinds'
                                            ][2]['chanNo']
                                        "
                                    >
                                        <el-option
                                            v-for="item_ in item['splitChans']"
                                            :key="item_"
                                            :label="'通道' + item_"
                                            :value="item_"
                                        >
                                        </el-option>
                                    </el-select>
                                    <el-form-item
                                        slot="reference"
                                        class="textCenter"
                                        label=""
                                    >
                                        <div class="channelShow4">
                                            {{
                                                "通道" +
                                                form["param950_" + activeType][
                                                    "splitChanBinds"
                                                ][2]["chanNo"]
                                            }}
                                        </div>
                                    </el-form-item>
                                </el-popover>
                                <el-popover
                                    placement="top"
                                    trigger="click"
                                    width="240"
                                >
                                    <el-select
                                        v-model="
                                            form['param950_' + activeType][
                                                'splitChanBinds'
                                            ][5]['chanNo']
                                        "
                                    >
                                        <el-option
                                            v-for="item_ in item['splitChans']"
                                            :key="item_"
                                            :label="'通道' + item_"
                                            :value="item_"
                                        >
                                        </el-option>
                                    </el-select>
                                    <el-form-item
                                        slot="reference"
                                        class="textCenter"
                                        label=""
                                    >
                                        <div class="channelShow4">
                                            {{
                                                "通道" +
                                                form["param950_" + activeType][
                                                    "splitChanBinds"
                                                ][5]["chanNo"]
                                            }}
                                        </div>
                                    </el-form-item>
                                </el-popover>
                                <el-popover
                                    placement="top"
                                    trigger="click"
                                    width="240"
                                >
                                    <el-select
                                        v-model="
                                            form['param950_' + activeType][
                                                'splitChanBinds'
                                            ][8]['chanNo']
                                        "
                                    >
                                        <el-option
                                            v-for="item_ in item['splitChans']"
                                            :key="item_"
                                            :label="'通道' + item_"
                                            :value="item_"
                                        >
                                        </el-option>
                                    </el-select>
                                    <el-form-item
                                        slot="reference"
                                        class="textCenter"
                                        label=""
                                    >
                                        <div class="channelShow4">
                                            {{
                                                "通道" +
                                                form["param950_" + activeType][
                                                    "splitChanBinds"
                                                ][8]["chanNo"]
                                            }}
                                        </div>
                                    </el-form-item>
                                </el-popover>
                            </el-col>
                        </el-row>
                    </template>
                </el-tab-pane>
            </el-tabs>
        </el-form>
    </div>
</template>

<script>
import { validateNum } from "@/utils/validate";
export default {
    props: {
        allCapability: {
            type: Object,
            default: () => {
                return {};
            },
        },
        formDetail: {
            type: Object,
            default: () => {
                return {};
            },
        },
        originalForm: {
            type: Object,
            default: () => {
                return {};
            },
        },
        setStatisticsData: {
            type: Object,
            default: () => {
                return {};
            },
        },
        allEnumerationData: {
            type: Object,
            default: () => {
                return {};
            },
        },
        setConfigParams: {
            type: Boolean,
            default: false,
        },
        isTemplate: {
            type: String,
        },
    },
    watch: {
        allCapability: {
            handler(val) {
                if (val) {
                    console.log(val);
                    this.deviceCapability = val;
                    this.makeListMenu();
                    this.activeType = String(
                        val["intelliDrive_sensor"]["eventDisplay"][0]["type"]
                    );
                }
            },
            deep: true,
            immediate: true,
        },
        formDetail: {
            handler(val) {
                if (val) {
                    this.form = val;
                }
            },
            deep: true,
            immediate: true,
        },
        originalForm: {
            handler(val) {
                if (val) {
                    this.copyForm = val;
                }
            },
            deep: true,
            immediate: true,
        },
        form: {
            handler(val) {
                if (val) {
                    this.$emit("change", val);
                }
            },
            deep: true,
            immediate: true,
        },
        copyForm: {
            handler(val) {
                if (val) {
                    this.$emit("changeCopy", val);
                }
            },
            deep: true,
            immediate: false,
        },
        setStatisticsData: {
            handler(val) {
                if (val) {
                    this.formData = val;
                }
            },
            deep: true,
            immediate: true,
        },
        allEnumerationData: {
            handler(val) {
                if (val) {
                    this.dictionaryData = val;
                }
            },
            deep: true,
            immediate: true,
        },
        setConfigParams: {
            handler(val) {
                if (val) {
                    this.childConfigParams = val;
                    this.getPrivateProcotol(this.activeType);
                }
            },
            deep: true,
            immediate: true,
        },
        childConfigParams: {
            handler(val) {
                this.$emit("changeConfigParams", val);
            },
            deep: true,
            immediate: true,
        },
        "form.param950_1": {
            handler(val) {
                if (val && !Boolean(this.isTemplate)) {
                    if (
                        val["splitType"] ==
                        this.copyForm["param950_1"]["splitType"]
                    ) {
                        switch (val["splitType"]) {
                            case 1:
                                this.formData[
                                    "param950_1.splitChanBinds.0.chanNo.useless.useless.useless"
                                ] =
                                    val["splitChanBinds"][0]["chanNo"] !==
                                    this.copyForm["param950_1"][
                                        "splitChanBinds"
                                    ][0]["chanNo"]
                                        ? `param950_1.splitChanBinds.0.chanNo.useless.useless.useless&外设输出设置/视频输出设置/倒车/1分屏&通道${val["splitChanBinds"][0]["chanNo"]}&通道${this.copyForm["param950_1"]["splitChanBinds"][0]["chanNo"]}`
                                        : "";
                                break;
                            case 2:
                                let chanNo2 = false;
                                for (let i = 0; i < 2; i++) {
                                    if (
                                        val["splitChanBinds"][i]["chanNo"] !==
                                        this.copyForm["param950_1"][
                                            "splitChanBinds"
                                        ][i]["chanNo"]
                                    ) {
                                        chanNo2 = true;
                                    }
                                }
                                if (chanNo2) {
                                    this.formData["param950_1.splitChanBinds"] =
                                        chanNo2
                                            ? `param950_1.splitChanBinds&外设输出设置/视频输出设置/倒车/2分屏&通道${val["splitChanBinds"][0]["chanNo"]}、通道${val["splitChanBinds"][1]["chanNo"]}&通道${this.copyForm["param950_1"]["splitChanBinds"][0]["chanNo"]}、通道${this.copyForm["param950_1"]["splitChanBinds"][1]["chanNo"]}`
                                            : "";
                                }
                                break;
                            case 4:
                                let chanNo4 = false;
                                for (let i = 0; i < 4; i++) {
                                    if (
                                        val["splitChanBinds"][i]["chanNo"] !==
                                        this.copyForm["param950_1"][
                                            "splitChanBinds"
                                        ][i]["chanNo"]
                                    ) {
                                        chanNo4 = true;
                                    }
                                }
                                if (chanNo4) {
                                    this.formData["param950_1.splitChanBinds"] =
                                        chanNo4
                                            ? `param950_1.splitChanBinds&外设输出设置/视频输出设置/倒车/4分屏&通道${val["splitChanBinds"][0]["chanNo"]}、通道${val["splitChanBinds"][1]["chanNo"]}、通道${val["splitChanBinds"][2]["chanNo"]}、通道${val["splitChanBinds"][3]["chanNo"]}&通道${this.copyForm["param950_1"]["splitChanBinds"][0]["chanNo"]}、通道${this.copyForm["param950_1"]["splitChanBinds"][1]["chanNo"]}、通道${this.copyForm["param950_1"]["splitChanBinds"][2]["chanNo"]}、通道${this.copyForm["param950_1"]["splitChanBinds"][3]["chanNo"]}`
                                            : "";
                                }
                                break;
                            case 6:
                                let chanNo6 = false;
                                for (let i = 0; i < 6; i++) {
                                    if (
                                        val["splitChanBinds"][i]["chanNo"] !==
                                        this.copyForm["param950_1"][
                                            "splitChanBinds"
                                        ][i]["chanNo"]
                                    ) {
                                        chanNo6 = true;
                                    }
                                }
                                if (chanNo6) {
                                    this.formData["param950_1.splitChanBinds"] =
                                        chanNo6
                                            ? `param950_1.splitChanBinds&外设输出设置/视频输出设置/倒车/6分屏&通道${val["splitChanBinds"][0]["chanNo"]}、通道${val["splitChanBinds"][1]["chanNo"]}、通道${val["splitChanBinds"][2]["chanNo"]}、通道${val["splitChanBinds"][3]["chanNo"]}、通道${val["splitChanBinds"][4]["chanNo"]}、通道${val["splitChanBinds"][5]["chanNo"]}&通道${this.copyForm["param950_1"]["splitChanBinds"][0]["chanNo"]}、通道${this.copyForm["param950_1"]["splitChanBinds"][1]["chanNo"]}、通道${this.copyForm["param950_1"]["splitChanBinds"][2]["chanNo"]}、通道${this.copyForm["param950_1"]["splitChanBinds"][3]["chanNo"]}、通道${this.copyForm["param950_1"]["splitChanBinds"][4]["chanNo"]}、通道${this.copyForm["param950_1"]["splitChanBinds"][5]["chanNo"]}`
                                            : "";
                                }
                                break;
                            case 9:
                                let chanNo9 = false;
                                for (let i = 0; i < 9; i++) {
                                    if (
                                        val["splitChanBinds"][i]["chanNo"] !==
                                        this.copyForm["param950_1"][
                                            "splitChanBinds"
                                        ][i]["chanNo"]
                                    ) {
                                        chanNo9 = true;
                                    }
                                }
                                if (chanNo9) {
                                    this.formData["param950_1.splitChanBinds"] =
                                        chanNo6
                                            ? `param950_1.splitChanBinds&外设输出设置/视频输出设置/倒车/9分屏&通道${val["splitChanBinds"][0]["chanNo"]}、通道${val["splitChanBinds"][1]["chanNo"]}、通道${val["splitChanBinds"][2]["chanNo"]}、通道${val["splitChanBinds"][3]["chanNo"]}、通道${val["splitChanBinds"][4]["chanNo"]}、通道${val["splitChanBinds"][5]["chanNo"]}、通道${val["splitChanBinds"][6]["chanNo"]}、通道${val["splitChanBinds"][7]["chanNo"]}、通道${val["splitChanBinds"][8]["chanNo"]}&通道${this.copyForm["param950_1"]["splitChanBinds"][0]["chanNo"]}、通道${this.copyForm["param950_1"]["splitChanBinds"][1]["chanNo"]}、通道${this.copyForm["param950_1"]["splitChanBinds"][2]["chanNo"]}、通道${this.copyForm["param950_1"]["splitChanBinds"][3]["chanNo"]}、通道${this.copyForm["param950_1"]["splitChanBinds"][4]["chanNo"]}、通道${this.copyForm["param950_1"]["splitChanBinds"][5]["chanNo"]}、通道${this.copyForm["param950_1"]["splitChanBinds"][6]["chanNo"]}、通道${this.copyForm["param950_1"]["splitChanBinds"][7]["chanNo"]}、通道${this.copyForm["param950_1"]["splitChanBinds"][8]["chanNo"]}`
                                            : "";
                                }
                                break;
                        }
                    } else {
                        this.formData["param950_1.splitChanBinds"] =
                            val["splitType"] !=
                            this.copyForm["param950_1"]["splitType"]
                                ? `param950_1.splitChanBinds&外设输出设置/视频输出设置/倒车&${val["splitChanBinds"].length}分屏&${this.copyForm["param950_1"]["splitChanBinds"].length}分屏`
                                : "";
                    }
                    this.formData["param950_1.enable"] =
                        val["enable"] !== this.copyForm["param950_1"]["enable"]
                            ? `param950_1.enable&外设输出设置/视频输出设置/倒车&${
                                  val["enable"] ? "开启" : "关闭"
                              }&${
                                  this.copyForm["param950_1"]["enable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.$emit("formDataChange", this.formData);
                }
            },
            deep: true,
            immediate: true,
        },
        "form.param950_2": {
            handler(val) {
                if (val && !Boolean(this.isTemplate)) {
                    if (
                        val["splitType"] ==
                        this.copyForm["param950_2"]["splitType"]
                    ) {
                        switch (val["splitType"]) {
                            case 1:
                                this.formData[
                                    "param950_2.splitChanBinds.0.chanNo.useless.useless.useless"
                                ] =
                                    val["splitChanBinds"][0]["chanNo"] !==
                                    this.copyForm["param950_2"][
                                        "splitChanBinds"
                                    ][0]["chanNo"]
                                        ? `param950_2.splitChanBinds.0.chanNo.useless.useless.useless&外设输出设置/视频输出设置/IN1/1分屏&通道${val["splitChanBinds"][0]["chanNo"]}&通道${this.copyForm["param950_2"]["splitChanBinds"][0]["chanNo"]}`
                                        : "";
                                break;
                            case 2:
                                let chanNo2 = false;
                                for (let i = 0; i < 2; i++) {
                                    if (
                                        val["splitChanBinds"][i]["chanNo"] !==
                                        this.copyForm["param950_2"][
                                            "splitChanBinds"
                                        ][i]["chanNo"]
                                    ) {
                                        chanNo2 = true;
                                    }
                                }
                                if (chanNo2) {
                                    this.formData["param950_2.splitChanBinds"] =
                                        chanNo2
                                            ? `param950_2.splitChanBinds&外设输出设置/视频输出设置/IN1/2分屏&通道${val["splitChanBinds"][0]["chanNo"]}、通道${val["splitChanBinds"][1]["chanNo"]}&通道${this.copyForm["param950_2"]["splitChanBinds"][0]["chanNo"]}、通道${this.copyForm["param950_2"]["splitChanBinds"][1]["chanNo"]}`
                                            : "";
                                }
                                break;
                            case 4:
                                let chanNo4 = false;
                                for (let i = 0; i < 4; i++) {
                                    if (
                                        val["splitChanBinds"][i]["chanNo"] !==
                                        this.copyForm["param950_2"][
                                            "splitChanBinds"
                                        ][i]["chanNo"]
                                    ) {
                                        chanNo4 = true;
                                    }
                                }
                                if (chanNo4) {
                                    this.formData["param950_2.splitChanBinds"] =
                                        chanNo4
                                            ? `param950_2.splitChanBinds&外设输出设置/视频输出设置/IN1/4分屏&通道${val["splitChanBinds"][0]["chanNo"]}、通道${val["splitChanBinds"][1]["chanNo"]}、通道${val["splitChanBinds"][2]["chanNo"]}、通道${val["splitChanBinds"][3]["chanNo"]}&通道${this.copyForm["param950_2"]["splitChanBinds"][0]["chanNo"]}、通道${this.copyForm["param950_2"]["splitChanBinds"][1]["chanNo"]}、通道${this.copyForm["param950_2"]["splitChanBinds"][2]["chanNo"]}、通道${this.copyForm["param950_2"]["splitChanBinds"][3]["chanNo"]}`
                                            : "";
                                }
                                break;
                            case 6:
                                let chanNo6 = false;
                                for (let i = 0; i < 6; i++) {
                                    if (
                                        val["splitChanBinds"][i]["chanNo"] !==
                                        this.copyForm["param950_2"][
                                            "splitChanBinds"
                                        ][i]["chanNo"]
                                    ) {
                                        chanNo6 = true;
                                    }
                                }
                                if (chanNo6) {
                                    this.formData["param950_2.splitChanBinds"] =
                                        chanNo6
                                            ? `param950_2.splitChanBinds&外设输出设置/视频输出设置/IN1/6分屏&通道${val["splitChanBinds"][0]["chanNo"]}、通道${val["splitChanBinds"][1]["chanNo"]}、通道${val["splitChanBinds"][2]["chanNo"]}、通道${val["splitChanBinds"][3]["chanNo"]}、通道${val["splitChanBinds"][4]["chanNo"]}、通道${val["splitChanBinds"][5]["chanNo"]}&通道${this.copyForm["param950_2"]["splitChanBinds"][0]["chanNo"]}、通道${this.copyForm["param950_2"]["splitChanBinds"][1]["chanNo"]}、通道${this.copyForm["param950_2"]["splitChanBinds"][2]["chanNo"]}、通道${this.copyForm["param950_2"]["splitChanBinds"][3]["chanNo"]}、通道${this.copyForm["param950_2"]["splitChanBinds"][4]["chanNo"]}、通道${this.copyForm["param950_2"]["splitChanBinds"][5]["chanNo"]}`
                                            : "";
                                }
                                break;
                            case 9:
                                let chanNo9 = false;
                                for (let i = 0; i < 9; i++) {
                                    if (
                                        val["splitChanBinds"][i]["chanNo"] !==
                                        this.copyForm["param950_2"][
                                            "splitChanBinds"
                                        ][i]["chanNo"]
                                    ) {
                                        chanNo9 = true;
                                    }
                                }
                                if (chanNo9) {
                                    this.formData["param950_2.splitChanBinds"] =
                                        chanNo6
                                            ? `param950_2.splitChanBinds&外设输出设置/视频输出设置/IN1/9分屏&通道${val["splitChanBinds"][0]["chanNo"]}、通道${val["splitChanBinds"][1]["chanNo"]}、通道${val["splitChanBinds"][2]["chanNo"]}、通道${val["splitChanBinds"][3]["chanNo"]}、通道${val["splitChanBinds"][4]["chanNo"]}、通道${val["splitChanBinds"][5]["chanNo"]}、通道${val["splitChanBinds"][6]["chanNo"]}、通道${val["splitChanBinds"][7]["chanNo"]}、通道${val["splitChanBinds"][8]["chanNo"]}&通道${this.copyForm["param950_2"]["splitChanBinds"][0]["chanNo"]}、通道${this.copyForm["param950_2"]["splitChanBinds"][1]["chanNo"]}、通道${this.copyForm["param950_2"]["splitChanBinds"][2]["chanNo"]}、通道${this.copyForm["param950_2"]["splitChanBinds"][3]["chanNo"]}、通道${this.copyForm["param950_2"]["splitChanBinds"][4]["chanNo"]}、通道${this.copyForm["param950_2"]["splitChanBinds"][5]["chanNo"]}、通道${this.copyForm["param950_2"]["splitChanBinds"][6]["chanNo"]}、通道${this.copyForm["param950_2"]["splitChanBinds"][7]["chanNo"]}、通道${this.copyForm["param950_2"]["splitChanBinds"][8]["chanNo"]}`
                                            : "";
                                }
                                break;
                        }
                    } else {
                        this.formData["param950_2.splitChanBinds"] =
                            val["splitType"] !=
                            this.copyForm["param950_2"]["splitType"]
                                ? `param950_2.splitChanBinds&外设输出设置/视频输出设置/IN1&${val["splitChanBinds"].length}分屏&${this.copyForm["param950_2"]["splitChanBinds"].length}分屏`
                                : "";
                    }
                    this.formData["param950_2.enable"] =
                        val["enable"] !== this.copyForm["param950_2"]["enable"]
                            ? `param950_2.enable&外设输出设置/视频输出设置/IN1&${
                                  val["enable"] ? "开启" : "关闭"
                              }&${
                                  this.copyForm["param950_2"]["enable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.$emit("formDataChange", this.formData);
                }
            },
            deep: true,
            immediate: true,
        },
        "form.param950_3": {
            handler(val) {
                if (val && !Boolean(this.isTemplate)) {
                    if (
                        val["splitType"] ==
                        this.copyForm["param950_3"]["splitType"]
                    ) {
                        switch (val["splitType"]) {
                            case 1:
                                this.formData[
                                    "param950_3.splitChanBinds.0.chanNo.useless.useless.useless"
                                ] =
                                    val["splitChanBinds"][0]["chanNo"] !==
                                    this.copyForm["param950_3"][
                                        "splitChanBinds"
                                    ][0]["chanNo"]
                                        ? `param950_3.splitChanBinds.0.chanNo.useless.useless.useless&外设输出设置/视频输出设置/左BSD/1分屏&通道${val["splitChanBinds"][0]["chanNo"]}&通道${this.copyForm["param950_3"]["splitChanBinds"][0]["chanNo"]}`
                                        : "";
                                break;
                            case 2:
                                let chanNo2 = false;
                                for (let i = 0; i < 2; i++) {
                                    if (
                                        val["splitChanBinds"][i]["chanNo"] !==
                                        this.copyForm["param950_3"][
                                            "splitChanBinds"
                                        ][i]["chanNo"]
                                    ) {
                                        chanNo2 = true;
                                    }
                                }
                                if (chanNo2) {
                                    this.formData["param950_3.splitChanBinds"] =
                                        chanNo2
                                            ? `param950_3.splitChanBinds&外设输出设置/视频输出设置/左BSD/2分屏&通道${val["splitChanBinds"][0]["chanNo"]}、通道${val["splitChanBinds"][1]["chanNo"]}&通道${this.copyForm["param950_3"]["splitChanBinds"][0]["chanNo"]}、通道${this.copyForm["param950_3"]["splitChanBinds"][1]["chanNo"]}`
                                            : "";
                                }
                                break;
                            case 4:
                                let chanNo4 = false;
                                for (let i = 0; i < 4; i++) {
                                    if (
                                        val["splitChanBinds"][i]["chanNo"] !==
                                        this.copyForm["param950_3"][
                                            "splitChanBinds"
                                        ][i]["chanNo"]
                                    ) {
                                        chanNo4 = true;
                                    }
                                }
                                if (chanNo4) {
                                    this.formData["param950_3.splitChanBinds"] =
                                        chanNo4
                                            ? `param950_3.splitChanBinds&外设输出设置/视频输出设置/左BSD/4分屏&通道${val["splitChanBinds"][0]["chanNo"]}、通道${val["splitChanBinds"][1]["chanNo"]}、通道${val["splitChanBinds"][2]["chanNo"]}、通道${val["splitChanBinds"][3]["chanNo"]}&通道${this.copyForm["param950_3"]["splitChanBinds"][0]["chanNo"]}、通道${this.copyForm["param950_3"]["splitChanBinds"][1]["chanNo"]}、通道${this.copyForm["param950_3"]["splitChanBinds"][2]["chanNo"]}、通道${this.copyForm["param950_3"]["splitChanBinds"][3]["chanNo"]}`
                                            : "";
                                }
                                break;
                            case 6:
                                let chanNo6 = false;
                                for (let i = 0; i < 6; i++) {
                                    if (
                                        val["splitChanBinds"][i]["chanNo"] !==
                                        this.copyForm["param950_3"][
                                            "splitChanBinds"
                                        ][i]["chanNo"]
                                    ) {
                                        chanNo6 = true;
                                    }
                                }
                                if (chanNo6) {
                                    this.formData["param950_3.splitChanBinds"] =
                                        chanNo6
                                            ? `param950_3.splitChanBinds&外设输出设置/视频输出设置/左BSD/6分屏&通道${val["splitChanBinds"][0]["chanNo"]}、通道${val["splitChanBinds"][1]["chanNo"]}、通道${val["splitChanBinds"][2]["chanNo"]}、通道${val["splitChanBinds"][3]["chanNo"]}、通道${val["splitChanBinds"][4]["chanNo"]}、通道${val["splitChanBinds"][5]["chanNo"]}&通道${this.copyForm["param950_3"]["splitChanBinds"][0]["chanNo"]}、通道${this.copyForm["param950_3"]["splitChanBinds"][1]["chanNo"]}、通道${this.copyForm["param950_3"]["splitChanBinds"][2]["chanNo"]}、通道${this.copyForm["param950_3"]["splitChanBinds"][3]["chanNo"]}、通道${this.copyForm["param950_3"]["splitChanBinds"][4]["chanNo"]}、通道${this.copyForm["param950_3"]["splitChanBinds"][5]["chanNo"]}`
                                            : "";
                                }
                                break;
                            case 9:
                                let chanNo9 = false;
                                for (let i = 0; i < 9; i++) {
                                    if (
                                        val["splitChanBinds"][i]["chanNo"] !==
                                        this.copyForm["param950_3"][
                                            "splitChanBinds"
                                        ][i]["chanNo"]
                                    ) {
                                        chanNo9 = true;
                                    }
                                }
                                if (chanNo9) {
                                    this.formData["param950_3.splitChanBinds"] =
                                        chanNo6
                                            ? `param950_3.splitChanBinds&外设输出设置/视频输出设置/左BSD/9分屏&通道${val["splitChanBinds"][0]["chanNo"]}、通道${val["splitChanBinds"][1]["chanNo"]}、通道${val["splitChanBinds"][2]["chanNo"]}、通道${val["splitChanBinds"][3]["chanNo"]}、通道${val["splitChanBinds"][4]["chanNo"]}、通道${val["splitChanBinds"][5]["chanNo"]}、通道${val["splitChanBinds"][6]["chanNo"]}、通道${val["splitChanBinds"][7]["chanNo"]}、通道${val["splitChanBinds"][8]["chanNo"]}&通道${this.copyForm["param950_3"]["splitChanBinds"][0]["chanNo"]}、通道${this.copyForm["param950_3"]["splitChanBinds"][1]["chanNo"]}、通道${this.copyForm["param950_3"]["splitChanBinds"][2]["chanNo"]}、通道${this.copyForm["param950_3"]["splitChanBinds"][3]["chanNo"]}、通道${this.copyForm["param950_3"]["splitChanBinds"][4]["chanNo"]}、通道${this.copyForm["param950_3"]["splitChanBinds"][5]["chanNo"]}、通道${this.copyForm["param950_3"]["splitChanBinds"][6]["chanNo"]}、通道${this.copyForm["param950_3"]["splitChanBinds"][7]["chanNo"]}、通道${this.copyForm["param950_3"]["splitChanBinds"][8]["chanNo"]}`
                                            : "";
                                }
                                break;
                        }
                    } else {
                        this.formData["param950_3.splitChanBinds"] =
                            val["splitType"] !=
                            this.copyForm["param950_3"]["splitType"]
                                ? `param950_3.splitChanBinds&外设输出设置/视频输出设置/左BSD&${val["splitChanBinds"].length}分屏&${this.copyForm["param950_3"]["splitChanBinds"].length}分屏`
                                : "";
                    }
                    this.formData["param950_3.enable"] =
                        val["enable"] !== this.copyForm["param950_3"]["enable"]
                            ? `param950_3.enable&外设输出设置/视频输出设置/左BSD&${
                                  val["enable"] ? "开启" : "关闭"
                              }&${
                                  this.copyForm["param950_3"]["enable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.$emit("formDataChange", this.formData);
                }
            },
            deep: true,
            immediate: true,
        },
        "form.param950_4": {
            handler(val) {
                if (val && !Boolean(this.isTemplate)) {
                    if (
                        val["splitType"] ==
                        this.copyForm["param950_4"]["splitType"]
                    ) {
                        switch (val["splitType"]) {
                            case 1:
                                this.formData[
                                    "param950_4.splitChanBinds.0.chanNo.useless.useless.useless"
                                ] =
                                    val["splitChanBinds"][0]["chanNo"] !==
                                    this.copyForm["param950_4"][
                                        "splitChanBinds"
                                    ][0]["chanNo"]
                                        ? `param950_4.splitChanBinds.0.chanNo.useless.useless.useless&外设输出设置/视频输出设置/右BSD/1分屏&通道${val["splitChanBinds"][0]["chanNo"]}&通道${this.copyForm["param950_4"]["splitChanBinds"][0]["chanNo"]}`
                                        : "";
                                break;
                            case 2:
                                let chanNo2 = false;
                                for (let i = 0; i < 2; i++) {
                                    if (
                                        val["splitChanBinds"][i]["chanNo"] !==
                                        this.copyForm["param950_4"][
                                            "splitChanBinds"
                                        ][i]["chanNo"]
                                    ) {
                                        chanNo2 = true;
                                    }
                                }
                                if (chanNo2) {
                                    this.formData["param950_4.splitChanBinds"] =
                                        chanNo2
                                            ? `param950_4.splitChanBinds&外设输出设置/视频输出设置/右BSD/2分屏&通道${val["splitChanBinds"][0]["chanNo"]}、通道${val["splitChanBinds"][1]["chanNo"]}&通道${this.copyForm["param950_4"]["splitChanBinds"][0]["chanNo"]}、通道${this.copyForm["param950_4"]["splitChanBinds"][1]["chanNo"]}`
                                            : "";
                                }
                                break;
                            case 4:
                                let chanNo4 = false;
                                for (let i = 0; i < 4; i++) {
                                    if (
                                        val["splitChanBinds"][i]["chanNo"] !==
                                        this.copyForm["param950_4"][
                                            "splitChanBinds"
                                        ][i]["chanNo"]
                                    ) {
                                        chanNo4 = true;
                                    }
                                }
                                if (chanNo4) {
                                    this.formData["param950_4.splitChanBinds"] =
                                        chanNo4
                                            ? `param950_4.splitChanBinds&外设输出设置/视频输出设置/右BSD/4分屏&通道${val["splitChanBinds"][0]["chanNo"]}、通道${val["splitChanBinds"][1]["chanNo"]}、通道${val["splitChanBinds"][2]["chanNo"]}、通道${val["splitChanBinds"][3]["chanNo"]}&通道${this.copyForm["param950_4"]["splitChanBinds"][0]["chanNo"]}、通道${this.copyForm["param950_4"]["splitChanBinds"][1]["chanNo"]}、通道${this.copyForm["param950_4"]["splitChanBinds"][2]["chanNo"]}、通道${this.copyForm["param950_4"]["splitChanBinds"][3]["chanNo"]}`
                                            : "";
                                }
                                break;
                            case 6:
                                let chanNo6 = false;
                                for (let i = 0; i < 6; i++) {
                                    if (
                                        val["splitChanBinds"][i]["chanNo"] !==
                                        this.copyForm["param950_4"][
                                            "splitChanBinds"
                                        ][i]["chanNo"]
                                    ) {
                                        chanNo6 = true;
                                    }
                                }
                                if (chanNo6) {
                                    this.formData["param950_4.splitChanBinds"] =
                                        chanNo6
                                            ? `param950_4.splitChanBinds&外设输出设置/视频输出设置/右BSD/6分屏&通道${val["splitChanBinds"][0]["chanNo"]}、通道${val["splitChanBinds"][1]["chanNo"]}、通道${val["splitChanBinds"][2]["chanNo"]}、通道${val["splitChanBinds"][3]["chanNo"]}、通道${val["splitChanBinds"][4]["chanNo"]}、通道${val["splitChanBinds"][5]["chanNo"]}&通道${this.copyForm["param950_4"]["splitChanBinds"][0]["chanNo"]}、通道${this.copyForm["param950_4"]["splitChanBinds"][1]["chanNo"]}、通道${this.copyForm["param950_4"]["splitChanBinds"][2]["chanNo"]}、通道${this.copyForm["param950_4"]["splitChanBinds"][3]["chanNo"]}、通道${this.copyForm["param950_4"]["splitChanBinds"][4]["chanNo"]}、通道${this.copyForm["param950_4"]["splitChanBinds"][5]["chanNo"]}`
                                            : "";
                                }
                                break;
                            case 9:
                                let chanNo9 = false;
                                for (let i = 0; i < 9; i++) {
                                    if (
                                        val["splitChanBinds"][i]["chanNo"] !==
                                        this.copyForm["param950_4"][
                                            "splitChanBinds"
                                        ][i]["chanNo"]
                                    ) {
                                        chanNo9 = true;
                                    }
                                }
                                if (chanNo9) {
                                    this.formData["param950_4.splitChanBinds"] =
                                        chanNo6
                                            ? `param950_4.splitChanBinds&外设输出设置/视频输出设置/右BSD/9分屏&通道${val["splitChanBinds"][0]["chanNo"]}、通道${val["splitChanBinds"][1]["chanNo"]}、通道${val["splitChanBinds"][2]["chanNo"]}、通道${val["splitChanBinds"][3]["chanNo"]}、通道${val["splitChanBinds"][4]["chanNo"]}、通道${val["splitChanBinds"][5]["chanNo"]}、通道${val["splitChanBinds"][6]["chanNo"]}、通道${val["splitChanBinds"][7]["chanNo"]}、通道${val["splitChanBinds"][8]["chanNo"]}&通道${this.copyForm["param950_4"]["splitChanBinds"][0]["chanNo"]}、通道${this.copyForm["param950_4"]["splitChanBinds"][1]["chanNo"]}、通道${this.copyForm["param950_4"]["splitChanBinds"][2]["chanNo"]}、通道${this.copyForm["param950_4"]["splitChanBinds"][3]["chanNo"]}、通道${this.copyForm["param950_4"]["splitChanBinds"][4]["chanNo"]}、通道${this.copyForm["param950_4"]["splitChanBinds"][5]["chanNo"]}、通道${this.copyForm["param950_4"]["splitChanBinds"][6]["chanNo"]}、通道${this.copyForm["param950_4"]["splitChanBinds"][7]["chanNo"]}、通道${this.copyForm["param950_4"]["splitChanBinds"][8]["chanNo"]}`
                                            : "";
                                }
                                break;
                        }
                    } else {
                        this.formData["param950_4.splitChanBinds"] =
                            val["splitType"] !=
                            this.copyForm["param950_4"]["splitType"]
                                ? `param950_4.splitChanBinds&外设输出设置/视频输出设置/右BSD&${val["splitChanBinds"].length}分屏&${this.copyForm["param950_4"]["splitChanBinds"].length}分屏`
                                : "";
                    }
                    this.formData["param950_4.enable"] =
                        val["enable"] !== this.copyForm["param950_4"]["enable"]
                            ? `param950_4.enable&外设输出设置/视频输出设置/右BSD&${
                                  val["enable"] ? "开启" : "关闭"
                              }&${
                                  this.copyForm["param950_4"]["enable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.$emit("formDataChange", this.formData);
                }
            },
            deep: true,
            immediate: true,
        },
        "form.param950_5": {
            handler(val) {
                if (val && !Boolean(this.isTemplate)) {
                    if (
                        val["splitType"] ==
                        this.copyForm["param950_5"]["splitType"]
                    ) {
                        switch (val["splitType"]) {
                            case 1:
                                this.formData[
                                    "param950_5.splitChanBinds.0.chanNo.useless.useless.useless"
                                ] =
                                    val["splitChanBinds"][0]["chanNo"] !==
                                    this.copyForm["param950_5"][
                                        "splitChanBinds"
                                    ][0]["chanNo"]
                                        ? `param950_5.splitChanBinds.0.chanNo.useless.useless.useless&外设输出设置/视频输出设置/左转/1分屏&通道${val["splitChanBinds"][0]["chanNo"]}&通道${this.copyForm["param950_5"]["splitChanBinds"][0]["chanNo"]}`
                                        : "";
                                break;
                            case 2:
                                let chanNo2 = false;
                                for (let i = 0; i < 2; i++) {
                                    if (
                                        val["splitChanBinds"][i]["chanNo"] !==
                                        this.copyForm["param950_5"][
                                            "splitChanBinds"
                                        ][i]["chanNo"]
                                    ) {
                                        chanNo2 = true;
                                    }
                                }
                                if (chanNo2) {
                                    this.formData["param950_5.splitChanBinds"] =
                                        chanNo2
                                            ? `param950_5.splitChanBinds&外设输出设置/视频输出设置/左转/2分屏&通道${val["splitChanBinds"][0]["chanNo"]}、通道${val["splitChanBinds"][1]["chanNo"]}&通道${this.copyForm["param950_5"]["splitChanBinds"][0]["chanNo"]}、通道${this.copyForm["param950_5"]["splitChanBinds"][1]["chanNo"]}`
                                            : "";
                                }
                                break;
                            case 4:
                                let chanNo4 = false;
                                for (let i = 0; i < 4; i++) {
                                    if (
                                        val["splitChanBinds"][i]["chanNo"] !==
                                        this.copyForm["param950_5"][
                                            "splitChanBinds"
                                        ][i]["chanNo"]
                                    ) {
                                        chanNo4 = true;
                                    }
                                }
                                if (chanNo4) {
                                    this.formData["param950_5.splitChanBinds"] =
                                        chanNo4
                                            ? `param950_5.splitChanBinds&外设输出设置/视频输出设置/左转/4分屏&通道${val["splitChanBinds"][0]["chanNo"]}、通道${val["splitChanBinds"][1]["chanNo"]}、通道${val["splitChanBinds"][2]["chanNo"]}、通道${val["splitChanBinds"][3]["chanNo"]}&通道${this.copyForm["param950_5"]["splitChanBinds"][0]["chanNo"]}、通道${this.copyForm["param950_5"]["splitChanBinds"][1]["chanNo"]}、通道${this.copyForm["param950_5"]["splitChanBinds"][2]["chanNo"]}、通道${this.copyForm["param950_5"]["splitChanBinds"][3]["chanNo"]}`
                                            : "";
                                }
                                break;
                            case 6:
                                let chanNo6 = false;
                                for (let i = 0; i < 6; i++) {
                                    if (
                                        val["splitChanBinds"][i]["chanNo"] !==
                                        this.copyForm["param950_5"][
                                            "splitChanBinds"
                                        ][i]["chanNo"]
                                    ) {
                                        chanNo6 = true;
                                    }
                                }
                                if (chanNo6) {
                                    this.formData["param950_5.splitChanBinds"] =
                                        chanNo6
                                            ? `param950_5.splitChanBinds&外设输出设置/视频输出设置/左转/6分屏&通道${val["splitChanBinds"][0]["chanNo"]}、通道${val["splitChanBinds"][1]["chanNo"]}、通道${val["splitChanBinds"][2]["chanNo"]}、通道${val["splitChanBinds"][3]["chanNo"]}、通道${val["splitChanBinds"][4]["chanNo"]}、通道${val["splitChanBinds"][5]["chanNo"]}&通道${this.copyForm["param950_5"]["splitChanBinds"][0]["chanNo"]}、通道${this.copyForm["param950_5"]["splitChanBinds"][1]["chanNo"]}、通道${this.copyForm["param950_5"]["splitChanBinds"][2]["chanNo"]}、通道${this.copyForm["param950_5"]["splitChanBinds"][3]["chanNo"]}、通道${this.copyForm["param950_5"]["splitChanBinds"][4]["chanNo"]}、通道${this.copyForm["param950_5"]["splitChanBinds"][5]["chanNo"]}`
                                            : "";
                                }
                                break;
                            case 9:
                                let chanNo9 = false;
                                for (let i = 0; i < 9; i++) {
                                    if (
                                        val["splitChanBinds"][i]["chanNo"] !==
                                        this.copyForm["param950_5"][
                                            "splitChanBinds"
                                        ][i]["chanNo"]
                                    ) {
                                        chanNo9 = true;
                                    }
                                }
                                if (chanNo9) {
                                    this.formData["param950_5.splitChanBinds"] =
                                        chanNo6
                                            ? `param950_5.splitChanBinds&外设输出设置/视频输出设置/左转/9分屏&通道${val["splitChanBinds"][0]["chanNo"]}、通道${val["splitChanBinds"][1]["chanNo"]}、通道${val["splitChanBinds"][2]["chanNo"]}、通道${val["splitChanBinds"][3]["chanNo"]}、通道${val["splitChanBinds"][4]["chanNo"]}、通道${val["splitChanBinds"][5]["chanNo"]}、通道${val["splitChanBinds"][6]["chanNo"]}、通道${val["splitChanBinds"][7]["chanNo"]}、通道${val["splitChanBinds"][8]["chanNo"]}&通道${this.copyForm["param950_5"]["splitChanBinds"][0]["chanNo"]}、通道${this.copyForm["param950_5"]["splitChanBinds"][1]["chanNo"]}、通道${this.copyForm["param950_5"]["splitChanBinds"][2]["chanNo"]}、通道${this.copyForm["param950_5"]["splitChanBinds"][3]["chanNo"]}、通道${this.copyForm["param950_5"]["splitChanBinds"][4]["chanNo"]}、通道${this.copyForm["param950_5"]["splitChanBinds"][5]["chanNo"]}、通道${this.copyForm["param950_5"]["splitChanBinds"][6]["chanNo"]}、通道${this.copyForm["param950_5"]["splitChanBinds"][7]["chanNo"]}、通道${this.copyForm["param950_5"]["splitChanBinds"][8]["chanNo"]}`
                                            : "";
                                }
                                break;
                        }
                    } else {
                        this.formData["param950_5.splitChanBinds"] =
                            val["splitType"] !=
                            this.copyForm["param950_5"]["splitType"]
                                ? `param950_5.splitChanBinds&外设输出设置/视频输出设置/左转&${val["splitChanBinds"].length}分屏&${this.copyForm["param950_5"]["splitChanBinds"].length}分屏`
                                : "";
                    }
                    this.formData["param950_5.enable"] =
                        val["enable"] !== this.copyForm["param950_5"]["enable"]
                            ? `param950_5.enable&外设输出设置/视频输出设置/左转&${
                                  val["enable"] ? "开启" : "关闭"
                              }&${
                                  this.copyForm["param950_5"]["enable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.$emit("formDataChange", this.formData);
                }
            },
            deep: true,
            immediate: true,
        },
        "form.param950_6": {
            handler(val) {
                if (val && !Boolean(this.isTemplate)) {
                    if (
                        val["splitType"] ==
                        this.copyForm["param950_6"]["splitType"]
                    ) {
                        switch (val["splitType"]) {
                            case 1:
                                this.formData[
                                    "param950_6.splitChanBinds.0.chanNo.useless.useless.useless"
                                ] =
                                    val["splitChanBinds"][0]["chanNo"] !==
                                    this.copyForm["param950_6"][
                                        "splitChanBinds"
                                    ][0]["chanNo"]
                                        ? `param950_6.splitChanBinds.0.chanNo.useless.useless.useless&外设输出设置/视频输出设置/右转/1分屏&通道${val["splitChanBinds"][0]["chanNo"]}&通道${this.copyForm["param950_6"]["splitChanBinds"][0]["chanNo"]}`
                                        : "";
                                break;
                            case 2:
                                let chanNo2 = false;
                                for (let i = 0; i < 2; i++) {
                                    if (
                                        val["splitChanBinds"][i]["chanNo"] !==
                                        this.copyForm["param950_6"][
                                            "splitChanBinds"
                                        ][i]["chanNo"]
                                    ) {
                                        chanNo2 = true;
                                    }
                                }
                                if (chanNo2) {
                                    this.formData["param950_6.splitChanBinds"] =
                                        chanNo2
                                            ? `param950_6.splitChanBinds&外设输出设置/视频输出设置/右转/2分屏&通道${val["splitChanBinds"][0]["chanNo"]}、通道${val["splitChanBinds"][1]["chanNo"]}&通道${this.copyForm["param950_6"]["splitChanBinds"][0]["chanNo"]}、通道${this.copyForm["param950_6"]["splitChanBinds"][1]["chanNo"]}`
                                            : "";
                                }
                                break;
                            case 4:
                                let chanNo4 = false;
                                for (let i = 0; i < 4; i++) {
                                    if (
                                        val["splitChanBinds"][i]["chanNo"] !==
                                        this.copyForm["param950_6"][
                                            "splitChanBinds"
                                        ][i]["chanNo"]
                                    ) {
                                        chanNo4 = true;
                                    }
                                }
                                if (chanNo4) {
                                    this.formData["param950_6.splitChanBinds"] =
                                        chanNo4
                                            ? `param950_6.splitChanBinds&外设输出设置/视频输出设置/右转/4分屏&通道${val["splitChanBinds"][0]["chanNo"]}、通道${val["splitChanBinds"][1]["chanNo"]}、通道${val["splitChanBinds"][2]["chanNo"]}、通道${val["splitChanBinds"][3]["chanNo"]}&通道${this.copyForm["param950_6"]["splitChanBinds"][0]["chanNo"]}、通道${this.copyForm["param950_6"]["splitChanBinds"][1]["chanNo"]}、通道${this.copyForm["param950_6"]["splitChanBinds"][2]["chanNo"]}、通道${this.copyForm["param950_6"]["splitChanBinds"][3]["chanNo"]}`
                                            : "";
                                }
                                break;
                            case 6:
                                let chanNo6 = false;
                                for (let i = 0; i < 6; i++) {
                                    if (
                                        val["splitChanBinds"][i]["chanNo"] !==
                                        this.copyForm["param950_6"][
                                            "splitChanBinds"
                                        ][i]["chanNo"]
                                    ) {
                                        chanNo6 = true;
                                    }
                                }
                                if (chanNo6) {
                                    this.formData["param950_6.splitChanBinds"] =
                                        chanNo6
                                            ? `param950_6.splitChanBinds&外设输出设置/视频输出设置/右转/6分屏&通道${val["splitChanBinds"][0]["chanNo"]}、通道${val["splitChanBinds"][1]["chanNo"]}、通道${val["splitChanBinds"][2]["chanNo"]}、通道${val["splitChanBinds"][3]["chanNo"]}、通道${val["splitChanBinds"][4]["chanNo"]}、通道${val["splitChanBinds"][5]["chanNo"]}&通道${this.copyForm["param950_6"]["splitChanBinds"][0]["chanNo"]}、通道${this.copyForm["param950_6"]["splitChanBinds"][1]["chanNo"]}、通道${this.copyForm["param950_6"]["splitChanBinds"][2]["chanNo"]}、通道${this.copyForm["param950_6"]["splitChanBinds"][3]["chanNo"]}、通道${this.copyForm["param950_6"]["splitChanBinds"][4]["chanNo"]}、通道${this.copyForm["param950_6"]["splitChanBinds"][5]["chanNo"]}`
                                            : "";
                                }
                                break;
                            case 9:
                                let chanNo9 = false;
                                for (let i = 0; i < 9; i++) {
                                    if (
                                        val["splitChanBinds"][i]["chanNo"] !==
                                        this.copyForm["param950_6"][
                                            "splitChanBinds"
                                        ][i]["chanNo"]
                                    ) {
                                        chanNo9 = true;
                                    }
                                }
                                if (chanNo9) {
                                    this.formData["param950_6.splitChanBinds"] =
                                        chanNo6
                                            ? `param950_6.splitChanBinds&外设输出设置/视频输出设置/右转/9分屏&通道${val["splitChanBinds"][0]["chanNo"]}、通道${val["splitChanBinds"][1]["chanNo"]}、通道${val["splitChanBinds"][2]["chanNo"]}、通道${val["splitChanBinds"][3]["chanNo"]}、通道${val["splitChanBinds"][4]["chanNo"]}、通道${val["splitChanBinds"][5]["chanNo"]}、通道${val["splitChanBinds"][6]["chanNo"]}、通道${val["splitChanBinds"][7]["chanNo"]}、通道${val["splitChanBinds"][8]["chanNo"]}&通道${this.copyForm["param950_6"]["splitChanBinds"][0]["chanNo"]}、通道${this.copyForm["param950_6"]["splitChanBinds"][1]["chanNo"]}、通道${this.copyForm["param950_6"]["splitChanBinds"][2]["chanNo"]}、通道${this.copyForm["param950_6"]["splitChanBinds"][3]["chanNo"]}、通道${this.copyForm["param950_6"]["splitChanBinds"][4]["chanNo"]}、通道${this.copyForm["param950_6"]["splitChanBinds"][5]["chanNo"]}、通道${this.copyForm["param950_6"]["splitChanBinds"][6]["chanNo"]}、通道${this.copyForm["param950_6"]["splitChanBinds"][7]["chanNo"]}、通道${this.copyForm["param950_6"]["splitChanBinds"][8]["chanNo"]}`
                                            : "";
                                }
                                break;
                        }
                    } else {
                        this.formData["param950_6.splitChanBinds"] =
                            val["splitType"] !=
                            this.copyForm["param950_6"]["splitType"]
                                ? `param950_6.splitChanBinds&外设输出设置/视频输出设置/右转&${val["splitChanBinds"].length}分屏&${this.copyForm["param950_6"]["splitChanBinds"].length}分屏`
                                : "";
                    }
                    this.formData["param950_6.enable"] =
                        val["enable"] !== this.copyForm["param950_6"]["enable"]
                            ? `param950_6.enable&外设输出设置/视频输出设置/右转&${
                                  val["enable"] ? "开启" : "关闭"
                              }&${
                                  this.copyForm["param950_6"]["enable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.$emit("formDataChange", this.formData);
                }
            },
            deep: true,
            immediate: true,
        },
        "form.param950_7": {
            handler(val) {
                if (val && !Boolean(this.isTemplate)) {
                    if (
                        val["splitType"] ==
                        this.copyForm["param950_7"]["splitType"]
                    ) {
                        switch (val["splitType"]) {
                            case 1:
                                this.formData[
                                    "param950_7.splitChanBinds.0.chanNo.useless.useless.useless"
                                ] =
                                    val["splitChanBinds"][0]["chanNo"] !==
                                    this.copyForm["param950_7"][
                                        "splitChanBinds"
                                    ][0]["chanNo"]
                                        ? `param950_7.splitChanBinds.0.chanNo.useless.useless.useless&外设输出设置/视频输出设置/IN2/1分屏&通道${val["splitChanBinds"][0]["chanNo"]}&通道${this.copyForm["param950_7"]["splitChanBinds"][0]["chanNo"]}`
                                        : "";
                                break;
                            case 2:
                                let chanNo2 = false;
                                for (let i = 0; i < 2; i++) {
                                    if (
                                        val["splitChanBinds"][i]["chanNo"] !==
                                        this.copyForm["param950_7"][
                                            "splitChanBinds"
                                        ][i]["chanNo"]
                                    ) {
                                        chanNo2 = true;
                                    }
                                }
                                if (chanNo2) {
                                    this.formData["param950_7.splitChanBinds"] =
                                        chanNo2
                                            ? `param950_7.splitChanBinds&外设输出设置/视频输出设置/IN2/2分屏&通道${val["splitChanBinds"][0]["chanNo"]}、通道${val["splitChanBinds"][1]["chanNo"]}&通道${this.copyForm["param950_7"]["splitChanBinds"][0]["chanNo"]}、通道${this.copyForm["param950_7"]["splitChanBinds"][1]["chanNo"]}`
                                            : "";
                                }
                                break;
                            case 4:
                                let chanNo4 = false;
                                for (let i = 0; i < 4; i++) {
                                    if (
                                        val["splitChanBinds"][i]["chanNo"] !==
                                        this.copyForm["param950_7"][
                                            "splitChanBinds"
                                        ][i]["chanNo"]
                                    ) {
                                        chanNo4 = true;
                                    }
                                }
                                if (chanNo4) {
                                    this.formData["param950_7.splitChanBinds"] =
                                        chanNo4
                                            ? `param950_7.splitChanBinds&外设输出设置/视频输出设置/IN2/4分屏&通道${val["splitChanBinds"][0]["chanNo"]}、通道${val["splitChanBinds"][1]["chanNo"]}、通道${val["splitChanBinds"][2]["chanNo"]}、通道${val["splitChanBinds"][3]["chanNo"]}&通道${this.copyForm["param950_7"]["splitChanBinds"][0]["chanNo"]}、通道${this.copyForm["param950_7"]["splitChanBinds"][1]["chanNo"]}、通道${this.copyForm["param950_7"]["splitChanBinds"][2]["chanNo"]}、通道${this.copyForm["param950_7"]["splitChanBinds"][3]["chanNo"]}`
                                            : "";
                                }
                                break;
                            case 6:
                                let chanNo6 = false;
                                for (let i = 0; i < 6; i++) {
                                    if (
                                        val["splitChanBinds"][i]["chanNo"] !==
                                        this.copyForm["param950_7"][
                                            "splitChanBinds"
                                        ][i]["chanNo"]
                                    ) {
                                        chanNo6 = true;
                                    }
                                }
                                if (chanNo6) {
                                    this.formData["param950_7.splitChanBinds"] =
                                        chanNo6
                                            ? `param950_7.splitChanBinds&外设输出设置/视频输出设置/IN2/6分屏&通道${val["splitChanBinds"][0]["chanNo"]}、通道${val["splitChanBinds"][1]["chanNo"]}、通道${val["splitChanBinds"][2]["chanNo"]}、通道${val["splitChanBinds"][3]["chanNo"]}、通道${val["splitChanBinds"][4]["chanNo"]}、通道${val["splitChanBinds"][5]["chanNo"]}&通道${this.copyForm["param950_7"]["splitChanBinds"][0]["chanNo"]}、通道${this.copyForm["param950_7"]["splitChanBinds"][1]["chanNo"]}、通道${this.copyForm["param950_7"]["splitChanBinds"][2]["chanNo"]}、通道${this.copyForm["param950_7"]["splitChanBinds"][3]["chanNo"]}、通道${this.copyForm["param950_7"]["splitChanBinds"][4]["chanNo"]}、通道${this.copyForm["param950_7"]["splitChanBinds"][5]["chanNo"]}`
                                            : "";
                                }
                                break;
                            case 9:
                                let chanNo9 = false;
                                for (let i = 0; i < 9; i++) {
                                    if (
                                        val["splitChanBinds"][i]["chanNo"] !==
                                        this.copyForm["param950_7"][
                                            "splitChanBinds"
                                        ][i]["chanNo"]
                                    ) {
                                        chanNo9 = true;
                                    }
                                }
                                if (chanNo9) {
                                    this.formData["param950_7.splitChanBinds"] =
                                        chanNo6
                                            ? `param950_7.splitChanBinds&外设输出设置/视频输出设置/IN2/9分屏&通道${val["splitChanBinds"][0]["chanNo"]}、通道${val["splitChanBinds"][1]["chanNo"]}、通道${val["splitChanBinds"][2]["chanNo"]}、通道${val["splitChanBinds"][3]["chanNo"]}、通道${val["splitChanBinds"][4]["chanNo"]}、通道${val["splitChanBinds"][5]["chanNo"]}、通道${val["splitChanBinds"][6]["chanNo"]}、通道${val["splitChanBinds"][7]["chanNo"]}、通道${val["splitChanBinds"][8]["chanNo"]}&通道${this.copyForm["param950_7"]["splitChanBinds"][0]["chanNo"]}、通道${this.copyForm["param950_7"]["splitChanBinds"][1]["chanNo"]}、通道${this.copyForm["param950_7"]["splitChanBinds"][2]["chanNo"]}、通道${this.copyForm["param950_7"]["splitChanBinds"][3]["chanNo"]}、通道${this.copyForm["param950_7"]["splitChanBinds"][4]["chanNo"]}、通道${this.copyForm["param950_7"]["splitChanBinds"][5]["chanNo"]}、通道${this.copyForm["param950_7"]["splitChanBinds"][6]["chanNo"]}、通道${this.copyForm["param950_7"]["splitChanBinds"][7]["chanNo"]}、通道${this.copyForm["param950_7"]["splitChanBinds"][8]["chanNo"]}`
                                            : "";
                                }
                                break;
                        }
                    } else {
                        this.formData["param950_7.splitChanBinds"] =
                            val["splitType"] !=
                            this.copyForm["param950_7"]["splitType"]
                                ? `param950_7.splitChanBinds&外设输出设置/视频输出设置/IN2&${val["splitChanBinds"].length}分屏&${this.copyForm["param950_7"]["splitChanBinds"].length}分屏`
                                : "";
                    }
                    this.formData["param950_7.enable"] =
                        val["enable"] !== this.copyForm["param950_7"]["enable"]
                            ? `param950_7.enable&外设输出设置/视频输出设置/IN2&${
                                  val["enable"] ? "开启" : "关闭"
                              }&${
                                  this.copyForm["param950_7"]["enable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.$emit("formDataChange", this.formData);
                }
            },
            deep: true,
            immediate: true,
        },
        "form.param950_8": {
            handler(val) {
                if (val && !Boolean(this.isTemplate)) {
                    if (
                        val["splitType"] ==
                        this.copyForm["param950_8"]["splitType"]
                    ) {
                        switch (val["splitType"]) {
                            case 1:
                                this.formData[
                                    "param950_8.splitChanBinds.0.chanNo.useless.useless.useless"
                                ] =
                                    val["splitChanBinds"][0]["chanNo"] !==
                                    this.copyForm["param950_8"][
                                        "splitChanBinds"
                                    ][0]["chanNo"]
                                        ? `param950_8.splitChanBinds.0.chanNo.useless.useless.useless&外设输出设置/视频输出设置/IN3/1分屏&通道${val["splitChanBinds"][0]["chanNo"]}&通道${this.copyForm["param950_8"]["splitChanBinds"][0]["chanNo"]}`
                                        : "";
                                break;
                            case 2:
                                let chanNo2 = false;
                                for (let i = 0; i < 2; i++) {
                                    if (
                                        val["splitChanBinds"][i]["chanNo"] !==
                                        this.copyForm["param950_8"][
                                            "splitChanBinds"
                                        ][i]["chanNo"]
                                    ) {
                                        chanNo2 = true;
                                    }
                                }
                                if (chanNo2) {
                                    this.formData["param950_8.splitChanBinds"] =
                                        chanNo2
                                            ? `param950_8.splitChanBinds&外设输出设置/视频输出设置/IN3/2分屏&通道${val["splitChanBinds"][0]["chanNo"]}、通道${val["splitChanBinds"][1]["chanNo"]}&通道${this.copyForm["param950_8"]["splitChanBinds"][0]["chanNo"]}、通道${this.copyForm["param950_8"]["splitChanBinds"][1]["chanNo"]}`
                                            : "";
                                }
                                break;
                            case 4:
                                let chanNo4 = false;
                                for (let i = 0; i < 4; i++) {
                                    if (
                                        val["splitChanBinds"][i]["chanNo"] !==
                                        this.copyForm["param950_8"][
                                            "splitChanBinds"
                                        ][i]["chanNo"]
                                    ) {
                                        chanNo4 = true;
                                    }
                                }
                                if (chanNo4) {
                                    this.formData["param950_8.splitChanBinds"] =
                                        chanNo4
                                            ? `param950_8.splitChanBinds&外设输出设置/视频输出设置/IN3/4分屏&通道${val["splitChanBinds"][0]["chanNo"]}、通道${val["splitChanBinds"][1]["chanNo"]}、通道${val["splitChanBinds"][2]["chanNo"]}、通道${val["splitChanBinds"][3]["chanNo"]}&通道${this.copyForm["param950_8"]["splitChanBinds"][0]["chanNo"]}、通道${this.copyForm["param950_8"]["splitChanBinds"][1]["chanNo"]}、通道${this.copyForm["param950_8"]["splitChanBinds"][2]["chanNo"]}、通道${this.copyForm["param950_8"]["splitChanBinds"][3]["chanNo"]}`
                                            : "";
                                }
                                break;
                            case 6:
                                let chanNo6 = false;
                                for (let i = 0; i < 6; i++) {
                                    if (
                                        val["splitChanBinds"][i]["chanNo"] !==
                                        this.copyForm["param950_8"][
                                            "splitChanBinds"
                                        ][i]["chanNo"]
                                    ) {
                                        chanNo6 = true;
                                    }
                                }
                                if (chanNo6) {
                                    this.formData["param950_8.splitChanBinds"] =
                                        chanNo6
                                            ? `param950_8.splitChanBinds&外设输出设置/视频输出设置/IN3/6分屏&通道${val["splitChanBinds"][0]["chanNo"]}、通道${val["splitChanBinds"][1]["chanNo"]}、通道${val["splitChanBinds"][2]["chanNo"]}、通道${val["splitChanBinds"][3]["chanNo"]}、通道${val["splitChanBinds"][4]["chanNo"]}、通道${val["splitChanBinds"][5]["chanNo"]}&通道${this.copyForm["param950_8"]["splitChanBinds"][0]["chanNo"]}、通道${this.copyForm["param950_8"]["splitChanBinds"][1]["chanNo"]}、通道${this.copyForm["param950_8"]["splitChanBinds"][2]["chanNo"]}、通道${this.copyForm["param950_8"]["splitChanBinds"][3]["chanNo"]}、通道${this.copyForm["param950_8"]["splitChanBinds"][4]["chanNo"]}、通道${this.copyForm["param950_8"]["splitChanBinds"][5]["chanNo"]}`
                                            : "";
                                }
                                break;
                            case 9:
                                let chanNo9 = false;
                                for (let i = 0; i < 9; i++) {
                                    if (
                                        val["splitChanBinds"][i]["chanNo"] !==
                                        this.copyForm["param950_8"][
                                            "splitChanBinds"
                                        ][i]["chanNo"]
                                    ) {
                                        chanNo9 = true;
                                    }
                                }
                                if (chanNo9) {
                                    this.formData["param950_8.splitChanBinds"] =
                                        chanNo6
                                            ? `param950_8.splitChanBinds&外设输出设置/视频输出设置/IN3/9分屏&通道${val["splitChanBinds"][0]["chanNo"]}、通道${val["splitChanBinds"][1]["chanNo"]}、通道${val["splitChanBinds"][2]["chanNo"]}、通道${val["splitChanBinds"][3]["chanNo"]}、通道${val["splitChanBinds"][4]["chanNo"]}、通道${val["splitChanBinds"][5]["chanNo"]}、通道${val["splitChanBinds"][6]["chanNo"]}、通道${val["splitChanBinds"][7]["chanNo"]}、通道${val["splitChanBinds"][8]["chanNo"]}&通道${this.copyForm["param950_8"]["splitChanBinds"][0]["chanNo"]}、通道${this.copyForm["param950_8"]["splitChanBinds"][1]["chanNo"]}、通道${this.copyForm["param950_8"]["splitChanBinds"][2]["chanNo"]}、通道${this.copyForm["param950_8"]["splitChanBinds"][3]["chanNo"]}、通道${this.copyForm["param950_8"]["splitChanBinds"][4]["chanNo"]}、通道${this.copyForm["param950_8"]["splitChanBinds"][5]["chanNo"]}、通道${this.copyForm["param950_8"]["splitChanBinds"][6]["chanNo"]}、通道${this.copyForm["param950_8"]["splitChanBinds"][7]["chanNo"]}、通道${this.copyForm["param950_8"]["splitChanBinds"][8]["chanNo"]}`
                                            : "";
                                }
                                break;
                        }
                    } else {
                        this.formData["param950_8.splitChanBinds"] =
                            val["splitType"] !=
                            this.copyForm["param950_8"]["splitType"]
                                ? `param950_8.splitChanBinds&外设输出设置/视频输出设置/IN3&${val["splitChanBinds"].length}分屏&${this.copyForm["param950_8"]["splitChanBinds"].length}分屏`
                                : "";
                    }
                    this.formData["param950_8.enable"] =
                        val["enable"] !== this.copyForm["param950_8"]["enable"]
                            ? `param950_8.enable&外设输出设置/视频输出设置/IN3&${
                                  val["enable"] ? "开启" : "关闭"
                              }&${
                                  this.copyForm["param950_8"]["enable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.$emit("formDataChange", this.formData);
                }
            },
            deep: true,
            immediate: true,
        },
        "form.param950_9": {
            handler(val) {
                if (val && !Boolean(this.isTemplate)) {
                    if (
                        val["splitType"] ==
                        this.copyForm["param950_9"]["splitType"]
                    ) {
                        switch (val["splitType"]) {
                            case 1:
                                this.formData[
                                    "param950_9.splitChanBinds.0.chanNo.useless.useless.useless"
                                ] =
                                    val["splitChanBinds"][0]["chanNo"] !==
                                    this.copyForm["param950_9"][
                                        "splitChanBinds"
                                    ][0]["chanNo"]
                                        ? `param950_9.splitChanBinds.0.chanNo.useless.useless.useless&外设输出设置/视频输出设置/IN4/1分屏&通道${val["splitChanBinds"][0]["chanNo"]}&通道${this.copyForm["param950_9"]["splitChanBinds"][0]["chanNo"]}`
                                        : "";
                                break;
                            case 2:
                                let chanNo2 = false;
                                for (let i = 0; i < 2; i++) {
                                    if (
                                        val["splitChanBinds"][i]["chanNo"] !==
                                        this.copyForm["param950_9"][
                                            "splitChanBinds"
                                        ][i]["chanNo"]
                                    ) {
                                        chanNo2 = true;
                                    }
                                }
                                if (chanNo2) {
                                    this.formData["param950_9.splitChanBinds"] =
                                        chanNo2
                                            ? `param950_9.splitChanBinds&外设输出设置/视频输出设置/IN4/2分屏&通道${val["splitChanBinds"][0]["chanNo"]}、通道${val["splitChanBinds"][1]["chanNo"]}&通道${this.copyForm["param950_9"]["splitChanBinds"][0]["chanNo"]}、通道${this.copyForm["param950_9"]["splitChanBinds"][1]["chanNo"]}`
                                            : "";
                                }
                                break;
                            case 4:
                                let chanNo4 = false;
                                for (let i = 0; i < 4; i++) {
                                    if (
                                        val["splitChanBinds"][i]["chanNo"] !==
                                        this.copyForm["param950_9"][
                                            "splitChanBinds"
                                        ][i]["chanNo"]
                                    ) {
                                        chanNo4 = true;
                                    }
                                }
                                if (chanNo4) {
                                    this.formData["param950_9.splitChanBinds"] =
                                        chanNo4
                                            ? `param950_9.splitChanBinds&外设输出设置/视频输出设置/IN4/4分屏&通道${val["splitChanBinds"][0]["chanNo"]}、通道${val["splitChanBinds"][1]["chanNo"]}、通道${val["splitChanBinds"][2]["chanNo"]}、通道${val["splitChanBinds"][3]["chanNo"]}&通道${this.copyForm["param950_9"]["splitChanBinds"][0]["chanNo"]}、通道${this.copyForm["param950_9"]["splitChanBinds"][1]["chanNo"]}、通道${this.copyForm["param950_9"]["splitChanBinds"][2]["chanNo"]}、通道${this.copyForm["param950_9"]["splitChanBinds"][3]["chanNo"]}`
                                            : "";
                                }
                                break;
                            case 6:
                                let chanNo6 = false;
                                for (let i = 0; i < 6; i++) {
                                    if (
                                        val["splitChanBinds"][i]["chanNo"] !==
                                        this.copyForm["param950_9"][
                                            "splitChanBinds"
                                        ][i]["chanNo"]
                                    ) {
                                        chanNo6 = true;
                                    }
                                }
                                if (chanNo6) {
                                    this.formData["param950_9.splitChanBinds"] =
                                        chanNo6
                                            ? `param950_9.splitChanBinds&外设输出设置/视频输出设置/IN4/6分屏&通道${val["splitChanBinds"][0]["chanNo"]}、通道${val["splitChanBinds"][1]["chanNo"]}、通道${val["splitChanBinds"][2]["chanNo"]}、通道${val["splitChanBinds"][3]["chanNo"]}、通道${val["splitChanBinds"][4]["chanNo"]}、通道${val["splitChanBinds"][5]["chanNo"]}&通道${this.copyForm["param950_9"]["splitChanBinds"][0]["chanNo"]}、通道${this.copyForm["param950_9"]["splitChanBinds"][1]["chanNo"]}、通道${this.copyForm["param950_9"]["splitChanBinds"][2]["chanNo"]}、通道${this.copyForm["param950_9"]["splitChanBinds"][3]["chanNo"]}、通道${this.copyForm["param950_9"]["splitChanBinds"][4]["chanNo"]}、通道${this.copyForm["param950_9"]["splitChanBinds"][5]["chanNo"]}`
                                            : "";
                                }
                                break;
                            case 9:
                                let chanNo9 = false;
                                for (let i = 0; i < 9; i++) {
                                    if (
                                        val["splitChanBinds"][i]["chanNo"] !==
                                        this.copyForm["param950_9"][
                                            "splitChanBinds"
                                        ][i]["chanNo"]
                                    ) {
                                        chanNo9 = true;
                                    }
                                }
                                if (chanNo9) {
                                    this.formData["param950_9.splitChanBinds"] =
                                        chanNo6
                                            ? `param950_9.splitChanBinds&外设输出设置/视频输出设置/IN4/9分屏&通道${val["splitChanBinds"][0]["chanNo"]}、通道${val["splitChanBinds"][1]["chanNo"]}、通道${val["splitChanBinds"][2]["chanNo"]}、通道${val["splitChanBinds"][3]["chanNo"]}、通道${val["splitChanBinds"][4]["chanNo"]}、通道${val["splitChanBinds"][5]["chanNo"]}、通道${val["splitChanBinds"][6]["chanNo"]}、通道${val["splitChanBinds"][7]["chanNo"]}、通道${val["splitChanBinds"][8]["chanNo"]}&通道${this.copyForm["param950_9"]["splitChanBinds"][0]["chanNo"]}、通道${this.copyForm["param950_9"]["splitChanBinds"][1]["chanNo"]}、通道${this.copyForm["param950_9"]["splitChanBinds"][2]["chanNo"]}、通道${this.copyForm["param950_9"]["splitChanBinds"][3]["chanNo"]}、通道${this.copyForm["param950_9"]["splitChanBinds"][4]["chanNo"]}、通道${this.copyForm["param950_9"]["splitChanBinds"][5]["chanNo"]}、通道${this.copyForm["param950_9"]["splitChanBinds"][6]["chanNo"]}、通道${this.copyForm["param950_9"]["splitChanBinds"][7]["chanNo"]}、通道${this.copyForm["param950_9"]["splitChanBinds"][8]["chanNo"]}`
                                            : "";
                                }
                                break;
                        }
                    } else {
                        this.formData["param950_9.splitChanBinds"] =
                            val["splitType"] !=
                            this.copyForm["param950_9"]["splitType"]
                                ? `param950_9.splitChanBinds&外设输出设置/视频输出设置/IN4&${val["splitChanBinds"].length}分屏&${this.copyForm["param950_9"]["splitChanBinds"].length}分屏`
                                : "";
                    }
                    this.formData["param950_9.enable"] =
                        val["enable"] !== this.copyForm["param950_9"]["enable"]
                            ? `param950_9.enable&外设输出设置/视频输出设置/IN4&${
                                  val["enable"] ? "开启" : "关闭"
                              }&${
                                  this.copyForm["param950_9"]["enable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.$emit("formDataChange", this.formData);
                }
            },
            deep: true,
            immediate: true,
        },
        "form.param950_10": {
            handler(val) {
                if (val && !Boolean(this.isTemplate)) {
                    if (
                        val["splitType"] ==
                        this.copyForm["param950_10"]["splitType"]
                    ) {
                        switch (val["splitType"]) {
                            case 1:
                                this.formData[
                                    "param950_10.splitChanBinds.0.chanNo.useless.useless.useless"
                                ] =
                                    val["splitChanBinds"][0]["chanNo"] !==
                                    this.copyForm["param950_10"][
                                        "splitChanBinds"
                                    ][0]["chanNo"]
                                        ? `param950_10.splitChanBinds.0.chanNo.useless.useless.useless&外设输出设置/视频输出设置/人脸检测/1分屏&通道${val["splitChanBinds"][0]["chanNo"]}&通道${this.copyForm["param950_10"]["splitChanBinds"][0]["chanNo"]}`
                                        : "";
                                break;
                            case 2:
                                let chanNo2 = false;
                                for (let i = 0; i < 2; i++) {
                                    if (
                                        val["splitChanBinds"][i]["chanNo"] !==
                                        this.copyForm["param950_10"][
                                            "splitChanBinds"
                                        ][i]["chanNo"]
                                    ) {
                                        chanNo2 = true;
                                    }
                                }
                                if (chanNo2) {
                                    this.formData[
                                        "param950_10.splitChanBinds"
                                    ] = chanNo2
                                        ? `param950_10.splitChanBinds&外设输出设置/视频输出设置/人脸检测/2分屏&通道${val["splitChanBinds"][0]["chanNo"]}、通道${val["splitChanBinds"][1]["chanNo"]}&通道${this.copyForm["param950_10"]["splitChanBinds"][0]["chanNo"]}、通道${this.copyForm["param950_10"]["splitChanBinds"][1]["chanNo"]}`
                                        : "";
                                }
                                break;
                            case 4:
                                let chanNo4 = false;
                                for (let i = 0; i < 4; i++) {
                                    if (
                                        val["splitChanBinds"][i]["chanNo"] !==
                                        this.copyForm["param950_10"][
                                            "splitChanBinds"
                                        ][i]["chanNo"]
                                    ) {
                                        chanNo4 = true;
                                    }
                                }
                                if (chanNo4) {
                                    this.formData[
                                        "param950_10.splitChanBinds"
                                    ] = chanNo4
                                        ? `param950_10.splitChanBinds&外设输出设置/视频输出设置/人脸检测/4分屏&通道${val["splitChanBinds"][0]["chanNo"]}、通道${val["splitChanBinds"][1]["chanNo"]}、通道${val["splitChanBinds"][2]["chanNo"]}、通道${val["splitChanBinds"][3]["chanNo"]}&通道${this.copyForm["param950_10"]["splitChanBinds"][0]["chanNo"]}、通道${this.copyForm["param950_10"]["splitChanBinds"][1]["chanNo"]}、通道${this.copyForm["param950_10"]["splitChanBinds"][2]["chanNo"]}、通道${this.copyForm["param950_10"]["splitChanBinds"][3]["chanNo"]}`
                                        : "";
                                }
                                break;
                            case 6:
                                let chanNo6 = false;
                                for (let i = 0; i < 6; i++) {
                                    if (
                                        val["splitChanBinds"][i]["chanNo"] !==
                                        this.copyForm["param950_10"][
                                            "splitChanBinds"
                                        ][i]["chanNo"]
                                    ) {
                                        chanNo6 = true;
                                    }
                                }
                                if (chanNo6) {
                                    this.formData[
                                        "param950_10.splitChanBinds"
                                    ] = chanNo6
                                        ? `param950_10.splitChanBinds&外设输出设置/视频输出设置/人脸检测/6分屏&通道${val["splitChanBinds"][0]["chanNo"]}、通道${val["splitChanBinds"][1]["chanNo"]}、通道${val["splitChanBinds"][2]["chanNo"]}、通道${val["splitChanBinds"][3]["chanNo"]}、通道${val["splitChanBinds"][4]["chanNo"]}、通道${val["splitChanBinds"][5]["chanNo"]}&通道${this.copyForm["param950_10"]["splitChanBinds"][0]["chanNo"]}、通道${this.copyForm["param950_10"]["splitChanBinds"][1]["chanNo"]}、通道${this.copyForm["param950_10"]["splitChanBinds"][2]["chanNo"]}、通道${this.copyForm["param950_10"]["splitChanBinds"][3]["chanNo"]}、通道${this.copyForm["param950_10"]["splitChanBinds"][4]["chanNo"]}、通道${this.copyForm["param950_10"]["splitChanBinds"][5]["chanNo"]}`
                                        : "";
                                }
                                break;
                            case 9:
                                let chanNo9 = false;
                                for (let i = 0; i < 9; i++) {
                                    if (
                                        val["splitChanBinds"][i]["chanNo"] !==
                                        this.copyForm["param950_10"][
                                            "splitChanBinds"
                                        ][i]["chanNo"]
                                    ) {
                                        chanNo9 = true;
                                    }
                                }
                                if (chanNo9) {
                                    this.formData[
                                        "param950_10.splitChanBinds"
                                    ] = chanNo6
                                        ? `param950_10.splitChanBinds&外设输出设置/视频输出设置/人脸检测/9分屏&通道${val["splitChanBinds"][0]["chanNo"]}、通道${val["splitChanBinds"][1]["chanNo"]}、通道${val["splitChanBinds"][2]["chanNo"]}、通道${val["splitChanBinds"][3]["chanNo"]}、通道${val["splitChanBinds"][4]["chanNo"]}、通道${val["splitChanBinds"][5]["chanNo"]}、通道${val["splitChanBinds"][6]["chanNo"]}、通道${val["splitChanBinds"][7]["chanNo"]}、通道${val["splitChanBinds"][8]["chanNo"]}&通道${this.copyForm["param950_10"]["splitChanBinds"][0]["chanNo"]}、通道${this.copyForm["param950_10"]["splitChanBinds"][1]["chanNo"]}、通道${this.copyForm["param950_10"]["splitChanBinds"][2]["chanNo"]}、通道${this.copyForm["param950_10"]["splitChanBinds"][3]["chanNo"]}、通道${this.copyForm["param950_10"]["splitChanBinds"][4]["chanNo"]}、通道${this.copyForm["param950_10"]["splitChanBinds"][5]["chanNo"]}、通道${this.copyForm["param950_10"]["splitChanBinds"][6]["chanNo"]}、通道${this.copyForm["param950_10"]["splitChanBinds"][7]["chanNo"]}、通道${this.copyForm["param950_10"]["splitChanBinds"][8]["chanNo"]}`
                                        : "";
                                }
                                break;
                        }
                    } else {
                        this.formData["param950_10.splitChanBinds"] =
                            val["splitType"] !=
                            this.copyForm["param950_10"]["splitType"]
                                ? `param950_10.splitChanBinds&外设输出设置/视频输出设置/人脸检测&${val["splitChanBinds"].length}分屏&${this.copyForm["param950_10"]["splitChanBinds"].length}分屏`
                                : "";
                    }
                    this.formData["param950_10.splitChanBinds"] =
                        val["splitType"] !=
                        this.copyForm["param950_10"]["splitType"]
                            ? `param950_10.splitChanBinds&外设输出设置/视频输出设置/人脸检测&${val["splitChanBinds"].length}分屏&${this.copyForm["param950_10"]["splitChanBinds"].length}分屏`
                            : "";
                    this.formData["param950_10.enable"] =
                        val["enable"] !== this.copyForm["param950_10"]["enable"]
                            ? `param950_10.enable&外设输出设置/视频输出设置/人脸检测&${
                                  val["enable"] ? "开启" : "关闭"
                              }&${
                                  this.copyForm["param950_10"]["enable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.$emit("formDataChange", this.formData);
                }
            },
            deep: true,
            immediate: true,
        },
        "form.param950_11": {
            handler(val) {
                if (val && !Boolean(this.isTemplate)) {
                    if (
                        val["splitType"] ==
                        this.copyForm["param950_11"]["splitType"]
                    ) {
                        switch (val["splitType"]) {
                            case 1:
                                this.formData[
                                    "param950_11.splitChanBinds.0.chanNo.useless.useless.useless"
                                ] =
                                    val["splitChanBinds"][0]["chanNo"] !==
                                    this.copyForm["param950_11"][
                                        "splitChanBinds"
                                    ][0]["chanNo"]
                                        ? `param950_11.splitChanBinds.0.chanNo.useless.useless.useless&外设输出设置/视频输出设置/前BSD/1分屏&通道${val["splitChanBinds"][0]["chanNo"]}&通道${this.copyForm["param950_11"]["splitChanBinds"][0]["chanNo"]}`
                                        : "";
                                break;
                            case 2:
                                let chanNo2 = false;
                                for (let i = 0; i < 2; i++) {
                                    if (
                                        val["splitChanBinds"][i]["chanNo"] !==
                                        this.copyForm["param950_11"][
                                            "splitChanBinds"
                                        ][i]["chanNo"]
                                    ) {
                                        chanNo2 = true;
                                    }
                                }
                                if (chanNo2) {
                                    this.formData[
                                        "param950_11.splitChanBinds"
                                    ] = chanNo2
                                        ? `param950_11.splitChanBinds&外设输出设置/视频输出设置/前BSD/2分屏&通道${val["splitChanBinds"][0]["chanNo"]}、通道${val["splitChanBinds"][1]["chanNo"]}&通道${this.copyForm["param950_11"]["splitChanBinds"][0]["chanNo"]}、通道${this.copyForm["param950_11"]["splitChanBinds"][1]["chanNo"]}`
                                        : "";
                                }
                                break;
                            case 4:
                                let chanNo4 = false;
                                for (let i = 0; i < 4; i++) {
                                    if (
                                        val["splitChanBinds"][i]["chanNo"] !==
                                        this.copyForm["param950_11"][
                                            "splitChanBinds"
                                        ][i]["chanNo"]
                                    ) {
                                        chanNo4 = true;
                                    }
                                }
                                if (chanNo4) {
                                    this.formData[
                                        "param950_11.splitChanBinds"
                                    ] = chanNo4
                                        ? `param950_11.splitChanBinds&外设输出设置/视频输出设置/前BSD/4分屏&通道${val["splitChanBinds"][0]["chanNo"]}、通道${val["splitChanBinds"][1]["chanNo"]}、通道${val["splitChanBinds"][2]["chanNo"]}、通道${val["splitChanBinds"][3]["chanNo"]}&通道${this.copyForm["param950_11"]["splitChanBinds"][0]["chanNo"]}、通道${this.copyForm["param950_11"]["splitChanBinds"][1]["chanNo"]}、通道${this.copyForm["param950_11"]["splitChanBinds"][2]["chanNo"]}、通道${this.copyForm["param950_11"]["splitChanBinds"][3]["chanNo"]}`
                                        : "";
                                }
                                break;
                            case 6:
                                let chanNo6 = false;
                                for (let i = 0; i < 6; i++) {
                                    if (
                                        val["splitChanBinds"][i]["chanNo"] !==
                                        this.copyForm["param950_11"][
                                            "splitChanBinds"
                                        ][i]["chanNo"]
                                    ) {
                                        chanNo6 = true;
                                    }
                                }
                                if (chanNo6) {
                                    this.formData[
                                        "param950_11.splitChanBinds"
                                    ] = chanNo6
                                        ? `param950_11.splitChanBinds&外设输出设置/视频输出设置/前BSD/6分屏&通道${val["splitChanBinds"][0]["chanNo"]}、通道${val["splitChanBinds"][1]["chanNo"]}、通道${val["splitChanBinds"][2]["chanNo"]}、通道${val["splitChanBinds"][3]["chanNo"]}、通道${val["splitChanBinds"][4]["chanNo"]}、通道${val["splitChanBinds"][5]["chanNo"]}&通道${this.copyForm["param950_11"]["splitChanBinds"][0]["chanNo"]}、通道${this.copyForm["param950_11"]["splitChanBinds"][1]["chanNo"]}、通道${this.copyForm["param950_11"]["splitChanBinds"][2]["chanNo"]}、通道${this.copyForm["param950_11"]["splitChanBinds"][3]["chanNo"]}、通道${this.copyForm["param950_11"]["splitChanBinds"][4]["chanNo"]}、通道${this.copyForm["param950_11"]["splitChanBinds"][5]["chanNo"]}`
                                        : "";
                                }
                                break;
                            case 9:
                                let chanNo9 = false;
                                for (let i = 0; i < 9; i++) {
                                    if (
                                        val["splitChanBinds"][i]["chanNo"] !==
                                        this.copyForm["param950_11"][
                                            "splitChanBinds"
                                        ][i]["chanNo"]
                                    ) {
                                        chanNo9 = true;
                                    }
                                }
                                if (chanNo9) {
                                    this.formData[
                                        "param950_11.splitChanBinds"
                                    ] = chanNo6
                                        ? `param950_11.splitChanBinds&外设输出设置/视频输出设置/前BSD/9分屏&通道${val["splitChanBinds"][0]["chanNo"]}、通道${val["splitChanBinds"][1]["chanNo"]}、通道${val["splitChanBinds"][2]["chanNo"]}、通道${val["splitChanBinds"][3]["chanNo"]}、通道${val["splitChanBinds"][4]["chanNo"]}、通道${val["splitChanBinds"][5]["chanNo"]}、通道${val["splitChanBinds"][6]["chanNo"]}、通道${val["splitChanBinds"][7]["chanNo"]}、通道${val["splitChanBinds"][8]["chanNo"]}&通道${this.copyForm["param950_11"]["splitChanBinds"][0]["chanNo"]}、通道${this.copyForm["param950_11"]["splitChanBinds"][1]["chanNo"]}、通道${this.copyForm["param950_11"]["splitChanBinds"][2]["chanNo"]}、通道${this.copyForm["param950_11"]["splitChanBinds"][3]["chanNo"]}、通道${this.copyForm["param950_11"]["splitChanBinds"][4]["chanNo"]}、通道${this.copyForm["param950_11"]["splitChanBinds"][5]["chanNo"]}、通道${this.copyForm["param950_11"]["splitChanBinds"][6]["chanNo"]}、通道${this.copyForm["param950_11"]["splitChanBinds"][7]["chanNo"]}、通道${this.copyForm["param950_11"]["splitChanBinds"][8]["chanNo"]}`
                                        : "";
                                }
                                break;
                        }
                    } else {
                        this.formData["param950_11.splitChanBinds"] =
                            val["splitType"] !=
                            this.copyForm["param950_11"]["splitType"]
                                ? `param950_11.splitChanBinds&外设输出设置/视频输出设置/前BSD&${val["splitChanBinds"].length}分屏&${this.copyForm["param950_11"]["splitChanBinds"].length}分屏`
                                : "";
                    }
                    this.formData["param950_11.enable"] =
                        val["enable"] !== this.copyForm["param950_11"]["enable"]
                            ? `param950_11.enable&外设输出设置/视频输出设置/前BSD&${
                                  val["enable"] ? "开启" : "关闭"
                              }&${
                                  this.copyForm["param950_11"]["enable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.$emit("formDataChange", this.formData);
                }
            },
            deep: true,
            immediate: true,
        },
        "form.param950_99": {
            handler(val) {
                if (val && !Boolean(this.isTemplate)) {
                    if (
                        val["splitType"] ==
                        this.copyForm["param950_99"]["splitType"]
                    ) {
                        switch (val["splitType"]) {
                            case 1:
                                this.formData[
                                    "param950_99.splitChanBinds.0.chanNo.useless.useless.useless"
                                ] =
                                    val["splitChanBinds"][0]["chanNo"] !==
                                    this.copyForm["param950_99"][
                                        "splitChanBinds"
                                    ][0]["chanNo"]
                                        ? `param950_99.splitChanBinds.0.chanNo.useless.useless.useless&外设输出设置/视频输出设置/其他/1分屏&通道${val["splitChanBinds"][0]["chanNo"]}&通道${this.copyForm["param950_99"]["splitChanBinds"][0]["chanNo"]}`
                                        : "";
                                break;
                            case 2:
                                let chanNo2 = false;
                                for (let i = 0; i < 2; i++) {
                                    if (
                                        val["splitChanBinds"][i]["chanNo"] !==
                                        this.copyForm["param950_99"][
                                            "splitChanBinds"
                                        ][i]["chanNo"]
                                    ) {
                                        chanNo2 = true;
                                    }
                                }
                                if (chanNo2) {
                                    this.formData[
                                        "param950_99.splitChanBinds"
                                    ] = chanNo2
                                        ? `param950_99.splitChanBinds&外设输出设置/视频输出设置/其他/2分屏&通道${val["splitChanBinds"][0]["chanNo"]}、通道${val["splitChanBinds"][1]["chanNo"]}&通道${this.copyForm["param950_99"]["splitChanBinds"][0]["chanNo"]}、通道${this.copyForm["param950_99"]["splitChanBinds"][1]["chanNo"]}`
                                        : "";
                                }
                                break;
                            case 4:
                                let chanNo4 = false;
                                for (let i = 0; i < 4; i++) {
                                    if (
                                        val["splitChanBinds"][i]["chanNo"] !==
                                        this.copyForm["param950_99"][
                                            "splitChanBinds"
                                        ][i]["chanNo"]
                                    ) {
                                        chanNo4 = true;
                                    }
                                }
                                if (chanNo4) {
                                    this.formData[
                                        "param950_99.splitChanBinds"
                                    ] = chanNo4
                                        ? `param950_99.splitChanBinds&外设输出设置/视频输出设置/其他/4分屏&通道${val["splitChanBinds"][0]["chanNo"]}、通道${val["splitChanBinds"][1]["chanNo"]}、通道${val["splitChanBinds"][2]["chanNo"]}、通道${val["splitChanBinds"][3]["chanNo"]}&通道${this.copyForm["param950_99"]["splitChanBinds"][0]["chanNo"]}、通道${this.copyForm["param950_99"]["splitChanBinds"][1]["chanNo"]}、通道${this.copyForm["param950_99"]["splitChanBinds"][2]["chanNo"]}、通道${this.copyForm["param950_99"]["splitChanBinds"][3]["chanNo"]}`
                                        : "";
                                }
                                break;
                            case 6:
                                let chanNo6 = false;
                                for (let i = 0; i < 6; i++) {
                                    if (
                                        val["splitChanBinds"][i]["chanNo"] !==
                                        this.copyForm["param950_99"][
                                            "splitChanBinds"
                                        ][i]["chanNo"]
                                    ) {
                                        chanNo6 = true;
                                    }
                                }
                                if (chanNo6) {
                                    this.formData[
                                        "param950_99.splitChanBinds"
                                    ] = chanNo6
                                        ? `param950_99.splitChanBinds&外设输出设置/视频输出设置/其他/6分屏&通道${val["splitChanBinds"][0]["chanNo"]}、通道${val["splitChanBinds"][1]["chanNo"]}、通道${val["splitChanBinds"][2]["chanNo"]}、通道${val["splitChanBinds"][3]["chanNo"]}、通道${val["splitChanBinds"][4]["chanNo"]}、通道${val["splitChanBinds"][5]["chanNo"]}&通道${this.copyForm["param950_99"]["splitChanBinds"][0]["chanNo"]}、通道${this.copyForm["param950_99"]["splitChanBinds"][1]["chanNo"]}、通道${this.copyForm["param950_99"]["splitChanBinds"][2]["chanNo"]}、通道${this.copyForm["param950_99"]["splitChanBinds"][3]["chanNo"]}、通道${this.copyForm["param950_99"]["splitChanBinds"][4]["chanNo"]}、通道${this.copyForm["param950_99"]["splitChanBinds"][5]["chanNo"]}`
                                        : "";
                                }
                                break;
                            case 9:
                                let chanNo9 = false;
                                for (let i = 0; i < 9; i++) {
                                    if (
                                        val["splitChanBinds"][i]["chanNo"] !==
                                        this.copyForm["param950_99"][
                                            "splitChanBinds"
                                        ][i]["chanNo"]
                                    ) {
                                        chanNo9 = true;
                                    }
                                }
                                if (chanNo9) {
                                    this.formData[
                                        "param950_99.splitChanBinds"
                                    ] = chanNo9
                                        ? `param950_99.splitChanBinds&外设输出设置/视频输出设置/其他/9分屏&通道${val["splitChanBinds"][0]["chanNo"]}、通道${val["splitChanBinds"][1]["chanNo"]}、通道${val["splitChanBinds"][2]["chanNo"]}、通道${val["splitChanBinds"][3]["chanNo"]}、通道${val["splitChanBinds"][4]["chanNo"]}、通道${val["splitChanBinds"][5]["chanNo"]}、通道${val["splitChanBinds"][6]["chanNo"]}、通道${val["splitChanBinds"][7]["chanNo"]}、通道${val["splitChanBinds"][8]["chanNo"]}&通道${this.copyForm["param950_99"]["splitChanBinds"][0]["chanNo"]}、通道${this.copyForm["param950_99"]["splitChanBinds"][1]["chanNo"]}、通道${this.copyForm["param950_99"]["splitChanBinds"][2]["chanNo"]}、通道${this.copyForm["param950_99"]["splitChanBinds"][3]["chanNo"]}、通道${this.copyForm["param950_99"]["splitChanBinds"][4]["chanNo"]}、通道${this.copyForm["param950_99"]["splitChanBinds"][5]["chanNo"]}、通道${this.copyForm["param950_99"]["splitChanBinds"][6]["chanNo"]}、通道${this.copyForm["param950_99"]["splitChanBinds"][7]["chanNo"]}、通道${this.copyForm["param950_99"]["splitChanBinds"][8]["chanNo"]}`
                                        : "";
                                }
                                break;
                        }
                    } else {
                        this.formData["param950_99.splitChanBinds"] =
                            val["splitType"] !=
                            this.copyForm["param950_99"]["splitType"]
                                ? `param950_99.splitChanBinds&外设输出设置/视频输出设置/其他&${val["splitChanBinds"].length}分屏&${this.copyForm["param950_99"]["splitChanBinds"].length}分屏`
                                : "";
                    }
                    this.formData["param950_99.enable"] =
                        val["enable"] !== this.copyForm["param950_99"]["enable"]
                            ? `param950_99.enable&外设输出设置/视频输出设置/其他&${
                                  val["enable"] ? "开启" : "关闭"
                              }&${
                                  this.copyForm["param950_99"]["enable"]
                                      ? "开启"
                                      : "关闭"
                              }`
                            : "";
                    this.$emit("formDataChange", this.formData);
                }
            },
            deep: true,
            immediate: true,
        },
    },
    data() {
        return {
            deviceId: this.$route.query.deviceId || "",
            deviceCapability: {},
            form: {},
            copyForm: {},
            formData: {},
            dictionaryData: {},
            activeType: "",
            chooseType: "",
            chooseIndex: "",
            chanNoIndex: 0,
            childConfigParams: false,
            tabList: [],
            checkNumber: function (rule, value, callback) {
                if (value !== "" && value !== null && value !== undefined) {
                    if (!validateNum(value)) {
                        callback(new Error("请输入正确的整数"));
                    } else if (value < this.min) {
                        callback(new Error(`最小值为${this.min}`));
                    } else if (value > this.max) {
                        callback(new Error(`最大值为${this.max}`));
                    } else {
                        callback();
                    }
                } else {
                    // callback(new Error("请输入"));
                    callback();
                }
            },
        };
    },
    created() {
        // this.getByIsApi(1)
        //console.log(this.isTemplate)
        this.$emit("setMenuActiveRefFormName", "PrivateEventDisplayForm");
    },
    methods: {
        makeListMenu() {
            this.tabList = [];
            this.deviceCapability["intelliDrive_sensor"][
                "eventDisplay"
            ].forEach((item) => {
                switch (item["type"]) {
                    case 1:
                        this.tabList.push({
                            name: String(item["type"]),
                            label: "倒车",
                            splitType: item["splitType"],
                            splitChans: item["splitChans"],
                        });
                        break;
                    case 2:
                        this.tabList.push({
                            name: String(item["type"]),
                            label: "IN1",
                            splitType: item["splitType"],
                            splitChans: item["splitChans"],
                        });
                        break;
                    case 3:
                        this.tabList.push({
                            name: String(item["type"]),
                            label: "左BSD",
                            splitType: item["splitType"],
                            splitChans: item["splitChans"],
                        });
                        break;
                    case 4:
                        this.tabList.push({
                            name: String(item["type"]),
                            label: "右BSD",
                            splitType: item["splitType"],
                            splitChans: item["splitChans"],
                        });
                        break;
                    case 5:
                        this.tabList.push({
                            name: String(item["type"]),
                            label: "左转",
                            splitType: item["splitType"],
                            splitChans: item["splitChans"],
                        });
                        break;
                    case 6:
                        this.tabList.push({
                            name: String(item["type"]),
                            label: "右转",
                            splitType: item["splitType"],
                            splitChans: item["splitChans"],
                        });
                        break;
                    case 7:
                        this.tabList.push({
                            name: String(item["type"]),
                            label: "IN2",
                            splitType: item["splitType"],
                            splitChans: item["splitChans"],
                        });
                        break;
                    case 8:
                        this.tabList.push({
                            name: String(item["type"]),
                            label: "IN3",
                            splitType: item["splitType"],
                            splitChans: item["splitChans"],
                        });
                        break;
                    case 9:
                        this.tabList.push({
                            name: String(item["type"]),
                            label: "IN4",
                            splitType: item["splitType"],
                            splitChans: item["splitChans"],
                        });
                        break;
                    case 10:
                        this.tabList.push({
                            name: String(item["type"]),
                            label: "人脸检测",
                            splitType: item["splitType"],
                            splitChans: item["splitChans"],
                        });
                        break;
                    case 11:
                        this.tabList.push({
                            name: String(item["type"]),
                            label: "前BSD",
                            splitType: item["splitType"],
                            splitChans: item["splitChans"],
                        });
                        break;
                    case 99:
                        this.tabList.push({
                            name: String(item["type"]),
                            label: "其他",
                            splitType: item["splitType"],
                            splitChans: item["splitChans"],
                        });
                        break;
                }
            });
            console.log(this.tabList);
        },
        setPageList(activeType, item, index) {
            this.form["param950_" + activeType]["splitChanBinds"] = [];
            for (let i = 0; i < item; i++) {
                this.form["param950_" + activeType]["splitChanBinds"].push({
                    chanNo: i + 1,
                    bindIndex: i,
                });
            }
            this.form["param950_" + activeType]["splitType"] = item;
        },
        beforeLeave() {},
        getPrivateProcotol(activeType) {
            this.activeType = activeType;
            if (!this.form["param950_" + activeType]) {
                let params = {
                    deviceId: this.deviceId,
                    param: {
                        chanNo: 1,
                        type: Number(activeType),
                    },
                    msgId: 950,
                };
                if (Boolean(this.isTemplate)) return;
                this.$api.getEHomeConfig(params).then((res) => {
                    if (res && res.data && res.data.param) {
                        let formData = JSON.parse(res.data.param);
                        this.$set(
                            this.form,
                            `param950_${this.activeType}`,
                            formData
                        );
                        this.$set(
                            this.copyForm,
                            `param950_${this.activeType}`,
                            JSON.parse(JSON.stringify(formData))
                        );
                        this.childConfigParams = false;
                    } else {
                        this.$message.error("协议获取失败");
                        this.childConfigParams = false;
                    }
                });
            } else {
                this.childConfigParams = false;
            }
        },
    },
};
</script>

<style lang="less" scoped>
.configuration-detail-submit {
    width: 100%;
    border-right: 1px solid #f0f0f0;
    border-bottom: 1px solid #f0f0f0;
    border-left: 1px solid #f0f0f0;
    display: flex;
    position: fixed;
    bottom: 0;
    z-index: 500;
    right: 1%;
    background: white;
}
.maginBottom {
    margin-bottom: 10px;
}
.splitTypes {
    display: flex;
    flex-flow: wrap;
    justify-self: start;
    justify-content: flex-start;
    width: 100%;
    margin-bottom: 20px;
    .splitButtons {
        text-align: center;
    }
}
.channelShow1,
.channelShow2,
.channelShow3,
.channelShow4,
.channelShow5 {
    width: 100%;
    font-size: 16px;
    color: black;
    background: whitesmoke;
    cursor: pointer;
    text-align: center;
}
.channelShow1 {
    height: 400px;
    line-height: 400px;
}
.channelShow2 {
    height: 360px;
    line-height: 360px;
}
.channelShow3 {
    height: 270px;
    line-height: 270px;
}
.channelShow4 {
    height: 122px;
    line-height: 122px;
}
.channelShow6 {
    height: 270px;
    line-height: 270px;
}
.channelShow9 {
    height: 122px;
    line-height: 122px;
}
</style>
