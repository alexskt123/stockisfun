export const chartDataSet = {
    fill: false,
    lineTension: 0.1,
    borderCapStyle: 'butt',
    borderDash: [],
    borderDashOffset: 0.0,
    borderJoinStyle: 'miter',
    pointBackgroundColor: '#fff',
    pointBorderWidth: 1,
    pointHoverRadius: 5,
    pointHoverBorderColor: 'rgba(220,220,220,1)',
    pointHoverBorderWidth: 2,
    pointRadius: 1,
    pointHitRadius: 10,
}

const year = new Date().getFullYear()
export const dateRange = [...Array(16)].map((x,i)=>[`${year-i}-01-01`,`${year-i}-12-31`]).map(x=>({"fromDate":x[0],"toDate":x[1]}))

// [
//     {
//         'fromDate': '2021-01-01',
//         'toDate': '2021-12-31'
//     },
//     {
//         'fromDate': '2020-01-01',
//         'toDate': '2020-12-31'
//     }
// ]

export const quoteFilterList = [
    {
      'column': 'longName',
      'label': 'Name'
    },
    {
      'column': 'regularMarketPrice',
      'label': 'Current Price'
    },
    {
      'column': 'trailingPE',
      'label': 'Trailing PE'
    },
    {
      'column': 'priceToBook',
      'label': 'Price to book'
    },
    {
      'column': 'forwardPE',
      'label': 'Forward PE'
    },
    {
      'column': 'fiftyDayAverage',
      'label': '50 Day Avg'
    }
    ,
    {
      'column': 'twoHundredDayAverage',
      'label': '200 Day Avg'
    }
  ]