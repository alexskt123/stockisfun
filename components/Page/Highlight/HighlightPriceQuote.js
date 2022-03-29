import { Fragment } from 'react'

import CardDeck from 'react-bootstrap/CardDeck'

import { highlightHeaders } from '@/config/highlight'

const HighlightPriceQuote = ({ ticker, data }) => {
  return (
    <Fragment>
      {data?.valid && (
        <CardDeck>
          {highlightHeaders?.map((header, idx) => (
            <Fragment key={idx}>
              <header.component
                header={header.name}
                inputTicker={ticker}
                isShow={true}
                {...header.props}
              ></header.component>
            </Fragment>
          ))}
        </CardDeck>
      )}
    </Fragment>
  )
}

export default HighlightPriceQuote
