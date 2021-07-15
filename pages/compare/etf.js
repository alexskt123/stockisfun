import { Fragment, useState } from 'react'

import CustomContainer from '@/components/Layout/CustomContainer'
import SWRTable from '@/components/Page/SWRTable'
import TickerBullet from '@/components/Page/TickerBullet'
import TickerInput from '@/components/Page/TickerInput'
import { tableHeaderList } from '@/config/etf'
import { staticSWROptions } from '@/config/settings'
import { handleDebounceChange, handleFormSubmit } from '@/lib/commonFunction'
import { useQuery } from '@/lib/hooks/useQuery'
import { useRouter } from 'next/router'

export default function CompareETF() {
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
    setTickers(inputTickers)
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
            placeholderText={'Single:  voo /  Multiple:  voo,arkk,smh'}
            handleChange={handleChange}
            clearItems={clearItems}
          />
          <TickerBullet tickers={tickers} removeItem={removeItem} />
          {tickers?.length > 0 && (
            <SWRTable
              requests={tickers.map(x => ({
                request: `/api/compare/etf?ticker=${x}`,
                key: x
              }))}
              options={{
                bordered: true,
                tableHeader: tableHeaderList,
                exportFileName: 'Stock_etf.csv',
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
