import { useEffect } from 'react'

export const useQuery = (handleTickers, { tickers, year }) => {
  useEffect(() => {
    const queryArr = (tickers && tickers.toUpperCase().split(',')) || []
    handleTickers(queryArr, year)
    //todo: fix this hooks
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tickers, year])
}
