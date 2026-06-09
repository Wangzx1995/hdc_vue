<template>
  <div class="p-a-md">
    <div :style="{'height':height+'px'}"
         class="showPassword"
         v-if="!valitePas">
      <div class="passwordChild">
        <div class="passwordBox">
          <el-input v-model="checkPassword"
                    :type="passwordType"
                    prefix-icon="el-icon-lock"
                    placeholder="请输入密码解锁"
                    autoComplete="on">
            <i slot="suffix"
               class="el-input__icon"
               style="margin-top:2px"
               :class="passwordIcon"
               @mousedown="onMousedownClick"
               @mouseup="onMouseupClick"></i>
          </el-input>
        </div>
        <div class="passwordBox">
          <el-button style="width:100%;"
                     type="primary"
                     :loading="loading"
                     @click.native.prevent="makeSure">确认</el-button>
        </div>
      </div>
    </div>
    <div class="showContent"
         v-if="valitePas">
      <h2 id="title"
          v-if="form['IsApiZtVehctrl']">车辆管控模式</h2>
      <el-form ref="PublicVehctrl"
               label-position="top"
               :model="form"
               label-width="120px"
               v-if="form['IsApiZtVehctrl']">
        <el-row type="flex"
                justify="space-between">
          <el-col :span="7">
            <el-form-item label="车辆管控模式"
                          class="m-r-md p-r">
              <el-switch v-model="form['IsApiZtVehctrl'].vehCtrlMode"
                         :active-value="Number(1)"
                         :inactive-value="Number(0)"></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="7"></el-col>
          <el-col :span="7"></el-col>
        </el-row>
        <h2 id="title"
            v-if="form['IsApiZtVehctrl'].vehCtrlMode">控车内容</h2>
        <div v-if="form['IsApiZtVehctrl'].vehCtrlMode">
          <el-row type="flex"
                  justify="space-between"
                  v-for="(item,index) in vehCtrlModes"
                  :key="item.id">
            <div :class="{'lineHeight':item.id == 2}"
                 class="carLabel">{{item.label}}：</div>
            <el-col :class="{'carInput':item.id == 2}"
                    :span="7">
              <el-form-item v-if="item.id != 2"
                            label="控车状态"
                            class="m-r-md p-r">
                <el-select v-model="form['IsApiZtVehctrl']['vehCtrl'][index]['ctrlStatus']">
                  <el-option label="取消限制"
                             :value="Number(0)"></el-option>
                  <el-option label="限制"
                             :value="Number(1)"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="控车状态"
                            v-if="item.id == 2"
                            :rules="{validator: checkNumber.bind({type:'int',min:form['IsApiZtVehctrlCapability']['vehCtrlList'][1]['ctrlStatusMin'],max:form['IsApiZtVehctrlCapability']['vehCtrlList'][1]['ctrlStatusMax']}), trigger: 'blur'}"
                            :prop="'IsApiZtVehctrl.vehCtrl['+1+'].ctrlStatus'">
                <el-input tips-placement="top-end"
                          :tips="`键入值范围为${form['IsApiZtVehctrlCapability']['vehCtrlList'][1]['ctrlStatusMin']}~${form['IsApiZtVehctrlCapability']['vehCtrlList'][1]['ctrlStatusMax']}`"
                          v-model.number="form['IsApiZtVehctrl']['vehCtrl'][index]['ctrlStatus']"><span slot="suffix">km/h</span></el-input>
                <span v-if="item.id == 2"
                      class="prompt">0-不限速 {{form['IsApiZtVehctrlCapability']['vehCtrlList'][1]['ctrlStatusMin'] !==0 ? form['IsApiZtVehctrlCapability']['vehCtrlList'][1]['ctrlStatusMin'] : 1}}-{{form['IsApiZtVehctrlCapability']['vehCtrlList'][1]['ctrlStatusMax']}}-具体限速值，单位km/h</span>

              </el-form-item>
            </el-col>
            <el-col :span="7"></el-col>
            <el-col :span="7"></el-col>
          </el-row>
        </div>
      </el-form>
    </div>
  </div>

