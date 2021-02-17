
import { Fragment } from 'react'
import Row from 'react-bootstrap/Row'
import Badge from 'react-bootstrap/Badge'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import { BsFillXCircleFill } from "react-icons/bs";

const getOverlayItems = (ticker, overlayItem) => {
    const currentItem = overlayItem.filter(x => x.ticker == ticker).find(x => x) || {}
    return (
      <Fragment key={ticker}>
        <div>
          {Object.keys(currentItem).map((item, index) => {
            return (
              <p key={index}>
                {item} : {currentItem[item]}
              </p>
            )
          })}
        </div>
      </Fragment>
    )
  }

function TickerBullet({ tickers, overlayItem, removeItem }) {
  return (
    <Fragment>
        <Row className="pl-3 pt-3">
          {
            tickers.map((item, index) => (
              <Fragment>
                <OverlayTrigger
                  placement="bottom"
                  key={index}
                  overlay={<Tooltip key={`button-tooltip-${item}`}>{getOverlayItems(item, overlayItem)}</Tooltip>}
                >
                  <h5 key={index}>
                    <Badge pill variant="success" key={index} className="ml-1">

                      {item}

                      <BsFillXCircleFill onClick={() => { removeItem(item) }} className="ml-1 mb-1" />
                    </Badge>
                  </h5>
                </OverlayTrigger>
              </Fragment>
            ))
          }
        </Row>
    </Fragment>
  )
}

export default TickerBullet
