import { Fragment } from 'react'
import { useRouter } from 'next/router'

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Badge from 'react-bootstrap/Badge'

import TypeAhead from './TypeAhead'

const HighlightSearch = () => {
  const router = useRouter()

  const handleChange = e => {
    const input = e.find(x => x)
    //input ? setSelectedTicker({ ticker: input.symbol, show: true }) : null
    //input ? router.push(`/highlight?query=${input.symbol}`) : null
    const type = router.query.type
    input
      ? router.push(
          {
            query: {
              ...router.query,
              query: input.symbol,
              tab: 'Basics',
              type: type ? type : 'quote'
            }
          },
          undefined,
          { shallow: true }
        )
      : null
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
