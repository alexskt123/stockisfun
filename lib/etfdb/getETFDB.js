import axios from 'axios'
import JSSoup from 'jssoup'
import { selectedHeadersArr } from '../../config/etf'
import { decode } from 'html-entities'

export const getETFDB = async (ticker) => {

  const etfInfo = {
    basicInfo: {},
    holdingInfo: [],
    analystReport: ''
  }
  let holding = []
  const basicInfo = {}

  await axios.all([
    axios.get(`https://etfdb.com/etf/${ticker}/#etf-ticker-profile`).catch(error => console.log(error)),
    axios.get(`https://etfdb.com/etf/${ticker}/#holdings`).catch(error => console.log(error))
  ])
    .catch(error => console.log(error))
    .then((responses) => {
      responses.forEach((response, index) => {
        if (response && response.data) {
          if (index == 0) {
            const soup = new JSSoup(response.data)
            const spans = soup.findAll('span')

            spans.forEach(span => {
              if (selectedHeadersArr.includes(span.text))
                basicInfo[span.text] = decode(span.nextSibling.text)

              if (span.attrs.id) {
                if (span.attrs.id == 'stock_price_value')
                  basicInfo['Price'] = decode(span.text).replace(/\n/gi, '')
              }
            })

            const divs = soup.findAll('div')
            divs.forEach(div => {
              if (div.attrs.id == 'analyst-report') {
                etfInfo.analystReport = div.nextElement.nextElement.nextElement.text
              }
            })
          } else {
            const soup = new JSSoup(response.data)
            const tds = soup.findAll('td')

            tds.forEach((td, index) => {

              if (td.attrs['data-th'] && td.attrs['data-th'].match(/Symbol|Holding|% Assets/)) {

                holding.push(td.text)

                if (index != 0 && ((index + 1) % 3 == 2)) {

                  etfInfo.holdingInfo.push(holding)
                  holding = []
                }
              }
            })
          }
        }
      })
    })

  const otherPcnt = etfInfo.holdingInfo.reduce((acc, cur) => {
    acc = acc - parseFloat(cur[2].replace(/%| /gi, ''))
    return acc
  }, 100)

  if (otherPcnt < 100)
    etfInfo.holdingInfo.push(['Others', 'Others', `${otherPcnt.toFixed(2)}%`])

  etfInfo.basicInfo = basicInfo


  return etfInfo
}
