import axios from 'axios'
import { decode } from 'html-entities'
import JSSoup from 'jssoup'

import { selectedHeadersArr } from '../../config/etf'
import { convertToPercentage, trim } from '../commonFunction'
import Quote from '../quote'

const handleProfile = soup => {
  const spans = soup.findAll('span')
  const basicInfo = spans.reduce((acc, cur) => {
    const info = selectedHeadersArr.includes(cur.text)
      ? {
          [cur.text]: decode(cur.nextSibling.text)
        }
      : {}
    const price =
      cur?.attrs?.id === 'stock_price_value'
        ? {
            Price: decode(cur.text).replace(/\n/gi, '')
          }
        : {}

    const newAcc = {
      ...acc,
      ...info,
      ...price
    }

    return newAcc
  }, {})

  const divs = soup.findAll('div')
  basicInfo['Analyst Report'] = (
    divs.find(x => x.attrs.id === 'analyst-report') || {}
  )?.nextElement?.nextElement?.nextElement?.text

  return basicInfo
}

//TO-DO fix this
const handleHoldings = soup => {
  const tds = soup.findAll('td')

  const etfInfo = tds
    .filter(
      x =>
        x.attrs['data-th'] &&
        x.attrs['data-th'].match(/Symbol|Holding|% Assets/)
    )
    .map(item => item.text)

  const etfArr = Array.from({ length: etfInfo.length / 3 }, _x => [])

  const etfHolding = etfArr.map((_item, idx) => {
    return etfInfo.slice(idx * 3, idx * 3 + 3)
  })

  const otherPcnt = etfHolding.reduce((acc, cur) => {
    acc = acc - parseFloat(cur[2].replace(/%| /gi, ''))
    return acc
  }, 100)

  otherPcnt === 100
    ? null
    : etfHolding.push([
        'Others',
        'Others',
        convertToPercentage(otherPcnt / 100)
      ])

  return etfHolding
}

const handleNoOfHoldings = soup => {
  const divs = soup.findAll('div', 'relative-metric-header-thumb')

  const noOfHoldings = divs.reduce((acc, item) => {
    const newAcc =
      item.text && trim(item.text) === 'Number of Holdings'
        ? item.findPreviousSibling('div').nextElement.nextElement.text
        : null
    return newAcc ? newAcc : acc
  }, 'N/A')

  return noOfHoldings
}

export const getETFDB = async ticker => {
  const quote = new Quote(ticker)
  await quote.request()
  const validTicker = quote.valid

  const etfRespnose = !validTicker
    ? null
    : await axios
        .get(`https://etfdb.com/etf/${ticker}`)
        .catch(error => console.error(error))
  const { data: etfData } = etfRespnose || { data: '' }
  const soup = new JSSoup(etfData)

  const profile = handleProfile(soup)
  const holding = handleHoldings(soup)
  const noOfHoldings = handleNoOfHoldings(soup)

  return {
    basicInfo: { ...profile },
    holdingInfo: [...holding],
    noOfHoldings
  }
}
