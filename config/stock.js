
export const etfListSettings = {
  etfList: {
    tableHeader: [],
    tableData: []
  },
  etfCount: ''
}

export const stockDetailsSettings = {
  basics: {
    tableHeader: [],
    tableData: []
  },
  officers: {
    tableHeader: [],
    tableData: []
  },
  balanceSheet: {
    tableHeader: [],
    tableData: [],
    chartData: {

    },
    chartOptions: {}
  },
  earnings: {
    tableHeader: [],
    tableData: [],
    chartData: {

    },
    chartOptions: {
      
    }
  },
  peers: {
    tableHeader: [],
    tableData: []
  },
  inputTickers: [],
  ...etfListSettings
}

export const officersTableHeader = ['Officers Name', 'Title', 'Age', 'Pay']
