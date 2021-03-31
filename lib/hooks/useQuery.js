import { useEffect } from 'react'

export const useQuery = (handleTickers, {query, year}) => {
  useEffect(() => {
    if (query && year) {
      handleTickers(query.toUpperCase().split(','), year)
    }
    else if (query) {
      handleTickers(query.toUpperCase().split(','))
    }
    else {
      handleTickers([])
    }
  }, [query, year])
}

