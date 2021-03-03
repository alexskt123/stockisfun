
import { getYahooHistoryPrice } from '../../lib/yahoo/getYahooHistoryPrice'
import moment from 'moment-business-days'
import { ma } from 'moving-averages'
import QuickChart from 'quickchart-js'
import { getFormattedFromToDate } from '../../lib/commonFunction'


const handleDays = async (ticker, fromdate, todate) => {

  const outputItem = await getYahooHistoryPrice(ticker, fromdate, todate)

  return {
    date: (outputItem.timestamp || []).map(item => moment.unix(item).format('DD MMM YYYY')),
    price: outputItem.indicators.quote.find(x => x).close || []
  }
}

const getImgUrl = async (ticker, dateprice, ma5, ma20, ma60) => {
  const newChart = new QuickChart()

  newChart.setConfig(
    {
      type: 'line',
      data: {
        'labels': [...dateprice.date.reverse().slice(60)],
        'datasets': [{
          label: ticker,
          data: [...dateprice.price.slice(60)],
          fill: false,
          backgroundColor: 'rgba(30,230,230,0.2)',
          borderColor: 'rgba(30,230,230,1)',
          showLine: false
        }, {
          label: '5-MA',
          data: [...ma5.slice(60)],
          fill: false,
          backgroundColor: 'rgba(200,12,12,0.2)',
          borderColor: 'rgba(200,12,12,1)',
          pointRadius: 0
        }, {
          label: '20-MA',
          data: [...ma20.slice(60)],
          fill: false,
          backgroundColor: 'rgba(220,220,20,0.2)',
          borderColor: 'rgba(220,220,20,1)',
          pointRadius: 0
        }, {
          label: '60-MA',
          data: [...ma60.slice(60)],
          fill: false,
          backgroundColor: 'rgba(75,50,10,0.2)',
          borderColor: 'rgba(75,50,10,1)',
          pointRadius: 0
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: false
            }
          }]
        }
      }
    })
    .setWidth(400)
    .setHeight(200)
    .setBackgroundColor('transparent')

  return newChart.getUrl()
}

const chkLower = async (trackArr, refArr) => {
  if (trackArr[trackArr.length - 1] >= refArr[refArr.length - 1]
        && trackArr.find(x => x) < refArr.find(x => x)) {
    return true
  } else return false
}

const chkHigher = async (trackArr, refArr) => {
  if (trackArr[trackArr.length - 1] <= refArr[refArr.length - 1]
        && trackArr.find(x => x) > refArr.find(x => x)) {
    return true
  } else return false
}

export default async (req, res) => {

  const { ticker, genChart } = req.query
  const isGenChart = genChart == 'true'

  const fromtodate = await getFormattedFromToDate(80)
  const dateprice = await handleDays(ticker, fromtodate.formattedFromDate, fromtodate.formattedToDate)

  const fiveLowerTwenty = []
  const fiveLowerTwentyChart = []
  const fiveHigherTwenty = []
  const fiveHigherTwentyChart = []

  const fiveLowerSixty = []
  const fiveLowerSixtyChart = []
  const fiveHigherSixty = []
  const fiveHigherSixtyChart = []

  const twentyLowerSixty = []
  const twentyLowerSixtyChart = []
  const twentyHigherSixty = []
  const twentyHigherSixtyChart = []

  const asOfDate = dateprice.date.reverse().find(x => x)

  const ma5 = ma([...dateprice.price], 5)
  const ma20 = ma([...dateprice.price], 20)
  const ma60 = ma([...dateprice.price], 60)

  const ma5filter = [...ma5].reverse().slice(0, 2)
  const ma20filter = [...ma20].reverse().slice(0, 2)
  const ma60filter = [...ma60].reverse().slice(0, 2)

  if (ma5filter.length == 2 && ma20filter.length == 2 && ma60filter.length == 2) {
    if (await chkLower(ma5filter, ma20filter)) {
      fiveLowerTwenty.push(ticker)
      if (isGenChart) fiveLowerTwentyChart.push(await getImgUrl(ticker, dateprice, ma5, ma20, ma60))
    }

    if (await chkHigher(ma5filter, ma20filter)) {
      fiveHigherTwenty.push(ticker)
      if (isGenChart) fiveHigherTwentyChart.push(await getImgUrl(ticker, dateprice, ma5, ma20, ma60))
    }

    if (await chkLower(ma5filter, ma60filter)) {
      fiveLowerSixty.push(ticker)
      if (isGenChart) fiveLowerSixtyChart.push(await getImgUrl(ticker, dateprice, ma5, ma20, ma60))
    }

    if (await chkHigher(ma5filter, ma60filter)) {
      fiveHigherSixty.push(ticker)
      if (isGenChart) fiveHigherSixtyChart.push(await getImgUrl(ticker, dateprice, ma5, ma20, ma60))
    }

    if (await chkLower(ma20filter, ma60filter)) {
      twentyLowerSixty.push(ticker)
      if (isGenChart) twentyLowerSixtyChart.push(await getImgUrl(ticker, dateprice, ma5, ma20, ma60))
    }

    if (await chkHigher(ma20filter, ma60filter)) {
      twentyHigherSixty.push(ticker)
      if (isGenChart) twentyHigherSixtyChart.push(await getImgUrl(ticker, dateprice, ma5, ma20, ma60))
    }
  }

  res.statusCode = 200
  res.json({
    asOfDate,
    fiveLowerTwenty,
    fiveLowerTwentyChart,
    fiveHigherTwenty,
    fiveHigherTwentyChart,
    fiveLowerSixty,
    fiveLowerSixtyChart,
    fiveHigherSixty,
    fiveHigherSixtyChart,
    twentyLowerSixty,
    twentyLowerSixtyChart,
    twentyHigherSixty,
    twentyHigherSixtyChart
  })
}
