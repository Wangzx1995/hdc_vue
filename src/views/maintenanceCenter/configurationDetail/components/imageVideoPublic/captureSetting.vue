<template>
    <div class="p-a-md">
        <h2>基本设置</h2>
        <el-form
            ref="PublicCaptureSetting"
            label-position="top"
            :model="form"
            label-width="120px"
            style="margin-top:10px"
            :rules="rules"
        >
            <el-row type="flex" justify="space-between">
              <!--  <el-col :span="7" >
                    <el-form-item label="报警抓图分辨率">
                        <el-select v-model="form.distinguish" placeholder="请选择"></el-select>
                    </el-form-item>
                </el-col> -->
                <el-col :span="7" >
                    <el-form-item label="定时时间单位">
                        <el-select v-model="form['0064'].unit" placeholder="请选择">
                          <el-option label="秒" :value="0"></el-option>
                          <el-option label="分" :value="1"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="7" >
                    <el-form-item label="定时时间间隔" prop="0064.heartbeat">
                        <el-input v-model="form['0064'].heartbeat"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="7" >
                    <el-form-item label="定距距离单位">
                        <el-select v-model="form['0065'].unit" placeholder="请选择">
                           <el-option label="米" :value="0"></el-option>
                            <el-option label="公里" :value="1"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row type="flex" justify="space-between">
                <el-col :span="7" >
                    <el-form-item label="定距距离间隔" prop="0065.heartbeat">
                        <el-input v-model="form['0065'].heartbeat"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="7" ></el-col>
                <el-col :span="7" ></el-col>
            </el-row>
        <h2>通道设置</h2>
        <el-tabs v-model="activeName">
            <el-tab-pane label="通道1" name="first">
                    <el-row type="flex" justify="space-between" style="margin-top: 10px">
                        <el-col :span="7" >
                            <el-form-item label="通道1定时拍照开关">
                                <el-select v-model="form['0064'].channel1PhotoSwitch" placeholder="请选择">
                                    <el-option label="关闭" :value="0"></el-option>
                                    <el-option label="开启" :value="1"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7" >
                            <el-form-item label="通道1定时拍照存储">
                                <el-select v-model="form['0064'].channel1StoreStatus">
                                  <el-option label="存储" :value="0"></el-option>
                                  <el-option label="上传" :value="1"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7" >
                            <el-form-item label="通道1定距拍照开关">
                                <el-select v-model="form['0065'].channel1PhotoSwitch">
                                  <el-option label="关闭" :value="0"></el-option>
                                    <el-option label="开启" :value="1"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row type="flex" justify="space-between" style="margin-top: 10px">
                        <el-col :span="7" >
                            <el-form-item label="通道1定距拍照存储">
                                <el-select v-model="form['0065'].channel1StoreStatus" placeholder="请选择">
                                  <el-option label="存储" :value="0"></el-option>
                                  <el-option label="上传" :value="1"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
            </el-tab-pane>
            <el-tab-pane label="通道2" name="second">
                    <el-row type="flex" justify="space-between" style="margin-top: 10px">
                        <el-col :span="7" >
                            <el-form-item label="通道2定时拍照开关">
                                <el-select v-model="form['0064'].channel2PhotoSwitch" placeholder="请选择">
                                    <el-option label="关闭" :value="0"></el-option>
                                    <el-option label="开启" :value="1"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7" >
                            <el-form-item label="通道2定时拍照存储">
                                <el-select v-model="form['0064'].channel2StoreStatus">
                                  <el-option label="存储" :value="0"></el-option>
                                  <el-option label="上传" :value="1"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7" >
                            <el-form-item label="通道2定距拍照开关">
                                <el-select v-model="form['0065'].channel2PhotoSwitch">
                                  <el-option label="关闭" :value="0"></el-option>
                                  <el-option label="开启" :value="1"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row type="flex" justify="space-between" style="margin-top: 10px">
                        <el-col :span="7" >
                            <el-form-item label="通道2定距拍照存储">
                                <el-select v-model="form['0065'].channel2StoreStatus" placeholder="请选择">
                                  <el-option label="存储" :value="0"></el-option>
                                  <el-option label="上传" :value="1"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
            </el-tab-pane>
            <el-tab-pane label="通道3" name="third">
                <el-row type="flex" justify="space-between" style="margin-top: 10px">
                        <el-col :span="7" >
                            <el-form-item label="通道3定时拍照开关">
                                <el-select v-model="form['0064'].channel3PhotoSwitch" placeholder="请选择">
                                  <el-option label="关闭" :value="0"></el-option>
                                  <el-option label="开启" :value="1"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7" >
                            <el-form-item label="通道3定时拍照存储">
                                <el-select v-model="form['0064'].channel3StoreStatus">
                                  <el-option label="存储" :value="0"></el-option>
                                  <el-option label="上传" :value="1"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7" >
                            <el-form-item label="通道3定距拍照开关">
                                <el-select v-model="form['0065'].channel3PhotoSwitch">
                                  <el-option label="关闭" :value="0"></el-option>
                                  <el-option label="开启" :value="1"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row type="flex" justify="space-between" style="margin-top: 10px">
                        <el-col :span="7" >
                            <el-form-item label="通道3定距拍照存储">
                                <el-select v-model="form['0065'].channel3StoreStatus" placeholder="请选择">
                                  <el-option label="存储" :value="0"></el-option>
                                  <el-option label="上传" :value="1"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
            </el-tab-pane>
            <el-tab-pane label="通道4" name="fourth">
                 <el-row type="flex" justify="space-between" style="margin-top: 10px">
                        <el-col :span="7" >
                            <el-form-item label="通道4定时拍照开关">
                                <el-select v-model="form['0064'].channel4PhotoSwitch" placeholder="请选择">
                                    <el-option label="关闭" :value="0"></el-option>
                                  <el-option label="开启" :value="1"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7" >
                            <el-form-item label="通道4定时拍照存储">
                                <el-select v-model="form['0064'].channel4StoreStatus">
                                  <el-option label="存储" :value="0"></el-option>
                                  <el-option label="上传" :value="1"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7" >
                            <el-form-item label="通道4定距拍照开关">
                                <el-select v-model="form['0065'].channel4PhotoSwitch">
                                  <el-option label="关闭" :value="0"></el-option>
                                  <el-option label="开启" :value="1"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row type="flex" justify="space-between" style="margin-top: 10px">
                        <el-col :span="7" >
                            <el-form-item label="通道4定距拍照存储">
                                <el-select v-model="form['0065'].channel4StoreStatus" placeholder="请选择">
                                  <el-option label="存储" :value="0"></el-option>
                                  <el-option label="上传" :value="1"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
            </el-tab-pane>
            <el-tab-pane label="通道5" name="fifth">
                <el-row type="flex" justify="space-between" style="margin-top: 10px">
                        <el-col :span="7" >
                            <el-form-item label="通道5定时拍照开关">
                                <el-select v-model="form['0064'].channel5PhotoSwitch" placeholder="请选择">
                                  <el-option label="关闭" :value="0"></el-option>
                                  <el-option label="开启" :value="1"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7" >
                            <el-form-item label="通道5定时拍照存储">
                                <el-select v-model="form['0064'].channel5StoreStatus" placeholder="请选择">
                                  <el-option label="存储" :value="0"></el-option>
                                  <el-option label="上传" :value="1"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7" >
                            <el-form-item label="通道5定距拍照开关">
                                <el-select v-model="form['0065'].channel5PhotoSwitch" placeholder="请选择">
                                  <el-option label="关闭" :value="0"></el-option>
                                  <el-option label="开启" :value="1"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row type="flex" justify="space-between" style="margin-top: 10px">
                        <el-col :span="7" >
                            <el-form-item label="通道5定距拍照存储">
                                <el-select v-model="form['0065'].channel5StoreStatus" placeholder="请选择">
                                  <el-option label="存储" :value="0"></el-option>
                                  <el-option label="上传" :value="1"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
            </el-tab-pane>
        </el-tabs>
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
              callback(new Error("请输入正确的正整数"));
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
      activeName:'first',
      rules: {
        '0064.heartbeat': [ { validator: checkNumber.bind({type:'int',min:0,max:32767}), trigger: 'blur' }],
        '0065.heartbeat': [ { validator: checkNumber.bind({type:'int',min:0,max:32767}), trigger: 'blur' }],
      }
    }
  },
}
</script>

<style scoped>

</style>