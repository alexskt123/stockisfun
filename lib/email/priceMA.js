import { priceMAList } from '@/config/email'
import {
  priceChartSettings,
  ma5ChartSettings,
  ma20ChartSettings,
  ma60ChartSettings,
  maChkRange
} from '@/config/price'
import { getHostForETFDb } from '@/lib/commonFunction'
import { getFormattedFromToDate, millify } from '@/lib/commonFunction'
import { getAssetProfile } from '@/lib/yahoo/getAssetProfile'
import { getHistoryPrice } from '@/lib/yahoo/getHistoryPrice'
import { getQuote } from '@/lib/yahoo/getQuote'
import moment from 'moment-business-days'
import { ma } from 'moving-averages'
import QuickChart from 'quickchart-js'

const getUrlItem = item => {
  return `<u><a href="${getHostForETFDb()}/stockdetail?query=${item}">${item}</a></u>`
}

const handleDays = async (ticker, fromdate, todate) => {
  const outputItem = await getHistoryPrice(ticker, fromdate, todate)

  return {
    date: (outputItem.timestamp || []).map(item =>
      moment.unix(item).format('DD MMM YYYY')
    ),
    price: outputItem.indicators.quote.find(x => x).close || []
  }
}

const handleQuote = async ticker => {
  const quote = await getQuote(ticker)
  const assetProfile = await getAssetProfile(ticker)

  return {
    Name: quote.longName,
    Price: quote.regularMarketPrice,
    MarketCap: millify(quote.marketCap),
    Industry: assetProfile.industry
  }
}

const getImgUrl = async (ticker, dateprice, ma5, ma20, ma60) => {
  const newChart = new QuickChart()

  newChart
    .setConfig({
      type: 'line',
      data: {
        labels: [...dateprice.date.reverse().slice(60)],
        datasets: [
          {
            ...priceChartSettings,
            label: ticker,
            data: [...dateprice.price.slice(60)]
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
  return trackArr[trackArr.length - 1] >= refArr[refArr.length - 1] &&
    trackArr.find(x => x) < refArr.find(x => x)
    ? true
    : false
}

const chkHigher = (trackArr, refArr) => {
  return trackArr[trackArr.length - 1] <= refArr[refArr.length - 1] &&
    trackArr.find(x => x) > refArr.find(x => x)
    ? true
    : false
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

export const getPriceMADetails = async ({ ticker, genChart }) => {
  const isGenChart = genChart === 'true'

  const fromtodate = await getFormattedFromToDate(80, true)
  const dateprice = await handleDays(
    ticker,
    fromtodate.formattedFromDate,
    fromtodate.formattedToDate
  )

  const asOfDate = dateprice.date.reverse().find(x => x)
  const ma5 = ma([...dateprice.price], 5)
  const ma20 = ma([...dateprice.price], 20)
  const ma60 = ma([...dateprice.price], 60)
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
              const imgUrl = await getImgUrl(ticker, dateprice, ma5, ma20, ma60)
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

export const getPriceMAHTMLTemplate = async ({ tickerArr, genChart, name }) => {
  // no idea why cannot use spread priceMAlist here
  const priceMADetails = {
    asOfDate: '',
    priceMAList: [
      {
        id: '5<20',
        name: '5-MA lower than 20-MA',
        tickersInfo: [],
        tickersChart: []
      },
      {
        id: '5>20',
        name: '5-MA higher than 20-MA',
        tickersInfo: [],
        tickersChart: []
      },
      {
        id: '5<60',
        name: '5-MA lower than 60-MA',
        tickersInfo: [],
        tickersChart: []
      },
      {
        id: '5>60',
        name: '5-MA higher than 60-MA',
        tickersInfo: [],
        tickersChart: []
      },
      {
        id: '20<60',
        name: '20-MA lower than 60-MA',
        tickersInfo: [],
        tickersChart: []
      },
      {
        id: '20>60',
        name: '20-MA higher than 60-MA',
        tickersInfo: [],
        tickersChart: []
      }
    ]
  }

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

  const mailOptions = {
    subject: `Moving Average Highlight - As of ${priceMADetails.asOfDate}`,
    html: `
          <p>
              <h5>${name}</h5>
          </p>        
          <p>
              <b>As of ${priceMADetails.asOfDate}:</b>
          </p>
          ${priceMADetails.priceMAList
            .map(priceMA => {
              return `<hr>
                <p>
                    <b>${priceMA.name}</b>
                    <ol>
                      ${priceMA.tickersInfo
                        .map((cur, idx) => {
                          const imgElement = genChart
                            ? `<img src=${priceMA.tickersChart[idx]}/>`
                            : ''
                          return `<li>
                            <p>Symbol: ${getUrlItem(cur.Symbol)}</p>
                            <p>Name: ${cur.Name}</p><p>Market Price: ${
                            cur.Price
                          }</p>
                            <p>Market Cap.: ${cur.MarketCap}</p>
                            <p>Industry: ${cur.Industry}</p>
                            <p>${imgElement}</p>
                          </li>`
                        })
                        .join('')}
                    </ol>
                </p>
                `
            })
            .join('')}
          <hr>       
          <p>
              <b>Grabbing Ticker List:</b>
              <ol>
                  ${tickerArr
                    .map(item => `<li>${getUrlItem(item)}</li>`)
                    .join('')}
              </ol>
          </p>
          `
  }

  return mailOptions
}
