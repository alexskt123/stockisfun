import { useEffect, useState } from 'react'

import { toAxios } from '@/lib/request'
import moment from 'moment'

export const useUserCalendarEvents = (user, userData) => {
  const [eventList, setEventList] = useState([])

  useEffect(() => {
    ;(async () => {
      const userWatchList =
        user && userData?.watchList ? userData?.watchList : []
      const responses = await Promise.all(
        [...userWatchList].map(item =>
          toAxios('/api/yahoo/getEarningsDate', { ticker: item })
        )
      ).catch(error => console.error(error))
      const eventEarnings = [...userWatchList].map((item, idx) => {
        return {
          id: idx,
          title: item,
          start: moment.unix(responses[idx]?.data.raw),
          end: moment.unix(responses[idx]?.data.raw)
        }
      })

      setEventList(eventEarnings)
    })()

    return () => setEventList([])
  }, [user, userData])

  return eventList
}
