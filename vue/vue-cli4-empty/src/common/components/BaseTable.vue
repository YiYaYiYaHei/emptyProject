<template>
  <div class="base-table-container full">
    <template v-if="tableData.columns.length">
      <!-- 固定列不随表格内容滚动：el-table设置height属性 -->
      <el-table ref="baseTable"
                :data="tableData.data"
                :height="hasPagination ? `calc(100% - 68px)` : '100%'"
                style="width: 100%;"
                :default-sort="tableData.defaultSort"
                @sort-change="$emit('sortChange', $event)"
                @selection-change="$emit('selectionChange', $event)"
                :row-key="tableData.rowKey"
                :expand-row-keys="tableData.expandedRows"
                @expand-change="(row, expandedRows) => $emit('expandChange', row, expandedRows)">
        <!-- 列类型 -->
        <slot name="columnType"></slot>
        <template v-for="(item, i) in tableData.columns">
          <el-table-column :key="`table_${i}`"
                           v-if="!item.isHidden"
                           :prop="item.prop"
                           :label="item.label"
                           :min-width="item.width || 120"
                           :show-overflow-tooltip="true"
                           :align="item.align || 'left'"
                           :sort-orders="['descending', 'ascending']"
                           :sortable="item.sortable ? 'custom' : false">
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
                     class="fr pd20"
                     layout="total, sizes, prev, pager, next, jumper">
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
 * className: 列样式class
 * sortable: 列是否可排序（后端排序）
 * filter: 过滤器名称：默认transformNull
 * filterParam: 数组-过滤器参数
 * width: 列最小宽度，默认120
 * slotName: 插槽名
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
  }
};
</script>
