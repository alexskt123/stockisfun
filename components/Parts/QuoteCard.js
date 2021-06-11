
import { useState, useEffect, Fragment } from 'react'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Badge from 'react-bootstrap/Badge'
import { RiCloseCircleFill } from 'react-icons/ri'
import { IconContext } from 'react-icons'
import StockInfoToolbar from './StockInfoToolbar'

import useDarkMode from 'use-dark-mode'

export default function QuoteCard({ children, header, headerHref, inputTicker, isShow, minWidth, noClose, tools }) {
  const [showCard, setShowCard] = useState(true)

  const darkMode = useDarkMode(false)

  useEffect(() => {
    setShowCard(isShow)
  }, [inputTicker, isShow])

  return (
    showCard ? <Fragment>
      <Card
        text={'dark'}
        border={'light'}
        style={{ ['minWidth']: minWidth ? minWidth : '10rem', backgroundColor: darkMode.value ? '#e3e3e3' : 'white' }}
      >
        {
          header ? <Card.Header style={{ padding: '0.2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {
                headerHref ? <Button style={{ padding: '0.2rem', ['minWidth']: '3rem' }} variant="info" size="sm" target="_blank" href={`/${headerHref}?ticker=${inputTicker}`}>
                  <b>{header}</b>
                </Button>
                  : <h5><Badge variant="info">
                    <b>{header}</b>
                  </Badge></h5>
              }
              {
                noClose ? null
                  : <IconContext.Provider value={{ color: 'red', className: 'global-class-name' }}><RiCloseCircleFill onClick={() => setShowCard(false)} /></IconContext.Provider>
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