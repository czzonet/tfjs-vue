module.exports = {
  // productionSourceMap: false,
  devServer: {
    proxy: {
      // 匹配 api 前缀
      "/api": {
        target: "http://localhost:6002/",
        changeOrigin: true,
        ws: true
      },
      "/public": {
        target: "http://localhost:6002/",
        changeOrigin: true,
        ws: true
      }
    },
    disableHostCheck: true,
    overlay: {
      warnings: false,
      errors: false
    }
  },
  configureWebpack: {
    devtool: "source-map"
  },
  chainWebpack: config => {
    // new Loader for ts
    config.module
      .rule("typescript")
      .test(/\.ts$/)
      .use("ts-loader")
      .loader("ts-loader")
      .end();
  }
};
