
import { Fragment, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import CustomContainer from '../components/Layout/CustomContainer'

import StockInfoTable from '../components/Page/StockInfoTable'
import TickerInput from '../components/Page/TickerInput'
import TickerBullet from '../components/Page/TickerBullet'
import { sortTableItem, handleDebounceChange } from '../lib/commonFunction'
import LoadingSpinner from '../components/Loading/LoadingSpinner'
import moment from 'moment-business-days'
import {tableHeaderList} from '../config/watchlist'
import millify from 'millify'
import { Button } from 'react-bootstrap'

const axios = require('axios').default

export default function Home() {

  const [tickers, setTickers] = useState([])
  const [tableHeader, setTableHeader] = useState([])
  const [watchList, setWatchList] = useState([])

  const [validated, setValidated] = useState(false)
  const [formValue, setFormValue] = useState({})
  const [clicked, setClicked] = useState(false)
  const [ascSort, setAscSort] = useState(false)


  const handleChange = (e) => {
    handleDebounceChange(e, formValue, setFormValue)
  }


  const sortItem = async (index) => {
    setAscSort(!ascSort)
    setWatchList(
      await sortTableItem(watchList, index, ascSort)
    )
  }

  const clearItems = async () => {
    setTickers([])
    setWatchList([])
  }

  const refreshItems = async () => {
    handleTickers(tickers.join(','))
  }

  const removeItem = async (value) => {
    if (clicked) return

    setTickers(
      [...tickers.filter(x => x !== value)]
    )
    setWatchList(
      [
        ...watchList.filter(x => x.find(x => x) !== value)
      ]
    )
  }

  async function handleTickers(inputTickersWithComma) {

    setClicked(true)

    const newTickers = inputTickersWithComma.split(',').map(item => item.toUpperCase())
    const temp = []

    await axios.all([...newTickers].map(ticker => {
      return axios(`/api/getYahooQuote?ticker=${ticker}`)
    }))
      .catch(error => { console.log(error) })
      .then(responses => {
        if (responses) {

          responses.forEach((response, index) => {
            if (response && response.data) {
              temp.push(
                {
                  'Ticker': newTickers[index],
                  'Pre Time': moment(response.data.preMarketTime * 1000).format('H:mm:ss'),
                  'Pre Market': response.data.preMarketPrice,
                  'Pre Market%': `${response.data.preMarketChangePercent?.toFixed(2)}%`,
                  'Market': response.data.regularMarketPrice,
                  'Market%': `${response.data.regularMarketChangePercent?.toFixed(2)}%`,
                  'Volume': millify(response.data.regularMarketVolume || 0),
                  'Day Range': response.data.regularMarketDayRange,
                  'Previous Close': response.data.regularMarketPreviousClose
                }
              )
            }
          })
        }
      })

    setTableHeader(
      [
        ...tableHeaderList.map(item => item.label)
      ]
    )

    setTickers([
      ...newTickers
    ])

    setWatchList(
      [
        ...temp.map(item => {
          const newItem = [
            ...Object.values(item)
          ]
          return newItem
        })
      ]
    )

    setClicked(false)

  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const form = event.currentTarget


    if (form.checkValidity() === false) {
      event.stopPropagation()
    } else {

      const { formTicker } = formValue
      await handleTickers(formTicker)

    }
    setValidated(true)
  }

  const router = useRouter()
  const { query } = router.query

  useEffect(() => {
    if (query) {
      handleTickers(query)
    }

  }, [query])

  return (
    <Fragment>
      <CustomContainer style={{ minHeight: '100vh' }}>
        <Fragment>
          <TickerInput
            validated={validated}
            handleSubmit={handleSubmit}
            placeholderText={'Single:  voo /  Mulitple:  voo,arkk,smh'}
            handleChange={handleChange}
            clicked={clicked}
            clearItems={clearItems}
            tableHeader={tableHeader}
            tableData={watchList}
            exportFileName={'Stock_watch_list.csv'}
          />
          <TickerBullet tickers={tickers} overlayItem={[]} removeItem={removeItem} />
          {clicked ?
            <LoadingSpinner /> : ''
          }
          <Button onClick={() => { refreshItems() }} size='sm' variant='outline-dark' >{'Refresh'}</Button>
          <StockInfoTable tableHeader={tableHeader} tableData={watchList} sortItem={sortItem} />
        </Fragment>
      </CustomContainer>
    </Fragment >
  )
}
