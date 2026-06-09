<template>
    <div class="p-a-md">
        <h2>基本设置</h2>
        <el-form
            ref="TeleNumber"
            label-position="top"
            :model="form"
            label-width="120px"
            style="margin-top: 10px"
        >
            <div class="configurations">
                <div v-if="form['0040']" class="configuration-item">
                    <el-form-item label="监控平台电话号码">
                        <el-input
                            v-model="form['0040'].regulatoryPlatformPhoneNum"
                        ></el-input>
                    </el-form-item>
                </div>
                <div v-if="form['0041']" class="configuration-item">
                    <el-form-item>
                        <span slot="label" class="label-slot"
                            >复位电话号码
                            <el-tooltip content="可采用此电话号码拨打终端电话让终端复位">
                                <i class="el-icon-question"></i> </el-tooltip
                        ></span>
                        <el-input
                            v-model="form['0041'].resetPhoneNum"
                        ></el-input>
                    </el-form-item>
                </div>
                <div v-if="form['0042']" class="configuration-item">
                    <el-form-item>
                        <span slot="label" class="label-slot"
                            >恢复出厂设置电话号码
                            <el-tooltip content="可采用此电话号码拨打终端电话让终端恢复出厂设置">
                                <i class="el-icon-question"></i> </el-tooltip
                        ></span>
                        <el-input
                            v-model="
                                form['0042'].restoreFactorySettingsPhoneNum
                            "
                        ></el-input>
                    </el-form-item>
                </div>
                <div v-if="form['0043']" class="configuration-item">
                    <el-form-item label="监控平台SMS电话号码">
                        <el-input
                            v-model="form['0043'].regulatoryPlatformSMSPhoneNum"
                        ></el-input>
                    </el-form-item>
                </div>
                <div v-if="form['0044']" class="configuration-item">
                    <el-form-item label="接收终端SMS文本报警号码">
                        <el-input
                            v-model="form['0044'].deviceSMSTextAlarmNum"
                        ></el-input>
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
                <el-col :span="7" >
                    
                </el-col>
                <el-col :span="7" >
                    
                </el-col>
                <el-col :span="7"></el-col>
            </el-row> -->
        </el-form>
    </div>
</template>

<script>
export default {
    props: {
        detail: {
            type: Object,
            default: () => {
                return {};
            },
        },
    },
    watch: {
        detail: {
            handler(newVal, oldVal) {
                this.form = newVal;
            },
            deep: true,
            immediate: true,
        },
        form: {
            handler(val) {
                if (JSON.stringify(val) !== "{}") {
                    this.$emit("change", val);
                }
            },
            deep: true,
            immediate: true,
        },
    },
    data() {
        return {
            form: {},
        };
    },
};
</script>

<style scoped></style>
