import { getAPIResponse } from '@/lib/request'
import { getBalanceSheetData } from '@/lib/stockInfo'
import { getBalanceSheet } from '@/lib/yahoo/getBalanceSheet'

const getData = async args => {
  const { ticker } = args
  const balanceSheet = await getBalanceSheet(ticker)
  const balanceSheetExtract = getBalanceSheetData(balanceSheet)
  return [...balanceSheetExtract]
}

export default async (req, res) => {
  const response = await getAPIResponse(req, getData)

  res.statusCode = 200
  res.json(response)
}
