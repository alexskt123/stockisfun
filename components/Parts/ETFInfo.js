import { Fragment } from 'react'

import SWRTable from '@/components/Page/SWRTable'
import { tableHeaderList } from '@/config/etf'
import { staticSWROptions } from '@/config/settings'

import ValidTickerAlert from './ValidTickerAlert'

function ETFInfo({ inputTickers, exportFileName }) {
  return (
    <Fragment>
      {inputTickers?.length > 0 ? (
        <SWRTable
          requests={inputTickers.map(x => ({
            request: `/api/compare/etf?ticker=${x}`,
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

export default ETFInfo
