import { useEffect } from 'react'

export const useQuery = (handleTickers, { query, year }) => {
  useEffect(() => {
    const queryArr = query ? query.toUpperCase().split(',') : []
    handleTickers(queryArr, year)
    //todo: fix this hooks
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, year])
}
