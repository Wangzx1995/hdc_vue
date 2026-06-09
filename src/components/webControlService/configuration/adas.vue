<template>
    <!-- 无插件 -->
    <div
        class="hat-plugin-main m-t p-l p-r"
        v-loading="loading"
        element-loading-text="正在关闭中"
    >
        <div
            id="HATPluginPlayADAS"
            class="m-t-sm m-b-sm"
            style="width: 100%; height: 400px"
        ></div>
        <div class="footer" v-if="!isTemplate">
            <div>
                <el-button @click="guide()">教程</el-button>
                <el-button @click="cancelMove()" v-if="isMove"
                    >取消移动</el-button
                >
                <el-button @click="move()" type="primary" v-else
                    >移动</el-button
                >
                <el-button @click="getPos()">获取坐标</el-button>
                <span v-if="posPoint && posPoint[0]"
                    >x:{{ posPoint[0] }} ；y:{{ posPoint[1] }}</span
                >
            </div>
            <div>
                <el-button @click="cancel(true)">取消</el-button>

                <el-button @click="save()" type="primary">保存</el-button>
            </div>
        </div>
        <el-dialog
            :title="tipNum == 1 ? '第一步' : '第二步'"
            :visible.sync="dialogVisible"
            append-to-body
            cenetr
        >
            <div v-if="tipNum == 1">
                在车辆正前方竖立“标定杆”，“标定杆”距车头1.5m
            </div>
            <div v-if="tipNum == 2">
                移动ADAS镜头将地平线与标定杆顶端的重合点落入黄框内
            </div>
            <div v-if="tipNum == 3">
                若第二步无法实现，点击“移动”按钮进行调节，使地平线与标定杆顶端的重合点落入红框内即可
            </div>
            <img
                v-if="tipNum == 1"
                class="m-t-sm"
                :src="'/static/images/image_adas_1.png'"
                style="width: 100%"
            />
            <img
                v-if="tipNum == 2"
                class="m-t-sm"
                :src="'/static/images/image_adas_2.png'"
                style="width: 100%"
            />
            <img
                v-if="tipNum == 3"
                class="m-t-sm"
                :src="'/static/images/image_adas_3.png'"
                style="width: 100%"
            />
            <span slot="footer" class="dialog-footer">
                <el-button @click="tipChange(-1)" v-if="tipNum !== 1"
                    >上一步</el-button
                >
                <el-button @click="tipChange(1)" v-if="tipNum !== 3"
                    >下一步</el-button
                >
            </span>
        </el-dialog>
    </div>
