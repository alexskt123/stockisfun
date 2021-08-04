import { walletHeader } from '@/config/forecast'
import Quote from '@/lib/class/quote'
import { calPcnt } from '@/lib/commonFunction'
import { toAxios } from '@/lib/request'
import JSSoup from 'jssoup'

async function getWalletInvestorResponse(ticker, fundOrStock) {
  const response = await toAxios(
    `https://walletinvestor.com/${fundOrStock}-forecast/${ticker}-${fundOrStock}-prediction`
  )

  const resData = response?.data
  return resData
}

export const getWalletInvestor = async ticker => {
  const quote = new Quote(ticker)
  await quote.request()
  const tickerType = quote.type
  const fundOrStock = tickerType === 'ETF' ? 'fund' : 'stock'
  const walletRes = await getWalletInvestorResponse(quote.ticker, fundOrStock)
  const walletSoup = new JSSoup(walletRes)
  const a = walletSoup.findAll('a', 'forecast-currency-href')

  const walletInfo = a
    .map(item => {
      return item.text.replace(/ |USD|▼|▲/gi, '')
    })
    .filter(x => x)

  const walletPrice = [...Array(3)].map((_item, idx) => {
    return walletInfo[idx] || 'N/A'
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
