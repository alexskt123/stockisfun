import { Fragment } from 'react'

import YahooQuoteInfo from './YahooQuoteInfo'
import LoadingSkeletonTable from '@/components/Loading/LoadingSkeletonTable'
import { indexQuoteInfo } from '@/config/indexQuote'
import { loadingSkeletonColors } from '@/config/settings'
import { useStaticSWR } from '@/lib/request'

function IndexQuote({ inputTicker }) {
  const { data } = useStaticSWR(
    inputTicker,
    `/api/page/getIndexQuote?ticker=${inputTicker}`
  )

  return (
    <Fragment>
      {data?.result ? (
        <YahooQuoteInfo
          data={data.result}
          displayQuoteFields={indexQuoteInfo}
        />
      ) : (
        <LoadingSkeletonTable customColors={loadingSkeletonColors.light} />
      )}
    </Fragment>
  )
}

export default IndexQuote
