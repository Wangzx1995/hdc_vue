<template>
   <div class="p-a-md">
    <h2 id="title" v-if="form['IsApiZtInvalidAlarm']">违规报警模型列表</h2>
    <el-form
      ref="PublicInvalidAlarm"
      label-position="top"
      :model="form"
      label-width="120px"
      v-if="form['IsApiZtInvalidAlarm'] && form['IsApiZtInvalidAlarm']['modelList'].length>0"
    >
      <el-tabs v-model="activeName" :before-leave="beforeLeave" @tab-click="getByIsApi(activeName)">
        <el-tab-pane v-for="(item,index) in form['IsApiZtInvalidAlarm']['modelList']" :key="index" :label="modeTypes[item.modeType]" :name="item.modeType+'tab'">
          <template v-if="activeName == item.modeType+'tab'">
            <el-row type="flex" justify="space-between">
              <el-col :span="7">
                <el-form-item label="限制模型使能">
                  <el-select v-model="item.enabled" transfer multiple clearable collapse-tags>
                    <el-option
                      v-for="item in enabledList"
                      :key="item.id"
                      :label="item.label"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label="限制优先级" class="m-r-md p-r" :rules="{validator: checkNumber.bind({type:'int',min:form['IsApiZtInvalidAlarmCapability'].priorityMin,max:form['IsApiZtInvalidAlarmCapability'].priorityMax}), trigger: 'blur'}" :prop="'IsApiZtInvalidAlarm.modelList['+index+'].priority'">
                  <el-input tips-placement="top-end" :tips="`键入值范围为${form['IsApiZtInvalidAlarmCapability'].priorityMin}~${form['IsApiZtInvalidAlarmCapability'].priorityMax}`" v-model.number="item.priority"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label="限制速度" class="m-r-md p-r" :rules="{validator: checkNumber.bind({type:'int',min:form['IsApiZtInvalidAlarmCapability'].limitSpeedMin,max:form['IsApiZtInvalidAlarmCapability'].limitSpeedMax}), trigger: 'blur'}" :prop="'IsApiZtInvalidAlarm.modelList['+index+'].limitSpeed'">
                  <el-input tips-placement="top-end" :tips="`键入值范围为${form['IsApiZtInvalidAlarmCapability'].limitSpeedMin}~${form['IsApiZtInvalidAlarmCapability'].limitSpeedMax}`" v-model.number="item.limitSpeed"><span slot="suffix">km/h</span></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row type="flex" justify="space-between">
              <el-col :span="7">
                <el-form-item label="触发速度" class="m-r-md p-r" :rules="{validator: checkNumber.bind({type:'int',min:form['IsApiZtInvalidAlarmCapability'].triggerSpeedMin,max:form['IsApiZtInvalidAlarmCapability'].triggerSpeedMax}), trigger: 'blur'}" :prop="'IsApiZtInvalidAlarm.modelList['+index+'].triggerSpeed'">
                  <el-input tips-placement="top-end" :tips="`键入值范围为${form['IsApiZtInvalidAlarmCapability'].triggerSpeedMin}~${form['IsApiZtInvalidAlarmCapability'].triggerSpeedMax}`" v-model.number="item.triggerSpeed"><span slot="suffix">km/h</span></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label="持续时间" class="m-r-md p-r" :rules="{validator: checkNumber.bind({type:'int',min:form['IsApiZtInvalidAlarmCapability'].continueTimeMin,max:form['IsApiZtInvalidAlarmCapability'].continueTimeMax}), trigger: 'blur'}" :prop="'IsApiZtInvalidAlarm.modelList['+index+'].continueTime'">
                  <el-input tips-placement="top-end" :tips="`键入值范围为${form['IsApiZtInvalidAlarmCapability'].continueTimeMin}~${form['IsApiZtInvalidAlarmCapability'].continueTimeMax}`" v-model.number="item.continueTime"><span slot="suffix">s</span></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label="限制掩码" class="m-r-md p-r" :rules="{validator: checkNumber.bind({type:'int',min:form['IsApiZtInvalidAlarmCapability'].maskMin,max:form['IsApiZtInvalidAlarmCapability'].maskMax}), trigger: 'blur'}" :prop="'IsApiZtInvalidAlarm.modelList['+index+'].mask'">
                  <el-input tips-placement="top-end" :tips="`键入值范围为${form['IsApiZtInvalidAlarmCapability'].maskMin}~${form['IsApiZtInvalidAlarmCapability'].maskMax}`" v-model.number="item.mask"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </template> 
        </el-tab-pane>
      </el-tabs>
    </el-form>
  </div>
</template>
<script>
import { validateNum } from '@/utils/validate'

