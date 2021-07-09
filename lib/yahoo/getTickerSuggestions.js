import { toAxios } from '@/lib/commonFunction'

async function getResponse(query, filter) {
  const response = await toAxios(
    'http://d.yimg.com/autoc.finance.yahoo.com/autoc',
    {
      query: query,
      region: 1,
      lang: 'en'
    }
  )

  const filterArr = filter.split(',')
  const resData = response?.data?.ResultSet?.Result.filter(x =>
    filterArr.includes(x.typeDisp)
  )
  return resData ? resData : []
}

export const getTickerSuggestions = async (query, filter) => {
  const response = await getResponse(query, filter)
  return response
}
