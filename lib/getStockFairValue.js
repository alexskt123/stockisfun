import axios from 'axios'
import JSSoup from 'jssoup'

async function getResponse(ticker) {
    let response = {
        
    }

    try {
        response = await axios(`https://money.cnn.com/quote/forecast/forecast.html?symb=${ticker}`)
    }
    catch {

    }

    return response.data

}

export const getStockFairValue = async (ticker) => {


    const response = await getResponse(ticker)

    const soup = new JSSoup(response)

    const spans = soup.findAll('p');

    let fairPriceInfo = []

    spans.forEach(span=> {
        if(span.text) {
            const reg = span.text.match(/have a median target of (.*), with a high estimate of (.*) and a low estimate of (.*)\. The median estimate represents a (.*) from the last price of (.*)\./)
            if (reg) {
                reg.forEach((item,index)=>{
                    if (index > 0)
                        fairPriceInfo.push(item.replace(/increase|decrease/, ''))
                })
            }
        }
    })

    return fairPriceInfo
}
