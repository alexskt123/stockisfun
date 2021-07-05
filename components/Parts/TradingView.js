import dynamic from 'next/dynamic'

const AdvancedChart = dynamic(
  () => import('react-tradingview-embed').then(mod => mod.AdvancedChart),
  { ssr: false }
)

const TradingView = ({ option }) => {
  const defaultOption = {
    symbol: 'AAPL',
    theme: 'light',
    interval: 'D',
    studies: ['Volume@tv-basicstudies'],
    allow_symbol_change: true
  }

  const newOption = {
    ...defaultOption,
    ...option
  }

  return <AdvancedChart widgetProps={newOption} />
}

export default TradingView
