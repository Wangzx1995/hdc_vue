<template>
    <div class="configuration-form">
        <el-form
            :label-width="`${labelWidth}px`"
            :model="newForm"
            :inline="true"
            ref="form"
        >
            <el-radio-group type="simple" v-model="chanNoActive">
                <el-radio-button
                    v-for="(item, index) in VSDList"
                    :key="index"
                    :label="`通道${item.chanNo}`"
                />
            </el-radio-group>
            <div>
                <div v-for="(chanNoItem, index) in VSDList" :key="index">
                    <div v-show="`通道${chanNoItem.chanNo}` === chanNoActive">
                        <div
                            v-if="
                                newForm[
                                    `param989_${chanNoItem.chanNo}_${firstType}`
                                ]
                            "
                        >
                            <h3>VSD全局参数</h3>
                            <el-form-item
                                label="VSD算法使能"
                                v-if="
                                    newForm[
                                        `param989_${chanNoItem.chanNo}_${firstType}`
                                    ].hasOwnProperty('enable')
                                "
                            >
                                <h-switch
                                    v-model="
                                        newForm[
                                            `param989_${chanNoItem.chanNo}_${firstType}`
                                        ].enable
                                    "
                                    :active-value="Number(1)"
                                    :inactive-value="Number(0)"
                                    :before-change="
                                        (value, done) =>
                                            beforeChange(value, done)
                                    "
                                    @change="
                                        (val) => enableChange(val, chanNoItem)
                                    "
                                ></h-switch>
                            </el-form-item>
                        </div>
                        <el-collapse
                            v-if="
                                newForm[
                                    `param989_${chanNoItem.chanNo}_${firstType}`
                                ] &&
                                newForm[
                                    `param989_${chanNoItem.chanNo}_${firstType}`
                                ].enable
                            "
                            v-model="activeCollapse"
                            @change="collapseChange"
                        >
                            <el-collapse-item
                                v-for="(infoItem, key) in chanNoItem.info"
                                :key="key"
                                :title="key.split('-')[1]"
                                :name="key.split('-')[1]"
                                arrowPlacement="right"
                                :class="{
                                    'template-hide': setTemplateHide(
                                        chanNoItem,
                                        infoItem
                                    ),
                                }"
                            >
                                <div
                                    v-for="(levelItem, index2) in infoItem"
                                    :key="index2"
                                >
                                    <template
                                        v-if="
                                            newForm[
                                                `param989_${chanNoItem.chanNo}_${levelItem.type}`
                                            ]
                                        "
                                    >
                                        <h3>
                                            {{
                                                index2 === 0
                                                    ? "一级报警"
                                                    : "二级报警"
                                            }}
                                            <template
                                                v-if="
                                                    infoItem.length > 1 &&
                                                    levelItem.speed
                                                "
                                            >
                                                <i class="el-icon-warning"></i>
                                                <span class="warning-msg"
                                                    >二级报警的判断速度阈值必须比一级报警的判断速度阈值≥20</span
                                                >
                                            </template>
                                        </h3>
                                        <el-form-item
                                            label="报警使能"
                                            v-if="levelItem.enable"
                                        >
                                            <el-switch
                                                v-model="
                                                    newForm[
                                                        `param989_${chanNoItem.chanNo}_${levelItem.type}`
                                                    ].info[0].enable
                                                "
                                                :active-value="Number(1)"
                                                :inactive-value="Number(0)"
                                            ></el-switch>
                                        </el-form-item>
                                        <el-form-item
                                            label="报警判断速度阈值"
                                            v-if="levelItem.speed"
                                        >
                                            <el-input-number
                                                :precision="0"
                                                controls-position="right"
                                                v-model="
                                                    newForm[
                                                        `param989_${chanNoItem.chanNo}_${levelItem.type}`
                                                    ].info[0].speed
                                                "
                                                :min="levelItem.speed.min"
                                                :max="levelItem.speed.max"
                                                @change="
                                                    (e) =>
                                                        speedBlur(
                                                            chanNoItem,
                                                            key
                                                        )
                                                "
                                                data-unit="km/h"
                                                @blur="
                                                    (e) => {
                                                        if (
                                                            e.target.value ===
                                                            ''
                                                        ) {
                                                            newForm[
                                                                `param989_${chanNoItem.chanNo}_${levelItem.type}`
                                                            ].info[0].speed =
                                                                Number(
                                                                    e.target
                                                                        .ariaValueMin
                                                                );
                                                        }
                                                    }
                                                "
                                            ></el-input-number>
                                        </el-form-item>
                                        <el-form-item
                                            label="音量使能"
                                            v-if="levelItem.volumeEnable"
                                        >
                                            <el-switch
                                                v-model="
                                                    newForm[
                                                        `param989_${chanNoItem.chanNo}_${levelItem.type}`
                                                    ].info[0].volumeEnable
                                                "
                                                :active-value="Number(1)"
                                                :inactive-value="Number(0)"
                                            ></el-switch>
                                        </el-form-item>
                                        <el-form-item
                                            label="算法置信度"
                                            v-if="levelItem.confidence"
                                        >
                                            <span
                                                slot="label"
                                                class="label-slot"
                                                >算法置信度
                                                <el-tooltip
                                                    content="置信度越高，检出越低检准越高"
                                                >
                                                    <i
                                                        class="el-icon-question"
                                                    ></i> </el-tooltip
                                            ></span>
                                            <el-select
                                                v-model="
                                                    newForm[
                                                        `param989_${chanNoItem.chanNo}_${levelItem.type}`
                                                    ].info[0].confidence
                                                "
                                            >
                                                <el-option
                                                    v-for="item in levelItem.confidenceList"
                                                    :label="item.label"
                                                    :value="item.value"
                                                    :key="item.value"
                                                ></el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item
                                            label="算法灵敏度"
                                            introduction="灵敏度越高越容易触发报警"
                                            v-if="levelItem.sensitivity"
                                        >
                                            <span
                                                slot="label"
                                                class="label-slot"
                                                >算法灵敏度
                                                <el-tooltip
                                                    content="灵敏度越高越容易触发报警"
                                                >
                                                    <i
                                                        class="el-icon-question"
                                                    ></i> </el-tooltip
                                            ></span>
                                            <el-select
                                                v-model="
                                                    newForm[
                                                        `param989_${chanNoItem.chanNo}_${levelItem.type}`
                                                    ].info[0].sensitivity
                                                "
                                            >
                                                <el-option
                                                    v-for="item in levelItem.sensitivityList"
                                                    :label="item.label"
                                                    :value="item.value"
                                                    :key="item.value"
                                                ></el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item
                                            label="报警图片上传使能"
                                            v-if="
                                                levelItem.snapshot &&
                                                levelItem.snapshot.upload
                                            "
                                        >
                                            <el-switch
                                                v-model="
                                                    newForm[
                                                        `param989_${chanNoItem.chanNo}_${levelItem.type}`
                                                    ].info[0].snapshot.upload
                                                "
                                                :active-value="Number(1)"
                                                :inactive-value="Number(0)"
                                                @change="
                                                    (val) =>
                                                        uploadChange(
                                                            val,
                                                            'snapshot',
                                                            chanNoItem.chanNo,
                                                            levelItem.type
                                                        )
                                                "
                                            ></el-switch>
                                        </el-form-item>
                                        <el-form-item
                                            label="报警视频上传使能"
                                            v-if="
                                                levelItem.clip &&
                                                levelItem.clip.upload
                                            "
                                        >
                                            <el-switch
                                                v-model="
                                                    newForm[
                                                        `param989_${chanNoItem.chanNo}_${levelItem.type}`
                                                    ].info[0].clip.upload
                                                "
                                                :active-value="Number(1)"
                                                :inactive-value="Number(0)"
                                                @change="
                                                    (val) =>
                                                        uploadChange(
                                                            val,
                                                            'clip',
                                                            chanNoItem.chanNo,
                                                            levelItem.type
                                                        )
                                                "
                                            ></el-switch>
                                        </el-form-item>
                                    </template>
                                </div>
                            </el-collapse-item>
                        </el-collapse>
                    </div>
                </div>
            </div>
        </el-form>
        <div id="id" style="width: 0; height: 0"></div>
    </div>
