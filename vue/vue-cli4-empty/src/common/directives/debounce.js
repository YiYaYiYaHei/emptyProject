/*
 *需求：防止按钮在短时间内被多次点击，使用防抖函数限制规定时间内只能点击一次。
 *
 *思路：
 *  1、第一次点击，立即调用方法并禁用按钮，等延迟结束再次激活按钮
 *  2、将需要触发的方法绑定在指令上
 *
 *使用：给 Dom 加上 v-debounce 及回调函数即可
 *<button v-debounce>防抖提交</button>
 */

export default {
  inserted: function (el, binding) {
    let timer;
    el.addEventListener('click', () => {
      if (timer) {
        clearTimeout(timer);
      }
      if (!el.disabled) {
        el.disabled = true;
        binding.value();
        timer = setTimeout(() => {
          el.disabled = false;
        }, 1000);
      }
    });
  }
};
