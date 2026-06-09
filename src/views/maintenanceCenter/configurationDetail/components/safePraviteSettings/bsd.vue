<template>
  <div class="p-a-md">
    <el-form
      ref="PraviteBsd"
      label-position="top"
      :model="form"
      label-width="120px"
    >
      <el-tabs v-model="activeName">
          <!-- <el-tab-pane label="BSD全局配置" name="first">
            <el-row type="flex" justify="space-between" style="margin-top: 10px">
                <el-col :span="7" >
                    <el-form-item label="BSD报警使能" description="开启后可统一开启BSD报警使能">
                        <el-select v-model="form['F364'].alarmEnable" placeholder="请选择">
                          <el-option label="关闭" :value="0"></el-option>
                          <el-option label="开启" :value="1"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="7" >
                    <el-form-item label="BSD报警音量开关" prop="F364.speedThreshold" description="开启后可统一设置BSD报警音量">
                      <el-select v-model="form['F364'].alarmEnable" placeholder="请选择">
                          <el-option label="关闭" :value="0"></el-option>
                          <el-option label="开启" :value="1"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="7" >
                        <el-form-item label="BSD报警音量" prop="F364.alarmVolume">
                        <el-slider v-model="form['F364'].alarmVolume" :min="0" :max="8" :step="1"></el-slider>
                        </el-form-item>
                </el-col>
            </el-row>
          </el-tab-pane> -->
          <el-tab-pane :label="item.name" :name="item.name" v-for="item in tablist" :key="item.index">
                <el-row type="flex" justify="space-between">
                    <el-col :span="7" >
                        <el-form-item :label="item.shortName+'报警使能'">
                            <el-select v-model="form[item.commandId].alarmEnabled">
                              <el-option label="关闭" :value="0"></el-option>
                              <el-option label="开启" :value="1"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7" >
                        <el-form-item label="报警判断速度阈值" :rules="{ validator: checkNumber.bind({type:'int'}), trigger: 'blur' }" :prop="item.commandId + '.speedLimit'">
                            <el-input v-model="form[item.commandId].speedLimit"><span slot="suffix">km/h</span></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7" >
                        <el-form-item label="报警抑制时间 (100-600)" :rules="{ validator: checkNumber.bind({type:'int',min:100,max:600}), trigger: 'blur' }" :prop="item.commandId + '.interval'">
                            <el-input v-model="form[item.commandId].interval"><span slot="suffix">ms</span></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row type="flex" justify="space-between">
                    <el-col :span="7" >
                        <el-form-item label="相机位置" :rules="{ validator: checkNumber.bind({type:'int'}), trigger: 'blur' }" :prop="item.commandId + '.timeToCollision'">
                            <el-select v-model="form[item.commandId].timeToCollision">
                              <el-option label="左前" :value="0"></el-option>
                              <el-option label="右前" :value="1"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7" >
                        <el-form-item label="报警提示音量">
                            <el-slider v-model="form[item.commandId].volume" :min="0" :max="10" :step="1"></el-slider>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7" >
                        <el-form-item label="事件上传使能">
                            <el-select v-model="form[item.commandId].eventEnabled">
                              <el-option label="不上传" :value="0"></el-option>
                              <el-option label="上传" :value="1"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row type="flex" justify="space-between">
                    <el-col :span="7" >
                        <el-form-item label="抓图报警类型">
                            <el-select v-model="form[item.commandId].snapShotUpload">
                              <el-option label="关闭" :value="0"></el-option>
                              <el-option label="打开" :value="1"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7" >
                        <el-form-item label="抓图张数" :rules="{ validator: checkNumber.bind({type:'int'}), trigger: 'blur' }" :prop="item.commandId + '.snapShotNum'">
                              <el-input v-model="form[item.commandId].snapShotNum"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7" >
                        <el-form-item label="抓图间隔" :rules="{ validator: checkNumber.bind({type:'int'}), trigger: 'blur' }" :prop="item.commandId + '.snapShotTime'">
                              <el-input v-model="form[item.commandId].snapShotTime"><span slot="suffix">s</span></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row type="flex" justify="space-between">
                    <el-col :span="7" >
                        <el-form-item label="视频报警类型">
                          <el-select v-model="form[item.commandId].clipUpload">
                              <el-option label="关闭" :value="0"></el-option>
                              <el-option label="打开" :value="1"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7" >
                        <el-form-item label="短视频前半部分时长" :rules="{ validator: checkNumber.bind({type:'int'}), trigger: 'blur' }" :prop="item.commandId + '.clipPreDuration'">
                              <el-input v-model="form[item.commandId].clipPreDuration"><span slot="suffix">s</span></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7" >
                        <el-form-item label="短视频后半部分时长" :rules="{ validator: checkNumber.bind({type:'int'}), trigger: 'blur' }" :prop="item.commandId + '.clipPostDuration'">
                              <el-input v-model="form[item.commandId].clipPostDuration"><span slot="suffix">s</span></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row type="flex" justify="space-between">
                    <el-col :span="7" >
                        <el-form-item label="算法置信度（1-100）" :rules="{ validator: checkNumber.bind({type:'int',min:1,max:100}), trigger: 'blur' }" :prop="item.commandId + '.confidence'">
                              <el-input v-model="form[item.commandId].confidence"><span slot="suffix">%</span></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7" >
                        <el-form-item label="算法灵敏度（0-3）" :rules="{ validator: checkNumber.bind({type:'int',min:0,max:3}), trigger: 'blur' }" :prop="item.commandId + '.sensitivity'">
                              <el-input v-model="form[item.commandId].sensitivity"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7" >
                      <el-form-item label="相机安装高度" :rules="{ validator: checkNumber.bind({type:'int',min:1,max:100}), trigger: 'blur' }" :prop="item.commandId + '.confidence'">
                              <el-input v-model="form[item.commandId].confidence"><span slot="suffix">m</span></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row type="flex" justify="space-between">
                    <el-col :span="7" >
                        <el-form-item label="转向角" :rules="{ validator: checkNumber.bind({type:'int',min:1,max:100}), trigger: 'blur' }" :prop="item.commandId + '.confidence'">
                              <el-input v-model="form[item.commandId].confidence"><span slot="suffix">。</span></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7" >
                        <el-form-item label="转向灯关联使能">
                            <el-select v-model="form[item.commandId].eventEnabled">
                              <el-option label="关闭" :value="0"></el-option>
                              <el-option label="开启" :value="1"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7" >
                      <el-form-item label="区域数目" :rules="{ validator: checkNumber.bind({type:'int',min:1,max:100}), trigger: 'blur' }" :prop="item.commandId + '.confidence'">
                              <el-input v-model="form[item.commandId].confidence"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row type="flex" justify="space-between">
                   
                    <el-col :span="7" >
                        <el-form-item label="监测子类型">
                            <el-select v-model="form[item.commandId].eventEnabled">
                              <el-option label="关闭" :value="0"></el-option>
                              <el-option label="开启" :value="1"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7" >
                    </el-col> 
                    <el-col :span="7" >
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
    return {
      form:{},
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
      activeName:'右侧盲区',
      tablist: [
        {
          name: '左侧盲区',
          shortName: '左侧盲区',
          commandId: 'IsApiFcwInfoList',
          alarmLevel: 1
        },
        {
          name: '右侧盲区',
          shortName: '右侧盲区',
          commandId:'IsApiHmwInfoList',
          alarmLevel: 1
        }
      ]
    }
  },
}
</script>

<style scoped>

</style>