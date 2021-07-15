import ETFDb from '@/lib/etfdb'
import { decode } from 'html-entities'
import JSSoup from 'jssoup'

export const getETFListByTicker = async ticker => {
  const etfInfoLabel = ['name', 'category', 'expense', 'weight']

  const etfDb = new ETFDb(ticker, 'etf')
  await etfDb.request()
  const response = etfDb.etfDbResponse
  const soup = new JSSoup(response)
  const trs = soup.findAll('tr')

  const etfList = trs.reduce((acc, tr) => {
    const tdTicker = tr.nextElement
    const tdInfo = tdTicker.findNextSiblings('td')

    const newAcc =
      tdTicker && tdInfo?.length > 0
        ? [
            ...acc,
            etfInfoLabel.reduce(
              (acc, cur, idx) => {
                const newAcc = {
                  ...acc,
                  [cur]: tdInfo.map(x => decode(x.text))[idx]
                }
                return newAcc
              },
              { ticker: tdTicker.text }
            )
          ]
        : acc

    return newAcc
  }, [])

  const h4 = soup.findAll('h4')
  const etfCount = h4
    .filter(item => item.text)
    .reduce((acc, item) => {
      const reg = item.text.match(/Unlock all (.*) ETFs/)
      const newAcc = reg ? reg[1] : acc

      return newAcc
    }, 'N/A')

  return { etfCount, etfList }
}
