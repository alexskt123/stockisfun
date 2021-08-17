import { Fragment, useState, useEffect } from 'react'

import LoadingSkeletonTable from '@/components/Loading/LoadingSkeletonTable'
import HeaderBadge from '@/components/Parts/HeaderBadge'
import ValidTickerAlert from '@/components/Parts/ValidTickerAlert'
import { priceTabLabelPairs } from '@/config/price'
import { loadingSkeletonTableChart } from '@/config/settings'
import { useStaticSWR } from '@/lib/request'
import Row from 'react-bootstrap/Row'

const PriceSummary = ({ inputTicker }) => {
  const { data } = useStaticSWR(
    inputTicker,
    `/api/page/getStockDetailPriceTab?ticker=${inputTicker}`
  )

  const [valuePairs, setValuePairs] = useState([])

  useEffect(() => {
    data?.result &&
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
              const variant =
                (item?.variant &&
                  item.variant(item.value, 'success', 'secondary', 'danger')) ||
                'light'
              return (
                <Fragment key={idx}>
                  {item?.showLabel && (
                    <HeaderBadge
                      headerTag={'h6'}
                      title={item.name}
                      badgeProps={{ variant: 'dark', className: 'ml-1' }}
                    />
                  )}
                  <HeaderBadge
                    headerTag={'h6'}
                    title={
                      (item?.format && item.format(item.value)) || item.value
                    }
                    badgeProps={{ variant, className: 'ml-1' }}
                  />
                  {item?.append?.map(append => append)}
                </Fragment>
              )
            })}
          </Row>
        )
      })}
    </Fragment>
  ) : (
    <ValidTickerAlert />
  )
}

export default PriceSummary
