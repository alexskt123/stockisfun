import axios from 'axios'
import JSSoup from 'jssoup'
import percent from 'percent'

import {
  convertFromPriceToNumber,
  convertToPercentage
} from '../../lib/commonFunction'

async function getResponse(ticker) {
  const response = await axios
    .get(`https://www.alphaquery.com/stock/${ticker}/earnings-history`)
    .catch(console.error)

  return response?.data
}

export const getEarningsHistory = async ticker => {
  const response = await getResponse(ticker)
  const soup = new JSSoup(response)
  const td = soup.findAll('td')

  const dataStructure = [...Array(5)]

  const earnings = [
    ...Array.from({ length: td.length / 4 }, (_item, idx) => {
      return dataStructure.map((_ds, dsIdx) => {
        const forecast = convertFromPriceToNumber(td[idx * 4 + 2].text)
        const actual = convertFromPriceToNumber(td[idx * 4 + 3].text)
        return dsIdx < 4
          ? td[idx * 4 + dsIdx].text
          : {
              style: 'green-red',
              data: convertToPercentage(
                percent.calc(actual - forecast, Math.abs(forecast), 2) / 100
              )
            }
      })
    })
  ]

  return earnings.slice(0, 8)
}
