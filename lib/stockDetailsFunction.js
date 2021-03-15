import millify from 'millify'
import { stockDetailsSettings, officersTableHeader } from '../config/stock'
import { convertSameUnit } from '../lib/commonFunction'

export const getBasics = (response) => {
  const basicsData = response.data.basics
  const balanceSheetData = response.data.balanceSheet
  let officers = []
  const basicItem = []
  const balanceSheetItem = []
  const balanceSheetHeader = []
  const balanceSheetChartData = { labels: [], datasets: [] }

  Object.keys(basicsData).forEach(item => {
    if (item !== 'Company Officers') {
      basicItem.push([item, basicsData[item]])
    } else {
      officers = basicsData['Company Officers'].map(item => {
        const itemArr = [
          item.name,
          item.title,
          item.age || 'N/A',
          (item.totalPay || { 'longFmt': 'N/A' }).longFmt
        ]
        return itemArr
      })
    }
  })

  Object.keys((balanceSheetData.find(x => x) || {})).forEach(item => {
    if (item !== 'Date') {
      const curItem = []
      balanceSheetData.forEach(data => {
        curItem.push(data[item])
      })

      balanceSheetItem.push([item, ...curItem])
    }
  })

  const balanceChartLabel = 'Total Assets,Total Liability,Total Stock Holder Equity'.split(',')
  const balanceChartData = Object.keys((balanceSheetData.find(x => x) || {}))
    .filter(x => balanceChartLabel.includes(x))
    .map(item => {
      return [...balanceSheetData.map(data => data[item])]
    })

  const balanceChart = convertSameUnit(balanceChartData).map((data, index) => {
    return {
      label: balanceChartLabel[index],
      data: data.map(item => (item || '').replace(/K|k|M|B|T/, ''))
    }
  })
  balanceChart.forEach(item => {
    const r = Math.floor(Math.random() * 255) + 1
    const g = Math.floor(Math.random() * 255) + 1
    const b = Math.floor(Math.random() * 255) + 1

    balanceSheetChartData.datasets.push(item.label == 'Total Stock Holder Equity' ?
      {
        type: 'line',
        label: item.label,
        borderColor: `rgba(${r}, ${g}, ${b})`,
        borderWidth: 2,
        fill: false,
        data: item.data
      } : {
        type: 'bar',
        label: item.label,
        backgroundColor: `rgba(${r}, ${g}, ${b})`,
        data: item.data
      }
    )
  })

  balanceSheetChartData.labels.reverse()
  balanceSheetChartData.datasets.reverse()

  balanceSheetHeader.push('')
  balanceSheetData.forEach(item => {
    balanceSheetHeader.push(item['Date'])
    balanceSheetChartData.labels.push(item['Date'])
  })

  return {
    basics: {
      tableHeader: [],
      tableData: [...basicItem]
    },
    officers: {
      tableHeader: [...officersTableHeader],
      tableData: [...officers]
    },
    balanceSheet: {
      tableHeader: [...balanceSheetHeader],
      tableData: [...balanceSheetItem],
      chartData: { ...balanceSheetChartData }
    }
  }
}

export const getETFList = (response) => {
  const etfList = { ...stockDetailsSettings.etfList }
  const { data } = response

  const etfItemHeader = Object.keys(data.find(x => x) || {})
  const etfItem = []

  etfItem.push(...data.map(data => {
    const newArr = []
    etfItemHeader.forEach(item => {
      newArr.push(data[item])
    })
    return newArr
  }))

  etfList.tableHeader = [...etfItemHeader]
  etfList.tableData = [...etfItem.map(itemArr => itemArr.map((item, idx) => {
    return idx == 0 ? { link: `/etfdetail?query=${item}`, data: item } : item
  }))]

  return { etfList }
}

export const getYahooEarnings = (response) => {

  const earnings = {
    tableHeader: [],
    tableData: [],
    chartData: {
      labels: [],
      datasets: []
    },
    chartOptions: {

    }
  }

  if (response && response.data) {
    earnings.tableHeader = ['', ...response.data.map(item => item.date)]
    earnings.chartOptions = {
      scales: {
        yAxes: [{
          ticks: {
            callback: function (value) {
              return millify(value || 0)
            }
          }
        }]
      }
    }

    Object.keys([...response.data].find(x => x) || []).reverse().forEach(item => {
      if (item == 'date') {
        earnings.chartData.labels = [...response.data.map(data => data[item])]
      } else {
        earnings.tableData.push([item, ...response.data.map(data => millify(data[item] || 0))])

        const r = Math.floor(Math.random() * 255) + 1
        const g = Math.floor(Math.random() * 255) + 1
        const b = Math.floor(Math.random() * 255) + 1

        earnings.chartData.datasets.push(
          item == 'Net Income' ? {
            type: 'line',
            label: item,
            borderColor: `rgba(${r}, ${g}, ${b})`,
            borderWidth: 2,
            fill: false,
            data: response.data.map(data => data[item])
          } : {
              type: 'bar',
              label: item,
              backgroundColor: `rgba(${r}, ${g}, ${b})`,
              data: response.data.map(data => data[item])
            }
        )
      }
    })

    earnings.tableData.reverse()

  }

  return { earnings }

}
