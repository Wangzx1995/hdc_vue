<template>
  <div class="p-a-md">
    <h2 v-if="form['IsApiRegisterInfo'] || form['IsApiVehicleRecord'] || form['IsApiDriverCard']">基本信息</h2>
    <el-form ref="VehicleInfo" label-position="top" :model="form" :rules="rules" >
      <div class="configurations">
        <div v-if="form['IsApiRegisterInfo']" class="configuration-item">
          <el-form-item label="车牌号" class="m-r-md p-r" v-if="form['IsApiRegisterInfo']">
            <el-input v-model="form['IsApiRegisterInfo'].licenseNumber"></el-input>
          </el-form-item>
        </div>
        <div v-if="form['IsApiVehicleRecord']" class="configuration-item">
          <el-form-item class="m-r-md p-r" v-if="form['IsApiVehicleRecord']">
            <template #tips>
                车辆类型
                <el-tooltip
                    class="item"
                    :content="msg"
                    placement="right-start"
                >
                    <i class="el-icon-question"></i>
                </el-tooltip>
            </template>
            <!--下拉框按钮-->
            <!-- <el-select v-model="form['IsApiVehicleRecord'].licenseTypeName">
              <el-option
                    v-for="(item,index) in vehicleTypeList"
                    :key="index"
                    :label="item.name"
                    :value="item.value">
                  </el-option>
                  <div class="add-type">
                    <el-input v-model="addTypeVal"></el-input>
                    <div class="add-btn" @click="addType">+新增类型</div>
                  </div>
              </el-select> -->
              <el-input v-model="form['IsApiVehicleRecord'].licenseTypeName"></el-input>
        </el-form-item>
        </div>
        <div v-if="form['IsApiVehicleRecord']" class="configuration-item">
          <el-form-item label="车辆VIN号" class="m-r-md p-r" v-if="form['IsApiVehicleRecord']">
            <el-input v-model="form['IsApiVehicleRecord'].vinNum"></el-input>
          </el-form-item>
        </div>
        <div v-if="form['IsApiVehicleRecord']" class="configuration-item">
          <el-form-item label="发动机号" class="m-r-md p-r" v-if="form['IsApiVehicleRecord']">
            <el-input v-model="form['IsApiVehicleRecord'].engineNum"></el-input>
          </el-form-item>
        </div>
        <div v-if="form['IsApiRegisterInfo']" class="configuration-item">
          <el-form-item label="制造商ID" class="m-r-md p-r" v-if="form['IsApiRegisterInfo']">
            <el-input v-model="form['IsApiRegisterInfo'].factoryId"></el-input>
          </el-form-item>
        </div>
        <div v-if="form['IsApiVehicleRecord']" class="configuration-item">
          <el-form-item label="车辆初始里程" class="m-r-md p-r" prop="IsApiVehicleRecord.mileageInit">
            <el-input v-model="form['IsApiVehicleRecord'].mileageInit">
              <span slot="suffix">km</span>
            </el-input>
          </el-form-item>
        </div>
        <div v-if="form['IsApiVehicleRecord']" class="configuration-item">
          <el-form-item label="车辆累计里程" class="m-r-md p-r" prop="IsApiVehicleRecord.mileageTotal">
            <el-input v-model="form['IsApiVehicleRecord'].mileageTotal">
              <span slot="suffix">km</span>
            </el-input>
          </el-form-item>
        </div>
        <div v-if="form['IsApiVehicleRecord']" class="configuration-item">
          <el-form-item class="m-r-md p-r" v-if="form['IsApiVehicleRecord']">
            <template #tips>
              脉冲系数校准模式
            </template>
            <el-select v-model="form['IsApiVehicleRecord'].correctFactorMode">
              <el-option label="自动" :value="0"></el-option>
              <el-option label="手动" :value="1"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div v-if="form['IsApiVehicleRecord']" class="configuration-item">
          <el-form-item label="脉冲系数" class="m-r-md p-r" prop="IsApiVehicleRecord.pulseFactor">
            <el-input v-model="form['IsApiVehicleRecord'].pulseFactor"></el-input>
          </el-form-item>
        </div>
        <div v-if="form['IsApiVehicleRecord']" class="configuration-item">
          <el-form-item label="MCU的脉冲占空比" class="m-r-md p-r" v-if="form['IsApiVehicleRecord']">
            <el-select v-model="form['IsApiVehicleRecord'].dutyRadio">
              <el-option label="5% - 95%" :value="0"></el-option>
              <el-option label="15% - 85%" :value="1"></el-option>
              <el-option label="25% - 75%" :value="2"></el-option>
            </el-select>
          </el-form-item>
        </div>
      </div>
          <!-- <el-row type="flex" justify="space-between">
              <el-col :span="7">
               
              </el-col>
              <el-col :span="7" >
                
              </el-col>
              <el-col :span="7">
                
              </el-col>
          </el-row>

          <el-row type="flex" justify="space-between">
              <el-col :span="7">
                
              </el-col>
              <el-col :span="7">
                
              </el-col>
              <el-col :span="7" v-if="form['IsApiVehicleRecord']">
                
              </el-col>
          </el-row>

          <el-row type="flex" justify="space-between">
              <el-col :span="7" v-if="form['IsApiVehicleRecord']">
                 
              </el-col>
              <el-col :span="7">
                
              </el-col>
              <el-col :span="7" v-if="form['IsApiVehicleRecord']">
                
              </el-col>
          </el-row>

          <el-row type="flex" justify="space-between">
              <el-col :span="7">
                
              </el-col>
              <el-col :span="7">
               
              </el-col>
              <el-col :span="7">
               
              </el-col>
          </el-row> -->

        <h2 class="m-t-lg" v-if="form['IsApiDriverCard']">IC卡写卡</h2>
        <template v-if="form['IsApiDriverCard']">
          <div class="configurations">
            <div v-if="form['IsApiDriverCard']" class="configuration-item">
              <el-form-item label="驾驶员姓名" class="m-r-md p-r">
                    <el-input v-model="form['IsApiDriverCard'].driverName"></el-input>
                </el-form-item>
            </div>
            <div v-if="form['IsApiDriverCard']" class="configuration-item">
              <el-form-item label="驾驶证号码" class="m-r-md p-r">
                    <el-input v-model="form['IsApiDriverCard'].driverNo"></el-input>
                </el-form-item>
            </div>
            <div v-if="form['IsApiDriverCard']" class="configuration-item">
              <el-form-item label="从业资格证号" class="m-r-md p-r">
                    <el-input v-model="form['IsApiDriverCard'].qualificationNo"></el-input>
                </el-form-item>
            </div>
            <div v-if="form['IsApiDriverCard']" class="configuration-item">
              <el-form-item label="IC卡发证机构" class="m-r-md p-r">
                    <el-input v-model="form['IsApiDriverCard'].certificateOrg"></el-input>
                </el-form-item>
            </div>
            <div v-if="form['IsApiDriverCard']" class="configuration-item">
              <el-form-item label="IC卡有效期" class="m-r-md p-r">
                    <el-date-picker v-model="form['IsApiDriverCard'].validDate" type="date" placeholder="请选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd"/>
                </el-form-item>
            </div>
        </div>
        <!-- <el-row type="flex" justify="space-between">
              <el-col :span="7">
                
              </el-col>
              <el-col :span="7">
               
              </el-col>
              <el-col :span="7">
                
              </el-col>
          </el-row>
          <el-row type="flex" justify="space-between">
              <el-col :span="7">
                
              </el-col>
              <el-col :span="7">
               
              </el-col>
              <el-col :span="7">
               
              </el-col>
          </el-row> -->
        </template>
    </el-form>
    <!--<el-form ref="form" label-position="top" :model="form">
          <el-row type="flex" justify="space-between">
              <el-col :span="7">
                <el-form-item label="车牌号" class="m-r-md p-r">
                    <el-input v-model="form.engineNumber"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item class="m-r-md p-r">
                    <template #tips>
                        车辆类型
                        <el-tooltip
                            class="item"
                            :content="msg"
                            placement="right-start"
                        >
                            <i class="el-icon-question"></i>
                        </el-tooltip>
                    </template>-->
                    <!--下拉框按钮-->
                    <!--<el-select v-model="form.vehicleType">
                      <el-option
                            v-for="item in vehicleTypeList"
                            :key="item"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                          <div class="add-type">
                            <el-input v-model="addTypeVal"></el-input>
                            <div class="add-btn" @click="addType">+新增类型</div>
                          </div>
                      </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label="车辆VIN号" class="m-r-md p-r">
                      <el-input v-model="form.vehicleVINNumber"></el-input>
                  </el-form-item>
              </el-col>
          </el-row>

          <el-row type="flex" justify="space-between">
              <el-col :span="7">
                <el-form-item label="发动机号" class="m-r-md p-r">
                    <el-input v-model="form.engineNumber"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label="制造商ID" class="m-r-md p-r">
                    <el-input v-model="form.manufacturerID"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label="车辆初始里程" class="m-r-md p-r">
                    <el-input v-model="form.vehicleVINNumber">
                        <span slot="suffix">km</span>
                    </el-input>
                </el-form-item>
              </el-col>
          </el-row>

          <el-row type="flex" justify="space-between">
              <el-col :span="7">
                 <el-form-item label="车辆累计里程" class="m-r-md p-r">
                    <el-input v-model="form.engineNumber">
                        <span slot="suffix">km</span>
                    </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item class="m-r-md p-r">
                    <template #tips>
                        脉冲系数校准模式
                    </template>
                    <el-select v-model="form.vehicleType"></el-select>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label="脉冲系数" class="m-r-md p-r">
                    <el-input v-model="form.vehicleVINNumber"></el-input>
                </el-form-item>
              </el-col>
          </el-row>

          <el-row type="flex" justify="space-between">
              <el-col :span="7">
                <el-form-item label="MCU的脉冲占空比" class="m-r-md p-r">
                    <el-input v-model="form.engineNumber">
                        <span slot="suffix">%</span>
                    </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="7">
               
              </el-col>
              <el-col :span="7">
               
              </el-col>
          </el-row>

        <h2 class="m-t-lg">IC卡写卡</h2>
        <el-row type="flex" justify="space-between">
              <el-col :span="7">
                <el-form-item label="驾驶员姓名" class="m-r-md p-r">
                    <el-input v-model="form.driverLicenseNumber"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="7">
               <el-form-item label="驾驶证号码" class="m-r-md p-r">
                    <el-input v-model="form.driverLicenseNumber"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label="从业资格证号" class="m-r-md p-r">
                    <el-input v-model="form.certificateNo"></el-input>
                </el-form-item>
              </el-col>
          </el-row>
          <el-row type="flex" justify="space-between">
              <el-col :span="7">
                <el-form-item label="IC卡发证机构" class="m-r-md p-r">
                    <el-input v-model="form.driverLicenseNumber"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="7">
               <el-form-item label="IC卡有效期" class="m-r-md p-r">
                    <el-input v-model="form.driverLicenseNumber"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="7">
               
              </el-col>
          </el-row>
    </el-form>-->
  </div>
