<template>
    <div class="p-a-md">
        <h2>基本设置</h2>
        <el-form
            ref="PublicFatigueDriving"
            label-position="top"
            :model="form"
            label-width="120px"
            style="margin-top:10px"
            :rules="rules"
        >
          <template v-if="form['IsApiFatigueDrivingOthers']">
            <el-row type="flex" justify="space-between">
                <el-col :span="7" >
                    <el-form-item label="当天累计驾驶时间" prop="IsApiFatigueDrivingOthers.accumulatedDrivingTimeThresholdOfTheDay">
                      <el-input tips-placement="top-end" tips="键入值范围为0~50000" v-model="form['IsApiFatigueDrivingOthers'].accumulatedDrivingTimeThresholdOfTheDay"><span slot="suffix">min</span></el-input>
                    </el-form-item>
                    
                </el-col>
                <el-col :span="7" >
                    <el-form-item label="疲劳驾驶预警差值" prop="IsApiFatigueDrivingOthers.fatigueDrivingWarningValue">
                      <el-input tips-placement="top-end" tips="键入值范围为0~32767" v-model="form['IsApiFatigueDrivingOthers'].fatigueDrivingWarningValue"><span slot="suffix">s</span></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="7" >
                  <el-form-item label="最小休息时间" prop="IsApiFatigueDrivingOthers.minimumRestTime">
                       <el-input tips-placement="top-end" tips="键入值范围为0~50000" v-model="form['IsApiFatigueDrivingOthers'].minimumRestTime"><span slot="suffix">min</span></el-input>
                    </el-form-item>
               <!-- <el-form-item label="最长停车时间" prop="005A.maximumParkingTime">
                      <el-input v-model="form['IsApiFatigueDrivingOthers'].maximumParkingTime"><span slot="suffix">min</span></el-input>
                    </el-form-item> -->
                </el-col>
            </el-row>
            <!--<el-row type="flex" justify="space-between">
                <el-col :span="7" >
                    <el-form-item label="连续驾驶时间门限" prop="0057.continuousDrivingTimeThreshold">
                       <el-input v-model="form['0057'].continuousDrivingTimeThreshold"><span slot="suffix">min</span></el-input>
                    </el-form-item>
                </el-col>-->
                <!--<el-col :span="7" >
                    <el-form-item label="最小休息时间" prop="0059.minimumRestTime">
                       <el-input v-model="form['0059'].minimumRestTime"><span slot="suffix">min</span></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="7" ></el-col>
            </el-row>-->
          </template>
        </el-form>
        
        <!-- <h2 v-if="form['IsApiFatigueDrive']">夜间疲劳驾驶配置</h2>
        <el-form
            ref="FatigueDriving"
            label-position="top"
            :model="form"
            label-width="120px"
            style="margin-top:10px"
            v-if="form['IsApiFatigueDrive']"
        >
            <el-row type="flex" justify="space-between">
                <el-col :span="7" > -->
                    <!--换绑定参数-->
                    <!-- <el-form-item label="夜晚开始时间" prop="IsApiFatigueDrive.nightBeginTime">
                      <el-time-picker v-model="form['IsApiFatigueDrive'].nightBeginTime" format="HH:mm" value-format="HH:mm"></el-time-picker>
                    </el-form-item> -->
                    <!---->
                <!-- </el-col> -->
                <!-- <el-col :span="7" > -->
                    <!--换绑定参数-->
                    <!-- <el-form-item label="夜晚结束时间" prop="IsApiFatigueDrive.nightEndTime">
                      <el-time-picker v-model="form['IsApiFatigueDrive'].nightEndTime" format="HH:mm" value-format="HH:mm"></el-time-picker>
                    </el-form-item> -->
                    <!---->
                <!-- </el-col>
                <el-col :span="7" > -->
                    <!--换绑定参数-->
                    <!-- <el-form-item label="夜晚连续驾驶时间" prop="IsApiFatigueDrive.nightDuration">
                      <el-input v-model="form['IsApiFatigueDrive'].nightDuration"><span slot="suffix">min</span></el-input>
                    </el-form-item> -->
                    <!---->
                <!-- </el-col>
            </el-row>
            <el-row type="flex" justify="space-between">
                <el-col :span="7" >
                    <el-form-item label="白天连续驾驶时间" prop="IsApiFatigueDrive.daytimeDuration">
                      <el-input v-model="form['IsApiFatigueDrive'].daytimeDuration"><span slot="suffix">min</span></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="7" >
                </el-col>
                <el-col :span="7" ></el-col>
            </el-row>
        </el-form> -->
    </div>
</template>

