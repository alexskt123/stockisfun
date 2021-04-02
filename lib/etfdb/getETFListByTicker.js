import axios from 'axios'
import JSSoup from 'jssoup'

import { decode } from 'html-entities'

async function getResponse(ticker) {
  const response = await axios(`https://etfdb.com/stock/${ticker}/`).catch(console.error)

  const resData = response?.data
  return resData
}

export const getETFListByTicker = async (ticker) => {

  const etfInfoLabel = [
    'name',
    'category',
    'expense',
    'weight'
  ]

  const response = await getResponse(ticker)
  const soup = new JSSoup(response)
  const trs = soup.findAll('tr')

  const etfList = trs.reduce((acc, tr) => {
    const tdTicker = tr.nextElement
    const tdInfo = tdTicker.findNextSiblings('td')

    const newAcc = tdTicker && tdInfo.length > 0 ? [
      ...acc,
      etfInfoLabel.reduce((acc, cur, idx) => {
        const newAcc = {
          ...acc,
          [cur]: tdInfo.map(x => decode(x.text))[idx]
        }
        return newAcc
      }, { 'ticker': tdTicker.text })
    ] : acc

    return newAcc
  }, [])

  const h4 = soup.findAll('h4')
  const etfCount = h4.filter(x => x.text && x.text.match(/Unlock all (.*) ETFs/)).reduce((acc, item) => {
    const newAcc = item ? item[1] : acc
    return newAcc
  }, 'N/A')

  return { etfCount, etfList }
}
