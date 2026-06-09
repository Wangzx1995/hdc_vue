<template>
    <div>
        <!-- 离线位置 -->
        <el-dialog
            :width="'800px'"
            class="map-location"
            :visible.sync="modalMap"
            :title="$t('vehicleOfflineLongTime.offlineLocation')"
            :show-close="false"
        >
            <baidu-map
                class="map-main"
                :scroll-wheel-zoom="true"
                ak="W4G0UvLV4YdI3gWFTzVchVD0CQmEePGB"
                v-if="center.lng > 0"
                :center="center"
                :zoom="zoom"
                @ready="handler"
            >
                <bm-marker :position="center" animation="BMAP_ANIMATION_BOUNCE">
                </bm-marker>
            </baidu-map>
            <div slot="footer" class="dialog-footer">
                <span class="location">{{ rowData.locationName }}</span>
                <el-button type="primary" @click="close">
                    <!-- 确定 -->
                    {{ $t("common.ok") }}
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { BaiduMap, BmControl, BmCityList, BmMarker } from "vue-baidu-map";
export default {
    components: {
        BaiduMap,
        BmControl,
        BmCityList,
        BmMarker,
    },
    data() {
        return {
            center: { lng: 0, lat: 0 },
            zoom: 30,
        };
    },
    props: {
        modalMap: {
            type: Boolean,
            default: false,
        },
        rowData: {
            type: Object,
            default: {},
        },
    },
    watch: {
        modalMap: {
            handler(val) {
                if (val) {
                    this.handler();
                }
            },
            deep: true,
        },
    },
    methods: {
        handler() {
            this.center.lng = this.rowData.longitude;
            this.center.lat = this.rowData.latitude;
            this.zoom = 30;
        },
        close() {
            this.$emit("close");
            this.center.lng = 0;
            this.center.lat = 0;
        },
    },
};
</script>
<style lang="less" scoped>
.map-location {
    .dialog-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .location {
            font-size: 14px;
        }
    }
}
.map-main {
    width: 100%;
    height: 365px;
}
</style>
