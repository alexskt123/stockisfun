import axios from 'axios'
import JSSoup from 'jssoup'
import percent from 'percent'
import Quote from '../../lib/quote'

async function getWalletInvestorResponse(ticker, fundorstock) {
  const response = await axios(`https://walletinvestor.com/${fundorstock}-forecast/${ticker}-${fundorstock}-prediction`).catch(console.error)

  const resData = response?.data
  return resData
}

export const getWalletInvestor = async (ticker) => {

  const quote = new Quote(ticker)
  await quote.request()
  const tickerType = quote.type
  const fundorstock = tickerType === 'ETF' ? 'fund' : 'stock'
  const walletRes = await getWalletInvestorResponse(ticker, fundorstock)
  const walletSoup = new JSSoup(walletRes)
  const a = walletSoup.findAll('a', 'forecast-currency-href')

  const walletInfo = a.map(item => {
    return (item.text.replace(/ |USD|▼|▲/gi, ''))
  }).filter(x => x)

  const wallet = [...Array(5)].map((_item, idx) => {
    if (idx < 3) {
      return walletInfo[idx] ? walletInfo[idx] : 'N/A'
    } else {
      return walletInfo[idx - 2] && walletInfo[0] ? percent.calc((walletInfo[idx - 2] - walletInfo[0]), parseFloat(walletInfo[0]), 2, true) : 'N/A'
    }
  })

  return [...wallet]
}
