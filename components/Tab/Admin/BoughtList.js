import { Fragment, useEffect, useState } from 'react'

import { updUserBoughtList, useUser } from '../../../lib/firebaseResult'
import { fireToast } from '../../../lib/toast'
import EditTable from '../../Page/EditTable'

export default function BoughtList({ boughtList }) {
  const user = useUser()

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
