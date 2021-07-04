import { Fragment } from 'react'

import TypeAhead from '@/components/Page/TypeAhead'
import { useRouter } from 'next/router'
import Badge from 'react-bootstrap/Badge'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

const HighlightSearch = () => {
  const router = useRouter()

  const handleChange = e => {
    const input = e.find(x => x)

    if (input) {
      const params = {
        ...router.query,
        ticker: input?.symbol || null,
        type: 'quote'
      }

      router.push(
        {
          query: params
        },
        undefined,
        { shallow: true }
      )
    }
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
