
import { Fragment, useState } from 'react'
import { useRouter } from 'next/router'

import CustomContainer from '../../components/Layout/CustomContainer'
import TickerInput from '../../components/Page/TickerInput'
import TickerBullet from '../../components/Page/TickerBullet'
import LoadingSpinner from '../../components/Loading/LoadingSpinner'
import FinancialsInfo from '../../components/Parts/FinancialsInfo'
import { financialsSettingSchema, handleDebounceChange, concatCommaLists } from '../../lib/commonFunction'
import { useQuery } from '../../lib/hooks/useQuery'

export default function CompareFinancials() {
  const router = useRouter()
  const { query } = router.query

  const [settings, setSettings] = useState(financialsSettingSchema)
  const [validated, setValidated] = useState(false)
  const [formValue, setFormValue] = useState({})
  const [clicked, setClicked] = useState(false)

  const handleChange = (e) => {
    handleDebounceChange(e, formValue, setFormValue)
  }

  const clearItems = () => {
    setSettings({
      ...settings,
      tickers: [],
      stockInfo: []
    })
  }

  const removeItem = (value) => {
    setSettings(
      {
        ...settings,
        tickers: [...settings.tickers.filter(x => x !== value)],
        stockInfo: [...settings.stockInfo.filter(x => x.find(x => x) !== value)]
      }
    )
  }

  const handleTickers = (inputTickers) => {
    setClicked(true)

    setSettings({
      ...settings,
      tickers: inputTickers
    })

    setClicked(false)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const form = event.currentTarget

    if (form.checkValidity() === false) {
      event.stopPropagation()
    } else {
      const { formTicker } = formValue      
      const list = concatCommaLists([query, formTicker])
      router.push(`${router.pathname}?query=${list}`)
    }
    setValidated(true)
  }

  useQuery(handleTickers, query)

  return (
    <Fragment>
      <CustomContainer style={{ minHeight: '100vh' }}>
        <Fragment>
          <TickerInput
            validated={validated}
            handleSubmit={handleSubmit}
            placeholderText={'Single:  aapl /  Mulitple:  aapl,tdoc,fb,gh'}
            handleChange={handleChange}
            clicked={clicked}
            clearItems={clearItems}
            tableHeader={settings.tableHeader}
            tableData={settings.stockInfo}
            exportFileName={'Stock_financial.csv'}
          />
          <TickerBullet tickers={settings.tickers} removeItem={removeItem} />
          {clicked ?
            <LoadingSpinner /> : null
          }
          <FinancialsInfo inputTickers={settings.tickers} />
        </Fragment>
      </CustomContainer>
    </Fragment >
  )
}
