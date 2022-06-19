import { Fragment } from 'react'

import CardGroup from 'react-bootstrap/CardGroup'

import { highlightHeaders } from '@/config/highlight'

const HighlightPriceQuote = ({ ticker, data }) => {
  return (
    <Fragment>
      {data?.valid && (
        <CardGroup>
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
        </CardGroup>
      )}
    </Fragment>
  )
}

export default HighlightPriceQuote
