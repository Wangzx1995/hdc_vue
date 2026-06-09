<template>
  <div class="p-a-md">
    <h2>基本参数</h2>
    <el-form ref="PrivateRegisterForm" label-position="top" :model="form" label-width="120px" style="margin-top: 10px">
      <template v-if="form['param306']">
        <div class="configurations">
          <div v-if="deviceCapability['network']['internet'][0]['enable'].length" class="configuration-item">
            <el-form-item label="第一中心使能" prop="param306.enable">
              <el-switch v-model="form['param306'].enable" :active-value="Number(1)" :inactive-value="Number(0)"></el-switch>
            </el-form-item>
          </div>
          <div v-if="deviceCapability['network']['internet'][0]['apn']" class="configuration-item">
            <el-form-item label="接入点名称" prop="param306.apn">
              <el-input v-model="form['param306'].apn"></el-input>
            </el-form-item>
          </div>
          <div v-if="deviceCapability['network']['internet'][0]['telephone']" class="configuration-item">
            <el-form-item label="拨号号码" prop="param306.telephone">
              <el-input v-model="form['param306'].telephone"></el-input>
            </el-form-item>
          </div>
          <div v-if="deviceCapability['network']['internet'][0]['username']" class="configuration-item">
            <el-form-item label="用户名" prop="param306.username">
              <el-input v-model="form['param306'].username"></el-input>
            </el-form-item>
          </div>
          <div v-if="deviceCapability['network']['internet'][0]['password']" class="configuration-item">
            <el-form-item label="密码" prop="param306.password">
              <el-input v-model="form['param306'].password"></el-input>
            </el-form-item>
          </div>
          <div v-if="deviceCapability['network']['internet'][0]['mtu']" class="configuration-item">
            <el-form-item label="最大传输单元" prop="param306.mtu" :rules="{ validator: checkNumber.bind({type:'int',min:deviceCapability['network']['internet'][0]['mtu']['min'],max:deviceCapability['network']['internet'][0]['mtu']['max']}), trigger: 'blur' }">
              <el-input v-model="form['param306'].mtu" tips-placement="top-end" :tips="`键入值范围为${deviceCapability['network']['internet'][0]['mtu']['min']}~${deviceCapability['network']['internet'][0]['mtu']['max']}`"></el-input>
            </el-form-item>
          </div>
          <div v-if="deviceCapability['network']['internet'][0]['verify'].length" class="configuration-item">
            <el-form-item label="验证方式" prop="param306.verify">
              <el-select v-model="form['param306'].verify">
                <el-option
                  v-for="item in dictionaryData['verifyInternetList']"
                  :key="item.id"
                  :value="item.id"
                  :label="item.label"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div v-if="deviceCapability['network']['internet'][0]['band'].length" class="configuration-item">
            <el-form-item label="频段" prop="param306.band">
              <el-select v-model="form['param306'].band">
                <el-option
                  v-for="item in dictionaryData['bandInternetList']"
                  :key="item.id"
                  :value="item.id"
                  :label="item.label"
                ></el-option>
              </el-select>
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
    'form.param306':{
      handler(val){
        if(val && !Boolean(this.isTemplate)){
          this.formData['param306.enable'] = val['enable'] !== this.copyForm['param306']['enable'] ? `param306.enable&车辆设备/注册参数/第一中心使能&${val['enable'] ? '开启' : '关闭'}&${this.copyForm['param306']['enable']? '开启' : '关闭'}` : '';
          this.formData['param306.apn'] = val['apn'] !== this.copyForm['param306']['apn'] ? `param306.apn&车辆设备/注册参数/接入点名称&${val['apn']}&${this.copyForm['param306']['apn']}` : '';
          this.formData['param306.telephone'] = val['telephone'] !== this.copyForm['param306']['telephone'] ? `param306.telephone&车辆设备/注册参数/拨号号码&${val['telephone']}&${this.copyForm['param306']['telephone']}` : '';
          this.formData['param306.username'] = val['username'] !== this.copyForm['param306']['username'] ? `param306.username&车辆设备/注册参数/用户名&${val['username']}&${this.copyForm['param306']['username']}` : '';
          this.formData['param306.password'] = val['password'] !== this.copyForm['param306']['password'] ? `param306.password&车辆设备/注册参数/密码&${val['password']}&${this.copyForm['param306']['password']}` : '';
          this.formData['param306.mtu'] = val['mtu'] !== this.copyForm['param306']['mtu'] ? `param306.mtu&车辆设备/注册参数/最大传输单元&${val['mtu']}&${this.copyForm['param306']['mtu']}` : '';
          this.formData['param306.verify'] = val['verify'] !== this.copyForm['param306']['verify'] ? `param306.verify&车辆设备/注册参数/验证方式&${this.allEnumerationData['verifyInternetJson'][val['verify']]}&${this.allEnumerationData['verifyInternetJson'][this.copyForm['param306']['verify']]}` : '';
          this.formData['param306.band'] = val['band'] !== this.copyForm['param306']['band'] ? `param306.band&车辆设备/注册参数/频段&${this.allEnumerationData['bandInternetJson'][val['band']]}&${this.allEnumerationData['bandInternetJson'][this.copyForm['param306']['band']]}` : '';
          this.$emit('formDataChange',this.formData)
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
    this.$emit('setMenuActiveRefFormName','PrivateRegisterForm')
  },
  methods:{
    getPrivateProcotol(){
      let params = {
        deviceId:this.deviceId,
        param:{},
        msgId:306
      };
      if(!this.form['param306']){
        if(Boolean(this.isTemplate)) return;
        this.$api.getEHomeConfig(params).then(res =>{
          if(res.success && res.data.param){
            this.$set(this.form,'param306',JSON.parse(res.data.param));
            this.$set(this.copyForm,'param306',JSON.parse(JSON.stringify(JSON.parse(res.data.param))));
            this.childConfigParams = false;
          }else{
            this.$message.error('协议获取失败');
            this.childConfigParams = false;
          }
        })
      }else{
        this.childConfigParams = false;
      }
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
</style>