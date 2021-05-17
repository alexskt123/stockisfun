
import { useState, useEffect, Fragment } from 'react'
import Card from 'react-bootstrap/Card'
import { RiCloseCircleFill } from 'react-icons/ri'
import { IconContext } from 'react-icons'
import StockInfoToolbar from './StockInfoToolbar'

import useDarkMode from 'use-dark-mode'

export default function QuoteCard({ children, header, inputTicker, isShow, minWidth, noClose, tools }) {
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
        // bg={'light'}
      >
        {
          header ? <Card.Header style={{ padding: '0.2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <b>
                <span>
                  {header}
                </span>
                {
                  noClose ? null
                    : <IconContext.Provider value={{ color: 'red', className: 'global-class-name' }}><RiCloseCircleFill onClick={() => setShowCard(false)} /></IconContext.Provider>
                }
              </b>
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