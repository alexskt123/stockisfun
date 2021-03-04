
import { Fragment, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import { Alert, Badge, Button, Row } from 'react-bootstrap'
import { Doughnut } from 'react-chartjs-2'

import CustomContainer from '../components/Layout/CustomContainer'
import StockInfoTable from '../components/Page/StockInfoTable'
import TickerInput from '../components/Page/TickerInput'
import LoadingSpinner from '../components/Loading/LoadingSpinner'
import AddDelStock from '../components/Fire/AddDelStock'
import StockDetails from '../components/StockDetails'
import PriceChange from '../components/Parts/PriceChange'
import ForecastInfo from '../components/Parts/ForecastInfo'
import { etfDetailsSettings, etfHoldingHeader } from '../config/etf'
import Price from '../components/Parts/Price'
import { handleDebounceChange } from '../lib/commonFunction'

const axios = require('axios').default

export default function Home() {

  const [validated, setValidated] = useState(false)
  const [formValue, setFormValue] = useState({})
  const [clicked, setClicked] = useState(false)
  const [allowCheck, setAllowCheck] = useState(false)
  const [showAlert, setShowAlert] = useState(false)

  const [settings, setSettings] = useState({ ...etfDetailsSettings })

  const handleChange = (e) => {
    handleDebounceChange(e, formValue, setFormValue)
  }

  const sortItem = async (_index) => {

  }

  const cellClick = async (item) => {
    setSettings({
      ...settings,
      selectedTab: 'StockDetails',
      selectedStockTicker: item.find(x => x),
      disableSelectedStockTab: false,
      selectedStockTitle: item.find(x => x)
    })
  }

  const clearItems = async () => {
    setSettings({ ...etfDetailsSettings })
    router.replace('/etfdetail')
  }

  async function handleTicker(inputTicker) {
    if (!inputTicker) return

    setClicked(true)

    const ticker = inputTicker.toUpperCase()

    let holdingInfo = []
    const etfInfo = []
    const etf = await axios(`/api/etfdb/getETFDB?ticker=${ticker}`)

    Object.keys(etf.data.basicInfo).forEach(item => {
      etfInfo.push([item, etf.data.basicInfo[item]])
    })

    etfInfo.push(['Analyst Report', etf.data.analystReport])

    holdingInfo = [...etf.data.holdingInfo]

    await axios.all([...etf.data.holdingInfo].map(item => {
      return axios.get(`/api/yahoo/getYahooHistoryPrice?ticker=${item.find(x => x)}&year=3`).catch(err => console.log(err))
    }))
      .catch(error => console.log(error))
      .then((responses) => {
        if (responses) {
          holdingInfo = [...etf.data.holdingInfo].map((item, index) => {
            return item.concat(responses[index].data.data.map(item => {
              return {
                style: 'green-red',
                data: item
              }
            }))
          })
          //console.log(responses.map(response => response.data.data))
        }
      })


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


    const href = holdingInfo.reduce((acc, cur) => {
      if (cur[0].length > 0 && cur[0] != 'Others')
        acc = `${acc},${cur[0]}`
      return acc
    }, '').replace(/(^,)|(,$)/g, '')

    if (href != '') setAllowCheck(true)


    const newSettings = {
      basics: {
        tableHeader: [],
        tableData: [...etfInfo]
      },
      holding: {
        tableHeader: [...etfHoldingHeader],
        tableData: [...holdingInfo]
      },
      pieData: pieData,
      inputETFTicker: [ticker],
      selectedStockTicker: '',
      priceHref: `/compare/price?query=${href}`,
      forecastHref: `/compare/forecast?query=${href}`
    }

    router.replace('/etfdetail', `/etfdetail?query=${ticker.toUpperCase()}`)
    setSettings(newSettings)
    setClicked(false)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const form = event.currentTarget

    setAllowCheck(false)

    if (form.checkValidity() === false) {
      event.stopPropagation()
    } else {

      const { formTicker } = formValue

      await handleTicker(formTicker)

    }
    setValidated(true)
  }

  const handleSelect = (key) => {
    setSettings({
      ...settings,
      selectedTab: key
    })
  }

  const router = useRouter()
  const { query } = router.query

  useEffect(() => {
    if (query) {
      handleTicker(query)
    }
  }, [query])

  return (
    <Fragment>
      <CustomContainer style={{ minHeight: '100vh', fontSize: '14px' }}>
        <Fragment>
          <TickerInput
            validated={validated}
            handleSubmit={handleSubmit}
            placeholderText={'i.e. arkk'}
            handleChange={handleChange}
            clicked={clicked}
            clearItems={clearItems}
            tableHeader={undefined}
            tableData={undefined}
            exportFileName={undefined}
          />
          {
            settings.inputETFTicker.length > 0 ?
              <Alert variant='success' className="mt-3">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <b>{settings.inputETFTicker}</b>
                  <AddDelStock inputTicker={settings.inputETFTicker.find(x => x)} handleList='etf' />
                </div>
              </Alert>
              : null
          }
          <Tabs style={{ fontSize: '11px' }} variant="pills" className="mt-1" activeKey={settings.selectedTab} onSelect={handleSelect} id="uncontrolled-tab-example">
            <Tab eventKey="Basics" title="Basics">
              {clicked ?
                <LoadingSpinner /> : null
              }
              {
                settings.basics.tableData.filter(x => x.find(x => x) == 'Price').find(x => x)
                  ? <Fragment>
                    <StockInfoTable tableSize="sm" tableHeader={settings.basics.tableHeader} tableData={settings.basics.tableData} sortItem={sortItem} />
                    <Price inputTicker={settings.inputETFTicker.find(x => x)} inputDays={90} />
                  </Fragment>
                  : <Alert className="mt-2" key={'Alert-No-Stock-Info'} variant={'success'}>
                    {'Please enter a valid sticker!'}
                  </Alert>
              }
            </Tab>
            <Tab eventKey="Holdings" title="Holdings">
              {clicked ?
                <LoadingSpinner /> : null
              }
              <Row className="mt-3 ml-1">
                {!showAlert && <Button size="sm" variant="warning" onClick={() => setShowAlert(true)}>{'Details?'}</Button>}
                <Button size="sm" disabled={!allowCheck} target="_blank" className="ml-2" href={settings.priceHref} variant="dark">{'All Price%'}</Button>
                <Button size="sm" disabled={!allowCheck} target="_blank" className="ml-2" href={settings.forecastHref} variant="outline-dark">{'All Forecast'}</Button>
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
              <StockInfoTable tableSize="sm" tableHeader={settings.holding.tableHeader} tableData={settings.holding.tableData} sortItem={sortItem} cellClick={cellClick} />
              <Doughnut data={settings.pieData} />
            </Tab>
            <Tab eventKey="Statistics" title="Stat.">
              {clicked ?
                <LoadingSpinner /> : null
              }
              <Row className="ml-1">
                <h5>
                  <Badge variant="dark">{'Forecast'}</Badge>
                </h5>
              </Row>
              <ForecastInfo inputTickers={settings.inputETFTicker} />
              <Row className="ml-1">
                <h5>
                  <Badge variant="dark">{'Price%'}</Badge>
                </h5>
              </Row>
              <PriceChange inputTickers={settings.inputETFTicker} />
            </Tab>
            <Tab eventKey="StockDetails" title={settings.selectedStockTitle} disabled={settings.disableSelectedStockTab}>
              <StockDetails inputTicker={settings.selectedStockTicker} />
            </Tab>
          </Tabs>
        </Fragment>
      </CustomContainer>
    </Fragment >
  )
}
