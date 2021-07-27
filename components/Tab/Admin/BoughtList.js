import { Fragment, useEffect, useState } from 'react'

import EditTable from '@/components/Page/EditTable'
import { fireToast } from '@/lib/commonFunction'
import { updUserBoughtList, usePersistedUser } from '@/lib/firebaseResult'

export function BoughtList({ userData }) {
  const user = usePersistedUser()

  const [data, setData] = useState([])

  const tableHeader = [
    { item: 'ticker', label: 'Ticker', type: 'text' },
    { item: 'total', label: 'Quantity', type: 'number' }
  ]

  useEffect(() => {
    if (userData) setData(userData.boughtList)
    return () => setData([])
  }, [userData])

  const onUpdate = async newData => {
    const data = newData
      .filter(x => x.ticker !== '' && x.total !== '')
      .map(item => {
        return {
          ...item,
          ticker: item.ticker.toUpperCase(),
          total: parseFloat(item.total)
        }
      })

    await updUserBoughtList(user.uid, data)

    fireToast({
      icon: 'success',
      title: 'Updated'
    })
  }

  return (
    <Fragment>
      <EditTable tableHeader={tableHeader} data={data} onUpdate={onUpdate} />
    </Fragment>
  )
}
