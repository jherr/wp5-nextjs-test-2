import Document, { Html, Head, Main, NextScript } from "next/document";
import { sharePatch } from "@module-federation/nextjs-with-module-federation";

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        {sharePatch()}
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
