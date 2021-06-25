import { Fragment } from 'react'

import Row from 'react-bootstrap/Row'
import Badge from 'react-bootstrap/Badge'
import TickerScrollMenu from './TickerScrollMenu'

const TickerScrollMenuList = ({ tickerList }) => {
  return (
    <Fragment>
      {tickerList.map((item, idx) => {
        return (
          <Fragment key={idx}>
            <Row className="justify-content-center mt-1">
              <h6>
                <Badge style={{ minWidth: '9rem' }} variant="dark">
                  {item.name}
                </Badge>
              </h6>
            </Row>
            <TickerScrollMenu
              inputList={item.inputList}
              setSelectedTicker={item.selectScrollMenuItem}
            />
          </Fragment>
        )
      })}
    </Fragment>
  )
}

export default TickerScrollMenuList
