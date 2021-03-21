
import { Fragment, useState } from 'react'
import CustomContainer from '../components/Layout/CustomContainer'
import '../styles/ScrollMenu.module.css'
import Price from '../components/Parts/Price'
import Badge from 'react-bootstrap/Badge'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import CardDeck from 'react-bootstrap/CardDeck'
import { stockIndex, stockFutureIndex } from '../config/highlight'
import IndexQuote from '../components/Parts/IndexQuote'
import QuoteCard from '../components/Parts/QuoteCard'
import TickerScrollMenu from '../components/Page/TickerScrollMenu'
import TypeAhead from '../components/Page/TypeAhead'

export default function Highlight() {
  const [selectedTicker, setSelectedTicker] = useState(null)

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

  return (
    <Fragment>
      <CustomContainer style={{ minHeight: '100vh', fontSize: '14px' }}>
        <Fragment>
          {
            tickerList.map((item, idx) => {
              return (
                <Fragment key={idx}>
                  <Row className="justify-content-center">
                    <h5>
                      <Badge style={{ minWidth: '11rem' }} variant="dark">{item.name}</Badge>
                    </h5>
                  </Row>
                  <TickerScrollMenu inputList={item.inputList} setSelectedTicker={item.setSelectedTicker} />
                </Fragment>
              )
            })
          }
          <Row className="mt-3">
            <Col>
              <TypeAhead
                placeholderText={'i.e. ARKK / AAPL / AMZN'}
                handleChange={handleChange}
                filter={'ETF,Equity'}
              />
            </Col>
          </Row>
          <CardDeck>
            {selectedTicker ? headers
              .map((header, idx) => (
                <Fragment key={idx}>
                  <header.component header={header.name} inputTicker={selectedTicker.ticker} isShow={selectedTicker.show} {...header.props}></header.component>
                </Fragment>
              )) : null}
          </CardDeck>
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
