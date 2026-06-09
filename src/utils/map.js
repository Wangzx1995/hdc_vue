export default {
    name: 'Map',

    /**
     * 根据经纬极值计算绽放级别
     */
    getZoom (maxLng, minLng, maxLat, minLat) {
        var zoom = ["50","100","200","500","1000","2000","5000","10000","20000","25000","50000","100000","200000","500000","1000000","2000000"]//级别18到3。12872023.8
        var pointA = new BMap.Point(maxLng,maxLat);  // 创建点坐标A
        var pointB = new BMap.Point(minLng,minLat);  // 创建点坐标B
        var map = new BMap.Map("container");
        var distance = map.getDistance(pointA,pointB).toFixed(1);  //获取两点距离,保留小数点后两位
        for (var i = 0;i < zoom.length; i++) {
            if(parseInt(zoom[i]) - parseInt(distance) > 0){
                return 18-i+3;  //之所以会多3，是因为地图范围常常是比例尺距离的10倍以上。所以级别会增加3。
            }
        }
        return 1;
    },

    /**
     * 根据原始数据计算中心坐标和缩放级别，并为地图设置中心坐标和缩放级别
     * @params: map（百度地图对象）
     */
    getView (points) {
        if(points.length>0){
            var maxLng = points[0].lng;
            var minLng = points[0].lng;
            var maxLat = points[0].lat;
            var minLat = points[0].lat;
            var res;

            maxLng = (isNaN(maxLng) || maxLng == undefined || maxLng == '') ? 0 : maxLng;
            minLng = (isNaN(minLng) || minLng == undefined || minLng == '') ? 0 : minLng;
            maxLat = (isNaN(maxLat) || maxLat == undefined || maxLat == '') ? 0 : maxLat;
            minLat = (isNaN(minLat) || minLat == undefined || minLat == '') ? 0 : minLat;
            for (var i = points.length - 1; i >= 0; i--) {
                res = points[i];
                if(isNaN(res.lng) || isNaN(res.lat)) continue;
                res.lng = (res.lng == undefined || res.lng == '') ? 0 : res.lng;
                res.lat = (res.lat == undefined || res.lat == '') ? 0 : res.lat;
                if(res.lng && res.lng > maxLng) maxLng =res.lng;
                if(res.lng && res.lng < minLng) minLng =res.lng;
                if(res.lat && res.lat > maxLat) maxLat =res.lat;
                if(res.lat && res.lat < minLat) minLat =res.lat;
            };
            var cenLng =(parseFloat(maxLng)+parseFloat(minLng))/2;
            var cenLat = (parseFloat(maxLat)+parseFloat(minLat))/2;
            var zoom = this.getZoom(maxLng, minLng, maxLat, minLat);
            zoom = zoom > 18 ? 18 : zoom;
            return {point: new BMap.Point(cenLng,cenLat), zoom: zoom}
        }else{
            //没有坐标，显示全中国
            return {point: new BMap.Point(103.388611,35.563611), zoom: 5}
        }
    }
}
