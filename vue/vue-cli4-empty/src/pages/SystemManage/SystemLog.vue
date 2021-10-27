<template>
  <div class="system-log-container full">
    <el-button type="primary" class="mgb20" @click="exportData.nodeId = +new Date()">批量导出</el-button>
    <base-table ref="table"
                :tableData="tableData"
                :pagingData="pagingData"
                @sizeChange="pagingEvent"
                @currentChange="pagingEvent"
                @sortChange="sortChangeEvt"
                @selectionChange="selectionChangeEvt">
      <template #columnType>
        <el-table-column type="selection" width="46"></el-table-column>
        <el-table-column type="index" :index="rowIndex" width="60" label="序号" align="center"></el-table-column>
      </template>
    </base-table>
    <!--批量下载确认框-->
    <base-dialog ref="dialog"
                 title="批量导出"
                 :dialogId="exportData.nodeId"
                 @dialogConfirm="exportLogEvt"
                 @dialogClose="dialogCloseEvt('exportData')">
        <el-radio v-model="exportData.type" label="all">全部</el-radio>
        <el-radio v-model="exportData.type" label="selected">勾选数据</el-radio>
    </base-dialog>
  </div>
</template>

<script>
import mixins from '@m';
export default {
  name: 'SystemLog',
  mixins: [mixins.table, mixins.file, mixins.form],
  data() {
    return {
      tableData: {
        defaultSort: {prop: 'createdTime', order: 'descending'},
        columns: [
          {label: '生成时间', prop: 'createdTime', width: 150, sortable: true},
          {label: '日志名称', prop: 'name'},
          {label: '操作用户', prop: 'userName'},
          {label: '存放路径', prop: 'path'}
        ]
      },
      exportData: {
        nodeId: 0,
        type: 'all'
      }
    };
  },
  methods: {
    getTableData() {
      this.reqTableData(this.$apis.systemManage.getSystemLog);
    },
    // 批量导出
    exportLogEvt() {
      if (this.exportData.type === 'selected' && !this.isTableSelect()) {
        this.$message.warning('暂无勾选数据');
        return;
      }
      const params = this.exportData.type === 'all' ? {ids: []} : {ids: this.getSelectData()};
      console.log('导出参数', params);
      this.downLoadEvt(`${this.$apis.home.fileDownloadAsync}?name=login955.jpeg`, null, '系统日志');
      this.dialogCloseEvt('exportData');
      this.clearTableSelection();
    }
  },
  created() {
    this.getTableData();
  }
};
</script>

<style lang="less" scoped>
.base-table-container {
  height: calc(~"100% - 46px");
}
</style>
