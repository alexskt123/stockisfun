import axios from 'axios'
import JSSoup from 'jssoup'

async function getResponse(ticker) {
    let response = {
        
    }

    try {
        response = await axios(`https://etfdb.com/etf/${ticker}/#etf-ticker-profile`)
    }
    catch {

    }

    return response.data

}

export const getETFDB = async (ticker) => {

    const selectedHeaders = "Issuer,Structure,Expense Ratio,Inception,Index Tracked,Category,Asset Class,52 Week Lo,52 Week Hi,AUM,1 Month Avg. Volume,3 Month Avg. Volume"
    const selectedHeadersArr = selectedHeaders.split(',')

    const response = await getResponse(ticker)

    const soup = new JSSoup(response)

    const spans = soup.findAll('span');

    let etfInfo = {}

    spans.forEach(span=> {
        if(selectedHeadersArr.includes(span.text))
            etfInfo[span.text] = span.nextSibling.text
    })

    return etfInfo
}