export default {
  name:'invalidAlarm',
  props: {
    isTemplate:{
      type:String
    },
    detail: {
      type: Object,
      default: () => ({}) 
    },
    configParams: {
      type: Boolean,
      default: false
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
   watch: {
    detail: {
      handler(newVal, oldVal) {
        this.form = newVal
      },
      deep: true,
      immediate: true
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
    configParams: {
      handler(val) {
        if (!val) {
          this.getByIsApi();
        }else{
          
        }
      },
      deep: true,
      immediate: true
    },
    form: {
      handler(val) {
        if (JSON.stringify(val) !== '{}') {
          this.$emit('change', val)
        }
      },
      deep: true,
      immediate: true
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
    'form.IsApiZtInvalidAlarm.modelList.0':{
      handler(val){
        if(val != undefined){
          let enabledList = [];
          if(this.form['IsApiZtInvalidAlarm']['modelList'][0].enabled){
            this.form['IsApiZtInvalidAlarm']['modelList'][0].enabled.forEach(item =>{
              enabledList.push(this.enabledJson[item])
            })
          }
          this.$nextTick(() =>{
            this.$refs['PublicInvalidAlarm'].validate((valid) => {
              if(valid){
                this.formData['IsApiZtInvalidAlarm.modelList.0.enabled'] = val['enabled'].toString() != this.copyForm['IsApiZtInvalidAlarm']['modelList'][0]['enabled'].toString() ? `IsApiZtInvalidAlarm.modelList.0.enabled&渣土车配置/业务报警/平台下发控制指令/限制模型使能&${enabledList.splice(',').join('、')}` : '';
                this.formData['IsApiZtInvalidAlarm.modelList.0.priority'] = val['priority'] != this.copyForm['IsApiZtInvalidAlarm']['modelList'][0]['priority'] ? `IsApiZtInvalidAlarm.modelList.0.priority&渣土车配置/业务报警/平台下发控制指令/限制优先级&${val['priority']}` : '';
                this.formData['IsApiZtInvalidAlarm.modelList.0.limitSpeed'] = val['limitSpeed'] != this.copyForm['IsApiZtInvalidAlarm']['modelList'][0]['limitSpeed'] ? `IsApiZtInvalidAlarm.modelList.0.limitSpeed&渣土车配置/业务报警/平台下发控制指令/限制速度&${val['limitSpeed']}` : '';
                this.formData['IsApiZtInvalidAlarm.modelList.0.triggerSpeed'] = val['triggerSpeed'] != this.copyForm['IsApiZtInvalidAlarm']['modelList'][0]['triggerSpeed'] ? `IsApiZtInvalidAlarm.modelList.0.triggerSpeed&渣土车配置/业务报警/平台下发控制指令/触发速度&${val['triggerSpeed']}` : '';
                this.formData['IsApiZtInvalidAlarm.modelList.0.continueTime'] = val['continueTime'] != this.copyForm['IsApiZtInvalidAlarm']['modelList'][0]['continueTime'] ? `IsApiZtInvalidAlarm.modelList.0.continueTime&渣土车配置/业务报警/平台下发控制指令/持续时间&${val['continueTime']}` : '';
                this.formData['IsApiZtInvalidAlarm.modelList.0.mask'] = val['mask'] != this.copyForm['IsApiZtInvalidAlarm']['modelList'][0]['mask'] ? `IsApiZtInvalidAlarm.modelList.0.mask&渣土车配置/业务报警/平台下发控制指令/限制掩码&${val['mask']}` : '';
              }else{
                this.formData['IsApiZtInvalidAlarm.modelList.0.enabled'] = '';
                this.formData['IsApiZtInvalidAlarm.modelList.0.priority'] = '';
                this.formData['IsApiZtInvalidAlarm.modelList.0.limitSpeed'] = '';
                this.formData['IsApiZtInvalidAlarm.modelList.0.triggerSpeed'] = '';
                this.formData['IsApiZtInvalidAlarm.modelList.0.continueTime'] = '';
                this.formData['IsApiZtInvalidAlarm.modelList.0.mask'] = '';
              }
              this.$emit('changeData',this.formData)
            })
          })
        }
      },
      deep: true,
      immediate:false,
    },
    'form.IsApiZtInvalidAlarm.modelList.1':{
      handler(val){
        if(val != undefined){
          let enabledList = [];
          if(this.form['IsApiZtInvalidAlarm']['modelList'][1].enabled){
            this.form['IsApiZtInvalidAlarm']['modelList'][1].enabled.forEach(item =>{
              enabledList.push(this.enabledJson[item])
            })
          }
          this.$nextTick(() =>{
            this.$refs['PublicInvalidAlarm'].validate((valid) => {
              if(valid){
                this.formData['IsApiZtInvalidAlarm.modelList.1.enabled'] = val['enabled'].toString() != this.copyForm['IsApiZtInvalidAlarm']['modelList'][1]['enabled'].toString() ? `IsApiZtInvalidAlarm.modelList.1.enabled&渣土车配置/业务报警/区域控制/限制模型使能&${enabledList.splice(',').join('、')}` : '';
                this.formData['IsApiZtInvalidAlarm.modelList.1.priority'] = val['priority'] != this.copyForm['IsApiZtInvalidAlarm']['modelList'][1]['priority'] ? `IsApiZtInvalidAlarm.modelList.1.priority&渣土车配置/业务报警/区域控制/限制优先级&${val['priority']}` : '';
                this.formData['IsApiZtInvalidAlarm.modelList.1.limitSpeed'] = val['limitSpeed'] != this.copyForm['IsApiZtInvalidAlarm']['modelList'][1]['limitSpeed'] ? `IsApiZtInvalidAlarm.modelList.1.limitSpeed&渣土车配置/业务报警/区域控制/限制速度&${val['limitSpeed']}` : '';
                this.formData['IsApiZtInvalidAlarm.modelList.1.triggerSpeed'] = val['triggerSpeed'] != this.copyForm['IsApiZtInvalidAlarm']['modelList'][1]['triggerSpeed'] ? `IsApiZtInvalidAlarm.modelList.1.triggerSpeed&渣土车配置/业务报警/区域控制/触发速度&${val['triggerSpeed']}` : '';
                this.formData['IsApiZtInvalidAlarm.modelList.1.continueTime'] = val['continueTime'] != this.copyForm['IsApiZtInvalidAlarm']['modelList'][1]['continueTime'] ? `IsApiZtInvalidAlarm.modelList.1.continueTime&渣土车配置/业务报警/区域控制/持续时间&${val['continueTime']}` : '';
                this.formData['IsApiZtInvalidAlarm.modelList.1.mask'] = val['mask'] != this.copyForm['IsApiZtInvalidAlarm']['modelList'][1]['mask'] ? `IsApiZtInvalidAlarm.modelList.1.mask&渣土车配置/业务报警/区域控制/限制掩码&${val['mask']}` : '';
              }else{
                this.formData['IsApiZtInvalidAlarm.modelList.1.enabled'] = '';
                this.formData['IsApiZtInvalidAlarm.modelList.1.priority'] = '';
                this.formData['IsApiZtInvalidAlarm.modelList.1.limitSpeed'] = '';
                this.formData['IsApiZtInvalidAlarm.modelList.1.triggerSpeed'] = '';
                this.formData['IsApiZtInvalidAlarm.modelList.1.continueTime'] = '';
                this.formData['IsApiZtInvalidAlarm.modelList.1.mask'] = '';
              }
              this.$emit('changeData',this.formData)
            })
          })
        }
      },
      deep: true,
      immediate:false,
    },
    'form.IsApiZtInvalidAlarm.modelList.2':{
      handler(val){
        if(val != undefined){
          let enabledList = [];
          if(this.form['IsApiZtInvalidAlarm']['modelList'][2].enabled){
            this.form['IsApiZtInvalidAlarm']['modelList'][2].enabled.forEach(item =>{
              enabledList.push(this.enabledJson[item])
            })
          }
          this.$nextTick(() =>{
            this.$refs['PublicInvalidAlarm'].validate((valid) => {
              if(valid){
                this.formData['IsApiZtInvalidAlarm.modelList.2.enabled'] = val['enabled'].toString() != this.copyForm['IsApiZtInvalidAlarm']['modelList'][2]['enabled'].toString() ? `IsApiZtInvalidAlarm.modelList.2.enabled&渣土车配置/业务报警/超速限速/限制模型使能&${enabledList.splice(',').join('、')}` : '';
                this.formData['IsApiZtInvalidAlarm.modelList.2.priority'] = val['priority'] != this.copyForm['IsApiZtInvalidAlarm']['modelList'][2]['priority'] ? `IsApiZtInvalidAlarm.modelList.2.priority&渣土车配置/业务报警/超速限速/限制优先级&${val['priority']}` : '';
                this.formData['IsApiZtInvalidAlarm.modelList.2.limitSpeed'] = val['limitSpeed'] != this.copyForm['IsApiZtInvalidAlarm']['modelList'][2]['limitSpeed'] ? `IsApiZtInvalidAlarm.modelList.2.limitSpeed&渣土车配置/业务报警/超速限速/限制速度&${val['limitSpeed']}` : '';
                this.formData['IsApiZtInvalidAlarm.modelList.2.triggerSpeed'] = val['triggerSpeed'] != this.copyForm['IsApiZtInvalidAlarm']['modelList'][2]['triggerSpeed'] ? `IsApiZtInvalidAlarm.modelList.2.triggerSpeed&渣土车配置/业务报警/超速限速/触发速度&${val['triggerSpeed']}` : '';
                this.formData['IsApiZtInvalidAlarm.modelList.2.continueTime'] = val['continueTime'] != this.copyForm['IsApiZtInvalidAlarm']['modelList'][2]['continueTime'] ? `IsApiZtInvalidAlarm.modelList.2.continueTime&渣土车配置/业务报警/超速限速/持续时间&${val['continueTime']}` : '';
                this.formData['IsApiZtInvalidAlarm.modelList.2.mask'] = val['mask'] != this.copyForm['IsApiZtInvalidAlarm']['modelList'][2]['mask'] ? `IsApiZtInvalidAlarm.modelList.2.mask&渣土车配置/业务报警/超速限速/限制掩码&${val['mask']}` : '';
              }else{
                this.formData['IsApiZtInvalidAlarm.modelList.2.enabled'] = '';
                this.formData['IsApiZtInvalidAlarm.modelList.2.priority'] = '';
                this.formData['IsApiZtInvalidAlarm.modelList.2.limitSpeed'] = '';
                this.formData['IsApiZtInvalidAlarm.modelList.2.triggerSpeed'] = '';
                this.formData['IsApiZtInvalidAlarm.modelList.2.continueTime'] = '';
                this.formData['IsApiZtInvalidAlarm.modelList.2.mask'] = '';
              }
              this.$emit('changeData',this.formData)
            })
          })
        }
      },
      deep: true,
      immediate:false,
    },
    'form.IsApiZtInvalidAlarm.modelList.3':{
      handler(val){
        if(val != undefined){
          let enabledList = [];
          if(this.form['IsApiZtInvalidAlarm']['modelList'][3].enabled){
            this.form['IsApiZtInvalidAlarm']['modelList'][3].enabled.forEach(item =>{
              enabledList.push(this.enabledJson[item])
            })
          }
          this.$nextTick(() =>{
            this.$refs['PublicInvalidAlarm'].validate((valid) => {
              if(valid){
                this.formData['IsApiZtInvalidAlarm.modelList.3.enabled'] = val['enabled'].toString() != this.copyForm['IsApiZtInvalidAlarm']['modelList'][3]['enabled'].toString() ? `IsApiZtInvalidAlarm.modelList.3.enabled&渣土车配置/业务报警/厢盖未密闭/限制模型使能&${enabledList.splice(',').join('、')}` : '';
                this.formData['IsApiZtInvalidAlarm.modelList.3.priority'] = val['priority'] != this.copyForm['IsApiZtInvalidAlarm']['modelList'][3]['priority'] ? `IsApiZtInvalidAlarm.modelList.3.priority&渣土车配置/业务报警/厢盖未密闭/限制优先级&${val['priority']}` : '';
                this.formData['IsApiZtInvalidAlarm.modelList.3.limitSpeed'] = val['limitSpeed'] != this.copyForm['IsApiZtInvalidAlarm']['modelList'][3]['limitSpeed'] ? `IsApiZtInvalidAlarm.modelList.3.limitSpeed&渣土车配置/业务报警/厢盖未密闭/限制速度&${val['limitSpeed']}` : '';
                this.formData['IsApiZtInvalidAlarm.modelList.3.triggerSpeed'] = val['triggerSpeed'] != this.copyForm['IsApiZtInvalidAlarm']['modelList'][3]['triggerSpeed'] ? `IsApiZtInvalidAlarm.modelList.3.triggerSpeed&渣土车配置/业务报警/厢盖未密闭/触发速度&${val['triggerSpeed']}` : '';
                this.formData['IsApiZtInvalidAlarm.modelList.3.continueTime'] = val['continueTime'] != this.copyForm['IsApiZtInvalidAlarm']['modelList'][3]['continueTime'] ? `IsApiZtInvalidAlarm.modelList.3.continueTime&渣土车配置/业务报警/厢盖未密闭/持续时间&${val['continueTime']}` : '';
                this.formData['IsApiZtInvalidAlarm.modelList.3.mask'] = val['mask'] != this.copyForm['IsApiZtInvalidAlarm']['modelList'][3]['mask'] ? `IsApiZtInvalidAlarm.modelList.3.mask&渣土车配置/业务报警/厢盖未密闭/限制掩码&${val['mask']}` : '';
              }else{
                this.formData['IsApiZtInvalidAlarm.modelList.3.enabled'] = '';
                this.formData['IsApiZtInvalidAlarm.modelList.3.priority'] = '';
                this.formData['IsApiZtInvalidAlarm.modelList.3.limitSpeed'] = '';
                this.formData['IsApiZtInvalidAlarm.modelList.3.triggerSpeed'] = '';
                this.formData['IsApiZtInvalidAlarm.modelList.3.continueTime'] = '';
                this.formData['IsApiZtInvalidAlarm.modelList.3.mask'] = '';
              }
              this.$emit('changeData',this.formData)
            })
          })
        }
      },
      deep: true,
      immediate:false,
    },
    'form.IsApiZtInvalidAlarm.modelList.4':{
      handler(val){
        if(val != undefined){
          let enabledList = [];
          if(this.form['IsApiZtInvalidAlarm']['modelList'][4].enabled){
            this.form['IsApiZtInvalidAlarm']['modelList'][4].enabled.forEach(item =>{
              enabledList.push(this.enabledJson[item])
            })
          }
          this.$nextTick(() =>{
            this.$refs['PublicInvalidAlarm'].validate((valid) => {
              if(valid){
                this.formData['IsApiZtInvalidAlarm.modelList.4.enabled'] = val['enabled'].toString() != this.copyForm['IsApiZtInvalidAlarm']['modelList'][4]['enabled'].toString() ? `IsApiZtInvalidAlarm.modelList.4.enabled&渣土车配置/业务报警/越界/限制模型使能&${enabledList.splice(',').join('、')}` : '';
                this.formData['IsApiZtInvalidAlarm.modelList.4.priority'] = val['priority'] != this.copyForm['IsApiZtInvalidAlarm']['modelList'][4]['priority'] ? `IsApiZtInvalidAlarm.modelList.4.priority&渣土车配置/业务报警/越界/限制优先级&${val['priority']}` : '';
                this.formData['IsApiZtInvalidAlarm.modelList.4.limitSpeed'] = val['limitSpeed'] != this.copyForm['IsApiZtInvalidAlarm']['modelList'][4]['limitSpeed'] ? `IsApiZtInvalidAlarm.modelList.4.limitSpeed&渣土车配置/业务报警/越界/限制速度&${val['limitSpeed']}` : '';
                this.formData['IsApiZtInvalidAlarm.modelList.4.triggerSpeed'] = val['triggerSpeed'] != this.copyForm['IsApiZtInvalidAlarm']['modelList'][4]['triggerSpeed'] ? `IsApiZtInvalidAlarm.modelList.4.triggerSpeed&渣土车配置/业务报警/越界/触发速度&${val['triggerSpeed']}` : '';
                this.formData['IsApiZtInvalidAlarm.modelList.4.continueTime'] = val['continueTime'] != this.copyForm['IsApiZtInvalidAlarm']['modelList'][4]['continueTime'] ? `IsApiZtInvalidAlarm.modelList.4.continueTime&渣土车配置/业务报警/越界/持续时间&${val['continueTime']}` : '';
                this.formData['IsApiZtInvalidAlarm.modelList.4.mask'] = val['mask'] != this.copyForm['IsApiZtInvalidAlarm']['modelList'][4]['mask'] ? `IsApiZtInvalidAlarm.modelList.4.mask&渣土车配置/业务报警/越界/限制掩码&${val['mask']}` : '';
              }else{
                this.formData['IsApiZtInvalidAlarm.modelList.4.enabled'] = '';
                this.formData['IsApiZtInvalidAlarm.modelList.4.priority'] = '';
                this.formData['IsApiZtInvalidAlarm.modelList.4.limitSpeed'] = '';
                this.formData['IsApiZtInvalidAlarm.modelList.4.triggerSpeed'] = '';
                this.formData['IsApiZtInvalidAlarm.modelList.4.continueTime'] = '';
                this.formData['IsApiZtInvalidAlarm.modelList.4.mask'] = '';
              }
              this.$emit('changeData',this.formData)
            })
          })
        }
      },
      deep: true,
      immediate:false,
    },
    'form.IsApiZtInvalidAlarm.modelList.5':{
      handler(val){
        if(val != undefined){
          let enabledList = [];
          if(this.form['IsApiZtInvalidAlarm']['modelList'][5].enabled){
            this.form['IsApiZtInvalidAlarm']['modelList'][5].enabled.forEach(item =>{
              enabledList.push(this.enabledJson[item])
            })
          }
          this.$nextTick(() =>{
            this.$refs['PublicInvalidAlarm'].validate((valid) => {
              if(valid){
                this.formData['IsApiZtInvalidAlarm.modelList.5.enabled'] = val['enabled'].toString() != this.copyForm['IsApiZtInvalidAlarm']['modelList'][5]['enabled'].toString() ? `IsApiZtInvalidAlarm.modelList.5.enabled&渣土车配置/业务报警/非指定区域/限制模型使能&${enabledList.splice(',').join('、')}` : '';
                this.formData['IsApiZtInvalidAlarm.modelList.5.priority'] = val['priority'] != this.copyForm['IsApiZtInvalidAlarm']['modelList'][5]['priority'] ? `IsApiZtInvalidAlarm.modelList.5.priority&渣土车配置/业务报警/非指定区域/限制优先级&${val['priority']}` : '';
                this.formData['IsApiZtInvalidAlarm.modelList.5.limitSpeed'] = val['limitSpeed'] != this.copyForm['IsApiZtInvalidAlarm']['modelList'][5]['limitSpeed'] ? `IsApiZtInvalidAlarm.modelList.5.limitSpeed&渣土车配置/业务报警/非指定区域/限制速度&${val['limitSpeed']}` : '';
                this.formData['IsApiZtInvalidAlarm.modelList.5.triggerSpeed'] = val['triggerSpeed'] != this.copyForm['IsApiZtInvalidAlarm']['modelList'][5]['triggerSpeed'] ? `IsApiZtInvalidAlarm.modelList.5.triggerSpeed&渣土车配置/业务报警/非指定区域/触发速度&${val['triggerSpeed']}` : '';
                this.formData['IsApiZtInvalidAlarm.modelList.5.continueTime'] = val['continueTime'] != this.copyForm['IsApiZtInvalidAlarm']['modelList'][5]['continueTime'] ? `IsApiZtInvalidAlarm.modelList.5.continueTime&渣土车配置/业务报警/非指定区域/持续时间&${val['continueTime']}` : '';
                this.formData['IsApiZtInvalidAlarm.modelList.5.mask'] = val['mask'] != this.copyForm['IsApiZtInvalidAlarm']['modelList'][5]['mask'] ? `IsApiZtInvalidAlarm.modelList.5.mask&渣土车配置/业务报警/非指定区域/限制掩码&${val['mask']}` : '';
              }else{
                this.formData['IsApiZtInvalidAlarm.modelList.5.enabled'] = '';
                this.formData['IsApiZtInvalidAlarm.modelList.5.priority'] = '';
                this.formData['IsApiZtInvalidAlarm.modelList.5.limitSpeed'] = '';
                this.formData['IsApiZtInvalidAlarm.modelList.5.triggerSpeed'] = '';
                this.formData['IsApiZtInvalidAlarm.modelList.5.continueTime'] = '';
                this.formData['IsApiZtInvalidAlarm.modelList.5.mask'] = '';
              }
              this.$emit('changeData',this.formData)
            })
          })
        }
      },
      deep: true,
      immediate:false,
    },
    'form.IsApiZtInvalidAlarm.modelList.6':{
      handler(val){
        if(val != undefined){
          let enabledList = [];
          if(this.form['IsApiZtInvalidAlarm']['modelList'][6].enabled){
            this.form['IsApiZtInvalidAlarm']['modelList'][6].enabled.forEach(item =>{
              enabledList.push(this.enabledJson[item])
            })
          }
          this.$nextTick(() =>{
            this.$refs['PublicInvalidAlarm'].validate((valid) => {
              if(valid){
                this.formData['IsApiZtInvalidAlarm.modelList.6.enabled'] = val['enabled'].toString() != this.copyForm['IsApiZtInvalidAlarm']['modelList'][6]['enabled'].toString() ? `IsApiZtInvalidAlarm.modelList.6.enabled&渣土车配置/业务报警/外设故障/限制模型使能&${enabledList.splice(',').join('、')}` : '';
                this.formData['IsApiZtInvalidAlarm.modelList.6.priority'] = val['priority'] != this.copyForm['IsApiZtInvalidAlarm']['modelList'][6]['priority'] ? `IsApiZtInvalidAlarm.modelList.6.priority&渣土车配置/业务报警/外设故障/限制优先级&${val['priority']}` : '';
                this.formData['IsApiZtInvalidAlarm.modelList.6.limitSpeed'] = val['limitSpeed'] != this.copyForm['IsApiZtInvalidAlarm']['modelList'][6]['limitSpeed'] ? `IsApiZtInvalidAlarm.modelList.6.limitSpeed&渣土车配置/业务报警/外设故障/限制速度&${val['limitSpeed']}` : '';
                this.formData['IsApiZtInvalidAlarm.modelList.6.triggerSpeed'] = val['triggerSpeed'] != this.copyForm['IsApiZtInvalidAlarm']['modelList'][6]['triggerSpeed'] ? `IsApiZtInvalidAlarm.modelList.6.triggerSpeed&渣土车配置/业务报警/外设故障/触发速度&${val['triggerSpeed']}` : '';
                this.formData['IsApiZtInvalidAlarm.modelList.6.continueTime'] = val['continueTime'] != this.copyForm['IsApiZtInvalidAlarm']['modelList'][6]['continueTime'] ? `IsApiZtInvalidAlarm.modelList.6.continueTime&渣土车配置/业务报警/外设故障/持续时间&${val['continueTime']}` : '';
                this.formData['IsApiZtInvalidAlarm.modelList.6.mask'] = val['mask'] != this.copyForm['IsApiZtInvalidAlarm']['modelList'][6]['mask'] ? `IsApiZtInvalidAlarm.modelList.6.mask&渣土车配置/业务报警/外设故障/限制掩码&${val['mask']}` : '';
              }else{
                this.formData['IsApiZtInvalidAlarm.modelList.6.enabled'] = '';
                this.formData['IsApiZtInvalidAlarm.modelList.6.priority'] = '';
                this.formData['IsApiZtInvalidAlarm.modelList.6.limitSpeed'] = '';
                this.formData['IsApiZtInvalidAlarm.modelList.6.triggerSpeed'] = '';
                this.formData['IsApiZtInvalidAlarm.modelList.6.continueTime'] = '';
                this.formData['IsApiZtInvalidAlarm.modelList.6.mask'] = '';
              }
              this.$emit('changeData',this.formData)
            })
          })
        }
      },
      deep: true,
      immediate:false,
    },
    'form.IsApiZtInvalidAlarm.modelList.7':{
      handler(val){
        if(val != undefined){
          let enabledList = [];
          if(this.form['IsApiZtInvalidAlarm']['modelList'][7].enabled){
            this.form['IsApiZtInvalidAlarm']['modelList'][7].enabled.forEach(item =>{
              enabledList.push(this.enabledJson[item])
            })
          }
          this.$nextTick(() =>{
            this.$refs['PublicInvalidAlarm'].validate((valid) => {
              if(valid){
                this.formData['IsApiZtInvalidAlarm.modelList.7.enabled'] = val['enabled'].toString() != this.copyForm['IsApiZtInvalidAlarm']['modelList'][7]['enabled'].toString() ? `IsApiZtInvalidAlarm.modelList.7.enabled&渣土车配置/业务报警/gps信号故障/限制模型使能&${enabledList.splice(',').join('、')}` : '';
                this.formData['IsApiZtInvalidAlarm.modelList.7.priority'] = val['priority'] != this.copyForm['IsApiZtInvalidAlarm']['modelList'][7]['priority'] ? `IsApiZtInvalidAlarm.modelList.7.priority&渣土车配置/业务报警/gps信号故障/限制优先级&${val['priority']}` : '';
                this.formData['IsApiZtInvalidAlarm.modelList.7.limitSpeed'] = val['limitSpeed'] != this.copyForm['IsApiZtInvalidAlarm']['modelList'][7]['limitSpeed'] ? `IsApiZtInvalidAlarm.modelList.7.limitSpeed&渣土车配置/业务报警/gps信号故障/限制速度&${val['limitSpeed']}` : '';
                this.formData['IsApiZtInvalidAlarm.modelList.7.triggerSpeed'] = val['triggerSpeed'] != this.copyForm['IsApiZtInvalidAlarm']['modelList'][7]['triggerSpeed'] ? `IsApiZtInvalidAlarm.modelList.7.triggerSpeed&渣土车配置/业务报警/gps信号故障/触发速度&${val['triggerSpeed']}` : '';
                this.formData['IsApiZtInvalidAlarm.modelList.7.continueTime'] = val['continueTime'] != this.copyForm['IsApiZtInvalidAlarm']['modelList'][7]['continueTime'] ? `IsApiZtInvalidAlarm.modelList.7.continueTime&渣土车配置/业务报警/gps信号故障/持续时间&${val['continueTime']}` : '';
                this.formData['IsApiZtInvalidAlarm.modelList.7.mask'] = val['mask'] != this.copyForm['IsApiZtInvalidAlarm']['modelList'][7]['mask'] ? `IsApiZtInvalidAlarm.modelList.7.mask&渣土车配置/业务报警/gps信号故障/限制掩码&${val['mask']}` : '';
              }else{
                this.formData['IsApiZtInvalidAlarm.modelList.7.enabled'] = '';
                this.formData['IsApiZtInvalidAlarm.modelList.7.priority'] = '';
                this.formData['IsApiZtInvalidAlarm.modelList.7.limitSpeed'] = '';
                this.formData['IsApiZtInvalidAlarm.modelList.7.triggerSpeed'] = '';
                this.formData['IsApiZtInvalidAlarm.modelList.7.continueTime'] = '';
                this.formData['IsApiZtInvalidAlarm.modelList.7.mask'] = '';
              }
              this.$emit('changeData',this.formData)
            })
          })
        }
      },
      deep: true,
      immediate:false,
    },
    'form.IsApiZtInvalidAlarm.modelList.8':{
      handler(val){
        if(val != undefined){
          let enabledList = [];
          if(this.form['IsApiZtInvalidAlarm']['modelList'][8].enabled){
            this.form['IsApiZtInvalidAlarm']['modelList'][8].enabled.forEach(item =>{
              enabledList.push(this.enabledJson[item])
            })
          }
          this.$nextTick(() =>{
            this.$refs['PublicInvalidAlarm'].validate((valid) => {
              if(valid){
                this.formData['IsApiZtInvalidAlarm.modelList.8.enabled'] = val['enabled'].toString() != this.copyForm['IsApiZtInvalidAlarm']['modelList'][8]['enabled'].toString() ? `IsApiZtInvalidAlarm.modelList.8.enabled&渣土车配置/业务报警/证件无效/限制模型使能&${enabledList.splice(',').join('、')}` : '';
                this.formData['IsApiZtInvalidAlarm.modelList.8.priority'] = val['priority'] != this.copyForm['IsApiZtInvalidAlarm']['modelList'][8]['priority'] ? `IsApiZtInvalidAlarm.modelList.8.priority&渣土车配置/业务报警/证件无效/限制优先级&${val['priority']}` : '';
                this.formData['IsApiZtInvalidAlarm.modelList.8.limitSpeed'] = val['limitSpeed'] != this.copyForm['IsApiZtInvalidAlarm']['modelList'][8]['limitSpeed'] ? `IsApiZtInvalidAlarm.modelList.8.limitSpeed&渣土车配置/业务报警/证件无效/限制速度&${val['limitSpeed']}` : '';
                this.formData['IsApiZtInvalidAlarm.modelList.8.triggerSpeed'] = val['triggerSpeed'] != this.copyForm['IsApiZtInvalidAlarm']['modelList'][8]['triggerSpeed'] ? `IsApiZtInvalidAlarm.modelList.8.triggerSpeed&渣土车配置/业务报警/证件无效/触发速度&${val['triggerSpeed']}` : '';
                this.formData['IsApiZtInvalidAlarm.modelList.8.continueTime'] = val['continueTime'] != this.copyForm['IsApiZtInvalidAlarm']['modelList'][8]['continueTime'] ? `IsApiZtInvalidAlarm.modelList.8.continueTime&渣土车配置/业务报警/证件无效/持续时间&${val['continueTime']}` : '';
                this.formData['IsApiZtInvalidAlarm.modelList.8.mask'] = val['mask'] != this.copyForm['IsApiZtInvalidAlarm']['modelList'][8]['mask'] ? `IsApiZtInvalidAlarm.modelList.8.mask&渣土车配置/业务报警/证件无效/限制掩码&${val['mask']}` : '';
              }else{
                this.formData['IsApiZtInvalidAlarm.modelList.8.enabled'] = '';
                this.formData['IsApiZtInvalidAlarm.modelList.8.priority'] = '';
                this.formData['IsApiZtInvalidAlarm.modelList.8.limitSpeed'] = '';
                this.formData['IsApiZtInvalidAlarm.modelList.8.triggerSpeed'] = '';
                this.formData['IsApiZtInvalidAlarm.modelList.8.continueTime'] = '';
                this.formData['IsApiZtInvalidAlarm.modelList.8.mask'] = '';
              }
              this.$emit('changeData',this.formData)
            })
          })
        }
      },
      deep: true,
      immediate:false,
    },
    'form.IsApiZtInvalidAlarm.modelList.9':{
      handler(val){
        if(val != undefined){
          let enabledList = [];
          if(this.form['IsApiZtInvalidAlarm']['modelList'][9].enabled){
            this.form['IsApiZtInvalidAlarm']['modelList'][9].enabled.forEach(item =>{
              enabledList.push(this.enabledJson[item])
            })
          }
          this.$nextTick(() =>{
            this.$refs['PublicInvalidAlarm'].validate((valid) => {
              if(valid){
                this.formData['IsApiZtInvalidAlarm.modelList.9.enabled'] = val['enabled'].toString() != this.copyForm['IsApiZtInvalidAlarm']['modelList'][9]['enabled'].toString() ? `IsApiZtInvalidAlarm.modelList.9.enabled&渣土车配置/业务报警/未联网/限制模型使能&${enabledList.splice(',').join('、')}` : '';
                this.formData['IsApiZtInvalidAlarm.modelList.9.priority'] = val['priority'] != this.copyForm['IsApiZtInvalidAlarm']['modelList'][9]['priority'] ? `IsApiZtInvalidAlarm.modelList.9.priority&渣土车配置/业务报警/未联网/限制优先级&${val['priority']}` : '';
                this.formData['IsApiZtInvalidAlarm.modelList.9.limitSpeed'] = val['limitSpeed'] != this.copyForm['IsApiZtInvalidAlarm']['modelList'][9]['limitSpeed'] ? `IsApiZtInvalidAlarm.modelList.9.limitSpeed&渣土车配置/业务报警/未联网/限制速度&${val['limitSpeed']}` : '';
                this.formData['IsApiZtInvalidAlarm.modelList.9.triggerSpeed'] = val['triggerSpeed'] != this.copyForm['IsApiZtInvalidAlarm']['modelList'][9]['triggerSpeed'] ? `IsApiZtInvalidAlarm.modelList.9.triggerSpeed&渣土车配置/业务报警/未联网/触发速度&${val['triggerSpeed']}` : '';
                this.formData['IsApiZtInvalidAlarm.modelList.9.continueTime'] = val['continueTime'] != this.copyForm['IsApiZtInvalidAlarm']['modelList'][9]['continueTime'] ? `IsApiZtInvalidAlarm.modelList.9.continueTime&渣土车配置/业务报警/未联网/持续时间&${val['continueTime']}` : '';
                this.formData['IsApiZtInvalidAlarm.modelList.9.mask'] = val['mask'] != this.copyForm['IsApiZtInvalidAlarm']['modelList'][9]['mask'] ? `IsApiZtInvalidAlarm.modelList.9.mask&渣土车配置/业务报警/未联网/限制掩码&${val['mask']}` : '';
              }else{
                this.formData['IsApiZtInvalidAlarm.modelList.9.enabled'] = '';
                this.formData['IsApiZtInvalidAlarm.modelList.9.priority'] = '';
                this.formData['IsApiZtInvalidAlarm.modelList.9.limitSpeed'] = '';
                this.formData['IsApiZtInvalidAlarm.modelList.9.triggerSpeed'] = '';
                this.formData['IsApiZtInvalidAlarm.modelList.9.continueTime'] = '';
                this.formData['IsApiZtInvalidAlarm.modelList.9.mask'] = '';
              }
              this.$emit('changeData',this.formData)
            })
          })
        }
      },
      deep: true,
      immediate:false,
    },
    'form.IsApiZtInvalidAlarm.modelList.10':{
      handler(val){
        if(val != undefined){
          let enabledList = [];
          if(this.form['IsApiZtInvalidAlarm']['modelList'][10].enabled){
            this.form['IsApiZtInvalidAlarm']['modelList'][10].enabled.forEach(item =>{
              enabledList.push(this.enabledJson[item])
            })
          }
          this.$nextTick(() =>{
            this.$refs['PublicInvalidAlarm'].validate((valid) => {
              if(valid){
                this.formData['IsApiZtInvalidAlarm.modelList.10.enabled'] = val['enabled'].toString() != this.copyForm['IsApiZtInvalidAlarm']['modelList'][10]['enabled'].toString() ? `IsApiZtInvalidAlarm.modelList.10.enabled&渣土车配置/业务报警/人脸识别/限制模型使能&${enabledList.splice(',').join('、')}` : '';
                this.formData['IsApiZtInvalidAlarm.modelList.10.priority'] = val['priority'] != this.copyForm['IsApiZtInvalidAlarm']['modelList'][10]['priority'] ? `IsApiZtInvalidAlarm.modelList.10.priority&渣土车配置/业务报警/人脸识别/限制优先级&${val['priority']}` : '';
                this.formData['IsApiZtInvalidAlarm.modelList.10.limitSpeed'] = val['limitSpeed'] != this.copyForm['IsApiZtInvalidAlarm']['modelList'][10]['limitSpeed'] ? `IsApiZtInvalidAlarm.modelList.10.limitSpeed&渣土车配置/业务报警/人脸识别/限制速度&${val['limitSpeed']}` : '';
                this.formData['IsApiZtInvalidAlarm.modelList.10.triggerSpeed'] = val['triggerSpeed'] != this.copyForm['IsApiZtInvalidAlarm']['modelList'][10]['triggerSpeed'] ? `IsApiZtInvalidAlarm.modelList.10.triggerSpeed&渣土车配置/业务报警/人脸识别/触发速度&${val['triggerSpeed']}` : '';
                this.formData['IsApiZtInvalidAlarm.modelList.10.continueTime'] = val['continueTime'] != this.copyForm['IsApiZtInvalidAlarm']['modelList'][10]['continueTime'] ? `IsApiZtInvalidAlarm.modelList.10.continueTime&渣土车配置/业务报警/人脸识别/持续时间&${val['continueTime']}` : '';
                this.formData['IsApiZtInvalidAlarm.modelList.10.mask'] = val['mask'] != this.copyForm['IsApiZtInvalidAlarm']['modelList'][10]['mask'] ? `IsApiZtInvalidAlarm.modelList.10.mask&渣土车配置/业务报警/人脸识别/限制掩码&${val['mask']}` : '';
              }else{
                this.formData['IsApiZtInvalidAlarm.modelList.10.enabled'] = '';
                this.formData['IsApiZtInvalidAlarm.modelList.10.priority'] = '';
                this.formData['IsApiZtInvalidAlarm.modelList.10.limitSpeed'] = '';
                this.formData['IsApiZtInvalidAlarm.modelList.10.triggerSpeed'] = '';
                this.formData['IsApiZtInvalidAlarm.modelList.10.continueTime'] = '';
                this.formData['IsApiZtInvalidAlarm.modelList.10.mask'] = '';
              }
              this.$emit('changeData',this.formData)
            })
          })
        }
      },
      deep: true,
      immediate:false,
    },
    'form.IsApiZtInvalidAlarm.modelList.11':{
      handler(val){
        if(val != undefined){
          let enabledList = [];
          if(this.form['IsApiZtInvalidAlarm']['modelList'][1].enabled){
            this.form['IsApiZtInvalidAlarm']['modelList'][1].enabled.forEach(item =>{
              enabledList.push(this.enabledJson[item])
            })
          }
          this.$nextTick(() =>{
            this.$refs['PublicInvalidAlarm'].validate((valid) => {
              if(valid){
                this.formData['IsApiZtInvalidAlarm.modelList.11.enabled'] = val['enabled'].toString() != this.copyForm['IsApiZtInvalidAlarm']['modelList'][11]['enabled'].toString() ? `IsApiZtInvalidAlarm.modelList.11.enabled&渣土车配置/业务报警/违规区域卸载/限制模型使能&${enabledList.splice(',').join('、')}` : '';
                this.formData['IsApiZtInvalidAlarm.modelList.11.priority'] = val['priority'] != this.copyForm['IsApiZtInvalidAlarm']['modelList'][11]['priority'] ? `IsApiZtInvalidAlarm.modelList.11.priority&渣土车配置/业务报警/违规区域卸载/限制优先级&${val['priority']}` : '';
                this.formData['IsApiZtInvalidAlarm.modelList.11.limitSpeed'] = val['limitSpeed'] != this.copyForm['IsApiZtInvalidAlarm']['modelList'][11]['limitSpeed'] ? `IsApiZtInvalidAlarm.modelList.11.limitSpeed&渣土车配置/业务报警/违规区域卸载/限制速度&${val['limitSpeed']}` : '';
                this.formData['IsApiZtInvalidAlarm.modelList.11.triggerSpeed'] = val['triggerSpeed'] != this.copyForm['IsApiZtInvalidAlarm']['modelList'][11]['triggerSpeed'] ? `IsApiZtInvalidAlarm.modelList.11.triggerSpeed&渣土车配置/业务报警/违规区域卸载/触发速度&${val['triggerSpeed']}` : '';
                this.formData['IsApiZtInvalidAlarm.modelList.11.continueTime'] = val['continueTime'] != this.copyForm['IsApiZtInvalidAlarm']['modelList'][11]['continueTime'] ? `IsApiZtInvalidAlarm.modelList.11.continueTime&渣土车配置/业务报警/违规区域卸载/持续时间&${val['continueTime']}` : '';
                this.formData['IsApiZtInvalidAlarm.modelList.11.mask'] = val['mask'] != this.copyForm['IsApiZtInvalidAlarm']['modelList'][11]['mask'] ? `IsApiZtInvalidAlarm.modelList.11.mask&渣土车配置/业务报警/违规区域卸载/限制掩码&${val['mask']}` : '';
              }else{
                this.formData['IsApiZtInvalidAlarm.modelList.11.enabled'] = '';
                this.formData['IsApiZtInvalidAlarm.modelList.11.priority'] = '';
                this.formData['IsApiZtInvalidAlarm.modelList.11.limitSpeed'] = '';
                this.formData['IsApiZtInvalidAlarm.modelList.11.triggerSpeed'] = '';
                this.formData['IsApiZtInvalidAlarm.modelList.11.continueTime'] = '';
                this.formData['IsApiZtInvalidAlarm.modelList.11.mask'] = '';
              }
              this.$emit('changeData',this.formData)
            })
          })
        }
      },
      deep: true,
      immediate:false,
    },
    'form.IsApiZtInvalidAlarm.modelList.12':{
      handler(val){
        if(val != undefined){
          let enabledList = [];
          if(this.form['IsApiZtInvalidAlarm']['modelList'][12].enabled){
            this.form['IsApiZtInvalidAlarm']['modelList'][12].enabled.forEach(item =>{
              enabledList.push(this.enabledJson[item])
            })
          }
          this.$nextTick(() =>{
            this.$refs['PublicInvalidAlarm'].validate((valid) => {
              if(valid){
                this.formData['IsApiZtInvalidAlarm.modelList.12.enabled'] = val['enabled'].toString() != this.copyForm['IsApiZtInvalidAlarm']['modelList'][12]['enabled'].toString() ? `IsApiZtInvalidAlarm.modelList.12.enabled&渣土车配置/业务报警/闯禁/限制模型使能&${enabledList.splice(',').join('、')}` : '';
                this.formData['IsApiZtInvalidAlarm.modelList.12.priority'] = val['priority'] != this.copyForm['IsApiZtInvalidAlarm']['modelList'][12]['priority'] ? `IsApiZtInvalidAlarm.modelList.12.priority&渣土车配置/业务报警/闯禁/限制优先级&${val['priority']}` : '';
                this.formData['IsApiZtInvalidAlarm.modelList.12.limitSpeed'] = val['limitSpeed'] != this.copyForm['IsApiZtInvalidAlarm']['modelList'][12]['limitSpeed'] ? `IsApiZtInvalidAlarm.modelList.12.limitSpeed&渣土车配置/业务报警/闯禁/限制速度&${val['limitSpeed']}` : '';
                this.formData['IsApiZtInvalidAlarm.modelList.12.triggerSpeed'] = val['triggerSpeed'] != this.copyForm['IsApiZtInvalidAlarm']['modelList'][12]['triggerSpeed'] ? `IsApiZtInvalidAlarm.modelList.12.triggerSpeed&渣土车配置/业务报警/闯禁/触发速度&${val['triggerSpeed']}` : '';
                this.formData['IsApiZtInvalidAlarm.modelList.12.continueTime'] = val['continueTime'] != this.copyForm['IsApiZtInvalidAlarm']['modelList'][12]['continueTime'] ? `IsApiZtInvalidAlarm.modelList.12.continueTime&渣土车配置/业务报警/闯禁/持续时间&${val['continueTime']}` : '';
                this.formData['IsApiZtInvalidAlarm.modelList.12.mask'] = val['mask'] != this.copyForm['IsApiZtInvalidAlarm']['modelList'][12]['mask'] ? `IsApiZtInvalidAlarm.modelList.12.mask&渣土车配置/业务报警/闯禁/限制掩码&${val['mask']}` : '';
              }else{
                this.formData['IsApiZtInvalidAlarm.modelList.12.enabled'] = '';
                this.formData['IsApiZtInvalidAlarm.modelList.12.priority'] = '';
                this.formData['IsApiZtInvalidAlarm.modelList.12.limitSpeed'] = '';
                this.formData['IsApiZtInvalidAlarm.modelList.12.triggerSpeed'] = '';
                this.formData['IsApiZtInvalidAlarm.modelList.12.continueTime'] = '';
                this.formData['IsApiZtInvalidAlarm.modelList.12.mask'] = '';
              }
              this.$emit('changeData',this.formData)
            })
          })
        }
      },
      deep: true,
      immediate:false,
    }
  },
  data(){
    return{
      form:{},
      copyForm:{},
      formData:{},
      enabledList:[],
      enabledJson:{},
      activeName:'0tab',
      modeTypes:['平台下发控制指令','区域控制','超速限速','厢盖未密闭','越界','非指定区域','外设故障','gps信号故障','证件无效','未联网','人脸识别','违规区域卸载','闯禁'],
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
      checkString:function(rule, value, callback){
        if (value.length != 0) {
          callback()
        }else{
          callback(new Error("限制模型使能不能为空"));
        }
      },
      checkMaskNum :function (rule, value, callback) {
        if (value!=='' && value!==null && value!==undefined) {
            if (!validateNum(value)) {
                callback(new Error("请输入正确的整数"));
            } else if(value<this.min){
              callback(new Error(`最小值为${this.min}`));
            } else if(value>this.max){
              callback(new Error(`最大值为${this.max}`));
            } else {
              callback();
            }
        } else {
            callback(new Error("请输入"));
            // callback();
        }
      },
    }
  },
  created(){
    // this.form = Object.assign({}, this.form, this.forms)
  },
  methods:{
    getByIsApi(type){
      if(!type){
        if(this.isTemplate == 'true'){
          this.makeDictionary(this.form['IsApiZtInvalidAlarmCapability']['enabled']);
          return
        }
        const params = {
          deviceId: this.$route.query.deviceId || null,
          commandIds: ['IsApiZtInvalidAlarm']
        };
        if(this.form['IsApiZtInvalidAlarm']){
          this.makeDictionary(this.form['IsApiZtInvalidAlarmCapability']['enabled']);
          return
        }
        this.$api.getDeviceConfigParamsByIsApi(params).then(res =>{
          if(res.success && !JSON.parse(res.data)['IsApiZtInvalidAlarm']['statusCode']){
            let resData = JSON.parse(res.data)
            if(resData['IsApiZtInvalidAlarmCapability']['enabled'].length){
              this.makeDictionary(resData['IsApiZtInvalidAlarmCapability']['enabled']);
            }
            this.form = Object.assign({}, this.form, JSON.parse(res.data));
            this.copyForm = Object.assign({}, this.copyForm, JSON.parse(res.data));
          }else{
            this.$message.error('获取设备配置参数失败:' + (res.msg
                                        ? res.msg
                                        : this.getErrMsg(
                                            JSON.parse(res.data)['IsApiZtInvalidAlarm']['statusCode']
                                          )))
          }
        })
      }
    },
    getErrMsg(code) {
            let obj = {
                2: "设备忙",
                3: "设备错误",
                4: "无效操作",
                5: "无效的Xml格式",
                6: "无效的Xml内容",
                7: "需要重启",
            };
            return obj[Number(code)];
        },
    makeDictionary(enableds){
      this.enabledList = [];
      this.enabledJson = {};
      enableds.forEach(item =>{
        switch(item){
          case 0:
            this.enabledList.push({
              id:item,
              label:'锁车'
            })
            this.enabledJson[item] = '锁车'
          break;
          case 1:
            this.enabledList.push({
              id:item,
              label:'限速'
            })
            this.enabledJson[item] = '限速'
          break;
          case 2:
            this.enabledList.push({
              id:item,
              label:'限举'
            })
            this.enabledJson[item] = '限举'
          break;
          default:
            this.enabledList.push({
              id:3,
              label:'模型'
            })
            this.enabledJson[item] = '模型'
          break;
        }
      })
    },
    beforeLeave(activeName,oldActiveName){
      // this.$refs.PublicInvalidAlarm.validate((valid) =>{
      //   if(!valid){
      //     this.$message.warning('当前表单验证不通过，请先完善！')
      //     return new Promise((resolve,reject) =>{
      //       valid == true;
      //     }).then(() =>{
      //       resolve()
      //     }).catch(reject(err))
      //   }
      // })
    },
  }

}
</script>
<style lang='less' scoped>
  #title{
    margin-bottom: 5px;
  }
</style>