</template>
<script>
import mixins from "@/mixins/mixins";
export default {
    name: "VSD-Params",
    mixins: [mixins],
    props: {},
    data() {
        return {
            isPlugin: false,
            componentsName: "platformParams",
            setForm: {},
            chanNoActive: "",
            VSDList: [],
            activeCollapse: [],
            openSurveyBol: false,
            dialogClick: false,
            noneVideoPlay: false, // 是否显示控件
            notLastVerson: false,
            surveyObj: {},
            playUrl: "",
            typeObj: {},
            firstType: null,
        };
    },
    activated() {
        this.$nextTick(() => {
            this.labelWidthResize();
        });
    },
    mounted() {
        this.initConfig();
    },
    computed: {
        setTemplateHide() {
            return function (chanNoItem, infoItem) {
                if (this.isTemplate || this.$route.query.isTemplate) {
                    let bol = false;
                    infoItem.forEach((infoItem) => {
                        if (
                            this.newForm[
                                `param989_${chanNoItem.chanNo}_${infoItem.type}`
                            ]
                        ) {
                            bol = true;
                        }
                    });
                    return !bol;
                } else {
                    return false;
                }
            };
        },
    },
    watch: {
        chanNoActive(val) {
            this.activeCollapse = [];
            let obj = this.VSDList.find(
                (item) => item.chanNo == Number(val.split("通道")[1])
            );
            for (let key of Object.keys(obj.info)) {
                if (!this.activeCollapse.length) {
                    this.activeCollapse.push(key.split("-")[1]);
                }
            }
        },
        newForm: {
            handler(val) {
                if (val) {
                    this.VSDList.forEach((chanNoItem) => {
                        let _type = Object.entries(chanNoItem.info)[0][0].split(
                            "-"
                        )[0];
                        if (val[`param989_${chanNoItem.chanNo}_${_type}`]) {
                            if (
                                !this.setForm.hasOwnProperty(
                                    `通道${chanNoItem.chanNo}>VSD全局参数&param989_${chanNoItem.chanNo}_${_type}`
                                )
                            ) {
                                this.setForm[
                                    `通道${chanNoItem.chanNo}>VSD全局参数&param989_${chanNoItem.chanNo}_${_type}`
                                ] = {};
                            }
                            this.setForm[
                                `通道${chanNoItem.chanNo}>VSD全局参数&param989_${chanNoItem.chanNo}_${_type}`
                            ].enable =
                                val[`param989_${chanNoItem.chanNo}_${_type}`]
                                    .enable !=
                                this.oldForm[
                                    `param989_${chanNoItem.chanNo}_${_type}`
                                ].enable
                                    ? `param989_${
                                          chanNoItem.chanNo
                                      }_${_type}.enable&VSD算法使能switch&${
                                          val[
                                              `param989_${chanNoItem.chanNo}_${_type}`
                                          ].enable
                                      }`
                                    : null;
                        }
                        for (let typeName of Object.keys(chanNoItem.info)) {
                            chanNoItem.info[typeName].forEach((typeItem) => {
                                if (
                                    val[
                                        `param989_${chanNoItem.chanNo}_${typeItem.type}`
                                    ]
                                ) {
                                    let paramStr = `param989_${chanNoItem.chanNo}_${typeItem.type}`;
                                    let objName = `通道${
                                        chanNoItem.chanNo
                                    }>${this.getLabelByType(
                                        typeItem.type
                                    )}&${paramStr}`;
                                    if (!this.setForm.hasOwnProperty(objName)) {
                                        this.setForm[objName] = {
                                            info: [{ snapshot: {}, clip: {} }],
                                        };
                                    }
                                    this.setForm[objName].info[0].enable =
                                        val[paramStr].info[0].enable !=
                                            this.oldForm[paramStr].info[0]
                                                .enable ||
                                        (this.isTemplate &&
                                            val[
                                                paramStr
                                            ].info[0].hasOwnProperty("enable"))
                                            ? `${paramStr}.info.0.enable&报警使能switch&${val[paramStr].info[0].enable}`
                                            : null;
                                    this.setForm[objName].info[0].speed =
                                        val[paramStr].info[0].speed !=
                                            this.oldForm[paramStr].info[0]
                                                .speed ||
                                        (this.isTemplate &&
                                            val[
                                                paramStr
                                            ].info[0].hasOwnProperty("speed"))
                                            ? `${paramStr}.info.0.speed&报警判断速度阈值&${val[paramStr].info[0].speed}`
                                            : null;
                                    this.setForm[objName].info[0].volumeEnable =
                                        val[paramStr].info[0].volumeEnable !=
                                            this.oldForm[paramStr].info[0]
                                                .volumeEnable ||
                                        (this.isTemplate &&
                                            val[
                                                paramStr
                                            ].info[0].hasOwnProperty(
                                                "volumeEnable"
                                            ))
                                            ? `${paramStr}.info.0.volumeEnable&音量使能switch&${val[paramStr].info[0].volumeEnable}`
                                            : null;
                                    this.setForm[objName].info[0].confidence =
                                        val[paramStr].info[0].confidence !=
                                            this.oldForm[paramStr].info[0]
                                                .confidence ||
                                        (this.isTemplate &&
                                            val[
                                                paramStr
                                            ].info[0].hasOwnProperty(
                                                "confidence"
                                            ))
                                            ? `${paramStr}.info.0.confidence&算法置信度&${this.getLabelSelf(
                                                  typeItem.confidenceList,
                                                  val[paramStr].info[0]
                                                      .confidence
                                              )}&${
                                                  val[paramStr].info[0]
                                                      .confidence
                                              }`
                                            : null;
                                    this.setForm[objName].info[0].sensitivity =
                                        val[paramStr].info[0].sensitivity !=
                                            this.oldForm[paramStr].info[0]
                                                .sensitivity ||
                                        (this.isTemplate &&
                                            val[
                                                paramStr
                                            ].info[0].hasOwnProperty(
                                                "sensitivity"
                                            ))
                                            ? `${paramStr}.info.0.sensitivity&算法灵敏度&${this.getLabelSelf(
                                                  typeItem.sensitivityList,
                                                  val[paramStr].info[0]
                                                      .sensitivity
                                              )}&${
                                                  val[paramStr].info[0]
                                                      .sensitivity
                                              }`
                                            : null;
                                    if (
                                        val[paramStr].info[0].hasOwnProperty(
                                            "snapshot"
                                        )
                                    ) {
                                        this.setForm[
                                            objName
                                        ].info[0].snapshot.upload =
                                            val[paramStr].info[0].snapshot
                                                .upload !=
                                                this.oldForm[paramStr].info[0]
                                                    .snapshot.upload ||
                                            (this.isTemplate &&
                                                val[
                                                    paramStr
                                                ].info[0].snapshot.hasOwnProperty(
                                                    "upload"
                                                ))
                                                ? `${paramStr}.info.0.snapshot.upload&报警图片上传使能switch&${val[paramStr].info[0].snapshot.upload}`
                                                : null;
                                    }
                                    if (
                                        val[paramStr].info[0].hasOwnProperty(
                                            "clip"
                                        )
                                    ) {
                                        this.setForm[
                                            objName
                                        ].info[0].clip.upload =
                                            val[paramStr].info[0].clip.upload !=
                                                this.oldForm[paramStr].info[0]
                                                    .clip.upload ||
                                            (this.isTemplate &&
                                                val[
                                                    paramStr
                                                ].info[0].clip.hasOwnProperty(
                                                    "upload"
                                                ))
                                                ? `${paramStr}.info.0.clip.upload&报警视频上传使能switch&${val[paramStr].info[0].clip.upload}`
                                                : null;
                                    }
                                }
                            });
                        }
                    });
                    this.$emit("setFormChange", {
                        VSD: this.setForm,
                    });
                }
            },
            deep: true,
            immediate: true,
        },
    },
    methods: {
        initConfig() {
            this.$emit("setFormLoading", true);
            let initConfigList = [];
            this.VSDList = [];
            this.chanNoActive = `通道${this.capability.intelliDrive_VSD[0].chanNo}`;
            this.capability.intelliDrive_VSD.forEach((chanNoItem) => {
                initConfigList.push(
                    this.getEHomeConfig(
                        989,
                        {
                            type: "",
                            chanNo: chanNoItem.chanNo,
                        },
                        "VSD"
                    )
                );
                let obj = {
                    chanNo: chanNoItem.chanNo,
                    info: {},
                };
                chanNoItem.info.forEach((infoItem) => {
                    /* --------------------算法灵敏度 start-------------------------*/
                    infoItem.sensitivityList = [];
                    if (infoItem.sensitivity) {
                        // let sensitivityRange =
                        //     infoItem.sensitivity.max - infoItem.sensitivity.min;
                        // let sensitivityLow =
                        //     infoItem.sensitivity.min +
                        //     parseInt(sensitivityRange / 6);
                        // let sensitivityMiddle =
                        //     infoItem.sensitivity.min +
                        //     parseInt(sensitivityRange / 2);
                        // let sensitivityHigh =
                        //     infoItem.sensitivity.min +
                        //     parseInt((sensitivityRange * 5) / 6);
                        // infoItem.sensitivityRange = sensitivityRange;
                        infoItem.sensitivityList = [
                            {
                                value: 1,
                                label: "低",
                            },
                            {
                                value: 2,
                                label: "中",
                            },
                            {
                                value: 3,
                                label: "高",
                            },
                        ];
                    }
                    /* --------------------算法灵敏度 end-------------------------*/
                    /* --------------------算法置信度 start-------------------------*/
                    infoItem.confidenceList = [];
                    if (infoItem.confidence) {
                        // let confidenceRange =
                        //     infoItem.confidence.max - infoItem.confidence.min;
                        // let confidenceLow =
                        //     infoItem.confidence.min +
                        //     parseInt(confidenceRange / 6);
                        // let confidenceMiddle =
                        //     infoItem.confidence.min +
                        //     parseInt(confidenceRange / 2);
                        // let confidenceHigh =
                        //     infoItem.confidence.min +
                        //     parseInt((confidenceRange * 5) / 6);
                        // infoItem.confidenceRange = confidenceRange;
                        infoItem.confidenceList = [
                            {
                                value: 1,
                                label: "低",
                            },
                            {
                                value: 2,
                                label: "中",
                            },
                            {
                                value: 3,
                                label: "高",
                            },
                        ];
                    }
                    /* --------------------算法置信度 end-------------------------*/
                    for (let key of Object.keys(
                        this.enumerationJSON["intelliDrive_VSD_type"]
                    )) {
                        if (
                            this.enumerationJSON["intelliDrive_VSD_type"][
                                key
                            ].indexOf(infoItem.type) > -1
                        ) {
                            if (!obj.info.hasOwnProperty(key)) {
                                obj.info[key] = [];
                            }
                            obj.info[key].push(infoItem);
                            if (!this.activeCollapse.length) {
                                this.activeCollapse.push(key.split("-")[1]);
                            }
                        }
                    }
                    initConfigList.push(
                        this.getEHomeConfig(
                            989,
                            {
                                type: infoItem.type,
                                chanNo: chanNoItem.chanNo,
                            },
                            "VSD"
                        )
                    );
                });
                this.VSDList.push(obj);
            });
            Promise.all(initConfigList).then((result) => {
                this.$emit("setFormLoading", false);
                this.$emit("loadingSuccess");
                this.typeObj = {};
                this.VSDList.forEach((item) => {
                    this.typeObj[item.chanNo] = Object.entries(
                        item.info
                    ).reduce((prev, cur) => {
                        let arr = [];
                        cur[1].forEach((k) => {
                            arr.push(k.type);
                        });
                        return prev.concat(arr);
                    }, []);
                });
                let chanNo = this.chanNoActive.split("通道")[1];
                this.firstType = Number(
                    this.typeObj[chanNo].find((type) => {
                        if (this.newForm[`param989_${chanNo}_${type}`]) {
                            return type;
                        }
                    })
                );
                for (let key of Object.keys(
                    this.enumerationJSON["intelliDrive_VSD_type"]
                )) {
                    if (
                        this.enumerationJSON["intelliDrive_VSD_type"][
                            key
                        ].indexOf(this.firstType) > -1 &&
                        !this.activeCollapse.length
                    ) {
                        this.activeCollapse.push(key.split("-")[1]);
                    }
                }
            });
        },
        getLabelByType(type) {
            let label = "";
            for (let key of Object.keys(
                this.enumerationJSON["intelliDrive_VSD_type"]
            )) {
                let index =
                    this.enumerationJSON["intelliDrive_VSD_type"][key].indexOf(
                        type
                    );
                if (index === 0) {
                    label = key + ">一级报警";
                } else if (index === 1) {
                    label = key + ">二级报警";
                }
            }
            return label.split("-")[1];
        },
        getLabelSelf(arr, val) {
            let attribute = arr.find((e) => e.value === val);
            if (attribute) {
                return attribute.label;
            } else {
                return null;
            }
        },
        collapseChange(val) {
            if (val.length) {
                setTimeout(() => {
                    this.labelWidthResize();
                }, 300);
            }
        },
        speedBlur(chanNoItem, key) {
            if (chanNoItem.info[key].length > 1 && !this.isTemplate) {
                if (
                    this.newForm[
                        `param989_${chanNoItem.chanNo}_${chanNoItem.info[key][1].type}`
                    ].info[0].speed -
                        this.newForm[
                            `param989_${chanNoItem.chanNo}_${chanNoItem.info[key][0].type}`
                        ].info[0].speed <
                    20
                ) {
                    this.$message.error(
                        `${
                            key.split("-")[1]
                        }一级报警与二级报警报警判断速度阈值小于20！`
                    );
                }
            }
        },
        uploadChange(val, attr, chanNo, type) {
            this.newForm[`param989_${chanNo}_${type}`].info[0][attr].save = val;
            this.$emit("formDataChange", `param989_${chanNo}_${type}`, {
                ...this.newForm[`param989_${chanNo}_${type}`],
            });
        },
        beforeChange(value, done) {
            if (value === 1) {
                this.$confirm(
                    "算法使能关闭后算法将不再运行，本次修改的报警项配置不再保留。",
                    "确定要关闭VSD算法使能吗？",
                    {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning",
                    }
                )
                    .then(() => {
                        let chanNo = this.chanNoActive.split("通道")[1];
                        this.VSDList.forEach((chanNoItem) => {
                            if (Number(chanNoItem.chanNo) === Number(chanNo)) {
                                for (let typeName of Object.keys(
                                    chanNoItem.info
                                )) {
                                    chanNoItem.info[typeName].forEach(
                                        (typeItem) => {
                                            if (
                                                this.newForm[
                                                    `param989_${chanNo}_${typeItem.type}`
                                                ] &&
                                                this.oldForm[
                                                    `param989_${chanNo}_${typeItem.type}`
                                                ]
                                            ) {
                                                this.newForm[
                                                    `param989_${chanNo}_${typeItem.type}`
                                                ] = JSON.parse(
                                                    JSON.stringify(
                                                        this.oldForm[
                                                            `param989_${chanNo}_${typeItem.type}`
                                                        ]
                                                    )
                                                );
                                            }
                                        }
                                    );
                                }
                            }
                        });
                        done();
                    })
                    .catch(() => {});
            } else {
                done();
            }
        },
        enableChange(val, chanNoItem) {
            for (let typeItem of Object.keys(chanNoItem.info)) {
                chanNoItem.info[typeItem].forEach((levelItem) => {
                    if (
                        this.newForm[
                            `param989_${chanNoItem.chanNo}_${levelItem.type}`
                        ]
                    ) {
                        this.newForm[
                            `param989_${chanNoItem.chanNo}_${levelItem.type}`
                        ].enable = val;
                        this.$emit(
                            "formDataChange",
                            `param989_${chanNoItem.chanNo}_${levelItem.type}`,
                            {
                                ...this.newForm[
                                    `param989_${chanNoItem.chanNo}_${levelItem.type}`
                                ],
                            }
                        );
                    }
                });
            }
        },
    },
};
</script>
<style lang="less" scoped>
@import "./configurationForm.less";
.el-radio-group {
    margin-bottom: 20px;
}
.divHeight {
    height: 500px;
    width: 800;
}
</style>
