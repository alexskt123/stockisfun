import axios from 'axios'
import JSSoup from 'jssoup'

import { selectedHeadersArr } from '../config/etf'

import {decode} from 'html-entities';

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
            etfInfo[span.text] = decode(span.nextSibling.text)
        
        if (span.attrs.id) {
            if (span.attrs.id == 'stock_price_value')
                etfInfo['Price'] = decode(span.text).replace(/\n/gi, '')
        }
    })

    return etfInfo
}