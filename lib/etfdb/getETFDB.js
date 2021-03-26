import axios from 'axios'
import JSSoup from 'jssoup'
import { selectedHeadersArr } from '../../config/etf'
import { decode } from 'html-entities'
import Quote from '../quote'

const handleProfile = (soup) => {

  const spans = soup.findAll('span')
  const basicInfo = spans.reduce((acc, cur) => {

    const info = selectedHeadersArr.includes(cur.text) ? {
      [cur.text]: decode(cur.nextSibling.text)
    } : {}
    const price = cur.attrs.id && cur.attrs.id == 'stock_price_value' ? {
      'Price': decode(cur.text).replace(/\n/gi, '')
    } : {}

    const newAcc = {
      ...acc,
      ...info,
      ...price
    }

    return newAcc
  }, {})

  const divs = soup.findAll('div')
  basicInfo['Analyst Report'] = (divs.find(x => x.attrs.id === 'analyst-report') || {})?.nextElement?.nextElement?.nextElement?.text

  return basicInfo
}

//TO-DO fix this
const handleHoldings = (soup) => {

  const tds = soup.findAll('td')

  const etfHolding = []
  let holding = []
  tds.forEach((td, index) => {

    if (td.attrs['data-th'] && td.attrs['data-th'].match(/Symbol|Holding|% Assets/)) {
      holding.push(td.text)
      if (index != 0 && ((index + 1) % 3 == 2)) {
        etfHolding.push(holding)
        holding = []
      }
    }
  })

  const otherPcnt = etfHolding.reduce((acc, cur) => {
    acc = acc - parseFloat(cur[2].replace(/%| /gi, ''))
    return acc
  }, 100)

  otherPcnt === 100 ? null : etfHolding.push(['Others', 'Others', `${otherPcnt.toFixed(2)}%`])

  return etfHolding
}

export const getETFDB = async (ticker) => {

  const quote = new Quote(ticker)
  await quote.request()
  const validTicker = quote.valid

  const etfRespnose = !validTicker ? null : await axios.get(`https://etfdb.com/etf/${ticker}`).catch(error => console.log(error))
  const { data: etfData } = etfRespnose || { data: '' }
  const soup = new JSSoup(etfData)

  const profile = handleProfile(soup)
  const holding = handleHoldings(soup)

  return {
    basicInfo: { ...profile },
    holdingInfo: [...holding]
  }
}
