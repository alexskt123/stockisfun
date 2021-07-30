import { priceMAList } from '@/config/email'
import {
  priceChartSettings,
  ma5ChartSettings,
  ma20ChartSettings,
  ma60ChartSettings,
  maChkRange,
  priceMADetailsSettings
} from '@/config/price'
import { getHostForETFDb, cloneObj } from '@/lib/commonFunction'
import { getFormattedFromToDate, millify } from '@/lib/commonFunction'
import { getTemplate } from '@/lib/pug'
import { getAssetProfile } from '@/lib/yahoo/getAssetProfile'
import { getEarningsDate } from '@/lib/yahoo/getEarningsDate'
import { getHistoryPrice } from '@/lib/yahoo/getHistoryPrice'
import { getQuote } from '@/lib/yahoo/getQuote'
import moment from 'moment-business-days'
import { ma } from 'moving-averages'
import QuickChart from 'quickchart-js'

const handleDays = async (ticker, fromDate, toDate) => {
  const outputItem = await getHistoryPrice(ticker, fromDate, toDate)

  return {
    date: (outputItem.timestamp || []).map(item =>
      moment.unix(item).format('DD MMM YYYY')
    ),
    price: outputItem.indicators.quote.find(x => x).close || []
  }
}

const handleQuote = async ticker => {
  const quoteArr = await getQuote(ticker)
  const quote = quoteArr.find(x => x) || {}
  const assetProfile = await getAssetProfile(ticker)

  return {
    Name: quote.longName,
    Price: quote.regularMarketPrice,
    MarketCap: millify(quote.marketCap),
    Industry: assetProfile.industry
  }
}

const getImgUrl = async (ticker, datePrice, ma5, ma20, ma60) => {
  const newChart = new QuickChart()

  newChart
    .setConfig({
      type: 'line',
      data: {
        labels: [...datePrice.date.reverse().slice(60)],
        datasets: [
          {
            ...priceChartSettings,
            label: ticker,
            data: [...datePrice.price.slice(60)]
          },
          {
            ...ma5ChartSettings,
            label: '5-MA',
            data: [...ma5.slice(60)]
          },
          {
            ...ma20ChartSettings,
            label: '20-MA',
            data: [...ma20.slice(60)]
          },
          {
            ...ma60ChartSettings,
            label: '60-MA',
            data: [...ma60.slice(60)]
          }
        ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: false
          }
        }
      }
    })
    .setWidth(400)
    .setHeight(200)
    .setBackgroundColor('transparent')

  return newChart.getUrl()
}

const chkLower = (trackArr, refArr) => {
  return (
    trackArr[trackArr.length - 1] >= refArr[refArr.length - 1] &&
    trackArr.find(x => x) < refArr.find(x => x)
  )
}

const chkHigher = (trackArr, refArr) => {
  return (
    trackArr[trackArr.length - 1] <= refArr[refArr.length - 1] &&
    trackArr.find(x => x) > refArr.find(x => x)
  )
}

const reducePairs = inputArr => {
  return [...Array(inputArr.length - 1)].map((_item, idx) => {
    return [inputArr[idx], inputArr[idx + 1]]
  })
}

const compareLowHigh = (trackArr, refArr, chkLowOrHigh) => {
  const trackPairs = reducePairs(trackArr)
  const refPairs = reducePairs(refArr)

  return trackPairs.some((item, idx) => {
    return chkLowOrHigh(item, refPairs[idx])
  })
}

