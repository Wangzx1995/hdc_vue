<template>
  <div class="p-a-md">
    <h2>基本参数</h2>
    <el-form ref="PrivateOvertimeDrivingForm" label-position="top" :model="form" label-width="120px" style="margin-top: 10px">
      <template v-if="form['param924']">
        <div class="configurations">
          <div v-if="deviceCapability['intelliDrive_warn']['overtimeDriving'] && deviceCapability['intelliDrive_warn']['overtimeDriving']['dayLightStartTime']" class="configuration-item">
            <el-form-item introduction="键入值的单位是分钟，自动转化为时间" introduction-placement='top' label="日间开始时间" prop="param924.daylightStartTime" :rules="{ validator: checkNumber.bind({type:'int',min:deviceCapability['intelliDrive_warn']['overtimeDriving']['dayLightStartTime'][0],max:deviceCapability['intelliDrive_warn']['overtimeDriving']['dayLightStartTime'][1]}), trigger: 'blur' }">
              <el-input tips-placement="top-end" :tips="`键入值范围为${deviceCapability['intelliDrive_warn']['overtimeDriving']['dayLightStartTime'][0]}~${deviceCapability['intelliDrive_warn']['overtimeDriving']['dayLightStartTime'][1]}`" v-model.number="form['param924']['daylightStartTime']"><span slot="suffix">{{dayLightStartTime}}</span></el-input>
            </el-form-item>
          </div>
          <div v-if="deviceCapability['intelliDrive_warn']['overtimeDriving'] && deviceCapability['intelliDrive_warn']['overtimeDriving']['dayLightEndTime']" class="configuration-item">
            <el-form-item introduction="键入值的单位是分钟，自动转化为时间" introduction-placement='top' label="日间结束时间" prop="param924.daylightEndTime" :rules="{ validator: checkNumber.bind({type:'int',min:deviceCapability['intelliDrive_warn']['overtimeDriving']['dayLightEndTime'][0],max:deviceCapability['intelliDrive_warn']['overtimeDriving']['dayLightEndTime'][1]}), trigger: 'blur' }">
              <el-input tips-placement="top-end" :tips="`键入值范围为${deviceCapability['intelliDrive_warn']['overtimeDriving']['dayLightEndTime'][0]}~${deviceCapability['intelliDrive_warn']['overtimeDriving']['dayLightEndTime'][1]}`" v-model.number="form['param924']['daylightEndTime']"><span slot="suffix">{{dayLightEndTime}}</span></el-input>
            </el-form-item>
          </div>
          <div v-if="deviceCapability['intelliDrive_warn']['overtimeDriving'] && deviceCapability['intelliDrive_warn']['overtimeDriving']['nightDrivingTimeMax']" class="configuration-item">
            <el-form-item label="夜间连续驾驶时长" prop="param924.nightDrivingTimeMax" :rules="{ validator: checkNumber.bind({type:'int',min:deviceCapability['intelliDrive_warn']['overtimeDriving']['nightDrivingTimeMax'][0],max:deviceCapability['intelliDrive_warn']['overtimeDriving']['nightDrivingTimeMax'][1]}), trigger: 'blur' }">
              <el-input tips-placement="top-end" :tips="`键入值范围为${deviceCapability['intelliDrive_warn']['overtimeDriving']['nightDrivingTimeMax'][0]}~${deviceCapability['intelliDrive_warn']['overtimeDriving']['nightDrivingTimeMax'][1]}`" v-model.number="form['param924']['nightDrivingTimeMax']"><span slot="suffix">S</span></el-input>
            </el-form-item>
          </div>
          <div v-if="deviceCapability['intelliDrive_warn']['overtimeDriving'] && deviceCapability['intelliDrive_warn']['overtimeDriving']['daylightDrivingTimeMax']" class="configuration-item">
            <el-form-item label="日间连续驾驶时长" prop="param924.daylightDrivingTimeMax" :rules="{ validator: checkNumber.bind({type:'int',min:deviceCapability['intelliDrive_warn']['overtimeDriving']['daylightDrivingTimeMax'][0],max:deviceCapability['intelliDrive_warn']['overtimeDriving']['daylightDrivingTimeMax'][1]}), trigger: 'blur' }">
              <el-input tips-placement="top-end" :tips="`键入值范围为${deviceCapability['intelliDrive_warn']['overtimeDriving']['daylightDrivingTimeMax'][0]}~${deviceCapability['intelliDrive_warn']['overtimeDriving']['daylightDrivingTimeMax'][1]}`" v-model.number="form['param924']['daylightDrivingTimeMax']"><span slot="suffix">S</span></el-input>
            </el-form-item>
          </div>
          <div v-if="deviceCapability['intelliDrive_warn']['overtimeDriving'] && deviceCapability['intelliDrive_warn']['overtimeDriving']['restTimeMin']" class="configuration-item">
            <el-form-item label="连续休息时长" prop="param924.restTimeMin" :rules="{ validator: checkNumber.bind({type:'int',min:deviceCapability['intelliDrive_warn']['overtimeDriving']['restTimeMin'][0],max:deviceCapability['intelliDrive_warn']['overtimeDriving']['restTimeMin'][1]}), trigger: 'blur' }">
              <el-input tips-placement="top-end" :tips="`键入值范围为${deviceCapability['intelliDrive_warn']['overtimeDriving']['restTimeMin'][0]}~${deviceCapability['intelliDrive_warn']['overtimeDriving']['restTimeMin'][1]}`" v-model.number="form['param924']['restTimeMin']"><span slot="suffix">S</span></el-input>
            </el-form-item>
          </div>
        </div>
      </template>
    </el-form>
  </div>
