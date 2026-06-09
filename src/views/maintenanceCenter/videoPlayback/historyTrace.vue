<template>
    <div class="history-trace" id="tAmap"></div>
</template>
<script>
export default {
    props: {
        // 小车
        carPointTrajectory: {
            type: Object,
            default: () => {}
        },
        // 完整轨迹
        traceSlice: {
            type: Array,
            default: () => {
                return [];
            }
        },
        // 回放轨迹
        runTrace: {
            type: Array,
            default: () => {
                return [];
            }
        }
    },
    data() {
        return {
            map: null,
            polyline: null,
            startPoint: null,
            endPoint: null,
            polylineRun: null
        };
    },
    watch: {
        traceSlice: {
            handler(val) {
                if (val && val.length > 0) {
                    if (this.startPoint) this.map.remove(this.startPoint);
                    if (this.endPoint) this.map.remove(this.endPoint);
                    if (this.polyline) this.map.remove(this.polyline);

                    let path = JSON.parse(JSON.stringify(val));
                    let _path = [];
                    path.map(i => {
                        _path.push(new AMap.LngLat(i.lng, i.lat));
                    });

                    /* 完整轨迹线 */
                    this.polyline = new AMap.Polyline({
                        path: _path,
                        isOutline: true,
                        outlineColor: "#a0a0a0",
                        strokeOpacity: 1,
                        strokeWeight: 4,
                        strokeColor: "#a0a0a0",
                        lineJoin: "round"
                    });
                    this.map.add(this.polyline);

                    /* 起点 */
                    this.startPoint = new AMap.Marker({
                        position: _path[0],
                        offset: new AMap.Pixel(-15, -40),
                        icon: "/static/images/map_begin.png",
                        zIndex: 29
                    });
                    /* 终点 */
                    this.endPoint = new AMap.Marker({
                        position: _path[_path.length - 1],
                        offset: new AMap.Pixel(-15, -40),
                        icon: "/static/images/map_end.png",
                        zIndex: 29
                    });
                    this.map.add(this.startPoint);
                    this.map.add(this.endPoint);
                    this.map.setFitView([this.startPoint, this.endPoint]);
                } else {
                    this.startPoint && this.map.remove(this.startPoint);
                    this.endPoint && this.map.remove(this.endPoint);
                    this.polyline && this.map.remove(this.polyline);
                }
            },
            deep: true
        },
        carPointTrajectory: {
            handler(val) {
                if (val) {
                    if (this.carMark) {
                        this.carMark.setPosition(val);
                        this.carMark.setAngle(val.direction);
                    } else {
                        this.carMark = new AMap.Marker({
                            position: val,
                            offset: new AMap.Pixel(-10, -24),
                            icon: "/static/images/map_car_90.png",
                            angle: val.direction,
                            zIndex: 29
                        });
                        this.map.add(this.carMark);
                    }
                    // if (this.carMark) this.map.remove(this.carMark);
                    // /* 小车 */
                    // this.carMark = new AMap.Marker({
                    //     position: val,
                    //     offset: new AMap.Pixel(-10, -24),
                    //     icon: "/static/images/map_car_90.png",
                    //     angle: val.direction,
                    //     zIndex: 29
                    // });
                    // this.map.add(this.carMark);
                    this.map.setFitView(this.carMark, true);
                } else {
                    this.map.remove(this.carMark);
                    this.carMark = null;
                }
            },
            deep: true
        },
        runTrace: {
            handler(val) {
                /* 正在回放的轨迹 */
                if (val && val.length > 0) {
                    if (this.polylineRun) this.map.remove(this.polylineRun);
                    let path = JSON.parse(JSON.stringify(val));
                    let _path = [];
                    path.map(i => {
                        _path.push(new AMap.LngLat(i.lng, i.lat));
                    });
                    this.polylineRun = new AMap.Polyline({
                        path: _path,
                        isOutline: true,
                        outlineColor: "#4886FF",
                        strokeOpacity: 1,
                        strokeWeight: 4,
                        strokeColor: "#4886FF",
                        lineJoin: "round"
                    });

                    this.map.add(this.polylineRun);
                } else {
                    if(this.polylineRun){
                        this.map.remove(this.polylineRun);
                    }
                }
            },
            deep: true
        }
    },
    mounted() {
        // 初始化地图
        this.map = new AMap.Map("tAmap", {
            zoom: 14
        });
    },
    beforeDestroy() {
        this.map && this.map.destroy();
        this.map = null;
    }
};
</script>
<style lang="less" scoped>
.history-trace {
    width: 100%;
    height: 100%;
}
</style>
