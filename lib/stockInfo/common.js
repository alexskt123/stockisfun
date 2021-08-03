import { chartDataSet, dateRangeByNoOfYears } from '@/config/price'
import {
  calPcnt,
  convertFromPriceToNumber,
  randRGBColor,
  roundTo,
  getAnnualizedPcnt
} from '@/lib/commonFunction'
import { toAxios } from '@/lib/request'

const getUserBoughtList = async userData => {
  const { boughtList, cash } = userData || { boughtList: [], cash: 0 }
  const boughtTickers = boughtList.map(x => x.ticker)
  const response = await toAxios('/api/yahoo/getQuote', {
    ticker: boughtTickers.join(',')
  })
  const { data: quotes } = response || { data: [] }
  const boughtListWithInfo = boughtList.map(boughtListItem => {
    const quote = quotes.find(x => x.symbol === boughtListItem.ticker)
    const net = quote?.regularMarketChange * boughtListItem.total
    const sum = quote?.regularMarketPrice * boughtListItem.total
    const prevSum = quote?.regularMarketPreviousClose * boughtListItem.total
    const type = quote?.quoteType
    return {
      ...boughtListItem,
      name: quote?.shortName,
      net,
      sum,
      prevSum,
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

const getPriceInfo = async (
  inputTickers,
  noOfYears,
  { tickers, yearlyPcnt, chartData }
) => {
  const newTickers = inputTickers.filter(
    x => !tickers.includes(x?.toUpperCase())
  )
  const newDateRange = dateRangeByNoOfYears(noOfYears)
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

  const temp = outputItem.map(item => {
    const newTemp = {
      annualized: getAnnualizedPcnt(item.data.map(item => item.price).slice(1))
        .fmt,
      total: getTotalPcnt(item),
      ...item
    }
    return newTemp
  })

  const priceInfo = {
    tickers: [...tickers, ...temp.map(item => item.ticker)],
    tableHeader: [
      'Ticker',
      'End Price',
      'Start Price',
      'Annualized',
      'Total',
      ...newDateRange.map(ii => ii.fromDate.substring(0, 4))
    ],
    yearlyPcnt: [
      ...yearlyPcnt,
      ...temp.map(item => {
        const newItem = [
          item.ticker,
          roundTo(item.endPrice),
          roundTo(item.startPrice),
          item.annualized
            ? { style: 'green-red', data: item.annualized }
            : 'N/A',
          item.total ? { style: 'green-red', data: item.total } : 'N/A',
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
      labels: [
        ...newDateRange.map(item => item.fromDate.substring(0, 4))
      ].reverse(),
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
  getUserBoughtList,
  getUserBoughtListDetails,
  getPriceInfo,
  handleSpecialTicker,
  showHighlightQuoteDetail
}
