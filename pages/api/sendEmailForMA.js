import nodemailer from 'nodemailer'

import { getYahooHistoryPrice } from '../../lib/yahoo/getYahooHistoryPrice'
import moment from 'moment-business-days'
import fedHolidays from '@18f/us-federal-holidays'
import { ma } from 'moving-averages'
import QuickChart from 'quickchart-js'

import { getUsers } from '../../lib/firebaseResult'

const handleDays = async (ticker, fromdate, todate) => {

    const outputItem = await getYahooHistoryPrice(ticker, fromdate, todate)

    return {
        date: (outputItem.timestamp || []).map(item => moment.unix(item).format("DD MMM YYYY")),
        price: outputItem.indicators.quote.find(x => x).close
    }
}

const getFromToDate = async (days) => {
    moment.updateLocale('us', {
        workingWeekdays: [1, 2, 3, 4, 5]
    });

    const options = { shiftSaturdayHolidays: true, shiftSundayHolidays: true };
    const holidays = fedHolidays.allForYear(moment().year(), options);

    let formattedToDate = moment();
    let formattedFromDate
    let cnt = 1
    let trial = 1

    while (cnt < days) {

        formattedFromDate = moment().subtract(trial, 'days').startOf('day');

        if (formattedFromDate.isBusinessDay()
            && holidays.map(holidayItem => {
                const holiday = holidayItem.date
                return holiday.getFullYear() == formattedFromDate.year()
                    && holiday.getMonth() == formattedFromDate.month()
                    && holiday.getDate() == formattedFromDate.date()
            }).filter(x => x == true).length <= 0)
            cnt += 1
        trial += 1

    }

    return {
        formattedFromDate: parseInt(formattedFromDate.valueOf() / 1000),
        formattedToDate: parseInt(formattedToDate.valueOf() / 1000)
    }

}

const getImgUrl = async (ticker, dateprice, ma5, ma20, ma60) => {
    const newChart = new QuickChart()

    newChart.setConfig(
        {
            type: 'line',
            data: {
                'labels': [...dateprice.date.reverse().slice(60)],
                'datasets': [{
                    label: ticker,
                    data: [...dateprice.price.slice(60)],
                    fill: false,
                    backgroundColor: "rgba(30,230,230,0.2)",
                    borderColor: "rgba(30,230,230,1)",
                    showLine: false
                }, {
                    label: '5-MA',
                    data: [...ma5.slice(60)],
                    fill: false,
                    backgroundColor: "rgba(200,12,12,0.2)",
                    borderColor: "rgba(200,12,12,1)",
                    pointRadius: 0
                }, {
                    label: '20-MA',
                    data: [...ma20.slice(60)],
                    fill: false,
                    backgroundColor: "rgba(220,220,20,0.2)",
                    borderColor: "rgba(220,220,20,1)",
                    pointRadius: 0
                }, {
                    label: '60-MA',
                    data: [...ma60.slice(60)],
                    fill: false,
                    backgroundColor: "rgba(75,50,10,0.2)",
                    borderColor: "rgba(75,50,10,1)",
                    pointRadius: 0
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: false
                        }
                    }]
                }
            }
        })
        .setWidth(400)
        .setHeight(200)
        .setBackgroundColor('transparent')

    return newChart.getUrl()
}

export default async (req, res) => {

    const users = await getUsers()

    const tickerArr = users.find(x => x).stock.split(',').map(item => item.toUpperCase())

    let fiveLowerTwenty = []
    let fiveLowerTwentyChart = []
    let fiveHigherTwenty = []
    let fiveHigherTwentyChart = []
    let asOfDate = ''

    const fromtodate = await getFromToDate(80)

    for (const ticker of tickerArr) {
        let dateprice = await handleDays(ticker, fromtodate.formattedFromDate, fromtodate.formattedToDate)
        asOfDate = dateprice.date.reverse().find(x => x)

        let ma5 = ma([...dateprice.price], 5)
        let ma20 = ma([...dateprice.price], 20)
        let ma60 = ma([...dateprice.price], 60)

        let ma5filter = [...ma5].reverse().slice(0, 2)
        let ma20filter = [...ma20].reverse().slice(0, 2)
        let ma60filter = [...ma60].reverse().slice(0, 2)

        let newChartUrl

        if (ma5filter.length == 2 && ma20filter.length == 2 && ma60filter.length == 2) {
            if (ma5filter[ma5filter.length - 1] >= ma20filter[ma20filter.length - 1]
                && ma5filter.find(x => x) < ma20filter.find(x => x)) {

                fiveLowerTwenty.push(ticker)

                newChartUrl = await getImgUrl(ticker, dateprice, ma5, ma20, ma60)
                fiveLowerTwentyChart.push(newChartUrl)
            }
        }

        if (ma5filter.length == 2 && ma20filter.length == 2 && ma60filter.length == 2) {
            if (ma5filter[ma5filter.length - 1] <= ma20filter[ma20filter.length - 1]
                && ma5filter.find(x => x) > ma20filter.find(x => x)) {
                fiveHigherTwenty.push(ticker)

                newChartUrl = await getImgUrl(ticker, dateprice, ma5, ma20, ma60)
                fiveHigherTwentyChart.push(newChartUrl)
            }
        }
    }

    const fiveLowerTwentyList = fiveLowerTwenty.reduce((acc, cur, index) => {
        acc += `<li><p>${cur}</p> <img src="${fiveLowerTwentyChart[index]}"/> </li>`
        return acc
    }, '')
    const fiveHigherTwentyList = fiveHigherTwenty.reduce((acc, cur, index) => {
        acc += `<li><p>${cur}</p> <img src="${fiveHigherTwentyChart[index]}"/> </li>`
        return acc
    }, '')
    const inputArrList = tickerArr.reduce((acc, cur) => {
        acc += `<li>${cur}</li>`
        return acc
    }, '')

    let mailOptions = {
        from: 'stockisfun2021@gmail.com',
        to: users.find(x => x).email,
        subject: 'Moving Average Highlight',
        html: `
        <p>
            <b>As of ${asOfDate}:</b>
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

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'stockisfun2021@gmail.com',
            pass: process.env.EMAIL_PW
        }
    })

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });


    res.statusCode = 200
    res.json('done')
}
