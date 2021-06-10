
import { Fragment, useState, useEffect, useContext } from 'react'
import { useRouter } from 'next/router'
import CustomContainer from '../components/Layout/CustomContainer'
import '../styles/ScrollMenu.module.css'
import Price from '../components/Parts/Price'
import Badge from 'react-bootstrap/Badge'
import Alert from 'react-bootstrap/Alert'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import CardDeck from 'react-bootstrap/CardDeck'

import { stockIndex, stockFutureIndex, tableHeaderList } from '../config/highlight'
import IndexQuote from '../components/Parts/IndexQuote'
import QuoteCard from '../components/Parts/QuoteCard'
import HappyShare from '../components/Parts/HappyShare'
import TickerScrollMenu from '../components/Page/TickerScrollMenu'
import TypeAhead from '../components/Page/TypeAhead'
import SWRTable from '../components/Page/SWRTable'
import { Store } from '../lib/store'
import { getUserInfoByUID } from '../lib/firebaseResult'
import { fireToast } from '../lib/toast'
import StockDetails from '../components/StockDetails'
import ETFDetails from '../components/ETFDetails'

const axios = require('axios').default

export default function Highlight() {
  const [selectedTicker, setSelectedTicker] = useState(null)
  const [watchList, setwatchList] = useState([])
  const [dayChange, setDayChange] = useState(null)
  const [showWatchList, setShowWatchList] = useState(false)
  const [showPriceQuote, setShowPriceQuote] = useState(false)
  const [showDetail, setShowDetail] = useState({ type: null, show: false })

  const store = useContext(Store)
  const { state } = store
  const { user } = state

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

  useEffect(async () => {
    const { watchList, boughtList } = await getUserInfoByUID(user == null ? '' : user.uid)
    setwatchList(watchList)
    const boughtListSum = boughtList && boughtList.length > 0 ? await axios.get(`/api/getUserBoughtList?uid=${user.uid}`)
      : { data: { sum: null } }
    setDayChange(boughtListSum.data.sum)
  }, [user])

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
            tickerList.map((item, idx) => {
              return (
                <Fragment key={idx}>
                  <Row className="justify-content-center">
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
              <Badge style={{ minWidth: '5rem' }} variant="dark">{'Search'}</Badge>
            </h6>
          </Row>
          <Row>
            <Col>
              <TypeAhead
                placeholderText={'i.e. ARKK / AAPL / AMZN'}
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
          {
            user.id != '' ? showWatchList ? <Fragment>
              <Row className="justify-content-center">
                <Button style={{ padding: '0.1rem' }} size="sm" variant="danger" onClick={() => setShowWatchList(false)}>{'Stop Watching!'}</Button>
              </Row>
              <SWRTable
                requests={watchList.map(x => ({ request: `/api/highlightWatchlist?ticker=${x}`, key: x }))}
                options={{ tableHeader: tableHeaderList, exportFileName: 'Watchlist.csv', tableSize: 'sm', viewTickerDetail: viewTickerDetail, SWROptions: { refreshInterval: 5000 } }}
              />
            </Fragment>
              : <Fragment>
                <Row className="justify-content-center">
                  <Badge variant="dark">{'Total Day Change:'}</Badge>
                  <Badge variant="light">{dayChange}</Badge>
                </Row>
                <Row className="mt-3 justify-content-center">
                  <Button style={{ padding: '0.1rem' }} size="sm" variant="success" onClick={() => setShowWatchList(true)}>{'Start Watching!'}</Button>
                </Row>
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
