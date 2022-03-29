import { getStockStrength } from '@/lib/stockInfo'

export default async (req, res) => {
  const { ticker } = req.query

  const result = await getStockStrength(ticker)

  res.statusCode = 200
  res.json({ ...result })
}
