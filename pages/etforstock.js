import { useEffect, Fragment } from 'react'

import PageLoading from '@/components/Loading/PageLoading'
import { useStaticSWR } from '@/lib/request'
import { useRouter } from 'next/router'
import Container from 'react-bootstrap/Container'

//export default component
export default function ETFOrStock() {
  const router = useRouter()
  const { ticker } = router.query

  const { data } = useStaticSWR(
    ticker,
    `/api/yahoo/getQuoteType?ticker=${ticker}`
  )

  useEffect(() => {
    if (data?.result && ticker) {
      const result = data.result
      const href =
        result.valid && result.type === 'EQUITY'
          ? 'stockdetail'
          : result.valid && result.type === 'ETF'
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
