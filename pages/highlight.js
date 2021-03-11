
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
import Accordion from 'react-bootstrap/Accordion'
import Card from 'react-bootstrap/Card'

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
      name: 'Stock Market Index',
      eventKey: 'StockMarketIndex',
      inputList: stockIndex,
      setSelectedTicker: setSelectedTicker
    },
    {
      name: 'Stock Market Futures',
      eventKey: 'StockMarketFutureIndex',
      inputList: stockFutureIndex,
      setSelectedTicker: setSelectedTicker
    }
  ]

  return (
    <Fragment>
      <CustomContainer style={{ minHeight: '100vh', fontSize: '14px' }}>
        <Fragment>
          <Accordion defaultActiveKey="StockMarketIndex">
            {
              tickerList.map((item, idx) => {
                return (
                  <Card key={idx}>
                    <Accordion.Toggle as={Card.Header} eventKey={item.eventKey}>
                      <Row className="justify-content-center">
                        <h5>
                          <Badge variant="dark">{item.name}</Badge>
                        </h5>
                      </Row>
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey={item.eventKey}>
                      <Card.Body>
                        <TickerScrollMenu inputList={item.inputList} setSelectedTicker={item.setSelectedTicker} />
                      </Card.Body>
                    </Accordion.Collapse>
                  </Card>
                )
              })
            }
          </Accordion>
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
