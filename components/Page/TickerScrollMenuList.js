import { Fragment } from 'react'

import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

import TickerScrollMenu from './TickerScrollMenu'
import HeaderBadge from '@/components/Parts/HeaderBadge'

const TickerScrollMenuList = ({ tickerList }) => {
  return (
    <Fragment>
      {tickerList.map((item, idx) => {
        return (
          <Fragment key={idx}>
            <Row className="justify-content-md-center">
              <Col md="auto">
                <HeaderBadge
                  headerTag={'h6'}
                  title={item.name}
                  badgeProps={{ bg: 'dark', style: { minWidth: '9rem' } }}
                />
              </Col>
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
