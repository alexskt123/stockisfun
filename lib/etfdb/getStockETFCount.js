import ETFDb from '@/lib/etfdb'

export const getStockETFCount = async ticker => {
  const etfDb = new ETFDb(ticker, 'stock')
  await etfDb.request()
  return etfDb.stockETFCount
}
