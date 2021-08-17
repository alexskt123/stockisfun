import { Fragment, useState, useEffect } from 'react'

import StockInfoTable from '@/components/Page/StockInfoTable'
import { earningsModalDefaultSettings } from '@/config/calendar'
import { cloneObj } from '@/lib/commonFunction'
import { useBgColor } from '@/lib/hooks/useBgColor'
import { useStaticSWR } from '@/lib/request'
import Badge from 'react-bootstrap/Badge'
import Modal from 'react-bootstrap/Modal'

const EarningsModal = ({ ticker, resetTicker }) => {
  const { data } = useStaticSWR(
    ticker,
    `/api/nasdaq/getEarningsHistory?ticker=${ticker}`
  )

  const backgroundColor = useBgColor('white', 'e3e3e3')
  const [show, setShow] = useState(false)
  const [earnings, setEarnings] = useState(
    cloneObj(earningsModalDefaultSettings)
  )

  useEffect(() => {
    data &&
      setEarnings(e => ({
        ...e,
        tableData: data
      }))

    setShow(!!data)
  }, [data])

  const handleClose = () => {
    setShow(false)
    resetTicker()
  }

  return (
    <Fragment>
      <Modal size="xl" centered show={show} onHide={handleClose}>
        <Modal.Header closeButton style={{ backgroundColor }}>
          <Modal.Title>
            <Badge variant="dark">{`Earnings History - ${ticker}`}</Badge>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor }}>
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
