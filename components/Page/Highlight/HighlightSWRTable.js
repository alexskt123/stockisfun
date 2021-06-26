import { Fragment } from 'react'

import { tableHeaderList } from '../../../config/highlight'
import SWRTable from '../SWRTable'

const HighlightSWRTable = ({ watchList }) => {
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
          SWROptions: { refreshInterval: 5000 }
        }}
      />
    </Fragment>
  )
}

export default HighlightSWRTable
