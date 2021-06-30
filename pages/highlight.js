import { Fragment, useState } from 'react'

import CustomContainer from '@/components/Layout/CustomContainer'
import 'styles/ScrollMenu.module.css'
import HighlightDetail from '@/components/Page/Highlight/HighlightDetail'
import HighlightPriceQuote from '@/components/Page/Highlight/HighlightPriceQuote'
import HighlightSearch from '@/components/Page/Highlight/HighlightSearch'
import HighlightSWRTable from '@/components/Page/Highlight/HighlightSWRTable'
import HighlightTickerAlert from '@/components/Page/Highlight/HighlightTickerAlert'
import TickerScrollMenuList from '@/components/Page/TickerScrollMenuList'
import UserPriceDayChange from '@/components/Parts/UserPriceDayChange'
import WatchListSuggestions from '@/components/Parts/WatchListSuggestions'
import { highlightMenuTickerList } from '@/config/highlight'
import { useUser, useUserData } from '@/lib/firebaseResult'
import { useRouter } from 'next/router'

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

  return (
    <Fragment>
      <CustomContainer style={{ minHeight: '100vh', fontSize: '14px' }}>
        <Fragment>
          {user ? (
            <UserPriceDayChange userID={user.uid} userData={userData} />
          ) : null}
          <TickerScrollMenuList tickerList={highlightMenuTickerList} />

          {/* //todo: group together */}
          <HighlightSearch />
          <HighlightTickerAlert />
          <HignlightInfo query={router.query} />

          <WatchListSuggestions
            user={user}
            userData={userData}
            onClickWatchListButton={onClickWatchListButton}
          />
          <HighlightSWRTable watchList={watchList} />
        </Fragment>
      </CustomContainer>
    </Fragment>
  )
}

function HignlightInfo({ query }) {
  const { type, query: ticker } = query

  //todo: use json instead of switch
  switch (type) {
    case 'quote':
      return <HighlightPriceQuote query={ticker} />
    case 'detail':
      return <HighlightDetail query={ticker} />

    default:
      return null
  }
}
