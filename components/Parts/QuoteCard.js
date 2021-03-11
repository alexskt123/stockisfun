
import { useState, useEffect, Fragment } from 'react'
import Card from 'react-bootstrap/Card'
import { RiCloseCircleFill } from 'react-icons/ri'

export default function QuoteCard({ children, header, inputTicker }) {
  const [showCard, setShowCard] = useState(true)
  
  useEffect(() => {
    setShowCard(true)    
  }, [inputTicker])

  if (!showCard) return null

  return (
    <Fragment>
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
              <RiCloseCircleFill onClick={() => setShowCard(false)} />
            </b>
          </div>
        </Card.Header>
        <Card.Body>
          {children}
        </Card.Body>
      </Card>

    </Fragment>
  )
}