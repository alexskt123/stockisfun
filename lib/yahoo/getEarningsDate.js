import { earningsDateResponse } from '@/config/yahooChart'
import ModuleQuote from '@/lib/class/moduleQuote'

async function getResponse(ticker) {
  const quote = new ModuleQuote(ticker)
  await quote.requestModule('calendarEvents')
  const resData = quote.moduleData

  return {
    ...earningsDateResponse,
    ...(resData || {})
  }
}

export const getEarningsDate = async ticker => {
  const response = await getResponse(ticker)
  const earningsDate = response.quoteSummary.result
    .find(x => x)
    .calendarEvents.earnings.earningsDate.find(x => x)
  return (
    earningsDate || {
      raw: 'N/A',
      fmt: 'N/A'
    }
  )
}