</template>

<script>
import {validateNum} from '@/utils/validate';
export default {
  props:{
    allCapability:{
      type: Object,
      default:()=>{
        return {}
      }
    },
    formDetail:{
      type:Object,
      default:() =>{
        return {}
      }
    },
    originalForm:{
      type:Object,
      default:() =>{
        return {}
      }
    },
    setStatisticsData:{
      type:Object,
      default:() =>{
        return {}
      }
    },
    allEnumerationData:{
      type:Object,
      default:() =>{
        return {}
      }
    },
    setConfigParams:{
      type:Boolean,
      default:false
    },
    isTemplate:{
      type:String
    }
  },
  watch:{
    allCapability:{
     handler(val){
        if(val){
          console.log(val)
          this.deviceCapability = val
        }
      },
      deep: true,
      immediate: true
    },
    formDetail:{
     handler(val){
       if(val){
         this.form = val
        }
      },
      deep: true,
      immediate: true
    },
    originalForm:{
        handler(val){
        if(val){
          this.copyForm = val
        }
      },
      deep: true,
      immediate: true
    },
    form:{
      handler (val) {
        if (val){
          this.$emit('change',val)
        }
      },
      deep: true,
      immediate:true,
    },
    copyForm:{
      handler(val) {
        if (val){
          this.$emit('changeCopy',val)
        }
      },
      deep: true,
      immediate:false,
    },
    setStatisticsData:{
      handler(val){
        if(val){
          this.formData = val
        }
      },
      deep: true,
      immediate: true
    },
    allEnumerationData:{
      handler(val){
        if(val){
          this.dictionaryData = val
        }
      },
      deep: true,
      immediate: true
    },
    setConfigParams:{
      handler(val){
        if(val){
          this.childConfigParams = val;
          this.getPrivateProcotol()
        }
      },
      deep: true,
      immediate: true
    },
    childConfigParams:{
      handler(val){
        this.$emit('changeConfigParams',val)
      },
      deep: true,
      immediate: true
    },
    'form.param924':{
      handler(val){
        if(val && !Boolean(this.isTemplate)){
          this.formData['param924.daylightStartTime'] = val['daylightStartTime'] !== this.copyForm['param924']['daylightStartTime'] ? `param924.daylightStartTime&报警设置/疲劳驾驶/日间开始时间&${val['daylightStartTime']}&${this.copyForm['param924']['daylightStartTime']}` : '';
          this.formData['param924.daylightEndTime'] = val['daylightEndTime'] !== this.copyForm['param924']['daylightEndTime'] ? `param924.daylightEndTime&报警设置/疲劳驾驶/日间结束时间&${val['daylightEndTime']}&${this.copyForm['param924']['daylightEndTime']}` : '';
          this.formData['param924.nightDrivingTimeMax'] = val['nightDrivingTimeMax'] !== this.copyForm['param924']['nightDrivingTimeMax'] ? `param924.nightDrivingTimeMax&报警设置/疲劳驾驶/夜间连续驾驶时长&${val['nightDrivingTimeMax']}秒&${this.copyForm['param924']['nightDrivingTimeMax']}秒` : '';
          this.formData['param924.daylightDrivingTimeMax'] = val['daylightDrivingTimeMax'] !== this.copyForm['param924']['daylightDrivingTimeMax'] ? `param924.nightDrivingTimeMax&报警设置/疲劳驾驶/日间连续驾驶时长&${val['daylightDrivingTimeMax']}秒&${this.copyForm['param924']['daylightDrivingTimeMax']}秒` : '';
          this.formData['param924.restTimeMin'] = val['restTimeMin'] !== this.copyForm['param924']['restTimeMin'] ? `param924.nightDrivingTimeMax&报警设置/疲劳驾驶/日间连续驾驶时长&${val['restTimeMin']}秒&${this.copyForm['param924']['restTimeMin']}秒` : '';
          this.$emit('formDataChange',this.formData)
        }
        if(val){
          if(Math.floor(val['daylightStartTime']/60) > 9){
            if(val['daylightStartTime']%60){
              this.dayLightStartTime = val['daylightStartTime']%60>9 ? Math.floor(val['daylightStartTime']/60)+':'+val['daylightStartTime']%60 : Math.floor(val['daylightStartTime']/60)+':0'+val['daylightStartTime']%60;
            }else{
              this.dayLightStartTime = Math.floor(val['daylightStartTime']/60)+':'+'00';
            }
          }else if(Math.floor(val['daylightStartTime']/60) == 0){
            if(val['daylightStartTime']%60){
              this.dayLightStartTime = val['daylightStartTime']%60>9 ? '00:'+val['daylightStartTime']%60 : '00:0'+val['daylightStartTime']%60;
            }else{
              this.dayLightStartTime = '00:00';
            }
          }else{
            if(val['daylightStartTime']%60){
              this.dayLightStartTime = val['daylightStartTime']%60>9 ? '0'+Math.floor(val['daylightStartTime']/60)+':'+val['daylightStartTime']%60 : '0'+Math.floor(val['daylightStartTime']/60)+':0'+val['daylightStartTime']%60;
            }else{
              this.dayLightStartTime = '0'+Math.floor(val['daylightStartTime']/60)+':'+'00';
            }
          }
          if(Math.floor(val['daylightEndTime']/60) > 9){
            if(val['daylightEndTime']%60){
              this.dayLightEndTime = val['daylightEndTime']%60>9 ? Math.floor(val['daylightEndTime']/60)+':'+val['daylightEndTime']%60 : Math.floor(val['daylightEndTime']/60)+':0'+val['daylightEndTime']%60;
            }else{
              this.dayLightEndTime = Math.floor(val['daylightEndTime']/60)+':'+'00';
            }
          }else if(Math.floor(val['daylightEndTime']/60) == 0){
            if(val['daylightEndTime']%60){
              this.dayLightEndTime = val['daylightEndTime']%60>9 ? '00:'+val['daylightEndTime']%60 : '00:0'+val['daylightEndTime']%60;
            }else{
              this.dayLightEndTime = '00:00';
            }
          }else{
            if(val['daylightEndTime']%60){
              this.dayLightEndTime = val['daylightEndTime']%60>9 ? '0'+Math.floor(val['daylightEndTime']/60)+':'+val['daylightEndTime']%60 : '0'+Math.floor(val['daylightEndTime']/60)+':0'+val['daylightEndTime']%60;
            }else{
              this.dayLightEndTime = '0'+Math.floor(val['daylightEndTime']/60)+':'+'00';
            }
          }
        }
      },
      deep:true,
      immediate:true
    }
  },
  data() {
    return {
      deviceId:this.$route.query.deviceId || '',
      deviceCapability:{},
      dayLightStartTime:0,
      dayLightEndTime:0,
      form:{},
      copyForm:{},
      formData:{},      
      dictionaryData:{},
      childConfigParams:false,
      checkNumber: function (rule, value, callback) {
        if (value !== '' && value !== null && value !== undefined) {
          if (!validateNum(value)) {
            callback(new Error("请输入正确的整数"));
          } else if (value < this.min) {
            callback(new Error(`最小值为${this.min}`));
          } else if (value > this.max) {
            callback(new Error(`最大值为${this.max}`));
          }else {
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
    // this.getByIsApi(1)
    //console.log(this.isTemplate)
    this.$emit('setMenuActiveRefFormName','PrivateOvertimeDrivingForm');
  },
  methods:{
    getPrivateProcotol(){
      let param = {
        deviceId:this.deviceId,
        param:'',
        msgId:924
      };
      if(!this.form['param924']){
        if(Boolean(this.isTemplate)) return
        this.$api.getEHomeConfig(param).then(res =>{
          if(res && res.data && res.data.param){
            let formData = JSON.parse(res.data.param);
            this.$set(this.form,'param924',formData);
            this.$set(this.copyForm,'param924',JSON.parse(JSON.stringify(formData)));
            this.childConfigParams = false;
          }else{
            this.$message.error('协议获取失败');
            this.childConfigParams = false;
          }
        })
      }else{
        this.childConfigParams = false;
      };
    }
  }
 
}
</script>

<style lang="less" scoped>
  .configuration-detail-submit{
    width: 100%;
    border-right: 1px solid #f0f0f0;
    border-bottom: 1px solid #f0f0f0;
    border-left: 1px solid #f0f0f0;
    display: flex;
    position: fixed;
    bottom: 0;
    z-index: 500;
    right: 1%;
    background: white;
  }
  .maginBottom{
    margin-bottom: 10px;
  }
</style>