import { chartDataSet } from '@/config/price'
import {
  calPcnt,
  calRelativeStrength,
  convertFromPriceToNumber,
  randRGBColor,
  roundTo,
  getAnnualizedPcnt,
  getFormattedFromToDate
} from '@/lib/commonFunction'
import { toAxios } from '@/lib/request'
import { getHistoryPrice } from '@/lib/yahoo/getHistoryPrice'
import moment from 'moment-business-days'

const getUserBoughtList = async userData => {
  const { boughtList, cash } = userData || { boughtList: [], cash: 0 }
  const boughtTickers = boughtList.map(x => x.ticker)
  const response = await toAxios('/api/yahoo/getQuote', {
    ticker: boughtTickers.join(',')
  })
  const { data: quotes } = response || { data: [] }
  const boughtListWithInfo = boughtList.map(boughtListItem => {
    const quote = quotes.find(x => x.symbol === boughtListItem.ticker)
    const type = quote?.quoteType

    const regular = {
      net: quote?.regularMarketChange * boughtListItem.total,
      sum: quote?.regularMarketPrice * boughtListItem.total,
      prevSum: quote?.regularMarketPreviousClose * boughtListItem.total
    }

    const pre = {
      net: quote?.preMarketChange * boughtListItem.total,
      sum: quote?.preMarketPrice * boughtListItem.total,
      prevSum: quote?.regularMarketPrice * boughtListItem.total
    }

    const post = {
      net: quote?.postMarketChange * boughtListItem.total,
      sum: quote?.postMarketPrice * boughtListItem.total,
      prevSum: quote?.regularMarketPrice * boughtListItem.total
    }

    return {
      ...boughtListItem,
      name: quote?.shortName,
      regular,
      pre,
      post,
      type
    }
  })

  return { boughtList: boughtListWithInfo, cash: cash || 0 }
}

const getUserBoughtListDetails = async userData => {
  const { boughtList, cash } = await getUserBoughtList(userData)
  const ticker = [...boughtList].map(item => item.ticker)

  const profile = await toAxios('/api/yahoo/getAssetProfile', {
    ticker
  })

  const boughtListDetails = boughtList.map((item, idx) => {
    return {
      ...item,
      sector: profile?.data[idx]?.sector
    }
  })
  return { boughtList: boughtListDetails, cash }
}

const getTotalPcnt = item => {
  return calPcnt(item.endPrice - item.startPrice, item.startPrice, 2, true)
}

const getFormattedHistoryPrice = async (ticker, fromDate, toDate) => {
  const outputItem = await getHistoryPrice(ticker, fromDate, toDate)

  return {
    date: (outputItem.timestamp || []).map(item =>
      moment.unix(item).format('DD MMM YYYY')
    ),
    price: outputItem.indicators.quote.find(x => x).close || []
  }
}

const getRelativeStrengthByDays = async (
  ticker,
  refTicker,
  rsDays,
  newHighDays,
  highRange
) => {
  const fromToDate = getFormattedFromToDate(newHighDays, true)

  const tickerData = await getFormattedHistoryPrice(
    ticker,
    fromToDate.formattedFromDate,
    fromToDate.formattedToDate
  )

  const refData = await getFormattedHistoryPrice(
    refTicker,
    fromToDate.formattedFromDate,
    fromToDate.formattedToDate
  )

  const tickerPrice = tickerData.price
  const refPrice = refData.price

  const latestPrice = [...Array(highRange)].map(
    (_x, i) => tickerPrice[tickerPrice.length - 1 - i]
  )

  const earlierPrice = [...tickerPrice].slice(0, tickerPrice.length - highRange)

  const latestHigherInputRange = latestPrice.some(x =>
    earlierPrice.every(e => e < x)
  )

  const rs = calRelativeStrength(
    tickerPrice[tickerPrice.length - 1 - rsDays],
    tickerPrice[tickerPrice.length - 1],
    refPrice[refPrice.length - 1 - rsDays],
    refPrice[refPrice.length - 1],
    rsDays
  )

  return {
    rs,
    latestHigherInputRange
  }
}

const getPriceInfo = async (
  inputTickers,
  years,
  { tickers, yearlyPcnt, chartData }
) => {
  const newTickers =
    inputTickers?.filter(x => !tickers.includes(x?.toUpperCase())) || []
  const noOfYears = parseInt(years) + 1
  const newChartData = { datasets: [], ...chartData }

  const outputItem = await Promise.all(
    newTickers.map(async ticker => {
      const response = await toAxios('/api/yahoo/getHistoryYrlyPcnt', {
        ticker: ticker,
        year: noOfYears
      })
      const { data } = response
      return data
    })
  )

  const allData = outputItem.map(item => {
    const data = {
      annualized: getAnnualizedPcnt(item.data.map(item => item.price).slice(1))
        .fmt,
      total: getTotalPcnt(item),
      ...item
    }
    return data
  })

  const schema = allData.map(x => ({ ...x, data: [] }))
  const temp = [...Array(noOfYears)].reduce((acc, _cur, idx) => {
    const priceList = allData.map(x => x.data[idx])

    const isEveryNA = priceList.every(x => x.price === 'N/A')

    if (isEveryNA) {
      return acc
    }

    priceList.forEach((x, priceIdx) => {
      acc[priceIdx].data.push(x)
    })

    return acc
  }, schema)
  const headerYear = temp.find(x => x)?.data.map(t => t.year) || []

  const priceInfo = {
    tickers: [...tickers, ...temp.map(item => item.ticker)],
    tableHeader: [
      'Ticker',
      'End Price',
      'Start Price',
      'Annualized',
      'Total',
      ...headerYear
    ],
    yearlyPcnt: [
      ...yearlyPcnt,
      ...temp.map(item => {
        const newItem = [
          item.ticker,
          roundTo(item.endPrice),
          roundTo(item.startPrice),
          (item.annualized && { style: 'green-red', data: item.annualized }) ||
            'N/A',
          (item.total && { style: 'green-red', data: item.total }) || 'N/A',
          ...item.data.map(itemData => {
            return {
              style: 'green-red',
              data: itemData.price
            }
          })
        ]
        return newItem
      })
    ],
    chartData: {
      labels: [...headerYear].reverse(),
      datasets: [
        ...newChartData.datasets,
        ...temp.map(item => {
          const [r, g, b] = randRGBColor()

          const backgroundColor = `rgba(${r}, ${g}, ${b}, 0.4)`
          const borderColor = `rgba(${r}, ${g}, ${b}, 1)`

          const newItem = {
            ...chartDataSet,
            label: item.ticker,
            data: item.data
              .map(item => item.price)
              .map(item => {
                return convertFromPriceToNumber(item) * 100
              })
              .reverse(),
            backgroundColor,
            borderColor,
            pointBorderColor: borderColor,
            pointHoverBackgroundColor: borderColor
          }
          return newItem
        })
      ]
    }
  }

  return priceInfo
}

const handleSpecialTicker = ticker => {
  return ticker === 'BRK.B' ? 'BRK-B' : ticker
}

const showHighlightQuoteDetail = (router, inputQuery) => {
  inputQuery?.ticker &&
    router.push(
      {
        query: {
          ...router.query,
          ...inputQuery
        }
      },
      undefined,
      { shallow: true }
    )
}

export {
  getFormattedHistoryPrice,
  getRelativeStrengthByDays,
  getUserBoughtList,
  getUserBoughtListDetails,
  getPriceInfo,
  handleSpecialTicker,
  showHighlightQuoteDetail
}
