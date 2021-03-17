import axios from 'axios'
import JSSoup from 'jssoup'
import { excludeList } from '../../config/peers'

async function getResponse(ticker) {

  const response = await axios.get('https://money.cnn.com/quote/competitors/competitors.html', {
    params: {
      symb: ticker
    }
  }).catch(console.error)

  const resData = response?.data

  return resData
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
