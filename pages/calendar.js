import { Fragment, useState, useEffect } from 'react'

import CustomContainer from '@/components/Layout/CustomContainer'
import EarningsModal from '@/components/Page/Calendar/EarningsModal'
import QuoteCard from '@/components/Parts/QuoteCard'
import { usePersistedUser, useUserData } from '@/lib/firebaseResult'
import moment from 'moment'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import LoadingOverlay from 'react-loading-overlay'

import 'react-big-calendar/lib/css/react-big-calendar.css'

const axios = require('axios').default

const localizer = momentLocalizer(moment)

//export default component
export default function BigCalendar() {
  const user = usePersistedUser()
  const userData = useUserData(user)

  const [eventList, setEventList] = useState([])
  const [ticker, setTicker] = useState(null)

  const handleSelectSlot = async e => {
    setTicker(e.title)
  }

  const resetTicker = () => {
    setTicker(null)
  }

  useEffect(() => {
    ;(async () => {
      const userWatchList = userData?.watchList ? userData?.watchList : []
      const responses = await Promise.all(
        [...userWatchList].map(async item => {
          return axios
            .get(`/api/yahoo/getEarningsDate?ticker=${item}`)
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
      <CustomContainer style={{ minHeight: '100vh', fontSize: '14px' }}>
        <Fragment>
          <QuoteCard
            header={'Calendar'}
            isShow={true}
            noClose={true}
            customBgColor={{ normal: 'white', darkmode: '#adadad' }}
          >
            <LoadingOverlay
              active={user && eventList?.length <= 0}
              spinner
              text="Loading your content..."
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
            </LoadingOverlay>
          </QuoteCard>
          <EarningsModal ticker={ticker} resetTicker={resetTicker} />
        </Fragment>
      </CustomContainer>
    </Fragment>
  )
}
