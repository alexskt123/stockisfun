import { useEffect } from 'react'

export const useQuery = (handleTickers, { query, year }) => {
  useEffect(() => {
    const queryArr = query ? query.toUpperCase().split(',') : []
    handleTickers(queryArr, year)

  }, [query, year])
}

