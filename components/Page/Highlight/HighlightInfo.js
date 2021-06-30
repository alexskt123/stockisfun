import { createElement, Fragment } from 'react'

import HighlightDetail from '@/components/Page/Highlight/HighlightDetail'
import HighlightPriceQuote from '@/components/Page/Highlight/HighlightPriceQuote'
import HighlightTickerAlert from '@/components/Page/Highlight/HighlightTickerAlert'

export default function HighlightInfo({ query }) {
  const { type, query: ticker } = query

  const hightlightInfoConfig = {
    quote: HighlightPriceQuote,
    detail: HighlightDetail
  }

  const Component = hightlightInfoConfig[type] || null

  return (
    <Fragment>
      <HighlightTickerAlert />

      {Component ? createElement(Component, { query: ticker }) : null}
    </Fragment>
  )
}
