import { Fragment } from 'react'

import {
  tableHeaderList,
  forecastTableFirstHeader
} from '../../config/forecast'
import { staticSWROptions } from '../../config/settings'

import SWRTable from '../../components/Page/SWRTable'

function ForecastInfo({ inputTickers }) {
  return (
    <Fragment>
      {inputTickers ? (
        <SWRTable
          requests={inputTickers.map(x => ({
            request: `/api/forecast/getStockFairValue?ticker=${x}`,
            key: x
          }))}
          options={{
            bordered: true,
            tableFirstHeader: forecastTableFirstHeader,
            tableHeader: tableHeaderList,
            exportFileName: 'Stock_forecast.csv',
            tableSize: 'sm',
            SWROptions: { ...staticSWROptions }
          }}
        />
      ) : null}
    </Fragment>
  )
}

export default ForecastInfo
