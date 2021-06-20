
import { Fragment, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import CustomContainer from '../components/Layout/CustomContainer'
import '../styles/ScrollMenu.module.css'
import Price from '../components/Parts/Price'
import Badge from 'react-bootstrap/Badge'
import Alert from 'react-bootstrap/Alert'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import CardDeck from 'react-bootstrap/CardDeck'
import AnimatedNumber from 'animated-number-react'
import { MdCancel } from 'react-icons/md'
import { IconContext } from 'react-icons'

import { stockIndex, stockFutureIndex, tableHeaderList } from '../config/highlight'
import IndexQuote from '../components/Parts/IndexQuote'
import QuoteCard from '../components/Parts/QuoteCard'
import HappyShare from '../components/Parts/HappyShare'
import TickerScrollMenu from '../components/Page/TickerScrollMenu'
import TypeAhead from '../components/Page/TypeAhead'
import SWRTable from '../components/Page/SWRTable'
import { convertToPriceChange } from '../lib/commonFunction'
import { useUser, useUserData } from '../lib/firebaseResult'
import { fireToast } from '../lib/toast'
import StockDetails from '../components/StockDetails'
import ETFDetails from '../components/ETFDetails'
import WatchListSuggestions from '../components/Parts/WatchListSuggestions'

const PWAPrompt = dynamic(
  () => {
    return import('react-ios-pwa-prompt')
  },
  { ssr: false }
)

const axios = require('axios').default

export default function Highlight() {
  const [selectedTicker, setSelectedTicker] = useState(null)
  const [watchList, setwatchList] = useState([])
  const [boughtList, setBoughtList] = useState([])
  const [dayChange, setDayChange] = useState(null)
  const [watchListName, setWatchListName] = useState(null)
  const [showWatchList, setShowWatchList] = useState(false)
  const [showPriceQuote, setShowPriceQuote] = useState(false)
  const [showDetail, setShowDetail] = useState({ type: null, show: false })

  const user = useUser()
  const userData = useUserData(user)

  const router = useRouter()
  const { query, type } = router.query

  const headers = [{
    name: 'Price Changes',
    component: withQuoteCard(Price),
    props: {
      inputMA: 'ma'
    }
  }, {
    name: 'Quote',
    component: withQuoteCard(IndexQuote),
    props: {}
  }]

  const selectScrollMenuItem = (item) => {
    item && item.ticker ? router.push(`/highlight?query=${item.ticker}&type=quote`) : null
  }

  const tickerList = [
    {
      name: 'Stock Market Futures',
      eventKey: 'StockMarketFutureIndex',
      inputList: stockFutureIndex,
      selectScrollMenuItem: selectScrollMenuItem
    },
    {
      name: 'Stock Market Index',
      eventKey: 'StockMarketIndex',
      inputList: stockIndex,
      selectScrollMenuItem: selectScrollMenuItem
    }
  ]

  const handleChange = (e) => {
    const input = e.find(x => x)
    //input ? setSelectedTicker({ ticker: input.symbol, show: true }) : null
    //input ? router.push(`/highlight?query=${input.symbol}`) : null
    const type = router.query.type
    input ? router.push({ query: { ...router.query, query: input.symbol, tab: 'Basics', type: type ? type : 'quote' } }, undefined, { shallow: true }) : null
  }

  const viewQuotePrice = (selectedTicker) => {
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
    router.push({ query: { query: router.query.query, ...type } }, undefined, { shallow: true })
  }

  const pushDetail = () => {
    const type = !showDetail.show ? { type: 'detail' } : {}
    const tab = router.query.tab
    router.push({ query: { query: router.query.query, tab: tab ? tab : 'Basics', ...type } }, undefined, { shallow: true })
  }

  const viewTickerDetail = async (dataObj) => {
    const ticker = dataObj.symbol || dataObj.ticker
    const response = await axios.get(`/api/quote?ticker=${ticker}`)
    const { data } = response || { data: null }


    data && data.valid ? data.type === 'ETF' || data.type === 'EQUITY' ? showSelectedTicker(data, ticker)
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
    const isShow = watchListName !== watchListButtonName ? true : !showWatchList
    setwatchList(buttonWatchList)
    setShowWatchList(isShow)
    setWatchListName(watchListButtonName)
  }

  const refreshDayChange = async () => {
    await setBoughtListDayChange()

    fireToast({
      icon: 'success',
      title: 'Refreshed!'
    }) 
  }

  const setBoughtListDayChange = async () => {
    const boughtListSum = boughtList && boughtList.length > 0 ? await axios.get(`/api/getUserBoughtList?uid=${user.uid}`)
      : { data: { sum: null } }
    setDayChange(boughtListSum.data.sum)
  }

  const setShowFalse = () => {
    setShowDetail({ ...showDetail, show: false })
    setShowPriceQuote(false)
  }

  const refreshQuoteDetail = () => {
    type && type === 'detail' ? viewTickerDetail({ ticker: query })
    : type && type === 'quote' ? viewQuotePrice({ ticker: query })
      : setShowFalse()
  }

  useEffect(() => {
    const { watchList, boughtList } = userData
    setwatchList(watchList)
    setBoughtList(boughtList)
  }, [userData])

  useEffect(() => {
    (async () => {
      await setBoughtListDayChange()
    })()
  }, [boughtList])

  useEffect(() => {
    setShowPriceQuote(false)
    setShowDetail({...showDetail, show: false})
    setSelectedTicker({ ticker: query, show: true })
    query ? refreshQuoteDetail() : null
  }, [query])

  useEffect(() => {
    setShowPriceQuote(false)
    setShowDetail({...showDetail, show: false})
    query ? refreshQuoteDetail() : null
  }, [type])

  return (
    <Fragment>
      <CustomContainer style={{ minHeight: '100vh', fontSize: '14px' }}>
        <Fragment>
          {
            user ? <Fragment>
              <Row className="mt-1 justify-content-center">
                <Badge variant="light">{'Total Day Change:'}</Badge>
                <Badge variant={dayChange >= 0 ? 'success' : 'danger'} className="ml-1">
                  <AnimatedNumber
                    value={dayChange}
                    formatValue={(value) => convertToPriceChange(value)}
                  /></Badge>
                <Badge className="ml-1 cursor" variant="warning" onClick={() => refreshDayChange()}>{'Refresh'}</Badge>
              </Row>
            </Fragment>
              : null
          }
          {
            tickerList.map((item, idx) => {
              return (
                <Fragment key={idx}>
                  <Row className="justify-content-center mt-1">
                    <h6>
                      <Badge style={{ minWidth: '9rem' }} variant="dark">{item.name}</Badge>
                    </h6>
                  </Row>
                  <TickerScrollMenu inputList={item.inputList} setSelectedTicker={item.selectScrollMenuItem} />
                </Fragment>
              )
            })
          }
          <Row className="justify-content-center mt-1">
            <h6>
              <Badge style={{ minWidth: '9rem' }} variant="dark">{'Search'}</Badge>
            </h6>
          </Row>
          <Row>
            <Col>
              <TypeAhead
                placeholderText={'Search any Stock or ETF...'}
                handleChange={handleChange}
                filter={'ETF,Equity'}
              />
            </Col>
          </Row>
          {
            selectedTicker && selectedTicker.ticker ?
              <Alert style={{ backgroundColor: '#f5f5f5', padding: '.3rem .3rem', display: 'flex', alignItems: 'center' }}>
                <strong>{'Current Search:'}</strong>
                <Badge className="ml-2" variant="info">{selectedTicker.ticker}</Badge>
                <IconContext.Provider value={{ color: 'red' }}>
                  <MdCancel onClick={() => cancelCurrentSearch()} className="ml-1 cursor" />
                </IconContext.Provider>
                {query ? <HappyShare /> : null}
                <Badge as="button" className="ml-3" variant={showPriceQuote ? 'danger' : 'warning'} onClick={() => pushQuote()}>{showPriceQuote ? 'Hide Price/Quote' : 'Price/Quote'}</Badge>
                <Badge as="button" className="ml-2" variant={showDetail.show ? 'danger' : 'success'} onClick={() => pushDetail()}>{showDetail.show ? 'Hide Details' : 'Details'}</Badge>
              </Alert>
              : null
          }
          <CardDeck>
            {showPriceQuote && selectedTicker && selectedTicker.ticker ? headers
              .map((header, idx) => (
                <Fragment key={idx}>
                  <header.component header={header.name} inputTicker={selectedTicker.ticker} isShow={selectedTicker.show} {...header.props}></header.component>
                </Fragment>
              )) : null}
          </CardDeck>
          {
            showDetail.show && selectedTicker && selectedTicker.ticker ? showDetail.type === 'ETF' ? <ETFDetails inputTicker={selectedTicker.ticker} /> : <StockDetails inputTicker={selectedTicker.ticker} /> : null
          }
          <WatchListSuggestions onClickWatchListButton={onClickWatchListButton} />
          {
            showWatchList ? <Fragment>
              <SWRTable
                requests={watchList.map(x => ({ request: `/api/highlightWatchlist?ticker=${x}`, key: x }))}
                options={{ tableHeader: tableHeaderList, exportFileName: 'Watchlist.csv', tableSize: 'sm', SWROptions: { refreshInterval: 5000 } }}
              />
            </Fragment>
              : null
          }
          <PWAPrompt timesToShow={50} permanentlyHideOnDismiss={false} />
        </Fragment>
      </CustomContainer>
    </Fragment >
  )
}

function withQuoteCard(CardComponent) {
  return function QuoteCardComponent({ header, inputTicker, isShow, ...props }) {
    return (
      <QuoteCard header={header} inputTicker={inputTicker} isShow={isShow}>
        <CardComponent inputTicker={inputTicker} {...props} />
      </QuoteCard>
    )
  }
}
