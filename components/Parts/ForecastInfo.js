import CompareSWR from '@/components/Parts/CompareSWR'
import {
  forecastTableFirstHeader,
  tableHeaderList as forecastTableHeaderList
} from '@/config/forecast'

const ForecastInfo = ({ inputTickers }) => {
  return (
    <CompareSWR
      inputTickers={inputTickers}
      url={'/api/forecast/getStockFairValue'}
      customOptions={{
        tableHeader: forecastTableHeaderList,
        tableFirstHeader: forecastTableFirstHeader
      }}
    />
  )
}

export default ForecastInfo
