import { Fragment, useState, useEffect } from 'react'

import { rsChartOptions } from '@/config/price'
import { rsDays } from '@/config/rs'
import { useStaticSWR } from '@/lib/request'
import { Line } from 'react-chartjs-2'

function RelativeStrength({ ticker, datePrice, inputDays }) {
  const [chartData, setChartData] = useState({})

  const calRS = (inputDays, tickerData, spxData) => {
    const rsList = [...Array(parseInt(inputDays))].map((_x, i) => {
      const tickerStrength =
        tickerData[i + rsDays].price / tickerData[i].price / rsDays
      const spxStrength = spxData[i + rsDays].price / spxData[i].price / rsDays
      const rsValue = tickerStrength / spxStrength - 1
      return rsValue
    })

    setChartData({
      labels: [...tickerData.slice(rsDays).map(item => item.date)],
      datasets: [
        {
          label: ticker,
          data: rsList,
          borderColor: 'rgba(245,40,145,0.8)',
          showLine: true
        },
        {
          data: rsList.map(_x => 0),
          showLine: true,
          borderColor: 'rgba(255,174,50,1)',
          pointRadius: 0
        }
      ]
    })
  }

  const spxPrice = useStaticSWR(
    'SPY',
    `/api/yahoo/getHistoryPrice?ticker=SPY&days=${
      parseInt(inputDays) + rsDays
    }&isBus=true`
  )

  useEffect(() => {
    const tickerData = datePrice?.data?.historyPrice
    const spxData = spxPrice?.data?.historyPrice

    inputDays &&
      tickerData &&
      spxData &&
      calRS(
        inputDays,
        tickerData.slice(tickerData.length - (parseInt(inputDays) + rsDays)),
        spxData
      )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [datePrice, spxPrice, inputDays])

  return (
    <Fragment>
      <Line data={chartData} options={rsChartOptions} />
    </Fragment>
  )
}

export default RelativeStrength
