import axios from 'axios'
import JSSoup from 'jssoup'

async function getResponse(ticker) {
  const response = await axios(`https://etfdb.com/stock/${ticker}/`).catch(
    console.error
  )

  const resData = response?.data
  return resData
}

export const getStockETFCount = async ticker => {
  const response = await getResponse(ticker)
  const soup = new JSSoup(response)
  const h4 = soup.findAll('h4')

  const etfInfo = h4.reduce((acc, item) => {
    const reg = item.text ? item.text.match(/Unlock all (.*) ETFs/) : null
    const newAcc = reg ? reg[1] : acc

    return newAcc
  }, 'N/A')

  return etfInfo
}
