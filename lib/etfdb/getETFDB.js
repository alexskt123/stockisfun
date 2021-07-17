import ETFDb from '@/lib/class/etfdb'
import Quote from '@/lib/class/quote'

const getETFDbData = async ticker => {
  const etfDb = new ETFDb(ticker, 'etf')
  await etfDb.request()
  const profile = etfDb.ETFProfile
  const holding = etfDb.ETFHoldings
  const noOfHoldings = etfDb.ETFStockCount
  return {
    basicInfo: { ...profile },
    holdingInfo: [...holding],
    noOfHoldings
  }
}

export const getETFDB = async ticker => {
  const quote = new Quote(ticker)
  await quote.request()
  const data =
    quote.valid && quote.isETF
      ? await getETFDbData(ticker)
      : {
          basicInfo: {},
          holdingInfo: [],
          noOfHoldings: 'N/A'
        }

  return data
}
