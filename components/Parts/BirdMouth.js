import { Fragment } from 'react'

import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

import BirdMouthItem from './BirdMouthItem'
import { priceInfo } from '@/config/birdmouth'
import { birdMouthOptions } from '@/config/price'

function BirdMouth({ input, rsTicker, tools, className }) {
  return (
    <Fragment>
      <Row xs={1} md={2} lg={3} className={className}>
        {input?.map((item, idx) => {
          return (
            <Col key={idx}>
              <BirdMouthItem
                birdMouthOptions={birdMouthOptions}
                priceInfo={priceInfo}
                tools={tools}
                item={item}
                rsTicker={rsTicker}
              />
            </Col>
          )
        })}
      </Row>
    </Fragment>
  )
}

export default BirdMouth
