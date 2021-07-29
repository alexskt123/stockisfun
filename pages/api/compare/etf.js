import { tableHeaderList } from '@/config/etf'
import { getETFDB } from '@/lib/etfdb/getETFDB'
import { getETFPerformance } from '@/lib/etfdb/getETFPerformance'
export default async (req, res) => {
  const { ticker } = req.query

  const responses = await Promise.all([
    getETFDB(ticker),
    getETFPerformance(ticker)
  ])

  res.statusCode = 200
  res.json(
    responses.reduce(
      (acc, item) => {
        const spreadItems = item.basicInfo ? item.basicInfo : item
        const selectedItemsArr = Object.keys(spreadItems).filter(x =>
          tableHeaderList.map(header => header.item).includes(x)
        )

        const selectedItems = selectedItemsArr.reduce((acc, key) => {
          return {
            ...acc,
            [key]: spreadItems[key]
          }
        }, {})

        return {
          ...acc,
          ...selectedItems
        }
      },
      { symbol: ticker }
    )
  )
}
