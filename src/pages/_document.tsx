import Document, {
  DocumentContext,
  DocumentProps,
  Head,
  Html,
  Main,
  NextScript
} from 'next/document'

type Props = Record<string, unknown> & DocumentProps

class DevpartyDocument extends Document<Props> {
  static async getInitialProps(context: DocumentContext) {
    const initialProps = await Document.getInitialProps(context)
    return { ...initialProps }
  }

  render() {
    return (
      <Html>
        <Head>
          <link rel="icon" href="/favicon.svg" />
          <meta name="theme-color" content="#ffffff" />
          <link
            href="https://fonts.cdnfonts.com/css/circular-std"
            rel="stylesheet"
          />
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
