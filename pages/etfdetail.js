import { Fragment } from 'react'

import ETFDetails from '@/components/ETFDetails'
import CustomContainer from '@/components/Layout/CustomContainer'
import SearchAccordion from '@/components/Page/SearchAccordion'
import TypeAhead from '@/components/Page/TypeAhead'
import { useQueryTicker } from '@/lib/hooks/page'
import { useRouter } from 'next/router'

export default function ETFDetail() {
  const router = useRouter()
  const { query } = router.query
  const ticker = useQueryTicker(query)

  const handleChange = e => {
    const input = e.find(x => x)
    input && router.push({ query: { ...router.query, query: input.symbol } })
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
