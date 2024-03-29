import { Fragment, useState, useEffect } from 'react'

import Row from 'react-bootstrap/Row'

import ForecastInfo from '@/components/Parts/ForecastInfo'
import HeaderBadge from '@/components/Parts/HeaderBadge'
import PriceChange from '@/components/Parts/PriceChange'
import ValidTickerAlert from '@/components/Parts/ValidTickerAlert'

export default function Stat({ inputETFTicker }) {
  const [ticker, setTicker] = useState([])

  useEffect(() => {
    setTicker([inputETFTicker])
  }, [inputETFTicker])

  return (
    <Fragment>
      {inputETFTicker ? (
        <Fragment>
          <Row className="ms-1">
            <HeaderBadge
              headerTag={'h5'}
              title={'Forecast'}
              badgeProps={{ bg: 'dark' }}
            />
          </Row>
          <ForecastInfo inputTickers={ticker} />
          <Row className="ms-1">
            <HeaderBadge
              headerTag={'h5'}
              title={'Price%'}
              badgeProps={{ bg: 'dark' }}
            />
          </Row>
          <PriceChange inputTickers={ticker} />
        </Fragment>
      ) : (
        <ValidTickerAlert />
      )}
    </Fragment>
  )
}
