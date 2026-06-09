<template>
    <div class="p-a-md">
        <h2>基本设置</h2>
        <el-form
            ref="PublicCallBarring"
            label-position="top"
            :model="form"
            label-width="120px"
            style="margin-top: 10px"
            :rules="rules"
        >
            <el-row type="flex" justify="space-between">
                <el-col :span="7" >
                    <el-form-item label="终端电话接听策略">
                        <el-select v-model="form['0045'].callAcallStrategyStrategy">
                          <el-option label="自动接听" :value="0"></el-option>
                          <el-option label="ACC ON时自动接听，OFF时手动接听" :value="1"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="7" >
                    <el-form-item label="每次最长通话时间（输入0为不允许通话）" prop="0046.maximumCallTimePerSession">
                        <el-input v-model="form['0046'].maximumCallTimePerSession" suffix-icon="el-icon-time"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="7" >
                    <el-form-item label="每月最长通话时间（输入0为不允许通话）" prop="0047.maximumTalkTimeOfTheMonth">
                        <el-input v-model="form['0047'].maximumTalkTimeOfTheMonth"><span slot="suffix">s</span></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row type="flex" justify="space-between">
                <el-col :span="7">
                    <el-form-item label="监听电话号码" >
                        <el-input v-model="form['0048'].monitorPhoneNum"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="7" >
                    <el-form-item label="监管平台特权短信号码">
                        <el-input v-model="form['0049'].regularyPlatformSMS" ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="7"></el-col>
            </el-row>
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
    return {
      form:{},
      rules: {
        '0046.maximumCallTimePerSession': [ { validator: checkNumber.bind({type:'int',min:0,max:1000000}), trigger: 'blur' }],
        '0047.maximumTalkTimeOfTheMonth': [ { validator: checkNumber.bind({type:'int',min:0,max:10000000}), trigger: 'blur' }],
      }
    }
  },
}
</script>


<style scoped>

</style>