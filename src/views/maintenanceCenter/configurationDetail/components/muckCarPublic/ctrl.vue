<template>
   <div class="p-a-md">
    <h2 id="title" v-if="form['IsApiZtScreenCtrl']">基本信息</h2>
    <el-form
      ref="PublicCtrl"
      label-position="top"
      :model="form"
      label-width="120px"
      v-if="form['IsApiZtScreenCtrl']" 
    > 
      <el-row type="flex" justify="space-between">
        <el-col :span="7">
          <el-form-item label="安卓屏类型" class="m-r-md p-r">
            <el-select v-model="form['IsApiZtScreenCtrl'].screenType">
              <el-option
                v-for="item in screenTypes"
                :key="item.id"
                :value="item.id"
                :label="item.label"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="7"></el-col>
        <el-col :span="7"></el-col>
      </el-row>
      <h2 id="title" v-if="form['IsApiZtScreenCtrl']">安卓屏证件显示控制</h2>
      <el-row type="flex" justify="space-between">
        <el-col :span="7">
          <el-form-item label="证件类型" class="m-r-md p-r">
            <el-select v-model="form['IsApiZtScreenCtrl']['screenCert'].certType"  transfer multiple clearable collapse-tags>
              <el-option
                v-for="item in certTypes"
                :key="item.id"
                :value="item.id"
                :label="item.label"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="默认证件" class="m-r-md p-r">
            <el-select v-model="form['IsApiZtScreenCtrl']['screenCert'].defaultCert">
              <el-option
                v-for="item in defaultCerts"
                :key="item.id"
                :value="item.id"
                :label="item.label"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="7"></el-col>
      </el-row>
         <h2 id="title" v-if="form['IsApiZtScreenCtrl']">安卓屏设置控制</h2>
         <el-row type="flex" justify="space-between">
        <el-col :span="7">
          <el-form-item label="安卓屏默认界面" class="m-r-md p-r">
            <el-select v-model="form['IsApiZtScreenCtrl']['screenCtrl'].defaultShow">
              <el-option
                v-for="item in defaultShows"
                :key="item.id"
                :value="item.id"
                :label="item.label"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="安卓屏控制" class="m-r-md p-r">
            <el-select v-model="form['IsApiZtScreenCtrl']['screenCtrl'].screenCtrl">
              <el-option
                v-for="item in screenCtrls"
                :key="item.id"
                :value="item.id"
                :label="item.label"
              ></el-option>
            </el-select>
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
  name:'ctrl',
  props: {
    isTemplate:{
      type:String
    },
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
        }else{
          //this.makeDictionary(this.form['IsApiZtScreenCtrlCapability']['screenType'],this.form['IsApiZtScreenCtrlCapability']['certType'],this.form['IsApiZtScreenCtrlCapability']['defaultCert'],this.form['IsApiZtScreenCtrlCapability']['defaultShow'],this.form['IsApiZtScreenCtrlCapability']['notifyCtrl'])
        }
      },
      deep: true,
      immediate: true
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
    'form.IsApiZtScreenCtrl':{
      handler(val){
        if(val != undefined){
          this.$nextTick(() =>{
            this.$refs['PublicCtrl'].validate((valid) =>{
              if(valid){
                let screenTypeString = '';
                if(val['screenCert']['certType'].length){
                  val['screenCert']['certType'].forEach(item =>{
                    screenTypeString = `${screenTypeString},${this.certTypeJson[item]}`
                  })
                }
                console.log(screenTypeString);
                this.formData['IsApiZtScreenCtrl.screenType'] = val['screenType'] != this.copyForm['IsApiZtScreenCtrl']['screenType'] ? `IsApiZtScreenCtrl.screenType&渣土车配置/安卓屏控制/安卓屏类型&${this.screenTypeJson[val['screenType']]}` : '';
                this.formData['IsApiZtScreenCtrl.screenCert.certType.nothing'] = val['screenCert']['certType'].toString() != this.copyForm['IsApiZtScreenCtrl']['screenCert']['certType'].toString() ? `IsApiZtScreenCtrl.screenCert.certType.nothing&渣土车配置/安卓屏控制/证件类型&${screenTypeString}` : '';
                this.formData['IsApiZtScreenCtrl.screenCert.defaultCert.nothing'] = val['screenCert']['defaultCert'] != this.copyForm['IsApiZtScreenCtrl']['screenCert']['defaultCert'] ? `IsApiZtScreenCtrl.screenCert.defaultCert.nothing&渣土车配置/安卓屏控制/默认类型&${this.defaultCertJson[val['screenCert']['defaultCert']]}` : '';
                this.formData['IsApiZtScreenCtrl.screenCtrl.defaultShow.nothing'] = val['screenCtrl']['defaultShow'] != this.copyForm['IsApiZtScreenCtrl']['screenCtrl']['defaultShow'] ? `IsApiZtScreenCtrl.screenCtrl.defaultShow.nothing&渣土车配置/安卓屏控制/安卓屏默认界面&${this.defaultShowJson[val['screenCtrl']['defaultShow']]}` : '';
                this.formData['IsApiZtScreenCtrl.screenCtrl.screenCtrl.nothing'] = val['screenCtrl']['screenCtrl'] != this.copyForm['IsApiZtScreenCtrl']['screenCtrl']['screenCtrl'] ? `IsApiZtScreenCtrl.screenCtrl.screenCtrl.nothing&渣土车配置/安卓屏控制/安卓屏控制&${this.defaultShowJson[val['screenCtrl']['screenCtrl']]}` : '';
              }else{
                this.formData['IsApiZtScreenCtrl.screenType'] = '';
                this.formData['IsApiZtScreenCtrl.screenCert.certType.nothing'] = '';
                this.formData['IsApiZtScreenCtrl.screenCert.defaultCert.nothing'] = '';
                this.formData['IsApiZtScreenCtrl.screenCtrl.defaultShow.nothing'] = '';
                this.formData['IsApiZtScreenCtrl.screenCtrl.screenCtrl.nothing'] = '';
              }
              this.$emit('changeData',this.formData)
            })
          })
        }
      },
      deep: true,
      immediate:false,
    }
  },
  data(){
    return{
      form:{},
      copyForm:{},
      formData:{},
      screenTypes:[],
      screenTypeJson:{},
      certTypes:[],
      certTypeJson:{},
      defaultCerts:[],
      defaultCertJson:{},
      defaultShows:[],
      defaultShowJson:{},
      screenCtrls:[],
      screenCtrlJson:{}
    }
  },
  created(){
    // this.form = Object.assign({}, this.form, this.forms);
  },
  methods:{
    getDeviceConfigParamsByIsApi(){
      if(this.isTemplate == 'true'){
        this.makeDictionary(this.form['IsApiZtScreenCtrlCapability']['screenType'],this.form['IsApiZtScreenCtrlCapability']['certType'],this.form['IsApiZtScreenCtrlCapability']['defaultCert'],this.form['IsApiZtScreenCtrlCapability']['defaultShow'],this.form['IsApiZtScreenCtrlCapability']['notifyCtrl'])
        return
      }
      if(this.form['IsApiZtScreenCtrl']){
        this.makeDictionary(this.form['IsApiZtScreenCtrlCapability']['screenType'],this.form['IsApiZtScreenCtrlCapability']['certType'],this.form['IsApiZtScreenCtrlCapability']['defaultCert'],this.form['IsApiZtScreenCtrlCapability']['defaultShow'],this.form['IsApiZtScreenCtrlCapability']['notifyCtrl'])
        return
      } 
      const params = {
        deviceId: this.$route.query.deviceId || null,
        commandIds: ['IsApiZtScreenCtrl']
      };
      this.$api.getDeviceConfigParamsByIsApi(params).then(res =>{
        if(res.success && !JSON.parse(res.data)['IsApiZtScreenCtrl']['statusCode']){
          let resData = JSON.parse(res.data)
          this.makeDictionary(resData['IsApiZtScreenCtrlCapability']['screenType'],resData['IsApiZtScreenCtrlCapability']['certType'],resData['IsApiZtScreenCtrlCapability']['defaultCert'],resData['IsApiZtScreenCtrlCapability']['defaultShow'],resData['IsApiZtScreenCtrlCapability']['notifyCtrl'])
          this.form = Object.assign({}, this.form, JSON.parse(res.data));
          this.copyForm = Object.assign({}, this.copyForm, JSON.parse(res.data));
        }else{
            this.$message.error('获取设备配置参数失败:' + (res.msg
                                        ? res.msg
                                        : this.getErrMsg(
                                            JSON.parse(res.data)['IsApiZtScreenCtrl']['statusCode']
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
    makeDictionary(screenTypes,certTypes,defaultCerts,defaultShows,screenCtrls){
      this.screenTypes = [];
      this.screenCtrlJson = {};
      this.certTypes = []
      this.certTypeJson = {};
      this.defaultCerts = [];
      this.defaultCertJson = {};
      this.defaultShows = [];
      this.defaultShowJson = {};
      this.screenCtrls = [];
      this.screenCtrlJson = {};
      if(screenTypes.length){
        screenTypes.forEach(item =>{
          switch(item){
            case 0:
              this.screenTypes.push({
                id:item,
                label:'不使用安卓屏'
              })
              this.screenTypeJson[item] = '不使用安卓屏'
            break;
            case 1:
              this.screenTypes.push({
                id:item,
                label:'万航安卓屏'
              })
              this.screenTypeJson[item] = '万航安卓屏'
            break;
            case 2:
              this.screenTypes.push({
                id:item,
                label:'自研安卓屏'
              })
              this.screenTypeJson[item] = '自研安卓屏'
            break;
          }
        })
      }
      if(certTypes.length){
        certTypes.forEach(item =>{
          switch(item){
            case 0:
              this.certTypes.push({
                id:item,
                label:'准运证'
              })
              this.certTypeJson[item] = '准运证'
            break;
            case 1:
              this.certTypes.push({
                id:item,
                label:'运输证'
              })
              this.certTypeJson[item] = '准运证'
            break;
            case 2:
              this.certTypes.push({
                id:item,
                label:'排放证'
              })
              this.certTypeJson[item] = '排放证'
            break;
            case 3:
              this.certTypes.push({
                id:item,
                label:'处置通行证'
              })
              this.certTypeJson[item] = '处置通行证'
            break;
            case 4:
              this.certTypes.push({
                id:item,
                label:'电子运单'
              })
              this.certTypeJson[item] = '电子运单'
            break;
          }
        })
      }
      if(defaultCerts.length){
        defaultCerts.forEach(item =>{
          switch(item){
            case 0:
              this.defaultCerts.push({
                id:item,
                label:'准运证'
              })
              this.defaultCertJson[item] = '准运证'
            break;
            case 1:
              this.defaultCerts.push({
                id:item,
                label:'运输证'
              })
              this.defaultCertJson[item] = '运输证'
            break;
            case 2:
              this.defaultCerts.push({
                id:item,
                label:'排放证'
              })
              this.defaultCertJson[item] = '排放证'
            break;
            case 3:
              this.defaultCerts.push({
                id:item,
                label:'处置通行证'
              })
              this.defaultCertJson[item] = '处置通行证'
            break;
            case 4:
              this.defaultCerts.push({
                id:item,
                label:'电子运单'
              })
              this.defaultCertJson[item] = '电子运单'
            break;
          }
        })
      }
      if(defaultShows.length){
        defaultShows.forEach(item =>{
          switch(item){
            case 0:
              this.defaultShows.push({
                id:item,
                label:'主界面'
              })
              this.defaultShowJson[item] = '主界面'
            break;
            case 1:
              this.defaultShows.push({
                id:item,
                label:'车辆状态画面'
              })
              this.defaultShowJson[item] = '车辆状态画面'
            break;
            case 2:
              this.defaultShows.push({
                id:item,
                label:'实时视频画面'
              })
              this.defaultShowJson[item] = '实时视频画面'
            break;
            case 3:
              this.defaultShows.push({
                id:item,
                label:'证件界面'
              })
              this.defaultShowJson[item] = '证件界面'
            break;
            case 4:
              this.defaultShows.push({
                id:item,
                label:'地图界面'
              })
              this.defaultShowJson[item] = '地图界面'
            break;
            case 5:
              this.defaultShows.push({
                id:item,
                label:'导航界面'
              })
              this.defaultShowJson[item] = '导航界面'
            break;
            case 6:
              this.defaultShows.push({
                id:item,
                label:'设备界面'
              })
              this.defaultShowJson[item] = '设备界面'
            break;
            case 7:
              this.defaultShows.push({
                id:item,
                label:'消息界面'
              })
              this.defaultShowJson[item] = '消息界面'
            break;
            case 8:
              this.defaultShows.push({
                id:item,
                label:'设置界面'
              })
              this.defaultShowJson[item] = '设置界面'
            break;
          }
        })
      }
      if(screenCtrls.length){
        screenCtrls.forEach(item =>{
          switch(item){
            case 0:
              this.screenCtrls.push({
                id:item,
                label:'任何消息都不发'
              })
              this.screenCtrlJson[item] = '任何消息都不发'
            break;
            case 1:
              this.screenCtrls.push({
                id:item,
                label:'仅发送消息'
              })
              this.screenCtrlJson[item] = '仅发送消息'
            break;
            case 2:
              this.screenCtrls.push({
                id:item,
                label:'发送消息和弹窗'
              })
              this.screenCtrlJson[item] = '发送消息和弹窗'
            break;
            case 3:
              this.screenCtrls.push({
                id:item,
                label:'发送消息和安卓屏语音'
              })
              this.screenCtrlJson[item] = '发送消息和安卓屏语音'
            break;
            case 4:
              this.screenCtrls.push({
                id:item,
                label:'发送消息和设备自身语音'
              })
              this.screenCtrlJson[item] = '发送消息和设备自身语音'
            break;
            case 5:
              this.screenCtrls.push({
                id:item,
                label:'发送消息, 弹窗, 安卓屏语音'
              })
              this.screenCtrlJson[item] = '发送消息, 弹窗, 安卓屏语音'
            break;
          }
        })
      }
    }
  }

}
</script>
