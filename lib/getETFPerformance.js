import axios from 'axios'
import JSSoup from 'jssoup'

import { selectedHeadersArr } from '../config/etf'

async function getResponse(ticker) {
    let response = {

    }

    try {
        response = await axios(`https://etfdb.com/etf/${ticker}/#performance`)
    }
    catch {

    }

    return response.data

}

export const getETFPerformance = async (ticker) => {

    const response = await getResponse(ticker)

    const soup = new JSSoup(response)

    const spans = soup.findAll('span');

    let etfInfo = {}

    spans.forEach(span => {
        if (span.text && span.attrs.class == 'relative-metric-bubble-data' && span.previousElement.previousElement.nextSibling) {            
            if (span.previousElement.previousElement.nextSibling.text.match(/4 Week Return|Year to Date Return|1 Year Return|3 Year Return/)) {
                etfInfo[span.previousElement.previousElement.nextSibling.text.replace(/\s+/g, ' ').trim()] = span.text                
            }
        }

    })    
    

    return etfInfo
}
