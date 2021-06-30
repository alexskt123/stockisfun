import { Fragment } from 'react'

import SWRTable from '@/components/Page/SWRTable'
import { tableHeaderList, forecastTableFirstHeader } from '@/config/forecast'
import { staticSWROptions } from '@/config/settings'

import ValidTickerAlert from './ValidTickerAlert'

function ForecastInfo({ inputTickers }) {
  return (
    <Fragment>
      {inputTickers?.length > 0 ? (
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
            SWROptions: staticSWROptions
          }}
        />
      ) : (
        <ValidTickerAlert />
      )}
    </Fragment>
  )
}

export default ForecastInfo
