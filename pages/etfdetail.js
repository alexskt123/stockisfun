
import { Fragment, useState } from 'react'
import CustomContainer from '../components/CustomContainer'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import { Doughnut } from 'react-chartjs-2';

import StockInfoTable from '../components/StockInfoTable'
import TickerInput from '../components/TickerInput'
import LoadingSpinner from '../components/Loading/LoadingSpinner';
import { Alert, Button, Col, Row } from 'react-bootstrap';
import StockDetails from '../components/StockDetails';
const axios = require('axios').default

export default function Home() {

  const [tableHeader, setTableHeader] = useState([])
  const [stockInfo, setstockInfo] = useState([])
  const [holdingInfoHeader, setholdingInfoHeader] = useState([])
  const [holdingInfoInfo, setholdingInfoInfo] = useState([])
  const [pieData, setPieData] = useState({})


  const [validated, setValidated] = useState(false)
  const [formValue, setFormValue] = useState({})
  const [clicked, setClicked] = useState(false)
  const [priceHref, setPriceHref] = useState('/')
  const [forecastHref, setForecastHref] = useState('/')
  const [allowCheck, setAllowCheck] = useState(false)
  const [selectedTab, setSelectedTab] = useState('Basics')
  const [selectedStockTicker, setSelectedStockTicker] = useState('')

  const handleChange = (e) => {
    setFormValue({
      ...formValue,
      [e.target.name]: e.target.value
    })
  }

  const sortItem = async (index) => {

  }

  const cellClick = async (item) => {
    setSelectedTab('StockDetails')
    setSelectedStockTicker(item[0])
  }

  const clearItems = async () => {
    setstockInfo([])
    setTableHeader([])
    setholdingInfoInfo([])
    setholdingInfoHeader([])
    setPieData({})
    setSelectedStockTicker('')
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

    etfInfo.push(['Analyst Report', etf.data.analystReport])

    holdingInfo = [...etf.data.holdingInfo]


    const pieColors = holdingInfo.map(_item => {
      const r = Math.floor(Math.random() * 255) + 1
      const g = Math.floor(Math.random() * 255) + 1
      const b = Math.floor(Math.random() * 255) + 1

      const backgroundColor = (`rgba(${r}, ${g}, ${b}, 0.2)`)
      const borderColor = (`rgba(${r}, ${g}, ${b}, 1)`)
      return {
        backgroundColor,
        borderColor
      }
    })

    const pieData = {
      labels: [...holdingInfo.map(item => item.find(x => x))],
      datasets: [
        {
          label: '# of Holdings',
          data: [...holdingInfo.map(item => parseFloat(item[2].replace(/%/gi, '')))],
          backgroundColor: [...pieColors.map(item => {
            return item['backgroundColor']
          })],
          borderColor: [...pieColors.map(item => {
            return item['borderColor']
          })],
          borderWidth: 1
        },
      ],
    }

    setPieData(pieData)

    setTableHeader(
      ["Basics", ""]
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

    const href = holdingInfo.reduce((acc, cur) => {
      if (cur[0].length > 0 && cur[0] != 'Others')
        acc = `${acc},${cur[0]}`
      return acc
    }, '').replace(/(^,)|(,$)/g, "")

    if (href != '') setAllowCheck(true)

    setPriceHref(`/price?query=${href}`)
    setForecastHref(`/forecast?query=${href}`)

  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const form = event.currentTarget

    setClicked(true)
    setAllowCheck(false)

    if (form.checkValidity() === false) {
      event.stopPropagation()
    } else {

      const { formTicker } = formValue

      await handleTicker(formTicker)

    }
    setValidated(true)
    setClicked(false)
  }

  const handleSelect = (key) => {
    setSelectedTab(key);
  }

  return (
    <Fragment>
      <CustomContainer style={{ minHeight: '100vh', fontSize: '14px' }}>
        <Fragment>
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
          <Tabs variant="pills" className="mt-4" activeKey={selectedTab} onSelect={handleSelect} id="uncontrolled-tab-example">
            <Tab eventKey="Basics" title="Basics">
              {clicked ?
                <LoadingSpinner /> : ''
              }
              <StockInfoTable tableHeader={tableHeader} tableData={stockInfo} sortItem={sortItem} />
            </Tab>
            <Tab eventKey="Holdings" title="Holdings">
              {clicked ?
                <LoadingSpinner /> : ''
              }
              <Row className="mt-3 ml-1">
                <Button disabled={!allowCheck} target="_blank" href={priceHref} variant="dark">{'Check All Price%'}</Button>
                <Button disabled={!allowCheck} target="_blank" className="ml-2" href={forecastHref} variant="outline-dark">{'Check All Forecast'}</Button>
              </Row>
              <Row className="mt-3 ml-1">
                <Alert variant="warning">
                  {'Click the below row to get the stock details'}
                </Alert>
              </Row>
              <StockInfoTable tableHeader={holdingInfoHeader} tableData={holdingInfoInfo} sortItem={sortItem} cellClick={cellClick} />
              <Doughnut data={pieData} />
            </Tab>
            <Tab eventKey="StockDetails" title="Stock Details">
              <StockDetails inputTicker={selectedStockTicker} />
            </Tab>
          </Tabs>
        </Fragment>
      </CustomContainer>
    </Fragment >
  )
}
