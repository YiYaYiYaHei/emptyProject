/*********************************************************************
 * Vue directive & filter register file
 * Created by shuhui-meng on 2020/07/09
 *********************************************************************/
<template>
  <div class="application-left-menu" :style="{'width': !menuExpand ? '52px' : '210px'}">
    <div class="menu-title"></div>
    <div class="menu-content">
      <el-menu router 
              :default-active="activeIndex" 
              :collapse="!menuExpand">
        <template v-for="(item, i) in menuList">
          <template v-if="item.children && item.children.length && !item.hidden">
            <!-- 一级菜单 -->
            <el-submenu :key="`menu_${i}`" :index="item.label" class="menu-one">
              <template slot="title">
                <i v-if="!!item.icon" class="menu-icon" :class="item.icon"></i>
                <span class="fs16">{{item.label}}</span>
              </template>
              <template v-for="(child, j) in item.children" v-if="!child.hidden">
                <template v-if="child.children && child.children.length">
                  <el-submenu :key="`menu_${i}_${j}`" :index="child.label" class="menu-two">
                    <!-- 二级菜单 -->
                    <template slot="title">
                      <i v-if="!!child.icon" class="menu-icon" :class="child.icon"></i>
                      <span class="fs15">{{child.label}}</span>
                    </template>
                    <!-- 三级菜单 -->
                    <el-menu-item v-for="(son, k) in child.children" :key="`menu_${i}_${j}_${k}`" :index="son.label" :route="son.path" v-if="!son.hidden">
                      <i v-if="son.icon" class="menu-icon" :class="son.icon"></i>
                      <span class="fs14">{{son.label}}</span>
                    </el-menu-item>
                  </el-submenu>
                </template>
                <template v-else>
                  <!-- 二级菜单 -->
                  <el-menu-item :key="`menu_${i}_${j}`" :index="child.label" :route="child.path" class="pl48">
                    <i class="menu-icon" v-if="!!child.icon" :class="child.icon"></i>
                    <span class="fs15">{{child.label}}</span>
                  </el-menu-item>
                </template>
              </template>
            </el-submenu>
          </template>
          <template v-else-if="!item.hidden">
            <!-- 一级菜单 -->
            <el-menu-item :index="item.label" :key="`menu_${i}`" :route="item.path">
              <i class="menu-icon" v-if="!!item.icon" :class="item.icon"></i>
              <span class="fs16 menu-item-tooltip" slot="title">{{item.label}}</span>
            </el-menu-item>
          </template>
        </template>
      </el-menu>
    </div>
  </div>
</template>

<script>
import { MENU_LIST } from '@/router/config.js'

export default {
  props: ['menuExpand'],
  data() {
    return {
      activeIndex: '首页'
    }
  },
  methods: {
    getInitPage() {
      this.menuList = JSON.parse(JSON.stringify(MENU_LIST));
      this.activeIndex = this.$route.name || '首页';
    },
  },
  created() {
    this.getInitPage()
  }
}
</script>

