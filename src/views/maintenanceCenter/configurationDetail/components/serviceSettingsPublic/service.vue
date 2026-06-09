<template>
    <div class="p-a-md">
        <h2>部标平台连接信息</h2>
        <template>
          <el-form
              ref="PublicService"
              :rules="rules"
              label-position="top"
              :model="form"
              label-width="120px"
              style="margin-top: 10px"
            >
              <el-row type="flex" justify="space-between">
                  <el-col :span="7" >
                      <el-form-item label="主服务器APN" prop="0010.mainServerApn">
                          <el-input v-model="form['0010'].mainServerApn"></el-input>
                      </el-form-item>
                  </el-col>
                  <el-col :span="7" >
                      <el-form-item label="主服务器无线通信拨号用户名" prop="0011.mainServerUsername">
                          <el-input v-model="form['0011'].mainServerUsername"></el-input>
                      </el-form-item>
                  </el-col>
                  <el-col :span="7" >
                      <el-form-item label="主服务器无线通信拨号密码" prop="0012.mainServerPassword">
                          <el-input v-model="form['0012'].mainServerPassword"></el-input>
                      </el-form-item>
                  </el-col>
              </el-row>
              <el-row type="flex" justify="space-between">
                  <el-col :span="7" >
                      <el-form-item label="主服务器地址 IP或者域名" prop="0013.mainServerAddress">
                          <el-input v-model="form['0013'].mainServerAddress"></el-input>
                      </el-form-item>
                  </el-col>
                  <el-col :span="7" >
                      <el-form-item label="备份服务器APN" prop="0014.bakServerApn">
                          <el-input v-model="form['0014'].bakServerApn"></el-input>
                      </el-form-item>
                  </el-col>
                  <el-col :span="7" >
                    <el-form-item label="备份服务器无线通信拨号用户名" prop="0015.bakServerUsername">
                          <el-input v-model="form['0015'].bakServerUsername"></el-input>
                      </el-form-item>
                  </el-col>
              </el-row>
              <el-row type="flex" justify="space-between">
                  <el-col :span="7" >
                      <el-form-item label="备份服务器无线通信拨号密码" prop="0016.bakServerPassword">
                          <el-input v-model="form['0016'].bakServerPassword"></el-input>
                      </el-form-item>
                  </el-col>
                  <el-col :span="7" >
                      <el-form-item label="备份服务器IP地址或者域名" prop="0017.bakServerAddress">
                          <el-input v-model="form['0017'].bakServerAddress"></el-input>
                      </el-form-item>
                  </el-col>
                  <el-col :span="7" >
                  </el-col>
              </el-row>
          </el-form>
            <!-- <el-tabs v-model="activeName" >
                <el-tab-pane label="第1中心" name="first">
                    <el-form
                        ref="firstform"
                        label-position="top"
                        :model="firstform"
                        label-width="120px"
                        style="margin-top: 10px"
                    >
                        <el-row type="flex" justify="space-between">
                            <el-col :span="7" >
                                <el-form-item label="启用服务器">
                                    <el-select v-model="firstform.enableserver"></el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="7" >
                                <el-form-item label="接入协议类型">
                                    <el-select v-model="firstform.accesstype"></el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="7" >
                                <el-form-item label="扩充协议类型">
                                    <el-select v-model="firstform.extendtype"></el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row type="flex" justify="space-between">
                            <el-col :span="7" >
                                <el-form-item label="IP地址">
                                    <el-input v-model="firstform.ipaddress"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="7" >
                                <el-form-item label="端口号">
                                    <el-input v-model="firstform.portnum"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="7" >
                                <el-form-item label="客管理序列号">
                                    <el-input v-model="firstform.serialnum"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row type="flex" justify="space-between">
                            <el-col :span="7" >
                                <el-form-item label="终端ID">
                                    <el-input v-model="firstform.terminalid"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="7" >
                                <el-form-item label="主服务器APN">
                                    <el-input v-model="firstform.mainservice"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="7" >
                                <el-form-item label="备份服务器APN">
                                    <el-input v-model="firstform.secservice"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row type="flex" justify="space-between">
                            <el-col :span="7" >
                                <el-form-item label="备份服务器无线通信拨号用户名">
                                    <el-input v-model="firstform.secserviceuser"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="7" >
                                <el-form-item label="备份服务器无线通信拨号密码">
                                    <el-input v-model="firstform.secservicepw"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="7" ></el-col>
                        </el-row>
                    </el-form>
                </el-tab-pane>
                <el-tab-pane label="第2中心" name="second">
                    <el-form
                        ref="secondform"
                        label-position="top"
                        :model="secondform"
                        label-width="120px"
                    >
                        <el-row type="flex" justify="space-between">
                            <el-col :span="7" >
                                <el-form-item label="启用服务器">
                                    <el-select v-model="secondform.enableserver"></el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="7" >
                                <el-form-item label="接入协议类型">
                                    <el-select v-model="secondform.accesstype"></el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="7" >
                                <el-form-item label="扩充协议类型">
                                    <el-select v-model="secondform.extendtype"></el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row type="flex" justify="space-between">
                            <el-col :span="7" >
                                <el-form-item label="IP地址">
                                    <el-input v-model="secondform.ipaddress"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="7" >
                                <el-form-item label="端口号">
                                    <el-input v-model="secondform.portnum"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="7" >
                                <el-form-item label="客管理序列号">
                                    <el-input v-model="secondform.serialnum"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row type="flex" justify="space-between">
                            <el-col :span="7" >
                                <el-form-item label="终端ID">
                                    <el-input v-model="secondform.terminalid"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="7" >
                                <el-form-item label="主服务器APN">
                                    <el-input v-model="secondform.mainservice"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="7" >
                                <el-form-item label="备份服务器APN">
                                    <el-input v-model="secondform.secservice"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row type="flex" justify="space-between">
                            <el-col :span="7" >
                                <el-form-item label="备份服务器无线通信拨号用户名">
                                    <el-input v-model="secondform.secserviceuser"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="7" >
                                <el-form-item label="备份服务器无线通信拨号密码">
                                    <el-input v-model="secondform.secservicepw"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="7" ></el-col>
                        </el-row>
                    </el-form>
                </el-tab-pane>
                <el-tab-pane label="第3中心" name="third">
                    <el-form
                        ref="thirdform"
                        label-position="top"
                        :model="thirdform"
                        label-width="120px"
                    >
                        <el-row type="flex" justify="space-between">
                            <el-col :span="7" >
                                <el-form-item label="启用服务器">
                                    <el-select v-model="thirdform.enableserver"></el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="7" >
                                <el-form-item label="接入协议类型">
                                    <el-select v-model="thirdform.accesstype"></el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="7" >
                                <el-form-item label="扩充协议类型">
                                    <el-select v-model="thirdform.extendtype"></el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row type="flex" justify="space-between">
                            <el-col :span="7" >
                                <el-form-item label="IP地址">
                                    <el-input v-model="thirdform.ipaddress"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="7" >
                                <el-form-item label="端口号">
                                    <el-input v-model="thirdform.portnum"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="7" >
                                <el-form-item label="客管理序列号">
                                    <el-input v-model="thirdform.serialnum"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row type="flex" justify="space-between">
                            <el-col :span="7" >
                                <el-form-item label="终端ID">
                                    <el-input v-model="thirdform.terminalid"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="7" >
                                <el-form-item label="主服务器APN">
                                    <el-input v-model="thirdform.mainservice"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="7" >
                                <el-form-item label="备份服务器APN">
                                    <el-input v-model="thirdform.secservice"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row type="flex" justify="space-between">
                            <el-col :span="7" >
                                <el-form-item label="备份服务器无线通信拨号用户名">
                                    <el-input v-model="thirdform.secserviceuser"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="7" >
                                <el-form-item label="备份服务器无线通信拨号密码">
                                    <el-input v-model="thirdform.secservicepw"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="7" ></el-col>
                        </el-row>
                    </el-form>
                </el-tab-pane>
                <el-tab-pane label="第3中心" name="fourth">
                    <el-form
                        ref="fourthform"
                        label-position="top"
                        :model="fourthform"
                        label-width="120px"
                    >
                        <el-row type="flex" justify="space-between">
                            <el-col :span="7" >
                                <el-form-item label="启用服务器">
                                    <el-select v-model="fourthform.enableserver"></el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="7" >
                                <el-form-item label="接入协议类型">
                                    <el-select v-model="fourthform.accesstype"></el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="7" >
                                <el-form-item label="扩充协议类型">
                                    <el-select v-model="fourthform.extendtype"></el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row type="flex" justify="space-between">
                            <el-col :span="7" >
                                <el-form-item label="IP地址">
                                    <el-input v-model="fourthform.ipaddress"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="7" >
                                <el-form-item label="端口号">
                                    <el-input v-model="fourthform.portnum"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="7" >
                                <el-form-item label="客管理序列号">
                                    <el-input v-model="fourthform.serialnum"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row type="flex" justify="space-between">
                            <el-col :span="7" >
                                <el-form-item label="终端ID">
                                    <el-input v-model="fourthform.terminalid"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="7" >
                                <el-form-item label="主服务器APN">
                                    <el-input v-model="fourthform.mainservice"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="7" >
                                <el-form-item label="备份服务器APN">
                                    <el-input v-model="fourthform.secservice"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row type="flex" justify="space-between">
                            <el-col :span="7" >
                                <el-form-item label="备份服务器无线通信拨号用户名">
                                    <el-input v-model="fourthform.secserviceuser"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="7" >
                                <el-form-item label="备份服务器无线通信拨号密码">
                                    <el-input v-model="fourthform.secservicepw"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="7" ></el-col>
                        </el-row>
                    </el-form>
                </el-tab-pane>
                <el-tab-pane label="第3中心" name="fifth">
                    <el-form
                        ref="fifthform"
                        label-position="top"
                        :model="fifthform"
                        label-width="120px"
                    >
                        <el-row type="flex" justify="space-between">
                            <el-col :span="7" >
                                <el-form-item label="启用服务器">
                                    <el-select v-model="fifthform.enableserver"></el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="7" >
                                <el-form-item label="接入协议类型">
                                    <el-select v-model="fifthform.accesstype"></el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="7" >
                                <el-form-item label="扩充协议类型">
                                    <el-select v-model="fifthform.extendtype"></el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row type="flex" justify="space-between">
                            <el-col :span="7" >
                                <el-form-item label="IP地址">
                                    <el-input v-model="fifthform.ipaddress"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="7" >
                                <el-form-item label="端口号">
                                    <el-input v-model="fifthform.portnum"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="7" >
                                <el-form-item label="客管理序列号">
                                    <el-input v-model="fifthform.serialnum"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row type="flex" justify="space-between">
                            <el-col :span="7" >
                                <el-form-item label="终端ID">
                                    <el-input v-model="fifthform.terminalid"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="7" >
                                <el-form-item label="主服务器APN">
                                    <el-input v-model="fifthform.mainservice"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="7" >
                                <el-form-item label="备份服务器APN">
                                    <el-input v-model="fifthform.secservice"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row type="flex" justify="space-between">
                            <el-col :span="7" >
                                <el-form-item label="备份服务器无线通信拨号用户名">
                                    <el-input v-model="fifthform.secserviceuser"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="7" >
                                <el-form-item label="备份服务器无线通信拨号密码">
                                    <el-input v-model="fifthform.secservicepw"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="7" ></el-col>
                        </el-row>
                    </el-form>
                </el-tab-pane>
                <el-tab-pane label="第3中心" name="sixth">
                    <el-form
                        ref="sixthform"
                        label-position="top"
                        :model="sixthform"
                        label-width="120px"
                    >
                        <el-row type="flex" justify="space-between">
                            <el-col :span="7" >
                                <el-form-item label="启用服务器">
                                    <el-select v-model="sixthform.enableserver"></el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="7" >
                                <el-form-item label="接入协议类型">
                                    <el-select v-model="sixthform.accesstype"></el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="7" >
                                <el-form-item label="扩充协议类型">
                                    <el-select v-model="sixthform.extendtype"></el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row type="flex" justify="space-between">
                            <el-col :span="7" >
                                <el-form-item label="IP地址">
                                    <el-input v-model="sixthform.ipaddress"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="7" >
                                <el-form-item label="端口号">
                                    <el-input v-model="sixthform.portnum"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="7" >
                                <el-form-item label="客管理序列号">
                                    <el-input v-model="sixthform.serialnum"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row type="flex" justify="space-between">
                            <el-col :span="7" >
                                <el-form-item label="终端ID">
                                    <el-input v-model="sixthform.terminalid"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="7" >
                                <el-form-item label="主服务器APN">
                                    <el-input v-model="sixthform.mainservice"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="7" >
                                <el-form-item label="备份服务器APN">
                                    <el-input v-model="sixthform.secservice"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row type="flex" justify="space-between">
                            <el-col :span="7" >
                                <el-form-item label="备份服务器无线通信拨号用户名">
                                    <el-input v-model="sixthform.secserviceuser"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="7" >
                                <el-form-item label="备份服务器无线通信拨号密码">
                                    <el-input v-model="sixthform.secservicepw"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="7" ></el-col>
                        </el-row>
                    </el-form>
                </el-tab-pane>
            </el-tabs> -->
        </template>

    </div>

</template>

<script>
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
          const checkString = function (rule, value, callback) {
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
    };
    return {
      form:{},
      activeName:'first',
      rules: {
        '0010.mainServerApn':[{ validator: checkString.bind({max:20}), trigger: 'blur' }],
        '0011.mainServerUsername':[{ validator: checkString.bind({max:20}), trigger: 'blur' }],
        '0012.mainServerPassword':[{ validator: checkString.bind({max:20}), trigger: 'blur' }],
        '0014.bakServerApn':[{ validator: checkString.bind({max:20}), trigger: 'blur' }],
        '0015.bakServerUsername':[{ validator: checkString.bind({max:20}), trigger: 'blur' }],
        '0016.bakServerPassword':[{ validator: checkString.bind({max:20}), trigger: 'blur' }],
      }
    }
  },
}
</script>

<style scoped>

</style>