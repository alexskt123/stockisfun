import { moneyCnnHeader } from '@/config/forecast'
import { Quote } from '@/lib/quote'
import { toAxios } from '@/lib/request'
import JSSoup from 'jssoup'

async function getResponse(ticker) {
  const response = await toAxios(
    'https://money.cnn.com/quote/forecast/forecast.html',
    {
      symb: ticker
    }
  )

  const resData = response?.data
  return resData
}

export const getMoneyCnnCouple = async ticker => {
  const quote = new Quote(ticker)
  await quote.request()

  const dataArr = await getMoneyCnn(quote.ticker)

  const data = {
    ...moneyCnnHeader.reduce((acc, item, idx) => {
      return { ...acc, [item.item]: dataArr[idx] }
    }, {})
  }

  return data
}

export const getMoneyCnn = async ticker => {
  const response = await getResponse(ticker)
  const soup = new JSSoup(response)
  const spans = soup.findAll('p')

  const moneycnn = spans.reduce(
    (acc, span) => {
      const regAnalyst = span?.text.match(/The (.*) analysts offering 12-month/)
      const noOfAnalysts =
        regAnalyst?.length > 1 ? regAnalyst[1] : acc.noOfAnalysts

      const reg =
        span.text &&
        span.text.match(
          /have a median target of (.*), with a high estimate of (.*) and a low estimate of (.*)\. The median estimate represents a (.*) from the last price of (.*)\./
        )
      const estimate = reg
        ? reg.slice(1, 5).map(item => {
            return item.replace(/increase|decrease|,/, '')
          })
        : acc.estimate

      const newAcc = {
        ...acc,
        noOfAnalysts,
        estimate
      }

      return newAcc
    },
    { noOfAnalysts: 'N/A', estimate: ['N/A', 'N/A', 'N/A', 'N/A'] }
  )

  return [moneycnn.noOfAnalysts, ...moneycnn.estimate]
}
