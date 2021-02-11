
import { Fragment, useState } from 'react'
import CustomContainer from '../components/CustomContainer'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import { Doughnut } from 'react-chartjs-2';

import StockInfoTable from '../components/StockInfoTable'
import TickerInput from '../components/TickerInput'
import LoadingSpinner from '../components/Loading/LoadingSpinner';
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
    setTableHeader([])
    setholdingInfoInfo([])
    setholdingInfoHeader([])
    setPieData({})
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
            placeholderText={"i.e. arkk"}
            handleChange={handleChange}
            clicked={clicked}
            clearItems={clearItems}
            tableHeader={tableHeader}
            tableData={stockInfo}
            exportFileName={'Stock_etfdetail.csv'}
          />
          <Tabs className="mt-4" defaultActiveKey="Basics" id="uncontrolled-tab-example">
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
              <StockInfoTable tableHeader={holdingInfoHeader} tableData={holdingInfoInfo} sortItem={sortItem} />
              <Doughnut data={pieData} />
            </Tab>
          </Tabs>
        </Fragment>
      </CustomContainer>
    </Fragment >
  )
}
