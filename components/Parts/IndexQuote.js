import { Fragment, useState, useEffect } from 'react'
import { indexQuoteInfo } from '../../config/highlight'
import { staticSWROptions, fetcher } from '../../config/settings'

import useSWR from 'swr'
import YahooQuoteInfo from './YahooQuoteInfo'

function IndexQuote({ inputTicker }) {
  const [quoteData, setQuoteData] = useState([])

  const { data } = useSWR(
    `/api/getIndexQuote?ticker=${inputTicker}`,
    fetcher,
    staticSWROptions
  )

  useEffect(() => {
    setQuoteData(data)
    return () => setQuoteData(null)
  }, [data])

  return (
    <Fragment>
      <YahooQuoteInfo data={quoteData} displayQuoteFields={indexQuoteInfo} />
    </Fragment>
  )
}

export default IndexQuote
