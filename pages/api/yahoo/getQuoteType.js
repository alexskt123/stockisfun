//GET https://zh.wikipedia.org/

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getAPIResponse } from '@/lib/request'

const getData = async args => {
  const { valid, type } = args
  return {
    valid,
    type
  }
}

export default async (req, res) => {
  const response = await getAPIResponse(req, getData)

  res.statusCode = 200
  res.json(response)
}
