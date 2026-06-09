<template>
   <div class="p-a-md">
    <h2 id="title" v-if="form['IsApiZtTcss']">货箱检测列表</h2>
    <el-form
      ref="PublicTcss"
      label-position="top"
      :model="form"
      label-width="120px"
      v-if="form['IsApiZtTcss'] && form['IsApiZtTcss']['tcss']['tcssList'].length>0"
    >
      <el-tabs v-model="activeName" :before-leave="beforeLeave">
        <el-tab-pane v-for="(item,index) in form['IsApiZtTcss']['tcss']['tcssList']" :key="index" :label="tcssTypes[item.tcssType-1]" :name="item.tcssType+'tab'">
          <template v-if="activeName == item.tcssType+'tab'">
            <el-row type="flex" justify="space-between">
              <el-col :span="7">
                <el-form-item label="采集类型" class="m-r-md p-r">
                  <el-select v-model="item.acquireType">
                    <el-option
                     v-for="item_ in acquireTypes[item.tcssType-1]"
                     :key="item_.id"
                     :value="item_.id"
                     :label="item_.label"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label="手动设置状态" class="m-r-md p-r">
                  <el-select :disabled="item.acquireType != 1" v-model="item.manualStatus">
                    <el-option
                     v-for="item_ in manualStatues[item.tcssType-1]"
                     :key="item_.id"
                     :value="item_.id"
                     :label="item_.label"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label="当前状态" class="m-r-md p-r" :rules="{validator: checkNumber.bind({type:'int',min:0,max:50}), trigger: 'blur'}" :prop="'IsApiZtTcss.tcss.tcssList['+index+'].speedThreshold'">
                  <el-select :disabled="true" v-model="item.curStatus">
                    <el-option
                     v-for="item_ in curStatues[item.tcssType-1]"
                     :key="item_.id"
                     :value="item_.id"
                     :label="item_.label"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </template> 
        </el-tab-pane>
      </el-tabs>
      <h2 id="title" v-if="form['IsApiZtTcss']">静态手动设置</h2>
      <el-row type="flex" justify="space-between">
        <el-col :span="7">
          <el-form-item label="静态手动设置使能" class="m-r-md p-r">
            <el-switch v-model="form['IsApiZtTcss'].vehicleStatic.staticeEnable"></el-switch>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="静态手动速度" class="m-r-md p-r" :rules="{validator: checkNumber.bind({type:'int',min:form['IsApiZtTcssCapability'].staticSpeedMin,max:form['IsApiZtTcssCapability'].staticSpeedMax}), trigger: 'blur'}" prop="IsApiZtTcss.vehicleStatic.staticSpeed">
            <el-input tips-placement="top-end" :tips="`键入值范围为${form['IsApiZtTcssCapability'].staticSpeedMin}~${form['IsApiZtTcssCapability'].staticSpeedMax}`" v-model.number="form['IsApiZtTcss'].vehicleStatic.staticSpeed"><span slot="suffix">km/h</span></el-input>
            <span class="prompt">0-20表示静止, 20以上表示运动</span>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="持续时间" class="m-r-md p-r" :rules="{validator: checkNumber.bind({type:'int',min:form['IsApiZtTcssCapability'].staticContinueMin,max:form['IsApiZtTcssCapability'].staticContinueMax}), trigger: 'blur'}" prop="IsApiZtTcss.vehicleStatic.staticContinue">
            <el-input tips-placement="top-end" :tips="`键入值范围为${form['IsApiZtTcssCapability'].staticContinueMin}~${form['IsApiZtTcssCapability'].staticContinueMax}`" v-model.number="form['IsApiZtTcss'].vehicleStatic.staticContinue"><span slot="suffix">s</span></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="space-between">
        <el-col :span="7">
          <el-form-item label="车厢状态OSD开关" class="m-r-md p-r">
            <el-select v-model="form['IsApiZtTcss'].osdEnable">
              <el-option
                v-for="item_ in osdEnables"
                :key="item_.id"
                :value="item_.id"
                :label="item_.label"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          
        </el-col>
        <el-col :span="7">
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import { validateNum } from '@/utils/validate'
import { valid } from 'semver'

