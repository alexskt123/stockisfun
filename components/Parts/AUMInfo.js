import { Fragment } from 'react'

import SWRTable from '@/components/Page/SWRTable'
import { aumTableHeader } from '@/config/etf'
import { staticSWROptions } from '@/config/settings'

import ValidTickerAlert from './ValidTickerAlert'

function AUMInfo({ inputTickers, exportFileName }) {
  return (
    <Fragment>
      {inputTickers?.length > 0 ? (
        <SWRTable
          requests={inputTickers.map(x => ({
            request: `/api/compare/aum?ticker=${x}`,
            key: x
          }))}
          options={{
            bordered: true,
            tableHeader: aumTableHeader,
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

export default AUMInfo
