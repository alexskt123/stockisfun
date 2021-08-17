import { calPcnt } from '@/lib/commonFunction'
import { getAPIResponse } from '@/lib/request'
import { getYahooBasicsData } from '@/lib/stockInfo'
import { extractModulesData, getModulesData } from '@/lib/yahoo'

const getData = async args => {
  const { ticker, quoteData } = args

  const moduleNames = ['KeyStatistics', 'AssetProfile']
  const modulesData = await getModulesData([ticker], moduleNames)

  const [keyStat, data] = await Promise.all(
    moduleNames.map(x =>
      extractModulesData({ response: modulesData, ticker, moduleName: x })
    )
  )

  const basics = getYahooBasicsData(data, quoteData || {})

  const floatingShareRatio = keyStat?.floatShares
    ? calPcnt(keyStat.floatShares.raw, keyStat.sharesOutstanding.raw, 2, true)
    : 'N/A'

  return {
    ...basics.basics,
    'Floating Shares': floatingShareRatio
  }
}

export default async (req, res) => {
  const response = await getAPIResponse(req, getData)
  res.statusCode = 200
  res.json(response)
}
