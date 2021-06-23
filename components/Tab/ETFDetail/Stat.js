
import { Fragment, useState, useEffect } from 'react'
import Badge from 'react-bootstrap/Badge'
import Row from 'react-bootstrap/Row'

import PriceChange from '../../../components/Parts/PriceChange'
import ForecastInfo from '../../../components/Parts/ForecastInfo'
import ValidTickerAlert from '../../Parts/ValidTickerAlert'

export default function Stat({ inputETFTicker }) {

  const [ticker, setTicker] = useState([])

  useEffect(() => {
    setTicker([inputETFTicker])
  }, [inputETFTicker])

  return (
    <Fragment>
      {
        inputETFTicker ? <Fragment>
          <Row className="ml-1">
            <h5>
              <Badge variant="dark">{'Forecast'}</Badge>
            </h5>
          </Row>
          <ForecastInfo inputTickers={ticker} />
          <Row className="ml-1">
            <h5>
              <Badge variant="dark">{'Price%'}</Badge>
            </h5>
          </Row>
          <PriceChange inputTickers={ticker} />
        </Fragment>
          : <ValidTickerAlert />
      }
    </Fragment >
  )
}
