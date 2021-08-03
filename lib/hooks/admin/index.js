import { useEffect, useState } from 'react'

import AccountSummary from '@/components/Page/Profile/AccountSummary'
import Performance from '@/components/Page/Profile/Performance'
import StockHighlight from '@/components/Page/Profile/StockHighlight'
import { getUserBoughtListDetails } from '@/lib/stockInfo'

const profileElementsSettings = boughtListData => [
  {
    component: AccountSummary,
    boughtListData,
    header: 'Account Summary',
    key: 'AccountSummary'
  },
  {
    component: Performance,
    boughtListData,
    header: 'Performance',
    key: 'Performance'
  },
  {
    component: StockHighlight,
    boughtListData,
    header: 'Stock Highlight',
    key: 'StockHighlight'
  }
]

export const useProfileElements = userData => {
  const [profileElements, setProfileElements] = useState(null)

  useEffect(() => {
    ;(async () => {
      const data = await getUserBoughtListDetails(userData)
      const elements = profileElementsSettings(data)
      setProfileElements(elements)
    })()
    return () => setProfileElements(null)
  }, [userData])

  return profileElements
}
