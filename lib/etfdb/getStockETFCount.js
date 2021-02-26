import axios from 'axios'
import JSSoup from 'jssoup'

async function getResponse(ticker) {
  let response = {
        
  }

  try {
    response = await axios(`https://etfdb.com/stock/${ticker}/`)
  }
  catch {
    console.log('Failed to execute lib/etfdb/getStockETFCount')
  }

  return response.data

}

export const getStockETFCount = async (ticker) => {


  const response = await getResponse(ticker)

  const soup = new JSSoup(response)

  const h4 = soup.findAll('h4')

  let etfInfo = ''

  h4.forEach(item=> {
    if(item.text) {
      const reg = item.text.match(/Unlock all (.*) ETFs/)
      if (reg) {
        etfInfo = reg[1]
      }
    }
  })

  return etfInfo
}
