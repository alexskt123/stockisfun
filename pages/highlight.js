import { Fragment, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import CustomContainer from '../components/Layout/CustomContainer'
import '../styles/ScrollMenu.module.css'

import Badge from 'react-bootstrap/Badge'
import Alert from 'react-bootstrap/Alert'
import CardDeck from 'react-bootstrap/CardDeck'
import { MdCancel } from 'react-icons/md'
import { IconContext } from 'react-icons'

import {
  highlightHeaders,
  highlightDetails,
  highlightMenuTickerList
} from '../config/highlight'
import HappyShare from '../components/Parts/HappyShare'
import { useUser, useUserData } from '../lib/firebaseResult'
import { fireToast } from '../lib/toast'
import WatchListSuggestions from '../components/Parts/WatchListSuggestions'
import UserPriceDayChange from '../components/Parts/UserPriceDayChange'
import TickerScrollMenuList from '../components/Page/TickerScrollMenuList'
import HighlightSearch from '../components/Page/HighlightSearch'
import HighlightSWRTable from '../components/Page/HighlightSWRTable'

const axios = require('axios').default

export default function Highlight() {
  const [selectedTicker, setSelectedTicker] = useState(null)
  const [watchList, setwatchList] = useState([])
  const [watchListName, setWatchListName] = useState(null)
  const [showPriceQuote, setShowPriceQuote] = useState(false)
  const [showDetail, setShowDetail] = useState({ type: null, show: false })

  const user = useUser()
  const userData = useUserData(user)

  const router = useRouter()
  const { query, type } = router.query

  const viewQuotePrice = selectedTicker => {
    setSelectedTicker({ ...selectedTicker, show: true })
    setShowDetail({ ...showDetail, show: false })
    setShowPriceQuote(true)

    //pushQuote()
  }

  const cancelCurrentSearch = () => {
    router.push('/highlight')
  }

  const showSelectedTicker = (data, ticker) => {
    setSelectedTicker({ ...selectedTicker, ticker, show: false })
    setShowDetail({ type: data.type, show: true })
    //pushDetail()
  }

  const pushQuote = () => {
    const type = !showPriceQuote ? { type: 'quote' } : {}
    router.push({ query: { query: router.query.query, ...type } }, undefined, {
      shallow: true
    })
  }

  const pushDetail = () => {
    const type = !showDetail.show ? { type: 'detail' } : {}
    const tab = router.query.tab
    router.push(
      {
        query: { query: router.query.query, tab: tab ? tab : 'Basics', ...type }
      },
      undefined,
      { shallow: true }
    )
  }

  const viewTickerDetail = async dataObj => {
    const ticker = dataObj.symbol || dataObj.ticker
    const response = await axios.get(`/api/quote?ticker=${ticker}`)
    const { data } = response || { data: null }

    data && data.valid
      ? data.type === 'ETF' || data.type === 'EQUITY'
        ? showSelectedTicker(data, ticker)
        : fireToast({
            icon: 'error',
            title: 'Only Stock/ETF can be viewed!'
          })
      : fireToast({
          icon: 'error',
          title: 'Please enter a valid symbol!'
        })

    setShowPriceQuote(false)
  }

  const onClickWatchListButton = (watchListButtonName, buttonWatchList) => {
    const isShow =
      watchListName !== watchListButtonName ? true : !(watchList.length > 0)
    isShow ? setwatchList(buttonWatchList) : setwatchList([])
    setWatchListName(watchListButtonName)
  }

  const setShowFalse = () => {
    setShowDetail({ ...showDetail, show: false })
    setShowPriceQuote(false)
  }

  const refreshQuoteDetail = () => {
    type && type === 'detail'
      ? viewTickerDetail({ ticker: query })
      : type && type === 'quote'
      ? viewQuotePrice({ ticker: query })
      : setShowFalse()
  }

  useEffect(() => {
    setShowPriceQuote(false)
    setShowDetail({ ...showDetail, show: false })
    setSelectedTicker({ ticker: query, show: true })
    query ? refreshQuoteDetail() : null
    //todo: fix custom hooks
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, type])

  return (
    <Fragment>
      <CustomContainer style={{ minHeight: '100vh', fontSize: '14px' }}>
        <Fragment>
          {user ? (
            <UserPriceDayChange userID={user.uid} userData={userData} />
          ) : null}
          <TickerScrollMenuList tickerList={highlightMenuTickerList} />
          <HighlightSearch />
          {selectedTicker && selectedTicker.ticker ? (
            <Alert
              style={{
                backgroundColor: '#f5f5f5',
                padding: '.3rem .3rem',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <strong>{'Current Search:'}</strong>
              <Badge className="ml-2" variant="info">
                {selectedTicker.ticker}
              </Badge>
              <IconContext.Provider value={{ color: 'red' }}>
                <MdCancel
                  onClick={() => cancelCurrentSearch()}
                  className="ml-1 cursor"
                />
              </IconContext.Provider>
              {query ? <HappyShare /> : null}
              <Badge
                as="button"
                className="ml-3"
                variant={showPriceQuote ? 'danger' : 'warning'}
                onClick={() => pushQuote()}
              >
                {showPriceQuote ? 'Hide Price/Quote' : 'Price/Quote'}
              </Badge>
              <Badge
                as="button"
                className="ml-2"
                variant={showDetail.show ? 'danger' : 'success'}
                onClick={() => pushDetail()}
              >
                {showDetail.show ? 'Hide Details' : 'Details'}
              </Badge>
            </Alert>
          ) : null}
          <CardDeck>
            {showPriceQuote && selectedTicker && selectedTicker.ticker
              ? highlightHeaders.map((header, idx) => (
                  <Fragment key={idx}>
                    <header.component
                      header={header.name}
                      inputTicker={selectedTicker.ticker}
                      isShow={selectedTicker.show}
                      {...header.props}
                    ></header.component>
                  </Fragment>
                ))
              : null}
          </CardDeck>
          {showDetail.show && selectedTicker && selectedTicker.ticker
            ? highlightDetails
                .filter(x => x.type === showDetail.type)
                .map((detail, idx) => (
                  <detail.component
                    key={idx}
                    inputTicker={selectedTicker.ticker}
                  />
                ))
            : null}
          <WatchListSuggestions
            onClickWatchListButton={onClickWatchListButton}
          />
          <HighlightSWRTable watchList={watchList} />
        </Fragment>
      </CustomContainer>
    </Fragment>
  )
}
