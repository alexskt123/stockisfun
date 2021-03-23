
import { Fragment, useState, useEffect } from 'react'
import { useRouter } from 'next/router'

import CustomContainer from '../components/Layout/CustomContainer'
import TypeAhead from '../components/Page/TypeAhead'
import StockDetails from '../components/StockDetails'
import SearchAccordion from '../components/Page/SearchAccordion'

export default function StockDetail() {

  const [ticker, setTicker] = useState('')

  const router = useRouter()
  const { query } = router.query

  useEffect(() => {
    setTicker(query || '')
  }, [query])

  const handleChange = (e) => {
    const input = e.find(x => x)
    input ? router.push(`/stockdetail?query=${input.symbol}`) : null
  }

  const clearItems = () => {
    router.push('/stockdetail')
  }

  return (
    <Fragment>
      <CustomContainer style={{ minHeight: '100vh', fontSize: '14px' }}>
        <Fragment>
          <SearchAccordion inputTicker={ticker}>
            <TypeAhead
              placeholderText={'i.e. aapl'}
              handleChange={handleChange}
              clearItems={clearItems}
              filter={'Equity'}
            />
          </SearchAccordion>
          <StockDetails inputTicker={ticker} />
        </Fragment>
      </CustomContainer>
    </Fragment >
  )
}
