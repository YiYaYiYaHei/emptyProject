<template>
  <div class="home-container full pd20">
    <header class="mgb20">
      <el-button @click="deleteEvt('many')" type="primary" size="medium">新增</el-button>
    </header>
    <div class="table-container">
      <base-table ref="table"
                  v-loading="tableData.isLoading"
                  :tableData="tableData"
                  :pagingData="pagingData"
                  @sizeChange="pagingEvent"
                  @currentChange="pagingEvent"
                  @sortChange="sortChangeEvt"
                  @selectionChange="selectionChangeEvt"
                  @expandChange="expandChangeEvt">
        <template #columnType>
          <el-table-column type="selection" width="46" :selectable="(row, index) => row.orderTotal === 100"></el-table-column>
          <el-table-column type="index" :index="rowIndex" width="60" label="序号" align="center"></el-table-column>
        </template>
        <template #totalName="{data}">
          <span v-html="$options.filters[data.column.filter || 'transformNull'](data.row[data.column.prop], ...data.column.filterParam)"
                data-status-text="primary"
                class="pointer"
                @click="$message.info(data.row[data.column.prop]+'')"></span>
        </template>
        <template #otherColumns>
          <el-table-column label="操作" :min-width="260" align="center" fixed="right">
            <template #default="scope">
              <el-button @click="uploadFile($apis.login.fileUpload, {userName: 'addd'}, {acceptType: '.zip,.rar', acceptTypeErrMsg: '限.zip,.rar', limitSize: 30000 * 1024})" type="primary" size="small">上传</el-button>
              <el-button @click="downLoadEvt(`${$apis.login.fileDownload}/npm-1.1.0-1.zip`, null, 'FILE_DOWN')" type="primary" size="small">下载</el-button>
              <el-button @click="deleteEvt('row', scope.row)" type="primary" size="small">删除</el-button>
              <el-button @click="toggleRowExpansion(scope.row)" type="primary" size="small">{{scope.row.expandRowDetail && scope.row.expandRowDetail.isExpanded ? '收起' : '展开'}}</el-button>
            </template>
          </el-table-column>

          <!-- 展开 -->
          <el-table-column type="expand" width="1">
            <template #default="{row}">
              <div v-loading="row.expandRowDetail.isLoading" class="full" :class="Object.keys(row.expandRowDetail.data).length ? '' : 'box--empty'">
                <p v-for="(value, key) in row.expandRowDetail.data" :key="key">
                  <span class="expanded-item-label">{{key}}：</span>
                  <span>{{value}}</span>
                </p>
              </div>
            </template>
          </el-table-column>
        </template>
      </base-table>
    </div>
  </div>
</template>

<script>
import mixins from '@m';
export default {
  name: 'LogisticsCompany',
  mixins: [mixins.table, mixins.user, mixins.file],
  data() {
    return {
      nodeId: null,
      tableData: {
        defaultSort: {prop: 'lastOrderTime', order: 'descending'},
        rowClassName: ({row}) => !row.orderTotal ? 'table-cell1' : '',
        columns: [
          {label: '最近下单时间', prop: 'lastOrderTime', sortable: true, filter: 'formatDate', filterParam: [], width: 150},
          {label: '客户名', prop: 'userName', cls: 'green'},
          {label: '订单总数', prop: 'orderTotal', align: 'center', filter: 'numberWithCommas', slotName: 'totalName'},
          {label: '未完成订单', prop: 'orderUnfinished', align: 'center', filter: 'numberWithCommas', slotName: 'totalName'},
          {label: '已完成订单', prop: 'orderFinished', align: 'center', filter: 'numberWithCommas', slotName: 'totalName'},
          {label: '采购类型', prop: 'purchaseType', align: 'center', filter: 'transformArrToStr', isHidden: !this.isAdmin},
          {label: '采购数量', prop: 'purchaseTotal', align: 'center', filter: 'numberWithCommas', slotName: 'totalName'},
          {label: '优选客户', prop: 'isVip', sortable: true, align: 'center'},
          {label: '客户描述', prop: 'description'}
        ],
        configColumnList: [
          {label: '订单总数', value: 'orderTotal'},
          {label: '采购类型', value: 'purchaseType'},
          {label: '采购数量', value: 'purchaseTotal'},
          {label: '优选客户', value: 'isVip'},
          {label: '客户描述', value: 'description'}
        ]
      }
    };
  },
  watch: {
    'tableData.configColumnCheckedList': function(newVal) {
      console.log('监听:', newVal);
    }
  },
  methods: {
    getTableData() {
      this.reqTableData(this.$apis.login.getTableList);
    },
    getExpandRowDetail(row) {
      this.requestExpandRowDetail(row, this.$apis.login.getTableDetail, {id: row.id});
    },
    deleteEvt(type, row) {
      if (type === 'many' && !this.isTableSelect()) {
        this.$message.error('暂无勾选数据');
        return;
      }
      const params = type === 'row' ? row : this.getSelectData('userName');
      console.log('删除参数:', params);
      this.$message.success('删除成功');
      this.refreshTableData();
    }
  },
  created() {
    this.getTableData();
  }
};
</script>

<style lang="less" scoped>
.table-container {
  .h(calc(~"100% - 56px"));
}
.expanded-item-label {
  .dinlineb;
  width: 120px;
  margin-right: 5px;
  .tr;
}
/deep/.table-cell1 {
  .el-table-column--selection {
    position: relative;
    &::after {
      content: '';
      position: absolute;
      top: 50%;
      right: 0;
      transform: translateY(-50%);
      .w(8px);
      .h(8px);
      border-radius: 50%;
      background: @error;
    }
  }
}
</style>
