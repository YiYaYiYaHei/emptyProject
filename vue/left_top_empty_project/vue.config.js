const path = require("path"),
    TerserPlugin = require('terser-webpack-plugin'),
    env = process.env.NODE_ENV.trim(),
    isPRD = env === "production",
    outputDir = 'leftTopEmptyProject',
    title = "左+顶菜单";

const config = {
  publicPath: "/",
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
        }
    });
    // 去除打包的console.log
    config.optimization = {
        minimizer: [new TerserPlugin({ terserOptions: { compress: { drop_console: true } } })]
    }
  },
  productionSourceMap: !isPRD,
  css: {
    extract: true,
    sourceMap: false,
    requireModuleExtension: true,
    loaderOptions: {}
  },
  parallel: require("os").cpus().length > 1,
  devServer: {
    host: "0.0.0.0",
    port: 9090,
    https: false,
    hotOnly: false,
    proxy: {
        "/apis": {
            target: "http://localhost:9090",
            pathRewrite: {"^/apis": ""},
            secure: false
        }
    }
  },
  pluginOptions: {
    // TODO something here
  }
};

module.exports = config;
