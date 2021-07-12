import { Fragment, useState, useEffect } from 'react'

import LoadingSkeletonTable from '@/components/Loading/LoadingSkeletonTable'
import Price from '@/components/Parts/Price'
import QuoteCard from '@/components/Parts/QuoteCard'
import ValidTickerAlert from '@/components/Parts/ValidTickerAlert'
import { priceTabLabelPairs } from '@/config/price'
import {
  staticSWROptions,
  fetcher,
  loadingSkeletonTableChart
} from '@/config/settings'
import Badge from 'react-bootstrap/Badge'
import Row from 'react-bootstrap/Row'
import useSWR from 'swr'

function PriceTab({ inputTicker }) {
  const { data } = useSWR(
    () => inputTicker && `/api/getStockDetailPriceTab?ticker=${inputTicker}`,
    fetcher,
    staticSWROptions
  )

  const [valuePairs, setValuePairs] = useState([])

  useEffect(() => {
    if (!data?.result) {
      return
    }

    setValuePairs(
      priceTabLabelPairs(data.result?.Symbol).map(row => {
        return row.map(item => {
          return {
            ...item,
            value: data.result[item.name]
          }
        })
      })
    )
  }, [data])

  return inputTicker && !data ? (
    <LoadingSkeletonTable customSettings={loadingSkeletonTableChart} />
  ) : data?.result ? (
    <Fragment>
      {valuePairs.map((row, idx) => {
        return (
          <Row
            key={idx}
            className="ml-1 mt-1"
            style={{ display: 'flex', alignItems: 'end' }}
          >
            {row.map((item, idx) => {
              const variant = item?.variant
                ? item.variant(item.value, 'success', 'secondary', 'danger')
                : 'light'
              return (
                <Fragment key={idx}>
                  {item?.showLabel && (
                    <h6>
                      <Badge variant="dark" className="ml-1">
                        {item.name}
                      </Badge>
                    </h6>
                  )}
                  <h6>
                    <Badge variant={variant} className="ml-1">
                      {item?.format ? item?.format(item.value) : item.value}
                    </Badge>
                  </h6>
                  {item?.append && item.append.map(append => append)}
                </Fragment>
              )
            })}
          </Row>
        )
      })}
      <QuoteCard
        inputTicker={inputTicker}
        isShow={true}
        minWidth={'20rem'}
        noClose={true}
      >
        <Price inputTicker={inputTicker} inputMA={'ma'} />
      </QuoteCard>
    </Fragment>
  ) : (
    <ValidTickerAlert />
  )
}

export default PriceTab
