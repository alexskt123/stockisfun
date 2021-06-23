import { Fragment, useState, useEffect } from 'react'
import Container from 'react-bootstrap/Container'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import useDarkMode from 'use-dark-mode'
import { useUser, useUserData } from '../lib/firebaseResult'

import Modal from 'react-bootstrap/Modal'
import Badge from 'react-bootstrap/Badge'

import 'react-big-calendar/lib/css/react-big-calendar.css'
import StockInfoTable from '../components/Page/StockInfoTable'
import QuoteCard from '../components/Parts/QuoteCard'

const axios = require('axios').default

const localizer = momentLocalizer(moment)

//export default component
export default function BigCalendar() {

  const darkMode = useDarkMode(false)

  const user = useUser()
  const userData = useUserData(user)

  const [eventList, setEventList] = useState([])
  const [show, setShow] = useState({ show: false, ticker: null })
  const [earnings, setEarnings] = useState({
    tableHeader: ['Date Reported', 'Fiscal Quarter End', 'Consensus EPS Forecast', 'Earnings Per Share', '% Surprise'],
    tableData: []
  })

  const handleClose = () => setShow({ show: false, ticker: null })

  const handleSelectSlot = async (e) => {
    const { data } = await axios.get(`/api/nasdaq/getEarningsHistory?ticker=${e.title}`).catch(err => console.log(err))
    const tableData = data
    setEarnings({
      ...earnings,
      tableData
    })
    setShow({ show: true, ticker: e.title })
  }

  useEffect(() => {
    (async () => {
      const responses = await Promise.all([...userData.watchList].map(async item => {
        return axios.get(`/api/yahoo/getYahooEarningsDate?ticker=${item}`).catch(err => console.log(err))
      })).catch(error => console.log(error))
      const eventEarnings = [...userData.watchList].map((item, idx) => {
        return {
          id: idx,
          title: item,
          start: moment.unix(responses[idx].data.raw),
          end: moment.unix(responses[idx].data.raw)
        }
      })

      setEventList(eventEarnings)
    })()
  }, [userData])

  return (
    <Fragment>
      <Container style={{ minHeight: '100vh' }} className="mt-5 shadow-lg p-3 mb-5 rounded">
        <Fragment>
          <QuoteCard header={'Calendar'} isShow={true} noClose={true} customBgColor={{normal: 'white', darkmode: '#adadad'}}>
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
          </QuoteCard>
          <Modal
            size="xl"
            centered
            show={show.show}
            onHide={handleClose}
          >
            <Modal.Header closeButton style={{ backgroundColor: darkMode.value ? '#e3e3e3' : 'white' }}>
              <Modal.Title><Badge variant="dark">{`Earnings History - ${show.ticker}`}</Badge></Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ backgroundColor: darkMode.value ? '#e3e3e3' : 'white' }}>
              <StockInfoTable tableSize="sm" tableHeader={earnings.tableHeader} tableData={earnings.tableData} />
            </Modal.Body>
          </Modal>
        </Fragment>
      </Container>
    </Fragment>
  )
}