const getPriceMADetails = async ({ ticker, genChart }) => {
  const isGenChart = genChart === 'true'

  const fromToDate = await getFormattedFromToDate(80, true)
  const datePrice = await handleDays(
    ticker,
    fromToDate.formattedFromDate,
    fromToDate.formattedToDate
  )

  const asOfDate = datePrice.date.reverse().find(x => x)
  const ma5 = ma([...datePrice.price], 5)
  const ma20 = ma([...datePrice.price], 20)
  const ma60 = ma([...datePrice.price], 60)
  const ma5filter = [...ma5].reverse().slice(0, maChkRange)
  const ma20filter = [...ma20].reverse().slice(0, maChkRange)
  const ma60filter = [...ma60].reverse().slice(0, maChkRange)

  const newPriceMAList = !(
    ma5filter.length >= 2 &&
    ma20filter.length >= 2 &&
    ma60filter.length >= 2
  )
    ? [...priceMAList]
    : await Promise.all(
        [...priceMAList].map(async item => {
          const matches =
            item.id === '5<20'
              ? compareLowHigh(ma5filter, ma20filter, chkLower)
              : item.id === '5>20'
              ? compareLowHigh(ma5filter, ma20filter, chkHigher)
              : item.id === '5<60'
              ? compareLowHigh(ma5filter, ma60filter, chkLower)
              : item.id === '5>60'
              ? compareLowHigh(ma5filter, ma60filter, chkHigher)
              : item.id === '20<60'
              ? compareLowHigh(ma20filter, ma60filter, chkLower)
              : item.id === '20>60'
              ? compareLowHigh(ma20filter, ma60filter, chkHigher)
              : false

          const newItem = { ...item, tickersInfo: [], tickersChart: [] }
          if (matches) {
            const quote = await handleQuote(ticker)
            const tickersInfo = {
              Symbol: ticker.toUpperCase(),
              ...quote
            }

            newItem.tickersInfo = [tickersInfo]

            if (isGenChart) {
              const imgUrl = await getImgUrl(ticker, datePrice, ma5, ma20, ma60)
              newItem.tickersChart = [imgUrl]
            }
          }
          return newItem
        })
      )

  return {
    ticker,
    asOfDate,
    priceMAList: [...newPriceMAList]
  }
}

const getHTMLTemplate = async (inputList, name, subject, to, category) => {
  const contents = await categoryTemplateMap
    .find(x => x.category === category)
    .templateContents({
      tickerArr: inputList.map(item => item?.ticker || item),
      genChart: false,
      name
    })

  return {
    from: process.env.EMAIL,
    bcc: to,
    subject,
    ...contents
  }
}

const getEarningsHTMLTemplate = async ({ tickerArr, genChart, name }) => {
  const dataArr = await Promise.all(
    [...tickerArr].map(async item => {
      const resData = await getEarningsDate(item)

      const data = resData || {}
      return { ...data, ticker: item }
    })
  )

  const today = moment()

  const earningsDateList = dataArr
    .filter(x => x.fmt !== 'N/A')
    .map(x => ({ ...x, days: moment(x.fmt).diff(today, 'days') }))
    .sort((a, b) => b.days - a.days)
  // .filter(x => x.days > 0 && x.days <= 5)

  const earningsDateDetails = {
    asOfDate: today.format('YYYY-MM-DD'),
    earningsDateList
  }
  const html = await getTemplate('earningsDate.pug', {
    name,
    earningsDateDetails,
    tickerUrlItems: tickerArr,
    href: `${getHostForETFDb()}/calendar`,
    genChart
  })

  const mailOptions = {
    subject: `Earnings Date - As of ${earningsDateDetails.asOfDate}`,
    html
  }

  return mailOptions
}

const getPriceMAHTMLTemplate = async ({ tickerArr, genChart, name }) => {
  const priceMADetails = cloneObj(priceMADetailsSettings)

  const responses = await Promise.all(
    tickerArr.map(async ticker => {
      return await getPriceMADetails({ ticker, genChart })
    })
  ).catch(error => console.error(error))

  const responsesArr = responses || []
  responsesArr
    .filter(x => x)
    .forEach(item => {
      priceMADetails.asOfDate =
        priceMADetails.asOfDate === '' ? item.asOfDate : priceMADetails.asOfDate
      priceMADetails.priceMAList.forEach(cur => {
        const priceMA = item.priceMAList.find(x => x.id === cur.id)
        cur.tickersInfo.push(...priceMA.tickersInfo)
        cur.tickersChart.push(...priceMA.tickersChart)
      })
    })

  const html = await getTemplate('priceMA.pug', {
    name,
    priceMADetails,
    tickerUrlItems: tickerArr,
    href: `${getHostForETFDb()}/stockdetail?query=`,
    genChart: false
  })

  const mailOptions = {
    subject: `Moving Average Highlight - As of ${priceMADetails.asOfDate}`,
    html
  }

  return mailOptions
}

const categoryTemplateMap = [
  { category: 'priceMA', templateContents: getPriceMAHTMLTemplate },
  { category: 'earningsDate', templateContents: getEarningsHTMLTemplate }
]

export { getPriceMADetails, getPriceMAHTMLTemplate, getHTMLTemplate }
