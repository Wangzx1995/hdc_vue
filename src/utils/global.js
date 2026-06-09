const plateNumberColorMap = {//车牌颜色
    1:"蓝色",
    2:"黄色",
    3:"黑色",
    4:"白色",
    5:"绿色",
    6:"白绿色",
    7:"农黄色",
    8:"农绿色",
    9:"其他",
    10:"黄绿色",
    11:"渐变绿色",
    12:"无"
}
const labelMarkerIcon = {//标注点图标
    1:'icon-gongchang-my',
    2:'icon-cangku-my',
    3:'icon-wuliuyuan-my',
    4:'icon-mendian-my',
    5:'icon-wangdian-my',
    6:'icon-qita-my',
    7:'icon-peisong-my',
    8:'icon-zhuanghuo-my',
    9:'icon-xiehuo-my',
}
const base = '/static/images/pointerIcon/';
const labelMarkerIconMap = {//标注点图标
    1: base+"gongchang.png",
    2: base+"cangku.png",
    3: base+"wuliuyuan.png",
    4: base+"mendian.png",
    5: base+"wangdian.png",
    6: base+"qita.png",
    7: base+"peisongzhandian.png",
    8: base+"zhuanghuodian.png",
    9: base+"xiehuodian.png"
}
const labelIcon = {
    1: base+"gongchang.svg",
    2: base+"cangku.svg",
    3: base+"wuliuyuan.svg",
    4: base+"mendian.svg",
    5: base+"wangdian.svg",
    6: base+"qita.svg",
    7: base+"peisongzhandian.svg",
    8: base+"zhuanghuodian.svg",
    9: base+"xiehuodian.svg"
}
const labelIconChecked = {
    1: base+"gongchang_checked.svg",
    2: base+"cangku_checked.svg",
    3: base+"wuliuyuan_checked.svg",
    4: base+"mendian_checked.svg",
    5: base+"wangdian_checked.svg",
    6: base+"qita_checked.svg",
    7: base+"peisongzhandian_checked.svg",
    8: base+"zhuanghuodian_checked.svg",
    9: base+"xiehuodian_checked.svg"
}
const carCategoryMap = {
    其他: "car",
    工程车: "engine",
    压路车: "yalu",
    高空作业车: "gaokong",
    吊车: "diao",
    推土机: "tui",
    挖掘机: "wa",
    搅拌车: "engine",
    厢式货车: "engine",
    特种车辆: "engine",
    重型自动装卸车: "engine",
    叉车: "cha"
}
//涉及到区域或者路线，在报警详情中需要展示围栏名称和详情的报警
const fenceAlarm = {
    forbidden_section_driving_alarm: "禁行路段行驶",
    forbid_inside: "禁止驶入",
    forbid_outside: "禁止驶出",
    inside_timeout: "停留超时",
    no_driving_into_dangerous_areas:"禁止驶入危险区域",
    no_driving_into_dangerous_sections:"禁止驶入危险区域",
    no_parking_car: "禁止停车",
    over_speed_fence: "超速报警",
    route_deviation: "路线偏离",
    morning_forbidden_elefence:"凌晨禁行",
    route_deviation_late: "途经点晚到",
    route_deviation_stay_timeout: "途经点停留超时",
    illegal_open_door: "非法开门",
    illegal_close_door:"非法关门",
    ultra_high_temperature_alarm:"超高温",
    ultra_low_temperature_alarm: "超低温",
    road_grade_speed_limit_and_speed_alarm:'道路等级限速超速报警',
    illegal_unloading_alarm:"违规卸料"
    
}
const ossFileEnum = {
    carPhoto: {
        keyId: 1,
        name:'车辆照片',
    },
    carRoadCertificate1: {
        keyId: 2,
        name:'运输证主页'
    },
    carRoadCertificate2: {
        keyId: 3,
        name:'运输证副业'
    },
    carLicenseLeft: {
        keyId: 4,
        name:'行驶证左页'
    },
    carLicenseRight: {
        keyId: 5,
        name:'行驶证右页'
    },
    driverFace: {
        keyId: 6,
        name:'驾驶员人脸照片'
    },
    driverSpecialEquipment1: {
        keyId: 7,
        name:'作业证照片1'
    },
    driverSpecialEquipment2: {
        keyId: 8,
        name:'作业证照片2'
    },
    driverQualification1: {
        keyId: 9,
        name:'从业资格证主页'
    },
    driverQualification2: {
        keyId: 10,
        name:'从业资格证副业'
    },
    driverLicense1: {
        keyId: 11,
        name:'驾驶证照片1'
    },
    driverLicense2: {
        keyId: 12,
        name:'驾驶证照片2'
    },
    accompanyingFace: {
        keyId: 13,
        name:'随车人员人脸照片'
    },
    escortPage1: {
        keyId: 14,
        name:'押运员证件1'
    },
    escortPage2:{
        keyId: 15,
        name:'押运员证件2'
    },
    systemLogo: {
        keyId: 16,
        name:'平台logo'
    },
    adviceFeedBack:{
        keyId: 17,
        name:'意见反馈'
    },
    enterpriseTransport: {
        keyId: 27,
        name:'企业运输证'
    }

}
const treeIcon = {
    1: "el-icon-office-building",
    2: "el-icon-collection-tag",
    6: "el-icon-picture-outline-round",
    4: "el-icon-truck",
    5: "el-icon-user"
}
export {
    plateNumberColorMap,
    labelMarkerIcon,
    labelMarkerIconMap,
    labelIcon,
    labelIconChecked,
    carCategoryMap,
    fenceAlarm,
    ossFileEnum,
    treeIcon,
}