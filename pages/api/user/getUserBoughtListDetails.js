// import { getStockEarningCapacity } from '@/lib/commonFunction'
//GET https://zh.wikipedia.org/

import { getUserBoughtList } from '@/lib/stockDetailsFunction'
import { getYahooAssetProfile } from '@/lib/yahoo/getYahooAssetProfile'

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default async (req, res) => {
  const { uid } = req.query

  const boughtListInfo = await getUserBoughtList(uid)
  const profile = await Promise.all(
    [...boughtListInfo.boughtList].map(async item => {
      const assetProfile = await getYahooAssetProfile(item.ticker)
      // const earningCapacity =
      //   item.type === 'EQUITY'
      //     ? await getStockEarningCapacity(item.ticker)
      //     : null
      return { assetProfile }
    })
  ).catch(error => console.error(error))

  const boughtListDetails = boughtListInfo.boughtList.map((item, idx) => {
    return {
      ...item,
      sector: profile[idx].assetProfile.sector
      // ,earningCapacity: profile[idx].earningCapacity
    }
  })

  res.statusCode = 200
  res.json({ boughtList: boughtListDetails, cash: boughtListInfo.cash })
}
