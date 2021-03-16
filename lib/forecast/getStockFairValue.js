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

async function _getFinanchillResponse(ticker) {
  const response = await axios(`https://financhill.com/stock-forecast/${ticker}-stock-prediction`).catch(console.error)

  const resData = response?.data
  return resData
}


export const getStockFairValue = async (ticker) => {

  let response = await getResponse(ticker)
  let soup = new JSSoup(response)
  let wallet = []
  const score = 'N/A'

  // const scoreArr = []
  const fairPriceInfo = []
  const moneycnn = ['N/A', 'N/A', 'N/A', 'N/A', 'N/A']
  const tickerType = await getTickerType(ticker)
  const fundorstock = tickerType === 'ETF' ? 'fund' : 'stock'

  const spans = soup.findAll('p')
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


  response = await getWalletInvestorResponse(ticker, fundorstock)
  soup = new JSSoup(response)
  const a = soup.findAll('a')

  a.forEach(item => {

    if (item.attrs.class == 'forecast-currency-href') {
      wallet.push(item.text.replace(/ |USD|▼|▲/gi, ''))
    }
  })

  wallet = wallet.length < 3 ? [...wallet, ...[...Array(3 - wallet.length)].map(_item => 'N/A')] : wallet

  if (wallet[0] !== 'N/A' && wallet[1] !== 'N/A') {
    wallet.push(percent.calc((wallet[1] - wallet[0]), parseFloat(wallet[0]), 2, true))
  }
  else wallet.push('N/A')

  if (wallet[0] !== 'N/A' && wallet[2] !== 'N/A') {
    wallet.push(percent.calc((wallet[2] - wallet[0]), parseFloat(wallet[0]), 2, true))
  }
  else wallet.push('N/A')

  // response = await getFinanchillResponse(ticker)
  // soup = new JSSoup(response)
  // const strong = soup.findAll('strong')

  // strong.forEach(item=> {
  //     if (item.text == 'Score') {
  //         scoreArr.push(item.nextSibling.text)
  //     }
  // })

  // score = scoreArr.length ? scoreArr.find(x=>x) : score

  fairPriceInfo.push(...wallet, score, ...moneycnn)

  return fairPriceInfo
}
