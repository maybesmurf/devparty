import Document, { Head, Html, Main, NextScript } from 'next/document'

// @ts-ignore
class DevpartyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <link rel="icon" href="/favicon.svg" />
          <link
            rel="apple-touch-icon"
            sizes="192x192"
            href="https://assets.devparty.io/images/icons/apple-touch-icon.png"
          />
          <link
            href="https://assets.devparty.io/css/font.css"
            rel="stylesheet"
          />
          <link rel="manifest" href="/manifest.json" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default DevpartyDocument
