import { Fragment } from 'react'

import CardDeck from 'react-bootstrap/CardDeck'

import QuoteCard from '@/components/Parts/QuoteCard'
import TradingView from '@/components/Parts/TradingView'

const TradingViewDeck = ({ inputTickers }) => {
  return (
    <CardDeck>
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
    </CardDeck>
  )
}

export default TradingViewDeck
