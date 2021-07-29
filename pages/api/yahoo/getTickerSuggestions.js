import { getTickerSuggestions } from '@/lib/yahoo/getTickerSuggestions'

export default async (req, res) => {
  const { query, filter } = req.query

  const data = await getTickerSuggestions(query, filter)

  res.statusCode = 200
  res.json(data)
}
