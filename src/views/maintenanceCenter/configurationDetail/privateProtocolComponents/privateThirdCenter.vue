<template>
  <div class="p-a-md">
    <el-form ref="PrivateThirdCenterForm" label-position="top" :model="form" label-width="120px" style="margin-top: 10px">
      <template v-if="form['param705_2']">
        <el-tabs v-model="activeName" :before-leave="beforeLeave">
          <el-tab-pane label="基本设置" name="basicSettings">
            <div class="configurations">
              <div v-if="deviceCapability['network']['platformInfo'] && deviceCapability['network']['platformInfo'].length && deviceCapability['network']['platformInfo'][2]['enable'] && deviceCapability['network']['platformInfo'][2]['enable'].length" class="configuration-item">
                <el-form-item label="启用服务器" prop="param705_2.enable">
                  <el-switch v-model="form['param705_2']['enable']" :active-value="Number(1)" :inactive-value="Number(0)"></el-switch>
                </el-form-item>
              </div>
              <div v-if="deviceCapability['network']['platformInfo'] && deviceCapability['network']['platformInfo'].length && deviceCapability['network']['platformInfo'][2]['type']" class="configuration-item">
                <el-form-item label="扩充协议类型" prop="param705_2.type">
                  <el-select v-model="form['param705_2']['type']">
                    <el-option 
                      v-for="item in dictionaryData['extensionProtocolList2'][form['param705_2']['protocol']]"
                      :value="item.id"
                      :key="item.id"
                      :label="item.label">
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div v-if="deviceCapability['network']['platformInfo'] && deviceCapability['network']['platformInfo'].length && deviceCapability['network']['platformInfo'][2]['protocol']" class="configuration-item">
                <el-form-item label="接入协议类型" prop="param705_2.protocol">
                  <el-select v-model="form['param705_2']['protocol']">
                    <el-option 
                      v-for="item in dictionaryData['accessProtocolList2']"
                      :value="item.id"
                      :key="item.id"
                      :label="item.label">
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div v-if="deviceCapability['network']['platformInfo'] && deviceCapability['network']['platformInfo'].length && deviceCapability['network']['platformInfo'][2]['ip']" class="configuration-item">
                <el-form-item description="平台地址，支持IP和域名" label="平台地址" prop="param705_2.ip">
                  <el-input :disabled="form['param705_2']['ip'] === 'iot81.hikvisionauto.com'" v-model="form['param705_2']['ip']"></el-input>
                </el-form-item>
              </div>
              <div v-if="deviceCapability['network']['platformInfo'] && deviceCapability['network']['platformInfo'].length && deviceCapability['network']['platformInfo'][2]['serial']" class="configuration-item">
                <el-form-item label="手机号" prop="param705_2.serial">
                  <el-input v-model="form['param705_2']['serial']"></el-input>
                </el-form-item>
              </div>
              <div v-if="deviceCapability['network']['platformInfo'] && deviceCapability['network']['platformInfo'].length && deviceCapability['network']['platformInfo'][2]['port']" class="configuration-item">
                <el-form-item label="端口号" prop="param705_2.port">
                  <el-input v-model="form['param705_2']['port']"></el-input>
                </el-form-item>
              </div>
              <div v-if="deviceCapability['network']['platformInfo'] && deviceCapability['network']['platformInfo'].length && deviceCapability['network']['platformInfo'][2]['id']" class="configuration-item">
                <el-form-item label="终端ID" prop="param705_2.id">
                  <el-input v-model="form['param705_2']['id']"></el-input>
                </el-form-item>
              </div>
              <div v-if="deviceCapability['network']['platformInfo'] && deviceCapability['network']['platformInfo'].length && deviceCapability['network']['platformInfo'][0]['uploadEnable'] && deviceCapability['network']['platformInfo'][0]['uploadEnable'].length" class="configuration-item">
                <el-form-item label="报警事件上传使能" prop="param705_2.uploadEnable">
                  <el-switch v-model="form['param705_2']['uploadEnable']" :active-value="Number(1)" :inactive-value="Number(0)"></el-switch>
                </el-form-item>
              </div>
              <!-- <div v-if="deviceCapability['network']['platformInfo'] && deviceCapability['network']['platformInfo'].length && deviceCapability['network']['platformInfo'][0]['preview'] && deviceCapability['network']['platformInfo'][0]['preview'].length" class="configuration-item">
                <el-form-item label="平台预览" prop="param705_2.preview">
                  <el-switch v-model="form['param705_2']['preview']" :active-value="Number(1)" :inactive-value="Number(0)"></el-switch>
                </el-form-item>
              </div>
              <div v-if="deviceCapability['network']['platformInfo'] && deviceCapability['network']['platformInfo'].length && deviceCapability['network']['platformInfo'][0]['playback'] && deviceCapability['network']['platformInfo'][0]['playback'].length" class="configuration-item">
                <el-form-item label="平台回放" prop="param705_2.playback">
                  <el-switch v-model="form['param705_2']['playback']" :active-value="Number(1)" :inactive-value="Number(0)"></el-switch>
                </el-form-item>
              </div> -->
            </div>
          </el-tab-pane>
          <el-tab-pane v-if="deviceCapability['network']['platformInfo'] && deviceCapability['network']['platformInfo'].length && deviceCapability['network']['platformInfo'][2]['locationReport']" label="定位上传设置" name="locationUpload">
            <h2 v-if="deviceCapability['network']['platformInfo'] && deviceCapability['network']['platformInfo'].length && deviceCapability['network']['platformInfo'][2]['locationReport'] && (deviceCapability['network']['platformInfo'][2]['locationReport']['reportStrategy'] && deviceCapability['network']['platformInfo'][2]['locationReport']['reportStrategy'].length) || (deviceCapability['network']['platformInfo'][2]['locationReport']['reportPlan'] && deviceCapability['network']['platformInfo'][2]['locationReport']['reportPlan'].length)">位置汇报设置</h2>
            <div class="configurations" v-if="deviceCapability['network']['platformInfo'] && deviceCapability['network']['platformInfo'].length && deviceCapability['network']['platformInfo'][2]['locationReport'] && (deviceCapability['network']['platformInfo'][2]['locationReport']['reportStrategy'] && deviceCapability['network']['platformInfo'][2]['locationReport']['reportStrategy'].length) || (deviceCapability['network']['platformInfo'][2]['locationReport']['reportPlan'] && deviceCapability['network']['platformInfo'][2]['locationReport']['reportPlan'].length)">
              <div v-if="deviceCapability['network']['platformInfo'] && deviceCapability['network']['platformInfo'].length && deviceCapability['network']['platformInfo'][2]['locationReport'] && deviceCapability['network']['platformInfo'][2]['locationReport']['reportStrategy'] && deviceCapability['network']['platformInfo'][2]['locationReport']['reportStrategy'].length" class="configuration-item">
                <el-form-item label="位置汇报策略" prop="param705_2.locationReport.reportStrategy">
                  <el-select v-model="form['param705_2']['locationReport']['reportStrategy']">
                    <el-option 
                      v-for="item in dictionaryData['reportStrategyList0']"
                      :value="item.id"
                      :key="item.id"
                      :label="item.label">
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div v-if="deviceCapability['network']['platformInfo'] && deviceCapability['network']['platformInfo'].length && deviceCapability['network']['platformInfo'][2]['locationReport'] && deviceCapability['network']['platformInfo'][2]['locationReport']['reportPlan'] && deviceCapability['network']['platformInfo'][2]['locationReport']['reportPlan'].length" class="configuration-item">
                <el-form-item label="位置汇报方案" prop="param705_2.locationReport.reportPlan">
                  <el-select v-model="form['param705_2']['locationReport']['reportPlan']">
                    <el-option :value="1" label='根据ACC状态'></el-option>
                    <el-option :value="2" label='根据登陆状态和ACC状态'></el-option>
                  </el-select>
                </el-form-item>
              </div>
            </div>
            <h2 v-if="deviceCapability['network']['platformInfo'] && deviceCapability['network']['platformInfo'].length && deviceCapability['network']['platformInfo'][2]['locationReport'] && deviceCapability['network']['platformInfo'][2]['locationReport']['inflectionAngle']">拐点补传角度设置</h2>
            <div class="configurations" v-if="deviceCapability['network']['platformInfo'] && deviceCapability['network']['platformInfo'].length && deviceCapability['network']['platformInfo'][2]['locationReport'] && deviceCapability['network']['platformInfo'][2]['locationReport']['inflectionAngle']">
              <div class="configuration-item">
                <el-form-item label="拐点补传角度（<=180度）" prop="param705_2.locationReport.inflectionAngle" :rules="{ validator: checkNumber.bind({type:'int',min:deviceCapability['network']['platformInfo'][2]['locationReport']['inflectionAngle']['min'],max:deviceCapability['network']['platformInfo'][2]['locationReport']['inflectionAngle']['max']}), trigger: 'blur' }">
                  <el-input tips-placement="top-end" :tips="`键入值范围为${deviceCapability['network']['platformInfo'][2]['locationReport']['inflectionAngle']['min']}~${deviceCapability['network']['platformInfo'][2]['locationReport']['inflectionAngle']['max']}`" v-model="form['param705_2']['locationReport']['inflectionAngle']"><span slot="suffix">度</span></el-input>
                </el-form-item>
              </div>
            </div>
            <h2 v-if="deviceCapability['network']['platformInfo'] && deviceCapability['network']['platformInfo'].length && deviceCapability['network']['platformInfo'][2]['locationReport'] && (deviceCapability['network']['platformInfo'][2]['locationReport']['sleepReportTimeInterval'] || deviceCapability['network']['platformInfo'][2]['locationReport']['emergencyReportTimeInterval'] || deviceCapability['network']['platformInfo'][2]['locationReport']['defaultReportTimeInterval'] || deviceCapability['network']['platformInfo'][2]['locationReport']['driverNotLoginReportTimeInterval'])">上报时间间隔设置</h2>
            <div class="configurations" v-if="deviceCapability['network']['platformInfo'] && deviceCapability['network']['platformInfo'].length && deviceCapability['network']['platformInfo'][2]['locationReport'] && (deviceCapability['network']['platformInfo'][2]['locationReport']['sleepReportTimeInterval'] || deviceCapability['network']['platformInfo'][2]['locationReport']['emergencyReportTimeInterval'] || deviceCapability['network']['platformInfo'][2]['locationReport']['defaultReportTimeInterval'] || deviceCapability['network']['platformInfo'][2]['locationReport']['driverNotLoginReportTimeInterval'])">
              <div class="configuration-item" v-if="deviceCapability['network']['platformInfo'] && deviceCapability['network']['platformInfo'].length && deviceCapability['network']['platformInfo'][2]['locationReport'] && deviceCapability['network']['platformInfo'][2]['locationReport']['sleepReportTimeInterval']">
                <el-form-item label="休眠汇报时间间隔" prop="param705_2.locationReport.sleepReportTimeInterval" :rules="{ validator: checkNumber.bind({type:'int',min:deviceCapability['network']['platformInfo'][2]['locationReport']['sleepReportTimeInterval']['min'],max:deviceCapability['network']['platformInfo'][2]['locationReport']['sleepReportTimeInterval']['max']}), trigger: 'blur' }">
                  <el-input tips-placement="top-end" :tips="`键入值范围为${deviceCapability['network']['platformInfo'][2]['locationReport']['sleepReportTimeInterval']['min']}~${deviceCapability['network']['platformInfo'][2]['locationReport']['sleepReportTimeInterval']['max']}`" v-model="form['param705_2']['locationReport']['sleepReportTimeInterval']"><span slot="suffix">s</span></el-input>
                </el-form-item>
              </div>
              <div class="configuration-item" v-if="deviceCapability['network']['platformInfo'] && deviceCapability['network']['platformInfo'].length && deviceCapability['network']['platformInfo'][2]['locationReport'] && deviceCapability['network']['platformInfo'][2]['locationReport']['emergencyReportTimeInterval']">
                <el-form-item label="紧急报警汇报时间间隔" prop="param705_2.locationReport.emergencyReportTimeInterval" :rules="{ validator: checkNumber.bind({type:'int',min:deviceCapability['network']['platformInfo'][2]['locationReport']['emergencyReportTimeInterval']['min'],max:deviceCapability['network']['platformInfo'][2]['locationReport']['emergencyReportTimeInterval']['max']}), trigger: 'blur' }">
                  <el-input tips-placement="top-end" :tips="`键入值范围为${deviceCapability['network']['platformInfo'][2]['locationReport']['emergencyReportTimeInterval']['min']}~${deviceCapability['network']['platformInfo'][2]['locationReport']['emergencyReportTimeInterval']['max']}`" v-model="form['param705_2']['locationReport']['emergencyReportTimeInterval']"><span slot="suffix">s</span></el-input>
                </el-form-item>
              </div>
              <div class="configuration-item" v-if="deviceCapability['network']['platformInfo'] && deviceCapability['network']['platformInfo'].length && deviceCapability['network']['platformInfo'][2]['locationReport'] && deviceCapability['network']['platformInfo'][2]['locationReport']['defaultReportTimeInterval']">
                <el-form-item label="缺省时间汇报时间间隔" prop="param705_2.locationReport.defaultReportTimeInterval" :rules="{ validator: checkNumber.bind({type:'int',min:deviceCapability['network']['platformInfo'][2]['locationReport']['defaultReportTimeInterval']['min'],max:deviceCapability['network']['platformInfo'][2]['locationReport']['defaultReportTimeInterval']['max']}), trigger: 'blur' }">
                  <el-input tips-placement="top-end" :tips="`键入值范围为${deviceCapability['network']['platformInfo'][2]['locationReport']['defaultReportTimeInterval']['min']}~${deviceCapability['network']['platformInfo'][2]['locationReport']['defaultReportTimeInterval']['max']}`" v-model="form['param705_2']['locationReport']['defaultReportTimeInterval']"><span slot="suffix">s</span></el-input>
                </el-form-item>
              </div>
              <div class="configuration-item" v-if="deviceCapability['network']['platformInfo'] && deviceCapability['network']['platformInfo'].length && deviceCapability['network']['platformInfo'][2]['locationReport'] && deviceCapability['network']['platformInfo'][2]['locationReport']['driverNotLoginReportTimeInterval']">
                <el-form-item label="驾驶员未登录汇报时间间隔" prop="param705_2.locationReport.driverNotLoginReportTimeInterval" :rules="{ validator: checkNumber.bind({type:'int',min:deviceCapability['network']['platformInfo'][2]['locationReport']['driverNotLoginReportTimeInterval']['min'],max:deviceCapability['network']['platformInfo'][2]['locationReport']['driverNotLoginReportTimeInterval']['max']}), trigger: 'blur' }">
                  <el-input tips-placement="top-end" :tips="`键入值范围为${deviceCapability['network']['platformInfo'][2]['locationReport']['driverNotLoginReportTimeInterval']['min']}~${deviceCapability['network']['platformInfo'][2]['locationReport']['driverNotLoginReportTimeInterval']['max']}`" v-model="form['param705_2']['locationReport']['driverNotLoginReportTimeInterval']"><span slot="suffix">s</span></el-input>
                </el-form-item>
              </div>
            </div>
            <h2 v-if="deviceCapability['network']['platformInfo'] && deviceCapability['network']['platformInfo'].length && deviceCapability['network']['platformInfo'][2]['locationReport'] && (deviceCapability['network']['platformInfo'][2]['locationReport']['defaultReportDistanceInterval'] || deviceCapability['network']['platformInfo'][2]['locationReport']['driverNotLoginReportDistanceInterval'] || deviceCapability['network']['platformInfo'][2]['locationReport']['sleepReportDistanceInterval'] || deviceCapability['network']['platformInfo'][2]['locationReport']['emerReportDistanceInterval'])">上报距离间隔设置</h2>
            <div class="configurations" v-if="deviceCapability['network']['platformInfo'] && deviceCapability['network']['platformInfo'].length && deviceCapability['network']['platformInfo'][2]['locationReport'] && (deviceCapability['network']['platformInfo'][2]['locationReport']['defaultReportDistanceInterval'] || deviceCapability['network']['platformInfo'][2]['locationReport']['driverNotLoginReportDistanceInterval'] || deviceCapability['network']['platformInfo'][2]['locationReport']['sleepReportDistanceInterval'] || deviceCapability['network']['platformInfo'][2]['locationReport']['emerReportDistanceInterval'])">
              <div class="configuration-item" v-if="deviceCapability['network']['platformInfo'] && deviceCapability['network']['platformInfo'].length && deviceCapability['network']['platformInfo'][2]['locationReport'] && deviceCapability['network']['platformInfo'][2]['locationReport']['defaultReportDistanceInterval']">
                <el-form-item label="缺省距离汇报间隔" prop="param705_2.locationReport.defaultReportDistanceInterval" :rules="{ validator: checkNumber.bind({type:'int',min:deviceCapability['network']['platformInfo'][2]['locationReport']['defaultReportDistanceInterval']['min'],max:deviceCapability['network']['platformInfo'][2]['locationReport']['defaultReportDistanceInterval']['max']}), trigger: 'blur' }">
                  <el-input tips-placement="top-end" :tips="`键入值范围为${deviceCapability['network']['platformInfo'][2]['locationReport']['defaultReportDistanceInterval']['min']}~${deviceCapability['network']['platformInfo'][2]['locationReport']['defaultReportDistanceInterval']['max']}`" v-model="form['param705_2']['locationReport']['defaultReportDistanceInterval']"><span slot="suffix">m</span></el-input>
                </el-form-item>
              </div>
              <div class="configuration-item" v-if="deviceCapability['network']['platformInfo'] && deviceCapability['network']['platformInfo'].length && deviceCapability['network']['platformInfo'][2]['locationReport'] && deviceCapability['network']['platformInfo'][2]['locationReport']['driverNotLoginReportDistanceInterval']">
                <el-form-item label="驾驶员未登录汇报距离间隔" prop="param705_2.locationReport.driverNotLoginReportDistanceInterval" :rules="{ validator: checkNumber.bind({type:'int',min:deviceCapability['network']['platformInfo'][2]['locationReport']['driverNotLoginReportDistanceInterval']['min'],max:deviceCapability['network']['platformInfo'][2]['locationReport']['driverNotLoginReportDistanceInterval']['max']}), trigger: 'blur' }">
                  <el-input tips-placement="top-end" :tips="`键入值范围为${deviceCapability['network']['platformInfo'][2]['locationReport']['driverNotLoginReportDistanceInterval']['min']}~${deviceCapability['network']['platformInfo'][2]['locationReport']['driverNotLoginReportDistanceInterval']['max']}`" v-model="form['param705_2']['locationReport']['driverNotLoginReportDistanceInterval']"><span slot="suffix">m</span></el-input>
                </el-form-item>
              </div>
              <div class="configuration-item" v-if="deviceCapability['network']['platformInfo'] && deviceCapability['network']['platformInfo'].length && deviceCapability['network']['platformInfo'][2]['locationReport'] && deviceCapability['network']['platformInfo'][2]['locationReport']['sleepReportDistanceInterval']">
                <el-form-item label="休眠时汇报距离间隔" prop="param705_2.locationReport.sleepReportDistanceInterval" :rules="{ validator: checkNumber.bind({type:'int',min:deviceCapability['network']['platformInfo'][2]['locationReport']['sleepReportDistanceInterval']['min'],max:deviceCapability['network']['platformInfo'][2]['locationReport']['sleepReportDistanceInterval']['max']}), trigger: 'blur' }">
                  <el-input tips-placement="top-end" :tips="`键入值范围为${deviceCapability['network']['platformInfo'][2]['locationReport']['sleepReportDistanceInterval']['min']}~${deviceCapability['network']['platformInfo'][2]['locationReport']['sleepReportDistanceInterval']['max']}`" v-model="form['param705_2']['locationReport']['sleepReportDistanceInterval']"><span slot="suffix">m</span></el-input>
                </el-form-item>
              </div>
              <div class="configuration-item" v-if="deviceCapability['network']['platformInfo'] && deviceCapability['network']['platformInfo'].length && deviceCapability['network']['platformInfo'][2]['locationReport'] && deviceCapability['network']['platformInfo'][2]['locationReport']['emerReportDistanceInterval']">
                <el-form-item label="紧急报警时汇报距离间隔" prop="param705_2.locationReport.emerReportDistanceInterval" :rules="{ validator: checkNumber.bind({type:'int',min:deviceCapability['network']['platformInfo'][2]['locationReport']['emerReportDistanceInterval']['min'],max:deviceCapability['network']['platformInfo'][2]['locationReport']['emerReportDistanceInterval']['max']}), trigger: 'blur' }">
                  <el-input tips-placement="top-end" :tips="`键入值范围为${deviceCapability['network']['platformInfo'][2]['locationReport']['emerReportDistanceInterval']['min']}~${deviceCapability['network']['platformInfo'][2]['locationReport']['emerReportDistanceInterval']['max']}`" v-model="form['param705_2']['locationReport']['emerReportDistanceInterval']"><span slot="suffix">m</span></el-input>
                </el-form-item>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </template>
    </el-form>
  </div>
