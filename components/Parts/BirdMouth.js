import { Fragment } from 'react'

import CardDeck from 'react-bootstrap/CardDeck'

import BirdMouthItem from './BirdMouthItem'
import { priceInfo } from '@/config/birdmouth'
import { birdMouthOptions } from '@/config/price'

function BirdMouth({ input, rsTicker, tools, className }) {
  return (
    <Fragment>
      <CardDeck className={className}>
        {input?.map((item, idx) => {
          return (
            <Fragment key={idx}>
              <BirdMouthItem
                birdMouthOptions={birdMouthOptions}
                priceInfo={priceInfo}
                tools={tools}
                item={item}
                rsTicker={rsTicker}
              />
            </Fragment>
          )
        })}
      </CardDeck>
    </Fragment>
  )
}

export default BirdMouth
