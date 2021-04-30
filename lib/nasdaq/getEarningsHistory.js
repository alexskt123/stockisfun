import axios from 'axios'

async function getResponse(ticker) {

  const { data } = ticker ? await axios.get(`https://api.nasdaq.com/api/company/${ticker}/earnings-surprise`).catch(console.error) : {}

  return data || {}
}

export const getEarningsHistory = async (ticker) => {
  const { data } = await getResponse(ticker)
  try {
    return data.earningsSurpriseTable.rows
  } catch (_error) {
    return []
  }
}