</template>
<script>
import { validateNum } from '@/utils/validate'
import AES from '@/utils/secret';
import { valid } from 'semver';
export default {
  name: 'vehctrl',
  props: {
    isTemplate: {
      type: String
    },
    detail: {
      type: Object,
      default: () => ({})
    },
    configParams: {
      type: Boolean,
      default: false
    },
    allCopyData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    formDetail: {
      type: Object,
      default: () => {
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
    formDetail: {
      handler(newVal, oldVal) {
        console.log(newVal)
        this.formData = newVal
      },
      deep: true,
      immediate: true,
    },
    allCopyData: {
      handler(newVal, oldVal) {
        console.log(newVal)
        this.copyForm = newVal
      },
      deep: true,
      immediate: true,
    },
    configParams: {
      handler(val) {
        if (!val) {
          if (this.valitePas) {
            this.getDeviceConfigParamsByIsApi();
          }
        }
      },
      deep: true,
      immediate: true
    },
    copyForm: {
      handler(val) {
        console.log(val)
        if (JSON.stringify(val) !== '{}') {
          this.$emit('changeCopy', val)
        }
      },
      deep: true,
      immediate: false,
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
    'form.IsApiZtVehctrl': {
      handler(val) {
        if (val != undefined) {
          this.$nextTick(() => {
            if (this.$refs['PublicVehctrl']) {
              this.$refs['PublicVehctrl'].validate((valid) => {
                if (valid) {
                  //form['IsApiZtVehctrl']['vehCtrl'][index].ctrlStatus
                  this.formData['IsApiZtVehctrl.vehCtrlMode'] = val['vehCtrlMode'] != this.copyForm['IsApiZtVehctrl']['vehCtrlMode'] ? `IsApiZtVehctrl.vehCtrlMode&渣土车配置/控车参数/车辆管控模式&${val['vehCtrlMode'] ? '开启' : '关闭'}` : '';
                  this.formData['IsApiZtVehctrl.vehCtrl.0.ctrlStatus'] = val['vehCtrl'][0]['ctrlStatus'] != this.copyForm['IsApiZtVehctrl']['vehCtrl'][0]['ctrlStatus'] ? `IsApiZtVehctrl.vehCtrl.0.ctrlStatus&渣土车配置/控车参数/锁车指令&${val['vehCtrl'][0]['ctrlStatus'] ? '限制' : '不限制'}` : '';
                  this.formData['IsApiZtVehctrl.vehCtrl.1.ctrlStatus'] = val['vehCtrl'][1]['ctrlStatus'] != this.copyForm['IsApiZtVehctrl']['vehCtrl'][1]['ctrlStatus'] ? `IsApiZtVehctrl.vehCtrl.1.ctrlStatus&渣土车配置/控车参数/限速指令&${val['vehCtrl'][1]['ctrlStatus']}` : '';
                  this.formData['IsApiZtVehctrl.vehCtrl.2.ctrlStatus'] = val['vehCtrl'][2]['ctrlStatus'] != this.copyForm['IsApiZtVehctrl']['vehCtrl'][2]['ctrlStatus'] ? `IsApiZtVehctrl.vehCtrl.2.ctrlStatus&渣土车配置/控车参数/限举指令&${val['vehCtrl'][2]['ctrlStatus'] ? '限制' : '不限制'}` : '';
                } else {
                  this.formData['IsApiZtVehctrl.vehCtrlMode'] = '';
                  this.formData['IsApiZtVehctrl.vehCtrl.0.ctrlStatus'] = '';
                  this.formData['IsApiZtVehctrl.vehCtrl.1.ctrlStatus'] = '';
                  this.formData['IsApiZtVehctrl.vehCtrl.2.ctrlStatus'] = '';
                }
                this.$emit('changeData', this.formData)
              })
            }
          })
        }
      },
      deep: true,
      immediate: false
    }
  },
  data() {
    return {
      form: {},
      copyForm: {},
      formData: {},
      vehCtrlModes: [],
      vehCtrlModeJson: {},
      checkNumber: function (rule, value, callback) {
        if (value !== '' && value !== null && value !== undefined) {
          if (!validateNum(value)) {
            callback(new Error("请输入正确的整数"));
          } else if (value < this.min) {
            callback(new Error(`最小值为${this.min}`));
          } else if (value > this.max) {
            callback(new Error(`最大值为${this.max}`));
          } else if ((this.type == 'short' && value > 32767) || (this.type == 'byte' && value > 127) || (this.type == 'int' && value > Math.pow(2, 31) - 1)) {
            callback(new Error("输入的数值超出有效范围"));
          } else {
            callback();
          }
        } else {
          callback(new Error("请输入"));
          // callback();
        }
      },
      first: true,
      second: true,
      third: true,
      loading: false,
      valitePas: false,
      activeName: '',
      height: 500,
      checkPassword: '',
      passwordType: 'password',
      passwordIcon: 'el-icon-view',
    }
  },
  created() {
    // this.form = Object.assign({}, this.form, this.forms);
    this.setTableHeight()
    // this.changeTabs()
  },
  methods: {
    getDeviceConfigParamsByIsApi() {
      if (this.isTemplate == 'true') {
        this.makeDictionary(this.form['IsApiZtVehctrlCapability']['vehCtrlList'])
        return
      }
      if (this.form['IsApiZtVehctrl'] && this.checkPassword) {
        this.makeDictionary(this.form['IsApiZtVehctrlCapability']['vehCtrlList'])
        return
      }
      const params = {
        deviceId: this.$route.query.deviceId || null,
        commandIds: ['IsApiZtVehctrl'],
        controlPwd: AES.encrypt(this.checkPassword)
      }
      this.$api.getDeviceConfigParamsByIsApi(params).then(res => {
        if (res.success && !JSON.parse(res.data)['IsApiZtVehctrl']['statusCode']) {
          let resData = JSON.parse(res.data)
          this.makeDictionary(resData['IsApiZtVehctrlCapability']['vehCtrlList'])
          this.form = Object.assign({}, this.form, JSON.parse(res.data));
          this.copyForm = Object.assign({}, this.copyForm, JSON.parse(res.data));
        } else {
            this.$message.error('获取设备配置参数失败:' + (res.msg
                                        ? res.msg
                                        : this.getErrMsg(
                                            JSON.parse(res.data)['IsApiZtVehctrl']['statusCode']
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
    makeDictionary(vehCtrlList) {
      this.vehCtrlModes = [];
      this.vehCtrlModeJson = {};
      if (vehCtrlList.length) {
        vehCtrlList.forEach(item => {
          switch (item.ctrlType) {
            case 1:
              this.vehCtrlModes.push({
                id: item.ctrlType,
                label: '锁车指令'
              })
              this.vehCtrlModeJson[item.ctrlType] = '锁车指令'
              break;
            case 2:
              this.vehCtrlModes.push({
                id: item.ctrlType,
                label: '限速指令'
              })
              this.vehCtrlModeJson[item.ctrlType] = '限速指令'
              break;
            case 3:
              this.vehCtrlModes.push({
                id: item.ctrlType,
                label: '限举指令'
              })
              this.vehCtrlModeJson[item.ctrlType] = '限举指令'
              break;
          }

        })
        console.log(this.vehCtrlModes)
      }
    },
    handleClick() {

    },
    setTableHeight() {
      this.height = document.body.clientHeight - 460;
    },
    onMousedownClick(ev) {
      this.passwordType = 'text';
      this.passwordIcon = 'el-icon-view';
    },
    onMouseupClick(ev) {
      this.passwordType = 'password';
      this.passwordIcon = 'el-icon-view';
    },
    makeSure() {
      let params = { controlPwd: AES.encrypt(this.checkPassword) };
      this.$api.checkZtControlPwd(params).then(res => {
        console.log(res);
        if (res.success) {
          this.valitePas = true
          this.getDeviceConfigParamsByIsApi();
          this.$emit('aesEncrypt', AES.encrypt(this.checkPassword))
        } else {
          this.$message.error(`解锁失败：${res.msg}`)
        }
      })
    },
    changeTabs() {
      this.first = false;
      this.second = false;
      this.third = false
      if (this.form['IsApiZtVehctrl'] && this.form['IsApiZtVehctrl']['vehCtrlMode'].length > 0) {
        this.form['IsApiZtVehctrl']['vehCtrlMode'].forEach(item => {
          switch (item) {
            case 0:
              this.first = true;
              break;
            case 1:
              this.second = true;
              break
            case 2:
              this.third = true;
          }
        })
        switch (this.form['IsApiZtVehctrl']['vehCtrlMode'][0]) {
          case 0:
            this.activeName = 'first';
            break
          case 1:
            this.activeName = 'second';
            break
          case 2:
            this.activeName = 'third';
            break
        }
      }
    },
    changeVehCtrlMode() {
      this.changeTabs()
    }
  },
  mounted() {
    const that = this;
    window.onresize = () => {
      return (() => {
        that.setTableHeight();
      })();
    };
  },

}
</script>
<style lang="less" scoped>
.showPassword {
  width: 100%;
  height: 100%;
  display: table;
  text-align: center;
  .passwordChild {
    display: table-cell;
    vertical-align: middle;
    text-align: center;
    padding-left: 50%;
  }
}
.passwordBox {
  width: 400px;
  height: 32px;
  margin-bottom: 10px;
  margin-left: -200px;
}
.carLabel {
  line-height: 86px;
  font-weight: 600;
}
.carInput {
  margin-top: 36px;
}
.lineHeight {
  line-height: 154px;
}
</style>