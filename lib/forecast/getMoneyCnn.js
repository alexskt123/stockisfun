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
  const moneycnn = ['N/A', 'N/A', 'N/A', 'N/A', 'N/A']

  const spans = soup.findAll('p')
  spans.forEach(span=> {
    if(span.text) {
      const regAnalyst = span.text.match(/The (.*) analysts offering 12-month/)
      if (regAnalyst && regAnalyst.length > 1) {
        moneycnn[0] = regAnalyst[1]
      }

      const reg = span.text.match(/have a median target of (.*), with a high estimate of (.*) and a low estimate of (.*)\. The median estimate represents a (.*) from the last price of (.*)\./)
      if (reg) {
        reg.slice(0,5).forEach((item,index)=>{
          if (index > 0)
            moneycnn[index] = item.replace(/increase|decrease/, '')
        })
      }
    }
  })

  return moneycnn
}
