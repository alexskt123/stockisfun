import Head from 'next/head'
import '../styles/globals.css'
import 'bootstrap/dist/css/bootstrap.min.css'

import Layout from '../components/Layout/Layout'
import { Fragment } from 'react'
// lib
import { StateProvider } from '../lib/store'

function MyApp({ Component, pageProps }) {
  return (
    <Fragment>
      <Head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
        />
        <meta name="description" content="Description" />
        <meta name="keywords" content="Keywords" />
        <title>Stock Is Fun</title>

        <link rel="manifest" href="/manifest.json" />
        <link
          href="/icons/icon.png"
          rel="icon"
          type="image/png"
          sizes="16x16"
        />        
        <link
          href="/icons/icon.png"
          rel="icon"
          type="image/png"
          sizes="32x32"
        />
        <link rel="apple-touch-icon" href="/icons/icon.png"></link>
        <meta name="theme-color" content="#317EFB" />
      </Head>
      <StateProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </StateProvider>
    </Fragment>
  )
}

export default MyApp
