import { Fragment, useEffect, useState } from 'react'

import EditTable from '@/components/Page/EditTable'
import { updUserBoughtList, usePersistedUser } from '@/lib/firebaseResult'
import { fireToast } from '@/lib/toast'

export default function BoughtList({ boughtList }) {
  const user = usePersistedUser()

  const [data, setData] = useState([])

  const tableHeader = [
    { item: 'ticker', label: 'Ticker', type: 'text' },
    { item: 'total', label: 'Quantity', type: 'number' }
  ]

  useEffect(() => {
    setData(boughtList)
  }, [boughtList])

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
