import { Fragment, useState, useEffect } from 'react'

import LoadingSkeletonTable from '@/components/Loading/LoadingSkeletonTable'
import { indexQuoteInfo } from '@/config/indexQuote'
import {
  staticSWROptions,
  fetcher,
  loadingSkeletonColors
} from '@/config/settings'
import useSWR from 'swr'

import YahooQuoteInfo from './YahooQuoteInfo'

function IndexQuote({ inputTicker }) {
  const [quoteData, setQuoteData] = useState([])

  const { data } = useSWR(
    () => inputTicker && `/api/page/getIndexQuote?ticker=${inputTicker}`,
    fetcher,
    staticSWROptions
  )

  useEffect(() => {
    setQuoteData(data?.result)
    return () => setQuoteData(null)
  }, [data])

  return (
    <Fragment>
      {data?.result ? (
        <YahooQuoteInfo data={quoteData} displayQuoteFields={indexQuoteInfo} />
      ) : (
        <LoadingSkeletonTable customColors={loadingSkeletonColors.light} />
      )}
    </Fragment>
  )
}

export default IndexQuote
