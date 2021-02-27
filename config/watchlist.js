

export const tableHeaderList = [
    {
        label: 'Ticker',
        item: 'symbol'
    },
    {
        label: 'Pre Time',
        item: 'preMarketTime',
        format: 'H:mm:ss'
    },
    {
        label: 'Pre Market',
        item: 'preMarketPrice'
    },
    {
        label: 'Pre Market%',
        item: 'preMarketChangePercent',
        format: '%'
    },
    {
        label: 'Market',
        item: 'regularMarketPrice'
    },
    {
        label: 'Day Chg%',
        item: 'regularMarketChangePercent',
        format: '%'
    },
    {
        label: 'Volume',
        item: 'regularMarketVolume',
        format: 'millify'
    },
    {
        label: 'Day Range',
        item: 'regularMarketDayRange'
    },
    {
        label: 'Previous Close',
        item: 'regularMarketPreviousClose'
    }
]