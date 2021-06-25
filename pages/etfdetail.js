import { Fragment, useState, useEffect } from 'react'
import { useRouter } from 'next/router'

import CustomContainer from '../components/Layout/CustomContainer'
import SearchAccordion from '../components/Page/SearchAccordion'
import TypeAhead from '../components/Page/TypeAhead'
import ETFDetails from '../components/ETFDetails'

export default function ETFDetail() {
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
              placeholderText={'i.e. ARKK'}
              handleChange={handleChange}
              clearItems={clearItems}
              filter={'ETF'}
            />
          </SearchAccordion>
          <ETFDetails inputTicker={ticker} />
        </Fragment>
      </CustomContainer>
    </Fragment>
  )
}
