<template>
    <div class="DSM-Algorithm">
        <div class="collapse-box">
            <el-form
                :label-width="`175px`"
                :model="customizeAlgorithm"
                :inline="true"
                ref="form"
            >
                <el-collapse v-model="activeCollapse">
                    <el-collapse-item
                        :title="
                            $t('intelligentParameterConfig.closedEyeFatigue')
                        "
                        name="closedEyeFatigue"
                        v-if="customizeAlgorithm.closedEyeFatigue"
                    >
                        <el-form-item
                            :label="
                                $t('intelligentParameterConfig.sensitivity')
                            "
                        >
                            <el-select
                                disabled
                                v-model="
                                    customizeAlgorithm.closedEyeFatigue
                                        .sensitivity
                                "
                            >
                                <el-option
                                    v-for="item in sensitivityList"
                                    :label="item.label"
                                    :value="item.value"
                                    :key="item.value"
                                ></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item
                            :label="
                                $t('intelligentParameterConfig.historyFatigue')
                            "
                        >
                            <el-switch
                                disabled
                                v-model="
                                    customizeAlgorithm.closedEyeFatigue
                                        .historyFatigue
                                "
                                :active-value="Number(1)"
                                :inactive-value="Number(0)"
                            ></el-switch>
                        </el-form-item>

                        <el-form-item
                            :label="
                                $t('intelligentParameterConfig.headPosture')
                            "
                        >
                            <el-switch
                                disabled
                                v-model="
                                    customizeAlgorithm.closedEyeFatigue
                                        .headPosture
                                "
                                :active-value="Number(1)"
                                :inactive-value="Number(0)"
                            ></el-switch>
                        </el-form-item>

                        <el-form-item
                            :label="
                                $t('intelligentParameterConfig.speakFilter')
                            "
                        >
                            <el-switch
                                disabled
                                v-model="
                                    customizeAlgorithm.closedEyeFatigue
                                        .speakFilter
                                "
                                :active-value="Number(1)"
                                :inactive-value="Number(0)"
                            ></el-switch>
                        </el-form-item>

                        <el-form-item
                            :label="
                                $t('intelligentParameterConfig.lowHeadFilter')
                            "
                        >
                            <el-switch
                                disabled
                                v-model="
                                    customizeAlgorithm.closedEyeFatigue
                                        .lowHeadFilter
                                "
                                :active-value="Number(1)"
                                :inactive-value="Number(0)"
                            ></el-switch>
                        </el-form-item>

                        <el-form-item
                            :label="
                                $t('intelligentParameterConfig.squintFilter')
                            "
                        >
                            <el-switch
                                disabled
                                v-model="
                                    customizeAlgorithm.closedEyeFatigue
                                        .squintFilter
                                "
                                :active-value="Number(1)"
                                :inactive-value="Number(0)"
                            ></el-switch>
                        </el-form-item>

                        <el-form-item
                            :label="
                                $t(
                                    'intelligentParameterConfig.nonFatigueActionFilter'
                                )
                            "
                        >
                            <el-switch
                                disabled
                                v-model="
                                    customizeAlgorithm.closedEyeFatigue
                                        .nonFatigueActionFilter
                                "
                                :active-value="Number(1)"
                                :inactive-value="Number(0)"
                            ></el-switch>
                        </el-form-item>

                        <el-form-item
                            :label="$t('intelligentParameterConfig.smallFace')"
                        >
                            <el-switch
                                disabled
                                v-model="
                                    customizeAlgorithm.closedEyeFatigue
                                        .smallFace
                                "
                                :active-value="Number(1)"
                                :inactive-value="Number(0)"
                            ></el-switch>
                        </el-form-item>

                        <el-form-item
                            :label="
                                $t(
                                    'intelligentParameterConfig.abnormalBrightness'
                                )
                            "
                        >
                            <el-switch
                                disabled
                                v-model="
                                    customizeAlgorithm.closedEyeFatigue
                                        .abnormalBrightness
                                "
                                :active-value="Number(1)"
                                :inactive-value="Number(0)"
                            ></el-switch>
                        </el-form-item>

                        <el-form-item
                            :label="$t('intelligentParameterConfig.eyeQuality')"
                        >
                            <el-switch
                                disabled
                                v-model="
                                    customizeAlgorithm.closedEyeFatigue
                                        .eyeQuality
                                "
                                :active-value="Number(1)"
                                :inactive-value="Number(0)"
                            ></el-switch>
                        </el-form-item>
                    </el-collapse-item>

                    <el-collapse-item
                        :title="$t('intelligentParameterConfig.yawn')"
                        name="yawn"
                        v-if="customizeAlgorithm.yawn"
                    >
                        <el-form-item
                            :label="
                                $t('intelligentParameterConfig.sensitivity')
                            "
                        >
                            <el-select
                                disabled
                                v-model="customizeAlgorithm.yawn.sensitivity"
                            >
                                <el-option
                                    v-for="item in sensitivityList"
                                    :label="item.label"
                                    :value="item.value"
                                    :key="item.value"
                                ></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item
                            :label="
                                $t('intelligentParameterConfig.speakFilter')
                            "
                        >
                            <el-switch
                                disabled
                                v-model="customizeAlgorithm.yawn.speakFilter"
                                :active-value="Number(1)"
                                :inactive-value="Number(0)"
                            ></el-switch>
                        </el-form-item>

                        <el-form-item
                            :label="
                                $t('intelligentParameterConfig.fatigueFilter')
                            "
                        >
                            <el-switch
                                disabled
                                v-model="customizeAlgorithm.yawn.fatigueFilter"
                                :active-value="Number(1)"
                                :inactive-value="Number(0)"
                            ></el-switch>
                        </el-form-item>

                        <el-form-item
                            :label="
                                $t(
                                    'intelligentParameterConfig.unrelatedActionFilter'
                                )
                            "
                        >
                            <el-switch
                                disabled
                                v-model="
                                    customizeAlgorithm.yawn
                                        .unrelatedActionFilter
                                "
                                :active-value="Number(1)"
                                :inactive-value="Number(0)"
                            ></el-switch>
                        </el-form-item>

                        <el-form-item
                            :label="
                                $t('intelligentParameterConfig.openMouthFilter')
                            "
                        >
                            <el-switch
                                disabled
                                v-model="
                                    customizeAlgorithm.yawn.openMouthFilter
                                "
                                :active-value="Number(1)"
                                :inactive-value="Number(0)"
                            ></el-switch>
                        </el-form-item>
                    </el-collapse-item>

                    <el-collapse-item
                        :title="$t('intelligentParameterConfig.phoneCall')"
                        name="phoneCall"
                        v-if="customizeAlgorithm.phoneCall"
                    >
                        <el-form-item
                            :label="
                                $t('intelligentParameterConfig.sensitivity')
                            "
                        >
                            <el-select
                                disabled
                                v-model="
                                    customizeAlgorithm.phoneCall.sensitivity
                                "
                            >
                                <el-option
                                    v-for="item in sensitivityList"
                                    :label="item.label"
                                    :value="item.value"
                                    :key="item.value"
                                ></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item
                            :label="
                                $t(
                                    'intelligentParameterConfig.phoneLocationFilter'
                                )
                            "
                        >
                            <el-switch
                                disabled
                                v-model="
                                    customizeAlgorithm.phoneCall
                                        .phoneLocationFilter
                                "
                                :active-value="Number(1)"
                                :inactive-value="Number(0)"
                            ></el-switch>
                        </el-form-item>

                        <el-form-item
                            :label="
                                $t(
                                    'intelligentParameterConfig.interPhoneFilter'
                                )
                            "
                        >
                            <el-switch
                                disabled
                                v-model="
                                    customizeAlgorithm.phoneCall
                                        .interPhoneFilter
                                "
                                :active-value="Number(1)"
                                :inactive-value="Number(0)"
                            ></el-switch>
                        </el-form-item>

                        <el-form-item
                            :label="
                                $t('intelligentParameterConfig.chewAndDrink')
                            "
                        >
                            <el-switch
                                disabled
                                v-model="
                                    customizeAlgorithm.phoneCall.chewAndDrink
                                "
                                :active-value="Number(1)"
                                :inactive-value="Number(0)"
                            ></el-switch>
                        </el-form-item>
                    </el-collapse-item>

                    <el-collapse-item
                        :title="$t('intelligentParameterConfig.smoking')"
                        name="smoking"
                        v-if="customizeAlgorithm.smoking"
                    >
                        <el-form-item
                            :label="
                                $t('intelligentParameterConfig.sensitivity')
                            "
                        >
                            <el-select
                                disabled
                                v-model="customizeAlgorithm.smoking.sensitivity"
                            >
                                <el-option
                                    v-for="item in sensitivityList"
                                    :label="item.label"
                                    :value="item.value"
                                    :key="item.value"
                                ></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item
                            :label="
                                $t(
                                    'intelligentParameterConfig.handheldCigarette'
                                )
                            "
                        >
                            <el-switch
                                disabled
                                v-model="
                                    customizeAlgorithm.smoking.handheldCigarette
                                "
                                :active-value="Number(1)"
                                :inactive-value="Number(0)"
                            ></el-switch>
                        </el-form-item>

                        <el-form-item
                            :label="
                                $t(
                                    'intelligentParameterConfig.smallAndmouthIntersect'
                                )
                            "
                        >
                            <el-switch
                                disabled
                                v-model="
                                    customizeAlgorithm.smoking
                                        .smallAndmouthIntersect
                                "
                                :active-value="Number(1)"
                                :inactive-value="Number(0)"
                            ></el-switch>
                        </el-form-item>

                        <el-form-item
                            :label="
                                $t('intelligentParameterConfig.chewAndDrink')
                            "
                        >
                            <el-switch
                                disabled
                                v-model="
                                    customizeAlgorithm.smoking.chewAndDrink
                                "
                                :active-value="Number(1)"
                                :inactive-value="Number(0)"
                            ></el-switch>
                        </el-form-item>
                    </el-collapse-item>

                    <el-collapse-item
                        :title="$t('intelligentParameterConfig.distraction')"
                        name="distraction"
                        v-if="customizeAlgorithm.distraction"
                    >
                        <el-form-item
                            :label="
                                $t('intelligentParameterConfig.sensitivity')
                            "
                        >
                            <el-select
                                disabled
                                v-model="
                                    customizeAlgorithm.distraction.sensitivity
                                "
                            >
                                <el-option
                                    v-for="item in sensitivityList"
                                    :label="item.label"
                                    :value="item.value"
                                    :key="item.value"
                                ></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item
                            :label="
                                $t(
                                    'intelligentParameterConfig.unrelatedActionFilter'
                                )
                            "
                        >
                            <el-switch
                                disabled
                                v-model="
                                    customizeAlgorithm.distraction
                                        .unrelatedActionFilter
                                "
                                :active-value="Number(1)"
                                :inactive-value="Number(0)"
                            ></el-switch>
                        </el-form-item>

                        <el-form-item
                            :label="
                                $t('intelligentParameterConfig.touchFaceFilter')
                            "
                        >
                            <el-switch
                                disabled
                                v-model="
                                    customizeAlgorithm.distraction
                                        .touchFaceFilter
                                "
                                :active-value="Number(1)"
                                :inactive-value="Number(0)"
                            ></el-switch>
                        </el-form-item>

                        <el-form-item
                            :label="
                                $t('intelligentParameterConfig.drinkingFilter')
                            "
                        >
                            <el-switch
                                disabled
                                v-model="
                                    customizeAlgorithm.distraction
                                        .drinkingFilter
                                "
                                :active-value="Number(1)"
                                :inactive-value="Number(0)"
                            ></el-switch>
                        </el-form-item>
                    </el-collapse-item>

                    <el-collapse-item
                        :title="$t('intelligentParameterConfig.seatbelt')"
                        name="seatbelt"
                        v-if="customizeAlgorithm.seatbelt"
                    >
                        <el-form-item
                            :label="
                                $t('intelligentParameterConfig.sensitivity')
                            "
                        >
                            <el-select
                                disabled
                                v-model="
                                    customizeAlgorithm.seatbelt.sensitivity
                                "
                            >
                                <el-option
                                    v-for="item in sensitivityList"
                                    :label="item.label"
                                    :value="item.value"
                                    :key="item.value"
                                ></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item
                            :label="
                                $t('intelligentParameterConfig.facePosition')
                            "
                        >
                            <el-switch
                                disabled
                                v-model="
                                    customizeAlgorithm.seatbelt.facePosition
                                "
                                :active-value="Number(1)"
                                :inactive-value="Number(0)"
                            ></el-switch>
                        </el-form-item>

                        <el-form-item
                            :label="$t('intelligentParameterConfig.faceSize')"
                        >
                            <el-switch
                                disabled
                                v-model="customizeAlgorithm.seatbelt.faceSize"
                                :active-value="Number(1)"
                                :inactive-value="Number(0)"
                            ></el-switch>
                        </el-form-item>

                        <el-form-item
                            :label="$t('intelligentParameterConfig.faceAngle')"
                        >
                            <el-switch
                                disabled
                                v-model="customizeAlgorithm.seatbelt.faceAngle"
                                :active-value="Number(1)"
                                :inactive-value="Number(0)"
                            ></el-switch>
                        </el-form-item>

                        <el-form-item
                            :label="
                                $t('intelligentParameterConfig.faceBrightness')
                            "
                        >
                            <el-switch
                                disabled
                                v-model="
                                    customizeAlgorithm.seatbelt.faceBrightness
                                "
                                :active-value="Number(1)"
                                :inactive-value="Number(0)"
                            ></el-switch>
                        </el-form-item>

                        <el-form-item
                            :label="$t('intelligentParameterConfig.shoulder')"
                        >
                            <el-switch
                                disabled
                                v-model="customizeAlgorithm.seatbelt.shoulder"
                                :active-value="Number(1)"
                                :inactive-value="Number(0)"
                            ></el-switch>
                        </el-form-item>
                    </el-collapse-item>
                </el-collapse>
            </el-form>
        </div>
    </div>
