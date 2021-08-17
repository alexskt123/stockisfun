import { getAPIResponse } from '@/lib/request'

const getData = args => {
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
