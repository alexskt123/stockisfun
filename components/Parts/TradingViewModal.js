import { Fragment, useState } from 'react'

import { useBgColor } from '@/lib/hooks/useBgColor'
import { useTVTheme } from '@/lib/hooks/useTVTheme'
import Badge from 'react-bootstrap/Badge'
import Modal from 'react-bootstrap/Modal'

import TradingView from './TradingView'

export default function TradingViewModal({ ticker }) {
  const bgColor = useBgColor('white', '#e3e3e3')
  const theme = useTVTheme()

  const [show, setShow] = useState(false)

  const handleClose = () => setShow(false)

  const handleClick = () => {
    setShow(true)
  }

  return (
    <Fragment>
      <Badge variant="light" className="cursor" onClick={() => handleClick()}>
        {'Trading View'}
      </Badge>
      <Modal centered size="xl" show={show} onHide={handleClose}>
        <Modal.Body style={{ backgroundColor: bgColor }}>
          <TradingView option={{ symbol: ticker.replace('.HK', ''), theme }} />
        </Modal.Body>
      </Modal>
    </Fragment>
  )
}
