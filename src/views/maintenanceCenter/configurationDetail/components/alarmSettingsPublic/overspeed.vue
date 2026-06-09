<template>
    <div class="p-a-md">
        <h2>基本设置</h2>
        <el-form
            ref="PublicOverspeed"
            label-position="top"
            :model="form"
            label-width="120px"
            style="margin-top:10px"
            :rules="rules"
        >
          <template v-if="form['IsApiSpeedingOthers']">
            <el-row type="flex" justify="space-between">
                <el-col :span="7" >
                    <el-form-item label="超速持续时间" prop='IsApiSpeedingOthers.overSpeedDurationTime'>
                        <el-input tips-placement="top-end" tips="键入值范围为0~50000" v-model="form['IsApiSpeedingOthers'].overSpeedDurationTime"><span slot="suffix">s</span></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="7" >
                    <el-form-item label="超速预警差值" prop='IsApiSpeedingOthers.overSpeedAlarmWarningValue'>
                        <el-input tips-placement="top-end" tips="键入值范围为0~32767" v-model="form['IsApiSpeedingOthers'].overSpeedAlarmWarningValue"><span slot="suffix">0.1 km/h</span></el-input>
                    </el-form-item>
                </el-col>
               <el-col :span="7" >
                    <el-form-item label="超速阈值" prop='IsApiSpeedingOthers.maxSpeed'>
                        <el-input tips-placement="top-end" tips="键入值范围为0~50000" v-model="form['IsApiSpeedingOthers'].maxSpeed"><span slot="suffix">km/h</span></el-input>
                    </el-form-item>
                </el-col>
                <!-- <el-col :span="7" ></el-col> -->
            </el-row>
          </template>
        </el-form>
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
    configParams:{
        handler (val) {
        if(!val && !this.form['IsApiSpeedingOthers'] && this.form['IsApiSpeedingOthers'] != '{}'){
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
    'form.IsApiSpeedingOthers' : {
      handler(val){
        console.log(this.copyForm)
        if(val != undefined){
          this.$refs['PublicOverspeed'].validate((valid) => {
            if(valid){
              this.formData['IsApiSpeedingOthers.overSpeedDurationTime'] = val['overSpeedDurationTime'] != this.copyForm['IsApiSpeedingOthers']['overSpeedDurationTime'] ? `IsApiSpeedingOthers.overSpeedDurationTime&报警设置/超速报警/超速持续时间&${val['overSpeedDurationTime']}` : '';
              this.formData['IsApiSpeedingOthers.overSpeedAlarmWarningValue'] = val['overSpeedAlarmWarningValue'] != this.copyForm['IsApiSpeedingOthers']['overSpeedAlarmWarningValue'] ? `IsApiSpeedingOthers.overSpeedAlarmWarningValue&报警设置/超速报警/超速预警差值&${val['overSpeedAlarmWarningValue']}` : '';
              this.formData['IsApiSpeedingOthers.maxSpeed'] = val['maxSpeed'] != this.copyForm['IsApiSpeedingOthers']['maxSpeed'] ? `IsApiSpeedingOthers.maxSpeed&报警设置/超速报警/超速阈值&${val['maxSpeed']}` : '';
            }else{
              this.formData['IsApiSpeedingOthers.overSpeedDurationTime'] = '';
              this.formData['IsApiSpeedingOthers.overSpeedAlarmWarningValue'] = '';
              this.formData['IsApiSpeedingOthers.maxSpeed'] = '';
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
      activeName:'first',
      rules: {
        'IsApiSpeedingOthers.overSpeedDurationTime': [ { validator: checkNumber.bind({type:'int',min:0,max:50000}), trigger: 'blur' }],
        'IsApiSpeedingOthers.overSpeedAlarmWarningValue': [ { validator: checkNumber.bind({type:'short',min:0,max:32767}), trigger: 'blur' }],
        'IsApiSpeedingOthers.maxSpeed': [ { validator: checkNumber.bind({type:'int',min:0,max:50000}), trigger: 'blur' }],
      }
    }
  },
  methods:{
    getDeviceConfigParamsByIsApi() {
      if(this.isTemplate == 'true') return
      let params = {
        deviceId: this.$route.query.deviceId || null,
        commandIds: ['IsApiSpeedingOthers']
      }
      this.$api.getDeviceConfigParamsByIsApi(params).then((res) => {
        if (res.success == true && !JSON.parse(res.data)['IsApiSpeedingOthers']['statusCode']) {
          this.form = Object.assign({}, this.form, JSON.parse(res.data));
          this.copyForm = Object.assign({}, this.copyForm, JSON.parse(res.data)); 
        } else {
          this.$message.error('获取设备配置参数失败:' + res.msg)
        }
      });
    }
  },
  created(){
    // this.getDeviceConfigParamsByIsApi();
  }
}
</script>

<style scoped>

</style>