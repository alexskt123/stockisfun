
import { Fragment, useState } from 'react'
import CustomContainer from '../components/CustomContainer'
import LoadingSpinner from '../components/Loading/LoadingSpinner'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'

import StockInfoTable from '../components/StockInfoTable'
import TickerInput from '../components/TickerInput'
import PriceInfo from '../components/PriceInfo'
const axios = require('axios').default

export default function Home() {

  const [tableHeader, setTableHeader] = useState([])
  const [stockInfo, setstockInfo] = useState([])
  const [officersHeader, setOfficersHeader] = useState([])
  const [officersInfo, setOfficersInfo] = useState([])
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
  }

  async function handleTicker(inputTicker) {
    if (!inputTicker) return

    let ticker = inputTicker.toUpperCase()

    let basics
    let officers = []
    let basicItem = []

    basics = await axios(`/api/getYahooAssetProfile?ticker=${ticker}`)

    Object.keys(basics.data).forEach(item => {
      if (item !== 'Company Officers') {
        basicItem.push([item, basics.data[item]])
      } else {
        officers = basics.data['Company Officers'].map(item => {
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

    setInputTickers([...inputTickers, ticker])

    setTableHeader(
      []
    )

    setstockInfo(
      [
        ...basicItem
      ]
    )

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
            <Tab eventKey="Price%" title="Price%">
              {clicked ?
                <LoadingSpinner /> : ''
              }
              <PriceInfo inputTickers={inputTickers} />
            </Tab>
          </Tabs>
        </Fragment>
      </CustomContainer>
    </Fragment >
  )
}
