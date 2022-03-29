import { decode } from 'html-entities'
import JSSoup from 'jssoup'

import { selectedHeadersArr } from '@/config/etf'
import Ticker from '@/lib/class/ticker'
import { arrFindByIdx, convertToPercentage, trim } from '@/lib/commonFunction'
import { toAxios } from '@/lib/request'

// Constructor
export default class ETFDb extends Ticker {
  constructor(ticker, type, ...args) {
    super(ticker, ...args)
    this._type = type
  }

  get ETFDbResponse() {
    return this._res
  }

  get ETFPerformance() {
    const spans = this._soup.findAll('span', 'relative-metric-bubble-data')

    const etfInfo = spans
      .filter(
        span =>
          span?.text &&
          span.previousElement.previousElement.nextSibling?.text?.match(
            /4 Week Return|Year to Date Return|1 Year Return|3 Year Return/
          )
      )
      .reduce((acc, span) => {
        acc[
          span.previousElement.previousElement.nextSibling.text
            .replace(/\s+/g, ' ')
            .trim()
        ] = span.text
        return acc
      }, {})

    return etfInfo
  }

  get ETFProfile() {
    const spans = this._soup.findAll('span')
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

    const divs = this._soup.findAll('div')
    basicInfo['Analyst Report'] = (
      divs.find(x => x.attrs.id === 'analyst-report') || {}
    )?.nextElement?.nextElement?.nextElement?.text

    return basicInfo
  }

  get ETFHoldings() {
    const tds = this._soup.findAll('td')

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

    otherPcnt !== 100 &&
      etfHolding.push([
        'Others',
        'Others',
        convertToPercentage(otherPcnt / 100)
      ])

    return etfHolding
  }

  get ETFStockCount() {
    const tds = this._soup.findAll('td')

    const noOfHoldings = tds.reduce((acc, item) => {
      const newAcc =
        trim(item?.text) === 'Number of Holdings' &&
        item?.findNextSibling('td')?.text.replace(/\n/g, '')
      return newAcc || acc
    }, 'N/A')

    return noOfHoldings
  }

  get stockETFCount() {
    const h4 = this._soup.findAll('h4')

    const etfInfo = h4
      .filter(x => x?.text)
      .reduce((acc, item) => {
        const reg = item.text.match(/Unlock all (.*) ETFs/)
        const newAcc = arrFindByIdx(reg, 1) || acc

        return newAcc
      }, 'N/A')

    return etfInfo
  }

  get stockETFList() {
    const etfInfoLabel = ['name', 'category', 'expense', 'weight']
    const trs = this._soup.findAll('tr')

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

    return etfList
  }

  soup() {
    this._soup = new JSSoup(this._res)
  }

  async request() {
    const ETFDbResponse = await toAxios(
      `https://etfdb.com/${this._type}/${this._ticker}/`
    )
    this._res = ETFDbResponse?.data
    this.soup()
  }
}