</template>

<script>
import {validateNum} from '@/utils/validate';
export default {
  name: 'vehicleInfo',
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
    configParams:{
        handler (val) {
        if(val){
          this.getDeviceConfigParamsByIsApi();
        }
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
        addTypeVal: '',
          vehicleTypeList:[],
          msg: `
          大型车辆：10人以上的载客车辆，或者总质量大于或等于4500KG的载货车辆，或者总质量大于或等于4500KG的专业作业车。
          小型车辆：9人或以下的载客车辆，或者总质量小于4500KG的载货车辆，或者总质量小于4500KG的专业作业车。
          挂车：设计和制造上需由汽车或拖拉机牵引，才能在道路上正常使用的无动力道路车辆，用于：载运货物，特殊用途。
          客车：设计制造用于客运的车辆，不限制载客人数，非国标定义的车牌类型，根据项目实际情况进行使用。
          危险品车：一种货箱顶部不封闭，排气管前置并装有防火花装置，运送石油化工品、炸药、鞭炮等危险品的专用车辆。
          货车：设计制造用于货物运输的载货车辆。
          重型箱式货车：载货重量大于等于12000kg，且带密闭集装箱的货车类型。
          校车：用于接送学生，7座或者7座以上的载客汽车
          特种工程车：具有专用设备或器具，在设计和制造上用于专项作业的汽车，例如汽车起重机，消防车，清障车，高空作业车等，但不包括以载运人员或者货物为主要目的的车辆。`,
          form:{},
          rules: {
            'IsApiVehicleRecord.mileageInit': [ { validator: checkNumber.bind({type:'int',min:0,max:10000000}), trigger: 'blur' }],
            'IsApiVehicleRecord.mileageTotal': [ { validator: checkNumber.bind({type:'int',min:0,max:10000000}), trigger: 'blur' }],
            'IsApiVehicleRecord.pulseFactor': [ { validator: checkNumber.bind({type:'int',min:0,max:65535}), trigger: 'blur' }],
          }
      }
    },
    methods:{
      getVehiclePlateType() {
        this.$api.getVehiclePlateType().then((res) => {
          if (res.success == true) {
            this.vehicleTypeList=res.data
          } else {
            this.$message.error('获取车辆类型失败:' + res.msg)
          }
        })
      },
      addType() {
        this.vehicleTypeList.push({
          label:this.addTypeVal,
          value:this.addTypeVal,
        })
        this.addTypeVal=''
      },
      getDeviceConfigParamsByIsApi() {
        let params = {
          deviceId: this.$route.query.deviceId || null,
          commandIds: ['IsApiDriverCard', 'IsApiRegisterInfo', 'IsApiVehicleRecord']
        }
        this.$api.getDeviceConfigParamsByIsApi(params).then((res) => {
          if (res.success == true) {
              this.form = Object.assign({}, this.form, JSON.parse(res.data) )
          } else {
            this.$message.error('获取设备配置参数失败:' + res.msg)
          }
        });
      }
    },
    created() {
      this.getDeviceConfigParamsByIsApi()
    },
    mounted() {
      this.getVehiclePlateType()
    }
}
</script>

<style lang="less" scoped>
.question{
    position: absolute;
    top: 4%;
    left: 85%;
    font-size: 20px;
}
.add-type {
  display: flex;
  padding: 8px;
  border-top: 1px solid #b3b3b3;
  .add-btn {
    color: #4886FF;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    width: 100px;
    margin-left: 8px;
  }
}

</style>