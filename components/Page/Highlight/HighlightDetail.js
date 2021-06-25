import { Fragment, useEffect, useState } from 'react'

import { useRouter } from 'next/router'

import { fireToast } from '../../../lib/toast'

const axios = require('axios').default

const HighlightDetail = ({ highlightDetails }) => {
  const [tickerType, setTickerType] = useState(null)
  const router = useRouter()

  const { query, type, show } = router.query

  const viewTickerDetail = async () => {
    const response = await axios.get(`/api/quote?ticker=${query}`)
    const { data } = response || { data: null }

    data?.valid
      ? data?.type === 'ETF' || data?.type === 'EQUITY'
        ? setTickerType(data.type)
        : fireToast({
            icon: 'error',
            title: 'Only Stock/ETF can be viewed!'
          })
      : fireToast({
          icon: 'error',
          title: 'Please enter a valid symbol!'
        })
  }

  const refreshQuoteDetail = async () => {
    if (type && type === 'detail') viewTickerDetail()
  }

  useEffect(() => {
    ;(async () => {
      await refreshQuoteDetail()
    })()
    return () => setTickerType(null)
    //todo: fix custom hooks
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, type, show])

  return (
    <Fragment>
      {show && query
        ? highlightDetails
            .filter(x => x.type === tickerType)
            .map((detail, idx) => (
              <detail.component key={idx} inputTicker={query} />
            ))
        : null}
    </Fragment>
  )
}

export default HighlightDetail
