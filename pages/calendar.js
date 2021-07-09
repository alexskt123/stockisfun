import { Fragment, useState } from 'react'

import CustomContainer from '@/components/Layout/CustomContainer'
import EarningsModal from '@/components/Page/Calendar/EarningsModal'
import QuoteCard from '@/components/Parts/QuoteCard'
import { usePersistedUser, useUserData } from '@/lib/firebaseResult'
import { useUserCalendarEvents } from '@/lib/hooks/calendar'
import moment from 'moment'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import LoadingOverlay from 'react-loading-overlay'

import 'react-big-calendar/lib/css/react-big-calendar.css'

const localizer = momentLocalizer(moment)

//export default component
export default function BigCalendar() {
  const user = usePersistedUser()
  const userData = useUserData(user)
  const eventList = useUserCalendarEvents(user, userData)

  const [ticker, setTicker] = useState(null)

  const handleSelectSlot = async e => {
    setTicker(e.title)
  }

  const resetTicker = () => {
    setTicker(null)
  }

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
