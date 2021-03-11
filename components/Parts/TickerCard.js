import Card from 'react-bootstrap/Card'
import Badge from 'react-bootstrap/Badge'
import { FaArrowAltCircleDown, FaArrowAltCircleUp } from 'react-icons/fa'
import { IconContext } from 'react-icons'

export default function TickerCard({ Name, Price, Percentage }) {

  return (
    <Card
      bg={'Light'}
      text={'dark'}
      border={'dark'}
      style={{ ['minWidth']: '8rem', width: '8rem', fontSize: '12px' }}
      className="m-1"
    >
      <Card.Header>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <b>
            <span>
              {Name}
            </span>
            {Percentage >= 0 ? <IconContext.Provider value={{ color: 'green', className: 'global-class-name' }}><FaArrowAltCircleUp className="ml-1" /></IconContext.Provider> : <IconContext.Provider value={{ color: 'red', className: 'global-class-name' }}><FaArrowAltCircleDown className="ml-1" /></IconContext.Provider>}
          </b>
        </div>
      </Card.Header>
      <Card.Body>
        <Card.Text>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <b>
              <span>
                {Price}
              </span>
              <Badge variant={Percentage >= 0 ? 'success' : 'danger'} className="ml-1">{`${Percentage}%`}</Badge>
            </b>
          </div>
        </Card.Text>
      </Card.Body>
    </Card>
  )
}