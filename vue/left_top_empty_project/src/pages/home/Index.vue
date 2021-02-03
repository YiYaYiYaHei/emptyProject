<template>
  <div class="home-index-container" style="width: 100%; height: 100%">
    <el-table :data="tableData.data" style="width: 100%; height:calc(100% - 68px)">
      <el-table-column v-for="(item, i) in tableData.column" :key="`home_table_${i}`" :prop="item.props" :label="item.label" :min-width="item.width" :show-overflow-tooltip="true" align="center">
        <template slot-scope="scope">
          <span v-if="!!item.filter" v-text="$options.filters[item.filter](scope.row[scope.column.property], ...item.funcParam)"></span>
          <span v-else>{{scope.row[scope.column.property]}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <span>删除</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="pagingEvent($event, 'size')" @current-change="pagingEvent($event, 'current')" :current-page="pagingData.current" :page-sizes="pagingData.sizes" :page-size="pagingData.size" :total="pagingData.total" style="float: right;" layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
  </div>
</template>

<script>
import BaseView from '../BaseView.vue'
export default {
  extends: BaseView,
  data() {
    return {}
  },
  methods: {
    getTableData() {
      let temp = []
      for (let i = 0; i < 50; i++) {
        temp.push({
          time: +new Date(),
          proto: '0.8456467',
          fileName: '文件名称',
          fileType: '类型',
          srcIp: '源Ip',
          distIp: '目的Ip',
          level: '危险等级'
        })
      }
      this.tableData.data = temp
    }
  },
  created() {
    this.tableData.column = [
      {
        label: '时间',
        props: 'time',
        filter: 'dateFormat',
        funcParam: ['YYYY-MM-DD hh:mm:ss', 'hahhaha', '']
      },
      { label: '协议', props: 'proto', filter: 'fixNumber', funcParam: [] },
      { label: '文件名称', props: 'fileName' },
      { label: '类型', props: 'fileType' },
      { label: '源Ip', props: 'srcIp' },
      { label: '目的Ip', props: 'distIp' },
      { label: '危险等级', props: 'level' }
    ]
    this.getTableData()
  },
  mounted() {}
}
</script>
<style lang="less" scoped>
.el-pagination {
  padding: 18px 10px;
}
</style>

