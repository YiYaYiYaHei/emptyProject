<template>
  <fragment class="menu-item-container">
    <template v-for="item in menuListShow">
      <el-submenu v-if="!item.isHidden && item.hasChildren"
                  :key="item.fullPath"
                  :index="item.fullPath">
        <template #title>
          <i class="menu-icon" :class="item.meta.iconCls"></i>
          <span>{{item.name}}</span>
        </template>
        <menu-item :menuList="item.children"></menu-item>
      </el-submenu>

      <el-menu-item v-else-if="!item.isHidden"
                    :key="item.fullPath"
                    :index="item.fullPath">
        <template #title>
          <i class="menu-icon" :class="item.meta.iconCls"></i>
          <span>{{item.name}}</span>
        </template>
      </el-menu-item>
    </template>
  </fragment>
</template>

<script>
/* 由于el-menu的直接子元素不是el-menu/el-submenu，所以导致在使用collapse属性时，出现文字、箭头、动画卡顿现象
解决办法：1、手动对文字、箭头进行隐藏，并且设置.el-menu:not(.el-menu--collapse)的宽度
2、安装vue-fragment--可以减少无用dom或者想在template中一次返回多个节点 */
import {Fragment}  from  'vue-fragment';
import {mapState} from 'vuex';
export default {
  // 使用name属性可以实现组件自己调用自己
  name: 'MenuItem',
  props: {
    menuList: {
      type: Array,
      default: () => ([])
    }
  },
  computed: {
    ...mapState({
      userRole: state => state.userInfo.userInfo.role
    }),
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
