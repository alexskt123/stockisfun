import { useState, useEffect } from 'react'

export const useUserBoughtList = (user, userData) => {
  const [boughtList, setBoughtList] = useState(null)
  useEffect(() => {
    ;(async () => {
      if (user) setBoughtList(userData?.boughtList)
    })()
    return () => setBoughtList(null)
  }, [user, userData])

  return boughtList
}
