import moment from 'moment-business-days'
import { ma } from 'moving-averages'
import QuickChart from 'quickchart-js'

import { priceMAList } from '@/config/email'
import {
  priceChartSettings,
  maChkRange,
  priceMADetailsSettings,
  maChartSettings,
  maChartSchema
} from '@/config/price'
import { getHostForETFDb, cloneObj } from '@/lib/commonFunction'
import { getFormattedFromToDate, millify } from '@/lib/commonFunction'
import { getTemplate } from '@/lib/pug'
import { getFormattedHistoryPrice } from '@/lib/stockInfo'
import { getAssetProfile } from '@/lib/yahoo/getAssetProfile'
import { getEarningsDate } from '@/lib/yahoo/getEarningsDate'
import { getQuote } from '@/lib/yahoo/getQuote'

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

const getImgUrl = (ticker, datePrice, mas) => {
  const newChart = new QuickChart()

  const maCharts = maChartSettings.map((ma, idx) => {
    return {
      ...maChartSchema,
      ...ma,
      data: mas[idx]
    }
  })

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
          ...maCharts
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
    // Just check lower, no need to track + => -
    // trackArr[trackArr.length - 1] >= refArr[refArr.length - 1] &&
    trackArr.find(x => x) < refArr.find(x => x)
  )
}

const chkHigher = (trackArr, refArr) => {
  return (
    // Just check higher, no need to track - => +
    // trackArr[trackArr.length - 1] <= refArr[refArr.length - 1] &&
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

  const fromToDate = getFormattedFromToDate(170, true)
  const datePrice = await getFormattedHistoryPrice(
    ticker,
    fromToDate.formattedFromDate,
    fromToDate.formattedToDate
  )

  const asOfDate = datePrice.date.reverse().find(x => x)
  const mas = maChartSettings.map(item => {
    return ma([...datePrice.price], item.value).slice(150)
  })
  const mafilters = [...mas].map(ma => ma.reverse().slice(0, maChkRange))

  const [ma5filter, ma20filter, ma60filter] = mafilters

  const newPriceMAList = !mafilters.every(ma => ma.length >= 2)
    ? [...priceMAList]
    : await Promise.all(
        [...priceMAList].map(async item => {
          const matches =
            item.id === '20<50'
              ? compareLowHigh(ma5filter, ma20filter, chkLower)
              : item.id === '20>50'
              ? compareLowHigh(ma5filter, ma20filter, chkHigher)
              : item.id === '20<150'
              ? compareLowHigh(ma5filter, ma60filter, chkLower)
              : item.id === '20>150'
              ? compareLowHigh(ma5filter, ma60filter, chkHigher)
              : item.id === '50<150'
              ? compareLowHigh(ma20filter, ma60filter, chkLower)
              : item.id === '50>150'
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
              const imgUrl = await getImgUrl(ticker, datePrice, mas)
              newItem.tickersChart = [imgUrl]
            }
          }
          return newItem
        })
      )

  return {
    ticker,
    asOfDate,
    priceAvail: datePrice.date.length >= 140,
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
    .sort((a, b) => a.days - b.days)

  const upComingList = earningsDateList.filter(x => x.days > 0 && x.days <= 5)

  const earningsDateDetails = {
    asOfDate: today.format('YYYY-MM-DD'),
    earningsDateList,
    upComingList
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
    tickerArr.map(ticker => getPriceMADetails({ ticker, genChart }))
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
    href: `${getHostForETFDb()}/stockinfo?type=quote&ticker=`,
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
