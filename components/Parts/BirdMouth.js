import { Fragment } from 'react'

import CardGroup from 'react-bootstrap/CardGroup'

import BirdMouthItem from './BirdMouthItem'
import { priceInfo } from '@/config/birdmouth'
import { birdMouthOptions } from '@/config/price'

function BirdMouth({ input, tools, className }) {
  return (
    <Fragment>
      <CardGroup className={className}>
        {input?.map((item, idx) => {
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
        })}
      </CardGroup>
    </Fragment>
  )
}

export default BirdMouth
