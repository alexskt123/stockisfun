import { Fragment, useState } from 'react'

import Wiggle from '@/components/Parts/Wiggle'
import { fetcher } from '@/config/settings'
import { fireToast } from '@/lib/commonFunction'
import { useBgColor } from '@/lib/hooks/useBgColor'
import { useTVTicker } from '@/lib/hooks/useTVTicker'
import Badge from 'react-bootstrap/Badge'
import Modal from 'react-bootstrap/Modal'
import useSWR from 'swr'

import TradingView from './TradingView'

export default function TradingViewModal({ buttonClassName, ticker }) {
  const { data } = useSWR(
    () => ticker && `/api/yahoo/getQuoteType?ticker=${ticker}`,
    fetcher
  )

  const bgColor = useBgColor('white', '#e3e3e3')
  const theme = useBgColor('light', 'dark')
  const symbol = useTVTicker(ticker)

  const [show, setShow] = useState(false)

  const handleClose = () => {
    setShow(false)
  }

  const handleClick = () => {
    if (!(data?.result?.type === 'EQUITY' || data?.result?.type === 'ETF')) {
      fireToast({
        icon: 'error',
        title: 'Please enter a valid symbol (Equity/ETF)!'
      })
      return
    }
    setShow(true)
  }

  return (
    <Fragment>
      <Wiggle>
        <Badge
          variant="info"
          className={buttonClassName}
          onClick={() => handleClick()}
        >
          {'Trading View'}
        </Badge>
      </Wiggle>
      <Modal centered size="xl" show={show} onHide={handleClose}>
        <Modal.Body style={{ backgroundColor: bgColor }}>
          {show && <TradingView option={{ symbol, theme }} />}
        </Modal.Body>
      </Modal>
    </Fragment>
  )
}
