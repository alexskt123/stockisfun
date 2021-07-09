import { walletHeader } from '@/config/forecast'
import { calPcnt, toAxios } from '@/lib/commonFunction'
import Quote from '@/lib/quote'
import JSSoup from 'jssoup'

async function getWalletInvestorResponse(ticker, fundorstock) {
  const response = await toAxios(
    `https://walletinvestor.com/${fundorstock}-forecast/${ticker}-${fundorstock}-prediction`
  )

  const resData = response?.data
  return resData
}

export const getWalletInvestor = async ticker => {
  const quote = new Quote(ticker)
  await quote.request()
  const tickerType = quote.type
  const fundorstock = tickerType === 'ETF' ? 'fund' : 'stock'
  const walletRes = await getWalletInvestorResponse(quote.ticker, fundorstock)
  const walletSoup = new JSSoup(walletRes)
  const a = walletSoup.findAll('a', 'forecast-currency-href')

  const walletInfo = a
    .map(item => {
      return item.text.replace(/ |USD|▼|▲/gi, '')
    })
    .filter(x => x)

  const walletPrice = [...Array(3)].map((_item, idx) => {
    return walletInfo[idx] ? walletInfo[idx] : 'N/A'
  })

  const walletPercentage = [...Array(2)].map((_item, idx) => {
    return walletInfo[idx + 1] && walletInfo[0]
      ? calPcnt(
          walletInfo[idx + 1] - walletInfo[0],
          parseFloat(walletInfo[0]),
          2,
          true
        )
      : 'N/A'
  })

  const data = {
    ...walletHeader.reduce((acc, item, idx) => {
      return { ...acc, [item.item]: [...walletPrice, ...walletPercentage][idx] }
    }, {})
  }

  return data
}
