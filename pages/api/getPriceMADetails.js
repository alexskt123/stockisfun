import { getPriceMADetails } from '@/lib/email/template'

export default async (req, res) => {
  const { ticker, genChart } = req.query

  const result = await getPriceMADetails({ ticker, genChart })

  res.statusCode = 200
  res.json(result)
}
