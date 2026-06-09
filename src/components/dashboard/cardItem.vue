<template>
  <div class="card-item m-b-sm">
    <div v-for="(item,id) in waitFaultData" :key="id">
      <div class="item">
        <span>{{item.plateNum}}发生了{{item.faultName}}</span>
        <span>最新故障时间：{{item.latestCollectTime}}</span>
      </div>
      <div class="item">
        <span>本车待处理故障：{{item.unresolvedNum}}</span>
        <span class="fault-detail" @click="goToFaultDetail(item)">详情></span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props:['waitFaultData'],
  methods: {
    goToFaultDetail(item){
       this.$router.push({
        path: "/statusMonitor/handleFaultDetail",
        query:{
          plateNum: item.plateNum,
          faultTypes:'',
          time:''
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.card-item{
  border-bottom: 1px solid #dfdfdf;
  overflow-y: auto;
  height: 400px;
  .item{
    display: flex;
    justify-content: space-between;
    margin: 8px 0;
  }
  .fault-detail{
    color: #4886FF;
    cursor:pointer; 
  }
}
</style>