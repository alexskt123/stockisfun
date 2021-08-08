import { Fragment } from 'react'

import SWRTable from '@/components/Page/SWRTable'
import ValidTickerAlert from '@/components/Parts/ValidTickerAlert'
import { staticSWROptions } from '@/config/settings'

function CompareSWR({ inputTickers, customOptions, url }) {
  return (
    <Fragment>
      {inputTickers?.length > 0 ? (
        <SWRTable
          requests={inputTickers.map(x => ({
            request: `${url}?ticker=${x}`,
            key: x
          }))}
          options={{
            bordered: true,
            tableSize: 'sm',
            SWROptions: staticSWROptions,
            ...customOptions
          }}
        />
      ) : (
        <ValidTickerAlert />
      )}
    </Fragment>
  )
}

export default CompareSWR
