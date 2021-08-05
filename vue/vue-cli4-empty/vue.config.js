// webpack: https://cli.vuejs.org/zh/config/#%E5%85%A8%E5%B1%80-cli-%E9%85%8D%E7%BD%AE
const path = require('path'),
  TerserPlugin = require('terser-webpack-plugin'),
  isPRD = process.env.NODE_ENV === 'production',
  publicPath = '/',
  outputDir = 'dist',
  title = process.env.VUE_APP_SYSTEM_NAME;

module.exports = {
  publicPath,
  outputDir,
  pages: {
    index: {
      // page 的入口
      entry: 'src/main.js',
      // 模板来源
      template: 'public/index.html',
      // 在 dist/index.html 的输出
      filename: 'index.html',
      // 当使用 title 选项时，
      // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
      title,
      // 在这个页面中包含的块，默认情况下会包含
      // 提取出来的通用 chunk 和 vendor chunk。
      chunks: ['chunk-vendors', 'chunk-common', 'index']
    }
  },
  css: {
    extract: {
      // 修改打包后的css文件名
      filename: `css/[name].${+new Date()}.css`,
      chunkFilename: `css/[name].${+new Date()}.css`
    },
  },
  configureWebpack: {
    mode: isPRD ? 'production' : 'development',
    // 别名配置
    resolve: {
      extensions: ['.js', '.vue', '.json'],
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@a': path.resolve(__dirname, './src/assets'),
        '@p': path.resolve(__dirname, './src/pages'),
        '@m': path.resolve(__dirname, './src/mixins'),
        '@u': path.resolve(__dirname, './src/utils')
      }
    },
    output: {
      // 修改打包后的js文件名
      filename: `js/[name].${+new Date()}.js`,
      chunkFilename: `js/[name].${+new Date()}.js`
    },
    // production环境, 去除打包的console.log
    optimization: {
      minimizer: [
        new TerserPlugin({
          // 去除js打包后的LICENSE.txt文件
          extractComments: false,
          terserOptions: {
            compress: {
              warnings: false,
              drop_console: true,
              drop_debugger: true,
              pure_funcs: ['console.log']
            }
          }
        })
      ]
    }
  },
  // 配置eslint - 安装@vue/cli-plugin-eslint之后生效。
  lintOnSave: !isPRD,
  devServer: {
    host: '0.0.0.0',
    port: 9090,
    https: false,
    hotOnly: false,
    // eslint作为编译错误在浏览器上显示
    overlay: {
      warnings: true,
      errors: true
    },
    proxy: {
      '/apis': {
        // yApi: mengshuhui  mengshuhui961117
        target: 'https://yapi.142vip.cn/mock/857',
        // target: 'http://127.0.0.1:13666',
        pathRewrite: {
          '^/apis': ''
        },
        secure: true,  // 如果是https接口，需要配置这个参数
        changeOrigin: true  // 如果接口跨域，需要进行这个参数配置
      },
      '/file': {
        target: 'https://npm.taobao.org/mirrors/node/npm',
        // target: 'http://127.0.0.1:13666',
        pathRewrite: {
          '^/file': ''
        },
        secure: false,  // 如果是https接口，需要配置这个参数
        changeOrigin: true  // 如果接口跨域，需要进行这个参数配置
      },
      '/segmentfault': {
        target: 'https://cn.vuejs.org/v2/guide/',
        pathRewrite: {
          '^/segmentfault': ''
        }
      },
      '/baidu': {
        target: 'https://www.baidu.com/',
        pathRewrite: {
          '^/baidu': ''
        }
      }
    }
  },
  // 第三方插件选项
  pluginOptions: {
    // less全局配置--需要安装vue-cli-plugin-style-resources-loader+style-resources-loader，执行vue add style-resources-loader即可
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [path.resolve(__dirname, './src/assets/styles/common.less')]
    }
  },
  // 加速生产环境构建
  productionSourceMap: !isPRD
};
