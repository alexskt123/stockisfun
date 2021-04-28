import { Fragment, useContext, useState, useEffect } from 'react'
import Container from 'react-bootstrap/Container'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import { Store } from '../lib/store'

import 'react-big-calendar/lib/css/react-big-calendar.css'

const axios = require('axios').default

const localizer = momentLocalizer(moment)

//export default component
export default function BigCalendar() {

  const store = useContext(Store)
  const { state } = store
  const { user } = state

  const [eventList, setEventList] = useState([])

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
            localizer={localizer}
            events={eventList}
            defaultView="month"
            startAccessor="start"
            endAccessor="end"
            style={{ height: '90vh', fontSize: 'x-small' }}
          />
        </Fragment>
      </Container>
    </Fragment>
  )
}

