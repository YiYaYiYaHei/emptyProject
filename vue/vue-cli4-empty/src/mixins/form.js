export default {
  methods: {
    /**
     * 多/单 表单验证
     * @param {Function} cb - 回调函数
     * @param {String|Array} [formNames] - 表单名
     */
    submitForm(cb, formNames = 'form') {
      const formNameList = typeof formNames === 'string' ? [formNames] : formNames;
      const promise = [];
      formNameList.map(item => promise.push(this.checkForm(item)));
      Promise.all(promise).then(() => {
        typeof cb === 'function' && cb();
      }).catch(() => false);
    },
    // 表单验证
    checkForm(formName) {
      return new Promise((resolve, reject) => {
        this.$refs[formName].validate(valid => {
          // 验证成功与后台交互
          if (valid) {
            resolve();
          } else {
            reject(new Error('表单验证失败'));
          }
        });
      });
    },
    // 重置表单 -- 重置表单是重置为初始值，若先点击编辑再点击新增时，出现表单未重置情况，是表单初始值设置问题：打开弹框后且dom元素渲染完成后再赋值
    resetForm(formName = 'form') {
      this.$nextTick(() => {
        this.$refs[formName] && this.$refs[formName].resetFields() && this.$refs[formName].clearValidate();
      });
    },
    // 移除表单校验项
    clearForm(formName = 'form') {
      this.$refs[formName] && this.$refs[formName].clearValidate();
    },
    /**
     * 设置表单校验结果
     * @param {String} status - 校验结果 success、error
     * @param {String} field - 表单字段
     * @param {String} msg - 表单校验失败提示语
     * @param {String} [formName] - 表单ref名
     * @example this.setValidateStatus('success', 'testResult', '设备可连接，请选择分析目录', 'addEquipmentForm');
     */
    setValidateStatus(status, field, msg, formName = 'form') {
      const fields = this.$refs[formName].fields;
      const item = fields.find(it => it.prop === field);
      if (item) {
        item.validateState = status;
        item.validateMessage = msg || item.validateMessage;
      }
    },
    // 关闭弹框 - 重置数据为初始化值
    dialogCloseEvt(dataName, formName = 'form') {
      this[dataName] = this.$options.data.call(this)[dataName];
      this.resetForm(formName);
    }
  }
};
