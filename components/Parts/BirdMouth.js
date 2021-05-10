import { Fragment } from 'react'
import QuoteCard from './QuoteCard'
import Price from './Price'
import { birdMouthOptions } from '../../config/price'

import CardDeck from 'react-bootstrap/CardDeck'

function BirdMouth({ inputTickers }) {
  return (
    <Fragment>
      <CardDeck>
        {
          inputTickers ? inputTickers.map((item, idx) => {
            return (
              <Fragment key={idx}>
                <QuoteCard header={item} inputTicker={item} isShow={true} minWidth={'20rem'} noClose={true}>
                  <Price inputTicker={item} inputMA={'ma'} options={birdMouthOptions} />
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
