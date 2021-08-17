import { getQuote } from '@/lib/yahoo/getQuote'

const getData = async args => {
  const { ticker } = args
  const quote = await getQuote(ticker)
  const data = quote.find(x => x) || { symbol: ticker }
  return data
}

export default async (req, res) => {
  const response = await getData(req.query)

  res.statusCode = 200
  res.json(response)
}
