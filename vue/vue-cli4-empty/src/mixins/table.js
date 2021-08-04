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
        isLoading: false,
        columns: [],
        data: [],
        orderField: '',
        orderBy: 'DESC',
        selection: [],
        defaultSort: {prop: 'createTime', order: 'descending'},
        rowClassName: null,
        expandRowKeys: null,
        expands: [],
        configColumnList: []
      }
    };
  },
  methods: {
    // 获取表格数据
    async getTableData() {
      console.log('base view method...');
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
    },
    // 表格数据滚到到顶部
    scrollToTop() {
      this.$nextTick(() => {
        document.querySelector('.base-table-container .el-table__body-wrapper').scrollTo(0, 0);
      });
    },
    // 设置表格排序字段
    setTableSortData({prop, order}) {
      this.tableData.orderField = prop;
      this.tableData.orderBy = order === 'descending' ? 'DESC' : 'ASC';
    },
    // 表格排序事件
    sortChange({column, prop, order}) {
      this.setTableSortData({prop, order});
      this.pagingData.current = 1;
      this.getTableData();
      this.scrollToTop();
    },
    // 表格勾选事件
    selectionChange(selection) {
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
    }
  }
};
