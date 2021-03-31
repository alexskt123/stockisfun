import axios from 'axios'
import JSSoup from 'jssoup'

import { decode } from 'html-entities'

async function getResponse(ticker) {
  const response = await axios(`https://etfdb.com/stock/${ticker}/`).catch(console.error)

  const resData = response?.data
  return resData
}

export const getETFListByTicker = async (ticker) => {

  const response = await getResponse(ticker)
  const soup = new JSSoup(response)
  const trs = soup.findAll('tr')

  const etfList = []
  trs.forEach(tr => {
    const tdTicker = tr.nextElement
    const tdInfo = tdTicker.findNextSiblings('td')

    if (tdTicker && tdInfo.length > 0) {
      const etfInfoLabel = [
        'name',
        'category',
        'expense',
        'weight'
      ]

      const etf = etfInfoLabel.reduce((acc, cur, idx) => {
        const newAcc = {
          ...acc,
          [cur]: tdInfo.map(x => decode(x.text))[idx]
        }
        return newAcc
      }, { 'ticker': tdTicker.text })

      etfList.push(etf)
    }
  })


  const h4 = soup.findAll('h4')

  const etfCount = h4.reduce((acc, item) => {
    if (item.text) {
      const reg = item.text.match(/Unlock all (.*) ETFs/)
      if (reg) {
        acc = reg[1]
      }
    }

    return acc
  }, 'N/A')

  return { etfCount, etfList }
}
