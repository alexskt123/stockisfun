import { Fragment, useState, useEffect } from 'react'

import StockInfoTable from '@/components/Page/StockInfoTable'
import { fetcher, staticSWROptions } from '@/config/settings'
import Badge from 'react-bootstrap/Badge'
import Modal from 'react-bootstrap/Modal'
import useSWR from 'swr'
import useDarkMode from 'use-dark-mode'

const EarningsModal = ({ ticker, resetTicker }) => {
  const { data } = useSWR(
    () => ticker && `/api/nasdaq/getEarningsHistory?ticker=${ticker}`,
    fetcher,
    staticSWROptions
  )

  const darkMode = useDarkMode(false)
  const [show, setShow] = useState(false)
  const [earnings, setEarnings] = useState({
    tableHeader: [
      'Date Reported',
      'Fiscal Quarter End',
      'Consensus EPS Forecast',
      'Earnings Per Share',
      '% Surprise'
    ],
    tableData: []
  })

  useEffect(() => {
    ;(async () => {
      if (data) {
        setShow(true)
        setEarnings(e => ({
          ...e,
          tableData: data
        }))
      } else setShow(false)
    })()
  }, [data])

  const handleClose = () => {
    setShow(false)
    resetTicker()
  }

  return (
    <Fragment>
      <Modal size="xl" centered show={show} onHide={handleClose}>
        <Modal.Header
          closeButton
          style={{ backgroundColor: darkMode.value ? '#e3e3e3' : 'white' }}
        >
          <Modal.Title>
            <Badge variant="dark">{`Earnings History - ${ticker}`}</Badge>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{ backgroundColor: darkMode.value ? '#e3e3e3' : 'white' }}
        >
          <StockInfoTable
            tableSize="sm"
            tableHeader={earnings.tableHeader}
            tableData={earnings.tableData}
          />
        </Modal.Body>
      </Modal>
    </Fragment>
  )
}

export default EarningsModal
