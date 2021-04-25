const path = require("path"),
    TerserPlugin = require('terser-webpack-plugin'),
    env = process.env.NODE_ENV.trim(),
    isPRD = env === "production",
    publicPath = '/',
    outputDir = 'dist',
    title = "顶侧菜单";

const config = {
  publicPath,
  outputDir,
  assetsDir: './',
  lintOnSave: false,
  chainWebpack: () => {},
  pages: {
    index: {
        entry: "src/main.js",
        template: "public/index.html",
        filename: "index.html",
        title
    }
  },
  configureWebpack: config => {
    config.mode = isPRD ? "production" : "development";
    Object.assign(config, {
        resolve: {
            extensions: [".js", ".vue", ".json"],
            alias: {
                "@": path.resolve(__dirname, "./src")
            }
        },
        // 设置打包文件名
        output: {
          path: path.resolve(__dirname, outputDir),
          filename: `js/[name].${+new Date()}.js`,
          publicPath,
          chunkFilename: `js/[name].${+new Date()}.js`
        },
    });
    // 去除打包的console.log
    config.optimization = {
        minimizer: [
          new TerserPlugin({ 
            extractComments: false,  // 去除js打包后的LICENSE.txt文件
            terserOptions: { 
              compress: { 
                drop_console: true 
              } 
            } 
          })
        ]
    }
  },
  productionSourceMap: !isPRD,
  css: {
    extract: {
      // 修改打包后的css文件名
      filename: `css/[name].${+new Date()}.css`,
      chunkFilename: `css/[name].${+new Date()}.css`
    },
    sourceMap: false,
    requireModuleExtension: true,
    loaderOptions: {}
  },
  parallel: require("os").cpus().length > 1,
  devServer: {
    host: "0.0.0.0",
    port: 9091,
    https: false,
    hotOnly: false,
    proxy: {
        "/apis": {
            target: "http://localhost:9091",
            pathRewrite: {"^/apis": ""},
            secure: false
        }
    }
  },
  pluginOptions: {
    // TODO something here
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [path.resolve(__dirname, './src/styles/common.less')] // less所在文件路径
    }
  }
};

module.exports = config;
