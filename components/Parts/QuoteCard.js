import { useState, useEffect, Fragment } from 'react'

import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import { IconContext } from 'react-icons'
import { RiCloseCircleFill } from 'react-icons/ri'

import StockInfoToolbar from './StockInfoToolbar'
import HeaderBadge from '@/components/Parts/HeaderBadge'
import { useBgColor } from '@/lib/hooks/useBgColor'

export default function QuoteCard({
  children,
  header,
  headerHref,
  inputTicker,
  isShow,
  minWidth,
  noClose,
  tools,
  customBgColor
}) {
  const [showCard, setShowCard] = useState(true)

  const defaultBgColor = {
    normal: 'white',
    darkMode: '#ededed'
  }

  const setBgColor = {
    ...defaultBgColor,
    ...customBgColor
  }

  const bgColor = useBgColor(setBgColor.normal, setBgColor.darkMode)

  useEffect(() => {
    setShowCard(isShow)
  }, [inputTicker, isShow])

  return (
    showCard && (
      <Fragment>
        <Card
          text={'dark'}
          border={'light'}
          style={{
            ['minWidth']: minWidth || '10rem',
            backgroundColor: bgColor
          }}
        >
          {header && (
            <Card.Header style={{ padding: '0.2rem' }}>
              <div style={{ display: 'flex', alignItems: 'baseline' }}>
                {headerHref ? (
                  <Button
                    style={{ padding: '0.2rem', ['minWidth']: '3rem' }}
                    variant="secondary"
                    size="sm"
                    target="_blank"
                    href={`/${headerHref}?ticker=${inputTicker}`}
                  >
                    <b>{header}</b>
                  </Button>
                ) : (
                  <HeaderBadge
                    headerTag={'h5'}
                    title={header}
                    badgeProps={{ bg: 'secondary' }}
                  />
                )}
                {!noClose && (
                  <IconContext.Provider
                    value={{ color: 'red', className: 'global-class-name' }}
                  >
                    <RiCloseCircleFill
                      className="cursor"
                      onClick={() => setShowCard(false)}
                    />
                  </IconContext.Provider>
                )}
              </div>
            </Card.Header>
          )}
          <Card.Body style={{ padding: '0.2rem' }}>
            {tools && (
              <StockInfoToolbar tools={tools} inputTicker={inputTicker} />
            )}
            {children}
          </Card.Body>
        </Card>
      </Fragment>
    )
  )
}
