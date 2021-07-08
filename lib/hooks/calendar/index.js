import { useEffect, useState } from 'react'

import { handleAxiosError } from '@/lib/commonFunction'
import to from 'await-to-js'
import axios from 'axios'
import moment from 'moment'

export const useUserCalendarEvents = (user, userData) => {
  const [eventList, setEventList] = useState([])

  useEffect(() => {
    ;(async () => {
      const userWatchList =
        user && userData?.watchList ? userData?.watchList : []
      const responses = await Promise.all(
        [...userWatchList].map(async item => {
          const [err, response] = await to(
            axios.get(`/api/yahoo/getEarningsDate?ticker=${item}`)
          )
          handleAxiosError(err)
          return response
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

    return () => setEventList([])
  }, [user, userData])

  return eventList
}
