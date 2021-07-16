import { useEffect, useState } from 'react'

import { randRGBColor, calPcnt } from '@/lib/commonFunction'
import { toAxios } from '@/lib/request'

export const useTrendBarChartData = (input, days) => {
  const [barChartData, setBarChartData] = useState(null)

  useEffect(() => {
    ;(async () => {
      const responses = await Promise.all(
        [...input].map(async item => {
          const response = await toAxios('/api/trend/getTrendChanges', {
            ticker: item.ticker,
            days,
            isBus: false
          })
          return response
        })
      ).catch(error => console.error(error))
      const changes = responses.map(item => {
        const closePrice = item?.data?.indicators?.quote.find(x => x)?.close
        const close = closePrice || []
        const start = close.find(x => x)
        const end = close.reverse().find(x => x)
        return calPcnt(end - start, start, 2)
      })

      const trendChanges = [...input].map((item, idx) => {
        return {
          ...item,
          change: changes[idx]
        }
      })

      trendChanges.sort(function (a, b) {
        return b.change - a.change
      })

      const barColors = trendChanges.map(_item => {
        const [r, g, b] = randRGBColor()

        const backgroundColor = `rgba(${r}, ${g}, ${b}, 0.2)`
        const borderColor = `rgba(${r}, ${g}, ${b}, 1)`
        return {
          backgroundColor,
          borderColor
        }
      })

      const data = {
        labels: trendChanges.map(item => item.label),
        datasets: [
          {
            label: 'Category',
            data: trendChanges.map(item => item.change),
            backgroundColor: barColors.map(item => item.backgroundColor),
            borderColor: barColors.map(item => item.borderColor),
            borderWidth: 1
          }
        ]
      }

      setBarChartData(data)
    })()

    return () => setBarChartData(null)
  }, [days, input])

  return barChartData
}
