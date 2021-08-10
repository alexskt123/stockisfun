import { Fragment } from 'react'

import Price from '@/components/Parts/Price'
import QuoteCard from '@/components/Parts/QuoteCard'

import PriceSummary from './PriceSummary'

function PriceTab({ inputTicker }) {
  return (
    <Fragment>
      <PriceSummary inputTicker={inputTicker} />
      <QuoteCard
        inputTicker={inputTicker}
        isShow={true}
        minWidth={'20rem'}
        noClose={true}
      >
        <Price inputTicker={inputTicker} inputMA={'ma'} />
      </QuoteCard>
    </Fragment>
  )
}

export default PriceTab
