import { Fragment, useState, useEffect } from 'react'

import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

import LoadingSkeletonTable from '@/components/Loading/LoadingSkeletonTable'
import HeaderBadge from '@/components/Parts/HeaderBadge'
import ValidTickerAlert from '@/components/Parts/ValidTickerAlert'
import { priceTabLabelPairs } from '@/config/price'
import { loadingSkeletonTableChart } from '@/config/settings'
import { useStaticSWR } from '@/lib/request'

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
            className="ms-1 mt-1"
            style={{ display: 'flex', alignItems: 'end' }}
          >
            {row.map((item, idx) => {
              const bg =
                (item?.variant &&
                  item.variant(item.value, 'success', 'secondary', 'danger')) ||
                'light'
              const text = bg === 'light' ? 'dark' : null
              return (
                <Fragment key={idx}>
                  {item?.showLabel && (
                    <Col xs="auto" style={{ padding: '0.1rem' }}>
                      <HeaderBadge
                        headerTag={'h6'}
                        title={item.name}
                        badgeProps={{ bg: 'dark', className: 'ml-1' }}
                      />
                    </Col>
                  )}
                  <Col xs="auto" style={{ padding: '0.1rem' }}>
                    <HeaderBadge
                      headerTag={'h6'}
                      title={
                        (item?.format && item.format(item.value)) || item.value
                      }
                      badgeProps={{ bg, text, className: 'ml-1' }}
                    />
                  </Col>
                  {item?.append?.map((append, idx) => (
                    <Col key={idx} xs="auto" style={{ padding: '0.1rem' }}>
                      {append}
                    </Col>
                  ))}
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
