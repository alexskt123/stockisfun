
import { Fragment, useState, useEffect, useContext } from 'react'
import { useRouter } from 'next/router'
import CustomContainer from '../components/Layout/CustomContainer'
import '../styles/ScrollMenu.module.css'
import Price from '../components/Parts/Price'
import Badge from 'react-bootstrap/Badge'
import Alert from 'react-bootstrap/Alert'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import CardDeck from 'react-bootstrap/CardDeck'
import { stockIndex, stockFutureIndex, tableHeaderList } from '../config/highlight'
import IndexQuote from '../components/Parts/IndexQuote'
import QuoteCard from '../components/Parts/QuoteCard'
import TickerScrollMenu from '../components/Page/TickerScrollMenu'
import TypeAhead from '../components/Page/TypeAhead'
import SWRTable from '../components/Page/SWRTable'
import { Store } from '../lib/store'
import { getUserInfoByUID } from '../lib/firebaseResult'
import { fireToast } from '../lib/toast'

const axios = require('axios').default

export default function Highlight() {
  const [selectedTicker, setSelectedTicker] = useState(null)
  const [watchList, setwatchList] = useState([])

  const store = useContext(Store)
  const { state } = store
  const { user } = state

  const router = useRouter()

  const headers = [{
    name: 'Price Changes',
    component: withQuoteCard(Price),
    props: {
      inputMA: ''
    }
  }, {
    name: 'Quote',
    component: withQuoteCard(IndexQuote),
    props: {}
  }]

  const tickerList = [
    {
      name: 'Stock Market Futures',
      eventKey: 'StockMarketFutureIndex',
      inputList: stockFutureIndex,
      setSelectedTicker: setSelectedTicker
    },
    {
      name: 'Stock Market Index',
      eventKey: 'StockMarketIndex',
      inputList: stockIndex,
      setSelectedTicker: setSelectedTicker
    }
  ]

  const handleChange = (e) => {
    const input = e.find(x => x)
    input ? setSelectedTicker({ ticker: input.symbol, show: true }) : null
  }

  const viewTickerDetail = async (dataObj) => {
    const response = await axios.get(`/api/quote?ticker=${dataObj.symbol || dataObj.ticker}`)
    const { data } = response || { data: null }

    if (data && data.valid) {
      const hyperlink = data.type === 'ETF' ? '/etfdetail' : data.type === 'EQUITY' ? '/stockdetail' : null
      hyperlink ? router.push(`${hyperlink}?query=${dataObj.symbol || dataObj.ticker}`)
        : fireToast({
          icon: 'error',
          title: 'Only Stock/ETF can be viewed!'
        })
    } else {
      fireToast({
        icon: 'error',
        title: 'Please enter a valid symbol!'
      })
    }

  }

  useEffect(async () => {
    const { watchList } = await getUserInfoByUID(user == null ? '' : user.uid)
    setwatchList(watchList)
  }, [user])

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
                  <TickerScrollMenu inputList={item.inputList} setSelectedTicker={item.setSelectedTicker} />
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
            selectedTicker ?
              <Alert style={{ backgroundColor: "#f5f5f5", padding: '.3rem .3rem' }}>
                <strong>{'Current Search:'}</strong>
                <Badge className="ml-2" variant="info">{selectedTicker.ticker}</Badge>
                <Badge as="button" className="ml-4" variant="success" onClick={() => viewTickerDetail(selectedTicker)}>{'View Detail'}</Badge>
              </Alert>
              : null
          }
          <CardDeck>
            {selectedTicker ? headers
              .map((header, idx) => (
                <Fragment key={idx}>
                  <header.component header={header.name} inputTicker={selectedTicker.ticker} isShow={selectedTicker.show} {...header.props}></header.component>
                </Fragment>
              )) : null}
          </CardDeck>
          {
            user.id != '' ? <Fragment>
              <Row className="justify-content-center">
                <h6>
                  <Badge style={{ minWidth: '5rem' }} variant="dark">{'Watch List'}</Badge>
                </h6>
              </Row>
              <SWRTable
                requests={watchList.map(x => ({ request: `/api/yahoo/getYahooQuote?ticker=${x}`, key: x }))}
                options={{ tableHeader: tableHeaderList, tableSize: 'sm', viewTickerDetail: viewTickerDetail, SWROptions: { refreshInterval: 3000 } }}
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
