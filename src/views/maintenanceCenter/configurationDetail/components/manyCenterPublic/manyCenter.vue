<template>
    <div class="p-a-md" style="height:100%">
      <el-form
          ref="PublicManyCenter"
          label-position="top"
          :model="form"
          label-width="120px"
          style="height:100%"
        >

        <template v-if="form['IsApiPlatform'] && form['IsApiPlatform'].platformInfoList && form['IsApiPlatform'].platformInfoList.length>0">
          <el-tabs v-model="activeName" @tab-click="changeCenter(activeName)">
              <el-tab-pane :label="'第' + (+index+1)+'中心'" :name="index + ''"
              v-for="(item,index) in form['IsApiPlatform'].platformInfoList"
              v-bind:key="index">
                      <el-row type="flex" justify="space-between" style="margin-top: 10px;">
                          <el-col :span="7" >
                            <el-form-item label="启用服务器">
                                <el-select v-model="item.enabled">
                                  <el-option label="关闭" :value="0"></el-option>
                                  <el-option label="启用" :value="1"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7" >
                            <el-form-item label="报警上传使能">
                                <el-select v-model="item.alarmEnable">
                                  <el-option label="关闭" :value="0"></el-option>
                                  <el-option label="启用" :value="1"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7" >
                            <el-form-item label="接入协议类型">
                                <el-select v-model="item.protocolVersion">
                                  <el-option 
                                    v-for="item_ in protocolVersionOptions[index]"
                                    :label="item_.label"
                                    :value="item_.value"
                                    :key="item_.value"
                                  ></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                      </el-row>
                      <el-row type="flex" justify="space-between">
                        <el-col :span="7" >
                            <el-form-item label="扩充协议类型">
                                <el-select v-model="item.protocolType">
                                  <el-option 
                                    v-for="item_ in protocolTypeList[index]"
                                    :label="item_.label"
                                    :value="item_.value"
                                    :key="item_.value"
                                  ></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7" >
                            <el-form-item label="手机号">
                                <el-input v-model="item.cellPhoneNumber"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7" >
                            <el-form-item label="终端ID" :rules="{ validator: checkString.bind({max: 11}), trigger: 'change' }" :prop="'IsApiPlatform.platformInfoList.' + index + '.terminalId'">
                                <el-input v-model="item.terminalId"></el-input>
                            </el-form-item>
                        </el-col>

                      </el-row>
                      <el-row type="flex" justify="space-between">
                        <el-col :span="7" >
                            <el-form-item label="端口号" :rules="{ validator: checkNumber.bind({type:'int',min:0,max:65535}), trigger: 'change' }" :prop="'IsApiPlatform.platformInfoList.' + index + '.tcpPortNo'">
                                <el-input v-model="item.tcpPortNo"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7" >
                            <el-form-item label="主动拍照策略" v-if="item['IsApiPlatformOthers' + index]">
                                <el-select v-model="item['IsApiPlatformOthers' + index].activePhotoStrategy">
                                  <el-option label="不开启" :value="0"></el-option>
                                  <el-option label="定时拍照" :value="1"></el-option>
                                  <el-option label="定距拍照" :value="2"></el-option>
                                  <el-option label="保留" :value="3"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7" >
                            <el-form-item label="缺省时间汇报时间间隔" v-if="item['IsApiPlatformOthers' + index]" :rules="{ validator: checkNumber.bind({type:'int',min:1,max:50000}), trigger: 'change' }" :prop="'IsApiPlatform.platformInfoList.' + index + '.IsApiPlatformOthers' + index +'.reportTimeIntervalDuringDefault'">
                                <el-input v-model="item['IsApiPlatformOthers' + index].reportTimeIntervalDuringDefault"><span slot="suffix">s</span></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                      <el-row type="flex" justify="space-between" >
                         <el-col :span="7" >
                            <el-form-item label="休眠汇报时间间隔" v-if="item['IsApiPlatformOthers' + index]" :rules="{ validator: checkNumber.bind({type:'int',min:1,max:50000}), trigger: 'change' }" :prop="'IsApiPlatform.platformInfoList.' + index + '.IsApiPlatformOthers' + index +'.reportTimeIntervalDuringSleep'">
                                <el-input v-model="item['IsApiPlatformOthers' + index].reportTimeIntervalDuringSleep"><span slot="suffix">s</span></el-input>
                            </el-form-item>
                        </el-col>
                          <!--<el-col :span="7" >
                            <el-form-item label="备份服务器无线通信拨号密码">
                                <el-input v-model="item.sleepReportTimeInterval"></el-input>
                            </el-form-item>
                        </el-col>-->
                        <el-col :span="7" >
                            <el-form-item label="紧急报警汇报时间间隔" v-if="item['IsApiPlatformOthers' + index]" :rules="{ validator: checkNumber.bind({type:'int',min:1,max:50000}), trigger: 'change' }" :prop="'IsApiPlatform.platformInfoList.' + index + '.IsApiPlatformOthers' + index + '.reportTimeIntervalDuringAlarm'">
                                <el-input v-model="item['IsApiPlatformOthers' + index].reportTimeIntervalDuringAlarm"><span slot="suffix">s</span></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7" >
                        </el-col>
                    </el-row>
                    <el-row>
                      <template v-if="item.serverInfoList && item.serverInfoList.length>0">

                        <el-tabs v-model="activeName2" >
                            <el-tab-pane :label="'服务器' + (+indexx+1)" :name="'服务器' + (+indexx+1)" v-for="(itemx,indexx) in item.serverInfoList" v-bind:key="indexx">
                                    <el-row type="flex" justify="space-between" style="margin-top: 10px;">
                                        <!-- <el-col :span="7" >
                                          <el-form-item label="服务器类型">
                                              <el-select v-model="itemx.serverType">
                                                <el-option label="主服务器" :value="0"></el-option>
                                                <el-option label="备服务器" :value="1"></el-option>
                                              </el-select>
                                          </el-form-item>
                                      </el-col> -->
                                      <el-col :span="7" >
                                          <el-form-item label="地址格式类型">
                                              <el-select v-model="itemx.addressingFormatType">
                                                <el-option label="IP" :value="0"></el-option>
                                                <el-option label="域名" :value="1"></el-option>
                                              </el-select>
                                          </el-form-item>
                                      </el-col>
                                      <el-col :span="7" >
                                          <el-form-item label="域名" v-if="itemx.addressingFormatType==1">
                                            <el-input v-model="itemx.hostName"></el-input>
                                          </el-form-item>
                                          <el-form-item label="IP" v-if="itemx.addressingFormatType==0">
                                            <h-ip-input v-model="itemx.ipv4Address"></h-ip-input>
                                          </el-form-item>
                                      </el-col>
                                      <el-col :span="7" ></el-col>
                                    </el-row>
                                    <!-- <el-button type="primary" @click="addOne(index, indexx)" :disabled="isDisabledAdd[index]">添加服务器</el-button>
                                    <el-button type="danger" @click="deleteBtn(index, indexx)" :disabled="isDisabledDel[index]">删除当前服务器</el-button> -->
                            </el-tab-pane>

                        </el-tabs>
                      </template>
                    </el-row>
              </el-tab-pane>
          </el-tabs>
        </template>

        <!-- <EmptyBox v-else style="height:100%">
          <p slot="description" class="text-md">暂无数据～</p>
        </EmptyBox> -->
      </el-form>
    </div>
