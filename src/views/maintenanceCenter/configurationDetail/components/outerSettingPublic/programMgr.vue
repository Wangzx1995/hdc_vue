<template>
  <div class="p-a-md">
    <h2>基础设置</h2>
    <el-form ref="PublicProgramMgr" label-position="top" :model="form" :rules="rules" style="margin-top: 10px">
    <template v-if="form['IsApiProgramMgrInfo']">
      <el-tabs v-model="activeName" @tab-click="changeTabs(activeName)">
        <el-tab-pane :label="sensorNameJson[item.name]" :name="item.name" v-for="(item,index) in tablist" :key="item.index" >
          <template v-if="item.name == activeName">
            <el-row type="flex" justify="space-between">
              <el-col :span="7">
                <el-form-item label="是否使能">
                  <el-switch v-model="form['IsApiProgramMgrInfo_'+index]['pageList'].playCount" :active-value="Number(1)" :inactive-value="Number(0)"></el-switch>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row type="flex" justify="space-between">
              <el-col :span="6">
                <el-form-item class="textCenter" label="">
                  <el-button @click="setPageList(index,1)" :type="form['IsApiProgramMgrInfo']['pageList'][index].windowSplitMode == 'SLIP1' ? 'success':'default'" :radius="true">1分屏</el-button>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item class="textCenter" label="">
                  <el-button @click="setPageList(index,4)" :type="form['IsApiProgramMgrInfo']['pageList'][index].windowSplitMode == 'SLIP4' ? 'success':'default'" :radius="true">4分屏</el-button>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item class="textCenter" label="">
                  <el-button @click="setPageList(index,6)" :type="form['IsApiProgramMgrInfo']['pageList'][index].windowSplitMode == 'SLIP6' ? 'success':'default'" :radius="true">6分屏</el-button>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item class="textCenter" label="">
                  <el-button @click="setPageList(index,9)" :type="form['IsApiProgramMgrInfo']['pageList'][index].windowSplitMode == 'SLIP9' ? 'success':'default'" :radius="true">9分屏</el-button>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="form['IsApiProgramMgrInfo_'+index]['pageList'].windowSplitMode == 'SLIP1'" type="flex" justify="space-between">
              <el-col :span="5">
              </el-col>
              <el-col :span="12">
                <el-popover
                  placement="top"
                  trigger="click"
                  width="240">
                  <el-select v-model="form['IsApiProgramMgrInfo_'+index]['pageList'].windowList[0].inputChannel">
                    <el-option
                      v-for="item in inputChannelList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <el-form-item slot="reference" class="textCenter" label="">
                    <div  class="channelShow1">{{'通道'+form['IsApiProgramMgrInfo_'+index]['pageList'].windowList[0].inputChannel}}</div>
                  </el-form-item>
                </el-popover>
              </el-col>
              <el-col :span="5">
              </el-col>
            </el-row>
            <el-row v-else-if="form['IsApiProgramMgrInfo_'+index]['pageList'].windowSplitMode == 'SLIP4'" type="flex" justify="space-between">
              <el-col :span="11">
                <el-popover
                  placement="top"
                  trigger="click"
                  width="240">
                  <el-select v-model="form['IsApiProgramMgrInfo_'+index]['pageList'].windowList[0].inputChannel">
                    <el-option
                      v-for="item in inputChannelList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <el-form-item slot="reference" class="textCenter" label="">
                    <div class="channelShow2">{{'通道'+form['IsApiProgramMgrInfo_'+index]['pageList'].windowList[0].inputChannel}}</div>
                  </el-form-item>
                </el-popover>
                <el-popover
                  placement="top"
                  trigger="click"
                  width="240">
                  <el-select v-model="form['IsApiProgramMgrInfo_'+index]['pageList'].windowList[2].inputChannel">
                    <el-option
                      v-for="item in inputChannelList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <el-form-item slot="reference" class="textCenter" label="">
                    <div  class="channelShow2">{{'通道'+form['IsApiProgramMgrInfo_'+index]['pageList'].windowList[2].inputChannel}}</div>
                  </el-form-item>
                </el-popover>
              </el-col>
              <el-col :span="11">
                <el-popover
                  placement="top"
                  trigger="click"
                  width="240">
                  <el-select v-model="form['IsApiProgramMgrInfo_'+index]['pageList'].windowList[1].inputChannel">
                    <el-option
                      v-for="item in inputChannelList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <el-form-item slot="reference" class="textCenter" label="">
                    <div  class="channelShow2">{{'通道'+form['IsApiProgramMgrInfo_'+index]['pageList'].windowList[1].inputChannel}}</div>
                  </el-form-item>
                </el-popover>
                <el-popover
                  placement="top"
                  trigger="click"
                  width="240">
                  <el-select v-model="form['IsApiProgramMgrInfo_'+index]['pageList'].windowList[3].inputChannel">
                    <el-option
                      v-for="item in inputChannelList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <el-form-item slot="reference" class="textCenter" label="">
                    <div  class="channelShow2">{{'通道'+form['IsApiProgramMgrInfo_'+index]['pageList'].windowList[3].inputChannel}}</div>
                  </el-form-item>
                </el-popover>
              </el-col>
            </el-row>
            <el-row v-else-if="form['IsApiProgramMgrInfo_'+index]['pageList'].windowSplitMode == 'SLIP6'" type="flex" justify="space-between">
              <el-col :span="15">
                <el-popover
                  placement="top"
                  trigger="click"
                  width="240">
                  <el-select v-model="form['IsApiProgramMgrInfo_'+index]['pageList'].windowList[0].inputChannel">
                    <el-option
                      v-for="item in inputChannelList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <el-form-item slot="reference" class="textCenter" label="">
                    <div  class="channelShow3">{{'通道'+form['IsApiProgramMgrInfo_'+index]['pageList'].windowList[0].inputChannel}}</div>
                  </el-form-item>
                </el-popover>
                <div class="contentBottom" type="flex" justify="space-between">
                    <el-popover
                      placement="top"
                      trigger="click"
                      width="240">
                      <el-select v-model="form['IsApiProgramMgrInfo_'+index]['pageList'].windowList[5].inputChannel">
                        <el-option
                          v-for="item in inputChannelList"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                      <el-form-item slot="reference" class="textCenter" style="width:48%;float:left" label="">
                        <div class="channelShow4">{{'通道'+form['IsApiProgramMgrInfo_'+index]['pageList'].windowList[5].inputChannel}}</div>
                      </el-form-item>
                    </el-popover>
                    <el-popover
                      placement="top"
                      trigger="click"
                      width="240">
                      <el-select v-model="form['IsApiProgramMgrInfo_'+index]['pageList'].windowList[4].inputChannel">
                        <el-option
                          v-for="item in inputChannelList"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                      <el-form-item slot="reference" class="textCenter" style="width:48%;float:right" label="">
                        <div  class="channelShow4">{{'通道'+form['IsApiProgramMgrInfo_'+index]['pageList'].windowList[4].inputChannel}}</div>
                      </el-form-item>
                    </el-popover>
                </div>
              </el-col>
              <el-col :span="7">
                <el-popover
                  placement="top"
                  trigger="click"
                  width="240">
                  <el-select v-model="form['IsApiProgramMgrInfo_'+index]['pageList'].windowList[1].inputChannel">
                    <el-option
                      v-for="item in inputChannelList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <el-form-item slot="reference" class="textCenter" label="">
                    <div  class="channelShow4">{{'通道'+form['IsApiProgramMgrInfo_'+index]['pageList'].windowList[1].inputChannel}}</div>
                  </el-form-item>
                </el-popover>
                <el-popover
                  placement="top"
                  trigger="click"
                  width="240">
                  <el-select v-model="form['IsApiProgramMgrInfo_'+index]['pageList'].windowList[2].inputChannel">
                    <el-option
                      v-for="item in inputChannelList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <el-form-item slot="reference" class="textCenter" label="">
                    <div  class="channelShow4">{{'通道'+form['IsApiProgramMgrInfo_'+index]['pageList'].windowList[2].inputChannel}}</div>
                  </el-form-item>
                </el-popover>
                <el-popover
                  placement="top"
                  trigger="click"
                  width="240">
                  <el-select v-model="form['IsApiProgramMgrInfo_'+index]['pageList'].windowList[3].inputChannel">
                    <el-option
                      v-for="item in inputChannelList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <el-form-item slot="reference" class="textCenter" label="">
                    <div  class="channelShow4">{{'通道'+form['IsApiProgramMgrInfo_'+index]['pageList'].windowList[3].inputChannel}}</div>
                  </el-form-item>
                </el-popover>
              </el-col>
            </el-row>
            <el-row v-else-if="form['IsApiProgramMgrInfo']['pageList'][index].windowSplitMode == 'SLIP9'" type="flex" justify="space-between">
              <el-col :span="7">
                <el-popover
                  placement="top"
                  trigger="click"
                  width="240">
                  <el-select v-model="form['IsApiProgramMgrInfo_'+index]['pageList'].windowList[0].inputChannel">
                    <el-option
                      v-for="item in inputChannelList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <el-form-item slot="reference" class="textCenter" label="">
                    <div  class="channelShow4">{{'通道'+form['IsApiProgramMgrInfo_'+index]['pageList'].windowList[0].inputChannel}}</div>
                  </el-form-item>
                </el-popover>
                <el-popover
                  placement="top"
                  trigger="click"
                  width="240">
                  <el-select v-model="form['IsApiProgramMgrInfo_'+index]['pageList'].windowList[3].inputChannel">
                    <el-option
                      v-for="item in inputChannelList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <el-form-item slot="reference" class="textCenter" label="">
                    <div  class="channelShow4">{{'通道'+form['IsApiProgramMgrInfo_'+index]['pageList'].windowList[3].inputChannel}}</div>
                  </el-form-item>
                </el-popover>
                <el-popover
                  placement="top"
                  trigger="click"
                  width="240">
                  <el-select v-model="form['IsApiProgramMgrInfo_'+index]['pageList'].windowList[6].inputChannel">
                    <el-option
                      v-for="item in inputChannelList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <el-form-item slot="reference" class="textCenter" label="">
                    <div  class="channelShow4">{{'通道'+form['IsApiProgramMgrInfo_'+index]['pageList'].windowList[6].inputChannel}}</div>
                  </el-form-item>
                </el-popover>
              </el-col>
              <el-col :span="7">
                <el-popover
                  placement="top"
                  trigger="click"
                  width="240">
                  <el-select v-model="form['IsApiProgramMgrInfo_'+index]['pageList'].windowList[1].inputChannel">
                    <el-option
                      v-for="item in inputChannelList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <el-form-item slot="reference" class="textCenter" label="">
                    <div  class="channelShow4">{{'通道'+form['IsApiProgramMgrInfo_'+index]['pageList'].windowList[1].inputChannel}}</div>
                  </el-form-item>
                </el-popover>
                <el-popover
                  placement="top"
                  trigger="click"
                  width="240">
                  <el-select v-model="form['IsApiProgramMgrInfo_'+index]['pageList'].windowList[4].inputChannel">
                    <el-option
                      v-for="item in inputChannelList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <el-form-item slot="reference" class="textCenter" label="">
                    <div  class="channelShow4">{{'通道'+form['IsApiProgramMgrInfo_'+index]['pageList'].windowList[4].inputChannel}}</div>
                  </el-form-item>
                </el-popover>
                <el-popover
                  placement="top"
                  trigger="click"
                  width="240">
                  <el-select v-model="form['IsApiProgramMgrInfo_'+index]['pageList'].windowList[7].inputChannel">
                    <el-option
                      v-for="item in inputChannelList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <el-form-item slot="reference" class="textCenter" label="">
                    <div  class="channelShow4">{{'通道'+form['IsApiProgramMgrInfo_'+index]['pageList'].windowList[7].inputChannel}}</div>
                  </el-form-item>
                </el-popover>
              </el-col>
                <el-col :span="7">
                <el-popover
                  placement="top"
                  trigger="click"
                  width="240">
                  <el-select v-model="form['IsApiProgramMgrInfo_'+index]['pageList'].windowList[2].inputChannel">
                    <el-option
                      v-for="item in inputChannelList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <el-form-item slot="reference" class="textCenter" label="">
                    <div  class="channelShow4">{{'通道'+form['IsApiProgramMgrInfo_'+index]['pageList'].windowList[2].inputChannel}}</div>
                  </el-form-item>
                </el-popover>
                <el-popover
                  placement="top"
                  trigger="click"
                  width="240">
                  <el-select v-model="form['IsApiProgramMgrInfo_'+index]['pageList'].windowList[5].inputChannel">
                    <el-option
                      v-for="item in inputChannelList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <el-form-item slot="reference" class="textCenter" label="">
                    <div  class="channelShow4">{{'通道'+form['IsApiProgramMgrInfo_'+index]['pageList'].windowList[5].inputChannel}}</div>
                  </el-form-item>
                </el-popover>
                <el-popover
                  placement="top"
                  trigger="click"
                  width="240">
                  <el-select v-model="form['IsApiProgramMgrInfo_'+index]['pageList'].windowList[8].inputChannel">
                    <el-option
                      v-for="item in inputChannelList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <el-form-item slot="reference" class="textCenter" label="">
                    <div  class="channelShow4">{{'通道'+form['IsApiProgramMgrInfo_'+index]['pageList'].windowList[8].inputChannel}}</div>
                  </el-form-item>
                </el-popover>
              </el-col>
            </el-row>
          </template>  
        </el-tab-pane>
      </el-tabs>
    </template>   
    <template v-if="form['IsApiSensorInInfoCapability'] && form['IsApiSensorInInfo']">
      <el-tabs v-model="activeName" @tab-click="changeTabs(activeName)">
        <el-tab-pane v-if="form['IsApiPreviewSwitchInfo']" label="预览模式" name="default">
          <el-row type="flex" justify="space-between">
              <el-col :span="6">
                <el-form-item class="textCenter" label="">
                  <el-button @click="setPageList('',1)" :type="form['IsApiPreviewSwitchInfo']['previewFrameNo'] == '1' ? 'success':'default'" :radius="true">1分屏</el-button>
                </el-form-item>
              </el-col>
              <el-col v-if="activeName=='default'" :span="6">
                <el-form-item class="textCenter" label="">
                  <el-button @click="setPageList('',4)" :type="form['IsApiPreviewSwitchInfo']['previewFrameNo'] == '4' ? 'success':'default'" :radius="true">4分屏</el-button>
                </el-form-item>
              </el-col>
              <el-col v-if="activeName=='default'" :span="6">
                <el-form-item class="textCenter" label="">
                  <el-button @click="setPageList('',6)" :type="form['IsApiPreviewSwitchInfo']['previewFrameNo'] == '6' ? 'success':'default'" :radius="true">6分屏</el-button>
                </el-form-item>
              </el-col>
              <el-col v-if="activeName=='default'" :span="6">
                <el-form-item class="textCenter" label="">
                  <el-button @click="setPageList('',9)" :type="form['IsApiPreviewSwitchInfo']['previewFrameNo'] == '9' ? 'success':'default'" :radius="true">9分屏</el-button>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="form['IsApiPreviewSwitchInfo']['previewFrameNo'] == '1' && previewSwitchInfoInputChannelList.length" type="flex" justify="space-between">
              <el-col :span="5">
              </el-col>
              <el-col :span="12">
                <el-popover
                  placement="top"
                  trigger="click"
                  width="240">
                  <el-select v-model="form['IsApiPreviewSwitchInfo']['displayWindowList'][0].displayChannelNo">
                    <el-option
                      v-for="item in previewSwitchInfoInputChannelList[0].channelList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <el-form-item slot="reference" class="textCenter" label="">
                    <div class="channelShow1">{{'通道'+form['IsApiPreviewSwitchInfo']['displayWindowList'][0].displayChannelNo}}</div>
                  </el-form-item>
                </el-popover>
              </el-col>
              <el-col :span="5">
              </el-col>
            </el-row>
            <el-row v-else-if="form['IsApiPreviewSwitchInfo']['previewFrameNo'] == '4' && previewSwitchInfoInputChannelList.length" type="flex" justify="space-between">
              <el-col :span="11">
                <el-popover
                  placement="top"
                  trigger="click"
                  width="240">
                  <el-select v-model="form['IsApiPreviewSwitchInfo']['displayWindowList'][0].displayChannelNo">
                    <el-option
                      v-for="item in previewSwitchInfoInputChannelList[0].channelList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <el-form-item slot="reference" class="textCenter" label="">
                    <div  class="channelShow2">{{'通道'+form['IsApiPreviewSwitchInfo']['displayWindowList'][0].displayChannelNo}}</div>
                  </el-form-item>
                </el-popover>
                <el-popover
                  placement="top"
                  trigger="click"
                  width="240">
                  <el-select v-model="form['IsApiPreviewSwitchInfo']['displayWindowList'][2].displayChannelNo">
                    <el-option
                      v-for="item in previewSwitchInfoInputChannelList[2].channelList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <el-form-item slot="reference" class="textCenter" label="">
                    <div  class="channelShow2">{{'通道'+form['IsApiPreviewSwitchInfo']['displayWindowList'][2].displayChannelNo}}</div>
                  </el-form-item>
                </el-popover>
              </el-col>
              <el-col :span="11">
                <el-popover
                  placement="top"
                  trigger="click"
                  width="240">
                  <el-select v-model="form['IsApiPreviewSwitchInfo']['displayWindowList'][1].displayChannelNo">
                    <el-option
                      v-for="item in previewSwitchInfoInputChannelList[1].channelList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <el-form-item slot="reference" class="textCenter" label="">
                    <div  class="channelShow2">{{'通道'+form['IsApiPreviewSwitchInfo']['displayWindowList'][1].displayChannelNo}}</div>
                  </el-form-item>
                </el-popover>
                <el-popover
                  placement="top"
                  trigger="click"
                  width="240">
                  <el-select v-model="form['IsApiPreviewSwitchInfo']['displayWindowList'][3].displayChannelNo">
                    <el-option
                      v-for="item in previewSwitchInfoInputChannelList[3].channelList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <el-form-item slot="reference" class="textCenter" label="">
                    <div  class="channelShow2">{{'通道'+form['IsApiPreviewSwitchInfo']['displayWindowList'][3].displayChannelNo}}</div>
                  </el-form-item>
                </el-popover>
              </el-col>
            </el-row>
            <el-row v-else-if="form['IsApiPreviewSwitchInfo']['previewFrameNo'] == '6' && previewSwitchInfoInputChannelList.length" type="flex" justify="space-between">
              <el-col :span="15">
                <el-popover
                  placement="top"
                  trigger="click"
                  width="240">
                  <el-select v-model="form['IsApiPreviewSwitchInfo']['displayWindowList'][0].displayChannelNo">
                    <el-option
                      v-for="item in previewSwitchInfoInputChannelList[0].channelList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <el-form-item slot="reference" class="textCenter" label="">
                    <div  class="channelShow3">{{'通道'+form['IsApiPreviewSwitchInfo']['displayWindowList'][0].displayChannelNo}}</div>
                  </el-form-item>
                </el-popover>
                <div class="contentBottom" type="flex" justify="space-between">
                    <el-popover
                      placement="top"
                      trigger="click"
                      width="240">
                      <el-select v-model="form['IsApiPreviewSwitchInfo']['displayWindowList'][5].displayChannelNo">
                        <el-option
                          v-for="item in previewSwitchInfoInputChannelList[5].channelList"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                      <el-form-item slot="reference" class="textCenter" style="width:48%;float:left" label="">
                        <div class="channelShow4">{{'通道'+form['IsApiPreviewSwitchInfo']['displayWindowList'][5].displayChannelNo}}</div>
                      </el-form-item>
                    </el-popover>
                    <el-popover
                      placement="top"
                      trigger="click"
                      width="240">
                      <el-select v-model="form['IsApiPreviewSwitchInfo']['displayWindowList'][4].displayChannelNo">
                        <el-option
                          v-for="item in previewSwitchInfoInputChannelList[4].channelList"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                      <el-form-item slot="reference" class="textCenter" style="width:48%;float:right" label="">
                        <div  class="channelShow4">{{'通道'+form['IsApiPreviewSwitchInfo']['displayWindowList'][4].displayChannelNo}}</div>
                      </el-form-item>
                    </el-popover>
                </div>
              </el-col>
              <el-col :span="7">
                <el-popover
                  placement="top"
                  trigger="click"
                  width="240">
                  <el-select v-model="form['IsApiPreviewSwitchInfo']['displayWindowList'][1].displayChannelNo">
                    <el-option
                      v-for="item in previewSwitchInfoInputChannelList[1].channelList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <el-form-item slot="reference" class="textCenter" label="">
                    <div  class="channelShow4">{{'通道'+form['IsApiPreviewSwitchInfo']['displayWindowList'][1].displayChannelNo}}</div>
                  </el-form-item>
                </el-popover>
                <el-popover
                  placement="top"
                  trigger="click"
                  width="240">
                  <el-select v-model="form['IsApiPreviewSwitchInfo']['displayWindowList'][2].displayChannelNo">
                    <el-option
                      v-for="item in previewSwitchInfoInputChannelList[2].channelList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <el-form-item slot="reference" class="textCenter" label="">
                    <div  class="channelShow4">{{'通道'+form['IsApiPreviewSwitchInfo']['displayWindowList'][2].displayChannelNo}}</div>
                  </el-form-item>
                </el-popover>
                <el-popover
                  placement="top"
                  trigger="click"
                  width="240">
                  <el-select v-model="form['IsApiPreviewSwitchInfo']['displayWindowList'][3].displayChannelNo">
                    <el-option
                      v-for="item in previewSwitchInfoInputChannelList[3].channelList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <el-form-item slot="reference" class="textCenter" label="">
                    <div  class="channelShow4">{{'通道'+form['IsApiPreviewSwitchInfo']['displayWindowList'][3].displayChannelNo}}</div>
                  </el-form-item>
                </el-popover>
              </el-col>
            </el-row>
            <el-row v-else-if="form['IsApiPreviewSwitchInfo']['previewFrameNo'] == '9' && previewSwitchInfoInputChannelList.length" type="flex" justify="space-between">
              <el-col :span="7">
                <el-popover
                  placement="top"
                  trigger="click"
                  width="240">
                  <el-select v-model="form['IsApiPreviewSwitchInfo']['displayWindowList'][0].displayChannelNo">
                    <el-option
                      v-for="item in previewSwitchInfoInputChannelList[0].channelList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <el-form-item slot="reference" class="textCenter" label="">
                    <div  class="channelShow4">{{'通道'+form['IsApiPreviewSwitchInfo']['displayWindowList'][0].displayChannelNo}}</div>
                  </el-form-item>
                </el-popover>
                <el-popover
                  placement="top"
                  trigger="click"
                  width="240">
                  <el-select v-model="form['IsApiPreviewSwitchInfo']['displayWindowList'][3].displayChannelNo">
                    <el-option
                      v-for="item in previewSwitchInfoInputChannelList[3].channelList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <el-form-item slot="reference" class="textCenter" label="">
                    <div  class="channelShow4">{{'通道'+form['IsApiPreviewSwitchInfo']['displayWindowList'][3].displayChannelNo}}</div>
                  </el-form-item>
                </el-popover>
                <el-popover
                  placement="top"
                  trigger="click"
                  width="240">
                  <el-select v-model="form['IsApiPreviewSwitchInfo']['displayWindowList'][6].displayChannelNo">
                    <el-option
                      v-for="item in previewSwitchInfoInputChannelList[6].channelList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <el-form-item slot="reference" class="textCenter" label="">
                    <div  class="channelShow4">{{'通道'+form['IsApiPreviewSwitchInfo']['displayWindowList'][6].displayChannelNo}}</div>
                  </el-form-item>
                </el-popover>
              </el-col>
              <el-col :span="7">
                <el-popover
                  placement="top"
                  trigger="click"
                  width="240">
                  <el-select v-model="form['IsApiPreviewSwitchInfo']['displayWindowList'][1].displayChannelNo">
                    <el-option
                      v-for="item in previewSwitchInfoInputChannelList[1].channelList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <el-form-item slot="reference" class="textCenter" label="">
                    <div  class="channelShow4">{{'通道'+form['IsApiPreviewSwitchInfo']['displayWindowList'][1].displayChannelNo}}</div>
                  </el-form-item>
                </el-popover>
                <el-popover
                  placement="top"
                  trigger="click"
                  width="240">
                  <el-select v-model="form['IsApiPreviewSwitchInfo']['displayWindowList'][4].displayChannelNo">
                    <el-option
                      v-for="item in previewSwitchInfoInputChannelList[4].channelList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <el-form-item slot="reference" class="textCenter" label="">
                    <div  class="channelShow4">{{'通道'+form['IsApiPreviewSwitchInfo']['displayWindowList'][4].displayChannelNo}}</div>
                  </el-form-item>
                </el-popover>
                <el-popover
                  placement="top"
                  trigger="click"
                  width="240">
                  <el-select v-model="form['IsApiPreviewSwitchInfo']['displayWindowList'][7].displayChannelNo">
                    <el-option
                      v-for="item in previewSwitchInfoInputChannelList[7].channelList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <el-form-item slot="reference" class="textCenter" label="">
                    <div  class="channelShow4">{{'通道'+form['IsApiPreviewSwitchInfo']['displayWindowList'][7].displayChannelNo}}</div>
                  </el-form-item>
                </el-popover>
              </el-col>
                <el-col :span="7">
                <el-popover
                  placement="top"
                  trigger="click"
                  width="240">
                  <el-select v-model="form['IsApiPreviewSwitchInfo']['displayWindowList'][2].displayChannelNo">
                    <el-option
                      v-for="item in previewSwitchInfoInputChannelList[2].channelList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <el-form-item slot="reference" class="textCenter" label="">
                    <div  class="channelShow4">{{'通道'+form['IsApiPreviewSwitchInfo']['displayWindowList'][2].displayChannelNo}}</div>
                  </el-form-item>
                </el-popover>
                <el-popover
                  placement="top"
                  trigger="click"
                  width="240">
                  <el-select v-model="form['IsApiPreviewSwitchInfo']['displayWindowList'][5].displayChannelNo">
                    <el-option
                      v-for="item in previewSwitchInfoInputChannelList[5].channelList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <el-form-item slot="reference" class="textCenter" label="">
                    <div  class="channelShow4">{{'通道'+form['IsApiPreviewSwitchInfo']['displayWindowList'][5].displayChannelNo}}</div>
                  </el-form-item>
                </el-popover>
                <el-popover
                  placement="top"
                  trigger="click"
                  width="240">
                  <el-select v-model="form['IsApiPreviewSwitchInfo']['displayWindowList'][8].displayChannelNo">
                    <el-option
                      v-for="item in previewSwitchInfoInputChannelList[8].channelList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <el-form-item slot="reference" class="textCenter" label="">
                    <div  class="channelShow4">{{'通道'+form['IsApiPreviewSwitchInfo']['displayWindowList'][8].displayChannelNo}}</div>
                  </el-form-item>
                </el-popover>
              </el-col>
            </el-row>
        </el-tab-pane>
        <el-tab-pane :label="sensorNameJson[item.sensorName]" :name="item.sensorName" v-for="(item,index) in form['IsApiSensorInInfoCapability']['sensorInCapabilityInfoList']" :key="item.index" >
          <template v-if="item.sensorName == activeName">
            <el-row type="flex" justify="space-between">
              <el-col :span="7">
                <el-form-item label="是否使能">
                  <el-switch v-model="form['IsApiSensorInInfo_'+index].enabled"></el-switch>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row type="flex" justify="space-between">
                <el-col :span="5">
              </el-col>
              <el-col :span="12">
                <el-popover
                  placement="top"
                  trigger="click"
                  width="240">
                  <el-select v-model="form['IsApiSensorInInfo_'+index].channelNo">
                    <el-option
                      v-for="item in inputChannelList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <el-form-item slot="reference" class="textCenter" label="">
                    <div class="channelShow1">{{'通道'+form['IsApiSensorInInfo_'+index].channelNo}}</div>
                  </el-form-item>
                </el-popover>
              </el-col>
              <el-col :span="5">
              </el-col>
            </el-row>
          </template>  
        </el-tab-pane>
      </el-tabs>
    </template>
    </el-form>
  </div>
