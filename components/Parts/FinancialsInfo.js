import { Fragment } from 'react'

import SWRTable from '@/components/Page/SWRTable'
import { tableHeaderList } from '@/config/financials'
import { staticSWROptions } from '@/config/settings'

import ValidTickerAlert from './ValidTickerAlert'

function FinancialsInfo({ inputTickers, exportFileName }) {
  return (
    <Fragment>
      {inputTickers?.length > 0 ? (
        <SWRTable
          requests={inputTickers.map(x => ({
            request: `/api/yahoo/getFinancials?ticker=${x}`,
            key: x
          }))}
          options={{
            bordered: true,
            tableHeader: tableHeaderList,
            exportFileName,
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
