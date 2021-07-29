import { getStockETFCount } from '@/lib/etfdb/getStockETFCount'

export default async (req, res) => {
  const { ticker } = req.query

  const data = await getStockETFCount(ticker)

  res.statusCode = 200
  res.json(data)
}
