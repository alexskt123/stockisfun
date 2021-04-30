import { Fragment, useContext, useState, useEffect } from 'react'
import Container from 'react-bootstrap/Container'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import { Store } from '../lib/store'

import Modal from 'react-bootstrap/Modal'
import Badge from 'react-bootstrap/Badge'

import 'react-big-calendar/lib/css/react-big-calendar.css'
import StockInfoTable from '../components/Page/StockInfoTable'

const axios = require('axios').default

const localizer = momentLocalizer(moment)

//export default component
export default function BigCalendar() {

  const store = useContext(Store)
  const { state } = store
  const { user } = state

  const [eventList, setEventList] = useState([])
  const [show, setShow] = useState(false)
  const [earnings, setEarnings] = useState({
    tableHeader: ['Fiscal Quarter End', 'Date Reported', 'Earnings Per Share', 'Consensus EPS Forecast', '% Surprise'],
    tableData: []
  })

  const handleClose = () => setShow(false)

  const handleSelectSlot = async (e) => {
    const { data } = await axios.get(`/api/nasdaq/getEarningsHistory?ticker=${e.title}`).catch(err => console.log(err))
    const tableData = data.map(item => Object.values(item))
    setEarnings({
      ...earnings,
      tableData
    })
    setShow(true)
  }

  useEffect(async () => {
    const responses = await Promise.all([...user.watchList].map(async item => {
      return axios.get(`/api/yahoo/getYahooEarningsDate?ticker=${item}`).catch(err => console.log(err))
    })).catch(error => console.log(error))
    const eventEarnings = [...user.watchList].map((item, idx) => {
      return {
        id: idx,
        title: item,
        start: moment.unix(responses[idx].data.raw),
        end: moment.unix(responses[idx].data.raw)
      }
    })

    setEventList(eventEarnings)
  }, [user])

  return (
    <Fragment>
      <Container style={{ minHeight: '100vh' }} className="mt-5 shadow-lg p-3 mb-5 bg-white rounded">
        <Fragment>
          <Calendar
            popup
            localizer={localizer}
            events={eventList}
            views={['month']}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '90vh', fontSize: 'x-small' }}
            onSelectEvent={handleSelectSlot}
          />
          <Modal centered show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title><Badge variant="light">{'Earnings History'}</Badge></Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <StockInfoTable tableSize="sm" tableHeader={earnings.tableHeader} tableData={earnings.tableData} />
            </Modal.Body>
          </Modal>
        </Fragment>
      </Container>
    </Fragment>
  )
}

