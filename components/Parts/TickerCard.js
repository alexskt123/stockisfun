import Card from 'react-bootstrap/Card'
import Badge from 'react-bootstrap/Badge'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { FaArrowAltCircleDown, FaArrowAltCircleUp } from 'react-icons/fa'
import { IconContext } from 'react-icons'

export default function TickerCard({ Name, Price, Percentage, Change }) {

  return (
    <Card
      bg={'Light'}
      text={'dark'}
      border={'dark'}
      style={{ ['minWidth']: '7.7rem', width: '7.7rem', fontSize: 'x-small' }}
      className="m-1"
    >
      <Card.Header style={{ padding: '0.2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <b>
            <span>
              {Name}
            </span>
            {Percentage >= 0 ? <IconContext.Provider value={{ color: 'green', className: 'global-class-name' }}><FaArrowAltCircleUp className="ml-1" /></IconContext.Provider> : <IconContext.Provider value={{ color: 'red', className: 'global-class-name' }}><FaArrowAltCircleDown className="ml-1" /></IconContext.Provider>}
          </b>
        </div>
      </Card.Header>
      <Card.Body style={{ padding: '0.2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <b>
            <span>
              {Price}
            </span>
          </b>
        </div>
        <Row>
          <Col xs={5} md={5}>
            <Badge variant={Change >= 0 ? 'success' : 'danger'}>{Change >= 0 ? `+${Change}` : Change}</Badge>
          </Col>
          <Col xs={4} md={4}>
            <Badge variant={Percentage >= 0 ? 'success' : 'danger'} className="ml-1">{Percentage >= 0 ? `+${Percentage}%` : `${Percentage}%`}</Badge>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  )
}