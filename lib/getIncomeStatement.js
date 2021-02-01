import axios from 'axios'
import JSSoup from 'jssoup'

async function getContent(ticker) {
  
  //const response = await axios(`https://financials.morningstar.com/ratios/r.html?t=${ticker}&culture=en&platform=sal`)

   const response = await axios(`https://financialmodelingprep.com/api/v3/income-statement/${ticker}?apikey=762f11c03d1d2ab76cb52bf587e1eb40`)


   return response.data

  // const testdata = [ {
  //   "date" : "2019-12-31",
  //   "symbol" : "TSM",
  //   "reportedCurrency" : "TWD",
  //   "fillingDate" : "2019-12-31",
  //   "acceptedDate" : "2019-12-31",
  //   "period" : "FY",
  //   "revenue" : 1069988800000,
  //   "costOfRevenue" : 577286900000,
  //   "grossProfit" : 492701900000,
  //   "grossProfitRatio" : 0.46047388533412686,
  //   "researchAndDevelopmentExpenses" : 91418700000,
  //   "generalAndAdministrativeExpenses" : 28085800000,
  //   "sellingAndMarketingExpenses" : 6348600000,
  //   "otherExpenses" : 665100000,
  //   "operatingExpenses" : 119352200000,
  //   "costAndExpenses" : 696639100000,
  //   "interestExpense" : 3250900000,
  //   "depreciationAndAmortization" : 286884200000,
  //   "ebitda" : 679949400000,
  //   "ebitdaratio" : 0.635473380655947,
  //   "operatingIncome" : 373349700000,
  //   "operatingIncomeRatio" : 0.3643609166750157,
  //   "totalOtherIncomeExpensesNet" : 3573900000,
  //   "incomeBeforeTax" : 389862100000,
  //   "incomeBeforeTaxRatio" : 0.3643609166750157,
  //   "incomeTaxExpense" : 35835100000,
  //   "netIncome" : 353948000000,
  //   "netIncomeRatio" : 0.3307959859019085,
  //   "eps" : 66.6,
  //   "epsdiluted" : 66.6,
  //   "weightedAverageShsOut" : 5186076000,
  //   "weightedAverageShsOutDil" : 5186076000,
  //   "link" : "",
  //   "finalLink" : ""
  // }, {
  //   "date" : "2018-12-31",
  //   "symbol" : "TSM",
  //   "reportedCurrency" : "TWD",
  //   "fillingDate" : "2018-12-31",
  //   "acceptedDate" : "2018-12-31",
  //   "period" : "FY",
  //   "revenue" : 1031361800000,
  //   "costOfRevenue" : 533487500000,
  //   "grossProfit" : 497874300000,
  //   "grossProfitRatio" : 0.4827348656892276,
  //   "researchAndDevelopmentExpenses" : 85895600000,
  //   "generalAndAdministrativeExpenses" : 26253700000,
  //   "sellingAndMarketingExpenses" : 5987800000,
  //   "otherExpenses" : -127900000,
  //   "operatingExpenses" : 112821700000,
  //   "costAndExpenses" : 646309200000,
  //   "interestExpense" : 3051100000,
  //   "depreciationAndAmortization" : 292546300000,
  //   "ebitda" : 695255900000,
  //   "ebitdaratio" : 0.6741144572156929,
  //   "operatingIncome" : 385052600000,
  //   "operatingIncomeRatio" : 0.38545455144838603,
  //   "totalOtherIncomeExpensesNet" : 847300000,
  //   "incomeBeforeTax" : 397543100000,
  //   "incomeBeforeTaxRatio" : 0.38545455144838603,
  //   "incomeTaxExpense" : 34436900000,
  //   "netIncome" : 363052700000,
  //   "netIncomeRatio" : 0.35201294056072274,
  //   "eps" : 67.7,
  //   "epsdiluted" : 67.7,
  //   "weightedAverageShsOut" : 5186076000,
  //   "weightedAverageShsOutDil" : 5186076000,
  //   "link" : "",
  //   "finalLink" : ""
  // }, {
  //   "date" : "2017-12-31",
  //   "symbol" : "TSM",
  //   "reportedCurrency" : "TWD",
  //   "fillingDate" : "2017-12-31",
  //   "acceptedDate" : "2017-12-31",
  //   "period" : "FY",
  //   "revenue" : 977442600000,
  //   "costOfRevenue" : 482616200000,
  //   "grossProfit" : 494826400000,
  //   "grossProfitRatio" : 0.506245993370864,
  //   "researchAndDevelopmentExpenses" : 80732500000,
  //   "generalAndAdministrativeExpenses" : 27169200000,
  //   "sellingAndMarketingExpenses" : 5972500000,
  //   "otherExpenses" : 385500000,
  //   "operatingExpenses" : 108169300000,
  //   "costAndExpenses" : 590785500000,
  //   "interestExpense" : 3330300000,
  //   "depreciationAndAmortization" : 260142700000,
  //   "ebitda" : 659664800000,
  //   "ebitdaratio" : 0.6748885305387754,
  //   "operatingIncome" : 386657100000,
  //   "operatingIncomeRatio" : 0.4053045160912774,
  //   "totalOtherIncomeExpensesNet" : 3370400000,
  //   "incomeBeforeTax" : 396161900000,
  //   "incomeBeforeTaxRatio" : 0.4053045160912774,
  //   "incomeTaxExpense" : 51122900000,
  //   "netIncome" : 344998300000,
  //   "netIncomeRatio" : 0.3529601635942612,
  //   "eps" : 66.15,
  //   "epsdiluted" : 66.15,
  //   "weightedAverageShsOut" : 5186076000,
  //   "weightedAverageShsOutDil" : 5186076000,
  //   "link" : "",
  //   "finalLink" : ""
  // }, {
  //   "date" : "2016-12-31",
  //   "symbol" : "TSM",
  //   "reportedCurrency" : "TWD",
  //   "fillingDate" : "2016-12-31",
  //   "acceptedDate" : "2016-12-31",
  //   "period" : "FY",
  //   "revenue" : 947909200000,
  //   "costOfRevenue" : 473077100000,
  //   "grossProfit" : 474832100000,
  //   "grossProfitRatio" : 0.500925721577552,
  //   "researchAndDevelopmentExpenses" : 71207700000,
  //   "generalAndAdministrativeExpenses" : 25696400000,
  //   "sellingAndMarketingExpenses" : 5900800000,
  //   "otherExpenses" : 134400000,
  //   "operatingExpenses" : 96920800000,
  //   "costAndExpenses" : 569997900000,
  //   "interestExpense" : 3306100000,
  //   "depreciationAndAmortization" : 223828400000,
  //   "ebitda" : 611649500000,
  //   "ebitdaratio" : 0.6452616980613755,
  //   "operatingIncome" : 377911300000,
  //   "operatingIncomeRatio" : 0.4071293959379232,
  //   "totalOtherIncomeExpensesNet" : 4999000000,
  //   "incomeBeforeTax" : 385921700000,
  //   "incomeBeforeTaxRatio" : 0.4071293959379232,
  //   "incomeTaxExpense" : 54124400000,
  //   "netIncome" : 331713700000,
  //   "netIncomeRatio" : 0.34994248394255484,
  //   "eps" : 64.45,
  //   "epsdiluted" : 64.45,
  //   "weightedAverageShsOut" : 5186076000,
  //   "weightedAverageShsOutDil" : 5186076000,
  //   "link" : "",
  //   "finalLink" : ""
  // }, {
  //   "date" : "2015-12-31",
  //   "symbol" : "TSM",
  //   "reportedCurrency" : "TWD",
  //   "fillingDate" : "2015-12-31",
  //   "acceptedDate" : "2015-12-31",
  //   "period" : "FY",
  //   "revenue" : 843512500000,
  //   "costOfRevenue" : 433117600000,
  //   "grossProfit" : 410394900000,
  //   "grossProfitRatio" : 0.4865309049954802,
  //   "researchAndDevelopmentExpenses" : 65544600000,
  //   "generalAndAdministrativeExpenses" : 22921900000,
  //   "sellingAndMarketingExpenses" : 5664700000,
  //   "otherExpenses" : 43400000,
  //   "operatingExpenses" : 88665000000,
  //   "costAndExpenses" : 521782600000,
  //   "interestExpense" : 3190300000,
  //   "depreciationAndAmortization" : 222505600000,
  //   "ebitda" : 552604600000,
  //   "ebitdaratio" : 0.6551231902313244,
  //   "operatingIncome" : 321729900000,
  //   "operatingIncomeRatio" : 0.41549781419955245,
  //   "totalOtherIncomeExpensesNet" : 27808700000,
  //   "incomeBeforeTax" : 350477600000,
  //   "incomeBeforeTaxRatio" : 0.41549781419955245,
  //   "incomeTaxExpense" : 47644700000,
  //   "netIncome" : 302850900000,
  //   "netIncomeRatio" : 0.35903546183370133,
  //   "eps" : 59.1,
  //   "epsdiluted" : 59.1,
  //   "weightedAverageShsOut" : 5186057600,
  //   "weightedAverageShsOutDil" : 5186076000,
  //   "link" : "",
  //   "finalLink" : ""
  // } ]
  // return testdata
}

async function getResponse( ticker ) {
  const response = await getContent(ticker)

  return response

}

export const getIncomeStatement = async (ticker) => {
  const soupArr = []
  let responseArr = []

  // for (const item of grabItems) {
  //   responseArr = await getResponse(item)
  //   soupArr.push(...responseArr)
  // }


  responseArr = await getResponse(ticker)
  soupArr.push(...responseArr)

  return soupArr
}
