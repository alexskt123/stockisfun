import { toAxios } from '@/lib/request'

async function getResponse(query, filter) {
  const response = await toAxios(
    'https://query2.finance.yahoo.com/v1/finance/search',
    {
      q: query,
      newsCount: 0,
      listsCount: 0
    }
  )

  const filterArr = filter.split(',')
  const resData = response?.data?.quotes?.filter(x =>
    filterArr.includes(x.typeDisp)
  )
  return (
    resData?.map(x => ({ ...x, name: x.shortname, shortname: undefined })) || []
  )
}

export const getTickerSuggestions = async (query, filter) => {
  const response = await getResponse(query, filter)
  return response
}
