import { Fragment } from 'react'
import { useRouter } from 'next/router'
import CardDeck from 'react-bootstrap/CardDeck'

const HighlightPriceQuote = ({ highlightHeaders }) => {
  const router = useRouter()

  const { query, type, show } = router.query
  return (
    <Fragment>
      <CardDeck>
        {show && query && type === 'quote'
          ? highlightHeaders.map((header, idx) => (
              <Fragment key={idx}>
                <header.component
                  header={header.name}
                  inputTicker={query}
                  isShow={show}
                  {...header.props}
                ></header.component>
              </Fragment>
            ))
          : null}
      </CardDeck>
    </Fragment>
  )
}

export default HighlightPriceQuote