<script>
import {validateNum} from '@/utils/validate';
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
    configParams:{
        handler (val) {
        if(!val && !this.form['IsApiFatigueDrivingOthers'] && this.form['IsApiFatigueDrivingOthers'] != '{}'){
          this.getDeviceConfigParamsByIsApi();
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
    'form.IsApiFatigueDrivingOthers' : {
      handler(val){
        console.log(this.copyForm)
        if(val != undefined){
          this.$refs['PublicFatigueDriving'].validate((valid) => {
            if(valid){
              this.formData['IsApiFatigueDrivingOthers.accumulatedDrivingTimeThresholdOfTheDay'] = val['accumulatedDrivingTimeThresholdOfTheDay'] != this.copyForm['IsApiFatigueDrivingOthers']['accumulatedDrivingTimeThresholdOfTheDay'] ? `IsApiFatigueDrivingOthers.accumulatedDrivingTimeThresholdOfTheDay&报警设置/疲劳驾驶/当天累计驾驶时间&${val['accumulatedDrivingTimeThresholdOfTheDay']}` : '';
              this.formData['IsApiFatigueDrivingOthers.fatigueDrivingWarningValue'] = val['fatigueDrivingWarningValue'] != this.copyForm['IsApiFatigueDrivingOthers']['fatigueDrivingWarningValue'] ? `IsApiFatigueDrivingOthers.fatigueDrivingWarningValue&报警设置/疲劳驾驶/疲劳驾驶预警差值&${val['fatigueDrivingWarningValue']}` : '';
              this.formData['IsApiFatigueDrivingOthers.minimumRestTime'] = val['minimumRestTime'] != this.copyForm['IsApiFatigueDrivingOthers']['minimumRestTime'] ? `IsApiFatigueDrivingOthers.minimumRestTime&报警设置/疲劳驾驶/最小休息时间&${val['minimumRestTime']}` : '';
            }else{
              this.formData['IsApiFatigueDrivingOthers.accumulatedDrivingTimeThresholdOfTheDay'] = '';
              this.formData['IsApiFatigueDrivingOthers.fatigueDrivingWarningValue'] = '';
              this.formData['IsApiFatigueDrivingOthers.minimumRestTime'] = '';
            }
            this.$emit('changeData',this.formData)
          })
        }
      },
      deep: true,
      immediate:false,
    }
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
    return {
      form:{},
      copyForm:{},
      formData:{},
      rules: {
        'IsApiFatigueDrivingOthers.continuousDrivingTimeThreshold': [ { validator: checkNumber.bind({type:'int',min:0,max:50000}), trigger: 'blur' }],
        'IsApiFatigueDrivingOthers.accumulatedDrivingTimeThresholdOfTheDay': [ { validator: checkNumber.bind({type:'int',min:0,max:50000}), trigger: 'blur' },{required: true,message:'请输入当天累计驾驶时间'}],
        'IsApiFatigueDrivingOthers.minimumRestTime': [ { validator: checkNumber.bind({type:'int',min:0,max:50000}), trigger: 'blur' },{required: true,message:'请输入最小休息时间'}],
        'IsApiFatigueDrivingOthers.maximumParkingTime': [ { validator: checkNumber.bind({type:'int',min:0,max:50000}), trigger: 'blur' }],
        'IsApiFatigueDrivingOthers.fatigueDrivingWarningValue': [ { validator: checkNumber.bind({type:'short',min:1,max:32767}), trigger: 'blur' },{required: true,message:'请输入疲劳驾驶预警差值'}],
        'IsApiFatigueDrive.daytimeDuration': [ { validator: checkNumber.bind({type:'int',min:0,max:10000000}), trigger: 'blur' }],
        'IsApiFatigueDrive.nightDuration': [ { validator: checkNumber.bind({type:'int',min:0,max:10000000}), trigger: 'blur' }],
      }
    }
  },
  methods: {
     getDeviceConfigParamsByIsApi() {
      if(this.isTemplate == 'true') return
      let params = {
        deviceId: this.$route.query.deviceId || null,
        commandIds: ['IsApiFatigueDrivingOthers']
      }
      this.$api.getDeviceConfigParamsByIsApi(params).then((res) => {
        if (res.success == true) {
          this.form = Object.assign({}, this.form, JSON.parse(res.data));
          this.copyForm = Object.assign({}, this.copyForm, JSON.parse(res.data));
        } else {
          this.$message.error('获取设备配置参数失败:' + res.msg)
        }
      });
    }
  },
  created() {
    // this.getDeviceConfigParamsByIsApi()
  },
}
</script>

<style scoped>

</style>