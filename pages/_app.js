import '../styles/globals.css'
import 'bootstrap/dist/css/bootstrap.min.css'

import Layout from '../components/Layout/Layout'
import { Fragment } from 'react'
// lib
import { StateProvider } from '../lib/store'

function MyApp({ Component, pageProps }) {
  return (
    <Fragment>
      <StateProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </StateProvider>
    </Fragment>
  )
}

export default MyApp
