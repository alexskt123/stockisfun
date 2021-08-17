import { Fragment } from 'react'

import TypeAhead from '@/components/Page/TypeAhead'
import { showHighlightQuoteDetail } from '@/lib/stockInfo'
import { useRouter } from 'next/router'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

const HighlightSearch = () => {
  const router = useRouter()

  const handleChange = e => {
    const input = e.find(x => x)

    const inputQuery = {
      ticker: input?.symbol || null,
      type: 'quote'
    }
    showHighlightQuoteDetail(router, inputQuery)
  }

  return (
    <Fragment>
      <Row className="mt-1">
        <Col>
          <TypeAhead
            placeholderText={'🔎 Search any Stock or ETF...'}
            handleChange={handleChange}
            filter={'ETF,Equity'}
          />
        </Col>
      </Row>
    </Fragment>
  )
}

export default HighlightSearch
