import axios from 'axios'
import JSSoup from 'jssoup'

import { selectedHeadersArr } from '../config/etf'

import { decode } from 'html-entities';

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


async function getHoldingResponse(ticker) {
    let response = {

    }

    try {
        response = await axios(`https://etfdb.com/etf/${ticker}/#holdings`)
    }
    catch {

    }

    return response.data

}

export const getETFDB = async (ticker) => {

    let etfInfo = {
        basicInfo: {},
        holdingInfo: []
    }
    let holding = []
    let basicInfo = {}

    let response = await getResponse(ticker)
    let soup = new JSSoup(response)
    const spans = soup.findAll('span');

    spans.forEach(span => {
        if (selectedHeadersArr.includes(span.text))
            basicInfo[span.text] = decode(span.nextSibling.text)

        if (span.attrs.id) {
            if (span.attrs.id == 'stock_price_value')
                basicInfo['Price'] = decode(span.text).replace(/\n/gi, '')
        }
    })


    response = await getHoldingResponse(ticker)
    soup = new JSSoup(response)
    // const tables = soup.findAll('table')

    // tables.forEach(table => {
    //     if (table.attrs['data-hash'] == 'etf-holdings') {
    //         const trs = tables.findAll('tr')

    //         trs.forEach(tr => {
    //             if (tr.attrs['data-index']) {
    //                 console.log(tr)
    //             }
    //         })
    //     }
    // })


    const tds = soup.findAll('td')

    tds.forEach((td,index) => {

        if (td.attrs['data-th'] && td.attrs['data-th'].match(/Symbol|Holding|% Assets/)) {

            holding.push(td.text)

            if (index != 0 && ((index + 1) % 3 == 2)) {

                etfInfo.holdingInfo.push(holding)
                holding = []
            }
        }
    })


    etfInfo.basicInfo = basicInfo
    

    return etfInfo
}
