import { Fragment, useEffect } from 'react'

import { highlightDetails } from '@/config/highlight'
import { fireToast } from '@/lib/toast'

const HighlightDetail = ({ ticker, data }) => {
  useEffect(() => {
    if (!data) return

    const detail = highlightDetails?.find(x => x.type === data?.type)
    if (!detail) {
      fireToast({
        icon: 'error',
        title: 'Only Stock/ETF can be viewed!'
      })
      return
    }
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
