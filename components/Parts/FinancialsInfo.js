import { Fragment } from 'react'

import SWRTable from '../../components/Page/SWRTable'
import { tableHeaderList } from '../../config/financials'
import { staticSWROptions } from '../../config/settings'

function FinancialsInfo({ inputTickers }) {
  return (
    <Fragment>
      {inputTickers ? (
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
            SWROptions: { ...staticSWROptions }
          }}
        />
      ) : null}
    </Fragment>
  )
}

export default FinancialsInfo
