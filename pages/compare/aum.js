import { Fragment, useState } from 'react'

import CustomContainer from '@/components/Layout/CustomContainer'
import SWRTable from '@/components/Page/SWRTable'
import TickerBullet from '@/components/Page/TickerBullet'
import TickerInput from '@/components/Page/TickerInput'
import { aumTableHeader } from '@/config/etf'
import { staticSWROptions } from '@/config/settings'
import { handleDebounceChange, handleFormSubmit } from '@/lib/commonFunction'
import { useQuery } from '@/lib/hooks/useQuery'
import { useRouter } from 'next/router'

export default function CompareAUM() {
  const router = useRouter()
  const { query } = router.query

  const [tickers, setTickers] = useState([])

  const [validated, setValidated] = useState(false)
  const [formValue, setFormValue] = useState({})

  const handleChange = e => {
    handleDebounceChange(e, formValue, setFormValue)
  }

  const clearItems = () => {
    setTickers([])
    router.push(router.pathname)
  }

  const removeItem = value => {
    const removed = [...tickers.filter(x => x !== value)]
    setTickers(removed)
    router.push(`${router.pathname}?query=${removed.join(',')}`)
  }

  async function handleTickers(inputTickers) {
    setTickers([...inputTickers])
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
            placeholderText={'Single:  aapl /  Mulitple:  tsm,gh'}
            handleChange={handleChange}
            clearItems={clearItems}
          />
          <TickerBullet tickers={tickers} removeItem={removeItem} />
          {tickers?.length > 0 && (
            <SWRTable
              requests={tickers.map(x => ({
                request: `/api/compare/aum?ticker=${x}`,
                key: x
              }))}
              options={{
                bordered: true,
                tableHeader: aumTableHeader,
                exportFileName: 'Stock_aum_sum.csv',
                tableSize: 'sm',
                SWROptions: staticSWROptions
              }}
            />
          )}
        </Fragment>
      </CustomContainer>
    </Fragment>
  )
}
