import ETFDb from '@/lib/etfdb'
import JSSoup from 'jssoup'

export const getStockETFCount = async ticker => {
  const etfDb = new ETFDb(ticker, 'stock')
  await etfDb.request()
  const response = etfDb.etfDbResponse
  const soup = new JSSoup(response)
  const h4 = soup.findAll('h4')

  const etfInfo = h4
    .filter(x => x?.text)
    .reduce((acc, item) => {
      const reg = item.text.match(/Unlock all (.*) ETFs/)
      const newAcc = reg ? reg[1] : acc

      return newAcc
    }, 'N/A')

  return etfInfo
}
