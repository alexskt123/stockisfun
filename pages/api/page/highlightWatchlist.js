import { getAPIResponse } from '@/lib/request'
import { getEarningsDate } from '@/lib/yahoo/getEarningsDate'

const getData = async args => {
  const { ticker, quoteData } = args

  const earningsDate = quoteData ? await getEarningsDate(ticker) : null

  return { ...quoteData, earningsDate: earningsDate.fmt }
}

export default async (req, res) => {
  const response = await getAPIResponse(req, getData)

  res.statusCode = 200
  res.json(response)
}
