// 导出状态配置
const exportManage = {
    state: {
        exportDynamicMonitoringReport:{ interval: null, loading: false },//动态监控台账
        exportInterventionRecord:{ interval: null, loading: false },//干预记录导出
        monitorJobExcel:{ interval: null, loading: false },//监控员工作明细
        alarmExcel: { interval: null, loading: false },//报警时空分析--报警总数
        alarmTypeCountAnalysisExport: { interval: null, loading: false },//定位监控
        gpsLocationExport: { interval: null, loading: false },//定位监控
        histroyByGpsExport: { interval: null, loading: false },//历史回放
        histroyByAlarmExport: { interval: null, loading: false },//历史回放
        histroyByStayExport: { interval: null, loading: false },//历史回放
        histroyBySpeedExport:{interval:null,loading:false},//历史回放
        infoPubilcExport: { interval: null, loading: false },//信息下发
        dailyAlarmExport: { interval: null, loading: false },//日常报警
        riskAlarmExport: { interval: null, loading: false },//风险报警
        monthlyAttendanceExport: { interval: null, loading: false },//月考勤记录
        attendanceDetailExport: { interval: null, loading: false },//考勤明细
        carListExport: { interval: null, loading: false },//车辆管理
        carResultExport: { interval: null, loading: false },//导入结果列表--导出
        onandOfflinelogExport: { interval: null, loading: false },//上下线日志
        groupMileageExport: { interval: null, loading: false },//里程明细--按组织
        groupMileageDetailExport: { interval: null, loading: false },//里程明细--按组织
        carMileageExport: { interval: null, loading: false },//里程明细--按车辆
        carMileageDetailExport: { interval: null, loading: false },//里程明细--按车辆
        driverMileageExport: { interval: null, loading: false },//里程明细--按驾驶员
        driverMileageDetailExport: { interval: null, loading: false },//里程明细--按驾驶员
        coldReportExport: { interval: null, loading: false },//冷链报表
        coldReportExportPDF: { interval: null, loading: false },//冷链报表
        forwardAndReversReportExport: { interval: null, loading: false },//正反转报表
        alarmSafetyWarningExport: { interval: null, loading: false },//预警报表
        faceSynchronExport: { interval: null, loading: false },//人脸下发异常明细
        tourListExport: { interval: null, loading: false },//观光车列表导出
        tagListExport: { interval: null, loading: false },//地图标注列表导出
        siteListExport: { interval: null, loading: false },//地图站点列表导出
        overTempExport: { interval: null, loading: false },//超温明细
        alarmCarExport: { interval: null, loading: false },//报警车辆明细
        deviceListExport: { interval: null, loading: false },//设备列表导出
        LongStayDetailExport: { interval: null, loading: false }, //停车明细导出
        LongStayCountExport: { interval: null, loading: false }, //停车统计导出
        regionalAccessExport: { interval: null, loading: false },//进出区域导出
        overTempStatisticsExport:{interval: null ,loading : false},//超温统计导出
        safetyBoardExportPDF:{interval: null ,loading : false},// mase 主动安全报告导出
        safetyBoardSupervisionExportPDF: { interval: null, loading: false },// mase 安全报告导出监管版
        vehicleSafetyReport:{interval: null ,loading : false},// 车辆安全年报
        loadDynamicDetailsExport: { interval: null, loading: false },// mase 载重动态明细导出
        overSpeedDetailsExport: { interval: null, loading: false },// mase 超速明细导出
        overSpeedTotalExport: { interval: null, loading: false },// mase 超速统计导出
        drivingTrackReportExport: { interval: null, loading: false },// mase 行驶轨迹报表导出
        trackListExportBatch: { interval: null, loading: false },// mase 行驶轨迹报表批量导出
        oilDynamicDetailsPDFexport: { interval: null, loading: false },// mase 油量动态明细导出PDF
        oilDynamicDetailsEXCELexport: { interval: null, loading: false },// mase 油量动态明细导出EXCEL
        coldReportExportHumidity: { interval: null, loading: false },// mase 温湿度明细导出EXCEL
        coldReportExportHumidityPDF: { interval: null, loading: false },// mase 温湿度明细导出EXCEL
        devicePortableExport: { interval: null, loading: false },// mase 便携式设备导出EXCEL
        
    },
    mutations: {
        //导出开始
        beginExport(state, { exportName, intervalName }) {
            state[exportName].interval = intervalName;
        },
        //loding加载
        beginLoading(state, exportName) {
            state[exportName].loading = true;
        },
        //导出关闭
        closeExport(state, exportName) {
            window.clearInterval(state[exportName].interval);
            state[exportName].interval = null;
        },
        //loding加载
        closeLoading(state, exportName) {
            state[exportName].loading = false;
        }
    },
}

export default exportManage