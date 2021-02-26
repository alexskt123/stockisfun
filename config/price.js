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
export const dateRange = [...Array(16)].map((x, i) => [`${year - i}-01-01`, `${year - i}-12-31`]).map(x => ({ "fromDate": x[0], "toDate": x[1] }))

export const dateRangeByNoOfYears = async (inputYears) => {
  let noOfYears = 15
  noOfYears = !inputYears ? noOfYears : inputYears

  //return Array.from({length: noOfYears + 1}, (x, i) => [`${year-i}-01-01`,`${year-i}-12-31`]).map(x=>({"fromDate":x[0],"toDate":x[1]}))
  return [...Array(parseInt(noOfYears) + 1)].map((x, i) => [`${year - i}-01-01`, `${year - i}-12-31`]).map(x => ({ "fromDate": x[0], "toDate": x[1] }))
}

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

export const priceSchema = {
  ticker: '',
  days: 30,
  ma: 'ma',
  chartData: {
    'labels': [],
    'datasets': []
  }
}

export const priceChartSettings = {
  label: '',
  data: [],
  fill: false,
  backgroundColor: "rgba(30,230,230,0.2)",
  borderColor: "rgba(30,230,230,1)",
  showLine: false,
  pointRadius: 3
}

export const ma5ChartSettings = {
  label: '5-MA',
  data: [],
  fill: false,
  backgroundColor: "rgba(200,12,12,0.2)",
  borderColor: "rgba(200,12,12,1)",
  pointRadius: 0
}

export const ma20ChartSettings = {
  label: '20-MA',
  data: [],
  fill: false,
  backgroundColor: "rgba(220,220,20,0.2)",
  borderColor: "rgba(220,220,20,1)",
  pointRadius: 0
}

export const ma60ChartSettings = {
  label: '60-MA',
  data: [],
  fill: false,
  backgroundColor: "rgba(75,50,10,0.2)",
  borderColor: "rgba(75,50,10,1)",
  pointRadius: 0
}

export const dateRangeSelectAttr = {
  formControl: {
    size: "sm",
    as: "select",
    className: "my-1 mr-sm-2",
    name: "formYear"
  },
  dateRangeOptions: [
    {
      label: '5D',
      value: '5'
    },
    {
      label: '10D',
      value: '10'
    },
    {
      label: '30D',
      value: '30'
    },
    {
      label: '3M',
      value: '90'
    },
    {
      label: '6M',
      value: '120'
    },
    {
      label: '1Y',
      value: '365'
    },
    {
      label: '3Y',
      value: '1095'
    }
  ]
}

export const maSelectAttr = {
  formControl: {
    size: "sm",
    as: "select",
    className: "my-1 mr-sm-2",
    name: "formma"
  },
  maOptions: [
    {
      label: 'N/A',
      value: ''
    },
    {
      label: 'MA',
      value: 'ma'
    },
    {
      label: 'EMA',
      value: 'ema'
    }
  ]
}

export const priceTabLabelPairs = [
  {
    name: 'Name',
    value: ''
  },
  {
    name: 'Price',
    value: ''
  },
  {
    name: '52W-Low-High',
    value: ''
  },
  {
    name: 'Market Cap.',
    value: ''
  },
  {
    name: 'Industry',
    value: ''
  }
]

