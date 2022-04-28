import AnimatedNumber from 'animated-number-react'
import Badge from 'react-bootstrap/Badge'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import { IconContext } from 'react-icons'
import {
  FaArrowAltCircleDown,
  FaArrowAltCircleUp,
  FaMinusCircle
} from 'react-icons/fa'

import {
  convertToPercentage,
  convertToPrice,
  convertToPriceChange,
  getVariant
} from '@/lib/commonFunction'

export default function TickerCard({ Name, Price, Percentage, Change }) {
  const ArrowCircle = getVariant(
    Percentage,
    FaArrowAltCircleUp,
    FaMinusCircle,
    FaArrowAltCircleDown
  )

  return (
    <Card
      bg={'Light'}
      text={'dark'}
      border={'dark'}
      style={{ ['minWidth']: '6.5rem', fontSize: 'x-small' }}
      className="m-1"
    >
      <Card.Header style={{ padding: '0.1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <b>
            <span>{Name}</span>
            <IconContext.Provider
              value={{
                color: getVariant(Percentage, 'green', 'grey', 'red'),
                className: 'global-class-name'
              }}
            >
              <ArrowCircle className="ml-1" />
            </IconContext.Provider>
          </b>
        </div>
      </Card.Header>
      <Card.Body style={{ padding: '0.1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <b>
            <span>
              <AnimatedNumber
                value={Price}
                formatValue={value => convertToPrice(value)}
              />
            </span>
          </b>
        </div>
        <Row>
          <Col>
            <Badge
              variant={getVariant(Change, 'success', 'secondary', 'danger')}
            >
              <AnimatedNumber
                value={Change}
                formatValue={value => convertToPriceChange(value)}
              />
            </Badge>
          </Col>
          <Col>
            <Badge
              variant={getVariant(Percentage, 'success', 'secondary', 'danger')}
              className="ml-1"
            >
              <AnimatedNumber
                value={Percentage}
                formatValue={value => convertToPercentage(value / 100)}
              />
            </Badge>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  )
}
