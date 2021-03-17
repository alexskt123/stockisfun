import axios from 'axios'
import JSSoup from 'jssoup'

async function getResponse(ticker) {

  const response = await axios(`https://etfdb.com/etf/${ticker}/#performance`).catch(console.error)

  const resData = response?.data
  return resData
}

export const getETFPerformance = async (ticker) => {

  const response = await getResponse(ticker)
  const soup = new JSSoup(response)
  const spans = soup.findAll('span')

  const etfInfo = spans.reduce((acc, span) => {
    if (span.text && span.attrs.class == 'relative-metric-bubble-data' && span.previousElement.previousElement.nextSibling) {
      if (span.previousElement.previousElement.nextSibling.text.match(/4 Week Return|Year to Date Return|1 Year Return|3 Year Return/)) {
        acc[span.previousElement.previousElement.nextSibling.text.replace(/\s+/g, ' ').trim()] = span.text
      }
    }

    return acc
  }, {})

  return etfInfo
}
