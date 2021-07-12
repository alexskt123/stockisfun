import { toAxios } from '@/lib/request'
import JSSoup from 'jssoup'

async function getResponse(ticker) {
  const response = await toAxios(`https://etfdb.com/etf/${ticker}/#performance`)

  const resData = response?.data
  return resData
}

export const getETFPerformance = async ticker => {
  const response = await getResponse(ticker)
  const soup = new JSSoup(response)
  const spans = soup.findAll('span', 'relative-metric-bubble-data')

  const etfInfo = spans
    .filter(
      span =>
        span &&
        span.text &&
        span.previousElement.previousElement.nextSibling &&
        span.previousElement.previousElement.nextSibling.text.match(
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
