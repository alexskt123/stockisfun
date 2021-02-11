
import { Fragment, useState } from 'react'

import { chartResponse } from '../config/yahooChart'
import { chartDataSet, dateRange } from '../config/price'
import StockInfoTable from '../components/StockInfoTable'
import { Line } from 'react-chartjs-2';
import TickerInput from '../components/TickerInput'
import TickerBullet from '../components/TickerBullet'
import { sortTableItem } from '../lib/commonFunction'
import CustomContainer from '../components/CustomContainer'
import LoadingSpinner from '../components/Loading/LoadingSpinner';
const axios = require('axios').default

export default function Home() {

  const [tickers, setTickers] = useState([])
  const [tableHeader, setTableHeader] = useState([])
  const [yearlyPcnt, setYearlyPcnt] = useState([])
  const [chartData, setChartData] = useState({ 'labels': [...dateRange.map(item => item.fromDate.substring(0, 4))].reverse(), 'datasets': [] })
  const [quote, setQuote] = useState([])
  const [validated, setValidated] = useState(false)
  const [formValue, setFormValue] = useState({})
  const [clicked, setClicked] = useState(false)
  const [ascSort, setAscSort] = useState(false)


  const handleChange = (e) => {
    setFormValue({
      ...formValue,
      [e.target.name]: e.target.value
    })
  }


  const sortItem = async (index) => {
    setAscSort(!ascSort)
    setYearlyPcnt(
      await sortTableItem(yearlyPcnt, index, ascSort)
    )
  }

  const clearItems = async () => {
    setTickers(
      []
    )
    setYearlyPcnt(
      []
    )
    setChartData(
      { 'labels': [...dateRange.map(item => item.fromDate.substring(0, 4))].reverse(), 'datasets': [] }
    )
  }

  const removeItem = async (value) => {
    if (clicked) return

    setTickers(
      [...tickers.filter(x => x !== value)]
    )
    setYearlyPcnt(
      [
        ...yearlyPcnt.filter(x => x.find(x => x) !== value)
      ]
    )
    setChartData(
      {
        'labels': [...dateRange.map(item => item.fromDate.substring(0, 4))].reverse(),
        'datasets': [...chartData.datasets.filter(x => x.label !== value)]
      }
    )
  }

  async function handleTickers(inputTickers) {

    let newTickers = inputTickers.filter(x => !tickers.includes(x.toUpperCase()))

    let inputItems = []

    dateRange.forEach(item => {
      inputItems.push(
        newTickers.map(tickerItem => {
          const newItem = {
            'ticker': tickerItem.toUpperCase(),
            ...item
          }

          return newItem
        })
      )
    })


    let outputItem = { ...chartResponse }
    let temp = []
    let tempQuote = []

    for (const ticker of newTickers) {

      outputItem = await axios(`/api/getYahooHistoryPrice?ticker=${ticker}`)

      temp.push(outputItem.data)

      tempQuote.push(
        outputItem.data.quote
      )
    }


    temp = temp.map(item => {
      const newTemp = {
        'annualized': getAnnualizedPcnt(item),
        'total': getTotalPcnt(item),
        ...item
      }
      return newTemp
    })

    setTickers([
      ...tickers,
      ...temp.map(item => item.ticker)
    ])

    setQuote([
      ...quote,
      ...tempQuote
    ])

    setTableHeader(
      [
        'Ticker',
        'Price',
        'Annualized',
        'Total',
        ...dateRange.map(ii => ii.fromDate.substring(0, 4))
      ]
    )

    setYearlyPcnt(
      [
        ...yearlyPcnt,
        ...temp.map(item => {
          const newItem = [
            item.ticker,
            tempQuote.find(x => x.ticker == item.ticker)['Current Price'],
            item.annualized,
            item.total,
            ...item.data
          ]
          return newItem
        })
      ]
    )

    setChartData(
      {
        label: [...dateRange.map(ii => ii.fromDate.substring(0, 4))].reverse(),
        datasets: [...chartData.datasets,
        ...temp.map(item => {
          const r = Math.floor(Math.random() * 255) + 1
          const g = Math.floor(Math.random() * 255) + 1
          const b = Math.floor(Math.random() * 255) + 1

          let backgroundColor = (`rgba(${r}, ${g}, ${b}, 0.4)`)
          let borderColor = (`rgba(${r}, ${g}, ${b}, 1)`)

          const newItem = {
            ...chartDataSet,
            'label': item.ticker,
            'data': item.data.reverse(),
            backgroundColor,
            borderColor,
            'pointBorderColor': borderColor,
            'pointHoverBackgroundColor': borderColor
          }
          return newItem
        })
        ]
      }
    )


  }

  const getTotalPcnt = (item) => {
    return ((item.endPrice - item.startPrice) / item.startPrice * 100).toFixed(2)
  }

  const getAnnualizedPcnt = (item) => {

    let totalPcnt = 1

    //exclude 2021
    item.data.slice(1).forEach(data => {
      if (data != 'N/A') {
        totalPcnt = totalPcnt * (parseFloat(data) / 100 + 1)
      }
    })

    const diffPcnt = ((Math.pow(totalPcnt, 1 / (item.yearCnt - 1)) - 1) * 100).toFixed(2)

    return diffPcnt
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const form = event.currentTarget

    setClicked(true)

    if (form.checkValidity() === false) {
      event.stopPropagation()
    } else {

      const { formTicker } = formValue

      const inputTickers = formTicker.split(',')

      await handleTickers(inputTickers)

    }
    setValidated(true)
    setClicked(false)
  }

  return (
    <Fragment>
      <CustomContainer style={{ minHeight: '100vh' }}>
        <Fragment>
          <TickerInput
            validated={validated}
            handleSubmit={handleSubmit}
            placeholderText={"Single:  aapl /  Mulitple:  tsm,0700.hk,voo"}
            handleChange={handleChange}
            clicked={clicked}
            clearItems={clearItems}
            tableHeader={tableHeader}
            tableData={yearlyPcnt}
            exportFileName={'Stock_price.csv'}
          />
          <TickerBullet tickers={tickers} overlayItem={quote} removeItem={removeItem} />
          {clicked ?
            <LoadingSpinner /> : ''
          }
          <StockInfoTable tableHeader={tableHeader} tableData={yearlyPcnt} sortItem={sortItem} />
          <Line data={chartData} />
        </Fragment>
      </CustomContainer>
    </Fragment >
  )
}
