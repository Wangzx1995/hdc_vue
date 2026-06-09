import fetch from '@/utils/fetch'

// 判断是否有展示显示用户权限的按钮

function ishasAuthShow() {
  return fetch({
    url: '/synchronousSap/showSynchronousSapResult',
    method: 'post'
  })
}


//展示信息列表
const syncInfoList  = function ( params) {
  return fetch({
    url: '/synchronousSap/page',
    method: 'post',
    data: params
  })
}


//立即同步
const eagerlyFetchDevice  = function () {
  return fetch({
    url: '/synchronousSap/eagerlyFetchDevice',
    method: 'post',
  })
}
//重新同步
const reSync = function ( id ) {
  return fetch({
    url: '/synchronousSap/resynchronization',
    method: 'post',
    data: {
      id
    }
  })
}

//获取异常数量
const getErrorNum = function () {
  return fetch({
    url: '/synchronousSap/countAbnormal',
    method: 'post'
  })
}

//设置已读
const readState = function ( ids ) {
  return fetch({
    url: '/synchronousSap/updateReadState',
    method: 'post',
    headers:{
      'Content-Type': 'application/json'
    },  
    data: JSON.stringify(ids)
  })
}

//判断是否重复添加
const ifReAdd = function ( plateNum ) {
  return fetch({
    url: 'hikDevice/vaildPlateNum',
    method: 'post',
    data: {
      plateNum
    }
  })

}



const syncList = {
  ishasAuthShow,
  syncInfoList,
  eagerlyFetchDevice,
  getErrorNum,
  reSync,
  readState,
  ifReAdd
}


export default syncList