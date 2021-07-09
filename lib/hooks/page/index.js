import { useState, useEffect } from 'react'

export const useQueryTicker = query => {
  const [ticker, setTicker] = useState(null)

  useEffect(() => {
    setTicker(query || null)
  }, [query])

  return ticker
}
