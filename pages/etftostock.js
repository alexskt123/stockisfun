import { useEffect, Fragment } from 'react'

import PageLoading from '@/components/Loading/PageLoading'
import { useStaticSWR } from '@/lib/request'
import { useRouter } from 'next/router'
import Container from 'react-bootstrap/Container'

//export default component
export default function ETFToStock() {
  const router = useRouter()
  const { ticker, href } = router.query

  const { data } = useStaticSWR(ticker, `/api/etfdb/getETFDB?ticker=${ticker}`)

  useEffect(() => {
    if (data && href && ticker) {
      const tickerList =
        data?.holdingInfo
          .map(item => item.find(x => x))
          .filter(x => x !== 'Others')
          .join(',') || ticker
      router.replace(`/${href}?query=${tickerList}`)
    }
  }, [data, href, router, ticker])

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
