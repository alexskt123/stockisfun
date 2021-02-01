import '../styles/globals.css'
import 'bootstrap/dist/css/bootstrap.min.css'

import Layout from '../components/Layout'
import { Fragment } from 'react'


function MyApp({ Component, pageProps }) {
  return (
    <Fragment>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Fragment>
  )
}

export default MyApp
