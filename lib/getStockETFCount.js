import axios from 'axios'
import JSSoup from 'jssoup'

async function getResponse(ticker) {
    let response = {
        
    }

    try {
        response = await axios(`https://etfdb.com/stock/${ticker}/`)
    }
    catch {

    }

    return response.data

}

export const getStockETFCount = async (ticker) => {


    const response = await getResponse(ticker)

    const soup = new JSSoup(response)

    const spans = soup.findAll('h4');

    let etfInfo = ''

    spans.forEach(span=> {
        if(span.text) {
            const reg = span.text.match(/Unlock all (.*) ETFs/)
            if (reg) {
                etfInfo = reg[1]
            }
        }
    })

    return etfInfo
}
