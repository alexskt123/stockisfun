import { Fragment } from 'react'

import TypeAhead from '@/components/Page/TypeAhead'
import { showHighlightQuoteDetail } from '@/lib/commonFunction'
import { useRouter } from 'next/router'
import Badge from 'react-bootstrap/Badge'
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
      <Row className="justify-content-center mt-1">
        <h6>
          <Badge style={{ minWidth: '9rem' }} variant="dark">
            {'Search'}
          </Badge>
        </h6>
      </Row>
      <Row>
        <Col>
          <TypeAhead
            placeholderText={'Search any Stock or ETF...'}
            handleChange={handleChange}
            filter={'ETF,Equity'}
          />
        </Col>
      </Row>
    </Fragment>
  )
}

export default HighlightSearch
