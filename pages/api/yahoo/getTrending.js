import { toAxios } from '@/lib/request'

async function getResponse() {
  const response = await toAxios(process.env.TRENDING_URL, {
    count: 20
  })

  const resData = response?.data?.finance?.result
    ?.find(x => x)
    ?.quotes?.map(x => x.symbol)

  return resData || []
}

export default async (req, res) => {
  const tickerArr = await getResponse()

  res.statusCode = 200
  res.json(tickerArr)
}
