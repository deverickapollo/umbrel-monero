module.exports = {
  transpileDependencies: ["monero-javascript"],
  chainWebpack: config => {
    config.plugin("html").tap(args => {
      args[0].template = "./public/index.html";
      return args;
    });
    // to disable conversation of, say, translate3d(0, 0, 0) to translateZ(0)
    // as Safari cannot render translateZ to translate3d transitions
    if (process.env.NODE_ENV === "production") {
      config.plugin("optimize-css").tap(args => {
        args[0].cssnanoOptions.preset[1].reduceTransforms = false;
        return args;
      });
    }

    // Add a new rule for js files
    config.module
      .rule("js")
      .test(/\.js$/)
      .use("babel-loader")
      .loader("babel-loader")
      .end();

    // Adjust the existing babel-loader rule to include the new plugin
    config.module
      .rule("js")
      .use("babel-loader")
      .tap(options => {
        // Initialize options if undefined
        if (!options) options = {};
        // Ensure plugins array is initialized
        if (!Array.isArray(options.plugins)) options.plugins = [];
        // Add the plugin
        options.plugins.push("@babel/plugin-proposal-class-properties");
        return options;
      });

    // config.module
    //   .rule("wasm")
    //   .test(/.wasm$/)
    //   .use("wasm-loader")
    //   .loader("wasm-loader");
  },
  devServer: {
    port: 8889
  },
  runtimeCompiler: true,
  configureWebpack: {
    devtool: "source-map"
    // externals: {
    //   experiments: {
    //     asyncWebAssembly: true
    //   }
    // }
  }
};
