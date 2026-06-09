<template>
  <div class="p-a-md">
    <el-form
      ref="PraviteDba"
      label-position="top"
      :model="form"
      label-width="120px"
    >
      <el-tabs v-model="activeName">
          <!-- <el-tab-pane label="DBA全局配置" name="first">
            <el-row type="flex" justify="space-between" style="margin-top: 10px">
                <el-col :span="7" >
                    <el-form-item label="DBA报警使能" description="开启后可统一开启DBA报警使能">
                        <el-select v-model="form['F364'].alarmEnable" placeholder="请选择">
                          <el-option label="关闭" :value="0"></el-option>
                          <el-option label="开启" :value="1"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="7" >
                    <el-form-item label="DBA报警音量开关" prop="F364.speedThreshold" description="开启后可统一设置DBA报警音量">
                      <el-select v-model="form['F364'].alarmEnable" placeholder="请选择">
                          <el-option label="关闭" :value="0"></el-option>
                          <el-option label="开启" :value="1"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="7" >
                        <el-form-item label="DBA报警音量" prop="F364.alarmVolume">
                        <el-slider v-model="form['F364'].alarmVolume" :min="0" :max="8" :step="1"></el-slider>
                        </el-form-item>
                </el-col>
            </el-row>
          </el-tab-pane> -->
          <el-tab-pane :label="item.name" :name="item.name" v-for="item in tablist" :key="item.index">
            <el-row type="flex" justify="space-between" class="m-t-sm">
              <el-form-item>
                <el-radio-group v-model="item.alarmLevel" type="simple">
                  <el-radio-button :label="1">一级报警</el-radio-button>
                  <el-radio-button :label="2">二级报警</el-radio-button>
                </el-radio-group>                
              </el-form-item>
            </el-row>
              <div v-for="(i,iIndex) in form['IsApiDbaInfoList']" :key="iIndex"> 
                <template v-if="i.alarmLevel==item.alarmLevel">
                <el-row type="flex" justify="space-between">
                    <el-col :span="7" >
                        <el-form-item :label="item.shortName+'报警使能'">
                            <el-select v-model="i[item.obj].alarmEnabled">
                              <el-option label="关闭" :value="0"></el-option>
                              <el-option label="开启" :value="1"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7" >
                        <el-form-item label="报警判断速度阈值" :rules="{ validator: checkNumber.bind({type:'int'}), trigger: 'blur' }" :prop="'IsApiDbaInfoList.' + iIndex + '.' + item.obj +'.speedLimit'">
                            <el-input v-model="i[item.obj].speedLimit"><span slot="suffix">km/h</span></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7" >
                        <el-form-item label="报警抑制时间 (100-600)" :rules="{ validator: checkNumber.bind({type:'int',min:100,max:600}), trigger: 'blur' }" :prop="'IsApiDbaInfoList.' + iIndex + '.' + item.obj +'.interval'">
                            <el-input v-model="i[item.obj].interval"><span slot="suffix">ms</span></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row type="flex" justify="space-between">
                    <el-col :span="7" >
                        <el-form-item label="时间阈值" :rules="{ validator: checkNumber.bind({type:'int'}), trigger: 'blur' }" :prop="'IsApiDbaInfoList.' + iIndex + '.' + item.obj +'.timeToCollision'">
                            <el-input v-model="i[item.obj].timeToCollision"><span slot="suffix">s</span></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7" >
                        <el-form-item label="报警提示音量">
                            <el-slider v-model="i[item.obj].volume" :min="0" :max="10" :step="1"></el-slider>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7" >
                        <el-form-item label="事件上传使能">
                            <el-select v-model="i[item.obj].eventEnabled">
                              <el-option label="不上传" :value="0"></el-option>
                              <el-option label="上传" :value="1"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row type="flex" justify="space-between">
                    <el-col :span="7" >
                        <el-form-item label="抓图报警类型">
                            <el-select v-model="i[item.obj].snapShotUpload">
                              <el-option label="关闭" :value="0"></el-option>
                              <el-option label="打开" :value="1"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7" >
                        <el-form-item label="抓图张数" :rules="{ validator: checkNumber.bind({type:'int'}), trigger: 'blur' }" :prop="'IsApiDbaInfoList.' + iIndex + '.' + item.obj +'.snapShotNum'">
                              <el-input v-model="i[item.obj].snapShotNum"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7" >
                        <el-form-item label="抓图间隔" :rules="{ validator: checkNumber.bind({type:'int'}), trigger: 'blur' }" :prop="'IsApiDbaInfoList.' + iIndex + '.' + item.obj +'.snapShotTime'">
                              <el-input v-model="i[item.obj].snapShotTime"><span slot="suffix">s</span></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row type="flex" justify="space-between">
                    <el-col :span="7" >
                        <el-form-item label="视频报警类型">
                          <el-select v-model="i[item.obj].clipUpload">
                              <el-option label="关闭" :value="0"></el-option>
                              <el-option label="打开" :value="1"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7" >
                        <el-form-item label="短视频前半部分时长" :rules="{ validator: checkNumber.bind({type:'int'}), trigger: 'blur' }" :prop="'IsApiDbaInfoList.' + iIndex + '.' + item.obj +'.clipPreDuration'">
                              <el-input v-model="i[item.obj].clipPreDuration"><span slot="suffix">s</span></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7" >
                        <el-form-item label="短视频后半部分时长" :rules="{ validator: checkNumber.bind({type:'int'}), trigger: 'blur' }" :prop="'IsApiDbaInfoList.' + iIndex + '.' + item.obj +'.clipPostDuration'">
                              <el-input v-model="i[item.obj].clipPostDuration"><span slot="suffix">s</span></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                </template>
              </div>
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
    },
    componentName:{
      type:String,
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
    componentName:{
      handler(newVal,oldVal){
        if(newVal == 'PraviteDba')
        this.commandIds = 'IsApiDbaInfoList';
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
      activeName:'疲劳驾驶',
      commandIds:'',
      tablist: [
        {
          name: '疲劳驾驶',
          shortName: '疲劳驾驶',
          obj: 'fddDetect',
          alarmLevel: 1
        },
        {
          name: '打电话',
          shortName: '打电话',
          obj:'updDetect',
          alarmLevel: 1
        },
        {
          name: '抽烟',
          shortName: '抽烟',
          obj:'smdDetect',
          alarmLevel: 1
        },
        {
          name: '分神驾驶',
          shortName: '分神驾驶',
          obj:'nlfDetect',
          alarmLevel: 1
        },
        {
          name: '驾驶员离岗',
          shortName: '驾驶员离岗',
          obj:'',
          alarmLevel: 1
        },
        {
          name: '摄像头遮挡',
          shortName: '摄像头遮挡',
          obj:'hcdDetect',
          alarmLevel: 1
        },
        {
          name: '未系安全带',
          shortName: '未系安全带',
          obj:'beltDetect',
          alarmLevel: 1
        },
        {
          name: '急加速',
          shortName: '急加速',
          obj:'',
          alarmLevel: 1
        },
        {
          name: '急减速',
          shortName: '急减速',
          obj:'',
          alarmLevel: 1
        },
        {
          name: '急转弯',
          shortName: '急转弯',
          obj:'',
          alarmLevel: 1
        },
        {
          name: '驾驶员异常',
          shortName: '驾驶员异常',
          obj:'',
          alarmLevel: 1
        },
        {
          name: '超时驾驶',
          shortName: '超时驾驶',
          obj:'',
          alarmLevel: 1
        },
        {
          name: '换人提醒',
          shortName: '换人提醒',
          obj:'',
          alarmLevel: 1
        },
        {
          name: '墨镜',
          shortName: '墨镜',
          obj:'',
          alarmLevel: 1
        }
      ]
    }
  },
  methods:{
    getByIsApi(){
      let params = {
          deviceId: this.$route.query.deviceId || null,
          commandIds: this.commandIds
      };
      this.$api.getDeviceConfigParamsByIsApi(params).then(res =>{
        // console.log(res)
      })
    },
  },
  created(){
    this.getByIsApi();
  },
  mounted(){
    // console.log(this.form)
  }
}
</script>

<style scoped>

</style>