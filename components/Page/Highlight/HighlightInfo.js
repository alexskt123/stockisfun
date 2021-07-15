import { createElement, Fragment, useEffect } from 'react'

import HighlightDetail from '@/components/Page/Highlight/HighlightDetail'
import HighlightPriceQuote from '@/components/Page/Highlight/HighlightPriceQuote'
import HighlightSearch from '@/components/Page/Highlight/HighlightSearch'
import HighlightTickerAlert from '@/components/Page/Highlight/HighlightTickerAlert'
import { fetcher } from '@/config/settings'
import { fireToast } from '@/lib/commonFunction'
import useSWR from 'swr'

export default function HighlightInfo({ query }) {
  const { type, ticker } = query

  const highlightInfoConfig = {
    quote: HighlightPriceQuote,
    detail: HighlightDetail
  }

  const { data } = useSWR(
    () => ticker && `/api/quote?ticker=${ticker}`,
    fetcher
  )

  useEffect(() => {
    if (!data) return

    if (!data.valid) {
      fireToast({
        icon: 'error',
        title: 'Please enter a valid symbol!'
      })
      return
    }
  }, [data, ticker])

  const Component = highlightInfoConfig[type] || null

  return (
    <Fragment>
      <HighlightSearch />

      <HighlightTickerAlert valid={data?.valid} />

      {Component && createElement(Component, { ticker, data })}
    </Fragment>
  )
}
