import { useEffect } from 'react'

export const useQuery = (handleTickers, query) => {
  useEffect(() => {
    if (query) {
      handleTickers(query.toUpperCase().split(','))
    }
  }, [query])
}

