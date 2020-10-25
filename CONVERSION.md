1. Add resolutions to `package.json`:

```json
  "resolutions": {
    "webpack": "5.1.3",
    "next": "9.5.5"
  },
```

2. Update next version to canary.

```json
  "dependencies": {
    "next": "^9.5.6-canary.0",
```

3. Create next.config.js.

Remote: 

```js
const { withModuleFederation } = require("@module-federation/nexjs-mf");
const path = require("path");

module.exports = {
  webpack: (config, options) => {
    const { buildId, dev, isServer, defaultLoaders, webpack } = options;
    const mfConf = {
      name: "test1",
      library: { type: config.output.libraryTarget, name: "test1" },
      filename: "static/runtime/remoteEntry.js",
      remotes: {},
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
```

Consumer: 

```js
const { withModuleFederation } = require("@module-federation/nexjs-mf");
const path = require("path");

module.exports = {
  webpack: (config, options) => {
    const { buildId, dev, isServer, defaultLoaders, webpack } = options;
    const mfConf = {
      name: "test2",
      library: { type: config.output.libraryTarget, name: "test2" },
      filename: "static/runtime/remoteEntry.js",
      remotes: {
        // For SSR, resolve to disk path (or you can use code streaming if you have access)
        test1: isServer
          ? path.resolve(
              __dirname,
              "../test1/.next/server/static/runtime/remoteEntry.js"
            )
          : "test1", // for client, treat it as a global
      },
      exposes: {},
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
```

4. Add `pages/_document.js`:

```js
import Document, { Html, Head, Main, NextScript } from "next/document";
import { patchSharing } from "@module-federation/nexjs-mf";

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        {patchSharing()}
        <script src="http://localhost:3000/_next/static/chunks/webpack.js" />
        <script src="http://localhost:3000/_next/static/runtime/remoteEntry.js" />
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
```

5. import Nav

```js
const Nav = (await import("test1/nav")).default;
```

Use it per normal.
