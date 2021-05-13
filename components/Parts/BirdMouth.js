import { Fragment } from 'react'
import QuoteCard from './QuoteCard'
import Price from './Price'
import { birdMouthOptions } from '../../config/price'

import CardDeck from 'react-bootstrap/CardDeck'

function BirdMouth({ input }) {
  return (
    <Fragment>
      <CardDeck>
        {
          input ? input.map((item, idx) => {
            return (
              <Fragment key={idx}>
                <QuoteCard header={item.label} inputTicker={item.ticker} isShow={true} minWidth={'20rem'} noClose={true}>
                  <Price inputTicker={item.ticker} inputMA={'ma'} options={birdMouthOptions} />
                </QuoteCard>
              </Fragment>
            )
          })
            : null
        }
      </CardDeck>
    </Fragment>
  )
}

export default BirdMouth
