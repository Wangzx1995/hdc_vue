<template>
    <div class="p-a-md" style="height:100%">
      <el-form
          ref="firstCenterPublic"
          label-position="top"
          :model="form"
          label-width="120px"
          style="height:100%"
        >
        <template v-if="form['IsApiPlatform'] && form['IsApiPlatform'].platformInfoList.length>0">
          <el-tabs v-model="activeName" @tab-click="changeCenter(activeName)">
              <el-tab-pane label="基本设置" name="基本设置"
              v-for="(item) in tabLists"
              v-bind:key="item.index">
                      <el-row type="flex" justify="space-between" style="margin-top: 10px;">
                          <el-col :span="7" >
                            <el-form-item label="启用服务器">
                              <el-switch v-model="form['IsApiPlatform'].platformInfoList[0].enabled" :active-value="Number(1)" :inactive-value="Number(0)"></el-switch>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7" >
                            <el-form-item label="扩充协议类型">
                                <el-select v-model="form['IsApiPlatform'].platformInfoList[0].protocolType">
                                  <el-option 
                                    v-for="item_ in protocolTypeList[0]"
                                    :label="item_.label"
                                    :value="item_.value"
                                    :key="item_.value"
                                  ></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        
                        <el-col :span="7" >
                            <el-form-item label="接入协议类型">
                                <el-select v-model="form['IsApiPlatform'].platformInfoList[0].protocolVersion">
                                  <el-option 
                                    v-for="item_ in protocolVersionOptions[0]"
                                    :label="item_.label"
                                    :value="item_.value"
                                    :key="item_.value"
                                  ></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                      </el-row>
                      <el-row type="flex" justify="space-between">
                        <el-col :span="7" >
                              <el-form-item label="地址格式类型">
                                  <el-select :disabled="centerHasIot == 0 && form['IsApiPlatform'].platformInfoList[0]['serverInfoList'][0].hostName == 'iot81.hikvisionauto.com'" v-model="form['IsApiPlatform'].platformInfoList[0]['serverInfoList'][0].addressingFormatType">
                                    <el-option label="IP" :value="0"></el-option>
                                    <el-option label="域名" :value="1"></el-option>
                                  </el-select>
                              </el-form-item>
                          </el-col>
                          <el-col :span="7" >
                              <el-form-item label="域名" v-if="form['IsApiPlatform'].platformInfoList[0]['serverInfoList'][0].addressingFormatType==1">
                                <el-input @change="hostNameChange" :disabled="centerHasIot == 0 && form['IsApiPlatform'].platformInfoList[0]['serverInfoList'][0].hostName == 'iot81.hikvisionauto.com'" v-model="form['IsApiPlatform'].platformInfoList[0]['serverInfoList'][0].hostName"></el-input>
                              </el-form-item>
                              <el-form-item label="IP" v-if="form['IsApiPlatform'].platformInfoList[0]['serverInfoList'][0].addressingFormatType==0">
                                <h-ip-input v-model="form['IsApiPlatform'].platformInfoList[0]['serverInfoList'][0].ipv4Address"></h-ip-input>
                              </el-form-item>
                          </el-col>
                        <el-col :span="7" >
                            <el-form-item label="手机号" :rules="{ validator: checkPhoneNum.bind({type:'int'}), trigger: 'blur' }" prop="IsApiPlatform.platformInfoList[0].cellPhoneNumber">
                                <el-input tips-placement="top-end" :tips="`不超过20位字符`" v-model="form['IsApiPlatform'].platformInfoList[0].cellPhoneNumber"></el-input>
                            </el-form-item>
                        </el-col>
                      </el-row>
                      <el-row type="flex" justify="space-between">
                        <el-col :span="7" >
                            <el-form-item label="端口号" :rules="{ validator: checkNumber.bind({type:'int',min:0,max:65535}), trigger: 'blur' }" prop="IsApiPlatform.platformInfoList[0].tcpPortNo">
                                <el-input tips-placement="top-end" :tips="`键入数值范围为0~65535`" v-model="form['IsApiPlatform'].platformInfoList[0].tcpPortNo"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col v-if="form['IsApiPlatform'].platformInfoList[0].protocolVersion == 2011" :span="7" >
                            <el-form-item label="终端ID" :rules="{ validator: checkterminalStr.bind({type:'int'}), trigger: 'blur' }" prop="IsApiPlatform.platformInfoList[0].terminalId">
                                <el-input tips-placement="top-end" :tips="`大写字符和数字组成的7位字符串`" v-model="form['IsApiPlatform'].platformInfoList[0].terminalId"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col v-if="form['IsApiPlatform'].platformInfoList[0].protocolVersion == 2019" :span="7" >
                            <el-form-item label="终端ID" :rules="{ validator: checkterminalStr30.bind({type:'int'}), trigger: 'blur' }" prop="IsApiPlatform.platformInfoList[0].terminalId">
                                <el-input tips-placement="top-end" :tips="`大写字符和数字组成的不小于7且不大于30位的字符串`" v-model="form['IsApiPlatform'].platformInfoList[0].terminalId"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7" >
                          <el-form-item v-if="form['IsApiPlatformCapability']['platformCapabilityList'][0]['videoEnabled']" label="视频使能">
                            <el-switch v-model="form['IsApiPlatform'].platformInfoList[0].videoEnabled" :active-value="Number(1)" :inactive-value="Number(0)"></el-switch>
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <el-row type="flex" justify="space-between">
                      <el-col :span="7" >
                            <el-form-item label="报警上传使能">
                              <el-switch v-model="form['IsApiPlatform'].platformInfoList[0].alarmEnable" :active-value="Number(1)" :inactive-value="Number(0)"></el-switch>
                            </el-form-item>
                        </el-col>
                      </el-row>
                        <!-- <el-col :span="7" >
                            <el-form-item label="紧急报警汇报时间间隔" v-if="form['IsApiPlatform'].platformInfoList[0]['IsApiPlatformOthers0']" :rules="{ validator: checkNumber.bind({type:'int',min:1,max:50000}), trigger: 'blur' }" prop="IsApiPlatform.platformInfoList[0].IsApiPlatformOthers0.reportTimeIntervalDuringAlarm">
                                <el-input v-model="form['IsApiPlatform'].platformInfoList[0]['IsApiPlatformOthers0'].reportTimeIntervalDuringAlarm"><span slot="suffix">s</span></el-input>
                            </el-form-item>
                        </el-col> -->
                        <!-- <el-col :span="7" >
                            <el-form-item label="主动拍照策略" v-if="form['IsApiPlatform'].platformInfoList[0]['IsApiPlatformOthers0']">
                                <el-select :disabled="form['IsApiPlatform'].platformInfoList[0].protocolType == 'std'" v-model="form['IsApiPlatform'].platformInfoList[0]['IsApiPlatformOthers0'].activePhotoStrategy">
                                  <el-option label="不开启" :value="0"></el-option>
                                  <el-option label="定时拍照" :value="1"></el-option>
                                  <el-option label="定距拍照" :value="2"></el-option>
                                  <el-option label="保留" :value="3"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col> -->
                        <!-- <el-col :span="7" >
                            <el-form-item label="缺省时间汇报时间间隔" v-if="form['IsApiPlatform'].platformInfoList[0]['IsApiPlatformOthers0']" :rules="{ validator: checkNumber.bind({type:'int',min:1,max:50000}), trigger: 'blur' }" prop="IsApiPlatform.platformInfoList[0].IsApiPlatformOthers0.reportTimeIntervalDuringDefault">
                                <el-input v-model="form['IsApiPlatform'].platformInfoList[0]['IsApiPlatformOthers0'].reportTimeIntervalDuringDefault"><span slot="suffix">s</span></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                      <el-row type="flex" justify="space-between" >
                         <el-col :span="7" >
                            <el-form-item label="休眠汇报时间间隔" v-if="form['IsApiPlatform'].platformInfoList[0]['IsApiPlatformOthers0']" :rules="{ validator: checkNumber.bind({type:'int',min:1,max:50000}), trigger: 'blur' }" prop="IsApiPlatform.platformInfoList[0].IsApiPlatformOthers0.reportTimeIntervalDuringSleep">
                                <el-input v-model="form['IsApiPlatform'].platformInfoList[0]['IsApiPlatformOthers0'].reportTimeIntervalDuringSleep"><span slot="suffix">s</span></el-input>
                            </el-form-item>
                        </el-col> -->
                          <!--<el-col :span="7" >
                            <el-form-item label="备份服务器无线通信拨号密码">
                                <el-input v-model="item.sleepReportTimeInterval"></el-input>
                            </el-form-item>
                        </el-col>-->
                        
                        <!-- <el-col :span="7" >
                        </el-col>
                    </el-row> -->
                    <!-- <el-row> -->
                    
                      <!-- <el-tabs v-model="activeName2" >
                          <el-tab-pane :label="'服务器' + (+indexx+1)" :name="'服务器' + (+indexx+1)" v-for="(itemx,indexx) in form['IsApiPlatform'].platformInfoList[0].serverInfoList" v-bind:key="indexx">
                                  <el-row type="flex" justify="space-between" style="margin-top: 10px;"> -->
                            <!-- <el-col :span="7" >
                              <el-form-item label="服务器类型">
                                  <el-select v-model="itemx.serverType">
                                    <el-option label="主服务器" :value="0"></el-option>
                                    <el-option label="备服务器" :value="1"></el-option>
                                  </el-select>
                              </el-form-item>
                          </el-col> -->
                          
                        <!-- </el-row> -->
                        <!-- <el-button type="primary" @click="addOne(index, indexx)" :disabled="isDisabledAdd[index]">添加服务器</el-button>
                        <el-button type="danger" @click="deleteBtn(index, indexx)" :disabled="isDisabledDel[index]">删除当前服务器</el-button> -->
                <!-- </el-tab-pane>
            </el-tabs> -->
          
        <!-- </el-row> -->
        </el-tab-pane>
        <template v-if="form['IsApiPlatform']['platformInfoList'][0]['IsApiLocationReportOthers0']">  
        <el-tab-pane label="定位上传设置" name="定位上传设置">
          <h2>位置汇报设置</h2>
          <el-row type="flex" justify="space-between">
            <el-col :span="7" >
                    <el-form-item label="位置汇报策略">
                        <el-select v-model="form['IsApiPlatform']['platformInfoList'][0]['IsApiLocationReportOthers0'].reportGpsStrategy">
                          <el-option label="定时汇报" :value="0"></el-option>
                          <el-option label="定距汇报" :value="1"></el-option>
                          <el-option label="定时和定距汇报" :value="2"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            <el-col :span="7" >
                <el-form-item label="位置汇报方案">
                    <el-select v-model="form['IsApiPlatform']['platformInfoList'][0]['IsApiLocationReportOthers0'].reportGpsPlan">
                      <el-option label="根据ACC状态" :value="0"></el-option>
                      <el-option label="根据登陆状态和ACC状态" :value="1"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="7"></el-col>
          </el-row>
          <h2>拐点补传角度设置</h2>
            <el-row type="flex" justify="space-between">
                <el-col :span="7" >
                    <el-form-item label="拐点补传角度（<=180度）" :rules="{ validator: checkNumber.bind({type:'int',min:0,max:180}), trigger: 'blur' }" prop="IsApiPlatform.platformInfoList[0].IsApiLocationReportOthers0.replenishGpsAngle">
                        <el-input tips-placement="top-end" :tips="`键入数值范围为0~180`" v-model.number="form['IsApiPlatform']['platformInfoList'][0]['IsApiLocationReportOthers0'].replenishGpsAngle"><span slot="suffix">度</span></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <h2>上报时间间隔设置</h2>
            <el-row type="flex" justify="space-between">
                <el-col :span="7" >
                    <el-form-item label="休眠汇报时间间隔" :rules="{ validator: checkNumber.bind({type:'int',min:0,max:172800}), trigger: 'blur' }" prop="IsApiPlatform.platformInfoList[0].IsApiLocationReportOthers0.reportTimeIntervalDuringSleep">
                       <el-input tips-placement="top-end" :tips="`键入数值范围为0~172800`" v-model.number="form['IsApiPlatform']['platformInfoList'][0]['IsApiLocationReportOthers0'].reportTimeIntervalDuringSleep"><span slot="suffix">s</span></el-input></el-form-item>
                </el-col>
                <el-col :span="7" >
                    <el-form-item label="紧急报警汇报时间间隔" :rules="{ validator: checkNumber.bind({type:'int',min:0,max:50000}), trigger: 'blur' }" prop="IsApiPlatform.platformInfoList[0].IsApiLocationReportOthers0.reportTimeIntervalDuringAlarm">
                        <el-input tips-placement="top-end" :tips="`键入数值范围为0~50000`" v-model.number="form['IsApiPlatform']['platformInfoList'][0]['IsApiLocationReportOthers0'].reportTimeIntervalDuringAlarm"><span slot="suffix">s</span></el-input></el-form-item>
                </el-col>
                <el-col :span="7" >
                    <el-form-item label="缺省时间汇报时间间隔" :rules="{ validator: checkNumber.bind({type:'int',min:0,max:50000}), trigger: 'blur' }" prop="IsApiPlatform.platformInfoList[0].IsApiLocationReportOthers0.reportTimeIntervalDuringDefault">
                        <el-input tips-placement="top-end" :tips="`键入数值范围为0~50000`" v-model.number="form['IsApiPlatform']['platformInfoList'][0]['IsApiLocationReportOthers0'].reportTimeIntervalDuringDefault"><span slot="suffix">s</span></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row type="flex" justify="space-between">
                <el-col :span="7" >
                    <el-form-item label="驾驶员未登录汇报时间间隔" :rules="{ validator: checkNumber.bind({type:'int',min:0,max:50000}), trigger: 'blur' }" prop="IsApiPlatform.platformInfoList[0].IsApiLocationReportOthers0.driverUnloginUploadTimeInterval">
                        <el-input tips-placement="top-end" :tips="`键入数值范围为0~50000`" v-model.number="form['IsApiPlatform']['platformInfoList'][0]['IsApiLocationReportOthers0'].driverUnloginUploadTimeInterval"><span slot="suffix">s</span></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <h2>上报距离间隔设置</h2>
            <el-row type="flex" justify="space-between">
                <el-col :span="7" >
                    <el-form-item label="缺省距离汇报间隔" :rules="{ validator: checkNumber.bind({type:'int',min:0,max:50000}), trigger: 'blur' }" prop="IsApiPlatform.platformInfoList[0].IsApiLocationReportOthers0.defaultDistanceReportingInterval">
                        <el-input tips-placement="top-end" :tips="`键入数值范围为0~50000`" v-model.number="form['IsApiPlatform']['platformInfoList'][0]['IsApiLocationReportOthers0'].defaultDistanceReportingInterval"><span slot="suffix">m</span></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="7" >
                    <el-form-item label="驾驶员未登录汇报距离间隔" :rules="{ validator: checkNumber.bind({type:'int',min:0,max:50000}), trigger: 'blur' }" prop="IsApiPlatform.platformInfoList[0].IsApiLocationReportOthers0.driverNotLoggedInReportingInterval">
                        <el-input tips-placement="top-end" :tips="`键入数值范围为0~50000`" v-model.number="form['IsApiPlatform']['platformInfoList'][0]['IsApiLocationReportOthers0'].driverNotLoggedInReportingInterval"><span slot="suffix">m</span></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="7" >
                    <el-form-item label="休眠时汇报距离间隔" :rules="{ validator: checkNumber.bind({type:'int',min:0,max:50000}), trigger: 'blur' }" prop="IsApiPlatform.platformInfoList[0].IsApiLocationReportOthers0.sleepDistanceReportingInterval">
                        <el-input tips-placement="top-end" :tips="`键入数值范围为0~50000`" v-model.number="form['IsApiPlatform']['platformInfoList'][0]['IsApiLocationReportOthers0'].sleepDistanceReportingInterval"><span slot="suffix">m</span></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row type="flex" justify="space-between">
                <el-col :span="7" >
                    <el-form-item label="紧急报警时汇报距离间隔" :rules="{ validator: checkNumber.bind({type:'int',min:0,max:50000}), trigger: 'blur' }" prop="IsApiPlatform.platformInfoList[0].IsApiLocationReportOthers0.alarmDistanceReportingInterval">
                        <el-input tips-placement="top-end" :tips="`键入数值范围为0~50000`" v-model.number="form['IsApiPlatform']['platformInfoList'][0]['IsApiLocationReportOthers0'].alarmDistanceReportingInterval"><span slot="suffix">m</span></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-tab-pane>
        </template>
        <!-- <el-tab-pane label="报警设置" name="报警设置">
          <el-row type="flex" justify="space-between">
            <el-col :span="7" >
              <el-form-item label="报警使能">
                <el-switch v-model="IsApiPlatformAlarm.platformList[0]['alarmList'][0].enabled" ></el-switch>
              </el-form-item>
            </el-col>
            <el-col :span="7" ></el-col>
            <el-col :span="7" ></el-col>
          </el-row>
        </el-tab-pane> -->
      </el-tabs>
    </template>

        <!-- <EmptyBox v-else style="height:100%">
          <p slot="description" class="text-md">暂无数据～</p>
        </EmptyBox> -->
      </el-form>
    </div>
