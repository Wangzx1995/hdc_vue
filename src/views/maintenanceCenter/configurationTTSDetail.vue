<template>
  <div class="wrap">
      <div class="p-x-md">
        <div class="wrap-top p-y ">
          <div class="text-md">
              <span>详情</span>
          </div>
          <div class="text-md title">
              <div><span>成功: {{paramLogResultStatistics.successNum || 0}}</span></div>
              <div><span>进行中: {{paramLogResultStatistics.ingNum || 0}}</span></div>
              <div><span>失败: {{paramLogResultStatistics.failNum || 0}}</span></div>
          </div>
        </div>
        <div class="content">配置内容：{{detailContent}}</div>
       <div>
        <div class="search">
            <div>
                <el-form inline label-position="top" ref="searchForm" :model="searchForm">
                    <el-form-item prop="status" label="配置结果">
                        <el-select v-model="searchForm.status" clearable>
                            <el-option v-for="(item, index) in configurationResultlList" :label="item.label" :value="item.value" :key="index"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="deviceCode" label="终端手机号">
                        <el-input v-model="searchForm.deviceCode" placeholder="请输入" clearable></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div >
                <el-button type="primary" @click="params.currentPage=1;search()">查询</el-button>
                <el-button type="default" @click="handleReset($refs.searchForm)">清除条件</el-button>
            </div>
        </div>
        <el-table id="detailTable" :data="tableData" class="m-b" :height="tableHeight">
            <el-table-column prop="plateNum" label="车牌号" min-width="120px"></el-table-column>
            <el-table-column prop="deviceCode" label="终端手机号" min-width="120px"></el-table-column>
            <el-table-column prop="updateTime" label="命令下发时间" min-width="160px"></el-table-column>
            <el-table-column prop="createName" label="操作人员" min-width="160px"></el-table-column>
            <el-table-column prop="organizeName" label="所属组织" min-width="160px"></el-table-column>
            <el-table-column prop="result" label="配置结果" min-width="160px">
                <template slot-scope="scope">
                    <div>
                      <span :class="configStatusList[scope.row.result] && configStatusList[scope.row.result].color" v-if="configStatusList[scope.row.result]">●</span>
                      {{configStatusList[scope.row.result]&&configStatusList[scope.row.result].name}}
                    </div>
                </template>
            </el-table-column>
        </el-table>
       </div>
      </div>
      <div class="wrap-bottom p-x-md">
        <el-pagination
          :current-page="params.currentPage"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[20, 50, 100]"
          :page-size="params.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
  </div>
</template>

<script>
export default {
    name: 'configurationDetails',
    components: {},
    data() {
        return{
            detailContent:'',
            configurationResultlList: [
                {value: '', label: '全部'},
                {value: -5, label: '设备版本号不一致'},
                {value: -4, label: '配置文件版本号不一致'},
                {value: -3, label: '型号不一致'},
                {value: -2, label: '命令被覆盖'},
                {value: 1, label: '成功'},
                {value: 2, label: '失败'},
                {value: 3, label: '命令未发送'},
                {value: 4, label: '命令已发送'},
                {value: 5, label: '配置文件下载完成'},
                {value: 6, label: '设备重启中'},
                {value: 7, label: '设备离线，等待下发命令'},
                {value: 8, label: '命令下发失败'},
                {value: 9, label:'手动终止任务'}
            ],
            searchForm: {
                status: '',
                deviceCode: '',
                batchCode: this.$route.query.batchCode,
                type:4,
                deviceCode:''
            },
            params: {
                currentPage: 1, //页码，从1开始
                pageSize: 20, //分页大小
            },
            tableData:[],
            configStatusList:{
              '-5': {name:'设备版本号不一致',color:'text-warning'},
              '-4': {name:'配置文件版本号不一致',color:'text-warning'},
              '-3': {name:'型号不一致',color:'text-warning'},
              '-2': {name:'命令被覆盖',color:'text-warning'},
              '1': {name:'成功',color:'text-success'},
              '2': {name:'失败',color:'text-error'},
              '3': {name:'命令未发送',color:'text-warning'},
              '4': {name:'命令已发送',color:'text-warning'},
              '5': {name:'配置文件下载完成',color:'text-warning'},
              '6': {name:'设备重启中',color:'text-warning'},
              '7': {name:'设备离线，等待下发命令',color:'text-warning'},
              '8': {name:'命令下发失败',color:'text-warning'},
              '9': {name:'手动终止任务',color:'text-warning'},
            },
            tableHeight:500,
            paramLogResultStatistics:{
              totalNum: '', // 总数
              successNum: '', // 成功数
              failNum: '', // 失败数
              stopNum: '', // 终止数
              ingNum: '', // 进行中数
            },
             total:0,
        }
    },
    methods: {
      // 重置表单
      handleReset (ref) {
        if(ref !== undefined) {
          ref.resetFields();
        }
      },
      handleSizeChange(val) {
        this.params.pageSize = val;
        this.search();
      },
      handleCurrentChange(val) {
        this.params.currentPage = val;
        this.search();
      },
      search(){
        let params = Object.assign(this.params, this.searchForm);
        this.$api.getDeviceParamLogResultVoPage(params).then((res) =>{
              if(res.success == true) {
                this.tableData = ((res.data.results.length && res.data.totalRecords) || (!res.data.results.length && !res.data.totalRecords)) ? res.data.results : this.tableData
                this.total=res.data.totalRecords;
                this.detailContent = res.data.results[0].params
              } else {
                  this.$message.error('获取设备配置信息失败:' + res.msg);
              }
        })
      },
      // 获取统计数据
      getParamLogResultStatistics(){
        const params = {
          organizeId: this.$route.query.organizeId,
          type: 5 ,// tts配置
          batchCode: this.$route.query.batchCode
        }
        this.$api.getParamLogResultStatistics(params).then((res) =>{
          if(res.success == true) {
            this.paramLogResultStatistics = res.data
          } else {
            this.$message.error('获取统计数据失败' + res.msg);
          }
        });
      },
      setTableHeight(){
        this.tableHeight= document.body.clientHeight-290;
      },
    },
  mounted(){
    const that = this;
    window.onresize = () => {
      return (() => {
        that.setTableHeight();
      })();
    };
  },
  created() {
    this.setTableHeight();
    this.search()
    this.getParamLogResultStatistics()
  }
}
</script>

<style lang="less" scoped>
    .wrap{
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .wrap-top{
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            .title{
                display: flex;
                div{
                    border-right: 1px solid #9ea3b1;
                    padding-left: 0.5rem;
                    padding-right: 0.5rem;
                    &:first-child{
                        padding-left: 0;
                    }
                    &:last-child{
                        border:none;
                    }
                }
            }
        }
        .wrap-bottom{
            height: 4rem;
            border-top: 1px solid #e4e4e4;
        }
    }
    .search{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }
    .content {
      max-width: 1100px;
      margin-bottom: 20px;
      color: #948c8c;
      font-size: 13px;
    }
</style>