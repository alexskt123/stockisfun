import { Fragment, useState } from 'react'

import CustomContainer from '@/components/Layout/CustomContainer'
import TickerInput from '@/components/Page/TickerInput'
import QuoteCard from '@/components/Parts/QuoteCard'
import TradingView from '@/components/Parts/TradingView'
import { handleDebounceChange, handleFormSubmit } from '@/lib/commonFunction'
import { useQuery } from '@/lib/hooks/useQuery'
import { useRouter } from 'next/router'
import CardDeck from 'react-bootstrap/CardDeck'

export default function CompareTradingView() {
  const router = useRouter()
  const { query } = router.query

  const [settings, setSettings] = useState({ tickers: [] })
  const [validated, setValidated] = useState(false)
  const [formValue, setFormValue] = useState({})

  const handleChange = e => {
    setSettings({
      ...settings,
      tickers: []
    })
    handleDebounceChange(e, formValue, setFormValue)
  }

  const clearItems = () => {
    setSettings({
      ...settings,
      tickers: []
    })
    router.push(router.pathname)
  }

  const handleTickers = inputTickers => {
    setSettings({
      ...settings,
      tickers: inputTickers
    })
  }

  const handleSubmit = event => {
    handleFormSubmit(event, formValue, { query }, router, setValidated)
  }

  useQuery(handleTickers, { query })

  return (
    <Fragment>
      <CustomContainer style={{ minHeight: '100vh' }}>
        <Fragment>
          <TickerInput
            validated={validated}
            handleSubmit={handleSubmit}
            placeholderText={'Single:  aapl /  Multiple:  aapl,tdoc,fb,gh'}
            handleChange={handleChange}
            clearItems={clearItems}
            handleTickers={handleTickers}
          />
          <CardDeck>
            {settings?.tickers?.map((ticker, idx) => {
              return (
                <Fragment key={idx}>
                  <QuoteCard
                    isShow={true}
                    minWidth={'20rem'}
                    noClose={true}
                    className={'mt-2'}
                  >
                    <TradingView
                      option={{
                        symbol: ticker,
                        container_id: `advanced-chart-widget-container-${idx}`,
                        theme: 'dark'
                      }}
                    />
                  </QuoteCard>
                </Fragment>
              )
            })}
          </CardDeck>
        </Fragment>
      </CustomContainer>
    </Fragment>
  )
}
