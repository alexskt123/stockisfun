import { useEffect, Fragment } from 'react'

import { useRouter } from 'next/router'
import Container from 'react-bootstrap/Container'
import useSWR from 'swr'

import PageLoading from '../components/Loading/PageLoading'
import { staticSWROptions, fetcher } from '../config/settings'

//export default component
export default function ETFOrStock() {
  const router = useRouter()
  const { ticker } = router.query

  const { data } = useSWR(
    `/api/quote?ticker=${ticker}`,
    fetcher,
    staticSWROptions
  )

  useEffect(() => {
    if (data && ticker) {
      const href =
        data.valid && data.type === 'EQUITY'
          ? 'stockdetail'
          : data.valid && data.type === 'ETF'
          ? 'etfdetail'
          : ''
      router.replace(`/${href}?query=${ticker}`)
    }
  }, [data, router, ticker])

  //template
  return (
    <Fragment>
      <Container
        style={{ minHeight: '100vh' }}
        className="shadow-lg p-3 mb-5 rounded"
      >
        <PageLoading />
      </Container>
    </Fragment>
  )
}