</template>

<script>
import EmptyBox from '@/components/coreManage/emptyBox'
import {validateNum} from '@/utils/validate';
export default {
  components: {
    EmptyBox
  },
  props:{
    detail:{
      type: Object,
      default:()=>{
        return {}
      }
    },
    configParams:{
      type:Boolean,
      default:false
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
    },
    configParams:{
        handler (val) {
        if(!val){
          this.getDeviceConfigParamsByIsApi();
        }
      },
      deep: true,
      immediate:true,
    },
    // 'form.Others': {
    //   handler (val) {
    //     if (JSON.stringify(val) !== '{}'){
    //       this.$emit('getOthers', val)
    //     }
    //   },
    //   deep: true,
    //   immediate:true,
    // },
    currentCenter: {
      handler (newVal, oldVal) {
        this.$emit('currentCenter',newVal)
      }
    }
  },
  data() {
    return {
      // Others: {
      //   // IsApiPlatformOthers0:{activePhotoStrategy:'',reportTimeIntervalDuringDefault:'',reportTimeIntervalDuringSleep:'',reportTimeIntervalDuringAlarm:''}
      // },
      currentCenter: '',
      isDisabledDel: [],
      isDisabledAdd: [],
      protocolTypeList:[[],[],[],[],[],[]],
      protocolVersionOptions:[[],[],[],[],[],[]],
      addFlag: [],
      form:{},
      activeName: '0',
      activeName2: '服务器1',
      checkString :function (rule, value, callback) {
      if (value!=='' && value!==null && value!==undefined) {
           if(value.length>this.max){
            callback(new Error(`最大长度为${this.max}`));
          } else {
            callback();
          }
      } else {
          // callback(new Error("请输入"));
          callback();
      }
    },
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
      }
    }
  },
  methods:{
    changeCenter(index){
      this.activeName2 = '服务器1'
      this.getOther(index,this.form)
    },
    // addOne(index, indexx) {
    //   // 添加
    //   this.form['IsApiPlatform'].platformInfoList[index].serverInfoList.push({
    //     serverType: '',
    //     addressingFormatType: 0,
    //     hostName: '',
    //     ipv4Address: '',
    //     id: this.form['IsApiPlatform'].platformInfoList[index].id
    //   })

    //   // 如果已经两个 就禁止继续添加
    //   if(this.form['IsApiPlatform'].platformInfoList[index].serverInfoList.length >= 2) {
    //     this.isDisabledAdd[index] = true
    //   } else {
    //     this.isDisabledAdd[index] = false
    //   }

    //   // 如果只剩一个了 就禁止继续删除
    //   if(this.form['IsApiPlatform'].platformInfoList[index].serverInfoList.length < 2) {
    //     this.isDisabledDel[index] = true
    //   } else if (this.form['IsApiPlatform'].platformInfoList[index].serverInfoList.length >= 2) {
    //     this.isDisabledDel[index] = false
    //   }

    //   this.$nextTick(() => {
    //     this.activeName2 = `服务器${indexx+2}`
    //   })
    // },
    // deleteBtn(index, indexx){
    //   this.form['IsApiPlatform'].platformInfoList[index].serverInfoList.splice(indexx,1)

    //   // 如果已经两个 就禁止继续添加
    //   if(this.form['IsApiPlatform'].platformInfoList[index].serverInfoList.length >= 2) {
    //     this.isDisabledAdd[index] = true
    //   } else {
    //     this.isDisabledAdd[index] = false
    //   }

    //   // 如果只剩一个了 就禁止继续删除
    //   if(this.form['IsApiPlatform'].platformInfoList[index].serverInfoList.length < 2) {
    //     this.isDisabledDel[index] = true
    //   } else if (this.form['IsApiPlatform'].platformInfoList[index].serverInfoList.length >= 2) {
    //     this.isDisabledDel[index] = false
    //   }

    //   this.$nextTick(() => {
    //     this.activeName2 = `服务器${indexx}`
    //   })
    // },
    getDeviceConfigParamsByIsApi() {
      let params = {
        deviceId: this.$route.query.deviceId || null,
        commandIds: ['IsApiPlatform']
      }
      this.$api.getDeviceConfigParamsByIsApi(params).then((res) => {
        if (res.success == true && !JSON.parse(res.data)['IsApiPlatform']['statusCode']) {
          let resData = JSON.parse(res.data);
          // console.log(resData);
          resData['IsApiPlatformCapability']['platformCapabilityList'].forEach((item,index) =>{
            for(let i = 0;i < item['protocolVersionOptions'].length;i++){
              switch(item['protocolVersionOptions'][i]){
                case "2011":
                  this.protocolVersionOptions[index].push({
                    value:item['protocolVersionOptions'][i],
                    label:'2011版本'
                  })
                break;
                case "2019":
                  this.protocolVersionOptions[index].push({
                    value:item['protocolVersionOptions'][i],
                    label:'2019版本'
                  })
                break;
              }
            }
            if(this.protocolVersionOptions[index].length>item['protocolVersionOptions'].length){
              this.protocolVersionOptions[index].splice(0,item['protocolVersionOptions'].length)
            }
          })
          resData['IsApiPlatformCapability']['platformCapabilityList'].forEach((item,index) =>{
            for(let i = 0;i < item['protocolTypeOptions'].length;i++){
              switch(item['protocolTypeOptions'][i]){
                case "jing":
                  this.protocolTypeList[index].push({
                    value:item['protocolTypeOptions'][i],
                    label:'京标平台'
                  })
                break;
                case "std":
                  this.protocolTypeList[index].push({
                    value:item['protocolTypeOptions'][i],
                    label:'部标平台'
                  })
                break;
                case "su":
                  this.protocolTypeList[index].push({
                    value:item['protocolTypeOptions'][i],
                    label:'苏标平台'
                  })
                break;
                case "zhe":
                  this.protocolTypeList[index].push({
                    value:item['protocolTypeOptions'][i],
                    label:'浙标平台'
                  })
                break;
                case "chong":
                  this.protocolTypeList[index].push({
                    value:item['protocolTypeOptions'][i],
                    label:'渝标平台'
                  })
                break;
                case "shan":
                  this.protocolTypeList[index].push({
                    value:item['protocolTypeOptions'][i],
                    label:'陕标平台'
                  })
                break;
                case "lu":
                  this.protocolTypeList[index].push({
                    value:item['protocolTypeOptions'][i],
                    label:'鲁标平台'
                  })
                break;               
                case "yue":
                  this.protocolTypeList[index].push({
                    value:item['protocolTypeOptions'][i],
                    label:'粤标平台'
                  })
                break;
              }
            }
             if(this.protocolTypeList[index].length>item['protocolTypeOptions'].length){
              this.protocolTypeList[index].splice(0,item['protocolTypeOptions'].length)
            }
          })
          // console.log(this.protocolTypeList);
          //   console.log(this.protocolVersionOptions)
          this.form = Object.assign({}, this.form, JSON.parse(res.data))
          // console.log(this.form['IsApiPlatform']);
          // this.initButton()
          this.getOther(0,this.form)
        } else {
          this.$message.error('获取设备配置参数失败:' + res.msg)
        }
      });
    },
    // initButton() {
    //   Object.keys(this.form['IsApiPlatform'].platformInfoList).forEach((item, i) => {
    //     // 如果已经两个 就禁止继续添加
    //     if(this.form['IsApiPlatform'].platformInfoList[i].serverInfoList.length >= 2) {
    //       this.isDisabledAdd[i] = true
    //     } else if (this.form['IsApiPlatform'].platformInfoList[i].serverInfoList.length < 2) {
    //       this.isDisabledAdd[i] = false
    //     }
    //     if (this.form['IsApiPlatform'].platformInfoList[i].serverInfoList.length < 2) {
    //       this.isDisabledDel[i] = true
    //     } else if (this.form['IsApiPlatform'].platformInfoList[i].serverInfoList.length >= 2) {
    //       this.isDisabledDel[i] = false
    //     }
    //   })
    // },
    getOther(index,data) {
      this.currentCenter = index
      let params = {
        deviceId: this.$route.query.deviceId || null,
        commandIds: ['IsApiPlatformOthers' + index]
      }
      this.$api.getDeviceConfigParamsByIsApi(params).then((res) => {
        if (res.success == true && !JSON.parse(res.data)['IsApiPlatformOthers' + index]['statusCode']) {
          // const temp = Object.assign(
          //   this.form['IsApiPlatform'].platformInfoList[index],
          //   JSON.parse(res.data)['IsApiPlatformOthers' + index]
          // )
          // this.$set(this.form['IsApiPlatform'].platformInfoList, index, temp)
          // console.log(this.form['IsApiPlatform'],JSON.parse(res.data));

          // 因为下发时要把IsApiPlatformOthers单独下发 所以保存一个数组发给父组件下发使用
          console.log(data['IsApiPlatform']);
          this.$set(data.IsApiPlatform.platformInfoList[index], 'IsApiPlatformOthers' + index, JSON.parse(res.data)['IsApiPlatformOthers' + index])
          // this.$emit('getOthers', this.form.Others)

        } else {
          this.$message.error('获取设备配置参数失败:' + res.msg)
        }
      });
    }
  },
  created() {
    this.getDeviceConfigParamsByIsApi()
  }
}
</script>

<style scoped>

</style>