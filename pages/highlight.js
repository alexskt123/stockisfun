import React, { Fragment, useState } from 'react'

import { useRouter } from 'next/router'

import CustomContainer from '@/components/Layout/CustomContainer'
import HighlightInfo from '@/components/Page/Highlight/HighlightInfo'
import HighlightSWRTable from '@/components/Page/Highlight/HighlightSWRTable'
import TickerScrollMenuList from '@/components/Page/TickerScrollMenuList'
import DivWithHeight from '@/components/Parts/DivWithHeight'
import UserPriceDayChange from '@/components/Parts/UserPriceDayChange'
import WatchListSuggestions from '@/components/Parts/WatchListSuggestions'
import { highlightMenuTickerList } from '@/config/highlight'
import { usePersistedUser, useUserData } from '@/lib/firebaseResult'

import 'styles/ScrollMenu.module.css'

export default function Highlight() {
  const router = useRouter()

  const user = usePersistedUser()
  const userData = useUserData(user)

  //todo: wrap watchlist
  const [watchList, setWatchList] = useState([])
  const [watchListName, setWatchListName] = useState(null)

  const onClickWatchListButton = ({ label, list }) => {
    const isShow = watchListName !== label || !(watchList.length > 0)
    const showList = (isShow && list) || []
    setWatchList(showList)
    setWatchListName(label)
  }

  return (
    <Fragment>
      <CustomContainer style={{ minHeight: '100vh', fontSize: '14px' }}>
        <Fragment>
          {user && userData && <UserPriceDayChange userData={userData} />}
          <TickerScrollMenuList tickerList={highlightMenuTickerList} />
          <WatchListSuggestions
            user={user}
            userData={userData}
            onClickWatchListButton={onClickWatchListButton}
          />
          <HighlightSWRTable watchList={watchList} />
          <HighlightInfo query={router.query} />
          <DivWithHeight style={{ height: '200px' }} />
        </Fragment>
      </CustomContainer>
    </Fragment>
  )
}
