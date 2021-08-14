import { Fragment } from 'react'

import LoadingSkeletonTable from '@/components/Loading/LoadingSkeletonTable'
import CompareSWR from '@/components/Parts/CompareSWR'
import ValidTickerAlert from '@/components/Parts/ValidTickerAlert'
import { peersHeader } from '@/config/peers'
import { useStaticSWR } from '@/lib/request'

export default function Peers({ inputTicker }) {
  const { data } = useStaticSWR(
    inputTicker,
    `/api/moneycnn/getPeers?ticker=${inputTicker}`
  )

  return (
    <Fragment>
      {!data && inputTicker ? (
        <LoadingSkeletonTable />
      ) : data?.result?.length > 0 ? (
        <CompareSWR
          inputTickers={data.result.map(x => x.Ticker)}
          url={'/api/page/getIndexQuote'}
          customOptions={{
            tableHeader: peersHeader
          }}
        />
      ) : (
        <ValidTickerAlert />
      )}
    </Fragment>
  )
}
