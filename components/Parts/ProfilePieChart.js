import { Fragment, useEffect, useState } from 'react'

import GooeySpinner from '@/components/Loading/GooeySpinner'
import QuoteCard from '@/components/Parts/QuoteCard'
import { randRGBColor } from '@/lib/commonFunction'
import { Pie } from 'react-chartjs-2'

const ProfilePieChart = ({ inputList, label, data, header, pieOptions }) => {
  const [pieData, setPieData] = useState(null)

  useEffect(() => {
    if (!inputList) return

    const chartColors = inputList.map(_item => {
      const [r, g, b] = randRGBColor()

      const backgroundColor = `rgba(${r}, ${g}, ${b}, 0.2)`
      const borderColor = `rgba(${r}, ${g}, ${b}, 1)`
      return {
        backgroundColor,
        borderColor
      }
    })

    const chartData = {
      labels: inputList.map(item => item[label]),
      datasets: [
        {
          label: 'Distribution',
          data: inputList.map(item => item[data]),
          backgroundColor: chartColors.map(item => item.backgroundColor),
          borderColor: chartColors.map(item => item.borderColor),
          borderWidth: 1
        }
      ]
    }

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
