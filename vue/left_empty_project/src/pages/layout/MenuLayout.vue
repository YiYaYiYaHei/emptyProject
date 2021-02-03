/*********************************************************************
 * Vue directive & filter register file
 * Created by shuhui-meng on 2020/07/09
 *********************************************************************/
<template>
  <div class="application-left-menu" :style="{'width': !menuExpand ? '52px' : '210px'}">
    <div class="menu-title"></div>
    <div class="menu-content">
      <div class="menu-one-container" v-for="(item, i) in menuList" :key="`menu_one_${i}`">
        <div class="menu-one" :class="{'active-one': item.hasChild&&item.expand}" :style="{'max-height': item.hasChild&&item.expand ? item.height+30+'px' : menuItemHeight+'px'}">
          <!-- 一级菜单 -->
          <span class="menu-one-label" :class="{'active': item.active}" @click.stop="clickMenu(item)" v-if="!item.hidden">
            <span :class="item.icon" class="icon"></span>
            <span>{{item.label}}</span>
            <span v-if="item.hasChild&&menuExpand" class="expand pointer" :class="{'active': item.expand}" @click.stop="expandMenu(item, i)"></span>
          </span>
          <!-- 二级菜单 -->
          <div v-for="(child, j) in item.children" :key="`menu_list_${i}_${j}`" v-if="!item.hidden&&!child.hidden" class="menu-one-label menu-two" :class="{'active-two': child.active}" @click.stop="clickMenu(child)" :style="{'height': child.expand ? child.height+'px' : menuItemHeight+'px'}">
            <div class="menu-two-label" :class="{'bg-none': child.hasChild}">
              <span v-if="!!child.icon" :class="child.icon" class="icon"></span>
              <span class="label" :class="{'ml16': !child.icon}">{{child.label}}</span>
              <span v-if="child.hasChild&&menuExpand" class="expand pointer" :class="{'active': child.expand}" @click.stop="expandMenu(child, i, j)"></span>
            </div>
            <!-- 三级菜单 -->
            <div class="menu-one-label menu-two menu-three" v-if="child.hasChild" :style="{'height': child.expand ? 'auto' : 0}">
              <div v-for="(son, k) in child.children" :key="`menu_list_${i}_${j}_${k}`" v-if="!item.hidden&&!child.hidden&&!son.hidden" :class="{'active-three': son.active}" @click.stop="clickMenu(son)">
                <div>
                  <span v-if="!!son.icon" :class="son.icon" class="icon"></span>
                  <span class="label" :class="{'ml28': !son.icon}">{{son.label}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { MENU_LIST } from '@/router/config.js'

export default {
  props: ['menuExpand'],
  data() {
    return {
      menuList: [],
      count: 0,
      isMenuExpand: false,
      menuItemHeight: 50, // 菜单项高度及顶部导航栏高度统一设置
      height: 'auto'
    }
  },
  watch: {
    menuExpand: function(val) {
      this.resetMenu(this.menuList, 'all')
      if (val) this.assembleMenu(this.$route.path)
    },
    '$route.path': function(newVal, oldVal) {
      this.changeMenu(newVal)
      this.$emit('changeMenuExpand', true)
    }
  },
  methods: {
    /* 获取菜单列表 */
    async getInitPage() {
      this.height = 'auto'
      this.isMenuExpand = this.menuExpand
      this.menuList = JSON.parse(JSON.stringify(MENU_LIST))
      this.resetMenu(this.menuList)
      this.assembleMenu(this.$route.path)
    },
    assembleMenu(path, list) {
      let _list = list || this.menuList
      let length = _list.length
      for (let i = 0; i < length; i++) {
        let item = _list[i]
        if (!!item.path && item.path === path) {
          item.active = true
        }
        if (item.hasChild) {
          let nextMenu = item.children.find(next => next.path === path)
          if (!!nextMenu) {
            item.expand = true
            item.active = true
            nextMenu.active = true
          } else {
            this.assembleMenu(path, item.children)
            item.active = !!(item.children || []).find(
              child => child.active && !child.hidden
            )
            item.expand =
              !!(item.children || []).find(
                child => child.expand && !child.hidden
              ) || item.expand
          }
        }
      }
    },
    /* 重置菜单选中、激活数据 */
    resetMenu(list, type) {
      let length = list.length
      for (let i = 0; i < length; i++) {
        let item = list[i]
        item.active = false
        item.expand = !type ? item.expand || false : false
        item.hasChild = !!item.children && !!item.children.length
        item.height = this.calcusHeight(item)
        if (!item.expand && item.hasChild)
          item.children.map(child => (child.expand = false))
        if (item.hasChild) this.resetMenu(item.children)
      }
    },
    calcusHeight(item) {
      let height = this.menuItemHeight
      if (item.hasChild) {
        let _childH = item.children.filter(it => !it.hidden)
        height += _childH.length * this.menuItemHeight
        item.children.map(it => {
          let _sonH = (it.children || []).filter(son => !son.hidden)
          height += _sonH.length * this.menuItemHeight
        })
      }
      return height
    },
    /** 菜单项点击事件
     * @param item 点击的菜单数据
     *  */
    async clickMenu(item) {
      if (!this.menuExpand) return
      let it = JSON.parse(JSON.stringify(item))
      let _path = this.getPath(it)
      this.changeMenu(_path)
    },
    changeMenu(path) {
      this.resetMenu(this.menuList)
      this.count++
      this.assembleMenu(path)
      if (this.count <= 1) {
        this.isDiffRoute(path)
      }
      this.$forceUpdate()
    },
    /* 获取点击菜单的实际path */
    getPath(item) {
      let path = ''
      if (!!item.path) return item.path
      if (!item.path && item.hasChild) path = this.getPath(item.children[0])
      return path
    },
    /* 判断点击前后路由是否发生改变 */
    isDiffRoute(path) {
      if (path !== this.$route.path) this.$router.push(path)
      this.count = 0
    },
    /* 菜单展开事件 */
    expandMenu(item, pIndex, index) {
      item.expand = !item.expand
      this.$forceUpdate()
    }
  },
  created() {
    this.getInitPage()
  }
}
</script>

