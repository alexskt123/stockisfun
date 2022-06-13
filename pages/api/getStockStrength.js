import { getPriceMADetails } from '@/lib/email/template'
import { getRelativeStrengthByDays } from '@/lib/stockInfo'

const conditionMatches = (id, priceMAList) => {
  const matches = !!priceMAList.find(
    x => x.id === id && x.tickersInfo.length > 0
  )

  return matches
}

export default async (req, res) => {
  const { ticker, rsTicker } = req.query

  const genChart = false
  const priceDetails = await getPriceMADetails({ ticker, genChart })
  const { rs, latestHigherInputRange } = await getRelativeStrengthByDays(
    ticker,
    rsTicker || 'SPY',
    50,
    85,
    3
  )

  const twentyHigherFifty = conditionMatches('20>50', priceDetails.priceMAList)
  const fiftyHigherHundredFifty = conditionMatches(
    '50>150',
    priceDetails.priceMAList
  )
  const fiftyLowerHundredFifty = conditionMatches(
    '50<150',
    priceDetails.priceMAList
  )

  const result = {
    Ticker: priceDetails.ticker,
    'Price Not Avail.': !priceDetails.priceAvail,
    'RS>0': rs > 0,
    '85D High': latestHigherInputRange,
    '20>50 & 50>150': twentyHigherFifty && fiftyHigherHundredFifty,
    '20>50 & 50<150': twentyHigherFifty && fiftyLowerHundredFifty
  }

  res.statusCode = 200
  res.json({ ...result })
}
