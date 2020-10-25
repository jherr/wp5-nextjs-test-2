const {
  withModuleFederation,
  MergeRuntime,
} = require("@module-federation/nextjs-mf");

module.exports = {
  webpack: (config, options) => {
    withModuleFederation(config, options, {
      name: "test1",
      library: { type: config.output.libraryTarget, name: "test1" },
      filename: "static/runtime/remoteEntry.js",
      remotes: {},
      exposes: {
        "./nav": "./components/nav",
      },
      shared: [],
    });

    if (!options.isServer) {
      config.output.publicPath = "http://localhost:3000/_next/";
    }

    config.plugins.push(new MergeRuntime());

    return config;
  },
};
