
import { Fragment, useState } from 'react'
import Container from 'react-bootstrap/Container'

import StockInfoTable from '../components/StockInfoTable'
import TickerInput from '../components/TickerInput'
const axios = require('axios').default

export default function Home() {

  const [tableHeader, setTableHeader] = useState([])
  const [stockInfo, setstockInfo] = useState([])
  const [holdingInfoHeader, setholdingInfoHeader] = useState([])
  const [holdingInfoInfo, setholdingInfoInfo] = useState([])


  const [validated, setValidated] = useState(false)
  const [formValue, setFormValue] = useState({})
  const [clicked, setClicked] = useState(false)

  const handleChange = (e) => {
    setFormValue({
      ...formValue,
      [e.target.name]: e.target.value
    })
  }

  const sortItem = async (index) => {
    
  }

  const clearItems = async () => {
    setstockInfo([])
    setholdingInfoInfo([])
  }

  async function handleTicker(inputTicker) {
    if (!inputTicker) return

    let ticker = inputTicker.toUpperCase()

    let etf
    let holdingInfo = []
    let etfInfo = []

    etf = await axios(`/api/getETFDB?ticker=${ticker}`)

    Object.keys(etf.data.basicInfo).forEach(item => {
      etfInfo.push([item, etf.data.basicInfo[item]])      
    })

    holdingInfo = [...etf.data.holdingInfo]

    setTableHeader(
      ["ETF Info", ""]
    )

    setstockInfo(
      [
        ...etfInfo
      ]
    )

    setholdingInfoHeader(
      ["Ticker", "Name", "% Holding"]
    )

    setholdingInfoInfo(
      [
        ...holdingInfo
      ]
    )

  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const form = event.currentTarget

    setClicked(true)

    if (form.checkValidity() === false) {
      event.stopPropagation()
    } else {

      const { formTicker } = formValue

      await handleTicker(formTicker)

    }
    setValidated(true)
    setClicked(false)
  }

  return (
    <Fragment>
      <Container style={{ minHeight: '100vh', fontSize: '14px' }} className="mt-5 shadow-lg p-3 mb-5 bg-white rounded">
        <TickerInput
          validated={validated}
          handleSubmit={handleSubmit}
          placeholderText={"i.e. arkk"}
          handleChange={handleChange}
          clicked={clicked}
          clearItems={clearItems}
          tableHeader={tableHeader}
          tableData={stockInfo}
          exportFileName={'Stock_etfdetail.csv'}
        />
        <StockInfoTable tableHeader={tableHeader} tableData={stockInfo} sortItem={sortItem} />
        <StockInfoTable tableHeader={holdingInfoHeader} tableData={holdingInfoInfo} sortItem={sortItem} />
      </Container>
    </Fragment >
  )
}
