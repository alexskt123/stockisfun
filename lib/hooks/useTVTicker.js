import { useState, useEffect } from 'react'

export const useTVTicker = ticker => {
  const [symbol, setSymbol] = useState(ticker)

  useEffect(() => {
    const tvSymbol = ticker.replace(/\.(.*)/, '')
    setSymbol(tvSymbol)
  }, [ticker])

  return symbol
}
