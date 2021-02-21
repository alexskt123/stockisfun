
import { getYahooHistoryPrice } from '../../lib/yahoo/getYahooHistoryPrice'
import moment from 'moment-business-days'
import { ma } from 'moving-averages'
import QuickChart from 'quickchart-js'
import { getFormattedFromToDate } from '../../lib/commonFunction'


const handleDays = async (ticker, fromdate, todate) => {

    const outputItem = await getYahooHistoryPrice(ticker, fromdate, todate)

    return {
        date: (outputItem.timestamp || []).map(item => moment.unix(item).format("DD MMM YYYY")),
        price: outputItem.indicators.quote.find(x => x).close
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

    const { ticker } = req.query

    const fromtodate = await getFormattedFromToDate(80)

    let dateprice = await handleDays(ticker, fromtodate.formattedFromDate, fromtodate.formattedToDate)

    let fiveLowerTwenty = []
    let fiveLowerTwentyChart = []
    let fiveHigherTwenty = []
    let fiveHigherTwentyChart = []

    const asOfDate = dateprice.date.reverse().find(x => x)

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


    res.statusCode = 200
    res.json({
        asOfDate,
        fiveLowerTwenty,
        fiveLowerTwentyChart,
        fiveHigherTwenty,
        fiveHigherTwentyChart
    })
}
