<template>
   <div class="p-a-md">
    <h2 id="title" v-if="form['IsApiZtEcuProtocol']">基本信息</h2>
    <el-form
      ref="PublicEcu"
      label-position="top"
      :model="form"
      label-width="120px"
      v-if="form['IsApiZtEcuProtocol']" 
    >
      <el-row type="flex" justify="space-between">
          <el-col :span="7">
            <el-form-item label="ECU方案" class="m-r-md p-r">
                <el-select v-model="form['IsApiZtEcuProtocol'].ecuType">
                  <el-option
                    v-for="item in form['IsApiZtEcuProtocolCapability']['ecuType']"
                    :key="item"
                    :value="item"
                    :label="item ? '方案'+item : '无控车'"
                  ></el-option>
                </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="ECU车型值" :rules="{ validator: checkNumber.bind({type:'int',min:form['IsApiZtEcuProtocolCapability'].ecuValueMin,max:form['IsApiZtEcuProtocolCapability'].ecuValueMax}), trigger: 'blur' }" prop="IsApiZtEcuProtocol.ecuValue">
              <el-input tips-placement="top-end" :tips="`键入值范围为${form['IsApiZtEcuProtocolCapability'].ecuValueMin}~${form['IsApiZtEcuProtocolCapability'].ecuValueMax}`" v-model="form['IsApiZtEcuProtocol'].ecuValue"></el-input>
            </el-form-item>
            </el-col>
          <el-col :span="7"></el-col>
          </el-row>
    </el-form>
  </div>
</template>
<script>
import { validateNum } from '@/utils/validate'
import { valid } from 'semver'

export default {
  name:'ecu',
  props: {
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
          this.getDeviceConfigParamsByIsApi();
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
    form: {
      handler(val) {
        if (JSON.stringify(val) !== '{}') {
          this.$emit('change', val)
        }
      },
      deep: true,
      immediate: true
    },
    'form.IsApiZtEcuProtocol':{
      handler(val){
        if(val != undefined){
          this.$nextTick(() =>{
            this.$refs['PublicEcu'].validate((valid) =>{
              if(valid){
                this.formData['IsApiZtEcuProtocol.ecuType'] = val['ecuType'] != this.copyForm['IsApiZtEcuProtocol']['ecuType'] ? `IsApiZtEcuProtocol.ecuType&渣土车配置/发动机控车/ECU方案&${val['ecuType'] ? '方案'+val['ecuType'] : '无控车'}` : ''
                this.formData['IsApiZtEcuProtocol.ecuValue'] = val['ecuValue'] != this.copyForm['IsApiZtEcuProtocol']['ecuValue'] ? `IsApiZtEcuProtocol.ecuValue&渣土车配置/发动机控车/ECU车型值&${val['ecuValue']}` : ''
              }else{
                this.formData['IsApiZtEcuProtocol.ecuType'] = '';
                this.formData['IsApiZtEcuProtocol.ecuValue'] = '';
              }
              this.$emit('changeData',this.formData)
            })
          })
        }
      },
      deep: true,
      immediate: false
    }
  },
  data(){
    return{
      form:{},
      copyForm:{},
      formData:{},
      ecuTypes:[],
      ecuTypeJson:{},
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
    }
  },
  created(){
    // this.form = Object.assign({}, this.form, this.forms)
  },
  methods:{
    getDeviceConfigParamsByIsApi(){
      const params = {
        deviceId: this.$route.query.deviceId || null,
        commandIds: ['IsApiZtEcuProtocol']
      }
      if(this.form['IsApiZtEcuProtocol']){
        this.makeDictionary(this.form['IsApiZtEcuProtocolCapability']['ecuType'])
        return
      }
      this.$api.getDeviceConfigParamsByIsApi(params).then(res =>{
        if(res.success && !JSON.parse(res.data)['IsApiZtEcuProtocol']['statusCode']){
          let resData = JSON.parse(res.data)
          this.makeDictionary(resData['IsApiZtEcuProtocolCapability']['ecuType']);
          this.form = Object.assign({}, this.form, JSON.parse(res.data));
          this.copyForm = Object.assign({}, this.copyForm, JSON.parse(res.data));
        }else{
            this.$message.error('获取设备配置参数失败:' + (res.msg
                                        ? res.msg
                                        : this.getErrMsg(
                                            JSON.parse(res.data)['IsApiZtEcuProtocol']['statusCode']
                                          )))
        }
      })
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
    makeDictionary(ecuTypes){
      if(ecuTypes.length){
        this.ecuTypes = [];
        this.ecuTypeJson = {};
        ecuTypes.forEach(item =>{
          this.ecuTypes.push(
            {
              id:item,
              label:item ? '无控车' : '方案'+item
            }
          )
        })
      }
    }
  }

}
</script>
<style lang='less' scoped>
  #title{
    margin-bottom: 5px;
  }
</style>