<template>
  <div class="menu-item-container">
    <template v-for="item in menuListShow">
      <el-submenu v-if="!item.isHidden && item.hasChildren" :key="item.fullPath" :index="item.fullPath">
        <template #title>
          <i class="menu-icon" :class="item.meta.iconCls"></i>
          <span>{{item.name}}</span>
        </template>
        <menu-item :menuList="item.children"></menu-item>
      </el-submenu>

      <el-menu-item v-else-if="!item.isHidden" :key="item.fullPath" :index="item.fullPath">
        <!-- icon不能放在title插槽中: 会导致collapse为true时，icon无法显示 -->
        <i class="menu-icon" :class="item.meta.iconCls"></i>
        <span slot="title">{{item.name}}</span>
      </el-menu-item>
    </template>
  </div>
</template>

<script>
/**
 * 由于el-menu的直接子元素不是el-menu/el-submenu，所以导致在使用collapse属性时，出现文字、箭头、动画卡顿现象
 * 解决办法：
 * 1、手动对文字、箭头进行隐藏，并且设置.el-menu:not(.el-menu--collapse)的宽度
 * 2、安装vue-fragment--可以减少无用dom或者想在template中一次返回多个节点
 */
import user from '@m/user.js';
export default {
  // 使用name属性可以实现组件自己调用自己
  name: 'MenuItem',
  mixins: [user],
  props: {
    menuList: {
      type: Array,
      default: () => ([])
    }
  },
  computed: {
    // 获取有权限的列表
    menuListShow: function() {
      return this.menuList.filter(it => it.meta.authority.includes(this.userRole));
    }
  }
};
</script>
<style lang="less" scoped>
.menu-icon {
  .dinlineb();
  width: 22px;
  .line-height(22px);
  .fs18();
  margin-right: 6px;
}
</style>
