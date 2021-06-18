import { useState, useEffect } from 'react'

export const useTab = (router) => {
  const [key, setKey] = useState(null)

  useEffect(() => {
    const { tab } = router.query

    if (tab) {
      setKey(tab)
    }
  }, [router.query.tab])

  return key
}
