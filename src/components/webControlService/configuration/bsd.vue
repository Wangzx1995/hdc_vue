<template>
    <!-- 无插件 -->
    <div
        class="hat-plugin-main m-t p-l p-r"
        v-loading="loading"
        element-loading-text="正在关闭中"
    >
        <div class="note">
            <div class="item">
                <div class="icon green"></div>
                <div>一级区域(一般危险)</div>
            </div>
            <div class="item">
                <div class="icon blue"></div>
                <div>二级区域(较危险)</div>
            </div>
            <div class="item">
                <div class="icon red"></div>
                <div>三级区域(最危险)</div>
            </div>
        </div>
        <div class="tip m-t-sm">
            挪动坐标点的过程中，请勿改变坐标点的相对位置，并且确保红色区域在最内部，绿色区域在最外部
        </div>
        <div
            id="HATPluginPlayBSD"
            class="m-t-sm m-b-sm"
            style="width: 100%; height: 400px"
        ></div>
        <div class="footer" v-if="!isTemplate">
            <div>
                <el-button @click="horizonFront()">默认前置平视</el-button>
                <el-button @click="overlook()">默认俯视</el-button>
            </div>
            <div>
                <el-button @click="cancel(true)">取消</el-button>
                <el-button @click="save()" type="primary">保存</el-button>
            </div>
        </div>
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
    },
    data() {
        return {
            loading: false,
            playControlNone: null,
            horizonFrontDefault: [
                {
                    typeName: "一级区域",
                    polygon: [
                        { x: 626, y: 351 },
                        { x: 187, y: 636 },
                        { x: 79, y: 964 },
                        { x: 627, y: 929 },
                        { x: 844, y: 504 },
                    ],
                },
                {
                    typeName: "二级区域",
                    polygon: [
                        { x: 594, y: 403 },
                        { x: 230, y: 686 },
                        { x: 144, y: 910 },
                        { x: 627, y: 929 },
                        { x: 844, y: 504 },
                    ],
                },
                {
                    typeName: "三级区域",
                    polygon: [
                        { x: 588, y: 425 },
                        { x: 323, y: 712 },
                        { x: 236, y: 846 },
                        { x: 627, y: 929 },
                        { x: 844, y: 504 },
                    ],
                },
            ],
            overlookDefault: [
                {
                    typeName: "一级区域",
                    polygon: [
                        { x: 967, y: 326 },
                        { x: 170, y: 454 },
                        { x: 60, y: 853 },
                        { x: 822, y: 1000 },
                        { x: 947, y: 671 },
                    ],
                },
                {
                    typeName: "二级区域",
                    polygon: [
                        { x: 925, y: 382 },
                        { x: 166, y: 492 },
                        { x: 66, y: 821 },
                        { x: 776, y: 950 },
                        { x: 937, y: 654 },
                    ],
                },
                {
                    typeName: "三级区域",
                    polygon: [
                        { x: 884, y: 468 },
                        { x: 212, y: 550 },
                        { x: 87, y: 810 },
                        { x: 763, y: 917 },
                        { x: 912, y: 667 },
                    ],
                },
            ],
        };
    },
    methods: {
        horizonFront() {
            this.playControlNone.clearRegion();
            this.openHatPlugin(this.playUrl, this.horizonFrontDefault, false);
        },
        overlook() {
            this.playControlNone.clearRegion();
            this.openHatPlugin(this.playUrl, this.overlookDefault, false);
        },
        cancel(close) {
            this.loading = true;
            this.playControlNone
                .stopRealPlayAll()
                .then((res) => {
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
            this.playControlNone.getPolygonInfo().then((res) => {
                console.log("bsdInfo==========", res);
                this.playControlNone
                    .stopRealPlayAll()
                    .then((r) => {
                        this.playControlNone.clearRegion();
                        this.$emit("saveSurveyBol", res);
                        this.loading = false;
                    })
                    .catch((e) => {
                        this.playControlNone.clearRegion();
                        this.$emit("saveSurveyBol", res);
                        this.loading = false;
                    });
            });
        },
        openHatPlugin(playUrl, areaContent, replay) {
            // 初始化控件
            if (!this.playControlNone) {
                this.playControlNone = new HATPlugin_C("HATPluginPlayBSD");
            }
            // 预览
            if (replay) this.playControlNone.play({ url: playUrl });
            this.playControlNone.clearRegion();
            // BSD绘制
            // let colorMap =['rgb(104,193,58)','rgb(64,158,255)','rgb(245,108,108)']
            let colorMap = ["#00FF00", "#0000FF", "#FF0000"];
            areaContent.map((i, index) => {
                let pointList = [];
                i.polygon.map((j) => {
                    pointList.push([j.x / 1000, j.y / 1000]);
                });
                var aPolygons = [
                    {
                        iPolygonType: 1,
                        iEditType: 0, //0-可编辑，1-不可编辑
                        aPoint: pointList, //相对于设备原始分辨率的千分比坐标点
                        bClosed: true, //多边形闭合
                        szTips: i.typeName, //多边形名称
                        szDrawColor: colorMap[index], //边框颜色
                        szFillColor: "#FFFF00", //填充颜色
                        iTranslucent: 0.0, //透明度
                    },
                ];
                console.log("aPolygons", aPolygons);

                this.playControlNone.setPolygonInfo(aPolygons);
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
    .note {
        display: flex;
        flex-direction: row;
        .item {
            display: flex;
            flex-direction: row;
            align-items: center;
            font-size: 14px;
            color: #333;
            margin-right: 12px;
            .icon {
                width: 16px;
                height: 16px;
                border-radius: 50%;
                margin-right: 8px;
                &.green {
                    background: rgb(104, 193, 58);
                }
                &.blue {
                    background: rgb(64, 158, 255);
                }
                &.red {
                    background: rgb(245, 108, 108);
                }
            }
        }
    }
    #HATPluginPlayBSD {
        // border: 1px solid black;
        // flex: 1;
    }
    .footer {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }
}
</style>
