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

async function getWalletInvestorResponse(ticker, fundorstock) {
    let response = {
        
    }

    try {
        response = await axios(`https://walletinvestor.com/${fundorstock}-forecast/${ticker}-${fundorstock}-prediction`)
    }
    catch {

    }

    return response.data

}

async function getFinanchillResponse(ticker) {
    let response = {
        
    }

    try {
        response = await axios(`https://financhill.com/stock-forecast/${ticker}-stock-prediction`)
    }
    catch {

    }

    return response.data

}


export const getStockFairValue = async (ticker) => {


    let response = await getResponse(ticker)
    let soup = new JSSoup(response)
    let moneycnn = []
    let wallet = []
    let score = 'N/A'
    let scoreArr = []
    let fairPriceInfo = []
    let fundorstock = 'fund'

    const spans = soup.findAll('p');
    spans.forEach(span=> {
        if(span.text) {
            const reg = span.text.match(/have a median target of (.*), with a high estimate of (.*) and a low estimate of (.*)\. The median estimate represents a (.*) from the last price of (.*)\./)
            if (reg) {
                reg.slice(0,5).forEach((item,index)=>{
                    if (index > 0)
                    moneycnn.push(item.replace(/increase|decrease/, ''))
                })
            }
        }
    })


    if (moneycnn.length > 0) {
        fundorstock = 'stock'
    }
    else moneycnn = ['N/A', 'N/A', 'N/A', 'N/A']

    response = await getWalletInvestorResponse(ticker, fundorstock)
    soup = new JSSoup(response)
    const a = soup.findAll('a')

    a.forEach(item=> {

        if (item.attrs.class == 'forecast-currency-href') {
            wallet.push(item.text.replace(/ |USD|▼|▲/gi, ''))
        }
    })

    wallet = wallet.length == 0 ? ['N/A', 'N/A','N/A'] : wallet


    response = await getFinanchillResponse(ticker)
    soup = new JSSoup(response)
    const strong = soup.findAll('strong')

    strong.forEach(item=> {
        if (item.text == 'Score') {
            scoreArr.push(item.nextSibling.text)
        }
    })

    score = scoreArr.length ? scoreArr.find(x=>x) : score

    fairPriceInfo.push(...wallet,score,...moneycnn)

    return fairPriceInfo
}
