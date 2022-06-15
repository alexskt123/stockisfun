import { Fragment } from 'react'

import CardGroup from 'react-bootstrap/CardGroup'

import QuoteCard from '@/components/Parts/QuoteCard'
import TradingView from '@/components/Parts/TradingView'

const TradingViewDeck = ({ inputTickers }) => {
  return (
    <CardGroup>
      {inputTickers?.map((ticker, idx) => {
        return (
          <Fragment key={idx}>
            <QuoteCard
              isShow={true}
              minWidth={'20rem'}
              noClose={true}
              className={'mt-2'}
            >
              <TradingView
                option={{
                  symbol: ticker,
                  container_id: `advanced-chart-widget-container-${idx}`,
                  theme: 'dark'
                }}
              />
            </QuoteCard>
          </Fragment>
        )
      })}
    </CardGroup>
  )
}

export default TradingViewDeck
