import { Fragment, useState, useEffect } from 'react'
import Badge from 'react-bootstrap/Badge'

import {
  convertToPercentage,
  convertToPriceChange,
  indicatorVariant,
  millify,
  roundTo
} from '../../lib/commonFunction'

function YahooQuoteInfo({ data, displayQuoteFields }) {
  const [quoteData, setQuoteData] = useState([])

  useEffect(() => {
    setQuoteDataFields(data)
    return () => setQuoteData(null)
    //todo: fix custom hooks
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  function setQuoteDataFields(data) {
    const quoteData = data
      ? displayQuoteFields.map(item => {
          return item.map(quote => {
            return {
              label: quote.label,
              format: quote.format,
              value: data[quote.field]
            }
          })
        })
      : []
    setQuoteData(quoteData)
  }

  const getValueBadge = (variant, value) => {
    return (
      <Badge variant={variant} className="ml-2">
        {value}
      </Badge>
    )
  }

  const getFormattedValue = (format, value) => {
    return format && format === 'PriceChange'
      ? value
        ? getValueBadge(
            value >= 0 ? 'success' : 'danger',
            convertToPriceChange(value)
          )
        : null
      : format && format === 'PriceChange%'
      ? value
        ? getValueBadge(
            value >= 0 ? 'success' : 'danger',
            convertToPercentage(value / 100)
          )
        : null
      : format && format === 'IndicatorVariant'
      ? getValueBadge(indicatorVariant(value), value)
      : format && format === 'millify'
      ? getValueBadge(indicatorVariant(value), millify(value))
      : format && format === 'roundTo'
      ? getValueBadge(indicatorVariant(value), roundTo(value))
      : getValueBadge('light', value)
  }

  return (
    <Fragment>
      {(quoteData || []).map((dataRow, idx) => {
        return (
          <Fragment key={idx}>
            <div
              className="mt-2"
              style={{ display: 'flex', alignItems: 'baseline' }}
            >
              {dataRow.map((data, dataIdx) => {
                return data.value && data.value !== 'N/A' ? (
                  <Fragment key={dataIdx}>
                    <h6>
                      <Badge className="ml-1" variant="dark">
                        {data.label}
                      </Badge>
                    </h6>
                    <h6>{getFormattedValue(data.format, data.value)}</h6>
                  </Fragment>
                ) : null
              })}
            </div>
          </Fragment>
        )
      })}
    </Fragment>
  )
}

export default YahooQuoteInfo
