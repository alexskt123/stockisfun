import axios from 'axios'
import JSSoup from 'jssoup'

async function getFinanchillResponse(ticker) {
  const response = await axios(`https://financhill.com/stock-forecast/${ticker}-stock-prediction`).catch(console.error)

  const resData = response?.data
  return resData
}

export const getFinanchill = async (ticker) => {

  const financhillRes = await getFinanchillResponse(ticker)
  const financhillSoup = new JSSoup(financhillRes)
  const strong = financhillSoup.findAll('strong')
  const score = strong.filter(x => x && x.text && x.text === 'Score').reduce((acc, item) => {
    return item.nextSibling.text
  }, 'N/A')

  return {
    financhillScore: score
  }
}
