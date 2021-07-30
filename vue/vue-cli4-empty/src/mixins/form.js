export default {
  methods: {
    /**
     * 多/单 表单验证
     * @param {String|Array} formNames - 表单名
     * @param {Function} cb - 回调函数
     */
    submitForm(formNames, cb) {
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
    // 重置表单
    resetForm(formName) {
      this.$nextTick(() => {
        this.$refs[formName] && this.$refs[formName].resetFields();
      });
    },
    // 移除表单校验项
    clearForm(formName) {
      this.$refs[formName] && this.$refs[formName].clearValidate();
    }
  }
};
