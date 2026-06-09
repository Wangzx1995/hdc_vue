<template>
    <div class="p-a-md">
        <h2>基本设置</h2>
        <el-form
            ref="PublicAuthenticateIC"
            label-position="top"
            :model="form"
            label-width="120px"
            style="margin-top: 10px"
            :rules="rules"
        >
            <el-row type="flex" justify="space-between">
                <el-col :span="7" >
                    <el-form-item label="道路运输卡IC卡认证主服务器IP地址">
                        <el-input v-model="form['001A'].icCardAuthServerIp"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="7" >
                    <el-form-item label="道路运输卡IC卡认证主服务器TCP端口" prop="001B.icCardAuthServerTcpPort">
                        <el-input v-model="form['001B'].icCardAuthServerTcpPort"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="7" >
                    <el-form-item label="道路运输卡IC卡认证主服务器UDP端口" prop="001C.icCardAuthServerUdpPort">
                        <el-input v-model="form['001C'].icCardAuthServerUdpPort"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row type="flex" justify="space-between">
                <el-col :span="7" >
                    <el-form-item label="道路运输卡IC卡认证备份服务器IP地址">
                        <el-input v-model="form['001D'].icCardAuthBackupServerIp"></el-input>
                    </el-form-item>
                </el-col>
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
        '001B.icCardAuthServerTcpPort': [ { validator: checkNumber.bind({type:'int',min:0,max:65535}), trigger: 'blur' }],
        '001C.icCardAuthServerUdpPort': [ { validator: checkNumber.bind({type:'int',min:0,max:65535}), trigger: 'blur' }],
      }
    }
  },
}
</script>

<style scoped>

</style>