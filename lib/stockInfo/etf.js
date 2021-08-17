import {
  etfHoldingHeader,
  etfDetailsBasicSettings,
  etfDetailsHoldingSettings
} from '@/config/etf'
import { getPieChartData, randChartColors } from '@/lib/chart'
import { toAxios } from '@/lib/request'

const getETFDetailHoldings = async inputTicker => {
  const dataSchema = { ...etfDetailsHoldingSettings }

  if (!inputTicker) return dataSchema

  const etf = await toAxios('/api/etfdb/getETFDB', { ticker: inputTicker })
  const holdingInfoData = [...etf.data.holdingInfo]

  const responses = await Promise.all(
    [...holdingInfoData].map(item =>
      toAxios('/api/yahoo/getHistoryYrlyPcnt', {
        ticker: item.find(x => x),
        year: 3
      })
    )
  ).catch(error => console.error(error))

  const holdingInfo = [...holdingInfoData].map((item, index) => {
    return item.concat(
      (responses.filter(x => x) || [])[index]?.data?.data.map(item => {
        return {
          style: 'green-red',
          data: item.price
        }
      })
    )
  })

  const colors = randChartColors(holdingInfo)
  const pieData = getPieChartData({
    colors,
    label: '# of Holdings',
    data: [...holdingInfo.map(item => parseFloat(item[2].replace(/%/gi, '')))],
    dataLabels: [...holdingInfo.map(item => item.find(x => x))]
  })

  const href = holdingInfo
    .filter(x => x.find(x => x).length > 0 && x.find(x => x) !== 'Others')
    .reduce((acc, cur) => {
      return `${acc},${cur.find(x => x)}`
    }, '')
    .replace(/(^,)|(,$)/g, '')

  const newSettings = {
    tableHeader: [...etfHoldingHeader],
    tableData: [...holdingInfo],
    noOfHoldings: etf?.data?.noOfHoldings,
    pieData: pieData,
    selectedStockTicker: '',
    priceHref: `/compare/price?tickers=${href}`,
    forecastHref: `/compare/forecast?tickers=${href}`,
    watchlistHref: `/watchlist?tickers=${href}`
  }

  return newSettings
}

const getETFDetailBasics = async inputTicker => {
  const dataSchema = { ...etfDetailsBasicSettings }

  if (!inputTicker) return dataSchema

  const etf = await toAxios('/api/etfdb/getETFDB', { ticker: inputTicker })
  const etfData = {
    ...etf.data.basicInfo
  }
  return {
    ...dataSchema,
    tableData: Object.keys(etfData).map((item, idx) => [
      item,
      Object.values(etfData)[idx]
    ])
  }
}

export { getETFDetailBasics, getETFDetailHoldings }
