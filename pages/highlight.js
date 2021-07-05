import React, { Fragment, useState } from 'react'

import CustomContainer from '@/components/Layout/CustomContainer'
import HighlightInfo from '@/components/Page/Highlight/HighlightInfo'
import HighlightSWRTable from '@/components/Page/Highlight/HighlightSWRTable'
import TickerScrollMenuList from '@/components/Page/TickerScrollMenuList'
import UserPriceDayChange from '@/components/Parts/UserPriceDayChange'
import WatchListSuggestions from '@/components/Parts/WatchListSuggestions'
import { highlightMenuTickerList } from '@/config/highlight'
import { showHighlightQuoteDetail } from '@/lib/commonFunction'
import { useUser, useUserData } from '@/lib/firebaseResult'
import { useRouter } from 'next/router'

import 'styles/ScrollMenu.module.css'

export default function Highlight() {
  const router = useRouter()

  const user = useUser()
  const userData = useUserData(user)

  //todo: wrap watchlist
  const [watchList, setwatchList] = useState([])
  const [watchListName, setWatchListName] = useState(null)

  const onClickWatchListButton = ({ label, list }) => {
    const isShow = watchListName !== label ? true : !(watchList.length > 0)
    isShow ? setwatchList(list) : setwatchList([])
    setWatchListName(label)
  }

  const showSWRDetail = input => {
    const inputQuery = {
      ticker: input?.symbol || null,
      type: 'detail'
    }
    showHighlightQuoteDetail(router, inputQuery)
  }

  return (
    <Fragment>
      <CustomContainer style={{ minHeight: '100vh', fontSize: '14px' }}>
        <Fragment>
          {user ? (
            <UserPriceDayChange userID={user.uid} userData={userData} />
          ) : null}
          <TickerScrollMenuList tickerList={highlightMenuTickerList} />

          <HighlightInfo query={router.query} />

          <WatchListSuggestions
            user={user}
            userData={userData}
            onClickWatchListButton={onClickWatchListButton}
          />
          <HighlightSWRTable
            watchList={watchList}
            showSWRDetail={showSWRDetail}
          />
        </Fragment>
      </CustomContainer>
    </Fragment>
  )
}
