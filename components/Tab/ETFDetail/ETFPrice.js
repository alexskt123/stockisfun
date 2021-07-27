import { Fragment } from 'react'

import AddDelStock from '@/components/Fire/AddDelStock'
import HappyShare from '@/components/Parts/HappyShare'
import Price from '@/components/Parts/Price'
import QuoteCard from '@/components/Parts/QuoteCard'
import ValidTickerAlert from '@/components/Parts/ValidTickerAlert'
import { etfTools } from '@/config/etf'
import { useStaticSWR } from '@/lib/request'
import Badge from 'react-bootstrap/Badge'

export default function ETFPrice({ inputETFTicker }) {
  const { data } = useStaticSWR(
    inputETFTicker,
    `/api/yahoo/getQuoteType?ticker=${inputETFTicker}`
  )
  return (
    <Fragment>
      {data?.result ? (
        <QuoteCard
          tools={etfTools}
          inputTicker={inputETFTicker}
          isShow={true}
          noClose={true}
        >
          <div
            className="mt-2"
            style={{ display: 'flex', alignItems: 'flex-end' }}
          >
            <Badge className="ml-1" variant={'light'}>
              {'Add/Remove:'}
            </Badge>
            <AddDelStock inputTicker={inputETFTicker} handleList="etf" />
          </div>
          <div
            className="mt-1"
            style={{ display: 'flex', alignItems: 'flex-end' }}
          >
            <Badge className="ml-1" variant={'light'}>
              {'Share to your friends!'}
            </Badge>
            <HappyShare />
          </div>
          <Price inputTicker={inputETFTicker} inputMA={'ma'} />
        </QuoteCard>
      ) : (
        <ValidTickerAlert />
      )}
    </Fragment>
  )
}
