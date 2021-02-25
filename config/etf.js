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
    selectedStockTitle: '',
    selectedTab: 'Basics',
    priceHref: '/',
    forecastHref: '/',
    disableSelectedStockTab: true
}

export const etfHoldingHeader = ["Ticker", "Name", "Holding", "This Yr %", "Last Yr %", "Last 2Yr %", "Last 3Yr %"]

export const aumSumCount = 10
