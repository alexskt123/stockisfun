
import { useState, useEffect, Fragment } from 'react'
import Card from 'react-bootstrap/Card'
import Row from 'react-bootstrap/Row'
import Button from 'react-bootstrap/Button'
import { RiCloseCircleFill } from 'react-icons/ri'
import { IconContext } from 'react-icons'
import CustomIcons from '../../lib/components/CustomIcons'

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
            tools ? <div style={{display: 'flex', alignItems: 'center'}}>
              {
                tools.map((item, idx) => <Button target="_blank" href={`/etftostock?ticker=${inputTicker}&href=${item.href}`} style={{padding: '0.1rem 0.1rem'}} className="ml-1" size="sm" variant={'dark'} key={idx}>{CustomIcons(item)}</Button>)
              }
            </div>
              : null
          }
          {children}
        </Card.Body>
      </Card>

    </Fragment>
      : null
  )
}