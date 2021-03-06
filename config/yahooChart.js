export const chartResponse = {
  chart: {
    result: [
      {
        timestamp: [],
        indicators: {
          quote: [
            {
              close: []
            }
          ]
        }
      }
    ]
  }
}

export const quoteResponse = {
  quoteResponse: {
    result: [],
    error: null
  }
}

export const keyStatResponse = {
  quoteSummary: {
    result: [
      {
        defaultKeyStatistics: {}
      }
    ],
    error: null
  }
}

export const recommendResponse = {
  quoteSummary: {
    result: [
      {
        recommendationTrend: {
          trend: []
        }
      }
    ]
  }
}

export const earningsResponse = {
  quoteSummary: {
    result: [
      {
        earnings: {
          financialsChart: {
            yearly: []
          }
        }
      }
    ]
  }
}
export const incomeResponse = {
  quoteSummary: {
    result: [
      {
        incomeStatementHistory: {
          incomeStatementHistory: []
        }
      }
    ]
  }
}

export const cashflowResponse = {
  quoteSummary: {
    result: [
      {
        cashflowStatementHistory: {
          cashflowStatements: []
        }
      }
    ]
  }
}

export const earningsDateResponse = {
  quoteSummary: {
    result: [
      {
        calendarEvents: {
          earnings: {
            earningsDate: [
              {
                raw: 'N/A',
                fmt: 'N/A'
              }
            ]
          }
        }
      }
    ]
  }
}

export const financialDataResponse = {
  quoteSummary: {
    result: [
      {
        financialData: {}
      }
    ]
  }
}

export const assetProfileResponse = {
  quoteSummary: {
    result: [
      {
        assetProfile: {}
      }
    ]
  }
}

export const balanceSheetResponse = {
  quoteSummary: {
    result: [
      {
        balanceSheetHistory: {
          balanceSheetStatements: []
        }
      }
    ]
  }
}
