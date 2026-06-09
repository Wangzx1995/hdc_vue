<template>
  <div class="p-a-md">
    <h2>基础设置</h2>
    <el-form ref="PublicSerial" label-position="top" :model="form" :rules="rules" style="margin-top: 10px">
    <template v-if="form['IsApiSerialInfo']">
      <el-row type="flex" justify="space-between">
        <el-col :span="7">
            <el-form-item label="第一中心使能">
            <el-switch v-model="form['IsApiSerialInfo'].enabled"></el-switch></el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="RS485工作模式">
            <el-select v-model="form['IsApiSerialInfo'].rs485WorkMode">
              <el-option
                v-for="item in form['IsApiSerialInfoCapability'].rs485WorkModeList"
                    :key="item"
                    :label="item"
                    :value="item">
                </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="声光报警器">
            <el-select v-model="form['IsApiSerialInfo'].audibleVisualAlarmType">
              <el-option
                v-for="item in form['IsApiSerialInfoCapability'].audibleVisualAlarmTypeList"
                    :key="item"
                    :label="item"
                    :value="item">
                </el-option>
            </el-select>
          </el-form-item>
        </el-col>
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
        if(!val && !this.form['IsApiSerialInfo'] && this.form['IsApiSerialInfo'] != '{}'){
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
    'form.IsApiSerialInfo' : {
      handler(val){
        console.log(this.copyForm)
        if(val != undefined){
          this.$refs['PublicSerial'].validate((valid) => {
            if(valid){
              this.formData['IsApiSerialInfo.enabled'] = val['enabled'] != this.copyForm['IsApiSerialInfo']['enabled'] ? `IsApiSerialInfo.enabled&外设输出设置/声光报警器/第一中心使能&${val['enabled'] ? '开启' : '关闭'}` : '';
              this.formData['IsApiSerialInfo.rs485WorkMode'] = val['rs485WorkMode'] != this.copyForm['IsApiSerialInfo']['rs485WorkMode'] ? `IsApiSerialInfo.rs485WorkMode&外设输出设置/声光报警器/RS485工作模式&${val['rs485WorkMode']}` : '';
              this.formData['IsApiSerialInfo.audibleVisualAlarmType'] = val['audibleVisualAlarmType'] != this.copyForm['IsApiSerialInfo']['audibleVisualAlarmType'] ? `IsApiSerialInfo.audibleVisualAlarmType&外设输出设置/声光报警器/声光报警器&${val['audibleVisualAlarmType']}` : '';
            }else{
              this.formData['IsApiSerialInfo.enabled'] = '';
              this.formData['IsApiSerialInfo.rs485WorkMode'] = '';
              this.formData['IsApiSerialInfo.audibleVisualAlarmType'] = '';
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
      }
    }
  },
  methods:{
    getByIsApi(){
        if(Boolean(this.isTemplate) == true) return
        let params = {
        deviceId: this.$route.query.deviceId || null,
        commandIds: 'IsApiSerialInfo',
        }
        this.$api.getDeviceConfigParamsByIsApi(params).then((res) => {
          //  console.log(res);
          if (res.success == true && !JSON.parse(res.data)['IsApiSerialInfo']['statusCode']) {
            this.form = Object.assign({}, this.form, JSON.parse(res.data));
            this.copyForm = Object.assign({}, this.copyForm, JSON.parse(res.data));
          }else{
            this.$message.error('获取设备配置参数失败:' + res.msg)
          }
        })
    }
  },
}
</script>

<style lang="less" scoped>

</style>