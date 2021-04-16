<template>
  <div class="full">
    <template v-if="!!tableData && !!tableData.column.length">
      <el-table :data="tableData.data" 
                style="width: 100%;"
                :style="{'height': hasPagination ? `calc(100% - 68px)` : '100%'}"
                :default-sort="tableData.defaultProp"
                @sort-change="$emit('sortChange', $event)"
                @selection-change="$emit('tableSelection', $event)">
        <slot name="columnType"></slot>
        <el-table-column v-for="(item, i) in tableData.column"
                         :key="`table_${i}`"
                         v-if="!item.isHidden"
                         :prop="item.props"
                         :label="item.label"
                         :min-width="item.width || 120"
                         :show-overflow-tooltip="true"
                         :align="item.align"
                         :sort-orders="tableData.sortOrders"
                         :sortable="item.sortable ? 'custom' : false">
          <template slot-scope="scope">
            <span v-if="!!item.filter"
                  v-html="$options.filters[item.filter](scope.row[scope.column.property], ...item.funcParam)"></span>
            <span v-else v-html="$options.filters.transformNull(scope.row[scope.column.property])"></span>
          </template>
        </el-table-column>
        <slot name="operator" :data="tableData"></slot>
        <slot name="column" :data="tableData"></slot>
      </el-table>
    </template>
    <slot name="table"></slot>

    <template v-if="hasPagination">
      <el-pagination @size-change="$emit('sizeChange', $event, 'size')"
                     @current-change="$emit('currentChange', $event, 'current')"
                     :current-page="pagingData.current"
                     :page-sizes="pagingData.sizes"
                     :page-size="pagingData.size"
                     :total="pagingData.total"
                     class="pd20"
                     style="float: right;"
                     layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    tableData: {
      type: Object,
      default: () => { }
    },
    pagingData: {
      type: Object,
      default: () => { }
    },
    hasPagination: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {}
  },
  methods: {

  },
  created() {
  }
}
</script>

