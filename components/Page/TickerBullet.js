import { Fragment } from 'react'

import Badge from 'react-bootstrap/Badge'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import { BsFillXCircleFill } from 'react-icons/bs'

function TickerBullet({ tickers, removeItem }) {
  return (
    <Fragment>
      <Row className="pl-3 pt-2">
        {tickers
          ?.split(',')
          .filter(x => x !== '')
          .map((item, index) => (
            <Col key={`${item}${index}`} xs="auto">
              <h6>
                <Badge pill bg="success" className="ml-1">
                  {`${item}`}
                  <BsFillXCircleFill
                    onClick={() => {
                      removeItem(item)
                    }}
                    className="ml-1 mb-1"
                  />
                </Badge>
              </h6>
            </Col>
          ))}
      </Row>
    </Fragment>
  )
}

export default TickerBullet
