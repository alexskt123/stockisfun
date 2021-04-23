
import { Fragment, useState, useEffect } from 'react'
import Badge from 'react-bootstrap/Badge'
import Row from 'react-bootstrap/Row'
import { indexQuoteInfo } from '../../config/highlight'
import { staticSWROptions, fetcher } from '../../config/settings'
import { convertToPercentage, convertToPriceChange, indicatorVariant } from '../../lib/commonFunction'

import useSWR from 'swr'

function IndexQuote({ inputTicker }) {
  const [quoteData, setQuoteData] = useState([])

  const { data } = useSWR(`/api/getIndexQuote?ticker=${inputTicker}`, fetcher, staticSWROptions)

  function getIndexQuote(data) {
    const quoteData = data ? indexQuoteInfo.map(item => {
      return item.map(quote => {
        return ({
          label: quote.label,
          format: quote.format,
          value: data[quote.field]
        })
      })
    }) : []
    setQuoteData(quoteData)
  }

  const getValueBadge = (variant, value) => {
    return <Badge variant={variant} className="ml-2">{value}</Badge>
  }

  const getFormattedValue = (format, value) => {
    return format && format === 'PriceChange' ? value ? getValueBadge(value >= 0 ? 'success' : 'danger', convertToPriceChange(value)) : null
      : format && format === 'PriceChange%' ? value ? getValueBadge(value >= 0 ? 'success' : 'danger', convertToPercentage(value / 100)) : null
        : format && format === 'IndicatorVariant' ? getValueBadge(indicatorVariant(value), value)
          : getValueBadge('light', value)
  }

  useEffect(() => {
    getIndexQuote(data)
    return () => setQuoteData(null)
  }, [data])

  return (
    <Fragment>
      {
        (quoteData || []).map((dataRow, idx) => {
          return (
            <Fragment key={idx}>
              <Row className="ml-1 mt-1" style={{ display: 'flex', alignItems: 'baseline' }}>
                {
                  dataRow.map((data, dataIdx) => {
                    return (
                      <Fragment key={dataIdx}>
                        <h6>
                          <Badge className="ml-1" variant="dark">{data.label}</Badge>
                        </h6>
                        <h6>
                          {getFormattedValue(data.format, data.value)}
                        </h6>
                      </Fragment>
                    )
                  })
                }
              </Row>
            </Fragment>
          )
        })
      }
    </Fragment>
  )
}

export default IndexQuote
