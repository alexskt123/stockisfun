
import { useState, useEffect, Fragment } from 'react'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Badge from 'react-bootstrap/Badge'
import { RiCloseCircleFill } from 'react-icons/ri'
import { IconContext } from 'react-icons'
import StockInfoToolbar from './StockInfoToolbar'

import { usebgColor } from '../../lib/hooks/usebgColor'

export default function QuoteCard({ children, header, headerHref, inputTicker, isShow, minWidth, noClose, tools }) {
  const [showCard, setShowCard] = useState(true)

  const bgColor = usebgColor('white', '#e3e3e3')

  useEffect(() => {
    setShowCard(isShow)
  }, [inputTicker, isShow])

  return (
    showCard ? <Fragment>
      <Card
        text={'dark'}
        border={'light'}
        style={{ ['minWidth']: minWidth ? minWidth : '10rem', backgroundColor: bgColor }}
      >
        {
          header ? <Card.Header style={{ padding: '0.2rem' }}>
            <div style={{ display: 'flex', alignItems: 'baseline' }}>
              {
                headerHref ? <Button style={{ padding: '0.2rem', ['minWidth']: '3rem' }} variant="secondary" size="sm" target="_blank" href={`/${headerHref}?ticker=${inputTicker}`}>
                  <b>{header}</b>
                </Button>
                  : <h5><Badge variant="secondary">
                    <b>{header}</b>
                  </Badge></h5>
              }
              {
                noClose ? null
                  : <IconContext.Provider value={{ color: 'red', className: 'global-class-name' }}><RiCloseCircleFill className="cursor" onClick={() => setShowCard(false)} /></IconContext.Provider>
              }
            </div>
          </Card.Header>
            : null
        }
        <Card.Body style={{ padding: '0.2rem' }}>
          {
            tools ? <StockInfoToolbar tools={tools} inputTicker={inputTicker} />
              : null
          }
          {children}
        </Card.Body>
      </Card>

    </Fragment>
      : null
  )
}