/**
 ********************************************************************
 * 1、不检查某一行代码：
 * '// eslint-disable-next-line' 在代码上一行使用  或者  '// eslint-disable-line' 和代码在一行
 * 2、不检查某一段代码：
 * 用 '/* eslint-disable 星号/' 包裹
 * 3、不检查某一文件/文件夹：
 * 将文件路径写入.eslintignore文件即可
 ********************************************************************
 */

module.exports = {
  root: true,
  // 此项是用来指定javaScript语言类型和风格，sourceType用来指定js导入的方式，默认是script，此处设置为module，指某块导入方式
  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 2017,
    sourceType: 'module'
  },
  globals: {
    $: true
  },
  // 此项指定环境的全局变量，下面的配置指定为浏览器环境
  env: {
    browser: true,
    node: true,
    es6: true
  },
  // eslint标准文档：https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
  // 此项是用来配置标准的js风格，就是说写代码的时候要规范的写，如果你使用vs-code我觉得应该可以避免出错
  extends: [
    'standard',
    'plugin:vue/essential'
  ],
  // 此项是用来提供插件的，插件名称省略了eslint-plugin-，下面这个配置是用来规范html的
  plugins: [
    'vue'
  ],
  /*
   * 自定义规则    eslint中文官网：http://eslint.cn/docs/rules/
   * 下面这些rules是用来设置从插件来的规范代码的规则，使用必须去掉前缀eslint-plugin-
   * 0-'off'-关闭规则 1-'warn'-开启警告规则 2-'error'-开启错误规则（可以设置字符串也可以设置数字）
   */
  rules: {
    // 不强制 generator 函数中 * 号周围有空格
    'generator-star-spacing': 0,
    // production环境 禁止 debugger 语句
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    // 要求在语句末尾使用分号
    'semi': [2, 'always'],
    // 禁用不必要的分号
    'no-extra-semi': 2,
    // 不强制在 function的左括号之前使用一致的空格
    'space-before-function-paren': [0, 'always'],
    // 禁止在判断语句 else 前有 return
    'no-else-return': 2,
    // 禁止出现空函数
    'no-empty-function': 2,
    // 不强制对多行注释使用特定风格
    'multiline-comment-style': 0,
    // 不禁止注释和代码出现在同一行
    'no-inline-comments': 0,
    // 禁止 if 语句作为唯一语句出现在 else 语句块中 类似if(){} else {if(){}}
    'no-lonely-if': 2,
    // 禁止连续赋值，类似const a = b = 1;
    'no-multi-assign': 2,
    // 禁用行尾空白
    'no-trailing-spaces': [2, {skipBlankLines: false}],
    // 不允许花括号中有空格，类似[ 1 ]
    'standard/array-bracket-even-spacing': [2, 'never'],
    // 不允许花括号中有空格，类似{ a:1 }
    'object-curly-spacing': [2, 'never'],
    // 允许出现多个空格
    'no-multi-spaces': [0, {'ignoreEOLComments': true}],
    // 允许 const a = [], b = []
    'one-var': [0, 'always']
  }
};
