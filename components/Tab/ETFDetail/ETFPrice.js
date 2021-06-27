import { Fragment } from 'react'

import Badge from 'react-bootstrap/Badge'

import { etfTools } from '../../../config/etf'
import AddDelStock from '../../Fire/AddDelStock'
import HappyShare from '../../Parts/HappyShare'
import Price from '../../Parts/Price'
import QuoteCard from '../../Parts/QuoteCard'
import ValidTickerAlert from '../../Parts/ValidTickerAlert'

export default function ETFPrice({ inputETFTicker }) {
  return (
    <Fragment>
      {inputETFTicker ? (
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
