import { Fragment, useState } from 'react'

import FormOptions from '@/components/Form/FormOptions'
import CustomContainer from '@/components/Layout/CustomContainer'
import BgColor from '@/components/Page/BgColor'
import EarningsModal from '@/components/Page/Calendar/EarningsModal'
import { userListSelectAttr } from '@/config/form'
import { usePersistedUser, useUserData } from '@/lib/firebaseResult'
import { useUserCalendarEvents } from '@/lib/hooks/calendar'
import moment from 'moment'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import LoadingOverlay from 'react-loading-overlay'
import useTypingEffect from 'use-typing-effect'

import 'react-big-calendar/lib/css/react-big-calendar.css'

const localizer = momentLocalizer(moment)

export default function BigCalendar() {
  const [ticker, setTicker] = useState(null)
  const [list, setList] = useState('watchList')

  const user = usePersistedUser()
  const userData = useUserData(user)
  const eventList = useUserCalendarEvents(user, userData, list)
  const loadingText = useTypingEffect(['Loading...'])

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
          <BgColor customBgColor={{ normal: 'white', darkMode: '#b5c7c6' }}>
            <LoadingOverlay
              active={user && eventList?.length <= 0}
              spinner
              text={loadingText}
            >
              {user && userData && (
                <FormOptions
                  formOptionSettings={userListSelectAttr}
                  value={list}
                  handleChange={e => {
                    const list = e?.target?.value
                    setList(list)
                  }}
                />
              )}
              <Calendar
                popup
                localizer={localizer}
                events={eventList}
                views={['month']}
                startAccessor="start"
                endAccessor="end"
                style={{ height: '75vh', fontSize: 'x-small' }}
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
