import QuoteCard from './QuoteCard'
import Price from './Price'

const BirdMouthItem = ({ birdMouthOptions, priceInfo, item, tools }) => {
  return (
    <QuoteCard
      tools={tools}
      header={item.label}
      headerHref={'etforstock'}
      inputTicker={item.ticker}
      isShow={true}
      minWidth={'20rem'}
      noClose={true}
    >
      <Price
        inputTicker={item.ticker}
        inputMA={'ma'}
        options={birdMouthOptions}
        displayQuoteFields={priceInfo}
      />
    </QuoteCard>
  )
}

export default BirdMouthItem
