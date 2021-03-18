import axios from 'axios'

async function getResponse(query, filter) {

  const response = await axios.get('http://d.yimg.com/autoc.finance.yahoo.com/autoc', {
    params: {
      query: query,
      region: 1,
      lang: 'en'
    }
  }).catch(console.error)

  const resData = response?.data?.ResultSet?.Result.filter(x => x && (x.typeDisp === filter))
  return resData ? resData : []
}

export const getTickerSuggestions = async (query, filter) => {
  const response = await getResponse(query, filter)
  return response
}
