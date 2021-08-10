import CompareSWR from '@/components/Parts/CompareSWR'
import { tableHeaderList as financialsTableHeaderList } from '@/config/financials'

const FinancialsInfo = ({ inputTickers }) => {
  return (
    <CompareSWR
      inputTickers={inputTickers}
      url={'/api/yahoo/getFinancials'}
      customOptions={{
        tableHeader: financialsTableHeaderList
      }}
    />
  )
}

export default FinancialsInfo
