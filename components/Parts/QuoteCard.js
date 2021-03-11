import Card from 'react-bootstrap/Card'

export default function QuoteCard({ children, header }) {

  return (
    <Card
      bg={'Light'}
      text={'dark'}
      border={'dark'}
      style={{ ['minWidth']: '10rem' }}
    >
      <Card.Header>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <b>
            <span>
              {header}
            </span>            
          </b>
        </div>
      </Card.Header>
      <Card.Body>
        {children}
      </Card.Body>
    </Card>
  )
}