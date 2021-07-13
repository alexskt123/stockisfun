import { Fragment } from 'react'

import SWRTable from '@/components/Page/SWRTable'
import { tableHeaderList } from '@/config/highlight'

const HighlightSWRTable = ({ watchList }) => {
  return (
    <Fragment>
      <SWRTable
        requests={watchList.map(x => ({
          request: `/api/page/highlightWatchlist?ticker=${x}`,
          key: x
        }))}
        options={{
          tableHeader: tableHeaderList,
          tableSize: 'sm',
          SWROptions: { refreshInterval: 5000 }
        }}
      />
    </Fragment>
  )
}

export default HighlightSWRTable
