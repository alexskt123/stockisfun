import { Fragment, useEffect, useState } from 'react'

import GooeySpinner from '@/components/Loading/GooeySpinner'
import QuoteCard from '@/components/Parts/QuoteCard'
import { getPieChartData, randChartColors } from '@/lib/chart'
import { Pie } from 'react-chartjs-2'

const ProfilePieChart = ({ inputList, label, data, header, pieOptions }) => {
  const [pieData, setPieData] = useState(null)

  useEffect(() => {
    if (!inputList) return

    const colors = randChartColors(inputList)
    const chartData = getPieChartData({
      colors,
      label: 'Distribution',
      data: inputList.map(item => item[data]),
      dataLabels: inputList.map(item => item[label])
    })

    setPieData(chartData)

    return () => {
      setPieData(null)
    }
  }, [inputList, data, label])

  return (
    <Fragment>
      <QuoteCard header={header} isShow={true} noClose={true}>
        {pieData ? (
          <Pie data={pieData} options={pieOptions} />
        ) : (
          <GooeySpinner />
        )}
      </QuoteCard>
    </Fragment>
  )
}

export default ProfilePieChart
