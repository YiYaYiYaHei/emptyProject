// webpack官方文档: https://cli.vuejs.org/zh/config/#%E5%85%A8%E5%B1%80-cli-%E9%85%8D%E7%BD%AE
const path = require('path'),
  TerserPlugin = require('terser-webpack-plugin'),
  isPRD = process.env.NODE_ENV === 'production',
  publicPath = '/',
  outputDir = 'dist',
  title = process.env.VUE_APP_SYSTEM_NAME;

// webpack启用gzip压缩
const isGizp = false;
const CompressionPlugin = require('compression-webpack-plugin');
const productionGzipExtensions = ['js', 'css'];

// webpack打包速度分析插件
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const smp = new SpeedMeasurePlugin();

// cdn相关配置
const cdnConfig = require('./cdn.config.js');

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
      chunks: ['chunk-vendors', 'chunk-common', 'index'],
      // 调用：htmlWebpackPlugin.options.CDN（设置CDN链接）
      CDN: isPRD && cdnConfig.useCDN ? cdnConfig.CDN : null
    }
  },
  css: {
    extract: {
      // 修改打包后的css文件名
      filename: `css/[name].${+new Date()}.css`,
      chunkFilename: `css/[name].${+new Date()}.css`
    },
  },
  configureWebpack: smp.wrap({
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
    optimization: {
      // production环境生效 - 官方文档https://webpack.docschina.org/plugins/terser-webpack-plugin/
      minimizer: [
        new TerserPlugin({
          // 使用多进程并发运行以提高构建速度（webpack是单线程，开启多线程压缩速度更快）
          parallel: 4,
          // 是否将注释剥离到单独的文件中（默认为true）: 去除js打包后的LICENSE.txt文件(里面是注释)
          extractComments: false,
          terserOptions: {
            // 去除打包的console.log
            compress: {
              warnings: false,
              drop_console: true,
              drop_debugger: true,
              pure_funcs: ['console.log']
            },
            // 去除注释
            output: {
              comments: false
            }
          }
        })
      ]
    },
    plugins: isPRD && isGizp? [
      // 使用Gzip压缩文件 - https://segmentfault.com/a/1190000012571492   https://www.jianshu.com/p/fcfa1945db23
      // 官方文档 - https://webpack.docschina.org/plugins/compression-webpack-plugin/
      // 报错："TypeError: Cannot read property 'tapPromise' of undefined"是compression-webpack-plugin版本问题5.0.1
      new CompressionPlugin({
        // 目标资产文件名
        filename: '[path].gz[query]',
        // 压缩算法/函数（默认gzip）
        algorithm: 'gzip',
        // 匹配需要压缩的文件
        test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
        // 仅处理大于此大小的资产。以字节为单位。（10k以上压缩）
        threshold: 10240,
        // 仅处理压缩率高于此比率的资产 ( minRatio = Compressed Size / Original Size)。示例：您的image.png文件大小为 1024b，文件的压缩版本大小为 768b，因此minRatio等于0.75. 换句话说，资产将在Compressed Size / Original Size价值减去minRatio价值时进行处理
        minRatio: 0.8
      })
    ] : [],
    // 生产环境注入CDN
    externals: isPRD && cdnConfig.useCDN ? cdnConfig.externals : {}
  }),
  // 配置eslint - 安装@vue/cli-plugin-eslint之后生效。
  lintOnSave: !isPRD,
  devServer: {
    host: '0.0.0.0',
    port: 8080,
    https: false,
    // 是否开启热更新 热更新：在应用程序运行时交换、添加或删除模块，无需完全重新加载，即新代码生效，网页不刷新，状态不丢失；若为false表示自动刷新，即每次修改网页都会刷新状态也会丢失
    hotOnly: false,
    // 当出现编译错误或警告时，在浏览器上显示(eslint语法错误也会显示)
    overlay: {
      warnings: true,
      errors: true
    },
    proxy: {
      '/apis': {
        // yApi: mengshuhui  mengshuhui961117
        // target: 'https://yapi.142vip.cn/mock/857',
        target: 'http://127.0.0.1:13666',
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
      '/download': {
        target: 'http://47.100.181.44:13666',
        pathRewrite: {
          '^/download': ''
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
