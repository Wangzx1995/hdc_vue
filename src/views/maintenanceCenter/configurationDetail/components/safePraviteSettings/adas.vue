<template>
  <div class="p-a-md">
    <el-form
      ref="PraviteAdas"
      label-position="top"
      :model="form"
      label-width="120px"
    >
      <el-tabs v-model="activeName" :before-leave="beforeLeave" @tab-click="getByIsApi(activeName)">
          <el-tab-pane label="ADAS全局配置" name="first">
            <el-row type="flex" justify="space-between" style="margin-top: 10px">
                <el-col :span="7" >
                    <!-- <el-form-item label="ADAS报警使能" description="开启后可统一开启ADAS报警使能">
                        <el-select v-model="form['F364'].alarmEnable" placeholder="请选择">
                          <el-option label="关闭" :value="0"></el-option>
                          <el-option label="开启" :value="1"></el-option>
                        </el-select>
                    </el-form-item> -->
                    <el-button @click="openDialog">ADAS全局音量配置</el-button>
                </el-col>
                <!-- <el-col :span="7" >
                    <el-form-item label="ADAS报警音量开关" prop="F364.speedThreshold" description="开启后可统一设置ADAS报警音量">
                      <el-select v-model="form['F364'].alarmEnable" placeholder="请选择">
                          <el-option label="关闭" :value="0"></el-option>
                          <el-option label="开启" :value="1"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="7" >
                        <el-form-item label="ADAS报警音量" prop="F364.alarmVolume">
                        <el-slider v-model="form['F364'].alarmVolume" :min="0" :max="8" :step="1"></el-slider>
                        </el-form-item>
                </el-col> -->
            </el-row>
          </el-tab-pane>
          <el-tab-pane :label="item.name" :name="item.name" v-for="item in tablist" :key="item.index" >
            <template v-if="form[item.commandId]">
            <el-row type="flex" justify="space-between" class="m-t-sm">
              <!-- <el-form-item>
                <el-radio-group v-model="item.alarmLevel" type="simple">
                  <el-radio-button :label="1">一级报警</el-radio-button>
                  <el-radio-button :label="2">二级报警</el-radio-button>
                </el-radio-group>                
              </el-form-item> -->
            <div class="alarmLevelBox">
              <el-button @click="changeAlarmLevel(item,1)" :type="item.alarmLevel==1 ? 'primary' : 'default'">一级报警</el-button>
              <el-button @click="changeAlarmLevel(item,2)" :type="item.alarmLevel==2 ? 'primary' : 'default'">二级报警</el-button>
            </div>
            </el-row>
              <div v-for="(i,iIndex) in form[item.commandId].adasAlarmInfoList" :key="iIndex"> 
                <template v-if="i.alarmLevel==item.alarmLevel">
                <el-row type="flex" justify="space-between">
                    <el-col :span="7" >
                        <el-form-item :label="item.shortName+'报警使能'">
                            <el-select v-model="i.alarmEnabled">
                              <el-option label="关闭" :value="0"></el-option>
                              <el-option label="开启" :value="1"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7" >
                        <!-- <el-form-item label="报警判断速度阈值" :rules="{ validator: checkNumber.bind({type:'int'}), trigger: 'blur' }" :prop="item.commandId + '.adasAlarmInfoList.' + iIndex + '.speedLimit'"> -->
                        <el-form-item label="报警判断速度阈值" :rules="{ validator: checkNumber.bind({type:'int',min:form[item.commandId+'Capability'].capabilities[item.alarmLevel-1].speedLimitMin,max:form[item.commandId+'Capability'].capabilities[item.alarmLevel-1].speedLimitMax}), trigger: 'blur' }" :prop="item.commandId + '.adasAlarmInfoList.' + iIndex + '.speedLimit'">
                            <el-input v-model="i.speedLimit"><span slot="suffix">km/h</span></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7" >
                        <!-- <el-form-item label="报警抑制时间 (100-600)" :rules="{ validator: checkNumber.bind({type:'int',min:100,max:600}), trigger: 'blur' }" :prop="item.commandId + '.adasAlarmInfoList.' + iIndex + '.interval'"> -->
                        <el-form-item label="报警抑制时间" :rules="{ validator: checkNumber.bind({type:'int',min:form[item.commandId+'Capability'].capabilities[item.alarmLevel-1].intervalMin,max:form[item.commandId+'Capability'].capabilities[item.alarmLevel-1].intervalMax}), trigger: 'blur' }" :prop="item.commandId + '.adasAlarmInfoList.' + iIndex + '.interval'">
                            <el-input v-model="i.interval"><span slot="suffix">ms</span></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row type="flex" justify="space-between">
                    <el-col :span="7" >
                        <!-- <el-form-item label="碰撞时间" :rules="{ validator: checkNumber.bind({type:'int'}), trigger: 'blur' }" :prop="item.commandId + '.adasAlarmInfoList.' + iIndex + '.timeToCollision'"> -->
                        <el-form-item label="碰撞时间" :rules="{ validator: checkNumber.bind({type:'int',min:form[item.commandId+'Capability'].capabilities[item.alarmLevel-1].timeToCollisionMin,max:form[item.commandId+'Capability'].capabilities[item.alarmLevel-1].timeToCollisionMax}), trigger: 'blur' }" :prop="item.commandId + '.adasAlarmInfoList.' + iIndex + '.timeToCollision'">
                            <el-input v-model="i.timeToCollision"><span slot="suffix">s</span></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7" >
                        <el-form-item :label="item.shortName+'报警音量'">
                            <el-slider v-model="i.volume" :min="1" :max="64" :step="1" show-input></el-slider>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7" >
                        <el-form-item label="事件上传使能">
                            <el-select v-model="i.eventEnabled">
                              <el-option label="不上传" :value="0"></el-option>
                              <el-option label="上传" :value="1"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row type="flex" justify="space-between">
                    <el-col :span="7" >
                        <el-form-item label="抓图报警类型">
                            <el-select v-model="i.snapShotUpload">
                              <el-option label="关闭" :value="0"></el-option>
                              <el-option label="上传" :value="1"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7" >
                        <!-- <el-form-item label="抓图张数" :rules="{ validator: checkNumber.bind({type:'int'}), trigger: 'blur' }" :prop="item.commandId + '.adasAlarmInfoList.' + iIndex + '.snapShotNum'"> -->
                        <el-form-item label="抓图张数" :rules="{ validator: checkNumber.bind({type:'int',min:form[item.commandId+'Capability'].capabilities[item.alarmLevel-1].snapShotNumMin,max:form[item.commandId+'Capability'].capabilities[item.alarmLevel-1].snapShotNumMax}), trigger: 'blur' }" :prop="item.commandId + '.adasAlarmInfoList.' + iIndex + '.snapShotNum'">
                              <el-input v-model="i.snapShotNum"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7" >
                        <!-- <el-form-item label="抓图间隔" :rules="{ validator: checkNumber.bind({type:'int'}), trigger: 'blur' }" :prop="item.commandId + '.adasAlarmInfoList.' + iIndex + '.snapShotTime'"> -->
                        <el-form-item label="抓图间隔" :rules="{ validator: checkNumber.bind({type:'int',min:form[item.commandId+'Capability'].capabilities[item.alarmLevel-1].snapShotTimeMin,max:form[item.commandId+'Capability'].capabilities[item.alarmLevel-1].snapShotTimeMax}), trigger: 'blur' }" :prop="item.commandId + '.adasAlarmInfoList.' + iIndex + '.snapShotTime'">
                              <el-input v-model="i.snapShotTime"><span slot="suffix">s</span></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row type="flex" justify="space-between">
                    <el-col :span="7" >
                        <el-form-item label="视频报警类型">
                          <el-select v-model="i.clipUpload">
                              <el-option label="关闭" :value="0"></el-option>
                              <el-option label="上传" :value="1"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7" >
                        <!-- <el-form-item label="短视频前半部分时长" :rules="{ validator: checkNumber.bind({type:'int'}), trigger: 'blur' }" :prop="item.commandId + '.adasAlarmInfoList.' + iIndex + '.clipPreDuration'"> -->
                        <el-form-item label="短视频前半部分时长" :rules="{ validator: checkNumber.bind({type:'int',min:form[item.commandId+'Capability'].capabilities[item.alarmLevel-1].clipPreDurationMin,max:form[item.commandId+'Capability'].capabilities[item.alarmLevel-1].clipPreDurationMax}), trigger: 'blur' }" :prop="item.commandId + '.adasAlarmInfoList.' + iIndex + '.clipPreDuration'">
                              <el-input v-model="i.clipPreDuration"><span slot="suffix">s</span></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7" >
                        <!-- <el-form-item label="短视频后半部分时长" :rules="{ validator: checkNumber.bind({type:'int'}), trigger: 'blur' }" :prop="item.commandId + '.adasAlarmInfoList.' + iIndex + '.clipPostDuration'"> -->
                        <el-form-item label="短视频后半部分时长" :rules="{ validator: checkNumber.bind({type:'int',min:form[item.commandId+'Capability'].capabilities[item.alarmLevel-1].clipPostDurationMin,max:form[item.commandId+'Capability'].capabilities[item.alarmLevel-1].clipPostDurationMax}), trigger: 'blur' }" :prop="item.commandId + '.adasAlarmInfoList.' + iIndex + '.clipPostDuration'">
                              <el-input v-model="i.clipPostDuration"><span slot="suffix">s</span></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row type="flex" justify="space-between">
                    <el-col :span="7" >
                        <!-- <el-form-item label="算法置信度（1-100）" :rules="{ validator: checkNumber.bind({type:'int',min:1,max:100}), trigger: 'blur' }" :prop="item.commandId + '.adasAlarmInfoList.' + iIndex + '.confidence'"> -->
                          <el-form-item label="算法置信度" :rules="{ validator: checkNumber.bind({type:'int',min:form[item.commandId+'Capability'].capabilities[item.alarmLevel-1].confidenceMin,max:form[item.commandId+'Capability'].capabilities[item.alarmLevel-1].confidenceMax}), trigger: 'blur' }" :prop="item.commandId + '.adasAlarmInfoList.' + iIndex + '.confidence'">
                              <el-input v-model="i.confidence"><span slot="suffix">%</span></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7" >
                        <!-- <el-form-item label="算法灵敏度（0-3）" :rules="{ validator: checkNumber.bind({type:'int',min:0,max:3}), trigger: 'blur' }" :prop="item.commandId + '.adasAlarmInfoList.' + iIndex + '.sensitivity'"> -->
                          <el-form-item label="算法灵敏度" :rules="{ validator: checkNumber.bind({type:'int',min:form[item.commandId+'Capability'].capabilities[item.alarmLevel-1].sensitivityMin,max:form[item.commandId+'Capability'].capabilities[item.alarmLevel-1].sensitivityMax}), trigger: 'blur' }" :prop="item.commandId + '.adasAlarmInfoList.' + iIndex + '.sensitivity'">
                              <el-input v-model="i.sensitivity"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7" >
                    </el-col>
                </el-row>
                </template>
              </div>
            </template>
          </el-tab-pane>
      </el-tabs>
      </el-form>
       <el-dialog title="ADAS全局音量调整" :visible.sync="dialogVisible">
        <div class="p-a-md">
          <p class="m-b-sm">点击确定后ADAS所有报警项音量将调整为该值</p>
          <el-slider v-model="volume" :min="1" :max="64" :step="1" show-input></el-slider>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="send">确 定</el-button>
          <el-button @click="dialogVisible = false">取 消</el-button>
        </span>
      </el-dialog>
  </div>