</template>
<script>
import HATPlugin_C from "@/components/webControlService/HATPlugin_C";
export default {
    props: {
        playUrl: {
            type: String,
            default: "",
        },
        isTemplate: {
            type: [String, Boolean],
            default: false,
        },
        horizonVanishLine: {
            type: Object,
            default: () => {},
        },
        verticalVanishLine: {
            type: Object,
            default: () => {},
        },
        isAdas: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            playControlNone: null,
            dialogVisible: false,
            tipNum: 1,
            loading: false,
            isMove: false,
            posPoint: [],
        };
    },
    methods: {
        tipChange(num) {
            this.tipNum += num;
        },
        defaultConfig() {
            // this.playControlNone.clearRegion();
        },
        guide() {
            this.tipNum = 1;
            this.dialogVisible = true;
        },
        cancel(close) {
            this.loading = true;
            this.playControlNone
                .stopRealPlayAll()
                .then(() => {
                    this.playControlNone.clearRegion();
                    if (close) this.$emit("cancelSurveyBol");
                    this.playControlNone = null;
                    this.loading = false;
                })
                .catch((e) => {
                    this.playControlNone.clearRegion();
                    if (close) this.$emit("cancelSurveyBol");
                    this.playControlNone = null;
                    this.loading = false;
                });
        },
        save() {
            this.loading = true;
            this.playControlNone.getPointInfo().then((res) => {
                let point = res[0].point;
                point[0] = parseInt(point[0] * (this.isAdas ? 1000 : 100));
                // point[1] = parseInt(point[1] * (this.isAdas ? 1000 : 100));
                point[1] = parseInt(
                    this.isAdas ? point[1] * 1000 : 100 - point[1] * 100
                );
                this.playControlNone
                    .stopRealPlayAll()
                    .then(() => {
                        this.playControlNone.clearRegion();
                        this.$emit("saveSurveyBol", point);
                        this.loading = false;
                    })
                    .catch((e) => {
                        this.playControlNone.clearRegion();
                        this.$emit("saveSurveyBol", point);
                        this.loading = false;
                    });
            });
        },
        openHatPlugin(playUrl, areaContent, replay, isPrivate) {
            // 初始化控件
            if (!this.playControlNone) {
                this.playControlNone = new HATPlugin_C("HATPluginPlayADAS");
            }

            if (replay)
                // 预览
                this.playControlNone.play({ url: playUrl });
            this.playControlNone.clearRegion();

            //whd绘制
            let pointList = [];
            areaContent.map((i, index) => {
                pointList.push([
                    i.x / (this.isAdas ? 1000 : 100),
                    this.isAdas ? i.y / 1000 : (100 - i.y) / 100,
                    // i.y / (this.isAdas ? 1000 : 100),
                ]);
            });
            let bPolygons = [
                {
                    iPolygonType: 1, //普通线-0, 越界侦测线-3, 过线统计-4, 5-WHD标定虚线
                    iEditType: 0, //0-可编辑，1-不可编辑
                    aPoint: pointList, //相对于设备原始分辨率的千分比坐标点
                    bClosed: true, //多边形闭合
                    szTips: "whd", //多边形名称
                    szDrawColor: "#25CEF7", //边框颜色
                    szFillColor: "#FFFF00", //填充颜色
                    iTranslucent: 0.0, //透明度
                },
            ];
            this.playControlNone.setPolygonInfo(bPolygons);

            this.playControlNone.clearRegion();
            var aLines = [
                {
                    szId: 111,
                    iLineType: 5, //普通线-0, 越界侦测线-3, 过线统计-4, 5-WHD标定虚线
                    aPoint: [
                        [0, pointList[0][1]],
                        [1, pointList[0][1]],
                    ], //线坐标
                    szTips: "test", //线名称，可以不传
                    iDirection: 0, //越界侦测线需要用到该属性， 0表示A->B, 1表示B->A, 2表示A<->B
                    iArrowType: 0, //箭头方向(和直销垂直)，0-起始坐标的正时针方向， 1- 起始坐标的逆时针方向
                    szDrawColor: "#FFFF00", //线颜色
                },
                {
                    szId: 222,
                    iLineType: 5, //普通线-0, 越界侦测线-3, 过线统计-4, 5-WHD标定虚线
                    aPoint: [
                        [pointList[0][0], 0],
                        [pointList[0][0], 1],
                    ], //线坐标
                    szTips: "test", //线名称，可以不传
                    iDirection: 0, //越界侦测线需要用到该属性， 0表示A->B, 1表示B->A, 2表示A<->B
                    iArrowType: 0, //箭头方向(和直销垂直)，0-起始坐标的正时针方向， 1- 起始坐标的逆时针方向
                    szDrawColor: "#FFFF00", //线颜色
                },
            ];
            this.playControlNone.setLineInfo(aLines);

            var aCircle = [
                {
                    szId: 55,
                    id: 55,
                    aPoint: pointList, //线坐标
                    szDrawColor: "#f44336", //线颜色
                },
            ];
            this.playControlNone.setCircleInfo(aCircle);
            if (this.isAdas) {
                var aRect = [
                    {
                        szId: 666,
                        id: 666,
                        iLineType: 1,
                        iEditType: 2, //0-可编辑，1-不可编辑
                        bDrawStatus: false,
                        aPoint: [
                            [0.47, 0.45],
                            [0.53, 0.45],
                            [0.53, 0.55],
                            [0.47, 0.55],
                        ], //多边形坐标
                        szTips: "", //多边形名称
                        szDrawColor: "#FFFF00", //边框颜色
                        iTranslucent: 0.1, //透明度
                    },
                ];
                this.playControlNone.setRectInfo(aRect);
            }
        },
        move() {
            this.isMove = true;
            var aRect = [
                {
                    szId: 666,
                    id: 666,
                    iLineType: 1,
                    iEditType: 2, //0-可编辑，1-不可编辑
                    bDrawStatus: false,
                    aPoint: this.isAdas
                        ? [
                              [0.45, 0.4],
                              [0.55, 0.4],
                              [0.55, 0.6],
                              [0.45, 0.6],
                          ]
                        : [
                              [
                                  this.horizonVanishLine.min / 100,
                                  this.verticalVanishLine.min / 100,
                              ],
                              [
                                  this.horizonVanishLine.max / 100,
                                  this.verticalVanishLine.min / 100,
                              ],
                              [
                                  this.horizonVanishLine.max / 100,
                                  this.verticalVanishLine.max / 100,
                              ],
                              [
                                  this.horizonVanishLine.min / 100,
                                  this.verticalVanishLine.max / 100,
                              ],
                          ], //多边形坐标
                    szTips: "", //多边形名称
                    szDrawColor: "#f44336", //边框颜色
                    iTranslucent: 0.1, //透明度
                },
            ];
            this.playControlNone.setRectInfo(aRect);
            this.playControlNone.setMoveStatus(true);
        },
        cancelMove() {
            this.isMove = false;
            if (this.isAdas) {
                var aRect = [
                    {
                        szId: 666,
                        id: 666,
                        iLineType: 1,
                        iEditType: 2, //0-可编辑，1-不可编辑
                        bDrawStatus: false,
                        aPoint: [
                            [0.47, 0.45],
                            [0.53, 0.45],
                            [0.53, 0.55],
                            [0.47, 0.55],
                        ], //多边形坐标
                        szTips: "", //多边形名称
                        szDrawColor: "#FFFF00", //边框颜色
                        iTranslucent: 0.1, //透明度
                    },
                ];
            } else {
                var aRect = [
                    {
                        szId: 666,
                        id: 666,
                        aPoint: [
                            [111, 111],
                            [111, 111],
                            [111, 111],
                            [111, 111],
                        ],
                    },
                ];
            }
            this.playControlNone.setRectInfo(aRect);
            this.playControlNone.setMoveStatus(false);
        },
        getPos() {
            this.playControlNone.getPointInfo().then((res) => {
                let point = res[0].point;
                point[0] = parseInt(point[0] * (this.isAdas ? 1000 : 100));
                // point[1] = parseInt(point[1] * (this.isAdas ? 1000 : 100));
                point[1] = parseInt(
                    this.isAdas ? point[1] * 1000 : 100 - point[1] * 100
                );
                this.posPoint = point;
            });
        },
    },
};
</script>
<style lang="less" scoped>
.hat-plugin-main {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    #HATPluginPlayADAS {
        border: 1px solid black;
        flex: 1;
    }
    .footer {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }
}
</style>
