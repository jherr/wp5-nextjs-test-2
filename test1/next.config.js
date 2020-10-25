const {
  withModuleFederation,
} = require("@module-federation/nextjs-with-module-federation");
const path = require("path");

module.exports = {
  webpack: (config, options) => {
    const { buildId, dev, isServer, defaultLoaders, webpack } = options;
    const mfConf = {
      name: "next2",
      library: { type: config.output.libraryTarget, name: "next2" },
      filename: "static/runtime/remoteEntry.js",
      remotes: {
        // For SSR, resolve to disk path (or you can use code streaming if you have access)
        next1: isServer
          ? path.resolve(
              __dirname,
              "../next1/.next/server/static/runtime/remoteEntry.js"
            )
          : "next1", // for client, treat it as a global
      },
      exposes: {
        "./nav": "./components/nav",
      },
      shared: [],
    };

    // Configures ModuleFederation and other Webpack properties
    withModuleFederation(config, options, mfConf);

    if (!isServer) {
      config.output.publicPath = "http://localhost:3000/_next/";
    }

    return config;
  },
};
