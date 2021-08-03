import { Fragment, useState, useEffect } from 'react'

import ForecastInfo from '@/components/Parts/ForecastInfo'
import HeaderBadge from '@/components/Parts/HeaderBadge'
import PriceChange from '@/components/Parts/PriceChange'
import ValidTickerAlert from '@/components/Parts/ValidTickerAlert'
import Row from 'react-bootstrap/Row'

export default function Stat({ inputETFTicker }) {
  const [ticker, setTicker] = useState([])

  useEffect(() => {
    setTicker([inputETFTicker])
  }, [inputETFTicker])

  return (
    <Fragment>
      {inputETFTicker ? (
        <Fragment>
          <Row className="ml-1">
            <HeaderBadge
              headerTag={'h5'}
              title={'Forecast'}
              badgeProps={{ variant: 'dark' }}
            />
          </Row>
          <ForecastInfo inputTickers={ticker} />
          <Row className="ml-1">
            <HeaderBadge
              headerTag={'h5'}
              title={'Price%'}
              badgeProps={{ variant: 'dark' }}
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