</template>

<script>
import EmptyBox from '@/components/coreManage/emptyBox'
import {validateNum,thirtynId,sevenId,tenBcd} from '@/utils/validate';
export default {
  components: {
    EmptyBox
  },
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
    },
    configParams:{
      type:Boolean,
      default:false
    },
    centerHasIot:{
      type:Number,
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
    form: {
      handler (val) {
        if (JSON.stringify(val) !== '{}'){
          this.$emit('change',val)
        }
      },
      deep: true,
      immediate:true,
    },
    configParams:{
        handler (val) {
        if(!val){
          this.getDeviceConfigParamsByIsApi();
        }
      },
      deep: true,
      immediate:true,
    },
    'form.IsApiPlatform.platformInfoList.0':{
      handler(val){
        console.log(val)
        if(val!=undefined && val['IsApiLocationReportOthers0']){
          this.$refs['firstCenterPublic'].validate((valid) => {
            console.log(this.copyForm)
            if(valid){
              if(this.form['IsApiPlatformCapability']['platformCapabilityList'][0]['videoEnabled']){
                this.formData['IsApiPlatform.platformInfoList.0.videoEnabled'] = val['videoEnabled'] != this.copyForm['IsApiPlatform']['platformInfoList'][0]['videoEnabled'] ? `IsApiPlatform.platformInfoList.0.videoEnabled&多中心设置/第1中心/基本设置/视频使能&${val['videoEnabled'] ? '启用' : '关闭'}` : '';
              }
              this.formData['IsApiPlatform.platformInfoList.0.enabled'] = val['enabled'] != this.copyForm['IsApiPlatform']['platformInfoList'][0]['enabled'] ? `IsApiPlatform.platformInfoList.0.enabled&多中心设置/第1中心/基本设置/启用服务器&${val['enabled'] ? '启用' : '关闭'}` : '';
              this.formData['IsApiPlatform.platformInfoList.0.alarmEnable'] = val['alarmEnable'] != this.copyForm['IsApiPlatform']['platformInfoList'][0]['alarmEnable'] ? `IsApiPlatform.platformInfoList.0.alarmEnable&多中心设置/第1中心/基本设置/报警上传使能&${val['alarmEnable'] ? '启用' : '关闭'}` : '';
              this.formData['IsApiPlatform.platformInfoList.0.protocolType'] = val['protocolType'] != this.copyForm['IsApiPlatform']['platformInfoList'][0]['protocolType'] ? `IsApiPlatform.platformInfoList.0.protocolType&多中心设置/第1中心/基本设置/扩充协议类型&${this.protocolTypes[val['protocolType']]}` : '';
              this.formData['IsApiPlatform.platformInfoList.0.protocolVersion'] = val['protocolVersion'] != this.copyForm['IsApiPlatform']['platformInfoList'][0]['protocolVersion'] ? `IsApiPlatform.platformInfoList.0.protocolVersion&多中心设置/第1中心/基本设置/接入协议类型&${val['protocolVersion']}版本` : '';
              this.formData['IsApiPlatform.platformInfoList.0.serverInfoList.0.addressingFormatType'] = val['serverInfoList'][0]['addressingFormatType'] != this.copyForm['IsApiPlatform']['platformInfoList'][0]['serverInfoList'][0]['addressingFormatType'] ? `IsApiPlatform.platformInfoList.0.serverInfoList.0.addressingFormatType&多中心设置/第1中心/基本设置/地址格式类型&${val['serverInfoList'][0]['addressingFormatType']==0 ? 'IP' : '域名'}` : '';
              this.formData['IsApiPlatform.platformInfoList.0.serverInfoList.0.hostName'] = val['serverInfoList'][0]['hostName'] != this.copyForm['IsApiPlatform']['platformInfoList'][0]['serverInfoList'][0]['hostName'] ? `IsApiPlatform.platformInfoList.0.serverInfoList.0.hostName&多中心设置/第1中心/基本设置/域名&${val['serverInfoList'][0]['hostName']}` : '';
              this.formData['IsApiPlatform.platformInfoList.0.serverInfoList.0.ipv4Address'] = val['serverInfoList'][0]['ipv4Address'] != this.copyForm['IsApiPlatform']['platformInfoList'][0]['serverInfoList'][0]['ipv4Address'] ? `IsApiPlatform.platformInfoList.0.serverInfoList.0.ipv4Address&多中心设置/第1中心/基本设置/IP&${val['serverInfoList'][0]['ipv4Address']}` : '';
              this.formData['IsApiPlatform.platformInfoList.0.cellPhoneNumber'] = val['cellPhoneNumber'] != this.copyForm['IsApiPlatform']['platformInfoList'][0]['cellPhoneNumber'] ? `IsApiPlatform.platformInfoList.0.cellPhoneNumber&多中心设置/第1中心/基本设置/手机号&${val['cellPhoneNumber']}` : '';
              this.formData['IsApiPlatform.platformInfoList.0.tcpPortNo'] = val['tcpPortNo'] != this.copyForm['IsApiPlatform']['platformInfoList'][0]['tcpPortNo'] ? `IsApiPlatform.platformInfoList.0.tcpPortNo&多中心设置/第1中心/基本设置/端口号&${val['tcpPortNo']}` : '';
              this.formData['IsApiPlatform.platformInfoList.0.terminalId'] = val['terminalId'] != this.copyForm['IsApiPlatform']['platformInfoList'][0]['terminalId'] ? `IsApiPlatform.platformInfoList.0.terminalId&多中心设置/第1中心/基本设置/终端ID&${val['terminalId']}` : '';
              this.formData['IsApiPlatform.platformInfoList.0.IsApiLocationReportOthers0.reportGpsStrategy'] = val['IsApiLocationReportOthers0']['reportGpsStrategy'] != this.copyForm['IsApiPlatform']['platformInfoList'][0]['IsApiLocationReportOthers0']['reportGpsStrategy'] ? `IsApiPlatform.platformInfoList.0.IsApiLocationReportOthers0.reportGpsStrategy&多中心设置/第1中心/定位上传设置/位置汇报策略&${this.reportGpsStrategys[val['IsApiLocationReportOthers0']['reportGpsStrategy']]}` : '';
              this.formData['IsApiPlatform.platformInfoList.0.IsApiLocationReportOthers0.reportGpsPlan'] = val['IsApiLocationReportOthers0']['reportGpsPlan'] != this.copyForm['IsApiPlatform']['platformInfoList'][0]['IsApiLocationReportOthers0']['reportGpsPlan'] ? `IsApiPlatform.platformInfoList.0.IsApiLocationReportOthers0.reportGpsPlan&多中心设置/第1中心/定位上传设置/位置汇报方案&${this.reportGpsPlans[val['IsApiLocationReportOthers0']['reportGpsPlan']]}` : '';
              this.formData['IsApiPlatform.platformInfoList.0.IsApiLocationReportOthers0.replenishGpsAngle'] = val['IsApiLocationReportOthers0']['replenishGpsAngle'] != this.copyForm['IsApiPlatform']['platformInfoList'][0]['IsApiLocationReportOthers0']['replenishGpsAngle'] ? `IsApiPlatform.platformInfoList.0.IsApiLocationReportOthers0.replenishGpsAngle&多中心设置/第1中心/定位上传设置/拐点补传角度（<=180度）&${val['IsApiLocationReportOthers0']['replenishGpsAngle']}` : '';
              this.formData['IsApiPlatform.platformInfoList.0.IsApiLocationReportOthers0.reportTimeIntervalDuringSleep'] = val['IsApiLocationReportOthers0']['reportTimeIntervalDuringSleep'] != this.copyForm['IsApiPlatform']['platformInfoList'][0]['IsApiLocationReportOthers0']['reportTimeIntervalDuringSleep'] ? `IsApiPlatform.platformInfoList.0.IsApiLocationReportOthers0.reportTimeIntervalDuringSleep&多中心设置/第1中心/定位上传设置/休眠汇报时间间隔&${val['IsApiLocationReportOthers0']['reportTimeIntervalDuringSleep']}` : '';
              this.formData['IsApiPlatform.platformInfoList.0.IsApiLocationReportOthers0.reportTimeIntervalDuringAlarm'] = val['IsApiLocationReportOthers0']['reportTimeIntervalDuringAlarm'] != this.copyForm['IsApiPlatform']['platformInfoList'][0]['IsApiLocationReportOthers0']['reportTimeIntervalDuringAlarm'] ? `IsApiPlatform.platformInfoList.0.IsApiLocationReportOthers0.reportTimeIntervalDuringAlarm&多中心设置/第1中心/定位上传设置/紧急报警汇报时间间隔&${val['IsApiLocationReportOthers0']['reportTimeIntervalDuringAlarm']}` : '';
              this.formData['IsApiPlatform.platformInfoList.0.IsApiLocationReportOthers0.reportTimeIntervalDuringDefault'] = val['IsApiLocationReportOthers0']['reportTimeIntervalDuringDefault'] != this.copyForm['IsApiPlatform']['platformInfoList'][0]['IsApiLocationReportOthers0']['reportTimeIntervalDuringDefault'] ? `IsApiPlatform.platformInfoList.0.IsApiLocationReportOthers0.reportTimeIntervalDuringDefault&多中心设置/第1中心/定位上传设置/缺省时间汇报时间间隔&${val['IsApiLocationReportOthers0']['reportTimeIntervalDuringDefault']}` : '';
              this.formData['IsApiPlatform.platformInfoList.0.IsApiLocationReportOthers0.driverUnloginUploadTimeInterval'] = val['IsApiLocationReportOthers0']['driverUnloginUploadTimeInterval'] != this.copyForm['IsApiPlatform']['platformInfoList'][0]['IsApiLocationReportOthers0']['driverUnloginUploadTimeInterval'] ? `IsApiPlatform.platformInfoList.0.IsApiLocationReportOthers0.driverUnloginUploadTimeInterval&多中心设置/第1中心/定位上传设置/驾驶员未登录汇报时间间隔&${val['IsApiLocationReportOthers0']['driverUnloginUploadTimeInterval']}` : '';
              this.formData['IsApiPlatform.platformInfoList.0.IsApiLocationReportOthers0.defaultDistanceReportingInterval'] = val['IsApiLocationReportOthers0']['defaultDistanceReportingInterval'] != this.copyForm['IsApiPlatform']['platformInfoList'][0]['IsApiLocationReportOthers0']['defaultDistanceReportingInterval'] ? `IsApiPlatform.platformInfoList.0.IsApiLocationReportOthers0.defaultDistanceReportingInterval&多中心设置/第1中心/定位上传设置/缺省距离汇报间隔&${val['IsApiLocationReportOthers0']['defaultDistanceReportingInterval']}` : '';
              this.formData['IsApiPlatform.platformInfoList.0.IsApiLocationReportOthers0.driverNotLoggedInReportingInterval'] = val['IsApiLocationReportOthers0']['driverNotLoggedInReportingInterval'] != this.copyForm['IsApiPlatform']['platformInfoList'][0]['IsApiLocationReportOthers0']['driverNotLoggedInReportingInterval'] ? `IsApiPlatform.platformInfoList.0.IsApiLocationReportOthers0.driverNotLoggedInReportingInterval&多中心设置/第1中心/定位上传设置/驾驶员未登录汇报距离间隔&${val['IsApiLocationReportOthers0']['driverNotLoggedInReportingInterval']}` : '';
              this.formData['IsApiPlatform.platformInfoList.0.IsApiLocationReportOthers0.sleepDistanceReportingInterval'] = val['IsApiLocationReportOthers0']['sleepDistanceReportingInterval'] != this.copyForm['IsApiPlatform']['platformInfoList'][0]['IsApiLocationReportOthers0']['sleepDistanceReportingInterval'] ? `IsApiPlatform.platformInfoList.0.IsApiLocationReportOthers0.sleepDistanceReportingInterval&多中心设置/第1中心/定位上传设置/休眠时汇报距离间隔&${val['IsApiLocationReportOthers0']['sleepDistanceReportingInterval']}` : '';
              this.formData['IsApiPlatform.platformInfoList.0.IsApiLocationReportOthers0.alarmDistanceReportingInterval'] = val['IsApiLocationReportOthers0']['alarmDistanceReportingInterval'] != this.copyForm['IsApiPlatform']['platformInfoList'][0]['IsApiLocationReportOthers0']['alarmDistanceReportingInterval'] ? `IsApiPlatform.platformInfoList.0.IsApiLocationReportOthers0.alarmDistanceReportingInterval&多中心设置/第1中心/定位上传设置/紧急报警时汇报距离间隔&${val['IsApiLocationReportOthers0']['alarmDistanceReportingInterval']}` : '';
            }else{
              if(this.form['IsApiPlatformCapability']['platformCapabilityList'][0]['videoEnabled']){
                this.formData['IsApiPlatform.platformInfoList.0.videoEnabled'] = '';
              }
              this.formData['IsApiPlatform.platformInfoList.0.enabled'] = '';
              this.formData['IsApiPlatform.platformInfoList.0.protocolType'] = '';
              this.formData['IsApiPlatform.platformInfoList.0.protocolVersion'] = '';
              this.formData['IsApiPlatform.platformInfoList.0.serverInfoList.0.addressingFormatType'] = '';
              this.formData['IsApiPlatform.platformInfoList.0.serverInfoList.0.hostName'] = '';
              this.formData['IsApiPlatform.platformInfoList.0.serverInfoList.0.ipv4Address'] = '';
              this.formData['IsApiPlatform.platformInfoList.0.cellPhoneNumber'] = '';
              this.formData['IsApiPlatform.platformInfoList.0.tcpPortNo'] = '';
              this.formData['IsApiPlatform.platformInfoList.0.terminalId'] = '';
              this.formData['IsApiPlatform.platformInfoList.0.IsApiLocationReportOthers0.reportGpsStrategy'] = '';
              this.formData['IsApiPlatform.platformInfoList.0.IsApiLocationReportOthers0.reportGpsPlan'] = '';
              this.formData['IsApiPlatform.platformInfoList.0.IsApiLocationReportOthers0.replenishGpsAngle'] = '';
              this.formData['IsApiPlatform.platformInfoList.0.IsApiLocationReportOthers0.reportTimeIntervalDuringSleep'] = '';
              this.formData['IsApiPlatform.platformInfoList.0.IsApiLocationReportOthers0.reportTimeIntervalDuringAlarm'] = '';
              this.formData['IsApiPlatform.platformInfoList.0.IsApiLocationReportOthers0.reportTimeIntervalDuringDefault'] = '';
              this.formData['IsApiPlatform.platformInfoList.0.IsApiLocationReportOthers0.driverUnloginUploadTimeInterval'] = '';
              this.formData['IsApiPlatform.platformInfoList.0.IsApiLocationReportOthers0.defaultDistanceReportingInterval'] = '';
              this.formData['IsApiPlatform.platformInfoList.0.IsApiLocationReportOthers0.driverNotLoggedInReportingInterval'] = '';
              this.formData['IsApiPlatform.platformInfoList.0.IsApiLocationReportOthers0.sleepDistanceReportingInterval'] = '';
              this.formData['IsApiPlatform.platformInfoList.0.IsApiLocationReportOthers0.alarmDistanceReportingInterval'] = '';
            }
            this.$emit('changeData',this.formData)
          })
        }
        
      },
      deep: true,
      immediate:false,
    }
    // 'form.Others': {
    //   handler (val) {
    //     if (JSON.stringify(val) !== '{}'){
    //       this.$emit('getOthers', val)
    //     }
    //   },
    //   deep: true,
    //   immediate:true,
    // },

    // currentCenter: {
    //   handler (newVal, oldVal) {
    //     this.$emit('currentCenter',newVal)
    //   }
    // }
  },
  data() {
    const checkNumber1 = function (rule, value, callback) {
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
    return {
      IsApiPlatformAlarm:{
        platformList: [
          {
            id: 0,
            alarmList: [{
              alarmType: 0,
              enabled: true
            }]
          }
        ]
      },
      // Others: {
      //   // IsApiPlatformOthers0:{activePhotoStrategy:'',reportTimeIntervalDuringDefault:'',reportTimeIntervalDuringSleep:'',reportTimeIntervalDuringAlarm:''}
      // },
      currentCenter: 0,
      isDisabledDel: [],
      isDisabledAdd: [],
      protocolTypeList:[[],[],[],[],[],[]],
      protocolVersionOptions:[[],[],[],[],[],[]],
      protocolTypes:{},
      reportGpsStrategys:['定时汇报','定距汇报','定时和定距汇报'],
      reportGpsPlans:['根据ACC状态','根据登陆状态和ACC状态'],
      addFlag: [],
      form:{},
      copyForm:{},
      formData:{},
      activeName: '基本设置',
      activeName2: '服务器1',
      tabLists:[
          {
          name: '基本设置',
          shortName: '基本设置',
          commandId: 'IsApiPlatformOthers0',
          index:1
        }
      ],
      checkString :function (rule, value, callback) {
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
    },
      checkNumber :function (rule, value, callback) {
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
            callback(new Error("请输入"));
            // callback();
        }
      },
     checkPhoneNum : function(rule, value, callback){
       if(value.length > 0 && value.length < 21 && tenBcd(value)){
            callback();
        }else{
            callback(new Error('请输入不超过20位的数字'));
        }
     },
     checkterminalStr : function(rule,value,callback){
       if(value.length == 7 && sevenId(value)){
            callback();
        }else{
            callback(new Error('终端ID由大写字符和数字组成的7位字符串'));
        }
      },
      checkterminalStr30 : function(rule,value,callback){
        if(value.length >= 7 && value.length <=30 && thirtynId(value)){
            callback();
        }else{
            callback(new Error('终端ID由大写字符和数字组成的不小于7且不大于30位的字符串'));
        }
      }
    }
  },
  methods:{
    changeCenter(index){
      // this.activeName2 = '服务器1'
      // this.getOther(0,this.form)
      
    },
    hostNameChange(){
      if(this.form['IsApiPlatform'].platformInfoList[0]['serverInfoList'][0].hostName == 'iot81.hikvisionauto.com' && this.centerHasIot != null){
        this.$message.info(`“第${this.centerHasIot+1}中心”已配置iot81.hikvisionauto.com平台，请重新输入平台域名!`);
        this.form['IsApiPlatform'].platformInfoList[0]['serverInfoList'][0].hostName = ''
      }
    },
    // addOne(index, indexx) {
    //   // 添加
    //   this.form['IsApiPlatform'].platformInfoList[index].serverInfoList.push({
    //     serverType: '',
    //     addressingFormatType: 0,
    //     hostName: '',
    //     ipv4Address: '',
    //     id: this.form['IsApiPlatform'].platformInfoList[index].id
    //   })

    //   // 如果已经两个 就禁止继续添加
    //   if(this.form['IsApiPlatform'].platformInfoList[index].serverInfoList.length >= 2) {
    //     this.isDisabledAdd[index] = true
    //   } else {
    //     this.isDisabledAdd[index] = false
    //   }

    //   // 如果只剩一个了 就禁止继续删除
    //   if(this.form['IsApiPlatform'].platformInfoList[index].serverInfoList.length < 2) {
    //     this.isDisabledDel[index] = true
    //   } else if (this.form['IsApiPlatform'].platformInfoList[index].serverInfoList.length >= 2) {
    //     this.isDisabledDel[index] = false
    //   }

    //   this.$nextTick(() => {
    //     this.activeName2 = `服务器${indexx+2}`
    //   })
    // },
    // deleteBtn(index, indexx){
    //   this.form['IsApiPlatform'].platformInfoList[index].serverInfoList.splice(indexx,1)

    //   // 如果已经两个 就禁止继续添加
    //   if(this.form['IsApiPlatform'].platformInfoList[index].serverInfoList.length >= 2) {
    //     this.isDisabledAdd[index] = true
    //   } else {
    //     this.isDisabledAdd[index] = false
    //   }

    //   // 如果只剩一个了 就禁止继续删除
    //   if(this.form['IsApiPlatform'].platformInfoList[index].serverInfoList.length < 2) {
    //     this.isDisabledDel[index] = true
    //   } else if (this.form['IsApiPlatform'].platformInfoList[index].serverInfoList.length >= 2) {
    //     this.isDisabledDel[index] = false
    //   }

    //   this.$nextTick(() => {
    //     this.activeName2 = `服务器${indexx}`
    //   })
    // },
    getDeviceConfigParamsByIsApi() {
      if(this.isTemplate == 'true'){
        this.form['IsApiPlatformCapability']['platformCapabilityList'].forEach((item,index) =>{
            for(let i = 0;i < item['protocolVersionOptions'].length;i++){
              switch(item['protocolVersionOptions'][i]){
                case "2011":
                  this.protocolVersionOptions[index].push({
                    value:item['protocolVersionOptions'][i],
                    label:'2011版本'
                  })
                break;
                case "2019":
                  this.protocolVersionOptions[index].push({
                    value:item['protocolVersionOptions'][i],
                    label:'2019版本'
                  })
                break;
              }
            }
            if(this.protocolVersionOptions[index].length>item['protocolVersionOptions'].length){
              this.protocolVersionOptions[index].splice(0,item['protocolVersionOptions'].length)
            }
          })
          this.protocolTypes = {};
          this.form['IsApiPlatformCapability']['platformCapabilityList'][0]['protocolTypeOptions'].forEach(item =>{
            switch (item){
                case 'jing':
                this.protocolTypes[item] = '京标平台';
              break;
              case 'std':
                this.protocolTypes[item] = '部标平台';
              break;
              case 'su':
                this.protocolTypes[item] = '苏标平台';
              break;
              case 'zhe':
                this.protocolTypes[item] = '浙标平台';
              break;
              case 'chong':
                this.protocolTypes[item] = '渝标平台';
              break;
              case 'shan':
                this.protocolTypes[item] = '陕标平台';
              break;
              case 'lu':
                this.protocolTypes[item] = '鲁标平台';
              break;
              case 'yue':
                this.protocolTypes[item] = '粤标平台';
              break;
              case 'hei':
                this.protocolTypes[item] = '黑标平台';
              break;
              case 'chuan':
                this.protocolTypes[item] = '川标平台';
              break;
              case 'liao':
                this.protocolTypes[item] = '辽标平台';
              break;
              case 'hat':
                this.protocolTypes[item] = '运维平台';
              break;
            }
          })
          this.form['IsApiPlatformCapability']['platformCapabilityList'].forEach((item,index) =>{
            for(let i = 0;i < item['protocolTypeOptions'].length;i++){
              switch(item['protocolTypeOptions'][i]){
                case "jing":
                  this.protocolTypeList[index].push({
                    value:item['protocolTypeOptions'][i],
                    label:'京标平台'
                  })
                break;
                case "std":
                  this.protocolTypeList[index].push({
                    value:item['protocolTypeOptions'][i],
                    label:'部标平台'
                  })
                break;
                case "su":
                  this.protocolTypeList[index].push({
                    value:item['protocolTypeOptions'][i],
                    label:'苏标平台'
                  })
                break;
                case "zhe":
                  this.protocolTypeList[index].push({
                    value:item['protocolTypeOptions'][i],
                    label:'浙标平台'
                  })
                break;
                case "chong":
                  this.protocolTypeList[index].push({
                    value:item['protocolTypeOptions'][i],
                    label:'渝标平台'
                  })
                break;
                case "shan":
                  this.protocolTypeList[index].push({
                    value:item['protocolTypeOptions'][i],
                    label:'陕标平台'
                  })
                break;
                case "lu":
                  this.protocolTypeList[index].push({
                    value:item['protocolTypeOptions'][i],
                    label:'鲁标平台'
                  })
                break;               
                case "yue":
                  this.protocolTypeList[index].push({
                    value:item['protocolTypeOptions'][i],
                    label:'粤标平台'
                  })
                break;
                case "hei":
                  this.protocolTypeList[index].push({
                    value:item['protocolTypeOptions'][i],
                    label:'黑标平台'
                  })
                break;
                case "chuan":
                  this.protocolTypeList[index].push({
                    value:item['protocolTypeOptions'][i],
                    label:'川标平台'
                  })
                break;
                case "liao":
                  this.protocolTypeList[index].push({
                    value:item['protocolTypeOptions'][i],
                    label:'辽标平台'
                  })
                break;
                case "hat":
                  this.protocolTypeList[index].push({
                    value:item['protocolTypeOptions'][i],
                    label:'运维平台'
                  })
                break;
              }
            }
             if(this.protocolTypeList[index].length>item['protocolTypeOptions'].length){
              this.protocolTypeList[index].splice(0,item['protocolTypeOptions'].length)
            }
              console.log("🚀 ~ this.form['IsApiPlatformCapability']['platformCapabilityList'].forEach ~ this.protocolTypeList:", this.protocolTypeList)
          })
        return
      }
      let params = {
        deviceId: this.$route.query.deviceId || null,
        commandIds: ['IsApiPlatform']
      }
      this.$api.getDeviceConfigParamsByIsApi(params).then((res) => {
        if (res.success == true && !JSON.parse(res.data)['IsApiPlatform']['statusCode']) {
          let resData = JSON.parse(res.data);
          // console.log(resData);
          resData['IsApiPlatformCapability']['platformCapabilityList'].forEach((item,index) =>{
            for(let i = 0;i < item['protocolVersionOptions'].length;i++){
              switch(item['protocolVersionOptions'][i]){
                case "2011":
                  this.protocolVersionOptions[index].push({
                    value:item['protocolVersionOptions'][i],
                    label:'2011版本'
                  })
                break;
                case "2019":
                  this.protocolVersionOptions[index].push({
                    value:item['protocolVersionOptions'][i],
                    label:'2019版本'
                  })
                break;
              }
            }
            if(this.protocolVersionOptions[index].length>item['protocolVersionOptions'].length){
              this.protocolVersionOptions[index].splice(0,item['protocolVersionOptions'].length)
            }
          })
          this.protocolTypes = {};
          this.protocolTypeList = [[],[],[],[],[],[]]
          resData['IsApiPlatformCapability']['platformCapabilityList'][0]['protocolTypeOptions'].forEach(item =>{
            switch (item){
              case 'jing':
                this.protocolTypes[item] = '京标平台';
              break;
              case 'std':
                this.protocolTypes[item] = '部标平台';
              break;
              case 'su':
                this.protocolTypes[item] = '苏标平台';
              break;
              case 'zhe':
                this.protocolTypes[item] = '浙标平台';
              break;
              case 'chong':
                this.protocolTypes[item] = '渝标平台';
              break;
              case 'shan':
                this.protocolTypes[item] = '陕标平台';
              break;
              case 'lu':
                this.protocolTypes[item] = '鲁标平台';
              break;
              case 'yue':
                this.protocolTypes[item] = '粤标平台';
              break;
              case 'hei':
                this.protocolTypes[item] = '黑标平台';
              break;
              case 'chuan':
                this.protocolTypes[item] = '川标平台';
              break;
              case 'liao':
                this.protocolTypes[item] = '辽标平台';
              break;
              case 'hat':
                this.protocolTypes[item] = '运维平台';
              break;
            }
          })
          resData['IsApiPlatformCapability']['platformCapabilityList'].forEach((item,index) =>{
            for(let i = 0;i < item['protocolTypeOptions'].length;i++){
              switch(item['protocolTypeOptions'][i]){
                case "jing":
                  this.protocolTypeList[index].push({
                    value:item['protocolTypeOptions'][i],
                    label:'京标平台'
                  })
                break;
                case "std":
                  this.protocolTypeList[index].push({
                    value:item['protocolTypeOptions'][i],
                    label:'部标平台'
                  })
                break;
                case "su":
                  this.protocolTypeList[index].push({
                    value:item['protocolTypeOptions'][i],
                    label:'苏标平台'
                  })
                break;
                case "zhe":
                  this.protocolTypeList[index].push({
                    value:item['protocolTypeOptions'][i],
                    label:'浙标平台'
                  })
                break;
                case "chong":
                  this.protocolTypeList[index].push({
                    value:item['protocolTypeOptions'][i],
                    label:'渝标平台'
                  })
                break;
                case "shan":
                  this.protocolTypeList[index].push({
                    value:item['protocolTypeOptions'][i],
                    label:'陕标平台'
                  })
                break;
                case "lu":
                  this.protocolTypeList[index].push({
                    value:item['protocolTypeOptions'][i],
                    label:'鲁标平台'
                  })
                break;               
                case "yue":
                  this.protocolTypeList[index].push({
                    value:item['protocolTypeOptions'][i],
                    label:'粤标平台'
                  })
                break;
                case "hei":
                  this.protocolTypeList[index].push({
                    value:item['protocolTypeOptions'][i],
                    label:'黑标平台'
                  })
                break;
                case "chuan":
                  this.protocolTypeList[index].push({
                    value:item['protocolTypeOptions'][i],
                    label:'川标平台'
                  })
                break;
                case "liao":
                  this.protocolTypeList[index].push({
                    value:item['protocolTypeOptions'][i],
                    label:'辽标平台'
                  })
                break;
                case "hat":
                  this.protocolTypeList[index].push({
                    value:item['protocolTypeOptions'][i],
                    label:'运维平台'
                  })
                break;
              }
            }
            console.log(this.protocolTypeList)
             if(this.protocolTypeList[0].length>item['protocolTypeOptions'].length){
              this.protocolTypeList[0].splice(0,item['protocolTypeOptions'].length)
            }
          })
          console.log(this.protocolTypeList);
          //   console.log(this.protocolVersionOptions)
          if(!(this.form['IsApiPlatform'] && this.form['IsApiPlatform'].platformInfoList.length>0)){
            this.form = Object.assign({}, this.form, JSON.parse(res.data));
            this.copyForm = Object.assign({}, this.copyForm, JSON.parse(res.data));
          }
          if(!this.form['IsApiPlatform']['platformInfoList'][0]['IsApiLocationReportOthers0']){
            this.getOther(0,this.form,this.copyForm)
          }
        } else {
          this.$message.error('获取设备配置参数失败:' + res.msg)
        }
      });
    },
    // initButton() {
    //   Object.keys(this.form['IsApiPlatform'].platformInfoList).forEach((item, i) => {
    //     // 如果已经两个 就禁止继续添加
    //     if(this.form['IsApiPlatform'].platformInfoList[i].serverInfoList.length >= 2) {
    //       this.isDisabledAdd[i] = true
    //     } else if (this.form['IsApiPlatform'].platformInfoList[i].serverInfoList.length < 2) {
    //       this.isDisabledAdd[i] = false
    //     }
    //     if (this.form['IsApiPlatform'].platformInfoList[i].serverInfoList.length < 2) {
    //       this.isDisabledDel[i] = true
    //     } else if (this.form['IsApiPlatform'].platformInfoList[i].serverInfoList.length >= 2) {
    //       this.isDisabledDel[i] = false
    //     }
    //   })
    // },
    getOther(index,data,copyData) {
      this.currentCenter = index
      let params = {
        deviceId: this.$route.query.deviceId || null,
        commandIds: ['IsApiLocationReportOthers0'],
        // commandIds: ['IsApiPlatformOthers0','IsApiLocationReportOthers0']
      }
    //   this.$emit('adasCommandId','IsApiPlatformOthers0');
      this.$emit('currentCenter',0)
      this.$api.getDeviceConfigParamsByIsApi(params).then((res) => {
        if (res.success == true && !JSON.parse(res.data)['IsApiLocationReportOthers0']['statusCode']) {
          console.log(res.data);
          // const temp = Object.assign(
          //   this.form['IsApiPlatform'].platformInfoList[index],
          //   JSON.parse(res.data)['IsApiPlatformOthers' + index]
          // )
          // this.$set(this.form['IsApiPlatform'].platformInfoList, index, temp)
          // console.log(this.form['IsApiPlatform'],JSON.parse(res.data));

          // 因为下发时要把IsApiPlatformOthers单独下发 所以保存一个数组发给父组件下发使用
          console.log(data['IsApiPlatform']);
          // this.$set(data.IsApiPlatform.platformInfoList[0], 'IsApiPlatformOthers0', JSON.parse(res.data)['IsApiPlatformOthers0'])
          this.$set(data.IsApiPlatform.platformInfoList[0], 'IsApiLocationReportOthers0', JSON.parse(res.data)['IsApiLocationReportOthers0']);
          this.$set(copyData.IsApiPlatform.platformInfoList[0], 'IsApiLocationReportOthers0', JSON.parse(res.data)['IsApiLocationReportOthers0'])
          // this.$emit('getOthers', this.form.Others)

        } else {
          this.$message.error('获取设备配置参数失败:' + res.msg)
        }
      });
    }
  },
  created() {
    // this.getDeviceConfigParamsByIsApi()
  }
}
</script>

<style scoped>

</style>