import { Html, Head, Main, NextScript } from 'next/document'

interface PageProps {

}

function Page({  }: PageProps) {
  return (
    <Html className="scroll-smooth scrollbar">
     <Head>
        <link rel="shortcut icon" href="/icon-black.png" />
    </Head>
        <body>
            <Main />
            <NextScript />
        </body>
    </Html>
  )
}

export default Page
