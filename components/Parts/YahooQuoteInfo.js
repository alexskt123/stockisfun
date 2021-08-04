import { Fragment, useState, useEffect } from 'react'

import HeaderBadge from '@/components/Parts/HeaderBadge'
import {
  convertToPercentage,
  convertToPriceChange,
  indicatorVariant,
  millify,
  roundTo
} from '@/lib/commonFunction'
import Badge from 'react-bootstrap/Badge'

function YahooQuoteInfo({ data, displayQuoteFields }) {
  const [quoteData, setQuoteData] = useState([])

  useEffect(() => {
    setQuoteDataFields(data)
    return () => setQuoteData([])
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
    return format === 'PriceChange'
      ? value &&
          getValueBadge(
            (value >= 0 && 'success') || 'danger',
            convertToPriceChange(value)
          )
      : format === 'PriceChange%'
      ? value &&
        getValueBadge(
          (value >= 0 && 'success') || 'danger',
          convertToPercentage(value / 100)
        )
      : format === 'IndicatorVariant'
      ? getValueBadge(indicatorVariant(value), value)
      : format === 'millify'
      ? getValueBadge(indicatorVariant(value), millify(value))
      : format === 'roundTo'
      ? getValueBadge(indicatorVariant(value), roundTo(value))
      : getValueBadge('light', value)
  }

  return (
    <Fragment>
      {(quoteData || []).map((dataRow, idx) => {
        return (
          <Fragment key={idx}>
            <div className="d-flex justify-content-start flex-wrap">
              {dataRow.map((data, dataIdx) => {
                return (
                  data.value &&
                  data.value !== 'N/A' && (
                    <Fragment key={dataIdx}>
                      <HeaderBadge
                        headerTag={'h6'}
                        title={data.label}
                        badgeProps={{ variant: 'dark', className: 'ml-1' }}
                      />
                      <h6>{getFormattedValue(data.format, data.value)}</h6>
                    </Fragment>
                  )
                )
              })}
            </div>
          </Fragment>
        )
      })}
    </Fragment>
  )
}

export default YahooQuoteInfo
