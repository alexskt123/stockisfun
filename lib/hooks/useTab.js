import { useState, useEffect } from 'react'

export const useTab = router => {
  const [key, setKey] = useState(null)

  useEffect(() => {
    const { tab } = router.query

    setKey(tab)
  }, [router.query])

  return key
}
