import { Fragment } from 'react'

import { highlightHeaders } from '@/config/highlight'
import CardDeck from 'react-bootstrap/CardDeck'

const HighlightPriceQuote = ({ query }) => {
  return (
    <Fragment>
      <CardDeck>
        {highlightHeaders?.map((header, idx) => (
          <Fragment key={idx}>
            <header.component
              header={header.name}
              inputTicker={query}
              isShow={true}
              {...header.props}
            ></header.component>
          </Fragment>
        ))}
      </CardDeck>
    </Fragment>
  )
}

export default HighlightPriceQuote
