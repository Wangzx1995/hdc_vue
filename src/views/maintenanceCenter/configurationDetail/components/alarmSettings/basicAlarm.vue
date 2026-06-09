<template>
    <div class="p-a-md">
        <h2>基本设置</h2>
          <el-form
            ref="BasicAlarm"
            label-position="top"
            :model="form"
            label-width="120px"
            style="margin-top:10px"
        >
          <table class="basic-alarm m-t-md">
            <tr>
              <th>报警名称</th>
              <th>报警使能</th>
              <th>报警发送文本SMS</th>
              <th>报警拍摄</th>
              <th>报警拍摄存储</th>
              <th>关键标志</th>
            </tr>
            <tr>
              <td>紧急报警</td>
              <td><el-switch v-model="form['0050'].urgencyAlarm" size="mini" :active-value="0" :inactive-value="1"></el-switch></td>
              <td><el-switch v-model="form['0051'].urgencyAlarm" size="mini" :active-value="0" :inactive-value="1"></el-switch></td>
              <td><el-switch v-model="form['0052'].urgencyAlarm" size="mini" :active-value="0" :inactive-value="1"></el-switch></td>
              <td><el-switch v-model="form['0053'].urgencyAlarm" size="mini" :active-value="0" :inactive-value="1"></el-switch></td>
              <td><el-switch v-model="form['0054'].urgencyAlarm" size="mini" :active-value="0" :inactive-value="1"></el-switch></td>
            </tr>
            <tr>
              <td>超速报警</td>
              <td><el-switch v-model="form['0050'].overSpeedAlarm" size="mini" :active-value="0" :inactive-value="1"></el-switch></td>
              <td><el-switch v-model="form['0051'].overSpeedAlarm" size="mini" :active-value="0" :inactive-value="1"></el-switch></td>
              <td><el-switch v-model="form['0052'].overSpeedAlarm" size="mini" :active-value="0" :inactive-value="1"></el-switch></td>
              <td><el-switch v-model="form['0053'].overSpeedAlarm" size="mini" :active-value="0" :inactive-value="1"></el-switch></td>
              <td><el-switch v-model="form['0054'].overSpeedAlarm" size="mini" :active-value="0" :inactive-value="1"></el-switch></td>
            </tr>
            <tr>
              <td>疲劳驾驶报警</td>
              <td><el-switch v-model="form['0050'].fatigueDrive" size="mini" :active-value="0" :inactive-value="1"></el-switch></td>
              <td><el-switch v-model="form['0051'].fatigueDrive" size="mini" :active-value="0" :inactive-value="1"></el-switch></td>
              <td><el-switch v-model="form['0052'].fatigueDrive" size="mini" :active-value="0" :inactive-value="1"></el-switch></td>
              <td><el-switch v-model="form['0053'].fatigueDrive" size="mini" :active-value="0" :inactive-value="1"></el-switch></td>
              <td><el-switch v-model="form['0054'].fatigueDrive" size="mini" :active-value="0" :inactive-value="1"></el-switch></td>
            </tr>
            <tr>
              <td>危险驾驶报警</td>
              <td><el-switch v-model="form['0050'].dangerAlarm" size="mini" :active-value="0" :inactive-value="1"></el-switch></td>
              <td><el-switch v-model="form['0051'].dangerAlarm" size="mini" :active-value="0" :inactive-value="1"></el-switch></td>
              <td><el-switch v-model="form['0052'].dangerAlarm" size="mini" :active-value="0" :inactive-value="1"></el-switch></td>
              <td><el-switch v-model="form['0053'].dangerAlarm" size="mini" :active-value="0" :inactive-value="1"></el-switch></td>
              <td><el-switch v-model="form['0054'].dangerAlarm" size="mini" :active-value="0" :inactive-value="1"></el-switch></td>
            </tr>
            <tr>
              <td>GNSS模块发生故障报警</td>
              <td><el-switch v-model="form['0050'].gnssError" size="mini" :active-value="0" :inactive-value="1"></el-switch></td>
              <td><el-switch v-model="form['0051'].gnssError" size="mini" :active-value="0" :inactive-value="1"></el-switch></td>
              <td><el-switch v-model="form['0052'].gnssError" size="mini" :active-value="0" :inactive-value="1"></el-switch></td>
              <td><el-switch v-model="form['0053'].gnssError" size="mini" :active-value="0" :inactive-value="1"></el-switch></td>
              <td><el-switch v-model="form['0054'].gnssError" size="mini" :active-value="0" :inactive-value="1"></el-switch></td>
            </tr>
            <tr>
              <td>GNSS天线未接或被剪断报警</td>
              <td><el-switch v-model="form['0050'].gnssWithoutRadome" size="mini" :active-value="0" :inactive-value="1"></el-switch></td>
              <td><el-switch v-model="form['0051'].gnssWithoutRadome" size="mini" :active-value="0" :inactive-value="1"></el-switch></td>
              <td><el-switch v-model="form['0052'].gnssWithoutRadome" size="mini" :active-value="0" :inactive-value="1"></el-switch></td>
              <td><el-switch v-model="form['0053'].gnssWithoutRadome" size="mini" :active-value="0" :inactive-value="1"></el-switch></td>
              <td><el-switch v-model="form['0054'].gnssWithoutRadome" size="mini" :active-value="0" :inactive-value="1"></el-switch></td>
            </tr>
            <tr>
              <td>GNSS天线短路报警</td>
              <td><el-switch v-model="form['0050'].gnssRadomeShortout" size="mini" :active-value="0" :inactive-value="1"></el-switch></td>
              <td><el-switch v-model="form['0051'].gnssRadomeShortout" size="mini" :active-value="0" :inactive-value="1"></el-switch></td>
              <td><el-switch v-model="form['0052'].gnssRadomeShortout" size="mini" :active-value="0" :inactive-value="1"></el-switch></td>
              <td><el-switch v-model="form['0053'].gnssRadomeShortout" size="mini" :active-value="0" :inactive-value="1"></el-switch></td>
              <td><el-switch v-model="form['0054'].gnssRadomeShortout" size="mini" :active-value="0" :inactive-value="1"></el-switch></td>
            </tr>
            <tr>
              <td>终端主电源欠压报警</td>
              <td><el-switch v-model="form['0050'].devicePowerUnderVoltage" size="mini" :active-value="0" :inactive-value="1"></el-switch></td>
              <td><el-switch v-model="form['0051'].devicePowerUnderVoltage" size="mini" :active-value="0" :inactive-value="1"></el-switch></td>
              <td><el-switch v-model="form['0052'].devicePowerUnderVoltage" size="mini" :active-value="0" :inactive-value="1"></el-switch></td>
              <td><el-switch v-model="form['0053'].devicePowerUnderVoltage" size="mini" :active-value="0" :inactive-value="1"></el-switch></td>
              <td><el-switch v-model="form['0054'].devicePowerUnderVoltage" size="mini" :active-value="0" :inactive-value="1"></el-switch></td>
            </tr>
          </table>
      </el-form>
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
    return {
      form:{},
      activeName:'first'
    }
  },
}
</script>

<style lang="less" scoped>
.basic-alarm {
  tr {
    height: 38px;
    td {
      text-align: center;
    }
    th {
      background: rgb(235, 235, 235)
    }
  }
}
</style>