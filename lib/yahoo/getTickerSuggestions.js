import { toAxios } from '@/lib/request'

async function getResponse(query, filter) {
  const response = await toAxios('https://autoc.finance.yahoo.com/autoc', {
    query: query,
    region: 1,
    lang: 'en'
  })

  const filterArr = filter.split(',')
  const resData = response?.data?.ResultSet?.Result.filter(x =>
    filterArr.includes(x.typeDisp)
  )
  return resData || []
}

export const getTickerSuggestions = async (query, filter) => {
  const response = await getResponse(query, filter)
  return response
}
