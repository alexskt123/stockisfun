
import { Fragment, useEffect, useState } from 'react'
import CustomContainer from '../components/Layout/CustomContainer'
import TickerCard from '../components/Parts/TickerCard'
import { extractYahooInfo } from '../config/highlight'
import roundTo from 'round-to'
import ScrollMenu from 'react-horizontal-scrolling-menu'
import { AiFillLeftCircle, AiFillRightCircle } from 'react-icons/ai'
import '../styles/ScrollMenu.module.css'
import Price from '../components/Parts/Price'

const axios = require('axios').default

export default function Highlight() {
  const [stockIndexInfo, setStockIndexInfo] = useState([])
  const [selectedTicker, setSelectedTicker] = useState(null)

  const stockIndex = [{ Ticker: '^DJI', Name: 'Dow Jones' }, { Ticker: '^GSPC', Name: 'S&P 500' }, { Ticker: '^IXIC', Name: 'NASDAQ' }, { Ticker: 'AAPL', Name: 'APLLE' }, { Ticker: 'TSLA', Name: 'Tesla' }, { Ticker: 'TSM', Name: 'TSM' }, { Ticker: 'AMZN', Name: 'Amazon' }, { Ticker: 'AMZN', Name: 'Amazon' }, { Ticker: 'AMZN', Name: 'Amazon' }]
  //const stockIndex = [{ Ticker: '^DJI', Name: 'Dow Jones' }, { Ticker: '^GSPC', Name: 'S&P 500' }, { Ticker: '^IXIC', Name: 'NASDAQ' }, { Ticker: 'AAPL', Name: 'APLLE' }, { Ticker: 'TSLA', Name: 'Tesla' }]
  const stockIndexAdd = [...stockIndex]

  async function getStockIndexInfo() {
    await axios.all([...stockIndex].map(item => {
      return axios(`/api/yahoo/getYahooQuote?ticker=${item.Ticker}`)
    }))
      .catch(error => { console.log(error) })
      .then(responses => {
        if (responses) {
          responses.forEach((response) => {
            if (response && response.data) {
              extractYahooInfo.forEach(info => {
                const curData = stockIndexAdd.find(x => x.Ticker === response.data.symbol)
                if (curData)
                  curData[info.label] = typeof response.data[info.field] === 'number' ? roundTo(response.data[info.field], 2) : response.data[info.field]
              })
            }
          })
        }
      })

    setStockIndexInfo(stockIndexAdd)
  }

  const onSelect = (key) => {
    setSelectedTicker(stockIndex[key].Ticker)
  }

  useEffect(async () => {
    await getStockIndexInfo()
  }, [])

  return (
    <Fragment>
      <CustomContainer style={{ minHeight: '100vh', fontSize: '14px' }}>
        <Fragment>
          <ScrollMenu
            data={stockIndexInfo.map((item, idx) => {
              return <div key={idx} className="menu-item"><TickerCard {...item} /></div>
            })}
            arrowLeft={<AiFillLeftCircle />}
            arrowRight={<AiFillRightCircle />}
            menuClass="justify-content-center"
            onSelect={onSelect}
          />
          {/* <CardDeck>
            {
              stockIndexInfo.map((item, idx) => {
                return <TickerCard key={idx} {...item} />
              })
            }
          </CardDeck> */}
          {selectedTicker ? <Price inputTicker={selectedTicker} /> : null}
        </Fragment>
      </CustomContainer>
    </Fragment >
  )
}
