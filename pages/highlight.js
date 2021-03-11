
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

  return (
    <Fragment>
      <CustomContainer style={{ minHeight: '100vh', fontSize: '14px' }}>
        <Fragment>
          <Row className="justify-content-center">
            <h4>
              <Badge variant="light">{'Stock Market Index'}</Badge>
            </h4>
          </Row>
          <TickerScrollMenu inputList={stockIndex} setSelectedTicker={setSelectedTicker}/>
          <Row className="justify-content-center">
            <h4>
              <Badge variant="light">{'Stock Market Futures'}</Badge>
            </h4>
          </Row>          
          <TickerScrollMenu inputList={stockFutureIndex} setSelectedTicker={setSelectedTicker}/>
          <CardDeck className="mt-3">
            {selectedTicker ? <Fragment><QuoteCard header="Quote" inputTicker={selectedTicker}><IndexQuote inputTicker={selectedTicker} /></QuoteCard></Fragment> : null}
            {selectedTicker ? <Fragment><QuoteCard header="Price Changes" inputTicker={selectedTicker}><Price inputTicker={selectedTicker} inputMA={''} /></QuoteCard></Fragment> : null}
          </CardDeck>
        </Fragment>
      </CustomContainer>
    </Fragment >
  )
}
