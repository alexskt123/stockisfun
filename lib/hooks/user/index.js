import { useState, useEffect } from 'react'

export const useUserBoughtList = (user, userData) => {
  const [boughtList, setBoughtList] = useState(null)
  useEffect(() => {
    user && setBoughtList(userData?.boughtList)

    return () => setBoughtList(null)
  }, [user, userData])

  return boughtList
}
