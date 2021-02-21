
import { getYahooHistoryPrice } from '../../lib/yahoo/getYahooHistoryPrice'
import moment from 'moment-business-days'
import { ma } from 'moving-averages'
import QuickChart from 'quickchart-js'

import sendEmail from '../../lib/sendEmail'
import { getUsers } from '../../lib/firebaseResult'
import { getFormattedFromToDate } from '../../lib/commonFunction'

const axios = require('axios').default

export default async (req, res) => {

    const users = await getUsers()

    const tickerArr = users.find(x => x).stock.split(',').map(item => item.toUpperCase())

    let priceMADetails = {
        asOfDate: '',
        fiveLowerTwenty: [],
        fiveLowerTwentyChart: [],
        fiveHigherTwenty: [],
        fiveHigherTwentyChart: []
    }

    await axios.all(tickerArr.map(ticker => {
        return axios.get(`https://stockisfun.vercel.app/api/getPriceMADetails?ticker=${ticker}`).catch(err => console.log(err))
    }))
        .catch(error => console.log(error))
        .then((responses) => {
            if (responses)
                responses.forEach(item => {
                    if (item.data) {
                        priceMADetails.asOfDate == '' ? item.data.asOfDate : priceMADetails.asOfDate
                        priceMADetails.fiveLowerTwenty.push(...item.data.fiveLowerTwenty)
                        priceMADetails.fiveLowerTwentyChart.push(...item.data.fiveLowerTwentyChart)
                        priceMADetails.fiveHigherTwenty.push(...item.data.fiveHigherTwenty)
                        priceMADetails.fiveHigherTwentyChart.push(...item.data.fiveHigherTwentyChart)
                    }
                })
        })

    const fiveLowerTwentyList = priceMADetails.fiveLowerTwenty.reduce((acc, cur, index) => {
        acc += `<li><p>${cur}</p> <img src="${priceMADetails.fiveLowerTwentyChart[index]}"/> </li>`
        return acc
    }, '')
    const fiveHigherTwentyList = priceMADetails.fiveHigherTwenty.reduce((acc, cur, index) => {
        acc += `<li><p>${cur}</p> <img src="${priceMADetails.fiveHigherTwentyChart[index]}"/> </li>`
        return acc
    }, '')
    const inputArrList = tickerArr.reduce((acc, cur) => {
        acc += `<li>${cur}</li>`
        return acc
    }, '')

    let mailOptions = {
        from: process.env.EMAIL,
        to: users.find(x => x).email,
        subject: 'Moving Average Highlight',
        html: `
        <p>
            <b>As of ${priceMADetails.asOfDate}:</b>
        </p>
        <hr>
        <p>
            <b>5-MA lower than 20-MA</b>
            <ol>
                ${fiveLowerTwentyList}
            </ol>
        </p>
        <hr>
        <p>
            <b>5-MA higher than 20-MA</b>
            <ol>
                ${fiveHigherTwentyList}
            </ol>
        </p>
        <hr>
        <p>
            <b>Grabbing Ticker List:</b>
            <ol>
                ${inputArrList}
            </ol>
        </p>
        `
    };


    //await sendEmail(mailOptions)

    console.log(priceMADetails)

    res.statusCode = 200
    res.json({})
}