</template>
<script>
export default {
    name: "",
    components: {},
    props: {
        detailData: {
            type: Object,
            default: () => {},
        },
    },
    data() {
        return {
            activeCollapse: [],
            customizeAlgorithm: {},
            sensitivityList: [
                {
                    label: "低",
                    value: 0,
                },
                {
                    label: "中",
                    value: 1,
                },
                {
                    label: "高",
                    value: 2,
                },
            ],
        };
    },
    mounted() {
        this.getIntelligentParamByDriverId();
    },
    computed: {},
    watch: {},
    methods: {
        getIntelligentParamByDriverId() {
            this.$api
                .getIntelligentParamByDriverId({
                    driverId: this.detailData.driverId,
                })
                .then((res) => {
                    if (res.success == true) {
                        this.customizeAlgorithm = res.data;
                        Object.keys(this.customizeAlgorithm).forEach((key) => {
                            this.activeCollapse.push(key);
                        });
                    } else {
                        this.$message.error(res.msg);
                    }
                });
        },
        editDriverLabelConfigSensitivity() {
            this.$api
                .editDriverLabelConfigSensitivity({
                    driverId: this.detailData.driverId,
                    sentivityType: this.customizeAlgorithm.sentivityType,
                })
                .then((res) => {
                    if (res.success == true) {
                        this.$message.success(
                            this.$t("common.modifiedSuccess")
                        );
                        this.$emit("closeDialog");
                    } else {
                        this.$message.error(res.msg);
                    }
                });
        },
    },
};
</script>
<style lang="less" scoped>
@import "./../protocolConfiguration/components/configuration/configurationForm/configurationForm.less";
/deep/.el-collapse {
    .el-collapse-item__content {
        padding-top: 20px;
    }
}
.DSM-Algorithm {
    padding-right: 12px;
    height: 500px;
    .form-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 0;
        & > span {
            font-size: 14px;
            font-weight: bold;
            line-height: 27px;
        }
    }
    .collapse-box {
        height: 500px;
        overflow-y: auto;
    }
}
</style>
