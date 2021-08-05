export default {
  data() {
    return {
      hasPagination: true,
      pagingData: {
        size: 30,
        current: 1,
        sizes: [30, 70, 100, 150],
        total: 0
      },
      tableData: {
        isLoading: false,                                            // 加载框
        columns: [],                                                 // 表格列
        data: [],                                                    // 表格数据
        orderField: '',                                              // 表格排序字段
        orderBy: 'DESC',                                             // 表格排序类型：DESC-降序  ASC-升序
        selection: [],                                               // 表格勾选数据
        defaultSort: {prop: 'createTime', order: 'descending'},      // 表格默认排序，elment-ui14+不再支持默认查询
        rowClassName: '',                                            // 表格行class
        isSingleExpand: true,                                        // 表格是否始终允许之展开一行数据
        rowKey: row => row.id,                                       // 表格rowKey,供展开时使用
        expandedRows: [],                                            // 表格展开的rowKey列表
        configColumnList: [],                                        // 表格设置列
        configColumnCheckedList: ['purchaseType']                    // 表格设置列-勾选列
      }
    };
  },
  methods: {
    // 获取表格数据
    async getTableData() {
      console.log('base view method...');
    },
    // 搜索、新增、删除 表格数据时调用
    refreshTableData() {
      this.pagingData.current = 1;
      this.getTableData();
      this.scrollToEvt();
    },
    // 请求表格数据
    async requestTableData(requestApi, params = {}, type = ['page', 'sort']) {
      this.tableData.isLoading = true;
      params = this.getTableParams(type, params);
      const result = await requestApi(params);
      this.tableData.isLoading = false;
      if (result.status === 200) {
        this.tableData.data = (result.data || {rows: []}).rows;
        type.includes('page') && (this.pagingData.total = (result.data || {total: []}).total);
      } else {
        this.$message.error(result.message);
      }
    },
    // 获取表格分页、排序参数
    getTableParams(type = ['page', 'sort'], otherParams = {}) {
      const _type = typeof type === 'string' ? [type] : type;
      const params = {};
      _type.includes('page') && Object.assign(params, {page: this.pagingData.current, size: this.pagingData.size});
      if (_type.includes('sort')) {
        !this.tableData.orderField && this.setTableSortData(this.tableData.defaultSort);
        Object.assign(params, {orderField: this.tableData.orderField, orderBy: this.tableData.orderBy});
      }
      return Object.assign(params, otherParams);
    },
    // 分页事件 val - 值   type - 分页类型：size：每页条数，current：当前页
    pagingEvent(val, type) {
      if (type === 'size') {
        this.pagingData.size = val;
        this.pagingData.current = 1;
      } else {
        this.pagingData.current = val;
      }
      this.getTableData();
      this.scrollToEvt();
    },
    // 表格数据滚到到顶部
    scrollToEvt(type) {
      this.$nextTick(() => {
        const dom = document.querySelector('.base-table-container .el-table__body-wrapper');
        !type && dom.scrollTo(0, 0);
        type === 'top' && (dom.scrollTop = 0);
        type === 'left' && (dom.scrollLeft = 0);
      });
    },
    // 设置表格排序字段
    setTableSortData({prop, order}) {
      this.tableData.orderField = prop;
      this.tableData.orderBy = order === 'descending' ? 'DESC' : 'ASC';
    },
    // 表格排序事件
    sortChangeEvt({column, prop, order}) {
      this.setTableSortData({prop, order});
      this.pagingData.current = 1;
      this.getTableData();
      this.scrollToEvt('top');
    },
    // 表格勾选事件
    selectionChangeEvt(selection) {
      this.tableData.selection = selection;
    },
    // 判断是否勾选
    isTableSelect() {
      return !!this.tableData.selection && !!this.tableData.selection.length;
    },
    // 获取表格勾选参数
    getSelectData(key = 'id', selection = this.tableData.selection) {
      if (!key || !/string|object/.test(typeof key)) return false;
      const data = selection.map(item => {
        // key为字符串
        if (typeof key === 'string') return item[key];
        let temp = null;
        if (key instanceof Array) {
          // key为数组 如：['ip', 'id']
          temp = [];
          for (const it of key) temp.push(item[it]);
        } else {
          // key为对象 如：{dataId: 'id', dataInId: 'inId'}
          temp = {};
          for (const name in key) {
            temp[name] = item[key[name]];
          }
        }
        return temp;
      });
      return data;
    },
    // 获取表格序号
    rowIndex(index) {
      return (this.hasPagination ? (this.pagingData.current - 1) * this.pagingData.size : 0) + index + 1;
    },
    // 查找base-table组件，也可以用$refs一层层找
    findBaseTableComp(parentComponent = this, refName = 'baseTable') {
      let component = parentComponent.$refs[refName];
      if (component) return component;
      for (const childComponent of parentComponent.$children) {
        component = this.findBaseTableComp(childComponent, refName);
        if (component) return component;
      }
    },
    // 拿到行展开信息：key、是否已展开、在expandRowKeys中的下标
    getExpandRowInfo(row) {
      const rowKey = this.tableData.rowKey(row);
      const index = this.tableData.expandedRows.indexOf(rowKey);
      const isExpanded = index !== -1;
      return {rowKey, isExpanded, index};
    },
    // 展开/收起触发事件--expandedRows需与rowKey对应
    expandChangeEvt(row, expandedRows) {
      this.tableData.expandedRows = expandedRows.map(row => this.tableData.rowKey(row));
    },
    // 只展开一行
    singleExpand(row, index) {
      // 设置其他行的isExpanded为false
      const list = this.tableData.data.filter(it => it.expandRowDetail && it.expandRowDetail.isExpanded);
      list.map(it => (it.expandRowDetail.isExpanded = false));
      row.expandRowDetail.isExpanded = true;
      this.tableData.expandedRows = this.tableData.expandedRows.splice(index, 1);
    },
    // 行展开/收起状态切换
    toggleRowExpansion(row) {
      // 切换当前行的状态
      this.findBaseTableComp().toggleRowExpansion(row);
      const {isExpanded: isNeedExpand, index} = this.getExpandRowInfo(row);
      this.$set(row, 'expandRowDetail', {isLoading: true, data: {}, isExpanded: isNeedExpand});
      if (isNeedExpand) {
        // 是否只展开一行
        this.tableData.isSingleExpand && this.singleExpand(row, index);
        this.getExpandRowDetail(row);
      }
    },
    // 获取展开行数据
    async requestExpandRowDetail(row, requestApi, params = {}) {
      row.expandRowDetail.isLoading = true;
      const result = await requestApi(params);
      row.expandRowDetail.isLoading = false;
      if (result.status === 200) {
        row.expandRowDetail.data = result.data;
      } else {
        this.$message.error(result.message);
      }
    }
  }
};
