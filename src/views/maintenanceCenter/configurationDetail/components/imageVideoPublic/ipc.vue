<template>
    <div class="p-a-md">
        <el-tabs v-model="activeName">
            <el-tab-pane label="已添加设备" name="first">
                <el-collapse v-model="activeNames">
                    <el-collapse-item name="1">
                        <template slot="title">
                            已添加设备01
                            <el-dropdown style="float: right" @command="handleCommand1">
                                <div>
                                    <i class="el-icon-setting" style="float: right;font-size: xx-large"></i>
                                </div>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item command="a">IPC设置</el-dropdown-item>
                                    <el-dropdown-item command="b">删除</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </template>
                        <el-row style="color: #90a4ae;">
                            <el-col :span="6">
                                <span>设备型号</span>
                            </el-col>
                            <el-col :span="6">
                                <span>序列编号</span>
                            </el-col>
                            <el-col :span="6">
                                <span>激活状态</span>
                            </el-col>
                            <el-col :span="6">
                                <span>软件版本</span>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <span>字段内容XXXX</span>
                            </el-col>
                            <el-col :span="6">
                                <span>字段内容XXXXXX</span>
                            </el-col>
                            <el-col :span="6">
                                <span>字段内容</span>
                            </el-col>
                            <el-col :span="6">
                                <span>字段内容XX</span>
                            </el-col>
                        </el-row>
                        <el-row style="color: #90a4ae;margin-top: 20px">
                            <el-col :span="6">
                                <span>端口信息</span>
                            </el-col>
                            <el-col :span="6">
                                <span>Ipv4网关</span>
                            </el-col>
                            <el-col :span="6">
                                <span>Mac地址</span>
                            </el-col>
                            <el-col :span="6">
                                <span>端口</span>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <span>字段内容XXXXXX</span>
                            </el-col>
                            <el-col :span="6">
                                <span>字段内容XXXXXX</span>
                            </el-col>
                            <el-col :span="6">
                                <span>字段内容XXXXXX</span>
                            </el-col>
                            <el-col :span="6">
                                <span>字段内容XXXXXX</span>
                            </el-col>
                        </el-row>
                        <el-row style="color: #90a4ae;margin-top: 20px">
                            <el-col :span="6">
                                <span>IP地址</span>
                            </el-col>
                            <el-col :span="6">
                                <span>在线状态</span>
                            </el-col>
                            <el-col :span="6">
                                <span>通道号</span>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <span>字段内容XXXXXX</span>
                            </el-col>
                            <el-col :span="6">
                                <span>在线</span>
                            </el-col>
                            <el-col :span="6">
                                <span>5</span>
                            </el-col>
                        </el-row>
                    </el-collapse-item>
                    <el-collapse-item name="2">
                        <template slot="title">
                            已添加设备02
                            <el-dropdown style="float: right" @command="handleCommand2">
                                <div>
                                    <i class="el-icon-setting" style="float: right;font-size: xx-large"></i>
                                </div>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item command="a">IPC设置</el-dropdown-item>
                                    <el-dropdown-item command="b">删除</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </template>
                        <el-row style="color: #90a4ae;">
                            <el-col :span="6">
                                <span>设备型号</span>
                            </el-col>
                            <el-col :span="6">
                                <span>序列编号</span>
                            </el-col>
                            <el-col :span="6">
                                <span>激活状态</span>
                            </el-col>
                            <el-col :span="6">
                                <span>软件版本</span>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <span>字段内容XXXX</span>
                            </el-col>
                            <el-col :span="6">
                                <span>字段内容XXXXXX</span>
                            </el-col>
                            <el-col :span="6">
                                <span>字段内容</span>
                            </el-col>
                            <el-col :span="6">
                                <span>字段内容XX</span>
                            </el-col>
                        </el-row>
                        <el-row style="color: #90a4ae;margin-top: 20px">
                            <el-col :span="6">
                                <span>端口信息</span>
                            </el-col>
                            <el-col :span="6">
                                <span>Ipv4网关</span>
                            </el-col>
                            <el-col :span="6">
                                <span>Mac地址</span>
                            </el-col>
                            <el-col :span="6">
                                <span>端口</span>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <span>字段内容XXXXXX</span>
                            </el-col>
                            <el-col :span="6">
                                <span>字段内容XXXXXX</span>
                            </el-col>
                            <el-col :span="6">
                                <span>字段内容XXXXXX</span>
                            </el-col>
                            <el-col :span="6">
                                <span>字段内容XXXXXX</span>
                            </el-col>
                        </el-row>
                        <el-row style="color: #90a4ae;margin-top: 20px">
                            <el-col :span="6">
                                <span>IP地址</span>
                            </el-col>
                            <el-col :span="6">
                                <span>在线状态</span>
                            </el-col>
                            <el-col :span="6">
                                <span>通道号</span>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <span>字段内容XXXXXX</span>
                            </el-col>
                            <el-col :span="6">
                                <span>在线</span>
                            </el-col>
                            <el-col :span="6">
                                <span>5</span>
                            </el-col>
                        </el-row>
                    </el-collapse-item>
                    <el-collapse-item name="3">
                        <template slot="title">
                            已添加设备03
                            <el-dropdown style="float: right" @command="handleCommand3">
                                <div>
                                    <i class="el-icon-setting" style="float: right;font-size: xx-large"></i>
                                </div>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item command="a">IPC设置</el-dropdown-item>
                                    <el-dropdown-item command="b">删除</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </template>
                        <el-row style="color: #90a4ae;">
                            <el-col :span="6">
                                <span>设备型号</span>
                            </el-col>
                            <el-col :span="6">
                                <span>序列编号</span>
                            </el-col>
                            <el-col :span="6">
                                <span>激活状态</span>
                            </el-col>
                            <el-col :span="6">
                                <span>软件版本</span>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <span>字段内容XXXX</span>
                            </el-col>
                            <el-col :span="6">
                                <span>字段内容XXXXXX</span>
                            </el-col>
                            <el-col :span="6">
                                <span>字段内容</span>
                            </el-col>
                            <el-col :span="6">
                                <span>字段内容XX</span>
                            </el-col>
                        </el-row>
                        <el-row style="color: #90a4ae;margin-top: 20px">
                            <el-col :span="6">
                                <span>端口信息</span>
                            </el-col>
                            <el-col :span="6">
                                <span>Ipv4网关</span>
                            </el-col>
                            <el-col :span="6">
                                <span>Mac地址</span>
                            </el-col>
                            <el-col :span="6">
                                <span>端口</span>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <span>字段内容XXXXXX</span>
                            </el-col>
                            <el-col :span="6">
                                <span>字段内容XXXXXX</span>
                            </el-col>
                            <el-col :span="6">
                                <span>字段内容XXXXXX</span>
                            </el-col>
                            <el-col :span="6">
                                <span>字段内容XXXXXX</span>
                            </el-col>
                        </el-row>
                        <el-row style="color: #90a4ae;margin-top: 20px">
                            <el-col :span="6">
                                <span>IP地址</span>
                            </el-col>
                            <el-col :span="6">
                                <span>在线状态</span>
                            </el-col>
                            <el-col :span="6">
                                <span>通道号</span>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <span>字段内容XXXXXX</span>
                            </el-col>
                            <el-col :span="6">
                                <span>在线</span>
                            </el-col>
                            <el-col :span="6">
                                <span>5</span>
                            </el-col>
                        </el-row>
                    </el-collapse-item>
                    <el-collapse-item title="已添加设备04" name="4">
                        <template slot="title">
                            已添加设备04
                            <el-dropdown style="float: right" @command="handleCommand4">
                                <div>
                                    <i class="el-icon-setting" style="float: right;font-size: xx-large"></i>
                                </div>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item command="a">IPC设置</el-dropdown-item>
                                    <el-dropdown-item command="b">删除</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </template>
                        <el-row style="color: #90a4ae;">
                            <el-col :span="6">
                                <span>设备型号</span>
                            </el-col>
                            <el-col :span="6">
                                <span>序列编号</span>
                            </el-col>
                            <el-col :span="6">
                                <span>激活状态</span>
                            </el-col>
                            <el-col :span="6">
                                <span>软件版本</span>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <span>字段内容XXXX</span>
                            </el-col>
                            <el-col :span="6">
                                <span>字段内容XXXXXX</span>
                            </el-col>
                            <el-col :span="6">
                                <span>字段内容</span>
                            </el-col>
                            <el-col :span="6">
                                <span>字段内容XX</span>
                            </el-col>
                        </el-row>
                        <el-row style="color: #90a4ae;margin-top: 20px">
                            <el-col :span="6">
                                <span>端口信息</span>
                            </el-col>
                            <el-col :span="6">
                                <span>Ipv4网关</span>
                            </el-col>
                            <el-col :span="6">
                                <span>Mac地址</span>
                            </el-col>
                            <el-col :span="6">
                                <span>端口</span>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <span>字段内容XXXXXX</span>
                            </el-col>
                            <el-col :span="6">
                                <span>字段内容XXXXXX</span>
                            </el-col>
                            <el-col :span="6">
                                <span>字段内容XXXXXX</span>
                            </el-col>
                            <el-col :span="6">
                                <span>字段内容XXXXXX</span>
                            </el-col>
                        </el-row>
                        <el-row style="color: #90a4ae;margin-top: 20px">
                            <el-col :span="6">
                                <span>IP地址</span>
                            </el-col>
                            <el-col :span="6">
                                <span>在线状态</span>
                            </el-col>
                            <el-col :span="6">
                                <span>通道号</span>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <span>字段内容XXXXXX</span>
                            </el-col>
                            <el-col :span="6">
                                <span>在线</span>
                            </el-col>
                            <el-col :span="6">
                                <span>5</span>
                            </el-col>
                        </el-row>
                    </el-collapse-item>
                    <el-collapse-item title="已添加设备05" name="5">
                        <template slot="title">
                            已添加设备05
                            <el-dropdown style="float: right" @command="handleCommand5">
                                <div>
                                    <i class="el-icon-setting" style="float: right;font-size: xx-large"></i>
                                </div>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item command="a">IPC设置</el-dropdown-item>
                                    <el-dropdown-item command="b">删除</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </template>
                        <el-row style="color: #90a4ae;">
                            <el-col :span="6">
                                <span>设备型号</span>
                            </el-col>
                            <el-col :span="6">
                                <span>序列编号</span>
                            </el-col>
                            <el-col :span="6">
                                <span>激活状态</span>
                            </el-col>
                            <el-col :span="6">
                                <span>软件版本</span>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <span>字段内容XXXX</span>
                            </el-col>
                            <el-col :span="6">
                                <span>字段内容XXXXXX</span>
                            </el-col>
                            <el-col :span="6">
                                <span>字段内容</span>
                            </el-col>
                            <el-col :span="6">
                                <span>字段内容XX</span>
                            </el-col>
                        </el-row>
                        <el-row style="color: #90a4ae;margin-top: 20px">
                            <el-col :span="6">
                                <span>端口信息</span>
                            </el-col>
                            <el-col :span="6">
                                <span>Ipv4网关</span>
                            </el-col>
                            <el-col :span="6">
                                <span>Mac地址</span>
                            </el-col>
                            <el-col :span="6">
                                <span>端口</span>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <span>字段内容XXXXXX</span>
                            </el-col>
                            <el-col :span="6">
                                <span>字段内容XXXXXX</span>
                            </el-col>
                            <el-col :span="6">
                                <span>字段内容XXXXXX</span>
                            </el-col>
                            <el-col :span="6">
                                <span>字段内容XXXXXX</span>
                            </el-col>
                        </el-row>
                        <el-row style="color: #90a4ae;margin-top: 20px">
                            <el-col :span="6">
                                <span>IP地址</span>
                            </el-col>
                            <el-col :span="6">
                                <span>在线状态</span>
                            </el-col>
                            <el-col :span="6">
                                <span>通道号</span>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <span>字段内容XXXXXX</span>
                            </el-col>
                            <el-col :span="6">
                                <span>在线</span>
                            </el-col>
                            <el-col :span="6">
                                <span>5</span>
                            </el-col>
                        </el-row>
                    </el-collapse-item>
                    <el-collapse-item title="已添加设备06" name="6">
                        <template slot="title">
                            已添加设备06
                            <el-dropdown style="float: right" @command="handleCommand6">
                                <div>
                                    <i class="el-icon-setting" style="float: right;font-size: xx-large"></i>
                                </div>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item command="a">IPC设置</el-dropdown-item>
                                    <el-dropdown-item command="b">删除</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </template>
                        <el-row style="color: #90a4ae;">
                            <el-col :span="6">
                                <span>设备型号</span>
                            </el-col>
                            <el-col :span="6">
                                <span>序列编号</span>
                            </el-col>
                            <el-col :span="6">
                                <span>激活状态</span>
                            </el-col>
                            <el-col :span="6">
                                <span>软件版本</span>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <span>字段内容XXXX</span>
                            </el-col>
                            <el-col :span="6">
                                <span>字段内容XXXXXX</span>
                            </el-col>
                            <el-col :span="6">
                                <span>字段内容</span>
                            </el-col>
                            <el-col :span="6">
                                <span>字段内容XX</span>
                            </el-col>
                        </el-row>
                        <el-row style="color: #90a4ae;margin-top: 20px">
                            <el-col :span="6">
                                <span>端口信息</span>
                            </el-col>
                            <el-col :span="6">
                                <span>Ipv4网关</span>
                            </el-col>
                            <el-col :span="6">
                                <span>Mac地址</span>
                            </el-col>
                            <el-col :span="6">
                                <span>端口</span>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <span>字段内容XXXXXX</span>
                            </el-col>
                            <el-col :span="6">
                                <span>字段内容XXXXXX</span>
                            </el-col>
                            <el-col :span="6">
                                <span>字段内容XXXXXX</span>
                            </el-col>
                            <el-col :span="6">
                                <span>字段内容XXXXXX</span>
                            </el-col>
                        </el-row>
                        <el-row style="color: #90a4ae;margin-top: 20px">
                            <el-col :span="6">
                                <span>IP地址</span>
                            </el-col>
                            <el-col :span="6">
                                <span>在线状态</span>
                            </el-col>
                            <el-col :span="6">
                                <span>通道号</span>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <span>字段内容XXXXXX</span>
                            </el-col>
                            <el-col :span="6">
                                <span>在线</span>
                            </el-col>
                            <el-col :span="6">
                                <span>5</span>
                            </el-col>
                        </el-row>
                    </el-collapse-item>
                </el-collapse>
            </el-tab-pane>
            <el-tab-pane label="可添加设备" name="second">
                <el-collapse v-model="activeNames">
                    <el-collapse-item name="1">
                        <template slot="title">
                            可添加设备01
                            <el-dropdown style="float: right" @command="handleCommand01">
                                <div>
                                    <i class="el-icon-setting" style="float: right;font-size: xx-large"></i>
                                </div>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item command="a">快速添加</el-dropdown-item>
                                    <el-dropdown-item command="b">自定义添加</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </template>
                        <el-row style="color: #90a4ae;">
                            <el-col :span="6">
                                <span>设备型号</span>
                            </el-col>
                            <el-col :span="6">
                                <span>序列编号</span>
                            </el-col>
                            <el-col :span="6">
                                <span>激活状态</span>
                            </el-col>
                            <el-col :span="6">
                                <span>软件版本</span>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <span>字段内容XXXX</span>
                            </el-col>
                            <el-col :span="6">
                                <span>字段内容XXXXXX</span>
                            </el-col>
                            <el-col :span="6">
                                <span>字段内容</span>
                            </el-col>
                            <el-col :span="6">
                                <span>字段内容XX</span>
                            </el-col>
                        </el-row>
                        <el-row style="color: #90a4ae;margin-top: 20px">
                            <el-col :span="6">
                                <span>端口信息</span>
                            </el-col>
                            <el-col :span="6">
                                <span>Ipv4网关</span>
                            </el-col>
                            <el-col :span="6">
                                <span>Mac地址</span>
                            </el-col>
                            <el-col :span="6">
                                <span>端口</span>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <span>字段内容XXXXXX</span>
                            </el-col>
                            <el-col :span="6">
                                <span>字段内容XXXXXX</span>
                            </el-col>
                            <el-col :span="6">
                                <span>字段内容XXXXXX</span>
                            </el-col>
                            <el-col :span="6">
                                <span>字段内容XXXXXX</span>
                            </el-col>
                        </el-row>
                        <el-row style="color: #90a4ae;margin-top: 20px">
                            <el-col :span="6">
                                <span>IP地址</span>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <span>字段内容XXXXXX</span>
                            </el-col>
                        </el-row>
                    </el-collapse-item>
                    <el-collapse-item name="2">
                        <template slot="title">
                            可添加设备02
                            <el-dropdown style="float: right" @command="handleCommand02">
                                <div>
                                    <i class="el-icon-setting" style="float: right;font-size: xx-large"></i>
                                </div>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item command="a">快速添加</el-dropdown-item>
                                    <el-dropdown-item command="b">自定义添加</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </template>
                        <el-row style="color: #90a4ae;">
                            <el-col :span="6">
                                <span>设备型号</span>
                            </el-col>
                            <el-col :span="6">
                                <span>序列编号</span>
                            </el-col>
                            <el-col :span="6">
                                <span>激活状态</span>
                            </el-col>
                            <el-col :span="6">
                                <span>软件版本</span>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <span>字段内容XXXX</span>
                            </el-col>
                            <el-col :span="6">
                                <span>字段内容XXXXXX</span>
                            </el-col>
                            <el-col :span="6">
                                <span>字段内容</span>
                            </el-col>
                            <el-col :span="6">
                                <span>字段内容XX</span>
                            </el-col>
                        </el-row>
                        <el-row style="color: #90a4ae;margin-top: 20px">
                            <el-col :span="6">
                                <span>端口信息</span>
                            </el-col>
                            <el-col :span="6">
                                <span>Ipv4网关</span>
                            </el-col>
                            <el-col :span="6">
                                <span>Mac地址</span>
                            </el-col>
                            <el-col :span="6">
                                <span>端口</span>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <span>字段内容XXXXXX</span>
                            </el-col>
                            <el-col :span="6">
                                <span>字段内容XXXXXX</span>
                            </el-col>
                            <el-col :span="6">
                                <span>字段内容XXXXXX</span>
                            </el-col>
                            <el-col :span="6">
                                <span>字段内容XXXXXX</span>
                            </el-col>
                        </el-row>
                        <el-row style="color: #90a4ae;margin-top: 20px">
                            <el-col :span="6">
                                <span>IP地址</span>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <span>字段内容XXXXXX</span>
                            </el-col>
                        </el-row>
                    </el-collapse-item>
                    <el-collapse-item name="3">
                        <template slot="title">
                            可添加设备03
                            <el-dropdown style="float: right" @command="handleCommand03">
                                <div>
                                    <i class="el-icon-setting" style="float: right;font-size: xx-large"></i>
                                </div>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item command="a">快速添加</el-dropdown-item>
                                    <el-dropdown-item command="b">自定义添加</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </template>
                        <el-row style="color: #90a4ae;">
                            <el-col :span="6">
                                <span>设备型号</span>
                            </el-col>
                            <el-col :span="6">
                                <span>序列编号</span>
                            </el-col>
                            <el-col :span="6">
                                <span>激活状态</span>
                            </el-col>
                            <el-col :span="6">
                                <span>软件版本</span>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <span>字段内容XXXX</span>
                            </el-col>
                            <el-col :span="6">
                                <span>字段内容XXXXXX</span>
                            </el-col>
                            <el-col :span="6">
                                <span>字段内容</span>
                            </el-col>
                            <el-col :span="6">
                                <span>字段内容XX</span>
                            </el-col>
                        </el-row>
                        <el-row style="color: #90a4ae;margin-top: 20px">
                            <el-col :span="6">
                                <span>端口信息</span>
                            </el-col>
                            <el-col :span="6">
                                <span>Ipv4网关</span>
                            </el-col>
                            <el-col :span="6">
                                <span>Mac地址</span>
                            </el-col>
                            <el-col :span="6">
                                <span>端口</span>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <span>字段内容XXXXXX</span>
                            </el-col>
                            <el-col :span="6">
                                <span>字段内容XXXXXX</span>
                            </el-col>
                            <el-col :span="6">
                                <span>字段内容XXXXXX</span>
                            </el-col>
                            <el-col :span="6">
                                <span>字段内容XXXXXX</span>
                            </el-col>
                        </el-row>
                        <el-row style="color: #90a4ae;margin-top: 20px">
                            <el-col :span="6">
                                <span>IP地址</span>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <span>字段内容XXXXXX</span>
                            </el-col>
                        </el-row>
                    </el-collapse-item>
                    <el-collapse-item name="4">
                        <template slot="title">
                            可添加设备04
                            <el-dropdown style="float: right" @command="handleCommand04">
                                <div>
                                    <i class="el-icon-setting" style="float: right;font-size: xx-large"></i>
                                </div>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item command="a">快速添加</el-dropdown-item>
                                    <el-dropdown-item command="b">自定义添加</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </template>
                        <el-row style="color: #90a4ae;">
                            <el-col :span="6">
                                <span>设备型号</span>
                            </el-col>
                            <el-col :span="6">
                                <span>序列编号</span>
                            </el-col>
                            <el-col :span="6">
                                <span>激活状态</span>
                            </el-col>
                            <el-col :span="6">
                                <span>软件版本</span>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <span>字段内容XXXX</span>
                            </el-col>
                            <el-col :span="6">
                                <span>字段内容XXXXXX</span>
                            </el-col>
                            <el-col :span="6">
                                <span>字段内容</span>
                            </el-col>
                            <el-col :span="6">
                                <span>字段内容XX</span>
                            </el-col>
                        </el-row>
                        <el-row style="color: #90a4ae;margin-top: 20px">
                            <el-col :span="6">
                                <span>端口信息</span>
                            </el-col>
                            <el-col :span="6">
                                <span>Ipv4网关</span>
                            </el-col>
                            <el-col :span="6">
                                <span>Mac地址</span>
                            </el-col>
                            <el-col :span="6">
                                <span>端口</span>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <span>字段内容XXXXXX</span>
                            </el-col>
                            <el-col :span="6">
                                <span>字段内容XXXXXX</span>
                            </el-col>
                            <el-col :span="6">
                                <span>字段内容XXXXXX</span>
                            </el-col>
                            <el-col :span="6">
                                <span>字段内容XXXXXX</span>
                            </el-col>
                        </el-row>
                        <el-row style="color: #90a4ae;margin-top: 20px">
                            <el-col :span="6">
                                <span>IP地址</span>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <span>字段内容XXXXXX</span>
                            </el-col>
                        </el-row>
                    </el-collapse-item>
                    <el-collapse-item name="5">
                        <template slot="title">
                            可添加设备05
                            <el-dropdown style="float: right" @command="handleCommand05">
                                <div>
                                    <i class="el-icon-setting" style="float: right;font-size: xx-large"></i>
                                </div>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item command="a">快速添加</el-dropdown-item>
                                    <el-dropdown-item command="b">自定义添加</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </template>
                        <el-row style="color: #90a4ae;">
                            <el-col :span="6">
                                <span>设备型号</span>
                            </el-col>
                            <el-col :span="6">
                                <span>序列编号</span>
                            </el-col>
                            <el-col :span="6">
                                <span>激活状态</span>
                            </el-col>
                            <el-col :span="6">
                                <span>软件版本</span>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <span>字段内容XXXX</span>
                            </el-col>
                            <el-col :span="6">
                                <span>字段内容XXXXXX</span>
                            </el-col>
                            <el-col :span="6">
                                <span>字段内容</span>
                            </el-col>
                            <el-col :span="6">
                                <span>字段内容XX</span>
                            </el-col>
                        </el-row>
                        <el-row style="color: #90a4ae;margin-top: 20px">
                            <el-col :span="6">
                                <span>端口信息</span>
                            </el-col>
                            <el-col :span="6">
                                <span>Ipv4网关</span>
                            </el-col>
                            <el-col :span="6">
                                <span>Mac地址</span>
                            </el-col>
                            <el-col :span="6">
                                <span>端口</span>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <span>字段内容XXXXXX</span>
                            </el-col>
                            <el-col :span="6">
                                <span>字段内容XXXXXX</span>
                            </el-col>
                            <el-col :span="6">
                                <span>字段内容XXXXXX</span>
                            </el-col>
                            <el-col :span="6">
                                <span>字段内容XXXXXX</span>
                            </el-col>
                        </el-row>
                        <el-row style="color: #90a4ae;margin-top: 20px">
                            <el-col :span="6">
                                <span>IP地址</span>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <span>字段内容XXXXXX</span>
                            </el-col>
                        </el-row>
                    </el-collapse-item>
                    <el-collapse-item name="6">
                        <template slot="title">
                            可添加设备06
                            <el-dropdown style="float: right" @command="handleCommand06">
                                <div>
                                    <i class="el-icon-setting" style="float: right;font-size: xx-large"></i>
                                </div>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item command="a">快速添加</el-dropdown-item>
                                    <el-dropdown-item command="b">自定义添加</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </template>
                        <el-row style="color: #90a4ae;">
                            <el-col :span="6">
                                <span>设备型号</span>
                            </el-col>
                            <el-col :span="6">
                                <span>序列编号</span>
                            </el-col>
                            <el-col :span="6">
                                <span>激活状态</span>
                            </el-col>
                            <el-col :span="6">
                                <span>软件版本</span>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <span>字段内容XXXX</span>
                            </el-col>
                            <el-col :span="6">
                                <span>字段内容XXXXXX</span>
                            </el-col>
                            <el-col :span="6">
                                <span>字段内容</span>
                            </el-col>
                            <el-col :span="6">
                                <span>字段内容XX</span>
                            </el-col>
                        </el-row>
                        <el-row style="color: #90a4ae;margin-top: 20px">
                            <el-col :span="6">
                                <span>端口信息</span>
                            </el-col>
                            <el-col :span="6">
                                <span>Ipv4网关</span>
                            </el-col>
                            <el-col :span="6">
                                <span>Mac地址</span>
                            </el-col>
                            <el-col :span="6">
                                <span>端口</span>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <span>字段内容XXXXXX</span>
                            </el-col>
                            <el-col :span="6">
                                <span>字段内容XXXXXX</span>
                            </el-col>
                            <el-col :span="6">
                                <span>字段内容XXXXXX</span>
                            </el-col>
                            <el-col :span="6">
                                <span>字段内容XXXXXX</span>
                            </el-col>
                        </el-row>
                        <el-row style="color: #90a4ae;margin-top: 20px">
                            <el-col :span="6">
                                <span>IP地址</span>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <span>字段内容XXXXXX</span>
                            </el-col>
                        </el-row>
                    </el-collapse-item>
                </el-collapse>
            </el-tab-pane>
        </el-tabs>

        <el-dialog  :visible.sync="dialogVisible1" >
            此操作将会删除“已添加设备01”，是否确认删除？
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible1 = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible1 = false" style="background-color: grey">删 除</el-button>
            </span>
        </el-dialog>
        <el-dialog  :visible.sync="dialogVisible2" >
            此操作将会删除“已添加设备02”，是否确认删除？
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible2 = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible2 = false" style="background-color: grey">删 除</el-button>
            </span>
        </el-dialog>
        <el-dialog  :visible.sync="dialogVisible3" >
            此操作将会删除“已添加设备03”，是否确认删除？
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible3 = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible3 = false" style="background-color: grey">删 除</el-button>
            </span>
        </el-dialog>
        <el-dialog  :visible.sync="dialogVisible4" >
            此操作将会删除“已添加设备04”，是否确认删除？
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible4 = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible4 = false" style="background-color: grey">删 除</el-button>
            </span>
        </el-dialog>
        <el-dialog  :visible.sync="dialogVisible5" >
            此操作将会删除“已添加设备05”，是否确认删除？
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible5 = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible5 = false" style="background-color: grey">删 除</el-button>
            </span>
        </el-dialog>
        <el-dialog  :visible.sync="dialogVisible6" >
            此操作将会删除“已添加设备06”，是否确认删除？
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible6 = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible6 = false" style="background-color: grey">删 除</el-button>
            </span>
        </el-dialog>

        <el-dialog title="快速添加" :visible.sync="dialogVisible01" >
            <el-row><el-col>序列号</el-col></el-row>
            <el-row style="color: #1a1a1a"><el-col>字段内容xxxx</el-col></el-row>
            <el-row style="margin-top: 10px"><el-col>型号</el-col></el-row>
            <el-row style="color: #1a1a1a"><el-col>字段内容xxxx</el-col></el-row>
            <el-row style="margin-top: 10px"><el-col>MAC地址</el-col></el-row>
            <el-row style="color: #1a1a1a"><el-col>字段内容xxxx</el-col></el-row>
            <el-row style="margin-top: 10px"><el-col>用户名</el-col></el-row>
            <el-row style="color: #1a1a1a"><el-col>Admin</el-col></el-row>
            <el-row style="color: #1a1a1a;margin-top: 10px"><el-col>密码</el-col></el-row>
            <el-input></el-input>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible01 = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible01 = false">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="快速添加" :visible.sync="dialogVisible02" >
            <el-row><el-col>序列号</el-col></el-row>
            <el-row style="color: #1a1a1a"><el-col>字段内容xxxx</el-col></el-row>
            <el-row style="margin-top: 10px"><el-col>型号</el-col></el-row>
            <el-row style="color: #1a1a1a"><el-col>字段内容xxxx</el-col></el-row>
            <el-row style="margin-top: 10px"><el-col>MAC地址</el-col></el-row>
            <el-row style="color: #1a1a1a"><el-col>字段内容xxxx</el-col></el-row>
            <el-row style="margin-top: 10px"><el-col>用户名</el-col></el-row>
            <el-row style="color: #1a1a1a"><el-col>Admin</el-col></el-row>
            <el-row style="color: #1a1a1a;margin-top: 10px"><el-col>密码</el-col></el-row>
            <el-input></el-input>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible02 = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible02 = false">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="快速添加" :visible.sync="dialogVisible03" >
            <el-row><el-col>序列号</el-col></el-row>
            <el-row style="color: #1a1a1a"><el-col>字段内容xxxx</el-col></el-row>
            <el-row style="margin-top: 10px"><el-col>型号</el-col></el-row>
            <el-row style="color: #1a1a1a"><el-col>字段内容xxxx</el-col></el-row>
            <el-row style="margin-top: 10px"><el-col>MAC地址</el-col></el-row>
            <el-row style="color: #1a1a1a"><el-col>字段内容xxxx</el-col></el-row>
            <el-row style="margin-top: 10px"><el-col>用户名</el-col></el-row>
            <el-row style="color: #1a1a1a"><el-col>Admin</el-col></el-row>
            <el-row style="color: #1a1a1a;margin-top: 10px"><el-col>密码</el-col></el-row>
            <el-input></el-input>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible03 = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible03 = false">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="快速添加" :visible.sync="dialogVisible04" >
            <el-row><el-col>序列号</el-col></el-row>
            <el-row style="color: #1a1a1a"><el-col>字段内容xxxx</el-col></el-row>
            <el-row style="margin-top: 10px"><el-col>型号</el-col></el-row>
            <el-row style="color: #1a1a1a"><el-col>字段内容xxxx</el-col></el-row>
            <el-row style="margin-top: 10px"><el-col>MAC地址</el-col></el-row>
            <el-row style="color: #1a1a1a"><el-col>字段内容xxxx</el-col></el-row>
            <el-row style="margin-top: 10px"><el-col>用户名</el-col></el-row>
            <el-row style="color: #1a1a1a"><el-col>Admin</el-col></el-row>
            <el-row style="color: #1a1a1a;margin-top: 10px"><el-col>密码</el-col></el-row>
            <el-input></el-input>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible04 = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible04 = false">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="快速添加" :visible.sync="dialogVisible05" >
            <el-row><el-col>序列号</el-col></el-row>
            <el-row style="color: #1a1a1a"><el-col>字段内容xxxx</el-col></el-row>
            <el-row style="margin-top: 10px"><el-col>型号</el-col></el-row>
            <el-row style="color: #1a1a1a"><el-col>字段内容xxxx</el-col></el-row>
            <el-row style="margin-top: 10px"><el-col>MAC地址</el-col></el-row>
            <el-row style="color: #1a1a1a"><el-col>字段内容xxxx</el-col></el-row>
            <el-row style="margin-top: 10px"><el-col>用户名</el-col></el-row>
            <el-row style="color: #1a1a1a"><el-col>Admin</el-col></el-row>
            <el-row style="color: #1a1a1a;margin-top: 10px"><el-col>密码</el-col></el-row>
            <el-input></el-input>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible05 = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible05 = false">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="快速添加" :visible.sync="dialogVisible06" >
            <el-row><el-col>序列号</el-col></el-row>
            <el-row style="color: #1a1a1a"><el-col>字段内容xxxx</el-col></el-row>
            <el-row style="margin-top: 10px"><el-col>型号</el-col></el-row>
            <el-row style="color: #1a1a1a"><el-col>字段内容xxxx</el-col></el-row>
            <el-row style="margin-top: 10px"><el-col>MAC地址</el-col></el-row>
            <el-row style="color: #1a1a1a"><el-col>字段内容xxxx</el-col></el-row>
            <el-row style="margin-top: 10px"><el-col>用户名</el-col></el-row>
            <el-row style="color: #1a1a1a"><el-col>Admin</el-col></el-row>
            <el-row style="color: #1a1a1a;margin-top: 10px"><el-col>密码</el-col></el-row>
            <el-input></el-input>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible06 = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible06 = false">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="自定义添加" :visible.sync="dialogVisible001" >
            <el-row><el-col>序列号</el-col></el-row>
            <el-row style="color: #1a1a1a"><el-col>字段内容xxxx</el-col></el-row>
            <el-row style="margin-top: 10px"><el-col>型号</el-col></el-row>
            <el-row style="color: #1a1a1a"><el-col>字段内容xxxx</el-col></el-row>
            <el-row style="margin-top: 10px"><el-col>MAC地址</el-col></el-row>
            <el-row style="color: #1a1a1a"><el-col>字段内容xxxx</el-col></el-row>
            <el-row style="margin-top: 10px"><el-col>用户名</el-col></el-row>
            <el-input></el-input>
            <el-row style="margin-top: 10px"><el-col>密码</el-col></el-row>
            <el-input></el-input>
            <el-row style="margin-top: 10px"><el-col>通道号</el-col></el-row>
            <el-select></el-select>
            <el-row style="margin-top: 10px"><el-col>协议类型</el-col></el-row>
            <el-select></el-select>
            <el-row style="margin-top: 10px"><el-col>IP地址</el-col></el-row>
            <el-select></el-select>
            <el-row style="margin-top: 10px"><el-col>端口</el-col></el-row>
            <el-select></el-select>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible001 = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible001 = false">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="自定义添加" :visible.sync="dialogVisible002" >
            <el-row><el-col>序列号</el-col></el-row>
            <el-row style="color: #1a1a1a"><el-col>字段内容xxxx</el-col></el-row>
            <el-row style="margin-top: 10px"><el-col>型号</el-col></el-row>
            <el-row style="color: #1a1a1a"><el-col>字段内容xxxx</el-col></el-row>
            <el-row style="margin-top: 10px"><el-col>MAC地址</el-col></el-row>
            <el-row style="color: #1a1a1a"><el-col>字段内容xxxx</el-col></el-row>
            <el-row style="margin-top: 10px"><el-col>用户名</el-col></el-row>
            <el-input></el-input>
            <el-row style="margin-top: 10px"><el-col>密码</el-col></el-row>
            <el-input></el-input>
            <el-row style="margin-top: 10px"><el-col>通道号</el-col></el-row>
            <el-select></el-select>
            <el-row style="margin-top: 10px"><el-col>协议类型</el-col></el-row>
            <el-select></el-select>
            <el-row style="margin-top: 10px"><el-col>IP地址</el-col></el-row>
            <el-select></el-select>
            <el-row style="margin-top: 10px"><el-col>端口</el-col></el-row>
            <el-select></el-select>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible002 = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible002 = false">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="自定义添加" :visible.sync="dialogVisible003" >
            <el-row><el-col>序列号</el-col></el-row>
            <el-row style="color: #1a1a1a"><el-col>字段内容xxxx</el-col></el-row>
            <el-row style="margin-top: 10px"><el-col>型号</el-col></el-row>
            <el-row style="color: #1a1a1a"><el-col>字段内容xxxx</el-col></el-row>
            <el-row style="margin-top: 10px"><el-col>MAC地址</el-col></el-row>
            <el-row style="color: #1a1a1a"><el-col>字段内容xxxx</el-col></el-row>
            <el-row style="margin-top: 10px"><el-col>用户名</el-col></el-row>
            <el-input></el-input>
            <el-row style="margin-top: 10px"><el-col>密码</el-col></el-row>
            <el-input></el-input>
            <el-row style="margin-top: 10px"><el-col>通道号</el-col></el-row>
            <el-select></el-select>
            <el-row style="margin-top: 10px"><el-col>协议类型</el-col></el-row>
            <el-select></el-select>
            <el-row style="margin-top: 10px"><el-col>IP地址</el-col></el-row>
            <el-select></el-select>
            <el-row style="margin-top: 10px"><el-col>端口</el-col></el-row>
            <el-select></el-select>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible003 = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible003 = false">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="自定义添加" :visible.sync="dialogVisible004" >
            <el-row><el-col>序列号</el-col></el-row>
            <el-row style="color: #1a1a1a"><el-col>字段内容xxxx</el-col></el-row>
            <el-row style="margin-top: 10px"><el-col>型号</el-col></el-row>
            <el-row style="color: #1a1a1a"><el-col>字段内容xxxx</el-col></el-row>
            <el-row style="margin-top: 10px"><el-col>MAC地址</el-col></el-row>
            <el-row style="color: #1a1a1a"><el-col>字段内容xxxx</el-col></el-row>
            <el-row style="margin-top: 10px"><el-col>用户名</el-col></el-row>
            <el-input></el-input>
            <el-row style="margin-top: 10px"><el-col>密码</el-col></el-row>
            <el-input></el-input>
            <el-row style="margin-top: 10px"><el-col>通道号</el-col></el-row>
            <el-select></el-select>
            <el-row style="margin-top: 10px"><el-col>协议类型</el-col></el-row>
            <el-select></el-select>
            <el-row style="margin-top: 10px"><el-col>IP地址</el-col></el-row>
            <el-select></el-select>
            <el-row style="margin-top: 10px"><el-col>端口</el-col></el-row>
            <el-select></el-select>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible004 = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible004 = false">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="自定义添加" :visible.sync="dialogVisible005" >
            <el-row><el-col>序列号</el-col></el-row>
            <el-row style="color: #1a1a1a"><el-col>字段内容xxxx</el-col></el-row>
            <el-row style="margin-top: 10px"><el-col>型号</el-col></el-row>
            <el-row style="color: #1a1a1a"><el-col>字段内容xxxx</el-col></el-row>
            <el-row style="margin-top: 10px"><el-col>MAC地址</el-col></el-row>
            <el-row style="color: #1a1a1a"><el-col>字段内容xxxx</el-col></el-row>
            <el-row style="margin-top: 10px"><el-col>用户名</el-col></el-row>
            <el-input></el-input>
            <el-row style="margin-top: 10px"><el-col>密码</el-col></el-row>
            <el-input></el-input>
            <el-row style="margin-top: 10px"><el-col>通道号</el-col></el-row>
            <el-select></el-select>
            <el-row style="margin-top: 10px"><el-col>协议类型</el-col></el-row>
            <el-select></el-select>
            <el-row style="margin-top: 10px"><el-col>IP地址</el-col></el-row>
            <el-select></el-select>
            <el-row style="margin-top: 10px"><el-col>端口</el-col></el-row>
            <el-select></el-select>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible005 = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible005 = false">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="自定义添加" :visible.sync="dialogVisible006" >
            <el-row><el-col>序列号</el-col></el-row>
            <el-row style="color: #1a1a1a"><el-col>字段内容xxxx</el-col></el-row>
            <el-row style="margin-top: 10px"><el-col>型号</el-col></el-row>
            <el-row style="color: #1a1a1a"><el-col>字段内容xxxx</el-col></el-row>
            <el-row style="margin-top: 10px"><el-col>MAC地址</el-col></el-row>
            <el-row style="color: #1a1a1a"><el-col>字段内容xxxx</el-col></el-row>
            <el-row style="margin-top: 10px"><el-col>用户名</el-col></el-row>
            <el-input></el-input>
            <el-row style="margin-top: 10px"><el-col>密码</el-col></el-row>
            <el-input></el-input>
            <el-row style="margin-top: 10px"><el-col>通道号</el-col></el-row>
            <el-select></el-select>
            <el-row style="margin-top: 10px"><el-col>协议类型</el-col></el-row>
            <el-select></el-select>
            <el-row style="margin-top: 10px"><el-col>IP地址</el-col></el-row>
            <el-select></el-select>
            <el-row style="margin-top: 10px"><el-col>端口</el-col></el-row>
            <el-select></el-select>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible006 = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible006 = false">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
