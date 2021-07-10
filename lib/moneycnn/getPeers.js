import { excludeList } from '@/config/peers'
import { toAxios } from '@/lib/commonFunction'
import JSSoup from 'jssoup'

async function getResponse(ticker) {
  const response = await toAxios(
    'https://money.cnn.com/quote/competitors/competitors.html',
    {
      symb: ticker
    }
  )

  const resData = response?.data

  return resData
}

export const getPeers = async ticker => {
  const response = await getResponse(ticker)
  const soup = new JSSoup(response)
  const aSoup = soup.findAll('a', 'wsod_symbol')

  const peerList = aSoup
    .filter(x => x.text && !excludeList.includes(x.text))
    .reduce((acc, cur) => {
      const newAcc = [
        ...acc,
        {
          Ticker: cur.text,
          Name: cur.nextSibling.text
        }
      ]
      return newAcc
    }, [])

  return peerList
}