</template>

<script>
import {validateNum} from '@/utils/validate';
export default {
  props:{
    detail:{
      type: Object,
      default:()=>{
        return {}
      }
    },
    isTemplate: {
      type: String
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
    form: {
      handler (val) {
        if (JSON.stringify(val) !== '{}'){
          this.$emit('change',val)
        }
      },
      deep: true,
      immediate:true,
    },
    capabilitiesEmit: {
      handler (val){
        if (JSON.stringify(val) !== '{}'){
          this.$emit('capabilitiesEmit',val)
        }
      }
    },
    currentCommandId: {
      handler (newVal, oldVal) {
        this.$emit('adasCommandId',newVal)
      }
    }
  },
  data() {
    return {
      alarmLevelCopy:1,
      currentCommandId: '',
      dialogVisible: false,
      form:{},
      capabilitiesEmit:{},
      volume: 50,
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
            // callback(new Error("请输入"));
            callback();
        }
      },
      activeName:'first',
      tablist: [
        {
          name: '前车碰撞（FCW）',
          shortName: '前车碰撞',
          commandId: 'IsApiFcwInfoList',
          alarmLevel: 1
        },
        {
          name: '车距过近（HMW）',
          shortName: '车距过近',
          commandId:'IsApiHmwInfoList',
          alarmLevel: 1
        },
        {
          name: '车道偏离（LDW）',
          shortName: '车道偏离',
          commandId:'IsApiLdwInfoList',
          alarmLevel: 1
        },
        {
          name: '行人监测（PCW）',
          shortName: '行人监测',
          commandId:'IsApiPcwInfoList',
          alarmLevel: 1
        },
        {
          name: '交通标识识别（TSR）',
          shortName: '交通标识识别',
          commandId:'IsApiTsrInfoList',
          alarmLevel: 1
        },
      ]
    }
  },
  methods: {
    send() {
        this.tablist.forEach((item,index) => {
          // console.log(item,item.commandId,this.form[item.commandId])
          if (this.form[item.commandId]) {
            this.form[item.commandId].adasAlarmInfoList.forEach(i => {
              this.$set(i,'volume',this.volume)
              if(index == this.tablist.length-1){
                this.$message.success('ADAS所有报警项音量调整成功');
                this.dialogVisible = false
              }
            })
          }
        });
    },
    changeAlarmLevel(label,type){
      if (label.alarmLevel == type) return;
      this.$refs.PraviteAdas.validate((valid) =>{
        if(!valid){
          this.$message.warning('当前表单验证不通过，请先完善！')
          label.alarmLevel = type == 1 ? 2 : 1
        }else{
          label.alarmLevel = type;
        }
      })
    },
    openDialog() {
      this.dialogVisible = true
    },
    beforeLeave(activeName,oldActiveName){
      this.$refs.PraviteAdas.validate((valid) =>{
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
    getByIsApi(tabName) {
      if(Boolean(this.isTemplate) == true) return
        let params = {
          deviceId: this.$route.query.deviceId || null,
          commandIds: []
      }
      let findFlag = 0
      this.tablist.forEach(tab => {
        if (tab.name == tabName) {
          // console.log(tab.name);
          // console.log(tab.commandId);
          params.commandIds.push(tab.commandId)
          this.currentCommandId = tab.commandId;
          findFlag++
        }
      })
      if (!findFlag) return
      this.$api.getDeviceConfigParamsByIsApi(params).then((res) => {
        if (res.success == true && !JSON.parse(res.data)[params['commandIds'][0]]['statusCode']) {          
          this.form = Object.assign({}, this.form, JSON.parse(res.data));
          this.capabilitiesEmit = JSON.parse(res.data);
          // console.log(JSON.parse(res.data));
          // console.log(this.form);
        } else {
          this.$message.error('获取设备配置参数失败:' + res.msg)
        }
      });
    }
  },
  mounted(){
  }
}
</script>

<style scoped>
  .alarmLevelBox{
    padding-bottom: 8px;
  }
</style>