
import { Fragment, useState } from 'react'
import CustomContainer from '../components/Layout/CustomContainer'
import '../styles/ScrollMenu.module.css'
import Price from '../components/Parts/Price'
import Badge from 'react-bootstrap/Badge'
import Row from 'react-bootstrap/Row'
import CardDeck from 'react-bootstrap/CardDeck'
import { stockIndex, stockFutureIndex } from '../config/highlight'
import IndexQuote from '../components/Parts/IndexQuote'
import QuoteCard from '../components/Parts/QuoteCard'
import TickerScrollMenu from '../components/Page/TickerScrollMenu'

export default function Highlight() {
  const [selectedTicker, setSelectedTicker] = useState(null)

  const headers = [{
    name: 'Quote',
    component: withQuoteCard(IndexQuote),
    props: {}
  }, {
    name: 'Price Changes',
    component: withQuoteCard(Price),
    props: {
      inputMA: ''
    }
  }]

  return (
    <Fragment>
      <CustomContainer style={{ minHeight: '100vh', fontSize: '14px' }}>
        <Fragment>
          <Row className="justify-content-center">
            <h4>
              <Badge variant="light">{'Stock Market Index'}</Badge>
            </h4>
          </Row>
          <TickerScrollMenu inputList={stockIndex} setSelectedTicker={setSelectedTicker} />
          <Row className="justify-content-center">
            <h4>
              <Badge variant="light">{'Stock Market Futures'}</Badge>
            </h4>
          </Row>
          <TickerScrollMenu inputList={stockFutureIndex} setSelectedTicker={setSelectedTicker} />
          <CardDeck className="mt-3">
            {selectedTicker ? headers
              .map((header, idx) => (
                <Fragment key={idx}>
                  <header.component header={header.name} inputTicker={selectedTicker} {...header.props}></header.component>
                </Fragment>
              )) : null}
          </CardDeck>
        </Fragment>
      </CustomContainer>
    </Fragment >
  )
}

function withQuoteCard(CardComponent) {
  return function QuoteCardComponent({ header, inputTicker, ...props }) {
    return (
      <QuoteCard header={header} inputTicker={inputTicker}>
        <CardComponent inputTicker={inputTicker} {...props} />
      </QuoteCard>
    )
  }
}
