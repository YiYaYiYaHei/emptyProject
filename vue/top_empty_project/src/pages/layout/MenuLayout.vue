/*********************************************************************
 * Vue directive & filter register file
 * Created by shuhui-meng on 2020/07/16
 *********************************************************************/
<template>
  <div class="application-top-menu">
    <div class="system-title">系统名称</div>
    <el-menu :default-active="activeIndex"
             mode="horizontal"
             router>
      <template v-for="(item, i) in menuList">
        <template v-if="item.hasChildren && !item.hidden">
          <!-- 一级菜单 -->
          <el-submenu :key="`menu_${i}`" :index="item.label">
            <template slot="title">
              <i v-if="!!item.icon" class="menu-icon" :class="item.icon"></i>
              <span class="fs16">{{item.label}}</span>
            </template>
            <template v-for="(child, j) in item.children"
                      v-if="!child.hidden">
              <template v-if="child.hasChildren">
                <el-submenu :key="`menu_${i}_${j}`" :index="child.label">
                  <!-- 二级菜单 -->
                  <template slot="title">
                    <i v-if="!!child.icon" class="menu-icon" :class="child.icon"></i>
                    <span class="fs15">{{child.label}}</span>
                  </template>
                  <!-- 三级菜单 -->
                  <el-menu-item v-for="(son, k) in child.children"
                                :key="`menu_${i}_${j}_${k}`"
                                :index="son.label"
                                :route="son.path"
                                v-if="!son.hidden">
                    <i v-if="son.icon" class="menu-icon" :class="son.icon"></i>
                    <span class="fs14">{{son.label}}</span>
                  </el-menu-item>
                </el-submenu>
              </template>
              <template v-else>
                <!-- 二级菜单 -->
                <el-menu-item :key="`menu_${i}_${j}`" :index="child.label" :route="child.path">
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
            <span class="fs16">{{item.label}}</span>
          </el-menu-item>
        </template>
      </template>

    </el-menu>
    <div class="user-info">
      <el-popover placement="top-end"
                  width="140"
                  trigger="click"
                  :visible-arrow="false"
                  popper-class="logout-popover">
        <div class="logout-container pointer" @click="logoutEvt">
          <span class="logout-img"></span>
          <span class="logout">退出</span>
        </div>
        <div slot="reference" class="pointer">
          <span class="user-img"></span>
          <span class="user-name ellipsis">{{userInfo.userName || 'admin'}}</span>
        </div>
      </el-popover>
    </div>
  </div>
</template>

<script>
import BaseView from '@/pages/BaseView.vue'
import { mapGetters } from 'vuex'
import { MENU_LIST } from '@/router/config.js'

export default {
  extends: BaseView,
  data() {
    return {
      menuList: [],
      activeIndex: '首页'
    }
  },
  computed: {
    ...mapGetters({
      userInfo: 'getUserInfo'
    })
  },
  methods: {
    getInitPage() {
      this.menuList = JSON.parse(JSON.stringify(MENU_LIST));
      this.assembleMenuList();
      this.activeIndex = this.$route.name || '首页';
    },
    assembleMenuList(list) {
      let _list = list || this.menuList;
      let length = _list.length;
      for (let i = 0; i < length; i++) {
        let item = _list[i];
        item.hasChildren = (item.children || []).filter(it => !it.hidden).length;
        if (item.children&&item.children.length) {
          this.assembleMenuList(item.children)
        }
      }
    },
    /* 退出 */
    async logoutEvt() {
      let result = await this.$api.getDataRequest('USER_LOGOUT', {});
      if (!!result && result.status) {
        this.logout();
      }
    }
  },
  created() {
    this.getInitPage();
  }
}
</script>

