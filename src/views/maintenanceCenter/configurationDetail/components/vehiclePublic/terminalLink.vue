<template>
  <div class="p-a-md">
    <h2>基本信息</h2>
    <el-form ref="PublicVehicleTerminalLink" label-position="top" :model="form" :rules="rules" style="margin-top: 10px">
      <el-row type="flex" justify="space-between">
        <el-col :span="7">
          <el-form-item label="终端心跳发送间隔" prop="0001.heartbeat">
            <el-input v-model="form['0001'].heartbeat">
                <span slot="suffix">s</span>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="TCP消息应答超时时间" prop="0002.overtime">
            <el-input v-model="form['0002'].overtime">
                <span slot="suffix">s</span>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="TCP消息重复次数"  prop="0003.times">
            <el-input v-model="form['0003'].times"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="space-between" >
        <el-col :span="7">
          <el-form-item label="UDP消息应答超时时间" prop="0004.overtime">
            <el-input v-model="form['0004'].overtime">
                <span slot="suffix">s</span>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="UDP消息重传次数"  prop="0005.times">
            <el-input v-model="form['0005'].times"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="SMS消息应答超时时间"  prop="0006.overtime">
            <el-input v-model="form['0006'].overtime">
                <span slot="suffix">s</span>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="space-between">
        <el-col :span="7">
          <el-form-item label="SMS消息重传次数"  prop="0007.times">
            <el-input v-model="form['0007'].times">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import {validateNum} from '@/utils/validate';
export default {
  name: 'terminalLink',
  props:{
    detail:{
      type: Object,
      default:()=>{
        return {}
      }
    },
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
          '0001.heartbeat': [ { validator: checkNumber.bind({type:'int',min:1,max:50000}), trigger: 'blur' }],
          '0002.overtime': [ { validator: checkNumber.bind({type:'int',min:1,max:50000}), trigger: 'blur' }],
          '0003.times': [ { validator: checkNumber.bind({type:'int',min:0,max:50000}), trigger: 'blur' }],
          '0004.overtime': [ { validator: checkNumber.bind({type:'int',min:1,max:50000}), trigger: 'blur' }],
          '0005.times': [ { validator: checkNumber.bind({type:'int',min:0,max:50000}), trigger: 'blur' }],
          '0006.overtime': [ { validator: checkNumber.bind({type:'int',min:1,max:50000}), trigger: 'blur' }],
          '0007.times': [ { validator: checkNumber.bind({type:'int',min:0,max:50000}), trigger: 'blur' }],
        }
    }
  },
}
</script>

<style lang="less" scoped>

</style>