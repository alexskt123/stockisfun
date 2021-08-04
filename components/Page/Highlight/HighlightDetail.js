import { Fragment, useEffect } from 'react'

import { highlightDetails } from '@/config/highlight'
import { fireToast } from '@/lib/commonFunction'

const HighlightDetail = ({ ticker, data }) => {
  useEffect(() => {
    data &&
      !highlightDetails?.find(x => x.type === data?.type) &&
      fireToast({
        icon: 'error',
        title: 'Only Stock/ETF can be viewed!'
      })
  }, [data])

  return (
    <Fragment>
      {highlightDetails
        .filter(x => x.type === data?.type)
        .map((detail, idx) => (
          <detail.component key={idx} inputTicker={ticker} />
        ))}
    </Fragment>
  )
}

export default HighlightDetail
