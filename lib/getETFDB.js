import axios from 'axios'
import JSSoup from 'jssoup'

import { selectedHeadersArr } from '../config/etf'

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
