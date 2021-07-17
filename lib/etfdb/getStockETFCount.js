import ETFDb from '@/lib/class/etfdb'

export const getStockETFCount = async ticker => {
  const etfDb = new ETFDb(ticker, 'stock')
  await etfDb.request()
  return etfDb.stockETFCount
}
