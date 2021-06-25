import AnimatedNumber from 'animated-number-react'
import Badge from 'react-bootstrap/Badge'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import { IconContext } from 'react-icons'
import { FaArrowAltCircleDown, FaArrowAltCircleUp } from 'react-icons/fa'

import {
  convertToPercentage,
  convertToPriceChange
} from '../../lib/commonFunction'

export default function TickerCard({ Name, Price, Percentage, Change }) {
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
            {Percentage >= 0 ? (
              <IconContext.Provider
                value={{ color: 'green', className: 'global-class-name' }}
              >
                <FaArrowAltCircleUp className="ml-1" />
              </IconContext.Provider>
            ) : (
              <IconContext.Provider
                value={{ color: 'red', className: 'global-class-name' }}
              >
                <FaArrowAltCircleDown className="ml-1" />
              </IconContext.Provider>
            )}
          </b>
        </div>
      </Card.Header>
      <Card.Body style={{ padding: '0.2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <b>
            <span>{Price}</span>
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
