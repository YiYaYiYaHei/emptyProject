<template>
  <div class="home-container full pd20">
    <header class="mgb20">
      <el-button @click="deleteEvt('many')" type="primary" size="medium">批量删除</el-button>
    </header>
    <div class="table-container">
      <base-table v-loading="tableData.isLoading"
                  :tableData="tableData"
                  :pagingData="pagingData"
                  @sizeChange="pagingEvent"
                  @currentChange="pagingEvent"
                  @sortChange="sortChange"
                  @selectionChange="selectionChange"
                  ref="table">
        <template #columnType>
          <el-table-column type="selection" width="46"></el-table-column>
          <el-table-column type="index" :index="rowIndex" width="60" label="序号" align="center"></el-table-column>
        </template>
        <template #totalName="{data}">
          <span v-html="$options.filters[data.column.filter || 'transformNull'](data.row[data.column.prop], ...data.column.filterParam)"
                data-status-text="primary"
                class="pointer"
                @click="$message.info(data.row[data.column.prop]+'')"></span>
        </template>
        <template #otherColumns>
          <el-table-column label="操作" :min-width="100" align="center" fixed="right">
            <template #default="scope">
              <el-button @click="deleteEvt(scope.row)" type="primary" size="small">删除</el-button>
            </template>
          </el-table-column>
        </template>
      </base-table>
    </div>
  </div>
</template>

<script>
import table from '@m/table.js';
export default {
  name: 'Home',
  mixins: [table],
  data() {
    return {
      nodeId: null
    };
  },
  methods: {
    async getTableData() {
      this.requestTableData(this.$apis.login.getTableList);
    },
    deleteEvt(row) {
      console.log(row);
    }
  },
  created() {
    this.tableData.defaultSort.prop = 'lastOrderTime';
    this.tableData.columns = [
      {label: '最近下单时间', prop: 'lastOrderTime', sortable: true, filter: 'formatDate', filterParam: [], width: 150},
      {label: '客户名', prop: 'userName'},
      {label: '订单总数', prop: 'orderTotal', align: 'center', filter: 'numberWithCommas', slotName: 'totalName'},
      {label: '未完成订单', prop: 'orderUnfinished', align: 'center', filter: 'numberWithCommas', slotName: 'totalName'},
      {label: '已完成订单', prop: 'orderFinished', align: 'center', filter: 'numberWithCommas', slotName: 'totalName'},
      {label: '采购类型', prop: 'purchaseType', align: 'center', filter: 'transformArrToStr'},
      {label: '采购数量', prop: 'purchaseTotal', align: 'center', filter: 'numberWithCommas', slotName: 'totalName'},
      {label: '优选客户', prop: 'isVip', sortable: true, align: 'center'},
      {label: '客户描述', prop: 'description'}
    ];
    this.getTableData();
  }
};
</script>

<style lang="less" scoped>
.table-container {
  .h(calc(~"100% - 56px"));
}
</style>
