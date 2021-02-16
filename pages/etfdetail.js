
import { Fragment, useState } from 'react'
import CustomContainer from '../components/CustomContainer'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import { Doughnut } from 'react-chartjs-2';

import StockInfoTable from '../components/StockInfoTable'
import TickerInput from '../components/TickerInput'
import LoadingSpinner from '../components/Loading/LoadingSpinner';
import { Alert, Badge, Button, Col, Row } from 'react-bootstrap';
import StockDetails from '../components/StockDetails';
import PriceInfo from '../components/PriceInfo';
import ForecastInfo from '../components/ForecastInfo';
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
  const [inputETFTicker, setInputETFTicker] = useState([])
  const [showAlert, setShowAlert] = useState(false)

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
    setInputETFTicker([])
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
    setInputETFTicker([ticker])

    setPieData(pieData)

    setstockInfo(
      [...etfInfo]
    )

    setholdingInfoHeader(
      ["Ticker", "Name", "Holding"]
    )

    setholdingInfoInfo(
      [...holdingInfo]
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
            tableHeader={undefined}
            tableData={undefined}
            exportFileName={undefined}
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
              {!showAlert && <Button size="sm" variant="warning" onClick={() => setShowAlert(true)}>{'Details?'}</Button>}
                <Button size="sm" disabled={!allowCheck} target="_blank" className="ml-2" href={priceHref} variant="dark">{'All Price%'}</Button>
                <Button size="sm" disabled={!allowCheck} target="_blank" className="ml-2" href={forecastHref} variant="outline-dark">{'All Forecast'}</Button>
              </Row>
              <Row className="mt-1 ml-1">
                <Alert show={showAlert} variant="warning">
                  <Alert.Heading>{'How to get Stock Details?'}</Alert.Heading>
                  <p>
                    {'Click the below table row to get!'}
                  </p>
                  <div className="d-flex justify-content-end">
                    <Button onClick={() => setShowAlert(false)} variant="outline-success">
                      {'Close!'}
                    </Button>
                  </div>
                </Alert>
              </Row>
              <StockInfoTable tableHeader={holdingInfoHeader} tableData={holdingInfoInfo} sortItem={sortItem} cellClick={cellClick} />
              <Doughnut data={pieData} />
            </Tab>
            <Tab eventKey="Statistics" title="Stat.">
              {clicked ?
                <LoadingSpinner /> : ''
              }
              <Row className="ml-1">
                <h5>
                  <Badge variant="dark">{'Forecast'}</Badge>
                </h5>
              </Row>
              <ForecastInfo inputTickers={inputETFTicker} />
              <Row className="ml-1">
                <h5>
                  <Badge variant="dark">{'Price%'}</Badge>
                </h5>
              </Row>
              <PriceInfo inputTickers={inputETFTicker} />
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