export default {
  name:'tcss',
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
    'form.IsApiZtTcss.tcss.tcssList.0':{
      handler(val){
        if(val != undefined){
          this.$nextTick(() =>{
            this.$refs['PublicTcss'].validate((valid) => {
              if(valid){
                this.formData['IsApiZtTcss.tcss.tcssList.0.acquireType'] = val['acquireType'] !== this.copyForm['IsApiZtTcss']['tcss']['tcssList'][0]['acquireType'] ? `IsApiZtTcss.tcss.tcssList.0.acquireType&渣土车配置/货箱状态/举升/采集类型&${this.acquireTypeJson[0][val['acquireType']]}` : '';
                this.formData['IsApiZtTcss.tcss.tcssList.0.manualStatus'] = val['manualStatus'] !== this.copyForm['IsApiZtTcss']['tcss']['tcssList'][0]['manualStatus'] ? `IsApiZtTcss.tcss.tcssList.0.manualStatus&渣土车配置/货箱状态/举升/手动设置状态&${this.manualStatueJson[0][val['manualStatus']]}` : '';
                this.formData['IsApiZtTcss.tcss.tcssList.0.curStatus'] = val['curStatus'] !== this.copyForm['IsApiZtTcss']['tcss']['tcssList'][0]['curStatus'] ? `IsApiZtTcss.tcss.tcssList.0.curStatus&渣土车配置/货箱状态/举升/当前状态&${this.curStatueJson[0][val['curStatus']]}` : '';
              }else{
                this.formData['IsApiZtTcss.tcss.tcssList.0.acquireType'] = '';
                this.formData['IsApiZtTcss.tcss.tcssList.0.manualStatus'] = '';
                this.formData['IsApiZtTcss.tcss.tcssList.0.curStatus'] = '';
              }
              this.$emit('changeData',this.formData)
            })
          })
        }
      },
      deep:true,
      immediate:false
    },
    'form.IsApiZtTcss.tcss.tcssList.1':{
      handler(val){
        if(val != undefined){
          this.$nextTick(() =>{
            this.$refs['PublicTcss'].validate((valid) => {
              if(valid){
                this.formData['IsApiZtTcss.tcss.tcssList.1.acquireType'] = val['acquireType'] !== this.copyForm['IsApiZtTcss']['tcss']['tcssList'][1]['acquireType'] ? `IsApiZtTcss.tcss.tcssList.1.acquireType&渣土车配置/货箱状态/密闭/采集类型&${this.acquireTypeJson[1][val['acquireType']]}` : '';
                this.formData['IsApiZtTcss.tcss.tcssList.1.manualStatus'] = val['manualStatus'] !== this.copyForm['IsApiZtTcss']['tcss']['tcssList'][1]['manualStatus'] ? `IsApiZtTcss.tcss.tcssList.1.manualStatus&渣土车配置/货箱状态/密闭/手动设置状态&${this.manualStatueJson[1][val['manualStatus']]}` : '';
                this.formData['IsApiZtTcss.tcss.tcssList.1.curStatus'] = val['curStatus'] !== this.copyForm['IsApiZtTcss']['tcss']['tcssList'][1]['curStatus'] ? `IsApiZtTcss.tcss.tcssList.1.curStatus&渣土车配置/货箱状态/举升/当前状态&${this.curStatueJson[1][val['curStatus']]}` : '';
              }else{
                this.formData['IsApiZtTcss.tcss.tcssList.1.acquireType'] = '';
                this.formData['IsApiZtTcss.tcss.tcssList.1.manualStatus'] = '';
                this.formData['IsApiZtTcss.tcss.tcssList.1.curStatus'] = '';
              }
              this.$emit('changeData',this.formData)
            })
          })
        }
      },
      deep:true,
      immediate:false
    },
    'form.IsApiZtTcss.tcss.tcssList.2':{
      handler(val){
        if(val != undefined){
          this.$nextTick(() =>{
            this.$refs['PublicTcss'].validate((valid) => {
              if(valid){
                this.formData['IsApiZtTcss.tcss.tcssList.2.acquireType'] = val['acquireType'] !== this.copyForm['IsApiZtTcss']['tcss']['tcssList'][2]['acquireType'] ? `IsApiZtTcss.tcss.tcssList.2.acquireType&渣土车配置/货箱状态/载重/采集类型&${this.acquireTypeJson[2][val['acquireType']]}` : '';
                this.formData['IsApiZtTcss.tcss.tcssList.2.manualStatus'] = val['manualStatus'] !== this.copyForm['IsApiZtTcss']['tcss']['tcssList'][2]['manualStatus'] ? `IsApiZtTcss.tcss.tcssList.2.manualStatus&渣土车配置/货箱状态/载重/手动设置状态&${this.manualStatueJson[2][val['manualStatus']]}` : '';
                this.formData['IsApiZtTcss.tcss.tcssList.2.curStatus'] = val['curStatus'] !== this.copyForm['IsApiZtTcss']['tcss']['tcssList'][2]['curStatus'] ? `IsApiZtTcss.tcss.tcssList.2.curStatus&渣土车配置/货箱状态/举升/当前状态&${this.curStatueJson[2][val['curStatus']]}` : '';
              }else{
                this.formData['IsApiZtTcss.tcss.tcssList.2.acquireType'] = '';
                this.formData['IsApiZtTcss.tcss.tcssList.2.manualStatus'] = '';
                this.formData['IsApiZtTcss.tcss.tcssList.2.curStatus'] = '';
              }
              this.$emit('changeData',this.formData)
            })
          })
        }
      },
      deep:true,
      immediate:false
    },
    'form.IsApiZtTcss':{
      handler(val){
        if(val != undefined){
          this.$nextTick(() =>{
            this.$refs['PublicTcss'].validate((valid) =>{
              if(valid){
                this.formData['IsApiZtTcss.vehicleStatic.staticeEnable.nothing'] = val['vehicleStatic']['staticeEnable'] != this.copyForm['IsApiZtTcss']['vehicleStatic']['staticeEnable'] ? `IsApiZtTcss.vehicleStatic.staticeEnable.nothing&渣土车配置/货箱状态/静态手动设置使能&${val['vehicleStatic']['staticeEnable'] ? '开启' : '关闭'}` : '';
                this.formData['IsApiZtTcss.vehicleStatic.staticSpeed.nothing'] = val['vehicleStatic']['staticSpeed'] != this.copyForm['IsApiZtTcss']['vehicleStatic']['staticSpeed'] ? `IsApiZtTcss.vehicleStatic.staticSpeed.nothing&渣土车配置/货箱状态/静态手动速度&${val['vehicleStatic']['staticSpeed']}` : '';
                this.formData['IsApiZtTcss.vehicleStatic.staticContinue.nothing'] = val['vehicleStatic']['staticContinue'] != this.copyForm['IsApiZtTcss']['vehicleStatic']['staticContinue'] ? `IsApiZtTcss.vehicleStatic.staticContinue.nothing&渣土车配置/货箱状态/持续时间&${val['vehicleStatic']['staticContinue']}` : '';
                this.formData['IsApiZtTcss.osdEnable'] = val['osdEnable'] != this.copyForm['IsApiZtTcss']['osdEnable'] ? `IsApiZtTcss.osdEnable&渣土车配置/货箱状态/车厢状态OSD开关&${this.osdEnableJson[val['osdEnable']]}` : '';
              }else{
                this.formData['IsApiZtTcss.vehicleStatic.staticeEnable.nothing'] = '';
                this.formData['IsApiZtTcss.vehicleStatic.staticSpeed.nothing'] = '';
                this.formData['IsApiZtTcss.vehicleStatic.staticContinue.nothing'] = '';
                this.formData['IsApiZtTcss.osdEnable'] = '';
              }
              this.$emit('changeData',this.formData)
            })
          })
        }
      },
      deep:true,
      immediate:false
    }
  },
  data(){
    return{
      form:{},
      copyForm:{},
      formData:{},
      tcssTypes:['举升','密闭','载重'],
      acquireTypes:[[],[],[]],
      acquireTypeJson:[{},{},{}],
      manualStatues:[[],[],[]],
      manualStatueJson:[{},{},{}],
      curStatues:[[],[],[]],
      curStatueJson:[{},{},{}],
      osdEnables:[],
      osdEnableJson:{},
      activeName:'1tab',
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
    }
  },
  created(){
    // this.form = Object.assign({}, this.form, this.forms)
  },
  methods:{
    getDeviceConfigParamsByIsApi(type){
      if(!type){
        if(this.isTemplate == 'true'){
          this.makeDictionary(this.form['IsApiZtTcssCapability']['osdEnable'],this.form['IsApiZtTcssCapability']['tcss']['tcssTypeList'])
          return
        }
        if(this.form['IsApiZtTcssCapability']){
          this.makeDictionary(this.form['IsApiZtTcssCapability']['osdEnable'],this.form['IsApiZtTcssCapability']['tcss']['tcssTypeList']);
          return
        }
        const params = {
          deviceId: this.$route.query.deviceId || null,
          commandIds: ['IsApiZtTcss']
        }
        this.$api.getDeviceConfigParamsByIsApi(params).then(res =>{
          if(res.success && !JSON.parse(res.data)['IsApiZtTcss']['statusCode']){
            let resData = JSON.parse(res.data);
            this.makeDictionary(resData['IsApiZtTcssCapability']['osdEnable'],resData['IsApiZtTcssCapability']['tcss']['tcssTypeList'])
            this.form = Object.assign({}, this.form, JSON.parse(res.data));
            this.copyForm = Object.assign({}, this.copyForm, JSON.parse(res.data));
          }else{
            this.$message.error('获取设备配置参数失败:' + (res.msg
                                        ? res.msg
                                        : this.getErrMsg(
                                            JSON.parse(res.data)['IsApiZtTcss']['statusCode']
                                          )))
          }
        })
      }
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
    makeDictionary(osdEnables,tcssTypeLists){
      this.acquireTypes = [[],[],[]];
      this.manualStatues = [[],[],[]];
      this.curStatues = [[],[],[]];
      this.osdEnables = [];
      this.acquireTypeJson = [{},{},{}];
      this.manualStatueJson = [{},{},{}];
      this.curStatueJson = [{},{},{}];
      this.osdEnableJson = {};
      if(osdEnables.length){
        osdEnables.forEach(item =>{
          switch(item){
            case 0:
              this.osdEnables.push({
                id:item,
                label:'不叠加'
              })
              this.osdEnableJson[item] = '不叠加'
            break
            case 1:
              this.osdEnables.push({
                id:item,
                label:'通道1'
              })
              this.osdEnableJson[item] = '通道1'
            break
            case 2:
              this.osdEnables.push({
                id:item,
                label:'通道2'
              })
              this.osdEnableJson[item] = '通道2'
            break
            case 3:
              this.osdEnables.push({
                id:item,
                label:'通道3'
              })
              this.osdEnableJson[item] = '通道3'
            break
            case 4:
              this.osdEnables.push({
                id:item,
                label:'通道4'
              })
              this.osdEnableJson[item] = '通道4'
            break
            case 5:
              this.osdEnables.push({
                id:item,
                label:'通道5'
              })
              this.osdEnableJson[item] = '通道5'
            break
            case 6:
              this.osdEnables.push({
                id:item,
                label:'通道6'
              })
              this.osdEnableJson[item] = '通道6'
            break
            case 7:
              this.osdEnables.push({
                id:item,
                label:'通道7'
              })
              this.osdEnableJson[item] = '通道7'
            break
            case 8:
              this.osdEnables.push({
                id:item,
                label:'通道8'
              })
              this.osdEnableJson[item] = '通道8'
            break
            case 255:
              this.osdEnables.push({
                id:item,
                label:'全通道'
              })
              this.osdEnableJson[item] = '全通道'
            break
          }
        })
      }
      if(tcssTypeLists.length){
        tcssTypeLists.forEach(item =>{
          if(item.acquireType.length && item.tcssType == 1){
            item.acquireType.forEach(item_ =>{
              switch(item_){
                case 1:
                  this.acquireTypes[0].push({
                    id:item_,
                    label:'手动'
                  })
                  this.acquireTypeJson[0][item_] = '手动'
                break;
                case 2:
                  this.acquireTypes[0].push({
                    id:item_,
                    label:'密闭传感器'
                  })
                  this.acquireTypeJson[0][item_] = '密闭传感器'
                break;
                case 3:
                  this.acquireTypes[0].push({
                    id:item_,
                    label:'相机'
                  })
                  this.acquireTypeJson[0][item_] = '相机'
                break;
                case 4:
                  this.acquireTypes[0].push({
                    id:item_,
                    label:'举升传感器'
                  })
                  this.acquireTypeJson[0][item_] = '举升传感器'
                break;
                case 5:
                  this.acquireTypes[0].push({
                    id:item_,
                    label:'F3载重传感器'
                  })
                  this.acquireTypeJson[0][item_] = 'F3载重传感器'
                break;
                case 6:
                  this.acquireTypes[0].push({
                    id:item_,
                    label:'精准载重传感器'
                  })
                  this.acquireTypeJson[0][item_] = '精准载重传感器'
                break;
                case 7:
                  this.acquireTypes[0].push({
                    id:item_,
                    label:'IPC'
                  })
                  this.acquireTypeJson[0][item_] = 'IPC'
                break;
                case 8:
                  this.acquireTypes[0].push({
                    id:item_,
                    label:'测距模块'
                  })
                  this.acquireTypeJson[0][item_] = '测距模块'
                break;
                case 9:
                  this.acquireTypes[0].push({
                    id:item_,
                    label:'CAN'
                  })
                  this.acquireTypeJson[0][item_] = 'CAN'
                break;
              }
            })
          }
          if(item.acquireType.length && item.tcssType == 2){
            item.acquireType.forEach(item_ =>{
              switch(item_){
                case 1:
                  this.acquireTypes[1].push({
                    id:item_,
                    label:'手动'
                  })
                  this.acquireTypeJson[1][item_] = '手动'
                break;
                case 2:
                  this.acquireTypes[1].push({
                    id:item_,
                    label:'密闭传感器'
                  })
                  this.acquireTypeJson[1][item_] = '密闭传感器'
                break;
                case 3:
                  this.acquireTypes[1].push({
                    id:item_,
                    label:'相机'
                  })
                  this.acquireTypeJson[1][item_] = '相机'
                break;
                case 4:
                  this.acquireTypes[1].push({
                    id:item_,
                    label:'举升传感器'
                  })
                  this.acquireTypeJson[1][item_] = '举升传感器'
                break;
                case 5:
                  this.acquireTypes[1].push({
                    id:item_,
                    label:'F3载重传感器'
                  })
                  this.acquireTypeJson[1][item_] = 'F3载重传感器'
                break;
                case 6:
                  this.acquireTypes[1].push({
                    id:item_,
                    label:'精准载重传感器'
                  })
                  this.acquireTypeJson[1][item_] = '精准载重传感器'
                break;
                case 7:
                  this.acquireTypes[1].push({
                    id:item_,
                    label:'IPC'
                  })
                  this.acquireTypeJson[1][item_] = 'IPC'
                break;
                case 8:
                  this.acquireTypes[1].push({
                    id:item_,
                    label:'测距模块'
                  })
                  this.acquireTypeJson[1][item_] = '测距模块'
                break;
                case 9:
                  this.acquireTypes[1].push({
                    id:item_,
                    label:'CAN'
                  })
                  this.acquireTypeJson[1][item_] = 'CAN'
                break;
              }
            })
          }
          if(item.acquireType.length && item.tcssType == 3){
            item.acquireType.forEach(item_ =>{
              switch(item_){
                case 1:
                  this.acquireTypes[2].push({
                    id:item_,
                    label:'手动'
                  })
                  this.acquireTypeJson[2][item_] = '手动'
                break;
                case 2:
                  this.acquireTypes[2].push({
                    id:item_,
                    label:'密闭传感器'
                  })
                  this.acquireTypeJson[2][item_] = '密闭传感器'
                break;
                case 3:
                  this.acquireTypes[2].push({
                    id:item_,
                    label:'相机'
                  })
                  this.acquireTypeJson[2][item_] = '相机'
                break;
                case 4:
                  this.acquireTypes[2].push({
                    id:item_,
                    label:'举升传感器'
                  })
                  this.acquireTypeJson[2][item_] = '举升传感器'
                break;
                case 5:
                  this.acquireTypes[2].push({
                    id:item_,
                    label:'F3载重传感器'
                  })
                  this.acquireTypeJson[2][item_] = 'F3载重传感器'
                break;
                case 6:
                  this.acquireTypes[2].push({
                    id:item_,
                    label:'精准载重传感器'
                  })
                  this.acquireTypeJson[2][item_] = '精准载重传感器'
                break;
                case 7:
                  this.acquireTypes[2].push({
                    id:item_,
                    label:'IPC'
                  })
                  this.acquireTypeJson[2][item_] = 'IPC'
                break;
                case 8:
                  this.acquireTypes[2].push({
                    id:item_,
                    label:'测距模块'
                  })
                  this.acquireTypeJson[2][item_] = '测距模块'
                break;
                case 9:
                  this.acquireTypes[2].push({
                    id:item_,
                    label:'CAN'
                  })
                  this.acquireTypeJson[2][item_] = 'CAN'
                break;
              }
            })
          }
          if(item.curStatus.length && item.tcssType == 1){
            item.curStatus.forEach(item_ =>{
              switch(item_){
                case 0:
                  this.curStatues[0].push({
                    id:item_,
                    label:'未举升'
                  })
                  this.curStatueJson[0][item_] = '未举升';
                break;
                case 1:
                  this.curStatues[0].push({
                    id:item_,
                    label:'举升'
                  })
                  this.curStatueJson[0][item_] = '举升';
                break;
                case 2:
                  this.curStatues[0].push({
                    id:item_,
                    label:'异常'
                  })
                  this.curStatueJson[0][item_] = '异常';
                break;
              }
            })
          }
          if(item.curStatus.length && item.tcssType == 2){
            item.curStatus.forEach(item_ =>{
              switch(item_){
                case 0:
                  this.curStatues[1].push({
                    id:item_,
                    label:'未密闭'
                  })
                  this.curStatueJson[1][item_] = '未密闭';
                break;
                case 1:
                  this.curStatues[1].push({
                    id:item_,
                    label:'密闭'
                  })
                  this.curStatueJson[1][item_] = '密闭';
                break;
                case 2:
                  this.curStatues[1].push({
                    id:item_,
                    label:'异常'
                  })
                  this.curStatueJson[1][item_] = '异常';
                break;
              }
            })
          }
          if(item.curStatus.length && item.tcssType == 3){
            item.curStatus.forEach(item_ =>{
              switch(item_){
                case 0:
                  this.curStatues[2].push({
                    id:item_,
                    label:'空载'
                  })
                  this.curStatueJson[2][item_] = '空载';
                break;
                case 1:
                  this.curStatues[2].push({
                    id:item_,
                    label:'满载'
                  })
                  this.curStatueJson[2][item_] = '满载';
                break;
                case 2:
                  this.curStatues[2].push({
                    id:item_,
                    label:'超载'
                  })
                  this.curStatueJson[2][item_] = '超载';
                break;
                case 3:
                  this.curStatues[2].push({
                    id:item_,
                    label:'轻载'
                  })
                  this.curStatueJson[2][item_] = '轻载';
                break;
                case 4:
                  this.curStatues[2].push({
                    id:item_,
                    label:'异常'
                  })
                  this.curStatueJson[2][item_] = '异常';
                break;
              }
            })
          }
          if(item.manualStatus.length && item.tcssType == 1){
            item.manualStatus.forEach(item_ =>{
              switch(item_){
                case 0:
                  this.manualStatues[0].push({
                    id:item_,
                    label:'未举升'
                  })
                  this.manualStatueJson[0][item_] = '未举升'
                break;
                case 1:
                  this.manualStatues[0].push({
                    id:item_,
                    label:'举升'
                  })
                  this.manualStatueJson[0][item_] = '举升'
                break;
                case 2:
                  this.manualStatues[0].push({
                    id:item_,
                    label:'异常'
                  })
                  this.manualStatueJson[0][item_] = '异常'
                break;
              }
            })
          }
          if(item.manualStatus.length && item.tcssType == 2){
            item.manualStatus.forEach(item_ =>{
              switch(item_){
                case 0:
                  this.manualStatues[1].push({
                    id:item_,
                    label:'未密闭'
                  })
                  this.manualStatueJson[1][item_] = '未密闭'
                break;
                case 1:
                  this.manualStatues[1].push({
                    id:item_,
                    label:'密闭'
                  })
                  this.manualStatueJson[1][item_] = '密闭'
                break;
                case 2:
                  this.manualStatues[1].push({
                    id:item_,
                    label:'异常'
                  })
                  this.manualStatueJson[1][item_] = '异常'
                break;
              }
            })
          }
          if(item.manualStatus.length && item.tcssType == 3){
            item.manualStatus.forEach(item_ =>{
              switch(item_){
                case 0:
                  this.manualStatues[2].push({
                    id:item_,
                    label:'空载'
                  })
                  this.manualStatueJson[2][item_] = '空载'
                break;
                case 1:
                  this.manualStatues[2].push({
                    id:item_,
                    label:'满载'
                  })
                  this.manualStatueJson[2][item_] = '满载'
                break;
                case 2:
                  this.manualStatues[2].push({
                    id:item_,
                    label:'超载'
                  })
                  this.manualStatueJson[2][item_] = '超载'
                break;
                case 3:
                  this.manualStatues[2].push({
                    id:item_,
                    label:'轻载'
                  })
                  this.manualStatueJson[2][item_] = '轻载'
                break;
                case 4:
                  this.manualStatues[2].push({
                    id:item_,
                    label:'异常'
                  })
                  this.manualStatueJson[2][item_] = '异常'
                break;
              }
            })
          }
        })
      }
    },
    beforeLeave(activeName,oldActiveName){
      // this.$refs.PublicInvalidAlarm.validate((valid) =>{
      //   if(!valid){
      //     this.$message.warning('当前表单验证不通过，请先完善！')
      //     return new Promise((resolve,reject) =>{
      //       valid == true;
      //     }).then(() =>{
      //       resolve()
      //     }).catch(reject(err))
      //   }
      // })
    },
  }

}
</script>
