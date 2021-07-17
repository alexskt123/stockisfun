import ETFDb from '@/lib/class/etfdb'

export const getETFListByTicker = async ticker => {
  const etfDb = new ETFDb(ticker, 'etf')
  await etfDb.request()

  return { etfCount: etfDb.stockETFCount, etfList: etfDb.stockETFList }
}
