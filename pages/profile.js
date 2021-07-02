import { Fragment } from 'react'

import CustomContainer from '@/components/Layout/CustomContainer'
import AccountSummary from '@/components/Page/Profile/AccountSummary'
import Performance from '@/components/Page/Profile/Performance'
import StockHighlight from '@/components/Page/Profile/StockHighlight'
import { staticSWROptions, fetcher } from '@/config/settings'
import { useUser } from '@/lib/firebaseResult'
import useSWR from 'swr'

const Profile = () => {
  const user = useUser()
  const { data: boughtListData } = useSWR(
    `/api/user/getUserBoughtListDetails?uid=${user?.uid}`,
    fetcher,
    staticSWROptions
  )

  return (
    <Fragment>
      <CustomContainer style={{ minHeight: '100vh' }}>
        <Fragment>
          <AccountSummary boughtListData={boughtListData} />
          <StockHighlight boughtListData={boughtListData} />
          <Performance boughtListData={boughtListData} />
        </Fragment>
      </CustomContainer>
    </Fragment>
  )
}

export default Profile
