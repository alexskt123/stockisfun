
import { Fragment, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
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
  const { query } = router.query

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
    item && item.ticker ? router.push(`/highlight?query=${item.ticker}`) : null
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
    input ? router.push(`/highlight?query=${input.symbol}`) : null
  }

  const viewQuotePrice = () => {
    setSelectedTicker({ ...selectedTicker, show: !showPriceQuote })
    setShowDetail({ ...showDetail, show: false })
    setShowPriceQuote(!showPriceQuote)
  }

  const cancelCurrentSearch = () => {
    router.push('/highlight')
  }

  const showSelectedTicker = (data) => {
    setSelectedTicker({ ...selectedTicker, show: false })
    setShowDetail({ type: data.type, show: !showDetail.show })
  }

  const viewTickerDetail = async (dataObj) => {
    const response = await axios.get(`/api/quote?ticker=${dataObj.symbol || dataObj.ticker}`)
    const { data } = response || { data: null }


    data && data.valid ? data.type === 'ETF' || data.type === 'EQUITY' ? showSelectedTicker(data)
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

  const setBoughtListDayChange = async () => {
    const boughtListSum = boughtList && boughtList.length > 0 ? await axios.get(`/api/getUserBoughtList?uid=${userData.id}`)
      : { data: { sum: null } }
    setDayChange(boughtListSum.data.sum)
  }

  useEffect(() => {
    const { watchList, boughtList } = userData
    setwatchList(watchList)
    setBoughtList(boughtList)
  }, [userData])

  useEffect(() => {
    (async () => {
      await setBoughtListDayChange()
    })
  }, [boughtList])


  useEffect(() => {
    setSelectedTicker({ ticker: query, show: true })
    setShowDetail({ type: null, show: false })
    setShowPriceQuote(true)
  }, [query])

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
                <Badge className="ml-1 cursor" variant="warning" onClick={() => setBoughtListDayChange()}>{'Refresh'}</Badge>
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
                <Badge as="button" className="ml-3" variant={showPriceQuote ? 'danger' : 'warning'} onClick={() => viewQuotePrice()}>{showPriceQuote ? 'Hide Price/Quote' : 'Price/Quote'}</Badge>
                <Badge as="button" className="ml-2" variant={showDetail.show ? 'danger' : 'success'} onClick={() => viewTickerDetail(selectedTicker)}>{showDetail.show ? 'Hide Details' : 'Details'}</Badge>
              </Alert>
              : null
          }
          <CardDeck>
            {selectedTicker && selectedTicker.ticker ? headers
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
