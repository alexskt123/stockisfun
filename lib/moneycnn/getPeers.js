import axios from 'axios'
import JSSoup from 'jssoup'
import { excludeList } from '../../config/peers'

async function getResponse(ticker) {
  let response = {}

  try {
    response = await axios(`https://money.cnn.com/quote/competitors/competitors.html?symb=${ticker}`)
  }
  catch {
    console.log('Failed to execute lib/moneycnn/getPeers')
  }

  return response.data
}

export const getPeers = async (ticker) => {

  const response = await getResponse(ticker)
  const soup = new JSSoup(response)
  const aSoup = soup.findAll('a')

  const peerList = aSoup.reduce((acc, cur) => {
    if (cur.attrs.class && cur.attrs.class == 'wsod_symbol' && cur.text) {
      if (!excludeList.includes(cur.text))
        acc.push({
          Ticker: cur.text,
          Name: cur.nextSibling.text
        })
    }
    return acc
  }, [])

  return peerList
}