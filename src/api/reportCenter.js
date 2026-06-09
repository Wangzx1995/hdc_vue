import fetch from "@/utils/fetch";

/**
 * 异常名称列表
 * @param areaDto
 */
const getAlarmAnalyseTypeLists = function (params) {
  return fetch({
      url: '/anomaly/anomalyNameList',
      method: 'post',
      data: params
  });
}
/**
 * 异常处理
 * @param areaDto
 */
const doHandleAnomaly = function(params){
  return fetch({
    url: '/anomaly/handleAnomaly',
    method: 'post',
    data: params,
    headers:{
      'Content-Type':'application/json'
    }
  });
}
/**
 * 异常明细查询
 * @param areaDto
 */
 const handleAnomalyDetailsPage = function(params){
  return fetch({
    url: '/anomaly/detailsPage',
    method: 'post',
    data: params
  });
}
/**
 * 入网率统计页面
 */
const carNetworkAccessPage = function(params){
  return fetch({
    url: '/report/carNetworkAccessPage',
    method: 'post',
    data: params
  });
}
/**
 * 入网率统计导出
 */
 const ExportNetworkAccessStatistic = function(params){
  return fetch({
    url: '/report/exportNetworkAccessStatistic',
    method: 'post',
    data: params
  });
}
/**
 * 入网率明细
 */
const carNetworkAccessCarPage = function(params){
  return fetch({
    url: '/report/carNetworkAccessCarPage',
    method: 'post',
    data: params
  });
}
/**
 * 入网明细导出
 */
const exportCarNetworkAccessCarPage = function(params){
  return fetch({
    url: '/report/exportCarNetworkAccessCarPage',
    method: 'post',
    data: params
  });
}
/**
 * GPS数据
 */
const incompleteGPSInfo = function(params){
  return fetch({
    url: '/report/incompleteGPSInfo',
    method: 'post',
    data: params
  });
}
/**
 * 导出轨迹不完整率详情汇总
 */
const exportIncompleteTabulate = function(params){
  return fetch({
    url: '/report/exportIncompleteTabulate',
    method: 'post',
    data: params
  });
}
const reportExportGps = function(params){
  return fetch({
    url: '/report/exportGps',
    method: 'post',
    data: params
  });
}
// 轨迹完整率--轨迹回放--轨迹完整历史列表
const carTrackCompletenessHistory = function(params){
    return fetch({
      url: '/report/carTrackCompletenessHistory',
      method: 'post',
      data: params
    });
  }
//   轨迹漂移率--轨迹回放--轨迹漂移历史列表
  const carDriftDataHistory = function(params){
    return fetch({
      url: '/report/carDriftDataHistory',
      method: 'post',
      data: params
    });
  }
//   数据合格率--轨迹回放--合格率历史列表
  const carDataQualificationHistory = function(params){
    return fetch({
      url: '/report/carDataQualificationHistory',
      method: 'post',
      data: params
    });
  }

const reportCenterApiList = {
    /*  area start  */
    getAlarmAnalyseTypeLists,
    doHandleAnomaly,
    handleAnomalyDetailsPage,
    carNetworkAccessPage,
    ExportNetworkAccessStatistic,
    carNetworkAccessCarPage,
    exportCarNetworkAccessCarPage,
    incompleteGPSInfo,
    exportIncompleteTabulate,
    reportExportGps,
    carTrackCompletenessHistory,
    carDriftDataHistory,
    carDataQualificationHistory

    /*  area end    */

}

export default reportCenterApiList