import axios from 'axios'
import JSSoup from 'jssoup'

import { decode } from 'html-entities';

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

        ifhaveticker: if (tdTicker) {
            
            if (!tdTicker.nextSibling) break ifhaveticker
            if (!tdTicker.nextSibling.nextSibling) break ifhaveticker
            if (!tdTicker.nextSibling.nextSibling.nextSibling) break ifhaveticker
            if (!tdTicker.nextSibling.nextSibling.nextSibling.nextSibling) break ifhaveticker

            const tdETF = tdTicker.nextSibling
            const tdCategory = tdETF.nextSibling
            const tdExpenseRatio = tdCategory.nextSibling
            const tdWeighting = tdExpenseRatio.nextSibling

            if (tdWeighting) {
                if (tdTicker.attrs['data-th'] == "Ticker"
                    && tdETF.attrs['data-th'] == 'ETF'
                    && tdCategory.attrs['data-th'] == 'ETFdb.com Category'
                    && tdExpenseRatio.attrs['data-th'] == 'Expense Ratio'
                    && tdWeighting.attrs['data-th'] == "Weighting") {
                    etfInfo.push(
                        {
                            'ticker': tdTicker.text,
                            'name': decode(tdETF.text),
                            'category': decode(tdCategory.text),
                            'expense': tdExpenseRatio.text,
                            'weight': tdWeighting.text
                        }
                    )                    
                }   
            }  
        }   
    })

    return etfInfo
}
