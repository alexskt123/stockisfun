import { randRGBColor } from '@/lib/commonFunction/colors'

export const randChartColors = input => {
  return input.map(_item => {
    const [r, g, b] = randRGBColor()

    const backgroundColor = `rgba(${r}, ${g}, ${b}, 0.2)`
    const borderColor = `rgba(${r}, ${g}, ${b}, 1)`
    return {
      backgroundColor,
      borderColor
    }
  })
}

const chartData = settings => {
  const { colors, label, dataLabels, data } = settings
  return {
    labels: dataLabels,
    datasets: [
      {
        label,
        data,
        backgroundColor: colors.map(item => item.backgroundColor),
        borderColor: colors.map(item => item.borderColor),
        borderWidth: 1
      }
    ]
  }
}

export const getPieChartData = settings => {
  return chartData(settings)
}

export const getBarChartData = settings => {
  return chartData(settings)
}

export const getBarChartLineDatasets = (color, label, data) => {
  const [r, g, b] = color

  return {
    type: 'line',
    label,
    borderColor: `rgba(${r}, ${g}, ${b})`,
    borderWidth: 2,
    fill: false,
    data
  }
}

export const getBarChartBarDatasets = (color, label, data) => {
  const [r, g, b] = color
  return {
    type: 'bar',
    label,
    backgroundColor: `rgba(${r}, ${g}, ${b})`,
    data
  }
}