export default {
    name: "ipc",
    data () {
        return {
            activeNames: ['1'],
            activeName: 'first',
            dialogVisible1: false,
            dialogVisible2: false,
            dialogVisible3: false,
            dialogVisible4: false,
            dialogVisible5: false,
            dialogVisible6: false,
            dialogVisible01: false,
            dialogVisible02: false,
            dialogVisible03: false,
            dialogVisible04: false,
            dialogVisible05: false,
            dialogVisible06: false,
            dialogVisible001: false,
            dialogVisible002: false,
            dialogVisible003: false,
            dialogVisible004: false,
            dialogVisible005: false,
            dialogVisible006: false,
        }
    },
    methods: {
        handleCommand1(command) {
            if(command==='b') {
                this.dialogVisible1 = true
            }
        },
        handleCommand2(command) {
            if(command==='b') {
                this.dialogVisible2 = true
            }
        },
        handleCommand3(command) {
            if(command==='b') {
                this.dialogVisible3 = true
            }
        },
        handleCommand4(command) {
            if(command==='b') {
                this.dialogVisible4 = true
            }
        },
        handleCommand5(command) {
            if(command==='b') {
                this.dialogVisible5 = true
            }
        },
        handleCommand6(command) {
            if(command==='b') {
                this.dialogVisible6 = true
            }
        },
        handleCommand01(command) {
            if(command==='a') {
                this.dialogVisible01 = true
            }else {
                this.dialogVisible001 = true
            }
        },
        handleCommand02(command) {
            if(command==='a') {
                this.dialogVisible02 = true
            }else {
                this.dialogVisible002 = true
            }
        },
        handleCommand03(command) {
            if(command==='a') {
                this.dialogVisible03 = true
            }else {
                this.dialogVisible003 = true
            }
        },
        handleCommand04(command) {
            if(command==='a') {
                this.dialogVisible04 = true
            }else {
                this.dialogVisible004 = true
            }
        },
        handleCommand05(command) {
            if(command==='a') {
                this.dialogVisible05 = true
            }else {
                this.dialogVisible005 = true
            }
        },
        handleCommand06(command) {
            if(command==='a') {
                this.dialogVisible06 = true
            }else {
                this.dialogVisible006 = true
            }
        }
    }
}
</script>

<style scoped>

</style>