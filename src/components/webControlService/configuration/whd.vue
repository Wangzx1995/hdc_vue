<template>
    <!-- 无插件 -->
    <div
        class="hat-plugin-main m-t p-l p-r"
        v-loading="loading"
        element-loading-text="正在关闭中"
    >
        <div class="tip">
            移动镜头，确保方向盘和司机处于红框内;将方向盘中心点与人头区域处于黄色水平线位置;拖拽点1、2、3、4使之对应方向盘上、左、下、右
        </div>
        <div
            id="HATPluginPlayWHD"
            class="m-t-sm m-b-sm"
            style="width: 100%; height: 400px"
        ></div>
        <div class="footer" v-if="!isTemplate">
            <div>
                <el-button @click="defaultConfig()">默认</el-button>
                <el-button @click="guide()">教程</el-button>
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
                移动镜头，确保方向盘和司机处于红框内;将方向盘中心点与人头区域处于黄色水平线位置
            </div>
            <div v-else>拖拽点1、2、3、4使之对应方向盘上、左、下、右</div>
            <img
                class="m-t-sm"
                :src="
                    tipNum == 1
                        ? '/static/images/image_whd_first_step.png'
                        : '/static/images/image_whd_second_step.png'
                "
                style="width: 100%"
            />
            <span slot="footer" class="dialog-footer">
                <el-button @click="tipChange">{{
                    tipNum == 1 ? "下一步" : "上一步"
                }}</el-button>
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
    },
    data() {
        return {
            playControlNone: null,
            dialogVisible: false,
            tipNum: 1,
            defaultPolygon: [
                { x: 298, y: 253 },
                { x: 159, y: 507 },
                { x: 291, y: 682 },
                { x: 456, y: 507 },
            ],
            loading: false,
        };
    },
    methods: {
        tipChange() {
            this.tipNum == 1 ? this.tipNum++ : this.tipNum--;
        },
        defaultConfig() {
            this.playControlNone.clearRegion();
            this.openHatPlugin(this.playUrl, this.defaultPolygon, false);
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
            this.playControlNone.getPolygonInfo().then((res) => {
                let data = res;
                let whdList = [];
                data.map((i) => {
                    if (i.tips === "whd") {
                        i.points.map((j) => {
                            whdList.push({ x: j[0] * 1000, y: j[1] * 1000 });
                        });
                    }
                });
                this.playControlNone
                    .stopRealPlayAll()
                    .then(() => {
                        this.playControlNone.clearRegion();
                        this.$emit("saveSurveyBol", whdList);
                        this.loading = false;
                    })
                    .catch((e) => {
                        this.playControlNone.clearRegion();
                        this.$emit("saveSurveyBol", whdList);
                        this.loading = false;
                    });
            });
        },
        openHatPlugin(playUrl, areaContent, replay, isPrivate) {
            // 初始化控件
            if (!this.playControlNone) {
                this.playControlNone = new HATPlugin_C("HATPluginPlayWHD");
            }

            if (replay)
                // 预览
                this.playControlNone.play({ url: playUrl });
            this.playControlNone.clearRegion();

            let aPolygons = [
                {
                    iPolygonType: 1, //0-矩形，1-多边形
                    iEditType: 2, //0-可编辑，1-不可编辑，可移动坐标点；2、不可编辑，不可移动坐标点
                    //将设备千分比坐标转换成相对画布坐标
                    aPoint: [
                        [150 / 1000, 150 / 1000],
                        [150 / 1000, 900 / 1000],
                        [900 / 1000, 900 / 1000],
                        [900 / 1000, 150 / 1000],
                    ], //相对于设备原始分辨率的千分比坐标点
                    bClosed: true, //多边形闭合
                    szTips: "square", //多边形名称
                    szDrawColor: "#9A5351", //边框颜色
                    szFillColor: "#FFFF00", //填充颜色
                    iTranslucent: 0.0, //透明度
                },
            ];
            this.playControlNone.setPolygonInfo(aPolygons);

            let aLines = [
                {
                    iLineType: 5, //普通线-0, 越界侦测线-3, 过线统计-4, 5-WHD标定虚线
                    iEditType: 2,
                    aPoint: [
                        [150 / 1000, 500 / 1000],
                        [900 / 1000, 500 / 1000],
                    ], //线坐标
                    szTips: "line", //线名称，可以不传
                    iDirection: 0, //越界侦测线需要用到该属性， 0表示A->B, 1表示B->A, 2表示A<->B
                    iArrowType: 0, //箭头方向(和直销垂直)，0-起始坐标的正时针方向， 1- 起始坐标的逆时针方向
                    szDrawColor: "#ACAC49", //线颜色
                },
            ];
            this.playControlNone.setPolygonInfo(aLines);

            //whd绘制
            let pointList = [];
            areaContent.map((i, index) => {
                pointList.push([i.x / 1000, i.y / 1000]);
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
    #HATPluginPlayWHD {
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
