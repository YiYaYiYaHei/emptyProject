/*********************************************************************
 * 递归树组件
 * 1、使用示例：<base-recurse-tree ref="tree"></base-recurse-tree>
 * 2、设置treeList
      this.$nextTick(() => {
        if (this.$refs.tree) {
          // 因为要联动左侧树选中状态，如果在初始化的时候去组装数据，会导致数据更改为初始组装时的数据，从而无法联动，因此在此处调用，保证assemableData只调用一次
          this.$refs.tree.treeList = result.data;
          this.$refs.tree.assemableData();
          this.$refs.tree.changeFile('/etc/centos7.row8');
        }
      });
  * 3、修改activeItem：(由于点击文件A，定位后，如果用户又把文件A的父节点收起，然后用户又点击了文件A，此时监听不到，所以使用了refs调用而不是使用props+监听)
       this.$refs.tree.changeFile('/etc/centos7.row8');
 *********************************************************************/
<script>
export default {
  name: 'BaseRecurseTree',
  render() {
    return this.renderTree();
  },
  props: {
    // label名
    labelName: {
      type: String,
      default: 'fileName'
    },
    // value名（也可以理解为"唯一性"标识的键名）
    valueName: {
      type: String,
      default: 'fileId'
    },
    // 子节点名
    childrenName: {
      type: String,
      default: 'children'
    },
    // 是否保证只有一个展开
    isSingleExpand: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      // 激活树项（absolutePath）
      activeItem: '',
      // 树
      treeList: [],
      // 盒子最大宽
      maxWidth: 0,
      // 盒子宽度
      boxWidth: 0,
      boxHeight: 0,
      // 其他标签的宽度：icon宽+"(已删除)"宽
      otherWidth: 140
    };
  },
  methods: {
    // 树联动处理(activeTreeItem改变时，需要定位到树上的某一项)
    async changeFile(val) {
      this.activeItem = val;
      console.log(val);
      // 清空选中状态
      this.resetCheckedStatus();
      this.maxWidth = this.isSingleExpand ? 0 : this.maxWidth;

      const data = this.findItem(val);
      // 设置联动项的选中、展开状态
      await this.resetData(this.treeList, (item) => {
        item.isChecked = item[this.valueName] === val;
        // 展开联动项时，保证已展开的数据不收起
        item.isOpen = item.hasChildren && (data.path || '').startsWith(item.path) ? true : (this.isSingleExpand ? false :  item.isOpen);
        // 设置最大宽 - 防止初始化时，长fileName不出现横向滚动条
        this.setMaxWidth(item);
      });

      // 强制数据刷新
      // this.$forceUpdate();
      this.$nextTick(() => {
        if (this.$refs[data.path]) {
          // 右侧查询所有文件时，点击滚动到对应位置
          const dom = document.querySelector('.base-recurse-tree-container');
          dom.scrollTop = this.$refs[data.path].getBoundingClientRect().y > this.boxHeight ? this.$refs[data.path].getBoundingClientRect().y : dom.scrollTop;
          // 防止多次点击同一个不高亮
          this.$refs[`title_${data.path}`].setAttribute('class', this.setItemTitleCls(data));
        }
      });
    },
    // 查找数据
    findItem(absolutePath, list = this.treeList, result = null) {
      if (result) return result;
      const length = list.length;
      for (let i = 0; i < length; i++) {
        const item = list[i];
        if (item[this.valueName] === absolutePath) {
          return item;
        }
        if (this.isSubTree(item)) {
          result = this.findItem(absolutePath, item[this.childrenName], result);
        }
      }
      return result;
    },
    /**
     * 组装数据 - fileName、fileId必填
     * [String] fileName - 文件/目录名称
     * [String] fileId - 文件id (只要是可以作唯一性标识的，都可以)
     * [Boolean] hasChildren - 是否有子节点： true-是， false-不是
     * [Array] children - 下级目录结构
     * [Number] level - 层级 (从1开始)
     * [Boolean] isClick - 是否可点击 (如果hasChildren为true，且需要点击效果，可以设置此值)
     * [Boolean] isChecked - 是否选中 (高亮时使用)
     * [Boolean] isOpen - 是否展开
     * [String] path - 路径 (右侧查询时，定位到对应文件时使用，判断父级是否需要展开)
     *
     * 以上属性，必须存在；【codeLevel、isDelete、isVirus】是业务属性
     *
     * [Number] codeLevel - 码址等级：1-灰名单   2-白名单 3-黑名单
     * [Number] isDelete - 是否删除： 1-是  0-否
     * [Number] isVirus - 是否有毒：1-是 0-否
     */
    assemableData(list = this.treeList, level = 0, path = '') {
      for (const item of list) {
        // 设置层级(从1开始)
        item.level = level + 1;
        // 是否选中(高亮时使用)
        item.isChecked = item[this.valueName] === this.activeItem;
        // 是否默认展开  默认展开三层 - item.isOpen = item.hasChildren && item.level < 3;
        item.isOpen = false;
        // 路径(可用于查找其父级)
        item.path = `${path}/${item[this.labelName]}/`;
        // 是否有子节点(用于判断是否可点击：只有文件即无子节点的数据可以点击，其他需要设置点击效果的设置isClick为true即可)
        item.hasChildren = this.isSubTree(item);

        // 记录黑码址改变后的值（修改黑码址成功后不会重新请求树接口，codeLevel记录的是黑码址修改成功后的值）
        this.$set(item, 'codeLevelChange', item.codeLevel);

        // 设置最大宽 - 防止初始化时，长fileName不出现横向滚动条
        this.maxWidth = 0;
        this.setMaxWidth(item);
        if (this.isSubTree(item)) {
          this.assemableData(item[this.childrenName], item.level, item.path);
        }
      }
    },
    // 设置最大宽 - 防止初始化时，长fileName不出现横向滚动条
    setMaxWidth(item) {
      if (!item.hasChildren) return;
      // 设置盒子初始宽度
      const paddingLeft = parseInt(this.setPaddingLeft(item.level));
      if (item.isOpen) {
        for (const it of item[this.childrenName]) {
          // 根据计算文字的px宽度 来 判断 是否需要出现横向滚动条
          this.maxWidth = (paddingLeft + this.$tools.strPxWidth(it[this.labelName])) > this.maxWidth ? (paddingLeft + this.$tools.strPxWidth(it[this.labelName])) : this.maxWidth;
        }
      }
    },
    // 渲染树
    renderTree() {
      const treeNodes = this.createTreeNodes();
      return (
        <div class="base-recurse-tree-container">
          <div class="base-recurse-tree-box" style={{width: `${this.setBoxWidth()}`}}>{treeNodes}</div>
        </div>
      );
    },
    // 判断是否有子节点
    isSubTree(item) {
      return item[this.childrenName] && item[this.childrenName].length;
    },
    // 创建树节点
    createTreeNodes(list = this.treeList, nodesList = []) {
      for (const item of list) {
        nodesList.push(this.createTree(item));
      }
      return nodesList;
    },
    // 创建第一层树节点
    createTree(item) {
      const subTree = this.recursionCreateTree(item);
      return (
        <div class="tree-item" style={{height: this.setHeight(item.isOpen, item)}} ref={item.path}>
          {this.createTreeTitle(item)}
          {subTree}
        </div>
      );
    },
    // 递归创建子树
    recursionCreateTree(item) {
      const nodesList = [];
      if (this.isSubTree(item)) {
        for (const it of item[this.childrenName]) {
          nodesList.push(this.createSubTree(it));
        }
      }
      return nodesList;
    },
    // 创建第二层树节点
    createSubTree(item) {
      const subItem = [];
      if (this.isSubTree(item)) {
        item[this.childrenName].map(it => subItem.push(this.createSubItem(it)));
      }
      return (
        <ul class="tree-sub-group" style={{height: this.setHeight(item.isOpen, item)}} ref={item.path}>
          {this.createTreeTitle(item)}
          {subItem}
        </ul>
      );
    },
    // 创建树标题节点
    createTreeTitle(item) {
      return (<div class={this.setItemTitleCls(item)}
                   style={{'padding-left': this.setPaddingLeft(item.level)}}
                   onClick={(e) => this.treeItemClick(e, item)}
                   ref={`title_${item.path}`}
                   title={item[this.labelName]}>{this.createIcon(item)}{item[this.labelName]}  {this.createCodeLevel(item)} {item.isDelete ? '(已删除)' : ''}</div>);
    },
    // 创建第二层树节点项
    createSubItem(item) {
      const title = this.createTreeTitle(item);
      const subGroup = this.recursionCreateTree(item);
      return (
        <li class="tree-sub-item" style={{height: this.setHeight(item.isOpen, item)}} ref={item.path}>
          {title}
          {subGroup}
        </li>
      );
    },
    // 创建树展开/收起图标
    createIcon(item) {
      let icon = null;
      if (this.isSubTree(item)) {
        const cls = `icon ${item.isOpen ? 'el-icon-more' : 'el-icon-plus'}`;
        icon = <span class={cls} onClick={(e) => this.iconClick(e, item)} ref={`icon_${item.path}`}></span>;
      }
      return icon;
    },
    // 展开/收起 图标点击事件
    iconClick(event, item) {
      // 阻止事件冒泡 - 防止点击icon时，触发treeItemClick
      event.stopPropagation();

      item.isOpen = !item.isOpen;
      if (this.isSingleExpand) {
        // 保证只展开一项
        this.resetData(this.treeList, (it) => {
          if (item.isOpen) {
            it.isOpen = it.hasChildren && item.path.startsWith(it.path);
          } else {
            const index = item.path.lastIndexOf(`/${item.name}`);
            it.isOpen = it.hasChildren && item.path.slice(0, index).startsWith(it.path);
          }
          this.setIconStatus(it);
        });
      } else {
        this.setIconStatus(item);
      }

      // 递归计算盒子实际宽度 - 解决左侧树横向滚动条问题
      this.maxWidth = this.calcusReallyWidth(this.treeList, this.boxMaxWidth);
      // 设置盒子的宽度, otherWidth 为 icon宽 + “(已删除)”字样的宽度
      const dom = document.querySelector('.base-recurse-tree-box');
      dom && (dom.style.width = this.setBoxWidth());
    },
    // 递归设置icon展开/收起状态
    setIconStatus(item) {
      // 设置icon图标
      this.$refs[`icon_${item.path}`] &&  this.$refs[`icon_${item.path}`].setAttribute('class', `icon ${item.isOpen ? 'el-icon-more' : 'el-icon-plus'}`);
      // 设置当前项的高度 - 收起时为'36px'， 展开时为'auto'
      this.$refs[item.path] && (this.$refs[item.path].style.height = this.setHeight(item.isOpen, item));
    },
    /**
     * 计算盒子实际宽度 - 解决左侧树横向滚动条问题(每次展开操作都需要递归计算盒子实际宽度)
     * 由于展开/收起的容器宽度随内容变化而出现滚动条，所以此处需要手动计算宽度，促使容器出现横向滚动条（如果设置div为inline-block，会导致容器的横向滚动条一直存在）
    */
    calcusReallyWidth(list = this.treeList, maxWidth) {
      for (const item of list) {
        // 盒子宽 = 左边距 + 内容宽 + icon宽 + “(已删除)”字样的宽度
        const paddingLeft = parseInt(this.setPaddingLeft(item.level));
        maxWidth = (paddingLeft + this.$tools.strPxWidth(item[this.labelName])) > maxWidth ? (paddingLeft + this.$tools.strPxWidth(item[this.labelName])) : maxWidth;
        if (item.isOpen && this.isSubTree(item)) {
          maxWidth = this.calcusReallyWidth(item[this.childrenName], maxWidth);
        }
      }
      return maxWidth;
    },
    // 设置盒子的宽度   盒子宽 = 左边距 + 内容宽 + icon宽 + “(已删除)”字样的宽度
    setBoxWidth() {
      return this.maxWidth > this.boxMaxWidth ? `${this.maxWidth + this.otherWidth}px` : 'auto';
    },
    // 设置高度
    setHeight(isOpen) {
      return isOpen ? 'auto' : '36px';
    },
    // 设置左边距
    setPaddingLeft(level) {
      return `${level === 1 ? 20 : level * 26}px`;
    },
    // 树项点击 事件 - 联动右侧
    treeItemClick(event, item) {
      // 防止点击 黑码址 的时候，触发此事件
      if (!event.target.getAttribute('class').includes('tree-item-title')) return;
      // 如果该项可点击：文件/磁盘镜像/内存镜像 可点击
      if (item.isClick || !item.hasChildren) {
        // 清空其他选中
        this.resetData(this.treeList, (item) => (item.isChecked = false));
        this.resetCheckedStatus();

        // 设置当前项的选中状态
        item.isChecked = !item.isChecked;
        this.activeItem = item[this.valueName];

        // 点击磁盘镜像/内存镜像 所需的参数值
        this.$emit('changeActiveItem', this.activeItem);

        event.target.setAttribute('class', this.setItemTitleCls(item));
      }
    },
    /**
     * 设置树label的className
     * 基础样式：tree-item-title
     * 选中样式：active
     * 可点击样式（文件、isClick为true 可点击）：pointer
     * 【业务代码】有毒样式：virus
     * 【业务代码】已删除样式：delete
    */
    setItemTitleCls(item) {
      if (item.fileId === this.activeItem) console.log(item, `tree-item-title${item.isChecked ? ' active' : ''}${item.isClick || !item.hasChildren ? ' pointer' : ''}${item.isVirus ? ' virus' : ''}${item.isDelete ? ' delete' : ''}`);
      return `tree-item-title${item.isChecked ? ' active' : ''}${item.isClick || !item.hasChildren ? ' pointer' : ''}${item.isVirus ? ' virus' : ''}${item.isDelete ? ' delete' : ''}`;
    },
    // 重置数据 - 选中状态时，需清空其他项的选中状态
    resetData(list = this.treeList, cb) {
      for (const item of list) {
        typeof cb === 'function' && cb(item);
        if (this.isSubTree(item)) {
          this.resetData(item[this.childrenName], cb);
        }
      }
    },
    // 清空其他选中
    resetCheckedStatus() {
      const domList = document.getElementsByClassName('tree-item-title');
      const length = domList.length;
      for (let i = 0; i < length; i++) {
        const className = domList[i].getAttribute('class') || '';
        const item = {
          isChecked: false,
          isClick: className.includes('pointer'),
          hasChildren: className.includes('pointer'),
          isVirus: className.includes('virus'),
          isDelete: className.includes('delete')
        };
        domList[i].setAttribute('class', this.setItemTitleCls(item));
      }
    },
    // 【业务代码】创建码址等级标签
    createCodeLevel(item) {
      let html = '';
      if (item.codeLevelChange) {
        const codeLevelChange = this.$options.filters.transCodeLevel(item.codeLevelChange, false);
        const radio = [];
        for (const it of this.$dict.codeLevel) {
          radio.push(<el-radio label={it.value}>{it.label}</el-radio>);
        }
        html = <el-popover placement="bottom" trigger="click" popper-class="code-level-pop">
                <el-radio-group onChange={(e) => this.codeLevelClick(e, item)} vModel={item.codeLevelChange}>
                  {radio}
                </el-radio-group>
                <span slot="reference" class="code" level={item.codeLevelChange}>{codeLevelChange}</span>
              </el-popover>;
      }
      return html;
    },
    // 【业务代码】码址等级点击事件 - 修改码址等级
    async codeLevelClick(val, item) {
      // const result = await this.$api.postDataRequest('DISK_SET_CODELEVEL', {codeAddLevel: val, filePath: item.absolutePath});
      const result = {status: 200};
      // 修改黑码址成功后不会重新请求树接口(为了记录用户操作时的状态，比如滚动条的位置、展开收起的目录项)，codeLevel记录的是黑码址修改成功后的值
      if (result && result.status === 200) {
        item.codeLevel = item.val;
      } else {
        this.$message.error(result.message);
        item.codeLevelChange = item.codeLevel;
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      const dom = document.querySelector('.base-recurse-tree-container');
      this.boxMaxWidth = dom.clientWidth - this.otherWidth;
      this.boxHeight = dom.clientHeight;
    });
  }
};
</script>

<style lang="less" scoped>
.base-recurse-tree-container {
  .full();
  overflow: auto;
  .base-recurse-tree-box {
    margin-top: 20px;
    height: calc(~"100% - 20px");
    padding-right: 10px;
  }
}
.tree-item {
  color: #fbfbfb;
  .fs14();
}
.icon {
  .dinlineb();
  vertical-align: middle;
  width: 20px;
  height: 20px;
  .fs12();
  text-align: center;
  line-height: 20px;
  border: solid 1px #ebecef;
  .pointer();
  margin-right: 6px;
  font-weight: normal!important;
}

.tree-item-title {
  // 选中
  &.active {
    background: rgba(220, 223, 230, 0.3);
    font-weight: bold;
  }
  // 有毒
  &.virus {
    color: #ff4040!important;
  }
  // 删除
  &.delete {
    color: #909399;
  }
}
.tree-item-title,
.tree-sub-item {
  line-height: 36px;
  white-space: nowrap;
}
.tree-sub-item {
  max-height: 1000px;
  .transition();
}
// 收起
.tree-item,
.tree-sub-item,
.tree-sub-group {
  overflow: hidden;
}
.code {
  margin-left: 8px;
}
</style>
