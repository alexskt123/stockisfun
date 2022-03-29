import { createElement, Fragment, useEffect } from 'react'

import useSWR from 'swr'

import HighlightDetail from '@/components/Page/Highlight/HighlightDetail'
import HighlightPriceQuote from '@/components/Page/Highlight/HighlightPriceQuote'
import HighlightSearch from '@/components/Page/Highlight/HighlightSearch'
import HighlightTickerAlert from '@/components/Page/Highlight/HighlightTickerAlert'
import { fetcher } from '@/config/settings'
import { fireToast } from '@/lib/commonFunction'

export default function HighlightInfo({ query }) {
  const { type, ticker } = query

  const highlightInfoConfig = {
    quote: HighlightPriceQuote,
    detail: HighlightDetail
  }

  const { data } = useSWR(
    () => ticker && `/api/yahoo/getQuoteType?ticker=${ticker}`,
    fetcher
  )

  useEffect(() => {
    data &&
      !data?.result &&
      fireToast({
        icon: 'error',
        title: 'Please enter a valid symbol!'
      })
  }, [data])

  const Component = highlightInfoConfig[type] || null

  return (
    <Fragment>
      <HighlightSearch />

      <HighlightTickerAlert valid={data?.result?.valid} />

      {Component && createElement(Component, { ticker, data: data?.result })}
    </Fragment>
  )
}
