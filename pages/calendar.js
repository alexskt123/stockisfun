import { Fragment, useState } from 'react'

import CustomContainer from '@/components/Layout/CustomContainer'
import BgColor from '@/components/Page/BgColor'
import EarningsModal from '@/components/Page/Calendar/EarningsModal'
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
      <CustomContainer>
        <Fragment>
          <BgColor customBgColor={{ normal: 'white', darkMode: '#d8ebed' }}>
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
                style={{ height: '80vh', fontSize: 'x-small' }}
                onSelectEvent={handleSelectSlot}
              />
            </LoadingOverlay>
          </BgColor>
          <EarningsModal ticker={ticker} resetTicker={resetTicker} />
        </Fragment>
      </CustomContainer>
    </Fragment>
  )
}
