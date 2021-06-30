import { Fragment, useEffect } from 'react'

import { highlightDetails } from '@/config/highlight'
import { fireToast } from '@/lib/toast'
import useSWR from 'swr'

const HighlightDetail = ({ query }) => {
  const fetcher = input => fetch(input).then(res => res.json())
  const { data } = useSWR(`/api/quote?ticker=${query}`, fetcher)

  useEffect(() => {
    if (!data) return

    if (!data.valid) {
      fireToast({
        icon: 'error',
        title: 'Please enter a valid symbol!'
      })
      return
    }

    const detail = highlightDetails.find(x => x.type === data.type)
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
          <detail.component key={idx} inputTicker={query} />
        ))}
    </Fragment>
  )
}

export default HighlightDetail
