
import { Fragment, useState, useEffect } from 'react'
import Badge from 'react-bootstrap/Badge'
import Row from 'react-bootstrap/Row'
import { indexQuoteInfo } from '../../config/highlight'
import { convertToPercentage, convertToPriceChange } from '../../lib/commonFunction'

const axios = require('axios').default

function IndexQuote({ inputTicker }) {
  const [quoteData, setQuoteData] = useState([])

  async function getIndexQuote() {
    const quoteResponse = await axios(`/api/yahoo/getYahooQuote?ticker=${inputTicker}`)
    const quoteData = indexQuoteInfo.map(item => {
      return item.map(data => {
        return ({
          label: data.label,
          format: data.format,
          value: quoteResponse.data[data.field]
        })
      })
    })
    setQuoteData(quoteData)
  }

  const getValueBadge = (variant, value) => {
    return <Badge variant={variant} className="ml-2">{value}</Badge>
  }

  const getFormattedValue = (format, value) => {
    return format && format === 'PriceChange' ? value ? getValueBadge(value >= 0 ? "success" : "danger", convertToPriceChange(value)) : null
      : format && format === 'PriceChange%' ? value ? getValueBadge(value >= 0 ? "success" : "danger", convertToPercentage(value / 100)) : null
        : getValueBadge("light", value)
  }

  useEffect(() => {
    getIndexQuote()
    return () => setQuoteData(null)
  }, [inputTicker])

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
                          <Badge variant="dark">{data.label}</Badge>
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