</template>

<script>
import {validateNum} from '@/utils/validate';
import Qs from 'qs'
export default {
  props:{
    isTemplate:{
      type:String
    },
    detail:{
      type: Object,
      default:()=>{
        return {}
      }
    },
     configParams:{
      type:Boolean,
      default:false
    },
    allCopyData:{
      type: Object,
      default:()=>{
        return {}
      }
    },
    formDetail:{
      type: Object,
      default:()=>{
        return {}
      }
    }
  },
  watch:{
    detail: {
      handler (newVal,oldVal) {
        this.form = newVal
      },
      deep: true,
      immediate:true,
    },
    formDetail:{
      handler (newVal,oldVal) {
        console.log(newVal)
        this.formData = newVal
      },
      deep: true,
      immediate:true,
    },
    allCopyData: {
      handler (newVal,oldVal) {
        console.log(newVal)
        this.copyForm = newVal
      },
      deep: true,
      immediate:true,
    },
    copyForm: {
      handler (val) {
        console.log(val)
        if (JSON.stringify(val) !== '{}'){
          this.$emit('changeCopy',val)
        }
      },
      deep: true,
      immediate:false,
    },
    configParams:{
        handler (val) {
        if(!val){
          this.getByIsApi();
        }
      },
      deep: true,
      immediate:true,
    },
    form: {
      handler (val) {
        if (JSON.stringify(val) !== '{}'){
          this.$emit('change',val)
        }
      },
      deep: true,
      immediate:true,
    },
    'form.IsApiSensorInInfo_0':{
      handler(val){
        if(val != undefined){
          this.formData['IsApiSensorInInfo_0.enabled'] = val['enabled'] != this.copyForm['IsApiSensorInInfo_0']['enabled'] ? `IsApiSensorInInfo_0.enabled&外设输出设置/视频输出设置/${val['sensorName']}/是否使能&${val['enabled'] ? '开启' : '关闭'}` : '';
          this.formData['IsApiSensorInInfo_0.channelNo'] = val['channelNo'] != this.copyForm['IsApiSensorInInfo_0']['channelNo'] ? `IsApiSensorInInfo_0.channelNo&外设输出设置/视频输出设置/${val['sensorName']}/通道号&通道${val['channelNo']}` : ''
        }
        this.$emit('changeData',this.formData)
      },
      deep: true,
      immediate:false,
    },
    'form.IsApiSensorInInfo_1':{
      handler(val){
        if(val != undefined){
          this.formData['IsApiSensorInInfo_1.enabled'] = val['enabled'] != this.copyForm['IsApiSensorInInfo_1']['enabled'] ? `IsApiSensorInInfo_1.enabled&外设输出设置/视频输出设置/${val['sensorName']}/是否使能&${val['enabled'] ? '开启' : '关闭'}` : '';
          this.formData['IsApiSensorInInfo_1.channelNo'] = val['channelNo'] != this.copyForm['IsApiSensorInInfo_1']['channelNo'] ? `IsApiSensorInInfo_1.channelNo&外设输出设置/视频输出设置/${val['sensorName']}/通道号&通道${val['channelNo']}` : ''
        }
        this.$emit('changeData',this.formData)
      },
      deep: true,
      immediate:false,
    },
    'form.IsApiSensorInInfo_2':{
      handler(val){
        if(val != undefined){
          this.formData['IsApiSensorInInfo_2.enabled'] = val['enabled'] != this.copyForm['IsApiSensorInInfo_2']['enabled'] ? `IsApiSensorInInfo_2.enabled&外设输出设置/视频输出设置/${val['sensorName']}/是否使能&${val['enabled'] ? '开启' : '关闭'}` : '';
          this.formData['IsApiSensorInInfo_2.channelNo'] = val['channelNo'] != this.copyForm['IsApiSensorInInfo_2']['channelNo'] ? `IsApiSensorInInfo_2.channelNo&外设输出设置/视频输出设置/${val['sensorName']}/通道号&通道${val['channelNo']}` : ''
        }
        this.$emit('changeData',this.formData)
      },
      deep: true,
      immediate:false,
    },
    'form.IsApiSensorInInfo_3':{
      handler(val){
        if(val != undefined){
          this.formData['IsApiSensorInInfo_3.enabled'] = val['enabled'] != this.copyForm['IsApiSensorInInfo_3']['enabled'] ? `IsApiSensorInInfo_3.enabled&外设输出设置/视频输出设置/${val['sensorName']}/是否使能&${val['enabled'] ? '开启' : '关闭'}` : '';
          this.formData['IsApiSensorInInfo_3.channelNo'] = val['channelNo'] != this.copyForm['IsApiSensorInInfo_3']['channelNo'] ? `IsApiSensorInInfo_3.channelNo&外设输出设置/视频输出设置/${val['sensorName']}/通道号&通道${val['channelNo']}` : ''
        }
        this.$emit('changeData',this.formData)
      },
      deep: true,
      immediate:false,
    },
    'form.IsApiSensorInInfo_4':{
      handler(val){
        if(val != undefined){
          this.formData['IsApiSensorInInfo_4.enabled'] = val['enabled'] != this.copyForm['IsApiSensorInInfo_4']['enabled'] ? `IsApiSensorInInfo_4.enabled&外设输出设置/视频输出设置/${val['sensorName']}/是否使能&${val['enabled'] ? '开启' : '关闭'}` : '';
          this.formData['IsApiSensorInInfo_4.channelNo'] = val['channelNo'] != this.copyForm['IsApiSensorInInfo_4']['channelNo'] ? `IsApiSensorInInfo_4.channelNo&外设输出设置/视频输出设置/${val['sensorName']}/通道号&通道${val['channelNo']}` : '';
          this.$emit('changeData',this.formData)
        }
      },
      deep: true,
      immediate:false,
    },
    'form.IsApiPreviewSwitchInfo':{
      handler(val){
        if(val != undefined){
          this.formData['IsApiPreviewSwitchInfo.previewFrameNo'] = val['previewFrameNo'] != this.copyForm['IsApiPreviewSwitchInfo']['previewFrameNo'] ? `IsApiPreviewSwitchInfo.previewFrameNo&外设输出设置/视频输出设置/default&${val['previewFrameNo']}分屏` : '';
          this.$emit('changeData',this.formData)
          if(val['previewFrameNo'] == this.copyForm['IsApiPreviewSwitchInfo']['previewFrameNo']){
            switch(val['previewFrameNo']){
              case "1":
                this.formData['IsApiPreviewSwitchInfo.displayWindowList.0.displayChannelNo'] = val['displayWindowList'][0]['displayChannelNo'] != this.copyForm['IsApiPreviewSwitchInfo']['displayWindowList'][0]['displayChannelNo'] ? `IsApiPreviewSwitchInfo.displayWindowList.0.displayChannelNo&外设输出设置/视频输出设置/default/1分屏&通道${val['displayWindowList'][0]['displayChannelNo']}` : '';
                this.$emit('changeData',this.formData)
              break;
              case "4":
                let channelChange4 = false;
                let channelString4 = ''
                for(let i = 0;i < 4;i++){
                  if(val['displayWindowList'][i]['displayChannelNo'] != this.copyForm['IsApiPreviewSwitchInfo']['displayWindowList'][i]['displayChannelNo']){
                    channelChange4 = true;
                    break
                  }
                }
                channelString4 = channelChange4 ? `通道${val['displayWindowList'][0]['displayChannelNo']}、通道${val['displayWindowList'][1]['displayChannelNo']}、通道${val['displayWindowList'][2]['displayChannelNo']}、通道${val['displayWindowList'][3]['displayChannelNo']}` : ''
                this.formData['IsApiPreviewSwitchInfo.displayWindowList'] = channelChange4 ? `IsApiPreviewSwitchInfo.displayWindowList&外设输出设置/视频输出设置/default/4分屏&${channelString4}` : ''
                this.$emit('changeData',this.formData)
              break;
              case "6":
                let channelChange6 = false;
                let channelString6 = ''
                for(let i = 0;i < 6;i++){
                  if(val['displayWindowList'][i]['displayChannelNo'] != this.copyForm['IsApiPreviewSwitchInfo']['displayWindowList'][i]['displayChannelNo']){
                    channelChange6 = true;
                    break
                  }
                }
                channelString6 = channelChange6 ? `通道${val['displayWindowList'][0]['displayChannelNo']}、通道${val['displayWindowList'][1]['displayChannelNo']}、通道${val['displayWindowList'][2]['displayChannelNo']}、通道${val['displayWindowList'][3]['displayChannelNo']}、通道${val['displayWindowList'][4]['displayChannelNo']}、通道${val['displayWindowList'][5]['displayChannelNo']}` : ''
                this.formData['IsApiPreviewSwitchInfo.displayWindowList'] = channelChange6 ? `IsApiPreviewSwitchInfo.displayWindowList&外设输出设置/视频输出设置/default/6分屏&${channelString6}` : ''
                this.$emit('changeData',this.formData)
              break;
              case "9":
                let channelChange9 = false;
                let channelString9 = ''
                for(let i = 0;i < 9;i++){
                  if(val['displayWindowList'][i]['displayChannelNo'] != this.copyForm['IsApiPreviewSwitchInfo']['displayWindowList'][i]['displayChannelNo']){
                    channelChange9 = true;
                    break
                  }
                }
                channelString9 = channelChange9 ? `通道${val['displayWindowList'][0]['displayChannelNo']}、通道${val['displayWindowList'][1]['displayChannelNo']}、通道${val['displayWindowList'][2]['displayChannelNo']}、通道${val['displayWindowList'][3]['displayChannelNo']}、通道${val['displayWindowList'][4]['displayChannelNo']}、通道${val['displayWindowList'][5]['displayChannelNo']}、通道${val['displayWindowList'][6]['displayChannelNo']}、通道${val['displayWindowList'][7]['displayChannelNo']}、通道${val['displayWindowList'][8]['displayChannelNo']}` : ''
                this.formData['IsApiPreviewSwitchInfo.displayWindowList'] = channelChange9 ? `IsApiPreviewSwitchInfo.displayWindowList&外设输出设置/视频输出设置/default/9分屏&${channelString9}` : ''
                this.$emit('changeData',this.formData)
              break;
            }
          }
        }
      },
      deep: true,
      immediate:false,
    },
    'form.IsApiProgramMgrInfo_0':{
      handler(val){
        if(val != undefined){
          this.formData['IsApiProgramMgrInfo_0.pageList.windowSplitMode.nothing'] = val['pageList']['windowSplitMode'] != this.copyForm['IsApiProgramMgrInfo_0']['pageList']['windowSplitMode'] ? `IsApiProgramMgrInfo_0.pageList.windowSplitMode.nothing&外设输出设置/视频输出设置/${val['pageList']['pageName']}&${val['pageList']['windowList'].length}分屏` : '';
          this.$emit('changeData',this.formData)
          if(val['pageList']['windowSplitMode'] == this.copyForm['IsApiProgramMgrInfo_0']['pageList']['windowSplitMode']){
            switch(val['pageList']['windowSplitMode']){
              case "SLIP1":
                this.formData['IsApiProgramMgrInfo_0.pageList.windowList.0.inputChannel'] = val['pageList']['windowList'][0]['inputChannel'] != this.copyForm['IsApiProgramMgrInfo_0']['pageList']['windowList'][0]['inputChannel'] ? `IsApiProgramMgrInfo_0.pageList.windowList.0.inputChannel&外设输出设置/视频输出设置/${val['pageList']['pageName']}/1分屏&通道${val['pageList']['windowList'][0]['inputChannel']}` : '';
                this.$emit('changeData',this.formData)
              break;
              case "SLIP4":
                let channelChange4 = false;
                let channelString4 = ''
                for(let i = 0;i < 4;i++){
                  if(val['pageList']['windowList'][i]['inputChannel'] != this.copyForm['IsApiProgramMgrInfo_0']['pageList']['windowList'][i]['inputChannel']){
                    channelChange4 = true;
                    break
                  }
                }
                channelString4 = channelChange4 ? `通道${val['pageList']['windowList'][0]['inputChannel']}、通道${val['pageList']['windowList'][1]['inputChannel']}、通道${val['pageList']['windowList'][2]['inputChannel']}、通道${val['pageList']['windowList'][3]['inputChannel']}` : ''
                this.formData['IsApiProgramMgrInfo_0.pageList.windowList.nothing'] = channelChange4 ? `IsApiProgramMgrInfo_0.pageList.windowList.nothing&外设输出设置/视频输出设置/${val['pageList']['pageName']}/4分屏&${channelString4}` : ''
                this.$emit('changeData',this.formData)
              break;
              case "SLIP6":
                let channelChange6 = false;
                let channelString6 = ''
                for(let i = 0;i < 6;i++){
                  if(val['pageList']['windowList'][i]['inputChannel'] != this.copyForm['IsApiProgramMgrInfo_0']['pageList']['windowList'][i]['inputChannel']){
                    channelChange6 = true;
                    break
                  }
                }
                channelString6 = channelChange6 ? `通道${val['pageList']['windowList'][0]['inputChannel']}、通道${val['pageList']['windowList'][1]['inputChannel']}、通道${val['pageList']['windowList'][2]['inputChannel']}、通道${val['pageList']['windowList'][3]['inputChannel']}、通道${val['pageList']['windowList'][4]['inputChannel']}、通道${val['pageList']['windowList'][5]['inputChannel']}` : ''
                this.formData['IsApiProgramMgrInfo_0.pageList.windowList.nothing'] = channelChange6 ? `IsApiProgramMgrInfo_0.pageList.windowList.nothing&外设输出设置/视频输出设置/${val['pageList']['pageName']}/6分屏&${channelString6}` : ''
                this.$emit('changeData',this.formData)
              break;
              case "SLIP9":
                let channelChange9 = false;
                let channelString9 = ''
                for(let i = 0;i < 9;i++){
                  if(val['pageList']['windowList'][i]['inputChannel'] != this.copyForm['IsApiProgramMgrInfo_0']['pageList']['windowList'][i]['inputChannel']){
                    channelChange9 = true;
                    break
                  }
                }
                channelString9 = channelChange9 ? `通道${val['pageList']['windowList'][0]['inputChannel']}、通道${val['pageList']['windowList'][1]['inputChannel']}、通道${val['pageList']['windowList'][2]['inputChannel']}、通道${val['pageList']['windowList'][3]['inputChannel']}、通道${val['pageList']['windowList'][4]['inputChannel']}、通道${val['pageList']['windowList'][5]['inputChannel']}、通道${val['pageList']['windowList'][6]['inputChannel']}、通道${val['pageList']['windowList'][7]['inputChannel']}、通道${val['pageList']['windowList'][8]['inputChannel']}` : ''
                this.formData['IsApiProgramMgrInfo_0.pageList.windowList.nothing'] = channelChange9 ? `IsApiProgramMgrInfo_0.pageList.windowList.nothing&外设输出设置/视频输出设置/${val['pageList']['pageName']}/9分屏&${channelString9}` : ''
                this.$emit('changeData',this.formData)
              break;
            }
          }
        }
      },
      deep: true,
      immediate:false,
    },
    'form.IsApiProgramMgrInfo_1':{
      handler(val){
        if(val != undefined){
          this.formData['IsApiProgramMgrInfo_1.pageList.windowSplitMode.nothing'] = val['pageList']['windowSplitMode'] != this.copyForm['IsApiProgramMgrInfo_1']['pageList']['windowSplitMode'] ? `IsApiProgramMgrInfo_1.pageList.windowSplitMode.nothing&外设输出设置/视频输出设置/${val['pageList']['pageName']}&${val['pageList']['windowList'].length}分屏` : '';
          this.$emit('changeData',this.formData)
          if(val['pageList']['windowSplitMode'] == this.copyForm['IsApiProgramMgrInfo_1']['pageList']['windowSplitMode']){
            switch(val['pageList']['windowSplitMode']){
              case "SLIP1":
                this.formData['IsApiProgramMgrInfo_1.pageList.windowList.0.inputChannel'] = val['pageList']['windowList'][0]['inputChannel'] != this.copyForm['IsApiProgramMgrInfo_1']['pageList']['windowList'][0]['inputChannel'] ? `IsApiProgramMgrInfo_1.pageList.windowList.0.inputChannel&外设输出设置/视频输出设置/${val['pageList']['pageName']}/1分屏&通道${val['pageList']['windowList'][0]['inputChannel']}` : '';
                this.$emit('changeData',this.formData)
              break;
              case "SLIP4":
                let channelChange4 = false;
                let channelString4 = ''
                for(let i = 0;i < 4;i++){
                  if(val['pageList']['windowList'][i]['inputChannel'] != this.copyForm['IsApiProgramMgrInfo_1']['pageList']['windowList'][i]['inputChannel']){
                    channelChange4 = true;
                    break
                  }
                }
                channelString4 = channelChange4 ? `通道${val['pageList']['windowList'][0]['inputChannel']}、通道${val['pageList']['windowList'][1]['inputChannel']}、通道${val['pageList']['windowList'][2]['inputChannel']}、通道${val['pageList']['windowList'][3]['inputChannel']}` : ''
                this.formData['IsApiProgramMgrInfo_1.pageList.windowList.nothing'] = channelChange4 ? `IsApiProgramMgrInfo_1.pageList.windowList.nothing&外设输出设置/视频输出设置/${val['pageList']['pageName']}/4分屏&${channelString4}` : ''
                this.$emit('changeData',this.formData)
              break;
              case "SLIP6":
                let channelChange6 = false;
                let channelString6 = ''
                for(let i = 0;i < 6;i++){
                  if(val['pageList']['windowList'][i]['inputChannel'] != this.copyForm['IsApiProgramMgrInfo_1']['pageList']['windowList'][i]['inputChannel']){
                    channelChange6 = true;
                    break
                  }
                }
                channelString6 = channelChange6 ? `通道${val['pageList']['windowList'][0]['inputChannel']}、通道${val['pageList']['windowList'][1]['inputChannel']}、通道${val['pageList']['windowList'][2]['inputChannel']}、通道${val['pageList']['windowList'][3]['inputChannel']}、通道${val['pageList']['windowList'][4]['inputChannel']}、通道${val['pageList']['windowList'][5]['inputChannel']}` : ''
                this.formData['IsApiProgramMgrInfo_1.pageList.windowList.nothing'] = channelChange6 ? `IsApiProgramMgrInfo_1.pageList.windowList.nothing&外设输出设置/视频输出设置/${val['pageList']['pageName']}/6分屏&${channelString6}` : ''
                this.$emit('changeData',this.formData)
              break;
              case "SLIP9":
                let channelChange9 = false;
                let channelString9 = ''
                for(let i = 0;i < 9;i++){
                  if(val['pageList']['windowList'][i]['inputChannel'] != this.copyForm['IsApiProgramMgrInfo_1']['pageList']['windowList'][i]['inputChannel']){
                    channelChange9 = true;
                    break
                  }
                }
                channelString9 = channelChange9 ? `通道${val['pageList']['windowList'][0]['inputChannel']}、通道${val['pageList']['windowList'][1]['inputChannel']}、通道${val['pageList']['windowList'][2]['inputChannel']}、通道${val['pageList']['windowList'][3]['inputChannel']}、通道${val['pageList']['windowList'][4]['inputChannel']}、通道${val['pageList']['windowList'][5]['inputChannel']}、通道${val['pageList']['windowList'][6]['inputChannel']}、通道${val['pageList']['windowList'][7]['inputChannel']}、通道${val['pageList']['windowList'][8]['inputChannel']}` : ''
                this.formData['IsApiProgramMgrInfo_1.pageList.windowList.nothing'] = channelChange9 ? `IsApiProgramMgrInfo_1.pageList.windowList.nothing&外设输出设置/视频输出设置/${val['pageList']['pageName']}/9分屏&${channelString9}` : ''
                this.$emit('changeData',this.formData)
              break;
            }
          }
        }
      },
      deep: true,
      immediate:false,
    },
    'form.IsApiProgramMgrInfo_2':{
      handler(val){
        if(val != undefined){
          this.formData['IsApiProgramMgrInfo_2.pageList.windowSplitMode.nothing'] = val['pageList']['windowSplitMode'] != this.copyForm['IsApiProgramMgrInfo_2']['pageList']['windowSplitMode'] ? `IsApiProgramMgrInfo_2.pageList.windowSplitMode.nothing&外设输出设置/视频输出设置/${val['pageList']['pageName']}&${val['pageList']['windowList'].length}分屏` : '';
          this.$emit('changeData',this.formData)
          if(val['pageList']['windowSplitMode'] == this.copyForm['IsApiProgramMgrInfo_2']['pageList']['windowSplitMode']){
            switch(val['pageList']['windowSplitMode']){
              case "SLIP1":
                this.formData['IsApiProgramMgrInfo_2.pageList.windowList.0.inputChannel'] = val['pageList']['windowList'][0]['inputChannel'] != this.copyForm['IsApiProgramMgrInfo_2']['pageList']['windowList'][0]['inputChannel'] ? `IsApiProgramMgrInfo_2.pageList.windowList.0.inputChannel&外设输出设置/视频输出设置/${val['pageList']['pageName']}/1分屏&通道${val['pageList']['windowList'][0]['inputChannel']}` : '';
                this.$emit('changeData',this.formData)
              break;
              case "SLIP4":
                let channelChange4 = false;
                let channelString4 = ''
                for(let i = 0;i < 4;i++){
                  if(val['pageList']['windowList'][i]['inputChannel'] != this.copyForm['IsApiProgramMgrInfo_2']['pageList']['windowList'][i]['inputChannel']){
                    channelChange4 = true;
                    break
                  }
                }
                channelString4 = channelChange4 ? `通道${val['pageList']['windowList'][0]['inputChannel']}、通道${val['pageList']['windowList'][1]['inputChannel']}、通道${val['pageList']['windowList'][2]['inputChannel']}、通道${val['pageList']['windowList'][3]['inputChannel']}` : ''
                this.formData['IsApiProgramMgrInfo_2.pageList.windowList.nothing'] = channelChange4 ? `IsApiProgramMgrInfo_2.pageList.windowList.nothing&外设输出设置/视频输出设置/${val['pageList']['pageName']}/4分屏&${channelString4}` : ''
                this.$emit('changeData',this.formData)
              break;
              case "SLIP6":
                let channelChange6 = false;
                let channelString6 = ''
                for(let i = 0;i < 6;i++){
                  if(val['pageList']['windowList'][i]['inputChannel'] != this.copyForm['IsApiProgramMgrInfo_2']['pageList']['windowList'][i]['inputChannel']){
                    channelChange6 = true;
                    break
                  }
                }
                channelString6 = channelChange6 ? `通道${val['pageList']['windowList'][0]['inputChannel']}、通道${val['pageList']['windowList'][1]['inputChannel']}、通道${val['pageList']['windowList'][2]['inputChannel']}、通道${val['pageList']['windowList'][3]['inputChannel']}、通道${val['pageList']['windowList'][4]['inputChannel']}、通道${val['pageList']['windowList'][5]['inputChannel']}` : ''
                this.formData['IsApiProgramMgrInfo_2.pageList.windowList.nothing'] = channelChange6 ? `IsApiProgramMgrInfo_2.pageList.windowList.nothing&外设输出设置/视频输出设置/${val['pageList']['pageName']}/6分屏&${channelString6}` : ''
                this.$emit('changeData',this.formData)
              break;
              case "SLIP9":
                let channelChange9 = false;
                let channelString9 = ''
                for(let i = 0;i < 9;i++){
                  if(val['pageList']['windowList'][i]['inputChannel'] != this.copyForm['IsApiProgramMgrInfo_2']['pageList']['windowList'][i]['inputChannel']){
                    channelChange9 = true;
                    break
                  }
                }
                channelString9 = channelChange9 ? `通道${val['pageList']['windowList'][0]['inputChannel']}、通道${val['pageList']['windowList'][1]['inputChannel']}、通道${val['pageList']['windowList'][2]['inputChannel']}、通道${val['pageList']['windowList'][3]['inputChannel']}、通道${val['pageList']['windowList'][4]['inputChannel']}、通道${val['pageList']['windowList'][5]['inputChannel']}、通道${val['pageList']['windowList'][6]['inputChannel']}、通道${val['pageList']['windowList'][7]['inputChannel']}、通道${val['pageList']['windowList'][8]['inputChannel']}` : ''
                this.formData['IsApiProgramMgrInfo_2.pageList.windowList.nothing'] = channelChange9 ? `IsApiProgramMgrInfo_2.pageList.windowList.nothing&外设输出设置/视频输出设置/${val['pageList']['pageName']}/9分屏&${channelString9}` : ''
                this.$emit('changeData',this.formData)
              break;
            }
          }
        }
      },
      deep: true,
      immediate:false,
    },
    'form.IsApiProgramMgrInfo_3':{
      handler(val){
        if(val != undefined){
          this.formData['IsApiProgramMgrInfo_3.pageList.windowSplitMode.nothing'] = val['pageList']['windowSplitMode'] != this.copyForm['IsApiProgramMgrInfo_3']['pageList']['windowSplitMode'] ? `IsApiProgramMgrInfo_3.pageList.windowSplitMode.nothing&外设输出设置/视频输出设置/${val['pageList']['pageName']}&${val['pageList']['windowList'].length}分屏` : '';
          this.$emit('changeData',this.formData)
          if(val['pageList']['windowSplitMode'] == this.copyForm['IsApiProgramMgrInfo_3']['pageList']['windowSplitMode']){
            switch(val['pageList']['windowSplitMode']){
              case "SLIP1":
                this.formData['IsApiProgramMgrInfo_3.pageList.windowList.0.inputChannel'] = val['pageList']['windowList'][0]['inputChannel'] != this.copyForm['IsApiProgramMgrInfo_3']['pageList']['windowList'][0]['inputChannel'] ? `IsApiProgramMgrInfo_3.pageList.windowList.0.inputChannel&外设输出设置/视频输出设置/${val['pageList']['pageName']}/1分屏&通道${val['pageList']['windowList'][0]['inputChannel']}` : '';
                this.$emit('changeData',this.formData)
              break;
              case "SLIP4":
                let channelChange4 = false;
                let channelString4 = ''
                for(let i = 0;i < 4;i++){
                  if(val['pageList']['windowList'][i]['inputChannel'] != this.copyForm['IsApiProgramMgrInfo_3']['pageList']['windowList'][i]['inputChannel']){
                    channelChange4 = true;
                    break
                  }
                }
                channelString4 = channelChange4 ? `通道${val['pageList']['windowList'][0]['inputChannel']}、通道${val['pageList']['windowList'][1]['inputChannel']}、通道${val['pageList']['windowList'][2]['inputChannel']}、通道${val['pageList']['windowList'][3]['inputChannel']}` : ''
                this.formData['IsApiProgramMgrInfo_3.pageList.windowList.nothing'] = channelChange4 ? `IsApiProgramMgrInfo_3.pageList.windowList.nothing&外设输出设置/视频输出设置/${val['pageList']['pageName']}/4分屏&${channelString4}` : ''
                this.$emit('changeData',this.formData)
              break;
              case "SLIP6":
                let channelChange6 = false;
                let channelString6 = ''
                for(let i = 0;i < 6;i++){
                  if(val['pageList']['windowList'][i]['inputChannel'] != this.copyForm['IsApiProgramMgrInfo_3']['pageList']['windowList'][i]['inputChannel']){
                    channelChange6 = true;
                    break
                  }
                }
                channelString6 = channelChange6 ? `通道${val['pageList']['windowList'][0]['inputChannel']}、通道${val['pageList']['windowList'][1]['inputChannel']}、通道${val['pageList']['windowList'][2]['inputChannel']}、通道${val['pageList']['windowList'][3]['inputChannel']}、通道${val['pageList']['windowList'][4]['inputChannel']}、通道${val['pageList']['windowList'][5]['inputChannel']}` : ''
                this.formData['IsApiProgramMgrInfo_3.pageList.windowList.nothing'] = channelChange6 ? `IsApiProgramMgrInfo_3.pageList.windowList.nothing&外设输出设置/视频输出设置/${val['pageList']['pageName']}/6分屏&${channelString6}` : ''
                this.$emit('changeData',this.formData)
              break;
              case "SLIP9":
                let channelChange9 = false;
                let channelString9 = ''
                for(let i = 0;i < 9;i++){
                  if(val['pageList']['windowList'][i]['inputChannel'] != this.copyForm['IsApiProgramMgrInfo_3']['pageList']['windowList'][i]['inputChannel']){
                    channelChange9 = true;
                    break
                  }
                }
                channelString9 = channelChange9 ? `通道${val['pageList']['windowList'][0]['inputChannel']}、通道${val['pageList']['windowList'][1]['inputChannel']}、通道${val['pageList']['windowList'][2]['inputChannel']}、通道${val['pageList']['windowList'][3]['inputChannel']}、通道${val['pageList']['windowList'][4]['inputChannel']}、通道${val['pageList']['windowList'][5]['inputChannel']}、通道${val['pageList']['windowList'][6]['inputChannel']}、通道${val['pageList']['windowList'][7]['inputChannel']}、通道${val['pageList']['windowList'][8]['inputChannel']}` : ''
                this.formData['IsApiProgramMgrInfo_3.pageList.windowList.nothing'] = channelChange9 ? `IsApiProgramMgrInfo_3.pageList.windowList.nothing&外设输出设置/视频输出设置/${val['pageList']['pageName']}/9分屏&${channelString9}` : ''
                this.$emit('changeData',this.formData)
              break;
            }
          }
        }
      },
      deep: true,
      immediate:false,
    },
    'form.IsApiProgramMgrInfo_4':{
      handler(val){
        if(val != undefined){
          this.formData['IsApiProgramMgrInfo_4.pageList.windowSplitMode.nothing'] = val['pageList']['windowSplitMode'] != this.copyForm['IsApiProgramMgrInfo_4']['pageList']['windowSplitMode'] ? `IsApiProgramMgrInfo_4.pageList.windowSplitMode.nothing&外设输出设置/视频输出设置/${val['pageList']['pageName']}&${val['pageList']['windowList'].length}分屏` : '';
          this.$emit('changeData',this.formData)
          if(val['pageList']['windowSplitMode'] == this.copyForm['IsApiProgramMgrInfo_4']['pageList']['windowSplitMode']){
            switch(val['pageList']['windowSplitMode']){
              case "SLIP1":
                this.formData['IsApiProgramMgrInfo_4.pageList.windowList.0.inputChannel'] = val['pageList']['windowList'][0]['inputChannel'] != this.copyForm['IsApiProgramMgrInfo_4']['pageList']['windowList'][0]['inputChannel'] ? `IsApiProgramMgrInfo_4.pageList.windowList.0.inputChannel&外设输出设置/视频输出设置/${val['pageList']['pageName']}/1分屏&通道${val['pageList']['windowList'][0]['inputChannel']}` : '';
                this.$emit('changeData',this.formData)
              break;
              case "SLIP4":
                let channelChange4 = false;
                let channelString4 = ''
                for(let i = 0;i < 4;i++){
                  if(val['pageList']['windowList'][i]['inputChannel'] != this.copyForm['IsApiProgramMgrInfo_4']['pageList']['windowList'][i]['inputChannel']){
                    channelChange4 = true;
                    break
                  }
                }
                channelString4 = channelChange4 ? `通道${val['pageList']['windowList'][0]['inputChannel']}、通道${val['pageList']['windowList'][1]['inputChannel']}、通道${val['pageList']['windowList'][2]['inputChannel']}、通道${val['pageList']['windowList'][3]['inputChannel']}` : ''
                this.formData['IsApiProgramMgrInfo_4.pageList.windowList.nothing'] = channelChange4 ? `IsApiProgramMgrInfo_4.pageList.windowList.nothing&外设输出设置/视频输出设置/${val['pageList']['pageName']}/4分屏&${channelString4}` : ''
                this.$emit('changeData',this.formData)
              break;
              case "SLIP6":
                let channelChange6 = false;
                let channelString6 = ''
                for(let i = 0;i < 6;i++){
                  if(val['pageList']['windowList'][i]['inputChannel'] != this.copyForm['IsApiProgramMgrInfo_4']['pageList']['windowList'][i]['inputChannel']){
                    channelChange6 = true;
                    break
                  }
                }
                channelString6 = channelChange6 ? `通道${val['pageList']['windowList'][0]['inputChannel']}、通道${val['pageList']['windowList'][1]['inputChannel']}、通道${val['pageList']['windowList'][2]['inputChannel']}、通道${val['pageList']['windowList'][3]['inputChannel']}、通道${val['pageList']['windowList'][4]['inputChannel']}、通道${val['pageList']['windowList'][5]['inputChannel']}` : ''
                this.formData['IsApiProgramMgrInfo_4.pageList.windowList.nothing'] = channelChange6 ? `IsApiProgramMgrInfo_4.pageList.windowList.nothing&外设输出设置/视频输出设置/${val['pageList']['pageName']}/6分屏&${channelString6}` : ''
                this.$emit('changeData',this.formData)
              break;
              case "SLIP9":
                let channelChange9 = false;
                let channelString9 = ''
                for(let i = 0;i < 9;i++){
                  if(val['pageList']['windowList'][i]['inputChannel'] != this.copyForm['IsApiProgramMgrInfo_4']['pageList']['windowList'][i]['inputChannel']){
                    channelChange9 = true;
                    break
                  }
                }
                channelString9 = channelChange9 ? `通道${val['pageList']['windowList'][0]['inputChannel']}、通道${val['pageList']['windowList'][1]['inputChannel']}、通道${val['pageList']['windowList'][2]['inputChannel']}、通道${val['pageList']['windowList'][3]['inputChannel']}、通道${val['pageList']['windowList'][4]['inputChannel']}、通道${val['pageList']['windowList'][5]['inputChannel']}、通道${val['pageList']['windowList'][6]['inputChannel']}、通道${val['pageList']['windowList'][7]['inputChannel']}、通道${val['pageList']['windowList'][8]['inputChannel']}` : ''
                this.formData['IsApiProgramMgrInfo_4.pageList.windowList.nothing'] = channelChange9 ? `IsApiProgramMgrInfo_4.pageList.windowList.nothing&外设输出设置/视频输出设置/${val['pageList']['pageName']}/9分屏&${channelString9}` : ''
                this.$emit('changeData',this.formData)
              break;
            }
          }
        }
      },
      deep: true,
      immediate:false,
    },
    'form.IsApiProgramMgrInfo_5':{
      handler(val){
        if(val != undefined){
          this.formData['IsApiProgramMgrInfo_5.pageList.windowSplitMode.nothing'] = val['pageList']['windowSplitMode'] != this.copyForm['IsApiProgramMgrInfo_5']['pageList']['windowSplitMode'] ? `IsApiProgramMgrInfo_5.pageList.windowSplitMode.nothing&外设输出设置/视频输出设置/${val['pageList']['pageName']}&${val['pageList']['windowList'].length}分屏` : '';
          this.$emit('changeData',this.formData)
          if(val['pageList']['windowSplitMode'] == this.copyForm['IsApiProgramMgrInfo_5']['pageList']['windowSplitMode']){
            switch(val['pageList']['windowSplitMode']){
              case "SLIP1":
                this.formData['IsApiProgramMgrInfo_5.pageList.windowList.0.inputChannel'] = val['pageList']['windowList'][0]['inputChannel'] != this.copyForm['IsApiProgramMgrInfo_5']['pageList']['windowList'][0]['inputChannel'] ? `IsApiProgramMgrInfo_5.pageList.windowList.0.inputChannel&外设输出设置/视频输出设置/${val['pageList']['pageName']}/1分屏&通道${val['pageList']['windowList'][0]['inputChannel']}` : '';
                this.$emit('changeData',this.formData)
              break;
              case "SLIP4":
                let channelChange4 = false;
                let channelString4 = ''
                for(let i = 0;i < 4;i++){
                  if(val['pageList']['windowList'][i]['inputChannel'] != this.copyForm['IsApiProgramMgrInfo_5']['pageList']['windowList'][i]['inputChannel']){
                    channelChange4 = true;
                    break
                  }
                }
                channelString4 = channelChange4 ? `通道${val['pageList']['windowList'][0]['inputChannel']}、通道${val['pageList']['windowList'][1]['inputChannel']}、通道${val['pageList']['windowList'][2]['inputChannel']}、通道${val['pageList']['windowList'][3]['inputChannel']}` : ''
                this.formData['IsApiProgramMgrInfo_5.pageList.windowList.nothing'] = channelChange4 ? `IsApiProgramMgrInfo_5.pageList.windowList.nothing&外设输出设置/视频输出设置/${val['pageList']['pageName']}/4分屏&${channelString4}` : ''
                this.$emit('changeData',this.formData)
              break;
              case "SLIP6":
                let channelChange6 = false;
                let channelString6 = ''
                for(let i = 0;i < 6;i++){
                  if(val['pageList']['windowList'][i]['inputChannel'] != this.copyForm['IsApiProgramMgrInfo_5']['pageList']['windowList'][i]['inputChannel']){
                    channelChange6 = true;
                    break
                  }
                }
                channelString6 = channelChange6 ? `通道${val['pageList']['windowList'][0]['inputChannel']}、通道${val['pageList']['windowList'][1]['inputChannel']}、通道${val['pageList']['windowList'][2]['inputChannel']}、通道${val['pageList']['windowList'][3]['inputChannel']}、通道${val['pageList']['windowList'][4]['inputChannel']}、通道${val['pageList']['windowList'][5]['inputChannel']}` : ''
                this.formData['IsApiProgramMgrInfo_5.pageList.windowList.nothing'] = channelChange6 ? `IsApiProgramMgrInfo_5.pageList.windowList.nothing&外设输出设置/视频输出设置/${val['pageList']['pageName']}/6分屏&${channelString6}` : ''
                this.$emit('changeData',this.formData)
              break;
              case "SLIP9":
                let channelChange9 = false;
                let channelString9 = ''
                for(let i = 0;i < 9;i++){
                  if(val['pageList']['windowList'][i]['inputChannel'] != this.copyForm['IsApiProgramMgrInfo_5']['pageList']['windowList'][i]['inputChannel']){
                    channelChange9 = true;
                    break
                  }
                }
                channelString9 = channelChange9 ? `通道${val['pageList']['windowList'][0]['inputChannel']}、通道${val['pageList']['windowList'][1]['inputChannel']}、通道${val['pageList']['windowList'][2]['inputChannel']}、通道${val['pageList']['windowList'][3]['inputChannel']}、通道${val['pageList']['windowList'][4]['inputChannel']}、通道${val['pageList']['windowList'][5]['inputChannel']}、通道${val['pageList']['windowList'][6]['inputChannel']}、通道${val['pageList']['windowList'][7]['inputChannel']}、通道${val['pageList']['windowList'][8]['inputChannel']}` : ''
                this.formData['IsApiProgramMgrInfo_5.pageList.windowList.nothing'] = channelChange9 ? `IsApiProgramMgrInfo_5.pageList.windowList.nothing&外设输出设置/视频输出设置/${val['pageList']['pageName']}/9分屏&${channelString9}` : ''
                this.$emit('changeData',this.formData)
              break;
            }
          }
        }
      },
      deep: true,
      immediate:false,
    },
    'form.IsApiProgramMgrInfo_6':{
      handler(val){
        if(val != undefined){
          this.formData['IsApiProgramMgrInfo_6.pageList.windowSplitMode.nothing'] = val['pageList']['windowSplitMode'] != this.copyForm['IsApiProgramMgrInfo_6']['pageList']['windowSplitMode'] ? `IsApiProgramMgrInfo_6.pageList.windowSplitMode.nothing&外设输出设置/视频输出设置/${val['pageList']['pageName']}&${val['pageList']['windowList'].length}分屏` : '';
          this.$emit('changeData',this.formData)
          if(val['pageList']['windowSplitMode'] == this.copyForm['IsApiProgramMgrInfo_6']['pageList']['windowSplitMode']){
            switch(val['pageList']['windowSplitMode']){
              case "SLIP1":
                this.formData['IsApiProgramMgrInfo_6.pageList.windowList.0.inputChannel'] = val['pageList']['windowList'][0]['inputChannel'] != this.copyForm['IsApiProgramMgrInfo_6']['pageList']['windowList'][0]['inputChannel'] ? `IsApiProgramMgrInfo_6.pageList.windowList.0.inputChannel&外设输出设置/视频输出设置/${val['pageList']['pageName']}/1分屏&通道${val['pageList']['windowList'][0]['inputChannel']}` : '';
                this.$emit('changeData',this.formData)
              break;
              case "SLIP4":
                let channelChange4 = false;
                let channelString4 = ''
                for(let i = 0;i < 4;i++){
                  if(val['pageList']['windowList'][i]['inputChannel'] != this.copyForm['IsApiProgramMgrInfo_6']['pageList']['windowList'][i]['inputChannel']){
                    channelChange4 = true;
                    break
                  }
                }
                channelString4 = channelChange4 ? `通道${val['pageList']['windowList'][0]['inputChannel']}、通道${val['pageList']['windowList'][1]['inputChannel']}、通道${val['pageList']['windowList'][2]['inputChannel']}、通道${val['pageList']['windowList'][3]['inputChannel']}` : ''
                this.formData['IsApiProgramMgrInfo_6.pageList.windowList.nothing'] = channelChange4 ? `IsApiProgramMgrInfo_6.pageList.windowList.nothing&外设输出设置/视频输出设置/${val['pageList']['pageName']}/4分屏&${channelString4}` : ''
                this.$emit('changeData',this.formData)
              break;
              case "SLIP6":
                let channelChange6 = false;
                let channelString6 = ''
                for(let i = 0;i < 6;i++){
                  if(val['pageList']['windowList'][i]['inputChannel'] != this.copyForm['IsApiProgramMgrInfo_6']['pageList']['windowList'][i]['inputChannel']){
                    channelChange6 = true;
                    break
                  }
                }
                channelString6 = channelChange6 ? `通道${val['pageList']['windowList'][0]['inputChannel']}、通道${val['pageList']['windowList'][1]['inputChannel']}、通道${val['pageList']['windowList'][2]['inputChannel']}、通道${val['pageList']['windowList'][3]['inputChannel']}、通道${val['pageList']['windowList'][4]['inputChannel']}、通道${val['pageList']['windowList'][5]['inputChannel']}` : ''
                this.formData['IsApiProgramMgrInfo_6.pageList.windowList.nothing'] = channelChange6 ? `IsApiProgramMgrInfo_6.pageList.windowList.nothing&外设输出设置/视频输出设置/${val['pageList']['pageName']}/6分屏&${channelString6}` : ''
                this.$emit('changeData',this.formData)
              break;
              case "SLIP9":
                let channelChange9 = false;
                let channelString9 = ''
                for(let i = 0;i < 9;i++){
                  if(val['pageList']['windowList'][i]['inputChannel'] != this.copyForm['IsApiProgramMgrInfo_6']['pageList']['windowList'][i]['inputChannel']){
                    channelChange9 = true;
                    break
                  }
                }
                channelString9 = channelChange9 ? `通道${val['pageList']['windowList'][0]['inputChannel']}、通道${val['pageList']['windowList'][1]['inputChannel']}、通道${val['pageList']['windowList'][2]['inputChannel']}、通道${val['pageList']['windowList'][3]['inputChannel']}、通道${val['pageList']['windowList'][4]['inputChannel']}、通道${val['pageList']['windowList'][5]['inputChannel']}、通道${val['pageList']['windowList'][6]['inputChannel']}、通道${val['pageList']['windowList'][7]['inputChannel']}、通道${val['pageList']['windowList'][8]['inputChannel']}` : ''
                this.formData['IsApiProgramMgrInfo_6.pageList.windowList.nothing'] = channelChange9 ? `IsApiProgramMgrInfo_6.pageList.windowList.nothing&外设输出设置/视频输出设置/${val['pageList']['pageName']}/9分屏&${channelString9}` : ''
                this.$emit('changeData',this.formData)
              break;
            }
          }
        }
      },
      deep: true,
      immediate:false,
    },
    'form.IsApiProgramMgrInfo_7':{
      handler(val){
        if(val != undefined){
          this.formData['IsApiProgramMgrInfo_7.pageList.windowSplitMode.nothing'] = val['pageList']['windowSplitMode'] != this.copyForm['IsApiProgramMgrInfo_7']['pageList']['windowSplitMode'] ? `IsApiProgramMgrInfo_7.pageList.windowSplitMode.nothing&外设输出设置/视频输出设置/${val['pageList']['pageName']}&${val['pageList']['windowList'].length}分屏` : '';
          this.$emit('changeData',this.formData)
          if(val['pageList']['windowSplitMode'] == this.copyForm['IsApiProgramMgrInfo_7']['pageList']['windowSplitMode']){
            switch(val['pageList']['windowSplitMode']){
              case "SLIP1":
                this.formData['IsApiProgramMgrInfo_7.pageList.windowList.0.inputChannel'] = val['pageList']['windowList'][0]['inputChannel'] != this.copyForm['IsApiProgramMgrInfo_7']['pageList']['windowList'][0]['inputChannel'] ? `IsApiProgramMgrInfo_7.pageList.windowList.0.inputChannel&外设输出设置/视频输出设置/${val['pageList']['pageName']}/1分屏&通道${val['pageList']['windowList'][0]['inputChannel']}` : '';
                this.$emit('changeData',this.formData)
              break;
              case "SLIP4":
                let channelChange4 = false;
                let channelString4 = ''
                for(let i = 0;i < 4;i++){
                  if(val['pageList']['windowList'][i]['inputChannel'] != this.copyForm['IsApiProgramMgrInfo_7']['pageList']['windowList'][i]['inputChannel']){
                    channelChange4 = true;
                    break
                  }
                }
                channelString4 = channelChange4 ? `通道${val['pageList']['windowList'][0]['inputChannel']}、通道${val['pageList']['windowList'][1]['inputChannel']}、通道${val['pageList']['windowList'][2]['inputChannel']}、通道${val['pageList']['windowList'][3]['inputChannel']}` : ''
                this.formData['IsApiProgramMgrInfo_7.pageList.windowList.nothing'] = channelChange4 ? `IsApiProgramMgrInfo_7.pageList.windowList.nothing&外设输出设置/视频输出设置/${val['pageList']['pageName']}/4分屏&${channelString4}` : ''
                this.$emit('changeData',this.formData)
              break;
              case "SLIP6":
                let channelChange6 = false;
                let channelString6 = ''
                for(let i = 0;i < 6;i++){
                  if(val['pageList']['windowList'][i]['inputChannel'] != this.copyForm['IsApiProgramMgrInfo_7']['pageList']['windowList'][i]['inputChannel']){
                    channelChange6 = true;
                    break
                  }
                }
                channelString6 = channelChange6 ? `通道${val['pageList']['windowList'][0]['inputChannel']}、通道${val['pageList']['windowList'][1]['inputChannel']}、通道${val['pageList']['windowList'][2]['inputChannel']}、通道${val['pageList']['windowList'][3]['inputChannel']}、通道${val['pageList']['windowList'][4]['inputChannel']}、通道${val['pageList']['windowList'][5]['inputChannel']}` : ''
                this.formData['IsApiProgramMgrInfo_7.pageList.windowList.nothing'] = channelChange6 ? `IsApiProgramMgrInfo_7.pageList.windowList.nothing&外设输出设置/视频输出设置/${val['pageList']['pageName']}/6分屏&${channelString6}` : ''
                this.$emit('changeData',this.formData)
              break;
              case "SLIP9":
                let channelChange9 = false;
                let channelString9 = ''
                for(let i = 0;i < 9;i++){
                  if(val['pageList']['windowList'][i]['inputChannel'] != this.copyForm['IsApiProgramMgrInfo_7']['pageList']['windowList'][i]['inputChannel']){
                    channelChange9 = true;
                    break
                  }
                }
                channelString9 = channelChange9 ? `通道${val['pageList']['windowList'][0]['inputChannel']}、通道${val['pageList']['windowList'][1]['inputChannel']}、通道${val['pageList']['windowList'][2]['inputChannel']}、通道${val['pageList']['windowList'][3]['inputChannel']}、通道${val['pageList']['windowList'][4]['inputChannel']}、通道${val['pageList']['windowList'][5]['inputChannel']}、通道${val['pageList']['windowList'][6]['inputChannel']}、通道${val['pageList']['windowList'][7]['inputChannel']}、通道${val['pageList']['windowList'][8]['inputChannel']}` : ''
                this.formData['IsApiProgramMgrInfo_7.pageList.windowList.nothing'] = channelChange9 ? `IsApiProgramMgrInfo_7.pageList.windowList.nothing&外设输出设置/视频输出设置/${val['pageList']['pageName']}/9分屏&${channelString9}` : ''
                this.$emit('changeData',this.formData)
              break;
            }
          }
        }
      },
      deep: true,
      immediate:false,
    },
    'form.IsApiProgramMgrInfo_8':{
      handler(val){
        if(val != undefined){
          this.formData['IsApiProgramMgrInfo_8.pageList.windowSplitMode.nothing'] = val['pageList']['windowSplitMode'] != this.copyForm['IsApiProgramMgrInfo_8']['pageList']['windowSplitMode'] ? `IsApiProgramMgrInfo_8.pageList.windowSplitMode.nothing&外设输出设置/视频输出设置/${val['pageList']['pageName']}&${val['pageList']['windowList'].length}分屏` : '';
          this.$emit('changeData',this.formData)
          if(val['pageList']['windowSplitMode'] == this.copyForm['IsApiProgramMgrInfo_8']['pageList']['windowSplitMode']){
            switch(val['pageList']['windowSplitMode']){
              case "SLIP1":
                this.formData['IsApiProgramMgrInfo_8.pageList.windowList.0.inputChannel'] = val['pageList']['windowList'][0]['inputChannel'] != this.copyForm['IsApiProgramMgrInfo_8']['pageList']['windowList'][0]['inputChannel'] ? `IsApiProgramMgrInfo_8.pageList.windowList.0.inputChannel&外设输出设置/视频输出设置/${val['pageList']['pageName']}/1分屏&通道${val['pageList']['windowList'][0]['inputChannel']}` : '';
                this.$emit('changeData',this.formData)
              break;
              case "SLIP4":
                let channelChange4 = false;
                let channelString4 = ''
                for(let i = 0;i < 4;i++){
                  if(val['pageList']['windowList'][i]['inputChannel'] != this.copyForm['IsApiProgramMgrInfo_8']['pageList']['windowList'][i]['inputChannel']){
                    channelChange4 = true;
                    break
                  }
                }
                channelString4 = channelChange4 ? `通道${val['pageList']['windowList'][0]['inputChannel']}、通道${val['pageList']['windowList'][1]['inputChannel']}、通道${val['pageList']['windowList'][2]['inputChannel']}、通道${val['pageList']['windowList'][3]['inputChannel']}` : ''
                this.formData['IsApiProgramMgrInfo_8.pageList.windowList.nothing'] = channelChange4 ? `IsApiProgramMgrInfo_8.pageList.windowList.nothing&外设输出设置/视频输出设置/${val['pageList']['pageName']}/4分屏&${channelString4}` : ''
                this.$emit('changeData',this.formData)
              break;
              case "SLIP6":
                let channelChange6 = false;
                let channelString6 = ''
                for(let i = 0;i < 6;i++){
                  if(val['pageList']['windowList'][i]['inputChannel'] != this.copyForm['IsApiProgramMgrInfo_8']['pageList']['windowList'][i]['inputChannel']){
                    channelChange6 = true;
                    break
                  }
                }
                channelString6 = channelChange6 ? `通道${val['pageList']['windowList'][0]['inputChannel']}、通道${val['pageList']['windowList'][1]['inputChannel']}、通道${val['pageList']['windowList'][2]['inputChannel']}、通道${val['pageList']['windowList'][3]['inputChannel']}、通道${val['pageList']['windowList'][4]['inputChannel']}、通道${val['pageList']['windowList'][5]['inputChannel']}` : ''
                this.formData['IsApiProgramMgrInfo_8.pageList.windowList.nothing'] = channelChange6 ? `IsApiProgramMgrInfo_8.pageList.windowList.nothing&外设输出设置/视频输出设置/${val['pageList']['pageName']}/6分屏&${channelString6}` : ''
                this.$emit('changeData',this.formData)
              break;
              case "SLIP9":
                let channelChange9 = false;
                let channelString9 = ''
                for(let i = 0;i < 9;i++){
                  if(val['pageList']['windowList'][i]['inputChannel'] != this.copyForm['IsApiProgramMgrInfo_8']['pageList']['windowList'][i]['inputChannel']){
                    channelChange9 = true;
                    break
                  }
                }
                channelString9 = channelChange9 ? `通道${val['pageList']['windowList'][0]['inputChannel']}、通道${val['pageList']['windowList'][1]['inputChannel']}、通道${val['pageList']['windowList'][2]['inputChannel']}、通道${val['pageList']['windowList'][3]['inputChannel']}、通道${val['pageList']['windowList'][4]['inputChannel']}、通道${val['pageList']['windowList'][5]['inputChannel']}、通道${val['pageList']['windowList'][6]['inputChannel']}、通道${val['pageList']['windowList'][7]['inputChannel']}、通道${val['pageList']['windowList'][8]['inputChannel']}` : ''
                this.formData['IsApiProgramMgrInfo_8.pageList.windowList.nothing'] = channelChange9 ? `IsApiProgramMgrInfo_8.pageList.windowList.nothing&外设输出设置/视频输出设置/${val['pageList']['pageName']}/9分屏&${channelString9}` : ''
                this.$emit('changeData',this.formData)
              break;
            }
          }
        }
      },
      deep: true,
      immediate:false,
    },
    'form.IsApiProgramMgrInfo_9':{
      handler(val){
        if(val != undefined){
          this.formData['IsApiProgramMgrInfo_9.pageList.windowSplitMode.nothing'] = val['pageList']['windowSplitMode'] != this.copyForm['IsApiProgramMgrInfo_9']['pageList']['windowSplitMode'] ? `IsApiProgramMgrInfo_9.pageList.windowSplitMode.nothing&外设输出设置/视频输出设置/${this.sensorNameJson[val['pageList']['pageName']]}&${val['pageList']['windowList'].length}分屏` : '';
          this.$emit('changeData',this.formData)
          if(val['pageList']['windowSplitMode'] == this.copyForm['IsApiProgramMgrInfo_9']['pageList']['windowSplitMode']){
            switch(val['pageList']['windowSplitMode']){
              case "SLIP1":
                this.formData['IsApiProgramMgrInfo_9.pageList.windowList.0.inputChannel'] = val['pageList']['windowList'][0]['inputChannel'] != this.copyForm['IsApiProgramMgrInfo_9']['pageList']['windowList'][0]['inputChannel'] ? `IsApiProgramMgrInfo_9.pageList.windowList.0.inputChannel&外设输出设置/视频输出设置/${this.sensorNameJson[val['pageList']['pageName']]}/1分屏&通道${val['pageList']['windowList'][0]['inputChannel']}` : '';
                this.$emit('changeData',this.formData)
              break;
              case "SLIP4":
                let channelChange4 = false;
                let channelString4 = ''
                for(let i = 0;i < 4;i++){
                  if(val['pageList']['windowList'][i]['inputChannel'] != this.copyForm['IsApiProgramMgrInfo_9']['pageList']['windowList'][i]['inputChannel']){
                    channelChange4 = true;
                    break
                  }
                }
                channelString4 = channelChange4 ? `通道${val['pageList']['windowList'][0]['inputChannel']}、通道${val['pageList']['windowList'][1]['inputChannel']}、通道${val['pageList']['windowList'][2]['inputChannel']}、通道${val['pageList']['windowList'][3]['inputChannel']}` : ''
                this.formData['IsApiProgramMgrInfo_9.pageList.windowList.nothing'] = channelChange4 ? `IsApiProgramMgrInfo_9.pageList.windowList.nothing&外设输出设置/视频输出设置/${this.sensorNameJson[val['pageList']['pageName']]}/4分屏&${channelString4}` : ''
                this.$emit('changeData',this.formData)
              break;
              case "SLIP6":
                let channelChange6 = false;
                let channelString6 = ''
                for(let i = 0;i < 6;i++){
                  if(val['pageList']['windowList'][i]['inputChannel'] != this.copyForm['IsApiProgramMgrInfo_9']['pageList']['windowList'][i]['inputChannel']){
                    channelChange6 = true;
                    break
                  }
                }
                channelString6 = channelChange6 ? `通道${val['pageList']['windowList'][0]['inputChannel']}、通道${val['pageList']['windowList'][1]['inputChannel']}、通道${val['pageList']['windowList'][2]['inputChannel']}、通道${val['pageList']['windowList'][3]['inputChannel']}、通道${val['pageList']['windowList'][4]['inputChannel']}、通道${val['pageList']['windowList'][5]['inputChannel']}` : ''
                this.formData['IsApiProgramMgrInfo_9.pageList.windowList.nothing'] = channelChange6 ? `IsApiProgramMgrInfo_9.pageList.windowList.nothing&外设输出设置/视频输出设置/${this.sensorNameJson[val['pageList']['pageName']]}/6分屏&${channelString6}` : ''
                this.$emit('changeData',this.formData)
              break;
              case "SLIP9":
                let channelChange9 = false;
                let channelString9 = ''
                for(let i = 0;i < 9;i++){
                  if(val['pageList']['windowList'][i]['inputChannel'] != this.copyForm['IsApiProgramMgrInfo_9']['pageList']['windowList'][i]['inputChannel']){
                    channelChange9 = true;
                    break
                  }
                }
                channelString9 = channelChange9 ? `通道${val['pageList']['windowList'][0]['inputChannel']}、通道${val['pageList']['windowList'][1]['inputChannel']}、通道${val['pageList']['windowList'][2]['inputChannel']}、通道${val['pageList']['windowList'][3]['inputChannel']}、通道${val['pageList']['windowList'][4]['inputChannel']}、通道${val['pageList']['windowList'][5]['inputChannel']}、通道${val['pageList']['windowList'][6]['inputChannel']}、通道${val['pageList']['windowList'][7]['inputChannel']}、通道${val['pageList']['windowList'][8]['inputChannel']}` : ''
                this.formData['IsApiProgramMgrInfo_9.pageList.windowList.nothing'] = channelChange9 ? `IsApiProgramMgrInfo_9.pageList.windowList.nothing&外设输出设置/视频输出设置/${this.sensorNameJson[val['pageList']['pageName']]}/9分屏&${channelString9}` : ''
                this.$emit('changeData',this.formData)
              break;
            }
          }
        }
      },
      deep: true,
      immediate:false,
    },
  },
  data() {
    const checkNumber = function (rule, value, callback) {
      if (value!=='' && value!==null && value!==undefined) {
          if (!validateNum(value)) {
              callback(new Error("请输入正确的整数"));
          } else if(value<this.min){
            callback(new Error(`最小值为${this.min}`));
          } else if(value>this.max){
            callback(new Error(`最大值为${this.max}`));
          } else if((this.type=='short' && value>32767)||(this.type=='byte' && value>127)||(this.type=='int' && value> Math.pow(2,31)-1)) {
            callback(new Error("输入的数值超出有效范围"));
          } else {
            callback();
          }
      } else {
          // callback(new Error("请输入"));
          callback();
      }
    };
    const checkString = function (rule, value, callback) {
      if (value!=='' && value!==null && value!==undefined) {
           if(value.length>this.max){
            callback(new Error(`最大长度为${this.max}`));
          } else {
            callback();
          }
      } else {
          // callback(new Error("请输入"));
          callback();
      }
    };
    return {
      form:{},
      copyForm:{},
      formData:{},
      sensorNameJson:{},
      rules: {
        '0100.heartbeat': [ { validator: checkNumber.bind({type:'int',min:0,max:50000}), trigger: 'blur' }],
        '0101.heartbeat': [ { validator: checkNumber.bind({type:'short',min:0,max:32767}), trigger: 'blur' }],
        '0102.heartbeat': [ { validator: checkNumber.bind({type:'int',min:0,max:50000}), trigger: 'blur' }],
        '0103.heartbeat': [ { validator: checkNumber.bind({type:'short',min:0,max:32767}), trigger: 'blur' }],
        '0110.heartbeat': [ { validator: checkNumber.bind({type:'int',min:0,max:50000}), trigger: 'blur' }],
        // '0110.canChannelNum':[{ required: true, type:'number', message: '请选择', trigger: 'change' }],
        // '0110.frameType':[{ required: true, type:'number', message: '请选择', trigger: 'change' }],
        // '0110.collectType':[{ required: true, type:'number', message: '请选择', trigger: 'change' }],
        '0110.canId':[{ validator: checkString.bind({max:29}), trigger: 'blur' }]
      },
      activeName:'',
      sensorId:'',
      tablist:[],
      inputChannelList:[],
      previewSwitchInfoInputChannelList:[]
    }
  },
 
  methods:{
    //获取设备视频输出列表
    getByIsApi(){
      if(Boolean(this.isTemplate) == true) return
      if(this.form['IsApiSensorInInfoCapability']){
        this.previewSwitchInfoInputChannelList = [];
        let resData = this.form['IsApiPreviewSwitchInfoCapability'].IsApiPreviewSwitchInfoCapability.displayWindowList;
        for(let i = 0;i < resData.length;i++){
          this.previewSwitchInfoInputChannelList.push({channelList:this.channelList(resData[i].displayChannelNoMin,resData[i].displayChannelNoMax)})
        }
        this.makeSensorName()
        return
      } 
      if(this.form['IsApiProgramMgrInfo'] && !this.form['IsApiSensorInInfoCapability']){
        this.inputChannelList = [];
        this.form['IsApiProgramMgrInfo']['pageList'].forEach((item,index) =>{
          this.tablist.push({
            name:item.pageName
          })
        })
        this.activeName = this.form['IsApiProgramMgrInfo']['pageList'][0].pageName;
        if(this.form['IsApiProgramMgrInfoCapability']){
          for(let i = 1; i < this.form['IsApiProgramMgrInfoCapability'].inputChannelMax+1;i++){
            this.inputChannelList.push({
              value:i,
              label:`通道${i}`
            })
          }
          console.log(this.inputChannelList)
        }
        this.makeSensorName_()
        return
      } 
      let SensorParams = {
        deviceId: this.$route.query.deviceId || null,
        commandIds: ['IsApiSensorInInfoCapability']
      }
      let ProgramParams = {
        deviceId: this.$route.query.deviceId || null,
        commandIds: ['IsApiProgramMgrInfo']
      }
      this.tablist = [];
      Promise.all([this.$api.getDeviceConfigParamsByIsApi(SensorParams), this.$api.getDeviceConfigParamsByIsApi(ProgramParams)]).then((res) => {
        if (res[0].success == true || res[1].success == true) {
          if(JSON.parse(res[0].data)['IsApiSensorInInfoCapability'].statusCode !=4){
            this.activeName = JSON.parse(res[0].data)['IsApiSensorInInfoCapability']['sensorInCapabilityInfoList'][0].sensorName;
            this.sensorId = [JSON.parse(res[0].data)['IsApiSensorInInfoCapability']['sensorInCapabilityInfoList'][0].id].join();
            this.inputChannelList = this.channelList(JSON.parse(res[0].data)['IsApiSensorInInfoCapability']['sensorInCapabilityInfoList'][0].channelNoMin,JSON.parse(res[0].data)['IsApiSensorInInfoCapability']['sensorInCapabilityInfoList'][0].channelNoMax);
            this.getSensorInInfo(this.sensorId,0);
            this.form = Object.assign({}, this.form, JSON.parse(res[0].data));
            this.copyForm = Object.assign({}, this.copyForm,JSON.parse(JSON.stringify(JSON.parse(res[0].data))));
            this.makeSensorName()
            this.getPreviewSwitchInfo()
            this.getIsApiPreviewSwitchInfoCapability()
          }else{
            this.inputChannelList = [];
            if(JSON.parse(res[1].data)['IsApiProgramMgrInfoCapability']){
              for(let i = 1; i < JSON.parse(res[1].data)['IsApiProgramMgrInfoCapability'].inputChannelMax+1;i++){
                this.inputChannelList.push({
                  value:i,
                  label:`通道${i}`
                })
              }
            }
            JSON.parse(res[1].data)['IsApiProgramMgrInfo']['pageList'].forEach((item,index) =>{
              this.tablist.push({
                name:item.pageName
              })
              this.form['IsApiProgramMgrInfo_'+index] = JSON.parse(res[1].data)['IsApiProgramMgrInfo']
              this.copyForm['IsApiProgramMgrInfo_'+index] = JSON.parse(JSON.stringify(JSON.parse(res[1].data)['IsApiProgramMgrInfo']))
              this.form['IsApiProgramMgrInfo_'+index]['pageList'] = item;
              this.copyForm['IsApiProgramMgrInfo_'+index]['pageList'] = JSON.parse(JSON.stringify(item));
            })
            this.activeName = JSON.parse(res[1].data)['IsApiProgramMgrInfo']['pageList'][0].pageName;
            this.form = Object.assign({}, this.form, JSON.parse(res[1].data));
            this.copyForm = Object.assign({}, this.copyForm,JSON.parse(JSON.stringify(JSON.parse(res[1].data))));
            this.makeSensorName_()
          }
        }else{
          this.$message.error('获取设备配置参数失败:' + res[0].msg)
        }
      })
    },
    channelList(min,max){
      let channelList = []
      for(let i = min;i < max+1;i++){
        channelList.push({
          value:i,
          label:`通道${i}`
        })
      }
      return channelList
    },
    //IsApiSensorInInfoCapability协议tabs名称转换
    makeSensorName(){
      this.sensorNameJson = {};
      this.form['IsApiSensorInInfoCapability']['sensorInCapabilityInfoList'].forEach(item =>{
        switch(item.sensorName){
          case 'BACK':
            this.sensorNameJson[item.sensorName] = '倒车';
          break;
          case 'BSD_L':
            this.sensorNameJson[item.sensorName] = '左盲区';
          break;
          case 'BSD_R':
            this.sensorNameJson[item.sensorName] = '右盲区';
          break;
          case 'TURN_L':
            this.sensorNameJson[item.sensorName] = '左转向灯';
          break;
          case 'TRUE_R':
            this.sensorNameJson[item.sensorName] = '右转向灯';
          break;
          case 'default':
            this.sensorNameJson[item.sensorName] = '预览模式';
          break;
          default:
            this.sensorNameJson[item.sensorName] = item.sensorName;
          break
        }
      })
    },
    //IsApiProgramMgrInfo协议tabs名称转换
    makeSensorName_(){
      this.sensorNameJson = {};
      this.form['IsApiProgramMgrInfo']['pageList'].forEach(item =>{
        switch(item.pageName){
          case 'BACK':
            this.sensorNameJson[item.pageName] = '倒车';
          break;
          case 'BSD_L':
            this.sensorNameJson[item.pageName] = '左盲区';
          break;
          case 'BSD_R':
            this.sensorNameJson[item.pageName] = '右盲区';
          break;
          case 'TURN_L':
            this.sensorNameJson[item.pageName] = '左转向灯';
          break;
          case 'TRUE_R':
            this.sensorNameJson[item.pageName] = '右转向灯';
          break;
          case 'default':
            this.sensorNameJson[item.pageName] = '预览模式';
          break;
          default:
            this.sensorNameJson[item.pageName] = item.pageName;
          break
        }
      })
    },
    //获取设备通道能力集
    getIsApiPreviewSwitchInfoCapability(){
      this.previewSwitchInfoInputChannelList = [];
      let params = {
          deviceId: this.$route.query.deviceId || null,
          commandIds: ['IsApiPreviewSwitchInfoCapability'],
        }
      this.$api.getDeviceConfigParamsByIsApi(params).then(res =>{
        if (res.success == true && !JSON.parse(res.data)['IsApiPreviewSwitchInfoCapability']['statusCode']) {
          let resData = JSON.parse(res.data).IsApiPreviewSwitchInfoCapability.displayWindowList;
          for(let i = 0;i < resData.length;i++){
            this.previewSwitchInfoInputChannelList.push({channelList:this.channelList(resData[i].displayChannelNoMin,resData[i].displayChannelNoMax)})
          }
          this.form = Object.assign({}, this.form, JSON.parse(res.data));
          this.copyForm = Object.assign({}, this.copyForm,JSON.parse(JSON.stringify(JSON.parse(res.data))));
          console.log(this.previewSwitchInfoInputChannelList)
        }else{
          this.$message.error('获取设备配置参数失败:' + res.msg)
        }
      })
    },  
    getPreviewSwitchInfo(){
      let params = {
        deviceId: this.$route.query.deviceId || null,
        commandIds: ['IsApiPreviewSwitchInfo'],
        params:JSON.stringify({
          groupNo:'0',
          videoOutType:'CVBS'
        })
      };
      this.$api.getDeviceConfigParamsByIsApi(params).then(res =>{
        if (res.success == true && !JSON.parse(res.data)['IsApiPreviewSwitchInfo']['statusCode']) {
          this.form = Object.assign({}, this.form, JSON.parse(res.data));
          this.copyForm = Object.assign({}, this.copyForm,JSON.parse(JSON.stringify(JSON.parse(res.data))));
        }else{
          this.$message.error('获取设备配置参数失败:' + res.msg)
        }
      })
    },
    //获取sensorIn配置
    getSensorInInfo(id,index){
       let params = {
          deviceId: this.$route.query.deviceId || null,
          commandIds: ['IsApiSensorInInfo'],
          params:JSON.stringify({"sensorID":id})
       }
       if(this.form['IsApiSensorInInfo_'+index]) return
       this.$api.getDeviceConfigParamsByIsApi(params).then(res =>{
         if (res.success == true && !JSON.parse(res.data)['IsApiSensorInInfo']['statusCode']) {
           this.form['IsApiSensorInInfo_'+index] = JSON.parse(res.data)['IsApiSensorInInfo'];
           this.copyForm['IsApiSensorInInfo_'+index] = JSON.parse(JSON.stringify(JSON.parse(res.data)['IsApiSensorInInfo']));
           this.form = Object.assign({}, this.form, JSON.parse(res.data));
           this.copyForm = Object.assign({}, this.copyForm, JSON.parse(JSON.stringify(JSON.parse(res.data))));
         }else{
          this.$message.error('获取设备配置参数失败:' + res.msg)
        }
       })
    },
    changeTabs(tabName){
      if(this.form['IsApiSensorInInfo']){
        if(tabName != 'default'){
          let index;
          for(let i = 0;i < this.form['IsApiSensorInInfoCapability']['sensorInCapabilityInfoList'].length;i++){
            if(this.form['IsApiSensorInInfoCapability']['sensorInCapabilityInfoList'][i].sensorName == tabName){
              this.sensorId = [this.form['IsApiSensorInInfoCapability']['sensorInCapabilityInfoList'][i].id].join();
              index = i;
              break
            }
          }
          this.getSensorInInfo(this.sensorId,index);
        } 
      }                
      this.activeName = tabName
      this.$emit('getActiveName',this.activeName);
    },
    setPageList(index,type){
      if(index !== ''){
        this.form['IsApiProgramMgrInfo']['pageList'][index]['windowSplitMode'] = 'SLIP'+type;
        this.form['IsApiProgramMgrInfo_'+index]['pageList']['windowSplitMode'] = 'SLIP'+type;
        this.form['IsApiProgramMgrInfo_'+index]['pageList']['windowList'] = [];
        for (let i = 0; i < type; i++) {
          this.form['IsApiProgramMgrInfo_'+index]['pageList']['windowList'].push(
            {
              id:i+1,
              inputChannel: i+1,
              staticMaterialType: "video"
            }
          )
        }
      }else{
        switch (type) {
        case 1:
          this.form['IsApiPreviewSwitchInfo']['displayWindowList'][0].displayChannelNo = 1;
          for(let i = type;i < this.form['IsApiPreviewSwitchInfo']['displayWindowList'].length;i++){
            this.form['IsApiPreviewSwitchInfo']['displayWindowList'][i].displayChannelNo = 0
          }
        break;
        case 4:
          for(let i = 0;i < type;i++){
            this.form['IsApiPreviewSwitchInfo']['displayWindowList'][i].displayChannelNo = i+1
          }
          for(let i = type;i < this.form['IsApiPreviewSwitchInfo']['displayWindowList'].length;i++){
            this.form['IsApiPreviewSwitchInfo']['displayWindowList'][i].displayChannelNo = 0
          }
        break;
        case 6:
          for(let i = 0;i < type;i++){
            this.form['IsApiPreviewSwitchInfo']['displayWindowList'][i].displayChannelNo = i+1
          }
          for(let i = type;i < this.form['IsApiPreviewSwitchInfo']['displayWindowList'].length;i++){
            this.form['IsApiPreviewSwitchInfo']['displayWindowList'][i].displayChannelNo = 0
          }
        break;
        case 9:
          for(let i = 0;i < type;i++){
            this.form['IsApiPreviewSwitchInfo']['displayWindowList'][i].displayChannelNo = i+1
          }
          for(let i = type;i < this.form['IsApiPreviewSwitchInfo']['displayWindowList'].length;i++){
            this.form['IsApiPreviewSwitchInfo']['displayWindowList'][i].displayChannelNo = 0
          }
        break;
      }
      this.form['IsApiPreviewSwitchInfo']['previewFrameNo'] = type;
      }
    }
  },
}
</script>

<style lang="less" scoped>
  .textCenter{
    text-align: center;
  }
  .channelShow1,.channelShow2,.channelShow3,.channelShow4,.channelShow5{
      width: 100%;
      font-size: 16px;
      color: black;
      background: whitesmoke;
      cursor: pointer;
    }
    .channelShow1{
      height: 400px;
      line-height: 400px;
    }
    .channelShow2{
      height: 200px;
      line-height: 200px;
    }
    .channelShow3{
      height: 270px;
      line-height: 270px;
    }
    .channelShow4{
      height: 122px;
      line-height:122px;
    }
    
</style>