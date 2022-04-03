import { Fragment, useState, useEffect } from 'react'

import { Line } from 'react-chartjs-2'

import { rsChartOptions } from '@/config/price'
import { rsDays } from '@/config/rs'
import { calRelativeStrength } from '@/lib/commonFunction'
import { useStaticSWR } from '@/lib/request'

function RelativeStrength({ ticker, datePrice, inputDays }) {
  const [chartData, setChartData] = useState({ datasets: [] })

  const calRS = (inputDays, tickerData, spxData) => {
    const rsList = [...Array(parseInt(inputDays))].map((_x, i) => {
      const rsValue = calRelativeStrength(
        tickerData[i].price,
        tickerData[i + rsDays].price,
        spxData[i].price,
        spxData[i + rsDays].price,
        rsDays
      )
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
      tickerData.length > 0 &&
      spxData &&
      tickerData.length >= parseInt(inputDays) + rsDays &&
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
