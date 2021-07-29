import { getETFDB } from '@/lib/etfdb/getETFDB'

export default async (req, res) => {
  const { ticker } = req.query

  const data = await getETFDB(ticker)

  res.statusCode = 200
  res.json(data)
}
