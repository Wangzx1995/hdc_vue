<template>
  <div class="p-a-md">
    <h2>基本设置</h2>
    <el-form ref="PublicVedioParams"
             label-position="top"
             :model="form"
             label-width="120px"
             style="margin-top: 10px"
             :rules="rules">
      <el-row type="flex"
              justify="space-between">
        <el-col :span="7">
          <el-form-item label="特殊报警录像存储阈值（1-99）"
                        prop="0079.storeThreshold">
            <el-input v-model="form['0079'].storeThreshold"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="特殊报警录像持续时间"
                        prop="0079.durationTime">
            <el-input v-model="form['0079'].durationTime"><span slot="suffix">min</span></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="特殊报警标识起始时间"
                        prop="0079.startTime">
            <el-input v-model="form['0079'].startTime"><span slot="suffix">min</span></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { validateNum } from '@/utils/validate';
export default {
  props: {
    detail: {
      type: Object,
      default: () => ({})
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
    form: {
      handler(val) {
        if (JSON.stringify(val) !== '{}') {
          this.$emit('change', val)
        }
      },
      deep: true,
      immediate: true
    }
  },
  data() {
    const checkNumber = function (rule, value, callback) {
      if (value !== '' && value !== null && value !== undefined) {
        if (!validateNum(value)) {
          callback(new Error('请输入正确的整数'));
        } else if (value < this.min) {
          callback(new Error(`最小值为${this.min}`));
        } else if (value > this.max) {
          callback(new Error(`最大值为${this.max}`));
        } else if ((this.type == 'short' && value > 32767) || (this.type == 'byte' && value > 127) || (this.type == 'int' && value > Math.pow(2, 31) - 1)) {
          callback(new Error('输入的数值超出有效范围'));
        } else {
          callback();
        }
      } else {
        // callback(new Error("请输入"));
        callback();
      }
    };
    return {
      form: {},
      rules: {
        '0079.storeThreshold': [{ validator: checkNumber.bind({ type: 'byte', min: 1, max: 99 }), trigger: 'blur' }],
        '0079.durationTime': [{ validator: checkNumber.bind({ type: 'byte', min: 0, max: 127 }), trigger: 'blur' }],
        '0079.startTime': [{ validator: checkNumber.bind({ type: 'byte', min: 0, max: 127 }), trigger: 'blur' }]
      }
    }
  }
}
</script>

<style scoped>
</style>