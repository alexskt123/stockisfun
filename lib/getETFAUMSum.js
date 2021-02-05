import axios from 'axios'
import JSSoup from 'jssoup'

import { selectedHeadersArr } from '../config/etf'

import {decode} from 'html-entities';

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

export const getETFAUMSum = async (ticker) => {

    const response = await getResponse(ticker)

    const soup = new JSSoup(response)

    const trs = soup.findAll('tr');

    let etfInfo = []

    trs.forEach(tr=> {
        const tdTicker = tr.nextElement        

        if (tdTicker) {

            const tdWeighting = tdTicker.nextSibling.nextSibling.nextSibling.nextSibling

            if (tdWeighting) {
                if (tdTicker.attrs['data-th'] == "Ticker" && tdWeighting.attrs['data-th'] == "Weighting") {
                    etfInfo.push(
                        {
                            'ticker': tdTicker.text,
                            'weight': tdWeighting.text.replace('%', '')
                        }
                    )                    
                }   
            }  
        }   
    })

    return etfInfo
}
