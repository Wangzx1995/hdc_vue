
<template>
    <div class='infoBody'>
    </div>
</template>

<script>

export default {
    name: "customInfo",
    props: {

        
    },
    data() {
        return {
            carInfoShowType: "carInfo", //切换tab类型
            carInfo: {}, //车辆详情数据
            updateCarInfoTimeRangeInterval: null,
            // 人员信息
            onDutyDriverInfo: false, //是否有当班驾驶员
            driverList: [], //驾驶员列表
            driverType: 1, //展示驾驶员还是随车人员
            currentDriverIndex: 0,
            attendantInfo: null, //随车人员
            attendantList: [], //随车人员
            currentAttendantIndex: 0,
            // 设备列表
            devicesList: [],
            //查看更多
            seeMoreDrawer: false, //是否展示查看更多
            seeMoreTab: "carInfo", //查看更多tab
            crewType: "driver",
            carInfoTemplate: Object.freeze([
                //查看更多需要展示车辆信息列表
                { label: "车牌号", fieldName: "actCarNumber" },
                { label: "车牌颜色", fieldName: "carPlateColorText" },
                { label: "所属组织", fieldName: "businessName" },
                { label: "车身颜色", fieldName: "carColor" },
                { label: "VIN", fieldName: "vin" },
                { label: "车辆类型", fieldName: "carCategory" },
                { label: "车辆负责人", fieldName: "superintendent" },
                { label: "车辆燃料类型", fieldName: "carFuelType" },
                { label: "年检到期日", fieldName: "annualInspectLicenseEndTime", parseTime: 1 },
                { label: "保险到期日", fieldName: "exDate", parseTime: 1 },
                { label: "备注", fieldName: "comment" }
            ]),
            driverInfoTemplate: Object.freeze([
                //查看更多需要展示驾驶员信息列表
                { label: "姓名", fieldName: "name" },
                { label: "所属组织", fieldName: "businessName" },
                { label: "性别", fieldName: "sex" },
                { label: "出生日期", fieldName: "birthdayFormat" },
                { label: "身份证号", fieldName: "idCardNumber" },
                { label: "民族", fieldName: "nationName" },
                { label: "手机", fieldName: "phone" },
                { label: "地址", fieldName: "address" },
                { label: "驾驶证号", fieldName: "driverLicenseNumber" },
                { label: "驾驶证到期时间", fieldName: "driverLicenseInvalidDate" },
                { label: "特种设备作业证到期时间", fieldName: "specialEqptOprLicenseInvalidDate" },
                { label: "从业资格证号", fieldName: "qualificationNumber" }
            ]),
            attendantInfoTemplate: Object.freeze([
                //查看更多需要展示驾驶员信息列表
                { label: "姓名", fieldName: "name" },
                { label: "人员类型", fieldName: "typeName" },
                { label: "所属组织", fieldName: "groupName" },
                { label: "性别", fieldName: "sex" },
                { label: "手机号", fieldName: "phone" },
                { label: "身份证号", fieldName: "idCardNumber" },
                { label: "从业资格证号", fieldName: "qualificationNumber" },
                { label: "卡号", fieldName: "cardNumber" }
            ]),
            //子功能
            //对讲
            loadingIntercome: false,
            voiceTalkControl: null, //对讲控件对象
            // intercomModal: false,
            // 监听
            voiceListenControl: null, //监听控件对象
            loadingMonitor: false,
            //设置弹窗显示数据
            setForm: {
                carbonDioxide: 0,
                frontBack: 0,
                humidity: 0,
                temperature: 0, //1：显示；0：不显示
                liquidLevel: 0,
                remainingOil: 0,
                vehicleLoad: 0,
                gpsSpeed: 0,
                recorderSpeed: 0,
                totalMileage: 0
            },
            setCarInfoShow: false, //设置弹窗展示信息
            setLoading: false
        };
    },
    computed: {


    },
    watch: {


    },
    methods: {

        

        
    },
    mounted() {

    },
};
</script>

<style lang="less" scoped>
.infoBody{
    box-shadow: 0 0 4px 2px rgba(100, 100, 100, 0.2);
}

</style>