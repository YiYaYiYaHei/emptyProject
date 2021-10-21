/*
 * 输入框失焦时，去除字符串首尾空格
 * 需求：输入框 - 由于首尾空格，导致查询结果不对
 * v-model.trim也可以过滤掉首尾空格，但是对于“input str”中间的空格需要先输入"inputstr"，然后手动移到中间位置去插入空格
 * 思路：
 *   1、获取到所有的input标签并绑定change事件
 * @example：<el-input v-model="searchCondition.keyword" placeholder="模糊搜索" v-trim>
 */

export default {
  // 当传进来的值更新的时候触发
  componentUpdated(el) {
    bindChangeEvt(el, 'bind');
  },
  unbind(el) {
    bindChangeEvt(el, 'unBind');
  }
};
// 给'input', 'textarea'标签绑定change事件 -- 失焦时，去除首尾空格
function bindChangeEvt(el, type) {
  const tagsList = ['input', 'textarea'];
  for (const tags of tagsList) {
    const inputsDom = el.getElementsByTagName(tags);
    const eventType = type === 'bind' ? 'addEventListener' : 'removeEventListener';
    if (inputsDom && inputsDom.length) {
      for (const item of inputsDom) {
        item[eventType]('change', changeEvt);
      }
    }
  }
}

function changeEvt(event) {
  const dom = event.target;
  dom.value = dom.value.replace(/(^\s*)|(\s*$)/g, '');
  // 调用input事件使vue v-model绑定更新
  dom.dispatchEvent(new Event('input'));
}
