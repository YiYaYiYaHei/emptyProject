/*********************************************************************
 * Vue directive & filter register file
 * Created by shuhui-meng on 2020/07/10
 *********************************************************************/

const Autofocus = {
  inserted(el) {
    el.focus();
  }
};


export {
  Autofocus
};
