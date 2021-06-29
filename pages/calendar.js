import { Fragment, useState, useEffect } from 'react'

import EarningsModal from '@/components/Page/Calendar/EarningsModal'
import QuoteCard from '@/components/Parts/QuoteCard'
import { useUser, useUserData } from '@/lib/firebaseResult'
import moment from 'moment'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import Container from 'react-bootstrap/Container'
import 'react-big-calendar/lib/css/react-big-calendar.css'

const axios = require('axios').default

const localizer = momentLocalizer(moment)

//export default component
export default function BigCalendar() {
  const user = useUser()
  const userData = useUserData(user)

  const [eventList, setEventList] = useState([])
  const [ticker, setTicker] = useState(null)

  const handleSelectSlot = async e => {
    setTicker(e.title)
  }

  useEffect(() => {
    ;(async () => {
      const userWatchList = user ? userData?.watchList : []
      const responses = await Promise.all(
        [...userWatchList].map(async item => {
          return axios
            .get(`/api/yahoo/getYahooEarningsDate?ticker=${item}`)
            .catch(err => console.error(err))
        })
      ).catch(error => console.error(error))
      const eventEarnings = [...userWatchList].map((item, idx) => {
        return {
          id: idx,
          title: item,
          start: moment.unix(responses[idx].data.raw),
          end: moment.unix(responses[idx].data.raw)
        }
      })

      setEventList(eventEarnings)
    })()
  }, [user, userData])

  return (
    <Fragment>
      <Container
        style={{ minHeight: '100vh' }}
        className="mt-5 shadow-lg p-3 mb-5 rounded"
      >
        <Fragment>
          <QuoteCard
            header={'Calendar'}
            isShow={true}
            noClose={true}
            customBgColor={{ normal: 'white', darkmode: '#adadad' }}
          >
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
          <EarningsModal ticker={ticker} />
        </Fragment>
      </Container>
    </Fragment>
  )
}
