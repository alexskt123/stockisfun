
import { Fragment, useState, useEffect, useContext } from 'react'
import { useRouter } from 'next/router'
import Button from 'react-bootstrap/Button'
import moment from 'moment-business-days'
import millify from 'millify'

import CustomContainer from '../components/Layout/CustomContainer'
import TickerInput from '../components/Page/TickerInput'
import TickerBullet from '../components/Page/TickerBullet'
import LoadingSpinner from '../components/Loading/LoadingSpinner'
import { tableHeaderList } from '../config/watchlist'
import { sortTableItem, handleDebounceChange } from '../lib/commonFunction'
import { updUserWatchList, getUserInfoByUID } from '../lib/firebaseResult'
import { Store } from '../lib/store'
import { fireToast } from '../lib/toast'
import ModalQuestion from '../components/Parts/ModalQuestion'
import SearchAccordion from '../components/Page/SearchAccordion'
import Row from 'react-bootstrap/Row'

import SWRTable from '../components/Page/SWRTable'

const axios = require('axios').default

export default function WatchList() {

  const [tickers, setTickers] = useState([])
  const [tableHeader, setTableHeader] = useState([])
  const [watchList, setWatchList] = useState([])

  const [validated, setValidated] = useState(false)
  const [formValue, setFormValue] = useState({})
  const [clicked, setClicked] = useState(false)
  const [ascSort, setAscSort] = useState(false)

  const [showUpdate, setShowUpdate] = useState(false)
  const handleUpdateClose = () => setShowUpdate(false)

  const store = useContext(Store)
  const { state, dispatch } = store
  const { user } = state

  const router = useRouter()
  const { query } = router.query

  useEffect(() => {
    if (query) {
      setClicked(true)
      handleTickers(query)
      setClicked(false)
    } else if (tickers.length > 0) {
      handleTickers(tickers.join(','))
    }
  }, [query])

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

    router.replace('/watchlist')
  }

  const refreshItems = async () => {
    if (tickers.length > 0)
      handleTickers(tickers.join(','))
  }

  const handleDispatch = async () => {
    const { watchList } = await getUserInfoByUID(user == null ? '' : user.uid)

    const newUserConfig = {
      ...user,
      watchList
    }

    dispatch({ type: 'USER', payload: newUserConfig })
  }

  const updateWatchList = async () => {
    await updUserWatchList(user.uid, watchList.map(item => item.find(x => x)))
    await handleDispatch()

    fireToast({
      icon: 'success',
      title: 'Updated'
    })
  }

  const handleUpdate = async () => {
    handleUpdateClose()
    await updateWatchList()
  }

  const removeItem = async (value) => {
    if (clicked) return

    setTickers(
      [...tickers.filter(x => x !== value)]
    )
    setWatchList(
      [...watchList.filter(x => x.find(x => x) !== value)]
    )
  }

  async function handleTickers(inputTickersWithComma) {

    const newTickers = inputTickersWithComma.split(',').map(item => item.toUpperCase())
    const temp = []

    setTickers([...newTickers])

    return

    await axios.all([...newTickers].map(ticker => {
      return axios(`/api/yahoo/getYahooQuote?ticker=${ticker}`)
    }))
      .catch(error => { console.log(error) })
      .then(responses => {
        if (responses) {

          responses.forEach((response) => {
            if (response && response.data) {
              temp.push(tableHeaderList.map(header => {
                if (response.data[header.item])
                  return {
                    'label': header.label,
                    'item': header.format && header.format == '%' ? { style: 'green-red', data: `${response.data[header.item]?.toFixed(2)}%` }
                      : header.format && header.format == 'H:mm:ss' ? moment(response.data[header.item] * 1000).format('H:mm:ss')
                        : header.format && header.format == 'millify' ? millify(response.data[header.item] || 0)
                          : response.data[header.item]
                  }
              })
              )
            }
          })
        }
      })

    const newTemp = temp.every(itemArr => itemArr.filter(x => x != undefined).length == 6) ? temp :
      temp.filter(x => x.find(x => x) && x.find(x => x).label == 'Ticker').map(itemArr => {
        return itemArr.map((item, idx) => {
          return item == undefined ? { label: tableHeaderList[idx].label, item: 'N/A' } : item
        })
      })

    setTableHeader(
      [...(newTemp.find(x => x) || []).filter(x => x).map(item => item.label)]
    )

    setTickers([...newTickers])

    setWatchList(
      [...newTemp.map(item => {
        return item.filter(x => x).map(jj => jj.item)
      })]
    )

  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const form = event.currentTarget


    if (form.checkValidity() === false) {
      event.stopPropagation()
    } else {
      const { formTicker } = formValue
      await handleTickers(formTicker)
      router.replace('/watchlist', `/watchlist?query=${formTicker.toUpperCase()}`)
    }
    setValidated(true)
  }

  const modalQuestionSettings = {
    showCondition: showUpdate,
    onHide: handleUpdateClose,
    onClickYes: handleUpdate,
    onClickNo: handleUpdateClose,
    title: 'Update Watch List',
    body: 'Are you sure the update watch list?'
  }

  return (
    <Fragment>
      <CustomContainer style={{ minHeight: '100vh' }}>
        <Fragment>
          <SearchAccordion inputTicker={tickers.join(',')}>
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
          </SearchAccordion>
          {clicked ?
            <LoadingSpinner /> : null
          }
          <Row className="ml-1 mt-3">
            <Button onClick={() => { refreshItems() }} size='sm' variant='outline-dark' >{'Refresh'}</Button>
            {
              user.id != ''
                ? <Button className="ml-2" onClick={() => { setShowUpdate(true) }} size='sm' variant='dark' >{'Update Watch List'}</Button>
                : null
            }
          </Row>

          <SWRTable
            requests={tickers.map(x => ({ request: `/api/yahoo/getYahooQuote?ticker=${x}`, key: x }))}
            options={{ striped: true, tableHeader: tableHeaderList, tableSize: 'sm', SWROptions: { refreshInterval: 3000 } }}
          />

        </Fragment>
      </CustomContainer>
      <ModalQuestion {...modalQuestionSettings} />
    </Fragment >
  )
}
