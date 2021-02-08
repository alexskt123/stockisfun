
import { Fragment, useState } from 'react'
import Container from 'react-bootstrap/Container'

import StockInfoTable from '../components/StockInfoTable'
import TickerInput from '../components/TickerInput'
const axios = require('axios').default

export default function Home() {

  const [tableHeader, setTableHeader] = useState([])
  const [stockInfo, setstockInfo] = useState([])
  const [officersHeader, setOfficersHeader] = useState([])
  const [officersInfo, setOfficersInfo] = useState([])


  const [validated, setValidated] = useState(false)
  const [formValue, setFormValue] = useState({})
  const [clicked, setClicked] = useState(false)

  const handleChange = (e) => {
    setFormValue({
      ...formValue,
      [e.target.name]: e.target.value
    })
  }

  const clearItems = async () => {
    setstockInfo([])
    setOfficersInfo([])
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
            (item.totalPay || {'longFmt': 'N/A'}).longFmt
          ]
          return itemArr
        })
      }
    })

    console.log(officers)


    setTableHeader(
      ["Basics", ""]
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
      <Container style={{ minHeight: '100vh', fontSize: '14px' }} className="mt-5 shadow-lg p-3 mb-5 bg-white rounded">
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
        <StockInfoTable tableHeader={tableHeader} tableData={stockInfo} />
        <StockInfoTable tableHeader={officersHeader} tableData={officersInfo} />
      </Container>
    </Fragment >
  )
}
