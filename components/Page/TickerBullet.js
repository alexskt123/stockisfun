import { Fragment } from 'react'

import Badge from 'react-bootstrap/Badge'
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
            <Fragment key={`${item}${index}`}>
              <h6>
                <Badge pill variant="success" className="ml-1">
                  {`${item}`}
                  <BsFillXCircleFill
                    onClick={() => {
                      removeItem(item)
                    }}
                    className="ml-1 mb-1"
                  />
                </Badge>
              </h6>
            </Fragment>
          ))}
      </Row>
    </Fragment>
  )
}

export default TickerBullet
