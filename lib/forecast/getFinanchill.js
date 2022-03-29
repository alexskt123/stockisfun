import JSSoup from 'jssoup'

import { toAxios } from '@/lib/request'

async function getFinanchillResponse(ticker) {
  const response = await toAxios(
    `https://financhill.com/stock-forecast/${ticker}-stock-prediction`
  )

  const resData = response?.data
  return resData
}

export const getFinanchill = async ticker => {
  const financhillRes = await getFinanchillResponse(ticker)
  const financhillSoup = new JSSoup(financhillRes)
  const strong = financhillSoup.findAll('strong')
  const score = strong
    .filter(x => x.text === 'Score')
    .reduce((_acc, item) => {
      return item.nextSibling.text
    }, 'N/A')

  return {
    financhillScore: score
  }
}
