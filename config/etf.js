//const selectedHeaders = "Issuer,Structure,Expense Ratio,Inception,Index Tracked,Category,Asset Class,52 Week Lo,52 Week Hi,AUM,1 Month Avg. Volume,3 Month Avg. Volume"
const selectedHeaders = "Issuer,Expense Ratio,Inception,Index Tracked,Category,52 Week Lo,52 Week Hi,AUM,1 Month Avg. Volume,3 Month Avg. Volume"

export const selectedHeadersArr = selectedHeaders.split(',')

export const etfDetailsSettings = {
    basics: {
        tableHeader: [],
        tableData: []
    },
    holding: {
        tableHeader: [],
        tableData: []
    },
    pieData: {},
    inputETFTicker: [],
    selectedStockTicker: '',
    selectedTab: 'Basics',
    priceHref: '/',
    forecastHref: '/'
}

export const etfHoldingHeader = ["Ticker", "Name", "Holding"]
