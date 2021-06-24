import { useRouter } from 'next/router'
import { useEffect, Fragment } from 'react'
import Container from 'react-bootstrap/Container'
import PageLoading from '../components/Loading/PageLoading'
import { staticSWROptions, fetcher } from '../config/settings'

import useSWR from 'swr'

//export default component
export default function ETFToStock() {
  const router = useRouter()
  const { ticker, href } = router.query

  const { data } = useSWR(
    `/api/etfdb/getETFDB?ticker=${ticker}`,
    fetcher,
    staticSWROptions
  )

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
