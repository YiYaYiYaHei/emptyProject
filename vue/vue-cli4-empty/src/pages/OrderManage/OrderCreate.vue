<template>
  <div class="full order-create-container dflex">
    <div class="tree-box hfull">
      <div class="title pdl20 pdr20">递归树</div>
      <base-recurse-tree ref="tree"></base-recurse-tree>
    </div>

    <div class="find-box">
      <div class="title pdl20 pdr20 tc">点击，文件定位</div>
      <div class="find">
        <span class="find-item dinlineb pointer" v-for="(item, i) in fileList" :key="`file_${i}`" @click="activeItem=item;$refs.tree.changeFile(activeItem)">{{item}}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OrderCreate',
  data() {
    return {
      fileList: ['/', '/usr/local/applicaiton.conf', '/usr/local/ffas-web.jar', '/root/winhex.sh', '/opt/index.html', '/etc/centos7.row8', '/ma.sh', '/etc/centos', 'et'],
      activeItem: ''
    };
  },
  methods: {
    async getTreeList() {
      const result = await this.$apis.home.treeList();
      if (result.status === 200) {
        this.$nextTick(() => {
          if (this.$refs.tree) {
            // 因为要联动左侧树选中状态，如果在初始化的时候去组装数据，会导致数据更改为初始组装时的数据，从而无法联动，因此在此处调用，保证assemableData只调用一次
            this.$refs.tree.treeList = result.data;
            this.$refs.tree.assemableData();
            this.$refs.tree.changeFile('/etc/centos7.row8');
          }
        });
      } else {
        this.$message.error(result.message);
      }
    }
  },
  created() {
    this.getTreeList();
  }
};
</script>

<style lang="less" scoped>
.title {
  font-size: 16px;
  .line-height(40px);
  background: rgba(201, 210, 255, .2);
}
// 树
.tree-box {
  width: 30%;
  box-shadow: 0 0 6px 0 #c9d2ff;
  .base-recurse-tree-container {
    height: calc(~"100% - 40px");
  }
}
// 文件定位
.find-box {
  width: 300px;
  box-shadow: 0 0 6px 0 #c9d2ff;
  margin-left: 80px;
  .find-item {
    .wfull();
    border-bottom: 1px solid #1e1f2b;
    .line-height(36px);
    text-decoration: underline;
  }
}
</style>
