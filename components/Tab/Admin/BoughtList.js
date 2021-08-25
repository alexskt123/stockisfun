import { Fragment } from 'react'

import EditTable from '@/components/Page/EditTable'
import DivWithHeight from '@/components/Parts/DivWithHeight'
import { tableHeader } from '@/config/admin'
import { fireToast } from '@/lib/commonFunction'
import { updateUserData } from '@/lib/firebaseResult'

export function BoughtList({ userData }) {
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

    await updateUserData(userData.docId, { boughtList: data })

    fireToast({
      icon: 'success',
      title: 'Updated'
    })
  }

  return (
    <Fragment>
      <EditTable
        tableHeader={tableHeader}
        data={userData.boughtList}
        onUpdate={onUpdate}
      />
      <DivWithHeight style={{ height: '100px' }} />
    </Fragment>
  )
}
