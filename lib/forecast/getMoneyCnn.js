import axios from 'axios'
import JSSoup from 'jssoup'

async function getResponse(ticker) {

  const response = await axios.get('https://money.cnn.com/quote/forecast/forecast.html', {
    params: {
      symb: ticker
    }
  }).catch(console.error)

  const resData = response?.data
  return resData
}

export const getMoneyCnn = async (ticker) => {

  const response = await getResponse(ticker)
  const soup = new JSSoup(response)
  const spans = soup.findAll('p')

  const moneycnn = spans.reduce((acc, span) => {
    const regAnalyst = span.text && span.text.match(/The (.*) analysts offering 12-month/)
    const noOfAnalysts = regAnalyst && regAnalyst.length > 1 ? regAnalyst[1] : acc.noOfAnalysts

    const reg = span.text && span.text.match(/have a median target of (.*), with a high estimate of (.*) and a low estimate of (.*)\. The median estimate represents a (.*) from the last price of (.*)\./)
    const estimate = reg ? reg.slice(1, 5).map(item => {
      return item.replace(/increase|decrease/, '')
    }) : acc.estimate

    const newAcc = {
      ...acc,
      noOfAnalysts,
      estimate
    }

    return newAcc
  }, { noOfAnalysts: 'N/A', estimate: ['N/A', 'N/A', 'N/A', 'N/A'] })

  return [moneycnn.noOfAnalysts, ...moneycnn.estimate]
}
