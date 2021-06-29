import { Fragment } from 'react'

import SWRTable from '@/components/Page/SWRTable'
import { tableHeaderList } from '@/config/financials'
import { staticSWROptions } from '@/config/settings'

import ValidTickerAlert from './ValidTickerAlert'

function FinancialsInfo({ inputTickers }) {
  return (
    <Fragment>
      {inputTickers?.length > 0 ? (
        <SWRTable
          requests={inputTickers.map(x => ({
            request: `/api/yahoo/getYahooFinancials?ticker=${x}`,
            key: x
          }))}
          options={{
            bordered: true,
            tableHeader: tableHeaderList,
            exportFileName: 'Stock_financial.csv',
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

export default FinancialsInfo
