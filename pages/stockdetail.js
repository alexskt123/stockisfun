import { Fragment, useState, useEffect } from 'react'

import CustomContainer from '@/components/Layout/CustomContainer'
import SearchAccordion from '@/components/Page/SearchAccordion'
import TypeAhead from '@/components/Page/TypeAhead'
import StockDetails from '@/components/StockDetails'
import { useRouter } from 'next/router'

export default function StockDetail() {
  const [ticker, setTicker] = useState('')

  const router = useRouter()
  const { query } = router.query

  useEffect(() => {
    setTicker(query || '')
  }, [query])

  const handleChange = e => {
    const input = e.find(x => x)
    input
      ? router.push({ query: { ...router.query, query: input.symbol } })
      : null
  }

  const clearItems = () => {
    router.push({ query: { ...router.query, query: null } })
  }

  return (
    <Fragment>
      <CustomContainer style={{ minHeight: '100vh', fontSize: '14px' }}>
        <Fragment>
          <SearchAccordion inputTicker={ticker}>
            <TypeAhead
              placeholderText={'i.e. AAPL'}
              handleChange={handleChange}
              clearItems={clearItems}
              filter={'Equity'}
            />
          </SearchAccordion>
          <StockDetails inputTicker={ticker} />
        </Fragment>
      </CustomContainer>
    </Fragment>
  )
}
