<template>
  <div class="goods-created-container full table-page-layout">
    <header class="mgb20 dflex">
      <el-button @click="deleteEvt('many')" type="primary" size="small">批量删除</el-button>
      <div class="mgl20">
        <span class="mgr10">用户类型</span>
        <el-select v-model="searchCondition.userType" size="small" placeholder="全部" clearable multiple collapse-tags :title="searchCondition.userType.join()" @change="refreshTableData">
          <el-option v-for="item in ['普通用户', '管理员']"
                    :key="item"
                    :label="item"
                    :value="item"></el-option>
        </el-select>
      </div>
      <el-input v-model.trim="searchCondition.keyword"
                placeholder="模糊搜索"
                maxlength=100
                clearable
                size="small"
                @clear="refreshTableData"
                @keyup.enter.native="refreshTableData"
                style="width: 300px;"
                class="mgl20">
        <span slot="append" @click="refreshTableData" class="pointer">搜索</span>
      </el-input>
    </header>
    <div class="table-container">
      <base-table ref="table"
                  :tableData="tableData"
                  :pagingData="pagingData"
                  @sizeChange="pagingEvent"
                  @currentChange="pagingEvent"
                  @sortChange="sortChangeEvt"
                  @selectionChange="selectionChangeEvt"
                  @expandChange="expandChangeEvt">
        <template #columnType>
          <el-table-column type="selection" width="46" :selectable="(row, index) => row.orderTotal % 2 != 0"></el-table-column>
          <el-table-column type="index" :index="rowIndex" width="60" label="序号" align="center"></el-table-column>
        </template>
        <!-- 自定义插槽名 -->
        <template #totalName="{data}">
          <span v-html="$options.filters[data.column.filter || 'transformNull'](data.row[data.column.prop], ...data.column.filterParam)"
                data-status-text="primary"
                class="pointer"
                @click="$message.info(data.row[data.column.prop]+'')"></span>
        </template>
        <template #otherColumns>
          <el-table-column label="操作" :min-width="400" align="center" fixed="right">
            <template #default="scope">
              <el-button @click="uploadFile($apis.home.fileUpload, {userName: 'addd'}, {acceptType: '.zip,.rar', acceptTypeErrMsg: '限.zip,.rar', limitSize: 30000 * 1024})" type="primary" size="small">上传</el-button>
              <el-button @click="downLoadEvt(`${$apis.home.fileDownload}/npm-1.1.0-1.zip`, null, '未知文件', 'FILE_DOWN')" type="primary" size="small">下载</el-button>
              <el-button @click="downLoadAjaxEvt('get', `${$apis.home.fileDownloadAsync}?name=login955.jpeg`, null, false)" type="primary" size="small">axios下载</el-button>
              <el-button @click="downLoadAjaxEvt('get', `${$apis.home.fileDownloadAsync}?name=HAP.pdf`, null, true)" type="primary" size="small">预览</el-button>
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
import table from '@m/table.js';
import user from '@m/user.js';
import file from '@m/file.js';
export default {
  name: 'GoodsCreate',
  mixins: [table, user, file],
  data() {
    const initQuery = {
      userType: [],
      keyword: ''
    };
    return {
      searchCondition: JSON.parse(JSON.stringify(initQuery)),
      searchReallyCondition: JSON.parse(JSON.stringify(initQuery)),
      nodeId: null,
      tableData: {
        defaultSort: {prop: 'lastOrderTime', order: 'descending'},
        rowClassName: ({row}) => row.orderTotal % 2 === 0 ? 'table-cell1' : '',
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
      this.reqTableData(this.$apis.home.getTableList, this.searchReallyCondition);
    },
    getExpandRowDetail(row) {
      this.requestExpandRowDetail(row, this.$apis.home.getTableDetail, {id: row.id});
    },
    deleteEvt(type, row) {
      if (type === 'many' && !this.isTableSelect()) {
        this.$message.warning('暂无勾选数据');
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
