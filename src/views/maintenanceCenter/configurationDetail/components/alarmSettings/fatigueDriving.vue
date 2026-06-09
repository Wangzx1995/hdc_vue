<template>
    <div class="p-a-md">
        <h2>基本设置</h2>
        <el-form
            ref="FatigueDriving"
            label-position="top"
            :model="form"
            label-width="120px"
            style="margin-top:10px"
            :rules="rules"
        >
          <div class="configurations">
            <div v-if="form['0058']" class="configuration-item">
              <el-form-item label="当天累计驾驶时间" prop="0058.accumulatedDrivingTimeThresholdOfTheDay">
                <el-input v-model="form['0058'].accumulatedDrivingTimeThresholdOfTheDay"><span slot="suffix">min</span></el-input>
              </el-form-item>
            </div>
            <div v-if="form['0059']" class="configuration-item">
              <el-form-item label="最小休息时间" prop="0059.minimumRestTime">
                  <el-input v-model="form['0059'].minimumRestTime"><span slot="suffix">min</span></el-input>
              </el-form-item>
            </div>
            <div v-if="form['005C']" class="configuration-item">
              <el-form-item label="疲劳驾驶预警差值" prop="005C.fatigueDrivingWarningValue">
                <el-input v-model="form['005C'].fatigueDrivingWarningValue"><span slot="suffix">s</span></el-input>
              </el-form-item>
            </div>
            <div v-if="form['005A']" class="configuration-item">
              <el-form-item label="最长停车时间" prop="005A.maximumParkingTime">
                <el-input v-model="form['005A'].maximumParkingTime"><span slot="suffix">min</span></el-input>
              </el-form-item>
            </div>
          </div>
            <!-- <el-row type="flex" justify="space-between">
                <el-col :span="7" >
                    
                    
                </el-col>
                <el-col :span="7" >
                    
                </el-col>
                <el-col :span="7" >
               
                </el-col>
            </el-row> -->
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
        </el-form>
        <h2 v-if="form['IsApiFatigueDrive']">夜间疲劳驾驶配置</h2>
        <el-form
            ref="FatigueDriving"
            label-position="top"
            :model="form"
            label-width="120px"
            style="margin-top:10px"
            :rules="rules"
            v-if="form['IsApiFatigueDrive']"
        >
          <div class="configurations">
            <div v-if="form['IsApiFatigueDrive']" class="configuration-item">
              <!--换绑定参数-->
              <el-form-item label="夜晚开始时间" prop="IsApiFatigueDrive.nightBeginTime">
                <el-time-picker v-model="form['IsApiFatigueDrive'].nightBeginTime" format="HH:mm" value-format="HH:mm"></el-time-picker>
              </el-form-item>
              <!---->
            </div>
            <div v-if="form['IsApiFatigueDrive']" class="configuration-item">
              <!--换绑定参数-->
              <el-form-item label="夜晚结束时间" prop="IsApiFatigueDrive.nightEndTime">
                <el-time-picker v-model="form['IsApiFatigueDrive'].nightEndTime" format="HH:mm" value-format="HH:mm"></el-time-picker>
              </el-form-item>
              <!---->
            </div>
            <div v-if="form['IsApiFatigueDrive']" class="configuration-item">
              <!--换绑定参数-->
              <el-form-item label="夜晚连续驾驶时间" prop="IsApiFatigueDrive.nightDuration">
                <el-input v-model="form['IsApiFatigueDrive'].nightDuration"><span slot="suffix">min</span></el-input>
              </el-form-item>
              <!---->
            </div>
            <div v-if="form['IsApiFatigueDrive']" class="configuration-item">
              <el-form-item label="白天连续驾驶时间" prop="IsApiFatigueDrive.daytimeDuration">
                <el-input v-model="form['IsApiFatigueDrive'].daytimeDuration"><span slot="suffix">min</span></el-input>
              </el-form-item>
            </div>
          </div>
            <!-- <el-row type="flex" justify="space-between">
                <el-col :span="7" >
                    
                </el-col>
                <el-col :span="7" >
                    
                </el-col>
                <el-col :span="7" >
                    
                </el-col>
            </el-row>
            <el-row type="flex" justify="space-between">
                <el-col :span="7" >
                    
                </el-col>
                <el-col :span="7" >
                </el-col>
                <el-col :span="7" ></el-col>
            </el-row> -->
        </el-form>
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
    configParams:{
      type:Boolean,
      default:false
    }
  },
  watch:{
    configParams:{
        handler (val) {
        if(!val){
          // this.getDeviceConfigParamsByIsApi();
        }
      },
      deep: true,
      immediate:true,
    },
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
      rules: {
        '0057.continuousDrivingTimeThreshold': [ { validator: checkNumber.bind({type:'int',min:0,max:50000}), trigger: 'blur' }],
        '0058.accumulatedDrivingTimeThresholdOfTheDay': [ { validator: checkNumber.bind({type:'int',min:0,max:50000}), trigger: 'blur' },{required: true,message:'请输入当天累计驾驶时间',trigger: 'blur'}],
        '0059.minimumRestTime': [ { validator: checkNumber.bind({type:'int',min:0,max:50000}), trigger: 'blur' }],
        '005A.maximumParkingTime': [ { validator: checkNumber.bind({type:'int',min:0,max:50000}), trigger: 'blur' }],
        '005C.fatigueDrivingWarningValue': [ { validator: checkNumber.bind({type:'short',min:1,max:32767}), trigger: 'blur' }],
        'IsApiFatigueDrive.daytimeDuration': [ { validator: checkNumber.bind({type:'int',min:0,max:10000000}), trigger: 'blur' }],
        'IsApiFatigueDrive.nightDuration': [ { validator: checkNumber.bind({type:'int',min:0,max:10000000}), trigger: 'blur' }],
      }
    }
  },
  methods: {
     getDeviceConfigParamsByIsApi() {
      let params = {
        deviceId: this.$route.query.deviceId || null,
        commandIds: ['IsApiFatigueDrive']
      }
      this.$api.getDeviceConfigParamsByIsApi(params).then((res) => {
        if (res.success && (JSON.parse(res.data)['IsApiFatigueDrive']['statusCode'] == 0 || !JSON.parse(res.data)['IsApiFatigueDrive']['statusCode'])) {
          this.form = Object.assign({}, this.form, JSON.parse(res.data) )
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