import { Fragment } from 'react'

import SWRTable from '@/components/Page/SWRTable'
import { tableHeaderList } from '@/config/highlight'

const HighlightSWRTable = ({ watchList, showSWRDetail }) => {
  return (
    <Fragment>
      <SWRTable
        requests={watchList.map(x => ({
          request: `/api/highlightWatchlist?ticker=${x}`,
          key: x
        }))}
        options={{
          tableHeader: tableHeaderList,
          exportFileName: 'Watchlist.csv',
          tableSize: 'sm',
          showSWRDetail: showSWRDetail,
          SWROptions: { refreshInterval: 5000 }
        }}
      />
    </Fragment>
  )
}

export default HighlightSWRTable
