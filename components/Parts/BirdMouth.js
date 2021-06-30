import { Fragment } from 'react'

import { priceInfo } from '@/config/birdmouth'
import { birdMouthOptions } from '@/config/price'
import CardDeck from 'react-bootstrap/CardDeck'

import BirdMouthItem from './BirdMouthItem'

function BirdMouth({ input, tools, className }) {
  return (
    <Fragment>
      <CardDeck className={className}>
        {input
          ? input.map((item, idx) => {
              return (
                <Fragment key={idx}>
                  <BirdMouthItem
                    birdMouthOptions={birdMouthOptions}
                    priceInfo={priceInfo}
                    tools={tools}
                    item={item}
                  />
                </Fragment>
              )
            })
          : null}
      </CardDeck>
    </Fragment>
  )
}

export default BirdMouth
