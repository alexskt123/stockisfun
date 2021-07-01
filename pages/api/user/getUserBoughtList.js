//GET https://zh.wikipedia.org/

import { getUserBoughtList } from '@/lib/stockDetailsFunction'

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default async (req, res) => {
  const { uid } = req.query

  const boughtListInfo = await getUserBoughtList(uid)

  res.statusCode = 200
  res.json({ ...boughtListInfo })
}
