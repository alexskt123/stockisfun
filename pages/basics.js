
import { Fragment, useState } from 'react'
import CustomContainer from '../components/CustomContainer'
import LoadingSpinner from '../components/Loading/LoadingSpinner'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'

import StockInfoTable from '../components/StockInfoTable'
import TickerInput from '../components/TickerInput'
import PriceInfo from '../components/PriceInfo'
import ForecastInfo from '../components/ForecastInfo'
import FinancialsInfo from '../components/FinancialsInfo'
const axios = require('axios').default

export default function Home() {

  const [tableHeader, setTableHeader] = useState([])
  const [stockInfo, setstockInfo] = useState([])
  const [officersHeader, setOfficersHeader] = useState([])
  const [officersInfo, setOfficersInfo] = useState([])
  const [balanceHeader, setBalanceHeader] = useState([])
  const [balanceInfo, setBalanceInfo] = useState([])
  const [inputTickers, setInputTickers] = useState([])


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
    setOfficersInfo([])
    setTableHeader([])
    setOfficersHeader([])
    setInputTickers([])
    setBalanceInfo([])
    setBalanceHeader([])
  }

  async function handleTicker(inputTicker) {
    if (!inputTicker) return

    let ticker = inputTicker.toUpperCase()

    let basics
    let officers = []
    let basicItem = []
    let balanceSheetItem = []
    let balanceSheetHeader = []

    basics = await axios(`/api/getYahooAssetProfile?ticker=${ticker}`)
    const basicsData = basics.data.basics
    const balanceSheetData = basics.data.balanceSheet

    Object.keys(basicsData).forEach(item => {
      if (item !== 'Company Officers') {
        basicItem.push([item, basicsData[item]])
      } else {
        officers = basicsData['Company Officers'].map(item => {
          const itemArr = [
            item.name,
            item.title,
            item.age || 'N/A',
            (item.totalPay || { 'longFmt': 'N/A' }).longFmt
          ]
          return itemArr
        })
      }
    })

    Object.keys((balanceSheetData.find(x => x) || {})).forEach(item => {
      if (item !== 'Date') {
        const curItem = []
        balanceSheetData.forEach(data => {
          curItem.push(data[item])
        })

        balanceSheetItem.push([item, ...curItem])
      }
    })

    balanceSheetHeader.push('')
    balanceSheetData.forEach(item => {
      balanceSheetHeader.push(item['Date'])
    })


    setInputTickers([ticker])

    setTableHeader(
      []
    )

    setstockInfo(
      [
        ...basicItem
      ]
    )

    setBalanceInfo([...balanceSheetItem])
    setBalanceHeader([...balanceSheetHeader])

    setOfficersHeader(
      ["Officers Name", "Title", "Age", "Pay"]
    )

    setOfficersInfo(
      [
        ...officers
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
      <CustomContainer style={{ minHeight: '100vh', fontSize: '14px' }}>
        <Fragment>
          <TickerInput
            validated={validated}
            handleSubmit={handleSubmit}
            placeholderText={"i.e. appl"}
            handleChange={handleChange}
            clicked={clicked}
            clearItems={clearItems}
            tableHeader={tableHeader}
            tableData={stockInfo}
            exportFileName={'Stock_basics.csv'}
          />
          <Tabs className="mt-4" defaultActiveKey="Basics" id="uncontrolled-tab-example">
            <Tab eventKey="Basics" title="Basics">
              {clicked ?
                <LoadingSpinner /> : ''
              }
              <StockInfoTable tableHeader={tableHeader} tableData={stockInfo} sortItem={sortItem} />
            </Tab>
            <Tab eventKey="Officers" title="Officers">
              {clicked ?
                <LoadingSpinner /> : ''
              }
              <StockInfoTable tableHeader={officersHeader} tableData={officersInfo} sortItem={sortItem} />
            </Tab>
            <Tab eventKey="BalanceSheet" title="Balance Sheet">
              {clicked ?
                <LoadingSpinner /> : ''
              }
              <StockInfoTable tableHeader={balanceHeader} tableData={balanceInfo} sortItem={sortItem} />
            </Tab>
            <Tab eventKey="Price%" title="Price%">
              {clicked ?
                <LoadingSpinner /> : ''
              }
              <PriceInfo inputTickers={inputTickers} />
            </Tab>
            <Tab eventKey="Forecast" title="Forecast">
              <ForecastInfo inputTickers={inputTickers} />
            </Tab>
            <Tab eventKey="Financials" title="Financials">
              <FinancialsInfo inputTickers={inputTickers} />
            </Tab>
          </Tabs>
        </Fragment>
      </CustomContainer>
    </Fragment >
  )
}
