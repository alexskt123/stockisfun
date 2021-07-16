import ETFDb from '@/lib/class/etfdb'

export const getETFPerformance = async ticker => {
  const etfDb = new ETFDb(ticker, 'etf')
  await etfDb.request()
  return etfDb.ETFPerformance
}
