import axios from 'axios'
import JSSoup from 'jssoup'
import percent from 'percent'
import { getTickerType } from '../commonFunction'

async function getResponse(ticker) {
  const response = await axios.get('https://money.cnn.com/quote/forecast/forecast.html', {
    params: {
      symb: ticker
    }
  }).catch(console.error)

  const resData = response?.data
  return resData
}

async function getWalletInvestorResponse(ticker, fundorstock) {
  const response = await axios(`https://walletinvestor.com/${fundorstock}-forecast/${ticker}-${fundorstock}-prediction`).catch(console.error)

  const resData = response?.data
  return resData
}

async function getFinanchillResponse(ticker) {
  const response = await axios(`https://financhill.com/stock-forecast/${ticker}-stock-prediction`).catch(console.error)

  const resData = response?.data
  return resData
}

export const getStockFairValue = async (ticker) => {
  
  const moneyCnnRes = await getResponse(ticker)
  const moneyCnnSoup = new JSSoup(moneyCnnRes)
  const moneycnn = ['N/A', 'N/A', 'N/A', 'N/A', 'N/A']

  const spans = moneyCnnSoup.findAll('p')
  spans.forEach(span => {
    if (span.text) {
      const regAnalyst = span.text.match(/The (.*) analysts offering 12-month/)
      if (regAnalyst && regAnalyst.length > 1) {
        moneycnn[0] = regAnalyst[1]
      }

      const reg = span.text.match(/have a median target of (.*), with a high estimate of (.*) and a low estimate of (.*)\. The median estimate represents a (.*) from the last price of (.*)\./)
      if (reg) {
        reg.slice(0, 5).forEach((item, index) => {
          if (index > 0)
            moneycnn[index] = item.replace(/increase|decrease/, '')
        })
      }
    }
  })

  const tickerType = await getTickerType(ticker)
  const fundorstock = tickerType === 'ETF' ? 'fund' : 'stock'
  const walletRes = await getWalletInvestorResponse(ticker, fundorstock)
  const walletSoup = new JSSoup(walletRes)
  const a = walletSoup.findAll('a')

  const walletInfo = a.map(item => {
    if (item.attrs.class == 'forecast-currency-href') {
      return (item.text.replace(/ |USD|▼|▲/gi, ''))
    }
  }).filter(x => x)

  const wallet = [...Array(5)].map((_item, idx) => {
    if (idx < 3) {
      return walletInfo[idx] ? walletInfo[idx] : 'N/A'
    } else {
      return walletInfo[idx - 2] && walletInfo[0] ? percent.calc((walletInfo[idx - 2] - walletInfo[0]), parseFloat(walletInfo[0]), 2, true) : 'N/A'
    }
  })

  const financhillRes = await getFinanchillResponse(ticker)
  const financhillSoup = new JSSoup(financhillRes)
  const strong = financhillSoup.findAll('strong')
  const score = strong.reduce((acc, item) => {
    if (item.text == 'Score') {
      acc = item.nextSibling.text
    }
    return acc
  }, 'N/A')

  return [...wallet, score, ...moneycnn]
}
