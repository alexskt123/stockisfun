import {
  convertToPercentage,
  convertToPrice,
  convertToPriceChange
} from '@/lib/commonFunction'
import AnimatedNumber from 'animated-number-react'
import Badge from 'react-bootstrap/Badge'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import { IconContext } from 'react-icons'
import { FaArrowAltCircleDown, FaArrowAltCircleUp } from 'react-icons/fa'

export const getVariant = (value, up, down) => {
  return value >= 0 ? up : down
}

export default function TickerCard({ Name, Price, Percentage, Change }) {
  const ArrowCircle = getVariant(
    Percentage,
    FaArrowAltCircleUp,
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
      <Card.Header style={{ padding: '0.2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <b>
            <span>{Name}</span>
            <IconContext.Provider
              value={{ color: 'green', className: 'global-class-name' }}
            >
              <ArrowCircle className="ml-1" />
            </IconContext.Provider>
          </b>
        </div>
      </Card.Header>
      <Card.Body style={{ padding: '0.2rem' }}>
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
          <Col xs={5} md={5}>
            <Badge variant={Change >= 0 ? 'success' : 'danger'}>
              <AnimatedNumber
                value={Change}
                formatValue={value => convertToPriceChange(value)}
              />
            </Badge>
          </Col>
          <Col xs={4} md={4}>
            <Badge
              variant={Percentage >= 0 ? 'success' : 'danger'}
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
