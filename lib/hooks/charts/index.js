import { useEffect, useState } from 'react'

import { getBarChartData, randChartColors } from '@/lib/chart'
import { calPcnt } from '@/lib/commonFunction'
import { toAxios } from '@/lib/request'

export const useTrendBarChartData = (input, days) => {
  const [barChartData, setBarChartData] = useState(null)

  useEffect(() => {
    ;(async () => {
      const responses = await Promise.all(
        [...input].map(item =>
          toAxios('/api/trend/getTrendChanges', {
            ticker: item.ticker,
            days,
            isBus: false
          })
        )
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

      const colors = randChartColors(trendChanges)
      const data = getBarChartData({
        colors,
        label: 'Category',
        data: trendChanges.map(item => item.change),
        dataLabels: trendChanges.map(item => item.label)
      })

      setBarChartData(data)
    })()

    return () => setBarChartData(null)
  }, [days, input])

  return barChartData
}
