import { useEffect, useState } from 'react'

export const useUserEmailSubscription = (user, userData, item) => {
  const [inputData, setInputData] = useState(item)

  useEffect(() => {
    const userEmailData = userData?.emailConfig?.find(x => x.id === item.id)
    setInputData(userEmailData || { ...item, to: user?.email })
  }, [item, user, userData])

  return inputData
}
