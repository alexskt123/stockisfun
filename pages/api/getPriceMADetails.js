import { getPriceMADetails } from '@/lib/email/template'
import { getRelativeStrengthByDays } from '@/lib/stockInfo'

export default async (req, res) => {
  const { ticker, genChart } = req.query

  const result = await getPriceMADetails({ ticker, genChart })
  const rs = await getRelativeStrengthByDays(ticker, 'SPY', 50)

  res.statusCode = 200
  res.json({ ...result, rs })
}