</template>

<script>
import {validateNum} from '@/utils/validate';
export default {
  props:{
    allCapability:{
      type: Object,
      default:()=>{
        return {}
      }
    },
    formDetail:{
      type:Object,
      default:() =>{
        return {}
      }
    },
    originalForm:{
      type:Object,
      default:() =>{
        return {}
      }
    },
    setStatisticsData:{
      type:Object,
      default:() =>{
        return {}
      }
    },
    allEnumerationData:{
      type:Object,
      default:() =>{
        return {}
      }
    },
    setConfigParams:{
      type:Boolean,
      default:false
    },
    isTemplate:{
      type:String
    }
  },
  watch:{
    allCapability:{
     handler(val){
        if(val){
          console.log(val)
          this.deviceCapability = val
        }
      },
      deep: true,
      immediate: true
    },
    formDetail:{
     handler(val){
       if(val){
         this.form = val
        }
      },
      deep: true,
      immediate: true
    },
    originalForm:{
        handler(val){
        if(val){
          this.copyForm = val
        }
      },
      deep: true,
      immediate: true
    },
    form:{
      handler (val) {
        if (val){
          this.$emit('change',val)
        }
      },
      deep: true,
      immediate:true,
    },
    copyForm:{
      handler(val) {
        if (val){
          this.$emit('changeCopy',val)
        }
      },
      deep: true,
      immediate:false,
    },
    setStatisticsData:{
      handler(val){
        if(val){
          this.formData = val
        }
      },
      deep: true,
      immediate: true
    },
    allEnumerationData:{
      handler(val){
        if(val){
          this.dictionaryData = val
        }
      },
      deep: true,
      immediate: true
    },
    setConfigParams:{
      handler(val){
        if(val){
          this.childConfigParams = val;
          this.getPrivateProcotol()
        }
      },
      deep: true,
      immediate: true
    },
    childConfigParams:{
      handler(val){
        this.$emit('changeConfigParams',val)
      },
      deep: true,
      immediate: true
    },
    'form.param705_2':{
      handler(val){
        if(val && !Boolean(this.isTemplate)){
          this.formData['param705_2.enable'] = val['enable'] !== this.copyForm['param705_2']['enable'] ? `param705_2.enable&多中心设置/第3中心/基本设置/启用服务器&${val['enable'] ? '开启' : '关闭'}&${this.copyForm['param705_2']['enable'] ? '开启' : '关闭'}` : '';
          this.formData['param705_2.type'] = val['type'] !== this.copyForm['param705_2']['type'] ? `param705_2.type&多中心设置/第3中心/基本设置/扩充协议类型&${this.dictionaryData['extensionProtocolJson2'][val['protocol']][val['type']]}&${this.dictionaryData['extensionProtocolJson2'][val['protocol']][this.copyForm['param705_2']['type']]}` : '';
          this.formData['param705_2.protocol'] = val['protocol'] !== this.copyForm['param705_2']['protocol'] ? `param705_2.protocol&多中心设置/第3中心/基本设置/接入协议类型&${this.dictionaryData['accessProtocolJson2'][val['protocol']]}&${this.dictionaryData['accessProtocolJson2'][this.copyForm['param705_2']['protocol']]}` : '';
          this.formData['param705_2.ip'] = val['ip'] !== this.copyForm['param705_2']['ip'] ? `param705_2.ip&多中心设置/第3中心/基本设置/平台地址&${val['ip']}&${this.copyForm['param705_2']['ip']}` : '';
          this.formData['param705_2.serial'] = val['serial'] !== this.copyForm['param705_2']['serial'] ? `param705_2.serial&多中心设置/第3中心/基本设置/手机号&${val['serial']}&${this.copyForm['param705_2']['serial']}` : '';
          this.formData['param705_2.port'] = val['port'] !== this.copyForm['param705_2']['port'] ? `param705_2.port&多中心设置/第3中心/基本设置/端口号&${val['port']}&${this.copyForm['param705_2']['port']}` : '';
          this.formData['param705_2.id'] = val['id'] !== this.copyForm['param705_2']['id'] ? `param705_2.id&多中心设置/第3中心/基本设置/终端ID&${val['id']}&${this.copyForm['param705_2']['id']}` : '';
          this.formData['param705_2.uploadEnable'] = val['uploadEnable'] !== this.copyForm['param705_2']['uploadEnable'] ? `param705_2.uploadEnable&多中心设置/第3中心/基本设置/报警事件上传使能&${val['uploadEnable'] ? '开启' : '关闭'}&${this.copyForm['param705_2']['uploadEnable'] ? '开启' : '关闭'}` : '';
          this.formData['param705_2.preview'] = val['preview'] !== this.copyForm['param705_2']['preview'] ? `param705_2.preview&多中心设置/第3中心/基本设置/平台预览&${val['preview'] ? '开启' : '关闭'}&${this.copyForm['param705_2']['preview'] ? '开启' : '关闭'}` : '';
          this.formData['param705_2.playback'] = val['playback'] !== this.copyForm['param705_2']['playback'] ? `param705_2.playback&多中心设置/第3中心/基本设置/平台回放&${val['playback'] ? '开启' : '关闭'}&${this.copyForm['param705_2']['playback'] ? '开启' : '关闭'}` : '';
          this.formData['param705_2.locationReport.reportStrategy'] = val['locationReport']['reportStrategy'] !== this.copyForm['param705_2']['locationReport']['reportStrategy'] ? `param705_2.locationReport.reportStrategy&多中心设置/第3中心/定位上传设置/位置汇报设置/位置汇报策略&${this.dictionaryData['reportStrategyJson2'][val['locationReport']['reportStrategy']]}&${this.dictionaryData['reportStrategyJson2'][this.copyForm['param705_2']['locationReport']['reportStrategy']]}` : '';
          this.formData['param705_2.locationReport.reportPlan'] = val['locationReport']['reportPlan'] !== this.copyForm['param705_2']['locationReport']['reportPlan'] ? `param705_2.locationReport.reportPlan&多中心设置/第3中心/定位上传设置/位置汇报设置/位置汇报方案&${val['locationReport']['reportPlan'] === 1 ? '根据ACC状态' : '根据登陆状态和ACC状态'}&${this.copyForm['param705_2']['locationReport']['reportPlan'] === 1 ? '根据ACC状态' : '根据登陆状态和ACC状态'}` : '';
          this.formData['param705_2.locationReport.inflectionAngle'] = val['locationReport']['inflectionAngle'] !== this.copyForm['param705_2']['locationReport']['inflectionAngle'] ? `param705_2.locationReport.inflectionAngle&多中心设置/第3中心/定位上传设置/拐点补传角度设置/拐点补传角度（<=180度）&${val['locationReport']['inflectionAngle']}&${this.copyForm['param705_2']['locationReport']['inflectionAngle']}` : '';
          this.formData['param705_2.locationReport.sleepReportTimeInterval'] = val['locationReport']['sleepReportTimeInterval'] !== this.copyForm['param705_2']['locationReport']['sleepReportTimeInterval'] ? `param705_2.locationReport.sleepReportTimeInterval&多中心设置/第3中心/定位上传设置/上报时间间隔设置/休眠汇报时间间隔&${val['locationReport']['sleepReportTimeInterval']}&${this.copyForm['param705_2']['locationReport']['sleepReportTimeInterval']}` : '';
          this.formData['param705_2.locationReport.emergencyReportTimeInterval'] = val['locationReport']['emergencyReportTimeInterval'] !== this.copyForm['param705_2']['locationReport']['emergencyReportTimeInterval'] ? `param705_2.locationReport.emergencyReportTimeInterval&多中心设置/第3中心/定位上传设置/上报时间间隔设置/紧急报警汇报时间间隔&${val['locationReport']['emergencyReportTimeInterval']}&${this.copyForm['param705_2']['locationReport']['emergencyReportTimeInterval']}` : '';
          this.formData['param705_2.locationReport.defaultReportTimeInterval'] = val['locationReport']['defaultReportTimeInterval'] !== this.copyForm['param705_2']['locationReport']['defaultReportTimeInterval'] ? `param705_2.locationReport.defaultReportTimeInterval&多中心设置/第3中心/定位上传设置/上报时间间隔设置/缺省时间汇报时间间隔&${val['locationReport']['defaultReportTimeInterval']}&${this.copyForm['param705_2']['locationReport']['defaultReportTimeInterval']}` : '';
          this.formData['param705_2.locationReport.driverNotLoginReportTimeInterval'] = val['locationReport']['driverNotLoginReportTimeInterval'] !== this.copyForm['param705_2']['locationReport']['driverNotLoginReportTimeInterval'] ? `param705_2.locationReport.driverNotLoginReportTimeInterval&多中心设置/第3中心/定位上传设置/上报时间间隔设置/驾驶员未登录汇报时间间隔&${val['locationReport']['driverNotLoginReportTimeInterval']}&${this.copyForm['param705_2']['locationReport']['driverNotLoginReportTimeInterval']}` : '';
          this.formData['param705_2.locationReport.defaultReportDistanceInterval'] = val['locationReport']['defaultReportDistanceInterval'] !== this.copyForm['param705_2']['locationReport']['defaultReportDistanceInterval'] ? `param705_2.locationReport.defaultReportDistanceInterval&多中心设置/第3中心/定位上传设置/上报距离间隔设置/缺省距离汇报间隔&${val['locationReport']['defaultReportDistanceInterval']}&${this.copyForm['param705_2']['locationReport']['defaultReportDistanceInterval']}` : '';
          this.formData['param705_2.locationReport.driverNotLoginReportDistanceInterval'] = val['locationReport']['driverNotLoginReportDistanceInterval'] !== this.copyForm['param705_2']['locationReport']['driverNotLoginReportDistanceInterval'] ? `param705_2.locationReport.driverNotLoginReportDistanceInterval&多中心设置/第3中心/定位上传设置/上报距离间隔设置/驾驶员未登录汇报距离间隔&${val['locationReport']['driverNotLoginReportDistanceInterval']}&${this.copyForm['param705_2']['locationReport']['driverNotLoginReportDistanceInterval']}` : '';
          this.formData['param705_2.locationReport.sleepReportDistanceInterval'] = val['locationReport']['sleepReportDistanceInterval'] !== this.copyForm['param705_2']['locationReport']['sleepReportDistanceInterval'] ? `param705_2.locationReport.sleepReportDistanceInterval&多中心设置/第3中心/定位上传设置/上报距离间隔设置/休眠时汇报距离间隔&${val['locationReport']['sleepReportDistanceInterval']}&${this.copyForm['param705_2']['locationReport']['sleepReportDistanceInterval']}` : '';
          this.formData['param705_2.locationReport.emerReportDistanceInterval'] = val['locationReport']['emerReportDistanceInterval'] !== this.copyForm['param705_2']['locationReport']['emerReportDistanceInterval'] ? `param705_2.locationReport.emerReportDistanceInterval&多中心设置/第3中心/定位上传设置/上报距离间隔设置/紧急报警时汇报距离间隔&${val['locationReport']['emerReportDistanceInterval']}&${this.copyForm['param705_2']['locationReport']['emerReportDistanceInterval']}` : '';
          this.$emit('formDataChange',this.formData)
        }
      },
      deep:true,
      immediate:true
    }
  },
  data() {
    return {
      deviceId:this.$route.query.deviceId || '',
      deviceCapability:{},
      form:{},
      copyForm:{},
      formData:{},      
      dictionaryData:{},
      tabAndConfiguration:[],
      childConfigParams:false,
      activeName:'basicSettings',
      checkNumber: function (rule, value, callback) {
        if (value !== '' && value !== null && value !== undefined) {
          if (!validateNum(value)) {
            callback(new Error("请输入正确的整数"));
          } else if (value < this.min) {
            callback(new Error(`最小值为${this.min}`));
          } else if (value > this.max) {
            callback(new Error(`最大值为${this.max}`));
          }else {
            callback();
          }
        } else {
          // callback(new Error("请输入"));
          callback();
        }
      },
    }
  },
  created(){
    // this.getByIsApi(1)
    //console.log(this.isTemplate)
    this.$emit('setMenuActiveRefFormName','PrivateThirdCenterForm')
  },
  methods:{
    beforeLeave(activeName,oldActiveName){
      this.$refs.PrivateThirdCenterForm.validate((valid) =>{
        if(!valid){
          this.$message.warning('当前表单验证不通过，请先完善！')
          return new Promise((resolve,reject) =>{
            valid == true;
          }).then(() =>{
            resolve()
          }).catch(reject(err))
        }
      })
    },
    getPrivateProcotol(){
      let params = {
        deviceId: this.deviceId,
        param:{
          platformOrder:2
        },
        msgId:705
      }
      if(!this.form['param705_2']){
        if(Boolean(this.isTemplate)) return;
        this.$api.getEHomeConfig(params).then(res =>{
          if(res.success && res.data.param){
            this.$set(this.form,'param705_2',JSON.parse(res.data.param));
            this.$set(this.copyForm,'param705_2',JSON.parse(JSON.stringify(JSON.parse(res.data.param))));
            this.childConfigParams = false;
          }else{
            this.$message.error('协议获取失败');
            this.childConfigParams = false;
          }
        })
      }else{
        this.childConfigParams = false;
      }
    }
  }
 
}
</script>

<style lang="less" scoped>
  .configuration-detail-submit{
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
  .maginBottom{
    margin-bottom: 10px;
  }
</style>