import ETFDb from '@/lib/etfdb'

export const getETFListByTicker = async ticker => {
  const etfDb = new ETFDb(ticker, 'etf')
  await etfDb.request()

  return { etfCount: etfDb.stockETFCount, etfList: etfDb.stockETFList }
}
