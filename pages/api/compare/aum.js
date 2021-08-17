import { aumTableHeader } from '@/config/etf'
import { getAUM } from '@/lib/compare/aum'
import { getMoneyCnnCouple } from '@/lib/forecast/getMoneyCnn'

export default async (req, res) => {
  const { ticker } = req.query

  const aumData = await getAUM(ticker)
  const moneyCnnData = await getMoneyCnnCouple(ticker)

  res.statusCode = 200
  res.json({
    //todo: ???
    ...[ticker, ...aumData].reduce(
      (acc, item, idx) => ({ ...acc, [aumTableHeader[idx].item]: item }),
      {}
    ),
    ...moneyCnnData
  })
}
