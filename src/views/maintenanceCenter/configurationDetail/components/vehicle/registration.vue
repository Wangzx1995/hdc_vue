<template>
  <div class="p-a-md">
    <h2>基本参数</h2>
    <el-form ref="VehicleRegistration" label-position="top" :model="form" label-width="120px" :rules="rules" style="margin-top: 10px">
      <div class="configurations">
        <div v-if="form['0081']" class="configuration-item">
          <el-form-item label="车辆所在省域ID" prop="0081.provinceId">
			      <el-input v-model="form['0081'].provinceId"></el-input>
          </el-form-item>
        </div>
        <div v-if="form['0082'] " class="configuration-item">
          <el-form-item label="车辆所在市域ID" prop="0082.cityId">
			      <el-input v-model="form['0082'].cityId"></el-input>
          </el-form-item>
        </div>
        <div v-if="form['0083']" class="configuration-item">
          <el-form-item label="机动车号牌" prop="0083.plateNum">
            <el-input v-model="form['0083'].plateNum"></el-input>
          </el-form-item>
        </div>
        <div v-if="form['0084']" class="configuration-item">
          <el-form-item label="车牌颜色" prop="0084.color">
            <el-select v-model="form['0084'].color">
              <el-option label="未上牌" :value="0"></el-option>
              <el-option label="蓝" :value="1"></el-option>
              <el-option label="黄" :value="2"></el-option>
              <el-option label="黑" :value="3"></el-option>
              <el-option label="白" :value="4"></el-option>
              <el-option label="其他" :value="9"></el-option>
            </el-select>
          </el-form-item>
        </div>
      </div>
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
    const checkNumbers = function(rule, value, callback){
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
            callback(new Error("不能为空"));
            // callback();
        }
      }
    return {
      form:{},
      rules: {
        '0081.provinceId': [ { validator: checkNumber.bind({type:'int',min:1,max:32767}), trigger: 'blur' }],
        '0082.cityId': [ { validator: checkNumber.bind({type:'int',min:1,max:32767}), trigger: 'blur' }],
        // '0083.plateNum':[{ required: true, message: '请输入', trigger: 'blur' }],
        // '0084.color':[{ required: true, type:'number', message: '请选择', trigger: 'change' }]
      }
    }
  },
}
</script>

<style lang="less" scoped>
  // .configurations{
  //   display: flex;
  //   flex-flow: wrap;
  //   justify-self: start;
  //   justify-content: space-between;
  //   width: 100%;
  //   .configuration-item{
  //     width: 32%;
  //   }
  // }
</style>