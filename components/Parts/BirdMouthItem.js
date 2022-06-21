import Price from './Price'
import QuoteCard from './QuoteCard'

const BirdMouthItem = ({
  birdMouthOptions,
  priceInfo,
  item,
  tools,
  rsTicker
}) => {
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
        inputDays={90}
        options={birdMouthOptions}
        displayQuoteFields={priceInfo}
        inputShowRS={true}
        rsTicker={rsTicker}
      />
    </QuoteCard>
  )
}

export default BirdMouthItem
