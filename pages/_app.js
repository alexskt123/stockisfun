import 'styles/globals.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'styles/ReactToggle.css'
import 'styles/Gooey.css'
import 'styles/AccessibleAccordion.css'

import { Fragment } from 'react'

import Layout from '@/components/Layout/Layout'
import { StateProvider } from '@/lib/store'

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
