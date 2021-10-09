<template>
  <div class="base-table-container full pr" v-loading="tableData.isLoading">
    <!-- 设置列 -->
    <template v-if="tableData.configColumnList && tableData.configColumnList.length">
      <el-dropdown class="table-columns-config" trigger="click">
        <i class="el-icon-setting"></i>
        <el-dropdown-menu slot="dropdown" class="table-columns-config-dropdown">
          <el-checkbox-group v-model="tableData.configColumnCheckedList">
            <template v-for="item in tableData.configColumnList">
              <el-checkbox :key="item.value"
                          :label="item.value"
                          v-if="!item.isHidden">{{item.label}}</el-checkbox>
            </template>
          </el-checkbox-group>
        </el-dropdown-menu>
      </el-dropdown>
    </template>

    <template v-if="tableData.columns && tableData.columns.length">
      <!-- 固定列不随表格内容滚动：el-table设置height属性 -->
      <el-table ref="baseTable"
                :data="tableData.data"
                :height="hasPagination ? `calc(100% - 50px)` : '100%'"
                style="width: 100%;"
                :default-sort="tableData.defaultSort"
                :row-class-name="tableData.rowClassName"
                @sort-change="$emit('sortChange', $event)"
                @selection-change="$emit('selectionChange', $event)"
                :row-key="tableData.rowKey"
                :expand-row-keys="tableData.expandedRows"
                @expand-change="(row, expandedRows) => $emit('expandChange', row, expandedRows)">
        <!-- 列类型 -->
        <slot name="columnType"></slot>
        <template v-for="(item, i) in tableData.columns">
          <el-table-column :key="`table_${i}`"
                           v-if="getColumnIsShow(item)"
                           :prop="item.prop"
                           :label="item.label"
                           :min-width="item.width || 120"
                           :show-overflow-tooltip="!item.showTooltip"
                           :align="item.align || 'left'"
                           :sort-orders="['descending', 'ascending']"
                           :sortable="item.sortable ? 'custom' : false"
                           :class-name="item.cls || ''">
            <template #default="{row}">
              <span v-if="!item.slotName"
                    v-html="$options.filters[item.filter || 'transformNull'](row[item.prop], ...item.filterParam)"></span>
              <!-- 自定义名称插槽列 <template #totalName="{data}">{{data.row}}-{{data.column}}</template> 或 <template #totalName="data">{{data.data.row}}-{{data.data.column}}</template> -->
              <slot v-else :name="item.slotName" :data="{row, column: item}"></slot>
            </template>
          </el-table-column>
        </template>
        <!-- 其他列(展开行、操作列等) -->
        <slot name="otherColumns"></slot>
      </el-table>
    </template>
    <!--自定义表格-->
    <slot name="table"></slot>

    <!-- 表格分页 -->
    <template v-if="hasPagination">
      <el-pagination @size-change="$emit('sizeChange', $event, 'size')"
                     @current-change="$emit('currentChange', $event, 'current')"
                     :current-page="pagingData.current"
                     :page-sizes="pagingData.sizes"
                     :page-size="pagingData.size"
                     :total="pagingData.total"
                     class="fr"
                     layout="total, sizes, prev, pager, next, jumper"
                     size="small">
      </el-pagination>
    </template>
  </div>
</template>

<script>
/**
 * tableData.columns属性如下：
 * isHidden: 是否隐藏
 * label: 表格列标签label
 * prop: 列属性prop
 * align: 列对齐方式，默认left
 * cls: 列样式class
 * sortable: 列是否可排序（后端排序）
 * filter: 过滤器名称：默认transformNull
 * filterParam: 过滤器参数（数组类型）
 * width: 列最小宽度，默认120
 * showTooltip：是否展示自定义tooltip 为true时，表格默认tooltip不显示
 * slotName: 自定义插槽名 <template #relationProjectSlot="{data}"><span>{{data.row[data.column.prop] | transformNull}}</span></template>
 */
export default {
  props: {
    tableData: {
      type: Object,
      default: () => ({})
    },
    pagingData: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    hasPagination: function() {
      return Object.keys(this.pagingData).length;
    }
  },
  data() {
    return {};
  },
  watch: {
    'tableData.configColumnCheckedList': function(newVal) {
      this.$nextTick(() => {
        // 解决设置列勾选后，表格布局错位问题
        this.$refs.baseTable.doLayout();
      });
    }
  },
  methods: {
    // 判断表格列是否展示
    getColumnIsShow(item) {
      const flag = (this.tableData.configColumnList || []).find(it => it.value === item.prop);
      return flag ? this.tableData.configColumnCheckedList.includes(item.prop) : !item.isHidden;
    }
  }
};
</script>

<style lang="less" scoped>
/deep/.el-pagination {
  .pd(20, 20, 0, 20);
}
.table-columns-config {
  position: absolute;
  top: 6px;
  right: 0;
  z-index: 4;
  .fs(18);
  background: @bg-nav;
  padding: 0 8px;
}
</style>
