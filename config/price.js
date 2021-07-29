import AddDelStock from '@/components/Fire/AddDelStock'
import HappyShare from '@/components/Parts/HappyShare'
import { convertToPercentage, getVariant } from '@/lib/commonFunction'

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
  pointHitRadius: 10
}

const year = new Date().getFullYear()
export const dateRangeByNoOfYears = async inputYears => {
  const noOfYears = !inputYears ? 15 : inputYears

  return [...Array(parseInt(noOfYears) + 1)]
    .map((_x, i) => [`${year - i}-01-01`, `${year - i}-12-31`, year - i])
    .map(x => ({ fromDate: x[0], toDate: x[1], year: x[2] }))
}

export const quoteFilterList = [
  {
    column: 'longName',
    label: 'Name'
  },
  {
    column: 'regularMarketPrice',
    label: 'Current Price'
  },
  {
    column: 'trailingPE',
    label: 'Trailing PE'
  },
  {
    column: 'priceToBook',
    label: 'Price to book'
  },
  {
    column: 'forwardPE',
    label: 'Forward PE'
  },
  {
    column: 'fiftyDayAverage',
    label: '50 Day Avg'
  },
  {
    column: 'twoHundredDayAverage',
    label: '200 Day Avg'
  }
]

export const priceSchema = {
  ticker: '',
  days: 30,
  ma: 'ma',
  chartData: {}
}

export const birdMouthOptions = {
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    y: {
      ticks: {
        maxTicksLimit: 6,
        color: 'black',
        font: {
          weight: 'bold'
        }
      }
    },
    x: {
      ticks: {
        display: false
      },
      grid: {
        display: false
      }
    }
  }
}

export const priceChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      labels: {
        usePointStyle: true
      }
    }
  },
  scales: {
    y: {
      ticks: {
        maxTicksLimit: 6,
        color: 'black',
        font: {
          weight: 'bold'
        }
      }
    },
    x: {
      // TO-DO: set time property
      // type: 'time',
      // time: {
      //   // Luxon format string
      //   tooltipFormat: 'DD T'
      // },
      ticks: {
        // maxTicksLimit: 7,
        // color: 'black',
        // font: {
        //   weight: 'bold'
        // }
        display: false
      },
      grid: {
        display: false
      }
    }
  }
}

export const priceChartSettings = {
  label: '',
  data: [],
  fill: false,
  backgroundColor: 'rgba(18,24,200)',
  borderColor: 'rgba(18,24,200,0.8)',
  showLine: false,
  pointRadius: 3
}

export const maChartSchema = {
  data: [],
  fill: false,
  pointRadius: 0
}

export const maChartSettings = [
  {
    value: 5,
    label: '5-MA',
    backgroundColor: 'rgba(255,2,2)',
    borderColor: 'rgba(255,2,2,0.5)'
  },
  {
    value: 20,
    label: '20-MA',
    backgroundColor: 'rgba(218,165,32)',
    borderColor: 'rgba(218,165,32,0.8)'
  },
  {
    value: 60,
    label: '60-MA',
    backgroundColor: 'rgba(0,128,0)',
    borderColor: 'rgba(0,128,0,0.8)'
  }
]

export const priceMADetailsSettings = {
  asOfDate: '',
  priceMAList: [
    {
      id: '5<20',
      name: '5-MA lower than 20-MA',
      tickersInfo: [],
      tickersChart: []
    },
    {
      id: '5>20',
      name: '5-MA higher than 20-MA',
      tickersInfo: [],
      tickersChart: []
    },
    {
      id: '5<60',
      name: '5-MA lower than 60-MA',
      tickersInfo: [],
      tickersChart: []
    },
    {
      id: '5>60',
      name: '5-MA higher than 60-MA',
      tickersInfo: [],
      tickersChart: []
    },
    {
      id: '20<60',
      name: '20-MA lower than 60-MA',
      tickersInfo: [],
      tickersChart: []
    },
    {
      id: '20>60',
      name: '20-MA higher than 60-MA',
      tickersInfo: [],
      tickersChart: []
    }
  ]
}

export const maChkRange = 5

export const dateRangeSelectAttr = {
  formControl: {
    size: 'sm',
    as: 'select',
    className: 'my-1 mr-sm-2',
    name: 'formYear'
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
    size: 'sm',
    as: 'select',
    className: 'my-1 mr-sm-2',
    name: 'formMA'
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

export const priceTabLabelPairs = inputTicker =>
  inputTicker
    ? [
        [
          {
            name: 'Name',
            value: '',
            showLabel: true,
            append: [
              <AddDelStock
                key={'AddDelStock'}
                inputTicker={inputTicker}
                handleList="stock"
              />,
              <HappyShare key={'HappyShare'} />
            ]
          }
        ],
        [
          {
            name: 'Price',
            value: '',
            showLabel: true
          },
          {
            name: 'Price%',
            value: '',
            showLabel: false,
            format: e => convertToPercentage(e / 100),
            variant: getVariant
          },
          {
            name: '52W-L-H',
            value: '',
            showLabel: true
          }
        ],
        [
          {
            name: 'Floating Shares',
            value: '',
            showLabel: true
          },
          {
            name: 'Market Cap.',
            value: '',
            showLabel: true
          }
        ],
        [
          {
            name: 'Industry',
            value: '',
            showLabel: true
          }
        ]
      ]
    : []
