
import { Fragment, useState, useEffect } from 'react'
import Badge from 'react-bootstrap/Badge'
import Row from 'react-bootstrap/Row'
import { indexQuoteInfo } from '../../config/highlight'

const axios = require('axios').default

function IndexQuote({ inputTicker }) {
  const [quoteData, setQuoteData] = useState([])

  async function getIndexQuote () {
    const quoteResponse = await axios(`/api/yahoo/getYahooQuote?ticker=${inputTicker}`)
    const quoteData = indexQuoteInfo.map(item => {
      return ({
        label: item.label,
        value: quoteResponse.data[item.field]
      })
    })
    setQuoteData(quoteData)    
  }

  useEffect(() => {
    getIndexQuote()
    return () => setQuoteData(null)
  }, [inputTicker])

  return (
    <Fragment>
      {
        quoteData.map((item, idx) => {
          return (
            <Fragment key={idx}>
              <Row className="ml-1 mt-1" style={{ display: 'flex', alignItems: 'baseline' }}>
                <h6>
                  <Badge variant="dark">{item.label}</Badge>
                </h6>
                <h6>
                  <Badge variant="light" className="ml-2">{item.value}</Badge>
                </h6>
              </Row>
            </Fragment>
          )
        })
      }
    </Fragment>
  )
}

export default IndexQuote
