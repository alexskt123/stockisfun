import { getAUM } from '@/lib/compare/aum'

export default async (req, res) => {
  const { ticker } = req.query

  const data = await getAUM(ticker)

  res.statusCode = 200
  res.json(data)
}
