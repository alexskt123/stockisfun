import Quote from '@/lib/class/quote'
import { getPeers } from '@/lib/moneycnn/getPeers'
import { getAPIResponse } from '@/lib/request'

const getData = async args => {
  const { ticker } = args
  const data = await getPeers(ticker)

  const quotesValid = await Promise.all(
    data.map(async item => {
      const quote = new Quote(item.Ticker)
      await quote.request()
      return quote.valid
    })
  )

  return data.filter((_x, i) => quotesValid[i])
}

export default async (req, res) => {
  const response = await getAPIResponse(req, getData)
  res.statusCode = 200
  res.json(response)
}
