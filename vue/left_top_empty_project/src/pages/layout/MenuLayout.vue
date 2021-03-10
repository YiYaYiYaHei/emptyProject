/*********************************************************************
 * Created by shuhui-meng on 2020/07/16
 *********************************************************************/
<template>
  <div class="application--left-top-menu">
    <div class="system-title">系统名称</div>
    <el-menu :default-active="activeIndex"
             class="el-menu-top"
             mode="horizontal">
      <template v-for="(item, i) in menuList">
        <template v-if="!item.hidden">
          <!-- 一级菜单 -->
          <el-menu-item :index="item.label" :key="`menu_${i}`" @click="topMenuClick(item, 'click')" class="fs16">
            <i class="menu-icon" v-if="!!item.icon" :class="item.icon"></i>
            <span>{{item.label}}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
    <!-- 左侧菜单 -->
    <el-menu :default-active="leftActiveIndex"
             class="el-menu-left"
             :style="{'width': !!leftMenuList.length ? '210px': 0}"
             router>
      <template v-for="(item, i) in leftMenuList">
        <!-- 二级菜单 -->
        <template v-if="item.children && item.children.length && !item.hidden">
          <el-submenu :key="`menu_left_${i}`" :index="item.label" class="fs15">
            <template slot="title">
              <i class="menu-icon" v-if="!!item.icon" :class="item.icon"></i>
              <span>{{item.label}}</span>
            </template>
            <!-- 三级菜单 -->
            <el-menu-item v-for="(son, k) in item.children"
                          :key="`menu_left_${i}_${k}`"
                          v-if="!son.hidden"
                          :index="son.label"
                          :route="son.path"
                          class="pl48 menu-three fs14">
              <i class="menu-icon" v-if="!!son.icon" :class="son.icon"></i>
              <span>{{son.label}}</span>
            </el-menu-item>
          </el-submenu>
        </template>
        <template v-else-if="!item.hidden">
          <!-- 二级菜单 -->
          <el-menu-item :key="`menu_left_${i}`" :index="item.label" :route="item.path" class="fs15">
            <i class="menu-icon" v-if="!!item.icon" :class="item.icon"></i>
            <span>{{item.label}}</span>
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
        <div slot="reference"
             class="pointer">
          <span class="user-img"></span>
          <span class="user-name text-overflow-ellipsis">{{userInfo.userName || 'admin'}}</span>
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
      leftMenuList: [],
      activeIndex: '首页',
      leftActiveIndex: ''
    }
  },
  computed: {
    ...mapGetters({
      userInfo: 'getUserInfo'
    })
  },
  watch: {
    leftMenuList: {
      deep: true,
      handler: function (val) {
        this.$emit('changeMenuExpand', !!val.length);
      }
    }
  },
  methods: {
    getInitPage() {
      this.menuList = JSON.parse(JSON.stringify(MENU_LIST));
      let _menu = this.menuList.find(it => it.path === this.$route.path);
      if (!!_menu) {
        /* 顶部菜单查找 */
        this.activeIndex = this.$route.name || '首页';
        this.leftActiveIndex = '';
        this.topMenuClick(_menu);
      } else {
        /* 左侧菜单查找 */
        this.activeIndex = this.findLeftMenuParent();
        let _leftMenu = this.menuList.find(it => it.label === this.activeIndex);
        this.leftActiveIndex = this.$route.name;
        this.topMenuClick(_leftMenu);
      }
    },
    /* 查找父级菜单 */
    findLeftMenuParent() {
      let name = '';
      this.$route.matched.forEach(item => {
        if (!item.parent) name = item.name;
      })
      return name;
    },
    /* 顶部菜单点击事件 */
    topMenuClick(item, type) {
      this.leftMenuList.splice(0);
      if (!!item.path) {
        this.leftActiveIndex = '';
        this.$router.push(item.path);
      } else {
        setTimeout(() => {
          let list = item.children && item.children.length ? item.children : []
          this.leftMenuList = JSON.parse(JSON.stringify(list));
          if (!!type) {
            this.$nextTick(() => {
              this.leftActiveIndex = this.findLeftActiveIndex();
            })
          }
        })
      }
    },
    findLeftActiveIndex() {
      let name = '';
      let path = '';
      if (!!this.leftMenuList.length) {
        let _parent = this.leftMenuList.find(it => !it.hidden);
        let obj = !!_parent ? !!(_parent.children || []).length
                  ? _parent.children.find(it => !it.hidden)
                  : _parent : { label: '', path: '' };
        path = obj.path;
        name = obj.label;
      }
      this.$router.push(path);
      return name;
    },
    /* 退出 */
    async logoutEvt() {
      let result = await this.$api.getDataRequest('USER_LOGOUT', {});
      if (!!result && result.status) {
        this.logout();
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.getInitPage();
    })
  }
}
</script>

